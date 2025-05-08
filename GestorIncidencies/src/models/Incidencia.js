// src/models/Incidencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Incidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Un títol curt és necessari
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Una descripció detallada és necessària
  },
  // createdAt i updatedAt seran afegits per `timestamps: true`
  resolutionDate: {
    type: DataTypes.DATE,
    allowNull: true, // Data en què es va resoldre/tancar
  },
  // --- Claus Foranes (Foreign Keys) ---
  // Aquestes es connectaran amb les associacions
  
  assignedUserId: { // A qui està assignada (pot ser null si no està assignada)
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: 'users', key: 'id' }
  },
  ActuacionsId: { // L'estat actual de la incidència
    type: DataTypes.INTEGER,
    allowNull: true,
    // Caldria posar un valor per defecte (p. ex., l'ID de 'Open')
    // defaultValue: 1, // Això depèn de l'ID que tingui l'estat 'Open'
    // references: { model: 'Actuacionses', key: 'id' }
  },
  DepartamentId: { // La prioritat de la incidència
    type: DataTypes.INTEGER,
    allowNull: false,
    // Caldria posar un valor per defecte (p. ex., l'ID de 'Medium')
    // defaultValue: 2, // Això depèn de l'ID que tingui la prioritat 'Medium'
    // references: { model: 'departments', key: 'id' }
  },
  // Podries afegir altres camps com: location, department, affectedSystem, etc.

}, {
  tableName: 'Incidencias',
  timestamps: true, // Afegeix createdAt i updatedAt
});

// Associacions
// Incidencia.belongsTo(User, { foreignKey: 'reporterUserId', as: 'reporter' });
// Incidencia.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
// Incidencia.belongsTo(Actuacions, { foreignKey: 'ActuacionsId' });
// Incidencia.belongsTo(Departament, { foreignKey: 'DepartamentId' });
// Incidencia.hasMany(Comentari, { foreignKey: 'IncidenciaId' });

module.exports = Incidencia;