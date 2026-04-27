import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
    collection,
    getDocs,
    orderBy,
    query
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function HistoryPage() {
    const { user } = useAuth();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchScans = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "tests"),
                    orderBy("createdAt", "desc")
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

    const groupedScans = scans.reduce((acc, scan) => {
        const key = scan.threeTestId || scan.id;

        if (!acc[key]) acc[key] = [];
        acc[key].push(scan);

        return acc;
    }, {});

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h1>Scan History</h1>

            {Object.keys(groupedScans).length === 0 ? (
                <p>No scans yet.</p>
            ) : (
                Object.entries(groupedScans).map(([groupId, group], groupIndex) => (
                    <div key={groupId} style={{ marginBottom: "25px" }}>

                        {/* GROUP HEADER */}
                        <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
                            {group[0].threeTestId
                                ? `3-Test Group #${groupIndex + 1}`
                                : `Single Test #${groupIndex + 1}`}
                        </h2>

                        {group.map((scan, index) => (
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

                                <p><strong>Type:</strong> {scan.type}</p>

                                {/* LABEL */}
                                {scan.label && (
                                    <p><strong>Label:</strong> {scan.label}</p>
                                )}

                                {/* PING */}
                                {scan.type === "ping" && (
                                    <>
                                        <p><strong>Item:</strong> {scan.profileName}</p>
                                        <p><strong>Frequency:</strong> {scan.metrics?.frequency} Hz</p>
                                        <p><strong>Duration:</strong> {scan.metrics?.duration}s</p>
                                        <p><strong>Confidence:</strong> {scan.results?.confidence}%</p>
                                        <p><strong>Result:</strong> {scan.results?.verdict}</p>
                                    </>
                                )}

                                {/* DENSITY */}
                                {scan.type === "density" && (
                                    <>
                                        <p><strong>Item Type:</strong> {scan.itemType}</p>
                                        <p><strong>Density:</strong> {scan.results?.density}</p>
                                        <p><strong>Expected:</strong> {scan.results?.expectedDensity}</p>
                                        <p><strong>Confidence:</strong> {scan.results?.confidence}%</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default HistoryPage;