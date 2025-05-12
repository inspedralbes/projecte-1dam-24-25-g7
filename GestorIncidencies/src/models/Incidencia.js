const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Incidencia = sequelize.define('Incidencia', {

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Resolta: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },

  prioritat: {
    type: DataTypes.ENUM('Alta', 'mitja', 'baixa'),
    allowNull: true,
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tecnic',
      key: 'id',
    }
  },
  idDepartament: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departaments',
      key: 'id',
    }
  },
}, {
  tableName: 'Incidencias',
  timestamps: true,
});

module.exports = Incidencia;