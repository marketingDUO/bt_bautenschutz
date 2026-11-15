import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const blogPosts = JSON.parse(fs.readFileSync(path.join(root, 'blog-posts.json'), 'utf8'));
const image = (name) => `/assets/images/${name}`;
const imageDescriptions = Object.freeze({
  'bt-bautenschutz-logo.webp': 'Logo von BT Bautenschutz in Blau und Schwarz',
  'betonwand-rissstruktur-dunkel.jpeg': 'Dunkle Betonoberfläche mit deutlich sichtbaren Rissen',
  'betonwand-mit-rissen-nahaufnahme.jpeg': 'Nahaufnahme einer grauen Betonwand mit feinen und breiten Rissen',
  'bauwerksabdichtung-kellerwand-vorher.png': 'Freigelegte feuchte Kelleraußenwand vor Beginn der Abdichtungsarbeiten',
  'bauwerksabdichtung-kellerwand-nachher.png': 'Fertig abgedichtete Kelleraußenwand mit mehrlagiger schwarzer Schutzschicht',
  'bauwerksabdichtung-kellerwand-ausfuehrung.webp': 'Facharbeiter beim Auftragen einer mineralischen Abdichtung auf eine Kelleraußenwand',
  'bauwerksabdichtung-kellerwand-abgedichtet.webp': 'Vollflächig abgedichtete Kelleraußenwand vor dem Verfüllen der Baugrube',
  'bauwerksabdichtung-perimeterdaemmung.webp': 'Kelleraußenwand mit montierter Perimeterdämmung als Schutz der Abdichtung',
  'bauwerksabdichtung-altbestand-freigelegt.webp': 'Freigelegte Kelleraußenwand mit alter beschädigter Bitumenabdichtung',
  'bauwerksabdichtung-mineralische-abdichtung.webp': 'Kelleraußenwand mit frisch aufgetragener mineralischer Abdichtungsschicht',
  'bauwerksabdichtung-kellerwand-fertig.webp': 'Fertig ausgeführte Außenabdichtung am Sockel und an der Kellerwand',
  'bodenabdichtung-keller-flaeche.jpg': 'Gleichmäßig abgedichtete Bodenfläche in einem langgestreckten Kellerraum',
  'kabel-medieneinfuehrung-abdichtung.jpg': 'Abgedichtete Rohr- und Medieneinführung in einer Kellerwand',
  'betonsanierung-freigelegte-bewehrung.webp': 'Freigelegte korrodierte Stahlbewehrung in einer geschädigten Betonfläche',
  'betonsanierung-reprofilierung-moertel.webp': 'Mit Instandsetzungsmörtel reprofilierte Betonfläche während der Sanierung',
  'betonsanierung-korrosionsschaden-bewehrung.webp': 'Korrodierte Bewehrungsstäbe in abgeplatztem Beton vor der Instandsetzung',
  'flaecheninjektage-bohrpacker-kellerwand.webp': 'Kellerwand mit dichtem Raster aus Injektionspackern für eine Flächeninjektage',
  'flaecheninjektage-bohrbild-wand.webp': 'Vorbereitete Wandfläche mit Bohrpunkten für die Flächeninjektage',
  'flaecheninjektage-raum.jpeg': 'Sanierter Kellerraum mit freigelegtem historischem Mauerwerk an einer Wand',
  'flaecheninjektage-ausfuehrung.jpeg': 'Facharbeiter bei der Gelinjektion über zahlreiche Packer in einer Kellerwand',
  'flaecheninjektage-wandflaeche.jpeg': 'Große Kellerwand mit systematisch gesetzten Packern für die Flächeninjektage',
  'ueberbaute-bereiche-sprinklerbecken.webp': 'Technikraum mit Sprinklerbehälter als Beispiel für einen schwer zugänglichen Abdichtungsbereich',
  'horizontalsperre-injektionsbehaelter-mauerwerk.webp': 'Reihe von Injektionsbehältern zur Herstellung einer Horizontalsperre im Mauerwerk',
  'horizontalsperre-injektion-kellerwand.webp': 'Horizontalsperre mit gleichmäßig angeordneten Injektionsbehältern entlang einer Kellerwand',
  'rissinjektion-injektionspacker-decke.webp': 'Injektionspacker an einem Riss im Deckenanschluss eines Betonbauteils',
  'rissinjektion-packerreihe-bauteilfuge.webp': 'Reihe gesetzter Injektionspacker entlang einer Bauteilfuge an der Kellerdecke',
  'rissinjektion-injektionspacker-wand.webp': 'Injektionspacker in einer Betonwand am Wand-Boden-Anschluss',
  'rissinjektion-betonboden-riss.webp': 'Markierter Rissverlauf in einem Betonboden vor der Injektion',
  'sanierputz-kellerwand-fertig.webp': 'Fertig verputzte Kellerwand nach dem Aufbau eines Sanierputzsystems',
  'sanierputz-mauerwerk-vorbereitung.webp': 'Freigelegtes Kellerziegelmauerwerk mit vorbereiteter Sockelzone für Sanierputz',
  'sanierputz-kellerwand-altputz-entfernt.webp': 'Kellerwand nach dem Entfernen von geschädigtem und salzbelastetem Altputz',
  'schwammbekaempfung-echter-hausschwamm.webp': 'Pilzgeflecht und Fruchtkörper eines Hausschwamms an feuchtem Mauerwerk',
  'schwammbekaempfung-geschaedigtes-mauerwerk.webp': 'Freigelegter Wand-Boden-Bereich mit durch Feuchtigkeit und Schwamm geschädigter Bausubstanz',
  'spiralanker-fassade-sanierung.webp': 'Eingerüstete Fassade während einer Risssanierung mit Spiralankern',
  'spiralanker-risssanierung-mauerwerk.webp': 'Freigelegte Mauerwerksfugen mit eingesetzten Spiralankern über einem Riss',
  'spiralanker-mauerwerk-verstaerkung-fertig.webp': 'Mit Spiralankern verstärkte und anschließend geschlossene Mauerwerksfugen',
  'qualifikation-abdichtungsschein-pmbc-mds-fpd.webp': 'Urkunde zum Qualifikationsnachweis Abdichtungsschein für PMBC, MDS und FPD',
  'qualifikation-fachkraft-injektionstechnik-kiwa.webp': 'KIWA-Teilnahmezertifikat zur Fachkraft für Injektionstechnik',
  'qualifikation-sivv-bescheinigung-grundausbildung.webp': 'Bescheinigung über die SIVV-Grundausbildung zum Schutz und zur Instandsetzung von Betonbauteilen',
  'qualifikation-sivv-weiterbildung.webp': 'Bescheinigung über eine anerkannte SIVV-Weiterbildung',
  'qualifikation-koester-weiterbildung-2026.webp': 'KÖSTER-Zertifikat über eine Fachschulung zu Abdichtung und Bautenschutz im Jahr 2026',
  'qualifikation-koester-weiterbildung-2025.webp': 'KÖSTER-Zertifikat über eine Fachschulung zu Abdichtung und Bautenschutz im Jahr 2025',
  'qualifikation-koester-weiterbildung-2024.webp': 'KÖSTER-Zertifikat über eine Fortbildung zu Injektion, Abdichtung und Mauerwerkssanierung im Jahr 2024',
  'qualifikation-koester-systempartner-gold-2026.webp': 'Urkunde KÖSTER Systempartner Gold für BT Bautenschutz im Jahr 2026',
  'qualifikation-koester-systempartner-gold-2025.webp': 'Urkunde KÖSTER Systempartner Gold für BT Bautenschutz im Jahr 2025',
  'qualifikation-koester-systempartner-gold-2024.webp': 'Urkunde KÖSTER Systempartner Gold für BT Bautenschutz im Jahr 2024'
});
const mediaAlt = (value, fallback = '') => imageDescriptions[String(value).split('/').pop()] || fallback;
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const headingEsc = (value = '') => esc(value).replaceAll('-', '&#8209;');
const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const slugText = (value = '') => stripHtml(value).toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const absolute = (value = '') => value.startsWith('http') ? value : `https://www.bt-bautenschutz.de${value}`;
const xmlEsc = (value = '') => esc(value).replace(/'/g, '&apos;');

const contact = {
  phoneDisplay: '(030) 567 02 195',
  phoneHref: '+493056702195',
  email: 'info@bt-bautenschutz.de',
  street: 'Mädewalder Weg 2',
  postal: '12621 Berlin'
};

const services = [
  {
    slug: 'bauwerksabdichtung',
    title: 'Bauwerksabdichtung',
    kicker: 'Schutz von außen',
    headline: 'Wasser draußen halten. Werte erhalten.',
    card: 'Abdichtungssysteme für erdberührte Bauteile – passend zu Untergrund und Wassereinwirkung.',
    description: 'Professionelle Bauwerksabdichtung in Berlin und Brandenburg: abgestimmte Systeme für Keller, Wände, Bodenplatten und besondere Bauteile.',
    image: 'bauwerksabdichtung-kellerwand-fertig.webp',
    alt: 'Fachgerecht ausgeführte Außenabdichtung an einem Keller',
    intro: 'Eine dauerhafte Abdichtung beginnt nicht beim Material, sondern bei der richtigen Beurteilung des Bauteils. Wir prüfen Untergrund, Feuchtebelastung, Anschlüsse und mögliche Rissbewegungen, bevor wir ein geeignetes System empfehlen.',
    symptoms: [
      ['Feuchte Kellerwände', 'Dunkle Stellen, Ausblühungen oder abplatzender Putz können auf seitlich eindringende Feuchtigkeit hinweisen.'],
      ['Undichte Anschlüsse', 'Übergänge an Bodenplatte, Sockel, Türen oder Leitungen sind typische Schwachstellen.'],
      ['Alte Außenabdichtung', 'Bestehende Beschichtungen können verspröden, beschädigt sein oder nicht mehr zum Lastfall passen.'],
      ['Risse im Bauteil', 'Bewegungen im Untergrund erfordern eine Abdichtung, die zum Schadensbild und zur Konstruktion passt.']
    ],
    benefits: [
      ['System statt Einzelmaßnahme', 'Abdichtung, Untergrundvorbereitung und Detailanschlüsse werden aufeinander abgestimmt.'],
      ['Passend zum Lastfall', 'Die Lösung berücksichtigt Bauteil, Wassereinwirkung, Untergrund und Nutzung.'],
      ['Saubere Dokumentation', 'Sie erhalten eine nachvollziehbare Empfehlung und klar erläuterte Arbeitsschritte.']
    ],
    sections: [
      ['Für jeden Lastfall die passende Lösung', 'Die Auswahl des Abdichtungssystems wird von der Beschaffenheit des Untergrunds, der Zugänglichkeit, den Umwelteinflüssen und der Wassereinwirkung bestimmt. Bei rissgefährdeten Untergründen kann eine rissüberbrückende Lösung erforderlich sein. Bei feuchten Flächen müssen Materialien eingesetzt werden, die für diese Situation vorgesehen sind.'],
      ['Positivabdichtung an Keller und Bauteil', 'Kelleraußenabdichtungen liegen auf der wasserzugewandten Seite des Bauteils und werden als Positivabdichtungen bezeichnet. Entscheidend sind eine tragfähige Vorbereitung, sichere Übergänge und eine Ausführung nach den jeweiligen System- und Herstellervorgaben.']
    ],
    gallery: ['bauwerksabdichtung-altbestand-freigelegt.webp', 'bauwerksabdichtung-perimeterdaemmung.webp', 'bauwerksabdichtung-mineralische-abdichtung.webp']
  },
  {
    slug: 'horizontalsperre',
    title: 'Horizontalsperre',
    kicker: 'Aufsteigende Feuchtigkeit',
    headline: 'Feuchtigkeit im Mauerwerk gezielt stoppen.',
    card: 'Nachträgliche Sperrebene gegen kapillar aufsteigende Feuchtigkeit in bestehendem Mauerwerk.',
    description: 'Horizontalsperre gegen aufsteigende Feuchtigkeit: fachgerechte Mauerwerksinjektion und Saugwinkelverfahren von BT Bautenschutz.',
    image: 'horizontalsperre-injektionsbehaelter-mauerwerk.webp',
    alt: 'Horizontalsperre im Saugwinkelverfahren an einem Mauerwerk',
    intro: 'Feuchtigkeit kann über feine Poren und Kapillaren im Mauerwerk nach oben wandern. Eine nachträgliche Horizontalsperre unterbricht diesen Transport und schützt die Bausubstanz vor weiteren Schäden.',
    symptoms: [
      ['Feuchte Sockelzone', 'Flecken und Verfärbungen zeigen sich vor allem im unteren Wandbereich.'],
      ['Salzausblühungen', 'Beim Austrocknen kristallisieren Salze an der Oberfläche und schädigen Putz und Anstrich.'],
      ['Abplatzender Putz', 'Dauerhafte Feuchtigkeit kann Fugen, Ziegel und vorhandene Beschichtungen angreifen.'],
      ['Muffiger Geruch', 'Erhöhte Feuchte im Keller oder Erdgeschoss belastet das Raumklima.']
    ],
    benefits: [
      ['Ursache zuerst prüfen', 'Nicht jede feuchte Wand entsteht durch kapillar aufsteigende Feuchtigkeit.'],
      ['Materialschonendes Verfahren', 'Beim Saugwinkelverfahren wird die Injektionsflüssigkeit kontrolliert und drucklos eingebracht.'],
      ['Nachhaltiges Gesamtkonzept', 'Sperrebene, Salzbelastung und anschließender Putzaufbau werden zusammen betrachtet.']
    ],
    sections: [
      ['Das Saugwinkelverfahren', 'Nach der Analyse werden Bohrungen passend zu Wandstärke und Mauerwerk vorbereitet. Über Saugwinkel und Kapillarstäbchen gelangt die Injektionsflüssigkeit gleichmäßig in den Wandquerschnitt. Dort bildet sie eine wasserabweisende Sperrebene gegen den weiteren kapillaren Feuchtetransport.'],
      ['Warum die Voruntersuchung entscheidend ist', 'Seitlich eindringende Feuchtigkeit, Kondensat, beschädigte Außenabdichtungen oder Leitungswasserschäden können ähnliche Spuren verursachen. Darum steht vor jeder Maßnahme die fachgerechte Einschätzung des Schadensbildes.']
    ],
    gallery: ['horizontalsperre-injektion-kellerwand.webp', 'horizontalsperre-injektionsbehaelter-mauerwerk.webp']
  },
  {
    slug: 'flaecheninjektage',
    title: 'Flächeninjektage',
    kicker: 'Abdichtung im Bauteil',
    headline: 'Schwer zugängliche Flächen von innen abdichten.',
    card: 'Flächenabdichtung des Mauerwerks mit Injektionsgel – ohne großflächiges Freilegen von außen.',
    description: 'Flächeninjektage mit Acry­latgel für schwer zugängliche oder überbaute Kellerwände in Berlin und Brandenburg.',
    image: 'flaecheninjektage-wandflaeche.jpeg',
    alt: 'Großflächig vorbereitete Kellerwand für eine Flächeninjektage',
    intro: 'Ist eine Außenabdichtung wegen angrenzender Bebauung, Terrassen oder anderer Hindernisse nicht wirtschaftlich oder nicht möglich, kann eine Flächeninjektage eine wirkungsvolle Alternative sein.',
    symptoms: [
      ['Außenwand nicht erreichbar', 'Garagen, Anbauten oder Terrassen verhindern das Freilegen der Wand.'],
      ['Flächiger Feuchteeintritt', 'Feuchtigkeit zeigt sich nicht nur an einem einzelnen Riss, sondern über größere Wandbereiche.'],
      ['Undichte Fugen', 'Bauteilfugen und poröse Bereiche können Wasserwege im Mauerwerk bilden.'],
      ['Nutzungsbeeinträchtigung', 'Keller- und Technikräume sollen ohne umfangreiche Erdarbeiten geschützt werden.']
    ],
    benefits: [
      ['Von innen ausführbar', 'Die Außenfläche muss in geeigneten Fällen nicht vollständig freigelegt werden.'],
      ['Gezielte Rasterinjektion', 'Bohrbild und Materialmenge werden an Bauteil und Schadensbereich angepasst.'],
      ['Flexibles Abdichtungsgel', 'Das Gel verteilt sich in Hohlräumen und bildet eine Abdichtungsebene.']
    ],
    sections: [
      ['Wie eine Flächeninjektage funktioniert', 'Über ein geplantes Bohrraster wird ein niedrigviskoses Gel in oder hinter das Bauteil eingebracht. Die Injektionspunkte werden so angeordnet, dass eine möglichst zusammenhängende Abdichtungsebene entsteht. Druck, Materialmenge und Reaktion werden während der Ausführung kontrolliert.'],
      ['Geeignet für besondere Bausituationen', 'Das Verfahren wird vor allem dann geprüft, wenn die wasserzugewandte Seite nicht erreichbar ist. Ob eine Flächeninjektage technisch sinnvoll ist, hängt von Aufbau, Durchfeuchtung, Hohlräumen und der Ursache des Wassereintritts ab.']
    ],
    gallery: ['flaecheninjektage-raum.jpeg', 'flaecheninjektage-ausfuehrung.jpeg', 'flaecheninjektage-wandflaeche.jpeg']
  },
  {
    slug: 'negativabdichtung',
    title: 'Negativabdichtung',
    kicker: 'Abdichtung von innen',
    headline: 'Innen abdichten, wenn außen kein Weg ist.',
    card: 'Mineralische Innenabdichtung für Bauteile, deren wasserzugewandte Seite nicht zugänglich ist.',
    description: 'Negativabdichtung von Kellerwänden und schwer zugänglichen Bauteilen durch BT Bautenschutz in Berlin und Brandenburg.',
    image: 'sanierputz-mauerwerk-vorbereitung.webp',
    alt: 'Vorbereitete Kellerinnenwand für eine Negativabdichtung',
    intro: 'Eine Negativabdichtung wird auf der dem Wasser abgewandten Seite ausgeführt. Sie kommt in Betracht, wenn die Außenfläche nicht freigelegt werden kann oder eine Abdichtung von außen unverhältnismäßig wäre.',
    symptoms: [
      ['Überbaute Außenflächen', 'Terrassen, Garagen oder Nachbarbebauung begrenzen den Zugang.'],
      ['Feuchte Innenflächen', 'Wasser drückt durch Wandflächen, Fugen oder Anschlüsse in den Raum.'],
      ['Mineralischer Untergrund', 'Der Untergrund muss für das geplante Abdichtungssystem vorbereitet und tragfähig sein.'],
      ['Belastete Details', 'Wand-Boden-Anschlüsse und Durchdringungen benötigen besondere Aufmerksamkeit.']
    ],
    benefits: [
      ['Ohne vollständiges Aufgraben', 'Geeignete Bauteile lassen sich von der Raumseite bearbeiten.'],
      ['Mineralischer Systemaufbau', 'Vorbereitung, Dichtungsschichten und Anschlussdetails greifen ineinander.'],
      ['Individuelle Beurteilung', 'Die Lösung wird erst nach Prüfung von Ursache und Wassereinwirkung festgelegt.']
    ],
    sections: [
      ['Hohe Anforderungen an Untergrund und Details', 'Da der Wasserdruck hinter der Abdichtungsebene ansteht, sind Haftung, Untergrundvorbereitung und eine geschlossene Ausführung besonders wichtig. Lose Bestandteile, ungeeignete Altbeschichtungen und geschädigte Fugen werden vor dem Systemaufbau bearbeitet.'],
      ['Nicht jede Innenabdichtung ist gleich', 'Eine fachgerechte Negativabdichtung kann aus mehreren abgestimmten Schichten bestehen. Welche Materialien und Arbeitsschritte erforderlich sind, ergibt sich aus Bauteil, Belastung und gewünschter Nutzung des Raums.']
    ],
    gallery: ['sanierputz-mauerwerk-vorbereitung.webp', 'sanierputz-kellerwand-fertig.webp']
  },
  {
    slug: 'injektion',
    title: 'Injektion',
    kicker: 'Wasserwege schließen',
    headline: 'Wasser stoppen. Risse dauerhaft verschließen.',
    card: 'Gezielte Injektionen zur Rissabdichtung, Hohlraumverfüllung und elastischen Verbindung.',
    description: 'Injektionsarbeiten zur Rissabdichtung und Hohlraumverfüllung: zielgerichtete Lösungen von BT Bautenschutz.',
    image: 'rissinjektion-betonboden-riss.webp',
    alt: 'Injektionspacker an einer Beton- und Mauerwerksfläche',
    intro: 'Risse, Fugen und Hohlräume können zu direkten Wasserwegen werden. Mit abgestimmten Injektionsstoffen lassen sich diese Bereiche gezielt füllen, abdichten oder kraftschlüssig verbinden.',
    symptoms: [
      ['Aktiver Wassereintritt', 'Wasser tritt punktuell oder entlang von Rissen und Arbeitsfugen ein.'],
      ['Feine bis breite Risse', 'Rissverlauf und Bewegung bestimmen die Auswahl des Injektionsmaterials.'],
      ['Hohlstellen', 'Hinter Bauteilen oder in Fugen können unkontrollierte Hohlräume liegen.'],
      ['Undichte Arbeitsfugen', 'Übergänge im Betonbau sind häufig besonders beansprucht.']
    ],
    benefits: [
      ['Gezielter Eingriff', 'Das Material wird über gesetzte Packer direkt in den Schadensbereich eingebracht.'],
      ['Passendes Reaktionsverhalten', 'Elastische oder kraftschlüssige Stoffe werden nach Schadensbild ausgewählt.'],
      ['Kontrollierte Ausführung', 'Injektionsdruck und Materialaustritt werden während der Arbeit beobachtet.']
    ],
    sections: [
      ['Materialwahl nach Aufgabe', 'Schnell reagierende Harze können bei aktivem Wasser eingesetzt werden, elastische Systeme Bewegungen aufnehmen und andere Stoffe Hohlräume verfüllen oder Risse kraftschlüssig verbinden. Eine pauschale Lösung gibt es daher nicht.'],
      ['Von der Rissanalyse zur Injektion', 'Vor Beginn werden Verlauf, Breite, Feuchtezustand und mögliche Bewegung bewertet. Anschließend werden Packer gesetzt und das Material kontrolliert eingebracht. Nach dem Aushärten werden die Injektionsstellen fachgerecht geschlossen.']
    ],
    gallery: ['rissinjektion-packerreihe-bauteilfuge.webp', 'rissinjektion-injektionspacker-wand.webp', 'rissinjektion-injektionspacker-decke.webp']
  },
  {
    slug: 'ueberbaute-bereiche',
    title: 'Überbaute Bereiche',
    kicker: 'Spezialabdichtung',
    headline: 'Lösungen für Bauteile ohne Außenzugang.',
    card: 'Innenliegende Abdichtungskonzepte für Außenwände hinter Garagen, Terrassen oder Anbauten.',
    description: 'Abdichtung überbauter und von außen schwer zugänglicher Bereiche mit Injektions- und Innenabdichtungssystemen.',
    image: 'ueberbaute-bereiche-sprinklerbecken.webp',
    alt: 'Injektionsarbeit an einer schwer zugänglichen Wandfläche',
    intro: 'Garagen, Terrassen, Anbauten oder Teilunterkellerungen können eine klassische Außenabdichtung verhindern. Dann werden Verfahren benötigt, die zur baulichen Situation und zum vorhandenen Wasserweg passen.',
    symptoms: [
      ['Garage direkt am Haus', 'Die Kelleraußenwand kann ohne Rückbau nicht freigelegt werden.'],
      ['Terrasse oder Anbau', 'Nutzflächen und Konstruktionen liegen über dem betroffenen Bauteil.'],
      ['Teilunterkellerung', 'Übergänge zwischen Bauteilen erzeugen komplizierte Anschlussbereiche.'],
      ['Unwirtschaftlicher Aushub', 'Die Kosten und Eingriffe einer Freilegung stehen nicht im Verhältnis zum Ziel.']
    ],
    benefits: [
      ['Mehrere Verfahren kombinierbar', 'Flächeninjektage, Negativabdichtung und Detailinjektion können zusammenspielen.'],
      ['Bestand bleibt weitgehend erhalten', 'Großflächige Rückbau- und Erdarbeiten lassen sich in geeigneten Fällen vermeiden.'],
      ['Planung nach Zugänglichkeit', 'Wir entwickeln den Ausführungsweg aus der tatsächlichen Bausituation.']
    ],
    sections: [
      ['Die Bausituation entscheidet', 'Bei überbauten Flächen muss zuerst geklärt werden, wo Wasser eindringt und welche Ebenen erreichbar sind. Erst daraus ergibt sich, ob eine Abdichtung im Bauteil, auf der Innenseite oder als Kombination sinnvoll ist.'],
      ['Sorgfalt an Übergängen', 'Besondere Aufmerksamkeit gilt Wand-Boden-Anschlüssen, Fugen und Durchdringungen. Diese Details werden in das Abdichtungskonzept einbezogen, damit nicht nur die sichtbare Fläche, sondern der tatsächliche Wasserweg behandelt wird.']
    ],
    gallery: ['ueberbaute-bereiche-sprinklerbecken.webp', 'flaecheninjektage-bohrbild-wand.webp', 'flaecheninjektage-bohrpacker-kellerwand.webp']
  },
  {
    slug: 'bodenabdichtung',
    title: 'Bodenabdichtung',
    kicker: 'Schutz von unten',
    headline: 'Bodenflächen sicher gegen Feuchtigkeit abdichten.',
    card: 'Systemabdichtung auf Bodenplatten und unter Estrich – flexibel, mineralisch und belastbar.',
    description: 'Bodenabdichtung gegen aufsteigende Feuchtigkeit unter Estrich und Bodenbelägen in Berlin und Brandenburg.',
    image: 'bodenabdichtung-keller-flaeche.jpg',
    alt: 'Frisch abgedichtete Bodenfläche mit mineralischem System',
    intro: 'Feuchtigkeit aus dem Untergrund kann Estrich, Bodenbeläge und angrenzende Wände schädigen. Eine fachgerechte Abdichtung bildet eine sichere Trennebene und schützt den weiteren Bodenaufbau.',
    symptoms: [
      ['Feuchte Bodenplatte', 'Wasser oder Wasserdampf gelangt aus dem Untergrund in den Raumaufbau.'],
      ['Geschädigte Beläge', 'Parkett, Teppich oder Beschichtungen lösen sich oder verformen sich.'],
      ['Muffiges Raumklima', 'Erhöhte Feuchte macht sich oft zuerst über Geruch und Kondensat bemerkbar.'],
      ['Belastete Anschlüsse', 'Übergänge von Boden zu Wand müssen in das System einbezogen werden.']
    ],
    benefits: [
      ['Geschlossene Abdichtungsebene', 'Fläche und Wandanschlüsse werden als zusammenhängendes Detail geplant.'],
      ['Geeignet für weitere Aufbauten', 'Das System wird passend zu Estrich, Ausgleich und späterer Nutzung gewählt.'],
      ['Flexible Lösungen', 'Mineralische, polymermodifizierte Systeme können Bewegungen im Untergrund aufnehmen.']
    ],
    sections: [
      ['Warum Abdichtung unter dem Estrich zählt', 'Estrich und viele mineralische Baustoffe können Feuchtigkeit kapillar aufnehmen. Ohne sichere Trennebene sind Schäden häufig erst sichtbar, wenn der fertige Bodenaufbau bereits betroffen ist.'],
      ['Systemaufbau für Fläche und Anschluss', 'Je nach Untergrund kommen geeignete Bahnen, Harze oder flüssig zu verarbeitende Abdichtungsstoffe in Betracht. Wichtig ist eine vollflächige, geschlossene Ausführung mit sorgfältig eingebundenen Rand- und Durchdringungsdetails.']
    ],
    gallery: ['bodenabdichtung-keller-flaeche.jpg']
  },
  {
    slug: 'medieneinfuehrungen',
    title: 'Kabel / Medieneinführung',
    kicker: 'Kabel & Rohre',
    headline: 'Undichte Gebäudeeinführungen sicher schließen.',
    card: 'Abdichtung von Kabel-, Medien- und Rohrdurchführungen – häufig ohne Aufgraben möglich.',
    description: 'Abdichtung undichter Medien- und Gebäudeeinführungen bei Betonwänden – grabenlose Lösungen von innen.',
    image: 'kabel-medieneinfuehrung-abdichtung.jpg',
    alt: 'Abgedichtete Rohr- und Medieneinführung in einer Betonwand',
    intro: 'Wasser, Strom, Abwasser und Telekommunikation werden durch Außenwände in das Gebäude geführt. Versagen Ringraumdichtungen oder Anschlussabdichtungen, kann Feuchtigkeit bis in Keller und Technikräume gelangen.',
    symptoms: [
      ['Feuchte um Kabel oder Rohr', 'Wasser tritt direkt am Übergang zwischen Durchführung und Bauteil ein.'],
      ['Alte Ringraumdichtung', 'Dichtungen können altern, sich setzen oder durch Bewegungen ihre Funktion verlieren.'],
      ['Außenseite schwer erreichbar', 'Leitungsverläufe oder Außenanlagen erschweren das Freilegen.'],
      ['Wiederkehrender Wassereintritt', 'Provisorische Verschlüsse halten Druck und Bewegung häufig nicht dauerhaft stand.']
    ],
    benefits: [
      ['Grabenlose Innenlösung', 'Viele Durchführungen lassen sich von der Keller- oder Technikraumseite sanieren.'],
      ['Für verschiedene Medien', 'Wasser-, Strom-, Abwasser-, Telekommunikations- und Leerrohre können berücksichtigt werden.'],
      ['Detailgenaue Ausführung', 'Bauteil, Rohrmaterial, Ringraum und Wassereinwirkung bestimmen die Lösung.']
    ],
    sections: [
      ['Abdichtung ohne großflächiges Aufgraben', 'Der betroffene Anschluss wird freigelegt, vorbereitet und mit geeigneten Dicht- oder Injektionsstoffen geschlossen. Das kann Zeit, Außenarbeiten und Kosten reduzieren, wenn das Schadensbild eine Ausführung von innen zulässt.'],
      ['Auch für Neubau und Vorsorge', 'Eine fachgerecht geplante Gebäudeeinführung schützt nicht erst im Schadensfall. Wir beraten auch zu geeigneten Anschlussdetails, wenn neue Medienleitungen ergänzt oder bestehende Durchführungen erneuert werden.']
    ],
    gallery: ['kabel-medieneinfuehrung-abdichtung.jpg']
  },
  {
    slug: 'spezielle-bereiche',
    title: 'Spezielle Bereiche',
    kicker: 'Spezialaufgaben',
    headline: 'Besondere Herausforderungen. Individuelle Lösungen.',
    card: 'Spezialaufgaben für besondere Herausforderungen – individuell geplant und fachgerecht umgesetzt.',
    description: 'Individuelle Bautenschutzlösungen für besondere Bauwerke, schwierige Zugänge und ungewöhnliche Anforderungen.',
    image: 'bauwerksabdichtung-kellerwand-vorher.png',
    alt: 'Besondere Bausituation vor einer individuell geplanten Abdichtung',
    intro: 'Historische Bausubstanz, Tiefgaragen, U-Bahnhöfe, Sprinklerbecken oder außergewöhnliche Anschlussdetails passen nicht in ein Standardschema. Wir entwickeln die Lösung aus dem Bauwerk, der Belastung und der tatsächlichen Zugänglichkeit.',
    symptoms: [
      ['Ungewöhnliche Bauteile', 'Form, Material oder Nutzung verlangen einen Aufbau außerhalb üblicher Standarddetails.'],
      ['Erschwerte Zugänglichkeit', 'Enge, überbaute oder technisch belegte Bereiche begrenzen klassische Ausführungswege.'],
      ['Mehrere Schadensursachen', 'Feuchtigkeit, Risse, Fugen und Anschlüsse können sich gegenseitig beeinflussen.'],
      ['Hohe Nutzungsanforderungen', 'Technikräume, Verkehrsflächen oder Sonderbauwerke erfordern eine präzise abgestimmte Ausführung.']
    ],
    benefits: [
      ['Individuell geplant', 'Das Konzept entsteht aus der konkreten Bausituation statt aus einer pauschalen Standardlösung.'],
      ['Verfahren kombinierbar', 'Abdichtung, Injektion und Instandsetzung werden bei Bedarf sinnvoll miteinander verbunden.'],
      ['Details im Mittelpunkt', 'Übergänge, Einbauteile und schwer erreichbare Bereiche werden von Anfang an mitgeplant.']
    ],
    sections: [
      ['Spezialaufgaben brauchen eine klare Analyse', 'Bei besonderen Bauwerken entscheidet die Bestandsaufnahme über den späteren Erfolg. Wir erfassen Aufbau, Wasserwege, Nutzung und Zugänglichkeit und entwickeln daraus einen nachvollziehbaren Ausführungsweg.'],
      ['Besondere Herausforderungen individuell lösen', 'Je nach Befund kombinieren wir geeignete Abdichtungs-, Injektions- und Instandsetzungsverfahren. Ziel ist eine technisch passende Lösung, die sich sauber in den Bestand integrieren lässt.']
    ],
    gallery: ['bauwerksabdichtung-kellerwand-vorher.png', 'rissinjektion-betonboden-riss.webp', 'ueberbaute-bereiche-sprinklerbecken.webp']
  },
  {
    slug: 'sanierputz',
    title: 'Sanierputz',
    kicker: 'Mauerwerk instand setzen',
    headline: 'Feuchte- und Salzschäden fachgerecht aufbauen.',
    card: 'Diffusionsoffener, salzbeständiger Putzaufbau als Teil eines abgestimmten Sanierungskonzepts.',
    description: 'Sanierputz für feuchte und salzbelastete Wände – fachgerechter Putzaufbau nach der Abdichtung.',
    image: 'sanierputz-kellerwand-fertig.webp',
    alt: 'Neu aufgebauter Sanierputz auf einer Kellerwand',
    intro: 'Sanierputz ist keine alleinige Abdichtung. In Verbindung mit einer wirksamen Sperr- oder Abdichtungsmaßnahme unterstützt er die schadensarme Austrocknung salzbelasteten Mauerwerks.',
    symptoms: [
      ['Abplatzender Altputz', 'Feuchte und Salze zerstören vorhandene Putz- und Farbschichten.'],
      ['Salzbelastete Wand', 'Kristallisierende Salze benötigen einen geeigneten Porenraum im neuen Putz.'],
      ['Ungleichmäßiger Untergrund', 'Fehlstellen und ausgewaschene Fugen müssen vorbereitet und ausgeglichen werden.'],
      ['Sanierung nach Abdichtung', 'Nach dem Stoppen der Feuchte braucht die Oberfläche einen passenden Neuaufbau.']
    ],
    benefits: [
      ['Diffusionsoffen', 'Feuchte kann in Form von Wasserdampf aus dem Mauerwerk abgegeben werden.'],
      ['Salzbeständig', 'Die Porenstruktur bietet Raum für Salzkristallisation, ohne sofort sichtbare Schäden zu erzeugen.'],
      ['Abgestimmter Aufbau', 'Voranstrich, Sperrmörtel, Dichtschlämme, Spritzbewurf und Putzlage werden kombiniert.']
    ],
    sections: [
      ['Vorbereitung vor dem neuen Putz', 'Der geschädigte Altputz wird entfernt, Fugen werden ausgekratzt und lose Bestandteile beseitigt. Fehlstellen werden ausgeglichen; erforderliche Abdichtungsebenen und ein haftvermittelnder Spritzbewurf werden vor der Putzlage ausgeführt.'],
      ['Oberfläche passend zur Nutzung', 'Sanierputze sind in unterschiedlichen Ausführungen erhältlich. Für glattere Flächen kann ein geeigneter Feinputz folgen. Anstriche müssen zum diffusionsoffenen System passen und dürfen die Trocknung nicht behindern.']
    ],
    gallery: ['sanierputz-mauerwerk-vorbereitung.webp', 'sanierputz-kellerwand-altputz-entfernt.webp', 'sanierputz-kellerwand-fertig.webp']
  },
  {
    slug: 'betonsanierung',
    title: 'Betonsanierung',
    kicker: 'Instandsetzen & schützen',
    headline: 'Geschädigten Beton fachgerecht instand setzen.',
    card: 'Korrosionsschutz, Reprofilierung und Oberflächenschutz für belastete Betonbauteile.',
    description: 'Professionelle Betonsanierung und Instandsetzung: Schadstellen freilegen, Bewehrung schützen und Beton dauerhaft sichern.',
    image: 'betonsanierung-freigelegte-bewehrung.webp',
    alt: 'Instandsetzung einer geschädigten Betonfläche',
    intro: 'Kohlendioxid, Feuchtigkeit und andere Einflüsse können die alkalische Schutzwirkung des Betons reduzieren. Korrodiert die Bewehrung, entstehen Druck, Risse und Abplatzungen.',
    symptoms: [
      ['Risse im Beton', 'Rissverläufe können auf Belastung, Bewegung oder beginnende Korrosion hinweisen.'],
      ['Abplatzungen', 'Sich lösende Betonbereiche legen die Bewehrung frei und erhöhen das Schadensrisiko.'],
      ['Rostspuren', 'Verfärbungen können auf korrodierende Stahlbewehrung im Bauteil hindeuten.'],
      ['Poröse Oberflächen', 'Witterung und chemische Einflüsse greifen ungeschützte Flächen an.']
    ],
    benefits: [
      ['Schadstelle vollständig bearbeiten', 'Geschädigter Beton wird bis zum tragfähigen Untergrund entfernt.'],
      ['Bewehrung schützen', 'Freiliegender Stahl wird vorbereitet und mit geeignetem Korrosionsschutz behandelt.'],
      ['Betonüberdeckung herstellen', 'Reprofilierung und Oberflächenschutz sichern Form und Funktion.']
    ],
    sections: [
      ['Von der Schadstelle zum tragfähigen Untergrund', 'Lose und geschädigte Bereiche werden sorgfältig freigelegt. Die Bewehrung wird gereinigt, geschützt und die erforderliche Betonüberdeckung mit abgestimmten Instandsetzungsmörteln wiederhergestellt.'],
      ['Oberflächenschutz für längere Nutzungsdauer', 'Ein passendes Schutzsystem reduziert das Eindringen schädigender Stoffe und schützt die sanierte Fläche. Aufbau und Material richten sich nach Bauteil, Exposition und geplanter Nutzung.']
    ],
    gallery: ['betonsanierung-reprofilierung-moertel.webp', 'betonsanierung-korrosionsschaden-bewehrung.webp', 'betonsanierung-freigelegte-bewehrung.webp']
  },
  {
    slug: 'spiralanker',
    title: 'Spiralanker',
    kicker: 'Mauerwerksrisse sanieren',
    headline: 'Rissufer verbinden. Mauerwerk stabilisieren.',
    card: 'Nachträgliche Verstärkung gerissener Mauerwerksbereiche mit Edelstahl-Spiralankern.',
    description: 'Risssanierung mit Spiralankern: kraftschlüssige Verbindung und flexible Verstärkung geschädigten Mauerwerks.',
    image: 'spiralanker-fassade-sanierung.webp',
    alt: 'Spiralanker in einer geöffneten Mauerwerksfuge',
    intro: 'Bloßes Überspachteln reicht bei vielen Mauerwerksrissen nicht aus. Spiralanker verbinden die Rissufer über die Fugen hinweg und verteilen auftretende Spannungen in einen größeren Wandbereich.',
    symptoms: [
      ['Wiederkehrende Risse', 'Nach kosmetischer Reparatur öffnet sich der Riss erneut.'],
      ['Risse entlang von Fugen', 'Der Verlauf im Mauerwerk zeigt eine geschwächte Verbindung.'],
      ['Spannungen im Mauerwerk', 'Setzungen oder Bauteilbewegungen belasten vorhandene Bereiche.'],
      ['Erhalt statt Rückbau', 'Das bestehende Mauerwerk soll gezielt verstärkt werden.']
    ],
    benefits: [
      ['Edelstahl-Spiralanker', 'Korrosionsbeständige Anker werden quer zum Riss in vorbereitete Fugen eingebaut.'],
      ['Spezialmörtel mit Verbund', 'Der abgestimmte Ankermörtel verbindet Anker und Mauerwerk.'],
      ['Flexible Spannungsaufnahme', 'Das System verteilt Belastungen und kann begrenzte Verformungen aufnehmen.']
    ],
    sections: [
      ['Einbau quer zum Rissverlauf', 'Mauerwerksfugen werden in festgelegten Abständen aufgefräst. Spiralanker und Spezialmörtel werden horizontal über den Riss hinweg eingebaut. Anschließend wird die Oberfläche fachgerecht geschlossen.'],
      ['Analyse vor der Verstärkung', 'Vor einer Risssanierung sollte die Ursache beurteilt werden. Spiralanker können geschädigtes Mauerwerk verstärken, ersetzen aber nicht die Klärung fortschreitender Bewegungen oder statischer Ursachen.']
    ],
    gallery: ['spiralanker-risssanierung-mauerwerk.webp', 'spiralanker-mauerwerk-verstaerkung-fertig.webp', 'spiralanker-fassade-sanierung.webp']
  }
];

const regions = [
  {
    slug: 'bauwerksabdichtung-erkner',
    city: 'Erkner',
    postcode: '15537',
    focus: 'Bauwerksabdichtung',
    title: 'Bauwerksabdichtung in Erkner',
    description: 'Professionelle Bauwerksabdichtung in Erkner: Ursachen prüfen, Feuchtigkeit stoppen und Keller sowie Mauerwerk nachhaltig schützen.',
    lead: 'Feuchte Keller, undichte Wand-Boden-Anschlüsse und beschädigte Außenabdichtungen brauchen eine Lösung, die zum Gebäude passt – nicht nur zum sichtbaren Fleck.',
    local: 'In Erkner treffen unterschiedliche Baualter, Kellerkonstruktionen und Grundstückssituationen aufeinander. Wir beurteilen den tatsächlichen Wasserweg und entwickeln daraus eine nachvollziehbare Abdichtungslösung.',
    image: 'bauwerksabdichtung-kellerwand-nachher.png'
  },
  {
    slug: 'bauwerksabdichtung-19',
    city: 'Berlin-Kaulsdorf',
    postcode: '12621',
    focus: 'Bauwerksabdichtung',
    title: 'Bauwerksabdichtung in 12621 Berlin-Kaulsdorf',
    description: 'Bauwerksabdichtung in Berlin-Kaulsdorf: fachgerechter Schutz für Keller, Mauerwerk, Bodenflächen und Gebäudeeinführungen.',
    lead: 'Vom feuchten Keller bis zur undichten Durchführung: BT Bautenschutz ist in Kaulsdorf und im Berliner Osten mit kurzen Wegen für Sie da.',
    local: 'Unser Standort liegt direkt in 12621 Berlin. Das schafft kurze Abstimmungen für Besichtigung, Ursachenanalyse und die anschließende Ausführung im östlichen Stadtgebiet.',
    image: 'bauwerksabdichtung-altbestand-freigelegt.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-erkner', city: 'Erkner', postcode: '15537', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Erkner',
    description: 'Mauerwerkstrockenlegung in Erkner: fachgerechte Analyse und abgestimmte Abdichtung bei feuchten Keller- und Außenwänden.',
    lead: 'Feuchte im Mauerwerk hat viele mögliche Ursachen. Wir unterscheiden aufsteigende, seitlich eindringende und punktuelle Feuchtigkeit, bevor wir eine Maßnahme empfehlen.',
    local: 'Für Gebäude in Erkner verbinden wir regionale Erreichbarkeit mit technischen Verfahren wie Horizontalsperre, Innenabdichtung oder Injektion – passend zum festgestellten Schadensbild.',
    image: 'horizontalsperre-injektionsbehaelter-mauerwerk.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-kaulsdorf', city: 'Berlin-Kaulsdorf', postcode: '12621', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Berlin-Kaulsdorf',
    description: 'Mauerwerkstrockenlegung in Kaulsdorf: schnelle Vor-Ort-Termine und nachhaltige Lösungen für feuchte Keller und Wände.',
    lead: 'Feuchte Sockelzonen, Salzausblühungen und abplatzender Putz sind Warnzeichen, die eine genaue Ursachenprüfung verdienen.',
    local: 'Als Betrieb mit Sitz in Kaulsdorf sind wir unmittelbar vor Ort. Wir prüfen den Bestand, erklären die sinnvollen Optionen und stimmen die Ausführung transparent mit Ihnen ab.',
    image: 'sanierputz-mauerwerk-vorbereitung.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-neuenhagen', city: 'Neuenhagen bei Berlin', postcode: '15366', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Neuenhagen',
    description: 'Mauerwerkstrockenlegung in Neuenhagen bei Berlin: Ursachenanalyse und professionelle Abdichtung für Keller und Mauerwerk.',
    lead: 'Ein feuchter Keller sollte nicht nur optisch behandelt werden. Entscheidend ist, den Wasserweg zu erkennen und die Maßnahme daran auszurichten.',
    local: 'Neuenhagen liegt in unserem direkten Einsatzgebiet östlich von Berlin. So lassen sich Besichtigung, Abstimmung und Ausführung ohne lange Wege organisieren.',
    image: 'rissinjektion-injektionspacker-decke.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-ruedersdorf', city: 'Rüdersdorf bei Berlin', postcode: '15562', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Rüdersdorf',
    description: 'Professionelle Mauerwerkstrockenlegung in Rüdersdorf bei Berlin – individuelle Abdichtungssysteme für feuchte Bauteile.',
    lead: 'Ob aufsteigende Feuchtigkeit, undichte Außenwand oder schwer zugänglicher Kellerbereich: Jede Ursache verlangt ein anderes Vorgehen.',
    local: 'In Rüdersdorf übernehmen wir die fachliche Einschätzung vor Ort und entwickeln eine Lösung, die Untergrund, Zugänglichkeit und spätere Raumnutzung berücksichtigt.',
    image: 'flaecheninjektage-bohrpacker-kellerwand.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-vogelsdorf', city: 'Fredersdorf-Vogelsdorf', postcode: '15370', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Vogelsdorf',
    description: 'Mauerwerkstrockenlegung in Fredersdorf-Vogelsdorf: nachhaltige Lösungen gegen Feuchte, Salze und geschädigten Putz.',
    lead: 'Feuchtigkeit kann von unten, von der Seite oder über einzelne Fugen und Durchdringungen eindringen. Eine saubere Diagnose spart unnötige Arbeiten.',
    local: 'Für Objekte in Fredersdorf-Vogelsdorf bieten wir kurze Anfahrtswege und eine persönliche Betreuung von der Bestandsaufnahme bis zur Übergabe.',
    image: 'bauwerksabdichtung-kellerwand-abgedichtet.webp'
  },
  {
    slug: 'mauerwerkstrockenlegung-zossen', city: 'Zossen', postcode: '15806', focus: 'Mauerwerkstrockenlegung', title: 'Mauerwerkstrockenlegung in Zossen',
    description: 'Mauerwerkstrockenlegung in Zossen: professionelle Abdichtung und Sanierung für feuchte Keller- und Mauerwerksbereiche.',
    lead: 'Bei feuchten Kellerwänden zählen Ursache, Bauteilaufbau und Wassereinwirkung. Wir machen die Entscheidung für das passende Verfahren nachvollziehbar.',
    local: 'Auch in Zossen und im südlichen Brandenburg begleiten wir private, gewerbliche und öffentliche Bauwerke mit abgestimmten Abdichtungs- und Injektionslösungen.',
    image: 'bauwerksabdichtung-mineralische-abdichtung.webp'
  }
];

const regionShowcasePlaces = [...new Map(regions.map((region) => [
  region.city,
  { city: region.city, href: `/${region.slug}/` }
])).values()];

const serviceLinks = services.map((service) => `<a href="/${service.slug}/">${esc(service.title)}</a>`).join('');

const iconArrow = '<span aria-hidden="true">→</span>';

const topbar = () => `<div class="topbar"><div class="shell topbar-inner"><div class="topbar-facts"><span>${contact.street} · ${contact.postal}</span><span>Fachbetrieb für Berlin &amp; Brandenburg</span></div><div class="topbar-links"><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a><a href="mailto:${contact.email}">${contact.email}</a></div></div></div>`;

const header = (active = '') => `<header class="site-header" data-header><div class="shell nav-shell"><a class="brand" href="/" aria-label="BT Bautenschutz Startseite"><img src="${image('bt-bautenschutz-logo.webp')}" width="200" height="30" alt="${esc(mediaAlt('bt-bautenschutz-logo.webp', 'Logo von BT Bautenschutz'))}"></a><nav class="main-nav" data-main-nav aria-label="Hauptnavigation"><a href="/"${active === 'home' ? ' aria-current="page"' : ''}>Startseite</a><details class="nav-dropdown"><summary>Leistungen</summary><div class="dropdown-panel">${serviceLinks}<a class="all-services" href="/service/">Alle Leistungen ${iconArrow}</a></div></details><a href="/ueber-uns/"${active === 'about' ? ' aria-current="page"' : ''}>Über uns</a><a href="/qualifikation/"${active === 'qualification' ? ' aria-current="page"' : ''}>Qualifikation</a><a href="/news/"${active === 'news' ? ' aria-current="page"' : ''}>Wissen</a><a href="/kontakt/"${active === 'contact' ? ' aria-current="page"' : ''}>Kontakt</a></nav><div class="nav-actions"><a class="btn btn-arrow" href="/kontakt/">Schaden prüfen lassen</a><button class="menu-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" data-menu-toggle><span></span></button></div></div></header>`;

const footer = () => `<footer class="site-footer"><div class="shell footer-main"><div class="footer-brand"><div class="footer-logo-panel"><img src="${image('bt-bautenschutz-logo.webp')}" width="200" height="30" alt="${esc(mediaAlt('bt-bautenschutz-logo.webp', 'Logo von BT Bautenschutz'))}"></div><p>Fachgerechte Bauwerksabdichtung, Mauerwerkstrockenlegung und Instandsetzung für private, gewerbliche und öffentliche Bauwerke.</p></div><div><h3>Leistungen</h3><div class="footer-links"><a href="/bauwerksabdichtung/">Bauwerksabdichtung</a><a href="/horizontalsperre/">Horizontalsperre</a><a href="/injektion/">Injektion</a><a href="/betonsanierung/">Betonsanierung</a><a href="/service/">Alle Leistungen</a></div></div><div><h3>Unternehmen</h3><div class="footer-links"><a href="/ueber-uns/">Über uns</a><a href="/qualifikation/">Qualifikationen</a><a href="/news/">Wissen &amp; News</a><a href="/kontakt/">Kontakt</a></div></div><div><h3>Direkter Kontakt</h3><div class="footer-links"><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a><a href="mailto:${contact.email}">${contact.email}</a><span>${contact.street}</span><span>${contact.postal}</span></div></div></div><div class="shell footer-bottom"><span>© <span data-year>2026</span> BT Bautenschutz</span><div class="footer-legal"><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a></div></div></footer><div class="mobile-contact" aria-label="Schnellkontakt"><a href="tel:${contact.phoneHref}">Direkt anrufen</a><a href="/kontakt/">Anfrage senden</a></div><dialog class="image-lightbox" data-lightbox-dialog aria-label="Vergrößerte Bildansicht"><div class="image-lightbox-inner"><button class="image-lightbox-close" type="button" data-lightbox-close aria-label="Bildansicht schließen"><span aria-hidden="true">×</span></button><img data-lightbox-image alt=""><p data-lightbox-caption></p></div></dialog><script src="https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script><script src="/assets/site.js" defer></script>`;

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'BT Bautenschutz',
  url: 'https://www.bt-bautenschutz.de/',
  telephone: contact.phoneHref,
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.street,
    postalCode: '12621',
    addressLocality: 'Berlin',
    addressCountry: 'DE'
  },
  areaServed: ['Berlin', 'Brandenburg']
};

const layout = ({ title, description, content, active = '', canonical = '/', schema = businessSchema, bodyClass = '', socialImage = image('bauwerksabdichtung-kellerwand-nachher.png'), ogType = 'website' }) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow"><meta name="theme-color" content="#0b0c0e"><link rel="canonical" href="https://www.bt-bautenschutz.de${canonical}"><meta property="og:locale" content="de_DE"><meta property="og:type" content="${esc(ogType)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="https://www.bt-bautenschutz.de${canonical}"><meta property="og:image" content="${esc(absolute(socialImage))}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/png" href="${image('bt-bautenschutz-favicon.png')}"><link rel="alternate" type="application/rss+xml" title="BT Bautenschutz – Wissen" href="/feed.xml"><link rel="stylesheet" href="/assets/site.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body class="${esc(bodyClass)}"><a class="skip-link" href="#main">Zum Inhalt springen</a>${topbar()}${header(active)}<main id="main">${content}</main>${footer()}</body></html>`;

const ctaBand = (title = 'Feuchtigkeit entdeckt? Jetzt Ursache klären.') => {
  const heading = title === 'Feuchtigkeit entdeckt? Jetzt Ursache klären.'
    ? '<span class="heading-line">Feuchtigkeit entdeckt?</span><span class="heading-line cta-second-line">Jetzt Ursache klären.</span>'
    : headingEsc(title);
  const headingClass = title === 'Feuchtigkeit entdeckt? Jetzt Ursache klären.' ? ' cta-split' : '';
  return `<section class="cta-band"><div class="shell cta-inner"><h2 class="display${headingClass}">${heading}</h2><div class="cta-actions"><a class="btn btn-light btn-arrow" href="/kontakt/">Schaden prüfen lassen</a><a class="btn btn-dark" href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a></div></div></section>`;
};

const serviceCard = (service, index) => `<a class="service-card reveal" href="/${service.slug}/"><img src="${image(service.image)}" alt="${esc(mediaAlt(service.image, service.alt))}" loading="lazy"><div class="service-card-content"><span class="service-card-index">${String(index + 1).padStart(2, '0')} · ${esc(service.kicker)}</span><h3>${esc(service.title)}</h3><p>${esc(service.card)}</p><span class="service-card-link">Leistung ansehen →</span></div></a>`;

const homePage = () => {
  const content = `<section class="hero"><div class="hero-bg"><img src="${image('bauwerksabdichtung-kellerwand-nachher.png')}" alt="Fertig ausgeführte Außenabdichtung an einem Gebäude"></div><div class="trio-light-rays" data-react-bits="LightRays" aria-hidden="true"><i></i><i></i><i></i></div><div class="shell hero-grid"><div class="hero-copy"><p class="eyebrow eyebrow-light">Bauwerksabdichtung · Berlin &amp; Brandenburg</p><h1 class="display"><span class="hero-line">Bauwerke. Trocken.</span><span class="accent">Dauerhaft geschützt.</span></h1><p class="hero-lead">Feuchtigkeit, Wasser oder Risse am Gebäude? Wir analysieren die Ursache und entwickeln eine fachgerechte Lösung für Keller, Mauerwerk und Beton.</p><div class="hero-actions"><a class="btn btn-arrow" href="/kontakt/">Schaden einschätzen lassen</a><a class="btn btn-ghost" href="tel:${contact.phoneHref}">Direkt anrufen</a></div></div><aside class="hero-trust" aria-label="Qualitätsmerkmale"><div><strong>KÖSTER GOLD 2026</strong><span>Ausgezeichneter Systempartner</span></div><div><strong>FACHLICH QUALIFIZIERT</strong><span>Regelmäßig geschult</span></div><div><strong>BERLIN &amp; BRANDENBURG</strong><span>Regional im Einsatz</span></div></aside></div></section><div class="hero-proof"><div class="proof-item"><strong>Ursache statt Oberfläche</strong><span>Bestandsaufnahme vor der Materialwahl</span></div><div class="proof-item"><strong>Ein Ansprechpartner</strong><span>Von der Analyse bis zur Übergabe</span></div><div class="proof-item"><strong>Passende Systeme</strong><span>Abgestimmt auf Bauteil und Belastung</span></div></div>
  <section class="section diagnosis-section"><div class="shell"><div class="section-heading diagnosis-heading"><div><p class="eyebrow">Vom Schadensbild zur Lösung</p><h2 class="display">Was sehen Sie <span>an Ihrem Bauwerk?</span></h2></div><p>Feuchte Stellen, abplatzender Putz, Risse oder punktueller Wassereintritt geben erste Hinweise. Wählen Sie das passende Schadensbild – wir zeigen mögliche Ursachen und Lösungen.</p></div><div class="diagnosis-grid"><a class="diagnosis-card" href="/horizontalsperre/"><span class="diagnosis-number">01 · MAUERWERK</span><h3>Feuchte Wand im unteren Bereich</h3><p>Aufsteigende Feuchtigkeit, Salze und abplatzender Putz.</p></a><a class="diagnosis-card" href="/bauwerksabdichtung/"><span class="diagnosis-number">02 · KELLER</span><h3>Wasser kommt durch die Außenwand</h3><p>Seitlich eindringende Feuchte und beschädigte Abdichtungen.</p></a><a class="diagnosis-card" href="/injektion/"><span class="diagnosis-number">03 · RISS / FUGE</span><h3>Wasser tritt punktuell ein</h3><p>Undichte Risse, Arbeitsfugen oder Hohlräume im Bauteil.</p></a><a class="diagnosis-card" href="/medieneinfuehrungen/"><span class="diagnosis-number">04 · DURCHFÜHRUNG</span><h3>Feuchte an Kabeln oder Rohren</h3><p>Undichte Ringräume und Gebäudeeinführungen.</p></a></div></div></section>
  <section class="section section-mist"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Unsere Leistungen</p><h2 class="display heading-controlled"><span class="heading-line">Bautenschutz</span><span class="heading-line">mit System.</span></h2></div><p>Von der klassischen Außenabdichtung bis zur Spezialinjektion: Jede Leistung wird auf Untergrund, Belastung und Nutzung abgestimmt.</p></div><div class="services-grid">${services.map(serviceCard).join('')}</div><div style="margin-top:2rem"><a class="btn btn-dark btn-arrow" href="/service/">Alle Leistungen im Überblick</a></div></div></section>
  <section class="featured-split"><div class="featured-media"><img src="${image('bauwerksabdichtung-kellerwand-fertig.webp')}" alt="Detail einer fachgerechten Bauwerksabdichtung" loading="lazy"></div><div class="featured-copy"><p class="eyebrow eyebrow-light">Warum BT Bautenschutz?</p><h2 class="display">Erst verstehen. Dann abdichten.</h2><p>Eine Feuchteerscheinung kann verschiedene Ursachen haben. Deshalb steht bei uns die Bestandsaufnahme vor der Materialentscheidung.</p><ul class="check-list"><li>Persönliche Besichtigung und nachvollziehbare Empfehlung</li><li>Hochwertige, aufeinander abgestimmte Systemprodukte</li><li>Geschultes Fachpersonal und dokumentierte Qualifikationen</li><li>Ausführung für Altbau, Neubau und besondere Bauwerke</li></ul><div><a class="btn btn-light btn-arrow" href="/ueber-uns/">Das Unternehmen kennenlernen</a></div></div></section>
  <section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">So arbeiten wir</p><h2 class="display">Vier Schritte zur passenden Lösung.</h2></div><p>Transparent geplant, sauber ausgeführt und verständlich erklärt – vom ersten Kontakt bis zur Übergabe.</p></div><div class="process-grid"><div class="process-step reveal"><h3>Anfrage &amp; Schadensbild</h3><p>Sie schildern die Situation und senden uns bei Bedarf erste Fotos.</p></div><div class="process-step reveal"><h3>Bestandsaufnahme</h3><p>Wir prüfen Bauteil, Feuchtebild, Zugänglichkeit und mögliche Wasserwege.</p></div><div class="process-step reveal"><h3>Konzept &amp; Ausführung</h3><p>Sie erhalten eine klare Empfehlung; anschließend setzen wir das System fachgerecht um.</p></div><div class="process-step reveal"><h3>Kontrolle &amp; Übergabe</h3><p>Ausführung und Details werden kontrolliert und die nächsten Schritte erläutert.</p></div></div></div></section>
  <section class="section section-mist"><div class="shell compare-layout"><div class="compare-copy"><p class="eyebrow">Vorher / Nachher</p><h2 class="display heading-controlled"><span class="heading-line">Der Unterschied</span><span class="heading-line">liegt im Aufbau.</span></h2><p>Die sichtbare Oberfläche ist nur das Ergebnis. Dahinter stehen Vorbereitung, geschlossene Abdichtungsebenen und sorgfältig ausgeführte Anschlüsse.</p><p class="muted"><strong>Schieben Sie den Regler</strong> und vergleichen Sie Ausgangszustand und fertige Abdichtung.</p><a class="btn btn-dark btn-arrow" href="/bauwerksabdichtung/">Mehr zur Bauwerksabdichtung</a></div><div class="compare-frame" data-compare style="--position:50%"><img src="${image('bauwerksabdichtung-kellerwand-nachher.png')}" alt="Fertige Außenabdichtung nach der Sanierung"><div class="compare-before"><img src="${image('bauwerksabdichtung-kellerwand-vorher.png')}" alt="Freigelegte Kellerwand vor der Abdichtung"></div><span class="compare-label before">Vorher</span><span class="compare-label after">Nachher</span><span class="compare-handle" aria-hidden="true">↔</span><input class="compare-input" type="range" min="0" max="100" value="50" aria-label="Vorher-Nachher-Vergleich verschieben"></div></div></section>
  <section class="section section-dark region-band"><div class="shell region-grid"><div><p class="eyebrow eyebrow-light">Einsatzgebiet</p><h2 class="display heading-controlled"><span class="heading-line">Von Berlin aus</span><span class="heading-line">in die Region.</span></h2><p>Unser Standort in Kaulsdorf ermöglicht kurze Wege in Berlin und weite Teile Brandenburgs.</p></div><div class="region-showcase region-showcase-minimal reveal" data-region-showcase data-places="${esc(JSON.stringify(regionShowcasePlaces))}"><a class="region-showcase-name" data-region-name href="${regionShowcasePlaces[0].href}">${esc(regionShowcasePlaces[0].city)}</a></div></div></section>
  <section class="section"><div class="shell qualification-strip"><div><p class="eyebrow">Qualität, die nachweisbar ist</p><h2 class="display">Fachwissen bleibt in Bewegung.</h2><p class="muted">Regelmäßige Schulungen, anerkannte Qualifikationen und langjährige Systempartnerschaften halten unser Team technisch auf dem aktuellen Stand.</p><a class="btn btn-dark btn-arrow" href="/qualifikation/">Qualifikationen ansehen</a></div><div class="qualification-cards"><div class="qualification-mini"><span>2026</span><h3>KÖSTER GOLD-Systempartner</h3><p>Erneute Auszeichnung für Zusammenarbeit und Ausführungsqualität.</p></div><div class="qualification-mini"><span>SIVV</span><h3>Beton schützen &amp; instand setzen</h3><p>Ausbildung und regelmäßige Weiterbildung im Bereich Betonbauteile.</p></div><div class="qualification-mini"><span>PMBC · MDS · FPD</span><h3>Abdichtungsschein</h3><p>Qualifikation für erdberührte Abdichtungen mit flüssigen Systemen.</p></div><div class="qualification-mini"><span>INJEKTION</span><h3>Fachkraft für Vergelung</h3><p>Theorie und Praxis für fachgerechte Injektionen mit Gelen.</p></div></div></div></section>${ctaBand()}`;
  return layout({
    title: 'Bauwerksabdichtung in Berlin & Brandenburg | BT Bautenschutz',
    description: 'BT Bautenschutz schützt Bauwerke in Berlin und Brandenburg vor Feuchtigkeit, Wasser und Rissen – mit fachgerechter Analyse und abgestimmten Abdichtungssystemen.',
    content,
    active: 'home',
    canonical: '/'
  });
};

const pageHero = ({ kicker, title, lead, imageName, alt, breadcrumb = '' }, extraClass = '') => `<section class="page-hero ${extraClass}"><img src="${image(imageName)}" alt="${esc(mediaAlt(imageName, alt))}"><div class="shell page-hero-inner"><div class="breadcrumbs"><a href="/">Startseite</a><span>/</span>${breadcrumb}</div><p class="eyebrow eyebrow-light">${esc(kicker)}</p><h1 class="display">${headingEsc(title)}</h1><p class="lead">${esc(lead)}</p></div></section>`;

const processSection = () => `<section class="section section-mist"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Der Ablauf</p><h2 class="display">Von der Ursache zur Ausführung.</h2></div><p>Welche Schritte im Detail nötig sind, hängt vom Bauteil ab. Der grundsätzliche Weg bleibt transparent.</p></div><div class="process-grid"><div class="process-step"><h3>Schadensbild aufnehmen</h3><p>Sichtbare Spuren, betroffene Flächen und bauliche Situation erfassen.</p></div><div class="process-step"><h3>Ursache eingrenzen</h3><p>Wasserweg, Untergrund, Belastung und Zugänglichkeit beurteilen.</p></div><div class="process-step"><h3>System festlegen</h3><p>Materialien und Details passend zum Befund miteinander abstimmen.</p></div><div class="process-step"><h3>Fachgerecht umsetzen</h3><p>Untergrund vorbereiten, Leistung ausführen und Ergebnis kontrollieren.</p></div></div></div></section>`;

const faqSection = (service) => `<section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Häufige Fragen</p><h2 class="display">Kurz erklärt.</h2></div><p>Eine verlässliche Aussage zum konkreten Gebäude ist erst nach der Bestandsaufnahme möglich.</p></div><div class="faq-list"><details><summary>Ist ${esc(service.title)} bei jedem feuchten Keller die richtige Lösung?</summary><div class="faq-answer"><p>Nein. Ähnliche Feuchtebilder können unterschiedliche Ursachen haben. Erst die Beurteilung von Bauteil, Wasserweg und Belastung zeigt, welches Verfahren sinnvoll ist.</p></div></details><details><summary>Muss die Außenwand immer aufgegraben werden?</summary><div class="faq-answer"><p>Nicht zwingend. Je nach Schadensbild und Zugänglichkeit können Innenabdichtungen oder Injektionsverfahren infrage kommen. Die technisch passende Lösung wird vor Ort geprüft.</p></div></details><details><summary>Wie schnell kann eine Maßnahme beginnen?</summary><div class="faq-answer"><p>Das hängt von Ausmaß, Materialbedarf, Trocknungsschritten und aktueller Terminlage ab. Nach der Besichtigung erhalten Sie einen nachvollziehbaren Ablauf.</p></div></details></div></div></section>`;

const servicePage = (service, index) => {
  const related = [services[(index + 1) % services.length], services[(index + 3) % services.length], services[(index + 6) % services.length]];
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.description,
    provider: businessSchema, areaServed: ['Berlin', 'Brandenburg'], url: `https://www.bt-bautenschutz.de/${service.slug}/`
  };
  const content = `${pageHero({ kicker: service.kicker, title: service.headline, lead: service.intro, imageName: service.image, alt: service.alt, breadcrumb: `<a href="/service/">Leistungen</a><span>/</span><span>${esc(service.title)}</span>` })}
  <section class="section"><div class="shell problem-grid"><div class="sticky-title"><p class="eyebrow">Typische Anzeichen</p><h2 class="display">Wann sollten Sie handeln?</h2><p class="muted">Frühe Hinweise ernst zu nehmen hilft, Folgeschäden an Oberfläche und Bausubstanz zu begrenzen.</p></div><div class="symptom-list">${service.symptoms.map(([title, text]) => `<div class="symptom reveal"><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`).join('')}</div></div></section>
  <section class="section section-mist"><div class="shell content-split"><article class="prose"><p class="eyebrow">Unsere Lösung</p><h2>${esc(service.title)} mit abgestimmtem System.</h2><p class="lead">${esc(service.intro)}</p>${service.sections.map((section) => `<h3>${esc(section[0])}</h3><p>${esc(section[1])}</p>`).join('')}<div class="benefit-grid">${service.benefits.map(([title, text]) => `<div class="benefit"><b>${esc(title)}</b><p>${esc(text)}</p></div>`).join('')}</div></article><aside class="aside-card"><p class="eyebrow eyebrow-light">Direkt klären</p><h3>Passt diese Lösung zu Ihrem Gebäude?</h3><p>Schildern Sie uns kurz das Schadensbild. Fotos helfen bei einer ersten Einordnung.</p><a class="btn btn-light btn-arrow" href="/kontakt/">Unverbindlich anfragen</a><div class="aside-contact"><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a><a href="mailto:${contact.email}">${contact.email}</a></div></aside></div></section>
  ${processSection()}
  <section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Einblicke in die Arbeit</p><h2 class="display">Ausführung im Detail.</h2></div><p>Echte Aufnahmen aus den Arbeitsbereichen von BT Bautenschutz. Bild anklicken, um es zu vergrößern.</p></div><div class="gallery-grid gallery-${service.gallery.length}">${service.gallery.map((item, galleryIndex) => { const galleryAlt = mediaAlt(item, `${service.title} – Arbeitsbeispiel ${galleryIndex + 1}`); return `<figure><button class="gallery-open" type="button" data-lightbox-open data-lightbox-src="${image(item)}" data-lightbox-alt="${esc(galleryAlt)}" aria-label="${esc(galleryAlt)} vergrößern"><img src="${image(item)}" alt="${esc(galleryAlt)}" loading="lazy"><span class="gallery-zoom" aria-hidden="true">+</span></button></figure>`; }).join('')}</div></div></section>
  ${faqSection(service)}
  <section class="section section-mist"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Passende Leistungen</p><h2 class="display">Das könnte ebenfalls relevant sein.</h2></div><p>Abdichtungsaufgaben greifen häufig ineinander. Diese Verfahren können je nach Befund ergänzend infrage kommen.</p></div><div class="related-grid">${related.map((item) => `<a class="related-card" href="/${item.slug}/"><span>${esc(item.kicker)}</span><h3>${esc(item.title)}</h3><b>Mehr erfahren →</b></a>`).join('')}</div></div></section>${ctaBand()}`;
  return layout({ title: `${service.title} in Berlin & Brandenburg | BT Bautenschutz`, description: service.description, content, active: 'services', canonical: `/${service.slug}/`, schema });
};

const servicesPage = () => {
  const content = `${pageHero({ kicker: 'Leistungen', title: 'Bautenschutz mit System.', lead: 'Von der Ursachenanalyse über die passende Abdichtung bis zur fachgerechten Instandsetzung erhalten Sie alle Leistungen abgestimmt aus einer Hand.', imageName: 'bauwerksabdichtung-kellerwand-ausfuehrung.webp', alt: 'Detail einer fachgerecht ausgeführten Bauwerksabdichtung', breadcrumb: '<span>Leistungen</span>' })}<section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Für Keller, Mauerwerk &amp; Beton</p><h2 class="display">Die passende Leistung beginnt mit der richtigen Diagnose.</h2></div><p>Wählen Sie ein Thema aus oder schildern Sie uns direkt das sichtbare Schadensbild. Wir prüfen, welches Verfahren technisch sinnvoll ist.</p></div><div class="services-grid">${services.map(serviceCard).join('')}</div></div></section>${processSection()}${ctaBand()}`;
  return layout({ title: 'Leistungen für Abdichtung & Bautenschutz | BT Bautenschutz', description: 'Alle Leistungen von BT Bautenschutz: Bauwerksabdichtung, Horizontalsperre, Injektion, Sanierputz, Betonsanierung und mehr.', content, active: 'services', canonical: '/service/' });
};

const aboutPage = () => {
  const content = `${pageHero({ kicker: 'Über BT Bautenschutz', title: 'Fachwissen, das Bauwerke schützt.', lead: 'Wenn es um Feuchtigkeit und die Sicherheit Ihres Bauwerks geht, zählt eine Lösung, die sauber begründet und professionell ausgeführt ist.', imageName: 'bauwerksabdichtung-kellerwand-nachher.png', alt: 'Fertiggestellte Abdichtungsarbeit von BT Bautenschutz', breadcrumb: '<span>Über uns</span>' })}<section class="section"><div class="shell content-split"><article class="prose"><p class="eyebrow">Warum wir?</p><h2>Ihr Partner für Abdichtung und Instandsetzung.</h2><p class="lead">Wir verwenden hochwertige Materialien und arbeiten mit abgestimmten Systemen – unter anderem von KÖSTER Abdichtungssysteme und Bauchemie.</p><p>Eine dauerhafte Sanierung verlangt mehr als das Verschließen sichtbarer Stellen. Sie beginnt mit der Beurteilung des Schadens, berücksichtigt den Bauteilaufbau und verbindet Materialwahl, Vorbereitung und Ausführung zu einem nachvollziehbaren Konzept.</p><p>BT Bautenschutz begleitet Projekte an historischen Altbauten, modernen Neubauten, Tiefgaragen, U-Bahnhöfen, Sprinklerbecken und weiteren besonderen Bauwerken. Persönliche Ansprechpartner und klare Empfehlungen sorgen dafür, dass Sie den geplanten Weg verstehen.</p><div class="benefit-grid"><div class="benefit"><b>Persönlich</b><p>Direkte Abstimmung vom ersten Termin bis zur Übergabe.</p></div><div class="benefit"><b>Qualifiziert</b><p>Regelmäßige Schulungen und dokumentierte Fachnachweise.</p></div><div class="benefit"><b>Systematisch</b><p>Materialien und Details passend zum Befund kombiniert.</p></div></div></article><aside class="aside-card"><p class="eyebrow eyebrow-light">Berlin-Kaulsdorf</p><h3>Regional verwurzelt.</h3><p>Von unserem Standort im Mädewalder Weg sind wir in ganz Berlin und weiten Teilen Brandenburgs im Einsatz.</p><a class="btn btn-light btn-arrow" href="/kontakt/">Projekt besprechen</a><div class="aside-contact"><span>${contact.street}</span><span>${contact.postal}</span></div></aside></div></section><section class="featured-split"><div class="featured-media"><img src="${image('bauwerksabdichtung-altbestand-freigelegt.webp')}" alt="Abdichtungsarbeiten an einem erdberührten Bauteil" loading="lazy"></div><div class="featured-copy"><p class="eyebrow eyebrow-light">Unser Anspruch</p><h2 class="display">Nicht irgendeine Lösung. Die passende.</h2><p>Untergründe, Feuchtebelastungen und Zugänglichkeit unterscheiden sich von Gebäude zu Gebäude. Wir erklären, warum wir ein Verfahren empfehlen und welche Arbeitsschritte dafür nötig sind.</p><ul class="check-list"><li>Bestandsaufnahme vor der Materialentscheidung</li><li>Verarbeitung nach System- und Herstellervorgaben</li><li>Saubere Anschlüsse, Übergänge und Detailpunkte</li><li>Realistische Einschätzung statt pauschaler Versprechen</li></ul></div></section>${processSection()}<section class="section"><div class="shell qualification-strip"><div><p class="eyebrow">Weiterbildung</p><h2 class="display">Qualität braucht aktuelles Wissen.</h2><p class="muted">Unser Team bildet sich regelmäßig fort. So verbinden wir bewährte Abdichtungslösungen mit aktuellen Verfahren und technischen Standards.</p><a class="btn btn-dark btn-arrow" href="/qualifikation/">Nachweise &amp; Schulungen</a></div><div class="qualification-cards"><div class="qualification-mini"><span>GOLD 2026</span><h3>KÖSTER Systempartner</h3><p>Langjährige Zusammenarbeit und hohe Ausführungsqualität.</p></div><div class="qualification-mini"><span>SIVV</span><h3>Betoninstandsetzung</h3><p>Ausbildung und wiederkehrende Weiterbildung.</p></div><div class="qualification-mini"><span>PMBC · MDS · FPD</span><h3>Abdichtungsschein</h3><p>Fachliche Qualifikation für erdberührte Abdichtungen.</p></div><div class="qualification-mini"><span>GEL-INJEKTION</span><h3>Fachkraft für Vergelung</h3><p>Praxiswissen für kontrollierte Injektionsarbeiten.</p></div></div></div></section>${ctaBand('Lernen wir Ihr Bauwerk kennen.')}`;
  return layout({ title: 'Über uns | BT Bautenschutz Berlin', description: 'BT Bautenschutz steht für qualifizierte Facharbeit, hochwertige Abdichtungssysteme und persönliche Betreuung in Berlin und Brandenburg.', content, active: 'about', canonical: '/ueber-uns/' });
};

const qualificationPage = () => {
  const privacyNote = 'Aus Gründen des Datenschutzes wurden Namen von Mitarbeitenden und Dokumentennummern in den dargestellten Nachweisen teilweise unkenntlich gemacht. Für weiterführende Informationen stehen wir Ihnen gerne persönlich zur Verfügung.';
  const qualifications = [
    {
      id: 'abdichtungsschein',
      number: '01',
      kicker: 'PMBC · MDS · FPD',
      title: 'Abdichtungsschein',
      summary: 'Qualifikationsnachweis für die Planung und Ausführung erdberührter Abdichtungen mit flüssig zu verarbeitenden Abdichtungsstoffen.',
      image: 'qualifikation-abdichtungsschein-pmbc-mds-fpd.webp',
      entries: [{
        tag: 'Fachnachweis',
        title: 'Erfolgreiche Qualifizierung im Bereich PMBC · MDS · FPD',
        paragraphs: [
          'Der Abdichtungsschein qualifiziert für das Herstellen erdberührter Abdichtungen mit polymermodifizierter Bitumendickbeschichtung, mineralischen Dichtungsschlämmen und flexiblen polymermodifizierten Dickbeschichtungen.',
          'Die Verarbeitung dieser Systeme erfordert besondere fachliche Kenntnisse und Fertigkeiten. Der Lehrgang vermittelt die Grundlagen für Planung und Ausführung an Wohn- und Industriebauten im Neu- und Altbau, damit Bodenfeuchte und drückendes Wasser sicher vom Bauwerk ferngehalten werden.',
          privacyNote
        ],
        images: [{ src: 'qualifikation-abdichtungsschein-pmbc-mds-fpd.webp', caption: 'Qualifikationsnachweis Abdichtungsschein · PMBC · MDS · FPD' }]
      }]
    },
    {
      id: 'fachkraft-vergelung',
      number: '02',
      kicker: 'Injektionstechnik',
      title: 'Fachkraft für Vergelung',
      summary: 'Geprüftes Praxiswissen für Gelinjektionen, Systemauswahl und die kontrollierte Ausführung anspruchsvoller Injektionsarbeiten.',
      image: 'qualifikation-fachkraft-injektionstechnik-kiwa.webp',
      entries: [{
        tag: 'KIWA-Zertifikat',
        title: 'Zertifizierte Fachkraft für Vergelung',
        paragraphs: [
          'Das zweitägige Praxisseminar vermittelt fundiertes Wissen rund um Injektionstechniken mit Gelen – in der Theorie und in der praktischen Anwendung.',
          'Im Mittelpunkt stehen die Auswahl geeigneter Systeme, der fachgerechte Einsatz quellfähiger Materialien sowie die Vermeidung typischer Fehlerquellen und Risiken. Die Inhalte orientieren sich an den aktuellen technischen Merkblättern und Standards der Branche.',
          'Nach der theoretischen Prüfung durch die KIWA GmbH erhalten erfolgreiche Teilnehmende das anerkannte Zertifikat „Fachkraft für Vergelung“.',
          privacyNote
        ],
        images: [{ src: 'qualifikation-fachkraft-injektionstechnik-kiwa.webp', caption: 'KIWA-Zertifikat · Fachkraft für Injektionstechnik' }]
      }]
    },
    {
      id: 'koester-weiterbildung',
      number: '03',
      kicker: 'Regelmäßige Fachschulungen',
      title: 'KÖSTER Weiterbildung',
      summary: 'Wiederkehrende Herstellerseminare zu Negativabdichtung, Mauerwerkssanierung, Injektion und modernen Systemlösungen.',
      image: 'qualifikation-koester-weiterbildung-2026.webp',
      entries: [{
        tag: '2024 bis 2026',
        title: 'Fortbildungsseminare bei KÖSTER',
        paragraphs: [
          'Regelmäßige Fortbildungen halten unser Team bei Materialien, Verfahren und technischen Vorgaben auf dem aktuellen Stand.',
          'Die Schulungen behandeln unter anderem Sockelabdichtung, Horizontalsperren, Bodenabdichtung, Beschichtungen, Injektionsstoffe, Flächenverpressung, nachträgliche Horizontalsperren sowie die Negativabdichtung und Mauerwerkssanierung.',
          'Theorie und praktische Anwendung werden miteinander verbunden, damit neue Erkenntnisse sicher in die tägliche Ausführung einfließen.',
          privacyNote
        ],
        images: [
          { src: 'qualifikation-koester-weiterbildung-2026.webp', caption: 'KÖSTER LIVE erleben · Fachseminar 2026' },
          { src: 'qualifikation-koester-weiterbildung-2025.webp', caption: 'KÖSTER LIVE erleben · Fachseminar 2025' },
          { src: 'qualifikation-koester-weiterbildung-2024.webp', caption: 'KÖSTER-Fortbildungsseminar · 2024' }
        ]
      }]
    },
    {
      id: 'sivv',
      number: '04',
      kicker: 'Betoninstandsetzung',
      title: 'SIVV-Schein',
      summary: 'Grundausbildung und anerkannte Wiederholungsschulung zum Schützen, Instandsetzen, Verbinden und Verstärken von Betonbauteilen.',
      image: 'qualifikation-sivv-bescheinigung-grundausbildung.webp',
      entries: [
        {
          tag: 'Grundqualifikation',
          title: 'SIVV-Bescheinigung',
          paragraphs: [
            'Bereits im Jahr 2012 haben wir die Ausbildung und Bescheinigung im Bereich SIVV erfolgreich abgeschlossen.',
            'Seitdem sind regelmäßige Weiterbildungen für uns selbstverständlich. So bleiben Kenntnisse zu Regelwerken, Produkten, Prüfverfahren und praktischer Ausführung auf dem aktuellen Stand.',
            privacyNote
          ],
          images: [{ src: 'qualifikation-sivv-bescheinigung-grundausbildung.webp', caption: 'SIVV-Bescheinigung · Grundausbildung' }]
        },
        {
          tag: 'Wiederholungsschulung',
          title: 'SIVV-Weiterbildung – Fachliche Qualifikation mit Nachweis',
          paragraphs: [
            'Um die hohen Qualitätsstandards unseres Unternehmens zu sichern, nehmen unsere Fachkräfte regelmäßig an anerkannten Weiterbildungsmaßnahmen teil. Wir haben erfolgreich an der SIVV-Schulung zum Schützen, Instandsetzen, Verbinden und Verstärken von Betonbauteilen teilgenommen.',
            'Die durch den Deutschen Beton- und Bautechnik-Verein E. V. anerkannte Weiterbildung ist ein wichtiger Bestandteil der fachlichen Qualifizierung und muss im Abstand von drei Jahren wiederholt werden.',
            'Theoretische Grundlagen und praktische Anwendungen stellen sicher, dass unser Team mit dem aktuellen Stand der Technik vertraut ist – für eine fachgerechte und langlebige Ausführung im Bautenschutz.',
            privacyNote
          ],
          images: [{ src: 'qualifikation-sivv-weiterbildung.webp', caption: 'Bescheinigung über die anerkannte SIVV-Weiterbildung' }]
        }
      ]
    },
    {
      id: 'koester-systempartner',
      number: '05',
      kicker: 'Systempartnerschaft',
      title: 'KÖSTER GOLD-Systempartner',
      summary: 'Mehrfach ausgezeichnete Systempartnerschaft als Nachweis für technische Kompetenz, Zusammenarbeit und hohe Ausführungsqualität.',
      image: 'qualifikation-koester-systempartner-gold-2026.webp',
      entries: [{
        tag: '2024 bis 2026',
        title: 'Auszeichnung als GOLD-Systempartner der Firma KÖSTER',
        paragraphs: [
          'Im Jahr 2026 wurde BT Bautenschutz erneut von KÖSTER mit dem Status des GOLD-Systempartners ausgezeichnet.',
          'Die Auszeichnung würdigt die langjährige, vertrauensvolle Zusammenarbeit und die konsequent hohe Qualität unserer Leistungen. Sie steht für zuverlässige Ausführung, technische Kompetenz und moderne Systemlösungen im Bautenschutz.',
          'Die wiederholten Auszeichnungen der vergangenen Jahre verstehen wir als Bestätigung unserer Arbeit und als Ansporn, auch künftig höchste Standards in jedem Projekt zu erfüllen.'
        ],
        images: [
          { src: 'qualifikation-koester-systempartner-gold-2026.webp', caption: 'KÖSTER Systempartner Gold · 2026' },
          { src: 'qualifikation-koester-systempartner-gold-2025.webp', caption: 'KÖSTER Systempartner Gold · 2025' },
          { src: 'qualifikation-koester-systempartner-gold-2024.webp', caption: 'KÖSTER Systempartner Gold · 2024' }
        ]
      }]
    }
  ];
  const proofImage = ({ src, caption }) => {
    const alt = mediaAlt(src, caption);
    return `<figure class="qualification-proof"><button type="button" data-lightbox-open data-lightbox-src="${image(src)}" data-lightbox-alt="${esc(alt)}" aria-label="${esc(alt)} vergrößern"><img src="${image(src)}" alt="${esc(alt)}" loading="lazy"><span aria-hidden="true">+</span></button><figcaption>${esc(caption)}</figcaption></figure>`;
  };
  const overviewCards = qualifications.map((qualification) => `<article class="qualification-overview-card reveal"><div class="qualification-overview-media"><img src="${image(qualification.image)}" alt="${esc(mediaAlt(qualification.image, qualification.title))}" loading="lazy"><span>${qualification.number}</span></div><div class="qualification-overview-body"><p class="eyebrow eyebrow-light">${esc(qualification.kicker)}</p><h2>${esc(qualification.title)}</h2><p>${esc(qualification.summary)}</p><button class="qualification-card-open" type="button" data-qualification-open="qualifikation-${qualification.id}" aria-haspopup="dialog" aria-controls="qualifikation-${qualification.id}">Nachweise &amp; Details ansehen <span aria-hidden="true">↗</span></button></div></article>`).join('');
  const dialogs = qualifications.map((qualification) => `<dialog class="qualification-modal" id="qualifikation-${qualification.id}" data-qualification-modal aria-labelledby="qualifikation-${qualification.id}-title"><div class="qualification-modal-shell"><button class="qualification-modal-close" type="button" data-qualification-close aria-label="${esc(qualification.title)} schließen"><span aria-hidden="true">×</span></button><header class="qualification-modal-header"><span class="qualification-modal-number">${qualification.number}</span><div><p class="eyebrow">${esc(qualification.kicker)}</p><h2 id="qualifikation-${qualification.id}-title" class="display">${esc(qualification.title)}</h2><p>${esc(qualification.summary)}</p></div></header><div class="qualification-modal-content">${qualification.entries.map((entry, entryIndex) => `<article class="qualification-history-entry"><div class="qualification-history-copy"><span>${String(entryIndex + 1).padStart(2, '0')} · ${esc(entry.tag)}</span><h3>${esc(entry.title)}</h3>${entry.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div><div class="qualification-proof-grid qualification-proof-grid-${entry.images.length}">${entry.images.map(proofImage).join('')}</div></article>`).join('')}</div></div></dialog>`).join('');
  const content = `${pageHero({ kicker: 'Qualifikationen', title: 'Weiterbildung für höchste Qualität.', lead: 'Regelmäßige Schulungen und anerkannte Fachnachweise sorgen dafür, dass unser Team Verfahren und Regelwerke sicher in die Praxis überträgt.', imageName: 'betonwand-mit-rissen-nahaufnahme.jpeg', alt: 'Massive Gebäudewand als Symbol für dauerhaften Bautenschutz', breadcrumb: '<span>Qualifikationen</span>' })}<section class="section qualification-overview-section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Nachweise &amp; Partnerschaften</p><h2 class="display">Fachwissen, das belegt ist.</h2></div><p>Wählen Sie einen Bereich aus. Die zugehörigen Inhalte, Urkunden und Nachweise aus den vergangenen Jahren öffnen sich in einer eigenen Detailansicht.</p></div><div class="qualification-overview-grid">${overviewCards}</div></div></section>${dialogs}<section class="section section-dark"><div class="shell region-grid"><div><p class="eyebrow eyebrow-light">Unser Versprechen</p><h2 class="display">Wissen wird erst durch saubere Ausführung wertvoll.</h2></div><div><p>Qualifikationen sind für uns kein Wandschmuck. Sie fließen in Diagnose, Materialwahl, Vorbereitung und Kontrolle jeder Maßnahme ein.</p><a class="btn btn-light btn-arrow" href="/kontakt/">Projekt fachlich besprechen</a></div></div></section>${ctaBand()}`;
  return layout({ title: 'Qualifikationen & Weiterbildungen | BT Bautenschutz', description: 'Fachnachweise, Weiterbildungen und Systempartnerschaften von BT Bautenschutz – für hochwertige Abdichtungs- und Instandsetzungsarbeiten.', content, active: 'qualification', canonical: '/qualifikation/' });
};

const regionPage = (region) => {
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: region.title, description: region.description,
    provider: businessSchema, areaServed: { '@type': 'City', name: region.city }, url: `https://www.bt-bautenschutz.de/${region.slug}/`
  };
  const content = `${pageHero({ kicker: `${region.postcode} · ${region.city}`, title: region.title, lead: region.lead, imageName: region.image, alt: `${region.focus} durch BT Bautenschutz`, breadcrumb: `<span>Einsatzgebiet</span><span>/</span><span>${esc(region.city)}</span>` }, 'location-hero')}<section class="section"><div class="shell content-split"><article class="prose"><p class="eyebrow">Regional. Persönlich. Fachgerecht.</p><h2>${esc(region.focus)} beginnt mit der Ursachenanalyse.</h2><p class="lead">${esc(region.local)}</p><p>Feuchte Flecken, Salzausblühungen, Risse oder ein muffiger Geruch sind Hinweise – aber noch keine eindeutige Diagnose. Wir prüfen, ob Wasser kapillar aufsteigt, seitlich durch das Bauteil gelangt oder über Fugen, Risse und Durchdringungen eintritt.</p><h3>Welche Verfahren können infrage kommen?</h3><p>Je nach Befund sind Außenabdichtung, Horizontalsperre, Flächeninjektage, Negativabdichtung, Rissinjektion oder ein neuer Sanierputzaufbau möglich. Ziel ist eine Lösung, die zur Bausubstanz, zur Zugänglichkeit und zur künftigen Nutzung passt.</p><div class="benefit-grid"><div class="benefit"><b>Vor-Ort-Beurteilung</b><p>Bauteil und Schadensbild werden direkt am Objekt betrachtet.</p></div><div class="benefit"><b>Klare Empfehlung</b><p>Sie erfahren, warum ein Verfahren sinnvoll ist und wie es umgesetzt wird.</p></div><div class="benefit"><b>Fachgerechte Ausführung</b><p>Systeme und Details werden abgestimmt und kontrolliert ausgeführt.</p></div></div></article><aside class="aside-card"><p class="eyebrow eyebrow-light">Anfrage aus ${esc(region.city)}</p><h3>Schadensbild prüfen lassen.</h3><p>Beschreiben Sie kurz, wo Feuchtigkeit oder Risse sichtbar sind. Fotos können Sie anschließend per E-Mail mitsenden.</p><a class="btn btn-light btn-arrow" href="/kontakt/">Termin anfragen</a><div class="aside-contact"><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a><a href="mailto:${contact.email}">${contact.email}</a></div></aside></div></section><section class="section section-mist"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Leistungen vor Ort</p><h2 class="display">Von der Abdichtung bis zur Instandsetzung.</h2></div><p>Diese Leistungen sind bei Feuchte- und Bauschäden besonders häufig relevant.</p></div><div class="services-grid">${[services[0], services[1], services[2], services[4], services[9], services[10]].map(serviceCard).join('')}</div></div></section>${processSection()}<section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Fragen zur Region</p><h2 class="display">Gut vorbereitet zum Vor-Ort-Termin.</h2></div><p>Je genauer das sichtbare Schadensbild beschrieben ist, desto gezielter lässt sich die Besichtigung vorbereiten.</p></div><div class="faq-list"><details><summary>Ist BT Bautenschutz in ${esc(region.city)} im Einsatz?</summary><div class="faq-answer"><p>Ja. ${esc(region.city)} gehört zu unserem Einsatzgebiet in Berlin und Brandenburg. Die konkrete Terminplanung stimmen wir nach Ihrer Anfrage direkt mit Ihnen ab.</p></div></details><details><summary>Welche Informationen helfen bei der ersten Anfrage?</summary><div class="faq-answer"><p>Hilfreich sind Baualter, betroffener Gebäudeteil, Zeitpunkt des Auftretens sowie Fotos von Flecken, Rissen, Fugen oder Durchführungen.</p></div></details><details><summary>Kann vorab ein Preis genannt werden?</summary><div class="faq-answer"><p>Eine belastbare Kalkulation setzt voraus, dass Ursache, Fläche, Zugänglichkeit und erforderlicher Systemaufbau bekannt sind. Nach der Bestandsaufnahme kann die Leistung nachvollziehbar eingeordnet werden.</p></div></details></div></div></section>${ctaBand(`${region.focus} in ${region.city} anfragen.`)}`;
  return layout({ title: `${region.title} | BT Bautenschutz`, description: region.description, content, active: '', canonical: `/${region.slug}/`, schema });
};

const blogCard = (post) => `<article class="blog-card reveal" data-blog-card data-category="${slugText(post.category)}" data-search="${esc(`${post.title} ${post.excerpt} ${post.category}`.toLowerCase())}"><a class="blog-card-media" href="/news/${post.slug}/" aria-label="${esc(post.title)} lesen"><img src="${esc(post.image)}" alt="${esc(mediaAlt(post.image, `Beitragsbild zum Thema ${post.title}`))}" loading="lazy"><span>${esc(post.category)}</span></a><div class="blog-card-body"><div class="blog-meta"><time datetime="${post.date}">${post.displayDate}</time><span>${post.readTime} Min. Lesezeit</span></div><h2><a href="/news/${post.slug}/">${headingEsc(post.title)}</a></h2><p>${esc(post.excerpt)}</p><a class="blog-card-link" href="/news/${post.slug}/">Beitrag lesen ${iconArrow}</a></div></article>`;

const newsPage = () => {
  const featured = blogPosts[0];
  const categories = [...new Set(blogPosts.map((post) => post.category))].sort((a, b) => a.localeCompare(b, 'de'));
  const schema = {
    '@context': 'https://schema.org', '@type': 'Blog', name: 'BT Bautenschutz Wissen',
    description: 'Fachwissen zu Bauwerksabdichtung, Feuchtigkeit, Rissen und Sanierung.',
    url: 'https://www.bt-bautenschutz.de/news/',
    publisher: { '@type': 'Organization', name: 'BT Bautenschutz', url: 'https://www.bt-bautenschutz.de/' },
    blogPost: blogPosts.slice(0, 12).map((post) => ({ '@type': 'BlogPosting', headline: post.title, datePublished: post.date, url: `https://www.bt-bautenschutz.de/news/${post.slug}/` }))
  };
  const filters = `<button class="is-active" type="button" data-blog-filter="all" aria-pressed="true">Alle Themen</button>${categories.map((category) => `<button type="button" data-blog-filter="${slugText(category)}" aria-pressed="false">${esc(category)}</button>`).join('')}`;
  const content = `${pageHero({ kicker: 'Wissen & News', title: 'Bauschäden verstehen. Richtig handeln.', lead: 'Praxiswissen rund um Feuchtigkeit, Abdichtung und den dauerhaften Schutz von Bauwerken in Berlin und Brandenburg – verständlich erklärt und laufend ergänzt.', imageName: 'betonwand-rissstruktur-dunkel.jpeg', alt: 'Rissbild in einer Betonwand', breadcrumb: '<span>Wissen &amp; News</span>' })}<section class="section blog-feature-section"><div class="shell"><article class="blog-feature"><div class="blog-feature-media"><img src="${esc(featured.image)}" alt="${esc(mediaAlt(featured.image, `Beitragsbild zum Thema ${featured.title}`))}"><span class="blog-feature-badge">Neu · ${featured.displayDate}</span></div><div class="blog-feature-copy"><p class="eyebrow eyebrow-light">${esc(featured.category)}</p><h2 class="display">${esc(featured.title)}</h2><p>${esc(featured.excerpt)}</p><div class="blog-feature-actions"><a class="btn btn-light btn-arrow" href="/news/${featured.slug}/">Aktuellen Beitrag lesen</a><span>${featured.readTime} Min. Lesezeit</span></div></div></article><div class="blog-facts"><div><strong>${blogPosts.length}</strong><span>Beiträge im Wissensarchiv</span></div><div><strong>31</strong><span>Beiträge der bisherigen Website übernommen</span></div><div><strong>23.10.2026</strong><span>Redaktionsstand</span></div></div></div></section><section class="section section-mist" id="alle-beitraege"><div class="shell" data-blog><div class="section-heading blog-heading"><div><p class="eyebrow">Wissensarchiv</p><h2 class="display">Alle Beiträge auf einen Blick.</h2></div><p>Durchsuchen Sie das Archiv oder filtern Sie nach einem Thema. Jeder Beitrag öffnet sich auf einer eigenen, gut lesbaren Artikelseite.</p></div><div class="blog-tools"><label class="blog-search"><span>Beiträge durchsuchen</span><input type="search" placeholder="z. B. Keller, Riss oder Horizontalsperre" autocomplete="off" data-blog-search></label><div class="blog-filters" aria-label="Beiträge nach Thema filtern">${filters}</div></div><p class="blog-result-count" data-blog-count>${blogPosts.length} Beiträge</p><div class="blog-grid" data-blog-grid>${blogPosts.map(blogCard).join('')}</div><div class="blog-empty" data-blog-empty hidden><h3>Kein passender Beitrag gefunden.</h3><p>Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle Themen“.</p></div><div class="blog-more-wrap"><button class="btn btn-dark btn-arrow" type="button" data-blog-more>Weitere Beiträge anzeigen</button></div></div></section>${ctaBand('Eine Frage zu Ihrem Schadensbild?')}`;
  return layout({ title: 'Wissen: Bauwerksabdichtung & Feuchtigkeit | BT Bautenschutz', description: `${blogPosts.length} Ratgeber und Neuigkeiten zu Feuchtigkeit, Wassereintritt, Rissen, Schimmel und fachgerechter Bauwerksabdichtung in Berlin und Brandenburg.`, content, active: 'news', canonical: '/news/', schema, socialImage: featured.image });
};

const enrichArticleContent = (source) => {
  const headings = [];
  const used = new Map();
  const html = source.replace(/<h2>([\s\S]*?)<\/h2>/g, (match, label) => {
    const title = stripHtml(label);
    if (!title) return match;
    const base = slugText(title) || 'abschnitt';
    const number = (used.get(base) || 0) + 1;
    used.set(base, number);
    const id = number === 1 ? base : `${base}-${number}`;
    headings.push({ id, title });
    return `<h2 id="${id}">${label}</h2>`;
  });
  return { html, headings };
};

const articlePage = (post) => {
  const prepared = enrichArticleContent(post.content);
  const sameCategory = blogPosts.filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category);
  const additional = blogPosts.filter((candidate) => candidate.slug !== post.slug && candidate.category !== post.category);
  const related = [...sameCategory, ...additional].slice(0, 3);
  const toc = prepared.headings.length ? `<nav class="article-toc" aria-label="Inhaltsverzeichnis"><span>In diesem Beitrag</span>${prepared.headings.slice(0, 10).map((heading) => `<a href="#${heading.id}">${esc(heading.title)}</a>`).join('')}</nav>` : '';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: absolute(post.image),
        datePublished: post.date, dateModified: post.date, inLanguage: 'de-DE',
        mainEntityOfPage: `https://www.bt-bautenschutz.de/news/${post.slug}/`,
        author: { '@type': 'Organization', name: 'BT Bautenschutz' },
        publisher: { '@type': 'Organization', name: 'BT Bautenschutz', url: 'https://www.bt-bautenschutz.de/' }
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://www.bt-bautenschutz.de/' },
          { '@type': 'ListItem', position: 2, name: 'Wissen', item: 'https://www.bt-bautenschutz.de/news/' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.bt-bautenschutz.de/news/${post.slug}/` }
        ]
      }
    ]
  };
  const content = `<header class="article-hero"><div class="shell article-hero-grid"><div class="article-hero-copy"><nav class="breadcrumbs" aria-label="Brotkrümelnavigation"><a href="/">Startseite</a><span>/</span><a href="/news/">Wissen</a><span>/</span><span>${esc(post.category)}</span></nav><p class="eyebrow eyebrow-light">${esc(post.category)}</p><h1>${headingEsc(post.title)}</h1><p class="article-deck">${esc(post.excerpt)}</p><div class="article-byline"><span>BT Bautenschutz</span><time datetime="${post.date}">${post.displayDate}</time><span>${post.readTime} Min. Lesezeit</span></div></div><div class="article-hero-media"><img src="${esc(post.image)}" alt="${esc(mediaAlt(post.image, `Beitragsbild zum Thema ${post.title}`))}"><span>${esc(post.category)}</span></div></div></header><section class="section article-section"><div class="shell article-layout"><article class="blog-article">${prepared.html}<div class="article-end"><p class="eyebrow">Nächster Schritt</p><h2>Schadensbild fachlich einordnen lassen.</h2><p>Sie möchten wissen, welches Verfahren zu Ihrem Gebäude passt? Schildern Sie uns die sichtbaren Anzeichen und senden Sie bei Bedarf Fotos mit.</p><a class="btn btn-dark btn-arrow" href="/kontakt/">Unverbindlich anfragen</a></div></article><aside class="article-sidebar">${toc}<div class="article-contact-card"><span>Persönliche Einschätzung</span><h2>Feuchtigkeit oder Riss entdeckt?</h2><p>Wir prüfen Ursache, Bauteil und sinnvolle nächste Schritte.</p><a class="btn btn-light btn-arrow" href="/kontakt/">Schaden prüfen lassen</a><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a></div><a class="article-back" href="/news/">← Alle Beiträge</a></aside></div></section><section class="section section-mist"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Weiterlesen</p><h2 class="display">Passende Beiträge.</h2></div><a class="blog-all-link" href="/news/#alle-beitraege">Zum gesamten Wissensarchiv ${iconArrow}</a></div><div class="blog-grid blog-grid-related">${related.map(blogCard).join('')}</div></div></section>${ctaBand()}`;
  return layout({ title: `${post.title} | BT Bautenschutz`, description: post.excerpt, content, active: 'news', canonical: `/news/${post.slug}/`, schema, bodyClass: 'article-page', socialImage: post.image, ogType: 'article' });
};

const contactPage = () => {
  const options = services.map((service) => `<option value="${esc(service.title)}">${esc(service.title)}</option>`).join('');
  const content = `${pageHero({ kicker: 'Kontakt', title: 'Schildern Sie uns Ihr Schadensbild.', lead: 'Ein paar Angaben zum Gebäude und zur sichtbaren Feuchtigkeit helfen uns bei der ersten Einordnung. Persönlich, direkt und unverbindlich.', imageName: 'betonwand-mit-rissen-nahaufnahme.jpeg', alt: 'Massive Wandoberfläche als Hintergrund für die Kontaktseite', breadcrumb: '<span>Kontakt</span>' })}<section class="section section-mist"><div class="shell contact-grid"><aside class="contact-panel"><p class="eyebrow eyebrow-light">Direkter Draht</p><h2>Wir hören zu und schauen genau hin.</h2><p>Rufen Sie uns an oder senden Sie Ihre Anfrage per E-Mail. Für eine erste Einordnung sind Fotos und eine kurze Beschreibung besonders hilfreich.</p><div class="contact-list"><div class="contact-item"><span>Telefon</span><strong><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a></strong></div><div class="contact-item"><span>E-Mail</span><strong><a href="mailto:${contact.email}">${contact.email}</a></strong></div><div class="contact-item"><span>Adresse</span><strong>${contact.street}<br>${contact.postal}</strong></div><div class="contact-item"><span>Einsatzgebiet</span><strong>Berlin &amp; Brandenburg</strong></div></div></aside><form class="contact-form" action="mailto:${contact.email}" method="post" enctype="text/plain" data-mail-form><p class="eyebrow">Projektanfrage</p><h2>Was können wir für Sie tun?</h2><div class="form-grid"><div class="field"><label for="vorname">Vorname</label><input id="vorname" name="vorname" autocomplete="given-name" required></div><div class="field"><label for="nachname">Nachname</label><input id="nachname" name="nachname" autocomplete="family-name" required></div><div class="field"><label for="telefon">Telefon</label><input id="telefon" name="telefon" type="tel" autocomplete="tel"></div><div class="field"><label for="email">E-Mail</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="field field-full"><label for="service">Worum geht es?</label><select id="service" name="service"><option value="Allgemeine Anfrage">Bitte auswählen</option>${options}</select></div><div class="field field-full"><label for="nachricht">Schadensbild / Nachricht</label><textarea id="nachricht" name="nachricht" placeholder="Wo zeigt sich Feuchtigkeit oder ein Schaden? Seit wann besteht das Problem?" required></textarea></div></div><label class="consent"><input type="checkbox" required><span>Ich habe die <a href="/datenschutz/">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu.</span></label><button class="btn btn-arrow" type="submit">E-Mail-Anfrage vorbereiten</button><p class="form-note">Beim Absenden öffnet sich Ihr E-Mail-Programm. Die Angaben werden von dieser Vorschau nicht auf einem Server gespeichert.</p><p class="form-status" data-form-status aria-live="polite"></p></form></div></section>${ctaBand('Lieber direkt sprechen? Rufen Sie uns an.')}`;
  return layout({ title: 'Kontakt | BT Bautenschutz Berlin', description: 'Kontaktieren Sie BT Bautenschutz für eine persönliche Einschätzung zu Feuchtigkeit, Abdichtung und Bauschäden in Berlin und Brandenburg.', content, active: 'contact', canonical: '/kontakt/' });
};

const impressumPage = () => {
  const content = `${pageHero({ kicker: 'Rechtliches', title: 'Impressum', lead: 'Angaben zum Diensteanbieter und Kontakt.', imageName: 'betonwand-mit-rissen-nahaufnahme.jpeg', alt: 'Dunkle Wandstruktur', breadcrumb: '<span>Impressum</span>' })}<section class="section"><article class="shell legal-shell"><div class="legal-meta"><strong>Angaben gemäß § 5 DDG</strong></div><h2>BT Bautenschutz</h2><p>Inhaber Bennet Traut e.Kfm.<br>Inhaber: Bennet Traut</p><p>Mädewalder Weg 2<br>12621 Berlin<br>Deutschland</p><h2>Handelsregister</h2><p>Registergericht: Amtsgericht Charlottenburg<br>Registernummer: HRA 61058 B</p><h2>Kontakt</h2><p>Telefon: <a href="tel:${contact.phoneHref}">+49 30 56702195</a><br>E-Mail: <a href="mailto:${contact.email}">${contact.email}</a></p><h2>Umsatzsteuer-Identifikationsnummer</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br>DE355716916</p><h2>Verantwortlich für journalistisch-redaktionelle Inhalte</h2><p>Verantwortlich gemäß § 18 Absatz 2 Medienstaatsvertrag:<br>Bennet Traut<br>Mädewalder Weg 2<br>12621 Berlin</p><h2>Verbraucherstreitbeilegung</h2><p>Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p><h2>Bild- und Mediennachweise</h2><p>Auf dieser Website können eigene Aufnahmen, ordnungsgemäß lizenzierte Bilder aus Bilddatenbanken sowie mithilfe KI-gestützter Anwendungen erstellte oder bearbeitete Medien verwendet werden. Erforderliche Urheber-, Quellen- und Lizenzangaben werden unmittelbar am jeweiligen Inhalt aufgeführt.</p><h2>Transparenzhinweis zum Einsatz künstlicher Intelligenz</h2><p>Bei der Erstellung und Bearbeitung einzelner Texte, Bilder oder anderer Inhalte können KI-gestützte Anwendungen eingesetzt werden. Sämtliche Inhalte werden vor ihrer Veröffentlichung durch eine natürliche Person geprüft und redaktionell verantwortet.</p><p>Inhalte, für die gemäß Artikel 50 der Verordnung (EU) 2024/1689 eine Kennzeichnungspflicht besteht, werden zusätzlich unmittelbar und deutlich erkennbar als KI-generiert oder KI-bearbeitet gekennzeichnet.</p></article></section>`;
  return layout({ title: 'Impressum | BT Bautenschutz', description: 'Impressum von BT Bautenschutz, Inhaber Bennet Traut e.Kfm., Berlin.', content, canonical: '/impressum/' });
};

const privacyPage = () => {
  const content = `${pageHero({ kicker: 'Rechtliches', title: 'Datenschutz', lead: 'Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.', imageName: 'betonwand-mit-rissen-nahaufnahme.jpeg', alt: 'Dunkle Wandstruktur', breadcrumb: '<span>Datenschutz</span>' })}<section class="section"><article class="shell legal-shell"><h2>Datenschutz auf einen Blick</h2><h3>Allgemeine Hinweise</h3><p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p><h3>Datenerfassung auf unserer Website</h3><p><strong>Wer ist verantwortlich?</strong><br>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem <a href="/impressum/">Impressum</a> entnehmen.</p><p><strong>Wie erfassen wir Ihre Daten?</strong><br>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich zum Beispiel um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch durch die IT-Systeme beim Besuch der Website erfasst. Das sind vor allem technische Daten wie Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs.</p><p><strong>Wofür nutzen wir Ihre Daten?</strong><br>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse des Nutzerverhaltens verwendet werden.</p><p><strong>Welche Rechte haben Sie?</strong><br>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen können Sie sich jederzeit an die im Impressum angegebene Adresse wenden.</p><h2>Allgemeine Hinweise und Pflichtinformationen</h2><h3>Datenschutz</h3><p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p><p>Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Die vorliegende Datenschutzerklärung erläutert, welche Daten erhoben und wofür sie genutzt werden. Sie erläutert auch, wie und zu welchem Zweck das geschieht.</p><p>Wir weisen darauf hin, dass die Datenübertragung im Internet, etwa bei der Kommunikation per E-Mail, Sicherheitslücken aufweisen kann. Ein lückenloser Schutz vor dem Zugriff durch Dritte ist nicht möglich.</p><h3>Hinweis zur verantwortlichen Stelle</h3><p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website können Sie dem Impressum entnehmen. Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über Zwecke und Mittel der Verarbeitung personenbezogener Daten entscheidet.</p><h3>Widerruf Ihrer Einwilligung</h3><p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit durch eine formlose Mitteilung per E-Mail widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.</p><h3>Beschwerderecht</h3><p>Im Falle datenschutzrechtlicher Verstöße steht Betroffenen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständig ist der Landesdatenschutzbeauftragte des Bundeslandes, in dem das Unternehmen seinen Sitz hat.</p><h3>Recht auf Datenübertragbarkeit</h3><p>Sie haben das Recht, Daten, die auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeitet werden, an sich oder einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Eine direkte Übertragung erfolgt nur, soweit dies technisch machbar ist.</p><h3>SSL- beziehungsweise TLS-Verschlüsselung</h3><p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- beziehungsweise TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am Wechsel von „http://“ zu „https://“ und am Schloss-Symbol im Browser.</p><h3>Auskunft, Berichtigung und Löschung</h3><p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft, Empfänger und Zweck sowie gegebenenfalls ein Recht auf Berichtigung oder Löschung.</p><h3>Widerspruch gegen Werbe-E-Mails</h3><p>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung nicht ausdrücklich angeforderter Werbung wird widersprochen.</p><h2>Datenerfassung auf dieser Website</h2><h3>Cookies</h3><p>Internetseiten können sogenannte Cookies verwenden. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, Angebote nutzerfreundlicher, effektiver und sicherer zu machen. Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden, Cookies nur im Einzelfall erlauben oder generell ausschließen.</p><h3>Server-Log-Dateien</h3><p>Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser übermittelt. Dazu zählen Browsertyp und -version, Betriebssystem, Referrer-URL, Hostname, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung mit anderen Datenquellen wird nicht vorgenommen.</p><h3>Kontaktaufnahme</h3><p>Wenn Sie uns per E-Mail oder Kontaktanfrage Informationen übermitteln, werden die Angaben einschließlich Kontaktdaten zur Bearbeitung der Anfrage und für Anschlussfragen gespeichert. Eine Weitergabe erfolgt nicht ohne Ihre Einwilligung. Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen oder auf Grundlage Ihrer Einwilligung.</p><h3>Kunden- und Vertragsdaten</h3><p>Wir erheben, verarbeiten und nutzen personenbezogene Daten nur, soweit sie für die Begründung, inhaltliche Ausgestaltung oder Änderung des Rechtsverhältnisses erforderlich sind. Die Daten werden nach Abschluss des Auftrags oder Beendigung der Geschäftsbeziehung gelöscht, soweit keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p><h2>Analyse-Tools und Werbung</h2><h3>Matomo</h3><p>Sofern auf dieser Website Matomo eingesetzt wird, dient der Open-Source-Webanalysedienst der statistischen Auswertung. Dabei können Cookies verwendet und IP-Adressen vor der Speicherung anonymisiert werden. Eine Verarbeitung zu Analysezwecken erfolgt nur auf der jeweils einschlägigen Rechtsgrundlage und, soweit erforderlich, nach Einwilligung.</p><h2>Plugins und Tools</h2><h3>Google Maps</h3><p>Sofern Google Maps eingebunden wird, kann zur Nutzung der Funktionen die IP-Adresse an den Anbieter übertragen werden. Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung des jeweiligen Anbieters.</p><div class="legal-meta"><strong>Hinweis zum Website-Entwurf</strong><br>Diese Datenschutzerklärung wurde aus der bestehenden Website übernommen und gestalterisch neu aufbereitet. Vor der endgültigen Veröffentlichung sollte sie mit den tatsächlich eingesetzten Diensten abgeglichen werden.</div></article></section>`;
  return layout({ title: 'Datenschutz | BT Bautenschutz', description: 'Datenschutzerklärung von BT Bautenschutz.', content, canonical: '/datenschutz/' });
};

const errorPage = () => layout({
  title: 'Seite nicht gefunden | BT Bautenschutz',
  description: 'Die angeforderte Seite wurde nicht gefunden.',
  canonical: '/404.html',
  content: `<section class="error-page"><div class="error-page-inner"><div class="error-code">404</div><p class="eyebrow" style="justify-content:center">Seite nicht gefunden</p><h1 style="font-size:clamp(2.2rem,5vw,4rem)">Hier ist etwas undicht.</h1><p class="lead muted">Die aufgerufene Adresse existiert nicht oder wurde verschoben.</p><a class="btn btn-arrow" href="/">Zur Startseite</a></div></section>`
});

const write = (target, contents) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
};

const writeRoute = (slug, contents) => {
  if (!slug) {
    write(path.join(dist, 'index.html'), contents);
    return;
  }
  write(path.join(dist, slug, 'index.html'), contents);
  write(path.join(dist, `${slug}.html`), contents);
};

writeRoute('', homePage());
writeRoute('service', servicesPage());
writeRoute('ueber-uns', aboutPage());
writeRoute('qualifikation', qualificationPage());
writeRoute('news', newsPage());
writeRoute('branchennews-bt-bautenschutz-eintrag', newsPage());
writeRoute('kontakt', contactPage());
writeRoute('impressum', impressumPage());
writeRoute('datenschutz', privacyPage());
services.forEach((service, index) => writeRoute(service.slug, servicePage(service, index)));
regions.forEach((region) => writeRoute(region.slug, regionPage(region)));
blogPosts.forEach((post) => {
  const page = articlePage(post);
  writeRoute(`news/${post.slug}`, page);
  writeRoute(`branchennews-bt-bautenschutz-eintrag/${post.slug}`, page);
});
write(path.join(dist, '404.html'), errorPage());

const routes = ['', 'service', 'ueber-uns', 'qualifikation', 'news', 'kontakt', 'impressum', 'datenschutz', ...services.map(({ slug }) => slug), ...regions.map(({ slug }) => slug), ...blogPosts.map(({ slug }) => `news/${slug}`)];
const routeDates = new Map(blogPosts.map((post) => [`news/${post.slug}`, post.date]));
write(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>https://www.bt-bautenschutz.de/${route ? `${route}/` : ''}</loc>${routeDates.has(route) ? `<lastmod>${routeDates.get(route)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
write(path.join(dist, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>BT Bautenschutz – Wissen</title><link>https://www.bt-bautenschutz.de/news/</link><description>Praxiswissen zu Bauwerksabdichtung, Feuchtigkeit und Bauschäden.</description><language>de-de</language>${blogPosts.slice(0, 20).map((post) => `<item><title>${xmlEsc(post.title)}</title><link>https://www.bt-bautenschutz.de/news/${post.slug}/</link><guid isPermaLink="true">https://www.bt-bautenschutz.de/news/${post.slug}/</guid><pubDate>${new Date(`${post.date}T10:00:00+02:00`).toUTCString()}</pubDate><description>${xmlEsc(post.excerpt)}</description></item>`).join('')}</channel></rss>\n`);
write(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.bt-bautenschutz.de/sitemap.xml\n');

console.log(`Generated ${routes.length} public routes, ${blogPosts.length} blog articles and legacy aliases.`);
