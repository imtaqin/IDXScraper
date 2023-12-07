import { getSuspensi } from "./app/controller/getIDXSuspensi.js";
import { getIDXProspektus } from "./app/controller/getIDXProspektus.js";
import { synchronizeModels } from "./app/models/index.js";
import { getFinanceReportRDF } from "./app/controller/getIDXFinanceReportRDF.js";
import { getFinanceReportRDA } from "./app/controller/getIDXFinanceReportRDA.js";
import { scrapeGoogleNews } from "./app/controller/googleNews.js";
import cron from "node-cron";
import { getUMA } from "./app/controller/getIDXUMA.js";

synchronizeModels();
getFinanceReportRDA();
getFinanceReportRDF();
scrapeGoogleNews();
getIDXProspektus();
getUMA();
getSuspensi();

cron.schedule("0 12,17 * * *", () => {
  console.log(" ======== Mulai scrape Laporan Keuangan ================");
  getFinanceReportRDA();
  getFinanceReportRDF();
});

cron.schedule("0 7,11,13,15,17,20 * * *", () => {
  console.log(" ======== Mulai scrape Google News ================");
  scrapeGoogleNews();
});

cron.schedule("0 12,17 * * *", () => {
  console.log(" ======== Mulai scrape IDX Prospektus ================");
  getIDXProspektus();
});

cron.schedule("0 0 * * *", () => {
  console.log(
    " ======== Mulai scrape Unusual Market Activity (UMA) ================"
  );
  getUMA();
});

cron.schedule("0 0 * * *", () => {
  console.log(" ======== Mulai scrape Suspensi ================");
  getSuspensi();
});

