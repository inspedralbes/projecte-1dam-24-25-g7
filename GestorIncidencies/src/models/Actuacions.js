
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
    allowNull: false, 
  },
  investedTime: { 
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ActuacioResolution: { // resolucion
    type: DataTypes.STRING,
    allowNull: true, //false
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
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