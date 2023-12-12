import DB from '../config/DB.js';
import TrustedWeb from '../models/TrustedWeb.js';

async function seedDatabase() {
    try {
        // Connect to the database
        await DB.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Sync models
        await DB.sync();

        // Seed TrustedWeb with a default domain
        const defaultDomain = 'pasardana.id';
        const [domain, created] = await TrustedWeb.findOrCreate({
            where: { Domain: defaultDomain }
        });

        if (created) {
            console.log(`Default domain '${defaultDomain}' added to TrustedWeb.`);
        } else {
            console.log(`Default domain '${defaultDomain}' already exists in TrustedWeb.`);
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        // Close the database connection
        await DB.close();
    }
}

export default seedDatabase;
