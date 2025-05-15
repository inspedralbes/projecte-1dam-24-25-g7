// src/models/Tecnic.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('Tecnic', {
  nom: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Tecnic',
  timestamps: false,
});

module.exports = Tecnic;