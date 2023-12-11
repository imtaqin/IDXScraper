import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const Perusahaan = DB.define('Perusahaan', {
    KODE: DataTypes.STRING,
    NAMA: DataTypes.STRING,
},{
    freezeTableName: true
  });

export default Perusahaan;