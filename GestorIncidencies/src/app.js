// src/app.js
const express = require('express');
require('dotenv').config();
const path = require('path');
const sequelize = require('./db');
const connectDB = require('./mongo_db');

const Tecnic = require('./models/Tecnic');
const Departament = require('./models/Departament');
const Incidencia = require('./models/Incidencia');
const Actuacio = require('./models/Actuacio');

connectDB();

const RegistreAcces = require('./models_mongodb/RegistreAcces');

// --- ASSOCIACIONS SEQUELIZE ---
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

// Rutes per a les vistes EJS (Sequelize)
const incidenciesEjsRoutes = require('./routes/IncidenciesEJS.routes.js');
const departamentEjsRoutes = require('./routes/DepartamentEJS.routes.js');
const actuacionsEjsRoutes = require('./routes/ActuacionsEJS.routes.js');
const estadistiquesRoutes = require('./routes/Estadistiques.routes.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MONGODB
app.use(async (req, res, next) => {
    res.on('finish', async () => {
        try {
            const entradaRegistre = new RegistreAcces({
                ruta: req.originalUrl,
            });
            await entradaRegistre.save();
        } catch (err) {
            console.error('Error en registrar l\'accés a MongoDB:', err);
        }
    });
    next();
});

// Rutes principals de l'aplicació
app.use('/incidencies', incidenciesEjsRoutes);
app.use('/actuacions', actuacionsEjsRoutes);
app.use('/departaments', departamentEjsRoutes);
app.use('/estadistiques', estadistiquesRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de dades MySQL RE-sincronitzada (force: true)');

    const countDepartaments = await Departament.count();
    if (countDepartaments === 0) {
        console.log('Creant dades inicials per a MySQL...');
        await Departament.create({ nom: 'Llengues' });
        await Departament.create({ nom: 'Matematiques' });
        await Departament.create({ nom: 'Ciencies' });
        await Departament.create({ nom: 'Arts' });
        await Departament.create({ nom: 'Esports' });
        await Departament.create({ nom:  'Informàtica'});

        await Tecnic.create({ nom: 'Alvaro Perez' });
        await Tecnic.create({ nom: 'Ermengol Bota' });
        await Tecnic.create({ nom: 'Pol Prats' });

        const incidenciaCreada = await Incidencia.create({
            descripcio: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500',
            resolta: false,
            prioritat: 'alta',
            idTecnic: 1,
            idDepartament: 1
        });


        await Incidencia.create({
            descripcio: 'El ratolí de la taula del profesor no funciona',
            resolta: false,
            prioritat: 'baixa',
            idTecnic: 2,
            idDepartament: 4
        });


        await Incidencia.create({
            descripcio: 'S´han trencat els altaveus de la sala info-6',
            resolta: true,
            prioritat: 'mitja',
            idTecnic: 3,
            idDepartament: 6
        });
        
        await Actuacio.create({
            descripcio: 'Altaveus arreglats',
            temps: 5,
            visible: false,
            idTecnic: 3,
            idIncidencia: 3,
        });

        await Incidencia.create({
            descripcio: 'La pantalla del ordinador pegat a la finestra de la 2a fila està partida',
            resolta: true,
            prioritat: 'alta',
            idTecnic: 1,
            idDepartament: 5
        });
        
        await Actuacio.create({
            descripcio: 'monitor canviat',
            temps: 5,
            visible: false,
            idTecnic: 1,
            idIncidencia: 4,
        });

        await Incidencia.create({
            descripcio: 'EL projector de l´aula de física o química no funciona',
            resolta: false,
            prioritat: 'mitja',
            idTecnic: 2,
            idDepartament: 5
        });
        
        await Incidencia.create({
            descripcio: 'El teclat del profesor no respon',
            resolta: true,
            prioritat: 'alta',
            idTecnic: 3,
            idDepartament: 4
        });
        
        await Actuacio.create({
            descripcio: 'teclat canviat',
            temps: 25,
            visible: true,
            idTecnic: 3,
            idIncidencia: 6,
        });

        console.log('Dades inicials de MySQL creades.');
    } else {
         console.log('Les dades inicials de MySQL ja existeixen, no es tornen a crear.');
    }

    app.listen(port, () => {
        console.log(`Servidor escoltant a http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error a l'inici o durant la sincronització/seeding de MySQL:", error);
  }
})();