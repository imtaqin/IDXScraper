import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const Suspensi = DB.define('Suspensi', {
    Tanggal: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Judul: DataTypes.STRING
});

export default Suspensi;