// src/models/Actuacio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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

  incidenciaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Incidencies',
      key: 'id',
    }
  },
  tecnicId: {
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