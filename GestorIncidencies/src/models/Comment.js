// src/models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('Comment', {
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
  incidentId: { // A quina incidència pertany
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: { model: 'incidents', key: 'id' }
  },
  userId: { // Qui va escriure el comentari
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: 'users', key: 'id' }
  },
}, {
  tableName: 'comments',
  timestamps: true, // És útil saber quan es va crear/modificar un comentari
});

// Associacions
// Comment.belongsTo(Incident, { foreignKey: 'incidentId' });
// Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Comment;