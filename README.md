# Copy Files Action

This GitHub Action copy files to target destination with folder structure creation and can be used across your organization.

## Usage

```yaml
- name: Copy files
  uses: JanCodeLab/action-copy-files@latest
  with:
    source-folder: 'src'  # Source folder to copy from
    contents: '**/*.js'  # Patterns to match files
    target-folder: 'dist'  # Target folder to copy to
    clean-target-folder: true  # Clean target folder before copying
    overwrite: true  # Overwrite files in target folder
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `source-folder` | Source folder | No | `*` |
| `contents` | Patterns to match files | Yes | `**` |
| `target-folder` | Target folder | Yes | `.` |
| `clean-target-folder` | Clean target folder before copying | No | `false` |
| `overwrite` | Overwrite files in target folder | No | `false` |

## Example: Copying JavaScript files to dist folder

```yaml
jobs:
  copy-js-files:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Copy JavaScript files
        uses: JanCodeLab/action-copy-files@latest
        with:
          source-folder: 'src'
          contents: '**/*.js'
          target-folder: 'dist'
          clean-target-folder: true
          overwrite: true
```

## Changelog
- v1 (latest)
  - Initial implementaion of action fuctionality