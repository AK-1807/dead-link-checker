import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

const visited = new Set(); 

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
    const links = await crawlSite(url, baseUrl);
    const linkStatus = await checkLinkStatus(links);

    return new Response(JSON.stringify({ status: 'success', linkStatus }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to crawl the website' }),
      { status: 500 }
    );
  }
}


async function crawlSite(url, baseUrl) {
  const allLinks = [];

  while (linksToVisit.length > 0) {
    const currentUrl = linksToVisit.pop();
    if (visited.has(currentUrl)) continue;

    visited.add(currentUrl); 

    console.log(`Crawling page: ${currentUrl}`); 
    const pageLinks = await extractLinks(currentUrl, baseUrl);
    allLinks.push(...pageLinks);

  
    for (const link of pageLinks) {
      if (link.startsWith(baseUrl) && !visited.has(link)) {
        linksToVisit.push(link);
      }
    }
  }

  return allLinks;
}


async function extractLinks(url, baseUrl) {
  try {
   
    if (!isValidUrl(url)) {
      console.error(`Skipping invalid URL: ${url}`);
      return [];
    }


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
   
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Go to the URL and wait until the network is idle (all resources loaded)
    console.log(`Navigating to: ${url}`);
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

    return links;
  } catch (error) {
    console.error('Error extracting links from', url, error);
    return [];
  }
}


function isValidUrl(url) {
  try {
    new URL(url); 
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}


async function checkLinkStatus(links) {
  const statusArr = [];
  for (let link of links) {
    try {
      const res = await axios.get(link, { timeout: 5000 });
      statusArr.push({ link, status: res.status });
    } catch (error) {
      statusArr.push({
        link,
        status: error.response ? error.response.status : 'Timeout/Other Error',
      });
    }
  }
  return statusArr;
}
