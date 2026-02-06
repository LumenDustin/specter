#!/usr/bin/env python3
"""
SPECTER Audio Generation Script
Uses ElevenLabs API to generate voice clips for the Blackwood Recording
"""

import os
import sys
from pathlib import Path

# Check for API key
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY')

if not ELEVENLABS_API_KEY:
    print("=" * 60)
    print("ELEVENLABS_API_KEY not set!")
    print("")
    print("Please run:")
    print("  export ELEVENLABS_API_KEY='your-api-key-here'")
    print("")
    print("Then run this script again.")
    print("=" * 60)
    sys.exit(1)

try:
    from elevenlabs.client import ElevenLabs
    from elevenlabs import VoiceSettings
except ImportError:
    print("Installing elevenlabs package...")
    os.system("pip3 install elevenlabs")
    from elevenlabs.client import ElevenLabs
    from elevenlabs import VoiceSettings

# Initialize client
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Output directory
OUTPUT_DIR = Path(__file__).parent / "audio" / "clips"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def list_available_voices():
    """List all available voices"""
    print("\n" + "=" * 60)
    print("AVAILABLE VOICES")
    print("=" * 60)

    response = client.voices.get_all()
    voices = response.voices

    for voice in voices:
        print(f"\nName: {voice.name}")
        print(f"  ID: {voice.voice_id}")
        print(f"  Category: {voice.category}")
        if voice.labels:
            print(f"  Labels: {voice.labels}")

    return voices

def generate_clip(text: str, voice_id: str, filename: str, stability: float = 0.5, similarity: float = 0.75):
    """Generate a single audio clip"""
    print(f"\nGenerating: {filename}")
    print(f"  Text: {text[:50]}...")

    audio_generator = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id="eleven_multilingual_v2",
        voice_settings=VoiceSettings(
            stability=stability,
            similarity_boost=similarity,
            style=0.0,
            use_speaker_boost=True
        )
    )

    # Save audio - handle generator
    output_path = OUTPUT_DIR / filename
    with open(output_path, 'wb') as f:
        for chunk in audio_generator:
            f.write(chunk)

    print(f"  ✓ Saved: {output_path}")
    return output_path

def main():
    print("=" * 60)
    print("SPECTER Audio Generation")
    print("=" * 60)

    # First, list available voices so user can pick
    voices = list_available_voices()

    print("\n" + "=" * 60)
    print("NEXT STEPS")
    print("=" * 60)
    print("""
Based on the available voices above, we need to select:

1. CHEN (Male, 50s, podcast host) - Look for a mature male voice
2. ELDERLY FEMALE (Whispery, ethereal) - Look for an older female voice
3. YOUNG FEMALE (Clear, eerie) - Look for a younger female voice

The free tier includes some pre-made voices.
You can also clone voices or use the Voice Library.

Would you like me to:
A) Generate test clips with the available voices
B) Show you how to access more voices from the Voice Library
C) Proceed with specific voice IDs you choose

Run this script with voice IDs to generate:
  python generate-audio.py --generate <chen_id> <elderly_id> <young_id>
""")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--generate":
        if len(sys.argv) < 5:
            print("Usage: python generate-audio.py --generate <chen_id> <elderly_id> <young_id>")
            sys.exit(1)

        chen_voice = sys.argv[2]
        elderly_voice = sys.argv[3]
        young_voice = sys.argv[4]

        print("Generating Blackwood Recording clips...")

        # Chen's lines
        chen_lines = [
            ("chen_01_intro.mp3", "Testing, testing. Marcus Chen, solo investigation of Blackwood Sanitarium. Time is 11:47 PM. Alright, let's do this."),
            ("chen_02_entering.mp3", "Entering the main hall now. Place is... wow, completely trashed. Graffiti everywhere. Smells like mold and... something else."),
            ("chen_03_ward.mp3", "Found the old patient ward. Beds still here, rusted to hell. This is where they kept them. Hundreds of people."),
            ("chen_04_hello.mp3", "What the— Hello? Is someone there?"),
            ("chen_05_footsteps.mp3", "Okay, I definitely heard that. There's... there's someone else here."),
            ("chen_06_whothere.mp3", "Who's there? This isn't funny!"),
            ("chen_07_coordinates.mp3", "Did you guys hear that? She just said coordinates. I'm writing this down..."),
            ("chen_08_emf.mp3", "This is insane. The EMF reader is going crazy. Temperature just dropped like twenty degrees. I need to find the source of—"),
            ("chen_09_reaction.mp3", "I didn't say that. I didn't— What is happening to me?!"),
        ]

        for filename, text in chen_lines:
            generate_clip(text, chen_voice, filename, stability=0.6, similarity=0.8)

        # Elderly female voice (whispered)
        generate_clip(
            "Marcus... David... Chen...",
            elderly_voice,
            "elderly_whisper.mp3",
            stability=0.3,  # Lower for more variation
            similarity=0.5
        )

        # Young female voice (coordinates)
        generate_clip(
            "Forty-one point four zero three two north. Two point one seven four three west.",
            young_voice,
            "young_coordinates.mp3",
            stability=0.8,  # Higher for robotic feel
            similarity=0.9
        )

        # Chen's possessed voice (we'll distort this in post)
        generate_clip(
            "They buried us in the garden. Mother is still waiting.",
            chen_voice,
            "chen_possessed.mp3",
            stability=0.3,
            similarity=0.5
        )

        print("\n" + "=" * 60)
        print("GENERATION COMPLETE!")
        print("=" * 60)
        print(f"Clips saved to: {OUTPUT_DIR}")
        print("\nNext: Mix these clips with sound effects in Audacity or similar.")

    else:
        main()
