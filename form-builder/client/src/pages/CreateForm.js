import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./CreateForm.css"; // Import the CSS for styling

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState(""); // For storing form title
  const [sections, setSections] = useState([{ title: "", inputs: [] }]); // For storing sections and inputs
  const [newInput, setNewInput] = useState({
    type: "",
    label: "",
    placeholder: "",
  }); // For new input data

  // Handle the input changes (e.g. label, placeholder, etc.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInput({
      ...newInput,
      [name]: value,
    });
  };

  // Handle the form title change
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  // Add a new section to the form
  const addSection = () => {
    if (sections.length < 5) {
      setSections([...sections, { title: "", inputs: [] }]);
    } else {
      alert("Maximum of 5 sections allowed.");
    }
  };

  // Add a new input to a specific section
  const addInputToSection = (sectionIndex) => {
    if (sections[sectionIndex].inputs.length < 5) {
      const newInputWithId = { ...newInput, id: uuidv4() };
      const updatedSections = [...sections];
      updatedSections[sectionIndex].inputs.push(newInputWithId);
      setSections(updatedSections);
      setNewInput({ type: "", label: "", placeholder: "" });
    } else {
      alert("Maximum of 5 inputs per section allowed.");
    }
  };

  // Save the form data to the database
  const saveForm = async () => {
    const formData = { title: formTitle, sections };

    try {
      const response = await fetch("http://localhost:5000/api/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  // Handle drag-and-drop input reordering
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedSections = [...sections];
    const [removed] = updatedSections[source.index].inputs.splice(
      source.index,
      1
    );
    updatedSections[destination.index].inputs.splice(
      destination.index,
      0,
      removed
    );

    setSections(updatedSections);
  };

  return (
    <div className="create-form-container">
      <h1>Create a New Form</h1>
      <input
        type="text"
        placeholder="Enter Form Title"
        value={formTitle}
        onChange={handleTitleChange}
      />

      {/* Render sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <input
            type="text"
            placeholder="Enter Section Title"
            value={section.title}
            onChange={(e) => {
              const updatedSections = [...sections];
              updatedSections[sectionIndex].title = e.target.value;
              setSections(updatedSections);
            }}
          />

          {/* Drag-and-drop for input reordering */}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable
              droppableId={`section-${sectionIndex}`}
              direction="vertical"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="drag-container"
                >
                  {section.inputs.map((input, index) => (
                    <Draggable
                      key={input.id}
                      draggableId={input.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="input-item"
                        >
                          <div>
                            <strong>{input.label}</strong> - {input.type}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Button to add an input to this section */}
          <button onClick={() => addInputToSection(sectionIndex)}>
            Add Input to Section
          </button>
        </div>
      ))}

      {/* Button to add a new section */}
      <button onClick={addSection} className="add-section-button">
        Add Section
      </button>

      {/* Input fields for new inputs */}
      <div className="input-fields">
        <input
          type="text"
          placeholder="Label"
          name="label"
          value={newInput.label}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Placeholder"
          name="placeholder"
          value={newInput.placeholder}
          onChange={handleInputChange}
        />
        <select name="type" value={newInput.type} onChange={handleInputChange}>
          <option value="">Select Input Type</option>
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="password">Password</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* Save the form */}
      <button onClick={saveForm}>Save Form</button>
    </div>
  );
};

export default CreateForm;
