const { DataTypes } = require('sequelize');
const { sequelize } = require('../app');

const Departament = sequelize.define('Departament', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: 'Departaments',
  timestamps: false,
});

module.exports = Departament;