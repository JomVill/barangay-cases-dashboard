import { Case } from './sample-data';

/**
 * Migrates case data from localStorage to file-based storage
 * This is called once when the app starts in Electron mode
 */
export const migrateFromLocalStorage = async (): Promise<boolean> => {
  try {
    // Check if we're running in Electron
    if (!window.electronAPI) {
      console.log('Not running in Electron, skipping migration');
      return false;
    }
    
    // Check if there's data in localStorage
    const savedCases = localStorage.getItem('barangayCases');
    if (!savedCases) {
      console.log('No data in localStorage to migrate');
      return false;
    }
    
    // Parse the data
    const cases: Case[] = JSON.parse(savedCases);
    if (!cases.length) {
      console.log('No cases to migrate');
      return false;
    }
    
    // Get current cases from file storage
    const currentCases = await window.electronAPI.getCases();
    
    // If file storage already has data, we'll merge the data
    // This prevents overwriting existing file data with localStorage data
    if (currentCases.length > 0) {
      console.log('File storage already has data, merging...');
      
      // Create a map of existing case IDs for quick lookup
      const existingCaseIds = new Set(currentCases.map(c => c.id));
      
      // Only add cases that don't already exist in file storage
      const newCases = cases.filter(c => !existingCaseIds.has(c.id));
      
      if (newCases.length === 0) {
        console.log('No new cases to add from localStorage');
        return false;
      }
      
      // Merge the cases
      const mergedCases = [...currentCases, ...newCases];
      
      // Save the merged cases
      const success = await window.electronAPI.saveCases(mergedCases);
      
      if (success) {
        console.log(`Migrated ${newCases.length} cases from localStorage to file storage`);
        return true;
      }
    } else {
      // File storage is empty, just save the localStorage data
      const success = await window.electronAPI.saveCases(cases);
      
      if (success) {
        console.log(`Migrated ${cases.length} cases from localStorage to file storage`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error migrating data from localStorage:', error);
    return false;
  }
}; 