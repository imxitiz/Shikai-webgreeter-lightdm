/**
 * @license Shikai
 * spa.js
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
    names: {
        short: "spa",
        long: "spanish"
    },
    data: {
        demo: {
            hostname: "hostname",
            notifications: {
                info: "¡Notificación de información!",
                success: "¡Notificación de éxito!",
                warning: "¡Notificación de advertencia!",
                error: "¡Notificación de error!"
            },
            hint: "Pista:",
            hints: [
                "¡La contraseña es 'password'!",
                "¡Pasa el cursor sobre la esquina superior izquierda!",
                "¡Haz clic en el fondo para cambiarlo!",
                "¡Cierre el menú de configuración para guardar los cambios!",
                "¡Después de 60 segundos de inactividad, el tema queda en reposo!",
                "¡Haz doble clic en los controles de arrastre para volver a la posición predeterminada!"
            ]
        },
        commands: {
            names: {
                sleep: "suspender",
                reboot: "reiniciar",
                shutdown: "apagar",
                hibernate: "hibernar"
            },
            title: "Acciones rápidas",
            messages: {
                sleep: "Tomando una siesta...",
                reboot: "Reiniciando...",
                shutdown: "Apagando...",
                hibernate: "Hibernando...",
                unavailable: "¡Acción no disponible!"
            }
        },
        settings: {
            title: "Configuración",
            subtitle: "Personaliza tu greeter",
            open: "Abrir configuración",
            recenter: "Recentrar",
            behaviour: {
                name: "Comportamiento",
                sections: {
                    lang: {
                        name: "Idioma",
                        description: "Selecciona tu idioma preferido"
                    },
                    general: {
                        name: "General",
                        description: "Configurar la visibilidad de los elementos de la interfaz",
                        options: {
                            logo: "Logotipo habilitado",
                            hostname: "Hostname habilitado",
                            avatar: "Avatar habilitado",
                            dark_mode: "Modo oscuro",
                            username: "Nombre de usuario habilitado",
                            session: "Sesión habilitada"
                        }
                    },
                    commands: {
                        name: "Comandos",
                        description: "Habilitar o deshabilitar los comandos de energía",
                        options: {
                            shutdown: "Apagado habilitado",
                            reboot: "Reinicio habilitado",
                            sleep: "Suspension habilitada",
                            hibernate: "Hibernación habilitada"
                        }
                    },
                    time: {
                        name: "Fecha y Hora",
                        description: "Configurar la visualización del reloj y la fecha",
                        options: {
                            clock: {
                                enabled: "Hora habilitada",
                                format: "Formato de la hora"
                            },
                            date: {
                                enabled: "Fecha habilitada",
                                format: "Formato de la fecha"
                            }
                        }
                    },
                    misc: {
                        name: "Misceláneos",
                        description: "Otras configuraciones",
                        evoker_description: "Mostrar, mostrar al pasar, u ocultar el botón de ajustes",
                        options: {
                            idle: {
                                enabled: "Ocultar en reposo",
                                value: "Tiempo para entrar en reposo (s)"
                            },
                            evoker: "Botón de configuración invisible",
                            evoker_values: {
                                show: "Siempre",
                                hover: "Al pasar"
                            }
                        }
                    }
                }
            },
            style: {
                name: "Estilo",
                descriptions: {
                    colors: "Personaliza el esquema de color"
                },
                sections: {
                    main: {
                        name: "Principal",
                        description: "Personaliza la apariencia",
                        options: {
                            avatar: "Color del avatar",
                            text: "Color del texto",
                            sidebar: "Color de la barra lateral",
                            userbar_top: "Color superior de la barra de usuario",
                            userbar_bottom: "Color inferior de la barra de usuario",
                            session_text: "Color del texto de la sesión",
                            session_background: "Color de fondo de la sesión",
                            password_text: "Color del texto de la contraseña",
                            password_background: "Color de fondo de la contraseña",
                            icon_background: "Color de fondo del icono",
                            icon_foreground: "Color de primer plano del icono",                            
                        }
                    },
                    misc: {
                        name: "Misceláneos",
                        description: "Ajusta detalles de estilo",
                        options: {
                            vertical: "Bordes superiores e inferiores de la contraseña",
                            horizontal: "Bordes laterales de la contraseña",
                            password: "Radio del borde de la contraseña",
                            session: "Radio del borde de la sesión",
                            caret: {
                                left: "Símbolo decorativo izquierdo de contraseña",
                                right: "Símbolo decorativo derecho de contraseña"
                            }
                        }
                    }
                }
            },
            themes: {
                name: "Temas",
                current: {
                    name: "Actual",
                    option: "Nombre"
                },
                saved: "Guardados"
            }
        },
        notifications: {
            logged_in: "Entrando como",
            wrong_password: "¡Contraseña incorrecta!",
            delete_local: "¡Almacenamiento local eliminado!",
            delete_themes: "¡Temas eliminados!",
            theme_activated: "activado!",
            theme_removed: "eliminado!",
            theme_added: "añadido!"
        },
        buttons: {
            switch: "Cambiar",
            confirmation: "¡Esto no se puede deshacer!",
            delete_local: "Eliminar Almacenamiento Local",
            delete_themes: "Eliminar Temas",
            remove: "Eliminar",
            save: "Guardar",
            use: "Usar"
        },
        time: {
            months: {
                long: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"]
            },
            days: {
                long: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
            }
        },
        misc: {
            theme: "Tema",
            unknown: "Desconocido"
        },
        modes: {
            dark: "Modo Oscuro",
            light: "Modo Claro"
        },
        labels: {
            host: "Host"
        },
        footer: {
            made_with: "Hecho con",
            by: "por imxitiz"
        },
        login: {
            button: "Iniciar sesión",
            logging_in: "Iniciando sesión...",
            password: "Contraseña",
            session: "Seleccionar sesión",
            users: "usuarios",
            show_password: "Mostrar contraseña",
            hide_password: "Ocultar contraseña",
            show_password_notification: "Contraseña visible",
            hide_password_notification: "Contraseña oculta"
        },
        // Behaviour misc extra description
        // (kept near the existing misc block above for clarity)
        // Style descriptions
        settings_style_extra: {
            style_colors_description: "Personaliza el esquema de color",
            style_main_description: "Personaliza la apariencia",
            style_misc_description: "Ajusta detalles de estilo",
        }
    }
}