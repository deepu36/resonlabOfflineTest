// Process 1: Retrieving and Parsing JSON
const request = require('request-promise');
const fs = require('fs');
const crypto = require('crypto');
const cron = require('node-cron');


const fetchJson = async () => {
    try {
        const jsonResponse = await request.get({
            url: 'https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true',
            json: true
        });
        const urlArray = extractUrls(jsonResponse);
        return urlArray;
    } catch (err) {
        console.log(err);
    }
};

const extractUrls = (json) => {
    const urlArray = [];
    const extract = (obj) => {
        for (let key in obj) {
            if (key === 'a0') {
                urlArray.push(obj[key]);
            } else if (typeof obj[key] === 'object') {
                extract(obj[key]);
            }
        }
    };
    extract(json);
    return urlArray;
};

// Process 2: Fetching and Storing File Contents
const fetchFiles = async (urlArray) => {
    try {
        for (let i = 0; i < urlArray.length; i++) {
            const url = urlArray[i];
            const file = await request.get({
                url,
                encoding: null
            });
            const hash = crypto.createHash('sha256').update(file).digest('hex');
            if (fs.existsSync(`${hash}.bin`)) {
                console.log(`File with hash ${hash} already exists.`);
                let suffix = 1;
                while (fs.existsSync(`${hash}_${suffix}.bin`)) {
                    suffix++;
                }
                fs.writeFileSync(`${hash}_${suffix}.bin`, file);
            } else {
                fs.writeFileSync(`${hash}.bin`, file);
            }
        }
    } catch (err) {
        console.log(err);
    }
};

cron.schedule('*/1 * * * *', async () => {
    const urlArray = await fetchJson();
    await fetchFiles(urlArray);
});
