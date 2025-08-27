/**
 * Sample datasets for footswarm chart examples
 */

// Generate normal distribution data
function generateNormalData(mean, stdDev, count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + z0 * stdDev);
    }
    return data;
}

// Generate skewed distribution data
function generateSkewedData(count, skew = 2) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const value = Math.pow(u, skew) * 100;
        data.push(value);
    }
    return data;
}

// Generate bimodal distribution data
function generateBimodalData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const mode = Math.random() < 0.6 ? 1 : 2;
        if (mode === 1) {
            data.push(...generateNormalData(25, 5, 1));
        } else {
            data.push(...generateNormalData(75, 8, 1));
        }
    }
    return data;
}

/**
 * Dataset 1: Meeting Time Analysis (inspired by your original data)
 * Simulates daily meeting hours by software developer level
 */
export const meetingTimeData = [
    // L1 developers - fewer meetings
    ...generateNormalData(1.5, 0.8, 25).map(value => ({
        level: 'L1',
        value: Math.max(0.1, value),
        category: 'L1'
    })),
    
    // L2 developers
    ...generateNormalData(2.2, 1.0, 30).map(value => ({
        level: 'L2',
        value: Math.max(0.1, value),
        category: 'L2'
    })),
    
    // L3 developers
    ...generateNormalData(2.8, 1.2, 35).map(value => ({
        level: 'L3',
        value: Math.max(0.1, value),
        category: 'L3'
    })),
    
    // L4 developers - senior, more meetings
    ...generateNormalData(3.5, 1.5, 28).map(value => ({
        level: 'L4',
        value: Math.max(0.1, value),
        category: 'L4'
    })),
    
    // L5 developers - tech leads, variable meeting load
    ...generateBimodalData(20).map(value => ({
        level: 'L5',
        value: value / 20, // Scale to reasonable hours
        category: 'L5'
    })),
    
    // L6 developers - senior leads, high meeting load
    ...generateNormalData(4.8, 2.0, 15).map(value => ({
        level: 'L6',
        value: Math.max(0.1, value),
        category: 'L6'
    })),
    
    // L7 developers - architects, very high meeting load
    ...generateNormalData(5.5, 2.2, 12).map(value => ({
        level: 'L7',
        value: Math.max(0.1, value),
        category: 'L7'
    }))
];

/**
 * Dataset 2: Performance Metrics by Team
 * Simulates performance scores across different teams
 */
export const performanceData = [
    // Frontend team
    ...generateNormalData(78, 12, 40).map(value => ({
        team: 'Frontend',
        score: Math.max(0, Math.min(100, value)),
        category: 'Frontend'
    })),
    
    // Backend team
    ...generateNormalData(82, 10, 35).map(value => ({
        team: 'Backend',
        score: Math.max(0, Math.min(100, value)),
        category: 'Backend'
    })),
    
    // DevOps team - bimodal (some very high performers, some struggling)
    ...generateBimodalData(25).map(value => ({
        team: 'DevOps',
        score: Math.max(0, Math.min(100, value)),
        category: 'DevOps'
    })),
    
    // Data team
    ...generateNormalData(85, 8, 30).map(value => ({
        team: 'Data',
        score: Math.max(0, Math.min(100, value)),
        category: 'Data'
    })),
    
    // Mobile team - smaller team, more variable
    ...generateNormalData(75, 15, 20).map(value => ({
        team: 'Mobile',
        score: Math.max(0, Math.min(100, value)),
        category: 'Mobile'
    }))
];

/**
 * Dataset 3: Response Times by Day of Week
 * Simulates API response times across different days
 */
export const responseTimeData = [
    // Monday - fresh start, good performance
    ...generateNormalData(120, 25, 50).map(value => ({
        day: 'Monday',
        responseTime: Math.max(10, value),
        category: 'Monday'
    })),
    
    // Tuesday - optimal performance
    ...generateNormalData(95, 20, 55).map(value => ({
        day: 'Tuesday',
        responseTime: Math.max(10, value),
        category: 'Tuesday'
    })),
    
    // Wednesday - mid-week, consistent
    ...generateNormalData(105, 22, 52).map(value => ({
        day: 'Wednesday',
        responseTime: Math.max(10, value),
        category: 'Wednesday'
    })),
    
    // Thursday - slight degradation
    ...generateNormalData(115, 28, 48).map(value => ({
        day: 'Thursday',
        responseTime: Math.max(10, value),
        category: 'Thursday'
    })),
    
    // Friday - end of week, more variable performance
    ...generateSkewedData(45, 1.5).map(value => ({
        day: 'Friday',
        responseTime: value + 80, // Shift up baseline
        category: 'Friday'
    }))
];

/**
 * Dataset 4: Sales Performance by Region
 * Simulates sales figures across different regions
 */
export const salesData = [
    // North America - large market, normal distribution
    ...generateNormalData(150000, 40000, 60).map(value => ({
        region: 'North America',
        sales: Math.max(10000, value),
        category: 'North America'
    })),
    
    // Europe - mature market, consistent performance
    ...generateNormalData(120000, 25000, 45).map(value => ({
        region: 'Europe',
        sales: Math.max(10000, value),
        category: 'Europe'
    })),
    
    // Asia Pacific - growing market, high variability
    ...generateNormalData(180000, 60000, 55).map(value => ({
        region: 'Asia Pacific',
        sales: Math.max(10000, value),
        category: 'Asia Pacific'
    })),
    
    // Latin America - emerging market, skewed distribution
    ...generateSkewedData(35, 2).map(value => ({
        region: 'Latin America',
        sales: value * 2000 + 20000,
        category: 'Latin America'
    })),
    
    // Middle East & Africa - small but growing
    ...generateNormalData(80000, 35000, 25).map(value => ({
        region: 'MEA',
        sales: Math.max(10000, value),
        category: 'MEA'
    }))
];

/**
 * Dataset 5: Student Test Scores by Subject
 * Simulates test scores across different subjects
 */
export const testScoreData = [
    // Mathematics - normal distribution, slightly lower mean
    ...generateNormalData(72, 15, 80).map(value => ({
        subject: 'Mathematics',
        score: Math.max(0, Math.min(100, value)),
        category: 'Mathematics'
    })),
    
    // Science - bimodal (some excel, others struggle)
    ...generateBimodalData(75).map(value => ({
        subject: 'Science',
        score: Math.max(0, Math.min(100, value)),
        category: 'Science'
    })),
    
    // English - normal distribution, higher mean
    ...generateNormalData(78, 12, 85).map(value => ({
        subject: 'English',
        score: Math.max(0, Math.min(100, value)),
        category: 'English'
    })),
    
    // History - normal distribution
    ...generateNormalData(75, 14, 70).map(value => ({
        subject: 'History',
        score: Math.max(0, Math.min(100, value)),
        category: 'History'
    })),
    
    // Art - skewed distribution (many high scores)
    ...generateSkewedData(60, 0.5).map(value => ({
        subject: 'Art',
        score: 100 - value, // Invert for high scores
        category: 'Art'
    }))
];

/**
 * Dataset 6: Simple Example for Getting Started
 * Small dataset perfect for tutorials
 */
export const simpleData = [
    // Group A
    { category: 'Group A', value: 10 },
    { category: 'Group A', value: 12 },
    { category: 'Group A', value: 8 },
    { category: 'Group A', value: 15 },
    { category: 'Group A', value: 11 },
    { category: 'Group A', value: 9 },
    { category: 'Group A', value: 13 },
    
    // Group B
    { category: 'Group B', value: 18 },
    { category: 'Group B', value: 22 },
    { category: 'Group B', value: 20 },
    { category: 'Group B', value: 25 },
    { category: 'Group B', value: 19 },
    { category: 'Group B', value: 21 },
    { category: 'Group B', value: 24 },
    
    // Group C
    { category: 'Group C', value: 30 },
    { category: 'Group C', value: 35 },
    { category: 'Group C', value: 28 },
    { category: 'Group C', value: 32 },
    { category: 'Group C', value: 38 },
    { category: 'Group C', value: 29 },
    { category: 'Group C', value: 33 }
];

// Export all datasets
export default {
    meetingTimeData,
    performanceData,
    responseTimeData,
    salesData,
    testScoreData,
    simpleData
};
