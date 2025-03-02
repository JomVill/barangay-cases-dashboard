import React, { createContext, useContext, useState, useEffect } from 'react';
import { Case } from '@/lib/sample-data';

interface CaseContextType {
  cases: Case[];
  setCases: React.Dispatch<React.SetStateAction<Case[]>>;
  isLoading: boolean;
  storageType: 'file' | 'localStorage';
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

// Check if we're running in Electron with a more robust check
const isElectron = () => {
  // First check if the isRunningInElectron flag is set
  if (window.isRunningInElectron === true) {
    console.log('isRunningInElectron flag is true');
    return true;
  }
  
  // Check for process.versions.electron
  if (window.process && window.process.versions && window.process.versions.electron) {
    console.log('process.versions.electron is defined:', window.process.versions.electron);
    return true;
  }
  
  // Check for the VITE_ELECTRON environment variable
  if (process.env.VITE_ELECTRON) {
    console.log('VITE_ELECTRON environment variable is set');
    return true;
  }
  
  // Fallback check: Check if window.electronAPI exists and has the expected methods
  const hasAPI = window.electronAPI && 
         typeof window.electronAPI.getCases === 'function' && 
         typeof window.electronAPI.saveCases === 'function' &&
         typeof window.electronAPI.ping === 'function';
  
  console.log('Electron API check result:', hasAPI);
  return hasAPI;
};

export const CaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageType, setStorageType] = useState<'file' | 'localStorage'>('localStorage');

  // Load cases on initial render
  useEffect(() => {
    const loadCases = async () => {
      try {
        setIsLoading(true);
        
        const electronAvailable = isElectron();
        console.log('Electron API available:', electronAvailable);
        
        if (electronAvailable) {
          // Load from file system if running in Electron
          console.log('Attempting to load cases from file system...');
          try {
            const loadedCases = await window.electronAPI.getCases();
            console.log('Cases loaded from file system:', loadedCases.length);
            setCases(loadedCases);
            setStorageType('file');
            return;
          } catch (fileError) {
            console.error('Error loading from file system:', fileError);
            // Will fall back to localStorage below
          }
        }
        
        // Fallback to localStorage
        console.log('Loading cases from localStorage...');
        const savedCases = localStorage.getItem('barangayCases');
        if (savedCases) {
          const parsedCases = JSON.parse(savedCases);
          console.log('Cases loaded from localStorage:', parsedCases.length);
          setCases(parsedCases);
        } else {
          console.log('No cases found in localStorage');
          setCases([]);
        }
        setStorageType('localStorage');
      } catch (error) {
        console.error('Error loading cases:', error);
        // Final fallback
        const savedCases = localStorage.getItem('barangayCases');
        setCases(savedCases ? JSON.parse(savedCases) : []);
        setStorageType('localStorage');
      } finally {
        setIsLoading(false);
      }
    };

    loadCases();
  }, []);

  // Save cases whenever they change
  useEffect(() => {
    // Skip saving on initial load when cases are empty
    if (isLoading) return;
    
    const saveCases = async () => {
      try {
        const electronAvailable = isElectron();
        
        if (electronAvailable) {
          // Save to file system if running in Electron
          console.log('Saving cases to file system:', cases.length);
          try {
            const success = await window.electronAPI.saveCases(cases);
            console.log('Save to file system result:', success);
            if (success) {
              setStorageType('file');
            }
          } catch (fileError) {
            console.error('Error saving to file system:', fileError);
            // Will fall back to localStorage below
          }
        }
        
        // Always save to localStorage as a backup
        console.log('Saving cases to localStorage:', cases.length);
        localStorage.setItem('barangayCases', JSON.stringify(cases));
      } catch (error) {
        console.error('Error saving cases:', error);
        // Always try to save to localStorage as a fallback
        localStorage.setItem('barangayCases', JSON.stringify(cases));
      }
    };

    saveCases();
  }, [cases, isLoading]);

  return (
    <CaseContext.Provider value={{ cases, setCases, isLoading, storageType }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}; 