/**
 * Footswarm Charts Library
 * 
 * A JavaScript library for creating footswarm charts - distribution visualizations
 * that show individual data points with statistical overlays and jittering to prevent overlap.
 * 
 * Based on Observable Plot and inspired by swarm plots and beeswarm charts.
 */

// Use globally available Plot and d3 (loaded via CDN)
const Plot = window.Plot;
const d3 = window.d3;

// Add error checking for dependencies
if (!Plot) {
    throw new Error('Observable Plot is not available. Make sure it is loaded before this script.');
}
if (!d3) {
    throw new Error('D3 is not available. Make sure it is loaded before this script.');
}

/**
 * Calculate basic statistics for a dataset
 * @param {number[]} values - Array of numeric values
 * @returns {Object} Statistics object with mean, median, min, max, q1, q3
 */
export function calculateStats(values) {
    if (!values || values.length === 0) {
        return { mean: 0, median: 0, min: 0, max: 0, q1: 0, q3: 0, count: 0 };
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const median = n % 2 === 0 
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    
    return {
        mean,
        median,
        min: sorted[0],
        max: sorted[n - 1],
        q1,
        q3,
        count: n
    };
}

/**
 * Generate jittered y-coordinates for data points
 * @param {number} count - Number of data points
 * @param {number} jitter - Jitter amount (0-1)
 * @param {string} method - Jittering method ('random' or 'uniform')
 * @param {number} seed - Seed for deterministic random generation
 * @returns {number[]} Array of y-coordinates
 */
export function generateJitter(count, jitter = 0.5, method = 'random', seed = 12345) {
    const coords = [];
    
    if (method === 'uniform') {
        // Distribute points uniformly within the jitter range
        for (let i = 0; i < count; i++) {
            const position = (i / (count - 1)) - 0.5; // -0.5 to 0.5
            coords.push(position * jitter);
        }
        // Shuffle to avoid systematic patterns using seeded random
        const seededRandom = d3.randomLcg(seed);
        return d3.shuffle(coords, seededRandom);
    } else {
        // Seeded random jittering for consistent results
        const seededRandom = d3.randomLcg(seed);
        for (let i = 0; i < count; i++) {
            coords.push((seededRandom() - 0.5) * jitter);
        }
        return coords;
    }
}

/**
 * Create a horizontal footswarm chart
 * @param {Array} data - Array of data objects
 * @param {Object} options - Configuration options
 * @returns {Object} Observable Plot object
 */
export function createFootswarmChart(data, options = {}) {
    try {
        console.log('🔧 Creating footswarm chart with data:', data.slice(0, 3));
        console.log('🔧 Chart options:', options);
        
        const {
            x = "value",                    // x-axis field name
            y = "category",                 // y-axis field name (for grouping)
            width = 800,
            height = 400,
            marginLeft = 100,
            marginRight = 40,
            marginTop = 20,
            marginBottom = 40,
            opacity = 0.6,
            jitter = 0.5,
            jitterMethod = 'random',
            pointRadius = 4,
            pointColor = "#4285f4",
            showMean = true,
            showMedian = true,
            showTooltips = false,
            xLabel = null,
            yLabel = null,
            xDomain = null,
            title = null
        } = options;

        // Validate data
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        // Get categories first (needed for both paths)
        const categories = [...new Set(data.map(d => d[y]))];
        console.log('🏷️ Categories found:', categories);

        // Use pre-processed data if provided, otherwise generate jittered coordinates
        let processedData;
        if (options._processedData) {
            processedData = options._processedData;
        } else {
            processedData = [];
            
            categories.forEach((category, categoryIndex) => {
                const categoryData = data.filter(d => d[y] === category);
                // Use a deterministic seed based on category to ensure consistent jitter
                const seed = 12345 + categoryIndex * 1000;
                const jitterCoords = generateJitter(categoryData.length, jitter, jitterMethod, seed);
                
                categoryData.forEach((d, i) => {
                    processedData.push({
                        ...d,
                        jitteredY: jitterCoords[i],
                        originalCategory: d[y]
                    });
                });
            });
        }

        console.log('📊 Processed data sample:', processedData.slice(0, 3));

        // Calculate statistics for each category
        const statsData = categories.map(category => {
            const categoryData = data.filter(d => d[y] === category);
            const values = categoryData.map(d => d[x]);
            const stats = calculateStats(values);
            return {
                category,
                ...stats
            };
        });

        console.log('📈 Stats data:', statsData);

        // Start with a simple chart - just dots
        const marks = [
            Plot.dot(processedData, {
                x: x,
                y: d => d.jitteredY,
                fy: "originalCategory",
                fill: pointColor,
                fillOpacity: opacity,
                r: pointRadius
            })
        ];

        // Add mean lines if requested
        if (showMean && statsData.length > 0) {
            marks.push(
                Plot.ruleX(statsData, {
                    x: "mean",
                    fy: "category",
                    stroke: "#ff6b6b",
                    strokeWidth: 2
                })
            );
        }

        // Add median lines if requested
        if (showMedian && statsData.length > 0) {
            marks.push(
                Plot.ruleX(statsData, {
                    x: "median",
                    fy: "category",
                    stroke: "#4ecdc4",
                    strokeWidth: 2
                })
            );
        }

        console.log('🎨 Creating plot with marks:', marks.length);

        const plotConfig = {
            width,
            height,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            x: {
                label: xLabel,
                grid: true,
                nice: true
            },
            fy: {
                label: yLabel,
                domain: categories,
                padding: 0.1
            },
            y: {
                domain: [-1, 1],
                axis: null
            },
            marks
        };

        console.log('⚙️ Plot config:', plotConfig);

        const plot = Plot.plot(plotConfig);
        console.log('✅ Plot created successfully');
        
        return plot;
        
    } catch (error) {
        console.error('❌ Error in createFootswarmChart:', error);
        throw error;
    }
}

/**
 * Create a vertical footswarm chart
 * @param {Array} data - Array of data objects
 * @param {Object} options - Configuration options
 * @returns {Object} Observable Plot object
 */
export function createVerticalFootswarmChart(data, options = {}) {
    try {
        console.log('🔧 Creating vertical footswarm chart with data:', data.slice(0, 3));
        console.log('🔧 Vertical chart options:', options);
        
        const {
            x = "category",                 // x-axis field name (for grouping)
            y = "value",                    // y-axis field name
            width = 600,
            height = 400,
            marginLeft = 60,
            marginRight = 40,
            marginTop = 20,
            marginBottom = 60,
            opacity = 0.6,
            jitter = 0.5,
            jitterMethod = 'random',
            pointRadius = 4,
            pointColor = "#4285f4",
            showMean = true,
            showMedian = true,
            showTooltips = false,
            xLabel = null,
            yLabel = null,
            yDomain = null,
            title = null
        } = options;

        // Validate data
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        // Get categories first (needed for both paths)
        const categories = [...new Set(data.map(d => d[x]))];
        console.log('🏷️ Vertical chart categories found:', categories);

        // Use pre-processed data if provided, otherwise generate jittered coordinates
        let processedData;
        if (options._processedData) {
            console.log('📋 Using pre-processed data with cached jitter coordinates for vertical chart');
            processedData = options._processedData;
        } else {
            console.log('🔄 Generating new jittered coordinates for vertical chart');
            processedData = [];
            
            categories.forEach((category, categoryIndex) => {
                const categoryData = data.filter(d => d[x] === category);
                // Use a deterministic seed based on category to ensure consistent jitter
                const seed = 12345 + categoryIndex * 1000;
                const jitterCoords = generateJitter(categoryData.length, jitter, jitterMethod, seed);
                
                categoryData.forEach((d, i) => {
                    processedData.push({
                        ...d,
                        jitteredX: jitterCoords[i],
                        originalCategory: d[x]
                    });
                });
            });
        }

        console.log('📊 Vertical processed data sample:', processedData.slice(0, 3));

        // Calculate statistics for each category
        const statsData = categories.map(category => {
            const categoryData = data.filter(d => d[x] === category);
            const values = categoryData.map(d => d[y]);
            const stats = calculateStats(values);
            return {
                category,
                ...stats
            };
        });

        console.log('📈 Vertical stats data:', statsData);

        // Start with a simple chart - just dots
        const marks = [
            Plot.dot(processedData, {
                x: d => d.jitteredX,
                y: y,
                fx: "originalCategory",
                fill: pointColor,
                fillOpacity: opacity,
                r: pointRadius
            })
        ];

        // Add mean lines if requested
        if (showMean && statsData.length > 0) {
            marks.push(
                Plot.ruleY(statsData, {
                    y: "mean",
                    fx: "category",
                    stroke: "#ff6b6b",
                    strokeWidth: 2
                })
            );
        }

        // Add median lines if requested
        if (showMedian && statsData.length > 0) {
            marks.push(
                Plot.ruleY(statsData, {
                    y: "median",
                    fx: "category",
                    stroke: "#4ecdc4",
                    strokeWidth: 2
                })
            );
        }

        console.log('🎨 Creating vertical plot with marks:', marks.length);

        const plotConfig = {
            width,
            height,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            y: {
                label: yLabel,
                grid: true,
                nice: true
            },
            fx: {
                label: xLabel,
                domain: categories,
                padding: 0.1
            },
            x: {
                domain: [-1, 1],
                axis: null
            },
            marks
        };

        console.log('⚙️ Vertical plot config:', plotConfig);

        const plot = Plot.plot(plotConfig);
        console.log('✅ Vertical plot created successfully');
        
        return plot;
        
    } catch (error) {
        console.error('❌ Error in createVerticalFootswarmChart:', error);
        throw error;
    }
}

/**
 * Create interactive controls for footswarm charts
 * @param {Object} options - Control options
 * @returns {Object} Object containing control elements and state
 */
export function createControls(options = {}) {
    const {
        showOpacityControl = true,
        showJitterControl = true,
        showStatControls = true,
        initialOpacity = 0.6,
        initialJitter = 0.5,
        initialShowMean = true,
        initialShowMedian = true
    } = options;

    const controls = {};
    const state = {
        opacity: initialOpacity,
        jitter: initialJitter,
        showMean: initialShowMean,
        showMedian: initialShowMedian
    };

    if (showOpacityControl) {
        controls.opacity = document.createElement('div');
        controls.opacity.innerHTML = `
            <label>
                Opacity: <span class="opacity-value">${initialOpacity}</span>
                <input type="range" min="0.1" max="1" step="0.1" value="${initialOpacity}" class="opacity-slider">
            </label>
        `;
        
        const slider = controls.opacity.querySelector('.opacity-slider');
        const valueSpan = controls.opacity.querySelector('.opacity-value');
        
        slider.addEventListener('input', (e) => {
            state.opacity = parseFloat(e.target.value);
            valueSpan.textContent = state.opacity;
        });
    }

    if (showJitterControl) {
        controls.jitter = document.createElement('div');
        controls.jitter.innerHTML = `
            <label>
                Jitter: <span class="jitter-value">${initialJitter}</span>
                <input type="range" min="0" max="1" step="0.1" value="${initialJitter}" class="jitter-slider">
            </label>
        `;
        
        const slider = controls.jitter.querySelector('.jitter-slider');
        const valueSpan = controls.jitter.querySelector('.jitter-value');
        
        slider.addEventListener('input', (e) => {
            state.jitter = parseFloat(e.target.value);
            valueSpan.textContent = state.jitter;
        });
    }

    if (showStatControls) {
        controls.stats = document.createElement('div');
        controls.stats.innerHTML = `
            <label>
                <input type="checkbox" ${initialShowMean ? 'checked' : ''} class="mean-checkbox">
                Show Mean
            </label>
            <label>
                <input type="checkbox" ${initialShowMedian ? 'checked' : ''} class="median-checkbox">
                Show Median
            </label>
        `;
        
        const meanCheckbox = controls.stats.querySelector('.mean-checkbox');
        const medianCheckbox = controls.stats.querySelector('.median-checkbox');
        
        meanCheckbox.addEventListener('change', (e) => {
            state.showMean = e.target.checked;
        });
        
        medianCheckbox.addEventListener('change', (e) => {
            state.showMedian = e.target.checked;
        });
    }

    return { controls, state };
}

// Export default object with all functions
export default {
    createFootswarmChart,
    createVerticalFootswarmChart,
    calculateStats,
    generateJitter,
    createControls
};
