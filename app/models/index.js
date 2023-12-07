import DB from '../config/DB.js';
import FinancialReportRDA from './FReport.js';
import FinancialReportRDF from './FReportRDF.js';
import GoogleNews from './GoogleNews.js';
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

export { UMA,Suspensi,GoogleNews, Prospektus,FinancialReportRDF,FinancialReportRDA,synchronizeModels };
