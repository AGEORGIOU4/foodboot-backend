const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Food_Combination = db.define('Food_Combination', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        require: true,
    },
    meal_plan_id: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false
    },
    portion: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false
    },
    start: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    end: {
        type: DataTypes.STRING,
        allowNull: true
    },
    typeOfMeal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'food_combinations', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Food_Combination;
