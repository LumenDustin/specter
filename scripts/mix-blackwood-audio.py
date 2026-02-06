#!/usr/bin/env python3
"""
Mix the Blackwood Recording from individual clips
Creates a complete 2-3 minute audio file with effects
"""

from pydub import AudioSegment
from pydub.generators import WhiteNoise
from pathlib import Path
import random

CLIPS_DIR = Path(__file__).parent / "audio" / "clips"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def add_reverb_effect(audio, delay_ms=50, decay=0.3):
    """Simple reverb simulation by layering delayed copies"""
    result = audio
    for i in range(3):
        delayed = AudioSegment.silent(duration=delay_ms * (i + 1)) + audio
        delayed = delayed - (10 * (i + 1))  # Reduce volume for each echo
        # Trim to match length
        if len(delayed) > len(result):
            delayed = delayed[:len(result)]
        else:
            delayed = delayed + AudioSegment.silent(duration=len(result) - len(delayed))
        result = result.overlay(delayed)
    return result

def create_static_burst(duration_ms=500, volume=-20):
    """Create static/interference sound"""
    noise = WhiteNoise().to_audio_segment(duration=duration_ms)
    noise = noise + volume  # Reduce volume
    # Add some variation
    noise = noise.fade_in(50).fade_out(50)
    return noise

def create_ambient_hum(duration_ms=1000, volume=-35):
    """Create low ambient hum"""
    # Use low frequency noise
    noise = WhiteNoise().to_audio_segment(duration=duration_ms)
    noise = noise.low_pass_filter(200)  # Keep only low frequencies
    noise = noise + volume
    return noise

def load_clip(name):
    """Load an audio clip"""
    path = CLIPS_DIR / name
    if path.exists():
        return AudioSegment.from_mp3(path)
    else:
        print(f"Warning: {name} not found")
        return AudioSegment.silent(duration=1000)

def main():
    print("=" * 60)
    print("MIXING THE BLACKWOOD RECORDING")
    print("=" * 60)

    # Load all clips
    print("\nLoading clips...")
    chen_01 = load_clip("chen_01_intro.mp3")
    chen_02 = load_clip("chen_02_entering.mp3")
    chen_03 = load_clip("chen_03_ward.mp3")
    chen_04 = load_clip("chen_04_hello.mp3")
    chen_05 = load_clip("chen_05_footsteps.mp3")
    chen_06 = load_clip("chen_06_whothere.mp3")
    chen_07 = load_clip("chen_07_coordinates.mp3")
    chen_08 = load_clip("chen_08_emf.mp3")
    chen_09 = load_clip("chen_09_reaction.mp3")
    chen_possessed = load_clip("chen_possessed.mp3")
    elderly_whisper = load_clip("elderly_whisper.mp3")
    young_coords = load_clip("young_coordinates.mp3")

    print("Creating effects...")

    # Create base ambient track (low hum throughout)
    total_duration = 150000  # ~2.5 minutes in ms
    ambient = create_ambient_hum(total_duration, volume=-40)

    # Build the final mix
    print("Building mix...")

    # Start with silence, then add clips at specific times
    final = AudioSegment.silent(duration=total_duration)

    # Timeline (in milliseconds):
    # 0:00 - Intro
    pos = 0
    final = final.overlay(chen_01, position=pos)
    pos += len(chen_01) + 1500  # 1.5s pause

    # 0:15 - Entering
    final = final.overlay(chen_02, position=pos)
    pos += len(chen_02) + 2000

    # 0:30 - Ward
    final = final.overlay(chen_03, position=pos)
    pos += len(chen_03) + 1000

    # Static burst before whisper
    static1 = create_static_burst(300, volume=-15)
    final = final.overlay(static1, position=pos)
    pos += 500

    # 0:45 - Elderly whisper (with extra reverb, quieter)
    whisper_processed = elderly_whisper - 3  # Slightly quieter
    whisper_processed = add_reverb_effect(whisper_processed, delay_ms=80, decay=0.4)
    final = final.overlay(whisper_processed, position=pos)
    pos += len(elderly_whisper) + 300

    # Chen's reaction
    final = final.overlay(chen_04, position=pos)
    pos += len(chen_04) + 2500

    # 1:00 - Footsteps section (just Chen's reaction, no actual footstep sounds yet)
    final = final.overlay(chen_05, position=pos)
    pos += len(chen_05) + 1500

    final = final.overlay(chen_06, position=pos)
    pos += len(chen_06) + 2000

    # 1:20 - Static building
    static2 = create_static_burst(800, volume=-12)
    final = final.overlay(static2, position=pos)
    pos += 1000

    # 1:30 - Young female coordinates (eerie, clear)
    coords_processed = young_coords
    coords_processed = add_reverb_effect(coords_processed, delay_ms=60, decay=0.3)
    final = final.overlay(coords_processed, position=pos)
    pos += len(young_coords) + 500

    # Chen's reaction to coordinates
    final = final.overlay(chen_07, position=pos)
    pos += len(chen_07) + 2000

    # 1:50 - EMF going crazy
    final = final.overlay(chen_08, position=pos)
    pos += len(chen_08) + 500

    # Heavy static/distortion
    static3 = create_static_burst(1500, volume=-8)
    final = final.overlay(static3, position=pos)
    pos += 800

    # 2:05 - Possessed voice (distorted)
    possessed_processed = chen_possessed
    # Add distortion effect by overlaying slightly pitch-shifted versions
    possessed_processed = possessed_processed - 2
    possessed_processed = add_reverb_effect(possessed_processed, delay_ms=100, decay=0.5)
    final = final.overlay(possessed_processed, position=pos)
    pos += len(chen_possessed) + 200

    # Chen's terrified reaction
    final = final.overlay(chen_09, position=pos)
    pos += len(chen_09) + 500

    # 2:15 - Final intense static then cut
    static_final = create_static_burst(2000, volume=-5)
    static_final = static_final.fade_out(500)
    final = final.overlay(static_final, position=pos)
    pos += 2500

    # Trim to actual length
    final = final[:pos]

    # Add ambient hum throughout (very subtle)
    ambient = ambient[:len(final)]
    final = final.overlay(ambient)

    # Normalize and add slight tape warmth (bass boost, slight compression)
    final = final.normalize()

    # Export
    output_path = OUTPUT_DIR / "blackwood-recording.mp3"
    print(f"\nExporting to: {output_path}")
    final.export(output_path, format="mp3", bitrate="192k")

    print(f"\n✓ Complete! Duration: {len(final) / 1000:.1f} seconds")
    print(f"  File: {output_path}")

    # Also save to clips folder for reference
    clips_output = CLIPS_DIR / "blackwood-recording-mixed.mp3"
    final.export(clips_output, format="mp3", bitrate="192k")
    print(f"  Backup: {clips_output}")

if __name__ == "__main__":
    main()
