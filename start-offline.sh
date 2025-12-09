#!/bin/bash

# Prüfautomat Offline Starter
# Startet Server und App für Offline-Betrieb

echo "🔧 Starte Prüfautomat Server..."

# Wechsle ins Projektverzeichnis
cd "$(dirname "$0")"

# Installiere Dependencies falls nötig
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
fi

# Starte Server
echo "🚀 Starte Server auf Port 3000..."
node server.js &
SERVER_PID=$!

# Warte bis Server bereit ist
echo "⏳ Warte auf Server..."
sleep 3

# Öffne Browser im Kiosk-Modus
if [ -d "/Applications/Google Chrome.app" ]; then
    echo "📱 Öffne Chrome im Kiosk-Modus..."
    open -a "Google Chrome" --args --kiosk --app=http://localhost:3000 --disable-pinch --overscroll-history-navigation=0
elif [ -d "/Applications/Safari.app" ]; then
    echo "📱 Öffne Safari..."
    open -a "Safari" http://localhost:3000
    sleep 2
    osascript -e 'tell application "Safari" to activate' -e 'tell application "System Events" to keystroke "f" using {command down, control down}'
else
    echo "❌ Kein Browser gefunden!"
fi

echo ""
echo "✅ Prüfautomat läuft!"
echo "🌐 URL: http://localhost:3000"
echo "🛑 Zum Beenden: Strg+C"
echo ""

# Warte auf Beenden
wait $SERVER_PID
