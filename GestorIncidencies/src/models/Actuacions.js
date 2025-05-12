// src/models/Actuacio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../app');

const Actuacio = sequelize.define('Actuacio', {
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  temps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },

  idIncidencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Incidencies',
      key: 'id',
    }
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tecnic',
      key: 'id',
    }
  }
}, {
  tableName: 'Actuacio',
  timestamps: true,
});

module.exports = Actuacio;