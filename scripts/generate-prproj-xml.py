#!/usr/bin/env python3
"""Generate a Premiere Pro compatible FCP XML with placeholder clips + subtitles."""

import xml.etree.ElementTree as ET
from xml.dom import minidom

FPS = 24
TIMEBASE = 24
BG_COLOR = "#111111"

SECTIONS = [
    {"id": "intro", "label": "INTRO — Leti to camera", "dur": 8, "subs": [
        (0, 2.5, "You're not gonna believe this but —"),
        (2.5, 2.5, "our company used our own product, AI Selves,"),
        (5, 1.5, "to push the actual product."),
        (7, 1, "Let me explain."),
    ]},
    {"id": "anthony-intro", "label": "ANTHONY — Real photo + title", "dur": 4, "subs": [
        (0, 3, "This is Anthony, our head of partnerships."),
        (3, 1, "And this is Theo."),
    ]},
    {"id": "theo-reveal", "label": "THEO — Avatar reveal + ding SFX", "dur": 7, "subs": [
        (0, 1.5, "(his AI Self)"),
        (1.5, 2.5, "Theo monitors our brand mentions in real time —"),
        (4, 2, "and helped Anthony evaluate partnership opportunities"),
        (6, 1, "around the clock for the launch."),
    ]},
    {"id": "starry-intro", "label": "STARRY — Real photo + title", "dur": 3, "subs": [
        (0, 2, "Starry, our product manager —"),
        (2, 1, "uses Momo."),
    ]},
    {"id": "momo-reveal", "label": "MOMO — Avatar reveal + ding SFX", "dur": 6, "subs": [
        (0, 1, "(her AI Self)"),
        (1, 0.8, "CUTE."),
        (1.8, 2.2, "Momo handles Linear tasks across all departments —"),
        (4, 2, "and even goes on Zoom calls when Starry doesn't feel like it!"),
    ]},
    {"id": "rus-intro", "label": "RUS — Real photo + title", "dur": 3, "subs": [
        (0, 2, "Rus, our head of design —"),
        (2, 1, "uses Russ."),
    ]},
    {"id": "russ-reveal", "label": "RUSS — Avatar reveal + ding SFX", "dur": 4, "subs": [
        (0, 1, "(his AI Self)"),
        (1, 1.5, "Russ goes over design issues"),
        (2.5, 1.5, "and communicates them to the design team."),
    ]},
    {"id": "matan-intro", "label": "MATAN — Real photo + title", "dur": 3, "subs": [
        (0, 2.5, "And this is Matan, our Creative Director."),
    ]},
    {"id": "raccoon-reveal", "label": "RACCOON 2.0 — Avatar reveal + ding SFX", "dur": 5, "subs": [
        (0, 1.5, "His Raccoon 2.0 — (his AI Self)"),
        (1.5, 1.5, "helps Matan bridge the gap between"),
        (3, 2, "our researchers and our Creative team."),
    ]},
    {"id": "demi-intro", "label": "DEMI — Real photo + title", "dur": 3, "subs": [
        (0, 3, "Oh, and all of them report up to our CEO, Demi Guo."),
    ]},
    {"id": "semi-reveal", "label": "SEMI — Avatar reveal + ding SFX", "dur": 6, "subs": [
        (0, 1.5, "Well… not exactly."),
        (1.5, 1.5, "They report to Semi — (her AI Self)"),
        (3, 1.5, "and Semi reports back to her."),
        (4.5, 1.5, "Because Demi is waaaay too busy."),
    ]},
    {"id": "leti-intro", "label": "LETI — To camera (THE ENDING)", "dur": 4, "subs": [
        (0, 3, "And me? I'm Leti, and I usually make videos, buuuut—"),
        (3, 0.5, "[MEOW]"),
    ]},
    {"id": "mochi-reveal", "label": "MOCHI — Hard cut, smashing keyboard", "dur": 4, "subs": [
        (0, 1.5, "(my AI Self)"),
    ]},
    {"id": "leti-interrupted", "label": "LETI — Offscreen annoyed", "dur": 3, "subs": [
        (0, 2.5, "Mochi— ffs, I'm in the middle of introducing yo—"),
    ]},
    {"id": "mochi-glitch", "label": "MOCHI — Glitch cut, looking annoyed", "dur": 2, "subs": []},
    {"id": "leti-comeback", "label": "LETI — Tries to recover", "dur": 2, "subs": [
        (0, 1.5, "Anyways, I'm—"),
    ]},
    {"id": "mochi-glitch-2", "label": "MOCHI — Glitch, looking at camera", "dur": 5, "subs": [
        (0, 2, "What?? What do you need from me—"),
        (2, 1.5, "oh. Oh! You're done editing the video?"),
        (3.5, 1.5, "Ok ok lemme check it out."),
    ]},
    {"id": "loop-zoom", "label": "ZOOM INTO SCREEN → LOOP", "dur": 4, "subs": [
        (2, 2, '"You\'re not gonna believe this but—"'),
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
        ET.SubElement(f_vc, "width").text = "1080"
        ET.SubElement(f_vc, "height").text = "1920"

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
