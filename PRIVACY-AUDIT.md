# Technischer Datenschutz-Audit: Mathilda Racing Website

Dieses Dokument dokumentiert die technische Umsetzung des Datenschutzes („Privacy by Design“) sowie alle datenschutzrelevanten Berührungspunkte und offenen Fragen zur Gewährleistung der DSGVO- und TDDDG-Konformität vor Veröffentlichung.

---

## 1. Technische Details zur Datenverarbeitung

### 1. Hostinganbieter
- **Dienstleister**: Vercel Inc.
- **Anschrift**: 440 N Barranca Ave #4133, Covina, CA 91723, USA.
- **Rolle**: Webhosting-Plattform (Edge Network) und Serverless-Infrastruktur.

### 2. Serverstandorte
- **Lagerung/Auslieferung**: Edge-Server von Vercel (Auslieferung standardmäßig aus dem der anfragenden IP nächstgelegenen Rechenzentrum, typischerweise Frankfurt/Deutschland für EU-Nutzer).

### 3. Eingesetzte externe Dienste
- **Keine**. Alle Vermögenswerte (Bilder, Dokumente, Symbole und Stile) werden lokal gehostet und direkt von unserer Domain ausgeliefert.

### 4. Beim Seitenaufruf kontaktierte Domains
- **Nur die eigene Website-Domain** (z. B. `mathilda-racing.de` bzw. lokale Entwicklungs-IP).
- **Keine Verbindungen** zu Drittanbietern wie Google Fonts, Cloudflare CDNjs, Meta Pixel, o. Ä.

### 5. Verwendete Cookies
- **Keine**. Die Website speichert oder liest keine Cookies auf dem Endgerät der Besucher. Ein Cookie-Banner ist daher nicht erforderlich.

### 6. Verwendeter Local Storage und Session Storage
- **LocalStorage**: 
  - `selectedLanguage`: Speichert die Sprachpräferenz (`de` oder `en`) des Nutzers. Dies ist ein funktionaler Parameter zur Beibehaltung der Sprachauswahl und enthält keinerlei Identifikationsdaten (zulässig nach § 25 Abs. 2 TDDDG).
- **SessionStorage**: **Keine**.

### 7. Kontaktformular-Verarbeitung
- **Clientseitig**: 
  - Formulare in `fahrerprogramm.html` und `partner.html` senden Daten verschlüsselt per HTTPS-POST-Request an den Endpunkt `/api/submit`.
  - Clientseitige Honeypot-Validierung fängt automatisierte Bots frühzeitig ab.
- **Serverseitig**:
  - Ein serverloses Node.js-Skript (`api/submit.js`) validiert die Eingabedaten (Validität der E-Mail, maximale Textlänge, Pflichtfelder) und bereinigt sie gegen Script- und HTML-Injections.
  - Wenn das versteckte Honeypot-Feld `website` befüllt ist, bricht das Skript die Verarbeitung geräuschlos mit einem Erfolgscode ab, um Spammer zu blockieren.

### 8. E-Mail-Dienst
- **Umsetzung**: Übermittlung per SMTP oder API an das offizielle Postfach `info@mathilda-racing.de`. 
- **Offener Punkt**: Ein konkreter E-Mail-/SMTP-Anbieter muss vor Livegang in den serverseitigen Environment Variables (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`) auf Vercel konfiguriert werden.

### 9. Verwendete Schriftarten
- **Art der Einbindung**: Lokaler Systemschrift-Stack (Inter, Arial, Helvetica, System-UI, Apple-System, sans-serif).
- **Externe Zugriffe**: Keine Verbindungen zu `fonts.googleapis.com` oder `fonts.gstatic.com`.

### 10. Eingebettete Videos oder Karten
- **Videos**: Videos (z. B. im Fahrerprogramm) werden nicht automatisch geladen oder direkt eingebettet. Links zu YouTube/Instagram sind reine Hyperlinks.
- **Karten**: Keine Einbindung von Google Maps oder anderen interaktiven APIs. Anschriften sind als reiner Text hinterlegt.

### 11. Analyse- und Marketingdienste
- **Keine** (kein Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, Hotjar o. Ä.).

### 12. Bestehende Auftragsverarbeitungsverträge (AVV)
- **Vercel**: Es ist ein Data Processing Addendum (DPA) inkl. EU-Standardvertragsklauseln mit Vercel Inc. erforderlich (wird im Rahmen der Registrierung/Nutzung standardmäßig abgeschlossen).
- **E-Mail-Provider**: Ein AV-Vertrag gemäß Art. 28 DSGVO muss mit dem Anbieter geschlossen werden, bei dem das Postfach `info@mathilda-racing.de` gehostet wird.

### 13. Mögliche Drittlandübermittlungen
- **Vercel Inc. (USA)**: Server-Logdaten (IP-Adressen) können im Rahmen des Hostings verarbeitet werden. Durch DPA und EU-Standardvertragsklauseln abgesichert.

### 14. Konkrete Löschfristen
- **Server-Logfiles (Vercel)**: Speicherung zu Sicherheitszwecken (Abwehr von DDOS und Angriffen) für maximal 14 Tage.
- **Formulardaten / E-Mails**: Speicherung im E-Mail-Postfach bis zur abschließenden Bearbeitung der Anfrage, sofern keine gesetzlichen Aufbewahrungsfristen (z. B. 6 Jahre für Handelsbriefe, 10 Jahre bei Vertragsabschluss für Buchhaltung) entgegenstehen.

---

## 2. Offene rechtliche und technische Prüfpunkte vor Livegang

> [!WARNING]
> ### 1. Verantwortliche Stelle ("Controller") klären
> - **Aktueller Stand**: In der Datenschutzerklärung und im Impressum ist vorläufig die **profibu GmbH** als Betreiberin hinterlegt. In älteren Teilen der Website wurde zudem **Michael Paatz** als verantwortliche Stelle genannt.
> - **Aktion**: Vor Livegang muss rechtlich verbindlich geklärt werden, ob die *profibu GmbH* oder *Michael Paatz* als datenschutzrechtlich verantwortliche Stelle im Sinne der DSGVO eingetragen wird. Das Impressum und die Datenschutzerklärung müssen übereinstimmen.
> 
> ### 2. Platzhalter in Rechtstexten befüllen
> - Im Impressum (`impressum.html`) müssen folgende Platzhalter durch offizielle Firmendaten der profibu GmbH ersetzt werden:
>   - `[VERTRETUNGSBERECHTIGTE PERSON]` (z. B. Name des Geschäftsführers)
>   - `[REGISTERGERICHT UND REGISTERNUMMER]` (z. B. Amtsgericht Köln, HRB XXX)
>   - `[UMSATZSTEUER-ID, FALLS VORHANDEN]`
>   - `[NAME UND ANSCHRIFT, FALLS ERFORDERLICH]` (Redaktionelle Verantwortung nach § 18 MStV)
> 
> ### 3. E-Mail-Weiterleitung konfigurieren
> - In `api/submit.js` muss der NodeMailer oder Ihr bevorzugtes Formular-Handling-Tool mit echten SMTP-Zugangsdaten konfiguriert werden. Diese Zugangsdaten müssen über die Vercel-Projektkonfiguration (Environment Variables) eingetragen werden. Niemals im Code selbst hinterlegen!
