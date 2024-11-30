import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Form Builder</h1>
      <Link to="/form/create">
        <button>Create New Form</button>
      </Link>
    </div>
  );
};

export default Home;
