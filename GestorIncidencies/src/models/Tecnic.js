const { DataTypes } = require('sequelize');
const  sequelize  = require('../app');

const Tecnic = sequelize.define('Tecnic', {
  nom: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Tecnic',
  timestamps: false,
});

module.exports = Tecnic;