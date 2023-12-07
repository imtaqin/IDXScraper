import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { scrapePasardana,scrapeIdxChannel } from '../lib/IDXMods.js';
import GoogleNews from '../models/GoogleNews.js';

async function scrapeGoogleNews() {
    let driver = new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(new chrome.Options().headless())
        .build();

    try {
        await driver.get('https://www.google.com/search?q=auto+idx&tbm=nws');
        const links = await driver.findElements(By.css('a'));
        const filteredLinks = (await Promise.all(links.map(async link => await link.getAttribute('href'))))
            .filter(href => href && !href.includes('google'));

        for (const link of filteredLinks) {
            await driver.get(link);
            const title = await driver.getTitle();
            let metaDescription;
            let article;
            try {
                metaDescription = await driver.findElement(By.css('meta[name="description"]')).getAttribute('content');
            } catch {
                metaDescription = "No meta description found";
            }

            if(link.includes("idxchannel.com")){
                article = await scrapeIdxChannel(driver);
            } else if(link.includes("pasardana.id")){
                article =  await scrapePasardana(driver);
            }

            console.log(`Title: ${title}`);
            console.log(`Meta Description: ${metaDescription}`);
            console.log(article)
            console.log('---------------------------------');
        }
    } finally {
        await driver.quit();
    }
}


export { scrapeGoogleNews };