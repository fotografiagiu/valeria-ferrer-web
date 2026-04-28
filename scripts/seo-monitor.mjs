#!/usr/bin/env node

// SEO Monitoring and Recovery Script
import https from 'https';
import fs from 'fs';
import path from 'path';

const SITEMAP_URL = 'https://www.valeriaferrer.com/sitemap.xml';
const DOMAIN = 'https://www.valeriaferrer.com';

// Check sitemap accessibility
async function checkSitemap() {
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('✅ Sitemap accessible');
          resolve(data);
        });
      } else {
        console.log(`❌ Sitemap returned status: ${res.statusCode}`);
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Extract URLs from sitemap
function extractUrls(sitemapData) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(sitemapData)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// Check individual URL status
async function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    https.get(url, (res) => {
      const endTime = Date.now();
      resolve({
        url,
        status: res.statusCode,
        responseTime: endTime - startTime,
        accessible: res.statusCode === 200
      });
    }).on('error', () => {
      resolve({
        url,
        status: 0,
        responseTime: 0,
        accessible: false
      });
    });
  });
}

// Generate SEO report
async function generateSeoReport() {
  console.log('🔍 Starting SEO monitoring...\n');
  
  try {
    // Check sitemap
    const sitemapData = await checkSitemap();
    const urls = extractUrls(sitemapData);
    
    console.log(`📊 Found ${urls.length} URLs in sitemap`);
    
    // Check critical pages first
    const criticalPages = urls.filter(url => 
      url.includes('/model/') || 
      url === DOMAIN || 
      url.includes('/models')
    ).slice(0, 10); // Check first 10 for demo
    
    console.log(`\n🚀 Checking ${criticalPages.length} critical pages...`);
    
    const results = await Promise.all(criticalPages.map(checkUrl));
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      totalUrls: urls.length,
      checkedUrls: criticalPages.length,
      accessiblePages: results.filter(r => r.accessible).length,
      averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
      issues: results.filter(r => !r.accessible)
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'seo-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📈 SEO Report Summary:');
    console.log(`✅ Accessible pages: ${report.accessiblePages}/${report.checkedUrls}`);
    console.log(`⚡ Average response time: ${Math.round(report.averageResponseTime)}ms`);
    
    if (report.issues.length > 0) {
      console.log('\n❌ Issues found:');
      report.issues.forEach(issue => {
        console.log(`   ${issue.url} - Status: ${issue.status}`);
      });
    }
    
    console.log(`\n💾 Full report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ SEO monitoring failed:', error.message);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSeoReport();
}

export { generateSeoReport };
