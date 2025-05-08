
const express = require('express');
const router = express.Router();
const { Incidencia, Tecnic, Actuacions, Departament                                                             } = require('../db');

// Llistar incidències (GET /Incidencias)
router.get('/', async (req, res) => {
    try {
        const Incidencia = await Incidencia.findAll({
            include: [
                { model: Tecnic,attributes: ['idTecnic', 'nom'] }, 
                { model: Incidencia, attributes: ['id', 'description', 'DepartamentId', 'Resolta'] },
                { model: Actuacions, attributes: ['idActuacio','description','DepartamentId','Resolta']}, 
                { model: Departament, attributes: ['id', 'name', 'level'] } 
            ],
            order: [['createdAt', 'DESC']] 
        });
        res.render('Incidencias/list', { Incidencia });
    } catch (error) {
        console.error("Error al recuperar incidències:", error);
        res.status(500).send(`Error al recuperar la incidencia: ${error.message}`);
    }
});

// Form per crear una incidència (GET /Incidencias/new)
router.get('/new', async (req, res) => {
    try {
        
        const [Tecnics, Actuacions, departments, Incidencia ] = await Incidencia.findAll([
            Tecnic.findAll({ order: [['nom', 'ASC']] }),
            Actuacions.findAll({ order: [['name', 'ASC']] }),
            Departament.findAll({ order: [['level', 'ASC']] }),
            Incidencia.findAll({order: [['id','ASC']]})
        ]);
       
        res.render('Incidencias/new', { Tecnics, Actuacions, departments, Incidencia});
    } catch (error) {
        console.error("Error al carregar el formulari de nova incidència:", error);
        res.status(500).send(`Error al carregar la incidencia: ${error.message}`);
    }
});

// Crear incidència (POST /Incidencias/create)
router.post('/create', async (req, res) => {
    try {
        const { id, description,DepartamentId,Resolta } = req.body;

        await Incidencia.create({
            id, 
            description,
            DepartamentId,
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
        const [Incidencia, Tecnics, Actuacions, departments] = await Promise.all([
            Incidencia.findByPk(IncidenciaId), 
            Tecnic.findAll({ order: [['nom', 'ASC']] }),
            Actuacions.findAll({ order: [['name', 'ASC']] }),
            Departament.findAll({ order: [['level', 'ASC']] })
        ]);

        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada');
        }

        res.render('Incidencias/edit', { Incidencia, Tecnics, Actuacions, departments });
    } catch (error) {
        console.error("Error al carregar el formulari d'edició:", error);
        res.Actuacions(500).send("Error al carregar el formulari d'edició");
    }
});

router.post('/:id/update', async (req, res) => {
    try {
        const IncidenciaId = req.params.id;

        const { title, description, reporterTecnicId, assignedTecnicId, ActuacionsId, DepartamentId } = req.body;

        const Incidencia = await Incidencia.findByPk(IncidenciaId);
        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada per actualitzar');
        }


        Incidencia.id = id;
        Incidencia.description = description;
        Incidencia.Resolta = Resolta;
        Incidencia.DepartamentId = DepartamentId;
    
        await Incidencia.save();

        res.redirect('/Incidencias');
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
        res.Actuacions(500).send('Error al actualitzar la incidència');
    }
});

// Eliminar incidència (Canviat a POST per seguretat)
// Necessitaràs un petit formulari a la vista list.ejs per enviar un POST a aquesta ruta
router.post('/:id/delete', async (req, res) => {
    try {
        const Id = req.params.id;
        const Incidencia = await Incidencia.findByPk(Id);
        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada per eliminar');
        }

        res.redirect('/Incidencias'); 
    } catch (error) {
        console.error("Error al eliminar la incidència:", error);
        res.Actuacions(500).send('Error al eliminar la incidència');
    }
});


// (GET /Incidencias/:id)
router.get('/:id', async (req, res) => {
    try {
        const Incidencia = await Incidencia.findByPk(req.params.id, {
            include: [
                { model: Tecnic, as: 'reporter', attributes: ['id', 'nom', 'firstName', 'lastName'] },
                { model: Tecnic, as: 'assignedTecnic', attributes: ['id', 'nom', 'firstName', 'lastName'] },
                { model: Actuacions, attributes: ['id', 'Date','Descripcio','TempsInvertit', 'Resolució'] },
                { model: Departament, attributes: ['id', 'name', 'level'] },
            
            ]
        });

        if (!Incidencia) {
            return res.Actuacions(404).send('Incidència no trobada');
        }

        
        res.render('Incidencias/detail', { Incidencia });

    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.Actuacions(500).send('Error al recuperar el detall de la incidència');
    }
});



module.exports = router;