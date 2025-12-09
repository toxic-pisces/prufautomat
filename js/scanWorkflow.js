// Scan Workflow Manager
// Manages the new TBK and Container scanning workflow

class ScanWorkflowManager {
    constructor() {
        this.scannedTBK = null;
        this.scannedContainers = [];
        this.selectedPruefzyklus = null;
        this.selectedPruefzweck = null;
        this.tbkPrintCount = 0;

        this.init();
    }

    init() {
        // Connect the main "Prüfung starten" button to open barcode modal
        const startBtn = document.getElementById('startTestButton');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                document.getElementById('barcodeModal').classList.add('active');
            });
        }

        this.setupTBKScan();
        this.setupContainerScan();
        this.setupPruefzyklusZweck();
        this.setupMachineLoading();
        this.setupFinalSummary();
    }

    // ========================================
    // TBK SCAN
    // ========================================
    setupTBKScan() {
        const modal = document.getElementById('barcodeModal');
        const barcodeInput = document.getElementById('barcodeInput');

        // Focus input when modal opens
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (modal && modal.classList.contains('active')) {
                    setTimeout(() => {
                        if (barcodeInput) barcodeInput.focus();
                    }, 100);
                }
            });
        });
        if (modal) {
            observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        }

        // Listen for spacebar when modal is active (for testing/simulation)
        document.addEventListener('keydown', (e) => {
            const barcodeModalEl = document.getElementById('barcodeModal');
            if (e.code === 'Space' && barcodeModalEl && barcodeModalEl.classList.contains('active')) {
                const successOverlay = document.getElementById('tbkScanSuccess');
                // Only trigger if success overlay is not shown (not already scanned)
                if (!successOverlay || successOverlay.style.display === 'none' || successOverlay.style.display === '') {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Spacebar pressed - generating TBK scan');
                    this.generateTBKScan();
                }
            }
        });

        // Listen for Enter key on hidden input (real scanner)
        if (barcodeInput) {
            barcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const scannedValue = barcodeInput.value.trim();
                    if (scannedValue) {
                        this.processTBKScan(scannedValue);
                    } else {
                        this.generateTBKScan();
                    }
                    barcodeInput.value = '';
                }
            });
        }
    }

    generateTBKScan() {
        // Generate random 10-digit number
        const tbkNumber = this.generateRandomNumber(10);
        this.processTBKScan(tbkNumber);
    }

    processTBKScan(tbkNumber) {
        this.scannedTBK = tbkNumber;

        // Show green success with fade in
        const successScreen = document.getElementById('tbkScanSuccess');
        document.getElementById('scannedTBKNumber').textContent = tbkNumber;
        successScreen.style.display = 'flex';

        // Trigger fade in
        setTimeout(() => {
            successScreen.classList.add('show');
        }, 10);

        console.log('TBK scanned:', tbkNumber);

        // Auto-transition after 2 seconds
        setTimeout(() => {
            this.confirmTBKScan();
        }, 2000);
    }

    confirmTBKScan() {
        const successScreen = document.getElementById('tbkScanSuccess');
        const barcodeModal = document.getElementById('barcodeModal');

        // Immediately hide modal and reset - no fade delay
        barcodeModal.classList.remove('active');
        successScreen.style.display = 'none';
        successScreen.classList.remove('show', 'fade-out');

        // Open container scan modal
        document.getElementById('containerScanModal').classList.add('active');
        
        // Focus container input if exists
        const containerInput = document.getElementById('containerInput');
        if (containerInput) {
            setTimeout(() => containerInput.focus(), 100);
        }
    }

    // ========================================
    // CONTAINER SCAN
    // ========================================
    setupContainerScan() {
        const modal = document.getElementById('containerScanModal');

        // Listen for spacebar when modal is active
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && modal.classList.contains('active')) {
                e.preventDefault();
                this.addContainerScan();
            }
        });

        // Submit button
        const submitBtn = document.getElementById('submitContainerScan');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.confirmContainerScan();
            });
        }
    }

    addContainerScan() {
        // Generate random 6-digit number
        const containerNumber = this.generateRandomNumber(6);
        this.scannedContainers.push(containerNumber);

        // Add to list
        const list = document.getElementById('containerList');
        const item = document.createElement('div');
        item.className = 'container-item';
        item.innerHTML = `
            <div class="container-item-icon">📦</div>
            <div class="container-item-number">${containerNumber}</div>
        `;
        list.appendChild(item);

        // Update count
        document.getElementById('containerCount').textContent = this.scannedContainers.length;

        // Enable submit button if at least one container
        if (this.scannedContainers.length > 0) {
            document.getElementById('submitContainerScan').disabled = false;
        }

        console.log('Container scanned:', containerNumber, 'Total:', this.scannedContainers.length);
    }

    confirmContainerScan() {
        if (this.scannedContainers.length === 0) {
            alert('Bitte scannen Sie mindestens einen Behälter!');
            return;
        }

        // Close container modal
        document.getElementById('containerScanModal').classList.remove('active');

        // Open pruefzyklus modal with TBK info
        this.openPruefzyklusModal();
    }

    // ========================================
    // PRÜFZYKLUS + PRÜFZWECK
    // ========================================
    setupPruefzyklusZweck() {
        // Prüfzyklus buttons
        const zyklusButtons = document.querySelectorAll('.btn-pruefzyklus');
        zyklusButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                zyklusButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPruefzyklus = btn.dataset.zyklus;
                this.checkPruefzyklusZweckComplete();
            });
        });

        // Prüfzweck buttons
        const zweckButtons = document.querySelectorAll('.btn-pruefzweck');
        zweckButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                zweckButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPruefzweck = btn.dataset.zweck;
                this.checkPruefzyklusZweckComplete();
            });
        });

        // Confirm button
        const confirmBtn = document.getElementById('confirmPruefzyklusZweck');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmPruefzyklusZweck();
            });
        }
    }

    checkPruefzyklusZweckComplete() {
        const confirmBtn = document.getElementById('confirmPruefzyklusZweck');
        if (this.selectedPruefzyklus && this.selectedPruefzweck) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }

    openPruefzyklusModal() {
        document.getElementById('pruefzyklusModal').classList.add('active');
    }

    confirmPruefzyklusZweck() {
        if (!this.selectedPruefzyklus || !this.selectedPruefzweck) {
            alert('Bitte wählen Sie Prüfzyklus und Prüfzweck aus!');
            return;
        }

        // Close modal
        document.getElementById('pruefzyklusModal').classList.remove('active');

        // Open TBK print modal
        this.openTBKPrintModal();
    }

    // ========================================
    // TBK PRINT
    // ========================================
    openTBKPrintModal() {
        // Fill Laufkarte and Charge info (mock data for now)
        document.getElementById('printLaufkartenNr').textContent = 'LK-456';
        document.getElementById('printChargennummer').textContent = 'CH-789';

        // Set max TBKs to container count
        document.getElementById('maxTBKCount').textContent = this.scannedContainers.length;
        document.getElementById('printCountValue').textContent = '1';

        // Setup increment/decrement
        const incrementBtn = document.getElementById('incrementTBK');
        const decrementBtn = document.getElementById('decrementTBK');
        const printBtn = document.getElementById('printTBKsBtn');
        const continueBtn = document.getElementById('continueToLoadingBtn');

        incrementBtn.onclick = () => {
            let current = parseInt(document.getElementById('printCountValue').textContent);
            if (current < this.scannedContainers.length) {
                document.getElementById('printCountValue').textContent = current + 1;
            }
        };

        decrementBtn.onclick = () => {
            let current = parseInt(document.getElementById('printCountValue').textContent);
            if (current > 1) {
                document.getElementById('printCountValue').textContent = current - 1;
            }
        };

        printBtn.onclick = () => {
            this.tbkPrintCount = parseInt(document.getElementById('printCountValue').textContent);
            console.log('Printing', this.tbkPrintCount, 'TBKs');

            // Directly go to machine loading modal
            document.getElementById('tbkPrintModal').classList.remove('active');
            document.getElementById('machineLoadingModal').classList.add('active');
        };

        document.getElementById('tbkPrintModal').classList.add('active');
    }

    // ========================================
    // MACHINE LOADING
    // ========================================
    setupMachineLoading() {
        const confirmBtn = document.getElementById('confirmMachineLoaded');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                document.getElementById('machineLoadingModal').classList.remove('active');
                this.openFinalSummary();
            });
        }
    }

    // ========================================
    // FINAL SUMMARY
    // ========================================
    setupFinalSummary() {
        const startBtn = document.getElementById('startTestFromSummary');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startTest();
            });
        }
    }

    openFinalSummary() {
        console.log('Opening final summary...');

        // Fill all info
        document.getElementById('summaryTBK').textContent = this.scannedTBK;
        document.getElementById('summaryTeil').textContent = 'Teil-123';
        document.getElementById('summaryLaufkarte').textContent = 'LK-456';
        document.getElementById('summaryCharge').textContent = 'CH-789';
        document.getElementById('summaryPruefzyklus').textContent = this.selectedPruefzyklus;
        document.getElementById('summaryPruefzweck').textContent = this.selectedPruefzweck;
        document.getElementById('summaryBehälter').textContent = this.scannedContainers.length;
        document.getElementById('summaryTBKCount').textContent = this.tbkPrintCount;

        const modal = document.getElementById('finalSummaryModal');
        modal.classList.add('active');
        console.log('Final summary modal opened');
    }

    startTest() {
        console.log('=== Starting Production Session ===');
        console.log('- TBK:', this.scannedTBK);
        console.log('- Containers:', this.scannedContainers.length);
        console.log('- Prüfzyklus:', this.selectedPruefzyklus);
        console.log('- Prüfzweck:', this.selectedPruefzweck);
        console.log('- TBK Count:', this.tbkPrintCount);

        // Close final summary modal
        const finalSummaryModal = document.getElementById('finalSummaryModal');
        if (finalSummaryModal) {
            finalSummaryModal.classList.remove('active');
        }

        // Create production session (calls app.js function)
        if (window.startProductionCounting) {
            const session = {
                sessionId: Date.now(),
                startTime: new Date().toISOString(),
                tbk: this.scannedTBK,
                teil: 'Wird aus DFQ geladen',  // Will be updated from first DFQ
                laufkarte: '-',
                charge: '-',
                pruefzyklus: this.selectedPruefzyklus,
                totalParts: 0,
                ioParts: 0,
                nioParts: 0
            };

            // IMPORTANT: Set status to WORKING (20) before starting session
            if (window.setCurrentStatus) {
                window.setCurrentStatus(20);
                console.log('✅ Status set to WORKING (20)');
            }

            // Start production counting
            window.startProductionCounting(session);
            console.log('✅ Production session created:', session);

            // Add initial timeline segment (green/working)
            if (window.addTimelineSegment) {
                window.addTimelineSegment(0);
                console.log('✅ Initial timeline segment added');
            }

            // Update the production panel view to show stats
            if (window.updateProductionPanelView) {
                window.updateProductionPanelView();
                console.log('✅ Production panel view updated');
            }
        } else {
            console.error('❌ startProductionCounting function not found in app.js!');
        }

        // Reset workflow data AFTER session creation
        this.reset();
    }

    reset() {
        this.scannedTBK = null;
        this.scannedContainers = [];
        this.selectedPruefzyklus = null;
        this.selectedPruefzweck = null;
        this.tbkPrintCount = 0;

        // Clear container list
        document.getElementById('containerList').innerHTML = '';
        document.getElementById('containerCount').textContent = '0';
        document.getElementById('submitContainerScan').disabled = true;

        // Reset button selections
        document.querySelectorAll('.btn-pruefzyklus').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.btn-pruefzweck').forEach(b => b.classList.remove('selected'));
        document.getElementById('confirmPruefzyklusZweck').disabled = true;
    }

    // ========================================
    // HELPERS
    // ========================================
    generateRandomNumber(digits) {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.scanWorkflow = new ScanWorkflowManager();
    console.log('✅ Scan Workflow Manager initialized');
});
