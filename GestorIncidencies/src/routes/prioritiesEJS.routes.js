// src/routes/prioritiesEJS.routes.js
const express = require('express');
const router = express.Router();
// Importa models necessaris
const { Priority, Incident } = require('../db'); // Afegim Incident per la validació d'eliminació

// Llistar prioritats
router.get('/', async (req, res) => {
    try {
        // Ordenem per nivell directament a la consulta
        const priorities = await Priority.findAll({ order: [['level', 'ASC']] });
        const errorMessage = req.query.error;
        // Assegura't que tens la vista: src/views/priorities/list.ejs
        res.render('priorities/list', { priorities, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al recuperar prioritats:", error);
        res.status(500).send('Error al recuperar prioritats');
    }
});

// Form nova prioritat
router.get('/new', (req, res) => {
    const errorMessage = req.query.error;
    // Assegura't que tens la vista: src/views/priorities/new.ejs
    res.render('priorities/new', { errorMessage: errorMessage });
});

// Crear prioritat
router.post('/create', async (req, res) => {
    try {
        const { name, level } = req.body;
        if (!name || level === undefined || level === null || level === '') {
            return res.redirect('/priorities/new?error=' + encodeURIComponent('El nom i el nivell són obligatoris.'));
        }
         if (isNaN(parseInt(level))) {
             return res.redirect('/priorities/new?error=' + encodeURIComponent('El nivell ha de ser un número.'));
         }
        await Priority.create({ name, level: parseInt(level) });
        res.redirect('/priorities');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path; // Pot ser 'name' o 'level'
            return res.redirect('/priorities/new?error=' + encodeURIComponent(`La prioritat amb aquest ${field} ja existeix.`));
        }
        console.error("Error al crear prioritat:", error);
        res.status(500).send('Error al crear prioritat');
    }
});

// Form edició prioritat
router.get('/:id/edit', async (req, res) => {
    try {
        const priority = await Priority.findByPk(req.params.id);
        if (!priority) return res.status(404).send('Prioritat no trobada');
        const errorMessage = req.query.error;
         // Assegura't que tens la vista: src/views/priorities/edit.ejs
        res.render('priorities/edit', { priority, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al carregar formulari d’edició:", error);
        res.status(500).send('Error al carregar formulari d’edició');
    }
});

// Actualitzar prioritat
router.post('/:id/update', async (req, res) => {
    const priorityId = req.params.id;
    try {
        const { name, level } = req.body;
         if (!name || level === undefined || level === null || level === '') {
            return res.redirect(`/priorities/${priorityId}/edit?error=` + encodeURIComponent('El nom i el nivell són obligatoris.'));
        }
         if (isNaN(parseInt(level))) {
             return res.redirect(`/priorities/${priorityId}/edit?error=` + encodeURIComponent('El nivell ha de ser un número.'));
         }
        const priority = await Priority.findByPk(priorityId);
        if (!priority) return res.status(404).send('Prioritat no trobada');

        priority.name = name;
        priority.level = parseInt(level);
        await priority.save();
        res.redirect('/priorities');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path; // Pot ser 'name' o 'level'
            return res.redirect(`/priorities/${priorityId}/edit?error=` + encodeURIComponent(`Ja existeix una altra prioritat amb aquest ${field}.`));
        }
        console.error("Error al actualitzar la prioritat:", error);
        res.status(500).send("Error al actualitzar la prioritat");
    }
});

// Eliminar prioritat (POST)
router.post('/:id/delete', async (req, res) => {
    try {
        const priorityId = req.params.id;
        const priority = await Priority.findByPk(priorityId);
        if (!priority) return res.status(404).send('Prioritat no trobada');

        const incidentCount = await Incident.count({ where: { priorityId: priorityId } });
        if (incidentCount > 0) {
            const message = `No es pot eliminar la prioritat "${priority.name}" perquè està assignada a ${incidentCount} incidència(es).`;
            return res.redirect('/priorities?error=' + encodeURIComponent(message));
        }

        await priority.destroy();
        res.redirect('/priorities');
    } catch (error) {
        console.error("Error al eliminar la prioritat:", error);
        res.status(500).send('Error al eliminar la prioritat');
    }
});

module.exports = router;