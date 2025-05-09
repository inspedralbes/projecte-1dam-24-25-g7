const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Incidencia = sequelize.define('Incidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
 
  DepartamentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
 
  Resolta: {
  type: DataTypes.BOOLEAN,
  allowNull: true,
  },

  idActuacio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

}, {
  tableName: 'Incidencias',
  timestamps: true, 
}); 

module.exports = Incidencia;