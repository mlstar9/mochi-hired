#!/usr/bin/env python3
"""Generate a Premiere Pro compatible FCP XML with placeholder clips + subtitles."""

import xml.etree.ElementTree as ET
from xml.dom import minidom

FPS = 24
TIMEBASE = 24
BG_COLOR = "#111111"

SECTIONS = [
    # ── HOOK (5s) ──
    {"id": "hook", "label": "HOOK — Text card or to camera", "dur": 4, "subs": [
        (0, 2.5, "You're not gonna believe this but —"),
        (2.5, 1.5, "our company used our own product, AI Selves, to push the actual product."),
    ]},
    {"id": "explain", "label": "LET ME EXPLAIN — Beat", "dur": 1, "subs": [
        (0, 1, "Let me explain."),
    ]},

    # ── ANTHONY + THEO — Full intro (8s) ──
    {"id": "anthony", "label": "ANTHONY — Photo + title (Head of Partnerships)", "dur": 2, "subs": [
        (0, 1.5, "This is Anthony, our head of partnerships."),
        (1.5, 0.5, "And this is Theo."),
    ]},
    {"id": "theo", "label": "THEO — Avatar + ding + (his AI Self)", "dur": 2, "subs": [
        (0, 0.5, "(his AI Self)"),
        (0.5, 1.5, "Theo monitors brand mentions in real time"),
    ]},
    {"id": "theo-work", "label": "THEO WORK — Scanning UI + Slack", "dur": 4, "subs": [
        (0, 2, "and helped Anthony evaluate partnerships around the clock"),
        (2, 2, "for the launch."),
    ]},

    # ── RAPID MONTAGE: Starry/Momo, Rus/Russ, Matan/Raccoon (4s) ──
    {"id": "montage-starry", "label": "RAPID — Starry photo → Momo avatar + ding", "dur": 1.3, "subs": [
        (0, 0.6, "Starry — Momo"),
        (0.6, 0.7, "(her AI Self)"),
    ]},
    {"id": "montage-rus", "label": "RAPID — Rus photo → Russ avatar + ding", "dur": 1.3, "subs": [
        (0, 0.6, "Rus — Russ"),
        (0.6, 0.7, "(his AI Self)"),
    ]},
    {"id": "montage-matan", "label": "RAPID — Matan photo → Raccoon 2.0 avatar + ding", "dur": 1.4, "subs": [
        (0, 0.6, "Matan — Raccoon 2.0"),
        (0.6, 0.8, "(his AI Self)"),
    ]},

    # ── DEMI + SEMI — Hierarchy punchline (7s) ──
    {"id": "demi", "label": "DEMI — Photo + CEO title", "dur": 2, "subs": [
        (0, 2, "Oh, and all of them report up to our CEO, Demi Guo."),
    ]},
    {"id": "not-exactly", "label": "BEAT — 'Well… not exactly.'", "dur": 1.5, "subs": [
        (0, 1.5, "Well… not exactly."),
    ]},
    {"id": "semi", "label": "SEMI — Avatar + ding + (her AI Self)", "dur": 1.5, "subs": [
        (0, 1, "They report to Semi —"),
        (0, 1, "(her AI Self)"),
    ]},
    {"id": "demi-busy", "label": "DEMI BUSY — Calendar + punchline", "dur": 2, "subs": [
        (0, 1, "and Semi reports back to her."),
        (1, 1, "Because Demi is waaaay too busy."),
    ]},

    # ── THE ENDING (16s) ──
    {"id": "leti-intro", "label": "LETI — To camera, normal intro", "dur": 3, "subs": [
        (0, 2.5, "And me? I'm Leti, and I usually make videos, buuuut—"),
        (2.5, 0.5, "[MEOW]"),
    ]},
    {"id": "mochi-reveal", "label": "MOCHI — Hard cut, smashing keyboard, 2 monitors", "dur": 3, "subs": [
        (0, 1.5, "(my AI Self)"),
    ]},
    {"id": "leti-annoyed", "label": "LETI OFFSCREEN — 'ffs I'm in the middle of introducing yo—'", "dur": 2, "subs": [
        (0, 2, "Mochi— ffs, I'm in the middle of introducing yo—"),
    ]},
    {"id": "mochi-glitch", "label": "GLITCH — Mochi stares at camera annoyed", "dur": 1, "subs": []},
    {"id": "leti-comeback", "label": "LETI — 'Anyways, I'm—' (gets cut off again)", "dur": 1.5, "subs": [
        (0, 1, "Anyways, I'm—"),
    ]},
    {"id": "mochi-done", "label": "MOCHI GLITCH — Leti: 'oh you're done?'", "dur": 3.5, "subs": [
        (0, 1.5, "What?? What do you need from me—"),
        (1.5, 1, "oh. Oh! You're done editing the video?"),
        (2.5, 1, "Ok ok lemme check it out."),
    ]},
    {"id": "loop-zoom", "label": "ZOOM INTO MOCHI SCREEN → LOOP ∞", "dur": 2, "subs": [
        (1, 1, '"You\'re not gonna believe this but—"'),
    ]},
]

def sec_to_frames(s):
    return int(round(s * FPS))

def build_xml():
    # FCP XML 5 format (Premiere compatible)
    root = ET.Element("xmeml", version="5")
    project = ET.SubElement(root, "project")
    ET.SubElement(project, "name").text = "Leti AI Selves Video"

    children = ET.SubElement(project, "children")
    sequence = ET.SubElement(children, "sequence")
    ET.SubElement(sequence, "name").text = "Leti AI Selves — Main"
    ET.SubElement(sequence, "duration").text = str(sum(sec_to_frames(s["dur"]) for s in SECTIONS))

    rate = ET.SubElement(sequence, "rate")
    ET.SubElement(rate, "timebase").text = str(TIMEBASE)
    ET.SubElement(rate, "ntsc").text = "FALSE"

    media = ET.SubElement(sequence, "media")

    # ── Video track (placeholder clips) ──
    video = ET.SubElement(media, "video")
    vtrack = ET.SubElement(video, "track")

    timeline_pos = 0
    clip_id = 1

    for section in SECTIONS:
        dur_frames = sec_to_frames(section["dur"])

        clipitem = ET.SubElement(vtrack, "clipitem", id=f"clip-{clip_id}")
        ET.SubElement(clipitem, "name").text = section["label"]
        ET.SubElement(clipitem, "duration").text = str(dur_frames)

        ci_rate = ET.SubElement(clipitem, "rate")
        ET.SubElement(ci_rate, "timebase").text = str(TIMEBASE)
        ET.SubElement(ci_rate, "ntsc").text = "FALSE"

        ET.SubElement(clipitem, "start").text = str(timeline_pos)
        ET.SubElement(clipitem, "end").text = str(timeline_pos + dur_frames)
        ET.SubElement(clipitem, "in").text = "0"
        ET.SubElement(clipitem, "out").text = str(dur_frames)

        # Black video generator
        file_elem = ET.SubElement(clipitem, "file", id=f"file-{clip_id}")
        ET.SubElement(file_elem, "name").text = section["label"]
        ET.SubElement(file_elem, "duration").text = str(dur_frames)

        f_rate = ET.SubElement(file_elem, "rate")
        ET.SubElement(f_rate, "timebase").text = str(TIMEBASE)
        ET.SubElement(f_rate, "ntsc").text = "FALSE"

        f_media = ET.SubElement(file_elem, "media")
        f_video = ET.SubElement(f_media, "video")
        f_vc = ET.SubElement(f_video, "samplecharacteristics")
        ET.SubElement(f_vc, "width").text = "1920"
        ET.SubElement(f_vc, "height").text = "1080"

        # Add marker with section label
        marker = ET.SubElement(clipitem, "marker")
        ET.SubElement(marker, "name").text = section["id"]
        comment = ET.SubElement(marker, "comment")
        comment.text = section["label"]
        ET.SubElement(marker, "in").text = "0"
        ET.SubElement(marker, "out").text = "-1"

        timeline_pos += dur_frames
        clip_id += 1

    # ── Subtitle track (text clips) ──
    vtrack2 = ET.SubElement(video, "track")
    ET.SubElement(vtrack2, "enabled").text = "TRUE"
    ET.SubElement(vtrack2, "locked").text = "FALSE"

    timeline_pos = 0
    sub_id = 1

    for section in SECTIONS:
        section_start = timeline_pos

        for start_sec, dur_sec, text in section["subs"]:
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

            # Text parameter
            param = ET.SubElement(effect, "parameter")
            ET.SubElement(param, "parameterid").text = "str"
            ET.SubElement(param, "name").text = "Text"
            ET.SubElement(param, "value").text = text

            # Font parameter
            param2 = ET.SubElement(effect, "parameter")
            ET.SubElement(param2, "parameterid").text = "font"
            ET.SubElement(param2, "name").text = "Font"
            ET.SubElement(param2, "value").text = "SF Pro"

            # Font size
            param3 = ET.SubElement(effect, "parameter")
            ET.SubElement(param3, "parameterid").text = "fontsize"
            ET.SubElement(param3, "name").text = "Font Size"
            ET.SubElement(param3, "value").text = "42"

            sub_id += 1

        timeline_pos += sec_to_frames(section["dur"])

    # Pretty print
    xml_str = ET.tostring(root, encoding="unicode")
    dom = minidom.parseString(xml_str)
    pretty = dom.toprettyxml(indent="  ", encoding=None)
    # Remove extra xml declaration
    lines = pretty.split("\n")
    if lines[0].startswith("<?xml"):
        lines[0] = '<?xml version="1.0" encoding="UTF-8"?>'

    return "\n".join(lines)

if __name__ == "__main__":
    xml_content = build_xml()
    output_path = "out/leti-placeholders/ai-selves-leti.xml"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(xml_content)
    print(f"Written to {output_path}")
    print(f"Total sections: {len(SECTIONS)}")
    print(f"Total duration: {sum(s['dur'] for s in SECTIONS)}s ({sum(sec_to_frames(s['dur']) for s in SECTIONS)} frames)")
