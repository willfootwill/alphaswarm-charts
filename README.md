# Alphaswarm Charts

A JavaScript library for creating **alphaswarm charts** - distribution visualizations that show individual data points with statistical overlays and jittering to prevent overlap.

Alphaswarm charts combine the benefits of scatter plots (showing individual data points) with the statistical insights of box plots (showing distribution summaries), making them ideal for exploring distributions while maintaining visibility of individual observations.


![Alphaswarm Chart Example](https://willfootwill.github.io/index.html)

## Features

- 🎯 **Individual data point visibility** - See every data point, not just summaries
- 📊 **Statistical overlays** - Mean and median lines with customizable styling
- 🎛️ **Interactive controls** - Adjustable opacity and jitter for different data densities
- 📱 **Responsive design** - Charts adapt to different screen sizes
- 🎨 **Customizable styling** - Colors, sizes, and layout options
- 📈 **Multiple orientations** - Horizontal and vertical chart layouts
- 🔧 **Easy integration** - Works with Observable Plot and D3.js
- 📚 **Rich examples** - Comprehensive documentation with real-world use cases

## When to Use Alphaswarm Charts

Alphaswarm charts are particularly useful when you want to:

- **Explore distributions** while seeing individual data points
- **Compare groups** with different sample sizes
- **Identify outliers** and unusual patterns
- **Show variability** within categories
- **Reveal multimodal distributions** that box plots might hide
- **Maintain transparency** about your data's individual observations

### Advantages over other chart types:

| Chart Type | Individual Points | Distribution Shape | Statistical Summary | Outlier Detection |
|------------|------------------|-------------------|-------------------|------------------|
| **Alphaswarm** | ✅ | ✅ | ✅ | ✅ |
| Box Plot | ❌ | ⚠️ | ✅ | ✅ |
| Histogram | ❌ | ✅ | ⚠️ | ❌ |
| Scatter Plot | ✅ | ❌ | ❌ | ✅ |
| Violin Plot | ❌ | ✅ | ⚠️ | ❌ |

## Quick Start

### Installation

```bash
npm install alphaswarm-charts
```

Or include via CDN:

```html
<script type="module">
  import { createAlphaswarmChart } from 'https://unpkg.com/alphaswarm-charts/src/alphaswarm.js';
</script>
```

### Basic Usage

```javascript
import { createAlphaswarmChart } from 'alphaswarm-charts';

// Your data
const data = [
  { category: 'Group A', value: 10 },
  { category: 'Group A', value: 12 },
  { category: 'Group A', value: 8 },
  { category: 'Group B', value: 18 },
  { category: 'Group B', value: 22 },
  { category: 'Group B', value: 20 }
];

// Create chart
const chart = createAlphaswarmChart(data, {
  x: 'value',
  y: 'category',
  xLabel: 'Values',
  yLabel: 'Groups'
});

// Add to page
document.getElementById('chart-container').appendChild(chart);
```

## API Reference

### `createAlphaswarmChart(data, options)`

Creates a horizontal alphaswarm chart.

#### Parameters

- **`data`** (Array): Array of data objects
- **`options`** (Object): Configuration options

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | string | `"value"` | Field name for x-axis values |
| `y` | string | `"category"` | Field name for y-axis categories |
| `width` | number | `800` | Chart width in pixels |
| `height` | number | `400` | Chart height in pixels |
| `opacity` | number | `0.6` | Point opacity (0-1) |
| `jitter` | number | `0.5` | Jitter amount (0-1) |
| `jitterMethod` | string | `"random"` | Jittering method (`"random"` or `"uniform"`) |
| `pointRadius` | number | `4` | Point radius in pixels |
| `pointColor` | string | `"#4285f4"` | Point color |
| `showMean` | boolean | `true` | Show mean line |
| `showMedian` | boolean | `true` | Show median line |
| `showTooltips` | boolean | `false` | Enable tooltips |
| `xLabel` | string | `null` | X-axis label |
| `yLabel` | string | `null` | Y-axis label |
| `xDomain` | Array | `null` | X-axis domain `[min, max]` |
| `title` | string | `null` | Chart title |

### `createVerticalAlphaswarmChart(data, options)`

Creates a vertical alphaswarm chart with similar options but swapped axes.

### `calculateStats(values)`

Calculate statistics for an array of values.

#### Returns

```javascript
{
  mean: number,
  median: number,
  min: number,
  max: number,
  q1: number,
  q3: number,
  count: number
}
```

### `generateJitter(count, jitter, method)`

Generate jittered coordinates for data points.

## Examples

### 1. Meeting Time Analysis

```javascript
import { createAlphaswarmChart } from 'alphaswarm-charts';

const meetingData = [
  { level: 'L1', hours: 1.2 },
  { level: 'L1', hours: 1.8 },
  { level: 'L2', hours: 2.1 },
  { level: 'L2', hours: 2.5 },
  // ... more data
];

const chart = createAlphaswarmChart(meetingData, {
  x: 'hours',
  y: 'level',
  xLabel: 'Daily Meeting Hours',
  yLabel: 'Developer Level',
  opacity: 0.7,
  jitter: 0.4
});
```

### 2. Performance Comparison

```javascript
const performanceData = [
  { team: 'Frontend', score: 78 },
  { team: 'Backend', score: 82 },
  { team: 'DevOps', score: 85 },
  // ... more data
];

const chart = createAlphaswarmChart(performanceData, {
  x: 'score',
  y: 'team',
  xLabel: 'Performance Score',
  yLabel: 'Team',
  pointColor: '#e74c3c',
  showMean: true,
  showMedian: false
});
```

### 3. Vertical Layout

```javascript
import { createVerticalAlphaswarmChart } from 'alphaswarm-charts';

const chart = createVerticalAlphaswarmChart(salesData, {
  x: 'region',
  y: 'sales',
  xLabel: 'Region',
  yLabel: 'Sales ($)',
  width: 600,
  height: 500
});
```

## Interactive Controls

The library includes utilities for creating interactive controls:

```javascript
import { createControls } from 'alphaswarm-charts';

const { controls, state } = createControls({
  showOpacityControl: true,
  showJitterControl: true,
  showStatControls: true,
  initialOpacity: 0.6,
  initialJitter: 0.5
});

// Add controls to page
document.getElementById('controls').appendChild(controls.opacity);
document.getElementById('controls').appendChild(controls.jitter);
document.getElementById('controls').appendChild(controls.stats);

// Access current state
console.log(state.opacity, state.jitter, state.showMean, state.showMedian);
```

## Best Practices

### Choosing Opacity and Jitter

- **High density data** (many points): Lower opacity (0.3-0.5), higher jitter (0.6-0.8)
- **Low density data** (few points): Higher opacity (0.7-0.9), lower jitter (0.2-0.4)
- **Medium density**: Default values (opacity: 0.6, jitter: 0.5) work well

### Data Preparation

```javascript
// Ensure your data has the required structure
const data = rawData.map(item => ({
  category: item.group,        // Grouping variable
  value: parseFloat(item.val), // Numeric value
  // ... other fields for tooltips
}));
```

### Performance Considerations

- For datasets with >1000 points per category, consider:
  - Reducing point radius
  - Lowering opacity
  - Using uniform jittering
  - Implementing data sampling for very large datasets

## Real-World Use Cases

### 1. Software Engineering Metrics
- Meeting time distribution by developer level
- Code review time by team
- Bug resolution time by priority

### 2. Business Analytics
- Sales performance by region
- Customer satisfaction by product
- Response times by day of week

### 3. Scientific Research
- Experimental results by condition
- Survey responses by demographic
- Measurement distributions by instrument

### 4. Education
- Test scores by subject
- Student performance by class
- Learning outcomes by method

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Requires ES6 module support.

## Dependencies

- [Observable Plot](https://observablehq.com/plot/) - For chart rendering
- [D3.js](https://d3js.org/) - For data manipulation utilities

## Development Setup

```bash
git clone https://github.com/yourusername/alphaswarm-charts.git
cd alphaswarm-charts
npm install
npm run dev
```

Visit `http://localhost:8000/examples/` to see the examples.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Inspiration

This library was inspired by:
- [Beeswarm plots](https://observablehq.com/@d3/beeswarm) for point distribution techniques
- [Box plots](https://en.wikipedia.org/wiki/Box_plot) for statistical summaries
- Real-world data visualization needs in software engineering analytics

## Citation

If you use this library in academic work, please cite:

```bibtex
@software{alphaswarm_charts,
  title={Alphaswarm Charts: Distribution Visualizations with Individual Data Point Visibility},
  author={Will Foot},
  year={2025},
  url={https://github.com/willfootwill/alphaswarm-charts}
}
