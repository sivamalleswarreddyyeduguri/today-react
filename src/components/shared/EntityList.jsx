import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/shared/EntityList.css';
import CharacteristicsList from '../MaterialInspectionCharacteristics/CharacteristicsList';
import InspectionActualsList from '../InspectionActuals/InspectionActualsList';
import axiosInstance from './axiosInstance';
import { FaEye, FaDownload } from 'react-icons/fa';
const EntityList = ({
  title,
  fetchUrl,
  deleteUrl,
  editUrl,
  onEdit,
  reactivateUrl,
  columns,
  entityKey,
  entityName,
  queryParam = null,
  inline = false,
  onAddActuals,
  data,
  entitiesPerPage = 3,
  characteristicsPerPage = 5,
}) => {
  const [entities, setEntities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [characteristicsPageByMaterial, setCharacteristicsPageByMaterial] = useState({});
  const [characteristicsTotals, setCharacteristicsTotals] = useState({});

  // Search Results → View Actuals
  const [lotIdForDetails, setLotIdForDetails] = useState(null);



  const [showGraph, setShowGraph] = useState(false);
  const [activeLotId, setActiveLotId] = useState(null);


  const navigate = useNavigate();
  const location = useLocation();

  const isMaterial = (name) => name === 'Material';
  const isCharacteristic = (name) => name === 'Characteristic';
  const isInspectionLot = (name) => name === 'Inspection Lot';

  const showStatusColumn = useMemo(() => {
    // Hide status for Characteristic and Inspection Lot
    return !(isCharacteristic(entityName) || isInspectionLot(entityName));
  }, [entityName]);

  const buildFetchUrl = () => {
    if (queryParam?.key && queryParam?.value) {
      const sep = fetchUrl.includes('?') ? '&' : '?';
      return `${fetchUrl}${sep}${encodeURIComponent(queryParam.key)}=${encodeURIComponent(
        queryParam.value
      )}`;
    }
    return fetchUrl;
  };

  const fetchEntities = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.dismiss();
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      navigate('/login');
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    try {
      const url = buildFetchUrl();
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      const list = response?.data?.data ?? response?.data ?? [];
      setEntities(Array.isArray(list) ? list : []);
    } catch (error) {
      if (error.name !== 'CanceledError' && error.message !== 'canceled') {
        const msg =
          error?.response?.data?.errorMessage ||
          error?.response?.data?.message ||
          `Failed to fetch ${entityName}s`;
        toast.dismiss();
        toast.error(msg, { position: 'top-center' });
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  // Prefer `data` prop (search results). Fallback to API fetch.
  useEffect(() => {
    let abortFn;

    if (data && Array.isArray(data)) {
      setEntities(data);
      setLoading(false);
    } else if (fetchUrl) {
      (async () => {
        abortFn = await fetchEntities();
      })();
    } else {
      setEntities([]);
      setLoading(false);
    }

    return () => {
      if (typeof abortFn === 'function') abortFn();
    };
  }, [data, fetchUrl, queryParam?.key, queryParam?.value]);

  // Reset pagination and expansion when dataset changes
  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);

    setCharacteristicsPageByMaterial({});
    setCharacteristicsTotals({});
  }, [entities]);

  // Collapse expanded row when page changes
  useEffect(() => {
    setExpandedId(null);
  }, [currentPage]);


  // ✅ Download PDF logic
  const handleDownloadLotReport = async (lotId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8020/api/v1/inspection/lot/${lotId}/report/pdf`,
        { responseType: 'blob' } // Important for binary data
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `InspectionReport_${lotId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download PDF report');
      console.error(error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entityName}?`)) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.delete(`${deleteUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response?.data?.statusMsg || `${entityName} deleted successfully!`, {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        if (!data) {
          fetchEntities();
        } else {
          setEntities((prev) => prev.filter((e) => e[entityKey] !== id));
        }
      }, 1600);
    } catch (error) {
      const msg =
        error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        `Failed to delete ${entityName}`;
      toast.error(msg, { position: 'top-center' });
    }
  };

  // Reactivate
  const handleReactivate = async (entity) => {
    const token = localStorage.getItem('token');
    try {
      const updatedEntity = { ...entity, status: true };
      const response = await axiosInstance.put(reactivateUrl, updatedEntity, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(response?.data?.statusMsg || `${entityName} reactivated successfully!`, {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        if (!data) {
          fetchEntities();
        } else {
          setEntities((prev) =>
            prev.map((e) =>
              e[entityKey] === entity[entityKey] ? { ...e, status: true } : e
            )
          );
        }
      }, 1600);
    } catch (error) {
      const msg =
        error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        `Failed to reactivate ${entityName}`;
      toast.error(msg, { position: 'top-center' });
    }
  };

  // Upload PDF for Inspection Lot (Search Results actions)
  const handleUploadLotReport = async (lotId) => {
    try {
      const token = localStorage.getItem('token');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf,.pdf';

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const formData = new FormData();
        // Adjust the field name if your backend expects a different key
        formData.append('file', file);

        try {
          await axiosInstance.post(`/api/v1/inspection/lot/${lotId}/report/pdf`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let the browser set the correct multipart boundary
              // 'Content-Type': 'multipart/form-data'
            },
          });

          toast.success(`Report uploaded for Lot ${lotId}`, {
            position: 'top-center',
            autoClose: 2000,
          });
        } catch (uploadError) {
          const msg =
            uploadError?.response?.data?.errorMessage ||
            uploadError?.response?.data?.message ||
            'Failed to upload PDF report';
          toast.error(msg, { position: 'top-center' });
          // eslint-disable-next-line no-console
          console.error(uploadError);
        }
      };

      input.click();
    } catch (error) {
      toast.error('Unable to start upload. Please try again.', { position: 'top-center' });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const indexOfLast = currentPage * entitiesPerPage;
  const indexOfFirst = indexOfLast - entitiesPerPage;

  const currentEntities = useMemo(
    () => entities.slice(indexOfFirst, indexOfLast),
    [entities, indexOfFirst, indexOfLast]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(entities.length / entitiesPerPage)),
    [entities.length, entitiesPerPage]
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));

    // Initialize inline characteristics page to 1 when expanding a row
    setCharacteristicsPageByMaterial((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: 1 };
    });
  };

  const setCharacteristicsPage = (materialId, page) => {
    setCharacteristicsPageByMaterial((prev) => ({
      ...prev,
      [materialId]: page,
    }));
  };

  const setCharacteristicsTotal = (materialId, total) => {
    setCharacteristicsTotals((prev) => ({
      ...prev,
      [materialId]: total,
    }));
  };

  const renderCell = (col, entity) => {
    if (typeof col.render === 'function') {
      return col.render(entity);
    }
    return entity?.[col.key];
  };

  const entityNamePlural = `${entityName}s`;

  // 🔎 Search Results → switch to Lot Actuals view when a lot is selected
  if (title === 'Search Results' && lotIdForDetails) {
    return (
      <div className="entity-list-container">
        <h2>Lot Actuals & Characteristics</h2>
        <InspectionActualsList lotId={lotIdForDetails} inline={false} />
        <button
          type="button"
          className="back-button"
          onClick={() => setLotIdForDetails(null)}
        >
          Back to Search Results
        </button>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className={`entity-list-container ${inline ? 'inline-mode' : ''}`}>
      {!inline && <h2>{title}</h2>}

      {loading ? (
        <p>Loading {entityNamePlural}...</p>
      ) : (
        <>
        <div>
          <table className={`entity-table ${inline ? 'nested' : ''}`}  style={{ width: '100%' }} >
            <thead >
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {!inline && showStatusColumn && entityName !== 'Inspection Actual' && <th>Status</th>}

                {/* <th>Actions</th> */}
                {entityName !== 'Inspection Actual' && <th>Actions</th>}
              </tr>
            </thead>

            <tbody >
              {currentEntities.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showStatusColumn && !inline ? 2 : 1)}
                    className="empty-state"
                  >
                    No {entityNamePlural} found.
                  </td>
                </tr>
              ) : (
                currentEntities.map((entity, idx) => {
                  const id = entity?.[entityKey];
                  const rowKey = id ?? `${entityName}-${currentPage}-${idx}`;
                  const isMat = isMaterial(entityName);
                  const isChar = isCharacteristic(entityName);
                  const isLot = isInspectionLot(entityName);
                  const expanded = expandedId === id;

                  const charPage = characteristicsPageByMaterial[id] ?? 1;
                  const charTotal = characteristicsTotals[id] ?? 0;
                  const charTotalPages = Math.max(
                    1,
                    Math.ceil(charTotal / characteristicsPerPage)
                  );

                  return (
                    <React.Fragment key={rowKey} className="d-flex justify-content-between">
                      <tr
                        className={isMat && !inline ? 'clickable-row' : ''}
                        onClick={
                          isMat && !inline ? () => toggleExpand(id) : undefined
                        }
                        aria-expanded={isMat && !inline ? expanded : undefined}
                      >
                        {columns.map((col) => (
                          <td key={col.key}>{renderCell(col, entity)}</td>
                        ))}


                        {showStatusColumn && entityName !== 'Inspection Actual' && (
                          <td>{entity?.status ? 'Active' : 'Inactive'}</td>
                        )}


                        <td>
                          {/* 🔎 Search Results: show View Actuals + Upload PDF actions */}
                          {title === 'Search Results' ? (
                            <>
                              <div className='d-flex'>
                                <button title="View Details" onClick={() => setLotIdForDetails(id)} className="icon-button">
                                  <FaEye />
                                </button>
                                <button title="Download Report" onClick={() => handleDownloadLotReport(id)} className="icon-button">
                                  <FaDownload />
                                </button>
                              </div>

                            </>
                          ) : isLot ? (
                            // Default actions when NOT in Search Results
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit ? onEdit(id) : navigate(`${editUrl}/${id}`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (typeof onAddActuals === 'function') {
                                    onAddActuals(id, entity);
                                  }
                                }}
                              >
                                Add Inspection Actuals
                              </button>


                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/materials/graph/${id}`);
                                }}
                                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm inline-flex items-center gap-2"
                                title="View Graph"
                              >
                                <FaEye /> View Graph
                              </button>


                            </>
                          ) : isChar ? (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit ? onEdit(id) : navigate(`${editUrl}/${id}`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(id);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              {entity?.status ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit ? onEdit(id) : navigate(`${editUrl}/${id}`);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(id);
                                    }}
                                  >
                                    Delete
                                  </button>

                                  {isMat && !inline && (
                                    <button
                                      type="button"
                                      title="View Characteristics"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(id);
                                      }}
                                    >
                                      View Characteristics
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>{title === 'Search Results' && lotIdForDetails ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReactivate(entity);
                                    }}
                                    disabled={!reactivateUrl}
                                    title={
                                      reactivateUrl
                                        ? 'Reactivate this entity'
                                        : 'Reactivate URL not configured'
                                    }
                                  >
                                    Reactivate
                                  </button>
                                ) : (
                                  <></>
                                )}</>


                              )}
                            </>
                          )}
                        </td>
                      </tr>

                      {/* Inline expanded Characteristics for Materials */}
                      {isMat && expanded && !inline && (
                        <tr className="expanded-row">
                          {/* colSpan = columns + status(optional) + actions(1) */}
                          <td colSpan={columns.length + (showStatusColumn ? 2 : 1)}>
                            <div className="inline-detailschar">
                              {/* Controlled pagination props to CharacteristicsList */}
                              <CharacteristicsList
                                materialId={id}
                                inline
                                page={charPage}
                                pageSize={characteristicsPerPage}
                                onPageChange={(p) => setCharacteristicsPage(id, p)}
                                onTotalChange={(total) => setCharacteristicsTotal(id, total)}
                              />

                              {/* Inline pagination controls for characteristics */}
                              {charTotal > 0 && charTotalPages > 1 && (
                                <div className="pagination characteristics-pagination">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCharacteristicsPage(id, Math.max(1, charPage - 1))
                                    }
                                    disabled={charPage === 1}
                                  >
                                    ◀ Prev
                                  </button>

                                  {Array.from(
                                    { length: charTotalPages },
                                    (_, i) => i + 1
                                  ).map((p) => (
                                    <button
                                      key={`char-page-${id}-${p}`}
                                      type="button"
                                      className={charPage === p ? 'active' : ''}
                                      onClick={() => setCharacteristicsPage(id, p)}
                                    >
                                      {p}
                                    </button>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCharacteristicsPage(
                                        id,
                                        Math.min(charTotalPages, charPage + 1)
                                      )
                                    }
                                    disabled={charPage === charTotalPages}
                                  >
                                    Next ▶
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
          {!inline && totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ◀ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default EntityList;