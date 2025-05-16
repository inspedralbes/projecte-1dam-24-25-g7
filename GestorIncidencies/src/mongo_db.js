// src/mongo_db.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: La variable d\'entorn MONGODB_URI no està definida al fitxer .env');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connectat correctament a Atlas...');
    } catch (err) {
        console.error('Error de connexió a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;