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
// Incident.belongsTo(User, { foreignKey: 'reporterUserId', as: 'reporter' });
// Incident.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
// Incident.belongsTo(Status, { foreignKey: 'statusId' });
// Incident.belongsTo(Priority, { foreignKey: 'priorityId' });
// Incident.hasMany(Comment, { foreignKey: 'incidentId' });

module.exports = Actuacions;