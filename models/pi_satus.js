const db = require('../db');

module.exports = db.defineModel('pi_status', {
    cpu_temp: {
        type: db.INTEGER,
        allowNull: true
    },
    gpu_temp: {
        type: db.INTEGER,
        allowNull: true
    },
    battery_temp: {
        type: db.INTEGER,
        allowNull: true
    }
});