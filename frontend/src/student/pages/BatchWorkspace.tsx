import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useActiveBatch } from '../contexts/ActiveBatchContext';

/** Retains old bookmarks while routing students into the single sidebar experience. */
export default function BatchWorkspace() {
  const { batchId } = useParams();
  const { setActiveBatchId } = useActiveBatch();

  useEffect(() => {
    if (batchId) setActiveBatchId(batchId);
  }, [batchId, setActiveBatchId]);

  return <Navigate to="/student/dashboard" replace />;
}
