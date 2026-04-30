import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
    collection,
    getDocs,
    orderBy,
    query
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { updateTestLabel } from "../features/Account/DatabaseCode";

function HistoryPage() {
    const { user } = useAuth();
    const [scans, setScans] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newLabel, setNewLabel] = useState("");

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
                        {editingId === scan.id ? (
                            <>
                                <input
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="Enter label"
                                />

                                <button
                                    onClick={async () => {
                                        await updateTestLabel(scan.id, newLabel);

                                        // update UI instantly
                                        setScans(prev =>
                                            prev.map(s =>
                                                s.id === scan.id ? { ...s, label: newLabel } : s
                                            )
                                        );

                                        setEditingId(null);
                                        setNewLabel("");
                                    }}
                                >
                                    Save
                                </button>

                                <button onClick={() => setEditingId(null)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Label:</strong> {scan.label || "None"}
                                </p>

                                <button
                                    onClick={() => {
                                        setEditingId(scan.id);
                                        setNewLabel(scan.label || "");
                                    }}
                                >
                                    {scan.label ? "Edit Label" : "Add Label"}
                                </button>
                            </>
                        )}

                        <p><strong>Type:</strong> {scan.type}</p>

                        {scan.type === "ping" && (
                            <>
                                <p><strong>Item:</strong> {scan.profileName}</p>
                                <p><strong>Frequency:</strong> {scan.metrics?.frequency} Hz</p>
                                <p><strong>Duration:</strong> {scan.metrics?.duration}s</p>
                                <p><strong>Confidence:</strong> {scan.results?.confidence}%</p>
                                <p><strong>Result:</strong> {scan.results?.verdict}</p>
                            </>
                        )}

                        {scan.type === "density" && (
                            <>
                                <p><strong>Item Type:</strong> {scan.itemType}</p>
                                <p><strong>Density:</strong> {scan.results?.density}</p>
                                <p><strong>Expected:</strong> {scan.results?.expectedDensity}</p>
                                <p><strong>Confidence:</strong> {scan.results?.confidence}%</p>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default HistoryPage;