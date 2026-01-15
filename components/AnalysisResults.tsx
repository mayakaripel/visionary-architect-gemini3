import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { AlertTriangle, Map, Truck, ShieldAlert, CheckCircle, BrainCircuit, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisResultsProps {
  data: AnalysisResult;
}

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const colors = {
    [RiskLevel.CRITICAL]: 'bg-red-500/20 text-red-400 border-red-500/50',
    [RiskLevel.HIGH]: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    [RiskLevel.MEDIUM]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    [RiskLevel.LOW]: 'bg-green-500/20 text-green-400 border-green-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${colors[level]}`}>
      {level}
    </span>
  );
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  // Calculate a pseudo-score for visualization based on risk level
  const getScore = (level: RiskLevel) => {
    switch(level) {
      case RiskLevel.LOW: return 95;
      case RiskLevel.MEDIUM: return 70;
      case RiskLevel.HIGH: return 40;
      case RiskLevel.CRITICAL: return 10;
      default: return 50;
    }
  };
  
  const score = getScore(data.risk_level);
  
  const safetyData = [
    { name: 'Risk', value: 100 - score },
    { name: 'Safety', value: score },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spatial Analysis Text */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Spatial & Structural Analysis
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light text-sm md:text-base whitespace-pre-wrap">
            {data.spatial_analysis}
          </p>
        </div>

        {/* Risk Score Widget */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 text-sm font-mono text-zinc-400 uppercase">Risk Assessment</h3>
          <div className="h-40 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safetyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#22c55e" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pt-8">
             <span className={`text-2xl font-bold font-mono ${data.risk_level === 'CRITICAL' ? 'text-red-500' : data.risk_level === 'HIGH' ? 'text-orange-500' : 'text-zinc-200'}`}>
               {data.risk_level}
             </span>
             <span className="text-xs text-zinc-500">LEVEL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Hazards */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Detected Hazards
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
             {data.detected_hazards.map((hazard, idx) => (
               <div key={idx} className="bg-zinc-950/50 p-4 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-zinc-200 font-bold text-sm">{hazard.type}</span>
                   </div>
                   <RiskBadge level={hazard.severity} />
                 </div>
                 <div className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wide">
                   {hazard.location}
                 </div>
                 <p className="text-sm text-zinc-400">
                   {hazard.description}
                 </p>
               </div>
             ))}
             {data.detected_hazards.length === 0 && (
                 <div className="text-zinc-500 text-sm italic py-4">No specific hazards detected.</div>
             )}
          </div>
        </div>

        {/* Action Plan & Resources */}
        <div className="space-y-6">
          
          {/* Recommended Actions */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Recommended Actions
             </h3>
             <div className="space-y-3">
                {data.recommended_actions.map((action, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-zinc-950 p-3 rounded border border-zinc-800">
                     <div className={`
                        w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0
                        ${action.priority === 'IMMEDIATE' ? 'bg-red-500 text-white' : 
                          action.priority === 'SHORT_TERM' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}
                     `}>
                       {action.priority.charAt(0)}
                     </div>
                     <div className="text-sm text-zinc-300 flex-1">{action.action}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Resource Plan */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Resource Allocation Plan
             </h3>
             <div className="overflow-hidden rounded border border-zinc-800">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-950 text-zinc-500 font-mono text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 font-normal">Resource</th>
                      <th className="px-4 py-3 font-normal">Allocation / Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                    {data.resource_plan.map((res, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3 text-zinc-200 font-medium">{res.resource}</td>
                        <td className="px-4 py-3 text-zinc-400">{res.allocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
