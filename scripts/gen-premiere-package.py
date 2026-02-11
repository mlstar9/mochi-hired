#!/usr/bin/env python3
"""Generate a complete Premiere Pro package: XML + placeholders + SRT, all linked."""

import xml.etree.ElementTree as ET
from xml.dom import minidom
import subprocess
import os
import shutil

FPS = 24
TIMEBASE = 24
import sys

# ── V1 FULL (76s) ──────────────────────────────────────────────────────────
SECTIONS_V1 = [
    {"id": "01-intro", "label": "INTRO — Leti to camera", "dur": 8, "subs": [
        (0, 2.5, "You're not gonna believe this but —"),
        (2.5, 2.5, "our company used our own product, AI Selves,"),
        (5, 1.5, "to push the actual product."),
        (7, 1, "Let me explain."),
    ]},
    {"id": "02-anthony-intro", "label": "ANTHONY — Real photo + title", "dur": 4, "subs": [
        (0, 3, "This is Anthony, our head of partnerships."),
        (3, 1, "And this is Theo."),
    ]},
    {"id": "03-theo-reveal", "label": "THEO — Avatar reveal + ding SFX", "dur": 7, "subs": [
        (0, 1.5, "(his AI Self)"),
        (1.5, 2.5, "Theo monitors our brand mentions in real time —"),
        (4, 2, "and helped Anthony evaluate partnership opportunities"),
        (6, 1, "around the clock for the launch."),
    ]},
    {"id": "04-starry-intro", "label": "STARRY — Real photo + title", "dur": 3, "subs": [
        (0, 2, "Starry, our product manager —"),
        (2, 1, "uses Momo."),
    ]},
    {"id": "05-momo-reveal", "label": "MOMO — Avatar reveal + ding SFX", "dur": 6, "subs": [
        (0, 1, "(her AI Self)"),
        (1, 0.8, "CUTE."),
        (1.8, 2.2, "Momo handles Linear tasks across all departments —"),
        (4, 2, "and even goes on Zoom calls when Starry doesn't feel like it!"),
    ]},
    {"id": "06-rus-intro", "label": "RUS — Real photo + title", "dur": 3, "subs": [
        (0, 2, "Rus, our head of design —"),
        (2, 1, "uses Russ."),
    ]},
    {"id": "07-russ-reveal", "label": "RUSS — Avatar reveal + ding SFX", "dur": 4, "subs": [
        (0, 1, "(his AI Self)"),
        (1, 1.5, "Russ goes over design issues"),
        (2.5, 1.5, "and communicates them to the design team."),
    ]},
    {"id": "08-matan-intro", "label": "MATAN — Real photo + title", "dur": 3, "subs": [
        (0, 2.5, "And this is Matan, our Creative Director."),
    ]},
    {"id": "09-raccoon-reveal", "label": "RACCOON 2.0 — Avatar reveal + ding SFX", "dur": 5, "subs": [
        (0, 1.5, "His Raccoon 2.0 — (his AI Self)"),
        (1.5, 1.5, "helps Matan bridge the gap between"),
        (3, 2, "our researchers and our Creative team."),
    ]},
    {"id": "10-demi-intro", "label": "DEMI — Real photo + title", "dur": 3, "subs": [
        (0, 3, "Oh, and all of them report up to our CEO, Demi Guo."),
    ]},
    {"id": "11-semi-reveal", "label": "SEMI — Avatar reveal + ding SFX", "dur": 6, "subs": [
        (0, 1.5, "Well… not exactly."),
        (1.5, 1.5, "They report to Semi — (her AI Self)"),
        (3, 1.5, "and Semi reports back to her."),
        (4.5, 1.5, "Because Demi is waaaay too busy."),
    ]},
    {"id": "12-leti-intro", "label": "LETI — To camera (THE ENDING)", "dur": 4, "subs": [
        (0, 3, "And me? I'm Leti, and I usually make videos, buuuut—"),
        (3, 0.5, "[MEOW]"),
    ]},
    {"id": "13-mochi-reveal", "label": "MOCHI — Hard cut, smashing keyboard", "dur": 4, "subs": [
        (0, 1.5, "(my AI Self)"),
    ]},
    {"id": "14-leti-interrupted", "label": "LETI — Offscreen annoyed", "dur": 3, "subs": [
        (0, 2.5, "Mochi— ffs, I'm in the middle of introducing yo—"),
    ]},
    {"id": "15-mochi-glitch", "label": "MOCHI — Glitch cut, looking annoyed", "dur": 2, "subs": []},
    {"id": "16-leti-comeback", "label": "LETI — Tries to recover", "dur": 2, "subs": [
        (0, 1.5, "Anyways, I'm—"),
    ]},
    {"id": "17-mochi-glitch-2", "label": "MOCHI — Glitch, looking at camera", "dur": 5, "subs": [
        (0, 2, "What?? What do you need from me—"),
        (2, 1.5, "oh. Oh! You're done editing the video?"),
        (3.5, 1.5, "Ok ok lemme check it out."),
    ]},
    {"id": "18-loop-zoom", "label": "ZOOM INTO SCREEN → LOOP", "dur": 4, "subs": [
        (2, 2, '"You\'re not gonna believe this but—"'),
    ]},
]

# ── V2 TIGHT (40s) ─────────────────────────────────────────────────────────
SECTIONS_V2 = [
    {"id": "01-hook", "label": "HOOK — Text card or to camera", "dur": 4, "subs": [
        (0, 2.5, "You're not gonna believe this but —"),
        (2.5, 1.5, "our company used our own product, AI Selves, to push the actual product."),
    ]},
    {"id": "02-explain", "label": "LET ME EXPLAIN — Beat", "dur": 1, "subs": [
        (0, 1, "Let me explain."),
    ]},
    {"id": "03-anthony", "label": "ANTHONY — Photo + title", "dur": 2, "subs": [
        (0, 1.5, "This is Anthony, our head of partnerships."),
        (1.5, 0.5, "And this is Theo."),
    ]},
    {"id": "04-theo", "label": "THEO — Avatar + ding + (his AI Self)", "dur": 2, "subs": [
        (0, 0.5, "(his AI Self)"),
        (0.5, 1.5, "Theo monitors brand mentions in real time"),
    ]},
    {"id": "05-theo-work", "label": "THEO WORK — Scanning UI + Slack", "dur": 4, "subs": [
        (0, 2, "and helped Anthony evaluate partnerships around the clock"),
        (2, 2, "for the launch."),
    ]},
    {"id": "06-montage-starry", "label": "RAPID — Starry → Momo + ding", "dur": 1.3, "subs": [
        (0, 0.6, "Starry — Momo"),
        (0.6, 0.7, "(her AI Self)"),
    ]},
    {"id": "07-montage-rus", "label": "RAPID — Rus → Russ + ding", "dur": 1.3, "subs": [
        (0, 0.6, "Rus — Russ"),
        (0.6, 0.7, "(his AI Self)"),
    ]},
    {"id": "08-montage-matan", "label": "RAPID — Matan → Raccoon 2.0 + ding", "dur": 1.4, "subs": [
        (0, 0.6, "Matan — Raccoon 2.0"),
        (0.6, 0.8, "(his AI Self)"),
    ]},
    {"id": "09-demi", "label": "DEMI — Photo + CEO title", "dur": 2, "subs": [
        (0, 2, "Oh, and all of them report up to our CEO, Demi Guo."),
    ]},
    {"id": "10-not-exactly", "label": "BEAT — Well not exactly", "dur": 1.5, "subs": [
        (0, 1.5, "Well… not exactly."),
    ]},
    {"id": "11-semi", "label": "SEMI — Avatar + ding + (her AI Self)", "dur": 1.5, "subs": [
        (0, 1, "They report to Semi —"),
        (0, 1, "(her AI Self)"),
    ]},
    {"id": "12-demi-busy", "label": "DEMI BUSY — Calendar + punchline", "dur": 2, "subs": [
        (0, 1, "and Semi reports back to her."),
        (1, 1, "Because Demi is waaaay too busy."),
    ]},
    {"id": "13-leti-intro", "label": "LETI — To camera normal intro", "dur": 3, "subs": [
        (0, 2.5, "And me? I'm Leti, and I usually make videos, buuuut—"),
        (2.5, 0.5, "[MEOW]"),
    ]},
    {"id": "14-mochi-reveal", "label": "MOCHI — Hard cut smashing keyboard", "dur": 3, "subs": [
        (0, 1.5, "(my AI Self)"),
    ]},
    {"id": "15-leti-annoyed", "label": "LETI OFFSCREEN — ffs introducing yo—", "dur": 2, "subs": [
        (0, 2, "Mochi— ffs, I'm in the middle of introducing yo—"),
    ]},
    {"id": "16-mochi-glitch", "label": "GLITCH — Mochi stares annoyed", "dur": 1, "subs": []},
    {"id": "17-leti-comeback", "label": "LETI — Anyways I'm—", "dur": 1.5, "subs": [
        (0, 1, "Anyways, I'm—"),
    ]},
    {"id": "18-mochi-done", "label": "MOCHI — oh you're done editing?", "dur": 3.5, "subs": [
        (0, 1.5, "What?? What do you need from me—"),
        (1.5, 1, "oh. Oh! You're done editing the video?"),
        (2.5, 1, "Ok ok lemme check it out."),
    ]},
    {"id": "19-loop-zoom", "label": "ZOOM INTO SCREEN → LOOP", "dur": 2, "subs": [
        (1, 1, '"You\'re not gonna believe this but—"'),
    ]},
]

# Select version from command line: python3 gen-premiere-package.py [v1|v2]
version = sys.argv[1] if len(sys.argv) > 1 else "v2"
if version == "v1":
    OUTPUT_DIR = "premiere/ai-selves-leti-v1"
    SECTIONS = SECTIONS_V1
else:
    OUTPUT_DIR = "premiere/ai-selves-leti-v2"
    SECTIONS = SECTIONS_V2

def sec_to_frames(s):
    return int(round(s * FPS))

def generate_placeholders(out_dir):
    """Generate black placeholder MP4s with section labels."""
    ph_dir = os.path.join(out_dir, "placeholders")
    os.makedirs(ph_dir, exist_ok=True)
    
    for s in SECTIONS:
        label = s["id"].split("-", 1)[1].replace("-", " ").upper()
        outfile = os.path.join(ph_dir, f"{s['id']}.mp4")
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", f"color=c=0x111111:s=1920x1080:d={s['dur']}:r=24",
            "-vf", f"drawtext=text='{label}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:font=monospace",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "ultrafast",
            outfile
        ], capture_output=True)
        print(f"  ✓ {s['id']}.mp4 ({s['dur']}s)")
    
    return ph_dir

def generate_srt(out_dir):
    """Generate SRT subtitle file."""
    srt_path = os.path.join(out_dir, "ai-selves-leti.srt")
    timeline_offset = 0
    sub_idx = 1
    lines = []
    
    for s in SECTIONS:
        for start_sec, dur_sec, text in s["subs"]:
            abs_start = timeline_offset + start_sec
            abs_end = abs_start + dur_sec
            
            sh = int(abs_start // 3600)
            sm = int((abs_start % 3600) // 60)
            ss = int(abs_start % 60)
            sms = int((abs_start % 1) * 1000)
            
            eh = int(abs_end // 3600)
            em = int((abs_end % 3600) // 60)
            es = int(abs_end % 60)
            ems = int((abs_end % 1) * 1000)
            
            lines.append(str(sub_idx))
            lines.append(f"{sh:02d}:{sm:02d}:{ss:02d},{sms:03d} --> {eh:02d}:{em:02d}:{es:02d},{ems:03d}")
            lines.append(text)
            lines.append("")
            sub_idx += 1
        
        timeline_offset += s["dur"]
    
    with open(srt_path, "w") as f:
        f.write("\n".join(lines))
    print(f"  ✓ ai-selves-leti.srt ({sub_idx - 1} subtitles)")

def generate_xml(out_dir):
    """Generate FCP XML with file references pointing to placeholders/."""
    root = ET.Element("xmeml", version="5")
    project = ET.SubElement(root, "project")
    ET.SubElement(project, "name").text = "AI Selves Leti v2"
    
    children = ET.SubElement(project, "children")
    sequence = ET.SubElement(children, "sequence")
    ET.SubElement(sequence, "name").text = "AI Selves Leti — 40s Cut"
    ET.SubElement(sequence, "duration").text = str(sum(sec_to_frames(s["dur"]) for s in SECTIONS))
    
    rate = ET.SubElement(sequence, "rate")
    ET.SubElement(rate, "timebase").text = str(TIMEBASE)
    ET.SubElement(rate, "ntsc").text = "FALSE"
    
    media = ET.SubElement(sequence, "media")
    video = ET.SubElement(media, "video")
    
    # V1 — placeholder clips
    vtrack1 = ET.SubElement(video, "track")
    timeline_pos = 0
    
    for i, s in enumerate(SECTIONS):
        dur_frames = sec_to_frames(s["dur"])
        clip_id = f"clip-{i+1}"
        file_id = f"file-{i+1}"
        
        clipitem = ET.SubElement(vtrack1, "clipitem", id=clip_id)
        ET.SubElement(clipitem, "name").text = s["label"]
        ET.SubElement(clipitem, "duration").text = str(dur_frames)
        
        ci_rate = ET.SubElement(clipitem, "rate")
        ET.SubElement(ci_rate, "timebase").text = str(TIMEBASE)
        ET.SubElement(ci_rate, "ntsc").text = "FALSE"
        
        ET.SubElement(clipitem, "start").text = str(timeline_pos)
        ET.SubElement(clipitem, "end").text = str(timeline_pos + dur_frames)
        ET.SubElement(clipitem, "in").text = "0"
        ET.SubElement(clipitem, "out").text = str(dur_frames)
        
        # File reference — points to placeholder MP4
        file_elem = ET.SubElement(clipitem, "file", id=file_id)
        ET.SubElement(file_elem, "name").text = f"{s['id']}.mp4"
        ET.SubElement(file_elem, "duration").text = str(dur_frames)
        
        f_rate = ET.SubElement(file_elem, "rate")
        ET.SubElement(f_rate, "timebase").text = str(TIMEBASE)
        ET.SubElement(f_rate, "ntsc").text = "FALSE"
        
        # pathurl — relative path to placeholder
        ET.SubElement(file_elem, "pathurl").text = f"placeholders/{s['id']}.mp4"
        
        f_media = ET.SubElement(file_elem, "media")
        f_video = ET.SubElement(f_media, "video")
        f_vc = ET.SubElement(f_video, "samplecharacteristics")
        ET.SubElement(f_vc, "width").text = "1920"
        ET.SubElement(f_vc, "height").text = "1080"
        
        # Marker with section info
        marker = ET.SubElement(clipitem, "marker")
        ET.SubElement(marker, "name").text = s["id"]
        ET.SubElement(marker, "comment").text = s["label"]
        ET.SubElement(marker, "in").text = "0"
        ET.SubElement(marker, "out").text = "-1"
        
        timeline_pos += dur_frames
    
    # V2 — subtitle text generators
    vtrack2 = ET.SubElement(video, "track")
    ET.SubElement(vtrack2, "enabled").text = "TRUE"
    ET.SubElement(vtrack2, "locked").text = "FALSE"
    
    timeline_pos = 0
    sub_id = 1
    
    for s in SECTIONS:
        section_start = timeline_pos
        
        for start_sec, dur_sec, text in s["subs"]:
            sub_start = section_start + sec_to_frames(start_sec)
            sub_dur = sec_to_frames(dur_sec)
            
            gen = ET.SubElement(vtrack2, "generatoritem", id=f"sub-{sub_id}")
            ET.SubElement(gen, "name").text = text[:50]
            ET.SubElement(gen, "duration").text = str(sub_dur)
            
            g_rate = ET.SubElement(gen, "rate")
            ET.SubElement(g_rate, "timebase").text = str(TIMEBASE)
            ET.SubElement(g_rate, "ntsc").text = "FALSE"
            
            ET.SubElement(gen, "start").text = str(sub_start)
            ET.SubElement(gen, "end").text = str(sub_start + sub_dur)
            ET.SubElement(gen, "in").text = "0"
            ET.SubElement(gen, "out").text = str(sub_dur)
            
            effect = ET.SubElement(gen, "effect")
            ET.SubElement(effect, "name").text = "Text"
            ET.SubElement(effect, "effectid").text = "Text"
            ET.SubElement(effect, "effectcategory").text = "Text"
            ET.SubElement(effect, "effecttype").text = "generator"
            ET.SubElement(effect, "mediatype").text = "video"
            
            param = ET.SubElement(effect, "parameter")
            ET.SubElement(param, "parameterid").text = "str"
            ET.SubElement(param, "name").text = "Text"
            ET.SubElement(param, "value").text = text
            
            param2 = ET.SubElement(effect, "parameter")
            ET.SubElement(param2, "parameterid").text = "font"
            ET.SubElement(param2, "name").text = "Font"
            ET.SubElement(param2, "value").text = "SF Pro"
            
            param3 = ET.SubElement(effect, "parameter")
            ET.SubElement(param3, "parameterid").text = "fontsize"
            ET.SubElement(param3, "name").text = "Font Size"
            ET.SubElement(param3, "value").text = "42"
            
            sub_id += 1
        
        timeline_pos += sec_to_frames(s["dur"])
    
    # Pretty print
    xml_str = ET.tostring(root, encoding="unicode")
    dom = minidom.parseString(xml_str)
    pretty = dom.toprettyxml(indent="  ")
    lines = pretty.split("\n")
    if lines[0].startswith("<?xml"):
        lines[0] = '<?xml version="1.0" encoding="UTF-8"?>'
    
    xml_path = os.path.join(out_dir, "ai-selves-leti.xml")
    with open(xml_path, "w") as f:
        f.write("\n".join(lines))
    print(f"  ✓ ai-selves-leti.xml ({len(SECTIONS)} clips, {sum(sec_to_frames(s['dur']) for s in SECTIONS)} frames)")

def main():
    # Clean and recreate
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("Generating placeholders...")
    generate_placeholders(OUTPUT_DIR)
    
    print("\nGenerating subtitles...")
    generate_srt(OUTPUT_DIR)
    
    print("\nGenerating Premiere XML...")
    generate_xml(OUTPUT_DIR)
    
    # Copy directed script
    script_src = "scripts/ai-selves-leti-v2-directed.md"
    if os.path.exists(script_src):
        shutil.copy2(script_src, os.path.join(OUTPUT_DIR, "ai-selves-leti-v2-directed.md"))
        print("  ✓ ai-selves-leti-v2-directed.md")
    
    total_dur = sum(s["dur"] for s in SECTIONS)
    print(f"\n✅ Package ready: {OUTPUT_DIR}/")
    print(f"   {len(SECTIONS)} sections | {total_dur}s total | 1920x1080 24fps")
    print(f"\n   Files:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        fp = os.path.join(OUTPUT_DIR, f)
        if os.path.isdir(fp):
            count = len(os.listdir(fp))
            print(f"     {f}/ ({count} clips)")
        else:
            print(f"     {f}")

if __name__ == "__main__":
    main()
