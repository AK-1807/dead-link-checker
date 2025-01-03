import axios from 'axios';
import * as cheerio from 'cheerio'; 
import { URL } from 'url'; 


export async function POST(req) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
    });
  }

  const baseUrl = new URL(url).origin;
  const visited = new Set();
  const allLinks = []; 

  try {
    await crawl(url, baseUrl, visited, allLinks);

    const linkStatus = await checkLinkStatus(allLinks);

    return new Response(JSON.stringify({ status: 'success', linkStatus }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to crawl and check links' }),
      { status: 500 }
    );
  }
}


async function crawl(url, baseUrl, visited, allLinks, depth = 0, maxDepth = 3) {
  if (visited.has(url) || depth > maxDepth) return; 

  visited.add(url);
  const config = {
    timeout: 10000, 
  };

  try {
    const response = await axios.get(url, config); 
    const html = response.data;
    const $ = cheerio.load(html);

  
    $('a').each((i, element) => {
      let href = $(element).attr('href');
      if (href) {
        href = normalizeLink(href, baseUrl);
        if (href && !visited.has(href)) {
        
          allLinks.push(href); 
         
          if (href.startsWith(baseUrl)) {
            setTimeout(() => crawl(href, baseUrl, visited, allLinks, depth + 1, maxDepth), 2000); // Throttle with a 2-second delay
          }
        }
      }
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`404 Not Found: ${url}`);
    } else {
      console.error(`Failed to crawl ${url}:`, error.message);
    }
  }
}

function normalizeLink(href, baseUrl) {
  try {
    
    if (href.startsWith('/') || !href.startsWith('http')) {
      const url = new URL(href, baseUrl);
      return url.href;
    }
    return href; 
  } catch (error) {
    console.error(`Error normalizing link: ${href}`,error);
    return null;
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
