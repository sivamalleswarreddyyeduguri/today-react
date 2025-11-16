import React, { useState } from 'react';
import EntityList from '../shared/EntityList';
import AddVendor from './AddVendor';
import EditVendor from './EditVendor';  
import Modal from '../shared/Modal';
import '../../styles/vendor.css';

const VendorList = () => {
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
        <h2>Vendor Details</h2>
        <button className="add-vendor-button" onClick={() => setShowAddForm(true)}>
          Add Vendor
        </button>
      </div>

      <EntityList
        key={refreshKey}
        fetchUrl="http://localhost:8020/api/v1/vendor/all"
        deleteUrl="http://localhost:8020/api/v1/vendor/delete"
        editUrl="/edit-vendor"            // keep for other lists; overridden by onEdit here
        onEdit={(id) => setEditId(id)}    // <-- This opens the modal
        reactivateUrl="http://localhost:8020/api/v1/vendor/edit"
        entityKey="vendorId"
        entityName="Vendor"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'phoneNumber', label: 'Phone Number' },
          { key: 'email', label: 'Email' },
          { key: 'state', label: 'State' },
          { key: 'city', label: 'City' }
        ]}
      />

      {/* Add Vendor modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Vendor" width={540}>
        <AddVendor onAdded={handleAdded} />
      </Modal>

      {/* Edit Vendor modal */}
      <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Edit Vendor" width={540}>
        {/* Ensure your EditVendor component accepts `id` as a prop and does not use useParams */}
        <EditVendor id={editId} onUpdated={handleUpdated} />
      </Modal>
    </div>
  );
};

export default VendorList;