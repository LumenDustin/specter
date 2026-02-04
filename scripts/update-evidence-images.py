#!/usr/bin/env python3
"""
SPECTER Evidence Image Database Updater
Updates the Supabase database with image URLs for evidence items.

Usage:
    python3 scripts/update-evidence-images.py

This script maps the generated images to their corresponding evidence records
and updates the image_url field in the database.
"""

import os
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: supabase package not installed.")
    print("Run: pip install supabase")
    exit(1)

# Configuration
EVIDENCE_DIR = Path(__file__).parent.parent / "public" / "evidence"
BASE_URL = "/evidence"  # Relative URL for Next.js public folder

# Mapping of evidence titles to image filenames
EVIDENCE_IMAGE_MAP = {
    # Case #1: The Hartwell Incident
    "Initial Police Report": "hartwell-police-report.png",
    "Property Records": "hartwell-property-records.png",
    "Interview: Emma Hartwell (Age 7)": "hartwell-emma-drawing.png",
    "Thermal Imaging Analysis": "hartwell-thermal.png",
    "Missing Person Report (2013)": "hartwell-missing-person.png",

    # Case #2: The Blackwood Recording
    "Audio Recording - Full Transcript": "blackwood-waveform.png",
    "Blackwood Sanitarium - Historical Records": "blackwood-sanitarium.png",
    "Marcus Chen - Background Check": "blackwood-chen-id.png",
    "Coordinates Analysis": "blackwood-coordinates-map.png",
    "Declassified CIA Memo (Partial)": "blackwood-cia-memo.png",
    "Chen Hypnotherapy Session Notes": "blackwood-hypnotherapy-notes.png",

    # Case #3: The Millbrook Disappearances
    "Victim List & Timeline": "millbrook-timeline.png",
    "1923 Newspaper Archive": "millbrook-newspaper-1923.png",
    "Richard Carver's Research Notes": "millbrook-carver-notes.png",
    "Elizabeth Ward's Journal": "millbrook-ward-journal.png",
    "Chief Thorn's 1973 Case File": "millbrook-1973-case-file.png",
    "Threshold Society Charter (1823)": "millbrook-threshold-charter.png",
}


def main():
    # Load environment variables from .env.local
    env_file = Path(__file__).parent.parent / ".env.local"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

    # Get Supabase credentials
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Error: Supabase credentials not found.")
        print("Make sure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        exit(1)

    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)

    print("=" * 60)
    print("SPECTER Evidence Image Database Updater")
    print("=" * 60)
    print(f"Evidence directory: {EVIDENCE_DIR}")
    print()

    # Check which images exist
    existing_images = set()
    if EVIDENCE_DIR.exists():
        existing_images = {f.name for f in EVIDENCE_DIR.glob("*.png")}

    print(f"Found {len(existing_images)} images in evidence folder")
    print()

    # Fetch all evidence from database
    response = supabase.table("evidence").select("id, title, image_url").execute()
    evidence_records = response.data

    print(f"Found {len(evidence_records)} evidence records in database")
    print()

    # Update records
    updated = 0
    skipped = 0
    missing = 0

    for record in evidence_records:
        title = record["title"]
        current_url = record["image_url"]

        if title not in EVIDENCE_IMAGE_MAP:
            print(f"⚠ No image mapping for: {title}")
            continue

        filename = EVIDENCE_IMAGE_MAP[title]
        new_url = f"{BASE_URL}/{filename}"

        # Check if image file exists
        if filename not in existing_images:
            print(f"✗ Image not found: {filename} (for: {title})")
            missing += 1
            continue

        # Check if already has correct URL
        if current_url == new_url:
            skipped += 1
            continue

        # Update the record
        try:
            supabase.table("evidence").update({"image_url": new_url}).eq("id", record["id"]).execute()
            print(f"✓ Updated: {title}")
            print(f"  → {new_url}")
            updated += 1
        except Exception as e:
            print(f"✗ Failed to update {title}: {e}")

    # Summary
    print()
    print("=" * 60)
    print("UPDATE COMPLETE")
    print("=" * 60)
    print(f"Updated: {updated}")
    print(f"Skipped (already set): {skipped}")
    print(f"Missing images: {missing}")

    if updated > 0:
        print("\nNext steps:")
        print("1. Commit and push changes to GitHub")
        print("2. Redeploy to Vercel: vercel --prod")
        print("3. Test the evidence display on the live site")


if __name__ == "__main__":
    main()
