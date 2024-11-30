import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditForm = () => {
  const { id } = useParams(); // Retrieve form ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  // Fetch the form data from the backend
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

  const handleInputChange = (index, field, value) => {
    const updatedInputs = [...form.inputs];
    updatedInputs[index][field] = value;
    setForm({ ...form, inputs: updatedInputs });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/forms/${id}`,
        {
          title: form.title,
          inputs: form.inputs,
        }
      );
      alert("Form updated successfully!");
      navigate(`/form/${id}`); // Redirect to the view form page
    } catch (err) {
      console.error("Error updating form:", err);
      alert("Failed to update form");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Form</h1>
      <div>
        <label>Form Title:</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <h3>Form Inputs</h3>
        {form.inputs.map((input, index) => (
          <div key={index}>
            <label>Input Label:</label>
            <input
              type="text"
              value={input.label}
              onChange={(e) =>
                handleInputChange(index, "label", e.target.value)
              }
            />
            <label>Input Placeholder:</label>
            <input
              type="text"
              value={input.placeholder}
              onChange={(e) =>
                handleInputChange(index, "placeholder", e.target.value)
              }
            />
            <button onClick={() => handleInputChange(index, "type", "text")}>
              Change Type
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditForm;
