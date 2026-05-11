import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTestStore } from "../../context/TestStoreContext";

import { saveInventoryItem } from "../../firebase/saveInventoryItem";

export default function AddInventoryItem() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth();
    const { selectedItem } = useTestStore();

    // Optional test data passed from result pages
    const testData = location.state?.testData || null;

    // Basic fields
    const [name, setName] = useState(
        selectedItem?.name || ""
    );

    const [type, setType] = useState(
        selectedItem?.type || "coin"
    );

    const [year, setYear] = useState("");
    const [mint, setMint] = useState("");

    // Generic details
    const [metal, setMetal] = useState("");
    const [weight, setWeight] = useState("");
    const [diameter, setDiameter] = useState("");
    const [thickness, setThickness] = useState("");

    // Descriptions
    const [description1, setDescription1] = useState("");
    const [description2, setDescription2] = useState("");

    // Optional advanced fields
    const [serialNumber, setSerialNumber] = useState("");
    const [notes, setNotes] = useState("");

    // Expand advanced section
    const [showAdvanced, setShowAdvanced] =
        useState(false);

    async function handleSave() {
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            await saveInventoryItem({
                userId: user.uid,

                item: {
                    name,
                    type,

                    year,
                    mint,

                    metal,
                    weight,
                    diameter,
                    thickness,

                    description1,
                    description2,

                    serialNumber,
                    notes,

                    linkedThreeTestId:
                        testData?.threeTestId || null
                }
            });

            alert("Inventory item saved.");

            navigate("/inventory");

        } catch (error) {
            console.error(error);
            alert("Failed to save inventory item.");
        }
    }

    return (
        <div
            style={{
                maxWidth: 600,
                margin: "40px auto",
                padding: 20
            }}
        >
            <h1>Add To Inventory</h1>

            {/* NAME */}
            <div style={{ marginBottom: 15 }}>
                <label>Name</label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    style={styles.input}
                />
            </div>

            {/* TYPE */}
            <div style={{ marginBottom: 15 }}>
                <label>Type</label>

                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                    style={styles.input}
                >
                    <option value="coin">Coin</option>
                    <option value="bar">Bar</option>
                </select>
            </div>

            {/* YEAR */}
            <div style={{ marginBottom: 15 }}>
                <label>Year</label>

                <input
                    type="text"
                    value={year}
                    onChange={(e) =>
                        setYear(e.target.value)
                    }
                    style={styles.input}
                />
            </div>

            {/* MINT */}
            <div style={{ marginBottom: 15 }}>
                <label>Mint</label>

                <input
                    type="text"
                    value={mint}
                    onChange={(e) =>
                        setMint(e.target.value)
                    }
                    style={styles.input}
                />
            </div>

            {/* METAL */}
            <div style={{ marginBottom: 15 }}>
                <label>Metal</label>

                <input
                    type="text"
                    value={metal}
                    onChange={(e) =>
                        setMetal(e.target.value)
                    }
                    style={styles.input}
                />
            </div>

            {/* WEIGHT */}
            <div style={{ marginBottom: 15 }}>
                <label>Weight</label>

                <input
                    type="text"
                    value={weight}
                    onChange={(e) =>
                        setWeight(e.target.value)
                    }
                    style={styles.input}
                />
            </div>

            {/* DESCRIPTION 1 */}
            <div style={{ marginBottom: 15 }}>
                <label>Short Description</label>

                <textarea
                    value={description1}
                    onChange={(e) =>
                        setDescription1(e.target.value)
                    }
                    style={styles.textarea}
                />
            </div>

            {/* DESCRIPTION 2 */}
            <div style={{ marginBottom: 15 }}>
                <label>Detailed Notes</label>

                <textarea
                    value={description2}
                    onChange={(e) =>
                        setDescription2(e.target.value)
                    }
                    style={styles.textarea}
                />
            </div>

            {/* ADVANCED TOGGLE */}
            <button
                onClick={() =>
                    setShowAdvanced(!showAdvanced)
                }
                style={styles.advancedButton}
            >
                {showAdvanced
                    ? "Hide Advanced Fields"
                    : "Show Advanced Fields"}
            </button>

            {/* ADVANCED SECTION */}
            {showAdvanced && (
                <div
                    style={{
                        marginTop: 20,
                        padding: 15,
                        border: "1px solid #ccc",
                        borderRadius: 8
                    }}
                >
                    {/* DIAMETER */}
                    <div style={{ marginBottom: 15 }}>
                        <label>Diameter</label>

                        <input
                            type="text"
                            value={diameter}
                            onChange={(e) =>
                                setDiameter(e.target.value)
                            }
                            style={styles.input}
                        />
                    </div>

                    {/* THICKNESS */}
                    <div style={{ marginBottom: 15 }}>
                        <label>Thickness</label>

                        <input
                            type="text"
                            value={thickness}
                            onChange={(e) =>
                                setThickness(e.target.value)
                            }
                            style={styles.input}
                        />
                    </div>

                    {/* SERIAL */}
                    <div style={{ marginBottom: 15 }}>
                        <label>Serial Number</label>

                        <input
                            type="text"
                            value={serialNumber}
                            onChange={(e) =>
                                setSerialNumber(e.target.value)
                            }
                            style={styles.input}
                        />
                    </div>

                    {/* NOTES */}
                    <div style={{ marginBottom: 15 }}>
                        <label>Extra Notes</label>

                        <textarea
                            value={notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                            style={styles.textarea}
                        />
                    </div>
                </div>
            )}

            {/* TEST INFO */}
            {testData && (
                <div
                    style={{
                        marginTop: 20,
                        padding: 10,
                        background: "#f5f5f5",
                        borderRadius: 8
                    }}
                >
                    <h3>Linked Test</h3>

                    <p>
                        Test Type: {testData.type}
                    </p>

                    {testData.threeTestId && (
                        <p>
                            Three Test ID:
                            {" "}
                            {testData.threeTestId}
                        </p>
                    )}
                </div>
            )}

            {/* SAVE BUTTON */}
            <button
                onClick={handleSave}
                style={styles.saveButton}
            >
                Save Inventory Item
            </button>
        </div>
    );
}

const styles = {
    input: {
        width: "100%",
        padding: 10,
        marginTop: 5,
        borderRadius: 6,
        border: "1px solid #ccc"
    },

    textarea: {
        width: "100%",
        padding: 10,
        marginTop: 5,
        minHeight: 80,
        borderRadius: 6,
        border: "1px solid #ccc"
    },

    saveButton: {
        marginTop: 25,
        width: "100%",
        padding: 14,
        border: "none",
        borderRadius: 8,
        backgroundColor: "#1e1e1e",
        color: "white",
        cursor: "pointer",
        fontSize: 16
    },

    advancedButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 6,
        border: "1px solid #ccc",
        cursor: "pointer"
    }
};