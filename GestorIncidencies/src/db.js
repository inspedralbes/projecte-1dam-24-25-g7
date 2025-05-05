
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
const Tecnic = require('./models/Tecnic');
const Incident = require('./models/Incident');
const Status = require('./models/Status');
const Priority = require('./models/Priority');
const Comment = require('./models/Comment');
const Actuacions = require('./models/Actuacions');

// Definir associacions

Status.hasMany(Incident, { foreignKey: 'statusId' });
Incident.belongsTo(Status, { foreignKey: 'statusId' });

Priority.hasMany(Incident, { foreignKey: 'priorityId' });
Incident.belongsTo(Priority, { foreignKey: 'priorityId' });

Incident.hasMany(Comment, { foreignKey: 'incidentId' });
Comment.belongsTo(Incident, { foreignKey: 'incidentId' });

Tecnic.hasMany(Incident, { foreignKey: 'tecnicId' });
Incident.belongsTo(Tecnic, { foreignKey: 'tecnicId' });


// Exportar sequelize i els models (opcionalment)
module.exports = { sequelize, Tecnic, Incident, Status, Priority, Comment, Actuacions }; //Actuacions
// O només exportar sequelize si els altres mòduls importen directament els models
// module.exports = sequelize;
