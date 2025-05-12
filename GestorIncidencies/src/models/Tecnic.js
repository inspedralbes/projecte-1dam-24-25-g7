
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('Tecnic', {

  nom: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
}, {
  tableName: 'Tecnic',
});

module.exports = Tecnic;