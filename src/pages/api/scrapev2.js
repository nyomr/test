
// pages/api/scrape.js

import puppeteer from 'puppeteer';
import { load } from 'cheerio';

export default async function handler(req, res) {
  const url = 'https://www.kalibrr.id/id-ID/home'; // Ganti dengan URL situs pekerjaan yang ingin di-scrape
  
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Ambil konten halaman
    const content = await page.content();
    const $ = load(content);
    
    // Contoh scraping: Ambil judul pekerjaan dan lokasi
    const jobs = [];
    $('.k-border.k-group.k-flex.k-flex-col.k-justify-between.css-1otdiuc').each((index, element) => {
      const title = $(element).find('a.k-text-black').text().trim();
      const company = $(element).find('a.k-text-subdued.k-font-bold').text().trim();
      const location = $(element).find('span.k-text-gray-500.k-block.k-pointer-events-none').text().trim();
      let salary = $(element).find('span.k-text-subdued').text().trim();
      
      // Check if salary is empty or not found
      if (!salary) {
        salary = 'Gaji Tidak Diumumkan';
      }
    //   const location = $(element).find('span.job-location').text().trim();
      
      jobs.push({ no: index + 1, title, company, location, salary });
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
