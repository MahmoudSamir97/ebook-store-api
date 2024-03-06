require('dotenv').config();
const server = require('./index');
const mongoose = require('mongoose');
let db = process.env.DATABASE_URL;
db = db.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(db).then(() => console.log('Connected to database successfully 😎'));
server.listen(process.env.PORT, () => {
    console.log(`Listening to server on port ${process.env.PORT}`);
});
