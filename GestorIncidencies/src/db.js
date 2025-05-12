const { Sequelize } = require('sequelize');
require('dotenv').config();

// 1. Crear la instància de Sequelize i EXPORTAR-LA immediatament
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    // Pots afegir logging: console.log aquí temporalment per veure les queries
  }
);

// Exporta només 'sequelize' primer. Això ajuda a que els models puguin importar-lo.
module.exports = { sequelize };

// 2. Importar els models. ARA, quan els models facin require('../db'),
// rebran { sequelize } i podran cridar .define
const Tecnic = require('./models/Tecnic');
const Incidencia = require('./models/Incidencia');
const Departament = require('./models/Departament');
const Actuacions = require('./models/Actuacions');

// 3. Definir les associacions utilitzant els models ja importats
Departament.hasMany(Incidencia, { foreignKey: 'idDepartament' });
Incidencia.belongsTo(Departament, { foreignKey: 'idDepartament' });

Tecnic.hasMany(Incidencia, { foreignKey: 'idTecnic' });
Incidencia.belongsTo(Tecnic, { foreignKey: 'idTecnic' });

Incidencia.hasMany(Actuacions, {foreignKey: 'idIncidencia', onDelete: 'CASCADE'});
Actuacions.belongsTo(Incidencia, {foreignKey: 'idIncidencia',onDelete: 'CASCADE'});

// Opcional: Associació Actuacio a Tecnic si vols registrar el tècnic que fa l'actuació
// Actuacions.belongsTo(Tecnic, { foreignKey: 'idTecnic', as: 'tecnicExecutor' });


// 4. Actualitzar l'exportació per incloure també els models definits
// Hem d'afegir les propietats al module.exports existent, o reassignar-lo completament.
// Afegir les propietats és menys propens a trencar si algú ja ha importat l'objecte inicial.
module.exports.Tecnic = Tecnic;
module.exports.Incidencia = Incidencia;
module.exports.Departament = Departament;
module.exports.Actuacions = Actuacions;

// NOTA: En el teu app.js, la línia `const { sequelize, Tecnic, Departament, Incidencia , Actuacions} = require('./db');`
// funcionarà amb aquesta nova estructura de db.js, ja que el require final de db.js inclourà tots els models.