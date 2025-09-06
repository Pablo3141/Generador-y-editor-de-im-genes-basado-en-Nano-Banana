
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};
