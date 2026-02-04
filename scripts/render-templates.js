#!/usr/bin/env node
/**
 * SPECTER Evidence Image Renderer
 * Renders HTML templates to PNG images using Puppeteer
 *
 * Usage:
 *   npm install puppeteer
 *   node scripts/render-templates.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'evidence');

// Map template files to output filenames
const TEMPLATE_MAP = {
  'police-report.html': 'hartwell-police-report.png',
  'property-records.html': 'hartwell-property-records.png',
  'emma-drawing.html': 'hartwell-emma-drawing.png',
  'thermal-imaging.html': 'hartwell-thermal.png',
  'missing-person.html': 'hartwell-missing-person.png',
  'cia-memo.html': 'blackwood-cia-memo.png',
  'newspaper-1923.html': 'millbrook-newspaper-1923.png',
  'threshold-charter.html': 'millbrook-threshold-charter.png',
  // Add more mappings as templates are created
  'audio-waveform.html': 'blackwood-waveform.png',
  'sanitarium.html': 'blackwood-sanitarium.png',
  'chen-id.html': 'blackwood-chen-id.png',
  'coordinates-map.html': 'blackwood-coordinates-map.png',
  'hypnotherapy-notes.html': 'blackwood-hypnotherapy-notes.png',
  'timeline.html': 'millbrook-timeline.png',
  'carver-notes.html': 'millbrook-carver-notes.png',
  'ward-journal.html': 'millbrook-ward-journal.png',
  'case-file-1973.html': 'millbrook-1973-case-file.png',
};

async function renderTemplate(browser, templateFile, outputFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.log(`  ⏭ Skipping ${templateFile} (template not found)`);
    return false;
  }

  console.log(`  Rendering: ${templateFile} → ${outputFile}`);

  const page = await browser.newPage();

  try {
    // Load the HTML file
    await page.goto(`file://${templatePath}`, {
      waitUntil: 'networkidle0',
    });

    // Get the dimensions from the body
    const dimensions = await page.evaluate(() => {
      const body = document.body;
      return {
        width: parseInt(body.style.width) || body.offsetWidth,
        height: parseInt(body.style.height) || body.offsetHeight,
      };
    });

    // Set viewport to match template
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 2, // Retina quality
    });

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: true,
    });

    console.log(`  ✓ Saved: ${outputFile}`);
    return true;
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return false;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('SPECTER Evidence Image Renderer');
  console.log('='.repeat(60));
  console.log(`Templates: ${TEMPLATES_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get list of available templates
  const availableTemplates = fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.html'));

  console.log(`Found ${availableTemplates.length} templates\n`);

  // Launch browser
  console.log('Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Render each template
  for (const templateFile of availableTemplates) {
    const outputFile = TEMPLATE_MAP[templateFile];

    if (!outputFile) {
      console.log(`  ⚠ No mapping for: ${templateFile}`);
      skipped++;
      continue;
    }

    const result = await renderTemplate(browser, templateFile, outputFile);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RENDER COMPLETE');
  console.log('='.repeat(60));
  console.log(`Success: ${success}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nOutput: ${OUTPUT_DIR}`);

  if (success > 0) {
    console.log('\nNext steps:');
    console.log('1. Review the rendered images');
    console.log('2. The images are already in the right location (public/evidence/)');
    console.log('3. Deploy to Vercel: vercel --prod');
  }
}

main().catch(console.error);
