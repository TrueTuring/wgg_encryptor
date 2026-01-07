# WGG-Encryptor

This is our encryptor website to encrypt lua files that get loaded from our WGG Unlocker.

## Features

- Server-side AES-256-CBC encryption
- Secure file upload and download
- Modern Next.js web application
- Beautiful UI with Tailwind CSS
- Drag & drop file support
- Multi-file encryption support

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

- **AES-256-CBC Encryption**: Industry-standard encryption algorithm
- **Secure Key Storage**: Encryption keys are stored securely on the server, never exposed to clients
- **HTTPS**: All file uploads are transmitted over HTTPS
- **No File Storage**: Files are not stored on the server after encryption
- **Secure API**: Server-side encryption prevents key leakage
