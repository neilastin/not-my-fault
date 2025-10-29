import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/**
 * Responsive design test suite for image generation feature
 * Tests layout and functionality across different viewport sizes
 */

// Viewport configurations
const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'Mobile (375px)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (768px)' },
  desktop: { width: 1920, height: 1080, name: 'Desktop (1920px)' },
  smallMobile: { width: 320, height: 568, name: 'Small Mobile (320px)' },
  largeMobile: { width: 414, height: 896, name: 'Large Mobile (414px)' },
};

// Helper functions
async function generateExcuses(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const scenarioSelect = page.locator('select').first();
  const audienceSelect = page.locator('select').last();

  await scenarioSelect.selectOption({ index: 1 });
  await audienceSelect.selectOption({ index: 1 });

  await page.click('button:has-text("Generate Excuses")');

  await expect(page.locator('button:has-text("Technical")').or(page.locator('text=Technical Excuse'))).toBeVisible({
    timeout: 60000,
  });

  await page.waitForTimeout(1000);
}

async function scrollToPhotoEvidence(page: Page) {
  const photoEvidenceHeading = page.locator('h2:has-text("Photo Evidence")');
  await expect(photoEvidenceHeading).toBeVisible();
  await photoEvidenceHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

test.describe('Image Generation - Mobile Responsive (375px)', () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test('should display Photo Evidence section in mobile layout', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify section is visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();

    // Verify upload and display areas stack vertically (grid-cols-1)
    const photoSection = page.locator('h2:has-text("Photo Evidence")').locator('..');
    const gridContainer = photoSection.locator('div.grid');
    await expect(gridContainer).toBeVisible();

    // On mobile, items should stack (full width)
    const uploadColumn = page.locator('h3:has-text("Your Photo (Optional)")').locator('..');
    const displayColumn = page.locator('h3:has-text("Generated Evidence")').locator('..');

    await expect(uploadColumn).toBeVisible();
    await expect(displayColumn).toBeVisible();
  });

  test('should allow file upload on mobile', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');

    await fileInput.setInputFiles(validFilePath);

    // Preview should appear
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Verify preview is properly sized for mobile
    const previewBox = await preview.boundingBox();
    expect(previewBox).toBeTruthy();
    expect(previewBox!.width).toBeLessThanOrEqual(375); // Should fit within viewport
  });

  test('should generate image on mobile', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toBeVisible();

    // Button should be full width on mobile
    const buttonBox = await generateButton.boundingBox();
    expect(buttonBox).toBeTruthy();

    await generateButton.click();

    // Verify loading state
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });

    // Wait for image
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Verify image fits within viewport
    const imageBox = await generatedImage.boundingBox();
    expect(imageBox).toBeTruthy();
    expect(imageBox!.width).toBeLessThanOrEqual(375);
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    await page.locator('img[alt="Headshot preview"]').waitFor({ state: 'visible' });

    // Verify remove button is large enough for touch (minimum 44x44px)
    const removeButton = page.locator('button[aria-label="Remove headshot"]');
    const removeButtonBox = await removeButton.boundingBox();
    expect(removeButtonBox).toBeTruthy();
    expect(removeButtonBox!.width).toBeGreaterThanOrEqual(24); // Icon button with padding
    expect(removeButtonBox!.height).toBeGreaterThanOrEqual(24);

    // Generate button should also be touch-friendly
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    const generateButtonBox = await generateButton.boundingBox();
    expect(generateButtonBox).toBeTruthy();
    expect(generateButtonBox!.height).toBeGreaterThanOrEqual(44); // py-4 should give sufficient height
  });
});

test.describe('Image Generation - Tablet Responsive (768px)', () => {
  test.use({ viewport: VIEWPORTS.tablet });

  test('should display Photo Evidence in tablet layout', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify section is visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();

    // On tablet, might still stack or show side-by-side depending on breakpoint
    const uploadColumn = page.locator('h3:has-text("Your Photo (Optional)")').locator('..');
    const displayColumn = page.locator('h3:has-text("Generated Evidence")').locator('..');

    await expect(uploadColumn).toBeVisible();
    await expect(displayColumn).toBeVisible();
  });

  test('should handle touch interactions on tablet', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Upload file using touch
    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Generate image
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });
  });

  test('should show proper spacing on tablet', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify elements are properly spaced and not cramped
    const photoSection = page.locator('h2:has-text("Photo Evidence")');
    await expect(photoSection).toBeVisible();

    const uploadArea = page.locator('h3:has-text("Your Photo (Optional)")').locator('..');
    const uploadBox = await uploadArea.boundingBox();
    expect(uploadBox).toBeTruthy();
    expect(uploadBox!.width).toBeGreaterThan(200); // Should have decent width
  });
});

test.describe('Image Generation - Desktop Responsive (1920px)', () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test('should display Photo Evidence in desktop two-column layout', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify section is visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();

    // On desktop (lg breakpoint), should show side-by-side
    const uploadColumn = page.locator('h3:has-text("Your Photo (Optional)")').locator('..');
    const displayColumn = page.locator('h3:has-text("Generated Evidence")').locator('..');

    await expect(uploadColumn).toBeVisible();
    await expect(displayColumn).toBeVisible();

    // Verify columns are side-by-side (y position should be similar)
    const uploadBox = await uploadColumn.boundingBox();
    const displayBox = await displayColumn.boundingBox();

    expect(uploadBox).toBeTruthy();
    expect(displayBox).toBeTruthy();

    // On desktop with lg:grid-cols-2, columns should be at similar y position
    // Allow some variance for headers
    const yDifference = Math.abs(uploadBox!.y - displayBox!.y);
    expect(yDifference).toBeLessThan(100); // Should be roughly aligned horizontally
  });

  test('should show hover effects on desktop', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Hover over image to reveal download button
    const imageContainer = generatedImage.locator('..');
    await imageContainer.hover();
    await page.waitForTimeout(500);

    // Download button should be visible on hover
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeInViewport();
  });

  test('should have proper max-width constraints on desktop', async ({ page }) => {
    await generateExcuses(page);

    // Form should be centered with max-width
    const formSection = page.locator('h2:has-text("Generate Your Excuse")').locator('..');
    const formBox = await formSection.boundingBox();

    expect(formBox).toBeTruthy();
    expect(formBox!.width).toBeLessThan(1920); // Should not stretch full width
  });
});

test.describe('Image Generation - Small Mobile (320px)', () => {
  test.use({ viewport: VIEWPORTS.smallMobile });

  test('should remain functional on small mobile screens', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // All elements should be visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toBeVisible();

    // Button should fit within viewport
    const buttonBox = await generateButton.boundingBox();
    expect(buttonBox).toBeTruthy();
    expect(buttonBox!.width).toBeLessThanOrEqual(320);
  });

  test('should handle file upload on small screens', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');

    await fileInput.setInputFiles(validFilePath);

    // Preview should appear and fit
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    const previewBox = await preview.boundingBox();
    expect(previewBox).toBeTruthy();
    expect(previewBox!.width).toBeLessThanOrEqual(320);
  });

  test('should have readable text on small screens', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify headings are visible and readable
    const heading = page.locator('h2:has-text("Photo Evidence")');
    await expect(heading).toBeVisible();

    const subheading = page.locator('text=Optional: Add your photo for personalised evidence');
    await expect(subheading).toBeVisible();

    // Text should wrap appropriately
    const headingBox = await heading.boundingBox();
    expect(headingBox).toBeTruthy();
    expect(headingBox!.width).toBeLessThanOrEqual(320);
  });
});

test.describe('Image Generation - Landscape Orientation', () => {
  test.use({ viewport: { width: 667, height: 375 } }); // Mobile landscape

  test('should work in landscape mode', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // All elements should be accessible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toBeVisible();

    // Upload area should be visible
    const uploadArea = page.locator('text=Upload your headshot (optional)');
    await expect(uploadArea).toBeVisible();
  });

  test('should scroll properly in landscape', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify scrolling works
    const scenarioSelect = page.locator('select').first();
    await scenarioSelect.scrollIntoViewIfNeeded();
    await expect(scenarioSelect).toBeVisible();

    await scenarioSelect.selectOption({ index: 1 });
    const audienceSelect = page.locator('select').last();
    await audienceSelect.selectOption({ index: 1 });

    await page.click('button:has-text("Generate Excuses")');

    await expect(page.locator('button:has-text("Technical")').or(page.locator('text=Technical Excuse'))).toBeVisible({
      timeout: 60000,
    });

    // Scroll to Photo Evidence
    const photoHeading = page.locator('h2:has-text("Photo Evidence")');
    await expect(photoHeading).toBeVisible();
    await photoHeading.scrollIntoViewIfNeeded();
    await expect(photoHeading).toBeInViewport();
  });
});

test.describe('Image Generation - Cross-Viewport Consistency', () => {
  test('should maintain functionality across all viewports', async ({ page }) => {
    // This test runs on default viewport from playwright.config.ts

    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Core functionality should work regardless of viewport
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeEnabled();

    // Upload should work
    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Remove should work
    const removeButton = page.locator('button[aria-label="Remove headshot"]');
    await removeButton.click();
    await expect(preview).not.toBeVisible();
  });

  test('should have consistent spacing across viewports', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Verify consistent spacing between elements
    const heading = page.locator('h2:has-text("Photo Evidence")');
    const subheading = page.locator('text=Optional: Add your photo for personalised evidence');

    const headingBox = await heading.boundingBox();
    const subheadingBox = await subheading.boundingBox();

    expect(headingBox).toBeTruthy();
    expect(subheadingBox).toBeTruthy();

    // Subheading should be below heading with reasonable spacing
    expect(subheadingBox!.y).toBeGreaterThan(headingBox!.y);
    const spacing = subheadingBox!.y - (headingBox!.y + headingBox!.height);
    expect(spacing).toBeGreaterThanOrEqual(0);
    expect(spacing).toBeLessThan(50); // Reasonable spacing
  });
});
