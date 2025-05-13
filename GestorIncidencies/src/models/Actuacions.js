const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Incidencia = require('./Incidencia');
const Tecnic = require('./Tecnic');

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
      model: Incidencia,
      key: 'id',
    }
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Tecnic,
      key: 'id',
    }
  }
}, {
  tableName: 'Actuacio',
  timestamps: true,
});

module.exports = Actuacio;