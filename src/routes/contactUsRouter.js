// routes/contactRouter.js

const express = require('express');
const { createContact, getAllContacts } = require('../controllers/contactUsController');
const contactRouter = express.Router();
contactRouter.post('/', createContact);
contactRouter.get('/', getAllContacts);

module.exports = contactRouter;
