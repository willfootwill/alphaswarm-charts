/**
 * Interactive examples for footswarm charts
 */

// Add error handling for imports
let footswarmModule, dataModule;

try {
    footswarmModule = await import('../src/footswarm.js');
    dataModule = await import('../data/sample-datasets.js');
    console.log('✅ Modules loaded successfully');
} catch (error) {
    console.error('❌ Error loading modules:', error);
    document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Error Loading Modules</h2>
        <p>Failed to load required modules. Please check the console for details.</p>
        <pre>${error.message}</pre>
    </div>`;
    throw error;
}

const { createFootswarmChart, createVerticalFootswarmChart, calculateStats } = footswarmModule;
const { 
    simpleData, 
    meetingTimeData, 
    performanceData, 
    responseTimeData, 
    salesData 
} = dataModule;

// Check if dependencies are available
if (!window.Plot || !window.d3) {
    console.error('❌ Observable Plot or D3 not available globally');
    document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Missing Dependencies</h2>
        <p>Observable Plot and D3 must be loaded before this script.</p>
    </div>`;
    throw new Error('Missing dependencies: Plot or d3');
}

console.log('✅ Dependencies available:', { Plot: !!window.Plot, d3: !!window.d3 });

// Chart instances to track for updates
const charts = {};

// Cache for jitter coordinates to prevent regeneration on non-jitter updates
const jitterCache = {};

/**
 * Format numbers for display
 */
function formatNumber(num, decimals = 1) {
    return num.toFixed(decimals);
}

/**
 * Generate statistics summary for a dataset
 */
function generateStatsSummary(data, valueField, categoryField) {
    const categories = [...new Set(data.map(d => d[categoryField]))];
    const summaries = categories.map(category => {
        const categoryData = data.filter(d => d[categoryField] === category);
        const values = categoryData.map(d => d[valueField]);
        const stats = calculateStats(values);
        return {
            category,
            count: stats.count,
            mean: stats.mean,
            median: stats.median,
            min: stats.min,
            max: stats.max
        };
    });
    
    let html = '<strong>Statistics Summary:</strong><br>';
    summaries.forEach(s => {
        html += `<strong>${s.category}</strong> (n=${s.count}): `;
        html += `Mean=${formatNumber(s.mean)}, `;
        html += `Median=${formatNumber(s.median)}, `;
        html += `Range=${formatNumber(s.min)}-${formatNumber(s.max)}<br>`;
    });
    
    return html;
}

/**
 * Setup interactive controls for a chart
 */
function setupControls(prefix, data, valueField, categoryField, chartType = 'horizontal') {
    const opacitySlider = document.getElementById(`${prefix}-opacity`);
    const opacityValue = document.getElementById(`${prefix}-opacity-value`);
    const jitterSlider = document.getElementById(`${prefix}-jitter`);
    const jitterValue = document.getElementById(`${prefix}-jitter-value`);
    const meanCheckbox = document.getElementById(`${prefix}-mean`);
    const medianCheckbox = document.getElementById(`${prefix}-median`);
    const chartContainer = document.getElementById(`${prefix}-chart`);
    const statsContainer = document.getElementById(`${prefix}-stats`);
    
    // Initialize jitter cache for this chart
    jitterCache[prefix] = {
        jitterValue: parseFloat(jitterSlider.value),
        processedData: null
    };
    
    // Function to generate or retrieve cached jittered data
    function getProcessedData(currentJitter) {
        const cache = jitterCache[prefix];
        
        // If jitter value hasn't changed and we have cached data, use it
        if (cache.processedData && cache.jitterValue === currentJitter) {
            return cache.processedData;
        }
        
        // Generate new jittered data
        const processedData = [];
        const categories = [...new Set(data.map(d => d[categoryField]))];
        
        categories.forEach((category, categoryIndex) => {
            const categoryData = data.filter(d => d[categoryField] === category);
            // Use a deterministic seed based on category to ensure consistent jitter
            const seed = 12345 + categoryIndex * 1000;
            
            // Generate jitter coordinates using the same logic as in footswarm.js
            const jitterCoords = [];
            const seededRandom = window.d3.randomLcg(seed);
            for (let i = 0; i < categoryData.length; i++) {
                jitterCoords.push((seededRandom() - 0.5) * currentJitter);
            }
            
            categoryData.forEach((d, i) => {
                if (chartType === 'vertical') {
                    processedData.push({
                        ...d,
                        jitteredX: jitterCoords[i],
                        originalCategory: d[categoryField]
                    });
                } else {
                    processedData.push({
                        ...d,
                        jitteredY: jitterCoords[i],
                        originalCategory: d[categoryField]
                    });
                }
            });
        });
        
        // Cache the results
        cache.jitterValue = currentJitter;
        cache.processedData = processedData;
        
        return processedData;
    }
    
    // Update chart function
    function updateChart() {
        try {
            const currentJitter = parseFloat(jitterSlider.value);
            const processedData = getProcessedData(currentJitter);
            
            const options = {
                x: valueField,
                y: categoryField,
                opacity: parseFloat(opacitySlider.value),
                jitter: currentJitter,
                showMean: meanCheckbox.checked,
                showMedian: medianCheckbox.checked,
                showTooltips: true,
                width: 800,
                height: Math.max(300, [...new Set(data.map(d => d[categoryField]))].length * 80),
                // Pass the pre-processed data to avoid regenerating jitter
                _processedData: processedData
            };
            
            // Set appropriate labels based on dataset
            if (prefix === 'simple') {
                options.xLabel = 'Value';
                options.yLabel = 'Groups';
            } else if (prefix === 'meeting') {
                options.xLabel = 'Daily Meeting Hours';
                options.yLabel = 'Developer Level';
            } else if (prefix === 'performance') {
                options.xLabel = 'Performance Score';
                options.yLabel = 'Team';
            } else if (prefix === 'response') {
                options.xLabel = 'Response Time (ms)';
                options.yLabel = 'Day of Week';
            } else if (prefix === 'vertical') {
                options.xLabel = 'Region';
                options.yLabel = 'Sales ($)';
                options.x = categoryField;
                options.y = valueField;
            }
            
            // Clear previous chart
            chartContainer.innerHTML = '';
            
            // Create new chart
            let chart;
            if (chartType === 'vertical') {
                chart = createVerticalFootswarmChart(data, options);
            } else {
                chart = createFootswarmChart(data, options);
            }
            
            chartContainer.appendChild(chart);
            charts[prefix] = chart;
            
            // Update stats
            statsContainer.innerHTML = generateStatsSummary(data, valueField, categoryField);
            
        } catch (error) {
            console.error(`❌ Error creating chart ${prefix}:`, error);
            chartContainer.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
                <strong>Error creating chart:</strong><br>
                ${error.message}<br>
                <small>Check console for details</small>
            </div>`;
        }
    }
    
    // Event listeners
    opacitySlider.addEventListener('input', (e) => {
        opacityValue.textContent = e.target.value;
        updateChart();
    });
    
    jitterSlider.addEventListener('input', (e) => {
        jitterValue.textContent = e.target.value;
        updateChart();
    });
    
    meanCheckbox.addEventListener('change', updateChart);
    medianCheckbox.addEventListener('change', updateChart);
    
    // Initial chart render
    updateChart();
}

/**
 * Initialize all examples
 */
function initializeExamples() {
    // Simple example
    setupControls('simple', simpleData, 'value', 'category');
    
    // Meeting time analysis
    setupControls('meeting', meetingTimeData, 'value', 'category');
    
    // Performance metrics
    setupControls('performance', performanceData, 'score', 'category');
    
    // Response time analysis
    setupControls('response', responseTimeData, 'responseTime', 'category');
    
    // Vertical chart example (sales data)
    setupControls('vertical', salesData, 'sales', 'category', 'vertical');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExamples);
} else {
    initializeExamples();
}

// Smooth scrolling for navigation
document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export for potential external use
export { charts, setupControls, generateStatsSummary };
