const express = require('express');
const router = express.Router();
const { Departament, Incidencia, Tecnic } = require('../app');

router.get('/', async (req, res) => {
    try {
        const departaments = await Departament.findAll({ order: [['nom', 'ASC']] });
        const errorMessage = req.query.error;

        res.render('departments/list', { departaments, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al recuperar departaments:", error);
        res.status(500).send('Error al recuperar departaments');
    }
});

router.get('/new', async (req, res) => {
    try {
        const tecnics = await Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });
        const errorMessage = req.query.error;
        res.render('departments/new', { tecnics, errorMessage: errorMessage });
    } catch (error) {
         console.error("Error al carregar el formulari de nou Departament:", error);
         res.status(500).send(`Error al carregar formulari de crear departament: ${error.message}`);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { nom, idTecnic } = req.body;

        if (!nom) {
            return res.redirect('/Departments/new?error=' + encodeURIComponent('El nom és obligatori.'));
        }

        await Departament.create({
            nom,
            idTecnic: idTecnic ? parseInt(idTecnic) : null
        });

        res.redirect('/Departments');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path;
            return res.redirect('/Departments/new?error=' + encodeURIComponent(`El departament amb aquest ${field} ja existeix.`));
        }
        console.error("Error al crear departament:", error);
        res.status(500).send(`Error al crear departament: ${error.message}`);
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const departament = await Departament.findByPk(req.params.id);
        const tecnics = await Tecnic.findAll({ attributes: ['id', 'nom'], order: [['nom', 'ASC']] });

        if (!departament) return res.status(404).send('Departament no trobat');

        const errorMessage = req.query.error;
        res.render('departments/edit', { departament, tecnics, errorMessage: errorMessage });
    } catch (error) {
        console.error("Error al carregar formulari d’edició de departament:", error);
        res.status(500).send(`Error al carregar formulari d’edició de departament: ${error.message}`);
    }
});

router.post('/:id/update', async (req, res) => {
    const DepartamentId = req.params.id;
    try {
        const { nom, idTecnic } = req.body;

         if (!nom) {
            return res.redirect(`/Departments/${DepartamentId}/edit?error=` + encodeURIComponent('El nom és obligatori.'));
        }

        const departament = await Departament.findByPk(DepartamentId);
        if (!departament) return res.status(404).send('Departament no trobat');

        departament.nom = nom;
        departament.idTecnic = idTecnic ? parseInt(idTecnic) : null;

        await departament.save();
        res.redirect('/Departments');
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            let field = error.errors[0].path;
            return res.redirect(`/Departments/${DepartamentId}/edit?error=` + encodeURIComponent(`Ja existeix un altre departament amb aquest ${field}.`));
        }
        console.error("Error al actualitzar el departament:", error);
        res.status(500).send(`Error al actualitzar el departament: ${error.message}`);
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        const DepartamentId = req.params.id;
        const departament = await Departament.findByPk(DepartamentId);
        if (!departament) return res.status(404).send('Departament no trobat');

        const IncidenciaCount = await Incidencia.count({ where: { idDepartament: DepartamentId } });
        if (IncidenciaCount > 0) {
            const message = `No es pot eliminar el departament "${departament.nom}" perquè està assignat a ${IncidenciaCount} incidència(es).`;
            return res.redirect('/Departments?error=' + encodeURIComponent(message));
        }

        await departament.destroy();
        res.redirect('/Departments');
    } catch (error) {
        console.error("Error al eliminar el departament:", error);
        res.status(500).send(`Error al eliminar el departament: ${error.message}`);
    }
});

module.exports = router;