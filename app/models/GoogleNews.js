import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const GoogleNews = DB.define('GoogleNews', {
    Links: DataTypes.STRING,
    Judul: DataTypes.STRING,
    Deskripsi: DataTypes.STRING,
    Image: DataTypes.STRING,
    Content: DataTypes.STRING
},{
    freezeTableName: true
  });

export default GoogleNews;