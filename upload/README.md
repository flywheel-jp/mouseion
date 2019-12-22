# GitHub Action for FLYWHEEL Mouseion

This action uploads documents to Mouseion.

## Inputs

### `service-account-key`

**Required**: Base64 encoded service account key exported as JSON.

Example on encoding from a terminal: `base64 ~/<account_id>.json`.

### `namespace`

**Required**: Document namespace in Mouseion.

### `source`

Path to documents directory. Default `"docs"`.

### `bucket`

GCS bucket name. Default `"flywheel-mouseion"`.

## Example usage

```yaml
name: Upload documents
on:
  push:
    branches:
      - master
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: flywheel-jp/mouseion/upload@master
        with:
          service-account-key: ${{ secrets.GCLOUD_AUTH }}
          bucket: your-mouseion
          source: path/to/dir
```
