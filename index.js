require('dotenv').config();
const express = require('express');
const app = express();
const userRouter = require('./src/routes/userRoutes');
const categoryRouter = require('./src/routes/category.routes');

app.use(express.json());
app.use('/user', userRouter);
app.use('/category', categoryRouter);

module.exports = app;
