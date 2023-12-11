import puppeteer from 'puppeteer';
import { scrapePasardana, scrapeIdxChannel, scrapeCnbcIndonesia, scrapeInvestorDaily, scrapeBisniscom, defaultGet } from '../lib/IDXMods.js';
import GoogleNews from '../models/GoogleNews.js';

async function scrapeGoogleNews(kode) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const collectLinks = async (url) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            return page.$$eval('a', anchors => anchors.map(a => a.href));
        };

        const firstPageLinks = await collectLinks(`https://www.google.com/search?q=${kode}+idx&tbm=nws`);
        const secondPageLinks = await collectLinks(`https://www.google.com/search?q=${kode}+idx&tbm=nws&start=10`);
        const allLinks = [...firstPageLinks, ...secondPageLinks]
            .filter(href => href && !href.includes('google'));

        for (const link of allLinks) {
            try {
                await page.goto(link, { waitUntil: 'domcontentloaded' });
                const title = await page.title();
                let metaDescription = await page.$eval('meta[name="description"]', element => element?.content || "No meta description found");

                let article;
                if (link.includes("idxchannel.com")) {
                    article = await scrapeIdxChannel(page);
                } else if (link.includes("pasardana.id")) {
                    article = await scrapePasardana(page);
                } else if (link.includes("cnbcindonesia.com")) {
                    article = await scrapeCnbcIndonesia(page);
                } else if (link.includes("investor.id")) {
                    article = await scrapeInvestorDaily(page);
                } else if (link.includes("bisnis.com")) {
                    article = await scrapeBisniscom(page);
                } else {
                    article = await defaultGet(page);
                }

                console.log(`Title: ${title}`);
                console.log(`Meta Description: ${metaDescription}`);
                console.log('---------------------------------');

                await GoogleNews.create({
                    Judul: title,
                    Links: link,
                    Path : article.pathimage,
                    Deskripsi: metaDescription,
                    Image: article.featuredImage,
                    Content: article.articleContent
                });
            } catch (error) {
                console.log("Duplikat link");
            }
        }
    } catch (error) {
        console.error("Error in scraping", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export { scrapeGoogleNews };
