export default {
  index: {
    header: "Willkommen bei IQBook",
    subheader:
      "Buchen Sie sofort und stylen Sie Ihr Haar und Ihren Schnurrbart ganz nach Ihren Wünschen bei einem Stylisten Ihrer Wahl.",
    registerButtonText: "Registrieren",
    loginButtonText: "Anmelden",
  },

  auth: {
    signin: {
      email: {
        label: "E-Mail",
        placeholder: "Geben Sie Ihre E-Mail ein",
      },
      password: {
        label: "Passwort",
        placeholder: "Geben Sie Ihr Passwort ein",
      },
      rememberMe: "Angemeldet bleiben",
      forgotPassword: "Passwort vergessen?",
      signIn: "Anmelden",
      signInWithApple: "Mit Apple anmelden",
      signInWithGoogle: "Mit Google anmelden",
      dontHaveAccount: "Haben Sie noch kein Konto?",
      or: "oder",
      signup: "Registrieren",
    },

    signup: {
      email: {
        label: "E-Mail",
        placeholder: "Geben Sie Ihre E-Mail ein",
      },
      password: {
        label: "Passwort",
        placeholder: "Geben Sie Ihr Passwort ein",
      },
      signUp: "Registrieren",
      signUpWithApple: "Mit Apple registrieren",
      signUpWithGoogle: "Mit Google registrieren",
      alreadyMember: "Bereits Mitglied?",
      or: "oder",
      logIn: "Anmelden",
    },

    forgotPassword: {
      header: "Wie lautet Ihre E-Mail?",
      subHeader:
        "Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.",
      email: {
        label: "E-Mail",
        placeholder: "Geben Sie Ihre E-Mail ein",
      },
      continue: "Weiter",
    },

    passwordVerification: {
      header: "Alles bereit!",
      subHeader:
        "Geben Sie den 4-stelligen Code ein, der an Ihre Telefonnummer und E-Mail gesendet wurde",
      verificationCode: {
        label: "Bestätigungscode",
        placeholder: "Geben Sie Ihren OTP ein",
      },
      verifyAndContinue: "Bestätigen & Weiter",
      didntReceiveCode: "Code nicht erhalten?",
      resend: "Erneut senden",
      waitMessage: "Warten Sie {{time}} Sekunden",
    },

    personalInfo: {
      header: "Es ist Zeit, ein Profil zu erstellen!",
      subHeader: "Erzählen Sie uns etwas mehr über sich",
      fullname: {
        label: "Vollständiger Name",
        placeholder: "Geben Sie Ihren vollständigen Namen ein",
      },
      gender: {
        label: "Geschlecht",
        male: "Männlich",
        female: "Weiblich",
        other: "Andere",
      },
      mobileNumber: {
        label: "Mobilnummer",
      },
      dateOfBirth: {
        label: "Geburtsdatum (optional)",
        placeholder: "TT/MM/JJ",
      },
      modal: {
        closeText: "Schließen",
        openText: "Öffnen",
      },
      saveAndNext: "Speichern & Weiter",
    },

    verification: {
      header: "Alles bereit!",
      subHeader:
        "Geben Sie den 4-stelligen Code ein, der an Ihre Telefonnummer und E-Mail gesendet wurde",
      verificationCode: {
        label: "Bestätigungscode",
        placeholder: "Geben Sie Ihren OTP ein",
      },
      verifyAndCreate: "Bestätigen & Konto erstellen",
      didntReceiveCode: "Code nicht erhalten?",
      resend: "Erneut senden",
      waitMessage: "Warten Sie {{time}} Sekunden",
    },
  },

  protected: {
    searchHeader: {
      placeholder: "Stadt oder Salonname suchen",
    },

    map: {
      connect: "Verbinden",
      close: "Schließen",
      description: "Beschreibung",
      contactUs: "Kontaktieren Sie uns",
      anyQuestion: "Wenn Sie Fragen haben",
      location: "Standort",
      followUs: "Folgen Sie uns auf",
      socialLinks: "Soziale Netzwerke",
      exploreAll: "Alle erkunden",
      NoTabAvailable: "Keine {{selectedTab}} verfügbar",
    },

    customTabView: {
      header: "Salons durchsuchen",
      subHeader: "Sie sind derzeit mit keinem Salon verbunden",
      buttonText: "Jetzt verbinden",
    },

    profile: {
      heading: "Profil",
      options: {
        favorites: "Favoriten",
        changeSalon: "Salon wechseln",
        helpAndSupport: "Hilfe & Support",
        about: "Über uns",
        deleteAccount: {
          header: "Konto löschen",
          alert: {
            header: "Konto löschen",
            subHeader:
              "Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten?",
            cancel: "Abbrechen",
            delete: "Löschen",
          },
        },
        logout: "Abmelden",
      },
    },

    myFavourites: {
      header: "Meine Favoriten",
      error: {
        header: "Keine Favoriten",
        subHeader: "Sie haben keinen favorisierten Salon",
      },
    },

    helpAndSupport: {
      header: "Hilfe & Support",
      subHeader:
        "Wenn Sie Probleme haben, lassen Sie es uns bitte wissen. Wir werden versuchen, diese so schnell wie möglich zu lösen.",
      title: {
        placeholder: "Titel",
      },
      body: {
        placeholder: "Beschreiben Sie das Problem",
      },
      submit: "Absenden",
      emailUs: "E-Mail an uns:",
      email: "support@iqbook.io",
    },

    about: {
      index: {
        header: "Über uns",
        options: {
          iqbookWebsite: "iqBook Webseite",
          termsOfService: "Nutzungsbedingungen",
          privacyPolicy: "Datenschutzrichtlinie",
          licenses: "Lizenzen",
        },
        version: "Version",
      },

      termService: {
        header: "Nutzungsbedingungen",

        content: {
          mainHeader: "Willkommen in unserer Salon-App!",
          intro:
            "Durch die Nutzung dieser App stimmen Sie den folgenden Bedingungen zu.",

          sections: {
            usingApp: {
              title: "1. Nutzung unserer App",
              points: [
                "Buchen Sie Termine im Voraus",
                "Treten Sie der Warteschlange bei (einzeln oder als Gruppe)",
                "Verfolgen Sie Ihren Termin- oder Warteschlangenstatus in Echtzeit",
              ],
              footer:
                "Nutzen Sie die App verantwortungsvoll und befolgen Sie alle Salonregeln.",
            },

            bookingsQueue: {
              title: "2. Buchungen & Warteschlange",
              points: [
                "Wählen Sie Service, Datum und Uhrzeit für Ihre Buchung",
                "Treten Sie der Warteschlange als Einzelperson oder Gruppe bei",
                "Geschätzte Wartezeiten können sich je nach Salonablauf ändern",
              ],
            },

            responsibility: {
              title: "3. Ihre Verantwortung",
              points: [
                "Geben Sie korrekte Informationen bei Buchung oder Warteschlange an",
                "Erscheinen Sie pünktlich zu Ihrem Termin oder Warteschlangenplatz",
                "Wiederholtes Nichterscheinen kann zu Einschränkungen führen",
              ],
            },

            cancellations: {
              title: "4. Stornierungen",
              points: [
                "Sie können vor Ihrem Termin stornieren oder verschieben",
                "Bei Gruppen bitte stornieren, wenn Sie nicht kommen, um Verzögerungen zu vermeiden",
              ],
            },

            privacy: {
              title: "5. Datenschutz",
              descriptionBefore:
                "Wir schützen Ihre persönlichen Daten und geben sie niemals ohne Ihre Zustimmung weiter. Weitere Informationen finden Sie in unserer ",
              linkText: "Datenschutzrichtlinie",
              descriptionAfter: ".",
            },

            updates: {
              title: "6. Aktualisierungen",
              description:
                "Die Bedingungen können sich ändern. Nutzen Sie die App nur weiter, wenn Sie der neuesten Version zustimmen.",
            },

            help: {
              title: "7. Brauchen Sie Hilfe?",
              description:
                "Kontaktieren Sie uns jederzeit über die App oder unter info@iqbook.io",
            },
          },
        },
      },
      privacyPolicy: {
        header: "Datenschutzerklärung",

        content: {
          intro1:
            "Vielen Dank, dass Sie Teil unserer Community bei Iqbook sind. Wir verpflichten uns, Ihre persönlichen Daten und Ihr Recht auf Privatsphäre zu schützen.",

          intro2_before:
            "Diese Datenschutzerklärung erklärt, wie wir Ihre Informationen erfassen, verwenden, offenlegen und schützen, wenn Sie unsere ",
          intro2_highlight: "Salon-Mobile-App",
          intro2_after:
            " nutzen, einschließlich Funktionen wie Terminbuchung, Warteschlangenverwaltung (einzeln oder in Gruppen), Benachrichtigungen und Benutzerprofilverwaltung.",

          intro3:
            "Durch die Nutzung der App stimmen Sie den in dieser Richtlinie beschriebenen Bedingungen zu.",

          sections: {
            infoCollection: {
              title: "1. Welche Informationen wir erfassen",
              description:
                "Wir können die folgenden Informationen erfassen, wenn Sie unsere App nutzen:",

              personal: {
                title: "a) Persönliche Informationen",
                points: [
                  "Name",
                  "Telefonnummer",
                  "E-Mail-Adresse (optional)",
                  "Geschlecht (optional zur Personalisierung von Dienstleistungen)",
                  "Profilfoto (optional)",
                ],
              },

              booking: {
                title: "b) Buchungs- und Warteschlangendaten",
                points: [
                  "Ausgewählte Dienstleistungen",
                  "Termin (Datum und Uhrzeit)",
                  "Art der Warteschlange (Einzeln oder Gruppe)",
                  "Anzahl der Personen in einer Gruppe",
                ],
              },

              device: {
                title: "c) Geräte- und Nutzungsdaten",
                points: [
                  "Gerätetyp (Android/iOS)",
                  "IP-Adresse und ungefährer Standort",
                  "App-Nutzungsstatistiken",
                  "Absturz- und Fehlerprotokolle",
                ],
              },
            },

            usage: {
              title: "2. Wie wir Ihre Informationen verwenden",
              points: [
                "Planung und Verwaltung Ihrer Termine",
                "Ermöglichen des Beitritts zur Live-Warteschlange (einzeln/Gruppe)",
                "Senden von Echtzeit-Benachrichtigungen und Erinnerungen",
                "Bereitstellung geschätzter Wartezeiten und Warteschlangenpositionen",
                "Verbesserung der App-Leistung und Benutzererfahrung",
                "Beantwortung von Supportanfragen oder Anliegen",
              ],
              note_before: "Wir verwenden Ihre Daten ",
              note_highlight: "nicht",
              note_after:
                " für Werbezwecke und verkaufen Ihre Informationen nicht an Dritte.",
            },

            sharing: {
              title: "3. Weitergabe von Informationen",
              points: [
                {
                  bold: "An Salonmitarbeiter",
                  text: " zur Verwaltung von Buchungen und Warteschlangen",
                },
                {
                  bold: "An Dienstleister",
                  text: " (z. B. SMS-Anbieter) nur zur Zustellung von Nachrichten oder technischem Support",
                },
                {
                  bold: "Wenn gesetzlich erforderlich",
                  text: " zur Einhaltung rechtlicher Verpflichtungen oder zum Schutz der Rechte unserer Nutzer",
                },
              ],
              footer:
                "Wir stellen sicher, dass alle Drittanbieter strenge Vertraulichkeits- und Datenschutzstandards einhalten.",
            },

            security: {
              title: "4. Datensicherheit",
              points: [
                "Sichere Server und verschlüsselte Verbindungen",
                "Rollenbasierte Zugriffskontrolle für Mitarbeiter",
                "Regelmäßige App-Updates zur Behebung von Sicherheitslücken",
              ],
              footer:
                "Allerdings ist keine mobile App zu 100 % sicher. Nutzen Sie die App verantwortungsvoll und halten Sie sie regelmäßig auf dem neuesten Stand.",
            },

            rights: {
              title: "5. Ihre Rechte und Wahlmöglichkeiten",
              points: [
                "Ihre Profildaten einsehen und aktualisieren",
                "Ihre Buchungen stornieren oder sich aus der Warteschlange entfernen",
                "Löschung Ihres Kontos und Ihrer persönlichen Daten anfordern",
                "Kontaktieren Sie uns, wenn Sie glauben, dass Ihre Daten missbraucht wurden",
              ],
              contact_before:
                "Um Ihre Daten zu aktualisieren oder zu löschen, kontaktieren Sie uns bitte unter ",
              contact_highlight: "[Ihre Support-E-Mail]",
              contact_after:
                " oder nutzen Sie die Profileinstellungen in der App.",
            },

            children: {
              title: "6. Datenschutz für Kinder",
              description:
                "Unsere App richtet sich an Nutzer ab 13 Jahren. Wir erfassen wissentlich keine Daten von Kindern unter 13 Jahren. Wenn Sie glauben, dass Daten eines Kindes übermittelt wurden, kontaktieren Sie uns bitte umgehend zur Löschung.",
            },

            updates: {
              title: "7. Änderungen dieser Richtlinie",
              points: [
                "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen in Technologie, Gesetzgebung oder Geschäftsabläufen widerzuspiegeln.",
                "Wir werden Nutzer über wesentliche Änderungen innerhalb der App informieren",
                "Die weitere Nutzung der App bedeutet, dass Sie die aktualisierte Richtlinie akzeptieren",
              ],
            },
          },
        },
      },
      licenses: {
        header: "Endbenutzer-Lizenzvereinbarung",

        content: {
          effectiveDate_label: "Gültig ab:",
          effectiveDate_value: "04-07-2025",

          appName_label: "App-Name:",
          appName_value: "iqbook",

          intro1:
            "Diese Endbenutzer-Lizenzvereinbarung („Vereinbarung“) ist eine rechtliche Vereinbarung zwischen Ihnen („Nutzer“, „Sie“ oder „Ihr“) und ",
          intro1_highlight: "iqbook",
          intro1_after: ", die Ihre Nutzung der ",
          intro1_app_highlight: "iqbook",
          intro1_end: " mobilen Anwendung („App“) regelt.",

          intro2:
            "Durch das Herunterladen, Installieren oder Verwenden der App erklären Sie sich mit den Bedingungen dieser Lizenz einverstanden.",

          sections: {
            licenseGrant: {
              title: "1. Lizenzgewährung",
              allowPoints: [
                "Die App auf Ihr persönliches Gerät herunterladen und installieren",
                "Die App ausschließlich zur Terminbuchung, zur Teilnahme an der Salon-Warteschlange und zur Verwaltung Ihrer Salonbesuche verwenden",
              ],
              restrictionText: "Sie dürfen nicht:",
              restrictPoints: [
                "Die App oder deren Inhalte kopieren, verändern oder verbreiten",
                "Die App zurückentwickeln, dekompilieren oder versuchen, den Quellcode zu extrahieren",
                "Die App für illegale Zwecke oder außerhalb des erlaubten Nutzungsumfangs verwenden",
              ],
            },

            ownership: {
              title: "2. Eigentum und geistiges Eigentum",
              description_before:
                "Alle Inhalte, Designs, Codes und Marken innerhalb der App sind Eigentum von ",
              highlight: "iqbook",
              description_after:
                " oder deren Lizenzgebern. Diese Lizenz gewährt Ihnen kein Eigentum an der App oder ihren Inhalten – lediglich das Recht zur Nutzung gemäß den Bedingungen dieser Vereinbarung.",
            },

            updates: {
              title: "3. Updates und Änderungen",
              description1:
                "Wir können Updates oder Verbesserungen der App veröffentlichen. Diese Updates können automatisch oder manuell erfolgen. Sie stimmen zu, solche Updates für einen fortlaufenden Zugriff und zur Sicherheit zu installieren.",
              description2:
                "Wir behalten uns das Recht vor, die App jederzeit ohne Vorankündigung zu ändern oder einzustellen.",
            },

            termination: {
              title: "4. Beendigung",
              description:
                "Diese Lizenz bleibt in Kraft, bis sie beendet wird. Wir können Ihren Zugang sperren oder beenden, wenn Sie:",
              points: [
                "Gegen diese Vereinbarung verstoßen",
                "Die App missbräuchlich verwenden",
                "Betrügerisches, missbräuchliches oder schädliches Verhalten zeigen",
              ],
              footer:
                "Nach der Beendigung müssen Sie die App von Ihrem Gerät löschen und die Nutzung sofort einstellen.",
            },

            warranty: {
              title: "5. Haftungsausschluss",
              description1_before: "Die App wird ",
              description1_highlight: '"wie besehen"',
              description1_after:
                " ohne jegliche Gewährleistungen bereitgestellt. Wir garantieren nicht, dass die App fehlerfrei ist oder jederzeit verfügbar sein wird.",
              description2:
                "Soweit gesetzlich zulässig, schließen wir alle ausdrücklichen oder stillschweigenden Gewährleistungen aus.",
            },

            liability: {
              title: "6. Haftungsbeschränkung",
              points: [
                "Jegliche Schäden, die durch die Nutzung oder die Unmöglichkeit der Nutzung der App entstehen",
                "Datenverlust, verpasste Termine oder Störungen in der Warteschlange",
                "Jegliche indirekten oder Folgeschäden",
              ],
              footer: "Die Nutzung der App erfolgt auf eigenes Risiko.",
            },
          },
        },
      },
      editProfile: {
        header: "Konto verwalten",

        fullname: {
          label: "Vollständiger Name",
          placeholder: "Geben Sie Ihren vollständigen Namen ein",
        },

        gender: {
          label: "Geschlecht",
          male: "Männlich",
          female: "Weiblich",
          other: "Andere",
        },

        mobileNumber: {
          label: "Mobilnummer",
        },

        dateOfBirth: {
          label: "Geburtsdatum (optional)",
          placeholder: "TT/MM/JJ",
        },

        modal: {
          closeText: "Schließen",
          openText: "Öffnen",
        },

        editAndSave: "Bearbeiten & Speichern",
      },
    },
    notification: {
      header: "Benachrichtigungen",
    },
    dashboard: {
      card: {
        title:
          "Treten Sie der virtuellen Warteschlange bei oder buchen Sie einen Termin.",
        joinQueue: "Warteschlange beitreten",
        book: "Buchen",
        cancel: "Abbrechen",
      },

      hint: {
        label: "Saloninformationen",
        readMore: "Mehr lesen",
        readLess: "Weniger anzeigen",
        newUpdate: "Neue Aktualisierung",
        latest: "Neueste:",
        update: "Aktualisierung",
      },

      status: {
        label: "Live-Warteschlangenstatus",
        system: "System",
        nextIn: "Als Nächstes",
        onDuty: "Im Dienst",
        inQueue: "In der Warteschlange",
        online: "Online",
        offline: "Offline",
      },

      barber: {
        barbers: "Barbiere",
        stylists: "Stylisten",
        onDuty: "Im Dienst",
        no: "Keine",
        available: "verfügbar",
        seeAll: "Alle anzeigen",
        online: "Online",
        offline: "Offline",
      },
    },
    queuelist: {
      header: "Live-Warteschlange",
      barber: "FRISEUR",
      stylist: "STYLIST",
      customer: "KUNDE",
      posWait: "POS / WARTEZEIT",

      joinQueue: "Warteschlange beitreten",

      empty: {
        heading: "Die Warteschlange ist leer",
        subHeading:
          "Derzeit befindet sich niemand in der Warteschlange. Seien Sie der Erste!",
        joinQueue: "Warteschlange beitreten",
      },
    },
    joinpopup: {
      header: "Warteschlange beitreten",

      singleJoin: {
        label: "Einzeln beitreten",
        subHeader:
          "Treten Sie der Warteschlange als einzelne Person bei. Diese Option ist für Personen gedacht, die alleine auf Salonservices warten.",
        buttonText: "Einzeln beitreten",
      },

      groupJoin: {
        label: "Gruppe beitreten",
        subHeader:
          "Treten Sie der Warteschlange mit mehreren Personen gleichzeitig bei. Ideal für Freunde oder Familienmitglieder, die den Salon gemeinsam besuchen.",
        buttonText: "Gruppe beitreten",
      },
    },
    joinQueueTypeModal: {
      header: "Option auswählen",
      barber: "Friseur",
      services: "Dienstleistungen",
    },
    singleJoinServicesBarber: {
      header: "Einzeln beitreten",

      barbers: "Barbiere",
      stylists: "Stylisten",

      no: "Keine",

      info1: "Leider sind derzeit keine",
      info2: "für die ausgewählten Dienstleistungen verfügbar.",

      chooseServicesAgain: "Dienstleistungen erneut auswählen",
      continue: "Weiter",
    },
    singleJoinBarberServices: {
      header: "Einzeln beitreten (Dienstleistungen)",

      searchInput: {
        placeholder: "Dienstleistungen nach Kategorie suchen",
      },

      service: "Dienstleistung",
      services: "Dienstleistungen",

      continue: "Weiter",
    },

    singleJoin: {
      header: "Einzeln beitreten (Dienstleistungen)",

      searchInput: {
        placeholder: "Dienstleistungen nach Kategorie suchen",
      },

      service: "Dienstleistung",
      services: "Dienstleistungen",

      continue: "Weiter",
    },
    singleJoinBarber: {
      header: "Einzeln beitreten",

      barbers: "Barbiere",
      stylists: "Stylisten",

      no: "Keine",

      info1: "Leider sind derzeit keine",
      info2: "für die ausgewählten Dienstleistungen verfügbar.",

      chooseServiceAgain: "Dienstleistungen erneut auswählen",
      continue: "Weiter",
      service: "Dienstleistung",
      services: "Dienstleistungen",
    },
    singleJoinModal: {
      header: "Auswahl bestätigen",
      subHeader: "Möchten Sie wirklich fortfahren?",

      selectedBarber: "Ausgewählter Friseur",

      service: "Dienstleistung",
      services: "Dienstleistungen",

      paymentBreakdown: "Zahlungsübersicht",
      totalAmount: "Gesamtbetrag",

      payNow: "Jetzt bezahlen",
      deposit: "Anzahlung",
      payAtSalon: "Im Salon bezahlen",

      proceedToPayment: "Zur Zahlung fortfahren",
      confirmBooking: "Buchung bestätigen",
      goBack: "Zurück",
    },
    singleJoinSuccessPage: {
      header: "Zur Warteschlange hinzugefügt!",
      subHeader:
        "Sie haben sich erfolgreich in die Warteschlange eingereiht. Sie werden benachrichtigt, wenn Sie an der Reihe sind.",

      goToLive: "Zur Live-Warteschlange",
      goBackHome: "Zurück zur Startseite",
    },
    groupHostMemberModal: {
      header: "Hauptmitglied",

      memberInput: {
        placeholder: "Name des Mitglieds eingeben",
      },

      cancel: "Abbrechen",
      add: "Hinzufügen",
    },
    groupJoin: {
      header: "Gruppe beitreten (Services)",
      searchInput: {
        placeholder: "Services nach Kategorie suchen",
      },
      service: "Service",
      services: "Services",
      continue: "Weiter",
    },

    groupJoinBarber: {
      header: "Gruppe beitreten (Stylisten)",
      empty: {
        header: "Keine Stylisten",
        subHeader:
          "Derzeit sind keine Stylisten für die ausgewählten Services verfügbar.",
        chooseServicesAgain: "Services erneut wählen",
      },
      service: "Service",
      services: "Services",
      continue: "Weiter",
    },

    groupJoinMembers: {
      header: "Gruppenmitglieder",
      you: "Du",
      host: "(Host)",
      ready: "Bereit",
      services: "Services:",
      stylist: "Stylist:",
      subtotal: "Zwischensumme:",
      addMember: "Mitglied hinzufügen",
      member: "Mitglied",
      members: "Mitglieder",
      joinQueue: "Zur Warteschlange",
    },

    groupAddMemberModal: {
      header: "Neues Mitglied",
      memberInput: {
        placeholder: "Name eingeben",
      },
      cancel: "Abbrechen",
      add: "Hinzufügen",
    },

    groupJoinModal: {
      header: "Gruppenbuchung",
      subHeader: "Bitte überprüfe deine Gruppendaten",
      members: "Mitglieder",
      services: "Services",
      time: "Zeit",
      paymentBreakdown: "Zahlungsübersicht",
      pricingSummary: "Preisübersicht",
      totalAmount: "Gesamtbetrag",
      payNow: "Jetzt bezahlen",
      deposit: "Anzahlung",
      remainingBalance: "Restbetrag",
      proceedToPayment: "Zur Zahlung",
      confirmGroupBooking: "Buchung bestätigen",
      goBack: "Zurück",
    },

    groupJoinSuccessPage: {
      header: "Warteschlange beigetreten!",
      subHeader: "Deine Gruppe ist der Warteschlange beigetreten.",
      goToLiveQueue: "Zur Live-Warteschlange",
      goBackToHome: "Zur Startseite",
    },

    salon: {
      details: "Details",
      services: "Services",
      barbers: "Barbiere",
      stylists: "Stylisten",
      description: "Beschreibung",
      contactUs: "Kontakt",
      anyQuestionInfo: "Bei Fragen",
      location: "Standort",
      followUsOn: "Folge uns auf",
      socialLinks: "Social Media",
      exploreAll: "Alle ansehen",
      no: "Keine",
      available: "verfügbar",
    },
  },
};
