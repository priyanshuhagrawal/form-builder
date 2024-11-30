import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/forms/${id}`
        );
        setForm(response.data);
      } catch (err) {
        console.error("Error fetching form:", err);
        alert("Failed to load form");
      }
    };
    fetchForm();
  }, [id]);

  // Handle input changes
  const handleInputChange = (index, value) => {
    const updatedResponses = [...userResponses];
    updatedResponses[index] = value;
    setUserResponses(updatedResponses);
  };

  // Form validation
  const validateForm = () => {
    let validationErrors = [];

    form.inputs.forEach((input, index) => {
      const value = userResponses[index] || "";
      if (input.required && !value) {
        validationErrors.push(`${input.label} is required.`);
      }
      if (input.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        validationErrors.push(`Please enter a valid email address.`);
      }
      if (input.type === "password" && value && value.length < 6) {
        validationErrors.push(`Password must be at least 6 characters long.`);
      }
      if (input.type === "number" && value && isNaN(value)) {
        validationErrors.push(`${input.label} must be a valid number.`);
      }
      if (input.type === "date" && value && isNaN(Date.parse(value))) {
        validationErrors.push(`Please enter a valid date.`);
      }
    });

    return validationErrors;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const responses = form.inputs.map((input, index) => ({
      inputId: input._id,
      value: userResponses[index] || "",
    }));

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forms/${id}/submit`,
        {
          responses,
        }
      );
      alert("Form submitted successfully!");
      // Redirect or show confirmation page
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div>
      <h1>{form.title}</h1>
      {errors.length > 0 && (
        <div style={{ color: "red" }}>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {form.inputs.map((input, index) => (
          <div key={index}>
            <label>{input.label}</label>
            <input
              type={input.type}
              placeholder={input.placeholder}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ViewForm;
