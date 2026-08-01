# Opero Analyzer

A precision clinic operations dashboard built for a multi-role team (Receptionist, Nurse, Doctor). Designed with a real-time, shared data context, Opero Analyzer tracks patients flawlessly from booking to discharge.

## Features

- **Role-Based Workflows**: Tailored interfaces for Receptionist, Nurse, and Doctor.
- **Live Queue Tracking**: Real-time status updates sync automatically across all roles using a shared data store.
- **Patient Management**: Full patient directory, demographic tracking, and visit histories.
- **Clinical Triage & Notes**: Vitals capture, chief complaints, and dynamic clinical note-taking (chat-bubble styling).
- **Prescription System**: Automatically generated prescription records upon patient discharge.
- **Brand Restyle (v3)**: Features the true Opero brand identity (navy, periwinkle, sky, deep-blue) and custom typography (Poppins, Inter, IBM Plex Mono).

## Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Vanilla CSS + Custom Theme tokens)
- **Routing**: React Router DOM
- **State Management**: React Context (`useReducer` & `localStorage` persistence)
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Demo Credentials

- **Receptionist**: `reception@opero.clinic` / `reception123`
- **Nurse**: `nurse@opero.clinic` / `nurse123`
- **Doctor**: `doctor@opero.clinic` / `doctor123`

*(Note: Data is saved to your local browser storage. You can reset the data to the initial seed state from the bottom of the sidebar).*
