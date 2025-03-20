// api/carsApi.js
export const fetchCars = async () => {
    const response = await fetch('http://localhost:5001/api/cars');
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    return await response.json();
  };
  