import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const Prospektus = DB.define('Prospektus', {
    Tanggal: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Judul: DataTypes.STRING
},{
    freezeTableName: true
  });

export default Prospektus;