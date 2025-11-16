// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import EntityList from '../shared/EntityList';
// import Modal from '../shared/Modal';
// import AddInspectionLot from './AddInspectionLot';
// import '../../styles/vendor.css';
// import AddInspectionActuals from '../InspectionActuals/AddInspectionActuals';
// import axiosInstance from '../shared/axiosInstance';
// import SearchForm from './SearchForm';
// import EditInspectionLot from './EditInspectionLot';

// const InspectionLotList = () => {
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showSearchForm, setShowSearchForm] = useState(false);
//   const [showActualsForm, setShowActualsForm] = useState(false);
//   const [selectedLot, setSelectedLot] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [editId, setEditId] = useState(null);
//   const [searchResults, setSearchResults] = useState(null);

//   const location = useLocation();

//   useEffect(() => {
//     setSearchResults(null);
//   }, [location.pathname]);

//   const handleAdded = () => {
//     setShowAddForm(false);
//     setRefreshKey(k => k + 1);
//   };

//   const handleActualsAdded = () => {
//     setShowActualsForm(false);
//     setSelectedLot(null);
//     setRefreshKey(k => k + 1);
//   };

//   const handleAddActuals = (lotId, entity) => {
//     setSelectedLot({ lotId, entity });
//     setShowActualsForm(true);
//   };

//     const handleUpdated = () => {
//     setEditId(null);
//     setRefreshKey((k) => k + 1);
//   };

//   const handleSearch = async (criteria) => {
//     try {
//       const response = await axiosInstance.post('http://localhost:8020/api/v1/inspection/lot/search', criteria);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Search failed:', error);
//     }
//   };

//   return (
//     <div className="vendor-list-container">
//       <div className="vendor-actions-header">
//         <h2>Inspection Lots</h2>
//         <button className="add-vendor-button" onClick={() => setShowSearchForm(true)}>
//           Search
//         </button>
//         <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
//           Add Inspection Lot
//         </button>
//       </div>

//       <EntityList
//         key={refreshKey}
//         title={searchResults ? "Search Results" : "Inspection Lot List"}
//         data={searchResults || undefined}
//         fetchUrl={searchResults ? null : "http://localhost:8020/api/v1/inspection/lots"}
//         deleteUrl="http://localhost:8020/api/v1/inspection-lot/delete"
//         editUrl="/edit-inspection-lot"
//         onEdit={(id) => setEditId(id)}
//         reactivateUrl="http://localhost:8020/api/v1/inspection-lot/edit"
//         entityKey="lotId"
//         entityName="Inspection Lot"
//         onAddActuals={handleAddActuals}
//         columns={
//           searchResults
//             ? [
//                 { key: 'lotId', label: 'Lot ID' },
//                 { key: 'createdOn', label: 'Created On' },
//                 { key: 'startOn', label: 'Start Date' },
//                 { key: 'endOn', label: 'End Date' },
//                 { key: 'result', label: 'Result' },
//                 { key: 'material', label: 'MaterialDesc' },
//                  { key: 'plant', label: 'PLANTNAME' },
//                  { key: 'vendor', label: 'VENDORNAME'},
//                 { key: 'inspectedBy', label: 'Inspected By' }
//               ]
//             : [
//                 { key: 'lotId', label: 'Lot ID' },
//                 { key: 'creationDate', label: 'Created On' },
//                 { key: 'inspectionStartDate', label: 'Start Date' },
//                 { key: 'inspectionEndDate', label: 'End Date' },
//                 { key: 'result', label: 'Result' },
//                 { key: 'remarks', label: 'Remarks' },
//                 { key: 'userName', label: 'Username' }
//               ]
//         }
//       />

//       {/* Add Lot Modal */}
//       <Modal
//         isOpen={showAddForm}
//         onClose={() => setShowAddForm(false)}
//         title="Add Inspection Lot"
//         width={600}
//       >
//         <AddInspectionLot onAdded={handleAdded} />
//       </Modal>

//       {/* Search Modal */}
//       <Modal
//         isOpen={showSearchForm}
//         onClose={() => setShowSearchForm(false)}
//         title="Search Inspection Lots"
//         width={600}
//       >
//         <SearchForm onSearch={handleSearch} onClose={() => setShowSearchForm(false)} />
//       </Modal>

//       {/* Add Actuals Modal */}
//       <Modal
//         isOpen={showActualsForm}
//         onClose={() => setShowActualsForm(false)}
//         title={`Add Actuals for Lot ${selectedLot?.lotId}`}
//         width={600}
//       >
//         <AddInspectionActuals
//           lotId={selectedLot?.lotId}
//           onAdded={handleActualsAdded}
//         />
//       </Modal>
//       {/* Edit Material modal */}
//       <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Edit Material" width={540}>
//         <EditInspectionLot id={editId} onUpdated={handleUpdated} />
//       </Modal>
//     </div>
//   );
// };

// export default InspectionLotList;

// src/components/InspectionLot/InspectionLotList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EntityList from '../shared/EntityList';
import Modal from '../shared/Modal';
import AddInspectionLot from './AddInspectionLot';
import '../../styles/vendor.css';
import AddInspectionActuals from '../InspectionActuals/AddInspectionActuals';
import axiosInstance from '../shared/axiosInstance';
import SearchForm from './SearchForm';
import EditInspectionLot from './EditInspectionLot';
import LotStatusDashboard from './LotStatusDashboard';

// NEW
// import LotStatusDashboard from './LotStatusDashboard';

const InspectionLotList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showActualsForm, setShowActualsForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editId, setEditId] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const location = useLocation();

  useEffect(() => {
    setSearchResults(null);
  }, [location.pathname]);

  const handleAdded = () => {
    setShowAddForm(false);
    setRefreshKey(k => k + 1);
  };

  const handleActualsAdded = () => {
    setShowActualsForm(false);
    setSelectedLot(null);
    setRefreshKey(k => k + 1);
  };

  const handleAddActuals = (lotId, entity) => {
    setSelectedLot({ lotId, entity });
    setShowActualsForm(true);
  };

  const handleUpdated = () => {
    setEditId(null);
    setRefreshKey((k) => k + 1);
  };

  const handleSearch = async (criteria) => {
    try {
      const response = await axiosInstance.post('http://localhost:8020/api/v1/inspection/lot/search', criteria);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="vendor-list-container">
      {/* TOP STATUS DASHBOARD */}
      <LotStatusDashboard/>

      <div className="vendor-actions-header">
        <h2>Inspection Lots</h2>
        <button className="add-vendor-button" onClick={() => setShowSearchForm(true)}>
          Search
        </button>
        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
          Add Inspection Lot
        </button>
      </div>

      <EntityList
        key={refreshKey}
        title={searchResults ? "Search Results" : "Inspection Lot List"}
        data={searchResults || undefined}
        fetchUrl={searchResults ? null : "http://localhost:8020/api/v1/inspection/get-all-lots"}
        deleteUrl="http://localhost:8020/api/v1/inspection-lot/delete"
        editUrl="/edit-inspection-lot"
        onEdit={(id) => setEditId(id)}
        reactivateUrl="http://localhost:8020/api/v1/inspection-lot/edit"
        entityKey="lotId"
        entityName="Inspection Lot"
        onAddActuals={handleAddActuals}
        columns={
          searchResults
            ? [
                { key: 'lotId', label: 'Lot ID' },
                { key: 'createdOn', label: 'Created On' },
                { key: 'startOn', label: 'Start Date' },
                { key: 'endOn', label: 'End Date' },
                { key: 'result', label: 'Result' },
                { key: 'material', label: 'MaterialDesc' },
                { key: 'plant', label: 'PLANTNAME' },
                { key: 'vendor', label: 'VENDORNAME'},
                { key: 'inspectedBy', label: 'Inspected By' }
              ]
            : [
                { key: 'lotId', label: 'Lot ID' },
                { key: 'creationDate', label: 'Created On' },
                { key: 'inspectionStartDate', label: 'Start Date' },
                { key: 'inspectionEndDate', label: 'End Date' },
                { key: 'result', label: 'Result' },
                { key: 'remarks', label: 'Remarks' },
                { key: 'userName', label: 'Username' }
              ]
        }
      />

      {/* Add Lot Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Inspection Lot"
        width={600}
      >
        <AddInspectionLot onAdded={handleAdded} />
      </Modal>

      {/* Search Modal */}
      <Modal
        isOpen={showSearchForm}
        onClose={() => setShowSearchForm(false)}
        title="Search Inspection Lots"
        width={600}
      >
        <SearchForm onSearch={handleSearch} onClose={() => setShowSearchForm(false)} />
      </Modal>

      {/* Add Actuals Modal */}
      <Modal
        isOpen={showActualsForm}
        onClose={() => setShowActualsForm(false)}
        title={`Add Actuals for Lot ${selectedLot?.lotId}`}
        width={600}
      >
        <AddInspectionActuals
          lotId={selectedLot?.lotId}
          onAdded={handleActualsAdded}
        />
      </Modal>

      {/* Edit Material modal */}
      <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Edit Material" width={540}>
        <EditInspectionLot id={editId} onUpdated={handleUpdated} />
      </Modal>
    </div>
  );
};

export default InspectionLotList;
