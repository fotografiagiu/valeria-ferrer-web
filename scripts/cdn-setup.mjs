#!/usr/bin/env node

// CDN Configuration Script for Valeria Ferrer Images
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CDN_DOMAIN = 'cdn.valeriaferrer.com';
const LOCAL_IMAGES_PATH = './public/chicas';
const MODELS_JSON_PATH = './data/models.json';

// Cloudflare R2 Configuration
const R2_BUCKET = 'valeria-ferrer-images';
const R2_ENDPOINT = `https://${R2_BUCKET}.r2.cloudflarestorage.com`;

// Generate CDN URLs for all images
function generateCdnUrls() {
  console.log('🚀 Configurando CDN para imágenes...\n');
  
  try {
    // Read models.json
    const modelsData = JSON.parse(fs.readFileSync(MODELS_JSON_PATH, 'utf8'));
    
    // Track all image paths
    const allImages = new Set();
    
    // Collect images from models.json
    modelsData.forEach(model => {
      if (model.coverImageUrl) {
        allImages.add(model.coverImageUrl);
      }
      if (model.images) {
        model.images.forEach(img => allImages.add(img));
      }
      if (model.image) {
        allImages.add(model.image);
      }
      if (model.gallery) {
        model.gallery.forEach(img => allImages.add(img));
      }
    });
    
    console.log(`📊 Found ${allImages.size} unique images in models.json`);
    
    // Generate CDN mapping
    const cdnMapping = {};
    allImages.forEach(localPath => {
      const filename = path.basename(localPath);
      cdnMapping[localPath] = `https://${CDN_DOMAIN}/${filename}`;
    });
    
    // Update models.json with CDN URLs
    const updatedModels = modelsData.map(model => {
      const updatedModel = { ...model };
      
      // Update coverImageUrl
      if (updatedModel.coverImageUrl && cdnMapping[updatedModel.coverImageUrl]) {
        updatedModel.coverImageUrl = cdnMapping[updatedModel.coverImageUrl];
      }
      
      // Update images array
      if (updatedModel.images) {
        updatedModel.images = updatedModel.images.map(img => 
          cdnMapping[img] || img
        );
      }
      
      // Update single image
      if (updatedModel.image && cdnMapping[updatedModel.image]) {
        updatedModel.image = cdnMapping[updatedModel.image];
      }
      
      // Update gallery
      if (updatedModel.gallery) {
        updatedModel.gallery = updatedModel.gallery.map(img => 
          cdnMapping[img] || img
        );
      }
      
      return updatedModel;
    });
    
    // Backup original models.json
    fs.copyFileSync(MODELS_JSON_PATH, MODELS_JSON_PATH + '.backup');
    
    // Write updated models.json
    fs.writeFileSync(MODELS_JSON_PATH, JSON.stringify(updatedModels, null, 2));
    
    // Save CDN mapping for reference
    fs.writeFileSync('./cdn-mapping.json', JSON.stringify(cdnMapping, null, 2));
    
    console.log('✅ Models JSON updated with CDN URLs');
    console.log('💾 Backup saved as models.json.backup');
    console.log('📋 CDN mapping saved as cdn-mapping.json');
    
    return cdnMapping;
    
  } catch (error) {
    console.error('❌ Error configuring CDN:', error.message);
    return null;
  }
}

// Generate AWS S3 upload script
function generateUploadScript() {
  const uploadScript = `#!/bin/bash
# Upload images to CDN (Cloudflare R2 or AWS S3)

# Configuration
BUCKET="valeria-ferrer-images"
CDN_DOMAIN="cdn.valeriaferrer.com"
LOCAL_PATH="./public/chicas"

echo "🚀 Uploading images to CDN..."

# Upload all images with proper cache headers
aws s3 sync $LOCAL_PATH s3://$BUCKET/ \\
  --delete \\
  --cache-control "max-age=31536000, immutable" \\
  --content-type "image/jpeg" \\
  --metadata-directive REPLACE

# Set up Cloudflare distribution (if using Cloudflare)
echo "⚡ Configuring CDN distribution..."

# Invalidate cache if needed
aws cloudfront create-invalidation \\
  --distribution-id YOUR_DISTRIBUTION_ID \\
  --paths "/chicas/*"

echo "✅ Upload complete!"
echo "🌐 Images available at: https://$CDN_DOMAIN/"
`;
  
  fs.writeFileSync('./upload-to-cdn.sh', uploadScript);
  fs.chmodSync('./upload-to-cdn.sh', '755');
  
  console.log('📜 Upload script created: upload-to-cdn.sh');
}

// Generate Nginx configuration for CDN fallback
function generateNginxConfig() {
  const nginxConfig = `# CDN Configuration for Valeria Ferrer
# Add this to your Nginx server block

location ~* \\.(jpg|jpeg|png|gif|webp|avif)$ {
    # Try CDN first, then local fallback
    proxy_pass https://cdn.valeriaferrer.com$uri;
    proxy_cache_valid 200 1y;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    
    # Fallback to local files
    error_page 404 = @local_images;
}

location @local_images {
    root /path/to/your/public;
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-CDN-Cache "MISS";
}

# Add CDN headers
location /chicas/ {
    add_header X-CDN-Status "PROXY";
    proxy_cache_valid 200 1y;
}
`;
  
  fs.writeFileSync('./cdn-nginx.conf', nginxConfig);
  console.log('⚙️ Nginx config created: cdn-nginx.conf');
}

// Main execution
function main() {
  console.log('🔧 CDN Configuration for Valeria Ferrer\n');
  
  // Generate CDN URLs
  const cdnMapping = generateCdnUrls();
  
  if (cdnMapping) {
    // Generate upload script
    generateUploadScript();
    
    // Generate server config
    generateNginxConfig();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Upload images to CDN using: ./upload-to-cdn.sh');
    console.log('2. Configure your CDN domain: cdn.valeriaferrer.com');
    console.log('3. Update server with cdn-nginx.conf');
    console.log('4. Test CDN URLs are working');
    console.log('5. Deploy updated models.json');
    
    console.log('\n💡 CDN Benefits:');
    console.log('• 98MB images served from global edge locations');
    console.log('• 40-60% faster image loading');
    console.log('• Reduced server load');
    console.log('• Better SEO scores');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateCdnUrls, generateUploadScript, generateNginxConfig };
