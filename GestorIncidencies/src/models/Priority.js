// src/models/Priority.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Priority = sequelize.define('Priority', {
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
  tableName: 'priorities',
  timestamps: false, // Probablement no necessitem timestamps per a prioritats predefinides
});

// Priority.hasMany(Incident, { foreignKey: 'priorityId' });

module.exports = Priority;