# Firebase Database Setup

This document explains how to set up the Firebase Realtime Database structure for the Machine Status Timeline application.

## Database Structure

### 1. Machine Status (PLC)
Location: `plc/status`

This stores the current machine status:
- `20` = Working (Green)
- `10` = Idle (Gray)
- `-10` = Malfunction (Orange)

**Example:**
```json
{
  "plc": {
    "status": 10
  }
}
```

### 2. TBK Numbers Database
Location: `tbk/{tbkNumber}`

This stores information about each TBK (Teil-Batch-Karte) number.

**Required TBK Entries:**

#### TBK 10367926:
```json
{
  "tbk": {
    "10367926": {
      "teil": "Rotorwelle",
      "laufkarte": "196558",
      "charge": "1233789"
    }
  }
}
```

#### Any other TBK (example with arbitrary number):
```json
{
  "tbk": {
    "20456789": {
      "teil": "Housing",
      "laufkarte": "196778",
      "charge": "1233498"
    }
  }
}
```

### 3. Production Sessions Database
Location: `sessions/{sessionId}`

This is **automatically created** by the application when a production session starts. Each session contains:

**Session Data Structure:**
```json
{
  "sessions": {
    "session_1234567890_abcdef123": {
      "sessionId": "session_1234567890_abcdef123",
      "tbk": "10367926",
      "teil": "Rotorwelle",
      "laufkarte": "196558",
      "charge": "1233789",
      "pruefzyklus": 1,
      "startTime": "2024-01-15T10:30:00.000Z",
      "endTime": "2024-01-15T11:45:00.000Z",
      "totalParts": 156,
      "ioParts": 140,
      "nioParts": 16
    }
  }
}
```

**Note:** You don't need to manually create the sessions database. It will be automatically populated when the machine starts working and a Prüfzyklus is selected.

### 4. Downtime Tracking Database
Location: `downtimes/{downtimeId}`

This is **automatically created** by the application when a downtime event occurs and a reason is selected. Downtime tracking occurs when:
- Machine status changes to `-10` (Malfunction)
- Machine status is `10` (Idle) for more than 5 minutes

**Downtime Data Structure:**
```json
{
  "downtimes": {
    "downtime_1234567890_xyz789": {
      "downtimeId": "downtime_1234567890_xyz789",
      "reason": "Reparatur",
      "startTime": "2024-01-15T12:00:00.000Z",
      "endTime": "2024-01-15T12:25:00.000Z",
      "durationMinutes": 25
    },
    "downtime_1234567891_abc123": {
      "downtimeId": "downtime_1234567891_abc123",
      "reason": "NIO voll",
      "startTime": "2024-01-15T14:30:00.000Z",
      "endTime": "2024-01-15T14:45:00.000Z",
      "durationMinutes": 15
    }
  }
}
```

**Available Downtime Reasons:**
- **Reparatur**: Machine repair/maintenance
- **NIO voll**: NIO container full

**Note:** You don't need to manually create the downtimes database. It will be automatically populated when downtime events occur and reasons are selected.

### Complete Initial Database Structure:
```json
{
  "plc": {
    "status": 10
  },
  "tbk": {
    "10367926": {
      "teil": "Rotorwelle",
      "laufkarte": "196558",
      "charge": "1233789"
    },
    "20456789": {
      "teil": "Housing",
      "laufkarte": "196778",
      "charge": "1233498"
    }
  }
}
```

## How to Set Up in Firebase Console

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project: `mdee-90798`
3. Go to **Realtime Database** in the left menu
4. Click on the **Data** tab
5. Click the **+** icon next to your database URL to add data
6. Add the structure shown above

### Or Use the Import Feature:

1. Copy the complete database structure above
2. In Firebase Console, click the three dots (⋮) menu
3. Select **Import JSON**
4. Paste the JSON structure
5. Click **Import**

## Database Rules

Your current rules allow full read/write access:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note:** For production, you should implement proper security rules.

## How the Application Uses the Database

1. **Status Monitoring**: The app continuously listens to `plc/status`
2. **Status Change Detection**: When status changes to `20` (Working), the barcode scan modal opens
3. **TBK Lookup**: When a barcode is scanned, the app queries `tbk/{scannedNumber}`
4. **Display Information**: If found, it displays the Teil, Laufkarte, and Charge information
5. **Prüfzyklus Selection**: User selects a Prüfzyklus (1, 2, or 3)
6. **Session Creation**: A new production session is created in `sessions/{sessionId}` with all the TBK information and selected Prüfzyklus
7. **Live Part Counting**: The app simulates production and counts parts in real-time:
   - Approximately 10-20 parts per minute
   - 90% IO (good parts)
   - 10% NIO (bad parts)
8. **Real-time Updates**: Production data is updated in Firebase every 10 parts
9. **Session End**: When machine status changes from 20 to anything else, the session is ended with a final timestamp
10. **Timeline Integration**: Green timeline segments are clickable to view the full production session details
11. **Live Display**: Production counter shows on screen during active sessions and persists after session ends until a new one starts
12. **Downtime Tracking**: When machine status is `-10` (Malfunction), a modal appears to select a downtime reason
13. **Idle Timeout**: If machine status is `10` (Idle) for 5 consecutive minutes, the segment turns orange and a downtime reason modal appears
14. **Downtime Records**: After a reason is selected, a downtime record is created in `downtimes/{downtimeId}` with start time, end time, duration, and reason
15. **Downtime Timeline**: Orange segments in the timeline show downtime periods and display the reason in the tooltip
