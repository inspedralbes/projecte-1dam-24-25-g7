
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Actuacions = sequelize.define('Actuacions', {
 

  description: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  
  Temps: { 
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  Visible: { 
    type: DataTypes.BOOLEAN,
    allowNull: true, 
  },

  idTecnic: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Actuacions',
  timestamps: true,
});


module.exports = Actuacions;