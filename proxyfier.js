import got from 'cloudflare-scraper';
import fs from 'fs';

class ProxyFier {
    constructor(url) {
        this.url = url;
    }

    async start() {
        try {
            const response = await got.get(this.url);
            return response.body;
        } catch (error) {
           
        }
    }

    async downloadFile(filepath) {
        try {
            const response = await got.stream(this.url);
            const writer = fs.createWriteStream(filepath);
            response.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            throw new Error('Error during file download: ' + error.message);
        }
    }
}

export default ProxyFier;
