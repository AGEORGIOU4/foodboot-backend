const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Calendar_Event = db.define('Calendar_Event', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        require: true,
    },
    user_email: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false
    },
    title: {
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
    allDay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'calendar_events', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Calendar_Event;
