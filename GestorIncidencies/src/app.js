// src/app.js
const express = require('express');
require('dotenv').config();
const path = require('path'); // Manté path per a les vistes i estàtics

// Importa TOTS els models i sequelize des de db.js
const { sequelize, User, Status, Priority, Incident, Comment } = require('./db');

// Rutes per API JSON (si les necessites, crea-les o adapta les antigues)
// const incidentApiRoutes = require('./routes/incidents.routes');
// const statusApiRoutes = require('./routes/statuses.routes');
// const priorityApiRoutes = require('./routes/priorities.routes');
// const userApiRoutes = require('./routes/users.routes'); // Per login, etc?

// Rutes EJS (les que hem estat treballant)
const incidentEjsRoutes = require('./routes/incidentsEJS.routes');
const statusEjsRoutes = require('./routes/statusesEJS.routes');
const priorityEjsRoutes = require('./routes/prioritiesEJS.routes'); // Recorda crear aquest!

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
app.use('/incidents', incidentEjsRoutes);
app.use('/statuses', statusEjsRoutes);
app.use('/priorities', priorityEjsRoutes); // Recorda crear i importar la ruta

// Muntatge de Rutes API JSON (descomenta i ajusta si les fas servir)
// app.use('/api/incidents', incidentApiRoutes);
// app.use('/api/statuses', statusApiRoutes);
// app.use('/api/priorities', priorityApiRoutes);
// app.use('/api/users', userApiRoutes);

// Ruta principal (landing page)
app.get('/', (req, res) => {
  // Pots redirigir a la llista d'incidències o mostrar una pàgina d'inici
  // res.redirect('/incidents');
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

    // 1. Crear Estats (Status)
    const statusOpen = await Status.create({ name: 'Obert', description: 'Incidència nova, pendent d\'assignar o revisar.' });
    const statusInProgress = await Status.create({ name: 'En Progrés', description: 'Incidència assignada i sent treballada.' });
    const statusResolved = await Status.create({ name: 'Resolta', description: 'Solució aplicada, pendent de confirmació pel reportador.' });
    const statusClosed = await Status.create({ name: 'Tancada', description: 'Incidència completada i confirmada.' });
    const statusCancelled = await Status.create({ name: 'Cancel·lada', description: 'Incidència desestimada o duplicada.' });
    console.log('Estats creats.');

    // 2. Crear Prioritats (Priority)
    const priorityLow = await Priority.create({ name: 'Baixa', level: 1 });
    const priorityMedium = await Priority.create({ name: 'Mitja', level: 2 });
    const priorityHigh = await Priority.create({ name: 'Alta', level: 3 });
    const priorityCritical = await Priority.create({ name: 'Crítica', level: 4 });
    console.log('Prioritats creades.');

    // 3. Crear Usuaris (User) - Recorda HASHEJAR les contrasenyes en un cas real!
    const userAdmin = await User.create({ username: 'admin', email: 'admin@example.com', password: 'password123', firstName: 'Admin', lastName: 'Istrador', role: 'admin' });
    const userTech1 = await User.create({ username: 'jtec', email: 'jtec@example.com', password: 'password123', firstName: 'Joan', lastName: 'Tècnic', role: 'technician' });
    const userReporter1 = await User.create({ username: 'mrep', email: 'mrep@example.com', password: 'password123', firstName: 'Maria', lastName: 'Reportadora', role: 'reporter' });
    console.log('Usuaris creats.');

    // 4. Crear Incidències (Incident) d'exemple
    await Incident.create({
        title: 'La impressora no funciona',
        description: 'La impressora del departament de comptabilitat no imprimeix. Fa un soroll estrany.',
        reporterUserId: userReporter1.id, // ID de Maria
        assignedUserId: userTech1.id, // Assignada a Joan
        statusId: statusInProgress.id, // En progrés
        priorityId: priorityMedium.id // Prioritat Mitja
    });

    await Incident.create({
        title: 'Error en accedir al CRM',
        description: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500.',
        reporterUserId: userReporter1.id, // ID de Maria
        // assignedUserId: null, // No assignada encara
        statusId: statusOpen.id, // Oberta
        priorityId: priorityHigh.id // Prioritat Alta
    });
    console.log('Incidències creades.');

    // 5. Crear Comentaris (Comment) d'exemple
    const incidents = await Incident.findAll(); // Obtenim les incidències creades
    if (incidents.length > 0) {
        await Comment.create({
            text: 'He reiniciat la cua d\'impressió, sembla que ara funciona. Pots confirmar?',
            incidentId: incidents[0].id, // Comentari a la primera incidència
            userId: userTech1.id // Fet per Joan Tècnic
        });
        console.log('Comentaris creats.');
    }

    console.log('Seeding completat.');

    // Iniciar servidor Express NOMÉS DESPRÉS de sincronitzar i sembrar
    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
      console.log('Accedeix a les incidències via web a: http://localhost:3000/incidents');
      console.log('Accedeix als estats via web a: http://localhost:3000/statuses');
      console.log('Accedeix a les prioritats via web a: http://localhost:3000/priorities');
    });

  } catch (error) {
    console.error("Error durant la inicialització de l'aplicació:", error);
    process.exit(1); // Atura l'aplicació si hi ha un error crític a l'inici
  }
})();