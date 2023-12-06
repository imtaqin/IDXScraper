import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const FinancialReportRDA = DB.define('FinancialReportRDA', {

    EmitenCode: DataTypes.STRING,
    NamaEmiten: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Tanggal: DataTypes.STRING // Changed to DATE type for actual date handling
},
{
    freezeTableName: true
  });

export default FinancialReportRDA;
