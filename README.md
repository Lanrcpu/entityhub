# BACS Entity Hub v1.0 Standard Edition

> **Standards-Based Machine Readable Entity Package Generator**

BACS Entity Hub is a professional-grade web application designed to empower small businesses and enterprise entities to claim, verify, and maintain their digital identities under strict machine-readable standards. It generates a comprehensive, SEO-optimized, and AI-ready web presence alongside highly structured JSON-LD schema metadata.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Aesthetic & UX Design](#aesthetic--ux-design)
- [Installation & Getting Started](#installation--getting-started)
- [How to Build & Run Locally](#how-to-build--run-locally)
- [Deployment Guides](#deployment-guides)
  - [GitHub Pages](#github-pages)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Cloudflare Pages](#cloudflare-pages)
- [Technical Architecture](#technical-architecture)
- [Roadmap](#roadmap)
- [License](#license)

---

## 🔍 Project Overview

In the modern digital landscape, search engines, maps, voice assistants, and large language models (LLMs) rely on structured business metadata to understand and recommend entities. The BACS Entity Hub bridges the gap between human-readable web design and machine-readable data structures. 

With this application, you can enter your business profile details, customize your services, products, FAQs, and hours of operation, preview the responsive output instantly, and export a standards-compliant distribution package.

---

## ✨ Key Features

### 1. BACS Assist™
An intelligent guidance component that runs localized contextual checks. It alerts users when critical fields (e.g., Business Name, Description, Canonical URL, Location Coordinates, Images, Hours) are missing, providing a friendly WhatsApp link for direct BACS engineering assistance without restricting or blocking exports.

### 2. Publication Readiness Panel
An elegant inline diagnostic cockpit that monitors data completeness. Instead of simplistic gamified numbers, it clearly tracks required vs. optional fields utilizing status indicators:
- 🟢 **Ready**
- 🟡 **Optional** (missing optional data)
- 🔴 **Needs Attention** (missing critical machine-readable properties)

### 3. Standards-Based Schema Generator
Generates dual-purpose output with zero external dependencies:
- **Human-Readable HTML**: A beautifully designed, highly modern, single-page business hub with custom navigation, dark-mode styling options, full WCAG AA contrast compliance, and subtle, semi-transparent `BACS Entity Hub™` watermarking.
- **Machine-Readable Metadata (`entity.json` / JSON-LD)**: Injectable schemas adhering to schema.org structured specifications (LocalBusiness, Organization, WebSite) containing a built-in generator signature indicating authorship:
  ```json
  "generator": {
    "name": "BACS Entity Hub",
    "version": "1.0",
    "edition": "Standard",
    "generated": true
  }
  ```

### 4. Comprehensive Package Exporter
Exports a deployment-ready ZIP directory including:
- `index.html` (The fully baked human-readable presentation layer)
- `entity.json` (Structured JSON-LD schema payload)
- `404.html` (Custom error page matching the business branding)
- `README.md` (Self-contained hosting guides for seamless publishing)

---

## 🎨 Aesthetic & UX Design
- **Colorway**: Sleek Slate Charcoal dark dashboard styling combined with dynamic status chips.
- **Typography**: Paired display typography ("Space Grotesk" and "Inter") with technical monospaced details ("JetBrains Mono").
- **Animations**: Fluid component transitions powered by `motion` for visual delight.
- **Watermark**: A beautifully subtle `BACS Entity Hub™` watermark placed in the corner of the live simulator and embedded cleanly into the footer of compiled production assets.

---

## ⚙️ Technology Stack
- **Framework**: React 18+ with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion (f.k.a Framer Motion)
- **ZIP Compilation**: Client-side JSZip serialization

---

## 🚀 Installation & Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or higher) and [npm](https://www.npmjs.com/) installed on your machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bacs-entity-hub
```

### 2. Install Dependencies
```bash
npm install
```

---

## 💻 How to Run & Build Locally

### Dev Server
Launch the local development server with hot reload:
```bash
npm run dev
```
By default, the application runs at `http://localhost:3000`.

### Type Checking & Linting
Ensure your TypeScript compilations are pristine and free of syntax issues:
```bash
npm run lint
```

### Build Production Artifacts
Compile the applet into an optimized, deployment-ready bundle:
```bash
npm run build
```
This outputs production-ready files in the `dist/` directory.

---

## 🌐 Deployment Guides

The output package produced by BACS Entity Hub is fully static, requiring no backend servers or database nodes. It is 100% compatible with modern static web hosts.

### GitHub Pages
1. Create a new repository on GitHub (e.g., `my-business-hub`).
2. Unzip your exported package into a local directory.
3. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from BACS Entity Hub"
   ```
4. Push your local files to your GitHub repository.
5. In GitHub, go to your repository **Settings** -> **Pages**.
6. Set the Source to **Deploy from a branch** and select `main` (or `/root`), then click **Save**.
7. Your web page will be live in minutes under `https://<username>.github.io/<repository-name>/`!

### Vercel
1. Install the Vercel CLI (`npm i -g vercel`) or sign up at [Vercel.com](https://vercel.com).
2. Create a new project in Vercel.
3. Import your GitHub repository, or run the following command inside your unzipped folder:
   ```bash
   vercel
   ```
4. Select default settings. Vercel will automatically host the static files.

### Netlify
1. Sign up/Log in at [Netlify.com](https://www.netlify.com).
2. Go to **Sites** -> **Add new site** -> **Deploy manually**.
3. Drag and drop the unzipped BACS export folder directly into the browser upload panel.
4. Your site will be live instantly!

### Cloudflare Pages
1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) and go to the **Pages** dashboard.
2. Select **Create a project** -> **Direct Upload**.
3. Drag and drop your unzipped directory containing `index.html` and assets.
4. Name your project and click **Deploy**. Your site is hosted globally on Cloudflare Edge!

---

## 🗺️ Roadmap
- [x] Contextual machine-readable compliance checks (BACS Assist)
- [x] Upgraded Publication Readiness diagnostic metrics
- [x] Generator metadata signatures on exports
- [ ] Integration with decentralized identifiers (DIDs)
- [ ] Multi-lingual localized schema generation
- [ ] Direct web publishing API integrations (Vercel/Netlify one-click)

---

## 📄 License
This project is licensed under the Apache License 2.0. See the `LICENSE` file for more details.

---
*Crafted with precision by the BACS Release Engineering Team.*

---
<!-- Deployment ping: auto-appended to trigger Pages rebuild -->
Last redeploy: 2026-07-03T00:00:00Z
