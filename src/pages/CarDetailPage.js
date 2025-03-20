import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCarById } from '../api/carsApi'; // API function to fetch car data by ID

const CarDetailPage = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState(null);

  useEffect(() => {
    const getCar = async () => {
      const carData = await fetchCarById(id); // Fetch car data by ID
      setCar(carData);
    };
    getCar();
  }, [id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{car.model}</h1>
      <img src={car.image_url} alt={car.model} />
      <p>{car.description}</p>
      <p>Price: {car.price}</p>
    </div>
  );
};

export default CarDetailPage;
