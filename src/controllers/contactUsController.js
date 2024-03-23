// controllers/contactController.js

const Contact = require('../models/contactUsModel');

exports.createContact = async (req, res) => {
    try {
        const { userName, email, message } = req.body;
        const newContact = new Contact({ userName, email, message });
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
