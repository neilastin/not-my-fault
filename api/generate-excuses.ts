import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function to generate 3 creative excuses using Claude API
 *
 * Security: API key accessed via process.env (server-side only)
 * No VITE_ prefix - keeps keys hidden from browser
 */

interface RequestBody {
  scenario: string;
  audience: string;
}

interface ExcuseItem {
  title: string;
  text: string;
}

interface ExcusesResponse {
  excuse1: ExcuseItem;
  excuse2: ExcuseItem;
  excuse3: ExcuseItem;
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
    const { scenario, audience } = req.body as RequestBody;

    // Validate required inputs
    if (!scenario || !audience) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide scenario and audience.'
      });
    }

    // Validate input types and lengths
    if (typeof scenario !== 'string' || scenario.trim().length === 0) {
      return res.status(400).json({
        error: 'Scenario must be a non-empty string.'
      });
    }

    if (typeof audience !== 'string' || audience.trim().length === 0) {
      return res.status(400).json({
        error: 'Audience must be a non-empty string.'
      });
    }

    // Limit input lengths to prevent abuse
    if (scenario.length > 1000) {
      return res.status(400).json({
        error: 'Scenario is too long. Please limit to 1000 characters.'
      });
    }

    // Verify API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return res.status(500).json({
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Build the Claude prompt
    const prompt = `You are an expert excuse generator creating humorous excuses for comedy purposes. Generate THREE distinct excuses for the following scenario, each with a different tone and style.

IMPORTANT: Use BRITISH ENGLISH spelling and phrasing throughout (e.g., "realise" not "realize", "colour" not "color", "whilst" not "while", etc.).

SCENARIO: ${scenario}
AUDIENCE: ${audience}

Generate exactly THREE excuses with the following characteristics:

EXCUSE 1 - THE OVERLY FORMAL EXCUSE:
- Tone: Extremely formal, academic, unnecessarily complicated
- Language: Complex vocabulary, long sentences, technical jargon
- Comedy: Derives from how ridiculously over-complicated it is
- Length: 3-4 sentences
- Title: A short, pompous-sounding title (4-6 words max) like "The Quantum Temporal Displacement Theory" or "An Exercise in Circumstantial Inevitability"

EXCUSE 2 - THE BELIEVABLE EXCUSE:
- Tone: Reasonable, sensible, somewhat mundane
- Language: Clear, straightforward, relatable
- Comedy: Derives from how boring and ordinary it is (might be slightly humorous in its mundanity)
- Length: 2-3 sentences
- Title: A short, boring title (3-5 words max) like "Traffic Issues" or "Simple Miscommunication"

EXCUSE 3 - THE OUTRAGEOUS EXCUSE:
- Tone: Absurd, far-fetched, fantastical, uses extreme hyperbole
- Language: Dramatic, vivid, storytelling style
- Comedy: Derives from how ridiculous and unbelievable it is
- Length: 3-5 sentences
- Title: A short, dramatic title (4-6 words max) like "The Great Alpaca Incident" or "When Pigeons Attack"

IMPORTANT INSTRUCTIONS:
1. Each excuse must be DISTINCTLY DIFFERENT in tone and content
2. All excuses should be humorous but appropriate for ${audience}
3. Titles must be SHORT and punchy (never more than 6 words)
4. Use BRITISH ENGLISH spelling and phrasing throughout all excuses
5. Return ONLY valid JSON, no other text

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short formal title here",
    "text": "the overly formal excuse text here"
  },
  "excuse2": {
    "title": "short boring title here",
    "text": "the believable excuse text here"
  },
  "excuse3": {
    "title": "short dramatic title here",
    "text": "the outrageous excuse text here"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.`;

    // Call Claude API with timeout (API key is secure on server)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        // Sanitized error logging (only first 200 chars, no sensitive data)
        console.error('Claude API error:', {
          status: response.status,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({
          error: 'Failed to generate excuses. Please try again.'
        });
      }

      const data = await response.json();

      // Parse Claude's JSON response
      const excusesText = data.content[0].text;

      // Handle potential markdown code blocks
      const cleanedText = excusesText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      let excuses: ExcusesResponse;
      try {
        excuses = JSON.parse(cleanedText);
      } catch (parseError) {
        clearTimeout(timeoutId);
        console.error('Failed to parse Claude response');
        return res.status(500).json({
          error: 'Failed to process excuses. Please try again.'
        });
      }

      // Validate response structure
      if (!excuses.excuse1 || !excuses.excuse2 || !excuses.excuse3) {
        clearTimeout(timeoutId);
        console.error('Invalid excuse structure');
        return res.status(500).json({
          error: 'Received invalid response format. Please try again.'
        });
      }

      // Return excuses to browser
      clearTimeout(timeoutId);
      return res.status(200).json(excuses);

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle timeout specifically
      if (fetchError.name === 'AbortError') {
        console.error('Claude API timeout after 30s');
        return res.status(504).json({
          error: 'Request timed out. Please try again.'
        });
      }

      console.error('Error generating excuses:', fetchError);
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error generating excuses:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}
