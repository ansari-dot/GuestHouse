import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Sardar House</h3>
      </div>
      <style jsx>{`
        .loading-spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: var(--bg-color);
        }
        
        .loading-spinner {
          text-align: center;
        }
        
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        
        h3 {
          color: var(--text-color);
          font-weight: 500;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 