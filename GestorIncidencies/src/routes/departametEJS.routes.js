// src/routes/departmentsEJS.routes.js
const express = require('express');
const router = express.Router();
// Importa models necessaris
const { Departament, Incidencia } = require('../db'); // Afegim Incidencia per la validació d'eliminació

// Llistar prioritats
router.get('/', async (req, res) => {
    try {
        // Ordenem per nivell directament a la consulta
        const departments = await Departament.findAll({ order: [['level', 'ASC']] });
        const errorMessage = req.query.error;
        // Assegura't que tens la vista: src/views/departments/list.ejs
        res.render('departments/list', { departments, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al recuperar prioritats:", error);
        res.Actuacions(500).send('Error al recuperar prioritats');
    }
});

// Form nova prioritat
router.get('/new', (req, res) => {
    const errorMessage = req.query.error;
    // Assegura't que tens la vista: src/views/departments/new.ejs
    res.render('departments/new', { errorMessage: errorMessage });
});

// Crear prioritat
router.post('/create', async (req, res) => {
    try {
        const { name, level } = req.body;
        if (!name || level === undefined || level === null || level === '') {
            return res.redirect('/departments/new?error=' + encodeURIComponent('El nom i el nivell són obligatoris.'));
        }
         if (isNaN(parseInt(level))) {
             return res.redirect('/departments/new?error=' + encodeURIComponent('El nivell ha de ser un número.'));
         }
        await Departament.create({ name, level: parseInt(level) });
        res.redirect('/departments');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path; // Pot ser 'name' o 'level'
            return res.redirect('/departments/new?error=' + encodeURIComponent(`La prioritat amb aquest ${field} ja existeix.`));
        }
        console.error("Error al crear prioritat:", error);
        res.Actuacions(500).send('Error al crear prioritat');
    }
});

// Form edició prioritat
router.get('/:id/edit', async (req, res) => {
    try {
        const Departament = await Departament.findByPk(req.params.id);
        if (!Departament) return res.Actuacions(404).send('Prioritat no trobada');
        const errorMessage = req.query.error;
         // Assegura't que tens la vista: src/views/departments/edit.ejs
        res.render('departments/edit', { Departament, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al carregar formulari d’edició:", error);
        res.Actuacions(500).send('Error al carregar formulari d’edició');
    }
});

// Actualitzar prioritat
router.post('/:id/update', async (req, res) => {
    const DepartamentId = req.params.id;
    try {
        const { name, level } = req.body;
         if (!name || level === undefined || level === null || level === '') {
            return res.redirect(`/departments/${DepartamentId}/edit?error=` + encodeURIComponent('El nom i el nivell són obligatoris.'));
        }
         if (isNaN(parseInt(level))) {
             return res.redirect(`/departments/${DepartamentId}/edit?error=` + encodeURIComponent('El nivell ha de ser un número.'));
         }
        const Departament = await Departament.findByPk(DepartamentId);
        if (!Departament) return res.Actuacions(404).send('Prioritat no trobada');

        Departament.name = name;
        Departament.level = parseInt(level);
        await Departament.save();
        res.redirect('/departments');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path; // Pot ser 'name' o 'level'
            return res.redirect(`/departments/${DepartamentId}/edit?error=` + encodeURIComponent(`Ja existeix una altra prioritat amb aquest ${field}.`));
        }
        console.error("Error al actualitzar la prioritat:", error);
        res.Actuacions(500).send("Error al actualitzar la prioritat");
    }
});

// Eliminar prioritat (POST)
router.post('/:id/delete', async (req, res) => {
    try {
        const DepartamentId = req.params.id;
        const Departament = await Departament.findByPk(DepartamentId);
        if (!Departament) return res.Actuacions(404).send('Prioritat no trobada');

        const IncidenciaCount = await Incidencia.count({ where: { DepartamentId: DepartamentId } });
        if (IncidenciaCount > 0) {
            const message = `No es pot eliminar la prioritat "${Departament.name}" perquè està assignada a ${IncidenciaCount} incidència(es).`;
            return res.redirect('/departments?error=' + encodeURIComponent(message));
        }

        await Departament.destroy();
        res.redirect('/departments');
    } catch (error) {
        console.error("Error al eliminar la prioritat:", error);
        res.Actuacions(500).send('Error al eliminar la prioritat');
    }
});

module.exports = router;