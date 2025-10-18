import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/**
 * Error handling test suite for image generation feature
 * Tests file validation, API errors, and edge cases
 */

// Helper function to generate excuses (prerequisite for image tests)
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

test.describe('Image Generation - File Upload Validation', () => {
  test('should reject invalid file type (txt)', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Attempt to upload text file
    const fileInput = page.locator('input[type="file"]');
    const invalidFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'invalid-file.txt');

    await fileInput.setInputFiles(invalidFilePath);

    // Step 4: Verify error message appears
    await expect(page.locator('text=Please upload a JPG or PNG file')).toBeVisible({ timeout: 5000 });

    // Step 5: Verify preview does not appear
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).not.toBeVisible();

    // Step 6: Verify upload area remains in initial state
    await expect(page.locator('text=Upload your headshot (optional)')).toBeVisible();
  });

  test('should reject oversized file (> 5MB)', async ({ page }) => {
    // Step 1: Generate excuses
    await generateExcuses(page);

    // Step 2: Scroll to Photo Evidence section
    await scrollToPhotoEvidence(page);

    // Step 3: Attempt to upload large file
    const fileInput = page.locator('input[type="file"]');
    const largeFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'large-file.jpg');

    await fileInput.setInputFiles(largeFilePath);

    // Step 4: Verify error message appears
    await expect(page.locator('text=File size must be less than 5MB')).toBeVisible({ timeout: 5000 });

    // Step 5: Verify preview does not appear
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).not.toBeVisible();
  });

  test('should accept valid JPG file', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');

    await fileInput.setInputFiles(validFilePath);

    // Should show preview without error
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // No error message should appear
    await expect(page.locator('text=Please upload a JPG or PNG file')).not.toBeVisible();
    await expect(page.locator('text=File size must be less than 5MB')).not.toBeVisible();
  });

  test('should accept valid PNG file', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.png');

    await fileInput.setInputFiles(validFilePath);

    // Should show preview without error
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // No error message should appear
    await expect(page.locator('text=Please upload a JPG or PNG file')).not.toBeVisible();
    await expect(page.locator('text=File size must be less than 5MB')).not.toBeVisible();
  });

  test('should allow re-uploading after validation error', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');

    // Step 1: Upload invalid file
    const invalidFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'invalid-file.txt');
    await fileInput.setInputFiles(invalidFilePath);

    // Verify error
    await expect(page.locator('text=Please upload a JPG or PNG file')).toBeVisible({ timeout: 5000 });

    // Step 2: Upload valid file
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    // Step 3: Verify error is cleared and preview appears
    await expect(page.locator('text=Please upload a JPG or PNG file')).not.toBeVisible();
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });
  });

  test('should display file size in preview', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');

    await fileInput.setInputFiles(validFilePath);

    // Wait for preview
    const preview = page.locator('img[alt="Headshot preview"]');
    await expect(preview).toBeVisible({ timeout: 5000 });

    // Verify file size is displayed (should be in format "X.XX MB")
    await expect(page.locator('text=/\\d+\\.\\d+ MB/')).toBeVisible();
  });
});

test.describe('Image Generation - API Error Handling', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    // This test would require mocking the API to return an error
    // For now, we'll test that the UI can handle potential errors

    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Mock API failure
    await page.route('**/api/generate-image', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Attempt to generate image
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Verify loading state appears
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });

    // Verify error message appears (app should display error)
    // Note: Adjust this selector based on your error display implementation
    await expect(
      page.locator('text=/Failed to generate image|Internal server error|Error/i')
    ).toBeVisible({ timeout: 10000 });

    // Verify loading state is removed
    await expect(page.locator('text=Generating Photo Evidence...')).not.toBeVisible();

    // Verify button is re-enabled for retry
    await expect(generateButton).toBeEnabled();
  });

  test('should allow retry after API error', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Mock API failure first
    let requestCount = 0;
    await page.route('**/api/generate-image', (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      } else {
        // Second request succeeds (pass through to real API)
        route.continue();
      }
    });

    // First attempt (should fail)
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Wait for error
    await expect(
      page.locator('text=/Failed to generate image|Internal server error|Error/i')
    ).toBeVisible({ timeout: 10000 });

    // Retry (should succeed)
    await generateButton.click();

    // Should show loading
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });

    // Should eventually show image (if API is working)
    // Note: This may timeout if real API is not available
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });
  });

  test('should handle network timeout gracefully', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Mock a delayed response (simulate timeout)
    await page.route('**/api/generate-image', async (route) => {
      // Delay for 90+ seconds to trigger timeout
      await new Promise((resolve) => setTimeout(resolve, 90000));
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Request timeout' }),
      });
    });

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Verify loading state appears
    await expect(page.locator('text=Generating Photo Evidence...')).toBeVisible({ timeout: 5000 });

    // Button should be disabled during loading
    await expect(generateButton).toBeDisabled();

    // Note: This test will take a long time and may need adjustment
    // based on actual timeout configuration
  });
});

test.describe('Image Generation - Edge Cases', () => {
  test('should disable upload during image generation', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    // Start image generation
    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Verify upload area is disabled
    const uploadArea = page.locator('input[type="file"]');
    await expect(uploadArea).toBeDisabled();

    // Wait for generation to complete
    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Upload should be enabled again
    await expect(uploadArea).toBeEnabled();
  });

  test('should prevent multiple simultaneous image generation requests', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');

    // First click
    await generateButton.click();

    // Verify button is disabled
    await expect(generateButton).toBeDisabled();

    // Attempt second click (should not trigger)
    await generateButton.click({ force: true }); // Force click even if disabled

    // Only one loading indicator should appear
    const loadingIndicators = page.locator('text=Generating your photo evidence...');
    await expect(loadingIndicators).toHaveCount(1);
  });

  test('should handle missing excuse text gracefully', async ({ page }) => {
    // Navigate directly without generating excuses
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Photo Evidence section should not be visible
    await expect(page.locator('h2:has-text("Photo Evidence")')).not.toBeVisible();
  });

  test('should clear error message when uploading new file', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');

    // Upload invalid file
    const invalidFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'invalid-file.txt');
    await fileInput.setInputFiles(invalidFilePath);

    // Verify error appears
    await expect(page.locator('text=Please upload a JPG or PNG file')).toBeVisible({ timeout: 5000 });

    // Upload valid file
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    // Error should be cleared
    await expect(page.locator('text=Please upload a JPG or PNG file')).not.toBeVisible();
  });
});

test.describe('Image Generation - Accessibility', () => {
  test('should have accessible file upload input', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');

    // Verify input has aria-label
    const ariaLabel = await fileInput.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('headshot');
  });

  test('should have accessible remove button', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const fileInput = page.locator('input[type="file"]');
    const validFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-headshot.jpg');
    await fileInput.setInputFiles(validFilePath);

    // Wait for preview
    await page.locator('img[alt="Headshot preview"]').waitFor({ state: 'visible' });

    // Verify remove button has aria-label
    const removeButton = page.locator('button[aria-label="Remove headshot"]');
    await expect(removeButton).toBeVisible();

    const ariaLabel = await removeButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Remove headshot');
  });

  test('should have accessible download button', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    const generatedImage = page.locator('img[alt="Generated excuse evidence"]');
    await expect(generatedImage).toBeVisible({ timeout: 75000 });

    // Verify download button has aria-label
    const downloadButton = page.locator('button[aria-label="Download image"]');
    const ariaLabel = await downloadButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Download image');
  });

  test('should indicate loading state with aria-busy', async ({ page }) => {
    await generateExcuses(page);
    await scrollToPhotoEvidence(page);

    const generateButton = page.locator('button:has-text("Generate Photo Evidence")');
    await generateButton.click();

    // Verify button has aria-busy during loading
    const ariaBusy = await generateButton.getAttribute('aria-busy');
    expect(ariaBusy).toBe('true');

    // Wait for completion
    await page.locator('img[alt="Generated excuse evidence"]').waitFor({ state: 'visible', timeout: 75000 });

    // aria-busy should be false or removed
    const ariaBusyAfter = await generateButton.getAttribute('aria-busy');
    expect(ariaBusyAfter).toBeFalsy();
  });
});
