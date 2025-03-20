import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <img src={car.image_url} alt={car.model} />
      <h3>{car.model}</h3>
      <p>{car.price}</p>
      <Link to={`/cars/${car.id}`}>View Details</Link>
    </div>
  );
};

export default CarCard;
