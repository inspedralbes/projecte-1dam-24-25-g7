// src/routes/IncidenciasEJS.routes.js
const express = require('express');
const router = express.Router();
// Importa els models necessaris des de db.js (assumint l'exportació conjunta)
const { Incidencia, Tecnic, Actuacions, Departament, Comentari } = require('../db');

// Llistar incidències (GET /Incidencias)
router.get('/', async (req, res) => {
    try {
        // Inclou els models relacionats per mostrar noms en lloc d'IDs
        const Incidencias = await Incidencia.findAll({
            include: [
                { model: Tecnic, as: 'reporter', attributes: ['id', 'Tecnicname', 'firstName', 'lastName'] }, // Qui la va reportar
                { model: Tecnic, as: 'assignedTecnic', attributes: ['id', 'Tecnicname', 'firstName', 'lastName'] }, // A qui està assignada (pot ser null)
                { model: Actuacions, attributes: ['id', 'Date','Descripcio','TempsInvertit', 'Resolució'] }, // Nom de l'estat
                { model: Departament, attributes: ['id', 'name', 'level'] } 
            ],
            order: [['createdAt', 'DESC']] // Ordena per data de creació, les més noves primer
        });
        // Hauràs de crear la vista: src/views/Incidencias/list.ejs
        res.render('Incidencias/list', { Incidencias });
    } catch (error) {
        console.error("Error al recuperar incidències:", error);
        res.status(500).send('Error al recuperar incidències' + error.message);
    }
});

// Form per crear una incidència (GET /Incidencias/new)
router.get('/new', async (req, res) => {
    try {
        // Necessitem obtenir tots els usuaris, estats i prioritats per als desplegables del formulari
        const departaments = await Departament.findAll(); 
        
        // Hauràs de crear la vista: src/views/Incidencias/new.ejs
        res.render('Incidencias/new', { departaments });
    } catch (error) {
        console.error("Error al carregar el formulari de nova incidència:", error);
        res.status(500).send('Error al carregar el formulari de nova incidència' + error.message);
    }
});

// Crear incidència (POST /Incidencias/create)
router.post('/create', async (req, res) => {
    try {
        // Recollim les dades del formulari
        // Assegura't que els 'name' dels inputs al formulari coincideixen: title, description, reporterTecnicId, assignedTecnicId, ActuacionsId, DepartamentId
        const { title, description, DepartamentId} = req.body;

     

        // Crear la incidència a la BD
        await Incidencia.create({
            title,
            description,            
            DepartamentId
            
        }); //miaufdgzdfgzgzgfzdf

        res.redirect('/'); // Torna al llistat d'incidències
    } catch (error) {
        console.error("Error al crear la incidència:", error);
        // Hauries d'afegir una gestió d'errors més robusta, potser redirigint al formulari amb un missatge
        res.status(500).send('Error al crear la incidència'+ error.message);
    }
});

// Form per editar una incidència (GET /Incidencias/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        // Obtenim la incidència específica i també les llistes per als desplegables
        const [Incidencia, Tecnics, Actuacions, departments] = await Promise.all([
            Incidencia.findByPk(IncidenciaId), // No cal incloure relacions aquí si només volem els IDs per al formulari
            Tecnic.findAll({ order: [['Tecnicname', 'ASC']] }),
            Actuacions.findAll({ order: [['name', 'ASC']] }),
            Departament.findAll({ order: [['level', 'ASC']] })
        ]);

        if (!Incidencia) {
            return res.status(404).send('Incidència no trobada');
        }

        // Hauràs de crear la vista: src/views/Incidencias/edit.ejs
        res.render('Incidencias/edit', { Incidencia, Tecnics, Actuacions, departments });
    } catch (error) {
        console.error("Error al carregar el formulari d'edició:", error);
        res.status(500).send("Error al carregar el formulari d'edició");
    }
});

// Actualitzar incidència (POST /Incidencias/:id/update)
router.post('/:id/update', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        // Recollim dades del formulari d'edició
        const { title, description, reporterTecnicId, assignedTecnicId, ActuacionsId, DepartamentId } = req.body;

         // Validació bàsica
        if (!title || !description || !reporterTecnicId || !ActuacionsId || !DepartamentId) {
           return res.status(400).send('Falten camps obligatoris.');
        }

        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.status(404).send('Incidència no trobada per actualitzar');
        }

        // Actualitzem els camps de la incidència
        Incidencia.title = title;
        Incidencia.description = description;
        Incidencia.reporterTecnicId = reporterTecnicId;
        Incidencia.assignedTecnicId = assignedTecnicId || null;
        Incidencia.ActuacionsId = ActuacionsId;
        Incidencia.DepartamentId = DepartamentId;
        // Podríem actualitzar resolutionDate si l'estat canvia a 'Resolved' o 'Closed'
        // if (/* Actuacions és Resolved/Closed */) { Incidencia.resolutionDate = new Date(); } else { Incidencia.resolutionDate = null; }

        // Guardem els canvis
        await Incidencia.save();

        res.redirect('/Incidencias'); // Redirigim al llistat
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
        res.status(500).send('Error al actualitzar la incidència');
    }
});

// Eliminar incidència (Canviat a POST per seguretat)
// Necessitaràs un petit formulari a la vista list.ejs per enviar un POST a aquesta ruta
router.post('/:id/delete', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.status(404).send('Incidència no trobada per eliminar');
        }

        // Abans d'eliminar la incidència, podríem eliminar els comentaris associats
        // O configurar 'onDelete: CASCADE' a la relació Incidencia.hasMany(Comentari)
        await Comentari.destroy({ where: { IncidenciaId: IncidenciaId } }); // Eliminació manual de comentaris

        // Ara eliminem la incidència
        await Incidencia.destroy();

        res.redirect('/Incidencias'); // Redirigim al llistat
    } catch (error) {
        console.error("Error al eliminar la incidència:", error);
        res.status(500).send('Error al eliminar la incidència');
    }
});


// --- Opcional: Detall d'una incidència amb comentaris ---
// (GET /Incidencias/:id)
router.get('/:id', async (req, res) => {
    try {
        const Incidencia = await Incidencia.findByPk(req.params.id, {
            include: [
                { model: Tecnic, as: 'reporter', attributes: ['id', 'Tecnicname', 'firstName', 'lastName'] },
                { model: Tecnic, as: 'assignedTecnic', attributes: ['id', 'Tecnicname', 'firstName', 'lastName'] },
                { model: Actuacions, attributes: ['id', 'Date','Descripcio','TempsInvertit', 'Resolució'] },
                { model: Departament, attributes: ['id', 'name', 'level'] },
                {
                    model: Comentari,
                    include: [{ model: Tecnic, attributes: ['id', 'Tecnicname', 'firstName', 'lastName'] }], // Qui va fer el comentari
                    order: [['createdAt', 'ASC']] // Comentaris en ordre cronològic
                }
            ]
        });

        if (!Incidencia) {
            return res.status(404).send('Incidència no trobada');
        }

        // Hauràs de crear la vista: src/views/Incidencias/detail.ejs
        res.render('Incidencias/detail', { Incidencia });

    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.status(500).send('Error al recuperar el detall de la incidència');
    }
});

// --- Opcional: Afegir un comentari ---
// (POST /Incidencias/:id/Comentaris)
router.post('/:id/Comentaris', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        const { text, TecnicId } = req.body; // Necessites saber qui fa el comentari (p.ex., usuari logat) i el text

        if (!text || !TecnicId) {
            // Redirigir amb error
            return res.redirect(`/Incidencias/${IncidenciaId}?error=` + encodeURIComponent('Falta text o usuari pel comentari.'));
        }

        // Verificar que la incidència existeix
        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.status(404).send('Incidència no trobada per comentar');
        }

        // Crear el comentari
        await Comentari.create({
            text,
            IncidenciaId,
            TecnicId
        });

        // Redirigir de nou al detall de la incidència
        res.redirect(`/Incidencias/${IncidenciaId}`);

    } catch (error) {
        console.error("Error al afegir comentari:", error);
        res.redirect(`/Incidencias/${req.params.id}?error=` + encodeURIComponent('Error al guardar el comentari.'));
    }
});

//h
module.exports = router;