#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  sourceDir: './public/chicas',
  outputDir: './public/chicas-optimized',
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  formats: ['webp', 'jpg'],
  maxSizeKB: 500 // Target max size in KB
};

// Create output directory
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Get image info using sips (macOS built-in tool)
function getImageInfo(imagePath) {
  try {
    const output = execSync(`sips -g all "${imagePath}"`, { encoding: 'utf8' });
    const lines = output.split('\n');
    const info = {};
    
    lines.forEach(line => {
      if (line.includes('pixelWidth:')) {
        info.width = parseInt(line.split(':')[1].trim());
      }
      if (line.includes('pixelHeight:')) {
        info.height = parseInt(line.split(':')[1].trim());
      }
      if (line.includes('fileSize:')) {
        info.size = parseInt(line.split(':')[1].trim());
      }
    });
    
    return info;
  } catch (error) {
    console.error(`Error getting info for ${imagePath}:`, error.message);
    return null;
  }
}

// Resize image if needed
function resizeIfNeeded(imagePath, outputPath, maxWidth, maxHeight) {
  const info = getImageInfo(imagePath);
  if (!info) return false;
  
  const needsResize = info.width > maxWidth || info.height > maxHeight;
  
  if (needsResize) {
    try {
      execSync(`sips -Z ${maxHeight} "${imagePath}" --out "${outputPath}"`);
      console.log(`✅ Resized: ${imagePath} (${info.width}x${info.height} -> ${maxWidth}x${maxHeight})`);
      return true;
    } catch (error) {
      console.error(`❌ Error resizing ${imagePath}:`, error.message);
      return false;
    }
  }
  
  return false;
}

// Convert to WebP
function convertToWebP(imagePath, outputPath, quality = 80) {
  try {
    execSync(`sips -s format webp -s formatOptions "${quality}" "${imagePath}" --out "${outputPath}"`);
    console.log(`✅ WebP: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting to WebP ${imagePath}:`, error.message);
    return false;
  }
}

// Optimize JPEG
function optimizeJPEG(imagePath, quality = 80) {
  try {
    execSync(`sips -s format jpeg -s formatOptions "${quality}" "${imagePath}" --out "${imagePath}"`);
    console.log(`✅ Optimized JPEG: ${imagePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error optimizing JPEG ${imagePath}:`, error.message);
    return false;
  }
}

// Get file size in KB
function getFileSize(filePath) {
  try {
    const stats = execSync(`ls -l "${filePath}"`, { encoding: 'utf8' });
    return parseInt(stats.split(' ')[4]) / 1024;
  } catch (error) {
    return 0;
  }
}

// Process single image
async function processImage(imagePath, relativePath) {
  const imageInfo = getImageInfo(imagePath);
  if (!imageInfo) return;
  
  const sizeKB = imageInfo.size / 1024;
  console.log(`\n📸 Processing: ${relativePath}`);
  console.log(`   Size: ${sizeKB.toFixed(1)}KB | ${imageInfo.width}x${imageInfo.height}`);
  
  // Skip if already optimized
  if (sizeKB <= config.maxSizeKB && imageInfo.width <= config.maxWidth && imageInfo.height <= config.maxHeight) {
    console.log(`⏭️  Already optimized, skipping`);
    return;
  }
  
  const outputDir = join(config.outputDir, dirname(relativePath));
  await ensureDir(outputDir);
  
  // Create temp file for processing
  const tempPath = join(outputDir, `temp_${Date.now()}.jpg`);
  const finalJpgPath = join(outputDir, basename(imagePath));
  const webpPath = join(outputDir, basename(imagePath, '.jpg') + '.webp');
  
  try {
    // Step 1: Copy to temp location
    execSync(`cp "${imagePath}" "${tempPath}"`);
    
    // Step 2: Resize if needed
    const wasResized = resizeIfNeeded(tempPath, tempPath, config.maxWidth, config.maxHeight);
    
    // Step 3: Optimize JPEG
    let currentQuality = config.quality;
    let optimizedSize = 0;
    
    do {
      optimizeJPEG(tempPath, currentQuality);
      optimizedSize = getFileSize(tempPath);
      
      if (optimizedSize > config.maxSizeKB) {
        currentQuality -= 5;
        console.log(`🔄 Reducing quality to ${currentQuality}% (size: ${optimizedSize.toFixed(1)}KB)`);
      }
    } while (optimizedSize > config.maxSizeKB && currentQuality > 50);
    
    // Step 4: Copy optimized JPEG
    execSync(`cp "${tempPath}" "${finalJpgPath}"`);
    
    // Step 5: Convert to WebP
    convertToWebP(tempPath, webpPath, currentQuality);
    
    // Step 6: Cleanup
    execSync(`rm "${tempPath}"`);
    
    const finalSize = getFileSize(finalJpgPath);
    const webpSize = getFileSize(webpPath);
    const originalSize = imageInfo.size / 1024;
    const savings = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
    
    console.log(`🎉 Optimization complete:`);
    console.log(`   Original: ${originalSize.toFixed(1)}KB`);
    console.log(`   JPEG: ${finalSize.toFixed(1)}KB (${savings}% saved)`);
    console.log(`   WebP: ${webpSize.toFixed(1)}KB (${((originalSize - webpSize) / originalSize * 100).toFixed(1)}% saved)`);
    
  } catch (error) {
    console.error(`❌ Error processing ${imagePath}:`, error.message);
    // Cleanup temp file if exists
    try {
      execSync(`rm "${tempPath}"`);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Find all images recursively
async function findAllImages(dir) {
  const images = [];
  
  async function scanDirectory(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.jpg')) {
        images.push(fullPath);
      }
    }
  }
  
  await scanDirectory(dir);
  return images;
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  try {
    await ensureDir(config.outputDir);
    
    const images = await findAllImages(config.sourceDir);
    console.log(`📁 Found ${images.length} images to process\n`);
    
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let processedCount = 0;
    
    for (const imagePath of images) {
      const relativePath = imagePath.replace(config.sourceDir + '/', '');
      const imageInfo = getImageInfo(imagePath);
      
      if (imageInfo) {
        totalOriginalSize += imageInfo.size;
      }
      
      await processImage(imagePath, relativePath);
      processedCount++;
      
      // Show progress
      const progress = (processedCount / images.length * 100).toFixed(1);
      console.log(`\n📊 Progress: ${progress}% (${processedCount}/${images.length})\n`);
    }
    
    // Calculate final stats
    const optimizedImages = await findAllImages(config.outputDir);
    for (const imagePath of optimizedImages) {
      if (imagePath.endsWith('.jpg')) {
        const stats = execSync(`ls -l "${imagePath}"`, { encoding: 'utf8' });
        totalOptimizedSize += parseInt(stats.split(' ')[4]);
      }
    }
    
    console.log('\n🎉 Optimization complete!');
    console.log(`📊 Summary:`);
    console.log(`   Images processed: ${processedCount}`);
    console.log(`   Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Space saved: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log(`\n📁 Optimized images saved to: ${config.outputDir}`);
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Run the optimization
main().catch(console.error);
