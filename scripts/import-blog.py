#!/usr/bin/env python3
"""Import and sanitize the public Sitejet knowledge archive for the static site."""

from __future__ import annotations

import copy
import html as html_lib
import json
import re
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from lxml import etree, html


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/tmp/items.json")
OUTPUT = ROOT / "blog-posts.json"
IMAGE_DIR = ROOT / "dist" / "assets" / "images" / "blog"

BLOCK_TAGS = {"p", "h2", "h3", "h4", "ul", "ol", "blockquote", "table"}
SAFE_TAGS = {
    "p", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "table", "thead",
    "tbody", "tfoot", "tr", "th", "td", "strong", "b", "em", "i", "a", "br",
    "code", "small", "sup", "sub", "span",
}
DROP_TAGS = {"style", "script", "title", "link", "meta", "form", "input", "textarea", "select", "option", "button", "iframe", "video", "source", "svg", "canvas"}
BOILERPLATE = (
    "ki-generierte inhalte",
    "zurück zum blog",
    "einwilligung zum datenschutz",
    "sämtliche datennutzung ablehnen",
)


def plain(value: str | None) -> str:
    if not value:
        return ""
    try:
        root = html.fragment_fromstring(value, create_parent="div")
        value = " ".join(root.itertext())
    except (etree.ParserError, ValueError):
        pass
    return re.sub(r"\s+", " ", html_lib.unescape(value)).strip()


def normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9äöüß]+", " ", plain(value).lower()).strip()


def choose_content_root(root, prefer_largest: bool):
    if not prefer_largest:
        return root
    candidates = root.xpath(".//article")
    if not candidates:
        candidates = root.xpath(".//main|.//section")
    if not candidates:
        return root
    return max(candidates, key=lambda element: len(plain(" ".join(element.itertext()))))


def sanitize_block(element) -> str:
    node = copy.deepcopy(element)
    for child in list(node.iterdescendants()):
        tag = child.tag.lower() if isinstance(child.tag, str) else ""
        if tag in DROP_TAGS:
            child.drop_tree()
        elif tag not in SAFE_TAGS:
            child.drop_tag()

    for child in node.iter():
        if not isinstance(child.tag, str):
            continue
        keep = {}
        tag = child.tag.lower()
        if tag == "a":
            href = child.get("href", "")
            if href.startswith(("https://", "http://", "mailto:", "tel:", "/")) and not href.startswith("#"):
                keep["href"] = href
                if href.startswith(("http://", "https://")):
                    keep["rel"] = "noopener"
        if tag in {"th", "td"}:
            for key in ("colspan", "rowspan", "scope"):
                if child.get(key):
                    keep[key] = child.get(key)
        child.attrib.clear()
        child.attrib.update(keep)

    text = normalized(" ".join(node.itertext()))
    if not text or any(marker in text for marker in BOILERPLATE):
        return ""
    return etree.tostring(node, encoding="unicode", method="html")


def blocks_from_fragment(fragment: str, prefer_largest: bool = False) -> list[str]:
    if not fragment.strip():
        return []
    try:
        root = html.fragment_fromstring(fragment, create_parent="div")
    except (etree.ParserError, ValueError):
        return []

    for tag in DROP_TAGS:
        for element in root.xpath(f".//{tag}"):
            element.drop_tree()

    selected = choose_content_root(root, prefer_largest)
    blocks = []
    for element in selected.iterdescendants():
        tag = element.tag.lower() if isinstance(element.tag, str) else ""
        if tag not in BLOCK_TAGS:
            continue
        if tag in {"p", "h2", "h3", "h4"} and any(
            isinstance(parent.tag, str) and parent.tag.lower() in {"li", "blockquote", "th", "td"}
            for parent in element.iterancestors()
            if parent is not selected
        ):
            continue
        if tag in {"ul", "ol", "table", "blockquote"} and any(
            isinstance(parent.tag, str) and parent.tag.lower() in BLOCK_TAGS
            for parent in element.iterancestors()
            if parent is not selected
        ):
            continue
        block = sanitize_block(element)
        if block:
            blocks.append(block)
    if not blocks:
        fallback = plain(fragment)
        if fallback and not any(marker in normalized(fallback) for marker in BOILERPLATE):
            blocks.append(f"<p>{html_lib.escape(fallback)}</p>")
    return blocks


def walk_nodes(nodes):
    for node in nodes or []:
        yield node
        yield from walk_nodes(node.get("children"))


def extract_content(columns: dict) -> str:
    gathered: list[str] = []
    seen: set[str] = set()
    title_key = normalized(columns.get("name", ""))

    for node in walk_nodes(columns.get("content")):
        node_type = node.get("type")
        if node_type not in {"html", "text", "headline"}:
            continue
        fragment = node.get("content", "")
        for block in blocks_from_fragment(fragment, prefer_largest=node_type == "html"):
            text_key = normalized(block)
            if not text_key or text_key in seen:
                continue
            if block.startswith("<h2") and text_key == title_key:
                continue
            if len(text_key) < 3:
                continue
            seen.add(text_key)
            gathered.append(block)

    if not gathered:
        fallback = plain(columns.get("description")) or "Weitere Informationen folgen nach der fachlichen Bestandsaufnahme."
        gathered.append(f"<p>{html_lib.escape(fallback)}</p>")
    content = "".join(gathered)
    for old, new in (
        ("BAuwerke", "Bauwerke"),
        ("unser team", "unser Team"),
        ("BT bautenschutz ihr partner", "BT Bautenschutz – Ihr Partner"),
        ("BT-Bautenschutz wir sind", "BT Bautenschutz – wir sind"),
        ("Wir freunen", "Wir freuen"),
        ("bei ihrem Sanierungsprojekt", "bei Ihrem Sanierungsprojekt"),
    ):
        content = content.replace(old, new)
    return content


def category_for(title: str, content: str) -> str:
    haystack = normalized(title)
    if any(word in haystack for word in ("schulung", "weiterbildung", "bilden uns", "qualifizierung", "goldpartner", "abdichtertagung", "guten rutsch", "qualität von grund auf")):
        return "Unternehmen"
    if any(word in haystack for word in ("schwamm", "schimmel", "pilz")):
        return "Schimmel & Schwamm"
    if any(word in haystack for word in ("spiralanker", "riss", "mauerwerksvernadelung")):
        return "Risse & Mauerwerk"
    if any(word in haystack for word in ("vermieter", "altbau")):
        return "Immobilien & Bestand"
    return "Abdichtung & Feuchte"


def berlin_date(value: str) -> tuple[str, str]:
    moment = datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(ZoneInfo("Europe/Berlin"))
    return moment.date().isoformat(), moment.strftime("%d.%m.%Y")


def read_time(content: str) -> int:
    words = re.findall(r"\b[\wÄÖÜäöüß-]+\b", plain(content))
    return max(2, round(len(words) / 190))


def fallback_image(post: dict) -> str:
    haystack = normalized(f"{post['title']} {post['category']}")
    if "spiralanker" in haystack or "riss" in haystack:
        return "/assets/images/spiralanker_1_main-1920w.webp"
    if "schwamm" in haystack or "schimmel" in haystack:
        return "/assets/images/schwamm_6_main-1920w.webp"
    if "schulung" in haystack or "qualifikation" in haystack or "partner" in haystack:
        return "/assets/images/qualifikation-koester-gold.webp"
    if "horizontal" in haystack or "injektion" in haystack:
        return "/assets/images/hz-sperre_1_main-1920w.webp"
    return "/assets/images/bauabdicht_4-1920w.webp"


def download_image(post: dict) -> tuple[str, bool]:
    url = post.pop("sourceImage", "")
    if not url:
        return post["slug"], False
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    target = IMAGE_DIR / f"{post['slug']}.webp"
    if target.exists() and target.stat().st_size > 4_000:
        post["image"] = f"/assets/images/blog/{target.name}"
        return post["slug"], True

    with tempfile.TemporaryDirectory(prefix="bt-blog-") as temp:
        source = Path(temp) / "source-image"
        fetched = subprocess.run(
            ["curl", "-L", "--fail", "--silent", "--show-error", "--retry", "2", "--max-time", "60", "-o", str(source), url],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if fetched.returncode != 0 or not source.exists() or source.stat().st_size < 1_000:
            return post["slug"], False
        converted = subprocess.run(
            ["convert", f"{source}[0]", "-auto-orient", "-resize", "1600x1200>", "-strip", "-quality", "80", str(target)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if converted.returncode != 0 or not target.exists() or target.stat().st_size < 1_000:
            target.unlink(missing_ok=True)
            return post["slug"], False
    post["image"] = f"/assets/images/blog/{target.name}"
    return post["slug"], True


NEW_POSTS = [
    {
        "title": "Risse in der Kellerwand: Setzriss oder wasserführender Riss?",
        "slug": "risse-in-der-kellerwand-setzriss-oder-wasserfuehrender-riss",
        "date": "2026-08-27",
        "displayDate": "27.08.2026",
        "category": "Risse & Mauerwerk",
        "excerpt": "Rissverlauf, Feuchtespuren und Veränderung über die Zeit geben wichtige Hinweise. So wird aus einem sichtbaren Riss eine belastbare Diagnose.",
        "image": "/assets/images/spiralanker_1_main-1920w.webp",
        "content": """
<p class="lead">Ein Riss in der Kellerwand kann harmlos wirken und trotzdem ein Wasserweg sein. Umgekehrt ist nicht jeder sichtbare Riss statisch kritisch. Entscheidend sind Verlauf, Breite, Feuchtezustand und die Frage, ob sich der Riss noch bewegt.</p>
<h2>Was ein Setzriss erkennen lässt</h2>
<p>Setzrisse entstehen, wenn sich Bauteile oder der Baugrund unterschiedlich verformen. Typisch sind schräge Verläufe, Risse an Fenster- und Türöffnungen oder Stufenrisse entlang der Mauerwerksfugen. Das Schadensbild allein ersetzt keine statische Bewertung, liefert aber wichtige Hinweise für die weitere Prüfung.</p>
<p>Besonders aufmerksam sollten Eigentümer werden, wenn sich ein Riss sichtbar verbreitert, Türen plötzlich klemmen oder weitere Risse in angrenzenden Bauteilen auftreten. Dann muss zuerst geklärt werden, ob die Bewegung abgeschlossen ist.</p>
<h2>Wann ein Riss zum Wasserweg wird</h2>
<p>Ein wasserführender Riss zeigt sich häufig erst bei Starkregen, hohem Bodenwasserstand oder Tauwetter. Feuchte Ränder, Ausblühungen oder ein punktueller Wasseraustritt entlang der Risslinie sprechen dafür, dass Wasser durch das Bauteil gelangt. Die sichtbare Austrittsstelle muss dabei nicht der Eintrittsstelle entsprechen.</p>
<ul><li>Feuchtigkeit tritt zeitlich nach Niederschlägen auf.</li><li>Der Riss liegt in einer erdberührten Wand oder an einer Arbeitsfuge.</li><li>Salzränder und dunkle Verfärbungen folgen dem Rissverlauf.</li><li>Bei stärkerer Belastung ist aktiver Wassereintritt erkennbar.</li></ul>
<h2>Warum einfaches Überspachteln nicht genügt</h2>
<p>Spachtel und Farbe verschließen nur die Oberfläche. Bleibt der Wasserweg im Querschnitt offen oder arbeitet das Bauteil weiter, erscheint der Schaden erneut. Zudem gehen durch eine vorschnelle kosmetische Reparatur Informationen verloren, die für die Diagnose wichtig sind.</p>
<h2>So läuft die fachliche Prüfung ab</h2>
<p>Zunächst werden Rissverlauf, Breite, Feuchte und angrenzende Bauteile dokumentiert. Je nach Situation folgen Feuchtemessungen, eine Beobachtung der Rissbewegung oder die Prüfung von Außenabdichtung und Anschlussdetails. Erst danach wird entschieden, ob eine elastische Abdichtung, eine kraftschlüssige Verpressung, eine Vernadelung mit Spiralankern oder eine Kombination sinnvoll ist.</p>
<div class="article-callout"><strong>Praktischer Tipp</strong><span>Fotografieren Sie den Riss mit Maßstab und Datum. Wiederholen Sie die Aufnahme aus gleicher Perspektive – besonders nach Starkregen oder Frostperioden.</span></div>
<h2>Welches Verfahren passt?</h2>
<p>Für einen ruhenden, trockenen Riss kann eine kraftschlüssige Injektion infrage kommen. Bei leicht arbeitendem Mauerwerk stabilisieren Spiralanker die Rissufer. Ist der Riss wasserführend, muss das Injektionsmaterial zusätzlich zur Feuchtebelastung passen. Eine tragfähige Lösung entsteht deshalb immer aus Ursache, Bauteil und gewünschter Nutzung – nicht allein aus der sichtbaren Rissbreite.</p>
""",
        "origin": "new",
    },
    {
        "title": "Keller innen oder außen abdichten: Welche Lösung passt?",
        "slug": "keller-innen-oder-aussen-abdichten",
        "date": "2026-09-17",
        "displayDate": "17.09.2026",
        "category": "Abdichtung & Feuchte",
        "excerpt": "Außenabdichtung, Negativabdichtung oder Flächeninjektage: Zugänglichkeit und Wasserweg bestimmen, welches System sinnvoll ist.",
        "image": "/assets/images/bauabdicht_4-1920w.webp",
        "content": """
<p class="lead">Soll eine feuchte Kellerwand von außen freigelegt oder von innen abgedichtet werden? Eine pauschale Antwort gibt es nicht. Technisch entscheidend sind die Wassereinwirkung, der Wandaufbau, die Zugänglichkeit und die spätere Nutzung des Raums.</p>
<h2>Außenabdichtung: Wasser auf der Eintrittsseite stoppen</h2>
<p>Bei einer Außenabdichtung wird das erdberührte Bauteil freigelegt und auf der wasserzugewandten Seite geschützt. Alte, geschädigte Schichten werden beurteilt, der Untergrund vorbereitet und Anschlüsse an Bodenplatte, Sockel und Durchdringungen in das System eingebunden.</p>
<p>Der große Vorteil liegt darin, dass Wasser gar nicht erst in den Wandquerschnitt eindringen soll. Gleichzeitig sind Aushub, Zugänglichkeit und Schutz der fertigen Abdichtung zu berücksichtigen.</p>
<h2>Innenabdichtung: Lösung bei fehlendem Außenzugang</h2>
<p>Grenzt eine Garage, Terrasse oder Nachbarbebauung direkt an die Kellerwand, kann eine Außenfreilegung unverhältnismäßig oder unmöglich sein. Dann kommt eine mineralische Negativabdichtung von innen infrage. Sie muss dem Wasserdruck standhalten und benötigt einen tragfähigen, sorgfältig vorbereiteten Untergrund.</p>
<p>Besondere Aufmerksamkeit verdienen Wand-Boden-Anschlüsse, Fugen und Leitungsdurchführungen. Werden diese Details nicht geschlossen, sucht sich Wasser häufig den nächsten Weg.</p>
<h2>Flächeninjektage: Abdichtung im oder hinter dem Bauteil</h2>
<p>Bei geeigneten Mauerwerks- und Betonbauteilen kann ein niedrigviskoses Gel über ein geplantes Bohrraster eingebracht werden. Es verteilt sich in Hohlräumen oder hinter dem Bauteil und bildet dort eine Abdichtungsebene. Das Verfahren ist besonders interessant, wenn die Außenfläche überbaut ist.</p>
<h2>Vier Fragen führen zur passenden Entscheidung</h2>
<ol><li>Wo und bei welcher Witterung zeigt sich die Feuchtigkeit?</li><li>Ist die wasserzugewandte Seite dauerhaft erreichbar?</li><li>Aus welchem Material und Aufbau besteht die Wand?</li><li>Wie soll der Keller nach der Sanierung genutzt werden?</li></ol>
<div class="article-callout"><strong>Innen ist nicht automatisch die kleinere Lösung.</strong><span>Auch eine Abdichtung von der Raumseite braucht ein geschlossenes System, sorgfältige Untergrundvorbereitung und sichere Detailanschlüsse.</span></div>
<h2>Fazit: Erst den Wasserweg klären</h2>
<p>Außenabdichtung, Negativabdichtung und Flächeninjektage sind keine austauschbaren Produkte, sondern unterschiedliche Strategien. Die sinnvollste Lösung ergibt sich aus der Bestandsaufnahme vor Ort. Wer Ursache und Lastfall kennt, vermeidet unnötige Arbeiten und kann die Sanierung nachvollziehbar planen.</p>
""",
        "origin": "new",
    },
    {
        "title": "Herbst-Check für Keller und Sockel: 7 Punkte vor der nassen Jahreszeit",
        "slug": "herbst-check-keller-sockel",
        "date": "2026-10-08",
        "displayDate": "08.10.2026",
        "category": "Wartung & Vorsorge",
        "excerpt": "Mit einer kurzen Sichtkontrolle lassen sich Schwachstellen an Keller, Sockel und Entwässerung erkennen, bevor Dauerregen daraus einen Schaden macht.",
        "image": "/assets/images/bauabdicht_6-1920w.webp",
        "content": """
<p class="lead">Herbstregen belastet Kellerwände, Sockel und Gebäudeeinführungen über längere Zeit. Viele Schäden kündigen sich vorher an. Diese sieben Kontrollen helfen, Veränderungen früh zu dokumentieren und rechtzeitig einzuordnen.</p>
<h2>1. Sockelzone rund um das Gebäude ansehen</h2>
<p>Achten Sie auf Risse, lose Beschichtungen, dunkle Verfärbungen und Abplatzungen. Gerade Übergänge zwischen Gelände, Fassade und Türen sind stark beansprucht. Kleine Fehlstellen sollten nicht einfach überstrichen werden, bevor ihre Ursache geklärt ist.</p>
<h2>2. Fallrohre und Entwässerungswege prüfen</h2>
<p>Laub, Ablagerungen oder beschädigte Anschlüsse können Wasser direkt am Gebäude konzentrieren. Prüfen Sie, ob Regenwasser kontrolliert abgeführt wird und keine sichtbaren Ausspülungen oder Pfützen an der Kellerwand entstehen.</p>
<h2>3. Kellerwände fotografisch dokumentieren</h2>
<p>Fotografieren Sie auffällige Stellen bei trockener Witterung. Nach einer längeren Regenphase lassen sich neue Ränder, Ausblühungen oder Feuchteflecken leichter erkennen. Notieren Sie Datum und Wetterlage.</p>
<h2>4. Wand-Boden-Anschluss kontrollieren</h2>
<p>Feuchte zeigt sich häufig zuerst am Übergang von Wand und Bodenplatte. Prüfen Sie die gesamte Linie – auch hinter Regalen, in Technikräumen und unter Treppen. Lagern Sie empfindliche Gegenstände mit Abstand zu Außenwänden.</p>
<h2>5. Kabel- und Rohrdurchführungen ansehen</h2>
<p>Gebäudeeinführungen gehören zu den typischen Schwachstellen. Rostspuren, dunkle Ränder oder poröse Dichtungen sind ein Anlass für eine fachliche Prüfung, besonders wenn die Durchführung unter Geländeniveau liegt.</p>
<h2>6. Risse und Fugen vergleichen</h2>
<p>Markieren Sie nicht am Bauteil selbst, sondern dokumentieren Sie Breite und Verlauf mit Foto und Maßstab. Verändert sich ein Riss oder wird er nach Regen feucht, sollte er vor einer kosmetischen Reparatur untersucht werden.</p>
<h2>7. Raumklima im Blick behalten</h2>
<p>Kühlere Kellerwände und warme, feuchte Raumluft begünstigen Kondensat. Regelmäßiges Stoßlüften bei geeigneter Außenluft und ausreichende Luftzirkulation helfen. Bleibt eine Stelle unabhängig vom Lüften feucht, spricht das eher für einen baulichen Wasserweg.</p>
<div class="article-callout"><strong>Bei aktivem Wassereintritt</strong><span>Elektrische Bereiche sichern, Wasser dokumentieren und die Ursache zeitnah prüfen lassen. Ein Bautrockner unterstützt später die Trocknung, schließt aber keine Undichtigkeit.</span></div>
<h2>Ein kurzer Check schafft Vergleichswerte</h2>
<p>Der größte Nutzen liegt in der Dokumentation: Wer den Ausgangszustand kennt, erkennt Veränderungen früher. So lässt sich beim Vor-Ort-Termin gezielter klären, ob Außenabdichtung, Injektion, Horizontalsperre oder eine Detailreparatur erforderlich ist.</p>
""",
        "origin": "new",
    },
    {
        "title": "Feuchte Wand im Herbst: Kondensat oder eindringendes Wasser?",
        "slug": "feuchte-wand-im-herbst-kondensat-oder-wasser",
        "date": "2026-10-23",
        "displayDate": "23.10.2026",
        "category": "Diagnose & Feuchte",
        "excerpt": "Zeitpunkt, Lage und Feuchteverlauf zeigen, ob Raumluft kondensiert oder Wasser durch das Bauteil gelangt. Die wichtigsten Unterschiede im Überblick.",
        "image": "/assets/images/sanierputz_3-1920w.webp",
        "content": """
<p class="lead">Im Herbst werden Keller- und Außenwände kühler, während in Innenräumen weiterhin Feuchtigkeit entsteht. Gleichzeitig belasten lange Regenphasen das Erdreich. Beides kann nasse Flecken verursachen – benötigt aber völlig unterschiedliche Maßnahmen.</p>
<h2>Wie Kondensat entsteht</h2>
<p>Warme Luft kann mehr Feuchtigkeit aufnehmen als kalte. Trifft feuchte Raumluft auf eine kalte Wandoberfläche, steigt dort die relative Luftfeuchte; im ungünstigen Fall fällt Wasser aus. Besonders anfällig sind Raumecken, Bereiche hinter Möbeln und schlecht belüftete Kellerabschnitte.</p>
<p>Kondensat zeigt sich häufig flächig an kalten Oberflächen. Das Bild verändert sich mit Raumtemperatur, Lüftung und Nutzung. Ein Hygrometer liefert erste Vergleichswerte, ersetzt aber keine Bauteilprüfung.</p>
<h2>Hinweise auf eindringendes Wasser</h2>
<p>Baulich eindringende Feuchtigkeit folgt oft einem konkreten Weg: einem Riss, einer Fuge, dem Wand-Boden-Anschluss oder einer undichten Rohrdurchführung. Das Schadensbild verstärkt sich nach Regen, Schneeschmelze oder einem erhöhten Wasserstand im Erdreich.</p>
<ul><li>Feuchterand bleibt an einer klar begrenzten Stelle.</li><li>Ausblühungen oder abplatzender Putz treten wiederholt auf.</li><li>Der Schaden folgt einem Riss oder Anschluss.</li><li>Die Stelle wird nach Niederschlag sichtbar nasser.</li></ul>
<h2>Aufsteigende Feuchtigkeit als dritte Möglichkeit</h2>
<p>Zeigt sich die Feuchte vor allem in der unteren Wandzone, kann kapillar aufsteigendes Wasser beteiligt sein. Typisch sind Salzbelastungen und ein über längere Zeit geschädigter Putz. Seitlich eindringendes Wasser und eine fehlende Horizontalsperre können gleichzeitig auftreten – deshalb ist eine reine Blickdiagnose oft zu wenig.</p>
<h2>Was Sie selbst dokumentieren können</h2>
<ol><li>Ort, Höhe und Ausdehnung der Flecken markieren oder fotografieren.</li><li>Raumtemperatur und Luftfeuchte morgens und abends notieren.</li><li>Wetterlage sowie Zeitpunkt der Veränderung festhalten.</li><li>Möbel abrücken und prüfen, ob sich das Bild verändert.</li><li>Risse, Fugen und Durchdringungen separat fotografieren.</li></ol>
<div class="article-callout"><strong>Wichtig</strong><span>Schimmelentferner, Sperrfarbe oder ein Bautrockner können sichtbare Folgen kurzfristig verändern. Die Ursache einer baulichen Durchfeuchtung beseitigen sie nicht.</span></div>
<h2>Die Sanierung richtet sich nach der Ursache</h2>
<p>Bei Kondensat stehen Raumklima, Lüftung und Oberflächentemperatur im Mittelpunkt. Bei eindringendem Wasser können Außenabdichtung, Negativabdichtung, Rissinjektion oder die Sanierung eines Anschlusses erforderlich sein. Bei aufsteigender Feuchtigkeit wird geprüft, ob eine nachträgliche Horizontalsperre sinnvoll ist.</p>
<h2>Fazit: Muster statt Einzelmesswert betrachten</h2>
<p>Eine einzelne Messung sagt selten genug aus. Aussagekräftig wird das Bild durch Ort, zeitlichen Verlauf, Wetterbezug und Bauteilaufbau. Genau diese Kombination bildet die Grundlage für eine fachgerechte Empfehlung.</p>
""",
        "origin": "new",
    },
]


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source missing: {SOURCE}")
    payload = json.loads(SOURCE.read_text(encoding="utf-8"))
    posts = []

    for item in payload.get("collection", []):
        columns = item.get("columns", {})
        if columns.get("status") != "Published":
            continue
        content = extract_content(columns)
        iso_date, display_date = berlin_date(columns["publishing_date"])
        description = plain((columns.get("seo") or {}).get("description")) or plain(columns.get("description"))
        first_paragraph = plain(next(iter(blocks_from_fragment(content)), ""))
        excerpt = description or first_paragraph
        if excerpt.startswith("wei Verfahren"):
            excerpt = "Zwei Verfahren haben sich dafür etabliert: " + excerpt[len("wei Verfahren haben sich dafür etabliert: "):]
        if len(excerpt) > 210:
            excerpt = excerpt[:207].rsplit(" ", 1)[0] + "…"
        title = plain(columns.get("name"))
        post = {
            "title": title,
            "slug": columns.get("slug"),
            "date": iso_date,
            "displayDate": display_date,
            "category": category_for(title, content),
            "excerpt": excerpt,
            "image": "",
            "sourceImage": (columns.get("image") or {}).get("url", ""),
            "content": content,
            "origin": "imported",
        }
        post["readTime"] = read_time(content)
        posts.append(post)

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(download_image, post): post for post in posts}
        for future in as_completed(futures):
            post = futures[future]
            try:
                _, ok = future.result()
            except Exception:
                ok = False
            if not ok:
                post["image"] = fallback_image(post)

    for post in NEW_POSTS:
        post["readTime"] = read_time(post["content"])
        posts.append(post)

    posts.sort(key=lambda post: post["date"], reverse=True)
    OUTPUT.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    imported = sum(post["origin"] == "imported" for post in posts)
    added = sum(post["origin"] == "new" for post in posts)
    local_images = sum(post["image"].startswith("/assets/images/blog/") for post in posts)
    print(f"Prepared {imported} imported and {added} new posts; {local_images} optimized archive images.")


if __name__ == "__main__":
    main()
