const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('Departament', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, 
  },
}, {
  tableName: 'Departments',
  timestamps: false, 
});

module.exports = Departament;