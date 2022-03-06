const { DataTypes } = require('sequelize');
const db = require('../db/configDB')

const Customer = db.define('Customer', {
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
}, {
  tableName: 'customers', // table name
  timestamps: false // skip custom timestamp columns
});

async function init() {
  await db.sync();
}

init();

module.exports = Customer;