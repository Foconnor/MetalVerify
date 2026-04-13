import {useEffect, useState} from 'react'
import {calculateCoinDensity} from '../DensityCalculations';
import { fetchCoinProfiles } from '../../Account/DatabaseCode.js';

function CoinDensityTest({ onCalculate, onHome }) {
    const [inputData, setInputData] = useState({
        diameter: "",
        thickness: "",
        weight: ""
    });

    const [coinProfiles, setCoinProfiles] = useState({});
    const [selectedCoin, setSelectedCoin] = useState("unknown");

    useEffect(() => {
        const loadCoinProfiles = async () => {
            const profiles = await fetchCoinProfiles();
            setCoinProfiles(profiles);
        };
        loadCoinProfiles();
        
    }, []);

    const handleCoinChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleCoinSelect = (e) => {
        const value = e.target.value;
        setSelectedCoin(value);
    };

    const handleSubmit = () => {
        const density = calculateCoinDensity(
            inputData.diameter,
            inputData.thickness,
            inputData.weight
        );
        
        const expectedDensity = 10.49;
        const deviation = Math.abs(density - expectedDensity);
        const confidence = Math.max(0, 100 - (deviation / expectedDensity) * 100).toFixed(2);

        const resultData = {
            confidence,
            density,
            expectedDensity
        };

        onCalculate({
            type: "density",
            itemType: "coin",
            input: inputData,
            results: resultData,
            selectedCoinData: selectedCoin === "unknown" ? null : coinProfiles[selectedCoin]
        });
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Coin Density Test</h2>

            {/* Coin Selector */}
            <div className="form-row">
                <label className="form-label">Select Coin:</label>
                <select
                value={selectedCoin}
                onChange={handleCoinSelect}
                className="form-input"
                >
                <option value="unknown">Not Sure / Don't Know</option>
                {Object.entries(coinProfiles).map(([id, coin]) => (
                    <option key={id} value={id}>
                    {coin.name}
                    </option>
                ))}
                </select>
            </div>


            {/* Diameter */}
            <div className="form-row">
                <label className="form-label">Diameter:</label>
                <input
                type="number"
                name="diameter"
                value={inputData.diameter}
                onChange={handleCoinChange}
                className="form-input"
            />
                <span>cm</span>
            </div>

            {/* Thickness */}
            <div className="form-row">
                <label className="form-label">Thickness:</label>
                <input
                type="number"
                name="thickness"
                value={inputData.thickness}
                onChange={handleCoinChange}
                className="form-input"
                />
                <span>cm</span>
            </div>

            {/* Weight */}
            <div className="form-row">
                <label className="form-label">Weight:</label>
                <input
                type="number"
                name="weight"
                value={inputData.weight}
                onChange={handleCoinChange}
                className="form-input"
                />
                <span>g</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={onHome}>Home</button>
                <button onClick={handleSubmit}>Calculate</button>
            </div>
        </div>
    );
}

export default CoinDensityTest;