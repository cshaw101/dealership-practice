import supabase from './supabase';

export const fetchCars = async () => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*');

    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }

    console.log('Fetched cars:', data);  // This should log the car data if fetched correctly
    return data;
  } catch (err) {
    console.error('Error in fetchCars function:', err);
    return [];
  }
};


// Fetch a car by ID
export const fetchCarById = async (id) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id) // Get a car by its ID
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    return null;
  }

  return data;
};
