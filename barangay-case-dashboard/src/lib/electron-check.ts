/**
 * Utility to check if the Electron API is working
 */

// Function to check if running in Electron
export function isElectron(): boolean {
  // Check if window.isRunningInElectron is set by preload script
  if (typeof window !== 'undefined' && window.isRunningInElectron === true) {
    console.log('Detected Electron environment via isRunningInElectron flag');
    return true;
  }
  
  // Fallback checks
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    console.log('Detected Electron environment via process.type');
    return true;
  }
  
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    console.log('Detected Electron environment via process.versions.electron');
    return true;
  }
  
  console.log('Not running in Electron environment');
  return false;
}

// Function to test if Electron API is working
export async function testElectronAPI() {
  console.log('Testing Electron API...');
  
  const result = {
    isElectron: isElectron(),
    pingSuccess: false,
    getCasesSuccess: false,
    saveCasesSuccess: false
  };
  
  // If not running in Electron, return early
  if (!result.isElectron) {
    console.log('Not running in Electron, skipping API tests');
    return result;
  }
  
  // Check if electronAPI exists
  if (typeof window.electronAPI === 'undefined') {
    console.error('electronAPI is not defined on window object');
    return result;
  }
  
  // Test ping function
  try {
    console.log('Testing ping...');
    const pingResponse = await window.electronAPI.ping();
    console.log('Ping response:', pingResponse);
    result.pingSuccess = pingResponse === 'pong';
  } catch (error) {
    console.error('Error testing ping:', error);
  }
  
  // Test getCases function
  try {
    console.log('Testing getCases...');
    const cases = await window.electronAPI.getCases();
    console.log('getCases response:', Array.isArray(cases) ? `Array with ${cases.length} items` : cases);
    result.getCasesSuccess = Array.isArray(cases);
    
    // If we got cases, log the first one for debugging
    if (Array.isArray(cases) && cases.length > 0) {
      console.log('First case:', JSON.stringify(cases[0]).substring(0, 100) + '...');
    }
  } catch (error) {
    console.error('Error testing getCases:', error);
  }
  
  // Test saveCases function with a dummy case
  try {
    console.log('Testing saveCases...');
    // First get existing cases to avoid overwriting
    const existingCases = await window.electronAPI.getCases();
    
    // Only test saving if we could get cases
    if (Array.isArray(existingCases)) {
      // Create a test case with timestamp to avoid duplicates
      const testCase = {
        id: `test-${Date.now()}`,
        title: 'Test Case',
        description: 'This is a test case created during API testing',
        createdAt: new Date().toISOString(),
        status: 'test'
      };
      
      // Add test case to existing cases
      const casesToSave = [...existingCases, testCase];
      
      // Save cases
      const saveResult = await window.electronAPI.saveCases(casesToSave);
      console.log('saveCases response:', saveResult);
      result.saveCasesSuccess = saveResult === true;
      
      // If save was successful, restore original cases
      if (saveResult === true) {
        console.log('Restoring original cases...');
        await window.electronAPI.saveCases(existingCases);
      }
    } else {
      console.log('Skipping saveCases test because getCases failed');
    }
  } catch (error) {
    console.error('Error testing saveCases:', error);
  }
  
  console.log('Electron API test results:', result);
  return result;
} 