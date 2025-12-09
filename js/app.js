// Machine configuration
let machineConfig = {
    timeoutMinutes: 5, // Default 5 minutes
    showTimer: true,
    errorCheckThreshold: 100 // Default: Check for errors after 100 parts
};

// Machine state tracking
let lastDFQFileTime = null;
let machineTimeoutInterval = null;
let machineInErrorState = false;
let sessionWaitingToStart = false;

// Timeline data - mit Demo-Daten vorinitialisiert
let timelineData = [];
let currentStatus = -10; // Startet mit Malfunction (orange)
let previousStatus = null;
let currentTimelineTime = new Date(); // Simulated timeline time

// Flag für unbestätigten Stillstand
let pendingDowntimeReason = true; // true = Stillstand ohne Grund, Modal muss gezeigt werden

// Production session data
let currentSession = null;
let productionInterval = null;

// Downtime tracking
let currentDowntime = null;
let downtimeStartTime = null;
let downtimeReason = null;
let idleMinutesAccumulated = 0;
let isInActiveDowntime = false;

// Warning and error tracking
let activeWarnings = new Map(); // Track active warnings per merkmal
let shownErrors = new Set(); // Track if errors have been shown

// Order System State - DIREKT MIT DATEN INITIALISIERT
let orders = [
    { id: 1, laufkartenNr: 'LK-2024-001', status: 'active', pruefzyklus: '1' },
    { id: 2, laufkartenNr: 'LK-2024-002', status: 'active', pruefzyklus: '2' },
    { id: 3, laufkartenNr: 'LK-2024-003', status: 'active', pruefzyklus: '3' },
    { id: 4, laufkartenNr: 'LK-2024-004', status: 'active', pruefzyklus: '1' },
    { id: 5, laufkartenNr: 'LK-2024-005', status: 'active', pruefzyklus: '2' },
    { id: 6, laufkartenNr: 'LK-2024-006', status: 'active', pruefzyklus: '3' },
    { id: 7, laufkartenNr: 'LK-2024-007', status: 'active', pruefzyklus: '1' },
    { id: 8, laufkartenNr: 'LK-2024-008', status: 'active', pruefzyklus: '2' }
];
let selectedOrder = { id: 1, laufkartenNr: 'LK-2024-001', status: 'active', pruefzyklus: '1' }; // Erster Auftrag vorausgewählt
let containerCount = 0; // Number of Behälter scanned
let tbkPrintCount = 1; // Number of TBKs to print
let tbksPrinted = false; // Track if TBKs have been printed

// Get DOM elements
const timeline = document.getElementById('timeline');
const timelineAxis = document.getElementById('timelineAxis');
const sessionHeaderEl = document.getElementById('sessionHeader');

// Production Counter elements (always visible)
const totalPartsEl = document.getElementById('totalParts');
const ioPartsEl = document.getElementById('ioParts');
const nioPartsEl = document.getElementById('nioParts');
const currentTBKEl = document.getElementById('currentTBK');
const currentTeilEl = document.getElementById('currentTeil');
const currentPruefzyklusEl = document.getElementById('currentPruefzyklus');

// Timer elements
const timeoutTimer = document.getElementById('timeoutTimer');
const timerValue = document.getElementById('timerValue');

// Barcode Modal elements
const barcodeModal = document.getElementById('barcodeModal');
const barcodeInput = document.getElementById('barcodeInput');
const submitBarcode = document.getElementById('submitBarcode');
const barcodeError = document.getElementById('barcodeError');

// Prüfzyklus Modal elements
const pruefzyklusModal = document.getElementById('pruefzyklusModal');
const tbkNumber = document.getElementById('tbkNumber');
const tbkTeil = document.getElementById('tbkTeil');
const tbkLaufkarte = document.getElementById('tbkLaufkarte');
const tbkCharge = document.getElementById('tbkCharge');
const pruefzyklusButtons = document.querySelectorAll('.btn-pruefzyklus');

// Downtime Modal elements
const downtimeModal = document.getElementById('downtimeModal');
const downtimeButtons = document.querySelectorAll('.btn-downtime');
const sonstigesBtn = document.getElementById('sonstigesBtn');

// Custom Reason Modal elements
const customReasonModal = document.getElementById('customReasonModal');
const customReasonInput = document.getElementById('customReasonInput');
const submitCustomReason = document.getElementById('submitCustomReason');
const cancelCustomReason = document.getElementById('cancelCustomReason');

// Session Details Modal elements
const sessionDetailsModal = document.getElementById('sessionDetailsModal');
const closeSessionModal = document.getElementById('closeSessionModal');

// Edit Segment Modal elements
const editSegmentModal = document.getElementById('editSegmentModal');
const editSegmentTitle = document.getElementById('editSegmentTitle');
const editSegmentContent = document.getElementById('editSegmentContent');
const closeEditSegmentModal = document.getElementById('closeEditSegmentModal');

// Warning Banner elements
const errorWarningBanner = document.getElementById('errorWarningBanner');
const warningMessage = document.getElementById('warningMessage');

// Current TBK data
let currentTBKData = null;

// Aufträge Modal elements
const auftraegeModal = document.getElementById('auftraegeModal');
const auftraegeBtn = document.getElementById('auftraegeBtn');
const closeAuftraegeModal = document.getElementById('closeAuftraegeModal');
const requestNewOrdersBtn = document.getElementById('requestNewOrdersBtn');

// Start Test button
const startTestButton = document.getElementById('startTestButton');

// Container Scan Modal elements
const containerScanModal = document.getElementById('containerScanModal');
const containerCountInput = document.getElementById('containerCountInput');
const submitContainerCount = document.getElementById('submitContainerCount');
const containerError = document.getElementById('containerError');

// TBK Print Modal elements
const tbkPrintModal = document.getElementById('tbkPrintModal');
const incrementTBKBtn = document.getElementById('incrementTBK');
const decrementTBKBtn = document.getElementById('decrementTBK');
const printTBKsBtn = document.getElementById('printTBKsBtn');
const startTestBtn = document.getElementById('startTestBtn');

// Language Modal elements
const languageModal = document.getElementById('languageModal');
const languageBtn = document.getElementById('languageBtn');
const closeLanguageModal = document.getElementById('closeLanguageModal');

// Status mapping
function getStatusInfo(status) {
    switch(status) {
        case 20:
            return { name: 'Working', class: 'working' };
        case 10:
            return { name: 'Idle', class: 'idle' };
        case -10:
            return { name: 'Malfunction', class: 'malfunction' };
        default:
            return { name: 'Unknown', class: 'idle' };
    }
}

// Generate session ID
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate downtime ID
function generateDowntimeId() {
    return `downtime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// DEMO TIMELINE INITIALIZATION
// ============================================

// Initialize demo timeline with various segments
function initializeDemoTimeline() {
    const now = new Date();
    
    // Erstelle Timeline für die letzten 4 Stunden mit verschiedenen Status
    timelineData = [
        // Vor 4 Stunden: Idle (grau)
        {
            status: 10,
            class: 'idle',
            duration: 30,
            timestamp: new Date(now.getTime() - 240 * 60000)
        },
        // Arbeiten (grün) - 45 min
        {
            status: 20,
            class: 'working',
            duration: 45,
            timestamp: new Date(now.getTime() - 210 * 60000),
            sessionId: 'demo_session_1'
        },
        // Stillstand mit Grund (orange) - Pause - 15 min
        {
            status: -10,
            class: 'malfunction',
            duration: 15,
            timestamp: new Date(now.getTime() - 165 * 60000),
            downtimeReason: 'Pause'
        },
        // Arbeiten (grün) - 60 min
        {
            status: 20,
            class: 'working',
            duration: 60,
            timestamp: new Date(now.getTime() - 150 * 60000),
            sessionId: 'demo_session_2'
        },
        // Idle (grau) - 20 min
        {
            status: 10,
            class: 'idle',
            duration: 20,
            timestamp: new Date(now.getTime() - 90 * 60000)
        },
        // Arbeiten (grün) - 35 min
        {
            status: 20,
            class: 'working',
            duration: 35,
            timestamp: new Date(now.getTime() - 70 * 60000),
            sessionId: 'demo_session_3'
        },
        // Stillstand mit Grund (orange) - Materialwechsel - 10 min
        {
            status: -10,
            class: 'malfunction',
            duration: 10,
            timestamp: new Date(now.getTime() - 35 * 60000),
            downtimeReason: 'Materialwechsel'
        },
        // Aktuell: Stillstand OHNE Grund (orange mit Ausrufezeichen) - 25 min
        {
            status: -10,
            class: 'malfunction',
            duration: 25,
            timestamp: new Date(now.getTime() - 25 * 60000),
            needsReason: true // Spezielles Flag für unbestätigten Stillstand
        }
    ];
    
    currentTimelineTime = now;
    currentStatus = -10; // Aktuell Stillstand
    isInActiveDowntime = true;
    
    console.log('✅ Demo Timeline initialisiert mit', timelineData.length, 'Segmenten');
}

// SOFORT Demo Timeline initialisieren beim Laden des Scripts!
initializeDemoTimeline();
console.log('🚀 Demo Timeline wurde beim Script-Load initialisiert');

// ============================================
// ORDER SYSTEM FUNCTIONS
// ============================================

// Initialize orders (sample data for prototype)
function initializeOrders() {
    orders = [
        { id: 1, laufkartenNr: 'LK-2024-001', status: 'active', pruefzyklus: '1' },
        { id: 2, laufkartenNr: 'LK-2024-002', status: 'active', pruefzyklus: '2' },
        { id: 3, laufkartenNr: 'LK-2024-003', status: 'active', pruefzyklus: '3' },
        { id: 4, laufkartenNr: 'LK-2024-004', status: 'active', pruefzyklus: '1' },
        { id: 5, laufkartenNr: 'LK-2024-005', status: 'active', pruefzyklus: '2' },
        { id: 6, laufkartenNr: 'LK-2024-006', status: 'active', pruefzyklus: '3' },
        { id: 7, laufkartenNr: 'LK-2024-007', status: 'active', pruefzyklus: '1' },
        { id: 8, laufkartenNr: 'LK-2024-008', status: 'active', pruefzyklus: '2' }
    ];

    // Pre-select the first order
    selectedOrder = orders[0];
    console.log('✅ Orders initialisiert, selectedOrder:', selectedOrder);
}

// Get selected order
function getSelectedOrder() {
    return selectedOrder;
}

// Set selected order
function setSelectedOrder(order) {
    selectedOrder = order;
    updateSelectedOrderDisplay();
}

// Generate Chargennummer (batch number)
function generateChargennummer() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${random}/${day}.${month}`;
}

// Update production panel visibility based on session state
function updateProductionPanelView() {
    const noTestView = document.getElementById('noTestView');
    const activeTestView = document.getElementById('activeTestView');

    if (currentSession && currentStatus === 20) {
        // Test is running - show stats
        noTestView.style.display = 'none';
        activeTestView.style.display = 'flex';
    } else {
        // No test running - show start button
        noTestView.style.display = 'flex';
        activeTestView.style.display = 'none';
    }
}

// Create production session in Firebase
async function createProductionSession(tbkData, pruefzyklus) {
    const sessionId = generateSessionId();
    const startTimeISO = currentTimelineTime.toISOString();

    const sessionData = {
        sessionId: sessionId,
        tbk: tbkData.tbk,
        teil: tbkData.teil,
        laufkarte: tbkData.laufkarte,
        charge: tbkData.charge,
        pruefzyklus: pruefzyklus,
        startTime: startTimeISO,
        endTime: null,
        totalParts: 0,
        ioParts: 0,
        nioParts: 0
    };

    console.log('Production session created:', sessionId);
    return { sessionId, ...sessionData };
}

// Update production session (no longer persists to database)
async function updateProductionSession(sessionId, updates) {
    console.log('Session update (local only):', sessionId, updates);
    // Sessions are tracked locally in currentSession variable
}

// Start downtime tracking
function startDowntimeTracking() {
    downtimeStartTime = new Date(currentTimelineTime).toISOString();
    console.log('Downtime started at:', downtimeStartTime);
}

// Create downtime record and send to server
async function createDowntimeRecord(reason) {
    if (!downtimeStartTime) {
        console.error('No downtime start time recorded');
        return null;
    }

    const downtimeId = generateDowntimeId();
    const endTimeISO = currentTimelineTime.toISOString();
    const startMs = new Date(downtimeStartTime).getTime();
    const endMs = new Date(endTimeISO).getTime();
    const durationMinutes = Math.round((endMs - startMs) / 60000);

    const downtimeData = {
        downtimeId: downtimeId,
        reason: reason,
        startTime: downtimeStartTime,
        endTime: endTimeISO,
        durationMinutes: durationMinutes
    };

    console.log('Downtime record created:', downtimeId);

    // Send to server for persistent storage
    try {
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'downtime',
                reason: reason,
                startTime: downtimeStartTime,
                endTime: endTimeISO,
                durationMinutes: durationMinutes,
                additionalData: {
                    downtimeId: downtimeId,
                    status: currentStatus
                }
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Downtime event saved to server:', result.event.id);
        } else {
            console.error('Failed to save downtime event to server');
        }
    } catch (error) {
        console.error('Error sending downtime event to server:', error);
    }

    // Store downtime info for current segment
    currentDowntime = { downtimeId, reason };

    return downtimeData;
}

// Show downtime modal
function showDowntimeModal() {
    if (!downtimeStartTime) {
        startDowntimeTracking();
    }
    downtimeModal.classList.add('active');
}

// Hide downtime modal
function hideDowntimeModal() {
    downtimeModal.classList.remove('active');
}

// Show custom reason modal
function showCustomReasonModal() {
    hideDowntimeModal();
    customReasonModal.classList.add('active');
    customReasonInput.value = '';
    setTimeout(() => customReasonInput.focus(), 100);
}

// Hide custom reason modal
function hideCustomReasonModal() {
    customReasonModal.classList.remove('active');
}

// Convert idle segment to downtime (change to orange or blue)
function convertIdleToDowntime() {
    // Find the last idle segment and convert it to malfunction
    if (timelineData.length > 0) {
        const lastSegment = timelineData[timelineData.length - 1];
        if (lastSegment.status === 10) {
            lastSegment.status = -10;
            // Set class based on downtime reason
            const repairReasons = ['Reparatur', 'Monteur Einsatz'];
            lastSegment.class = (downtimeReason && repairReasons.includes(downtimeReason))
                ? 'malfunction-repair'
                : 'malfunction';
            // Attach downtime reason if available
            if (downtimeReason) {
                lastSegment.downtimeReason = downtimeReason;
            }
            renderTimeline();
        }
    }
}

// Check and handle idle timeout
function checkIdleTimeout() {
    if (currentStatus === 10 && idleMinutesAccumulated >= 5 && !isInActiveDowntime) {
        console.log('5 minutes idle threshold reached - showing downtime modal');
        convertIdleToDowntime();
        isInActiveDowntime = true;
        showDowntimeModal();
        idleMinutesAccumulated = 0; // Reset counter
    }
}

// Parts are now added from real DFQ files via addPartFromDFQ()

// Start production counting (MODIFIED)
function startProductionCounting(session) {
    currentSession = session;

    // Reset Merkmal error tracking for new session
    dfqMerkmale.forEach(merkmal => {
        merkmal.errors = 0;
        merkmal.totalCount = 0;
    });
    shownErrors.clear();
    activeWarnings.clear();
    errorWarningBanner.style.display = 'none';

    // Remove NIO card blinking
    const nioCard = document.querySelector('.stat-card.bad');
    if (nioCard) {
        nioCard.classList.remove('error-active');
    }

    // Change header to "Aktuelle Prüfung" when new session starts
    sessionHeaderEl.textContent = 'Aktuelle Prüfung';

    // Update UI with session info (always visible)
    currentTBKEl.textContent = session.tbk;
    currentTeilEl.textContent = session.teil;
    currentPruefzyklusEl.textContent = session.pruefzyklus;

    // Update production counter display
    updateProductionDisplay();

    // NEW: Update production panel view to show stats
    updateProductionPanelView();

    // Parts are now added manually by uploading DFQ files
    // No automatic counting
    console.log('Session started. Upload DFQ files to add parts.');
}

// Make functions available globally for scanWorkflow.js
window.startProductionCounting = startProductionCounting;
window.addTimelineSegment = addTimelineSegment;
window.updateProductionPanelView = updateProductionPanelView;

// Getter and setter for currentStatus (needed by scanWorkflow.js)
window.setCurrentStatus = function(status) {
    currentStatus = status;
};
window.getCurrentStatus = function() {
    return currentStatus;
};

// Stop production counting (MODIFIED)
async function stopProductionCounting() {
    if (productionInterval) {
        clearInterval(productionInterval);
        productionInterval = null;
    }

    if (currentSession) {
        const endTimeISO = currentTimelineTime.toISOString();
        await updateProductionSession(currentSession.sessionId, {
            totalParts: currentSession.totalParts,
            ioParts: currentSession.ioParts,
            nioParts: currentSession.nioParts,
            endTime: endTimeISO
        });

        currentSession.endTime = endTimeISO;

        // Change header to "Letzte Prüfung" when session ends
        sessionHeaderEl.textContent = 'Letzte Prüfung';

        console.log('Production session ended:', currentSession.sessionId);
    }

    // NEW: Update production panel view to show start button
    updateProductionPanelView();
}

// Update production counter display
function updateProductionDisplay() {
    if (currentSession) {
        totalPartsEl.textContent = currentSession.totalParts;
        ioPartsEl.textContent = currentSession.ioParts;
        nioPartsEl.textContent = currentSession.nioParts;
    }
}

// Add a segment to the timeline
function addTimelineSegment(duration = 1) {
    if (currentStatus === null) return;

    // Advance timeline time
    currentTimelineTime = new Date(currentTimelineTime.getTime() + duration * 60000);

    // If we're in active downtime and status is idle, treat it as malfunction for display
    let displayStatus = currentStatus;
    if (isInActiveDowntime && currentStatus === 10) {
        displayStatus = -10;
    }

    const statusInfo = getStatusInfo(displayStatus);

    // Track idle time
    if (currentStatus === 10) {
        idleMinutesAccumulated += duration;
        console.log(`Idle time accumulated: ${idleMinutesAccumulated} minutes`);
    }

    // Add or update the last segment
    // Check if we can extend the last segment (same display status)
    if (timelineData.length > 0 &&
        timelineData[timelineData.length - 1].status === displayStatus) {
        timelineData[timelineData.length - 1].duration += duration;

        // Make sure sessionId is set for working segments
        if (displayStatus === 20 && currentSession && !timelineData[timelineData.length - 1].sessionId) {
            timelineData[timelineData.length - 1].sessionId = currentSession.sessionId;
        }
    } else {
        const segment = {
            status: displayStatus,
            class: statusInfo.class,
            duration: duration,
            timestamp: new Date(currentTimelineTime)
        };

        // If it's a working segment, attach the current session
        if (displayStatus === 20 && currentSession) {
            segment.sessionId = currentSession.sessionId;
        }

        // If it's a downtime segment, attach the downtime reason if available
        if (displayStatus === -10 && (downtimeReason || (currentDowntime && currentDowntime.reason))) {
            if (currentDowntime) {
                segment.downtimeId = currentDowntime.downtimeId;
                segment.downtimeReason = currentDowntime.reason;
            } else if (downtimeReason) {
                segment.downtimeReason = downtimeReason;
            }
            // Update class based on downtime reason
            const repairReasons = ['Reparatur', 'Monteur Einsatz'];
            if (segment.downtimeReason && repairReasons.includes(segment.downtimeReason)) {
                segment.class = 'malfunction-repair';
            }
        }

        timelineData.push(segment);
    }

    // Check for idle timeout
    checkIdleTimeout();

    renderTimeline();
}

// Render the timeline (always show last 4 hours)
function renderTimeline() {
    // Wenn Demo-Timeline aktiv ist, diese verwenden statt timelineData
    if (window.useDemoTimeline && typeof window.renderMainTimelineDemo === 'function') {
        console.log('🎭 Verwende Demo-Timeline');
        window.renderMainTimelineDemo();
        return;
    }
    
    // Hole DOM-Elemente frisch (falls sie beim Start noch nicht verfügbar waren)
    const mainTimeline = document.getElementById('timeline');
    const mainTimelineAxis = document.getElementById('timelineAxis');
    const loginTimeline = document.getElementById('loginTimeline');
    const loginTimelineAxis = document.getElementById('loginTimelineAxis');
    
    console.log('🕐 renderTimeline aufgerufen, timelineData hat', timelineData.length, 'Segmente');
    
    // Rendere Main App Timeline
    if (mainTimeline && mainTimelineAxis) {
        renderTimelineToElements(mainTimeline, mainTimelineAxis, true);
    }
    
    // Rendere Login-Timeline
    if (loginTimeline && loginTimelineAxis) {
        renderTimelineToElements(loginTimeline, loginTimelineAxis, false);
    }
}

function renderTimelineToElements(timelineEl, timelineAxisEl, interactive) {
    if (!timelineEl || !timelineAxisEl) return;
    
    timelineEl.innerHTML = '';
    timelineAxisEl.innerHTML = '';

    const FOUR_HOURS_IN_MINUTES = 240;
    const totalMinutes = timelineData.reduce((sum, segment) => sum + segment.duration, 0);

    // Show last 4 hours
    const visibleData = [];
    let minutesCollected = 0;

    // Collect segments from the end, up to 4 hours
    for (let i = timelineData.length - 1; i >= 0 && minutesCollected < FOUR_HOURS_IN_MINUTES; i--) {
        const segment = timelineData[i];
        const remainingNeeded = FOUR_HOURS_IN_MINUTES - minutesCollected;

        if (segment.duration <= remainingNeeded) {
            visibleData.unshift(segment);
            minutesCollected += segment.duration;
        } else {
            // Partial segment
            visibleData.unshift({
                ...segment,
                duration: remainingNeeded
            });
            minutesCollected = FOUR_HOURS_IN_MINUTES;
        }
    }

    // Fill with idle if less than 4 hours of data
    if (minutesCollected < FOUR_HOURS_IN_MINUTES) {
        visibleData.unshift({
            status: 10,
            class: 'idle',
            duration: FOUR_HOURS_IN_MINUTES - minutesCollected,
            timestamp: new Date(currentTimelineTime.getTime() - FOUR_HOURS_IN_MINUTES * 60000)
        });
    }

    // Render segments
    visibleData.forEach((segment, index) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = `timeline-segment ${segment.class}`;
        segmentDiv.style.flex = segment.duration;

        let tooltipText = `${getStatusInfo(segment.status).name}: ${segment.duration} min`;
        if (segment.downtimeReason) {
            tooltipText += ` (${segment.downtimeReason})`;
        }
        segmentDiv.title = tooltipText;

        // Zeige blinkendes Ausrufezeichen wenn Stillstand ohne Grund
        if (segment.needsReason || (segment.status === -10 && !segment.downtimeReason && index === visibleData.length - 1 && pendingDowntimeReason)) {
            segmentDiv.classList.add('needs-reason');
            const warningIcon = document.createElement('span');
            warningIcon.className = 'segment-warning-icon';
            warningIcon.textContent = '⚠️';
            segmentDiv.appendChild(warningIcon);
        }

        // Nur bei interaktiver Timeline (Main App) click-Events hinzufügen
        if (interactive) {
            // Make all segments clickable
            segmentDiv.style.cursor = 'pointer';

            // Working segments show session details
            if (segment.status === 20 && segment.sessionId) {
                segmentDiv.addEventListener('click', () => {
                    showEditSessionModal(segment);
                });
            }
            // Error/malfunction segments show downtime edit
            else if (segment.status === -10) {
                segmentDiv.addEventListener('click', () => {
                    showEditDowntimeModal(segment);
                });
            }
        }

        timelineEl.appendChild(segmentDiv);
    });

    // Render time axis (5 markers: -4h, -3h, -2h, -1h, now)
    for (let i = 0; i <= 4; i++) {
        const marker = document.createElement('div');
        marker.className = 'time-marker';

        const timeAtMarker = new Date(currentTimelineTime.getTime() - (4 - i) * 60 * 60 * 1000);
        marker.textContent = timeAtMarker.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        timelineAxisEl.appendChild(marker);
    }
}

// Show session details modal
async function showSessionDetails(sessionId) {
    // Use current session data (no Firebase)
    const session = currentSession;

    if (session && session.sessionId === sessionId) {
        document.getElementById('detailTBK').textContent = session.tbk;
        document.getElementById('detailTeil').textContent = session.teil;
        document.getElementById('detailLaufkarte').textContent = session.laufkarte;
        document.getElementById('detailCharge').textContent = session.charge;
        document.getElementById('detailPruefzyklus').textContent = session.pruefzyklus;
        document.getElementById('detailStartTime').textContent = new Date(session.startTime).toLocaleString('de-DE');
        document.getElementById('detailEndTime').textContent = session.endTime ? new Date(session.endTime).toLocaleString('de-DE') : 'Läuft';

        document.getElementById('detailTotalParts').textContent = session.totalParts;
        document.getElementById('detailIOParts').textContent = session.ioParts;
        document.getElementById('detailNIOParts').textContent = session.nioParts;

        const ioPercent = session.totalParts > 0 ? ((session.ioParts / session.totalParts) * 100).toFixed(1) : 0;
        const nioPercent = session.totalParts > 0 ? ((session.nioParts / session.totalParts) * 100).toFixed(1) : 0;

        document.getElementById('detailIOPercent').textContent = `${ioPercent}%`;
        document.getElementById('detailNIOPercent').textContent = `${nioPercent}%`;

        sessionDetailsModal.classList.add('active');
    } else {
        console.error('Session not found:', sessionId);
    }
}

// Hide session details modal
function hideSessionDetails() {
    sessionDetailsModal.classList.remove('active');
}

// Show edit session modal (for editing TBK from timeline segment)
function showEditSessionModal(segment) {
    console.log('Clicked on working segment:', segment);

    // Check if this is the current active session
    const isCurrentSession = currentSession && currentSession.sessionId === segment.sessionId;

    if (!isCurrentSession) {
        // Old session - just show info, can't edit
        editSegmentTitle.textContent = 'Prüfung Info (Archiviert)';

        editSegmentContent.innerHTML = `
            <div class="edit-session-form">
                <p class="info-text">Dies ist eine archivierte Prüfung. Sie können nur die aktuelle Prüfung bearbeiten.</p>
                <div class="session-stats">
                    <p><strong>Session ID:</strong> ${segment.sessionId}</p>
                    <p><strong>Dauer:</strong> ${segment.duration} Minuten</p>
                </div>
                <button id="closeArchivedBtn" class="btn-secondary">Schließen</button>
            </div>
        `;

        editSegmentModal.classList.add('active');

        document.getElementById('closeArchivedBtn').addEventListener('click', () => {
            editSegmentModal.classList.remove('active');
        });

        return;
    }

    // Current session - allow editing
    editSegmentTitle.textContent = 'Prüfung bearbeiten';

    editSegmentContent.innerHTML = `
        <div class="edit-session-form">
            <div class="form-group">
                <label for="editTBK">TBK Nummer:</label>
                <input type="text" id="editTBK" value="${currentSession.tbk}" class="form-input">
            </div>
            <div class="form-group">
                <label for="editTeil">Teil:</label>
                <input type="text" id="editTeil" value="${currentSession.teil}" class="form-input" readonly>
            </div>
            <div class="form-group">
                <label for="editPruefzyklus">Prüfzyklus:</label>
                <select id="editPruefzyklus" class="form-input">
                    <option value="1" ${currentSession.pruefzyklus === '1' ? 'selected' : ''}>Prüfzyklus 1</option>
                    <option value="2" ${currentSession.pruefzyklus === '2' ? 'selected' : ''}>Prüfzyklus 2</option>
                    <option value="3" ${currentSession.pruefzyklus === '3' ? 'selected' : ''}>Prüfzyklus 3</option>
                </select>
            </div>
            <div class="session-stats">
                <p><strong>Total:</strong> ${currentSession.totalParts}</p>
                <p><strong>IO:</strong> ${currentSession.ioParts}</p>
                <p><strong>NIO:</strong> ${currentSession.nioParts}</p>
            </div>
            <button id="saveSessionEditBtn" class="btn-primary">Speichern</button>
        </div>
    `;

    editSegmentModal.classList.add('active');

    // Add save handler
    document.getElementById('saveSessionEditBtn').addEventListener('click', () => {
        const newTBK = document.getElementById('editTBK').value.trim();
        const newPruefzyklus = document.getElementById('editPruefzyklus').value;

        if (!newTBK) {
            alert('TBK ist erforderlich!');
            return;
        }

        // Update session
        currentSession.tbk = newTBK;
        currentSession.pruefzyklus = newPruefzyklus;

        // Update display
        currentTBKEl.textContent = newTBK;
        currentPruefzyklusEl.textContent = newPruefzyklus;

        // Update timeline segment
        segment.tbk = newTBK;
        segment.pruefzyklus = newPruefzyklus;

        editSegmentModal.classList.remove('active');
        console.log('Session updated:', currentSession);
    });
}

// Show edit downtime modal (for editing error reason from timeline segment)
function showEditDowntimeModal(segment) {
    editSegmentTitle.textContent = 'Fehler bearbeiten';

    const downtimeReasons = [
        'Reparatur',
        'Werkzeugwechsel',
        'Materialmangel',
        'Qualitätsproblem',
        'Dokumentation',
        'Monteur Einsatz',
        'Ablauffehler',
        'Aushilfe andere Anlage',
        'Sonstiges'
    ];

    let reasonOptions = '';
    downtimeReasons.forEach(reason => {
        const selected = segment.downtimeReason === reason ? 'selected' : '';
        reasonOptions += `<option value="${reason}" ${selected}>${reason}</option>`;
    });

    editSegmentContent.innerHTML = `
        <div class="edit-downtime-form">
            <div class="form-group">
                <label for="editDowntimeReason">Fehlergrund:</label>
                <select id="editDowntimeReason" class="form-input">
                    ${reasonOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="editCustomReason">Eigener Grund (optional):</label>
                <input type="text" id="editCustomReason" class="form-input" placeholder="Nur wenn 'Sonstiges' ausgewählt">
            </div>
            <div class="downtime-info">
                <p><strong>Dauer:</strong> ${segment.duration} Minuten</p>
                <p><strong>Status:</strong> Malfunction</p>
            </div>
            <button id="saveDowntimeEditBtn" class="btn-primary">Speichern</button>
        </div>
    `;

    editSegmentModal.classList.add('active');

    // Show/hide custom reason input
    const reasonSelect = document.getElementById('editDowntimeReason');
    const customReasonInput = document.getElementById('editCustomReason');

    reasonSelect.addEventListener('change', () => {
        customReasonInput.style.display = reasonSelect.value === 'Sonstiges' ? 'block' : 'none';
    });

    // Initial state
    customReasonInput.style.display = reasonSelect.value === 'Sonstiges' ? 'block' : 'none';

    // Add save handler
    document.getElementById('saveDowntimeEditBtn').addEventListener('click', async () => {
        let newReason = reasonSelect.value;

        if (newReason === 'Sonstiges') {
            const customReason = customReasonInput.value.trim();
            if (customReason) {
                newReason = customReason;
            }
        }

        // Update segment
        segment.downtimeReason = newReason;

        // Determine class based on reason
        const repairReasons = ['Reparatur', 'Monteur Einsatz'];
        segment.class = repairReasons.includes(newReason) ? 'malfunction-repair' : 'malfunction';

        // Re-render timeline
        renderTimeline();

        // Send update to server
        try {
            await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'downtime_edit',
                    reason: newReason,
                    startTime: segment.timestamp,
                    durationMinutes: segment.duration,
                    additionalData: {
                        segmentStatus: segment.status,
                        editedAt: new Date().toISOString()
                    }
                })
            });
        } catch (error) {
            console.error('Error saving downtime edit:', error);
        }

        editSegmentModal.classList.remove('active');
        console.log('Downtime updated:', segment);
    });
}

// Close edit segment modal
closeEditSegmentModal.addEventListener('click', () => {
    editSegmentModal.classList.remove('active');
});

// Close on background click
editSegmentModal.addEventListener('click', (e) => {
    if (e.target === editSegmentModal) {
        editSegmentModal.classList.remove('active');
    }
});

// Show barcode modal
function showBarcodeModal() {
    barcodeModal.classList.add('active');
    barcodeInput.value = '';
    barcodeError.textContent = '';
    setTimeout(() => barcodeInput.focus(), 100);
}

// Hide barcode modal
function hideBarcodeModal() {
    barcodeModal.classList.remove('active');
}

// Show Prüfzyklus modal
function showPruefzyklusModal(tbkData) {
    currentTBKData = tbkData;
    tbkNumber.textContent = tbkData.tbk;
    tbkTeil.textContent = tbkData.teil;
    tbkLaufkarte.textContent = tbkData.laufkarte;
    tbkCharge.textContent = tbkData.charge;

    hideBarcodeModal();
    pruefzyklusModal.classList.add('active');
}

// Hide Prüfzyklus modal
function hidePruefzyklusModal() {
    pruefzyklusModal.classList.remove('active');
}

// Fetch TBK data (mock data - no Firebase)
async function fetchTBKData(tbkNumberValue) {
    // Accept any TBK number and return mock data
    // In production, this could fetch from a local database or API
    return {
        tbk: tbkNumberValue,
        teil: currentTeilEl.textContent || 'Unbekanntes Teil',
        laufkarte: `LK-${tbkNumberValue.slice(0, 4)}`,
        charge: `CH-${Date.now().toString().slice(-6)}`
    };
}

// Handle barcode submission (MODIFIED for new workflow)
async function handleBarcodeSubmit() {
    const tbkValue = barcodeInput.value.trim();

    if (!tbkValue) {
        barcodeError.textContent = 'Bitte geben Sie eine TBK-Nummer ein';
        return;
    }

    const tbkData = await fetchTBKData(tbkValue);

    if (tbkData) {
        currentTBKData = tbkData;

        // NEW WORKFLOW: Go to container scan instead of Prüfzyklus
        showContainerScanModal();
    } else {
        barcodeError.textContent = `TBK-Nummer ${tbkValue} nicht in Datenbank gefunden`;
    }
}

// Handle Prüfzyklus selection
async function handlePruefzyklusSelect(zyklus) {
    console.log(`Selected Prüfzyklus ${zyklus} for TBK ${currentTBKData.tbk}`);

    const session = await createProductionSession(currentTBKData, zyklus);

    if (session) {
        startProductionCounting(session);

        // If there's a pending DFQ file, process it now
        if (window.pendingDFQData) {
            console.log('Processing pending DFQ file after session start');
            addPartFromDFQ(window.pendingDFQData);
            window.pendingDFQData = null;
        }
    }

    hidePruefzyklusModal();
    currentTBKData = null;
}

// Handle downtime reason selection
async function handleDowntimeReasonSelect(reason) {
    console.log(`Downtime reason selected: ${reason}`);

    // Store the reason but don't create the record yet
    // Record will be created when downtime ends (status changes)
    downtimeReason = reason;
    
    // Setze pendingDowntimeReason zurück - Grund wurde angegeben
    pendingDowntimeReason = false;

    // Determine class based on reason
    const repairReasons = ['Reparatur', 'Monteur Einsatz'];
    const downtimeClass = repairReasons.includes(reason) ? 'malfunction-repair' : 'malfunction';

    // Update all current malfunction segments with the reason and class
    timelineData.forEach(segment => {
        if (segment.status === -10 && (!segment.downtimeReason || segment.needsReason)) {
            segment.downtimeReason = reason;
            segment.class = downtimeClass;
            segment.needsReason = false; // Entferne das Flag
        }
    });
    
    // AUCH Demo-Segmente aktualisieren (falls vorhanden)
    if (window.demoTimelineSegments && downtimeModal && downtimeModal.dataset.segmentIndex !== undefined) {
        const idx = parseInt(downtimeModal.dataset.segmentIndex);
        if (window.demoTimelineSegments[idx]) {
            window.demoTimelineSegments[idx].reason = reason;
            window.demoTimelineSegments[idx].class = downtimeClass;
            console.log('Demo-Segment aktualisiert:', idx, reason);
        }
        // Index zurücksetzen
        delete downtimeModal.dataset.segmentIndex;
        
        // Demo-Timeline neu rendern
        if (typeof window.renderMainTimelineDemo === 'function') {
            window.renderMainTimelineDemo();
        }
    }

    renderTimeline();
    hideDowntimeModal();
}

// Finalize downtime record when downtime ends
async function finalizeDowntimeRecord() {
    if (downtimeStartTime && downtimeReason) {
        await createDowntimeRecord(downtimeReason);

        // Reset downtime tracking
        downtimeStartTime = null;
        downtimeReason = null;
        currentDowntime = null;
        isInActiveDowntime = false;
    }
}

// Note: Machine status is now driven by DFQ file reception
// When files arrive → machine is working (status 20)
// When no files for X minutes → machine error (status -10)

// Event Listeners (with null checks for optional elements)
if (submitBarcode) {
    submitBarcode.addEventListener('click', handleBarcodeSubmit);
}

if (barcodeInput) {
    barcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleBarcodeSubmit();
        }
    });
}

if (pruefzyklusButtons) {
    pruefzyklusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const zyklus = button.getAttribute('data-zyklus');
            handlePruefzyklusSelect(zyklus);
        });
    });
}

if (downtimeButtons) {
    downtimeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reason = button.getAttribute('data-reason');
            if (reason === 'Sonstiges') {
                showCustomReasonModal();
            } else {
                handleDowntimeReasonSelect(reason);
            }
        });
    });
}

// Custom reason modal event listeners
if (submitCustomReason) {
    submitCustomReason.addEventListener('click', () => {
        const customReason = customReasonInput.value.trim();
        if (customReason) {
            handleDowntimeReasonSelect(`Sonstiges: ${customReason}`);
            hideCustomReasonModal();
        }
    });
}

if (customReasonInput) {
    customReasonInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const customReason = customReasonInput.value.trim();
            if (customReason) {
                handleDowntimeReasonSelect(`Sonstiges: ${customReason}`);
                hideCustomReasonModal();
            }
        }
    });
}

if (cancelCustomReason) {
    cancelCustomReason.addEventListener('click', () => {
        hideCustomReasonModal();
        showDowntimeModal();
    });
}

// Session details modal event listeners
if (closeSessionModal) {
    closeSessionModal.addEventListener('click', hideSessionDetails);
}

// Close session details modal when clicking outside
if (sessionDetailsModal) {
    sessionDetailsModal.addEventListener('click', (e) => {
        if (e.target === sessionDetailsModal) {
            hideSessionDetails();
        }
    });
}

// Analysis Dashboard Modal elements
const analysisModal = document.getElementById('analysisModal');
const analysisBtn = document.getElementById('analysisBtn');
const closeAnalysisModal = document.getElementById('closeAnalysisModal');

// Show analysis dashboard modal
function showAnalysisDashboard() {
    analysisModal.classList.add('active');
}

// Hide analysis dashboard modal
function hideAnalysisDashboard() {
    analysisModal.classList.remove('active');
}

// Analysis button event listener
if (analysisBtn) {
    analysisBtn.addEventListener('click', showAnalysisDashboard);
}

// Close button event listener
if (closeAnalysisModal) {
    closeAnalysisModal.addEventListener('click', hideAnalysisDashboard);
}

// Close modal when clicking outside
if (analysisModal) {
    analysisModal.addEventListener('click', (e) => {
        if (e.target === analysisModal) {
            hideAnalysisDashboard();
        }
    });
}

// Configuration Modal elements
const configModal = document.getElementById('configModal');
const configBtn = document.getElementById('configBtn');
const closeConfigModal = document.getElementById('closeConfigModal');
const saveConfigBtn = document.getElementById('saveConfigBtn');

// Machine timeout configuration elements
const machineTimeoutInput = document.getElementById('machineTimeout');
const showTimerToggle = document.getElementById('showTimerToggle');
const errorCheckThresholdInput = document.getElementById('errorCheckThreshold');

// Note: Merkmal threshold sliders are now created dynamically when DFQ file is loaded

// Error Alert Modal elements
const errorAlertModal = document.getElementById('errorAlertModal');
const acknowledgeErrorBtn = document.getElementById('acknowledgeErrorBtn');
const errorAlertMessage = document.getElementById('errorAlertMessage');
const errorMerkmal = document.getElementById('errorMerkmal');
const errorRate = document.getElementById('errorRate');
const errorThreshold = document.getElementById('errorThreshold');

// Configuration state (merkmal thresholds stored in dfqMerkmale array)

// Show configuration modal
function showConfigModal() {
    // Load current machine timeout config
    machineTimeoutInput.value = machineConfig.timeoutMinutes;
    showTimerToggle.checked = machineConfig.showTimer;
    errorCheckThresholdInput.value = machineConfig.errorCheckThreshold;

    // Merkmal thresholds are loaded dynamically when DFQ file is loaded
    // No need to set them here as they're managed by renderMerkmaleConfig()

    configModal.classList.add('active');
}

// Hide configuration modal
function hideConfigModal() {
    configModal.classList.remove('active');
}

// Show error alert
function showErrorAlert(merkmalName, errorPercent, thresholdPercent) {
    errorAlertMessage.textContent = `Die Fehlerrate für ${merkmalName} hat den festgelegten Grenzwert überschritten!`;
    errorMerkmal.textContent = merkmalName;
    errorRate.textContent = errorPercent.toFixed(1) + '%';
    errorThreshold.textContent = thresholdPercent + '%';
    errorAlertModal.classList.add('active');
}

// Hide error alert
function hideErrorAlert() {
    errorAlertModal.classList.remove('active');
}

// Merkmal threshold sliders are now created dynamically in renderMerkmaleConfig()
// Their event listeners are added when the DFQ file is loaded

// Save configuration
if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', () => {
        // Save machine timeout config
        machineConfig.timeoutMinutes = parseInt(machineTimeoutInput.value);
        machineConfig.showTimer = showTimerToggle.checked;
        machineConfig.errorCheckThreshold = parseInt(errorCheckThresholdInput.value);

        // Restart timeout monitoring with new config
        if (lastDFQFileTime) {
            startMachineTimeoutMonitoring();
        }

        // Merkmal thresholds are saved automatically when sliders are changed
        // in the renderMerkmaleConfig() function (each slider updates merkmal.threshold directly)

        // Don't reset error counts - they should persist for the current session
        // Only reset the "shown errors" set so thresholds can be re-triggered
        shownErrors.clear();

        // Update warning banner in case thresholds changed
        updateWarningBanner();

        console.log('Configuration saved:', machineConfig, dfqMerkmale);
        hideConfigModal();
    });
}

// Check for Merkmal errors
function checkMerkmalErrors() {
    if (!currentSession || currentSession.totalParts < machineConfig.errorCheckThreshold) {
        return; // Only check after configured threshold
    }

    // Update warning banner
    updateWarningBanner();

    // Check each merkmal from dfqMerkmale array
    for (const merkmal of dfqMerkmale) {
        if (merkmal.totalCount > 0) {
            const errorPercent = (merkmal.errors / merkmal.totalCount) * 100;

            // Check if threshold exceeded and not yet shown
            if (errorPercent >= merkmal.threshold && !shownErrors.has(merkmal.name)) {
                shownErrors.add(merkmal.name);
                showErrorAlert(merkmal.name, errorPercent, merkmal.threshold);
                break; // Show one error at a time
            }
        }
    }
}

// Part IO/NIO status is now determined from real DFQ measurement data

// Config button event listeners
if (configBtn) {
    configBtn.addEventListener('click', showConfigModal);
}
if (closeConfigModal) {
    closeConfigModal.addEventListener('click', hideConfigModal);
}
if (configModal) {
    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) {
            hideConfigModal();
        }
    });
}

// Error alert button listener
if (acknowledgeErrorBtn) {
    acknowledgeErrorBtn.addEventListener('click', () => {
        const currentErrorMerkmal = errorMerkmal.textContent;
        hideErrorAlert();
        // Show persistent warning banner
        showWarningBanner(currentErrorMerkmal);
    });
}

// NIO card element
const nioPartsCard = document.querySelector('.stat-card.bad');

// Show warning banner
function showWarningBanner(merkmalName) {
    // Find which merkmal corresponds to this name
    const merkmal = dfqMerkmale.find(m => m.name === merkmalName);

    if (merkmal) {
        activeWarnings.set(merkmal.name, merkmalName);
        updateWarningBanner();
    }
}

// Update warning banner and NIO card blinking
function updateWarningBanner() {
    if (activeWarnings.size === 0) {
        errorWarningBanner.style.display = 'none';
        // Remove blinking from NIO card
        if (nioPartsCard) {
            nioPartsCard.classList.remove('error-active');
        }
        return;
    }

    // Check if any warnings can be removed (error fixed)
    const toRemove = [];
    for (const [merkmalKey, merkmalName] of activeWarnings.entries()) {
        if (!currentSession || currentSession.totalParts < machineConfig.errorCheckThreshold) {
            continue;
        }
        const merkmal = dfqMerkmale.find(m => m.name === merkmalKey);
        if (merkmal && merkmal.totalCount > 0) {
            const errorPercent = (merkmal.errors / merkmal.totalCount) * 100;

            // If error rate dropped below threshold, remove warning
            if (errorPercent < merkmal.threshold) {
                toRemove.push(merkmalKey);
            }
        }
    }

    toRemove.forEach(key => activeWarnings.delete(key));

    if (activeWarnings.size === 0) {
        errorWarningBanner.style.display = 'none';
        // Remove blinking from NIO card
        if (nioPartsCard) {
            nioPartsCard.classList.remove('error-active');
        }
        return;
    }

    // Make NIO card blink in red
    if (nioPartsCard) {
        nioPartsCard.classList.add('error-active');
    }
}

// NIO Breakdown Modal
const nioBreakdownModal = document.getElementById('nioBreakdownModal');
const closeNioBreakdownModal = document.getElementById('closeNioBreakdownModal');

function showNioBreakdown() {
    if (!currentSession) {
        return;
    }

    // Update summary
    document.getElementById('nioTotalParts').textContent = currentSession.totalParts;
    document.getElementById('nioIOParts').textContent = currentSession.ioParts;
    document.getElementById('nioNIOParts').textContent = currentSession.nioParts;

    // Build merkmal breakdown
    const merkmalBreakdown = document.getElementById('merkmalBreakdown');
    merkmalBreakdown.innerHTML = '';

    // Use DFQ merkmale if available, otherwise fall back to static config
    const merkmaleToShow = dfqMerkmale.length > 0 ? dfqMerkmale : [
        { name: 'Durchmesser 20', errors: merkmalConfig.durchmesser20.errors, threshold: merkmalConfig.durchmesser20.threshold, totalCount: currentSession.totalParts },
        { name: 'Durchmesser 40', errors: merkmalConfig.durchmesser40.errors, threshold: merkmalConfig.durchmesser40.threshold, totalCount: currentSession.totalParts },
        { name: 'Länge 30', errors: merkmalConfig.laenge30.errors, threshold: merkmalConfig.laenge30.threshold, totalCount: currentSession.totalParts }
    ];

    merkmaleToShow.forEach((merkmal, idx) => {
        const errorCount = merkmal.errors;
        const totalCount = merkmal.totalCount || currentSession.totalParts;
        const errorPercent = totalCount > 0
            ? ((errorCount / totalCount) * 100).toFixed(2)
            : '0.00';

        const hasErrors = errorCount > 0;
        const isOverThreshold = parseFloat(errorPercent) >= merkmal.threshold;

        // Get measurement and tolerance data from last uploaded file
        let messwert = '-';
        let untereTol = merkmal.untereTol || '-';
        let obereTol = merkmal.obereTol || '-';
        let einheit = merkmal.einheit || '';
        let measurementStatus = '';

        if (uploadedFiles.length > 0) {
            const lastFile = uploadedFiles[uploadedFiles.length - 1];
            const merkmalResult = lastFile.partData.merkmalResults[idx];

            if (merkmalResult && merkmalResult.measurement !== null) {
                messwert = merkmalResult.measurement.toFixed(5);
                measurementStatus = merkmalResult.isIO ? '✓ IO' : '✗ NIO';
            }
        }

        const merkmalItem = document.createElement('div');
        merkmalItem.className = `merkmal-item ${!hasErrors ? 'no-errors' : ''}`;

        merkmalItem.innerHTML = `
            <div class="merkmal-header">
                <span class="merkmal-name">${merkmal.name}</span>
                <span class="merkmal-count">${errorCount} Fehler</span>
            </div>
            <div class="merkmal-measurement-info">
                <div class="measurement-row">
                    <span class="measurement-label">Messwert:</span>
                    <span class="measurement-value">${messwert} ${einheit} ${measurementStatus}</span>
                </div>
                <div class="measurement-row">
                    <span class="measurement-label">Toleranz:</span>
                    <span class="measurement-value">${untereTol} - ${obereTol} ${einheit}</span>
                </div>
            </div>
            <div class="merkmal-stats">
                <div class="merkmal-stat">
                    <span class="stat-label">Geprüft:</span>
                    <span class="stat-value">${totalCount} Teile</span>
                </div>
                <div class="merkmal-stat">
                    <span class="stat-label">Fehlerrate:</span>
                    <span class="stat-value">${errorPercent}%</span>
                </div>
                <div class="merkmal-stat">
                    <span class="stat-label">Grenzwert:</span>
                    <span class="stat-value">${merkmal.threshold}%</span>
                </div>
                <div class="merkmal-stat">
                    <span class="stat-label">Status:</span>
                    <span class="stat-value" style="color: ${isOverThreshold ? '#e74c3c' : '#27ae60'}">
                        ${isOverThreshold ? '⚠️ Überschritten' : '✓ OK'}
                    </span>
                </div>
            </div>
        `;

        merkmalBreakdown.appendChild(merkmalItem);
    });

    nioBreakdownModal.classList.add('active');
}

function hideNioBreakdown() {
    nioBreakdownModal.classList.remove('active');
}

// NIO card click handler
if (nioPartsCard) {
    nioPartsCard.addEventListener('click', showNioBreakdown);
}

closeNioBreakdownModal.addEventListener('click', hideNioBreakdown);
nioBreakdownModal.addEventListener('click', (e) => {
    if (e.target === nioBreakdownModal) {
        hideNioBreakdown();
    }
});

// Auto-update timeline every minute
setInterval(() => {
    if (currentStatus !== null) {
        addTimelineSegment(1);
    }
}, 60000); // Every 60 seconds = 1 minute

// ============================================
// AUFTRÄGE MODAL FUNCTIONS
// ============================================

// Show Aufträge modal
function showAuftraegeModal() {
    renderOrdersGrid();
    updateSelectedOrderDisplay();
    auftraegeModal.classList.add('active');
}

// Hide Aufträge modal
function hideAuftraegeModal() {
    auftraegeModal.classList.remove('active');
}

// Render orders grid
function renderOrdersGrid() {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        if (selectedOrder && selectedOrder.id === order.id) {
            orderCard.classList.add('selected');
        }

        orderCard.innerHTML = `
            <div class="order-card-number">${order.laufkartenNr}</div>
            <div class="order-card-label">Laufkarte</div>
        `;

        orderCard.addEventListener('click', () => {
            setSelectedOrder(order);
            renderOrdersGrid(); // Re-render to update selection
        });

        ordersGrid.appendChild(orderCard);
    });
}

// Update selected order display
function updateSelectedOrderDisplay() {
    const display = document.getElementById('selectedOrderDisplay');

    if (selectedOrder) {
        display.textContent = selectedOrder.laufkartenNr;
    } else {
        display.textContent = 'Kein Auftrag ausgewählt';
    }
}

// Request new orders
function handleRequestNewOrders() {
    console.log('Requesting new orders...');

    // In production, this would be an API call
    // For prototype, add mock orders
    const newOrderId = orders.length + 1;
    const newOrder = {
        id: newOrderId,
        laufkartenNr: `LK-2024-${String(newOrderId).padStart(3, '0')}`,
        status: 'active',
        pruefzyklus: String((newOrderId % 3) + 1)
    };

    orders.push(newOrder);
    renderOrdersGrid();

    alert(`Neuer Auftrag hinzugefügt: ${newOrder.laufkartenNr}`);
}

// ============================================
// CONTAINER SCAN MODAL FUNCTIONS
// ============================================

// Show container scan modal
function showContainerScanModal() {
    hideBarcodeModal();
    containerScanModal.classList.add('active');
    containerCountInput.value = '';
    containerError.textContent = '';
    setTimeout(() => containerCountInput.focus(), 100);
}

// Hide container scan modal
function hideContainerScanModal() {
    containerScanModal.classList.remove('active');
}

// Handle container count submission
function handleContainerCountSubmit() {
    const count = parseInt(containerCountInput.value);

    if (!count || count < 1) {
        containerError.textContent = 'Bitte geben Sie eine gültige Anzahl ein (mindestens 1)';
        return;
    }

    if (count > 999) {
        containerError.textContent = 'Die Anzahl darf nicht größer als 999 sein';
        return;
    }

    containerCount = count;
    console.log(`Container count: ${containerCount}`);

    hideContainerScanModal();
    showTBKPrintModal();
}

// ============================================
// TBK PRINT MODAL FUNCTIONS
// ============================================

// Show TBK print modal
function showTBKPrintModal() {
    if (!selectedOrder) {
        alert('Kein Auftrag ausgewählt! Bitte wählen Sie zuerst einen Auftrag.');
        return;
    }

    const laufkartenNr = selectedOrder.laufkartenNr;
    const chargennummer = generateChargennummer();

    document.getElementById('printLaufkartenNr').textContent = laufkartenNr;
    document.getElementById('printChargennummer').textContent = chargennummer;
    document.getElementById('maxTBKCount').textContent = containerCount;

    // Reset print count to 1
    tbkPrintCount = 1;
    tbksPrinted = false;
    updateTBKPrintCountDisplay();

    // Show print button, hide start test button
    printTBKsBtn.style.display = 'block';
    startTestBtn.style.display = 'none';

    tbkPrintModal.classList.add('active');
}

// Hide TBK print modal
function hideTBKPrintModal() {
    tbkPrintModal.classList.remove('active');
}

// Update TBK print count display
function updateTBKPrintCountDisplay() {
    document.getElementById('printCountValue').textContent = tbkPrintCount;

    // Disable/enable buttons
    const decrementBtn = document.getElementById('decrementTBK');
    const incrementBtn = document.getElementById('incrementTBK');

    decrementBtn.disabled = tbkPrintCount <= 1;
    incrementBtn.disabled = tbkPrintCount >= containerCount;
}

// Increment TBK count
function incrementTBKCount() {
    if (tbkPrintCount < containerCount) {
        tbkPrintCount++;
        updateTBKPrintCountDisplay();
    }
}

// Decrement TBK count
function decrementTBKCount() {
    if (tbkPrintCount > 1) {
        tbkPrintCount--;
        updateTBKPrintCountDisplay();
    }
}

// Handle TBK printing
function handlePrintTBKs() {
    console.log('=== handlePrintTBKs wurde aufgerufen ===');
    console.log(`Drucke ${tbkPrintCount} TBK(s) für Auftrag ${selectedOrder.laufkartenNr}`);

    // Simulate printing
    tbksPrinted = true;

    // Hide print button, show start test button
    console.log('Verstecke Print-Button, zeige Start-Button');
    printTBKsBtn.style.display = 'none';
    startTestBtn.style.display = 'block';

    alert(`${tbkPrintCount} TBK(s) wurden gedruckt!`);
    console.log('=== handlePrintTBKs abgeschlossen ===');
}

// Handle test start from TBK print modal
async function handleTestStartFromPrint() {
    if (!selectedOrder) {
        alert('Kein Auftrag ausgewählt!');
        return;
    }

    if (!currentTBKData) {
        alert('Keine TBK-Daten verfügbar!');
        return;
    }

    if (!tbksPrinted) {
        alert('Bitte drucken Sie zuerst die TBKs!');
        return;
    }

    // Get Prüfzyklus from selected order
    const pruefzyklus = selectedOrder.pruefzyklus;

    // Create session with order data
    const session = await createProductionSession(currentTBKData, pruefzyklus);

    if (session) {
        // Deaktiviere Demo-Timeline - echter Prüfprozess startet
        window.useDemoTimeline = false;
        
        // Set status to working to start timeline
        currentStatus = 20;

        startProductionCounting(session);

        // Add initial working segment to timeline
        addTimelineSegment(0);

        // Process pending DFQ file if available
        if (window.pendingDFQData) {
            console.log('Processing pending DFQ file after session start');
            addPartFromDFQ(window.pendingDFQData);
            window.pendingDFQData = null;
        }

        // Start machine timeout monitoring
        if (lastDFQFileTime) {
            startMachineTimeoutMonitoring();
        }
    }

    hideTBKPrintModal();

    // Reset workflow state
    containerCount = 0;
    tbkPrintCount = 1;
    tbksPrinted = false;
    currentTBKData = null;
}

// Initialize session info display
totalPartsEl.textContent = '0';
ioPartsEl.textContent = '0';
nioPartsEl.textContent = '0';
currentTBKEl.textContent = '-';
currentTeilEl.textContent = '-';
currentPruefzyklusEl.textContent = '-';

// DFQ File Upload Handler
const dfqFileInput = document.getElementById('dfqFileInput');
const dfqUploadBtn = document.getElementById('dfqUploadBtn');
const dfqFileName = document.getElementById('dfqFileName');
const dfqInfo = document.getElementById('dfqInfo');
const dfqPartName = document.getElementById('dfqPartName');

// Store parsed DFQ data
let currentDFQData = null;
let dfqMerkmale = [];
let uploadedFiles = []; // Track all uploaded files

// Parse DFQ file content
function parseDFQFile(content) {
    const data = {};
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Split by first space to separate K-ID from value
        const spaceIndex = trimmedLine.indexOf(' ');
        if (spaceIndex === -1) continue;

        const kid = trimmedLine.substring(0, spaceIndex);
        const value = trimmedLine.substring(spaceIndex + 1);

        data[kid] = value;
    }

    return data;
}

// Extract Merkmale from DFQ data
function extractMerkmaleFromDFQ(dfqData) {
    const merkmale = [];
    let index = 1;

    // Loop through all possible merkmal indices
    while (dfqData[`K2002/${index}`]) {
        index++;
    }

    const totalMerkmale = index - 1;
    const realMerkmaleCount = totalMerkmale - 6; // Last 6 are not real merkmale

    // Only extract real merkmale (exclude last 6)
    for (let i = 1; i <= realMerkmaleCount; i++) {
        const merkmalName = dfqData[`K2002/${i}`];
        const sollwert = parseFloat(dfqData[`K2101/${i}`]) || 0;
        const untereTol = parseFloat(dfqData[`K2110/${i}`]) || 0;
        const obereTol = parseFloat(dfqData[`K2111/${i}`]) || 0;
        const einheit = dfqData[`K2142/${i}`] || '';

        merkmale.push({
            id: `merkmal${i}`,
            index: i,
            name: merkmalName,
            sollwert: sollwert,
            untereTol: untereTol,
            obereTol: obereTol,
            einheit: einheit,
            threshold: 10, // Default threshold
            errors: 0,
            totalCount: 0
        });
    }

    console.log(`Extracted ${merkmale.length} real merkmale (excluded last 6 non-measurement fields)`);
    return merkmale;
}

// Parse K0001 measurement values
// K0001 contains measurement values separated by a special character (� or similar)
function parseK0001Measurements(k0001String, dfqData, realMerkmaleCount) {
    console.log('=== K0001 PARSING DEBUG ===');
    console.log('K0001 String:', k0001String);
    console.log('Total length:', k0001String.length);
    console.log('Real Merkmale Count:', realMerkmaleCount);

    // Try to detect separator character
    // Common separators: � (replacement char), tab, special ASCII chars
    let separator = '�';

    // Check for common separators
    if (k0001String.includes('�')) {
        separator = '�';
    } else if (k0001String.includes('\t')) {
        separator = '\t';
    } else if (k0001String.includes('|')) {
        separator = '|';
    } else {
        // Try to find non-numeric characters as potential separators
        const match = k0001String.match(/\d+\.\d+([^\d.])/);
        if (match && match[1]) {
            separator = match[1];
        }
    }

    console.log('Detected separator:', separator.charCodeAt(0), `"${separator}"`);

    // Split by separator
    const values = k0001String.split(separator).filter(v => v.trim() !== '');
    console.log('Split values count:', values.length);
    console.log('First 10 values:', values.slice(0, 10));

    const measurements = [];

    for (let i = 1; i <= realMerkmaleCount; i++) {
        const untereTol = parseFloat(dfqData[`K2110/${i}`]);
        const obereTol = parseFloat(dfqData[`K2111/${i}`]);
        const sollwert = parseFloat(dfqData[`K2101/${i}`]);
        const valueIndex = i - 1;

        console.log(`\n--- Merkmal ${i}: ${dfqData[`K2002/${i}`]} ---`);
        console.log(`Sollwert: ${sollwert}`);
        console.log(`Toleranz: [${untereTol}, ${obereTol}]`);

        if (valueIndex < values.length) {
            const valueString = values[valueIndex].trim();
            const measurement = parseFloat(valueString);

            if (!isNaN(measurement)) {
                measurements.push(measurement);
                const isInTolerance = measurement >= untereTol && measurement <= obereTol;
                console.log(`✓ Value: "${valueString}" → ${measurement}`);
                console.log(`  In tolerance: ${isInTolerance ? 'YES ✓' : 'NO ✗ NIO!'}`);
            } else {
                console.warn(`✗ Could not parse: "${valueString}"`);
                measurements.push(null);
            }
        } else {
            console.warn(`✗ No value at index ${valueIndex} (array length: ${values.length})`);
            measurements.push(null);
        }
    }

    console.log('\n=== PARSING COMPLETE ===');
    console.log('Parsed measurements:', measurements.length);
    return measurements;
}

// Extract part data from DFQ (status and merkmal results)
function extractPartDataFromDFQ(dfqData) {
    // Find total number of merkmale
    let totalMerkmale = 0;
    let index = 1;
    while (dfqData[`K2002/${index}`]) {
        totalMerkmale++;
        index++;
    }

    const realMerkmaleCount = totalMerkmale - 6;

    // Parse K0001 measurements
    const k0001String = dfqData['K0001'] || '';
    const measurements = parseK0001Measurements(k0001String, dfqData, realMerkmaleCount);

    // Evaluate merkmal results by comparing measurements to tolerances
    const merkmalResults = [];
    let nioCount = 0;

    for (let i = 1; i <= realMerkmaleCount; i++) {
        const measurement = measurements[i - 1];
        const untereTol = parseFloat(dfqData[`K2110/${i}`]);
        const obereTol = parseFloat(dfqData[`K2111/${i}`]);

        let merkmalIsIO = true; // Default to IO

        if (measurement !== null && !isNaN(untereTol) && !isNaN(obereTol)) {
            // Check if measurement is within tolerance
            merkmalIsIO = measurement >= untereTol && measurement <= obereTol;

            if (!merkmalIsIO) {
                nioCount++;
                console.log(`NIO Merkmal ${i} - ${dfqData[`K2002/${i}`]}: Messwert=${measurement}, Toleranz=[${untereTol}, ${obereTol}]`);
            }
        }

        merkmalResults.push({
            index: i,
            isIO: merkmalIsIO,
            measurement: measurement,
            name: dfqData[`K2002/${i}`] || `Merkmal ${i}`
        });
    }

    // Overall part status: IO if all merkmale are IO
    const isIO = nioCount === 0;

    console.log('Part Status from Measurements:', {
        totalMerkmale: totalMerkmale,
        realMerkmale: realMerkmaleCount,
        nioCount: nioCount,
        isIO: isIO
    });

    return {
        isIO: isIO,
        merkmalResults: merkmalResults,
        partName: dfqData['K1002'] || 'Unknown'
    };
}

// Render Merkmale in configuration modal
function renderMerkmaleConfig(merkmale) {
    const container = document.getElementById('merkmaleContainer');
    if (!container) {
        console.error('Merkmale container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    if (merkmale.length === 0) {
        container.innerHTML = `
            <div class="merkmal-config">
                <p class="info-text">Keine Merkmale verfügbar. Bitte DFQ-Datei hochladen.</p>
            </div>
        `;
        return;
    }

    // Create merkmal config for each feature
    merkmale.forEach((merkmal, idx) => {
        const merkmalDiv = document.createElement('div');
        merkmalDiv.className = 'merkmal-config';
        merkmalDiv.innerHTML = `
            <div class="merkmal-header">
                <span class="merkmal-name">${merkmal.name}</span>
                <span class="merkmal-value">Fehlergrenze: <span id="${merkmal.id}ThresholdValue">${merkmal.threshold}%</span></span>
            </div>
            <div class="merkmal-details">
                <span class="merkmal-detail">Soll: ${merkmal.sollwert} ${merkmal.einheit}</span>
                <span class="merkmal-detail">Toleranz: ${merkmal.untereTol} - ${merkmal.obereTol} ${merkmal.einheit}</span>
            </div>
            <input type="range" id="${merkmal.id}Threshold" min="1" max="50" value="${merkmal.threshold}">
        `;
        container.appendChild(merkmalDiv);

        // Add event listener for threshold slider
        const slider = document.getElementById(`${merkmal.id}Threshold`);
        const valueDisplay = document.getElementById(`${merkmal.id}ThresholdValue`);

        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value + '%';
            merkmal.threshold = parseInt(e.target.value);
        });
    });
}

// Process a part from DFQ data and add to session
function addPartFromDFQ(dfqData) {
    if (!currentSession) {
        console.warn('No active session - part not added to session counts');
        return false;
    }

    if (dfqMerkmale.length === 0) {
        console.warn('No merkmale loaded - cannot add part');
        return false;
    }

    // Extract part data
    const partData = extractPartDataFromDFQ(dfqData);

    console.log('Part data extracted:', partData);

    // Update session counts
    currentSession.totalParts++;

    if (partData.isIO) {
        currentSession.ioParts++;
    } else {
        currentSession.nioParts++;
    }

    // Update merkmal error counts
    partData.merkmalResults.forEach((result, idx) => {
        if (idx < dfqMerkmale.length) {
            dfqMerkmale[idx].totalCount++;
            if (!result.isIO) {
                dfqMerkmale[idx].errors++;
            }
        }
    });

    // Update UI
    updateProductionDisplay();
    checkMerkmalErrors();

    console.log(`Part added: ${partData.isIO ? 'IO' : 'NIO'} - Total: ${currentSession.totalParts}`);
    return true;
}

// Machine timeout monitoring functions
function startMachineTimeoutMonitoring() {
    // Clear any existing timeout
    if (machineTimeoutInterval) {
        clearInterval(machineTimeoutInterval);
    }

    // Record the current time
    lastDFQFileTime = new Date();
    machineInErrorState = false;

    // Show timer if enabled
    if (machineConfig.showTimer) {
        timeoutTimer.style.display = 'flex';
    }

    // Check every second for accurate timer display
    machineTimeoutInterval = setInterval(() => {
        const now = new Date();
        const secondsSinceLastFile = (now - lastDFQFileTime) / 1000;
        const minutesSinceLastFile = secondsSinceLastFile / 60;

        // Update timer display
        if (machineConfig.showTimer) {
            const timeoutSeconds = machineConfig.timeoutMinutes * 60;
            const remainingSeconds = Math.max(0, timeoutSeconds - secondsSinceLastFile);
            const mins = Math.floor(remainingSeconds / 60);
            const secs = Math.floor(remainingSeconds % 60);
            timerValue.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

            // Change color when less than 1 minute remaining
            if (remainingSeconds < 60) {
                timeoutTimer.classList.add('warning');
            } else {
                timeoutTimer.classList.remove('warning');
            }
        }

        // Check if timeout reached
        if (minutesSinceLastFile >= machineConfig.timeoutMinutes) {
            if (!machineInErrorState) {
                // Machine has timed out - enter error state
                machineInErrorState = true;
                handleMachineTimeout();
            }
        }
    }, 1000); // Check every second

    console.log('Machine timeout monitoring started');
}

function handleMachineTimeout() {
    console.log('⚠️ Machine timeout - no DFQ files received');

    // Hide timer
    timeoutTimer.style.display = 'none';

    // Stop production counting if active
    if (productionInterval) {
        clearInterval(productionInterval);
        productionInterval = null;
    }

    // Stop timeout monitoring
    if (machineTimeoutInterval) {
        clearInterval(machineTimeoutInterval);
        machineTimeoutInterval = null;
    }

    // Set machine to malfunction state
    previousStatus = currentStatus;
    currentStatus = -10;

    // Add red timeline segment for error
    addTimelineSegment(0);

    // Start downtime tracking
    startDowntimeTracking();

    // Show downtime modal to select error reason
    showDowntimeModal();

    // Wait for new session to start
    sessionWaitingToStart = true;

    console.log('Machine in error state - waiting for new DFQ files');
}

function resetMachineTimeout() {
    lastDFQFileTime = new Date();
    machineInErrorState = false;

    // Reset timer display
    if (machineConfig.showTimer && timeoutTimer) {
        timerValue.textContent = `${machineConfig.timeoutMinutes}:00`;
        timeoutTimer.classList.remove('warning');
    }

    console.log('Machine timeout reset');
}

// ===========================================
// WEBSOCKET CONNECTION FOR AUTOMATIC FOLDER WATCHING
// ===========================================

// WebSocket connection state
let socket = null;
let isSocketConnected = false;

// DOM elements for folder watching
const serverStatus = document.getElementById('serverStatus');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const folderWatchConfig = document.getElementById('folderWatchConfig');
const watchFolderPath = document.getElementById('watchFolderPath');
const setWatchFolderBtn = document.getElementById('setWatchFolderBtn');
const watchFolderStatus = document.getElementById('watchFolderStatus');
const currentWatchFolder = document.getElementById('currentWatchFolder');

// Initialize WebSocket connection
function initializeWebSocket() {
    try {
        // Connect to local server
        socket = io('http://localhost:3000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: Infinity
        });

        // Connection established
        socket.on('connect', () => {
            isSocketConnected = true;
            console.log('✅ WebSocket connected to folder watcher server');

            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusText.textContent = 'Server verbunden - Ordnerüberwachung aktiv';
            folderWatchConfig.style.display = 'block';
        });

        // Connection lost
        socket.on('disconnect', () => {
            isSocketConnected = false;
            console.log('❌ WebSocket disconnected');

            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Server getrennt - Starten Sie den Node.js Server';
            folderWatchConfig.style.display = 'none';
        });

        // Receive watch folder status
        socket.on('watch-folder-status', (data) => {
            console.log('Watch folder status:', data);

            if (data.watching && data.folder) {
                watchFolderPath.value = data.folder;
                currentWatchFolder.textContent = data.folder;
                watchFolderStatus.style.display = 'block';
            }
        });

        // New DFQ file detected
        socket.on('dfq-file-added', async (data) => {
            console.log('🎉 New DFQ file received from server:', data.filename);

            // Parse the file content
            const dfqData = parseDFQFile(data.content);

            // Extract part name
            const partName = dfqData['K1002'];

            // Check if this is the first file
            const isFirstFile = dfqMerkmale.length === 0;

            if (isFirstFile) {
                // Extract Merkmale (only first time)
                dfqMerkmale = extractMerkmaleFromDFQ(dfqData);
                console.log('Merkmale extracted:', dfqMerkmale);

                // Render Merkmale in config modal
                renderMerkmaleConfig(dfqMerkmale);

                // Update UI
                currentTeilEl.textContent = partName;
            }

            // Extract part data and add to tracking
            const partData = extractPartDataFromDFQ(dfqData);
            uploadedFiles.push({
                name: data.filename,
                isIO: partData.isIO,
                data: dfqData,
                partData: partData
            });

            // Check if we're coming from error state or no active session
            const wasInErrorOrIdle = machineInErrorState || sessionWaitingToStart || !currentSession;

            // Reset machine timeout
            resetMachineTimeout();

            // Start timeout monitoring
            startMachineTimeoutMonitoring();

            // Update machine status to working
            currentStatus = 20;
            addTimelineSegment(0); // Add working segment to timeline

            // If no active session or coming from error, show TBK screen
            if (wasInErrorOrIdle) {
                console.log('🔵 New session starting - showing TBK screen');
                sessionWaitingToStart = false;

                // Show barcode modal for TBK entry
                barcodeModal.classList.add('active');
                barcodeInput.value = '';
                barcodeInput.focus();

                // Store the DFQ data to process after TBK is scanned
                window.pendingDFQData = dfqData;
            } else {
                // Session already active - just add the part
                if (currentSession) {
                    addPartFromDFQ(dfqData);
                }
            }

            // Show notification
            console.log(`✅ Auto-processed: ${data.filename} - ${partData.isIO ? 'IO' : 'NIO'}`);
        });

    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Server nicht verfügbar - Node.js Server starten';
    }
}

// Set watch folder
setWatchFolderBtn.addEventListener('click', () => {
    const folder = watchFolderPath.value.trim();

    if (!folder) {
        alert('Bitte geben Sie einen Ordnerpfad ein!');
        return;
    }

    if (socket && isSocketConnected) {
        socket.emit('set-watch-folder', folder);
        console.log('Setting watch folder:', folder);
    } else {
        alert('Keine Verbindung zum Server! Bitte starten Sie den Node.js Server.');
    }
});

// Initialize WebSocket on page load
initializeWebSocket();

// ============================================
// AUFTRÄGE SYSTEM EVENT LISTENERS
// ============================================

// Aufträge button click
auftraegeBtn.addEventListener('click', showAuftraegeModal);

// Close Aufträge modal
closeAuftraegeModal.addEventListener('click', hideAuftraegeModal);

// Close on background click
auftraegeModal.addEventListener('click', (e) => {
    if (e.target === auftraegeModal) {
        hideAuftraegeModal();
    }
});

// Request new orders
requestNewOrdersBtn.addEventListener('click', handleRequestNewOrders);

// Start Test button click (NEW WORKFLOW)
startTestButton.addEventListener('click', () => {
    if (!selectedOrder) {
        alert('Bitte wählen Sie zuerst einen Auftrag aus dem Aufträge-Menü!');
        showAuftraegeModal();
        return;
    }

    // Start the new workflow: Step 1 → Scan TBK
    showBarcodeModal();
});

// Container count submission
submitContainerCount.addEventListener('click', handleContainerCountSubmit);

containerCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleContainerCountSubmit();
    }
});

// TBK print count controls
incrementTBKBtn.addEventListener('click', incrementTBKCount);
decrementTBKBtn.addEventListener('click', decrementTBKCount);

// Print TBKs button
if (printTBKsBtn) {
    printTBKsBtn.addEventListener('click', handlePrintTBKs);
    console.log('✅ Print TBKs Button Event Listener registriert');
} else {
    console.error('❌ printTBKsBtn Element nicht gefunden!');
}

// Start test from TBK print modal
if (startTestBtn) {
    startTestBtn.addEventListener('click', handleTestStartFromPrint);
    console.log('✅ Start Test Button Event Listener registriert');
} else {
    console.error('❌ startTestBtn Element nicht gefunden!');
}

// ============================================
// LANGUAGE SYSTEM FUNCTIONS
// ============================================

// Show language modal
function showLanguageModal() {
    console.log('🌐 showLanguageModal aufgerufen');
    console.log('languageModal Element:', languageModal);
    renderLanguageCards();
    if (languageModal) {
        languageModal.classList.add('active');
        console.log('✅ Modal active Klasse hinzugefügt');
    } else {
        console.error('❌ languageModal ist null!');
    }
}

// Hide language modal
function hideLanguageModal() {
    languageModal.classList.remove('active');
}

// Render language cards
function renderLanguageCards() {
    const languageCards = document.querySelectorAll('.language-card');

    languageCards.forEach(card => {
        const lang = card.getAttribute('data-lang');

        // Remove all selected classes
        card.classList.remove('selected');

        // Add selected class to current language
        if (lang === currentLanguage) {
            card.classList.add('selected');
        }
    });
}

// Handle language selection
function handleLanguageSelect(lang) {
    setLanguage(lang);
    hideLanguageModal();
}

// ============================================
// LANGUAGE SYSTEM EVENT LISTENERS
// ============================================

// Language button click
if (languageBtn) {
    languageBtn.addEventListener('click', showLanguageModal);
    console.log('✅ Language Button Event Listener registriert');
} else {
    console.error('❌ languageBtn Element nicht gefunden!');
}

// Close language modal
if (closeLanguageModal) {
    closeLanguageModal.addEventListener('click', hideLanguageModal);
}

// Close on background click
if (languageModal) {
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            hideLanguageModal();
        }
    });
}

// Language card clicks
document.querySelectorAll('.language-card').forEach(card => {
    card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        handleLanguageSelect(lang);
    });
});

// Initialize orders on page load
initializeOrders();
console.log('Orders initialized:', orders.length, 'orders');
console.log('Selected order:', selectedOrder);

// Render orders grid and update display immediately
renderOrdersGrid();
updateSelectedOrderDisplay();
console.log('Orders grid rendered, selectedOrder:', selectedOrder);

// Initialize Demo Timeline und sofort rendern
initializeDemoTimeline();
renderTimeline();
console.log('Demo Timeline initialisiert und gerendert');

// Update production panel view on page load
updateProductionPanelView();

// Initialize language on page load
initializeLanguage();

console.log('Machine Status Timeline initialized');
console.log('Folder watcher integration ready');
console.log('Aufträge System initialized');
console.log('Language System initialized');

// Nochmals Timeline rendern nach kurzem Delay (für Login-Screen)
setTimeout(() => {
    console.log('🔄 Verzögertes Timeline-Rendering...');
    renderTimeline();
}, 100);