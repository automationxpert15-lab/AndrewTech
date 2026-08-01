# Independent Software Consultant Website

## Run the site

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Run Playwright tests

Install the browser once:

```bash
npx playwright install
```

Run all tests:

```bash
npm test
```

Run tests in a visible browser:

```bash
npm run test:headed
```

Open Playwright's interactive test UI:

```bash
npm run test:ui
```

## Main files

- `index.html` — website structure and content
- `styles.css` — responsive design
- `script.js` — mobile navigation and form validation
- `tests/site.spec.js` — Playwright smoke tests
- `playwright.config.js` — desktop and mobile test configuration

The contact form currently validates only in the browser. Connect it to your .NET API or an email form service before publishing.
