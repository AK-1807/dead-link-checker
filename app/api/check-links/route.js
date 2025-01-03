import axios from 'axios';
import * as cheerio from 'cheerio'; // Updated import

// This function will be invoked when the API route is hit
export async function POST(req) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
    });
  }

  try {
    // Fetch the HTML content of the page
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML content into cheerio
    const $ = cheerio.load(html);

    // Extract all the links (anchor tags)
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

    // Check the status of each link
    const linkStatus = await checkLinkStatus(links);

    return new Response(JSON.stringify({ status: 'success', linkStatus }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch the URL or crawl the page' }),
      { status: 500 }
    );
  }
}

async function checkLinkStatus(links) {
  const statusArr = [];
  for (const link of links) {
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
  return {statusArr};
}
