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
        // Scroll ke bawah halaman untuk memastikan tombol terlihat
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        
        // Tunggu hingga tombol muncul di halaman
        await page.waitForSelector(loadMoreButtonSelector, { visible: true, timeout: 10000 });
        
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
          () => new Promise(resolve => setTimeout(resolve, 5000))
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

    // Fungsi untuk menghasilkan gaji dengan format "Rp x.000.000,00 - Rp x.000.000,00 / bulan"
    function getRandomSalary(min, max) {
      let randomMin = Math.floor(Math.random() * (max - min + 1)) + min;
      let randomMax = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // Pastikan randomMax lebih besar dari randomMin
      while (randomMax <= randomMin) {
        randomMax = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      // Format nilai ke dalam format yang diinginkan
      const formattedMin = (Math.round(randomMin / 1000000) * 1000000).toLocaleString('id-ID');
      const formattedMax = (Math.round(randomMax / 1000000) * 1000000).toLocaleString('id-ID');
      
      return `Rp ${formattedMin},00 - Rp ${formattedMax},00 / bulan`;
    }

    // Ambil konten halaman setelah data tambahan dimuat
    const content = await page.content();
    const $ = load(content);
    
    const jobs = [];
    $('.k-border.k-group.k-flex.k-flex-col.k-justify-between.css-1otdiuc').each((index, element) => {
      const title = $(element).find('a.k-text-black').text().trim();
      const company = $(element).find('a.k-text-subdued.k-font-bold').text().trim();
      let salary = $(element).find('span.k-text-subdued').text().trim();
      
      // Jika salary tidak ditemukan atau kosong, berikan nilai acak dalam rentang 8 juta - 15 juta
      if (!salary) {
        salary = getRandomSalary(8000000, 15000000);
      }
      
      jobs.push({ no: index + 1, title, company, salary });
    });
    
    await browser.close();
    
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error during scraping process:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat scraping data' });
  }
}
