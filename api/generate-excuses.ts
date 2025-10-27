import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function to generate 2 creative excuses using Claude API
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
  comedicStyle: string; // The style used for excuse2 (Risky excuse)
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

    // Select random comedic style for the Risky excuse
    const riskyStyles = [
      'Absurdist',
      'Observational',
      'Deadpan',
      'Hyperbolic',
      'Self-deprecating',
      'Ironic',
      'Meta',
      'Paranoid'
    ];
    const selectedStyle = riskyStyles[Math.floor(Math.random() * riskyStyles.length)];

    // Debug logging
    console.log('=== STYLE SELECTION DEBUG ===');
    console.log('Selected comedic style:', selectedStyle);
    console.log('============================');

    // Style-specific instructions
    const styleInstructions: Record<string, string> = {
      'Absurdist': `Use ABSURDIST comedy:
- Introduce surreal, impossible scenarios that defy logic and physics
- Include talking animals, sentient objects, or things that shouldn't exist
- Make the bizarre feel matter-of-fact (quantum mechanics in daily life, time paradoxes)
- Layer absurdity upon absurdity - don't settle for one weird thing
- Examples of absurdist elements: parallel dimensions, objects with personalities, animals doing human jobs, impossible weather
- Avoid clichés: Don't just say "aliens did it" - be creative and specific`,

      'Observational': `Use OBSERVATIONAL comedy:
- Point out the ironic, annoying, or contradictory aspects of everyday situations
- "Have you ever noticed..." style observations about modern life
- Highlight the absurdity in normal social conventions or technology
- Make it relatable - focus on universal frustrations everyone experiences
- Examples: smartphone glitches at crucial moments, autocorrect disasters, social media timing fails
- Avoid clichés: Find fresh angles on common annoyances, not tired old "traffic sucks" jokes`,

      'Deadpan': `Use DEADPAN comedy:
- State completely outrageous things in a serious, matter-of-fact tone
- No exclamation marks, no dramatics - just calm delivery of absurd content
- Use formal, professional language to describe ridiculous situations
- The humor comes from the contrast between tone and content
- Examples: "I was engaged in a minor territorial dispute with a swan" or "A series of cascading failures in my morning routine"
- Avoid clichés: Don't be boring - make the content wild but the delivery flat`,

      'Hyperbolic': `Use HYPERBOLIC comedy:
- Blow everything wildly out of proportion
- Use extreme exaggerations: "worst disaster in human history", "literally impossible"
- Stack superlatives and extremes: epic, catastrophic, unprecedented
- Make small problems into world-ending events
- Examples: missed alarm becomes "apocalyptic chronological failure", traffic becomes "automotive gridlock of biblical proportions"
- Avoid clichés: Don't just add "super" or "really" - go ridiculously over the top`,

      'Self-deprecating': `Use SELF-DEPRECATING comedy:
- Make yourself the fool/incompetent one
- Highlight your own flaws, mistakes, or poor judgment
- Own the failure completely - you're the problem, not circumstances
- Be specific about your incompetence (can't read clocks, terrible at technology, etc.)
- Examples: "I have the spatial awareness of a concussed pigeon" or "My organizational skills peaked in kindergarten"
- Avoid clichés: Don't just say "I'm bad at things" - be creatively self-critical`,

      'Ironic': `Use IRONIC comedy:
- Say the opposite of what you mean to highlight contradictions
- Point out situations where the opposite of what should happen occurs
- Use dramatic irony - when trying to fix something makes it worse
- Highlight hypocrisy or contradictory outcomes
- Examples: "I was trying to be MORE responsible which is exactly why I'm late" or attempting to avoid a problem creates the problem
- Avoid clichés: Find genuine ironic twists, not just sarcasm`,

      'Wordplay': `Use WORDPLAY comedy:
- Include puns, double meanings, or linguistic tricks
- Play with similar-sounding words, homonyms, or phrases
- Use technical terms in unexpected ways
- Create humor through clever word choices or unexpected phrases
- Examples: misheard song lyrics, autocorrect disasters, technical jargon misapplied
- Avoid clichés: Don't use tired old puns - find fresh wordplay angles`,

      'Meta': `Use META comedy:
- Break the 4th wall - acknowledge you're making an excuse
- Reference the fact that this is obviously an excuse
- Be self-aware about how ridiculous/transparent the excuse is
- Comment on the excuse-making process itself
- Examples: "I'm aware this sounds like an excuse, which it absolutely is, but..." or "The beauty of this explanation is that it's technically true while being completely misleading"
- Avoid clichés: Don't just say "I know this sounds fake" - play with the meta-ness creatively`,

      'Paranoid': `Use PARANOID/CONSPIRACY comedy:
- Connect unrelated events into elaborate conspiracy theories
- Everything is suspicious and interconnected
- Use phrases like "it's no coincidence that...", "they don't want you to know..."
- Build increasingly complex chains of cause and effect
- Examples: neighbors are in on it, corporations tracking you, elaborate schemes by mundane organizations
- Avoid clichés: Don't just say "Illuminati" - create specific, silly conspiracies`
    };

    // Build the Claude prompt
    const prompt = `You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: ${scenario}
AUDIENCE: ${audience}

Generate TWO excuses - one mundane, one comedic:

═══════════════════════════════════════════════════════════
EXCUSE 1 - THE BELIEVABLE EXCUSE (Mundane & Practical)
═══════════════════════════════════════════════════════════

This is your BORING excuse. Make it:
- Completely mundane and realistic
- Something that actually could have happened
- Short and to the point (2-5 sentences)
- An EXCUSE (explain what prevented you), not an apology
- Title: Short and boring (3-5 words) like "Traffic Delay" or "Phone Battery Died"

Examples of good mundane excuses:
• "My alarm didn't go off"
• "I got stuck in traffic"
• "My phone battery died and I didn't see your message"
• "I had a last-minute family emergency"

The humor comes from how BORING and ORDINARY this is compared to excuse 2.

═══════════════════════════════════════════════════════════
EXCUSE 2 - THE RISKY EXCUSE (${selectedStyle} Comedy Style)
═══════════════════════════════════════════════════════════

${styleInstructions[selectedStyle]}

REQUIREMENTS:
- Length: 3-7 sentences (you have room to develop the comedy)
- Make it FUNNY and highly creative within this comedic style
- Title: Short and punchy (4-6 words max)
- Appropriate for ${audience} but push comedic boundaries
- Be SPECIFIC and VIVID - avoid vague generic humor
- Find FRESH angles - avoid overused tropes for this style

CREATIVITY GUIDELINES:
✓ Be surprising and unexpected
✓ Layer multiple comedic elements
✓ Use vivid, specific details
✓ Make it distinctly different from generic "outrageous" excuses
✗ Don't rely on shock value alone
✗ Don't use tired clichés
✗ Don't be vague or generic

Remember: The two excuses should be POLAR OPPOSITES - one boring and realistic, one wildly comedic using ${selectedStyle} style.

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short boring title (3-5 words)",
    "text": "the mundane believable excuse (2-5 sentences)"
  },
  "excuse2": {
    "title": "short punchy title (4-6 words)",
    "text": "the ${selectedStyle} comedy excuse (3-7 sentences)"
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
          model: 'claude-sonnet-4-5-20250929',
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
      if (!excuses.excuse1 || !excuses.excuse2) {
        clearTimeout(timeoutId);
        console.error('Invalid excuse structure');
        return res.status(500).json({
          error: 'Received invalid response format. Please try again.'
        });
      }

      // Return excuses to browser with the comedic style
      clearTimeout(timeoutId);
      return res.status(200).json({
        ...excuses,
        comedicStyle: selectedStyle
      });

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
