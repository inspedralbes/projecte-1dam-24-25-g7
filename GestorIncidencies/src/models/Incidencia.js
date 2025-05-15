// src/models/Incidencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Tecnic = require('./Tecnic');
const Departament = require('./Departament');

const Incidencia = sequelize.define('Incidencia', {
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resolta: {
    type: DataTypes.BOOLEAN,
    //allowNull: true,
    defaultValue: false,
  },
  prioritat: {
    type: DataTypes.ENUM('Alta', 'mitja', 'baixa'),
    allowNull: true,
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Tecnic,
      key: 'id',
    }
  },
  idDepartament: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Departament,
      key: 'id',
    }
  },
}, {
  tableName: 'Incidencies',
  timestamps: true,
});

module.exports = Incidencia;