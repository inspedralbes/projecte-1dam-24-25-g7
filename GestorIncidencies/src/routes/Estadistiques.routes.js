// src/routes/Estadistiques.routes.js
const express = require('express');
const router = express.Router();
const RegistreAcces = require('../models_mongodb/RegistreAcces');


router.get('/accessos', async (req, res) => {
    try {
        const { dataInici, dataFi, rutaFilter } = req.query;

        let filtreMongo = {};

        if (dataInici || dataFi) {
            filtreMongo.timestamp = {};
            if (dataInici) {
                let inici = new Date(dataInici);
                inici.setHours(0, 0, 0, 0);
                filtreMongo.timestamp.$gte = inici; 
            }
            if (dataFi) {
                let fi = new Date(dataFi);
                fi.setHours(23, 59, 59, 999);
                filtreMongo.timestamp.$lte = fi;
            }
        }
        if (rutaFilter && rutaFilter.trim() !== "") {
            filtreMongo.ruta = { $regex: rutaFilter.trim(), $options: "i" }; 
        }

       
        const totalAccessos = await RegistreAcces.countDocuments(filtreMongo);
        const ultimsAccessos = await RegistreAcces.find(filtreMongo)
            .sort({ timestamp: -1 })
            .limit(50);
        const pipelinePagines = [];
        if (Object.keys(filtreMongo).length > 0) { 
            pipelinePagines.push({ $match: filtreMongo });
        }
        pipelinePagines.push(
            { $group: { _id: "$ruta", comptador: { $sum: 1 } } },
            { $sort: { comptador: -1 } },
            { $limit: 10 }
        );
        const paginesMesVisitades = await RegistreAcces.aggregate(pipelinePagines);

        res.render('estadistiques/panel_accessos', {
            title: "Estadístiques d'Accés",
            totalAccessos,
            ultimsAccessos,
            paginesMesVisitades,
            queryParams: req.query 
        });

    } catch (err) {
        console.error("Error en obtenir estadístiques d'accés:", err);
        res.status(500).send("Error en carregar les estadístiques d'accés.");
    }
});

module.exports = router;