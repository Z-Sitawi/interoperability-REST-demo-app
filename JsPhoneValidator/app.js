const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

// REQUIRED: Middleware to parse incoming JSON bodies from the frontend
app.use(express.json());
// REQUIRED: Enable CORS so frontend can communicate with this server
app.use(cors());

const isValidPhone = (input) => {
  // 1. Remove spaces, dashes, dots, and parentheses
  const cleaned = input.trim().replace(/[\s\-().]/g, '');

  // 2. Match either:
  //    - International: optional '+' followed by 7–15 digits (starting 1-9)
  //    - Local: starts with '0' followed by 6–14 digits
  const phoneRegex = /^(\+?[1-9]\d{6,14}|0[1-9]\d{6,13})$/;

  return phoneRegex.test(cleaned);
};

app.get("/phone/isvalid", (req, res) => {
    const phone = req.query.phone;

    console.log(`Checking phone number: ${phone}`);
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    if (isValidPhone(phone)) {
        return res.status(200).json({ isValid: true });
    }

    return res.status(200).json({ isValid: false });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
