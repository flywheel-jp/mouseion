
# @flywheel-jp/mouseion

> GCS proxy running on GAE for internal document sharing.

## Development

### Setup

Run `bin/setup` to setup local development environment:

```bash
bin/setup
```

### Start Development Server

At first, you need to install gcloud SDK and log in with a GCP account that has permissions on the `flywheel-mouseion` project.

Then run `yarn dev` to start local server:

```bash
yarn dev
```

Now open http://localhost:8080 in your browser.

### Documentation

This repository uses [docsify](https://docsify.js.org/) as a document generator under the hood.

```bash
yarn docsify serve docs
```

Now open http://localhost:3000 in your browser.
