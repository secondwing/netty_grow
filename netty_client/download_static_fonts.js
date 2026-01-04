import fs from 'fs';
import https from 'https';
import path from 'path';
import { exec } from 'child_process';

const fontUrl = 'https://fonts.google.com/download?family=Noto%20Sans%20KR';
const zipPath = 'public/fonts/fonts.zip';
const extractDir = 'public/fonts/temp_extract';

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

const unzipFile = (zipFile, destDir) => {
    return new Promise((resolve, reject) => {
        // Use tar to unzip (available on Windows 10+)
        const command = `tar -xf "${zipFile}" -C "${destDir}"`;
        console.log(`Executing: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Unzip error: ${error.message}`);
                console.error(`Stderr: ${stderr}`);
                // Fallback to PowerShell if tar fails (though unlikely on modern Windows)
                reject(error);
                return;
            }
            console.log('Unzipped successfully');
            resolve();
        });
    });
};

const main = async () => {
    const dir = 'public/fonts';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Clean up previous temp dir if exists
    if (fs.existsSync(extractDir)) {
        fs.rmSync(extractDir, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });

    try {
        await downloadFile(fontUrl, zipPath);
        await unzipFile(zipPath, extractDir);

        // Search for static fonts recursively
        const findFile = (startDir, filename) => {
            const files = fs.readdirSync(startDir);
            for (const file of files) {
                const filePath = path.join(startDir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    const found = findFile(filePath, filename);
                    if (found) return found;
                } else if (file === filename) {
                    return filePath;
                }
            }
            return null;
        };

        // Google Fonts zip usually has a 'static' folder
        const regularPath = findFile(extractDir, 'NotoSansKR-Regular.ttf') || findFile(extractDir, 'NotoSansKR-Regular.otf');
        const boldPath = findFile(extractDir, 'NotoSansKR-Bold.ttf') || findFile(extractDir, 'NotoSansKR-Bold.otf');

        if (regularPath) {
            fs.copyFileSync(regularPath, 'public/fonts/NotoSansKR-Regular.ttf');
            console.log(`Copied Regular font from ${regularPath}`);
        } else {
            console.error('Regular font not found in zip');
        }

        if (boldPath) {
            fs.copyFileSync(boldPath, 'public/fonts/NotoSansKR-Bold.ttf');
            console.log(`Copied Bold font from ${boldPath}`);
        } else {
            console.error('Bold font not found in zip');
        }

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractDir, { recursive: true, force: true });
        console.log('Cleanup done');

    } catch (error) {
        console.error('Error:', error);
    }
};

main();
