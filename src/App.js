import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  const cardsPerPage = 5;

  useEffect(() => {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts";

    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset errors
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Initialize filtered data
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, data]);

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/favorites">Heart Page</Link>
        </nav>

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div>
                <h1>Home Page</h1>
                <input
                  type="text"
                  placeholder="Search by title or body..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />

                <div className="card-container">
                  {currentCards.length > 0 ? (
                    currentCards.map((item) => (
                      <div className="card" key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.body}</p>
                        <div
                          className={`heart-icon ${
                            favorites.includes(item.id) ? "liked" : ""
                          }`}
                          onClick={() => toggleFavorite(item.id)}
                        >
                          ♥
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No results found.</p>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        className={`page-button ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          />

          {/* Favorites Page */}
          <Route
            path="/favorites"
            element={
              <div>
                <h1>Heart Page</h1>
                {favorites.length > 0 ? (
                  <div className="card-container">
                    {data
                      .filter((item) => favorites.includes(item.id))
                      .map((item) => (
                        <div className="card" key={item.id}>
                          <h2>{item.title}</h2>
                          <p>{item.body}</p>
                          <div
                            className="heart-icon liked"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            ♥
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p>No favorites selected.</p>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
