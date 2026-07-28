import { useState, useEffect } from 'react';
import { MockDB, DatabaseSchema } from '../services/MockDB';

export function useDB() {
  const [db, setDb] = useState<DatabaseSchema>(MockDB.get());

  useEffect(() => {
    const handleUpdate = () => {
      // MockDB updates collections optimistically. Give React a new top-level
      // reference so operational screens immediately render the changed data.
      setDb({ ...MockDB.get() });
    };
    window.addEventListener('db_updated', handleUpdate);
    return () => window.removeEventListener('db_updated', handleUpdate);
  }, []);

  return db;
}

export function useCollection<T extends keyof DatabaseSchema>(collection: T) {
  const db = useDB();
  return db[collection] as DatabaseSchema[T];
}
