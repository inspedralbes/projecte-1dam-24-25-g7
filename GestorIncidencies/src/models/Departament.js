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
    unique: true, // Ex: 'Low', 'Medium', 'High', 'Critical'
  },
  level: {
    type: DataTypes.INTEGER, // Un nivell numèric pot ser útil per ordenar
    allowNull: false,
    unique: true, // Ex: 1 (Low), 2 (Medium), 3 (High), 4 (Critical)
  }
}, {
  tableName: 'Departments',
  timestamps: false, // Probablement no necessitem timestamps per a prioritats predefinides
});

// Departament.hasMany(Incidencia, { foreignKey: 'DepartamentId' });

module.exports = Departament;