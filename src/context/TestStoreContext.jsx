import { createContext, useContext, useState, useEffect } from "react";

const TestStoreContext = createContext();

export function TestStoreProvider({ children }) {
    // Load from localStorage on initial render
    const [selectedItem, setSelectedItem] = useState(() => {
        const saved = localStorage.getItem("selectedTestItem");
        return saved ? JSON.parse(saved) : null;
    });

    // Save to localStorage whenever selectedItem changes
    useEffect(() => {
        if (selectedItem) {
            localStorage.setItem("selectedTestItem", JSON.stringify(selectedItem));
        } else {
            localStorage.removeItem("selectedTestItem");
        }
    }, [selectedItem]);

    const clearSelectedItem = () => {
        setSelectedItem(null);
    };

    return (
        <TestStoreContext.Provider value={{
            selectedItem,
            setSelectedItem,
            clearSelectedItem
        }}>
            {children}
        </TestStoreContext.Provider>
    );
}

export const useTestStore = () => useContext(TestStoreContext);