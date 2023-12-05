import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { UMA } from '../models/index.js';
import chrome from 'selenium-webdriver/chrome.js';
import convertToTanggalBulan from '../lib/UMADate.js';

const waitForFileDownload = async (filePath, timeout = 5000) => {
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
        'plugins.always_open_pdf_externally': true // Disable Chrome's PDF Viewer
    });

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    
    try {
        await driver.get(url); // Navigate to the URL of the PDF file
        await driver.wait(until.elementLocated(By.css('body')), 10000);

        // Construct the full path for the file
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

const saveData = async (data) => {
    const downloadFolder = ('./downloads/UMA');

    if (!fs.existsSync(downloadFolder)){
        fs.mkdirSync(downloadFolder);
    }

    for (const item of data.Results) {
        const fileName = item.UMAID + '.pdf';
        await downloadFile('https://www.idx.co.id' + item.Attachment, downloadFolder, fileName);
        const filePath = item.Attachment.split('/').pop();;
        await UMA.create({
            UMAID : item.UMAID,
            Tanggal : convertToTanggalBulan(item.UMADate),
            Judul : item.Judul,
            Attachment: downloadFolder+"/"+filePath
        });
    }
};

const getUMA = async () => {
    let options = new chrome.Options();
   // options.addArguments({'headless' : 'new'});
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get('https://www.idx.co.id/primary/NewsAnnouncement/GetUma?indexFrom=1&dateFrom=&dateTo=&lang=id&pageSize=9999');
        let data = await driver.wait(until.elementLocated(By.css('body')), 10000);
        data = await data.getAttribute('innerText');
        const parsedData = JSON.parse(data);

        await saveData(parsedData);
    } catch (error) {
        console.error('Error fetching and saving data:', error);
    } finally {
        await driver.quit();
    }
};



export { getUMA };
