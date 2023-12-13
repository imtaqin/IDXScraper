import DB from '../config/DB.js';
import BrokerFinancialReport from './Broker.js';
import BrokerDetail from './BrokerSummary.js';
import FinancialReportRDA from './FReport.js';
import FinancialReportRDF from './FReportRDF.js';
import GoogleNews from './GoogleNews.js';
import Perusahaan from './PERUSAHAAN.js';
import Prospektus from './PROSPEKTUS.js';
import Suspensi from './SUSPENSI.js';
import TrustedWeb from './TrustedWeb.js';
import UMA from './UMA.js';


const synchronizeModels = async () => {
  try {
    await DB.sync();
    console.log('Database & tables created!');
  } catch (err) {
    console.error('Error creating database & tables: ', err);
  }
};

export { BrokerDetail,BrokerFinancialReport,TrustedWeb,UMA,Suspensi,GoogleNews,Perusahaan, Prospektus,FinancialReportRDF,FinancialReportRDA,synchronizeModels };
