# Lathund: Kortkommandon för VS Code & Gemini Code Assist (Mac)

Detta dokument är formaterat för att vara lätt att skriva ut och ha bredvid tangentbordet.

## 🤖 Gemini Code Assist (i VS Code)

Förutsätter att du har tillägget **Gemini Code Assist** (tidigare Cloud Code / Duet AI) installerat.

| Funktion | Kortkommando (Mac) | Beskrivning |
| :--- | :--- | :--- |
| **Generera Kod / Autocomplete** | `Option + \` (eller vänta) | Triggar kodförslag baserat på din nuvarande kontext. |
| **Acceptera Förslag** | `Tab` | Accepterar hela det gråa kodförslaget. |
| **Öppna Inline Chat** | `Cmd + I` | Öppnar en prompt direkt i kodredigeraren för att refaktorera eller generera kod där markören är. |
| **Öppna Gemini Sidopanel** | `Cmd + Shift + P` -> Skriv `Gemini: Focus on Chat View` | Öppnar huvudchatten i sidopanelen för större diskussioner och frågor om hela kodbasen. |
| **Förklara Kod** | Markera kod -> Högerklicka -> `Gemini: Explain this` | Ber Gemini förklara hur den markerade koden fungerar. |
| **Generera Tester** | Markera kod -> Högerklicka -> `Gemini: Generate unit tests` | Skapar enhetstester för den valda koden. |

---

## 💻 VS Code - Snabbhet & Navigering

Dessa är de mest kritiska kortkommandona för att röra dig snabbt i VS Code.

| Funktion | Kortkommando (Mac) | Beskrivning |
| :--- | :--- | :--- |
| **Sök Filer Snabbt (Quick Open)** | `Cmd + P` | Skriv filnamnet för att hoppa direkt till det. Extremt viktigt! |
| **Kommando-paletten** | `Cmd + Shift + P` | Kör alla tillgängliga kommandon i VS Code (inkl. Git, tillägg etc). |
| **Sök överallt (Global Search)**| `Cmd + Shift + F` | Sök efter en specifik textsträng i hela projektet. |
| **Öppna Terminal** | `Ctrl + \`` (Backtick) | Växlar in och ut ur den inbyggda terminalen. |
| **Gå till Definition** | `F12` (eller `Cmd` + Klick) | Hoppar till där en funktion, variabel eller klass är definierad. |
| **Byt namn på symbol** | `F2` | Byter namn på en variabel/funktion överallt där den används (typsäkert). |
| **Format Document** | `Shift + Option + F` | Formaterar koden enligt Prettier/ESLint. |
| **Markera nästa förekomst** | `Cmd + D` | Markera ett ord, tryck Cmd+D flera gånger för att redigera flera ställen samtidigt. |
| **Stäng aktuell flik** | `Cmd + W` | Stänger den fil du har öppen. |

---

## ☁️ Google Cloud Console (CLI & Navigation)

Mycket av arbetet i Cloud Console sker i webbläsaren, men du kan snabba upp det lokala arbetsflödet via `gcloud` i terminalen.

| Funktion / Kommando | Beskrivning |
| :--- | :--- |
| `gcloud auth login` | Logga in på ditt Google Cloud-konto från terminalen. |
| `gcloud auth application-default login` | **VIKTIGT:** Sätter upp lokala referenser (ADC) så att dina lokala Node/Python-skript automatiskt använder dina Cloud-krediter utan att du behöver hårdkoda API-nycklar. |
| `gcloud config set project [PROJEKT-ID]` | Välj vilket Cloud-projekt du arbetar mot just nu. |
