const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Food_Option = db.define('Food_Option', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        require: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.STRING,
        require: true,
        allowNull:false,
        unique: true
    },
    text: {
        type: DataTypes.STRING,
        require: true,
        allowNull:false,
        unique: true
    },
    label: {
        type: DataTypes.STRING,
        require: true,
        allowNull:false,
        unique: true
    },
}, {
    tableName: 'food_options', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Food_Option;
