#!/bin/bash

# Prüfautomat Kiosk Mode Starter
# Startet die App im Vollbild-Modus (macOS)

echo "🚀 Starte Prüfautomat im Kiosk-Modus..."

# Prüfe ob Node.js läuft (optional, falls Server benötigt wird)
# node server.js &

# Warte kurz bis Server läuft
sleep 2

# Öffne Chrome im Kiosk-Modus
# Falls Chrome installiert ist:
if [ -d "/Applications/Google Chrome.app" ]; then
    echo "📱 Starte mit Google Chrome..."
    open -a "Google Chrome" --args --kiosk --app=http://localhost:3000 --disable-pinch --overscroll-history-navigation=0
# Ansonsten versuche Safari
elif [ -d "/Applications/Safari.app" ]; then
    echo "📱 Starte mit Safari..."
    open -a "Safari" http://localhost:3000
    # Safari in Fullscreen bringen
    sleep 2
    osascript -e 'tell application "Safari" to activate' -e 'tell application "System Events" to keystroke "f" using {command down, control down}'
else
    echo "❌ Kein Browser gefunden!"
    exit 1
fi

echo "✅ Prüfautomat läuft im Kiosk-Modus!"
