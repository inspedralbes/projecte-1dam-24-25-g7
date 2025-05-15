// src/routes/ActuacionsEJS.routes.js
const express = require('express');
const router = express.Router();

const Incidencia = require('../models/Incidencia');
const Departament = require('../models/Departament');
const Tecnic = require('../models/Tecnic');
const Actuacio = require('../models/Actuacio');

router.get('/', async (req, res) => {
    try {
        const actuacionsList = await Actuacio.findAll({
            include: [
                {
                    model: Incidencia,
                    attributes: [ 'descripcio', 'resolta', 'prioritat'],
                    include: [
                        { model: Departament, attributes: ['id', 'nom'] },
                        { model: Tecnic, attributes: ['id', 'nom'] }
                    ]
                },
                { model: Tecnic, attributes: ['id', 'nom'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('actuacions/list', { actuacions: actuacionsList });
    } catch (error) {
        console.error("Error al recuperar actuacions:", error);
        res.status(500).send(`Error al recuperar actuacions: ${error.message}`);
    }
});

router.get('/new', async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll({
            attributes: ['id', 'descripcio'],
            order: [['id', 'ASC']]
        });

        const tecnics = await Tecnic.findAll({
            attributes: ['id', 'nom'],
            order: [['nom', 'ASC']]
        });
        const errorMessage = req.query.error;
        res.render('actuacions/new', { incidencias, tecnics, errorMessage });
    } catch (err) {
        console.error("Error al carregar el formulari de nova actuació:", err);
        res.status(500).send(`Error al carregar el formulari: ${err.message}`);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { descripcio_actuacio, temps_actuacio, visible_actuacio, idTecnic, idIncidencia } = req.body;

        if (!descripcio_actuacio || descripcio_actuacio.trim() === "") {
            return res.redirect('/actuacions/new?error=' + encodeURIComponent('La descripció de l\'actuació és obligatòria.'));
        }
         if (!idIncidencia) {
            return res.redirect('/actuacions/new?error=' + encodeURIComponent('Cal seleccionar una incidència.'));
        }

        await Actuacio.create({
            descripcio: descripcio_actuacio.trim(),
            temps: temps_actuacio ? parseInt(temps_actuacio) : null,
            visible: Boolean(visible_actuacio),
            idTecnic: idTecnic ? parseInt(idTecnic) : null,
            idIncidencia: parseInt(idIncidencia)
        });

        res.redirect('/actuacions');
    } catch (error) {
        console.error("Error al crear l'actuació:", error);
        res.status(500).send(`Error al crear l'actuació: ${error.message}`);
    }
});

module.exports = router;