const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/book_explorer")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// define schema here directly (instead of importing from backend)
const bookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  availability: String,
  rating: String,
  detailUrl: String,
  imageUrl: String,
});

const Book = mongoose.model("Book", bookSchema);

async function scrapeBooks() {
  try {
    await Book.deleteMany({});
    console.log("🗑 Old books removed");

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const url = `https://books.toscrape.com/catalogue/page-${page}.html`;
      console.log("🔎 Scraping:", url);

      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        if ($(".product_pod").length === 0) {
          hasNext = false;
          break;
        }

        for (let el of $(".product_pod")) {
          const title = $(el).find("h3 a").attr("title");
          const price = $(el).find(".price_color").text().replace("£", "");
          const availability = $(el).find(".availability").text().trim();
          const rating = $(el).find(".star-rating").attr("class").split(" ")[1];
          const detailUrl =
            "https://books.toscrape.com/catalogue/" +
            $(el).find("h3 a").attr("href");
          const imageUrl =
            "https://books.toscrape.com/" + $(el).find("img").attr("src");

          const book = new Book({
            title,
            price: parseFloat(price),
            availability,
            rating,
            detailUrl,
            imageUrl,
          });

          await book.save();
        }

        page++;
      } catch (err) {
        hasNext = false;
      }
    }

    console.log("✅ Scraping completed");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

scrapeBooks();
