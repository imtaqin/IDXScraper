import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const GoogleNews = DB.define('GoogleNews', {
    Links: {type: DataTypes.STRING,unique: true},
    Judul: DataTypes.STRING,
    Deskripsi: DataTypes.STRING,
    Image: DataTypes.STRING,
    Path : DataTypes.STRING,
    Content: DataTypes.TEXT
},{
    freezeTableName: true
  });

export default GoogleNews;