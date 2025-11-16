import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EntityList from '../shared/EntityList';
import '../../styles/vendor.css';

const InspectionActualsList = ({ lotId: lotIdProp, inline = false }) => {
  const { lotId: lotIdFromRoute } = useParams();
  const lotId = lotIdProp ?? lotIdFromRoute;

  const [refreshKey, setRefreshKey] = useState(0);

  if (!lotId) {
    return <div style={{ color: '#cbd5e1' }}>Lot ID is missing.</div>;
  }

  return (
    <div className={inline ? 'inline-actuals' : 'page-actuals'}>
      {/* {!inline && <h3>Inspection Actuals & Characteristics</h3>} */}

      <EntityList
        key={refreshKey}
        title=""
        fetchUrl="http://localhost:8020/api/v1/inspection/lot/actu"
        queryParam={{ key: 'id', value: lotId }}
        deleteUrl=""
        reactivateUrl=""
        entityKey="characteristicId"
        entityName="Inspection Actual"
        columns={[
          { key: 'characteristicId', label: 'Characteristic ID' },
          { key: 'characteristicDesc', label: 'Description' },
          { key: 'unitOfMeasure', label: 'Unit' },
          { key: 'upperToleranceLimit', label: 'Upper Tolerance Limit' },
          { key: 'lowerToleranceLimit', label: 'Lower Tolerance Limit' },
          { key: 'actualUtl', label: 'Actual UTL' },
          { key: 'actualLtl', label: 'Actual LTL' }
        ]}
        inline={inline}
      />
    </div>
  );
};

export default InspectionActualsList;
