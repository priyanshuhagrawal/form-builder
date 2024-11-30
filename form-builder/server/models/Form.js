const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  inputs: [
    {
      type: {
        type: String, // "text", "email", "password", "number", "date"
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Form", FormSchema);
