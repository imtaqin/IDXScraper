import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { Prospektus } from '../models/index.js';
import chrome from 'selenium-webdriver/chrome.js';
import convertToTanggalBulan from '../lib/UMADate.js';

const waitForFileDownload = async (filePath, timeout = 8000) => {
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

const saveData = async (data) => {
    const downloadFolder = ('./downloads/Prospektus');

    if (!fs.existsSync(downloadFolder)){
        fs.mkdirSync(downloadFolder);
    }

    for (const item of data.data) {
        const fileName = item.UMAID + '.pdf';
        await downloadFile(item.Prospectus, downloadFolder, fileName);
        const filePath = item.Prospectus.split('/').pop();;
        await Prospektus.create({
            Tanggal : convertToTanggalBulan(item.UMADate),
            Judul : item.Description,
            Attachment: downloadFolder+"/"+filePath
        });
    }
};

const getIDXProspektus = async () => {
    let options = new chrome.Options();
   // options.addArguments({'headless' : 'new'});
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get('https://www.idx.co.id/primary/ListedCompany/GetProspectusItem?lang=id&start=0&length=9999&year=2023');
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



export { getIDXProspektus };
