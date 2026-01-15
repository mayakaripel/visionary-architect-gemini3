export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Hazard {
  type: string;
  location: string;
  severity: RiskLevel;
  description: string;
}

export interface Action {
  action: string;
  priority: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
}

export interface Resource {
  resource: string;
  allocation: string;
}

export interface AnalysisResult {
  detected_hazards: Hazard[];
  risk_level: RiskLevel;
  spatial_analysis: string; // Deep reasoning about structural integrity and spatial layout
  recommended_actions: Action[];
  resource_plan: Resource[];
}

export interface MediaInput {
  type: 'image' | 'video';
  mimeType: string;
  data: string; // Base64
}
