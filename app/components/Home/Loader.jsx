"use client";
import React from "react";

const Loader = ({ size = 40 }) => {
  const style = {
    width: size,
    height: size,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <div style={style}></div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default Loader;
