// controllers/contactController.js

const Contact = require('../models/contactUsModel');

exports.createContact = async (req, res) => {
    try {
        const { userName, email, message } = req.body;
        const newContact = await Contact.create({ userName, email, message });
        res.status(201).json(newContact);
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

exports.deleteContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(deletedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
