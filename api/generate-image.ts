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

    // Build Gemini 2.5 Flash Image prompt
    let prompt: string;

    if (headshotBase64) {
      // With headshot - composite the person into the scene
      prompt = `Take this person (or people) and place them in an extremely hilarious scenario depicting this excuse: ${excuseText}. They've done something wrong but are pretending it's not their fault—this is their absurd excuse, and you're creating the photographic evidence. Keep their faces 100% recognizable (same person/people), but feel free to adjust expressions and angles. Extend to full-body shots if needed with realistic lighting and natural shadows. Make it photorealistic, absurd, and funny.`;
    } else {
      // Without headshot - generate generic scenario
      prompt = `Create photorealistic evidence of this excuse: ${excuseText}. Show the aftermath, the scene, or the situation itself—but do NOT show the person making the excuse (we don't know what they look like). Focus on environmental details, objects, or consequences that prove this absurd scenario happened. Other people can appear if relevant to the excuse, but not the main subject. Make it look like photographic evidence with realistic lighting and details. Keep it absurd and funny while maintaining photorealism.`;
    }

    // Call Gemini 2.5 Flash Image API for image generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for image generation

    try {
      // Build the request parts array
      const requestParts: any[] = [];

      // Add headshot as inline_data if provided (must come before text prompt)
      if (headshotBase64 && headshotMimeType) {
        requestParts.push({
          inline_data: {
            mime_type: headshotMimeType,
            data: headshotBase64
          }
        });
      }

      // Add the text prompt
      requestParts.push({ text: prompt });

      // Gemini 2.5 Flash Image API endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: requestParts
            }],
            generationConfig: {
              responseModalities: ["Image"],
              imageConfig: {
                aspectRatio: "16:9"
              }
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

      // Extract generated image from Gemini 2.5 Flash Image response
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in Gemini response:', data);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const candidate = data.candidates[0];
      const parts = candidate?.content?.parts;

      if (!parts || parts.length === 0) {
        console.error('No parts in Gemini response:', candidate);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const inlineData = parts[0]?.inlineData;

      if (!inlineData || !inlineData.data) {
        console.error('No image data in Gemini response:', parts[0]);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. The model may not support image generation.'
        });
      }

      const imageBase64 = inlineData.data;
      const mimeType = inlineData.mimeType || 'image/png'; // Default to PNG if not specified

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
        console.error('Gemini 2.5 Flash Image API timeout after 60s');
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
