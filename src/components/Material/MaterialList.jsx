import React, { useState } from 'react';
import EntityList from '../shared/EntityList';
import Modal from '../shared/Modal';
import AddMaterial from './AddMaterial';
import EditMaterial from './EditMaterial';
import '../../styles/vendor.css'; 

const MaterialList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editId, setEditId] = useState(null);

  const handleAdded = () => {
    setShowAddForm(false);
    setRefreshKey((k) => k + 1); 
  };

  const handleUpdated = () => {
    setEditId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="vendor-list-container">
      <div className="vendor-actions-header">
        <h2>Material Details</h2>
        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
          Add Material
        </button>
      </div>

      <EntityList
        key={refreshKey}
        // title="Material List"
        fetchUrl="http://localhost:8020/api/v1/material/get-all"
        deleteUrl="http://localhost:8020/api/v1/material/delete"
        editUrl="/edit-material"             // keeps navigation for other pages; overridden by onEdit here
        onEdit={(id) => setEditId(id)}       // <-- open modal
        reactivateUrl="http://localhost:8020/api/v1/material/edit"
        entityKey="materialId"
        entityName="Material"
        columns={[
          { key: 'materialId', label: 'Material ID' },
          { key: 'materialDesc', label: 'Description' },
          { key: 'type', label: 'Type' }
        ]}
      />

      {/* Add Material modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Material" width={540}>
        <AddMaterial onAdded={handleAdded} />
      </Modal>

      {/* Edit Material modal */}
      <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Edit Material" width={540}>
        <EditMaterial id={editId} onUpdated={handleUpdated} />
      </Modal>
    </div>
  );
};

export default MaterialList;