import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const UMA = DB.define('UMA', {
    UMAID: DataTypes.STRING,
    Tanggal: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Judul: DataTypes.STRING
});

export default UMA;