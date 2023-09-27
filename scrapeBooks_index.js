const axios = require('axios');
const cheerio = require('cheerio');
const Book = require('./models/book');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Connect to the MongoDB database
const { connectToDatabase } = require('./config/database'); // Import the database configuration from the config folder

// Scrape data from a single page
async function scrapePage(pageNumber) {
  try {
    // Fetch the HTML content of the page
    const response = await axios.get(`http://books.toscrape.com/catalogue/page-${pageNumber}.html`);
    const html = response.data;
    const $ = cheerio.load(html);

    const books = [];

    // Iterate through each book element on the page
    $('.product_pod').each((index, element) => {
      const title = $(element).find('h3 > a').attr('title');
      const priceText = $(element).find('div p.price_color').text();

      // Extract and parse the book price
      const priceMatch = priceText.match(/[\d.]+/); // Match one or more digits or dots
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

      const availability = $(element).find('div p.availability').text().trim() === 'In stock';
      const ratingsClass = $(element).find('p.star-rating').attr('class');
      const ratingsMap = {
        'star-rating One': 1,
        'star-rating Two': 2,
        'star-rating Three': 3,
        'star-rating Four': 4,
        'star-rating Five': 5,
      };
      const ratings = ratingsMap[ratingsClass] || 0;

      // Create a Book object and add it to the list
      const book = new Book({
        title,
        price,
        availability,
        ratings,
      });
      books.push(book);
    });

    return books;
  } catch (error) {
    console.error(`❌ Error scraping page ${pageNumber}:`, error); // Error message
    return [];
  }
}

// Main function to scrape books
async function scrapeBooks() {
  await connectToDatabase();

  const maxPages = 50; // Update with the actual number of pages or dynamically determine it

  const allBooks = [];
  for (let page = 1; page <= maxPages; page++) {
    const booksOnPage = await scrapePage(page);
    allBooks.push(...booksOnPage);
    console.log(`📚 Scraped page ${page}`); // Logging page number
  }

  if (allBooks.length > 0) {
    try {
      await Book.insertMany(allBooks);
      console.log('✅ Scraped and saved all books successfully.'); // Success message
    } catch (error) {
      console.error('❌ Error saving books to the database:', error); // Error message
    }
  } else {
    console.log('❗ No books scraped.'); // No books found message
  }

  await mongoose.connection.close();
  console.log('🔌 Disconnected from MongoDB'); // Disconnection message
}

scrapeBooks(); // Start the scraping process
