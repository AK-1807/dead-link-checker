import axios from 'axios';
import cheerio from 'cheerio';

// Function to get all links from a given URL
export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { url } = req.query; // Get the URL from the query string

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      // Fetch the HTML content of the page
      const response = await axios.get(url);

      // Load the HTML content into cheerio (jQuery-like syntax)
      const $ = cheerio.load(response.data);

      // Create an array to store all the links
      const links = [];

      // Select all <a> tags and extract the href attribute
      $('a').each((i, element) => {
        const href = $(element).attr('href');
        if (href) {
          // Normalize relative URLs
          const fullUrl = new URL(href, url).href;
          links.push(fullUrl);
        }
      });

      // Send the links as JSON response
      res.status(200).json({ links });
    } catch (error) {
      console.error('Error fetching the URL:', error);
      res.status(500).json({ error: 'Error fetching the URL' });
    }
  } else {
    // If not a GET request
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
