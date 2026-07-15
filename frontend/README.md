# LinkReveal - Mobile App

LinkReveal is a full-stack mobile application that intercepts, scans, and analyzes potentially malicious URLs using an AI-driven backend. I built this as my Capstone Engineering Project to bridge the gap between local development and live cloud deployment.

## Tech Stack
* **Frontend:** React Native, Expo
* **Backend:** Node.js, Express.js (Hosted on Render)
* **Infrastructure:** Expo EAS (CI/CD)

## Development & Deployment Focus
The core challenge of this project wasn't just writing the React code, but handling the deployment pipeline. Key technical hurdles included:
* **CI/CD Configuration:** Setting up Expo EAS to automate Android APK builds in the cloud.
* **Cache Invalidation:** Bypassing aggressive device-level caching (specifically on Xiaomi/HyperOS) by mutating Android Application IDs and managing cryptographic Keystores to force the OS to accept new builds.
* **Backend Sync:** Hooking into the external Express server and handling cold-start delays to ensure the frontend connects seamlessly.

## Running the Project Locally

### Prerequisites
* Node.js (v18+)
* Expo CLI (`npm install -g expo-cli`)
* Expo Go app on your phone, or an Android Emulator.

### Quick Start
1. Install dependencies:
   ```bash
   npm install
