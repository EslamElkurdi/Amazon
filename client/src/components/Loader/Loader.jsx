import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Clean up the timeout on component unmount or if loading state changes
    return () => clearTimeout(timeout);
  }, []); // Run this effect only once on component mount

  return (
    <div className="loader-container">
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div>No data to display</div>
      )}
    </div>
  );
};

export default Loader;