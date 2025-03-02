# Barangay CMS Database Information

## Overview

The Barangay Case Management System uses a file-based database to store case data. This ensures that your data persists across application restarts and is not tied to browser cache or localStorage.

## Database Location

The database is stored in a folder called `database` within the application's user data directory. The specific location depends on your operating system:

### On Windows:
```
C:\Users\[YourUsername]\AppData\Roaming\Barangay Case Management\database\cases.json
```

### On macOS:
```
/Users/[YourUsername]/Library/Application Support/Barangay Case Management/database/cases.json
```

### On Linux:
```
/home/[YourUsername]/.config/Barangay Case Management/database/cases.json
```

## Backup and Restore

### Creating a Backup

To back up your database:

1. Locate the `cases.json` file using the paths above
2. Copy this file to a safe location
3. You can also use the export feature in the application to export cases to CSV format

### Restoring from Backup

To restore from a backup:

1. Close the application
2. Locate the database directory using the paths above
3. Replace the `cases.json` file with your backup copy
4. Restart the application

## Troubleshooting

If you encounter issues with the database:

1. **Data not persisting**: Check if you're running the application using the Electron version (via the start-app scripts) rather than opening it in a browser
2. **Database file not found**: The application will create a new database file if one doesn't exist
3. **Corrupted database**: If the database becomes corrupted, you can delete the `cases.json` file and the application will create a new empty database

## Storage Indicator

The application includes a small indicator in the bottom-right corner showing:
- Which storage method is being used (file or localStorage)
- Whether the application is running in Electron
- How many cases are currently loaded
- Status of API tests

If you see "Storage: localStorage" when running the Electron app, it means there might be an issue with the file-based storage.

## Technical Details

The database is a simple JSON file that contains an array of case objects. The application reads this file on startup and writes to it whenever cases are added, updated, or deleted.

A backup copy of the database is created before each write operation to prevent data loss in case of a write failure.

The application will automatically migrate data from localStorage to the file-based database when it's first run in Electron mode. 