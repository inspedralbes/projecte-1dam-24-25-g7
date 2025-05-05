
// src/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);

module.exports = sequelize;

// Importar models
const User = require('./models/User');
const Incident = require('./models/Incident');
const Status = require('./models/Status');
const Priority = require('./models/Priority');
const Comment = require('./models/Comment');
//const Actuacions = require('./models/Actuacions');

// Definir associacions
User.hasMany(Incident, { foreignKey: 'reporterUserId', as: 'reportedIncidents' });
Incident.belongsTo(User, { foreignKey: 'reporterUserId', as: 'reporter' });

User.hasMany(Incident, { foreignKey: 'assignedUserId', as: 'assignedIncidents' });
Incident.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' }); // Pot ser null

Status.hasMany(Incident, { foreignKey: 'statusId' });
Incident.belongsTo(Status, { foreignKey: 'statusId' });

Priority.hasMany(Incident, { foreignKey: 'priorityId' });
Incident.belongsTo(Priority, { foreignKey: 'priorityId' });

Incident.hasMany(Comment, { foreignKey: 'incidentId' });
Comment.belongsTo(Incident, { foreignKey: 'incidentId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

//Actuacions.hasMany(Actuacions,{foreignKey: 'ActuacionsId' });
//User.hasMany(Actuacions,{foreignKey: 'ActuacioId'})

// Exportar sequelize i els models (opcionalment)
module.exports = { sequelize, User, Incident, Status, Priority, Comment }; //Actuacions
// O només exportar sequelize si els altres mòduls importen directament els models
// module.exports = sequelize;
