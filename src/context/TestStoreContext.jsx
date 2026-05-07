import { createContext, useContext, useState } from "react";

const TestStoreContext = createContext();

export function TestStoreProvider({ children }) {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <TestStoreContext.Provider value={{ selectedItem, setSelectedItem }}>
            {children}
        </TestStoreContext.Provider>
    );
}

export const useTestStore = () => useContext(TestStoreContext);