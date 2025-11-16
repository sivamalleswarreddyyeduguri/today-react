    // // src/components/vendor/EditVendorModal.jsx
    // import React from 'react';
    // import Modal from '../shared/Modal';
    // import EntityEditForm from '../shared/EntityEditForm';

    // const EditVendorModal = ({ isOpen, onClose, id, onUpdated }) => {
    //   if (!isOpen || !id) return null;

    //   const handleSuccess = () => {
    //     onUpdated?.();   // refresh list in parent
    //     onClose?.();     // close modal
    //   };

    //   return (
    //     <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor" width={540}>
    //       <EntityEditForm
    //         title="Edit Vendor"
    //         fetchUrl={`http://localhost:8020/api/v1/vendor/${id}`}
    //         updateUrl={"http://localhost:8020/api/v1/vendor/edit"}
    //         redirectUrl={null}
    //         fields={[
    //           { name: 'name', label: 'Vendor Name', type: 'text' },
    //           { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    //           { name: 'email', label: 'Email', type: 'email' },
    //           { name: 'state', label: 'State', type: 'text' },
    //           { name: 'city', label: 'City', type: 'text' },
    //         ]}
    //         entityKey="vendorId"
    //         onSuccess={handleSuccess}  
    //       />
    //     </Modal>
    //   );
    // };

    // export default EditVendorModal;