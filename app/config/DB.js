import Sequelize from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DIALECT } from "../../config.js";
const DB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host:DB_HOST,
  dialect: DIALECT /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  logging: console.log
});

export default DB;