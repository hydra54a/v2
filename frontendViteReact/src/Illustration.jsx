import React from "react";
import illustration from "./assets/landing 1.png"; 
import "./components/Illustration.css"; 

const Illustration = () => {
  return (
    <div className="illustration">
      <img src={illustration} alt="Students Jumping" />
    </div>
  );
};

export default Illustration;
