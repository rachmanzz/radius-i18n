# **radius-i18n**

`radius-i18n` is a tool designed to simplify internationalization (i18n) by leveraging **Google GenAI APIs** to generate translations and manage localization files. With `radius-i18n`, you can automate translation keys, regenerate missing values, and enrich translations using contextual notes.

---

## Installation

Install `radius-i18n` as a development dependency:

* **npm**:

  ```bash
  npm install radius-i18n --save-dev
  ```

* **Yarn**:

  ```bash
  yarn add radius-i18n --dev
  ```

---

## Configuration

Create a configuration file named **`radius.config.json`** in your project root:

```json
{
  "locale_base": "en",
  "locales": ["en", "id"],
  "locale_path": "./src/locales",
  "change_delay": 2000,
  "genai_key": "apikey"
}
```

### Explanation of Configuration Options

| Key                | Description                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **`locale_base`**  | The base locale used as the source language for translation.                               |
| **`locales`**      | List of target locales for translation.                                                    |
| **`locale_path`**  | Directory where localization files are stored/generated. Must have read-write permissions. |
| **`change_delay`** | Delay (ms) before the watcher applies changes after file save.                             |
| **`genai_key`**    | Your Google GenAI API key (not service account).                                           |

### Changing the Model

By default, the tool uses:

```
gemini-2.5-flash
```

To override this, set (lowercase key):

```json
"genai_model": "gemini-2.5-pro"
```

If not provided, the default model remains `"gemini-2.5-flash"`.

---

## Setup Localization Files

Inside your `locale_path`, create a folder for the base locale (e.g., `en`) and define translation JSON files.

Example: `src/locales/en/header.json`

```json
{
  "homeNavLabel": "",
  "adminNavLabel": "",
  "profileNavLabel": "",
  "subtitleHeader": "",
  "__future__trx__": ["loginBtn", "registerBtn"],
  "__note__": [
    {
      "key": "subtitleHeader",
      "note": "This key is about a machine, create a simple subtitle.",
      "lang": "en"
    }
  ]
}
```

### Rules

* **Empty values ("")** → tool generates translation automatically.
* **Non-empty values** → not overwritten unless included in `__future__trx__`.
* **`__future__trx__`** → force-regenerate keys even if they already have values.
* **`__note__`** → guidance notes given to GenAI for more accurate translation.
  Supports nested keys: `"parent.child"`.

Notes and future lists are removed automatically after processing.

---

## Important Considerations

### 1. Directory Permissions

`locale_path` must be readable and writable so the watcher can update files.

### 2. Complete Notes Before Saving

When you add/update notes:

* **Do not save mid-note.**
* When file is saved, the watcher triggers translation immediately.
* After translation completes, the system removes:

  * `__note__`
  * `__future__trx__`

### 3. Error Handling

If translations fail:

* Check the console logs.
* Ensure your **GenAI API key** is valid.
* Ensure your JSON structure follows the guidelines.

---

## Scripts

Add to `package.json`:

```json
"scripts": {
  "radius:w": "radius-translate"
}
```

Run:

```bash
npm run radius:w
```

This starts the watcher that monitors and updates localization files automatically.

---

## Usage Guidelines

1. **Define translation keys.**

   * Leave values empty for auto-generation.
   * Add keys to `__future__trx__` when you want them regenerated.

2. **Add contextual notes using `__note__`.**

   * Helps GenAI produce more accurate translations.
   * Notes should be complete before saving.

3. **Edit or add new keys anytime**, watcher will handle them automatically.

---

## Example Workflow

1. Add `welcomeMessage` with an empty value in `en/header.json`.
2. Save file.
3. The watcher detects change and generates:

   * English base value (if needed)
   * Translations for all listed locales.

To ensure future regeneration, include:

```json
"__future__trx__": ["welcomeMessage"]
```

---

Happy localizing with GenAI! 🚀
