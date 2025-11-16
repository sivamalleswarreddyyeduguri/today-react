// import EntityList from '../shared/EntityList';


// const PlantList = () => (
//   <EntityList
//     title="Plant Details"
//     fetchUrl="http://localhost:8020/api/v1/plant/get-all"
//     deleteUrl="http://localhost:8020/api/v1/plant/delete"
//     editUrl="/edit-plant"
//     reactivateUrl="http://localhost:8020/api/v1/plant/edit"
//     entityKey="plantId"
//     entityName="Plant"
//     columns={[
//       { key: 'plantName', label: 'Plant Name' },
//       { key: 'state', label: 'State' },
//       { key: 'city', label: 'City' }
//     ]}
//   />
// );

// export default PlantList;

import React, { useState } from 'react';
import EntityList from '../shared/EntityList';
import Modal from '../shared/Modal';
import AddPlant from './AddPlant';
import EditPlant from './EditPlant';
import '../../styles/vendor.css'; // reusing dark form + button styles

const PlantList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editId, setEditId] = useState(null);

  const handleAdded = () => {
    setShowAddForm(false);
    setRefreshKey((k) => k + 1); // refresh the list
  };

  const handleUpdated = () => {
    setEditId(null);
    setRefreshKey((k) => k + 1); // refresh the list
  };

  return (
    <div className="vendor-list-container">{/* reuse same container styles */}
      <div className="vendor-actions-header">
        <h2>Plant Details</h2>
        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
          Add Plant
        </button>
      </div>

      <EntityList
        key={refreshKey}
        title="Plant List"
        fetchUrl="http://localhost:8020/api/v1/plant/get-all"
        deleteUrl="http://localhost:8020/api/v1/plant/delete"
        editUrl="/edit-plant"             // keeps navigation for other pages; overridden by onEdit here
        onEdit={(id) => setEditId(id)}    // <-- open modal
        reactivateUrl="http://localhost:8020/api/v1/plant/edit"
        entityKey="plantId"
        entityName="Plant"
        columns={[
          { key: 'plantName', label: 'Plant Name' },
          { key: 'state', label: 'State' },
          { key: 'city', label: 'City' }
        ]}
      />

      {/* Add Plant modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Plant" width={540}>
        <AddPlant onAdded={handleAdded} />
      </Modal>

      {/* Edit Plant modal */}
      <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Edit Plant" width={540}>
        <EditPlant id={editId} onUpdated={handleUpdated} />
      </Modal>
    </div>
  );
};

export default PlantList;