// src/models/Departament.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('Departament', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ex: 'Mates', 'Llengues'...
  }
}, {
  tableName: 'Departments',
  timestamps: false, // Probablement no necessitem timestamps per a prioritats predefinides
});

// Departament.hasMany(Incidencia, { foreignKey: 'DepartamentId' });

module.exports = Departament;