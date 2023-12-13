import { DataTypes } from 'sequelize';
import DB from '../config/DB.js';

const BrokerDetail = DB.define('BrokerDetail', {
    Code: DataTypes.STRING,
    Name: DataTypes.STRING,
    StatusCode: DataTypes.STRING,
    StatusName: DataTypes.STRING,
    Address: DataTypes.STRING,
    City: DataTypes.STRING,
    Zip: DataTypes.STRING,
    Phone: DataTypes.STRING,
    Fax: DataTypes.STRING,
    Email: DataTypes.STRING,
    Website: DataTypes.STRING,
    JoinDate: DataTypes.DATE,
    JoinStatus: DataTypes.STRING,
    StatusId: DataTypes.STRING,
    CompanyStatus: DataTypes.STRING,
    NPWPNo: DataTypes.STRING,
    AktaNo: DataTypes.STRING,
    ModalDasar: DataTypes.STRING,
    ModalDisetor: DataTypes.STRING,
    OperationalLicense: DataTypes.STRING,
    Mkbd: DataTypes.STRING,
    Logo: DataTypes.STRING,
    ShareHolders: DataTypes.TEXT,
    Summary :  DataTypes.TEXT
}, {
    freezeTableName: true
});

export default BrokerDetail;
