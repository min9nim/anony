#!/bin/sh
npm run prod-build
gcloud config set project anony-react

cp ../dbConfig.js .
gcloud app deploy --quiet
rm dbConfig.js