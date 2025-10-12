import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function to generate AI images using Gemini API
 *
 * Security: API key accessed via process.env (server-side only)
 * Supports optional headshot compositing
 */

interface RequestBody {
  excuseText: string;
  headshotBase64?: string;
  headshotMimeType?: string;
}

interface ImageResponse {
  imageUrl: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Please use POST.'
    });
  }

  try {
    const { excuseText, headshotBase64, headshotMimeType } = req.body as RequestBody;

    // Validate required input
    if (!excuseText) {
      return res.status(400).json({
        error: 'Excuse text is required.'
      });
    }

    if (typeof excuseText !== 'string' || excuseText.trim().length === 0) {
      return res.status(400).json({
        error: 'Excuse text must be a non-empty string.'
      });
    }

    // Limit text length to prevent abuse
    if (excuseText.length > 2000) {
      return res.status(400).json({
        error: 'Excuse text is too long. Please limit to 2000 characters.'
      });
    }

    // Validate headshot if provided
    if (headshotBase64) {
      if (!headshotMimeType) {
        return res.status(400).json({
          error: 'Headshot MIME type is required when providing a headshot.'
        });
      }

      // Validate MIME type
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedMimeTypes.includes(headshotMimeType)) {
        return res.status(400).json({
          error: 'Invalid image type. Only JPG and PNG are allowed.'
        });
      }

      // Check base64 size (rough estimate: 5MB = ~6.67MB base64)
      const maxBase64Size = 7 * 1024 * 1024; // 7MB base64 ≈ 5MB file
      if (headshotBase64.length > maxBase64Size) {
        return res.status(400).json({
          error: 'Image is too large. Please use an image under 5MB.'
        });
      }

      // Validate base64 format
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(headshotBase64)) {
        return res.status(400).json({
          error: 'Invalid image format. Please upload a valid image file.'
        });
      }

      // Validate that it's decodable
      try {
        Buffer.from(headshotBase64, 'base64');
      } catch (decodeError) {
        return res.status(400).json({
          error: 'Invalid image format. Please upload a valid image file.'
        });
      }
    }

    // Verify API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Build Gemini prompt
    let prompt: string;
    const parts: any[] = [];

    if (headshotBase64) {
      // With headshot - composite the person into the scene
      prompt = `I'm providing you with a headshot photo of a person. Create a photorealistic 16:9 image that places THIS SPECIFIC PERSON into the following humorous excuse scenario:

EXCUSE: ${excuseText}

CRITICAL REQUIREMENTS:
1. PERSON CONTINUITY: The person in the generated image MUST look exactly like the person in the provided headshot. Maintain their facial features, hair, skin tone, and general appearance. This is absolutely critical.
2. Scene Integration: Place this person naturally into the absurd scenario described in the excuse
3. Photorealistic Style: The image should look like a real photograph, not a cartoon or illustration
4. Aspect Ratio: 16:9 (landscape orientation)
5. Humor: The scenario should be visually funny and absurd, making the excuse obviously ridiculous
6. Quality: High-quality, well-lit, professionally composed shot

Make sure the person from the headshot is clearly the main subject in the scenario. The image should make viewers laugh at how ridiculous the situation is while featuring the actual person from the uploaded photo.`;

      parts.push(
        { text: prompt },
        {
          inline_data: {
            mime_type: headshotMimeType,
            data: headshotBase64
          }
        }
      );
    } else {
      // Without headshot - generate generic scenario
      prompt = `Create a photorealistic 16:9 image that humorously depicts the following excuse scenario:

EXCUSE: ${excuseText}

REQUIREMENTS:
- Style: Photorealistic, high-quality, cinematic
- Aspect Ratio: 16:9 (landscape)
- Tone: Funny, absurd, visually captures the ridiculousness of the excuse
- Scene: Show the scenario in action, with visual elements that match the excuse narrative
- Details: Rich environmental details that support the story
- Lighting: Dramatic, professional photography lighting
- Composition: Well-framed, visually interesting

Make this image obviously absurd and humorous while maintaining photorealistic quality. The image should make someone laugh when they see it because of how ridiculous the scenario is.`;

      parts.push({ text: prompt });
    }

    // Call Gemini API with timeout (API key is secure on server)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 2048,
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        // Sanitized error logging (only first 200 chars, no sensitive data)
        console.error('Gemini API error:', {
          status: response.status,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const data = await response.json();

      // Extract generated image
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in Gemini response:', data);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const generatedContent = data.candidates[0].content.parts[0];

      if (!generatedContent.inline_data) {
        console.error('No image data in response:', generatedContent);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. The model may not support image generation.'
        });
      }

      const imageBase64 = generatedContent.inline_data.data;
      const mimeType = generatedContent.inline_data.mime_type;

      // Return image to browser as data URL
      const imageResponse: ImageResponse = {
        imageUrl: `data:${mimeType};base64,${imageBase64}`
      };

      clearTimeout(timeoutId);
      return res.status(200).json(imageResponse);

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle timeout specifically
      if (fetchError.name === 'AbortError') {
        console.error('Gemini API timeout after 45s');
        return res.status(504).json({
          error: 'Request timed out. Please try again.'
        });
      }

      console.error('Error generating image:', fetchError);
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}
