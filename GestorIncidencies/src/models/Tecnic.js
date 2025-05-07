// src/models/Tecnic.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('Tecnic', {
  nom: {
    type: DataTypes.TEXT,
    allowNull: false, // El text del comentari és obligatori
  },
  
}, {
  tableName: 'Tecnic',
  timestamps: true, // És útil saber quan es va crear/modificar un comentari
});


module.exports = Tecnic;