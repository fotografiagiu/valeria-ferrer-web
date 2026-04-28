const fs = require('fs');
const path = require('path');

const MODELS_JSON_PATH = './data/models.json';
const CDN_DOMAIN = 'cdn.valeriaferrer.com';

console.log('🚀 Configurando CDN para imágenes...\n');

try {
  const modelsData = JSON.parse(fs.readFileSync(MODELS_JSON_PATH, 'utf8'));
  const allImages = new Set();
  
  modelsData.forEach(model => {
    if (model.coverImageUrl) allImages.add(model.coverImageUrl);
    if (model.images) model.images.forEach(img => allImages.add(img));
    if (model.image) allImages.add(model.image);
    if (model.gallery) model.gallery.forEach(img => allImages.add(img));
  });
  
  console.log(`📊 Found ${allImages.size} unique images in models.json`);
  
  const cdnMapping = {};
  allImages.forEach(localPath => {
    const filename = path.basename(localPath);
    cdnMapping[localPath] = `https://${CDN_DOMAIN}/${filename}`;
  });
  
  const updatedModels = modelsData.map(model => {
    const updatedModel = { ...model };
    if (updatedModel.coverImageUrl && cdnMapping[updatedModel.coverImageUrl]) {
      updatedModel.coverImageUrl = cdnMapping[updatedModel.coverImageUrl];
    }
    if (updatedModel.images) {
      updatedModel.images = updatedModel.images.map(img => cdnMapping[img] || img);
    }
    if (updatedModel.image && cdnMapping[updatedModel.image]) {
      updatedModel.image = cdnMapping[updatedModel.image];
    }
    if (updatedModel.gallery) {
      updatedModel.gallery = updatedModel.gallery.map(img => cdnMapping[img] || img);
    }
    return updatedModel;
  });
  
  fs.copyFileSync(MODELS_JSON_PATH, MODELS_JSON_PATH + '.backup');
  fs.writeFileSync(MODELS_JSON_PATH, JSON.stringify(updatedModels, null, 2));
  fs.writeFileSync('./cdn-mapping.json', JSON.stringify(cdnMapping, null, 2));
  
  console.log('✅ Models JSON updated with CDN URLs');
  console.log('💾 Backup saved as models.json.backup');
  console.log('📋 CDN mapping saved as cdn-mapping.json');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
