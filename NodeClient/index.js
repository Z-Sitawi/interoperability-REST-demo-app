const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// REQUIRED: Middleware to parse incoming JSON bodies from the frontend
app.use(express.json());
// REQUIRED: Enable CORS so frontend can communicate with this server
app.use(cors());

const users = require('../users.json');

const phoneValidatorUrl =
    "http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT/api/phonevalidator/isvalid?pNum=";

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", async (req, res) => {
    // 1. Remove 'await' from req.body (it is synchronous)
    let phone = req.body.phone;
    let pwd = req.body.password;

    try {
        const response = await fetch(phoneValidatorUrl + encodeURIComponent(phone));
        
        const data = await response.text(); 
        
        const isValidPhone = data.trim() === "true";

        if (isValidPhone) {
            const user = users.find((u) => u.phone === phone && u.password === pwd);
            
            if (user) {
                res.status(200).json({ success: true, message: "Phone is valid. User is authenticated" });
            } else {
                res.status(401).json({ success: false, message: "Phone is valid. But invalid credentials" });
            }
        } else {
            res.status(400).json({ success: false, message: "Invalid phone number" });
        }
    } catch (error) {
        console.error("Error validating phone number:", error);
        res.status(500).json({
            success: false,
            message: "Error validating phone number",
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});