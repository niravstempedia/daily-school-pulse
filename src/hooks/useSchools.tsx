
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface School {
  id: string;
  name: string;
  location: string;
  total_students: number;
  grades: string;
  logo: string;
  color: string;
  description: string;
}

export function useSchools() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSchools();
    } else {
      setSchools([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSchools = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          location,
          total_students,
          grades,
          logo,
          color,
          description
        `);

      if (error) {
        console.error('Error fetching schools:', error);
        return;
      }

      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  return { schools, loading, refetch: fetchSchools };
}
