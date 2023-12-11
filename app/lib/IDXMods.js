import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function downloadImage(page, url, filePath) {
    const viewSource = await page.goto(url);
    const buffer = await viewSource.buffer();
    fs.writeFileSync(filePath, buffer);
}


async function scrapeIdxChannel(page) {
    const featuredImageUrl = await page.$eval('.appimage', img => img.src);

    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;

    let articleContent = await page.$$eval('.content > .text-body--3 p', elements => 
        elements.map(element => element.innerText).join('\n'));

        const imageName = path.basename(new URL(featuredImage).pathname);
        const imagePath = path.join('assets', imageName);
        await downloadImage(page, featuredImage, imagePath);
    
        return { featuredImage: featuredImageUrl,pathimage :imagePath,  articleContent };
}

async function scrapePasardana(page) {
    const featuredImageUrl = await page.$eval('img.caption.caption-article', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('section.entry-content p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('assets', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeCnbcIndonesia(page) {
    const featuredImageUrl = await page.$eval('.media_artikel img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('.detail_text p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('assets', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeInvestorDaily(page) {
    const featuredImageUrl = await page.$eval('body > main > div > div.row > div.col > div.rounded-3.overflow-hidden.mb-2 > img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('body > main > div > div.row > div.col > div.row.mt-3 > div p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('assets', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeBisniscom(page) {
    const featuredImageUrl = await page.$eval('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > div.detailsCover.-left > figure > a > img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > article p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('assets', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function defaultGet(page) {
    let featuredImageUrl, articleContent = '';
    try {
        featuredImageUrl = await page.$eval('.img', img => img.src);
        const currentUrl = page.url();
        const featuredImage = new URL(featuredImageUrl, currentUrl).href;
        articleContent = await page.$$eval('p', elements => elements.map(element => element.innerText).join('\n'));

        const imageName = path.basename(new URL(featuredImage).pathname);
        const imagePath = path.join('assets', imageName);
        await downloadImage(page, featuredImage, imagePath);

        return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
    } catch {
        return { featuredImage: 'No image found', pathimage: '', articleContent: 'Content could not be extracted' };
    }
}

export { scrapeIdxChannel, scrapePasardana, scrapeCnbcIndonesia, scrapeInvestorDaily, scrapeBisniscom, defaultGet };
