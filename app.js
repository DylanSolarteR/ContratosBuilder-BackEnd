import express, { json } from 'express';
import { connect } from 'mongoose';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { readdir } from 'fs/promises';
// const CONTRATOS_DB_URI = 'mongodb://user:pass@127.0.0.1:27017/contratos';
// const CONTRATOS_DB_URI = 'mongodb://127.0.0.1:27017/contratos';
const CONTRATOS_DB_URI = 'mongodb+srv://srsq02:jlfGEYE2HbC21az7@cluster0.dgha4lq.mongodb.net/contratos?retryWrites=true&w=majority&appName=Cluster0';
const PORT = process.env.PORT || 3001;
const BASE_URL = '/api/v1';

const app = express();
app.use(json());

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const routesDir = join(__dirname, '/routes');
console.log(routesDir);
const importRoutes = async () => {
    try {
        const routeFiles = (await readdir(routesDir)).filter(file => file.endsWith('routes.js'));

        await Promise.all(routeFiles.map(async file => {
            const filePath = join(routesDir, file);
            const fileUrl = pathToFileURL(filePath).href;
            const { default: routes } = await import(fileUrl);
            const routeName = file.replace('.routes.js', '');
            router.use(`/api/v1/${routeName}`, routes);
        }));

    } catch (error) {
        console.error('Error importing routes:', error);
    }
};

importRoutes();

app.use(router)

connect(CONTRATOS_DB_URI)
    .then(() => {
        console.log('Connected to database successfully');
        app.listen(PORT, () => {
            console.log(`Express server running on port:  ${PORT}`);
        });
    }
);