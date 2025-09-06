import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function BookDetail() {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);

useEffect(() => {
  fetch(`https://book-explorer-s4gv.onrender.com/api/books/${id}`)
    .then((res) => res.json())
    .then((data) => setBook(data))
    .catch((err) => console.error("Error:", err));
}, [id]);


  if (!book) return <p>Loading book details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back to Books</Link>
      <h1>{book.title}</h1>
      <img src={book.imageUrl} alt={book.title} style={{ maxWidth: "200px" }} />
      <p><strong>Price:</strong> £{book.price}</p>
      <p><strong>Rating:</strong> {book.rating}</p>
      <p><strong>Status:</strong> {book.availability}</p>
      <p><a href={book.detailUrl} target="_blank">View Original Page</a></p>
    </div>
  );
}

export default BookDetail;
