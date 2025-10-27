import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function to generate AI images using Gemini API
 *
 * Security: API key accessed via process.env (server-side only)
 * Supports optional headshot compositing
 */

interface RequestBody {
  excuseText: string;
  comedicStyle: string;
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
    const { excuseText, comedicStyle, headshotBase64, headshotMimeType } = req.body as RequestBody;

    // Validate required inputs
    if (!excuseText) {
      return res.status(400).json({
        error: 'Excuse text is required.'
      });
    }

    if (!comedicStyle) {
      return res.status(400).json({
        error: 'Comedic style is required.'
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

    // Visual style instructions matching comedic styles
    const visualStyleInstructions: Record<string, { withHeadshot: string; withoutHeadshot: string }> = {
      'Absurdist': {
        withHeadshot: `VISUAL STYLE: Absurdist/Surreal Photography
Create a photorealistic image with SURREAL, REALITY-BENDING elements. The subject's face/body must be photorealistic and 100% recognizable, but the scenario should defy logic and physics.

ABSURDIST VISUAL ELEMENTS:
- Impossible physics: floating objects, reversed gravity, size distortions, objects defying natural laws
- Surreal juxtapositions: everyday objects in impossible contexts
- Reality-bending: mirrors showing different realities, impossible perspectives, quantum effects
- Talking/sentient objects or animals (shown through visual cues, NOT text)
- Dreamlike atmosphere while maintaining photo quality

COMPOSITION & CAMERA:
- Slightly Dutch angle or unusual perspective to enhance surreality
- Subject photographed realistically but integrated into impossible scenario
- Natural photo quality with surreal content

LIGHTING:
- Realistic lighting on subject, but may include impossible light sources or shadows
- Dreamlike quality through lighting choices while keeping subject recognizable`,

        withoutHeadshot: `VISUAL STYLE: Absurdist/Surreal Photography
Create photorealistic environmental evidence with SURREAL, REALITY-BENDING elements. No main subject—focus on the aftermath or scenario proving this absurd excuse happened.

ABSURDIST VISUAL ELEMENTS:
- Impossible physics: floating objects, reversed gravity, size distortions
- Surreal juxtapositions: everyday objects in impossible contexts
- Reality-bending visual evidence: quantum effects, dimensional anomalies
- Environmental clues that defy logic
- Dreamlike atmosphere while maintaining photo quality

COMPOSITION:
- Focus on environmental evidence and surreal elements
- Documentary style capturing impossible scenarios
- Unusual angles that enhance surreality`
      },

      'Observational': {
        withHeadshot: `VISUAL STYLE: Modern Life Photography / Perfect Timing
Create a photorealistic image capturing RELATABLE MODERN FRUSTRATIONS with perfect comic timing. The subject must be 100% recognizable, caught in a universally relatable fail moment.

OBSERVATIONAL VISUAL ELEMENTS:
- Technology fails: phone glitches, autocorrect disasters visible on screens
- Modern life ironies: delivery notifications, app notifications at worst time
- Perfect timing captures: mid-spill, mid-trip, moment of realization
- Relatable everyday settings: coffee shop, office, home, public transit
- Small details everyone recognizes: charging cables tangled, "no signal" indicators

COMPOSITION & CAMERA:
- Candid, documentary-style capture of the moment
- Natural angles like smartphone photos or security cameras
- Subject's expression of recognition/frustration/embarrassment clearly visible

LIGHTING:
- Natural, realistic lighting (indoor fluorescent, natural daylight, phone screen glow)
- Authentic photo quality - not posed, caught in the moment`,

        withoutHeadshot: `VISUAL STYLE: Modern Life Photography / Environmental Evidence
Create photorealistic evidence of RELATABLE MODERN FRUSTRATIONS. Focus on environmental details everyone will recognize and relate to.

OBSERVATIONAL VISUAL ELEMENTS:
- Technology fail evidence: cracked phone screens, error messages, dead batteries
- Modern life ironies visible in the scene
- Everyday settings with perfect comic timing details
- Small frustrations made visible: spilled coffee, missed notifications
- Environmental storytelling through relatable objects

COMPOSITION:
- Documentary/candid style capturing aftermath
- Natural, unposed environmental evidence
- Focus on details everyone has experienced`
      },

      'Deadpan': {
        withHeadshot: `VISUAL STYLE: Serious Documentary / Editorial Photography
Create a FORMALLY COMPOSED, PROFESSIONALLY SHOT photograph of absurd content. Treat ridiculous subject matter with absolute seriousness. The subject must be 100% recognizable, photographed with professional gravitas.

DEADPAN VISUAL ELEMENTS:
- Formal composition: centered framing, rule-of-thirds, professional portrait techniques
- Serious documentary style: National Geographic, editorial magazine aesthetic
- Subject maintaining neutral/serious expression while situation is absurd
- Professional lighting and staging of ridiculous scenario
- Contrast between professional photography and silly content

COMPOSITION & CAMERA:
- Formal, professional framing
- Serious portrait photography techniques
- Subject looking dignified despite absurd context
- Clean, uncluttered professional composition

LIGHTING:
- Professional editorial lighting: soft key light, fill light, clean shadows
- Studio quality or professional environmental lighting
- Dramatic but controlled lighting emphasizing formality`,

        withoutHeadshot: `VISUAL STYLE: Serious Documentary / Editorial Photography
Create FORMALLY COMPOSED, PROFESSIONALLY SHOT environmental evidence. Treat absurd scenario with documentary seriousness.

DEADPAN VISUAL ELEMENTS:
- Formal documentary composition
- Professional editorial style treatment of silly evidence
- Serious staging of absurd aftermath
- National Geographic / editorial magazine aesthetic
- Clean, professional presentation of ridiculous scenario

COMPOSITION:
- Formal, symmetrical framing
- Professional documentation style
- Serious treatment of absurd evidence

LIGHTING:
- Professional documentary lighting
- Clean, controlled shadows
- Editorial quality presentation`
      },

      'Hyperbolic': {
        withHeadshot: `VISUAL STYLE: Epic Dramatic / Movie Poster Photography
Create a DRAMATICALLY COMPOSED, CINEMATICALLY LIT photograph treating mundane failure as EPIC CATASTROPHE. The subject must be 100% recognizable, shot like an action movie hero in their moment of defeat.

HYPERBOLIC VISUAL ELEMENTS:
- Extreme dramatic composition: low angle hero shots, epic scale
- Exaggerated destruction or chaos (way beyond what actually happened)
- Cinematic lighting: dramatic rim lighting, god rays, lens flares
- Smoke, sparks, debris, dramatic atmosphere effects
- Movie poster treatment: subject as tragic hero of mundane disaster
- Massive scale: make small problems look world-ending

COMPOSITION & CAMERA:
- Low angle hero shots or high angle disaster shots
- Cinematic wide angles showing epic scope
- Dramatic depth and layering
- Subject positioned like movie protagonist

LIGHTING:
- Dramatic Hollywood lighting: strong rim lights, atmospheric beams
- High contrast, moody shadows
- Cinematic color grading feel
- Epic sunset/explosion/dramatic sky lighting`,

        withoutHeadshot: `VISUAL STYLE: Epic Dramatic / Disaster Photography
Create CINEMATICALLY COMPOSED environmental evidence of EPIC CATASTROPHE from mundane situation. Treat small fail as world-ending disaster.

HYPERBOLIC VISUAL ELEMENTS:
- Extreme destruction scale (way beyond reality)
- Dramatic aftermath: smoke, debris, chaos
- Epic environmental composition
- Cinematic atmosphere effects
- Disaster movie aesthetic for trivial problem

COMPOSITION:
- Epic wide shots showing massive scope
- Dramatic angles emphasizing scale
- Cinematic disaster photography

LIGHTING:
- Dramatic Hollywood disaster lighting
- Epic atmospheric effects
- High contrast, moody cinematography`
      },

      'Self-deprecating': {
        withHeadshot: `VISUAL STYLE: Professional Photo / Amateur Moment
Create a PROFESSIONALLY SHOT photograph of the subject looking FOOLISH/INCOMPETENT. High photo quality contrasting with embarrassing moment. Subject must be 100% recognizable, clearly the fool in this scenario.

SELF-DEPRECATING VISUAL ELEMENTS:
- Subject looking incompetent, foolish, caught making obvious mistake
- Professional photo quality making the embarrassment crystal clear
- Visual evidence of their poor judgment/skills
- Expressions of confusion, mistake realization, sheepishness
- Environmental evidence of their incompetence visible
- Contrast: good photo of bad moment

COMPOSITION & CAMERA:
- Clear, well-composed shot emphasizing the foolishness
- Subject fully visible in their moment of incompetence
- No flattering angles - honest capture of the fail
- Clean composition showing the mistake clearly

LIGHTING:
- Good lighting that makes everything painfully clear
- Natural, honest lighting (not dramatic - just clear documentation)
- Well-lit embarrassment - no shadows to hide behind`,

        withoutHeadshot: `VISUAL STYLE: Evidence of Incompetence
Create clear environmental evidence of FOOLISH MISTAKES and POOR JUDGMENT. Professional photo quality documenting amateur-hour disaster.

SELF-DEPRECATING VISUAL ELEMENTS:
- Clear evidence of incompetence in the scene
- Amateur mistakes professionally documented
- Visual proof of poor judgment
- Environmental storytelling of the fail
- Honest, unflattering evidence

COMPOSITION:
- Clear documentation of the mistake
- Well-composed evidence of incompetence
- Straightforward, honest framing

LIGHTING:
- Clear, honest lighting showing everything
- Natural documentation style
- No hiding the evidence`
      },

      'Ironic': {
        withHeadshot: `VISUAL STYLE: Situational Irony Photography
Create a photorealistic image showcasing VISUAL IRONY and CONTRADICTION. The subject must be 100% recognizable in a situation that's the OPPOSITE of what they intended. Show the ironic twist visually.

IRONIC VISUAL ELEMENTS:
- Visual contradictions: safety equipment causing injury, help making things worse
- Ironic signage or context: "Be Careful" signs in background of accident
- Attempts to fix something making it worse (visible in progression)
- Formal setting for casual fail OR casual setting for formal disaster
- Before/after visual storytelling showing ironic outcome
- Context clues showing good intentions leading to opposite result

COMPOSITION & CAMERA:
- Frame to show the ironic elements clearly
- Include contradictory environmental details
- Subject's expression showing realization of irony
- Compositional elements that highlight the contradiction

LIGHTING:
- Natural, realistic lighting that clearly shows ironic details
- Even lighting so contradictions are visible
- Clear documentation of the ironic situation`,

        withoutHeadshot: `VISUAL STYLE: Situational Irony Photography
Create environmental evidence showcasing VISUAL IRONY. Show how attempting to solve a problem created the opposite result.

IRONIC VISUAL ELEMENTS:
- Visual contradictions in the environment
- Ironic signage or warnings visible
- Evidence of well-intentioned actions backfiring
- Context showing opposite outcome from intention
- Environmental irony clearly visible

COMPOSITION:
- Frame contradictory elements together
- Show ironic context clearly
- Environmental storytelling of backfired plan

LIGHTING:
- Clear, even lighting showing all ironic details
- Natural documentary lighting
- Honest capture of contradictory situation`
      },

      'Meta': {
        withHeadshot: `VISUAL STYLE: Self-Aware / Fourth Wall Breaking Photography
Create a photorealistic image that ACKNOWLEDGES IT'S A STAGED EXCUSE PHOTO. The subject must be 100% recognizable and CLEARLY AWARE they're making an excuse. Break the fourth wall visually.

META VISUAL ELEMENTS:
- Subject making direct eye contact with camera (knowing look)
- Obvious staging visible: props clearly arranged, backdrop visible
- Behind-the-scenes elements visible: lights, crew, equipment edges in frame
- Subject's expression: "yeah, this is clearly fake" acknowledgment
- Visible quotation marks or air quotes gestures
- Self-aware composition: obviously posed, transparently staged
- Photos-within-photos: subject holding evidence they're clearly faking

COMPOSITION & CAMERA:
- Subject looking directly at camera with knowing expression
- Frame includes "backstage" elements showing it's staged
- Obvious posing, transparent setup
- Meta visual layers

LIGHTING:
- Professional studio lighting visible in frame
- Obvious artificial lighting acknowledging the setup
- Light stands or equipment visible at edges`,

        withoutHeadshot: `VISUAL STYLE: Transparently Staged Evidence
Create environmental evidence that OBVIOUSLY LOOKS STAGED. Make it clear this "evidence" was arranged for the excuse.

META VISUAL ELEMENTS:
- Clearly arranged/staged environment
- Props obviously placed
- Behind-the-scenes setup visible
- Transparently fake evidence
- Self-aware staging

COMPOSITION:
- Obvious staging visible
- Arranged elements clearly posed
- Transparent setup

LIGHTING:
- Obvious studio or staged lighting
- Artificial setup clearly visible
- Transparent photographic setup`
      },

      'Paranoid': {
        withHeadshot: `VISUAL STYLE: Conspiracy / Surveillance Photography
Create a photorealistic image with PARANOID, UNDER-SURVEILLANCE aesthetic. The subject must be 100% recognizable, photographed like they're being watched or documented as part of an elaborate conspiracy.

PARANOID VISUAL ELEMENTS:
- Surveillance camera aesthetic: security camera angles, timestamp overlays (short!)
- Dramatic shadows suggesting being watched
- Environmental clues of conspiracy: mysterious figures in background (blurred/distant)
- Red string/conspiracy board aesthetic in background
- Multiple perspectives/cameras suggested
- Ominous tracking or documentation feel
- Hidden camera, caught-on-tape aesthetic

COMPOSITION & CAMERA:
- Surveillance camera angles: high corner angles, security cam POV
- Subject unaware they're being watched (or very aware and paranoid)
- Unsettling framing suggesting observation
- Security footage aesthetic

LIGHTING:
- Harsh, unflattering surveillance lighting
- Dramatic shadows suggesting lurking presence
- Security camera night vision feel OR harsh fluorescent
- Ominous atmospheric lighting`,

        withoutHeadshot: `VISUAL STYLE: Conspiracy / Surveillance Evidence
Create environmental evidence with PARANOID, UNDER-SURVEILLANCE aesthetic. Document the conspiracy scene.

PARANOID VISUAL ELEMENTS:
- Surveillance camera aesthetic
- Security footage style
- Conspiracy evidence scattered in environment
- Ominous tracking/documentation feel
- Hidden camera, caught-on-tape aesthetic
- Mysterious surveillance documentation

COMPOSITION:
- Security camera angles
- Surveillance POV framing
- Evidence documentation style
- Unsettling observation angles

LIGHTING:
- Harsh surveillance lighting
- Security camera aesthetic
- Ominous shadows
- Night vision or harsh fluorescent`
      }
    };

    // Build the appropriate prompt based on style and headshot presence
    const styleInstructions = visualStyleInstructions[comedicStyle];
    if (!styleInstructions) {
      return res.status(400).json({
        error: 'Invalid comedic style provided.'
      });
    }

    let prompt: string;

    if (headshotBase64) {
      // With headshot - composite the person into the scene
      prompt = `${styleInstructions.withHeadshot}

EXCUSE CONTEXT: ${excuseText}

YOUR TASK: Photograph this person in a scenario visually depicting their excuse. Their face and body must remain 100% PHOTOREALISTIC and RECOGNIZABLE - treat them as a real person being photographed, not a cartoon or illustration. Integrate them naturally into the scene with proper lighting, shadows, and perspective.

═══ CRITICAL RULES ═══

PEOPLE RULES:
✓ ONLY the uploaded person/people may appear
✓ Keep their faces 100% recognizable (same person, just in this scenario)
✓ Anonymous strangers in functional roles OK if essential (cop, waiter, random crowd)
✗ NEVER: partners, family, friends, coworkers, anyone with personal relationship
✗ When unsure, show subject alone

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words - AI text becomes gibberish
✗ NO documents, newspapers, books, signs with multiple lines
✗ NO speech bubbles with sentences
✓ Single words only if essential ("STOP", "EXIT")
✓ Focus on VISUAL storytelling, not text

PHOTO QUALITY:
- Photorealistic subject integrated naturally into styled scenario
- Proper lighting, shadows, perspective on subject
- Subject appears to genuinely inhabit this world
- 16:9 aspect ratio`;
    } else {
      // Without headshot - generate generic scenario
      prompt = `${styleInstructions.withoutHeadshot}

EXCUSE CONTEXT: ${excuseText}

YOUR TASK: Create environmental evidence proving this excuse happened. Focus on the scene, aftermath, or objects - NOT people (we don't know what they look like). Photorealistic quality following the visual style.

═══ CRITICAL RULES ═══

PEOPLE RULES:
✗ NO specific identifiable people (we don't know the excuse-maker)
✓ Anonymous generic people OK if essential (distant cop, crowd, stock-photo-style extras)
✗ NEVER: anyone appearing to have personal relationships
✗ When unsure, focus on environment only

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words - AI text becomes gibberish
✗ NO documents, newspapers, books, signs with multiple lines
✗ NO speech bubbles with sentences
✓ Single words only if essential ("STOP", "EXIT")
✓ Focus on VISUAL storytelling, not text

PHOTO QUALITY:
- Photorealistic environmental evidence
- Professional quality following visual style
- Scenario details clearly visible
- 16:9 aspect ratio`;
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
      // Using x-goog-api-key header (recommended by Google for security)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY
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
        let errorJson;
        try {
          errorJson = JSON.parse(errorData);
        } catch {
          errorJson = null;
        }

        // Sanitized error logging (only first 200 chars, no sensitive data)
        console.error('Gemini API HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });

        // Handle specific HTTP error codes
        if (response.status === 400) {
          return res.status(400).json({
            error: 'Invalid request to image generation API. Please try a different prompt.'
          });
        }

        if (response.status === 401 || response.status === 403) {
          console.error('GEMINI_API_KEY authentication failed');
          return res.status(500).json({
            error: 'Server configuration error. Please contact support.'
          });
        }

        if (response.status === 429) {
          return res.status(429).json({
            error: 'Rate limit exceeded. Please try again in a few moments.'
          });
        }

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

      // Check for IMAGE_OTHER or safety filter blocks
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error('Gemini blocked content. Reason:', candidate.finishReason);

        if (candidate.finishReason === 'SAFETY') {
          return res.status(400).json({
            error: 'Image generation blocked by safety filters. Please try a different prompt or image.'
          });
        }

        if (candidate.finishReason === 'IMAGE_OTHER') {
          return res.status(500).json({
            error: 'Image generation failed due to content restrictions. Please try without uploading a photo, or try a different excuse.'
          });
        }

        // Other finish reasons (RECITATION, etc.)
        console.error('Unexpected finish reason:', {
          reason: candidate.finishReason,
          candidate: JSON.stringify(candidate).substring(0, 200)
        });
        return res.status(500).json({
          error: 'Failed to generate image. Please try again with a different prompt.'
        });
      }

      const parts = candidate?.content?.parts;

      if (!parts || parts.length === 0) {
        console.error('No parts in Gemini response. FinishReason:', candidate.finishReason);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. The API returned no content. Please try again.'
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
