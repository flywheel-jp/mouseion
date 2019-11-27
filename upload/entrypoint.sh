#!/bin/bash

set -euo pipefail -o posix

service_account_key="$1"
source="$2"
namespace="$3"

if [ ! -d "$source" ] ; then
  echo "'$source' directory does not exist"
  exit 1
fi

if [ -z "$namespace" ] ; then
  echo "namespace parameter is required"
  exit 1
fi

echo $service_account_key | base64 -d | gcloud auth activate-service-account --key-file=-
gsutil -m rsync -d -r $source gs://flywheel-mouseion/$namespace
