import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();

    const [silverPrice, setSilverPrice] = useState(null);
    const [news, setNews] = useState([]);
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        fetchSilverPrice();
        fetchNews();
    }, []);

    const fetchSilverPrice = async () => {
        try {
            const res = await fetch("https://api.gold-api.com/price/XAG");
            const data = await res.json();

            setSilverPrice(data.price);
            setLoadingPrice(false);
        } catch (error) {
            console.error("Silver price error:", error);
            setLoadingPrice(false);
        }
    };

    const fetchNews = async () => {
        try {

            const res = await fetch(
                "https://api.marketaux.com/v1/news/all?search=silver&language=en&limit=5&api_token=WbU2yjMCNpn5P7YKzEpADvlV14vCbqlaHU8zz04B"
            );

            const data = await res.json();

            if (data && data.data) {
                setNews(data.data);
            } else {
                console.error("Invalid news response", data);
            }

            setLoadingNews(false);

        } catch (error) {
            console.error("News fetch error:", error);
            setLoadingNews(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h1>Metal Verify</h1>

            <p>Welcome to Metal Verify.</p>
            <p>Check silver authenticity using sound and density testing.</p>

            {/* LIVE SILVER PRICE */}
            <div style={{ marginTop: "2rem" }}>
                <h2>Live Silver Price</h2>

                {loadingPrice ? (
                    <p>Loading silver price...</p>
                ) : (
                    <p>${silverPrice} / oz</p>
                )}
            </div>

            {/* SILVER MARKET NEWS */}
            <div style={{ marginTop: "2rem" }}>
                <h2>Silver Market News</h2>

                {loadingNews ? (
                    <p>Loading news...</p>
                ) : (
                    news.map((article, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;