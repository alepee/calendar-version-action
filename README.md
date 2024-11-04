# Calendar Version Action

This GitHub Action generates version numbers using Calendar Versioning (CalVer) format as specified in [calver.org](https://calver.org).

## 📆 Version Format

The version format is controlled by two parameters:

- `dateFormat`: A string using CalVer format specifiers as defined in [calver.org](https://calver.org/#scheme):
  - `YYYY` - Full year - 2006, 2016, 2106
  - `YY` - Short year - 6, 16, 106
  - `0Y` - Zero-padded year - 06, 16, 106
  - `MM` - Short month - 1, 2 ... 11, 12
  - `0M` - Zero-padded month - 01, 02 ... 11, 12
  - `WW` - Short week - 1, 2, 33, 52
  - `0W` - Zero-padded week - 01, 02, 33, 52
  - `DD` - Short day - 1, 2 ... 30, 31
  - `0D` - Zero-padded day - 01, 02 ... 30, 31
- `format`: A template string using two placeholders:
  - `%NOW%`: replaced with the formatted date
  - `%MICRO%`: replaced with an auto-incrementing number (MICRO as per CalVer terminology)

By default:

- `dateFormat`: `YYYY.0M.0D`
- `format`: `%NOW%-%MICRO%`

## 🚀 Basic Usage

### Simple Configuration

```yaml
name: Create Release
on:
  push:
    branches: [ main ]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Important for tag history
          
      - name: Generate version
        uses: alepee/calendar-version-action@v1
```

### Complete Configuration

```yaml
name: Create Release
on:
  push:
    branches: [ main ]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate version
        uses: alepee/calendar-version-action@v1
        id: version
        with:
          format: '%NOW%.%MICRO%'
          dateFormat: 'YYYY.0M'

      - name: Use generated version
        run: echo "New version: ${{ steps.version.outputs.version }}"
```

## ⚙️ Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `format` | Version pattern using `%NOW%` and `%MICRO%` placeholders | No | `%NOW%-%MICRO%` |
| `dateFormat` | CalVer date format. See [calver.org](https://calver.org/#scheme) | No | `YYYY.0M.0D` |

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `version` | Generated version number |

## 🛠️ Usage Examples

### Default Format

```yaml
- uses: alepee/calendar-version-action@v1
```

Output: `2024.01.28-0`

### Public API Format (YYYY.MINOR.MICRO)

```yaml
- uses: alepee/calendar-version-action@v1
  with:
    dateFormat: 'YYYY'
    format: '%NOW%.1.%MICRO%'
```

Output: `2024.1.0`

### Ubuntu Format (YY.0M)

```yaml
- uses: alepee/calendar-version-action@v1
  with:
    dateFormat: 'YY.0M'
    format: '%NOW%'
```

Output: `24.01`

### ElementaryOS Format (YYYY.MM.MICRO)

```yaml
- uses: alepee/calendar-version-action@v1
  with:
    dateFormat: 'YYYY.MM'
    format: '%NOW%.%MICRO%'
```

Output: `2024.1.0`

### Week-based Format

```yaml
- uses: alepee/calendar-version-action@v1
  with:
    dateFormat: 'YYYY.0W'
    format: '%NOW%.%MICRO%'
```

Output: `2024.05.0`

### Pre-release

```yaml
- uses: alepee/calendar-version-action@v1
  with:
    format: '%NOW%-b%MICRO%'
```

Output: `2024.01.28-b0`

## 📝 Notes

- The action requires access to the complete Git tag history to work correctly. Make sure to use `fetch-depth: 0` with `actions/checkout`.
- The `%MICRO%` increments each time the formatted date pattern changes.
- The placeholders `%NOW%` and `%MICRO%` can be used anywhere in the format string and in any order.

## ⚖️ License

MIT

## 🤝 Contributing

### Prerequisites

- Node.js 20.x
- npm or yarn

### Setup

#### Clone the repository

```bash
git clone https://github.com/alepee/calendar-version-action.git
```

#### Install dependencies

```bash
npm install
```

#### Build the action

```bash
npm run build
```

### Testing

Run the test suite:

```bash
npm test
```

### Release Process

1. Update version in `package.json`
2. Build the action
3. Commit changes
4. Create a new tag
5. Push changes and tag

```bash
git add .
git commit -m "Release X.Y.Z"
git tag -a X.Y.Z -m "Release X.Y.Z"
git push origin main --tags
```
