import React, { useEffect, useState } from 'react';
import { fetchCars } from '../api/carsApi'; // Import the function to fetch cars data
import '../assets/styles/CarsPage.css'; // Import the styling

const CarsPage = () => {
  const [cars, setCars] = useState([]); // Store the cars data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    const getCars = async () => {
      try {
        const carData = await fetchCars(); // Call the fetch function
        setCars(carData); // Update the state with the car data
      } catch (err) {
        setError(err.message); // Set error if there is an issue
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    getCars(); // Fetch the cars when the component mounts
  }, []);

  if (loading) return <div>Loading cars...</div>; // Show loading message while fetching
  if (error) return <div>Error: {error}</div>; // Show error message if there's an issue

  return (
    <div>
      <h1>Our Cars</h1>
      <div className="cars-container">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.image_url} alt={car.model} />
            <h2>{car.model}</h2>
            <p className="description">{car.description}</p>
            <div className="price">${car.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsPage;
