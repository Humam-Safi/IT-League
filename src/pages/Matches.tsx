import React, { useState } from "react";
import { motion } from "framer-motion";
import matchesDataRaw from "../data/matches.json";
import nextMatchesDataRaw from "../data/next_matches.json";
import teamsData from "../data/teams.json"; // Need logos/names
import { Calendar, Trophy, Clock } from "lucide-react";

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  time?: string;
  scoreA?: number;
  scoreB?: number;
  scorersA?: string[];
  scorersB?: string[];
}

const matchesData = matchesDataRaw as Match[];
const nextMatchesData = nextMatchesDataRaw as Match[];

// Helper to get team info by name or id - the matches.json uses names like "Venom"
const getTeam = (teamName: string) => {
  return (
    teamsData.find((t) => t.name === teamName) ||
    teamsData.find((t) => t.id === teamName)
  );
};

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"results" | "fixtures">("results");

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Tabs */}
      <div className="flex gap-5 p-1 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm self-center justify-center mx-auto w-fit">
        <button
          onClick={() => setActiveTab("fixtures")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "fixtures"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calendar size={16} />
          مباريات قادمة
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "results"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Trophy size={16} />
          النتائج
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "results" ? (
          <>
            {Array.isArray(matchesData) &&
              [...matchesData]
                .reverse()
                .filter((m) => m && typeof m === "object" && m.id)
                .map((match) => <MatchCard key={match.id} match={match} />)}
            {(!Array.isArray(matchesData) || matchesData.length === 0) && (
              <div className="text-center text-slate-500 py-10">
                No matches found.
              </div>
            )}
          </>
        ) : (
          <>
            {Array.isArray(nextMatchesData) &&
              nextMatchesData
                .filter((m) => m && typeof m === "object" && m.id)
                .map((match) => <NextMatchCard key={match.id} match={match} />)}
            {(!Array.isArray(nextMatchesData) ||
              nextMatchesData.filter((m) => m && typeof m === "object" && m.id)
                .length === 0) && (
              <div className="text-center text-slate-500 py-10">
                No upcoming matches scheduled.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NextMatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Date Header */}
      <div className="bg-slate-900/50 px-4 py-2 flex items-center justify-center gap-2 text-xs text-blue-300 font-mono tracking-wider uppercase border-b border-white/5">
        <Calendar size={14} />
        {match.date} <span className="text-slate-600">|</span>{" "}
        <Clock size={14} /> {match.time}
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-row items-center justify-between gap-1 md:gap-12">
          {/* Team A */}
          <div className="flex flex-col items-center flex-1 order-1">
            <img
              src={teamA?.logo || "/placeholder.png"}
              alt={match.teamA}
              className="w-12 h-12 md:w-24 md:h-24 object-contain drop-shadow-lg mb-2"
            />
            <h3 className="text-sm md:text-2xl font-bold text-white text-center leading-tight">
              {match.teamA}
            </h3>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center order-2 md:order-2 shrink-0">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-sm md:text-xl font-black text-slate-400 border border-white/10">
              VS
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center flex-1 order-3">
            <img
              src={teamB?.logo || "/placeholder.png"}
              alt={match.teamB}
              className="w-12 h-12 md:w-24 md:h-24 object-contain drop-shadow-lg mb-2"
            />
            <h3 className="text-sm md:text-2xl font-bold text-white text-center leading-tight">
              {match.teamB}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Date Header */}
      <div className="bg-slate-900/50 px-4 py-2 flex items-center justify-center gap-2 text-xs text-blue-300 font-mono tracking-wider uppercase border-b border-white/5">
        <Calendar size={14} />
        {match.date}
      </div>

      <div className="p-3 md:p-6">
        <div className="flex flex-row items-start justify-between gap-1 md:gap-12">
          {/* Team A */}
          <div className="flex flex-col items-center flex-1 order-1">
            <img
              src={teamA?.logo || "/placeholder.png"}
              alt={match.teamA}
              className="w-10 h-10 md:w-24 md:h-24 object-contain drop-shadow-lg mb-2"
            />
            <h3 className="text-xs md:text-2xl font-bold text-white text-center leading-tight">
              {match.teamA}
            </h3>

            {/* Scorers A */}
            <div className="mt-2 md:mt-4 space-y-1 text-center">
              {match.scorersA?.map((scorer: string, i: number) => (
                <div
                  key={i}
                  className="text-[10px] md:text-sm text-emerald-400 font-medium flex items-center gap-1 justify-center"
                >
                  ⚽ {scorer}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center order-2 md:order-2 shrink-0 pt-2">
            <div className="text-3xl md:text-7xl font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              {match.scoreA} : {match.scoreB}
            </div>
            <div className="mt-1 md:mt-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-blue-500/30">
              FT
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center flex-1 order-3">
            <img
              src={teamB?.logo || "/placeholder.png"}
              alt={match.teamB}
              className="w-10 h-10 md:w-24 md:h-24 object-contain drop-shadow-lg mb-2"
            />
            <h3 className="text-xs md:text-2xl font-bold text-white text-center leading-tight">
              {match.teamB}
            </h3>

            {/* Scorers B */}
            <div className="mt-2 md:mt-4 space-y-1 text-center">
              {match.scorersB?.map((scorer: string, i: number) => (
                <div
                  key={i}
                  className="text-[10px] md:text-sm text-emerald-400 font-medium flex items-center gap-1 justify-center"
                >
                  ⚽ {scorer}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Matches;
