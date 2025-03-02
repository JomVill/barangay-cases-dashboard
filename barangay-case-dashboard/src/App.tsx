import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cases from "./pages/Cases";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect } from 'react';
import { CaseProvider } from './context/CaseContext';
import { useCases } from '@/context/CaseContext';
import CaseEdit from "./pages/CaseEdit";
import { migrateFromLocalStorage } from './lib/database-migration';
import { isElectron, testElectronAPI } from './lib/electron-check';
import ElectronTest from './components/ElectronTest';

const queryClient = new QueryClient();

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

const CaseImport = () => {
  const { setCases } = useCases();

  const importCases = (newCases) => {
    setCases(prevCases => [...prevCases, ...newCases]);
  };

  return (
    <div>
      <h2>Import Cases</h2>
      {/* Add your import logic here */}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { cases } = useCases();

  const totalCases = cases.length;
  const pendingCases = cases.filter(caseItem => caseItem.status === 'pending').length;
  const ongoingCases = cases.filter(caseItem => caseItem.status === 'ongoing').length;
  const resolvedCases = cases.filter(caseItem => caseItem.status === 'resolved').length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div>
        <p>Total Cases: {totalCases}</p>
        <p>Pending: {pendingCases}</p>
        <p>Ongoing: {ongoingCases}</p>
        <p>Resolved: {resolvedCases}</p>
      </div>
    </div>
  );
};

// Debug component to show storage type - only shown in development mode
const StorageDebug: React.FC = () => {
  const { storageType, cases } = useCases();
  const [apiStatus, setApiStatus] = useState<{
    isElectron: boolean;
    pingSuccess: boolean;
    getCasesSuccess: boolean;
    saveCasesSuccess: boolean;
  } | null>(null);
  
  const [debugInfo, setDebugInfo] = useState<{
    electronAPIExists: boolean;
    isRunningInElectronExists: boolean;
    electronAPIFunctions: string[];
  }>({
    electronAPIExists: false,
    isRunningInElectronExists: false,
    electronAPIFunctions: []
  });
  
  useEffect(() => {
    // Check API status
    const checkApi = async () => {
      const result = await testElectronAPI();
      setApiStatus(result);
    };
    
    // Check debug info
    const checkDebugInfo = () => {
      const electronAPIExists = typeof window.electronAPI !== 'undefined';
      const isRunningInElectronExists = typeof window.isRunningInElectron !== 'undefined';
      
      const electronAPIFunctions = electronAPIExists 
        ? Object.keys(window.electronAPI).filter(key => typeof window.electronAPI[key] === 'function')
        : [];
      
      setDebugInfo({
        electronAPIExists,
        isRunningInElectronExists,
        electronAPIFunctions
      });
      
      console.log('Debug info:', {
        electronAPIExists,
        isRunningInElectronExists,
        electronAPIFunctions
      });
    };
    
    checkApi();
    checkDebugInfo();
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '8px 12px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Storage: <strong>{storageType}</strong></div>
      <div>Electron: <strong>{isElectron() ? 'Yes' : 'No'}</strong></div>
      <div>Cases: <strong>{cases.length}</strong></div>
      
      <hr style={{ margin: '4px 0' }} />
      <div>Debug Info:</div>
      <div>electronAPI exists: <strong style={{ color: debugInfo.electronAPIExists ? 'green' : 'red' }}>
        {debugInfo.electronAPIExists ? 'Yes' : 'No'}
      </strong></div>
      <div>isRunningInElectron exists: <strong style={{ color: debugInfo.isRunningInElectronExists ? 'green' : 'red' }}>
        {debugInfo.isRunningInElectronExists ? 'Yes' : 'No'}
      </strong></div>
      <div>API functions: <strong>{debugInfo.electronAPIFunctions.join(', ') || 'None'}</strong></div>
      
      {apiStatus && (
        <>
          <hr style={{ margin: '4px 0' }} />
          <div>API Tests:</div>
          <div>Ping: <strong style={{ color: apiStatus.pingSuccess ? 'green' : 'red' }}>
            {apiStatus.pingSuccess ? 'Success' : 'Failed'}
          </strong></div>
          <div>Get Cases: <strong style={{ color: apiStatus.getCasesSuccess ? 'green' : 'red' }}>
            {apiStatus.getCasesSuccess ? 'Success' : 'Failed'}
          </strong></div>
          <div>Save Cases: <strong style={{ color: apiStatus.saveCasesSuccess ? 'green' : 'red' }}>
            {apiStatus.saveCasesSuccess ? 'Success' : 'Failed'}
          </strong></div>
        </>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useCases();
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [showElectronTest, setShowElectronTest] = useState(false);
  
  // Test Electron API and attempt to migrate data
  useEffect(() => {
    const runTests = async () => {
      // First test if Electron API is working
      console.log('Testing Electron API...');
      const apiResult = await testElectronAPI();
      setApiTestResult(apiResult);
      
      // Only attempt migration if API tests passed
      if (apiResult.isElectron && apiResult.pingSuccess && 
          apiResult.getCasesSuccess && apiResult.saveCasesSuccess) {
        console.log('Electron API tests passed, attempting migration...');
        try {
          const migrated = await migrateFromLocalStorage();
          if (migrated) {
            console.log('Successfully migrated data from localStorage to file storage');
          } else {
            console.log('Migration not needed or failed');
          }
        } catch (error) {
          console.error('Error during migration:', error);
        }
      } else {
        console.log('Electron API tests failed, skipping migration');
        if (apiResult.isElectron) {
          console.error('API test results:', apiResult);
        }
      }
    };
    
    runTests();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id/edit" element={<CaseEdit />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Only show debug components in development mode */}
      {isDevelopment && (
        <>
          <StorageDebug />
          {showElectronTest && <ElectronTest />}
          <button 
            onClick={() => setShowElectronTest(!showElectronTest)}
            style={{
              position: 'fixed',
              bottom: '10px',
              left: '10px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 9999
            }}
          >
            {showElectronTest ? 'Hide' : 'Show'} Electron Test
          </button>
        </>
      )}
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CaseProvider>
          <Toaster />
          <Sonner 
            position="top-right" 
            closeButton={true}
            richColors={true}
            expand={true}
          />
          <AppContent />
        </CaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
