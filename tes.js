import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';


async function scrapeGoogleNews() {
    let driver = new Builder()
        .forBrowser('chrome')
       // .setChromeOptions(new chrome.Options().headless())
        .build();

        try {
            // Open the Google News search page
            await driver.get('https://www.google.com/search?q=auto+idx&tbm=nws');
    
            // Get all the news article links
            const links = await driver.findElements(By.css('a'));
    
            const filteredLinks = (await Promise.all(
                links.map(async link => await link.getAttribute('href'))
            )).filter(href => href && !href.includes('google'));
    
            // Iterate over each link and get the required information
            for (const link of filteredLinks) {
                await driver.get(link);
                const title = await driver.getTitle();
                let metaDescription;
    
                try {
                    metaDescription = await driver.findElement(By.css('meta[name="description"]')).getAttribute('content');
                } catch {
                    metaDescription = "No meta description found";
                }
    
              if(link.includes("idxchannel.com")){

                const featuredImage = await driver.findElement(By.css('div.article--image img')).getAttribute('src');

                let articleContent = '';
                const contentElements = await driver.findElements(By.css('div.article--content p'));
                for (const element of contentElements) {
                    const elementText = await element.getText();
                    articleContent += elementText + '\n';
                }
        
                console.log(`Featured Image URL: ${featuredImage}`);
                console.log(`Article Content:\n${articleContent}`);
                console.log(`Title: ${title}`);
                console.log(`Meta Description: ${metaDescription}`);
                console.log('---------------------------------');
            }
            }
    } finally {
        // Quit the driver session
        await driver.quit();
    }
}

scrapeGoogleNews();
