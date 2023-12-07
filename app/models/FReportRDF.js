import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const FinancialReportRDF = DB.define('FinancialReportRDF', {

    EmitenCode: DataTypes.STRING,
    NamaEmiten: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Tanggal: DataTypes.STRING 
},
{
    freezeTableName: true
  });

export default FinancialReportRDF;
