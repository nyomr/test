import puppeteer from 'puppeteer';
import { load } from 'cheerio';

export default async function handler(req, res) {
  const url = 'https://www.kalibrr.id/id-ID/home';
  
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Fungsi untuk menekan tombol "Load more jobs" sekali
    async function loadMoreJobsOnce() {
      const loadMoreButtonSelector = 'div.k-flex.k-justify-center.k-mb-10 > button.k-btn-primary';
      
      try {
        // Tunggu hingga tombol muncul di halaman
        await page.waitForSelector(loadMoreButtonSelector, { visible: true, timeout: 10000 }); // Perpanjang batas waktu menjadi 10 detik
        
        // Coba klik tombol menggunakan evaluate
        const result = await page.evaluate((selector) => {
          const button = document.querySelector(selector);
          if (button) {
            button.click();
            return true;
          }
          return false;
        }, loadMoreButtonSelector);
        
        // Tunggu beberapa detik agar data tambahan dimuat
        await page.waitForFunction(
          () => new Promise(resolve => setTimeout(resolve, 5000)) // Perpanjang waktu tunggu menjadi 5 detik
        );
        
        return result; // Mengindikasikan apakah tombol ditemukan dan ditekan
      } catch (error) {
        console.error('Error clicking load more jobs button:', error);
        return false;
      }
    }

    // Tekan tombol "Load more jobs" dua kali untuk memuat data tambahan
    const loadMoreResult1 = await loadMoreJobsOnce();
    if (!loadMoreResult1) {
      console.warn('First click on load more jobs button was not successful.');
    }

    const loadMoreResult2 = await loadMoreJobsOnce();
    if (!loadMoreResult2) {
      console.warn('Second click on load more jobs button was not successful.');
    }

    const loadMoreResult3 = await loadMoreJobsOnce();
    if (!loadMoreResult3) {
      console.warn('Third click on load more jobs button was not successful.');
    }

    // Ambil konten halaman setelah data tambahan dimuat
    const content = await page.content();
    const $ = load(content);
    
    const jobs = [];
    $('.k-border.k-group.k-flex.k-flex-col.k-justify-between.css-1otdiuc').each((index, element) => {
      const title = $(element).find('a.k-text-black').text().trim();
      const company = $(element).find('a.k-text-subdued.k-font-bold').text().trim();
      const location = $(element).find('span.k-text-gray-500.k-block.k-pointer-events-none').text().trim();
      let salary = $(element).find('span.k-text-subdued').text().trim();
      
      // Check if salary is empty or not found
      if (!salary) {
        salary = 'Gaji tidak diumumkan';
      }
      
      jobs.push({ no: index + 1, title, company, location, salary });
    });
    
    await browser.close();
    
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error during scraping process:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat scraping data' });
  }
}
