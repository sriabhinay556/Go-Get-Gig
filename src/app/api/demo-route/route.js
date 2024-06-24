import axios from 'axios';
import nodeCron from 'node-cron';
import xml2js from 'xml2js';

let cache = {}; // In-memory cache
let isFetchFailed;
// Function to fetch and update the cache
const fetchAndCacheRSSFeed = async (searchQuery) => {
  // const url = `https://www.indeed.com/rss?q=${encodeURIComponent(searchQuery)}&l=United+States&sort=date`;
  
  // try {
  //   const response = await fetch(url, {
  //     cache: 'no-store',
  //     headers: {
  //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //       'Referer': 'https://www.indeed.com'
  //     }
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const responseData = await response.text(); // Get the raw text response
  //   const parsedData = await xml2js.parseStringPromise(responseData); // Parse the raw text
  //   const jobPostings = parsedData.rss.channel[0].item;
  //   cache[searchQuery] = { data: jobPostings, timestamp: Date.now() };
    
  //   console.log(cache[searchQuery].data);
  //   console.log("Fetching data successful!!!!!!!!!");
  //   isFetchFailed = false;
  // } catch (error) {
  //   console.error(`Failed to fetch and cache RSS feed for query: ${searchQuery}`, error.message);
  //   isFetchFailed = true;
  // }
  const url = "https://jsonplaceholder.typicode.com/users";
  
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.indeed.com'
      }
    });
    if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      console.log(await response.text())
    
      }
  catch(error){
    console.log("failed to fetch ", error)
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
  const searchQuery = "Software Developer"
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
    isCachedData=false
  } else {
    isCachedData=true
    console.log('Serving data from cache...');
  }

  const cachedData = cache[searchQuery]?.data || [];
  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'isCachedData': isCachedData,
      'isFetchFailed': isFetchFailed,
    },
  });
}
