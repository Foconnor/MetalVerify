import { createContext, useContext, useState } from "react";

const ThreeTestContext = createContext();

export function ThreeTestProvider({ children }) {
    const [threeTestMode, setThreeTestMode] = useState(false);
    const [threeTestId, setThreeTestId] = useState(null);
    const [testsRemaining, setTestsRemaining] = useState(0);

    const generateThreeTestId = () => {
        return "3test_" + Date.now();
    };

    const startThreeTest = () => {
        const id = generateThreeTestId();
        setThreeTestMode(true);
        setThreeTestId(id);
        setTestsRemaining(3);
    };

    const registerTest = () => {
        if (!threeTestMode) return null;

        const currentId = threeTestId;

        const remaining = testsRemaining - 1;
        setTestsRemaining(remaining);

        if (remaining <= 0) {
            setThreeTestMode(false);
            setThreeTestId(null);
            setTestsRemaining(0);
        }

        return currentId;
    };

    return (
        <ThreeTestContext.Provider
            value={{
                threeTestMode,
                threeTestId,
                testsRemaining,
                startThreeTest,
                registerTest
            }}
        >
            {children}
        </ThreeTestContext.Provider>
    );
}

export const useThreeTest = () => useContext(ThreeTestContext);