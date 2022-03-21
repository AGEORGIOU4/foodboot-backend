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
        allowNull: false,
        unique: true
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
}, {
    tableName: 'food_combinations', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Food_Combination;
