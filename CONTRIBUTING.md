# Contributing to Footswarm Charts

We welcome contributions to the Footswarm Charts library! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/footswarm-charts.git
   cd footswarm-charts
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:8000/examples/` to see the examples

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Check if the issue already exists in the [issue tracker](https://github.com/yourusername/footswarm-charts/issues)
2. Provide a clear description of the problem
3. Include steps to reproduce the issue
4. Add relevant code examples or screenshots
5. Specify your browser and version

### Suggesting Features

We welcome feature suggestions! Please:

1. Check existing issues and discussions first
2. Clearly describe the feature and its use case
3. Explain why it would be valuable to other users
4. Consider providing a mockup or example

### Code Contributions

#### Types of Contributions

- **Bug fixes**: Fix existing functionality
- **New features**: Add new chart types or options
- **Documentation**: Improve docs, examples, or comments
- **Performance**: Optimize existing code
- **Tests**: Add or improve test coverage

#### Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed
   - Add examples if introducing new features

3. **Test your changes**:
   ```bash
   npm test
   npm run dev  # Test examples manually
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new chart option for custom colors"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what your changes do
   - Include screenshots for visual changes

## Coding Standards

### JavaScript Style

- Use ES6+ features
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Follow existing code formatting
- Use `const` and `let` instead of `var`

### Example:

```javascript
/**
 * Calculate statistics for a dataset
 * @param {number[]} values - Array of numeric values
 * @param {Object} options - Configuration options
 * @returns {Object} Statistics object with mean, median, etc.
 */
export function calculateStats(values, options = {}) {
    if (!values || values.length === 0) {
        return { mean: 0, median: 0, count: 0 };
    }
    
    // Implementation...
}
```

### File Organization

- **`src/`**: Core library code
- **`examples/`**: Interactive examples and demos
- **`data/`**: Sample datasets
- **`docs/`**: Additional documentation
- **`tests/`**: Test files (when added)

### Commit Messages

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add color customization options
fix: resolve jitter calculation for small datasets
docs: update API reference with new options
```

## Documentation Guidelines

### Code Documentation

- Add JSDoc comments for all public functions
- Include parameter types and descriptions
- Provide usage examples for complex functions
- Document return values

### README Updates

When adding features:
- Update the feature list
- Add new options to the API reference
- Include usage examples
- Update the table of contents if needed

### Examples

When adding new features:
- Create a working example in `examples/`
- Add the example to the main examples page
- Include explanatory text about when to use the feature

## Testing

### Manual Testing

1. Test all examples in `examples/index.html`
2. Verify charts render correctly in different browsers
3. Test interactive controls (opacity, jitter, checkboxes)
4. Check responsive behavior at different screen sizes

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Testing

For large datasets:
- Test with 1000+ data points
- Verify smooth interactions
- Check memory usage

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md` (when created)
3. Test all examples
4. Create release notes
5. Tag the release
6. Publish to npm (maintainers only)

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Communication

- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for questions and general discussion
- Be clear and concise in communications
- Provide context and examples when asking for help

## Getting Help

If you need help:

1. Check the [README](README.md) and examples
2. Search existing [issues](https://github.com/yourusername/footswarm-charts/issues)
3. Create a new issue with a clear description
4. Join our community discussions

## Recognition

Contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to be maintainers for sustained contributions

Thank you for contributing to Footswarm Charts! 🎉
