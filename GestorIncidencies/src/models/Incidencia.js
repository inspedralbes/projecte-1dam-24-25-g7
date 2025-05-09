const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Incidencia = sequelize.define('Incidencia', {


  description: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
 
  Resolta: {
  type: DataTypes.BOOLEAN,
  allowNull: true,
  },


}, {
  tableName: 'Incidencias',
  timestamps: true, 
}); 

module.exports = Incidencia;