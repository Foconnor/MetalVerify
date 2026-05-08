import { useEffect, useState } from "react";
import AppHeader from "../../components/layout/AppHeader.jsx";

import {
    getArticles,
    deleteArticle,
    addArticle,
} from "../../firebase/articleServices.js";

function AdminArticles() {
    const [articles, setArticles] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");

    const fetchArticles = async () => {
        const data = await getArticles();
        setArticles(data);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        await deleteArticle(id);
        fetchArticles();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !link) {
            alert("Please fill all fields");
            return;
        }

        await addArticle({
            title,
            description,
            link,
        });

        setTitle("");
        setDescription("");
        setLink("");

        fetchArticles();
    };

    return (
      <div >
        <AppHeader />
        <div style={styles.pageContainer}>

          

            {/* LEFT SIDE */}
            <div style={styles.leftPanel}>
                <h2 style={styles.heading}>Create Article</h2>

                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        type="text"
                        placeholder="Article Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                    />

                    <textarea
                        placeholder="Article Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={styles.textarea}
                    />

                    <input
                        type="text"
                        placeholder="Article Link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.addButton}>
                        Add Article
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE */}
            <div style={styles.rightPanel}>
                <h2 style={styles.heading}>Existing Articles</h2>

                {articles.length === 0 ? (
                    <p>No articles found.</p>
                ) : (
                    articles.map((article) => (
                        <div
                            key={article.id}
                            style={styles.articleCard}
                        >
                            <h3>{article.title}</h3>

                            <p style={styles.description}>
                                {article.description}
                            </p>

                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.link}
                            >
                                Visit Link
                            </a>

                            <button
                                onClick={() => handleDelete(article.id)}
                                style={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
        
    );
}

export default AdminArticles;

const styles = {
    pageContainer: {
        display: "flex",
        gap: "25px",
        width: "100%",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },

    leftPanel: {
        flex: 1,
        minWidth: "320px",
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },

    rightPanel: {
        flex: 2,
        minWidth: "400px",
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },

    heading: {
        marginBottom: "20px",
        color: "#1e2f4d",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        fontSize: "14px",
        width: "100%",
        boxSizing: "border-box",
    },

    textarea: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        fontSize: "14px",
        minHeight: "120px",
        resize: "vertical",
        width: "100%",
        boxSizing: "border-box",
    },

    addButton: {
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "#1e2f4d",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },

    articleCard: {
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    description: {
        color: "#555",
        lineHeight: "1.5",
    },

    link: {
        color: "#4a63ff",
        textDecoration: "none",
        fontWeight: "bold",
    },

    deleteButton: {
        width: "120px",
        padding: "10px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "#d9534f",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },
};