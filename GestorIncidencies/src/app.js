// src/app.js
const express = require('express');
require('dotenv').config();
const path = require('path');
const sequelize = require('./db');

const Tecnic = require('./models/Tecnic');
const Departament = require('./models/Departament');
const Incidencia = require('./models/Incidencia');
const Actuacio = require('./models/Actuacio');

// --- ASSOCIACIONS ---
Incidencia.belongsTo(Departament, { foreignKey: 'idDepartament' });
Departament.hasMany(Incidencia, { foreignKey: 'idDepartament' });

Incidencia.belongsTo(Tecnic, { foreignKey: 'idTecnic'});
Tecnic.hasMany(Incidencia, { foreignKey: 'idTecnic' });

Actuacio.belongsTo(Incidencia, { foreignKey: 'idIncidencia', onDelete:'CASCADE', as: 'Incidencia' }); 
Incidencia.hasMany(Actuacio, { foreignKey: 'idIncidencia', onDelete: 'CASCADE', as: 'Actuacions' });

Actuacio.belongsTo(Tecnic, { foreignKey: 'idTecnic' });
Tecnic.hasMany(Actuacio, { foreignKey: 'idTecnic' });

Departament.belongsTo(Tecnic, { foreignKey: 'idTecnic', allowNull: true });
Tecnic.hasMany(Departament, { foreignKey: 'idTecnic' });

const incidenciesEjsRoutes = require('./routes/IncidenciesEJS.routes.js');
const departamentEjsRoutes = require('./routes/DepartamentEJS.routes.js');
const actuacionsEjsRoutes = require('./routes/ActuacionsEJS.routes.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/incidencies', incidenciesEjsRoutes);
app.use('/actuacions', actuacionsEjsRoutes);
app.use('/departaments', departamentEjsRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de dades RE-sincronitzada (force: true)');

    const countDepartaments = await Departament.count();
    if (countDepartaments === 0) {
        console.log('Creant dades inicials...');
        await Departament.create({
            nom: 'Info-1',
        });
        await Departament.create({
            nom: 'Info-3',
        });
        await Departament.create({
            nom: 'Info-2',
        });

        await Tecnic.create({
            nom: 'Judit Sarrat',
        });
        await Tecnic.create({
            nom: 'Enrique Cayo',
        });

        const incidenciaCreada = await Incidencia.create({
            descripcio: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500',
            resolta: false,
            prioritat: 'baixa',
            idTecnic: 1,
            idDepartament: 1
        });

        await Actuacio.create({
            descripcio: 'Ratolí ha sigut canviat',
            temps: 15,
            visible: true,
            idTecnic: 1,
            idIncidencia: incidenciaCreada.id,
        });
        console.log('Dades inicials creades.');
    } else {
         console.log('Les dades inicials ja existeixen, no es tornen a crear.');
    }

    app.listen(port, () => {
        console.log(`Servidor escoltant a http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error a l'inici o durant la sincronització/seeding:", error);
  }
})();