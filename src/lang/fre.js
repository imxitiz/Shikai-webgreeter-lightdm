/**
 * @license Shikai
 * fre.js
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
    names: {
        short: "fre",
        long: "french"
    },
    data: {
        demo: {
            hostname: "nom d'hôte",
            notifications: {
                info: "Avis d'infos !",
                success: "Avis de réussite !",
                warning: "Avis d'avertissement !",
                error: "Avis d'erreur !"
            },
            hint: "Indice:",
            hints: [
                "Le mot de passe est 'password' !",
                "Survolez le coin supérieur gauche !",
                "Cliquez sur le fond pour le changer !",
                "Fermez le menu des paramètres pour enregistrer les modifications !",
                "Après 60 secondes d'inactivité, le thème devient inactif !",
                "Double-cliquez sur les poignées de glissement pour revenir à la position par défaut !"
            ]
        },
        commands: {
            names: {
                sleep: "suspendre",
                reboot: "redémarrer",
                shutdown: "fermer",
                hibernate: "hiberner"
            },
            title: "Actions rapides",
            messages: {
                sleep: "Faire une sieste...",
                reboot: "Redémarrage...",
                shutdown: "Éteindre...",
                hibernate: "Hiberner...",
                unavailable: "Action non disponible !"
            }
        },
        settings: {
            title: "Paramètres",
            subtitle: "Personnalisez votre greeter",
            open: "Ouvrir les paramètres",
            recenter: "Recentrer",
            behaviour: {
                name: "Comportement",
                sections: {
                    lang: {
                        name: "Langue",
                        description: "Sélectionnez votre langue préférée"
                    },
                    general: {
                        name: "Général",
                        description: "Configurer la visibilité des éléments de l'interface",
                        options: {
                            logo: "Logo activé",
                            hostname: "Nom d'hôte activé",
                            avatar: "Avatar activé",
                            dark_mode: "Mode sombre",
                            username: "Nom d'utilisateur activé",
                            session: "Session activée"
                        }
                    },
                    commands: {
                        name: "Commandes",
                        description: "Activer ou désactiver les commandes d'alimentation",
                        options: {
                            shutdown: "Arrêt activé",
                            reboot: "Redémarrage activé",
                            sleep: "Veille activée",
                            hibernate: "Hibernation activée"
                        }
                    },
                    time: {
                        name: "Horloge et Date",
                        description: "Configurer l'affichage de l'horloge et de la date",
                        options: {
                            clock: {
                                enabled: "Horloge activée",
                                format: "Format d'horloge"
                            },
                            date: {
                                enabled: "Date activée",
                                format: "Format de date"
                            }
                        }
                    },
                    misc: {
                        name: "Divers",
                        description: "Autres paramètres",
                        evoker_description: "Afficher, afficher au survol, ou masquer le bouton des paramètres",
                        options: {
                            idle: {
                                enabled: "Masquer en cas d'inactivité",
                                value: "Délai d'inactivité (s)"
                            },
                            evoker: "Bouton paramètres invisible",
                            evoker_values: {
                                show: "Toujours",
                                hover: "Au passage"
                            }
                        }
                    }
                }
            },
            style: {
                name: "Style",
                descriptions: { colors: "Personnalisez le schéma de couleurs" },
                sections: {
                    main: {
                        name: "Principal",
                        description: "Personnalisez l'apparence",
                        options: {
                            avatar: "Couleur de l'avatar",
                            text: "Couleur du texte",
                            sidebar: "Couleur de la barre latérale",
                            userbar_top: "Couleur du haut de la barre utilisateur",
                            userbar_bottom: "Couleur du bas de la barre utilisateur",
                            session_text: "Couleur du texte de la session",
                            session_background: "Couleur d'arrière-plan de la session",
                            password_text: "Couleur du texte du mot de passe",
                            password_background: "Couleur de fond du mot de passe",
                            icon_background: "Couleur d'arrière-plan de l'icône",
                            icon_foreground: "Couleur de premier plan de l'icône",                            
                        }
                    },
                    misc: {
                        name: "Divers",
                        description: "Affinez les détails de style",
                        options: {
                            vertical: "Bordure supérieure inférieure du mot de passe",
                            horizontal: "Mot de passe bordures gauche droite",
                            password: "Rayon de la bordure du mot de passe",
                            session: "Rayon de la bordure de la session",
                            caret: {
                                left: "Symbole décoratif gauche du mot de passe",
                                right: "Mot de passe bon symbole décoratif"
                            }
                        }
                    }
                }
            },
            themes: {
                name: "Thèmes",
                current: {
                    name: "Actuel",
                    option: "Nom"
                },
                saved: "Enregistré"
            }
        },
        notifications: {
            logged_in: "Connecté en tant que",
            wrong_password: "Mauvais mot de passe !",
            delete_local: "Stockage local supprimé !",
            delete_themes: "Thèmes supprimés !",
            theme_activated: "activé !",
            theme_removed: "supprimé !",
            theme_added: "ajouté !"
        },
        buttons: {
            switch: "Changer",
            confirmation: "Ça ne peut pas être annulé!",
            delete_local: "Supprimer le Stockage local",
            delete_themes: "Supprimer des thèmes",
            remove: "Retirer",
            save: "Sauvegarder",
            use: "Utiliser"
        },
        time: {
            months: {
                long: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Noemvber", "Décembre"],
                short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            days: {
                long: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
            }
        },
        misc: {
            theme: "Thème",
            unknown: "Inconnu"
        },
        modes: {
            dark: "Mode sombre",
            light: "Mode clair"
        },
        labels: {
            host: "Hôte"
        },
        footer: {
            made_with: "Fait avec",
            by: "par imxitiz"
        },
        login: {
            button: "Se connecter",
            logging_in: "Connexion en cours...",
            password: "Mot de passe",
            session: "Sélectionner une session",
            users: "utilisateurs",
            show_password: "Afficher le mot de passe",
            hide_password: "Masquer le mot de passe",
            show_password_notification: "Mot de passe visible",
            hide_password_notification: "Mot de passe masqué"
        },
        // extra style/evoker descriptions
    }
} 