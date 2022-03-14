const {DataTypes} = require('sequelize');
const db = require('../db/configDB');

const Calendar = db.define('Calendar', {
    user_email: {
        primaryKey: true,
        type: DataTypes.STRING,
        require: true
    },
}, {
    tableName: 'calendars', // table name
    timestamps: false // skip custom timestamp columns
});

async function init() {
    await db.sync();
}

init();

module.exports = Calendar;
