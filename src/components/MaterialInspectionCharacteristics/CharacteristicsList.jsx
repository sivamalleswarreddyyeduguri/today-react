// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import EntityList from '../shared/EntityList';
// import AddMaterialCharacteristics from './AddMaterialCharacteristics';
// import Modal from '../shared/Modal';

// /**
//  * CharacteristicsList supports two modes:
//  * - Route mode: renders as a page, reading `materialId` from useParams().
//  * - Inline mode: renders compact under a material row, accept `materialId` via prop and set `inline={true}`.
//  */
// const CharacteristicsList = ({ materialId: materialIdProp, inline = false }) => {
//   const { materialId: materialIdFromRoute } = useParams();
//   const materialId = materialIdProp ?? materialIdFromRoute;

// const [showAddForm, setShowAddForm] = useState(false);

//   // const handleAdded = () => {
//   //   setShowAddForm(false);
//   // };

//   // Prevent backend call with undefined id
//   if (!materialId) {
//     return (
//       <div style={{ color: '#cbd5e1' }}>
//         Material ID is missing. Please open from a material row or via the route with an ID.
//       </div>
//     );
//   }

//   return (
//     <div className={inline ? 'inline-characteristics' : 'page-characteristics'}>
//       {!inline && <h3>Material Characteristics</h3>}
//       <div className='act-btn'>
//        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
//           Add Material Characteristics
//         </button>
//       </div>
//       <EntityList
//         title={inline ? '' : 'Material Characteristics'}
//         fetchUrl="http://localhost:8020/api/v1/material/view/char"
//         queryParam={{ key: 'materialId', value: materialId }}
//         deleteUrl=""                  // Not used here; keep empty or wire if needed
//         editUrl="edit-characteristics"
//         reactivateUrl=""              // Not applicable for characteristics listing
//         entityKey="characteristicId"
//         entityName="Characteristic"
//         columns={[
//           { key: 'characteristicDescription', label: 'Description' },
//           { key: 'upperToleranceLimit', label: 'Upper Tolerance Limit' },
//           { key: 'lowerToleranceLimit', label: 'Lower Tolerance Limit' },
//           { key: 'unitOfMeasure', label: 'Unit of Measurement' }
//         ]}
//         inline={inline}               // <-- tells EntityList to hide header/pagination in inline mode
//       />

//       <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Material Characteristics" width={540}>
//         <AddMaterialCharacteristics materialId={materialId}/>
//       </Modal>


//     </div>
//   );
// };

// export default CharacteristicsList;

// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import EntityList from '../shared/EntityList';
// import AddMaterialCharacteristics from './AddMaterialCharacteristics';
// import Modal from '../shared/Modal';

// /**
//  * CharacteristicsList supports two modes:
//  * - Route mode: renders as a page, reading `materialId` from useParams().
//  * - Inline mode: renders compact under a material row, accept `materialId` via prop and set `inline={true}`.
//  */
// const CharacteristicsList = ({ materialId: materialIdProp, inline = false }) => {
//   const { materialId: materialIdFromRoute } = useParams();
//   const materialId = materialIdProp ?? materialIdFromRoute;

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleAdded = () => {
//     setShowAddForm(false);          // close modal
//     setRefreshKey((k) => k + 1);    // 🔁 force EntityList to remount & refetch
//   };

//   // Prevent backend call with undefined id
//   if (!materialId) {
//     return (
//       <div style={{ color: '#cbd5e1' }}>
//         Material ID is missing. Please open from a material row or via the route with an ID.
//       </div>
//     );
//   }

//   return (
//     <div className={inline ? 'inline-characteristics' : 'page-characteristics'}>
//       {!inline && <h3>Material Characteristics</h3>}

//       <div className="act-btn">
//         <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
//           Add Material Characteristics
//         </button>
//       </div>

//       <EntityList
//         key={refreshKey}  // 🔑 remounts on change -> refetch
//         title={inline ? '' : 'Material Characteristics'}
//         fetchUrl="http://localhost:8020/api/v1/material/view/char"
//         queryParam={{ key: 'materialId', value: materialId }}
//         deleteUrl=""                  // wire if you add delete later
//         editUrl="edit-characteristics"
//         reactivateUrl=""              // not applicable here
//         entityKey="characteristicId"
//         entityName="Characteristic"
//         columns={[
//           { key: 'characteristicDescription', label: 'Description' },
//           { key: 'upperToleranceLimit', label: 'Upper Tolerance Limit' },
//           { key: 'lowerToleranceLimit', label: 'Lower Tolerance Limit' },
//           { key: 'unitOfMeasure', label: 'Unit of Measurement' }
//         ]}
//         inline={inline}               // hide header/pagination if inline
//       />

//       <Modal
//         isOpen={showAddForm}
//         onClose={() => setShowAddForm(false)}
//         title="Add Material Characteristics"
//         width={540}
//       >
//         <AddMaterialCharacteristics
//           materialId={materialId}
//           onAdded={handleAdded}      // ✅ close + refresh
//         />
//       </Modal>
//     </div>
//   );
// };

// export default CharacteristicsList;

// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import EntityList from '../shared/EntityList';
// import EditCharacteristics from './EditCharacteristics';
// import AddMaterialCharacteristics from './AddMaterialCharacteristics';
// import Modal from '../shared/Modal';

// const CharacteristicsList = ({ materialId: materialIdProp, inline = false }) => {
//   const { materialId: materialIdFromRoute } = useParams();
//   const materialId = materialIdProp ?? materialIdFromRoute;

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editCharId, setEditCharId] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleAdded = () => {
//     setShowAddForm(false);
//     setRefreshKey(k => k + 1);
//   };

//   const handleUpdated = () => {
//     setEditCharId(null);
//     setRefreshKey(k => k + 1);
//   };

//   if (!materialId) {
//     return <div style={{ color: '#cbd5e1' }}>Material ID is missing.</div>;
//   }

//   return (
//     <div className={inline ? 'inline-characteristics' : 'page-characteristics'}>
//       {!inline && <h3>Material Characteristics</h3>}

//       <div className="act-btn">
//         <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
//           Add Material Characteristics
//         </button>
//         <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
//           Upload Characteristics
//         </button>
//       </div>

//       <EntityList
//         key={refreshKey}
//         title={inline ? '' : 'Material Characteristics'}
//         fetchUrl="http://localhost:8020/api/v1/material/view/char"
//         queryParam={{ key: 'materialId', value: materialId }}
//         deleteUrl=""
//         // ❌ Remove editUrl OR leave it but ensure EntityList uses onEdit when provided
//         // editUrl="/edit-characteristics"
//         onEdit={(charId) => setEditCharId(charId)}   // ✅ open modal with id
//         reactivateUrl=""
//         entityKey="characteristicId"
//         entityName="Characteristic"
//         columns={[
//           { key: 'characteristicDescription', label: 'Description' },
//           { key: 'upperToleranceLimit', label: 'Upper Tolerance Limit' },
//           { key: 'lowerToleranceLimit', label: 'Lower Tolerance Limit' },
//           { key: 'unitOfMeasure', label: 'Unit of Measurement' }
//         ]}
//         inline={inline}
//       />

//       {/* Add modal */}
//       <Modal
//         isOpen={showAddForm}
//         onClose={() => setShowAddForm(false)}
//         title="Add Material Characteristics"
//         width={540}
//       >
//         <AddMaterialCharacteristics materialId={materialId} onAdded={handleAdded} />
//       </Modal>

//       {/* Edit modal */}
//       <Modal
//         isOpen={!!editCharId}
//         onClose={() => setEditCharId(null)}
//         title="Edit Material Characteristic"
//         width={540}
//       >
//         <EditCharacteristics id={editCharId} onUpdated={handleUpdated} />
//       </Modal>
//     </div>
//   );
// };

// export default CharacteristicsList;

import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import EntityList from '../shared/EntityList';
import EditCharacteristics from './EditCharacteristics';
import AddMaterialCharacteristics from './AddMaterialCharacteristics';
import Modal from '../shared/Modal';
import axiosInstance from '../shared/axiosInstance'; // NEW
import { toast, ToastContainer } from 'react-toastify'; // NEW
import 'react-toastify/dist/ReactToastify.css'; // NEW

const CharacteristicsList = ({ materialId: materialIdProp, inline = false }) => {
  const { materialId: materialIdFromRoute } = useParams();
  const materialId = materialIdProp ?? materialIdFromRoute;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editCharId, setEditCharId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // NEW: Upload state + input ref
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAdded = () => {
    setShowAddForm(false);
    setRefreshKey(k => k + 1);
  };

  const handleUpdated = () => {
    setEditCharId(null);
    setRefreshKey(k => k + 1);
  };

  // NEW: Trigger hidden file input
  const triggerFilePicker = () => {
    if (!materialId) {
      toast.error('Material ID is missing');
      return;
    }
    fileInputRef.current?.click();
  };

  // NEW: Handle file selection + upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate extension if needed
    // const allowed = ['.csv', '.xlsx', '.xls'];
    // ...

    const formData = new FormData();
    formData.append('file', file);

    // If your backend also needs materialId, change the controller to accept
    // @RequestParam Long materialId and then uncomment next line:
    // formData.append('materialId', materialId);

    try {
      setUploading(true);
      const res = await axiosInstance.post('http://localhost:8020/api/v1/material/char/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(
        res?.data?.statusMsg || 'Characteristics uploaded successfully',
        { position: 'top-center', autoClose: 1500 }
      );

      // Refresh the list
      setRefreshKey(k => k + 1);
    } catch (err) {
      const msg =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        'Upload failed';
      toast.error(msg, { position: 'top-center' });
    } finally {
      setUploading(false);
      // Clear the input so selecting the same file again still triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!materialId) {
    return <div style={{ color: '#cbd5e1' }}>Material ID is missing.</div>;
  }

  return (
    <div className={inline ? 'inline-characteristics' : 'page-characteristics'}>
      {!inline && <h3>Material Characteristics</h3>}
      <div className="act-btn">
        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
          Add Material Characteristics
        </button>

        {/* NEW: Upload button with icon */}
        <button
          className="add-vendor-button"
          onClick={triggerFilePicker}
          disabled={uploading}
          title="Upload Characteristics"
        >
          {/* Inline SVG upload icon (you can swap with 📤 if you want) */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ verticalAlign: 'middle' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {uploading ? 'Uploading...' : 'Upload Characteristics'}
          </span>
        </button>

        {/* NEW: Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          // Optional: restrict types. Adjust if your service expects CSV/XLSX
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>

      <EntityList
        key={refreshKey}
        title={inline ? '' : 'Material Characteristics'}
        fetchUrl="http://localhost:8020/api/v1/material/view/char"
        queryParam={{ key: 'materialId', value: materialId }}
        deleteUrl="http://localhost:8020/api/v1/material/delete/char"
        onEdit={(charId) => setEditCharId(charId)}
        reactivateUrl=""
        entityKey="characteristicId"
        entityName="Characteristic"
        columns={[
          { key: 'characteristicDescription', label: 'Description' },
          { key: 'upperToleranceLimit', label: 'Upper Tolerance Limit' },
          { key: 'lowerToleranceLimit', label: 'Lower Tolerance Limit' },
          { key: 'unitOfMeasure', label: 'Unit of Measurement' }
        ]}
        // inline={inline}
      />

      {/* Add modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Material Characteristics"
        width={540}
      >
        <AddMaterialCharacteristics materialId={materialId} onAdded={handleAdded} />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editCharId}
        onClose={() => setEditCharId(null)}
        title="Edit Material Characteristic"
        width={540}
      >
        <EditCharacteristics id={editCharId} onUpdated={handleUpdated} />
      </Modal>

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
};

export default CharacteristicsList;