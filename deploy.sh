#!/bin/sh
npm run build
gcloud config set project anony-212509
gcloud app deploy --quiet