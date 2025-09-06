
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import BookDetail from "./pages/BookDetail";

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [sortOption, setSortOption] = useState("");

  // fetch books from backend API with pagination + filters
  useEffect(() => {
    let url = `http://localhost:5000/api/books?page=${currentPage}&limit=${limit}`;

    if (search) url += `&title=${search}`;
    if (ratingFilter) url += `&rating=${ratingFilter}`;
    if (stockFilter) url += `&stock=${stockFilter === "In stock"}`;
    if (minPrice && maxPrice) url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    if (sortOption) url += `&sort=${sortOption}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalPages(Math.ceil(data.total / limit));
      })
      .catch((err) => console.error("Error:", err));
  }, [search, ratingFilter, stockFilter, minPrice, maxPrice, currentPage]);

  return (
    <div>
      <h1>Book Explorer 📚</h1>

      {/* Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to page 1 when searching
          }}
          style={{
            padding: "10px",
            width: "60%",
            maxWidth: "400px",
            borderRadius: "5px",
            border: "1px solid gray",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Ratings</option>
          <option value="One">⭐ One</option>
          <option value="Two">⭐⭐ Two</option>
          <option value="Three">⭐⭐⭐ Three</option>
          <option value="Four">⭐⭐⭐⭐ Four</option>
          <option value="Five">⭐⭐⭐⭐⭐ Five</option>
        </select>

        <select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}>
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>


        <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Stock</option>
          <option value="In stock">In Stock</option>
          <option value="Out of stock">Out of Stock</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
          style={{ width: "100px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
          style={{ width: "100px" }}
        />
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <p style={{ textAlign: "center" }}>No books found.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <Link to={`/book/${book._id}`} key={book._id} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="book-card">
                <img src={book.imageUrl} alt={book.title} />
                <h2>{book.title}</h2>
                <p><strong>£{book.price}</strong></p>
                <p>⭐ Rating: {book.rating}</p>
                <p>{book.availability}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail />} />
    </Routes>
  );
}

export default App;
