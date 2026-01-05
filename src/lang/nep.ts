export default {
  names: {
    short: "nep",
    long: "nepali"
  },
  data: {
    demo: {
      hostname: "होस्टको नाम",
      notifications: {
        info: "जानकारी!",
        success: "सफल भयो!",
        warning: "चेतावनी!",
        error: "त्रुटि!"
      },
      hint: "संकेत:",
      hints: [
        "पासवर्ड 'password' हो!",
        "माथिल्लो-बायाँ कुनामा माउस लैजानुहोस्!",
        "ब्याकग्राउण्ड परिवर्तन गर्न त्यहाँ क्लिक गर्नुहोस्!",
        "परिवर्तनहरू सुरक्षित गर्न सेटिङ् मेनु बन्द गर्नुहोस्!",
        "६० सेकेन्डसम्म केही नगरेमा थिम 'आइडल' मोडमा जानेछ!",
        "डिफल्ट स्थितिमा फर्कन ड्र्याग-ह्यान्डलहरूमा डबल क्लिक गर्नुहोस्!"
      ]
    },
    commands: {
      names: {
        sleep: "स्लिप",
        reboot: "रिबुट",
        shutdown: "बन्द",
        hibernate: "हाइबरनेट"
      },
      title: "द्रुत कार्यहरू",
      messages: {
        sleep: "एकछिन आराम गर्दै...",
        reboot: "पुनः सुरु हुँदैछ...",
        shutdown: "बन्द हुँदैछ...",
        hibernate: "हाइबरनेट हुँदैछ...",
        unavailable: "यो कार्य उपलब्ध छैन!"
      }
    },
    settings: {
      title: "सेटिङ्हरू",
      subtitle: "आफ्नो ग्रिटर अनुकूलन गर्नुहोस्",
      open: "सेटिङ्हरू खोल्नुहोस्",
      recenter: "रि-सेन्टर",
      behaviour: {
        name: "व्यवहार",
        sections: {
          lang: {
            name: "भाषा",
            description: "आफ्नो मनपर्ने भाषा छान्नुहोस्"
          },
          general: {
            name: "साधारण",
            description: "UI तत्वहरूको दृश्यता मिलाउनुहोस्",
            options: {
              logo: "लोगो देखिने",
              hostname: "होस्टनाम देखिने",
              avatar: "अवतार देखिने",
              dark_mode: "डार्क मोड",
              username: "प्रयोगकर्ताको नाम देखिने",
              session: "सेसन देखिने"
            }
          },
          commands: {
            name: "कमान्डहरू",
            description: "पावर कमान्डहरू सक्षम वा असक्षम पार्नुहोस्",
            options: {
              shutdown: "सटडाउन सक्षम",
              reboot: "रिबुट सक्षम",
              sleep: "स्लिप सक्षम",
              hibernate: "हाइबरनेट सक्षम"
            }
          },
          time: {
            name: "घडी र मिति",
            description: "घडी र मिति प्रदर्शन कन्फिगर गर्नुहोस्",
            options: {
              clock: {
                enabled: "घडी सक्षम",
                format: "घडीको ढाँचा"
              },
              date: {
                enabled: "मिति सक्षम",
                format: "मितिको ढाँचा"
              }
            }
          },
          misc: {
            name: "विविध",
            description: "अन्य सेटिङ्हरू",
            options: {
              idle: {
                enabled: "आइडल हुँदा लुकाउनुहोस्",
                value: "आइडल टाइमआउट (सेकेन्ड)"
              },
              evoker: "सेटिङ् बटन अदृश्य",
              evoker_values: {
                show: "सधैं",
                hover: "होभर गर्दा"
              }
            }
          }
        }
      },
      style: {
        name: "शैली",
        sections: {
          main: {
            name: "मुख्य",
            options: {
              avatar: "अवतारको रङ",
              text: "टेक्स्टको रङ",
              sidebar: "साइडबारको रङ",
              userbar_top: "युजरबार माथिल्लो रङ",
              userbar_bottom: "युजरबार तल्लो रङ",
              session_text: "सेसन टेक्स्टको रङ",
              session_background: "सेसन ब्याकग्राउण्डको रङ",
              password_text: "पासवर्ड टेक्स्टको रङ",
              password_background: "पासवर्ड ब्याकग्राउण्डको रङ",
              icon_background: "आइकन ब्याकग्राउण्डको रङ",
              icon_foreground: "आइकन अग्रभूमि रङ",
            }
          },
          misc: {
            name: "विविध",
            options: {
              vertical: "पासवर्ड माथि र तलको बोर्डर",
              horizontal: "पासवर्ड दायाँ र बायाँको बोर्डर",
              password: "पासवर्ड बोर्डर रेडियस",
              session: "सेसन बोर्डर रेडियस",
              caret: {
                left: "पासवर्ड बायाँ सजावट चिन्ह",
                right: "पासवर्ड दायाँ सजावट चिन्ह"
              }
            }
          }
        }
      },
      themes: {
        name: "थिमहरू",
        current: {
          name: "हालको",
          option: "नाम"
        },
        saved: "सुरक्षित"
      }
    },
    notifications: {
      logged_in: "यस रूपमा लग-इन भयो:",
      wrong_password: "गलत पासवर्ड!",
      delete_local: "लोकल स्टोरेज मेटियो!",
      delete_themes: "थिमहरू मेटिए!",
      theme_activated: "सक्रिय भयो!",
      theme_removed: "हटाइयो!",
      theme_added: "थपियो!"
    },
    buttons: {
      switch: "बदल्नुहोस्",
      confirmation: "यो कार्य फिर्ता गर्न सकिँदैन!",
      delete_local: "लोकल स्टोरेज मेट्नुहोस्",
      delete_themes: "थिमहरू मेट्नुहोस्",
      remove: "हटाउनुहोस्",
      save: "सुरक्षित गर्नुहोस्",
      use: "प्रयोग गर्नुहोस्"
    },
    time: {
      months: {
        long: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"],
        short: ["जन", "फेब", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टे", "अक्टो", "नोभे", "डिसे"]
      },
      days: {
        long: ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"],
        short: ["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"]
      }
    },
    misc: {
      theme: "थिम",
      unknown: "अज्ञात"
    },
    modes: {
      dark: "डार्क मोड",
      light: "लाइट मोड"
    },
    labels: {
      host: "होस्ट"
    },
    footer: {
      made_with: "बनाइएको",
      by: "द्वारा imxitiz"
    },
    login: {
      button: "साइन इन्",
      logging_in: "साइन इन हुँदैछ...",
      password: "पासवर्ड",
      session: "सेसन चयन गर्नुहोस्",
      users: "प्रयोगकर्ताहरू",
      show_password: "पासवर्ड देखाउनुहोस्",
      hide_password: "पासवर्ड लुकाउनुहोस्",
      show_password_notification: "पासवर्ड देखियो",
      hide_password_notification: "पासवर्ड लुकेको छ"
    }
    // extra settings/style descriptions
  }
}