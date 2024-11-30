import React from "react";
import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div>
      <h1>Thank You!</h1>
      <p>Your form has been successfully submitted.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default Confirmation;
