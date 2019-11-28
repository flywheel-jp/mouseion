
# @flywheel-jp/mouseion

![](https://github.com/flywheel-jp/mouseion/workflows/Deploy%20and%20upload/badge.svg) ![](https://github.com/flywheel-jp/mouseion/workflows/Test/badge.svg)

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

## Deployment

Every push to `master` branch will deploy a new version of this app. Deploys happen automatically.

## Create Service Account

```bash
./bin/resiter-service-account -o ORGNAME -p PROJECT REPONAME
```

this command will:

1. Create a service account to `PROJECT` GCP project.
2. Add `roles/storage.Admin` role to the service account.
3. Create a secret key (`tmp/REPONAME.json`) to the service account and download it.
4. (macOS only) Copy Base64 encoded secret key to the clipboard.
5. (macOS only) Open the secrets settings page of the specified GitHub repository.

If you are using macOS, paste the clipboard to the textarea and create a repository secret value. Otherwise, encode the created key file `base64 tmp/REPONAME.json` as Base64 and register the value as a secret by yourself.

Note that this command expects gcloud SDK is installed, and you have enough permission to complete those actions.
