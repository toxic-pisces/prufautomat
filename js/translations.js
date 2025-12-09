// Translations for all languages
const translations = {
    de: {
        // Page title
        page_title: "Maschine 03 - Produktionsmonitor",
        machine_id: "MASCHINE 03",

        // Sidebar buttons
        analysis: "Analyse",
        configuration: "Konfiguration",
        orders: "Aufträge",
        language: "Sprache",

        // Production panel
        start_test: "Prüfung starten",
        current_test: "Aktuelle Prüfung",
        last_test: "Letzte Prüfung",
        total: "Total",
        io: "IO",
        nio: "NIO",
        tbk: "TBK",
        part: "Teil",
        cycle: "Zyklus",
        time_until_error: "Zeit bis Fehler",

        // Barcode modal
        scan_tbk_title: "TBK-Nummer scannen",
        scan_tbk_text: "Maschine läuft jetzt. Bitte scannen Sie den TBK-Barcode.",
        scan_tbk_placeholder: "TBK-Nummer scannen oder eingeben",
        submit: "Bestätigen",
        error_enter_tbk: "Bitte geben Sie eine TBK-Nummer ein",
        error_tbk_not_found: "TBK-Nummer nicht in Datenbank gefunden",

        // Orders modal
        orders_title: "Aufträge",
        current_order: "Aktueller Auftrag:",
        no_order_selected: "Kein Auftrag ausgewählt",
        request_new_orders: "Neue Aufträge anfordern",
        laufkarte: "Laufkarte",
        select_order_first: "Bitte wählen Sie zuerst einen Auftrag aus dem Aufträge-Menü!",
        new_order_added: "Neuer Auftrag hinzugefügt",

        // Container scan modal
        container_scan_title: "Behälter scannen",
        container_scan_text: "Bitte geben Sie die Anzahl der Behälter ein:",
        container_placeholder: "Anzahl Behälter",
        next: "Weiter",
        error_container_count: "Bitte geben Sie eine gültige Anzahl ein (mindestens 1)",
        error_container_max: "Die Anzahl darf nicht größer als 999 sein",

        // TBK print modal
        print_tbk_title: "Neue TBK drucken",
        laufkarten_number: "Laufkarten-Nummer:",
        charge_number: "Chargennummer:",
        tbk_count: "Anzahl TBKs:",
        max_container: "Max: {0} (Behälter-Anzahl)",
        print_tbks: "TBKs drucken",
        start_test_button: "Prüfung starten",
        tbks_printed: "{0} TBK(s) wurden gedruckt!",
        print_tbks_first: "Bitte drucken Sie zuerst die TBKs!",
        no_order_selected_alert: "Kein Auftrag ausgewählt!",
        no_tbk_data: "Keine TBK-Daten verfügbar!",

        // Downtime modal
        downtime_title: "Maschinenstillstand",
        downtime_text: "Bitte wählen Sie den Grund für den Maschinenstillstand:",
        calibration_failed: "Kalibrierung fehlgeschlagen",
        nio_full: "NIO voll",
        io_full: "IO voll",
        material_change: "Materialwechsel",
        tool_change: "Werkzeugwechsel",
        maintenance: "Wartung",
        break: "Pause",
        meeting: "Besprechung",
        shift_change: "Schichtwechsel",
        other: "Sonstiges",
        enter_reason: "Grund eingeben",
        custom_reason: "Benutzerdefinierter Grund:",
        custom_reason_placeholder: "Grund eingeben...",
        confirm: "Bestätigen",
        cancel: "Abbrechen",

        // Configuration modal
        config_title: "Konfiguration",
        folder_watch_title: "🤖 Automatische Ordnerüberwachung",
        folder_watch_text: "Server überwacht einen Ordner und verarbeitet neue DFQ-Dateien automatisch",
        connecting: "Verbindung wird hergestellt...",
        watch_folder: "Ordner überwachen",
        watching_folder: "Überwachter Ordner:",
        machine_timeout_title: "⏱️ Maschinen-Timeout",
        machine_timeout_text: "Zeit bis Fehlermeldung bei fehlenden DFQ-Dateien",
        timeout_minutes: "Timeout (Minuten):",
        minutes: "Minuten",
        show_timer: "Timer anzeigen",
        error_check_title: "Messmerkmale & Fehlergrenzwerte",
        error_check_from: "Fehlerprüfung ab:",
        parts_tested: "geprüften Teilen",
        load_dfq_message: "Bitte laden Sie eine DFQ-Datei hoch, um Merkmale anzuzeigen.",
        save: "Speichern",

        // Error alert modal
        error_alert_title: "FEHLERGRENZE ÜBERSCHRITTEN!",
        error_threshold_exceeded: "Merkmal \"{0}\" hat die Fehlergrenze überschritten!",
        current_error_rate: "Aktuelle Fehlerquote:",
        threshold: "Grenzwert:",
        acknowledge: "Bestätigen",

        // Status
        running: "Läuft",
        working: "Working",
        idle: "Idle",
        malfunction: "Malfunction",

        // Language selection
        language_selection: "Sprachauswahl",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano"
    },

    en: {
        // Page title
        page_title: "Machine 03 - Production Monitor",
        machine_id: "MACHINE 03",

        // Sidebar buttons
        analysis: "Analysis",
        configuration: "Configuration",
        orders: "Orders",
        language: "Language",

        // Production panel
        start_test: "Start Test",
        current_test: "Current Test",
        last_test: "Last Test",
        total: "Total",
        io: "IO",
        nio: "NIO",
        tbk: "TBK",
        part: "Part",
        cycle: "Cycle",
        time_until_error: "Time Until Error",

        // Barcode modal
        scan_tbk_title: "Scan TBK Number",
        scan_tbk_text: "Machine is now running. Please scan the TBK barcode.",
        scan_tbk_placeholder: "Scan or enter TBK number",
        submit: "Submit",
        error_enter_tbk: "Please enter a TBK number",
        error_tbk_not_found: "TBK number not found in database",

        // Orders modal
        orders_title: "Orders",
        current_order: "Current Order:",
        no_order_selected: "No order selected",
        request_new_orders: "Request New Orders",
        laufkarte: "Job Card",
        select_order_first: "Please select an order from the Orders menu first!",
        new_order_added: "New order added",

        // Container scan modal
        container_scan_title: "Scan Containers",
        container_scan_text: "Please enter the number of containers:",
        container_placeholder: "Number of containers",
        next: "Next",
        error_container_count: "Please enter a valid number (at least 1)",
        error_container_max: "The number must not be greater than 999",

        // TBK print modal
        print_tbk_title: "Print New TBK",
        laufkarten_number: "Job Card Number:",
        charge_number: "Batch Number:",
        tbk_count: "Number of TBKs:",
        max_container: "Max: {0} (Container Count)",
        print_tbks: "Print TBKs",
        start_test_button: "Start Test",
        tbks_printed: "{0} TBK(s) have been printed!",
        print_tbks_first: "Please print the TBKs first!",
        no_order_selected_alert: "No order selected!",
        no_tbk_data: "No TBK data available!",

        // Downtime modal
        downtime_title: "Machine Downtime",
        downtime_text: "Please select the reason for the machine downtime:",
        calibration_failed: "Calibration Failed",
        nio_full: "NIO Full",
        io_full: "IO Full",
        material_change: "Material Change",
        tool_change: "Tool Change",
        maintenance: "Maintenance",
        break: "Break",
        meeting: "Meeting",
        shift_change: "Shift Change",
        other: "Other",
        enter_reason: "Enter Reason",
        custom_reason: "Custom Reason:",
        custom_reason_placeholder: "Enter reason...",
        confirm: "Confirm",
        cancel: "Cancel",

        // Configuration modal
        config_title: "Configuration",
        folder_watch_title: "🤖 Automatic Folder Monitoring",
        folder_watch_text: "Server monitors a folder and processes new DFQ files automatically",
        connecting: "Connecting...",
        watch_folder: "Watch Folder",
        watching_folder: "Watching Folder:",
        machine_timeout_title: "⏱️ Machine Timeout",
        machine_timeout_text: "Time until error message when DFQ files are missing",
        timeout_minutes: "Timeout (Minutes):",
        minutes: "Minutes",
        show_timer: "Show Timer",
        error_check_title: "Measurement Features & Error Limits",
        error_check_from: "Error Check From:",
        parts_tested: "Parts Tested",
        load_dfq_message: "Please upload a DFQ file to display features.",
        save: "Save",

        // Error alert modal
        error_alert_title: "ERROR LIMIT EXCEEDED!",
        error_threshold_exceeded: "Feature \"{0}\" has exceeded the error limit!",
        current_error_rate: "Current Error Rate:",
        threshold: "Threshold:",
        acknowledge: "Acknowledge",

        // Status
        running: "Running",
        working: "Working",
        idle: "Idle",
        malfunction: "Malfunction",

        // Language selection
        language_selection: "Language Selection",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano"
    },

    ru: {
        // Page title
        page_title: "Машина 03 - Монитор Производства",
        machine_id: "МАШИНА 03",

        // Sidebar buttons
        analysis: "Анализ",
        configuration: "Конфигурация",
        orders: "Заказы",
        language: "Язык",

        // Production panel
        start_test: "Начать Тест",
        current_test: "Текущий Тест",
        last_test: "Последний Тест",
        total: "Всего",
        io: "IO",
        nio: "NIO",
        tbk: "TBK",
        part: "Деталь",
        cycle: "Цикл",
        time_until_error: "Время До Ошибки",

        // Barcode modal
        scan_tbk_title: "Сканировать TBK Номер",
        scan_tbk_text: "Машина работает. Пожалуйста, отсканируйте штрих-код TBK.",
        scan_tbk_placeholder: "Сканировать или ввести номер TBK",
        submit: "Подтвердить",
        error_enter_tbk: "Пожалуйста, введите номер TBK",
        error_tbk_not_found: "Номер TBK не найден в базе данных",

        // Orders modal
        orders_title: "Заказы",
        current_order: "Текущий Заказ:",
        no_order_selected: "Заказ не выбран",
        request_new_orders: "Запросить Новые Заказы",
        laufkarte: "Рабочая Карта",
        select_order_first: "Пожалуйста, сначала выберите заказ из меню Заказов!",
        new_order_added: "Новый заказ добавлен",

        // Container scan modal
        container_scan_title: "Сканировать Контейнеры",
        container_scan_text: "Пожалуйста, введите количество контейнеров:",
        container_placeholder: "Количество контейнеров",
        next: "Далее",
        error_container_count: "Пожалуйста, введите правильное число (минимум 1)",
        error_container_max: "Число не должно превышать 999",

        // TBK print modal
        print_tbk_title: "Печать Новых TBK",
        laufkarten_number: "Номер Рабочей Карты:",
        charge_number: "Номер Партии:",
        tbk_count: "Количество TBK:",
        max_container: "Макс: {0} (Количество Контейнеров)",
        print_tbks: "Печать TBK",
        start_test_button: "Начать Тест",
        tbks_printed: "{0} TBK были напечатаны!",
        print_tbks_first: "Пожалуйста, сначала напечатайте TBK!",
        no_order_selected_alert: "Заказ не выбран!",
        no_tbk_data: "Данные TBK недоступны!",

        // Downtime modal
        downtime_title: "Простой Машины",
        downtime_text: "Пожалуйста, выберите причину простоя машины:",
        calibration_failed: "Ошибка Калибровки",
        nio_full: "NIO Полон",
        io_full: "IO Полон",
        material_change: "Смена Материала",
        tool_change: "Смена Инструмента",
        maintenance: "Обслуживание",
        break: "Перерыв",
        meeting: "Совещание",
        shift_change: "Смена",
        other: "Другое",
        enter_reason: "Введите Причину",
        custom_reason: "Своя Причина:",
        custom_reason_placeholder: "Введите причину...",
        confirm: "Подтвердить",
        cancel: "Отмена",

        // Configuration modal
        config_title: "Конфигурация",
        folder_watch_title: "🤖 Автоматический Мониторинг Папки",
        folder_watch_text: "Сервер отслеживает папку и обрабатывает новые DFQ файлы автоматически",
        connecting: "Подключение...",
        watch_folder: "Отслеживать Папку",
        watching_folder: "Отслеживаемая Папка:",
        machine_timeout_title: "⏱️ Таймаут Машины",
        machine_timeout_text: "Время до сообщения об ошибке при отсутствии DFQ файлов",
        timeout_minutes: "Таймаут (Минуты):",
        minutes: "Минуты",
        show_timer: "Показать Таймер",
        error_check_title: "Характеристики Измерений и Пределы Ошибок",
        error_check_from: "Проверка Ошибок От:",
        parts_tested: "Проверенных Деталей",
        load_dfq_message: "Пожалуйста, загрузите DFQ файл для отображения характеристик.",
        save: "Сохранить",

        // Error alert modal
        error_alert_title: "ПРЕВЫШЕН ПРЕДЕЛ ОШИБОК!",
        error_threshold_exceeded: "Характеристика \"{0}\" превысила предел ошибок!",
        current_error_rate: "Текущая Частота Ошибок:",
        threshold: "Порог:",
        acknowledge: "Подтвердить",

        // Status
        running: "Работает",
        working: "Working",
        idle: "Idle",
        malfunction: "Malfunction",

        // Language selection
        language_selection: "Выбор Языка",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano"
    },

    pl: {
        // Page title
        page_title: "Maszyna 03 - Monitor Produkcji",
        machine_id: "MASZYNA 03",

        // Sidebar buttons
        analysis: "Analiza",
        configuration: "Konfiguracja",
        orders: "Zamówienia",
        language: "Język",

        // Production panel
        start_test: "Rozpocznij Test",
        current_test: "Bieżący Test",
        last_test: "Ostatni Test",
        total: "Razem",
        io: "IO",
        nio: "NIO",
        tbk: "TBK",
        part: "Część",
        cycle: "Cykl",
        time_until_error: "Czas Do Błędu",

        // Barcode modal
        scan_tbk_title: "Skanuj Numer TBK",
        scan_tbk_text: "Maszyna działa. Proszę zeskanować kod kreskowy TBK.",
        scan_tbk_placeholder: "Skanuj lub wprowadź numer TBK",
        submit: "Potwierdź",
        error_enter_tbk: "Proszę wprowadzić numer TBK",
        error_tbk_not_found: "Numer TBK nie znaleziony w bazie danych",

        // Orders modal
        orders_title: "Zamówienia",
        current_order: "Bieżące Zamówienie:",
        no_order_selected: "Nie wybrano zamówienia",
        request_new_orders: "Zamów Nowe Zamówienia",
        laufkarte: "Karta Pracy",
        select_order_first: "Proszę najpierw wybrać zamówienie z menu Zamówienia!",
        new_order_added: "Dodano nowe zamówienie",

        // Container scan modal
        container_scan_title: "Skanuj Pojemniki",
        container_scan_text: "Proszę wprowadzić liczbę pojemników:",
        container_placeholder: "Liczba pojemników",
        next: "Dalej",
        error_container_count: "Proszę wprowadzić poprawną liczbę (co najmniej 1)",
        error_container_max: "Liczba nie może być większa niż 999",

        // TBK print modal
        print_tbk_title: "Drukuj Nowe TBK",
        laufkarten_number: "Numer Karty Pracy:",
        charge_number: "Numer Partii:",
        tbk_count: "Liczba TBK:",
        max_container: "Maks: {0} (Liczba Pojemników)",
        print_tbks: "Drukuj TBK",
        start_test_button: "Rozpocznij Test",
        tbks_printed: "Wydrukowano {0} TBK!",
        print_tbks_first: "Proszę najpierw wydrukować TBK!",
        no_order_selected_alert: "Nie wybrano zamówienia!",
        no_tbk_data: "Brak danych TBK!",

        // Downtime modal
        downtime_title: "Przestój Maszyny",
        downtime_text: "Proszę wybrać przyczynę przestoju maszyny:",
        calibration_failed: "Błąd Kalibracji",
        nio_full: "NIO Pełne",
        io_full: "IO Pełne",
        material_change: "Zmiana Materiału",
        tool_change: "Zmiana Narzędzia",
        maintenance: "Konserwacja",
        break: "Przerwa",
        meeting: "Spotkanie",
        shift_change: "Zmiana Zmiany",
        other: "Inne",
        enter_reason: "Wprowadź Przyczynę",
        custom_reason: "Własna Przyczyna:",
        custom_reason_placeholder: "Wprowadź przyczynę...",
        confirm: "Potwierdź",
        cancel: "Anuluj",

        // Configuration modal
        config_title: "Konfiguracja",
        folder_watch_title: "🤖 Automatyczne Monitorowanie Folderu",
        folder_watch_text: "Serwer monitoruje folder i automatycznie przetwarza nowe pliki DFQ",
        connecting: "Łączenie...",
        watch_folder: "Monitoruj Folder",
        watching_folder: "Monitorowany Folder:",
        machine_timeout_title: "⏱️ Limit Czasu Maszyny",
        machine_timeout_text: "Czas do komunikatu o błędzie przy braku plików DFQ",
        timeout_minutes: "Limit Czasu (Minuty):",
        minutes: "Minuty",
        show_timer: "Pokaż Timer",
        error_check_title: "Cechy Pomiarowe i Limity Błędów",
        error_check_from: "Sprawdzanie Błędów Od:",
        parts_tested: "Przetestowanych Części",
        load_dfq_message: "Proszę załadować plik DFQ, aby wyświetlić cechy.",
        save: "Zapisz",

        // Error alert modal
        error_alert_title: "PRZEKROCZONO LIMIT BŁĘDÓW!",
        error_threshold_exceeded: "Cecha \"{0}\" przekroczyła limit błędów!",
        current_error_rate: "Bieżący Wskaźnik Błędów:",
        threshold: "Próg:",
        acknowledge: "Potwierdź",

        // Status
        running: "Działa",
        working: "Working",
        idle: "Idle",
        malfunction: "Malfunction",

        // Language selection
        language_selection: "Wybór Języka",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano"
    },

    it: {
        // Page title
        page_title: "Macchina 03 - Monitor di Produzione",
        machine_id: "MACCHINA 03",

        // Sidebar buttons
        analysis: "Analisi",
        configuration: "Configurazione",
        orders: "Ordini",
        language: "Lingua",

        // Production panel
        start_test: "Avvia Test",
        current_test: "Test Corrente",
        last_test: "Ultimo Test",
        total: "Totale",
        io: "IO",
        nio: "NIO",
        tbk: "TBK",
        part: "Parte",
        cycle: "Ciclo",
        time_until_error: "Tempo Fino All'Errore",

        // Barcode modal
        scan_tbk_title: "Scansiona Numero TBK",
        scan_tbk_text: "La macchina è in funzione. Si prega di scansionare il codice a barre TBK.",
        scan_tbk_placeholder: "Scansiona o inserisci il numero TBK",
        submit: "Conferma",
        error_enter_tbk: "Si prega di inserire un numero TBK",
        error_tbk_not_found: "Numero TBK non trovato nel database",

        // Orders modal
        orders_title: "Ordini",
        current_order: "Ordine Corrente:",
        no_order_selected: "Nessun ordine selezionato",
        request_new_orders: "Richiedi Nuovi Ordini",
        laufkarte: "Scheda di Lavoro",
        select_order_first: "Si prega di selezionare prima un ordine dal menu Ordini!",
        new_order_added: "Nuovo ordine aggiunto",

        // Container scan modal
        container_scan_title: "Scansiona Contenitori",
        container_scan_text: "Si prega di inserire il numero di contenitori:",
        container_placeholder: "Numero di contenitori",
        next: "Avanti",
        error_container_count: "Si prega di inserire un numero valido (almeno 1)",
        error_container_max: "Il numero non deve essere superiore a 999",

        // TBK print modal
        print_tbk_title: "Stampa Nuovi TBK",
        laufkarten_number: "Numero Scheda di Lavoro:",
        charge_number: "Numero Lotto:",
        tbk_count: "Numero di TBK:",
        max_container: "Max: {0} (Numero Contenitori)",
        print_tbks: "Stampa TBK",
        start_test_button: "Avvia Test",
        tbks_printed: "{0} TBK sono stati stampati!",
        print_tbks_first: "Si prega di stampare prima i TBK!",
        no_order_selected_alert: "Nessun ordine selezionato!",
        no_tbk_data: "Dati TBK non disponibili!",

        // Downtime modal
        downtime_title: "Fermo Macchina",
        downtime_text: "Si prega di selezionare il motivo del fermo macchina:",
        calibration_failed: "Calibrazione Fallita",
        nio_full: "NIO Pieno",
        io_full: "IO Pieno",
        material_change: "Cambio Materiale",
        tool_change: "Cambio Utensile",
        maintenance: "Manutenzione",
        break: "Pausa",
        meeting: "Riunione",
        shift_change: "Cambio Turno",
        other: "Altro",
        enter_reason: "Inserisci Motivo",
        custom_reason: "Motivo Personalizzato:",
        custom_reason_placeholder: "Inserisci motivo...",
        confirm: "Conferma",
        cancel: "Annulla",

        // Configuration modal
        config_title: "Configurazione",
        folder_watch_title: "🤖 Monitoraggio Automatico Cartella",
        folder_watch_text: "Il server monitora una cartella ed elabora automaticamente i nuovi file DFQ",
        connecting: "Connessione in corso...",
        watch_folder: "Monitora Cartella",
        watching_folder: "Cartella Monitorata:",
        machine_timeout_title: "⏱️ Timeout Macchina",
        machine_timeout_text: "Tempo fino al messaggio di errore in caso di file DFQ mancanti",
        timeout_minutes: "Timeout (Minuti):",
        minutes: "Minuti",
        show_timer: "Mostra Timer",
        error_check_title: "Caratteristiche di Misura e Limiti di Errore",
        error_check_from: "Controllo Errori Da:",
        parts_tested: "Parti Testate",
        load_dfq_message: "Si prega di caricare un file DFQ per visualizzare le caratteristiche.",
        save: "Salva",

        // Error alert modal
        error_alert_title: "LIMITE DI ERRORE SUPERATO!",
        error_threshold_exceeded: "La caratteristica \"{0}\" ha superato il limite di errore!",
        current_error_rate: "Tasso di Errore Attuale:",
        threshold: "Soglia:",
        acknowledge: "Conferma",

        // Status
        running: "In Esecuzione",
        working: "Working",
        idle: "Idle",
        malfunction: "Malfunction",

        // Language selection
        language_selection: "Selezione Lingua",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano",
        chinese: "中文"
    },
    
    // Chinesisch (vereinfacht)
    zh: {
        // Page title
        page_title: "机器 03 - 生产监控",
        machine_id: "机器 03",

        // Sidebar buttons
        analysis: "分析",
        configuration: "配置",
        orders: "订单",
        language: "语言",

        // Production panel
        start_test: "开始检测",
        current_test: "当前检测",
        last_test: "上次检测",
        total: "总计",
        io: "合格",
        nio: "不合格",
        tbk: "TBK",
        part: "零件",
        cycle: "周期",
        time_until_error: "错误倒计时",

        // Barcode modal
        scan_tbk_title: "扫描TBK编号",
        scan_tbk_text: "机器正在运行。请扫描TBK条码。",
        scan_tbk_placeholder: "扫描或输入TBK编号",
        submit: "确认",
        error_enter_tbk: "请输入TBK编号",
        error_tbk_not_found: "数据库中未找到TBK编号",

        // Orders modal
        orders_title: "订单",
        current_order: "当前订单：",
        no_order_selected: "未选择订单",
        request_new_orders: "请求新订单",
        laufkarte: "工艺卡",
        select_order_first: "请先从订单菜单中选择一个订单！",
        new_order_added: "已添加新订单",

        // Container scan modal
        container_scan_title: "扫描容器",
        container_scan_text: "请输入容器数量：",
        container_placeholder: "容器数量",
        next: "下一步",
        error_container_count: "请输入有效数量（至少1个）",
        error_container_max: "数量不能超过999",

        // TBK print modal
        print_tbk_title: "打印新TBK",
        laufkarten_number: "工艺卡编号：",
        charge_number: "批次号：",
        tbk_count: "TBK数量：",
        max_container: "最大：{0}（容器数量）",
        print_tbks: "打印TBK",
        start_test_button: "开始检测",
        tbks_printed: "已打印 {0} 个TBK！",
        print_tbks_first: "请先打印TBK！",
        no_order_selected_alert: "未选择订单！",
        no_tbk_data: "无TBK数据！",

        // Downtime modal
        downtime_title: "机器停机",
        downtime_text: "请选择机器停机原因：",
        calibration_failed: "校准失败",
        nio_full: "不合格箱满",
        io_full: "合格箱满",
        material_change: "更换材料",
        tool_change: "更换工具",
        maintenance: "维护",
        break: "休息",
        meeting: "会议",
        shift_change: "换班",
        other: "其他",
        enter_reason: "输入原因",
        custom_reason: "自定义原因：",
        custom_reason_placeholder: "输入原因...",
        confirm: "确认",
        cancel: "取消",

        // Configuration modal
        config_title: "配置",
        folder_watch_title: "🤖 自动文件夹监控",
        folder_watch_text: "服务器监控文件夹并自动处理新的DFQ文件",
        connecting: "正在连接...",
        watch_folder: "监控文件夹",
        watching_folder: "监控中的文件夹：",
        machine_timeout_title: "⏱️ 机器超时",
        machine_timeout_text: "缺少DFQ文件时的错误消息等待时间",
        timeout_minutes: "超时（分钟）：",
        minutes: "分钟",
        show_timer: "显示计时器",
        error_check_title: "测量特征和错误限值",
        error_check_from: "错误检查从：",
        parts_tested: "已测试零件",
        load_dfq_message: "请上传DFQ文件以显示特征。",
        save: "保存",

        // Error alert modal
        error_alert_title: "超出错误限值！",
        error_threshold_exceeded: "特征\"{0}\"已超出错误限值！",
        current_error_rate: "当前错误率：",
        threshold: "阈值：",
        acknowledge: "确认",

        // Status
        running: "运行中",
        working: "工作中",
        idle: "空闲",
        malfunction: "故障",

        // Language selection
        language_selection: "语言选择",
        german: "Deutsch",
        english: "English",
        russian: "Русский",
        polish: "Polski",
        italian: "Italiano",
        chinese: "中文"
    }
};

// Language flag emojis
const languageFlags = {
    de: '🇩🇪',
    en: '🇬🇧',
    ru: '🇷🇺',
    pl: '🇵🇱',
    it: '🇮🇹',
    zh: '🇨🇳'
};

// Current language
let currentLanguage = 'de';

// Get translation
function t(key, ...args) {
    let text = translations[currentLanguage][key] || translations['de'][key] || key;

    // Replace placeholders {0}, {1}, etc.
    args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, arg);
    });

    return text;
}

// Set language
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not found`);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update flag
    const flagElement = document.getElementById('currentFlag');
    if (flagElement) {
        flagElement.textContent = languageFlags[lang];
    }

    // Update all elements with data-i18n attribute
    updatePageText();
}

// Update all text on the page
function updatePageText() {
    // Update page title
    document.title = t('page_title');

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });

    // Update specific elements that don't have data-i18n
    updateDynamicText();
}

// Update dynamic text elements
function updateDynamicText() {
    // Machine ID
    const machineIdEl = document.querySelector('.machine-id');
    if (machineIdEl) machineIdEl.textContent = t('machine_id');

    // Session header
    const sessionHeaderEl = document.getElementById('sessionHeader');
    if (sessionHeaderEl && currentSession) {
        sessionHeaderEl.textContent = t('current_test');
    } else if (sessionHeaderEl) {
        sessionHeaderEl.textContent = t('last_test');
    }

    // Button texts
    const startTestBtn = document.querySelector('.btn-start-test');
    if (startTestBtn) {
        const iconSpan = startTestBtn.querySelector('.start-icon');
        const icon = iconSpan ? iconSpan.outerHTML : '';
        startTestBtn.innerHTML = icon + ' ' + t('start_test');
    }
}

// Initialize language on page load
function initializeLanguage() {
    // Get saved language or default to German
    const savedLang = localStorage.getItem('language') || 'de';
    setLanguage(savedLang);
}
