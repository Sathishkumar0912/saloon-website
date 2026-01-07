const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const ContactSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: { type: String, required: true },
    message: String,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Route
app.post('/api/contact', async (req, res) => {
    const { fname, lname, email, message } = req.body;

    // Server-side Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
    }

    try {
        // 1. Save to MongoDB
        const newContact = new Contact({ fname, lname, email, message });
        await newContact.save();

        // 2. Send Confirmation Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for reaching out to Beauty Express!',
            text: `Hi ${fname},\n\nThank you for contacting us. We have received your message and will get back to you soon!\n\nBest,\nBeauty Express Team`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Data saved and email sent!" });

    } catch (err) {
        res.status(500).json({ error: "Server error, please try again later." });
    }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));