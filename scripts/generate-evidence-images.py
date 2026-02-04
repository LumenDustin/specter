#!/usr/bin/env python3
"""
SPECTER Evidence Image Generator
Generates AI images for all case evidence using OpenAI's DALL-E API.

Usage:
    1. Set your OpenAI API key: export OPENAI_API_KEY="your-key-here"
    2. Run: python3 scripts/generate-evidence-images.py

Requirements:
    pip install openai requests
"""

import os
import requests
import time
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed.")
    print("Run: pip install openai requests")
    exit(1)

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "evidence"
IMAGE_SIZE = "1024x1024"  # Options: 1024x1024, 1792x1024, 1024x1792
IMAGE_QUALITY = "standard"  # Options: standard, hd
MODEL = "dall-e-3"

# All evidence image prompts organized by case
EVIDENCE_IMAGES = [
    # Case #1: The Hartwell Incident
    {
        "filename": "hartwell-police-report.png",
        "case": "Hartwell",
        "evidence": "Initial Police Report",
        "prompt": "A scanned police incident report from a small town police department, dated 2024. The document shows typed text about 'unexplained disturbances' at a residential address. Official letterhead, case number visible, some coffee stains on the paper. Dark moody lighting, vintage document aesthetic. Photorealistic style."
    },
    {
        "filename": "hartwell-property-records.png",
        "case": "Hartwell",
        "evidence": "Property Records",
        "prompt": "An old property deed document from the 1940s, yellowed paper with official stamps and seals. Shows a hand-drawn property map in the corner. Text mentions previous owners of an old estate. Aged paper texture, some water damage on edges. Photorealistic vintage document."
    },
    {
        "filename": "hartwell-emma-drawing.png",
        "case": "Hartwell",
        "evidence": "Emma's Drawing",
        "prompt": "A child's crayon drawing on white paper, depicting a house with a dark shadowy figure standing near a window. The figure is drawn in black crayon with glowing red eyes. Innocent childlike art style but unsettling subject matter. Simple stick figures of a family nearby. Crumpled paper texture."
    },
    {
        "filename": "hartwell-thermal.png",
        "case": "Hartwell",
        "evidence": "Thermal Imaging",
        "prompt": "A thermal camera image of a house interior showing heat signatures. Most of the room is normal blue/green temperatures, but there's an unexplained cold spot (deep purple/black) in a humanoid shape near a doorway. Technical readout data visible on the edges. Scientific paranormal investigation style."
    },
    {
        "filename": "hartwell-missing-person.png",
        "case": "Hartwell",
        "evidence": "Missing Person Report",
        "prompt": "A weathered missing person flyer from 2013, showing a faded photo of a middle-aged man. 'MISSING' in bold red letters at top. Details include height, weight, last seen location. The paper is torn and faded, found posted on a telephone pole. Eerie, unsettling atmosphere."
    },

    # Case #2: The Blackwood Recording
    {
        "filename": "blackwood-waveform.png",
        "case": "Blackwood",
        "evidence": "Audio Waveform",
        "prompt": "A dark computer screen displaying an audio waveform visualization. The waveform shows normal speech patterns with one section highlighted in red showing an anomalous spike - an unexplained voice. Timestamp visible. Professional audio editing software interface. Dark moody tech aesthetic."
    },
    {
        "filename": "blackwood-sanitarium.png",
        "case": "Blackwood",
        "evidence": "Sanitarium Photo",
        "prompt": "A black and white photograph from the 1920s showing an abandoned Victorian-era sanitarium building. Gothic architecture, broken windows, overgrown with vines. Fog surrounds the building. The photo has damaged edges and age spots. Creepy, atmospheric, historical photography style."
    },
    {
        "filename": "blackwood-chen-id.png",
        "case": "Blackwood",
        "evidence": "Chen Background",
        "prompt": "A government security clearance document with an ID badge photo of a professional man in his 30s wearing a collared shirt. The document has 'CLASSIFIED' partially visible and official stamps. Government document aesthetic, slightly grainy photo quality. No specific ethnicity shown."
    },
    {
        "filename": "blackwood-coordinates-map.png",
        "case": "Blackwood",
        "evidence": "Coordinates Map",
        "prompt": "A topographic map with several locations marked with red pins connected by lines. Handwritten notes in the margins. One location is circled multiple times with question marks written next to it. Coffee-stained, well-used research map aesthetic. Military/investigation style."
    },
    {
        "filename": "blackwood-cia-memo.png",
        "case": "Blackwood",
        "evidence": "CIA Memo",
        "prompt": "A partially redacted government document with official agency letterhead. Many lines blacked out with marker. Visible text mentions a classified project and 'acoustic phenomena'. Official stamps, classification markings. Conspiracy document aesthetic."
    },
    {
        "filename": "blackwood-hypnotherapy-notes.png",
        "case": "Blackwood",
        "evidence": "Hypnotherapy Notes",
        "prompt": "Handwritten notes on a yellow legal pad from a psychiatrist. Messy doctor's handwriting describing a patient's hypnosis session. Phrases like 'subject recalls bright light' and 'missing time' visible. Some diagrams of brain waves. Clinical but unsettling notes aesthetic."
    },

    # Case #3: The Millbrook Disappearances
    {
        "filename": "millbrook-timeline.png",
        "case": "Millbrook",
        "evidence": "Victim Timeline",
        "prompt": "A detective's evidence board showing a timeline spanning decades. Photos connected by red string, dates marked, pattern emerging at regular intervals. Polaroid-style photos pinned to corkboard. Dark investigation room lighting. True crime investigation aesthetic."
    },
    {
        "filename": "millbrook-newspaper-1923.png",
        "case": "Millbrook",
        "evidence": "1923 Newspaper",
        "prompt": "A vintage newspaper clipping from 1923 with a headline about people vanishing without trace in a small town. Black and white photo of a forest area. Yellowed, brittle paper with torn edges. Old-fashioned newspaper typography. Historical document aesthetic."
    },
    {
        "filename": "millbrook-carver-notes.png",
        "case": "Millbrook",
        "evidence": "Carver's Notes",
        "prompt": "Pages from a researcher's notebook filled with obsessive notes and diagrams. Drawings of geometric symbols, maps with lines, calculations. 'THE PATTERN REPEATS' written and circled multiple times. Coffee stains, frantic handwriting. Paranoid investigator aesthetic."
    },
    {
        "filename": "millbrook-ward-journal.png",
        "case": "Millbrook",
        "evidence": "Ward's Journal",
        "prompt": "An open antique leather journal from the 1920s with handwritten entries in elegant cursive. The visible page describes strange occurrences in the woods. Pressed flowers between pages, ribbon bookmark. Aged paper, ink slightly faded. Gothic Victorian diary aesthetic."
    },
    {
        "filename": "millbrook-1973-case-file.png",
        "case": "Millbrook",
        "evidence": "1973 Case File",
        "prompt": "A typed police report from 1973 on an old typewriter. Carbon copy paper, official police department header. Reports of unusual disappearances and no evidence of foul play despite extensive search. Yellowed paper, official stamps. 1970s law enforcement document aesthetic."
    },
    {
        "filename": "millbrook-threshold-charter.png",
        "case": "Millbrook",
        "evidence": "Threshold Charter",
        "prompt": "An aged parchment document from the 1800s with ornate calligraphy. Gothic border decorations, strange symbols in the corners. Text establishes a secret society with a mission to guard boundaries. Wax seal at bottom. Ancient secret society document aesthetic."
    },
]


def generate_image(client: OpenAI, prompt: str, filename: str) -> bool:
    """Generate a single image using DALL-E and save it."""
    try:
        print(f"  Generating: {filename}")

        response = client.images.generate(
            model=MODEL,
            prompt=prompt,
            size=IMAGE_SIZE,
            quality=IMAGE_QUALITY,
            n=1,
        )

        image_url = response.data[0].url

        # Download the image
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            output_path = OUTPUT_DIR / filename
            with open(output_path, 'wb') as f:
                f.write(image_response.content)
            print(f"  ✓ Saved: {filename}")
            return True
        else:
            print(f"  ✗ Failed to download: {filename}")
            return False

    except Exception as e:
        print(f"  ✗ Error generating {filename}: {str(e)}")
        return False


def main():
    # Check for API key
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("=" * 60)
        print("ERROR: OPENAI_API_KEY environment variable not set")
        print("=" * 60)
        print("\nTo set your API key, run:")
        print('  export OPENAI_API_KEY="your-api-key-here"')
        print("\nGet your API key from: https://platform.openai.com/api-keys")
        print()
        exit(1)

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)

    print("=" * 60)
    print("SPECTER Evidence Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total images to generate: {len(EVIDENCE_IMAGES)}")
    print(f"Model: {MODEL}")
    print(f"Size: {IMAGE_SIZE}")
    print(f"Quality: {IMAGE_QUALITY}")
    print()

    # Check which images already exist
    existing = [img for img in EVIDENCE_IMAGES if (OUTPUT_DIR / img["filename"]).exists()]
    to_generate = [img for img in EVIDENCE_IMAGES if not (OUTPUT_DIR / img["filename"]).exists()]

    if existing:
        print(f"Skipping {len(existing)} existing images")

    if not to_generate:
        print("\nAll images already exist! Nothing to generate.")
        print("Delete images from public/evidence/ to regenerate them.")
        return

    print(f"Generating {len(to_generate)} new images...\n")

    # Estimate cost
    # DALL-E 3 pricing: $0.040 per image (standard), $0.080 per image (HD)
    cost_per_image = 0.080 if IMAGE_QUALITY == "hd" else 0.040
    estimated_cost = len(to_generate) * cost_per_image
    print(f"Estimated cost: ${estimated_cost:.2f}")
    print()

    # Confirm before proceeding
    response = input("Proceed with image generation? (y/n): ").strip().lower()
    if response != 'y':
        print("Aborted.")
        return

    print()

    # Generate images
    success_count = 0
    fail_count = 0
    current_case = None

    for i, img in enumerate(to_generate, 1):
        # Print case header
        if img["case"] != current_case:
            current_case = img["case"]
            print(f"\n[Case: {current_case}]")

        print(f"({i}/{len(to_generate)}) {img['evidence']}")

        if generate_image(client, img["prompt"], img["filename"]):
            success_count += 1
        else:
            fail_count += 1

        # Rate limiting - wait between requests
        if i < len(to_generate):
            time.sleep(2)

    # Summary
    print("\n" + "=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Output: {OUTPUT_DIR}")

    if success_count > 0:
        print("\nNext steps:")
        print("1. Review the generated images in public/evidence/")
        print("2. Run the database update script to link images to evidence")
        print("3. Deploy to Vercel: vercel --prod")


if __name__ == "__main__":
    main()
