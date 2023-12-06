import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const FinancialReport = DB.define('FinancialReport', {
    ReportID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    EmitenCode: DataTypes.STRING,
    ReportYear: DataTypes.STRING,
    ReportPeriod: DataTypes.STRING, // If you need to store the report period
    NamaEmiten: DataTypes.STRING,
    Attachment: DataTypes.STRING,
    Tanggal: DataTypes.STRING // Changed to DATE type for actual date handling
});

export default FinancialReport;
