const express = require('express');
require('dotenv').config();
const path = require('path');
const sequelize = require('./db');

const Tecnic = require('./models/Tecnic');
const Departament = require('./models/Departament');
const Incidencia = require('./models/Incidencia');
const Actuacions = require('./models/Actuacions');

Incidencia.belongsTo(Departament, { foreignKey: 'idDepartament' });
Departament.hasMany(Incidencia, { foreignKey: 'idDepartament' });

Incidencia.belongsTo(Tecnic, { foreignKey: 'idTecnic'});
Tecnic.hasMany(Incidencia, { foreignKey: 'idTecnic' });

Actuacions.belongsTo(Incidencia, { foreignKey: 'idIncidencia', onDelete:'CASCADE' });
Incidencia.hasMany(Actuacions, { foreignKey: 'idIncidencia',onDelete: 'CASCADE' });

//RUTES
const incidenciaEjsRoutes = require('./routes/IncidenciasEJS.routes');
const departamentEjsRoutes = require('./routes/DepartamentEJS.routes');
const actuacioEjsRoutes = require('./routes/ActuacionsEJS.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/incidencies', incidenciaEjsRoutes);
app.use('/actuacions', actuacioEjsRoutes);
app.use('/departaments', departamentEjsRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

(async () => {
  try {
    await sequelize.sync()
    .then(() => {
      console.log('base de dades sincronitzada');
    })
    .catch((error) => {
      console.error('error al sincronitzar la base de dades', error);
    });
    await Departament.create({
      nom: 'Info-1',
      ubicacio: '2aPlanta',
    });  
    await Departament.create({
      nom: 'Info-3',
      ubicacio: '2aPlanta',
    });  
  await Departament.create({
      nom: 'Info-2',
      ubicacio: '2aPlanta',
    });  
  await Tecnic.create({
    nom: 'Judit Sarrat',
    });
  await Tecnic.create({
    nom: 'Enrique Cayo',
    });
  await Incidencia.create({   
      description: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500',
      Resolta: false,
      prioritat: 'baixa',
      idTecnic: 1,
      idDepartament:1
    });  
  await Actuacions.create({ 
      description: 'Ratolí ha sigut canviat',
      Temps: '15 minuts',
      Visible: true,
      idTecnic: 1,
      idIncidencia: 1,
    });  
  app.listen(port, () => {
    console.log(`Servidor escoltant a http://localhost:${port}`);
  });
} catch (error) {
  console.error(" Error a l'inici:", error);
}
})();