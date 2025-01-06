import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
    });
  }

  const url1 = new URL(url);
  const baseUrl = `${url1.protocol}//${url1.host}`;

  try {
    // const browser = await puppeteer.launch({ headless: true });
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',  
    });
    
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2' });

   
    const content = await page.content();
    await browser.close(); 


    const $ = cheerio.load(content);
    const links = [];
    $('a').each((i, element) => {
      let href = $(element).attr('href');
      if (href) {
        if (href.startsWith('/') || !href.startsWith('http')) {
          href = baseUrl + href; 
        }
        links.push(href);
      }
    });

    
    const linkStatus = await checkLinkStatus(links);

    return new Response(JSON.stringify({ status: 'success', linkStatus }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in crawling:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch the URL or crawl the page' }),
      { status: 500 }
    );
  }
}


async function checkLinkStatus(links) {
  const statusArr = [];
  for (let link of links) {
    try {
      const res = await axios.get(link, { timeout: 10000 }); 
      // if(res.status != 200){
        statusArr.push({ link, status: res.status });
      // }
    } catch (error) {
      statusArr.push({
        link,
        status: error.response ? error.response.status : 'Timeout/Other Error',
      });
    }
  }
  return statusArr;
}
