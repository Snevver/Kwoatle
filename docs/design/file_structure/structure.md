Quotely/                         # Hoofdmap van je project
├── .gitignore                   # Bestanden en mappen die Git moet negeren (zoals node_modules en .idea)
├── LICENSE                      # Licentiebestand voor open-source projecten
├── README.md                    # Algemene uitleg over het project
├── docs/                         # Documentatie en planning
│   ├── Design/                   # Ontwerpbestanden zoals wireframes en UI-ontwerpen
│   ├── Planning/                 # Projectplanning, taken en roadmap
│   ├── Intro/                    # Introductie en conceptuele uitleg
├── app/                          # De daadwerkelijke codebase van de app
│   ├── android/                  # Native Android-specifieke code en instellingen
│   ├── ios/                      # Native iOS-specifieke code en instellingen
│   ├── node_modules/             # Geïnstalleerde NPM-packages (moet in .gitignore)
│   ├── src/                      # De broncode van je app
│   │   ├── components/           # Herbruikbare UI-componenten
│   │   ├── screens/              # Verschillende pagina’s/schermen in de app
│   │   ├── assets/               # Afbeeldingen, icons en andere media
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── utils/                # Hulpfuncties en helpers
│   │   ├── services/             # API-aanroepen en dataverwerking
│   │   ├── navigation/           # Routing en navigatie binnen de app
│   │   ├── App.tsx               # Hoofdbestand van de React Native-app
│   ├── __tests__/                # Testbestanden voor Jest
│   ├── .eslintrc.js              # ESLint-configuratie voor codekwaliteit
│   ├── .prettierrc.js            # Prettier-configuratie voor codeopmaak
│   ├── .watchmanconfig           # Configuratie voor Watchman (gebruikt door React Native)
│   ├── app.json                  # Configuratiebestand voor Expo/React Native
│   ├── babel.config.js           # Babel-configuratie voor JavaScript-transformatie
│   ├── index.js                  # Instappunt van de app
│   ├── jest.config.js            # Configuratiebestand voor Jest-tests
│   ├── metro.config.js           # Configuratiebestand voor Metro bundler (React Native)
│   ├── package-lock.json         # Automatisch gegenereerd bestand voor package-versies
│   ├── package.json              # Beheert de afhankelijkheden en scripts van de app
│   ├── tsconfig.json             # TypeScript-configuratiebestand
│   ├── READMEREACT.md            # Extra documentatie specifiek voor React Native
│   ├── .idea/                    # JetBrains IDE-configuratie (kan in .gitignore)
