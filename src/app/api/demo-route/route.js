import axios from 'axios';
import nodeCron from 'node-cron';
import xml2js from 'xml2js';

let cache = {}; // In-memory cache
let isFetchFailed = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch and update the cache
const fetchAndCacheRSSFeed = async (searchQuery, retries = 3) => {
  const url = `https://www.indeed.com/rss?q=${encodeURIComponent(searchQuery)}&l=United+States&sort=date`;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 50) + 70}.0.${Math.floor(Math.random() * 1000)}.124 Safari/537.36`,
          'Referer': 'https://www.indeed.com',
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 403 && i < retries - 1) {
          console.log(`Attempt ${i + 1} failed with status 403. Retrying...`);
          await delay(1000); // Wait 1 second before retrying
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.text(); // Get the raw text response
      const parsedData = await xml2js.parseStringPromise(responseData); // Parse the raw text
      const jobPostings = parsedData.rss.channel[0].item;
      cache[searchQuery] = { data: jobPostings, timestamp: Date.now() };

      console.log(cache[searchQuery].data);
      console.log("Fetching data successful!!!!!!!!!");
      isFetchFailed = false;
      break; // Exit the loop if the fetch was successful
    } catch (error) {
      console.error(`Failed to fetch and cache RSS feed for query: ${searchQuery}`, error.message);
      isFetchFailed = true;
      if (i === retries - 1) {
        throw error; // Rethrow the error if it fails after all retries
      }
    }
  }
};

// Schedule the cache updates every 30 minutes
nodeCron.schedule('*/30 * * * *', async () => {
  console.log('Scheduled cache update started at:', new Date().toLocaleString());
  for (const searchQuery in cache) {
    await fetchAndCacheRSSFeed(searchQuery);
  }
  console.log('Scheduled cache update finished at:', new Date().toLocaleString());
});

export async function GET() {
  const searchQuery = "Software Developer";
  console.log(`Received search query: ${searchQuery}`);

  if (!cache[searchQuery]) {
    // Initialize cache entry if it does not exist
    cache[searchQuery] = { data: null, timestamp: 0 };
  }

  let isCachedData;
  if (Date.now() - cache[searchQuery].timestamp > 1800000) {
    // If cache is older than 30 minutes, fetch new data

    console.log('Cache is older than 30 minutes, fetching new data...');
    await fetchAndCacheRSSFeed(searchQuery);
    isCachedData = false;
  } else {
    isCachedData = true;
    console.log('Serving data from cache...');
  }

  const cachedData = cache[searchQuery]?.data || [];
  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'isCachedData': isCachedData.toString(), // Ensure this is a string
      'isFetchFailed': isFetchFailed.toString(), // Ensure this is a string
    },
  });
}
