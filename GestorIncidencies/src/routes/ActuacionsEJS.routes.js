
const express = require('express');
const router = express.Router();
const { Incidencia, Tecnic, Actuacions, Departament} = require('../db');

router.get('/', async (req, res) => {
    try {
        const Actuacions = await Actuacions.findAll({
            include: [
                { model: Tecnic, as: 'reporter', attributes: ['idTecnic', ]},  
                { model: Actuacions, attributes: ['Date','Descripcio','TempsInvertit', 'Resolució'] }, 
                { model: Departament, attributes: ['name', 'level'] },
                {model: Incidencia, attributes: [ 'description', 'DepartamentId','Resolta']}
            ],
            order: [['createdAt', 'DESC']] 
        });
        
        res.render('Actuacions/list', { Incidencias });
    } catch (error) {
        console.error("Error al recuperar Actuacions:", error);
        res.status(500).send(`Error al recuperar actuacions: ${error.message}`);
    }
});

// Form per crear una Actuacio (GET /Actuacions/new)
router.get('/new', async (req, res) => {
    try {
        const [Tecnics, Actuacions, Departament] = await Promise.all([
            Tecnic.findAll({ order: [['nom', 'ASC']] }),
            Actuacions.findAll({ order: [['name', 'ASC']] }),
            Departament.findAll({ order: [['level', 'ASC']] }) // Ordenem per nivell
        ]);
        res.render('Actuacions/new', { Tecnics, Actuacions, Departament });
    } catch (error) {
        console.error("Error al carregar el formulari de nova Actuacio:", error);
        res.status(500).send(`Error al carregar formulari de crear la incidencia: ${error.message}`);
    }
});

// Crear incidència (POST /Incidencias/create)
router.post('/create', async (req, res) => {
    try {
        const { description, Resolta } = req.body;

        await Incidencia.create({
            description,
            Resolta
        });

        res.redirect('/Incidencias'); 
    } catch (error) {
        console.error("Error al crear la incidència:", error);
        res.status(500).send(`Error al crear la incidencia: ${error.message}`);
    }
});

// Form per editar una incidència (GET /Incidencias/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        const [Incidencia, Tecnics, Actuacions, Departament] = await Promise.all([
            Incidencia.findByPk(IncidenciaId), 
            Tecnic.findAll({ order: [['nom', 'ASC']] }),
            Actuacions.findAll({ order: [['name', 'ASC']] }),
            Departament.findAll({ order: [['level', 'ASC']] })
        ]);

        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada');
        }

        res.render('Incidencias/edit', { Incidencia, Tecnics, Actuacions, Departament });
    } catch (error) {
        console.error("Error al carregar el formulari d'edició:", error);
        res.status(500).send(`Error al carregar el formulari d'edició: ${error.message}`);
    }
});

// Actualitzar incidència (POST /Incidencias/:id/update)
router.post('/:id/update', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        const { description, DepartamentId, Resolta  } = req.body;

        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada per actualitzar');
        }

        id, description, DepartamentId, Resolta 
        Incidencia.description = description;
        Incidencia.DepartamentId = DepartamentId;
        Incidencia.Resolta = Resolta;
        
        await Incidencia.save();

        res.redirect('/Incidencias'); 
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
        res.status(500).send(`Error al actualitzar la incidencia: ${error.message}`);
    }
});

// Eliminar incidència (Canviat a POST per seguretat)
// Necessitaràs un petit formulari a la vista list.ejs per enviar un POST a aquesta ruta
router.post('/:id/delete', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;
        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada per eliminar');
        }

        res.redirect('/Incidencias'); 
    } catch (error) {
        console.error("Error al eliminar la incidència:", error);
        res.Actuacions(500).send('Error al eliminar la incidència');
    }
});

-
// (GET /Incidencias/:id)
router.get('/:id', async (req, res) => {
    try {
        const Incidencia = await Incidencia.findByPk(req.params.id, {
            include: [
                { model: Tecnic, as: 'reporter', attributes: ['idTecnic', 'nom'] },
                { model: Actuacions, attributes: ['idActuacio,descripcio,Temps,Visible,idTecnic'] },
                { model: Departament, attributes: ['id', 'nom'] },
            
            ]
        });

        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada');
        }

        res.render('Incidencias/detail', { Incidencia });

    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.status(500).send(`Error al recuperar el detall de la incidencia: ${error.message}`);
    }
});


module.exports = router;