const express = require("express");
const router = express.Router();
const Form = require("../models/Form");

// 1. Create a new form
router.post("/forms", async (req, res) => {
  try {
    const { title, inputs } = req.body;
    const newForm = new Form({ title, inputs });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
});

// 2. Get all forms
router.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

// 3. Get a specific form by ID
router.get("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

// 4. Update a form
router.put("/forms/:id", async (req, res) => {
  try {
    const { title, inputs } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { title, inputs },
      { new: true }
    );
    if (!updatedForm) return res.status(404).json({ error: "Form not found" });
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: "Failed to update form" });
  }
});

// 5. Delete a form
router.delete("/forms/:id", async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ error: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete form" });
  }
});

const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  responses: [
    {
      inputId: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("FormResponse", formResponseSchema);

// module.exports = router;
