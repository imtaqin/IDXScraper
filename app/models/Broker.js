import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const BrokerFinancialReport = DB.define('BrokerFinancialReport', {
    BrokerCode: DataTypes.STRING,
    Period: DataTypes.STRING,
    Year: DataTypes.STRING,
    ReportPath: DataTypes.STRING
}, {
    freezeTableName: true
});

export default BrokerFinancialReport;
