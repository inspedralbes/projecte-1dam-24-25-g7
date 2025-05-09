const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('Departament', {
  DepartamentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, 
  },

  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

}, {
  tableName: 'Departments',
  timestamps: false, 
});

module.exports = Departament;