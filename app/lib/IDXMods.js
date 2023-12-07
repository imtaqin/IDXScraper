import { By } from 'selenium-webdriver';
async function scrapeIdxChannel(driver) {
    const featuredImage = await driver.findElement(By.css('div.article--image img')).getAttribute('src');
    let articleContent = '';
    const contentElements = await driver.findElements(By.css('div.article--content p'));
    for (const element of contentElements) {
        const elementText = await element.getText();
        articleContent += elementText + '\n';
    }

    return {
        featuredImage,articleContent
    }
}

async function scrapePasardana(driver) {
    const featuredImageElement = await driver.findElement(By.css('img.caption.caption-article'));
    const featuredImageUrl = await featuredImageElement.getAttribute('src');
    
    const currentUrl = await driver.getCurrentUrl();
    const featuredImage = new URL(featuredImageUrl, currentUrl).href;

    let articleContent = '';
    const contentElements = await driver.findElements(By.css('section.entry-content p'));
    for (const element of contentElements) {
        const elementText = await element.getText();
        articleContent += elementText + '\n';
    }

    return {
        featuredImage, articleContent
    };
}


async function scrapeCnbcIndonesia(driver) {
    // Scrape the featured image URL
    const featuredImageElement = await driver.findElement(By.css('.media_artikel img'));
    const featuredImageUrl = await featuredImageElement.getAttribute('src');

    // Scrape the article content
    let articleContent = '';
    const contentElements = await driver.findElements(By.css('.detail_text p'));
    for (const element of contentElements) {
        const elementText = await element.getText();
        articleContent += elementText + '\n';
    }

    return {
        featuredImage: featuredImageUrl,
        articleContent
    };
}
async function scrapeInvestorDaily(driver) {
    // Scrape the featured image URL
    const featuredImageElement = await driver.findElement(By.css('body > main > div > div.row > div.col > div.rounded-3.overflow-hidden.mb-2 > img'));
    const featuredImageUrl = await featuredImageElement.getAttribute('src');

    // Scrape the article content
    let articleContent = '';
    const contentElements = await driver.findElements(By.css('body > main > div > div.row > div.col > div.row.mt-3 > div p'));
    for (const element of contentElements) {
        const elementText = await element.getText();
        articleContent += elementText + '\n';
    }

    return {
        featuredImage: featuredImageUrl,
        articleContent
    };
}

async function scrapeBisniscom(driver) {
    // Scrape the featured image URL
    const featuredImageElement = await driver.findElement(By.css('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > div.detailsCover.-left > figure > a > img'));
    const featuredImageUrl = await featuredImageElement.getAttribute('src');

    // Scrape the article content
    let articleContent = '';
    const contentElements = await driver.findElements(By.css('#pswp-gallery > div.container.mt50 > div > div.col-7.col-left > article p'));
    for (const element of contentElements) {
        const elementText = await element.getText();
        articleContent += elementText + '\n';
    }

    return {
        featuredImage: featuredImageUrl,
        articleContent
    };
}
async function defaultGet(driver) {
    // Scrape the featured image URL
    const featuredImageElement = await driver.findElement(By.css('.img'));
    const featuredImageUrl = await featuredImageElement.getAttribute('src');

    // Scrape the article content
    let articleContent = '';
    try {
        const paragraphs = await driver.findElements(By.css('p'));
        for (const paragraph of paragraphs) {
            articleContent += await paragraph.getText() + "\n";
        }
    } catch {
        articleContent = "Content could not be extracted";
    }

    return {
        featuredImage: featuredImageUrl,
        articleContent
    };
}
export { scrapeIdxChannel, scrapePasardana, scrapeCnbcIndonesia,scrapeInvestorDaily ,scrapeBisniscom,defaultGet};

