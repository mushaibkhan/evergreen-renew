# Evergreen Renew 🌿✨

Evergreen Renew is a direct-to-consumer platform for safely selling used electronics and appliances online in India. The platform provides real-time AI-based pricing quotes and free doorstep pickup, ensuring responsible and sustainable e-waste recycling.

## Architecture

This repository is built as a **Monorepo Workspace** containing three primary applications:
* **`web/`**: The Next.js (App Router) frontend website for customers to browse, list devices, and schedule pickups. Uses Tailwind CSS with a luxury "Green & Gold" aesthetic.
* **`mobile/`**: A React Native (Expo) project designated to be the cross-platform mobile app equivalent of the website.
* **`backend/`**: A Node.js backend using Express and SQLite. Responsible for JWT Authentication, the Pricing Deduction Engine, returning product catalogs, and managing Quote/Order states.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mushaibkhan/evergreen-renew.git
   cd evergreen-renew
   ```

2. **Install all dependencies:**
   Wait for the root installation to complete. This will also install the dependencies in the sub-workspaces (`web`, `mobile`, `backend`).
   ```bash
   npm install
   ```

3. **Start the Development Servers:**
   At the root of the project, you can run all three projects concurrently using:
   ```bash
   npm run dev
   ```

   Individual run commands:
   - Next.js Web App: `npm run dev:web` (runs on `http://localhost:3000`)
   - Node.js API: `npm run dev:backend` (runs on `http://localhost:5000`)
   - Expo Mobile: `npm run dev:mobile` 

## Tech Stack Highlights
- **Frameworks**: Next.js 14+, React Native (Expo), Express.js
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (local development simulation via `sqlite3`)
- **Language**: TypeScript

## Current System Capabilities
- **Auth System**: Registration/Login via JWT tokens.
- **Product Cataloging**: Categories, Brands, and specific Devices.
- **Pricing Simulator Engine**: Evaluation questionnaire algorithm that deducts from a base price depending on the device condition.

## License
&copy; 2026 Evergreen Renew Pvt Ltd.
