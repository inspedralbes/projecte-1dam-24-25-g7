const express = require('express');
const router = express.Router();
const { Incidencia, Tecnic, Actuacions, Departament} = require('../app');

router.get('/', async (req, res) => {
    try {
        const actuacionsList = await Actuacions.findAll({
            include: [
                {
                    model: Incidencia,
                    attributes: [ 'description', 'Resolta', 'prioritat'],
                    include: [
                        { model: Departament, attributes: ['id', 'nom'] },
                        { model: Tecnic, attributes: ['id', 'nom'] }
                    ]
                },
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
        const [Incidencias, tecnics] = await Promise.all([
            Incidencia.findAll({ attributes: ['id', 'description'], order: [['id', 'ASC']] }),
            Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] })
        ]);
        res.render('actuacions/new', { Incidencias, tecnics });
    } catch (error) {
        console.error("Error al carregar el formulari de nova Actuacio:", error);
        res.status(500).send(`Error al carregar formulari de crear l'actuació: ${error.message}`);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { description, Temps, Visible, idTecnic, idIncidencia } = req.body;

        await Actuacions.create({
            description,
            Temps: parseInt(Temps),
            Visible: Boolean(Visible),
            idTecnic: parseInt(idTecnic),
            idIncidencia: parseInt(idIncidencia)
        });

        res.redirect('/Actuacions');
    } catch (error) {
        console.error("Error al crear l'actuació:", error);
        res.status(500).send(`Error al crear l'actuació: ${error.message}`);
    }
});


module.exports = router;