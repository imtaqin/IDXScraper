import DB from '../config/DB.js';
import FinancialReport from './FReport.js';
import Prospektus from './PROSPEKTUS.js';
import Suspensi from './SUSPENSI.js';
import UMA from './UMA.js';

const synchronizeModels = async () => {
  try {
    await DB.sync();
    console.log('Database & tables created!');
  } catch (err) {
    console.error('Error creating database & tables: ', err);
  }
};

export { UMA,Suspensi, Prospektus,FinancialReport,synchronizeModels };
