export const COIN_PROFILES = {
    american_silver_eagle: {
        name: "American Silver Eagle",
        idealFreq: 5100,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.6,
        thickness: 2.98,
        expectedDensity: 10.49
    },

    morgan_dollar: {
        name: "Morgan Dollar",
        idealFreq: 4200,
        tolerance: 350,
        minDuration: 1.1,
        weight: 26.73,
        diameter: 38.1,
        thickness: 2.4,
        expectedDensity: 10.34
    },

    britannia: {
        name: "Britannia",
        idealFreq: 5200,
        tolerance: 250,
        minDuration: 0.9,
        weight: 31.103,
        diameter: 38.61,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    maple_leaf: {
        name: "Canadian Maple Leaf",
        idealFreq: 5000,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 38.0,
        thickness: 3.15,
        expectedDensity: 10.49
    },

    // Additional top/popular silver bullion coins
    austrian_philharmonic: {
        name: "Austrian Silver Philharmonic",
        idealFreq: 5150,      // Similar to other .999 1 oz modern coins
        tolerance: 280,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 37.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    mexican_libertad: {
        name: "Mexican Silver Libertad",
        idealFreq: 5050,
        tolerance: 320,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    somalian_elephant: {
        name: "Somalian Silver Elephant",
        idealFreq: 4950,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    chinese_panda: {
        name: "Chinese Silver Panda",
        idealFreq: 5100,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    australian_kangaroo: {
        name: "Australian Silver Kangaroo",
        idealFreq: 5000,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    perth_kookaburra: {
        name: "Australian Silver Kookaburra",
        idealFreq: 5050,
        tolerance: 310,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    perth_koala: {
        name: "Australian Silver Koala",
        idealFreq: 5000,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    south_african_krugerrand: {
        name: "South African Silver Krugerrand",
        idealFreq: 4900,
        tolerance: 350,
        minDuration: 1.0,     // .999 fine but slightly different geometry
        weight: 31.103,
        diameter: 38.0,
        thickness: 3.0,
        expectedDensity: 10.49
    },

    peace_dollar: {
        name: "Peace Dollar",
        idealFreq: 4150,      // Similar 90% silver dollar to Morgan
        tolerance: 350,
        minDuration: 1.1,
        weight: 26.73,
        diameter: 38.1,
        thickness: 2.4,
        expectedDensity: 10.34
    },

    american_silver_eagle_90: {  // Hypothetical older style or variant reference
        name: "American Silver Eagle (variant ref)",
        idealFreq: 5100,
        tolerance: 300,
        minDuration: 1.0,
        weight: 31.103,
        diameter: 40.6,
        thickness: 2.98,
        expectedDensity: 10.49
    },

    // More collector/investment notables
    walking_liberty_half: {
        name: "Walking Liberty Half Dollar (90%)",
        idealFreq: 4800,
        tolerance: 400,
        minDuration: 0.9,
        weight: 31.103,
        diameter: 30.6,
        thickness: 2.0,
        expectedDensity: 10.34

    },

    franklin_half: {
        name: "Franklin Half Dollar (90%)",
        idealFreq: 4750,
        tolerance: 400,
        minDuration: 0.9,
        weight: 31.103,
        diameter: 30.6,
        thickness: 2.0,
        expectedDensity: 10.34
    },

    jfk_half_pre65: {
        name: "Kennedy Half Dollar (pre-1965, 90%)",
        idealFreq: 4700,
        tolerance: 400,
        minDuration: 0.9,
        weight: 31.103,
        diameter: 30.6,
        thickness: 2.0,
        expectedDensity: 10.34
    },

    silver_washington_quarter: {
        name: "Washington Quarter (pre-1965, 90%)",
        idealFreq: 5200,      // Smaller coin → higher freq
        tolerance: 450,
        minDuration: 0.8,
        weight: 31.103,
        diameter: 24.3,
        thickness: 1.7,
        expectedDensity: 10.34

    },

    silver_roosevelt_dime: {
        name: "Roosevelt Dime (pre-1965, 90%)",
        idealFreq: 5800,      // Even smaller → higher freq
        tolerance: 500,
        minDuration: 0.7,
        weight: 31.103,
        diameter: 18.2,
        thickness: 1.2,
        expectedDensity: 10.34
    },

    // Bonus common one often mentioned
    junk_silver_generic: {
        name: "Generic 90% Junk Silver",
        idealFreq: 5000,      // Approximate average for US 90%
        tolerance: 600,       // Wide due to variety of denominations/years
        minDuration: 0.9,
        weight: 31.103,
        diameter: 40.0,
        thickness: 3.0,
        expectedDensity: 10.49
    }
};