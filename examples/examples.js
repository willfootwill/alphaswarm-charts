/**
 * Interactive examples for footswarm charts
 */

import { createFootswarmChart, createVerticalFootswarmChart, calculateStats } from '../src/footswarm.js';
import { 
    simpleData, 
    meetingTimeData, 
    performanceData, 
    responseTimeData, 
    salesData 
} from '../data/sample-datasets.js';

// Chart instances to track for updates
const charts = {};

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
    
    // Update chart function
    function updateChart() {
        const options = {
            x: valueField,
            y: categoryField,
            opacity: parseFloat(opacitySlider.value),
            jitter: parseFloat(jitterSlider.value),
            showMean: meanCheckbox.checked,
            showMedian: medianCheckbox.checked,
            showTooltips: true,
            width: 800,
            height: Math.max(300, [...new Set(data.map(d => d[categoryField]))].length * 80)
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
