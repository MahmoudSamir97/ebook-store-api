// routes/contactRouter.js

const express = require('express');
const { createContact, getAllContacts, deleteContactById } = require('../controllers/contactUsController');
const contactRouter = express.Router();
contactRouter.post('/', createContact);
contactRouter.get('/', getAllContacts);
contactRouter.delete('/:id', deleteContactById);

module.exports = contactRouter;
