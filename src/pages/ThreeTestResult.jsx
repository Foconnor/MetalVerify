import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ThreeTestResult() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const [tests, setTests] = useState([]);
    const [consensus, setConsensus] = useState("");

    const styles = {
        title: {
            textAlign: "center",
            marginBottom: "30px",
        },

        buttonContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            gap: "10px",
        },

        button: {
            flex: 1,
            padding: "15px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1e1e1e",
            color: "white",
        },
    };


    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        const q = query(
            collection(db, "users", user.uid, "tests"),
            where("threeTestId", "==", id)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setTests(data);

        calculateConsensus(data);
    };

    const calculateConsensus = (data) => {
        let score = 0;

        data.forEach(test => {
            score += test.results?.confidence || 0;
        });

        const average = score / data.length;

        if (average >= 80) {
            setConsensus("Highly Likely Genuine");
        }
        else if (average >= 60) {
            setConsensus("Likely Genuine");
        }
        else if (average >= 40) {
            setConsensus("Uncertain");
        }
        else {
            setConsensus("Likely Fake");
        }
    };

    return (
        <div>
            <h1>3-Test Consensus Result</h1>

            <h2>{consensus}</h2>

            {tests.map(test => (
                <div key={test.id}>
                    <p>{test.type}</p>
                    <p>{test.results?.confidence}%</p>
                    <p>{test.results?.verdict}</p>
                </div>
            ))}
            <button style={styles.button} onClick={() => navigate("/")}>
                Back to home
            </button>
        </div>
    );
}

export default ThreeTestResult;