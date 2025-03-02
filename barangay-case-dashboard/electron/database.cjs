const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Custom logger that only logs in development mode
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  }
};

// Define the database directory and file path
const getDbDirectory = () => {
  try {
    // Use the app's user data directory to store our database files
    const userDataPath = app.getPath('userData');
    logger.log('User data path:', userDataPath);
    
    const dbDirectory = path.join(userDataPath, 'database');
    logger.log('Database directory:', dbDirectory);
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dbDirectory)) {
      logger.log('Database directory does not exist, creating it...');
      fs.mkdirSync(dbDirectory, { recursive: true });
      logger.log('Database directory created successfully');
    } else {
      logger.log('Database directory already exists');
    }
    
    return dbDirectory;
  } catch (error) {
    logger.error('Error in getDbDirectory:', error);
    // Fallback to a temporary directory
    const tempDir = path.join(__dirname, 'temp-database');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
  }
};

const getCasesFilePath = () => {
  const filePath = path.join(getDbDirectory(), 'cases.json');
  logger.log('Cases file path:', filePath);
  return filePath;
};

// Initialize the database with empty data if it doesn't exist
const initializeDatabase = () => {
  try {
    const casesFilePath = getCasesFilePath();
    
    if (!fs.existsSync(casesFilePath)) {
      logger.log('Cases file does not exist, creating it with empty array...');
      fs.writeFileSync(casesFilePath, JSON.stringify([], null, 2));
      logger.log('Cases file created successfully');
    } else {
      logger.log('Cases file already exists');
      // Validate that the file contains valid JSON
      try {
        const data = fs.readFileSync(casesFilePath, 'utf8');
        JSON.parse(data);
        logger.log('Cases file contains valid JSON');
      } catch (parseError) {
        logger.error('Cases file contains invalid JSON, resetting it:', parseError);
        fs.writeFileSync(casesFilePath, JSON.stringify([], null, 2));
      }
    }
    
    // Test file permissions by writing to it
    fs.accessSync(casesFilePath, fs.constants.R_OK | fs.constants.W_OK);
    logger.log('Cases file is readable and writable');
    
    return true;
  } catch (error) {
    logger.error('Error initializing database:', error);
    return false;
  }
};

// Get all cases from the database
const getCases = () => {
  try {
    const casesFilePath = getCasesFilePath();
    logger.log('Reading cases from:', casesFilePath);
    
    if (!fs.existsSync(casesFilePath)) {
      logger.log('Cases file does not exist, returning empty array');
      return [];
    }
    
    const data = fs.readFileSync(casesFilePath, 'utf8');
    logger.log('Read data length:', data.length);
    
    const cases = JSON.parse(data);
    logger.log('Parsed cases count:', cases.length);
    
    return cases;
  } catch (error) {
    logger.error('Error reading cases from database:', error);
    return [];
  }
};

// Save cases to the database
const saveCases = (cases) => {
  try {
    if (!Array.isArray(cases)) {
      logger.error('Invalid cases data, not an array:', typeof cases);
      return false;
    }
    
    const casesFilePath = getCasesFilePath();
    logger.log('Saving cases to:', casesFilePath);
    logger.log('Cases count:', cases.length);
    
    // Create a backup of the existing file if it exists
    if (fs.existsSync(casesFilePath)) {
      const backupPath = `${casesFilePath}.backup`;
      fs.copyFileSync(casesFilePath, backupPath);
      logger.log('Created backup at:', backupPath);
    }
    
    // Write the new data
    fs.writeFileSync(casesFilePath, JSON.stringify(cases, null, 2));
    logger.log('Cases saved successfully');
    
    return true;
  } catch (error) {
    logger.error('Error saving cases to database:', error);
    return false;
  }
};

// Export database functions
module.exports = {
  initializeDatabase,
  getCases,
  saveCases
}; 