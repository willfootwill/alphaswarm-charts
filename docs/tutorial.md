# Alphaswarm Charts Tutorial

This tutorial will walk you through creating your first alphaswarm chart and understanding the key concepts.

## What is an Alphaswarm Chart?

An alphaswarm chart is a data visualization that shows:
- **Individual data points** as dots
- **Distribution shape** through the spread of points
- **Statistical summaries** with mean and median lines
- **Group comparisons** across categories

Think of it as a combination of a scatter plot (individual points) and a box plot (statistical summary).

## Tutorial 1: Your First Chart

Let's start with a simple example comparing test scores across three classes.

### Step 1: Prepare Your Data

```javascript
const testScores = [
  { class: 'Class A', score: 85 },
  { class: 'Class A', score: 92 },
  { class: 'Class A', score: 78 },
  { class: 'Class A', score: 88 },
  { class: 'Class A', score: 95 },
  
  { class: 'Class B', score: 76 },
  { class: 'Class B', score: 82 },
  { class: 'Class B', score: 79 },
  { class: 'Class B', score: 85 },
  { class: 'Class B', score: 81 },
  
  { class: 'Class C', score: 90 },
  { class: 'Class C', score: 87 },
  { class: 'Class C', score: 93 },
  { class: 'Class C', score: 89 },
  { class: 'Class C', score: 91 }
];
```

### Step 2: Create the Chart

```javascript
import { createAlphaswarmChart } from 'alphaswarm-charts';

const chart = createAlphaswarmChart(testScores, {
  x: 'score',           // The numeric values
  y: 'class',           // The categories
  xLabel: 'Test Score',
  yLabel: 'Class'
});

// Add to your page
document.getElementById('chart-container').appendChild(chart);
```

### Step 3: Understanding the Result

You'll see:
- **Dots**: Each student's individual score
- **Red dashed line**: Mean (average) score for each class
- **Teal dashed line**: Median score for each class
- **Vertical spread**: Shows the distribution of scores

## Tutorial 2: Customizing Your Chart

Let's make the chart more visually appealing and informative.

### Adding Colors and Styling

```javascript
const chart = createAlphaswarmChart(testScores, {
  x: 'score',
  y: 'class',
  xLabel: 'Test Score',
  yLabel: 'Class',
  
  // Styling options
  pointColor: '#e74c3c',    // Red points
  opacity: 0.7,             // Slightly transparent
  pointRadius: 5,           // Larger points
  
  // Chart dimensions
  width: 900,
  height: 400,
  
  // Statistical lines
  showMean: true,
  showMedian: true,
  
  // Interactive features
  showTooltips: true
});
```

### Adjusting for Data Density

If you have many overlapping points, adjust the jitter:

```javascript
const chart = createAlphaswarmChart(testScores, {
  x: 'score',
  y: 'class',
  jitter: 0.8,              // More spread (0-1)
  opacity: 0.4,             // Lower opacity for overlap
  jitterMethod: 'uniform'   // Even distribution
});
```

## Tutorial 3: Real-World Example - Meeting Analysis

Let's recreate a version of your original meeting time analysis:

### The Data

```javascript
const meetingData = [
  // Junior developers (L1-L2) - fewer meetings
  { level: 'L1', hours: 1.2, name: 'Alice' },
  { level: 'L1', hours: 0.8, name: 'Bob' },
  { level: 'L1', hours: 1.5, name: 'Carol' },
  { level: 'L2', hours: 2.1, name: 'David' },
  { level: 'L2', hours: 1.8, name: 'Eve' },
  { level: 'L2', hours: 2.4, name: 'Frank' },
  
  // Senior developers (L3-L4) - moderate meetings
  { level: 'L3', hours: 2.8, name: 'Grace' },
  { level: 'L3', hours: 3.2, name: 'Henry' },
  { level: 'L3', hours: 2.5, name: 'Iris' },
  { level: 'L4', hours: 3.5, name: 'Jack' },
  { level: 'L4', hours: 4.1, name: 'Kate' },
  { level: 'L4', hours: 3.8, name: 'Liam' },
  
  // Tech leads (L5+) - many meetings
  { level: 'L5', hours: 4.5, name: 'Maya' },
  { level: 'L5', hours: 5.2, name: 'Noah' },
  { level: 'L5', hours: 4.8, name: 'Olivia' },
  { level: 'L6', hours: 5.5, name: 'Paul' },
  { level: 'L6', hours: 6.1, name: 'Quinn' }
];
```

### Creating the Chart

```javascript
const meetingChart = createAlphaswarmChart(meetingData, {
  x: 'hours',
  y: 'level',
  xLabel: 'Daily Meeting Hours',
  yLabel: 'Developer Level',
  
  // Custom styling
  pointColor: '#3498db',
  opacity: 0.6,
  jitter: 0.5,
  
  // Show both statistics
  showMean: true,
  showMedian: true,
  
  // Enable tooltips to see names
  showTooltips: true,
  
  // Set a reasonable domain
  xDomain: [0, 7],
  
  title: 'Meeting Time Distribution by Developer Level'
});
```

### What This Reveals

The alphaswarm chart will show:
1. **Individual patterns**: Each developer's meeting load
2. **Level trends**: Higher levels generally have more meetings
3. **Variability**: Some levels have more consistent meeting loads
4. **Outliers**: Developers with unusually high/low meeting times

## Tutorial 4: Interactive Controls

Add controls to let users explore the data:

### HTML Structure

```html
<div id="controls">
  <label>
    Opacity: <span id="opacity-value">0.6</span>
    <input type="range" id="opacity-slider" min="0.1" max="1" step="0.1" value="0.6">
  </label>
  
  <label>
    Jitter: <span id="jitter-value">0.5</span>
    <input type="range" id="jitter-slider" min="0" max="1" step="0.1" value="0.5">
  </label>
  
  <label>
    <input type="checkbox" id="show-mean" checked> Show Mean
  </label>
  
  <label>
    <input type="checkbox" id="show-median" checked> Show Median
  </label>
</div>

<div id="chart-container"></div>
```

### JavaScript Interactivity

```javascript
let currentChart;

function updateChart() {
  const opacity = parseFloat(document.getElementById('opacity-slider').value);
  const jitter = parseFloat(document.getElementById('jitter-slider').value);
  const showMean = document.getElementById('show-mean').checked;
  const showMedian = document.getElementById('show-median').checked;
  
  // Update display values
  document.getElementById('opacity-value').textContent = opacity;
  document.getElementById('jitter-value').textContent = jitter;
  
  // Clear previous chart
  document.getElementById('chart-container').innerHTML = '';
  
  // Create new chart
  currentChart = createAlphaswarmChart(meetingData, {
    x: 'hours',
    y: 'level',
    xLabel: 'Daily Meeting Hours',
    yLabel: 'Developer Level',
    opacity: opacity,
    jitter: jitter,
    showMean: showMean,
    showMedian: showMedian,
    showTooltips: true
  });
  
  document.getElementById('chart-container').appendChild(currentChart);
}

// Add event listeners
document.getElementById('opacity-slider').addEventListener('input', updateChart);
document.getElementById('jitter-slider').addEventListener('input', updateChart);
document.getElementById('show-mean').addEventListener('change', updateChart);
document.getElementById('show-median').addEventListener('change', updateChart);

// Initial render
updateChart();
```

## Tutorial 5: Vertical Charts

Sometimes a vertical layout works better:

```javascript
import { createVerticalAlphaswarmChart } from 'alphaswarm-charts';

const salesData = [
  { region: 'North', sales: 150000 },
  { region: 'South', sales: 120000 },
  { region: 'East', sales: 180000 },
  { region: 'West', sales: 140000 }
  // ... more data
];

const verticalChart = createVerticalAlphaswarmChart(salesData, {
  x: 'region',      // Categories on x-axis
  y: 'sales',       // Values on y-axis
  xLabel: 'Region',
  yLabel: 'Sales ($)',
  width: 600,
  height: 500
});
```

## Best Practices

### 1. Choose Appropriate Jitter and Opacity

```javascript
// For dense data (many points)
{ opacity: 0.3, jitter: 0.8 }

// For sparse data (few points)
{ opacity: 0.8, jitter: 0.2 }

// For medium density
{ opacity: 0.6, jitter: 0.5 }  // Default values
```

### 2. Data Preparation

```javascript
// Ensure numeric values are actually numbers
const cleanData = rawData.map(d => ({
  category: d.category,
  value: parseFloat(d.value),  // Convert to number
  // ... other fields
}));

// Filter out invalid data
const validData = cleanData.filter(d => 
  !isNaN(d.value) && d.category
);
```

### 3. Responsive Design

```javascript
// Make charts responsive
function createResponsiveChart(data, containerId) {
  const container = document.getElementById(containerId);
  const width = Math.min(800, container.clientWidth - 40);
  
  return createAlphaswarmChart(data, {
    x: 'value',
    y: 'category',
    width: width,
    height: Math.max(300, data.length * 60)
  });
}
```

## Common Use Cases

### 1. Performance Analysis
- Employee performance by department
- Response times by server
- Test scores by class

### 2. Time-based Patterns
- Daily activity by day of week
- Seasonal sales patterns
- Usage patterns by hour

### 3. Comparative Studies
- Treatment effects in experiments
- A/B test results
- Survey responses by demographic

## Next Steps

1. **Explore the examples**: Check out `/examples/index.html` for more complex scenarios
2. **Read the API docs**: See the full list of options in the README
3. **Experiment**: Try different datasets and styling options
4. **Contribute**: Share your use cases and improvements

## Troubleshooting

### Chart Not Appearing
- Check browser console for errors
- Ensure data format is correct
- Verify container element exists

### Points Overlapping Too Much
- Increase `jitter` value
- Decrease `opacity`
- Try `jitterMethod: 'uniform'`

### Performance Issues
- Reduce `pointRadius` for large datasets
- Consider data sampling for >1000 points
- Lower `opacity` to reduce rendering load

Happy charting! 📊
