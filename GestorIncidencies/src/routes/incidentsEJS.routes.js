// src/routes/incidentsEJS.routes.js
const express = require('express');
const router = express.Router();
// Importa els models necessaris des de db.js (assumint l'exportació conjunta)
const { Incident, User, Status, Priority, Comment } = require('../db');

// Llistar incidències (GET /incidents)
router.get('/', async (req, res) => {
    try {
        // Inclou els models relacionats per mostrar noms en lloc d'IDs
        const incidents = await Incident.findAll({
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'username', 'firstName', 'lastName'] }, // Qui la va reportar
                { model: User, as: 'assignedUser', attributes: ['id', 'username', 'firstName', 'lastName'] }, // A qui està assignada (pot ser null)
                { model: Status, attributes: ['id', 'name'] }, // Nom de l'estat
                { model: Priority, attributes: ['id', 'name', 'level'] } // Nom de la prioritat
            ],
            order: [['createdAt', 'DESC']] // Ordena per data de creació, les més noves primer
        });
        // Hauràs de crear la vista: src/views/incidents/list.ejs
        res.render('incidents/list', { incidents });
    } catch (error) {
        console.error("Error al recuperar incidències:", error);
        res.status(500).send('Error al recuperar incidències');
    }
});

// Form per crear una incidència (GET /incidents/new)
router.get('/new', async (req, res) => {
    try {
        // Necessitem obtenir tots els usuaris, estats i prioritats per als desplegables del formulari
        const [users, statuses, priorities] = await Promise.all([
            User.findAll({ order: [['username', 'ASC']] }),
            Status.findAll({ order: [['name', 'ASC']] }),
            Priority.findAll({ order: [['level', 'ASC']] }) // Ordenem per nivell
        ]);
        // Hauràs de crear la vista: src/views/incidents/new.ejs
        res.render('incidents/new', { users, statuses, priorities });
    } catch (error) {
        console.error("Error al carregar el formulari de nova incidència:", error);
        res.status(500).send('Error al carregar el formulari de nova incidència');
    }
});

// Crear incidència (POST /incidents/create)
router.post('/create', async (req, res) => {
    try {
        // Recollim les dades del formulari
        // Assegura't que els 'name' dels inputs al formulari coincideixen: title, description, reporterUserId, assignedUserId, statusId, priorityId
        const { title, description, reporterUserId, assignedUserId, statusId, priorityId } = req.body;

        // Validació bàsica (pots afegir-ne més)
        if (!title || !description || !reporterUserId || !statusId || !priorityId) {
            // Idealment, redirigir amb un missatge d'error
            return res.status(400).send('Falten camps obligatoris.');
        }

        // Crear la incidència a la BD
        await Incident.create({
            title,
            description,
            reporterUserId,
            assignedUserId: assignedUserId || null, // Permet que sigui nul si no s'assigna
            statusId,
            priorityId
            // createdAt s'afegeix automàticament
        });

        res.redirect('/incidents'); // Torna al llistat d'incidències
    } catch (error) {
        console.error("Error al crear la incidència:", error);
        // Hauries d'afegir una gestió d'errors més robusta, potser redirigint al formulari amb un missatge
        res.status(500).send('Error al crear la incidència');
    }
});

// Form per editar una incidència (GET /incidents/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        const incidentId = req.params.id;
        // Obtenim la incidència específica i també les llistes per als desplegables
        const [incident, users, statuses, priorities] = await Promise.all([
            Incident.findByPk(incidentId), // No cal incloure relacions aquí si només volem els IDs per al formulari
            User.findAll({ order: [['username', 'ASC']] }),
            Status.findAll({ order: [['name', 'ASC']] }),
            Priority.findAll({ order: [['level', 'ASC']] })
        ]);

        if (!incident) {
            return res.status(404).send('Incidència no trobada');
        }

        // Hauràs de crear la vista: src/views/incidents/edit.ejs
        res.render('incidents/edit', { incident, users, statuses, priorities });
    } catch (error) {
        console.error("Error al carregar el formulari d'edició:", error);
        res.status(500).send("Error al carregar el formulari d'edició");
    }
});

// Actualitzar incidència (POST /incidents/:id/update)
router.post('/:id/update', async (req, res) => {
    try {
        const incidentId = req.params.id;
        // Recollim dades del formulari d'edició
        const { title, description, reporterUserId, assignedUserId, statusId, priorityId } = req.body;

         // Validació bàsica
        if (!title || !description || !reporterUserId || !statusId || !priorityId) {
           return res.status(400).send('Falten camps obligatoris.');
        }

        const incident = await Incident.findByPk(incidentId);
        if (!incident) {
            return res.status(404).send('Incidència no trobada per actualitzar');
        }

        // Actualitzem els camps de la incidència
        incident.title = title;
        incident.description = description;
        incident.reporterUserId = reporterUserId;
        incident.assignedUserId = assignedUserId || null;
        incident.statusId = statusId;
        incident.priorityId = priorityId;
        // Podríem actualitzar resolutionDate si l'estat canvia a 'Resolved' o 'Closed'
        // if (/* status és Resolved/Closed */) { incident.resolutionDate = new Date(); } else { incident.resolutionDate = null; }

        // Guardem els canvis
        await incident.save();

        res.redirect('/incidents'); // Redirigim al llistat
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
        res.status(500).send('Error al actualitzar la incidència');
    }
});

// Eliminar incidència (Canviat a POST per seguretat)
// Necessitaràs un petit formulari a la vista list.ejs per enviar un POST a aquesta ruta
router.post('/:id/delete', async (req, res) => {
    try {
        const incidentId = req.params.id;
        const incident = await Incident.findByPk(incidentId);
        if (!incident) {
            return res.status(404).send('Incidència no trobada per eliminar');
        }

        // Abans d'eliminar la incidència, podríem eliminar els comentaris associats
        // O configurar 'onDelete: CASCADE' a la relació Incident.hasMany(Comment)
        await Comment.destroy({ where: { incidentId: incidentId } }); // Eliminació manual de comentaris

        // Ara eliminem la incidència
        await incident.destroy();

        res.redirect('/incidents'); // Redirigim al llistat
    } catch (error) {
        console.error("Error al eliminar la incidència:", error);
        res.status(500).send('Error al eliminar la incidència');
    }
});


// --- Opcional: Detall d'una incidència amb comentaris ---
// (GET /incidents/:id)
router.get('/:id', async (req, res) => {
    try {
        const incident = await Incident.findByPk(req.params.id, {
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'username', 'firstName', 'lastName'] },
                { model: User, as: 'assignedUser', attributes: ['id', 'username', 'firstName', 'lastName'] },
                { model: Status, attributes: ['id', 'name'] },
                { model: Priority, attributes: ['id', 'name', 'level'] },
                {
                    model: Comment,
                    include: [{ model: User, attributes: ['id', 'username', 'firstName', 'lastName'] }], // Qui va fer el comentari
                    order: [['createdAt', 'ASC']] // Comentaris en ordre cronològic
                }
            ]
        });

        if (!incident) {
            return res.status(404).send('Incidència no trobada');
        }

        // Hauràs de crear la vista: src/views/incidents/detail.ejs
        res.render('incidents/detail', { incident });

    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.status(500).send('Error al recuperar el detall de la incidència');
    }
});

// --- Opcional: Afegir un comentari ---
// (POST /incidents/:id/comments)
router.post('/:id/comments', async (req, res) => {
    try {
        const incidentId = req.params.id;
        const { text, userId } = req.body; // Necessites saber qui fa el comentari (p.ex., usuari logat) i el text

        if (!text || !userId) {
            // Redirigir amb error
            return res.redirect(`/incidents/${incidentId}?error=` + encodeURIComponent('Falta text o usuari pel comentari.'));
        }

        // Verificar que la incidència existeix
        const incident = await Incident.findByPk(incidentId);
        if (!incident) {
            return res.status(404).send('Incidència no trobada per comentar');
        }

        // Crear el comentari
        await Comment.create({
            text,
            incidentId,
            userId
        });

        // Redirigir de nou al detall de la incidència
        res.redirect(`/incidents/${incidentId}`);

    } catch (error) {
        console.error("Error al afegir comentari:", error);
        res.redirect(`/incidents/${req.params.id}?error=` + encodeURIComponent('Error al guardar el comentari.'));
    }
});


module.exports = router;