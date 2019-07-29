gcloud beta run deploy joshbot \
  --project joshbot \
  --region us-central1 \
  --image gcr.io/joshbot/joshbot:${VERSION} \
  --memory 1G \
  --concurrency 10 \
  --set-env-vars "GROUPME_ACCESS_TOKEN=berglas://joshbot-config/groupme-at" \
  --allow-unauthenticated
