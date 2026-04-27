import { useEffect, useState } from "react";
import Accounts from "../../features/Account/Accounts.jsx";

function LeftSidebar() {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://api.marketaux.com/v1/news/all?search=silver&language=en&limit=5&api_token=WbU2yjMCNpn5P7YKzEpADvlV14vCbqlaHU8zz04B"
      );

      const data = await res.json();

      if (data && data.data) {
        setNews(data.data);
      }

      setLoadingNews(false);
    } catch (error) {
      console.error("News fetch error:", error);
      setLoadingNews(false);
    }
  };

  return (
    <div style={styles.sidebar}>
      <Accounts />

      <h2>News</h2>

      {loadingNews ? (
        <p>Loading...</p>
      ) : (
        news.map((article, index) => (
          <div key={index} style={styles.newsCard}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <h4>{article.title}</h4>
            </a>
            <p style={styles.newsSource}>{article.source}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default LeftSidebar;

const styles = {
  sidebar: {
    flex: 1,
    minWidth: "250px",
    maxWidth: "300px",
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
  },
  newsCard: {
    marginBottom: "10px",
  },
  newsSource: {
    fontSize: "12px",
    color: "gray",
  },
};