class: center, middle
name: title

# Brief Introduction to Mouseion

---

# Agenda

1. What it is
2. Motivation
3. Philosophy
4. Architecture
5. Publishing Documents

---

# What it is

[Mouseion](http://go/mouseion) is an internal document sharing system for FLYWHEEL. It may also mean the collection of shared documents themself in some context.

By using the Mouseion, we can easily and securely share any kind of files with `@flywheel.jp` users.

If you put a file as gs://flywheel-mouseion/foo/bar/baz, we can access it as https://flywheel-mouseion.appspot.com/foo/bar/baz.

.footnote[The **Mouseion at Alexandria** was the home of music or poetry, a philosophical school and library such as Plato's Academy, also a storehouse of texts. This original word was the source for the modern usage of the word museum.]

---

# Movitation

Maintain our documents:

* FLYWHEEL uses Google Document to write a lot of documents, but unfortunately many are left unmaintained.
* Documents that are strongly related to the source code should be stored in the corresponding git repository and updated as the source code changes.

---

# Philosophy

* Use the Web standard technology.
    * Avoid being locked into specific services, tools, or environments.
* Publish from CI.
    * Don't upload documents from your terminal.

---

# Architecture

<div class="mermaid">
graph LR
    Browser --> IAP
    subgraph GCP: flywheel-mouseion
        IAP[Cloud IAP] --> GAE
        GAE --> GCS
    end
</div>

Mouseion consists of three components running in the `flywheel-mouseion` GCP project:

1. [Cloud Identity-Aware Proxy (Cloud IAP)](https://console.cloud.google.com/security/iap?project=flywheel-mouseion) controls access to our GAE application. Only users belonging to `flywheel.jp` domain are allowed to access the application.
2. [Google App Engine (GAE)](https://console.cloud.google.com/appengine?project=flywheel-mouseion) proxies GCS. [flywheel-jp/mouseion](https://github.com/flywheel-jp/mouseion) repository mainly contains its source code.
3. [Google Cloud Storage (GCS)](https://console.cloud.google.com/storage/browser/flywheel-mouseion/?project=flywheel-mouseion) stores documents.

---
# Publishing Documents

We strongly recommend uploading documents from CI.

1. Ask a GCP project admin to register a service account.
    * The admin may use `bin/register-service-account` command to register a service account key as `GCLOUD_AUTH` secret of your repository.
2. Add a workflow to your repository.

    ```yaml
    name: Upload to Mouseion
    on:
      push:
        branches: [master]
    jobs:
      publish:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v1
          - uses: flywheel-jp/mouseion/upload@master
            with:
              service-account-key: ${{ secrets.GCLOUD_AUTH }}
    ```

3. Commit documents.

---
## Manual

Just upload documents to the GCS bucket.

```bash
gsutil -m rsync -d -r path/to/dir gs://flywheel-mouseion/NAMESPACE
```
