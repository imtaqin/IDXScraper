import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { FinancialReport } from '../models/index.js';
import chrome from 'selenium-webdriver/chrome.js';
import convertToTanggalBulan from '../lib/UMADate.js';

const waitForFileDownload = async (filePath, timeout = 15000) => {
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
    options.addArguments('disable-gpu'); // Disable GPU, optional
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

const saveFinancialReportData = async (data) => {
    const downloadFolder = path.resolve('./downloads/FinancialReports');

    if (!fs.existsSync(downloadFolder)){
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    for (const item of data.Results) {
        // Iterate through attachments if there are multiple
        for (const attachment of item.Attachments) {
            const filePath = path.join(downloadFolder, attachment.File_Name);
            const fileDownloaded = await downloadFile('https://www.idx.co.id' + attachment.File_Path, downloadFolder, attachment.File_Name);

            if (fileDownloaded) {
                await FinancialReport.create({
                    ReportID: attachment.File_ID, // Use File_ID as the unique identifier
                    EmitenCode: item.KodeEmiten,
                    ReportYear: item.Report_Year,
                    NamaEmiten: item.NamaEmiten,
                    Attachment: filePath,
                    Tanggal: new Date(attachment.File_Modified) // Convert the string to a Date object
                });
            }
        }
    }
};

const getFinanceReport = async () => {
    let options = new chrome.Options();
    // options.addArguments('headless'); // Uncomment to run in headless mode
    options.addArguments('disable-gpu');
    options.setUserPreferences({
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'safebrowsing.enabled': false,
        'plugins.always_open_pdf_externally': true
    });

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        const url = 'https://www.idx.co.id/primary/ListedCompany/GetFinancialReport?indexFrom=1&pageSize=12&year=2023&reportType=rda&EmitenType=s&periode=tw1&kodeEmiten=&SortColumn=KodeEmiten&SortOrder=asc';
        await driver.get(url);
        let data = await driver.wait(until.elementLocated(By.css('body')), 10000);
        data = await data.getAttribute('innerText');
        const parsedData = JSON.parse(data);

        await saveFinancialReportData(parsedData);
    } catch (error) {
        console.error('Error fetching and saving financial report data:', error);
    } finally {
        await driver.quit();
    }
};

export { getFinanceReport };


