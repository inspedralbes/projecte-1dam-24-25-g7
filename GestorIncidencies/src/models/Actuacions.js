// src/models/Actuacions.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Actuacions = sequelize.define('Actuacions', {
  id_resolution: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  resolutionDate: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Una descripció detallada és necessària
  },
  investedTime: { // temps dedicat a resoldre la incidencia
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ActuacioResolution: { // resolucion
    type: DataTypes.STRING,
    allowNull: false,
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: false
  }


}, {
  tableName: 'actuacions',
  timestamps: true,
});

// Associacions
// Incidencia.belongsTo(User, { foreignKey: 'reporterUserId', as: 'reporter' });
// Incidencia.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
// Incidencia.belongsTo(Actuacions, { foreignKey: 'ActuacionsId' });
// Incidencia.belongsTo(Departament, { foreignKey: 'DepartamentId' });
// Incidencia.hasMany(Comentari, { foreignKey: 'IncidenciaId' });

module.exports = Actuacions;