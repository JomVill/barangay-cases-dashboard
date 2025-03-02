# Barangay Case Management System

A comprehensive case management solution designed for Barangay offices to efficiently track, manage, and resolve community cases.

## Developed by

**AnIno Solutions** and **JomVill**

## Features

- **Dashboard**: Get a quick overview of case statistics and trends
- **Case Management**: Create, update, and track cases through their lifecycle
- **Analytics**: Visualize case data with interactive charts and reports
- **Export Functionality**: Export case data to CSV for external reporting
- **User-Friendly Interface**: Modern, responsive design for ease of use

## System Requirements

- **Operating System**: Windows 10/11 or macOS 12+
- **Processor**: 1.6 GHz or faster, 2+ cores
- **Memory**: 4 GB RAM minimum (8 GB recommended)
- **Disk Space**: 500 MB available space
- **Display**: 1280 x 720 screen resolution or higher

## Technology Stack

This project is built with:

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Recharts**: Composable charting library
- **Electron**: For desktop application packaging

## Installation Guide

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Developer Installation

1. Install Node.js:
   - Windows: Download and run the installer from [nodejs.org](https://nodejs.org/)
   - macOS: Use Homebrew `brew install node` or download from [nodejs.org](https://nodejs.org/)

2. Clone the repository:
   ```
   git clone https://github.com/AnInoSolutions/barangay-cms.git
   ```

3. Navigate to the project directory:
   ```
   cd barangay-case-dashboard
   ```

4. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Option 1: Using the Start Scripts (Recommended for Development)

#### On macOS:
1. Open Terminal
2. Navigate to the project directory
3. Make the script executable (first time only):
   ```
   chmod +x start-app.sh
   ```
4. Run the script:
   ```
   ./start-app.sh
   ```
   
   **Important Note**: Double-clicking `start-app.sh` in Finder will not work properly on macOS. You must run it from Terminal.

#### On Windows:
1. Navigate to the project folder in File Explorer
2. Double-click on `start-app.bat`
   - Note: If you get a security warning, click "More info" and then "Run anyway"

### Option 2: Using npm Commands

1. Open Terminal/Command Prompt
2. Navigate to the project directory
3. Run:
   ```
   npm run dev -- --port 3000
   ```
4. Open your browser and go to `http://localhost:3000`

### Option 3: Using Electron (Desktop App Experience)

1. Open Terminal/Command Prompt
2. Navigate to the project directory
3. Run:
   ```
   npm run electron:dev
   ```

## Troubleshooting

### Common Issues

1. **Application won't start**
   - Ensure Node.js is properly installed: `node --version`
   - Check if all dependencies are installed: `npm install`
   - Try clearing npm cache: `npm cache clean --force`

2. **Port already in use**
   - Try a different port: `npm run dev -- --port 4000`
   - Kill processes using the port:
     - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
     - macOS/Linux: `lsof -i :3000` then `kill -9 <PID>`

3. **White screen in Electron app**
   - Check console for errors: Press Ctrl+Shift+I (Windows) or Cmd+Option+I (macOS)
   - Ensure the development server is running

4. **Missing dependencies errors**
   - Run `npm install` to ensure all dependencies are installed
   - If using a specific Node version, try `nvm use 16` (if nvm is installed)

5. **macOS script issues**
   - If double-clicking `start-app.sh` doesn't work, always run it from Terminal
   - If Terminal says "permission denied", run `chmod +x start-app.sh` first

## Building for Production

1. Build the web application:
   ```
   npm run build
   ```

2. Build the desktop application:
   ```
   npm run electron:build
   ```
   This will create distributable packages in the `release` folder.

## Future Releases

In upcoming releases, we plan to provide:

1. Standalone executable installers for Windows (.exe)
2. macOS application bundles (.dmg)
3. Linux packages (.AppImage)

These will simplify installation for end-users who don't need to modify the source code.

## Usage

1. **Dashboard**: View case statistics and trends
2. **Cases**: Manage all cases with filtering and sorting options
3. **Analytics**: Explore data visualizations and reports
4. **Case Detail**: View and update comprehensive case information

## License

This project is proprietary software owned by AnIno Solutions and JomVill.

## Support

For support, please contact:
- Email: jomarivillanueva83@gmail.com
- Developer: JomVill
