/*jshint esversion: 8 */
const { createLogger, format, transports } = require('winston');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../config/config.env') });
const log_file = path.join(__dirname, '../logs/server.log');

module.exports = createLogger({
    level: process.env.LOG_LEVEL,
    transports:
        new transports.File({
            filename: log_file,
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level} : ${[info.timestamp]} : ${info.message}`),
        )}),
});