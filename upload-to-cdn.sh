#!/bin/bash
# Upload images to CDN (Cloudflare R2 or AWS S3)

# Configuration
BUCKET="valeria-ferrer-images"
CDN_DOMAIN="cdn.valeriaferrer.com"
LOCAL_PATH="./public/chicas"

echo "🚀 Uploading images to CDN..."

# Upload all images with proper cache headers
aws s3 sync $LOCAL_PATH s3://$BUCKET/ \
  --delete \
  --cache-control "max-age=31536000, immutable" \
  --content-type "image/jpeg" \
  --metadata-directive REPLACE

# Set up Cloudflare distribution (if using Cloudflare)
echo "⚡ Configuring CDN distribution..."

# Invalidate cache if needed
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/chicas/*"

echo "✅ Upload complete!"
echo "🌐 Images available at: https://$CDN_DOMAIN/"
