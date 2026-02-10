export interface DiagnosticItem {
  original: string;
  violation: string; // e.g., "Syntactic: Rhythm Consistency"
  diagnosis: string;
}

export interface RewriteSection {
  original: string;
  rewritten: string;
  strategy: string; // e.g., "POV Injection"
}

export interface AnalysisResult {
  score: number; // 0-100, where 100 is heavy AI
  coreIssue: string;
  diagnostics: DiagnosticItem[];
  rewrites: RewriteSection[];
  fullRewrittenText: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}