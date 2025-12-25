import React, { useMemo } from 'react';
import teamsData from '../data/teams.json';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const Statistics: React.FC = () => {
  const topScorers = useMemo(() => {
    const players: any[] = [];
    teamsData.forEach(team => {
      // @ts-ignore
      team.players?.forEach(p => {
        if (p.goals > 0) players.push({ ...p, team: team.name, teamLogo: team.logo });
      });
    });
    return players.sort((a, b) => b.goals - a.goals);
  }, []);

  const topCards = useMemo(() => {
    const players: any[] = [];
    teamsData.forEach(team => {
      // @ts-ignore
      team.players?.forEach(p => {
        const totalCards = (p.yellowCards || 0) + (p.redCards || 0);
        if (totalCards > 0) players.push({ ...p, totalCards, team: team.name, teamLogo: team.logo });
      });
    });
    return players.sort((a, b) => b.totalCards - a.totalCards);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Top Scorers */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <TrendingUp className="text-emerald-400" /> Top Scorers
        </h2>
        
        <div className="space-y-4">
          {topScorers.length === 0 ? <div className="text-slate-400">No goals recorded yet.</div> : topScorers.map((player, i) => (
             <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${i===0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>{i+1}</div>
                <img src={player.teamLogo} className="w-10 h-10 object-contain" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="text-xs text-slate-400">{player.team}</div>
                </div>
                <div className="font-mono text-xl text-emerald-400 font-bold">{player.goals}</div>
             </div>
          ))}
        </div>
      </motion.div>

      {/* Fair Play / Cards */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <AlertTriangle className="text-rose-400" /> Top Cards
        </h2>
        
        <div className="space-y-4">
          {topCards.length === 0 ? <div className="text-slate-400">No cards recorded yet.</div> : topCards.map((player, i) => (
             <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold bg-slate-700 text-slate-300`}>{i+1}</div>
                <img src={player.teamLogo} className="w-10 h-10 object-contain" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="text-xs text-slate-400">{player.team}</div>
                </div>
                <div className="flex items-center gap-3">
                   {player.yellowCards > 0 && <div className="flex items-center gap-1 text-yellow-400"><div className="w-3 h-4 bg-yellow-400 rounded-sm"></div> {player.yellowCards}</div>}
                   {player.redCards > 0 && <div className="flex items-center gap-1 text-red-500"><div className="w-3 h-4 bg-red-500 rounded-sm"></div> {player.redCards}</div>}
                </div>
             </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
