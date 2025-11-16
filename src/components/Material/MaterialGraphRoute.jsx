import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MaterialGraph from './MaterialGraph';
// import MaterialGraph from '../components/MaterialGraph/MaterialGraph';

export default function MaterialGraphRoute() {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const numericLotId = Number(lotId);

  return (
    <div className="p-4">
      <MaterialGraph
        lotId={numericLotId}
        onClose={() => navigate(-1)} // go back to previous page
      />
    </div>
  );
}