#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';

// Replace original images with optimized versions
async function replaceWithOptimized() {
  const originalDir = './public/chicas';
  const optimizedDir = './public/chicas-optimized/public/chicas';
  
  console.log('🔄 Replacing original images with optimized versions...\n');
  
  try {
    // Get all optimized images
    const optimizedImages = await getAllFiles(optimizedDir, '.jpg');
    let replacedCount = 0;
    let totalSavings = 0;
    
    for (const optimizedPath of optimizedImages) {
      const relativePath = optimizedPath.replace(optimizedDir + '/', '');
      const originalPath = join(originalDir, relativePath);
      
      try {
        // Get file sizes
        const originalStats = await getFileSize(originalPath);
        const optimizedStats = await getFileSize(optimizedPath);
        
        if (originalStats > 0) {
          const savings = originalStats - optimizedStats;
          totalSavings += savings;
          
          // Copy optimized file to original location
          const optimizedContent = await readFile(optimizedPath);
          await writeFile(originalPath, optimizedContent);
          
          console.log(`✅ Replaced: ${relativePath}`);
          console.log(`   Original: ${(originalStats/1024).toFixed(1)}KB → Optimized: ${(optimizedStats/1024).toFixed(1)}KB`);
          console.log(`   Saved: ${(savings/1024).toFixed(1)}KB (${((savings/originalStats)*100).toFixed(1)}%)\n`);
          
          replacedCount++;
        }
      } catch (error) {
        console.log(`⚠️  Skipped: ${relativePath} (may not exist in original)`);
      }
    }
    
    console.log(`\n🎉 Replacement complete!`);
    console.log(`📊 Summary:`);
    console.log(`   Images replaced: ${replacedCount}`);
    console.log(`   Total space saved: ${(totalSavings/1024/1024).toFixed(2)}MB`);
    console.log(`   Original images are now optimized versions`);
    
  } catch (error) {
    console.error('❌ Replacement failed:', error.message);
    process.exit(1);
  }
}

// Get all files with specific extension recursively
async function getAllFiles(dir, extension) {
  const files = [];
  
  async function scanDirectory(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  await scanDirectory(dir);
  return files;
}

// Get file size in bytes
async function getFileSize(filePath) {
  try {
    const stats = await readFile(filePath);
    return stats.length;
  } catch (error) {
    return 0;
  }
}

// Run the replacement
replaceWithOptimized().catch(console.error);
