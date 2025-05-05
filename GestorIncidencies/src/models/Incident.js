// src/models/Incident.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incident = sequelize.define('Incident', {
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
  statusId: { // L'estat actual de la incidència
    type: DataTypes.INTEGER,
    allowNull: false,
    // Caldria posar un valor per defecte (p. ex., l'ID de 'Open')
    // defaultValue: 1, // Això depèn de l'ID que tingui l'estat 'Open'
    // references: { model: 'statuses', key: 'id' }
  },
  priorityId: { // La prioritat de la incidència
    type: DataTypes.INTEGER,
    allowNull: false,
    // Caldria posar un valor per defecte (p. ex., l'ID de 'Medium')
    // defaultValue: 2, // Això depèn de l'ID que tingui la prioritat 'Medium'
    // references: { model: 'priorities', key: 'id' }
  },
  // Podries afegir altres camps com: location, department, affectedSystem, etc.

}, {
  tableName: 'incidents',
  timestamps: true, // Afegeix createdAt i updatedAt
});

// Associacions
// Incident.belongsTo(User, { foreignKey: 'reporterUserId', as: 'reporter' });
// Incident.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
// Incident.belongsTo(Status, { foreignKey: 'statusId' });
// Incident.belongsTo(Priority, { foreignKey: 'priorityId' });
// Incident.hasMany(Comment, { foreignKey: 'incidentId' });

module.exports = Incident;