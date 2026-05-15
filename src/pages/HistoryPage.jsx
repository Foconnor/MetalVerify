import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    updateDoc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    // For editing labels
    const [editingScanId, setEditingScanId] = useState(null);
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

    // Group scans by threeTestId
    const groupedScans = scans.reduce((acc, scan) => {
        if (!scan.threeTestId) return acc;
        const key = scan.threeTestId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(scan);
        return acc;
    }, {});

    const threeTestGroups = Object.entries(groupedScans).filter(([_, group]) => group.length === 3);

    const calculateConsensus = (group) => {
        const total = group.reduce((sum, scan) => sum + (scan.results?.confidence || scan.confidence || 0), 0);
        const avg = Math.round(total / group.length);

        if (avg >= 85) return { verdict: "Highly Likely Genuine", color: "green" };
        if (avg >= 70) return { verdict: "Likely Genuine", color: "green" };
        if (avg >= 55) return { verdict: "Uncertain", color: "orange" };
        if (avg >= 40) return { verdict: "Likely Fake", color: "red" };
        return { verdict: "Very Likely Fake", color: "red" };
    };

    // Save label function
    const saveLabel = async (scanId) => {
        if (!newLabel.trim()) return;

        try {
            const scanRef = doc(db, "users", user.uid, "tests", scanId);
            await updateDoc(scanRef, { label: newLabel.trim() });

            // Update local state
            setScans(prev => prev.map(scan =>
                scan.id === scanId ? { ...scan, label: newLabel.trim() } : scan
            ));

            setEditingScanId(null);
            setNewLabel("");
        } catch (error) {
            console.error("Error updating label:", error);
            alert("Failed to save label");
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1>Scan History</h1>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "10px 18px",
                        backgroundColor: "#666",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer"
                    }}
                >
                    ← Return to Home
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
                <button onClick={() => setActiveTab("all")} style={{...styles.tabButton, background: activeTab === "all" ? "#1e1e1e" : "#ddd", color: activeTab === "all" ? "white" : "black" }}>
                    All Scans
                </button>
                <button onClick={() => setActiveTab("three-test")} style={{...styles.tabButton, background: activeTab === "three-test" ? "#1e1e1e" : "#ddd", color: activeTab === "three-test" ? "white" : "black" }}>
                    Three-Test Groups ({threeTestGroups.length})
                </button>
            </div>

            {/* ALL SCANS TAB */}
            {activeTab === "all" && (
                <div>
                    {scans.length === 0 ? (
                        <p>No scans yet.</p>
                    ) : (
                        scans.map((scan) => (
                            <div key={scan.id} style={styles.scanCard}>
                                <h4>{scan.type.toUpperCase()} Test</h4>
                                <p><strong>Item:</strong> {scan.profileName || scan.selectedCoin || "Unknown"}</p>

                                {/* Label Section */}
                                {editingScanId === scan.id ? (
                                    <div style={{ margin: "10px 0" }}>
                                        <input
                                            type="text"
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            placeholder="Enter label"
                                            style={{ padding: "8px", width: "70%", marginRight: "8px" }}
                                        />
                                        <button onClick={() => saveLabel(scan.id)} style={styles.smallBtn}>Save</button>
                                        <button onClick={() => { setEditingScanId(null); setNewLabel(""); }} style={styles.smallBtn}>Cancel</button>
                                    </div>
                                ) : (
                                    <p>
                                        <strong>Label:</strong> {scan.label || "—"}
                                        <button
                                            onClick={() => { setEditingScanId(scan.id); setNewLabel(scan.label || ""); }}
                                            style={styles.smallBtn}
                                        >
                                            {scan.label ? "Edit" : "Add Label"}
                                        </button>
                                    </p>
                                )}

                                {/* Other details */}
                                {scan.type === "ping" && scan.metrics && (
                                    <>
                                        <p><strong>Frequency:</strong> {scan.metrics.frequency} Hz</p>
                                        <p><strong>Duration:</strong> {scan.metrics.duration}s</p>
                                    </>
                                )}

                                {scan.type === "density" && scan.results && (
                                    <>
                                        <p><strong>Density:</strong> {scan.results.density} g/cm³</p>
                                        <p><strong>Expected:</strong> {scan.results.expectedDensity} g/cm³</p>
                                    </>
                                )}

                                {scan.results?.verdict && <p><strong>Verdict:</strong> {scan.results.verdict}</p>}
                                {scan.results?.confidence && <p><strong>Confidence:</strong> {scan.results.confidence}%</p>}

                                {/*{scan.threeTestId && <small>Group: {scan.threeTestId}</small>}*/}

                                {/* Add to Inventory */}
                                <button
                                    onClick={() => navigate("/inventory/add", { state: { testData: scan } })}
                                    style={{
                                        marginTop: "12px",
                                        padding: "8px 16px",
                                        backgroundColor: "#1e88e5",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        cursor: "pointer"
                                    }}
                                >
                                    Add To Inventory
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* THREE-TEST GROUPS TAB */}
            {activeTab === "three-test" && (
                <div>
                    {threeTestGroups.length === 0 ? (
                        <p>No complete 3-test sessions yet.</p>
                    ) : (
                        threeTestGroups.map(([groupId, group]) => {
                            const consensus = calculateConsensus(group);
                            return (
                                <div key={groupId} style={styles.groupCard}>
                                    <h3>3-Test Session</h3>
                                    <p><strong>Group ID:</strong> {groupId}</p>
                                    <p style={{ fontSize: "1.15rem", fontWeight: "bold", color: consensus.color }}>
                                        Consensus: {consensus.verdict}
                                    </p>

                                    <div style={{ marginTop: 15 }}>
                                        {group.map((scan, index) => (
                                            <div key={scan.id} style={styles.subScan}>
                                                <strong>Test {index + 1}:</strong> {scan.type.toUpperCase()} —
                                                {scan.profileName || scan.selectedCoin} •
                                                {scan.results?.verdict || scan.result}
                                                ({scan.results?.confidence || scan.confidence}%)
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;

const styles = {
    scanCard: {
        border: "1px solid #ddd",
        padding: 18,
        marginBottom: 15,
        borderRadius: 10,
        background: "#fafafa"
    },
    groupCard: {
        border: "2px solid #4caf50",
        padding: 20,
        marginBottom: 25,
        borderRadius: 12,
        background: "#f0f8f0"
    },
    subScan: {
        padding: "10px 0",
        borderBottom: "1px solid #eee"
    },
    smallBtn: {
        marginLeft: "8px",
        padding: "4px 10px",
        fontSize: "0.85rem",
        cursor: "pointer"
    }
};

function calculateConsensus(group) {
    const total = group.reduce((sum, scan) => sum + (scan.results?.confidence || scan.confidence || 0), 0);
    const avg = Math.round(total / group.length);

    if (avg >= 85) return { verdict: "Highly Likely Genuine", color: "green" };
    if (avg >= 70) return { verdict: "Likely Genuine", color: "green" };
    if (avg >= 55) return { verdict: "Uncertain", color: "orange" };
    if (avg >= 40) return { verdict: "Likely Fake", color: "red" };
    return { verdict: "Very Likely Fake", color: "red" };
}