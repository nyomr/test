// pages/api/scrape.js

import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const url = 'https://books.toscrape.com/'; // Ganti dengan URL situs pekerjaan yang ingin di-scrape
  
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Ambil konten halaman
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Contoh scraping: Ambil judul pekerjaan dan lokasi
    const jobs = [];
    $('.product_pod').each((index, element) => {
      const title = $(element).find('h3').text().trim();
    //   const location = $(element).find('span.job-location').text().trim();
      
      jobs.push({ title});
    });
    
    // Tutup browser
    await browser.close();
    
    // Kembalikan data sebagai JSON
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat scraping data' });
  }
}
