/**
 * @license Shikai
 * ger.js
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
    names: {
        short: "ger",
        long: "german"
    },
    data: {
        demo: {
            hostname: "hostname",
            notifications: {
                info: "Info-Benachrichtigung!",
                success: "Erfolgsmeldung!",
                warning: "Warnmeldung!",
                error: "Fehlermeldung!"
            },
            hint: "Hinweis:",
            hints: [
                "Das Passwort ist 'password'!",
                "Bewegen Sie den Mauszeiger über die obere linke Ecke!",
                "Klicken Sie auf den Hintergrund, um ihn zu ändern!",
                "Schließen Sie das Einstellungsmenü, um die Änderungen zu speichern!",
                "Nach 60 Sekunden Inaktivität geht das Theme in den Leerlauf!",
                "Doppelklicken Sie auf die Ziehgriffe, um zur Standardposition zurückzukehren!"
            ]
        },
        commands: {
            names: {
                sleep: "schlafen",
                reboot: "neustart",
                shutdown: "abschalten",
                hibernate: "überwintern"
            },
            title: "Schnellaktionen",
            messages: {
                sleep: "Ein Nickerchen machen ...",
                reboot: "Neustart...",
                shutdown: "Herunterfahren...",
                hibernate: "Winterschlaf...",
                unavailable: "Aktion nicht verfügbar!"
            }
        },
        settings: {
            title: "Einstellungen",
            subtitle: "Passe deinen Greeter an",
            open: "Einstellungen öffnen",
            recenter: "Zentrieren",
            behaviour: {
                name: "Verhalten",
                sections: {
                    lang: {
                        name: "Sprache",
                        description: "Wähle deine bevorzugte Sprache"
                    },
                    general: {
                        name: "Allgemein",
                        description: "Sichtbarkeit der UI-Elemente konfigurieren",
                        options: {
                            logo: "Logo aktiviert",
                            hostname: "Hostname aktiviert",
                            avatar: "Avatar aktiviert",
                            dark_mode: "Dunkelmodus",
                            username: "Benutzername aktiviert",
                            session: "Sitzung aktiviert"
                        }
                    },
                    commands: {
                        name: "Befehle",
                        description: "Aktiviere oder deaktiviere Energiebefehle",
                        options: {
                            shutdown: "Herunterfahren aktiviert",
                            reboot: "Neustart aktiviert",
                            sleep: "Schlaf aktiviert",
                            hibernate: "Ruhezustand aktiviert"
                        }
                    },
                    time: {
                        name: "Uhr und Datum",
                        description: "Konfiguriere die Anzeige von Uhr und Datum",
                        options: {
                            clock: {
                                enabled: "Uhr aktiviert",
                                format: "Uhrformat"
                            },
                            date: {
                                enabled: "Datum aktiviert",
                                format: "Datumsformat"
                            }
                        }
                    },
                    misc: {
                        name: "Sonstig",
                        description: "Andere Einstellungen",
                        options: {
                            idle: {
                                enabled: "Im Leerlauf ausblenden",
                                value: "Leerlauf-Timeout (s)"
                            },
                            evoker: "Einstellungsschaltfläche unsichtbar",
                            evoker_values: {
                                show: "Immer",
                                hover: "Beim Schweben"
                            }
                        }
                    }
                }
            },
            style: {
                name: "Stil",
                descriptions: { colors: "Passen Sie das Farbschema an" },
                sections: {
                    main: {
                        name: "Hauptsächlich",
                        description: "Passen Sie das Aussehen an",
                        options: {
                            avatar: "Avatar-Farbe",
                            text: "Textfarbe",
                            sidebar: "Farbe der Seitenleiste",
                            userbar_top: "Obere Farbe der Benutzerleiste",
                            userbar_bottom: "Untere Farbe der Benutzerleiste",
                            session_text: "Farbe des Sitzungstextes",
                            session_background: "Hintergrundfarbe der Sitzung",
                            password_text: "Textfarbe des Passworts",
                            password_background: "Hintergrundfarbe des Passworts",
                            icon_background: "Hintergrundfarbe des Symbols",
                            icon_foreground: "Vordergrundfarbe des Symbols"
                        }
                    },
                    misc: {
                        name: "Sonstig",
                        description: "Feinabstimmung der Stil-Details",
                        options: {
                            vertical: "Passwörter oben unten Grenzen",
                            horizontal: "Passwort linke rechte Grenzen",
                            password: "Radius der Passwortgrenze",
                            session: "Radius der Sitzungsgrenze",
                            caret: {
                                left: "Passwort hinterließ dekoratives Symbol",
                                right: "Passwort rechts dekoratives Symbol"
                            }
                        }
                    }
                }
            },
            themes: {
                name: "Themen",
                current: {
                    name: "Aktuell",
                    option: "Name"
                },
                saved: "Gerettet"
            }
        },
        notifications: {
            logged_in: "Angemeldet als",
            wrong_password: "Falsches Passwort!",
            delete_local: "LocalStorage gelöscht!",
            delete_themes: "Themen gelöscht!",
            theme_activated: "aktiviert!",
            theme_removed: "entfernt!",
            theme_added: "hinzugefügt!"
        },
        buttons: {
            switch: "Schalten",
            confirmation: "Das kann nicht rückgängig gemacht werden!",
            delete_local: "Lokalen Speicher löschen",
            delete_themes: "Themen löschen",
            remove: "Entfernen",
            save: "Speichern",
            use: "Verwenden"
        },
        time: {
            days: {
                long: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "Noember", "Dezember"],
                short: ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
            },
            months: {
                long: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
            }
        },
        misc: {
            theme: "Thema",
            unknown: "Unbekannt"
        },
        modes: {
            dark: "Dunkelmodus",
            light: "Hellmodus"
        },
        labels: {
            host: "Host"
        },
        footer: {
            made_with: "Gemacht mit",
            by: "von imxitiz"
        },
        login: {
            button: "Anmelden",
            logging_in: "Anmeldung...",
            password: "Passwort",
            session: "Sitzung wählen",
            users: "Benutzer",
            show_password: "Passwort anzeigen",
            hide_password: "Passwort verbergen",
            show_password_notification: "Passwort sichtbar",
            hide_password_notification: "Passwort verborgen"
        },
    }
} 