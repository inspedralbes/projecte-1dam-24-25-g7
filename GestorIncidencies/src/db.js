
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

Departament.hasMany(Incidencia, { foreignKey: 'idDepartament' });
Incidencia.belongsTo(Departament, { foreignKey: 'idDepartament' });

Tecnic.hasMany(Incidencia, { foreignKey: 'idTecnic' });
Incidencia.belongsTo(Tecnic, { foreignKey: 'idTecnic' });

Incidencia.hasMany(Actuacions, {foreignKey: 'idIncidencia', onDelete: 'CASCADE'});
Actuacions.belongsTo(Incidencia, {foreignKey: 'idIncidencia',onDelete: 'CASCADE'});

module.exports = { sequelize, Tecnic,Incidencia, Departament,  Actuacions }; 
