const express = require('express');
require('dotenv').config();
const path = require('path'); 

const { sequelize, Tecnic, Departament, Incidencia , Actuacions} = require('./db');

const IncidenciaEjsRoutes = require('./routes/IncidenciasEJS.routes');
const DepartamentEjsRoutes = require('./routes/departametEJS.routes'); 
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
app.use('/departments', DepartamentEjsRoutes); 

app.get('/', (req, res) => {
  res.render('index'); 
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
  
    // 1. Crear departaments
    const Dpt1 = await Departament.create({ nom: 'Mates' });
    const Dpt2 = await Departament.create({ nom: 'Física' });
    const Dpt3 = await Departament.create({ nom: 'llengua' });
    
    console.log('Departaments creats.');

    // 2. Crear Tecnics (Tecnic) 
    const tecnic1 = await Tecnic.create({ nom: 'alvaro'});
    console.log('tecnic creats.');

    // 3. Crear Incidències (Incidencia) d'exemple
    const inc1 = await Incidencia.create({
        title: 'La impressora no funciona',
        description: 'La impressora del departament de comptabilitat no imprimeix. Fa un soroll estrany.',        
        departamentId: Dpt1.id
    });

    const inc2 = await Incidencia.create({
        title: 'Error en accedir al CRM',
        description: 'No puc entrar al sistema CRM des de les 9:00. Mostra un error 500.',
        idTecnic: tecnic1.id,
        departamentId: Dpt2.id
    });
    console.log('Incidències creades.');
 
 

    console.log('Seeding completat.');
    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
      console.log('Accedeix a les incidències via web a: http://localhost:3000/Incidencias');
      console.log('Accedeix als estats via web a: http://localhost:3000/Actuacions');
      console.log('Accedeix a les prioritats via web a: http://localhost:3000/departments');
    });

  } catch (error) {
    console.error("Error durant la inicialització de l'aplicació:", error);
    process.exit(1); 
  }
})();