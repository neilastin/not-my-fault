import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/**
 * Main test suite for image generation feature
 * Tests the complete user flow from excuse generation to image creation
 */

// Helper function to generate excuses (prerequisite for image tests)
async function generateExcuses(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Wait for form to be visible
  await expect(page.locator('h2:has-text("Generate Your Excuse")')).toBeVisible();

  // Fill form - select first non-placeholder options
  const scenarioSelect = page.locator('select').first();
  const audienceSelect = page.locator('select').last();

  await scenarioSelect.selectOption({ index: 1 }); // First real option (not placeholder)
  await audienceSelect.selectOption({ index: 1 });

  // Click generate button
  await page.click('button:has-text("Generate Excuses")');

  // Wait for loading animation to appear
  await expect(page.locator('text=Generating')).toBeVisible({ timeout: 5000 });

  // Wait for excuses to load (tabs should appear)
  await expect(page.locator('button:has-text("Technical")').or(page.locator('text=Technical Excuse'))).toBeVisible({
    timeout: 60000,
  });

  // Wait a bit for animations to complete
  await page.waitForTimeout(1000);
}

// Helper function to scroll to Photo Evidence section
async function scrollToPhotoEvidence(page: Page) {
  const photoEvidenceHeading = page.locator('h2:has-text("Photo Evidence")');
  await expect(photoEvidenceHeading).toBeVisible();
  await photoEvidenceHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Wait for scroll animation
}

test.describe('Image Generation - Happy Path', () => {
  test('should generate image without headshot', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Verify Photo Evidence section is visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();
    await expect(page.locator('text=Optional: Add your photo for personalised evidence')).toBeVisible();

    // Step 4: Verify generate button is visible and contains excuse type
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeEnabled();

    // Step 5: Click generate button
    await generateButton.click();

    // Step 6: Verify loading state appears
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Generating your photo evidence...')).toBeVisible({ timeout: 5000 });

    // Step 7: Wait for image to load (can take up to 60 seconds)
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Step 8: Verify image has loaded properly
    const imageSrc = await generatedImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toMatch(/^(data:image|http)/); // Should be data URL or HTTP URL

    // Step 9: Verify download button appears on hover
    const imageContainer = page.locator('img[alt="Generated excuse evidence"]').locator('..');
    await imageContainer.hover();

    // Wait a bit for hover animation
    await page.waitForTimeout(500);

    // Download button should be in the DOM (visibility tested via hover in browser)
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeInViewport();
  });

  test('should generate image with headshot upload', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Upload headshot
    const fileInput = page.locator('input[type="file"]');
    const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');

    await fileInput.setInputFiles(testImagePath);

    // Step 4: Verify preview appears
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Step 5: Verify file name is displayed
    await expect(page.locator('text=test-headshot.jpg')).toBeVisible();

    // Step 6: Click generate button
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Step 7: Verify loading state
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });

    // Step 8: Wait for image to load
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Step 9: Verify image is different from placeholder
    const imageSrc = await generatedImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toMatch(/^(data:image|http)/);
  });

  test('should allow removing uploaded headshot', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Upload headshot
    const fileInput = page.locator('input[type="file"]');
    const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Step 4: Verify preview appears
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Step 5: Click remove button (X icon)
    const removeButton = page.locator('button[aria-label="Remove headshot"]');
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Step 6: Verify preview is removed
    await expect(preview).not.toBeVisible();

    // Step 7: Verify upload area is back to initial state
    await expect(page.locator('text=Upload your headshot (optional)')).toBeVisible();
  });

  test('should switch between excuse tabs and maintain separate images', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Generate image for default tab (Believable)
    let generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Wait for image to load
    let generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Get first image src
    const firstImageSrc = await generatedImage.getAttribute('src');

    // Step 4: Switch to Technical tab
    const technicalTab = page.locator('button:has-text("Technical")').or(page.locator('text=Technical Excuse')).first();
    await technicalTab.click();
    await page.waitForTimeout(500); // Wait for tab animation

    // Step 5: Verify no image is shown for this tab (empty state)
    await expect(page.locator('text=No photo evidence yet')).toBeVisible();

    // Step 6: Generate image for Technical excuse
    generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateButton).toContainText('Technical Excuse');
    await generateButton.click();

    // Wait for image to load
    generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Get second image src
    const secondImageSrc = await generatedImage.getAttribute('src');

    // Step 7: Switch back to Believable tab
    const believableTab = page.locator('button:has-text("Believable")').or(page.locator('text=Believable Excuse')).first();
    await believableTab.click();
    await page.waitForTimeout(500);

    // Step 8: Verify original image is still displayed
    generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible();
    const cachedImageSrc = await generatedImage.getAttribute('src');

    // Images should be cached per tab
    expect(cachedImageSrc).toBe(firstImageSrc);
    expect(firstImageSrc).not.toBe(secondImageSrc);
  });

  test('should download generated image', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Generate image
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Wait for image to load
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Step 4: Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Step 5: Hover over image to reveal download button
    const imageContainer = generatedImage.locator('..');
    await imageContainer.hover();
    await page.waitForTimeout(500);

    // Step 6: Click download button
    const downloadButton = page.locator('button:has-text("Download")');
    await downloadButton.click();

    // Step 7: Verify download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/excuse-evidence.*\.png/);
  });
});

test.describe('Image Generation - Form Validation', () => {
  test('should not allow image generation before excuses are generated', async ({ page }) => {
    // Navigate directly to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Photo Evidence section should not be visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).not.toBeVisible();
  });

  test('should show Photo Evidence section only after excuses are generated', async ({ page }) => {
    // Step 1: Navigate to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Photo Evidence should not be visible initially
    await expect(page.locator('h2:has-text("Photo Evidence")')).not.toBeVisible();

    // Step 2: Generate excuses
    await generateExcuses(page);

    // Step 3: Photo Evidence should now be visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).toBeVisible();
  });

  test('should reset images when new excuses are generated', async ({ page }) => {
    // Step 1: Generate first set of excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence and generate image
    await scrollToPhotoEvidence(page);
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Wait for image
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Step 3: Scroll back to form and generate new excuses
    await page.locator('h2:has-text("Generate Your Excuse")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const scenarioSelect = page.locator('select').first();
    const audienceSelect = page.locator('select').last();
    await scenarioSelect.selectOption({ index: 2 }); // Different option
    await audienceSelect.selectOption({ index: 2 });

    await page.click('button:has-text("Generate Excuses")');
    await expect(page.locator('button:has-text("Technical")').or(page.locator('text=Technical Excuse'))).toBeVisible({
      timeout: 60000,
    });

    // Step 4: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 5: Verify image was reset (empty state)
    await expect(page.locator('text=No photo evidence yet')).toBeVisible();
  });
});
