const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Meal_Plan = db.define('Meal_Plan', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        require: true,
        autoIncrement: true,
    },
    client_id: {
        type: DataTypes.INTEGER,
        require: true,
        unique: true
    },
    client_first_name: {
        type: DataTypes.STRING,
        require: true,
    },
    client_last_name: {
        type: DataTypes.STRING,
        require: true,
    },
    date: {
            type: DataTypes.DATE,
        require: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'meal_plans', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Meal_Plan;
