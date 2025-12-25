import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Scoreboard from './pages/Scoreboard';
import Matches from './pages/Matches';
import Statistics from './pages/Statistics';
import TeamDetails from './pages/TeamDetails';
import { motion } from 'framer-motion';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen pb-20 p-5">
        
        {/* Mobile-friendly Header with Logo */}
         <header className=" relative z-10 flex flex-col md:flex-row items-center justify-between px-10 mx-auto gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-2 drop-shadow-lg">
              IT College League
            </h1>
            <p className="text-blue-400 text-base md:text-xl font-medium tracking-wide">
              Faculty of Informatics Engineering
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="IT Faculty Logo" 
              className="w-50 h-50 md:w-50 md:h-50 object-contain"
            />
          </motion.div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 px-4">
          <div className="flex bg-slate-800/50 backdrop-blur-md p-1 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto max-w-full gap-4">
            <TabLink to="/" label="الترتيب" />
            <TabLink to="/matches" label="المباريات" />
            <TabLink to="/stats" label="الإحصائيات" />
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Scoreboard />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/team/:id" element={<TeamDetails />} />
        </Routes>

        <footer className="mt-16 text-center text-slate-500 text-lg border-t border-white/5 pt-8">
          <p className="flex flex-col gap-1">
            <span>© {new Date().getFullYear()} IT College League. Make By <a href="https://humam-safi.vercel.app/" className='underline'>Humam Safi</a></span>
          </p>
        </footer>
      </div>
    </Router>
  );
}

const TabLink = ({ to, label }: { to: string, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      px-6 py-2.5 rounded-xl text-base md:text-lg font-bold transition-all duration-300 relative whitespace-nowrap
      ${isActive ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}
    `}
  >
    {label}
  </NavLink>
);

export default App;
