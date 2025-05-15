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
                    as: 'Incidencia',
                    attributes: [ 'id', 'descripcio', 'resolta', 'prioritat'],
                    required: false
                },
                { 
                    model: Tecnic, 
                    attributes: ['id', 'nom'],
                    required: false 
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        console.log("---------- LLISTA D'ACTUACIONS (/actuacions) - Amb as: 'Incidencia' ----------");
        if (actuacionsList.length > 0) {
            actuacionsList.forEach(act => {
                console.log("Actuació ID:", act.id, "- ID Incidència guardat a la BD:", act.idIncidencia);
                if (act.Incidencia) {
                    console.log("  Dades de act.Incidencia:", act.Incidencia.toJSON());
                } else {
                    console.log("  act.Incidencia ÉS NULL o UNDEFINED");
                }
                if (act.Tecnic) {
                    console.log("  Tècnic de l'actuació:", act.Tecnic.toJSON());
                } else {
                    console.log("  Tècnic de l'actuació: NULL o UNDEFINED");
                }
            });
        } else {
            console.log("No s'han trobat actuacions.");
        }
        console.log("--------------------------------------------------------------------------");

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

        console.log("---------- CREAR ACTUACIÓ (POST /actuacions/create) ----------");
        console.log("Dades rebudes del formulari (req.body):", req.body);
        console.log("ID Incidència rebut:", idIncidencia, "- Tipus:", typeof idIncidencia);
        
        if (!descripcio_actuacio || descripcio_actuacio.trim() === "") {
            return res.redirect('/actuacions/new?error=' + encodeURIComponent('La descripció de l\'actuació és obligatòria.'));
        }
        if (!idIncidencia || idIncidencia.trim() === "" || isNaN(parseInt(idIncidencia))) {
            console.error("Error en POST /create: idIncidencia no rebut, és buit o no és un número:", idIncidencia);
            return res.redirect('/actuacions/new?error=' + encodeURIComponent('Cal seleccionar una incidència vàlida.'));
        }

        const novaActuacio = await Actuacio.create({
            descripcio: descripcio_actuacio.trim(),
            temps: temps_actuacio && !isNaN(parseInt(temps_actuacio)) ? parseInt(temps_actuacio) : null,
            visible: Boolean(visible_actuacio),
            idTecnic: idTecnic && idTecnic.trim() !== "" && !isNaN(parseInt(idTecnic)) ? parseInt(idTecnic) : null,
            idIncidencia: parseInt(idIncidencia) // Aquí es desa la FK
        });
        
        console.log("Actuació creada amb ID:", novaActuacio.id, "i guardant idIncidencia:", novaActuacio.idIncidencia);
        console.log("-----------------------------------------------------------");

        res.redirect('/actuacions');
    } catch (error) {
        console.error("Error al crear l'actuació:", error);
        console.error("Dades que van causar l'error de creació:", req.body);
        console.error("--------------------------------------------------");
        res.status(500).send(`Error al crear l'actuació: ${error.message}`);
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const actuacio = await Actuacio.findByPk(req.params.id);
        if (!actuacio) {
            return res.status(404).send('Actuació no trobada');
        }
        const incidencias = await Incidencia.findAll({ attributes: ['id', 'descripcio'], order: [['id', 'ASC']] });
        const tecnics = await Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });
        const errorMessage = req.query.error;
        res.render('actuacions/edit', { actuacio, incidencias, tecnics, errorMessage });
    } catch (error) {
        console.error("Error al carregar formulari d'edició d'actuació:", error);
        res.status(500).send(`Error al carregar formulari d'edició d'actuació: ${error.message}`);
    }
});

router.post('/:id/update', async (req, res) => {
    const actuacioId = req.params.id;
    try {
        const { descripcio_actuacio, temps_actuacio, visible_actuacio, idTecnic, idIncidencia } = req.body;
        console.log("---------- ACTUALITZAR ACTUACIÓ (POST /actuacions/:id/update) ----------");
        console.log("ID Actuació a actualitzar:", actuacioId);
        console.log("Dades rebudes del formulari (req.body):", req.body);
        console.log("ID Incidència rebut:", idIncidencia, "- Tipus:", typeof idIncidencia);

        if (!descripcio_actuacio || descripcio_actuacio.trim() === "") {
            return res.redirect(`/actuacions/${actuacioId}/edit?error=` + encodeURIComponent('La descripció de l\'actuació és obligatòria.'));
        }
        if (!idIncidencia || idIncidencia.trim() === "" || isNaN(parseInt(idIncidencia))) {
            console.error(`Error en POST /${actuacioId}/update: idIncidencia no rebut, és buit o no és un número:`, idIncidencia);
            return res.redirect(`/actuacions/${actuacioId}/edit?error=` + encodeURIComponent('Cal seleccionar una incidència vàlida.'));
        }

        const actuacio = await Actuacio.findByPk(actuacioId);
        if (!actuacio) {
            return res.status(404).send('Actuació no trobada per actualitzar');
        }

        actuacio.descripcio = descripcio_actuacio.trim();
        actuacio.temps = temps_actuacio && !isNaN(parseInt(temps_actuacio)) ? parseInt(temps_actuacio) : null;
        actuacio.visible = Boolean(visible_actuacio);
        actuacio.idTecnic = idTecnic && idTecnic.trim() !== "" && !isNaN(parseInt(idTecnic)) ? parseInt(idTecnic) : null;
        actuacio.idIncidencia = parseInt(idIncidencia); // Aquí es desa/actualitza la FK

        await actuacio.save();
        console.log("Actuació actualitzada ID:", actuacio.id, "amb nou idIncidencia:", actuacio.idIncidencia);
        console.log("-----------------------------------------------------------------------");
        res.redirect('/actuacions');
    } catch (error) {
        console.error(`Error al actualitzar l'actuació ${actuacioId}:`, error);
        console.error("Dades que van causar l'error d'actualització:", req.body);
        console.error("--------------------------------------------------");
        res.status(500).send(`Error al actualitzar l'actuació: ${error.message}`);
    }
});

module.exports = router;