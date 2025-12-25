import React from 'react';
import { useParams, Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import { motion } from 'framer-motion';
import { ChevronLeft, User } from 'lucide-react';

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Find by ID or Name usually
  const team = teamsData.find(t => t.id === id || t.name === id); // id param could be name if we link by name, but id is stricter

  if (!team) return <div className="text-white text-center py-20">Team not found</div>;

  // @ts-ignore
  const players = team.players || [];
  const topScorer = [...players].sort((a,b) => b.goals - a.goals)[0];
  const mostCards = [...players].sort((a,b) => (b.yellowCards + b.redCards) - (a.yellowCards + a.redCards))[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors font-medium">
        <ChevronLeft size={20}/> Back to League
      </Link>

      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-8 flex flex-col items-center relative gap-4">
         <div className="absolute inset-0 bg-blue-600/5 pattern-grid-lg opacity-30"></div>
         <img src={team.logo} className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl relative z-10" />
         <h1 className="text-4xl md:text-5xl font-black text-white relative z-10">{team.name}</h1>
         <div className="text-slate-400 text-lg relative z-10">Group {team.group}</div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8 relative z-10">
            <StatBox label="Rank Pts" value={team.points} />
            <StatBox label="Goals Scored" value={team.goalsScored} />
            <StatBox label="Goals Rec." value={team.goalsReceived} />
            <StatBox label="Played" value={team.matchesPlayed} />
         </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Performer</h3>
             {topScorer && topScorer.goals > 0 ? (
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400"><User /></div>
                  <div>
                     <div className="font-bold text-white text-lg">{topScorer.name}</div>
                     <div className="text-slate-400">{topScorer.goals} Goals</div>
                  </div>
               </div>
             ) : (
                <div className="text-slate-500">No goals yet</div>
             )}
         </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Most Cards</h3>
             {mostCards && (mostCards.yellowCards > 0 || mostCards.redCards > 0) ? (
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400"><User /></div>
                  <div>
                     <div className="font-bold text-white text-lg">{mostCards.name}</div>
                     <div className="text-slate-400 flex gap-2">
                        {mostCards.yellowCards > 0 && <span>{mostCards.yellowCards} 🟨</span>}
                        {mostCards.redCards > 0 && <span>{mostCards.redCards} 🟥</span>}
                     </div>
                  </div>
               </div>
             ) : (
                <div className="text-slate-500">Clean record</div>
             )}
         </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Squad List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {players.map((p, i) => (
             <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">{i+1}</div>
                   <div className="font-medium text-slate-200">{p.name}</div>
                </div>
                <div className="flex gap-4 text-sm font-mono text-slate-400">
                   <div>Go: <span className="text-white">{p.goals}</span></div>
                   <div>Y: <span className="text-yellow-400">{p.yellowCards}</span></div>
                   <div>R: <span className="text-red-400">{p.redCards}</span></div>
                </div>
             </div>
           ))}
           {players.length === 0 && <div className="text-slate-500">No players listed</div>}
        </div>
      </div>

    </motion.div>
  );
};

const StatBox = ({ label, value }: { label: string, value: any }) => (
  <div className="bg-white/5 rounded-xl p-4 text-center">
    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

export default TeamDetails;
