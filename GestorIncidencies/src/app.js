// src/app.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./db');
const path = require('path');
const Motorcycle = require('./models/Motorcycle');
const Category = require('./models/Category');

// Relacions
Category.hasMany(Motorcycle, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Motorcycle.belongsTo(Category, { foreignKey: 'categoryId' });

// Rutes per API JSON
const motorcycleRoutes = require('./routes/motorcycles.routes');
const categoryRoutes = require('./routes/categories.routes');

// Rutes EJS
const motorcycleRoutesEJS = require('./routes/motorcyclesEJS.routes');
const categoryRoutesEJS = require('./routes/categoriesEJS.routes');

const app = express();

// Middleware per a formularis i JSON
app.use(express.urlencoded({ extended: true })); // per formularis
app.use(express.json()); // per JSON

// Configuració de fitxers estàtics
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Rutes EJS
app.use('/motorcycles', motorcycleRoutesEJS);
app.use('/categories', categoryRoutesEJS);

// Rutes API JSON
app.use('/api/motorcycles', motorcycleRoutes);
app.use('/api/categories', categoryRoutes);

// Configuració de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta de prova
app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;

(async () => {
  try {
    // Sincronització de la base de dades amb force: true per reiniciar les taules
    await sequelize.sync({ force: true });
    console.log('Base de dades sincronitzada (API JSON)');

    // Creem categories
    const catCarretera = await Category.create({ name: 'Carretera' });
    const catEnduro = await Category.create({ name: 'Enduro' });

    // Creem motos
    await Motorcycle.create({
      name: 'CBR 600 RR',
      brand: 'Honda',
      cc: 600,
      country: 'Japan',
      categoryId: catCarretera.id,
    });

    await Motorcycle.create({
      name: 'Africa Twin',
      brand: 'Honda',
      cc: 1000,
      country: 'Japan',
      categoryId: catEnduro.id,
    });

    await Motorcycle.create({
      name: 'Panigale V4',
      brand: 'Ducati',
      cc: 1103,
      country: 'italy',
      categoryId: catCarretera.id,
    });

    await Motorcycle.create({
      name: 'Street Glide',
      brand: 'Harley-Davidson',
      cc: 1745,
      country: 'usa',
      categoryId: catCarretera.id,
    });

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error a l'inici:", error);
  }
})();