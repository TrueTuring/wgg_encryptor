# WGG-Encryptor

This is our encryptor website to encrypt lua files that get loaded from our WGG Unlocker.

## Features

- Client-side encryption (files never leave your browser)
- Modern Next.js web application
- Beautiful UI with Tailwind CSS
- Drag & drop file support
- Download encrypted files

## Getting Started

### Development

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

To build the production version:

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Security

All encryption happens client-side in your browser. No files or data are sent to any server.
