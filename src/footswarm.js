/**
 * Footswarm Charts Library
 * 
 * A JavaScript library for creating footswarm charts - distribution visualizations
 * that show individual data points with statistical overlays and jittering to prevent overlap.
 * 
 * Based on Observable Plot and inspired by swarm plots and beeswarm charts.
 */

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

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
 * @returns {number[]} Array of y-coordinates
 */
export function generateJitter(count, jitter = 0.5, method = 'random') {
    const coords = [];
    
    if (method === 'uniform') {
        // Distribute points uniformly within the jitter range
        for (let i = 0; i < count; i++) {
            const position = (i / (count - 1)) - 0.5; // -0.5 to 0.5
            coords.push(position * jitter);
        }
        // Shuffle to avoid systematic patterns
        return d3.shuffle(coords);
    } else {
        // Random jittering (default)
        for (let i = 0; i < count; i++) {
            coords.push((Math.random() - 0.5) * jitter);
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

    // Prepare data with jittered y-coordinates
    const processedData = [];
    const categories = [...new Set(data.map(d => d[y]))];
    
    categories.forEach(category => {
        const categoryData = data.filter(d => d[y] === category);
        const jitterCoords = generateJitter(categoryData.length, jitter, jitterMethod);
        
        categoryData.forEach((d, i) => {
            processedData.push({
                ...d,
                jitteredY: jitterCoords[i],
                originalCategory: d[y]
            });
        });
    });

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

    // Create marks array
    const marks = [];

    // Background lines at y=0 for each category
    marks.push(
        Plot.ruleY(categories.map(cat => ({ category: cat, y: 0 })), {
            y: d => d.category,
            stroke: "#f0f0f0",
            strokeWidth: 1
        })
    );

    // Data points with jittering
    marks.push(
        Plot.dot(processedData, {
            x: x,
            y: d => d.jitteredY,
            fy: "originalCategory",
            fill: pointColor,
            fillOpacity: opacity,
            stroke: "none",
            r: pointRadius,
            tip: showTooltips,
            title: showTooltips ? d => `${d[x]?.toFixed?.(2) || d[x]}` : undefined
        })
    );

    // Mean lines
    if (showMean) {
        marks.push(
            Plot.ruleX(statsData, {
                x: "mean",
                fy: "category",
                stroke: "#ff6b6b",
                strokeWidth: 2,
                strokeDasharray: "5,5"
            })
        );

        // Mean labels
        marks.push(
            Plot.text(statsData, {
                x: "mean",
                y: 0.7,
                fy: "category",
                text: "Mean",
                fill: "#ff6b6b",
                fontSize: 10,
                fontWeight: "bold",
                textAnchor: "start",
                dx: 5
            })
        );
    }

    // Median lines
    if (showMedian) {
        marks.push(
            Plot.ruleX(statsData, {
                x: "median",
                fy: "category",
                stroke: "#4ecdc4",
                strokeWidth: 2,
                strokeDasharray: "10,2"
            })
        );

        // Median labels
        marks.push(
            Plot.text(statsData, {
                x: "median",
                y: -0.7,
                fy: "category",
                text: "Median",
                fill: "#4ecdc4",
                fontSize: 10,
                fontWeight: "bold",
                textAnchor: "end",
                dx: -5
            })
        );
    }

    // Zero line
    marks.push(Plot.ruleX([0]));

    return Plot.plot({
        width,
        height,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        title,
        x: {
            label: xLabel,
            grid: true,
            domain: xDomain,
            nice: true
        },
        fy: {
            label: yLabel,
            domain: categories,
            padding: 0.1
        },
        y: {
            domain: [-1, 1],
            ticks: [],
            axis: null
        },
        marks
    });
}

/**
 * Create a vertical footswarm chart
 * @param {Array} data - Array of data objects
 * @param {Object} options - Configuration options
 * @returns {Object} Observable Plot object
 */
export function createVerticalFootswarmChart(data, options = {}) {
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

    // Prepare data with jittered x-coordinates
    const processedData = [];
    const categories = [...new Set(data.map(d => d[x]))];
    
    categories.forEach(category => {
        const categoryData = data.filter(d => d[x] === category);
        const jitterCoords = generateJitter(categoryData.length, jitter, jitterMethod);
        
        categoryData.forEach((d, i) => {
            processedData.push({
                ...d,
                jitteredX: jitterCoords[i],
                originalCategory: d[x]
            });
        });
    });

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

    // Create marks array
    const marks = [];

    // Background lines at x=0 for each category
    marks.push(
        Plot.ruleX(categories.map(cat => ({ category: cat, x: 0 })), {
            x: d => d.category,
            stroke: "#f0f0f0",
            strokeWidth: 1
        })
    );

    // Data points with jittering
    marks.push(
        Plot.dot(processedData, {
            x: d => d.jitteredX,
            y: y,
            fx: "originalCategory",
            fill: pointColor,
            fillOpacity: opacity,
            stroke: "none",
            r: pointRadius,
            tip: showTooltips,
            title: showTooltips ? d => `${d[y]?.toFixed?.(2) || d[y]}` : undefined
        })
    );

    // Mean lines
    if (showMean) {
        marks.push(
            Plot.ruleY(statsData, {
                y: "mean",
                fx: "category",
                stroke: "#ff6b6b",
                strokeWidth: 2,
                strokeDasharray: "5,5"
            })
        );
    }

    // Median lines
    if (showMedian) {
        marks.push(
            Plot.ruleY(statsData, {
                y: "median",
                fx: "category",
                stroke: "#4ecdc4",
                strokeWidth: 2,
                strokeDasharray: "10,2"
            })
        );
    }

    // Zero line
    marks.push(Plot.ruleY([0]));

    return Plot.plot({
        width,
        height,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        title,
        y: {
            label: yLabel,
            grid: true,
            domain: yDomain,
            nice: true
        },
        fx: {
            label: xLabel,
            domain: categories,
            padding: 0.1
        },
        x: {
            domain: [-1, 1],
            ticks: [],
            axis: null
        },
        marks
    });
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
