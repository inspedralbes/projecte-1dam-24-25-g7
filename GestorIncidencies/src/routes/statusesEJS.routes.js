// src/routes/statusesEJS.routes.js
const express = require('express');
const router = express.Router();
// Importa models necessaris (Status per operar, Incident per comprovar eliminació)
const { Status, Incident } = require('../db');

// Llistar estats (GET /statuses)
router.get('/', async (req, res) => {
    try {
        // Busquem tots els estats, ordenats per nom
        const statuses = await Status.findAll({ order: [['name', 'ASC']] });
        // Recollim un possible missatge d'error de la URL (si venim d'una redirecció)
        const errorMessage = req.query.error;
        // Renderitzem la vista de llista, passant els estats i l'error (si existeix)
        res.render('statuses/list', { statuses, errorMessage: errorMessage });
    } catch (error) {
        // En cas d'error greu, log a la consola i pàgina d'error genèrica
        console.error("Error al recuperar estats:", error);
        res.status(500).send('Error al recuperar estats');
    }
});

// Mostrar formulari per crear un nou estat (GET /statuses/new)
router.get('/new', (req, res) => {
    // Recollim un possible missatge d'error (p.ex., validació fallida al crear)
    const errorMessage = req.query.error;
    // Renderitzem la vista del formulari nou
    res.render('statuses/new', { errorMessage: errorMessage });
});

// Processar la creació d'un nou estat (POST /statuses/create)
router.post('/create', async (req, res) => {
    try {
        // Obtenim nom i descripció del cos de la petició (formulari)
        const { name, description } = req.body;

        // Validació: El nom és obligatori
        if (!name || name.trim() === '') {
            // Si no hi ha nom, redirigim al formulari amb un missatge d'error
            return res.redirect('/statuses/new?error=' + encodeURIComponent('El nom de l\'estat no pot estar buit.'));
        }

        // Intentem crear l'estat a la base de dades
        await Status.create({ name: name.trim(), description }); // Trim per netejar espais extra
        // Si es crea correctament, redirigim a la llista d'estats
        res.redirect('/statuses');
    } catch (error) {
         // Gestió d'errors específics de Sequelize
         if (error.name === 'SequelizeUniqueConstraintError') {
             // Si el nom ja existeix (error de restricció única)
            return res.redirect('/statuses/new?error=' + encodeURIComponent(`L'estat "${req.body.name}" ja existeix.`));
        }
        // Per a altres errors, log i error genèric
        console.error("Error al crear estat:", error);
        res.status(500).send('Error al crear estat');
    }
});

// Mostrar formulari per editar un estat existent (GET /statuses/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        // Busquem l'estat pel seu ID (paràmetre de la ruta)
        const status = await Status.findByPk(req.params.id);
        // Si no trobem l'estat, error 404
        if (!status) {
            return res.status(404).send('Estat no trobat');
        }
        // Recollim un possible missatge d'error (p.ex., validació fallida a l'actualitzar)
        const errorMessage = req.query.error;
        // Renderitzem la vista d'edició, passant l'estat i l'error
        res.render('statuses/edit', { status, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al carregar formulari d’edició d'estat:", error);
        res.status(500).send('Error al carregar formulari d’edició');
    }
});

// Processar l'actualització d'un estat existent (POST /statuses/:id/update)
router.post('/:id/update', async (req, res) => {
    const statusId = req.params.id; // Guardem l'ID per si hem de redirigir amb error
    try {
        // Obtenim nom i descripció del formulari
        const { name, description } = req.body;

        // Validació: El nom és obligatori
        if (!name || name.trim() === '') {
           return res.redirect(`/statuses/${statusId}/edit?error=` + encodeURIComponent('El nom de l\'estat no pot estar buit.'));
        }

        // Busquem l'estat a actualitzar
        const status = await Status.findByPk(statusId);
        if (!status) {
            return res.status(404).send('Estat no trobat per actualitzar');
        }

        // Actualitzem les propietats de l'objecte status
        status.name = name.trim();
        status.description = description;
        // Guardem els canvis a la base de dades
        await status.save();

        // Redirigim a la llista d'estats
        res.redirect('/statuses');
    } catch (error) {
        // Gestió error nom duplicat a l'actualitzar
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.redirect(`/statuses/${statusId}/edit?error=` + encodeURIComponent(`Ja existeix un altre estat amb el nom "${req.body.name}".`));
        }
        // Altres errors
        console.error("Error al actualitzar l'estat:", error);
        res.status(500).send("Error al actualitzar l'estat");
    }
});

// Processar l'eliminació d'un estat (POST /statuses/:id/delete)
// ATENCIÓ: La vista 'statuses/list.ejs' ha de tenir un formulari per enviar un POST a aquesta ruta
router.post('/:id/delete', async (req, res) => {
    try {
        const statusId = req.params.id;
        // Busquem l'estat a eliminar
        const status = await Status.findByPk(statusId);
        if (!status) {
            // Si no existeix, no podem fer res (podria redirigir amb error)
            return res.status(404).send('Estat no trobat per eliminar');
        }

        // Comprovació: Hi ha incidències que utilitzin aquest estat?
        const incidentCount = await Incident.count({ where: { statusId: statusId } });

        // Si hi ha incidències relacionades...
        if (incidentCount > 0) {
            // ...no el podem eliminar. Redirigim a la llista amb un missatge d'error.
            const message = `No es pot eliminar l'estat "${status.name}" perquè està assignat a ${incidentCount} incidència(es).`;
            return res.redirect('/statuses?error=' + encodeURIComponent(message));
        }

        // Si no hi ha incidències, procedim a eliminar l'estat
        await status.destroy();
        // Redirigim a la llista (sense missatge d'error)
        res.redirect('/statuses');
    } catch (error) {
        console.error("Error al eliminar l'estat:", error);
        // Podríem redirigir a la llista amb un error genèric
        res.redirect('/statuses?error=' + encodeURIComponent('Error desconegut al intentar eliminar l\'estat.'));
        // O enviar un error 500
        // res.status(500).send('Error al eliminar l\'estat');
    }
});

module.exports = router;