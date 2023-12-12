import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const TrustedWeb = DB.define('Trusted', {

  Domain: DataTypes.STRING,
},
  {
    freezeTableName: true
  });

export default TrustedWeb;
