import React, { useState, useEffect } from 'react';

const ElectronTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    isElectron: boolean;
    electronAPIExists: boolean;
    isRunningInElectronExists: boolean;
    processVersionsExists: boolean;
    pingResult: string | null;
    testPingResult: string | null;
    getCasesResult: string | null;
    saveCasesResult: string | null;
  }>({
    isElectron: false,
    electronAPIExists: false,
    isRunningInElectronExists: false,
    processVersionsExists: false,
    pingResult: null,
    testPingResult: null,
    getCasesResult: null,
    saveCasesResult: null
  });

  useEffect(() => {
    const runTests = async () => {
      // Check if we're running in Electron
      const electronAPIExists = typeof window.electronAPI !== 'undefined';
      const isRunningInElectronExists = typeof window.isRunningInElectron !== 'undefined';
      const processVersionsExists = window.process && window.process.versions && window.process.versions.electron;
      
      const isElectron = electronAPIExists || isRunningInElectronExists || processVersionsExists;
      
      let pingResult = null;
      let testPingResult = null;
      let getCasesResult = null;
      let saveCasesResult = null;
      
      if (electronAPIExists) {
        try {
          // Test ping
          pingResult = await window.electronAPI.ping();
          
          // Test testPing
          if (typeof window.electronAPI.testPing === 'function') {
            testPingResult = await window.electronAPI.testPing();
          }
          
          // Test getCases
          const cases = await window.electronAPI.getCases();
          getCasesResult = `Got ${cases.length} cases`;
          
          // Test saveCases with a dummy case
          const dummyCase = {
            id: 'test-case',
            title: 'Test Case',
            description: 'This is a test case',
            type: 'other',
            status: 'pending',
            complainant: 'Test Complainant',
            respondent: 'Test Respondent',
            filedDate: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
            tags: ['test']
          };
          
          const saveResult = await window.electronAPI.saveCases([...cases, dummyCase]);
          saveCasesResult = saveResult ? 'Success' : 'Failed';
          
          // Remove the dummy case
          await window.electronAPI.saveCases(cases);
        } catch (error) {
          console.error('Error testing Electron API:', error);
        }
      }
      
      setTestResults({
        isElectron,
        electronAPIExists,
        isRunningInElectronExists,
        processVersionsExists,
        pingResult,
        testPingResult,
        getCasesResult,
        saveCasesResult
      });
    };
    
    runTests();
  }, []);

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Electron API Test</h2>
      <div>
        <p>Is Electron: <strong>{testResults.isElectron ? 'Yes' : 'No'}</strong></p>
        <p>electronAPI exists: <strong>{testResults.electronAPIExists ? 'Yes' : 'No'}</strong></p>
        <p>isRunningInElectron exists: <strong>{testResults.isRunningInElectronExists ? 'Yes' : 'No'}</strong></p>
        <p>process.versions.electron exists: <strong>{testResults.processVersionsExists ? 'Yes' : 'No'}</strong></p>
        <p>Ping result: <strong>{testResults.pingResult || 'Not tested'}</strong></p>
        <p>Test Ping result: <strong>{testResults.testPingResult || 'Not tested'}</strong></p>
        <p>GetCases result: <strong>{testResults.getCasesResult || 'Not tested'}</strong></p>
        <p>SaveCases result: <strong>{testResults.saveCasesResult || 'Not tested'}</strong></p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Run Tests Again
      </button>
    </div>
  );
};

export default ElectronTest; 