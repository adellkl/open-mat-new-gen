import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, ShieldAlert, ShieldCheck, Activity, Terminal as TerminalIcon, Plus } from 'lucide-react';
import { db } from '../../database/db';
import { auth } from '../../database/auth';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAuth, setIsAuth] = useState(auth.isAuthenticated());

  // S'assurer que la page s'affiche correctement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const passwordHash = auth.hashPassword(password);
      const result = await db.verifyAdmin(username, passwordHash);
      
      if (result.success && result.admin) {
        auth.login(result.admin);
        setIsAuth(true);
      } else {
        setError('Accès refusé. Identifiants incorrects.');
      }
    } catch (err) {
      setError('Erreur de connexion à la base de données.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuth) return <Navigate to="/admin/dashboard" />;

  return (
    <div className="relative bg-black w-full h-screen flex items-center justify-center px-6 overflow-hidden" style={{ height: '100vh', display: 'flex' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40"></div>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Technical Panel Left */}
      <div className="hidden xl:flex flex-col absolute top-0 left-0 h-full w-64 border-r border-white/5 bg-black/40 backdrop-blur-sm z-20 p-6 pt-32">
        <div className="space-y-8">
          <div>
            <p className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase mb-4 flex items-center gap-2">
              <Activity className="h-3 w-3" /> System Status
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-[7px] font-bold text-white/10 uppercase">Auth_0{i}</span>
                  <div className="h-[1px] flex-grow mx-3 bg-white/5"></div>
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-tighter">Ready</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase mb-4 flex items-center gap-2">
              <TerminalIcon className="h-3 w-3" /> Security Logs
            </p>
            <div className="bg-white/[0.02] p-3 font-mono text-[6px] text-white/20 leading-relaxed border border-white/5">
              {'>'} WAITING_FOR_CREDENTIALS...<br />
              {'>'} ENCRYPTION_PROTOCOL: ON<br />
              {'>'} SECURE_TUNNEL: ESTABLISHED<br />
              {'>'} READY_FOR_AUTHENTICATION.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 border border-white/20 rounded-full mb-6 group">
            <Lock className="h-6 w-6 text-white group-hover:text-white/80 transition-colors" />
          </div>
          <div className="flex items-center gap-3 mb-4 opacity-30 justify-center">
            <div className="h-[1px] w-8 bg-white"></div>
            <span className="text-[9px] font-bold tracking-[0.5em] uppercase">Admin Terminal v2.0</span>
            <div className="h-[1px] w-8 bg-white"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 italic">
            AUTHENTIFICATION
          </h1>
          <p className="text-white/40 text-xs font-light tracking-wide">
            Accès sécurisé au <span className="text-white">back-office</span> Neon PostgreSQL
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-8 relative group hover:border-white/20 transition-all">
          <div className="absolute top-0 left-0 p-2 opacity-40"><Plus className="h-3 w-3 text-white" /></div>
          <div className="absolute top-0 right-0 p-2 opacity-40"><Plus className="h-3 w-3 text-white" /></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Identifiant</label>
              <input 
                type="text"
                required
                className="w-full bg-white/[0.07] border border-white/20 h-12 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                placeholder="ADMIN_ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Clé d'accès</label>
              <input 
                type="password"
                required
                className="w-full bg-white/[0.07] border border-white/20 h-12 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3 text-white">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group shadow-2xl"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin h-5 w-5" /> VALIDATION...</>
              ) : (
                <>AUTHENTIFIER <ShieldCheck className="h-4 w-4 group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-[9px] font-black text-white/30 hover:text-white uppercase tracking-[0.3em] transition-colors inline-flex items-center gap-2"
          >
            <ArrowRight className="h-3 w-3 rotate-180" /> Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
