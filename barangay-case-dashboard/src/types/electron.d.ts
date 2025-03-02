import { Case } from '@/lib/sample-data';

declare global {
  interface Window {
    electronAPI: {
      getCases: () => Promise<Case[]>;
      saveCases: (cases: Case[]) => Promise<boolean>;
      ping: () => Promise<string>;
      testPing: () => Promise<string>;
    };
    isRunningInElectron?: boolean;
    process?: {
      versions: {
        node: string;
        chrome: string;
        electron: string;
      }
    };
  }
} 