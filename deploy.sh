#!/bin/sh
npm run prod-build
gcloud config set project anony-react
gcloud app deploy --quiet