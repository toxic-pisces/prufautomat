# Pr-fautomat - DFQ File Watcher & Production Monitor

Automatische Produktionsüberwachung mit DFQ-Datei-Verarbeitung und Echtzeit-Ordnerüberwachung.

## 🚀 Features

- ✅ **Automatische Ordnerüberwachung**: Server überwacht einen Ordner und verarbeitet neue DFQ-Dateien automatisch
- ✅ **Echtzeit-Verarbeitung**: Neue Dateien werden sofort erkannt und ausgewertet
- ✅ **Touch-Display Support**: Optimiert für Touch-Bedienung
- ✅ **Kiosk-Modus**: Automatischer Fullscreen-Start für Produktionsumgebung
- ✅ **Offline-Betrieb**: Läuft komplett lokal ohne Internetverbindung
- ✅ **IO/NIO-Erkennung**: Automatische Toleranzprüfung aus K0001-Messwerten
- ✅ **57 Merkmale**: Vollständige Unterstützung aller Messmerkmale
- ✅ **Live-Dashboard**: Echtzeit-Anzeige von Produktionsdaten
- ✅ **Multi-Language**: Unterstützung für DE, EN, RU, PL, ZH, IT

---

## 📦 Installation

### Voraussetzungen

**Node.js muss installiert sein!**

#### Windows:
1. Download: https://nodejs.org/de
2. Installieren (LTS Version empfohlen)
3. Neustart des Computers

#### Linux/Mac:
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Mac mit Homebrew
brew install node
```

### Installation der Dependencies

1. **Terminal/Kommandozeile öffnen**
   - Windows: `cmd` oder `PowerShell`
   - Mac/Linux: Terminal

2. **Zum Projektordner navigieren**
   ```bash
   cd /pfad/zu/Pr-fautomat
   ```

3. **Dependencies installieren**
   ```bash
   npm install
   ```

   Dies installiert automatisch:
   - `chokidar` - Ordnerüberwachung
   - `express` - Web-Server
   - `socket.io` - Echtzeit-Kommunikation
   - `cors` - Cross-Origin Support

---

## 🎯 Verwendung

### Option A: Schnellstart mit Kiosk-Modus (Empfohlen für Touch-Display)

**Für Offline-Betrieb mit automatischem Fullscreen:**

```bash
./start-offline.sh
```

Dieses Script:
- Startet den Server automatisch
- Öffnet die App im Fullscreen/Kiosk-Modus
- Perfekt für Touch-Display-Betrieb
- Keine manuelle Browser-Konfiguration nötig

### Option B: Manueller Start

#### 1. Server starten

```bash
npm start
```

Du solltest folgende Ausgabe sehen:
```
╔════════════════════════════════════════╗
║   DFQ File Watcher Server Started     ║
╚════════════════════════════════════════╝

🌐 Server running at: http://localhost:3000
📡 WebSocket ready for connections
⚠️  No folder configured. Set it in the web interface.
```

#### 2. Web-App öffnen

Öffne deinen Browser und navigiere zu:
```
http://localhost:3000
```

#### 3. Fullscreen aktivieren

- Klicke **5x schnell** auf das **Logo** im Header (oben rechts)
- Das Logo blinkt bei jedem Klick
- Nach 5 Klicks wird Fullscreen aktiviert
- Im Fullscreen: Erneut 5x auf Logo klicken zum Beenden

### 3. Ordner konfigurieren

1. Klicke auf das **Zahnrad-Symbol** (⚙️) in der Sidebar
2. Im Bereich "🤖 Automatische Ordnerüberwachung":
   - **Grüner Punkt** = Server verbunden
   - **Roter Punkt** = Server offline
3. Gib den Pfad zu deinem DFQ-Ordner ein:
   - **Windows**: `C:\DFQ-Files` oder `D:\Produktion\DFQ`
   - **Linux/Mac**: `/home/user/dfq-files` oder `/Users/name/Documents/dfq`
4. Klicke auf **"Ordner überwachen"**

### 4. Automatische Verarbeitung

✨ **Das war's!** Sobald eine neue DFQ-Datei in den überwachten Ordner kopiert/gespeichert wird:
- Wird sie **automatisch erkannt**
- **Sofort verarbeitet**
- **IO/NIO-Status** wird berechnet
- **Zur Liste** hinzugefügt
- Falls eine Prüfung aktiv ist: **Automatisch zur Session hinzugefügt**

---

## 🔧 Konfiguration

### Ordner-Überwachung einrichten

Die Ordner-Konfiguration wird automatisch gespeichert in:
```
server-config.json
```

Beim nächsten Start des Servers wird der Ordner automatisch wieder überwacht.

### Server-Port ändern

Standard-Port ist `3000`. Um ihn zu ändern:

```bash
# Windows
set PORT=8080 && npm start

# Linux/Mac
PORT=8080 npm start
```

---

## 🛠️ Entwicklung

### Auto-Reload bei Code-Änderungen

```bash
npm run dev
```

Nutzt `nodemon` für automatischen Server-Neustart bei Dateiänderungen.

---

## 🔒 Sicherheit

- ✅ **Läuft nur lokal** (localhost:3000)
- ✅ **Kein Internet-Zugriff** von außen möglich
- ✅ **Keine Daten-Upload** ins Internet
- ✅ **Nur lokaler Ordner-Zugriff**
- ⚠️ **Nicht für Produktions-Internet-Einsatz** ohne zusätzliche Sicherheitsmaßnahmen

---

## 📊 Workflow

1. **Server starten**: `npm start`
2. **Browser öffnen**: `http://localhost:3000`
3. **Ordner konfigurieren**: DFQ-Ordner angeben
4. **Prüfung starten**: TBK scannen, Prüfzyklus wählen
5. **Teile produzieren**: DFQ-Dateien werden automatisch verarbeitet
6. **Live-Monitoring**: Dashboard zeigt Echtzeit-Daten

---

## 🖥️ Touch-Display Setup (macOS)

### Touch funktioniert nicht?

1. **Display-Modus prüfen**:
   - Öffne Systemeinstellungen → Displays
   - Deaktiviere "Bildschirme synchronisieren"
   - Stelle Touch-Display als Hauptbildschirm ein

2. **USB-Verbindung prüfen**:
   - Touch-Funktion läuft über USB (nicht HDMI)
   - USB-Kabel direkt am Mac anschließen (nicht über Hub)
   - Ggf. andere USB-Ports testen

3. **Treiber installieren**:
   - Auf Website des Display-Herstellers nach macOS-Treibern suchen
   - Treiber installieren und Mac neu starten

### Automatischer Start beim Systemstart

Um die App beim Hochfahren automatisch zu starten:

1. Erstelle ein `.command` File:
   ```bash
   echo '#!/bin/bash
   cd /pfad/zu/prufautmat1
   ./start-offline.sh' > ~/Desktop/Prufautomat.command
   chmod +x ~/Desktop/Prufautomat.command
   ```

2. Füge es zu "Anmeldeobjekte" hinzu:
   - Systemeinstellungen → Benutzer & Gruppen
   - Anmeldeobjekte → "+" klicken
   - `Prufautomat.command` auswählen

---

## 🐛 Problembehebung

### "Server verbunden" wird nicht angezeigt

**Problem**: Roter Status-Indikator, "Server getrennt"

**Lösung**:
1. Prüfe ob der Server läuft: `npm start`
2. Öffne die Browser-Console (F12) und suche nach Fehlern
3. Stelle sicher dass Port 3000 nicht blockiert ist

### Ordner wird nicht überwacht

**Problem**: Dateien werden nicht erkannt

**Lösung**:
1. Prüfe ob der Ordnerpfad korrekt ist
2. Überprüfe Schreibrechte für den Ordner
3. Schaue in die Server-Console nach Fehlermeldungen
4. Bei Windows: Verwende doppelte Backslashes `C:\\DFQ-Files` oder Slashes `C:/DFQ-Files`

### Dateien werden doppelt verarbeitet

**Problem**: Eine Datei erscheint mehrmals

**Lösung**:
- Das passiert wenn eine Datei während des Schreibens erkannt wird
- Der Server wartet 2 Sekunden bis die Datei fertig geschrieben ist
- Ignoriere Duplikate oder lösche/verschiebe Dateien nach Verarbeitung

### Fullscreen funktioniert nicht

**Lösung**:
- Klicke 5x schnell auf das Logo im Header (oben rechts)
- Das Logo sollte bei jedem Klick kurz blinken
- Oder verwende das Startup-Script: `./start-offline.sh`
- Browser muss Fullscreen-Berechtigungen haben (beim ersten Mal bestätigen)

### Wie komme ich aus dem Fullscreen/Kiosk-Modus raus?

**Lösung**:
- Klicke erneut 5x schnell auf das Logo
- Oder drücke `ESC` (funktioniert nur bei normalem Fullscreen, nicht bei Chrome Kiosk-Modus)
- Oder drücke `Cmd+Q` um Browser komplett zu schließen (macOS)

---

## 📝 Technische Details

### Stack
- **Backend**: Node.js + Express + Socket.IO + Chokidar
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Kommunikation**: WebSocket (Socket.IO)

### DFQ-Datei-Format
- **K0001**: Messwerte (getrennt durch `�`)
- **K1002**: Teilebezeichnung
- **K2002/X**: Merkmalname
- **K2101/X**: Sollwert
- **K2110/X**: Untere Toleranz
- **K2111/X**: Obere Toleranz
- **K2120/X**: IO/NIO-Status (1=IO, 0=NIO)
- **K2142/X**: Einheit

### Architektur
```
[DFQ-Ordner] → [Chokidar Watcher]
                     ↓
              [Node.js Server]
                     ↓
              [Socket.IO WebSocket]
                     ↓
              [Browser Client] → [Dashboard]
```

---

## 📄 Lizenz

MIT

---

## 🤝 Support

Bei Fragen oder Problemen:
1. Prüfe die Console-Logs (Browser F12 + Server Terminal)
2. Siehe Problembehebung oben
3. Erstelle ein Issue im Repository

---

**Viel Erfolg mit der automatischen Produktionsüberwachung! 🎉**
