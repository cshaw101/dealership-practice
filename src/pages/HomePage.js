import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Our Dealership</h1>
        <p>Your one-stop shop for all your car buying needs!</p>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
