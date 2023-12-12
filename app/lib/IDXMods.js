import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function downloadImage(page, url, filePath) {
    const viewSource = await page.goto(url);
    const buffer = await viewSource.buffer();

    // Check if directory exists, create if not
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
}

async function scrapeIdxChannel(page) {
    const featuredImageUrl = await page.$eval('.appimage', img => img.src);

    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;

    let articleContent = await page.$$eval('.content > .text-body--3 p', elements =>
        elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapePasardana(page) {
    const featuredImageUrl = await page.$eval('img.caption.caption-article', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('section.entry-content p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeCnbcIndonesia(page) {
    const featuredImageUrl = await page.$eval('.media_artikel img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('.detail_text p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeInvestorDaily(page) {
    const featuredImageUrl = await page.$eval('body > main > div > div.row > div.col > div.rounded-3.overflow-hidden.mb-2 > img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('body > main > div > div.row > div.col > div.row.mt-3 > div p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}

async function scrapeBisniscom(page) {
    const featuredImageUrl = await page.$eval('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > div.detailsCover.-left > figure > a > img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;
    let articleContent = await page.$$eval('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > article p', elements => elements.map(element => element.innerText).join('\n'));

    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}
async function scrapeDetik(page) {
    // Extract the URL of the featured image
    const featuredImageUrl = await page.$eval('.detail__media-image img', img => img.src);
    const currentUrl = page.url();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;

    // Extract the article content
    let articleContent = await page.$$eval('.detail__body-text p', elements => 
        elements.map(element => element.innerText).join('\n'));

    // Extract the image name and create the path
    const imageName = path.basename(new URL(featuredImage).pathname);
    const imagePath = path.join('downloads', 'googlenews', imageName);
    await downloadImage(page, featuredImage, imagePath);

    return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
}
async function defaultGet(page) {
    let featuredImageUrl, articleContent = '';
    try {

        featuredImageUrl = await page.$eval('img', img => img.src).catch(() => 'No image found');
        const currentUrl = page.url();
        const featuredImage = featuredImageUrl !== 'No image found' ? new URL(featuredImageUrl, currentUrl).href : '';

        articleContent = await page.$$eval('article, .article, .post, .content, .main-content', articles => {

            if (articles.length > 0) {
                return articles.map(article => {

                    return Array.from(article.querySelectorAll('p')).map(p => p.innerText.trim()).join('\n');
                }).join('\n\n');
            } else {

                return page.$$eval('p', paragraphs => paragraphs.map(p => p.innerText.trim()).join('\n'));
            }
        }).catch(() => 'Content could not be extracted');

        let imagePath = '';
        if (featuredImage !== '') {
            const imageName = path.basename(new URL(featuredImage).pathname);
            const imagePath = path.join('downloads', 'googlenews', imageName);
            await downloadImage(page, featuredImage, imagePath);
        }

        return { featuredImage: featuredImageUrl, pathimage: imagePath, articleContent };
    } catch (error) {
        console.error("Error in defaultGet:", error);
        return { featuredImage: 'No image found', pathimage: '', articleContent: 'Content could not be extracted' };
    }
}

export { scrapeDetik,scrapeIdxChannel, scrapePasardana, scrapeCnbcIndonesia, scrapeInvestorDaily, scrapeBisniscom, defaultGet };