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


export { scrapeIdxChannel,scrapePasardana };

