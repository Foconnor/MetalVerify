import { createContext, useContext, useState } from "react";

const TestSessionContext = createContext();

export function TestSessionProvider({ children }) {
    const [selectedType, setSelectedType] = useState(null); // coin | bar
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [startingTest, setStartingTest] = useState(null); // ping | density | magnet

    const startSession = ({ type, profile, test }) => {
        setSelectedType(type);
        setSelectedProfile(profile);
        setStartingTest(test);
    };

    const clearSession = () => {
        setSelectedType(null);
        setSelectedProfile(null);
        setStartingTest(null);
    };

    return (
        <TestSessionContext.Provider
            value={{
                selectedType,
                selectedProfile,
                startingTest,
                startSession,
                clearSession
            }}
        >
            {children}
        </TestSessionContext.Provider>
    );
}

export const useTestSession = () => useContext(TestSessionContext);