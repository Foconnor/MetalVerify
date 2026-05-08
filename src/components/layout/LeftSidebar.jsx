import { useEffect, useState } from "react";
import Accounts from "../../features/Account/Accounts.jsx";
import allAboutSilverLogo from "../../assets/all-about-silver-logo.webp";

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

      {/* All About Silver Link */}
      <a
        href="https://video-blog-site.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.logoLink}
      >
        <img
          src={allAboutSilverLogo}
          alt="All About Silver"
          style={styles.logo}
        />

        <span style={styles.logoText}>All About Silver</span>
      </a>

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

  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  logo: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },

  logoText: {
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
  },
};