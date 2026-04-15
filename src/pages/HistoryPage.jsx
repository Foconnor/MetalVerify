import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection,  query,  where,  getDocs,  orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function HistoryPage() {
    const { user } = useAuth();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchScans = async () => {
            try {
                const q = query(
                    collection(db, "userScans"),
                    where("userId", "==", user.uid),
                    orderBy("timestamp", "desc")
                );

                const snapshot = await getDocs(q);

                const results = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setScans(results);
            } catch (error) {
                console.error("Error fetching scans:", error);
            }
        };

        fetchScans();
    }, [user]);

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h1>Scan History</h1>

            {scans.length === 0 ? (
                <p>No scans yet.</p>
            ) : (
                scans.map((scan, index) => (
                    <div
                        key={scan.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: 15,
                            marginBottom: 10,
                            borderRadius: 8
                        }}
                    >
                        <h3>Scan #{index + 1}</h3>

                        <p><strong>Test:</strong> {scan.testType}</p>
                        <p><strong>Type:</strong> {scan.metalType}</p>
                        <p><strong>Item:</strong> {scan.profileName}</p>
                        <p><strong>Result:</strong> {scan.result}</p>
                        <p><strong>Confidence:</strong> {scan.confidence}%</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default HistoryPage;