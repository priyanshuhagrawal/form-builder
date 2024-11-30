const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// API Routes
app.use("/api", formRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Form Builder Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import your Form model
const Form = require("./models/Form");

// Route to create a new form
app.post("/api/forms", async (req, res) => {
  try {
    const { title, inputs } = req.body;

    // Check for required fields
    if (!title || !inputs || inputs.length === 0) {
      return res.status(400).json({ message: "Title and inputs are required" });
    }

    // Create a new form in the database
    const newForm = new Form({
      title,
      inputs,
    });

    await newForm.save();
    res
      .status(201)
      .json({ message: "Form created successfully", form: newForm });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to get a form by ID
app.get("/api/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to edit an existing form by ID
app.put("/api/forms/:id", async (req, res) => {
  try {
    const { title, inputs } = req.body;

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    form.title = title;
    form.inputs = inputs;

    await form.save();
    res.status(200).json({ message: "Form updated successfully", form });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Import the Form Response model
const FormResponse = require("./models/FormResponse");

// Route to submit form responses
app.post("/api/forms/:id/submit", async (req, res) => {
  try {
    const { responses } = req.body; // Responses from the user

    // Validate the responses (ensure each input has a response)
    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: "Responses are required" });
    }

    // Check if form exists
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Create a new form response
    const newResponse = new FormResponse({
      formId: req.params.id,
      responses,
    });

    await newResponse.save();
    res
      .status(201)
      .json({ message: "Form submitted successfully", response: newResponse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
