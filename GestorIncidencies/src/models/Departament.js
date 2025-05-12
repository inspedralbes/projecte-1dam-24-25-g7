const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('Departament', {
 
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
  tableName: 'Departaments',
  timestamps: false, 
});

module.exports = Departament;