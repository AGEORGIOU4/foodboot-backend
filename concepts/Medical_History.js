const {DataTypes} = require('sequelize');
const {sequelize} = require('../db/configDB');
const db = sequelize();

const Medical_History = db.define('Medical_History', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        require: true,
        autoIncrement: true,
    },
    client_id: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        unique: true
    },
    height: {
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'medical_history', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Medical_History;
