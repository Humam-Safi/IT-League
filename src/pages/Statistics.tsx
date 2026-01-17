import React, { useMemo } from "react";
import teamsData from "../data/teams.json";
import matchesData from "../data/matches.json";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const Statistics: React.FC = () => {
  const topScorers = useMemo(() => {
    const playerStats: Record<
      string,
      { name: string; goals: number; team: string; teamLogo: string }
    > = {};

    // First, map players to their teams for easy lookup
    const playerToTeam: Record<string, { team: string; logo: string }> = {};
    teamsData.forEach((team) => {
      team.players?.forEach((p: any) => {
        playerToTeam[p.name] = { team: team.name, logo: team.logo };
      });
    });

    matchesData.forEach((match) => {
      // @ts-ignore
      [...match.scorersA, ...match.scorersB].forEach((scorerStr) => {
        const m = scorerStr.match(/^(.+?)(?:\s*\((\d+)\))?$/);
        if (m) {
          const name = m[1].trim();
          const goals = m[2] ? parseInt(m[2]) : 1;
          const teamInfo = playerToTeam[name];
          if (teamInfo) {
            if (!playerStats[name]) {
              playerStats[name] = {
                name,
                goals: 0,
                team: teamInfo.team,
                teamLogo: teamInfo.logo,
              };
            }
            playerStats[name].goals += goals;
          }
        }
      });
    });

    return Object.values(playerStats).sort((a, b) => b.goals - a.goals);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Top Scorers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <TrendingUp className="text-emerald-400" /> Top Scorers
        </h2>

        <div className="space-y-4">
          {topScorers.length === 0 ? (
            <div className="text-slate-400">No goals recorded yet.</div>
          ) : (
            topScorers.map((player: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${i === 0 ? "bg-yellow-500 text-black" : "bg-slate-700 text-slate-300"}`}
                >
                  {i + 1}
                </div>
                <img
                  src={player.teamLogo}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="text-xs text-slate-400">{player.team}</div>
                </div>
                <div className="font-mono text-xl text-emerald-400 font-bold">
                  {player.goals}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
