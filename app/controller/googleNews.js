import { Builder, By, error, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { scrapePasardana,scrapeIdxChannel,scrapeCnbcIndonesia,scrapeInvestorDaily ,scrapeBisniscom,defaultGet} from '../lib/IDXMods.js';
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
            }else if(link.includes("cnbcindonesia.com")){
                article =  await scrapeCnbcIndonesia(driver);
            }else if(link.includes("investor.id")){
                article =  await scrapeInvestorDaily(driver);
            }else if(link.includes("bisnis.com")){
                article =  await scrapeBisniscom(driver);
            }else{
                article =  await defaultGet(driver);
            }

            console.log(`Title: ${title}`);
            console.log(`Meta Description: ${metaDescription}`);
            console.log('---------------------------------');
            await GoogleNews.create({
                Judul : title,
                Links : link,
                Deskripsi : metaDescription,
                Image :article.featuredImage,
                Content : article.articleContent
            })
        }
    }catch(eror){
        console.log(error);
    } finally {
        await driver.quit();
    }
}


export { scrapeGoogleNews };