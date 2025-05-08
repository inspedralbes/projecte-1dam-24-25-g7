
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
const Tecnic = require('./models/Tecnic');
const Incidencia = require('./models/Incidencia');
const Departament = require('./models/Departament');
const Actuacions = require('./models/Actuacions');

Departament.hasMany(Incidencia, { foreignKey: 'DepartamentId' });
Incidencia.belongsTo(Departament, { foreignKey: 'DepartamentId' });

Tecnic.hasMany(Incidencia, { foreignKey: 'tecnicId' });
Incidencia.belongsTo(Tecnic, { foreignKey: 'tecnicId' });

module.exports = { sequelize, Tecnic, Incidencia, Departament,Actuacions }; 
