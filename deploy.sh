gcloud beta run deploy joshbot \
  --project ${PROJECT_ID} \
  --region us-central1 \
  --image gcr.io/${PROJECT_ID}/joshbot:${VERSION} \
  --memory 1G \
  --concurrency 10 \
  --set-env-vars "GROUPME_ACCESS_TOKEN=berglas://${BUCKET_ID}/groupme-at" \
  --allow-unauthenticated
