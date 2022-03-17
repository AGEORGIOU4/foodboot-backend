const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Food_Preference = db.define('Food_Preference', {
    client_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'food_preferences', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Food_Preference;
