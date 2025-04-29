// src/models/Status.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Status = sequelize.define('Status', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ex: 'Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Descripció opcional de l'estat
  }
}, {
  tableName: 'statuses',
  timestamps: false, // Probablement no necessitem timestamps per als estats predefinits
});

// Status.hasMany(Incident, { foreignKey: 'statusId' });

module.exports = Status;