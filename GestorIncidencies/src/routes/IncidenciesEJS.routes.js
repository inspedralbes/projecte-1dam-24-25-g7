// src/routes/IncidenciesEJS.routes.js
const express = require('express');
const router = express.Router();

const Incidencia = require('../models/Incidencia');
const Departament = require('../models/Departament');
const Tecnic = require('../models/Tecnic');
const Actuacio = require('../models/Actuacio');

router.get('/', async (req, res) => {
    try {
        const incidenciesList = await Incidencia.findAll({
            include: [
                { model: Tecnic, attributes: ['nom'] },
                { model: Departament, attributes: ['nom'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        const errorMessage = req.query.error;
        res.render('incidencies/list', { incidencies: incidenciesList, errorMessage });
    } catch (error) {
        console.error("Error al recuperar incidències:", error);
        res.status(500).send(`Error al recuperar les incidències: ${error.message}`);
    }
});

router.get('/new', async (req, res) => {
    try {
        const tecnics = await Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });
        const departaments = await Departament.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] }); // 'nom' si Departament usa 'nom'
        const errorMessage = req.query.error;
        res.render('incidencies/new', { tecnics, departaments, errorMessage });
    } catch (error) {
        console.error("Error al carregar el formulari de nova incidència:", error);
        res.status(500).send(`Error al carregar el formulari de nova incidència: ${error.message}`);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { descripcio_incidencia, resolta_incidencia, prioritat_incidencia, idTecnic, idDepartament } = req.body;

        if (!descripcio_incidencia || descripcio_incidencia.trim() === "") {
            return res.redirect('/incidencies/new?error=' + encodeURIComponent('La descripció és obligatòria.'));
        }
        if (!idDepartament) {
            return res.redirect('/incidencies/new?error=' + encodeURIComponent('El departament és obligatori.'));
        }

        await Incidencia.create({
            descripcio: descripcio_incidencia.trim(),
            resolta: Boolean(resolta_incidencia),
            prioritat: prioritat_incidencia || null,
            idTecnic: idTecnic ? parseInt(idTecnic) : null,
            idDepartament: parseInt(idDepartament)
        });

        res.redirect('/incidencies');
    } catch (error) {
        console.error("Error al crear la incidència:", error);
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            return res.redirect('/incidencies/new?error=' + encodeURIComponent(messages));
        }
        res.status(500).send(`Error al crear la incidència: ${error.message}`);
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const incidencia = await Incidencia.findByPk(id);
        if (!incidencia) return res.status(404).send('Incidència no trobada');

        const tecnics = await Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });
        const departaments = await Departament.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });
        const errorMessage = req.query.error;

        res.render('incidencies/edit', { incidencia, tecnics, departaments, errorMessage });
    } catch (err) {
        console.error("Error al carregar el formulari d'edició:", err);
        res.status(500).send(`Error al carregar el formulari d'edició: ${err.message}`);
    }
});

router.post('/:id/update', async (req, res) => {
    const idIncidencia = req.params.id;
    try {
        const { descripcio_incidencia, resolta_incidencia, prioritat_incidencia, idTecnic, idDepartament } = req.body;

        if (!descripcio_incidencia || descripcio_incidencia.trim() === "") {
            return res.redirect(`/incidencies/${idIncidencia}/edit?error=` + encodeURIComponent('La descripció és obligatòria.'));
        }
        if (!idDepartament) {
            return res.redirect(`/incidencies/${idIncidencia}/edit?error=` + encodeURIComponent('El departament és obligatori.'));
        }

        const incidencia = await Incidencia.findByPk(idIncidencia);
        if (!incidencia) return res.status(404).send('Incidència no trobada per actualitzar');

        incidencia.descripcio = descripcio_incidencia.trim();
        incidencia.resolta = Boolean(resolta_incidencia);
        incidencia.prioritat = prioritat_incidencia || null;
        incidencia.idTecnic = idTecnic ? parseInt(idTecnic) : null;
        incidencia.idDepartament = parseInt(idDepartament);

        await incidencia.save();
        res.redirect('/incidencies');
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
         if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            return res.redirect(`/incidencies/${idIncidencia}/edit?error=` + encodeURIComponent(messages));
        }
        res.status(500).send(`Error al actualitzar la incidència: ${error.message}`);
    }
});

router.post('/:id/delete', async (req, res) => {
    const idIncidencia = req.params.id;
    try {
        const incidencia = await Incidencia.findByPk(idIncidencia);
        if (!incidencia) return res.status(404).send('Incidència no trobada per eliminar');
        await incidencia.destroy();
        res.redirect('/incidencies');
    } catch (error) {
        console.error("Error al eliminar la incidència:", error);
        res.status(500).send(`Error al eliminar la incidència: ${error.message}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id, {
            include: [
                { model: Tecnic, attributes: ['id', 'nom'] },
                { model: Departament, attributes: ['id', 'nom'] },
                {
                    model: Actuacio,
                    as: 'Actuacions', 
                    attributes: ['id', 'descripcio', 'temps', 'visible', 'idTecnic'],
                    include: [{ model: Tecnic, attributes: ['id', 'nom'] }]
                }
            ]
        });

        if (!incidencia) return res.status(404).send('Incidència no trobada');
        res.render('incidencies/detail', { incidencia });
    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.status(500).send(`Error al recuperar el detall de la incidència: ${error.message}`);
    }
});

module.exports = router;