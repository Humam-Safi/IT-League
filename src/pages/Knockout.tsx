import React, { useMemo } from "react";
import { motion } from "framer-motion";
import teamsData from "../data/teams.json";
import matchesData from "../data/matches.json";
import { Trophy, Zap } from "lucide-react";

interface Team {
  id: string;
  group: string;
  name: string;
  logo: string;
  goalsScored: number;
  goalsReceived: number;
  points: number;
  matchesPlayed: number;
}

const Knockout: React.FC = () => {
  const standings = useMemo(() => {
    const grouped: Record<string, Team[]> = {};
    const teamsWithStats = teamsData.map((team) => {
      let goalsScored = 0;
      let goalsReceived = 0;
      let points = 0;
      let matchesPlayed = 0;

      matchesData.forEach((match) => {
        if (match.teamA === team.name) {
          matchesPlayed++;
          goalsScored += match.scoreA;
          goalsReceived += match.scoreB;
          if (match.scoreA > match.scoreB) points += 3;
          else if (match.scoreA === match.scoreB) points += 1;
        } else if (match.teamB === team.name) {
          matchesPlayed++;
          goalsScored += match.scoreB;
          goalsReceived += match.scoreA;
          if (match.scoreB > match.scoreA) points += 3;
          else if (match.scoreB === match.scoreA) points += 1;
        }
      });

      return {
        ...team,
        matchesPlayed,
        goalsScored,
        goalsReceived,
        points,
      } as Team;
    });

    teamsWithStats.forEach((team) => {
      if (!grouped[team.group]) grouped[team.group] = [];
      grouped[team.group].push(team);
    });

    const sortedGroups: Record<string, Team[]> = {};
    Object.keys(grouped).forEach((groupName) => {
      sortedGroups[groupName] = grouped[groupName].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const diffA = a.goalsScored - a.goalsReceived;
        const diffB = b.goalsScored - b.goalsReceived;
        if (diffB !== diffA) return diffB - diffA;
        return b.goalsScored - a.goalsScored;
      });
    });

    return sortedGroups;
  }, []);

  const supplementMatches = useMemo(() => {
    const gA = standings["A"] || [];
    const gB = standings["B"] || [];
    const gC = standings["C"] || [];

    return [
      { id: "S1", teamA: gA[2], teamB: gA[3], label: "ملحق المجموعة الأولى" },
      { id: "S2", teamB: gB[2], teamA: gB[3], label: "ملحق المجموعة الثانية" },
      { id: "S3", teamA: gC[1], teamB: gC[2], label: "ملحق المجموعة الثالثة" },
    ];
  }, [standings]);

  const qualifiers = useMemo(() => {
    const gA = standings["A"] || [];
    const gB = standings["B"] || [];
    const gC = standings["C"] || [];

    return {
      auto: [gA[0], gA[1], gB[0], gB[1], gC[0]],
      supplement: [
        { name: "فائز ملحق 1" },
        { name: "فائز ملحق 2" },
        { name: "فائز ملحق 3" },
      ],
    };
  }, [standings]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Supplement Section */}
      <section className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <Zap className="text-blue-500 fill-blue-500/20" />
            الملحق المؤهل
          </h2>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-blue-500"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplementMatches.map((match, idx) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative group overflow-hidden backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-blue-400 text-xs font-bold mb-4 flex justify-between items-center relative z-10">
                <span>{match.label}</span>
                <span className="bg-blue-500/20 px-2 py-0.5 rounded text-[10px]">
                  TBA
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 relative z-10">
                <TeamCard team={match.teamA} />
                <div className="text-2xl font-black text-slate-700 italic">
                  VS
                </div>
                <TeamCard team={match.teamB} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Knockout Bracket Section */}
      <section className="overflow-x-auto pb-10 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-500"></div>
          <h2 className="text-4xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <Trophy className="text-yellow-500 fill-yellow-500/20" />
            الأدوار الإقصائية
          </h2>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-500"></div>
        </motion.div>

        {/* 5-Column Grid Bracket */}
        <div className="min-w-[1200px] grid grid-cols-5 items-center gap-4 px-4">
          {/* Column 1: Left QFs */}
          <div className="flex flex-col gap-32">
            <BracketMatch
              team1={qualifiers.auto[0]}
              team2={{ name: "فائز ملحق 1" }}
              label="QF1"
            />
            <BracketMatch
              team1={qualifiers.auto[1]}
              team2={qualifiers.auto[4]}
              label="QF2"
            />
          </div>

          {/* Column 2: SF1 Connection */}
          <div className="flex flex-col items-center relative h-full justify-center">
            {/* Connection Lines from Left */}
            <div className="absolute left-0 top-1/4 h-1/2 w-full border-y-2 border-r-2 border-white/10 rounded-r-3xl -translate-x-1/2 scale-x-50"></div>
            <div className="absolute left-full top-1/2 w-10 h-px bg-white/10 -translate-x-full"></div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/80 p-4 rounded-2xl border border-blue-500/20 shadow-2xl backdrop-blur-md w-48 relative z-10"
            >
              <div className="text-center text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">
                Semi Final 1
              </div>
              <div className="flex flex-col gap-3">
                <PlaceholderMatchTeam />
                <PlaceholderMatchTeam />
              </div>
            </motion.div>
          </div>

          {/* Column 3: The Final / Trophy */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-yellow-500/5 blur-[120px] rounded-full"></div>
            <motion.div
              animate={{
                rotateY: [0, 15, 0, -15, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Trophy
                size={140}
                className="text-yellow-500 drop-shadow-[0_0_40px_rgba(234,179,8,0.5)]"
              />
            </motion.div>
            <div className="mt-8 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-10 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-yellow-500/20 relative z-10">
              The Final
            </div>
          </div>

          {/* Column 4: SF2 Connection */}
          <div className="flex flex-col items-center relative h-full justify-center">
            {/* Connection Lines from Right */}
            <div className="absolute right-0 top-1/4 h-1/2 w-full border-y-2 border-l-2 border-white/10 rounded-l-3xl translate-x-1/2 scale-x-50"></div>
            <div className="absolute right-full top-1/2 w-10 h-px bg-white/10 translate-x-full"></div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/80 p-4 rounded-2xl border border-blue-500/20 shadow-2xl backdrop-blur-md w-48 relative z-10"
            >
              <div className="text-center text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">
                Semi Final 2
              </div>
              <div className="flex flex-col gap-3">
                <PlaceholderMatchTeam />
                <PlaceholderMatchTeam />
              </div>
            </motion.div>
          </div>

          {/* Column 5: Right QFs */}
          <div className="flex flex-col gap-32">
            <BracketMatch
              team1={qualifiers.auto[2]}
              team2={{ name: "فائز ملحق 2" }}
              label="QF3"
            />
            <BracketMatch
              team1={qualifiers.auto[3]}
              team2={{ name: "فائز ملحق 3" }}
              label="QF4"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const TeamCard = ({ team }: { team: any }) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <img
      src={team?.logo}
      alt=""
      className="w-16 h-16 rounded-xl shadow-lg ring-1 ring-white/10 bg-slate-800 object-cover"
    />
    <span className="text-white font-bold text-sm text-center line-clamp-1">
      {team?.name || "TBD"}
    </span>
  </div>
);

const PlaceholderMatchTeam = () => (
  <div className="flex items-center gap-3 w-full h-10 px-3 bg-white/5 rounded-lg border border-white/5 opacity-30">
    <div className="w-6 h-6 bg-slate-700 rounded-md"></div>
    <div className="h-2 w-20 bg-slate-700 rounded"></div>
  </div>
);

const BracketMatch = ({
  team1,
  team2,
  label,
}: {
  team1: any;
  team2: any;
  label: string;
}) => (
  <div className="flex items-center justify-center">
    <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md w-56 group hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
      </div>
      <div className="flex flex-col gap-2">
        <MatchTeam team={team1} />
        <MatchTeam team={team2} />
      </div>
    </div>
  </div>
);

const MatchTeam = ({ team }: { team: any }) => (
  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="w-7 h-7 flex-shrink-0 bg-slate-900 rounded-md ring-1 ring-white/10 overflow-hidden">
        {team?.logo ? (
          <img src={team.logo} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-bold">
            ?
          </div>
        )}
      </div>
      <span className="text-sm font-bold text-white truncate">
        {team?.name || "TBD"}
      </span>
    </div>
    <span className="text-sm font-black text-blue-400">-</span>
  </div>
);

export default Knockout;
