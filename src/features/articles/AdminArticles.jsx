import { useEffect, useState } from "react";
import AppHeader from "../../components/layout/AppHeader.jsx";

import {
    getArticles,
    deleteArticle,
    addArticle,
    updateArticle,
} from "../../firebase/articleServices.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function AdminArticles() {
    const [activeTab, setActiveTab] = useState("articles");

    // Articles
    const [articles, setArticles] = useState([]);

    // Coins & Bars
    const [coins, setCoins] = useState([]);
    const [bars, setBars] = useState([]);

    // Form state
    const [form, setForm] = useState({
        title: "", description: "", link: "",           // Article fields
        name: "", idealFreq: "", tolerance: "", minDuration: "",
        weight: "", diameter: "", thickness: "", expectedDensity: "10.49"
    });

    const [editingId, setEditingId] = useState(null);

    // Fetch all data
    const fetchData = async () => {
        // Articles
        const articleData = await getArticles();
        setArticles(articleData);

        // Coins
        const coinSnap = await getDocs(collection(db, "coinProfiles"));
        setCoins(coinSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Bars
        const barSnap = await getDocs(collection(db, "barProfiles"));
        setBars(barSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setForm({
            title: "", description: "", link: "",
            name: "", idealFreq: "", tolerance: "", minDuration: "",
            weight: "", diameter: "", thickness: "", expectedDensity: "10.49"
        });
        setEditingId(null);
    };

    // ==================== SUBMIT HANDLER ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isArticle = activeTab === "articles";
        const collectionName = isArticle ? null : activeTab === "coins" ? "coinProfiles" : "barProfiles";

        try {
            if (editingId) {
                if (isArticle) {
                    await updateArticle(editingId, {
                        title: form.title,
                        description: form.description,
                        link: form.link
                    });
                } else {
                    await updateDoc(doc(db, collectionName, editingId), form);
                }
                alert("Updated successfully!");
            } else {
                if (isArticle) {
                    await addArticle({
                        title: form.title,
                        description: form.description,
                        link: form.link
                    });
                } else {
                    await addDoc(collection(db, collectionName), form);
                }
                alert("Added successfully!");
            }

            resetForm();
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to save.");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm(item);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;

        try {
            if (activeTab === "articles") {
                await deleteArticle(id);
            } else {
                const collectionName = activeTab === "coins" ? "coinProfiles" : "barProfiles";
                await deleteDoc(doc(db, collectionName, id));
            }
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete.");
        }
    };

    return (
        <div>
            <AppHeader />
            <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
                <h1>Admin Dashboard</h1>

                {/* Tabs */}
                <div style={{ marginBottom: 25 }}>
                    <button onClick={() => { setActiveTab("articles"); resetForm(); }} style={{ ...styles.tab, background: activeTab === "articles" ? "#1e1e1e" : "#ddd", color: activeTab === "articles" ? "white" : "black" }}>
                        Articles
                    </button>
                    <button onClick={() => { setActiveTab("coins"); resetForm(); }} style={{ ...styles.tab, background: activeTab === "coins" ? "#1e1e1e" : "#ddd", color: activeTab === "coins" ? "white" : "black" }}>
                        Coins
                    </button>
                    <button onClick={() => { setActiveTab("bars"); resetForm(); }} style={{ ...styles.tab, background: activeTab === "bars" ? "#1e1e1e" : "#ddd", color: activeTab === "bars" ? "white" : "black" }}>
                        Bars
                    </button>
                </div>

                {/* Form */}
                <div style={styles.formContainer}>
                    <h2>
                        {editingId ? "Edit" : "Add New"} {activeTab === "articles" ? "Article" : activeTab === "coins" ? "Coin" : "Bar"}
                    </h2>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {activeTab === "articles" ? (
                            <>
                                <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} style={styles.input} required />
                                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={styles.textarea} required />
                                <input type="text" placeholder="Link" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} style={styles.input} required />
                            </>
                        ) : (
                            <>
                                <input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Name" style={styles.input} required />
                                <input name="idealFreq" type="number" value={form.idealFreq} onChange={(e) => setForm({...form, idealFreq: e.target.value})} placeholder="Ideal Frequency (Hz)" style={styles.input} required />
                                <input name="tolerance" type="number" value={form.tolerance} onChange={(e) => setForm({...form, tolerance: e.target.value})} placeholder="Tolerance" style={styles.input} required />
                                <input name="weight" type="number" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} placeholder="Weight (g)" style={styles.input} required />
                                <input name="expectedDensity" type="number" step="0.01" value={form.expectedDensity} onChange={(e) => setForm({...form, expectedDensity: e.target.value})} placeholder="Expected Density" style={styles.input} required />
                            </>
                        )}

                        <div style={{ display: "flex", gap: 10 }}>
                            <button type="submit" style={styles.submitButton}>
                                {editingId ? "Update" : "Add"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <h2 style={{ marginTop: 40 }}>
                    {activeTab === "articles" ? "Articles" : activeTab === "coins" ? "Coins" : "Bars"}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                    {(activeTab === "articles" ? articles : activeTab === "coins" ? coins : bars).map(item => (
                        <div key={item.id} style={styles.card}>
                            <h4>{activeTab === "articles" ? item.title : item.name}</h4>
                            <p>{activeTab === "articles" ? item.description?.substring(0, 100) + "..." : `Freq: ${item.idealFreq} Hz`}</p>

                            <div style={{ marginTop: 12 }}>
                                <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminArticles;

const styles = {
    tab: { padding: "12px 24px", marginRight: 10, border: "none", borderRadius: 8, cursor: "pointer" },
    formContainer: { background: "#f9f9f9", padding: 25, borderRadius: 12, marginBottom: 30 },
    form: { display: "flex", flexDirection: "column", gap: 12 },
    input: { padding: 12, borderRadius: 8, border: "1px solid #ccc" },
    textarea: { padding: 12, borderRadius: 8, border: "1px solid #ccc", minHeight: 100 },
    submitButton: { padding: "12px", background: "#1e2f4d", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
    card: { border: "1px solid #ddd", padding: 15, borderRadius: 10, background: "#fafafa" },
    editBtn: { padding: "6px 12px", background: "#1976d2", color: "white", border: "none", borderRadius: 6, marginRight: 8 },
    deleteBtn: { padding: "6px 12px", background: "#d32f2f", color: "white", border: "none", borderRadius: 6 }
};