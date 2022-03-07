const { DataTypes } = require('sequelize');
const db = require('../db/configDB')

const Client = db.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    require: true,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATE,
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