import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseData(table, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orderBy = 'created_at', ascending = false, limit = null, select = '*' } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from(table).select(select).order(orderBy, { ascending });
        if (limit) query = query.limit(limit);
        const { data: result, error: err } = await query;
        if (err) throw err;
        setData(result || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, orderBy, ascending, limit, select]);

  return { data, loading, error };
}

export default useSupabaseData;