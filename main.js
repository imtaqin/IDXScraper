import { getSuspensi } from "./app/controller/getIDXSuspensi.js";
import { getIDXProspektus } from "./app/controller/getIDXProspektus.js";
import { synchronizeModels } from "./app/models/index.js";
import { getFinanceReportRDF } from "./app/controller/getIDXFinanceReportRDF.js";
import { getFinanceReportRDA } from "./app/controller/getIDXFinanceReportRDA.js";
import { scrapeGoogleNews } from "./app/controller/googleNews.js";

synchronizeModels()
scrapeGoogleNews().then(() => {
    // Code to execute after getUMA has completed
    console.log("UMA data has been processed");
}).catch((error) => {
    // Error handling
    console.error("Error processing UMA data:", error);
});
