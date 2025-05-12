const express = require('express');
require('dotenv').config();
const path = require('path'); 

const { sequelize, Tecnic, Departament, Incidencia , Actuacions} = require('./db');

const IncidenciaEjsRoutes = require('./routes/IncidenciasEJS.routes');
const DepartamentEjsRoutes = require('./routes/DepartamentEJS.routes'); 
const ActuacionsEjsRoutes = require ('./routes/ActuacionsEJS.routes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/Incidencias', IncidenciaEjsRoutes);
app.use('/Actuacions', ActuacionsEjsRoutes);
app.use('/Departments', DepartamentEjsRoutes); 

app.get('/', (req, res) => {
  res.render('index'); 
});

// Funció d'inicialització asíncrona
(async () => {
  try {

    console.log('Sincronitzant base de dades...');
    // Executing CREATE TABLEs... (aquestes línies ara haurien d'aparèixer sense l'error de define)
    await sequelize.sync({ force: true });
    console.log('Base de dades sincronitzada.');

    const Dpt1 = await Departament.create({ nom: 'Mates' }); // Utilitza 'nom'
    const Dpt2 = await Departament.create({ nom: 'Física' }); // Utilitza 'nom'
    const Dpt3 = await Departament.create({ nom: 'llengua' }); // Utilitza 'nom'

    console.log('Departaments creats.');

    // 2. Crear Tecnics (Tecnic)
    const tecnic1 = await Tecnic.create({ nom: 'alvaro'}); // Utilitza 'nom'
    console.log('tecnic creats.');

    // 3. Crear Incidències (Incidencia) d'exemple
    const inc1 = await Incidencia.create({
        // Eliminem 'title' ja que no existeix al model
        description: 'La impressora del departament de comptabilitat no imprimeix. Fa un soroll estrany.',
        // Utilitza el nom de camp CORRECTE per a la clau forana
        idDepartament: Dpt1.id, // <--- CANVI AQUÍ (idDepartament en lloc de departamentId)
        // prioritat: 'mitja', // Opcional: afegeix prioritat si el camp existeix al model
        Resolta: false // Opcional: defineix un estat inicial si cal
    });

    const inc2 = await Incidencia.create({
        // Eliminem 'title'
        description: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500.',
        idTecnic: tecnic1.id, // Aquest ja estava bé (idTecnic)
        // Utilitza el nom de camp CORRECTE per a la clau forana
        idDepartament: Dpt2.id, // <--- CANVI AQUÍ (idDepartament en lloc de departamentId)
        // prioritat: 'Alta', // Opcional: afegeix prioritat
        Resolta: false // Opcional
    });
    console.log('Incidències creades.');
    console.log('Seeding completat.');

    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error durant la inicialització de l'aplicació:", error);
    process.exit(1);
  }
})();