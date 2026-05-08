import { useEffect, useState } from "react";
import Accounts from "../../features/Account/Accounts.jsx";
import allAboutSilverLogo from "../../assets/all-about-silver-logo.webp";
import { getArticles } from "../../firebase/articleServices.js";

function LeftSidebar() {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoadingArticles(false);
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

      <h2>Updates</h2>

      {loadingArticles ? (
        <p>Loading...</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} style={styles.newsCard}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.articleTitle}
            >
              <h4>{article.title}</h4>
            </a>

            <p style={styles.description}>
              {article.description}
            </p>
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
    marginBottom: "15px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  articleTitle: {
    textDecoration: "none",
    color: "black",
  },

  description: {
    fontSize: "14px",
    color: "#555",
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