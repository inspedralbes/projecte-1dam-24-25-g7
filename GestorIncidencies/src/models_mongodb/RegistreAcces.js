// src/models_mongodb/RegistreAcces.js
const mongoose = require('mongoose');

const registreAccesSchema = new mongoose.Schema({
    timestamp: { // Data i hora de l'accés
        type: Date,
        default: Date.now,
        required: true
    },
    ruta: { // La ruta visitada (pàgina), ex: /incidencies, /actuacions/new
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: false,
    collection: 'registres_accessos'
});

registreAccesSchema.index({ timestamp: -1 });
registreAccesSchema.index({ ruta: 1 });

const RegistreAcces = mongoose.model('RegistreAcces', registreAccesSchema);

module.exports = RegistreAcces;