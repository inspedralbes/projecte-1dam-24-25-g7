const express = require('express');
const router = express.Router();
const { Incidencia, Tecnic, Actuacions, Departament} = require('../app');

router.get('/', async (req, res) => {
    try {
        const incidencies = await Incidencia.findAll({
            include: [
                { model: Tecnic, attributes: ['id', 'nom'] },
                { model: Departament, attributes: ['id', 'nom'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log(incidencies);
        res.render('incidencias/list', { incidencies });
    } catch (error) {
        console.error("Error al recuperar incidències:", error);
        res.status(500).send(`Error al recuperar les incidències: ${error.message}`);
    }
});

router.get('/new', async (req, res) => {
    try {
        const [tecnics, departaments] = await Promise.all([
            Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] }),
            Departament.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] })
        ]);

        res.render('incidencias/new', { tecnics, departaments });
    } catch (error) {
        console.error("Error al carregar el formulari de nova incidència:", error);
        res.status(500).send(`Error al carregar el formulari de nova incidència: ${error.message}`);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { description, Resolta, prioritat, idTecnic, idDepartament } = req.body;

        await Incidencia.create({
            description,
            Resolta: Boolean(Resolta),
            prioritat,
            idTecnic: idTecnic ? parseInt(idTecnic) : null,
            idDepartament: parseInt(idDepartament)
        });

        res.redirect('/Incidencias');
    } catch (error) {
        console.error("Error al crear la incidència:", error);
        res.status(500).send(`Error al crear la incidència: ${error.message}`);
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const idIncidencia = req.params.id;
        const [incidencia, tecnics, departaments] = await Promise.all([
            Incidencia.findByPk(idIncidencia),
            Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] }),
            Departament.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] })
        ]);

        if (!incidencia) {
            return res.status(404).send('Incidència no trobada');
        }

        res.render('incidencias/edit', { incidencia, tecnics, departaments });
    } catch (error) {
        console.error("Error al carregar el formulari d'edició de incidència:", error);
        res.status(500).send(`Error al carregar el formulari d'edició de incidència: ${error.message}`);
    }
});

router.post('/:id/update', async (req, res) => {
    try {
        const idIncidencia = req.params.id;

        const { description, Resolta, prioritat, idTecnic, idDepartament } = req.body;

        const incidencia = await Incidencia.findByPk(idIncidencia);
        if (!incidencia) {
            return res.status(404).send('Incidència no trobada per actualitzar');
        }

        incidencia.description = description;
        incidencia.Resolta = Boolean(Resolta);
        incidencia.prioritat = prioritat;
        incidencia.idTecnic = idTecnic ? parseInt(idTecnic) : null;
        incidencia.idDepartament = parseInt(idDepartament);

        await incidencia.save();

        res.redirect('/Incidencias');
    } catch (error) {
        console.error("Error al actualitzar la incidència:", error);
        res.status(500).send(`Error al actualitzar la incidència: ${error.message}`);
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        const idIncidencia = req.params.id;
        const incidencia = await Incidencia.findByPk(idIncidencia);
        if (!incidencia) {
            return res.status(404).send('Incidència no trobada per eliminar');
        }

        await incidencia.destroy();

        res.redirect('/Incidencias');
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
                { model: Actuacions, attributes: ['id', 'description', 'Temps', 'Visible', 'idTecnic'] }
            ]
        });

        if (!incidencia) {
            return res.status(404).send('Incidència no trobada');
        }

        res.render('incidencias/detail', { incidencia });

    } catch (error) {
        console.error("Error al recuperar el detall de la incidència:", error);
        res.status(500).send(`Error al recuperar el detall de la incidència: ${error.message}`);
    }
});


module.exports = router;