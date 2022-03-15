const { DataTypes } = require('sequelize');
const db = require('../db/configDB');

const Client = db.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    require: true,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_allergies: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'clients', // table name
  timestamps: false // skip custom timestamp columns
});

async function init() {
  await db.sync();
}

init();

module.exports = Client;