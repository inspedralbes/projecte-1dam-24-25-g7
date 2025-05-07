
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
const Incidencia = require('./models/Incidencia');
const Departament = require('./models/Departament');
const Comentari = require('./models/Comentari');
const Actuacions = require('./models/Actuacions');

// Definir associacions



Departament.hasMany(Incidencia, { foreignKey: 'DepartamentId' });
Incidencia.belongsTo(Departament, { foreignKey: 'DepartamentId' });

Incidencia.hasMany(Comentari, { foreignKey: 'IncidenciaId' });
Comentari.belongsTo(Incidencia, { foreignKey: 'IncidenciaId' });

Incidencia.hasMany(Actuacions, {foreignKey: 'IncidenciaId'})
Actuacions.belongsTo(Incidencia,{foreignKey: 'IncidenciaId'})

Tecnic.hasMany(Incidencia, { foreignKey: 'tecnicId' });
Incidencia.belongsTo(Tecnic, { foreignKey: 'tecnicId' });




// Exportar sequelize i els models (opcionalment)
module.exports = { sequelize, Tecnic, Incidencia, Departament, Comentari, Actuacions }; //Actuacions
// O només exportar sequelize si els altres mòduls importen directament els models
// module.exports = sequelize;
