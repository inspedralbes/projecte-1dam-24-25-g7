
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('Tecnic', {
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nom: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
}, {
  tableName: 'Tecnic',
});

module.exports = Tecnic;