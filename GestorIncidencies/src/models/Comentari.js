// src/models/Comentari.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comentari = sequelize.define('Comentari', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false, // El text del comentari és obligatori
  },
  // --- Claus Foranes ---
  IncidenciaId: { // A quina incidència pertany
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: { model: 'Incidencias', key: 'id' }
  },
  userId: { // Qui va escriure el comentari
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: 'users', key: 'id' }
  },
}, {
  tableName: 'Comentaris',
  timestamps: true, // És útil saber quan es va crear/modificar un comentari
});

// Associacions
// Comentari.belongsTo(Incidencia, { foreignKey: 'IncidenciaId' });
// Comentari.belongsTo(User, { foreignKey: 'userId' });

module.exports = Comentari;