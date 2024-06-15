<<<<<<< HEAD
import { load } from 'cheerio';
import puppeteer from 'puppeteer';

// const testUrl = 'https://www.jobstreet.co.id/information-technology-jobs'

export default async function handler(req, res) {
    const method = req.method;
    if (method === 'GET') {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://books.toscrape.com/');
        const html = await page.content();

        const $ = load(html);

        const job = [];

        $(".product_pod").each((i, el) => {
            const title = $('.price_color', el).text();
            job.push({title});

        });

        console.log(job);
        res.status(200).json(job);
    } else {
        res.status(200).json({ message: 'Hello from Next.js!' });
    }

}


    // if (method === 'GET') {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.goto(testUrl);
    //     const html = await page.content();

    //     const $ = load(html);

    //     const job = [];

    //     $(".y735df0").each((i, el) => {
    //         const title = $('._1iz8dgs52', el).text();
    //         job.push({title});

    //     });

    //     console.log(job);
    //     res.status(200).json(job);
    // } else {
    //     res.status(200).json({ message: 'Hello from Next.js!' });
    // }



=======
import { load } from 'cheerio';
import puppeteer from 'puppeteer';

// const testUrl = 'https://www.jobstreet.co.id/information-technology-jobs'

export default async function handler(req, res) {
    const method = req.method;
    if (method === 'GET') {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://books.toscrape.com/');
        const html = await page.content();

        const $ = load(html);

        const job = [];

        $(".product_pod").each((i, el) => {
            const title = $('.price_color', el).text();
            job.push({title});

        });

        console.log(job);
        res.status(200).json(job);
    } else {
        res.status(200).json({ message: 'Hello from Next.js!' });
    }

}


    // if (method === 'GET') {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.goto(testUrl);
    //     const html = await page.content();

    //     const $ = load(html);

    //     const job = [];

    //     $(".y735df0").each((i, el) => {
    //         const title = $('._1iz8dgs52', el).text();
    //         job.push({title});

    //     });

    //     console.log(job);
    //     res.status(200).json(job);
    // } else {
    //     res.status(200).json({ message: 'Hello from Next.js!' });
    // }



>>>>>>> 88fe8d63f0ec0929f22bd566e9fda8ce2ea2cba8
