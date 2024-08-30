"use client"; 

import React from 'react';

export default function Button({ onClick, className, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
