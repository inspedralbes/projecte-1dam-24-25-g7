// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
// IMPORTANT: Considera utilitzar una llibreria com bcrypt per hashejar les contrasenyes
// abans de guardar-les a la base de dades. No guardis mai contrasenyes en text pla!

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // El nom d'usuari hauria de ser únic
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // L'email també hauria de ser únic
    validate: {
      isEmail: true, // Validació bàsica del format d'email
    },
  },
  password: {
    type: DataTypes.STRING, // Emmagatzemarà el hash de la contrasenya
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true, // Opcional
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true, // Opcional
  },
  role: {
    type: DataTypes.ENUM('admin', 'technician', 'reporter'), // Exemple de rols
    allowNull: false,
    defaultValue: 'reporter',
  }
}, {
  // Opcions addicionals
  tableName: 'users', // Nom explícit per a la taula
  timestamps: true, // Afegeix createdAt i updatedAt automàticament
});

// Les associacions (relacions) es definiran més tard, possiblement aquí o a db.js
// User.hasMany(Incident, { foreignKey: 'reporterUserId', as: 'reportedIncidents' });
// User.hasMany(Incident, { foreignKey: 'assignedUserId', as: 'assignedIncidents' });
// User.hasMany(Comment, { foreignKey: 'userId' });

module.exports = User;