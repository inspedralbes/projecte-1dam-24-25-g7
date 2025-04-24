// src/models/Motorcycle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Motorcycle = sequelize.define('Motorcycle', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.ENUM('italy', 'usa', 'japan'),
    allowNull: false,
    defaultValue: 'japan'
  }
});

module.exports = Motorcycle;