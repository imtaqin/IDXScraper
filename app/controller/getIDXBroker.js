import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import convertToTanggalBulan from '../lib/UMADate.js';
import { BrokerFinancialReport ,BrokerDetail} from '../models/index.js'; // Assuming these are your model names
import chrome from 'selenium-webdriver/chrome.js';
const waitForFileDownload = async (filePath, timeout = 10000) => {
    let timeSpent = 0;
    const checkInterval = 500; // Check every 500 ms

    while (timeSpent < timeout) {
        if (fs.existsSync(filePath)) return true;
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        timeSpent += checkInterval;
    }
    return false;
};
const downloadFile = async (url, downloadFolder,fileName) => {
    console.log("Download Folder:", downloadFolder);

    let options = new chrome.Options();
 //  options.addArguments({'headless' : 'new'}); // Run in headless mode, optional
    options.addArguments('disable-gpu'); 
    options.setUserPreferences({
        'download.default_directory': path.resolve(downloadFolder),
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'safebrowsing.enabled': false,
        'plugins.always_open_pdf_externally': true 
    });

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    
    try {
        await driver.get(url);
        await driver.wait(until.elementLocated(By.css('body')), 10000);

        const filePath = path.join(downloadFolder, fileName);
        const fileDownloaded = await waitForFileDownload(filePath);

        if (!fileDownloaded) {
            console.error('File download timed out:', filePath);
            return false;
        }
        return true;

    } catch (error) {
        console.error('Error during file download:', error);
    } finally {
      await driver.quit();
    }
};

const fetchAndSaveBrokerData = async (driver, brokerCode) => {
    await driver.get(`https://www.idx.co.id/primary/ExchangeMember/GetBrokerDetail?code=${brokerCode}`);
    let brokerDetailData = await driver.findElement(By.css('body')).getAttribute('innerText');
    const brokerDetail = JSON.parse(brokerDetailData);

    // Fetch MKBD summary
    await driver.get(`https://www.idx.co.id/primary/ExchangeMember/GetMkbdSummary?code=${brokerCode}`);
    let mkbdSummaryData = await driver.findElement(By.css('body')).getAttribute('innerText');
    const mkbdSummary = mkbdSummaryData;

    // Save broker detail and MKBD summary
    await BrokerDetail.create({
        Code: brokerDetail.Code,
        Name: brokerDetail.Name,
        StatusCode: brokerDetail.StatusCode,
        StatusName: brokerDetail.StatusName,
        Address: brokerDetail.Address,
        City: brokerDetail.City,
        Zip: brokerDetail.Zip,
        Phone: brokerDetail.Phone,
        Fax: brokerDetail.Fax,
        Email: brokerDetail.Email,
        Website: brokerDetail.Website,
        JoinDate: convertToTanggalBulan(brokerDetail.JoinDate),
        JoinStatus: brokerDetail.JoinStatus,
        StatusId: brokerDetail.StatusId,
        CompanyStatus: brokerDetail.CompanyStatus,
        NPWPNo: brokerDetail.NPWPNo,
        AktaNo: brokerDetail.AktaNo,
        ModalDasar: brokerDetail.ModalDasar,
        ModalDisetor: brokerDetail.ModalDisetor,
        OperationalLicense: brokerDetail.OperationalLicense,
        Mkbd: brokerDetail.Mkbd,
        Logo: brokerDetail.Logo,
        ShareHolders: JSON.stringify(brokerDetail.ShareHolders),
        Summary: mkbdSummary
    });
    

    const currentYear = new Date().getFullYear();
    const periods = ['TW1', 'TW2', 'TW3', 'audit', 'unaudit'];

    for (let year = currentYear; year > currentYear - 5; year--) {
        for (const period of periods) {
            await driver.get(`https://www.idx.co.id/primary/ExchangeMember/GetFinancialReport?period=${period}&year=${year}&code=${brokerCode}`);
            let financialReportData = await driver.findElement(By.css('body')).getAttribute('innerText');
            const financialReports = JSON.parse(financialReportData);

            for (const report of financialReports) {
                const downloadFolder = './downloads/financial_reports';
                const fileName = path.basename(report.Value.Path);
                const fileUrl = `https://www.idx.co.id${report.Value.Path}`;
                await downloadFile(fileUrl, downloadFolder, fileName);
                await BrokerFinancialReport.create({
                    BrokerCode: brokerCode,
                    Period: period,
                    Year: year,
                    ReportPath: path.join(downloadFolder, fileName)
                });
            }
        }
    }
};

const getBroker = async () => {
    let options = new chrome.Options();
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get('https://www.idx.co.id/primary/ExchangeMember/GetBrokerCodeList');
        let brokerData = await driver.findElement(By.css('body')).getAttribute('innerText');
        const brokers = JSON.parse(brokerData).data;

        for (const broker of brokers) {
           
            await fetchAndSaveBrokerData(driver, broker.Code);
        }
    } catch (error) {
        console.error('Error fetching and saving data:', error);
    } finally {
        await driver.quit();
    }
};

export { getBroker };
