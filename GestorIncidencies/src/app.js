// src/app.js
const express = require('express');
require('dotenv').config();
const path = require('path'); // Manté path per a les vistes i estàtics

// Importa TOTS els models i sequelize des de db.js
const { sequelize, Tecnic, Departament, Incidencia, Comentari } = require('./db');

// Rutes EJS (les que hem estat treballant)
const IncidenciaEjsRoutes = require('./routes/IncidenciasEJS.routes');
const DepartamentEjsRoutes = require('./routes/departametEJS.routes'); 
const ActuacionsEjsRoutes = require ('./routes/ActuacionsEJS.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware per a formularis i JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuració de fitxers estàtics (si tens CSS, JS de frontend o imatges genèriques)
app.use(express.static(path.join(__dirname, 'public'))); // Servirà arxius de la carpeta 'public' directament
// Si tenies imatges específiques a public/images, pots mantenir:
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Configuració de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Muntatge de Rutes EJS
app.use('/Incidencias', IncidenciaEjsRoutes);
app.use('/Actuacions', ActuacionsEjsRoutes);
app.use('/departments', DepartamentEjsRoutes); 

// Muntatge de Rutes API JSON (descomenta i ajusta si les fas servir)
// app.use('/api/Incidencias', IncidenciaApiRoutes);
// app.use('/api/Actuacionses', ActuacionsApiRoutes);
// app.use('/api/departments', DepartamentApiRoutes);
// app.use('/api/Tecnics', TecnicApiRoutes);

// Ruta principal (landing page)
app.get('/', (req, res) => {
  // Pots redirigir a la llista d'incidències o mostrar una pàgina d'inici
  // res.redirect('/Incidencias');
  res.render('index'); // Renderitza src/views/index.ejs
});

// Funció d'inicialització asíncrona
(async () => {
  try {
    // Sincronització de la base de dades
    // ATENCIÓ: force: true ESBORRA i RECREA les taules. Treu-ho quan tinguis dades.
    console.log('Sincronitzant base de dades...');
    await sequelize.sync({ force: true });
    console.log('Base de dades sincronitzada.');

    // --- Seeding (Població inicial de dades) ---
    console.log('Poblant dades inicials (seeding)...');

    // 1. Crear Estats (Actuacions)
    const ActuacionsOpen = await Actuacions.create({ name: 'Obert', description: 'Incidència nova, pendent d\'assignar o revisar.' });
    const ActuacionsInProgress = await Actuacions.create({ name: 'En Progrés', description: 'Incidència assignada i sent treballada.' });
    const ActuacionsResolved = await Actuacions.create({ name: 'Resolta', description: 'Solució aplicada, pendent de confirmació pel reportador.' });
    const ActuacionsClosed = await Actuacions.create({ name: 'Tancada', description: 'Incidència completada i confirmada.' });
    const ActuacionsCancelled = await Actuacions.create({ name: 'Cancel·lada', description: 'Incidència desestimada o duplicada.' });
    console.log('Actuacio creada.');

    // 2. Crear Prioritats (Departament)
    const DepartamentLow = await Departament.create({ name: 'Baixa', level: 1 });
    const DepartamentMedium = await Departament.create({ name: 'Mitja', level: 2 });
    const DepartamentHigh = await Departament.create({ name: 'Alta', level: 3 });
    const DepartamentCritical = await Departament.create({ name: 'Crítica', level: 4 });
    console.log('Prioritats creades.');

    // 3. Crear Tecnics (Tecnic) - Recorda HASHEJAR les contrasenyes en un cas real!
    const tecnic1 = await Tecnic.create({ nom: 'alvaro'});
    console.log('tecnic creats.');

    // 4. Crear Incidències (Incidencia) d'exemple
    await Incidencia.create({
        title: 'La impressora no funciona',
        description: 'La impressora del departament de comptabilitat no imprimeix. Fa un soroll estrany.',
       
       
        ActuacionsId: ActuacionsInProgress.id, // En progrés
        DepartamentId: DepartamentMedium.id // Prioritat Mitja
    });

    await Incidencia.create({
        title: 'Error en accedir al CRM',
        description: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500.',
     
        // assignedTecnicId: null, // No assignada encara
        ActuacionsId: ActuacionsOpen.id, // Oberta
        DepartamentId: DepartamentHigh.id // Prioritat Alta
    });
    console.log('Incidències creades.');

    // 5. Crear Comentaris (Comentari) d'exemple
    const Incidencias = await Incidencia.findAll(); // Obtenim les incidències creades
    if (Incidencias.length > 0) {
        await Comentari.create({
            text: 'He reiniciat la cua d\'impressió, sembla que ara funciona. Pots confirmar?',
            IncidenciaId: Incidencias[0].id, // Comentari a la primera incidència
         
        });
        console.log('Comentaris creats.');
    }

    console.log('Seeding completat.');

    // Iniciar servidor Express NOMÉS DESPRÉS de sincronitzar i sembrar
    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
      console.log('Accedeix a les incidències via web a: http://localhost:3000/Incidencias');
      console.log('Accedeix als estats via web a: http://localhost:3000/Actuacions');
      console.log('Accedeix a les prioritats via web a: http://localhost:3000/departments');
    });

  } catch (error) {
    console.error("Error durant la inicialització de l'aplicació:", error);
    process.exit(1); // Atura l'aplicació si hi ha un error crític a l'inici
  }
})();