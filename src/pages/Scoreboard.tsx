import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import { Trophy, Shield, Swords } from 'lucide-react';

// Define the Team interface based on the JSON structure
interface Team {
  id: string;
  group: string;
  name: string;
  logo: string;
  goalsScored: number;
  goalsReceived: number;
  points: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
  players: any[];
}

// Group interface
interface Group {
  name: string;
  teams: Team[];
}

const Scoreboard: React.FC = () => {
  // Process the data: Group by 'group' and Sort
  const groups = useMemo(() => {
    const grouped: Record<string, Team[]> = {};
    
    teamsData.forEach((team) => {
      // @ts-ignore
      const typedTeam: Team = {
        ...team,
        // Ensure defaults if fields are missing in JSON during partial updates
        matchesPlayed: team.matchesPlayed || 0,
        yellowCards: team.yellowCards || 0,
        redCards: team.redCards || 0,
        players: team.players || []
      };

      if (!grouped[typedTeam.group]) {
        grouped[typedTeam.group] = [];
      }
      grouped[typedTeam.group].push(typedTeam);
    });

    // Sort teams and format as array of Groups
    return Object.keys(grouped).sort().map((groupName) => {
      const teams = grouped[groupName].sort((a, b) => {
        // 1. Sort by Points (descending)
        if (b.points !== a.points) return b.points - a.points;
        
        // 2. Direct Matches (Skipping...)

        // 3. Goal Difference (descending)
        const diffA = a.goalsScored - a.goalsReceived;
        const diffB = b.goalsScored - b.goalsReceived;
        if (diffB !== diffA) return diffB - diffA;

        // 4. Clean Play (Ascending - fewer cards is better)
        const cardsA = a.yellowCards + a.redCards;
        const cardsB = b.yellowCards + b.redCards;
        return cardsA - cardsB;
      });

      return {
        name: groupName,
        teams: teams,
      };
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {groups.map((group, index) => (
          <GroupTable key={group.name} group={group} index={index} />
        ))}
      </main>
    </div>
  );
};

const GroupTable: React.FC<{ group: Group; index: number }> = ({ group, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex flex-col h-full"
    >
      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full hover:shadow-blue-500/10 transition-shadow duration-300 ring-1 ring-white/5">
        
        {/* Header - Updated to Blue Theme */}
        <div className="bg-gradient-to-r from-blue-600/30 to-slate-900/50 p-6 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 pattern-grid-lg opacity-20"></div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 relative z-10">
            <span className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ring-1 ring-white/20">
              {group.name}
            </span>
            <span className="tracking-tight text-blue-50">Group {group.name}</span>
          </h2>
          <Trophy className="w-6 h-6 text-yellow-500 relative z-10 drop-shadow-glow" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 text-xs font-bold text-blue-200/60 uppercase tracking-widest border-b border-white/5 bg-slate-900/40 text-center">
          <div className="col-span-1">#</div>
          <div className="col-span-4 text-left pl-2">Team</div>
          <div className="col-span-1" title="Played">P</div>
          <div className="col-span-1" title="Goals Scored">+</div>
          <div className="col-span-1" title="Goals Received">-</div>
          <div className="col-span-2" title="Goal Difference">=</div>
          <div className="col-span-2" title="Points">Pts</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-auto">
          {group.teams.map((team, idx) => {
            const diff = team.goalsScored - team.goalsReceived;
            const diffColor = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-rose-400" : "text-slate-400";
            
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`grid grid-cols-12 gap-2 p-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-200 group text-center ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}`}
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-500/30' : idx === 1 ? 'bg-slate-400 text-slate-900' : idx === 2 ? 'bg-orange-700 text-white' : 'text-slate-600'}`}>
                    {idx + 1}
                  </span>
                </div>

                {/* Team Info */}
                <div className="col-span-4 flex items-center gap-3 pl-2 text-left">
                  <div className="relative">
                    <Link to={`/team/${team.id}`}>
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-9 h-9 rounded-lg bg-slate-800 object-cover ring-2 ring-white/10 group-hover:ring-white/30 transition-all shadow-md hover:scale-110"
                        onError={(e) => {
                           (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=random`;
                        }}
                      />
                    </Link>
                  </div>
                  <Link to={`/team/${team.id}`} className="font-semibold text-sm md:text-base text-slate-100 truncate tracking-wide hover:text-blue-400 transition-colors">
                    {team.name}
                  </Link>
                </div>

                {/* Stats */}
                <div className="col-span-1 font-medium text-slate-400">
                  {team.matchesPlayed}
                </div>
                <div className="col-span-1 font-medium text-slate-300 flex items-center justify-center gap-1">
                  <span className="hidden group-hover:inline opacity-50 text-[10px]"><Swords size={10}/></span>
                  {team.goalsScored}
                </div>
                <div className="col-span-1 font-medium text-slate-300 flex items-center justify-center gap-1">
                   <span className="hidden group-hover:inline opacity-50 text-[10px]"><Shield size={10}/></span>
                   {team.goalsReceived}
                </div>
                <div className={`col-span-2 font-bold font-mono ${diffColor}`}>
                  {diff > 0 ? `+${diff}` : diff}
                </div>
                <div className="col-span-2 font-black text-lg text-white drop-shadow-md">
                   {team.points}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Scoreboard;
