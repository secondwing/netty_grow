import fs from 'fs';
import https from 'https';
import path from 'path';

const fonts = [
    {
        url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf',
        dest: 'public/fonts/NotoSansKR-Variable.ttf'
    }
];

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status Code ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded ${dest}`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

const main = async () => {
    // Ensure directory exists
    const dir = 'public/fonts';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        await Promise.all(fonts.map(font => downloadFile(font.url, font.dest)));
        console.log('All fonts downloaded successfully.');

        // Check file sizes
        fonts.forEach(font => {
            const stats = fs.statSync(font.dest);
            console.log(`${font.dest}: ${stats.size} bytes`);
        });

    } catch (error) {
        console.error('Error downloading fonts:', error);
        process.exit(1);
    }
};

main();
