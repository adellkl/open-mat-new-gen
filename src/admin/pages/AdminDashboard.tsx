import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  Check, Trash2, Calendar, Clock, MapPin, 
  Search, Eye, Tag, LayoutDashboard, 
  Users, Layers, Settings, LogOut, 
  AlertCircle, ShieldCheck, Filter, 
  ChevronRight, ArrowUpRight, Loader2, Plus, Activity, Terminal as TerminalIcon, Hash, Cpu,
  Upload, X, Image as ImageIcon, Key, Download, RefreshCw, Edit, ChevronDown
} from 'lucide-react';
import { OpenMatSession } from '../../types';
import { db } from '../../database/db';
import { auth, AuthUser } from '../../database/auth';

type ActiveSection = 'dashboard' | 'sessions' | 'moderators' | 'systems';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sessions, setSessions] = useState<OpenMatSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<OpenMatSession | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsSession, setDetailsSession] = useState<OpenMatSession | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'delete' | null>(null);
  
  // Gestion des admins/modérateurs
  const [admins, setAdmins] = useState<any[]>([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '', role: 'moderator' });
  const [passwordChange, setPasswordChange] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [adminError, setAdminError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Gestion de l'édition de session
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<OpenMatSession | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '', club: '', city: '', address: '', dates: [''],
    timeStart: '', timeEnd: '', type: 'JJB', price: '', description: ''
  });
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isAuthenticated = auth.isAuthenticated();
  const currentUser = auth.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.getSessions();
      setSessions(data);
      const adminsData = await db.getAdmins();
      setAdmins(adminsData);
      setLoading(false);
    };
    fetchData();

    // Vérifier l'auth toutes les 5 minutes
    const authCheckInterval = setInterval(() => {
      if (!auth.isAuthenticated()) {
        navigate('/admin');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(authCheckInterval);
  }, [navigate]);

  const handleApprove = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setDetailsSession(session);
      setModalAction('approve');
      setShowDetailsModal(true);
    }
  };

  const handleUnapprove = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      try {
        await db.unapproveSession(id);
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'pending' as const } : s));
      } catch (error) {
        alert("Erreur lors du retrait de la diffusion");
      }
    }
  };

  const parseDates = (value: string | any) => {
    // Si c'est déjà un tableau, le retourner
    if (Array.isArray(value)) {
      const dates = value.map(v => String(v).trim()).filter(Boolean);
      return dates.length > 0 ? dates : [''];
    }
    // Si c'est une chaîne de caractères
    if (typeof value === 'string') {
      const dates = value
        .split('|')
        .map((date) => date.trim())
        .filter(Boolean);
      return dates.length > 0 ? dates : [''];
    }
    // Si c'est un autre type (Date, number, etc.), le convertir en chaîne
    const dateStr = String(value).trim();
    return dateStr ? [dateStr] : [''];
  };

  const handleEdit = (session: OpenMatSession) => {
    setEditingSession(session);
    
    // Parser le time range
    const [timeStart, timeEnd] = session.time.split(' - ');
    
    setEditFormData({
      title: session.title,
      club: session.club,
      city: session.city,
      address: session.address,
      dates: parseDates(session.date),
      timeStart: timeStart || '',
      timeEnd: timeEnd || '',
      type: session.type,
      price: session.price || '',
      description: session.description
    });
    
    setEditPhotoPreview(session.photo || null);
    setEditPhoto(null);
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setEditError('Veuillez sélectionner un fichier image valide.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setEditError('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      setEditPhoto(file);
      setEditError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditPhoto = () => {
    setEditPhoto(null);
    setEditPhotoPreview(editingSession?.photo || null);
  };

  const handleEditDateChange = (index: number, value: string) => {
    const nextDates = [...editFormData.dates];
    nextDates[index] = value;
    setEditFormData({ ...editFormData, dates: nextDates });
  };

  const handleAddEditDate = () => {
    if (!editFormData.dates[editFormData.dates.length - 1]) {
      return;
    }
    setEditFormData({ ...editFormData, dates: [...editFormData.dates, ''] });
  };

  const handleRemoveEditDate = (index: number) => {
    if (editFormData.dates.length === 1) {
      return;
    }
    const nextDates = editFormData.dates.filter((_, idx) => idx !== index);
    setEditFormData({ ...editFormData, dates: nextDates });
  };

  const handleUpdateSession = async () => {
    if (!editingSession) return;

    // Validation
    const hasEmptyDate = editFormData.dates.some((date) => !date);
    if (!editFormData.title || !editFormData.club || !editFormData.city || 
        !editFormData.address || hasEmptyDate || 
        !editFormData.timeStart || !editFormData.timeEnd || !editFormData.description) {
      setEditError('Tous les champs obligatoires doivent être remplis');
      return;
    }

    const normalizedDates = Array.from(new Set(editFormData.dates.filter(Boolean))).sort();

    setIsUpdating(true);
    setEditError(null);

    try {
      let photoBase64 = editingSession.photo;
      
      // Si une nouvelle photo a été sélectionnée
      if (editPhoto) {
        photoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(editPhoto);
        });
      }

      // Mettre à jour la session
      await db.updateSession(editingSession.id, {
        title: editFormData.title.trim(),
        club: editFormData.club.trim(),
        city: editFormData.city.trim(),
        address: editFormData.address.trim(),
        date: normalizedDates.join(' | '),
        time: `${editFormData.timeStart} - ${editFormData.timeEnd}`,
        price: editFormData.price.trim(),
        type: editFormData.type as any,
        description: editFormData.description.trim(),
        photo: photoBase64 || undefined
      });

      // Mettre à jour l'état local
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id 
          ? {
              ...s,
              title: editFormData.title.trim(),
              club: editFormData.club.trim(),
              city: editFormData.city.trim(),
              address: editFormData.address.trim(),
              date: normalizedDates.join(' | '),
              time: `${editFormData.timeStart} - ${editFormData.timeEnd}`,
              price: editFormData.price.trim(),
              type: editFormData.type as any,
              description: editFormData.description.trim(),
              photo: photoBase64 || s.photo
            }
          : s
      ));

      // Fermer le modal
      setShowEditModal(false);
      setEditingSession(null);
      setEditPhoto(null);
      setEditPhotoPreview(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setEditError("Erreur lors de la mise à jour de la session");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmApprove = async () => {
    if (!detailsSession) return;
    
    // Si la session n'a pas de photo, demander à l'admin d'en ajouter une
    if (!detailsSession.photo) {
      setSelectedSession(detailsSession);
      setShowDetailsModal(false);
      setShowPhotoModal(true);
      return;
    }
    
    // Sinon, valider directement
    try {
      await db.approveSession(detailsSession.id);
      setSessions(prev => prev.map(s => s.id === detailsSession.id ? { ...s, status: 'approved' as const } : s));
      setShowDetailsModal(false);
      setDetailsSession(null);
      setModalAction(null);
    } catch (error) {
      alert("Erreur DB");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Veuillez sélectionner un fichier image valide.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      setPhoto(file);
      setUploadError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleApproveWithPhoto = async () => {
    if (!selectedSession) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      let photoBase64 = null;
      if (photo) {
        photoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo);
        });
      }

      // Mettre à jour la photo dans la base de données
      if (photoBase64) {
        await db.updateSessionPhoto(selectedSession.id, photoBase64);
      }

      // Approuver la session
      await db.approveSession(selectedSession.id);
      
      // Mettre à jour l'état local
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id 
          ? { ...s, status: 'approved' as const, photo: photoBase64 || s.photo } 
          : s
      ));

      // Fermer la modale
      setShowPhotoModal(false);
      setSelectedSession(null);
      setPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setUploadError("Erreur lors de l'upload de la photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkipPhoto = async () => {
    if (!selectedSession) return;

    try {
      await db.approveSession(selectedSession.id);
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, status: 'approved' as const } : s));
      setShowPhotoModal(false);
      setSelectedSession(null);
      setPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      alert("Erreur DB");
    }
  };

  const handleReject = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setDetailsSession(session);
      setModalAction('delete');
      setShowDetailsModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!detailsSession) return;
    
    try {
      await db.deleteSession(detailsSession.id);
      setSessions(prev => prev.filter(s => s.id !== detailsSession.id));
      setShowDetailsModal(false);
      setDetailsSession(null);
      setModalAction(null);
    } catch (error) {
      alert("Erreur DB");
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    auth.logout();
    navigate('/');
  };

  // Ajouter un nouveau modérateur
  const handleAddAdmin = async () => {
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      setAdminError('Tous les champs sont requis');
      return;
    }
    
    if (newAdmin.password.length < 6) {
      setAdminError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsProcessing(true);
    setAdminError('');
    
    try {
      const passwordHash = auth.hashPassword(newAdmin.password);
      const result = await db.addAdmin(newAdmin.username, newAdmin.email, passwordHash, newAdmin.role);
      
      if (result.success && result.admin) {
        setAdmins([result.admin, ...admins]);
        setShowAddAdminModal(false);
        setNewAdmin({ username: '', email: '', password: '', role: 'moderator' });
      } else {
        setAdminError('Erreur lors de l\'ajout de l\'administrateur');
      }
    } catch (error) {
      setAdminError('Erreur de connexion à la base de données');
    } finally {
      setIsProcessing(false);
    }
  };

  // Supprimer un modérateur
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Supprimer définitivement cet administrateur ?')) return;
    
    try {
      const result = await db.deleteAdmin(id);
      if (result.success) {
        setAdmins(admins.filter(a => a.id !== id));
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (!passwordChange.oldPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
      setAdminError('Tous les champs sont requis');
      return;
    }
    
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setAdminError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordChange.newPassword.length < 6) {
      setAdminError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsProcessing(true);
    setAdminError('');
    
    try {
      const oldHash = auth.hashPassword(passwordChange.oldPassword);
      const newHash = auth.hashPassword(passwordChange.newPassword);
      const result = await db.changeAdminPassword(currentUser!.username, oldHash, newHash);
      
      if (result.success) {
        setShowPasswordModal(false);
        setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' });
        alert('Mot de passe changé avec succès');
      } else {
        setAdminError(result.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      setAdminError('Erreur de connexion à la base de données');
    } finally {
      setIsProcessing(false);
    }
  };

  // Exporter les données
  const handleExportData = async () => {
    try {
      const result = await db.exportSessions();
      if (result.success && result.data) {
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `openmat-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('Erreur lors de l\'export des données');
    }
  };

  // Nettoyer le cache (simulation)
  const handleClearCache = () => {
    if (confirm('Êtes-vous sûr de vouloir nettoyer le cache système ?')) {
      // Simulation de nettoyage de cache
      setTimeout(() => {
        alert('Cache nettoyé avec succès');
      }, 1000);
    }
  };

  const filtered = sessions.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.club.toLowerCase().includes(searchTerm.toLowerCase()) || s.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    approved: sessions.filter(s => s.status === 'approved').length,
    withPhoto: sessions.filter(s => s.photo).length,
    uniqueCities: new Set(sessions.map(s => s.city)).size,
    uniqueClubs: new Set(sessions.map(s => s.club)).size,
    byType: {
      jjb: sessions.filter(s => s.type === 'JJB').length,
      lutaLivre: sessions.filter(s => s.type === 'Luta Livre').length,
      mixte: sessions.filter(s => s.type === 'Mixte').length,
    },
    approvalRate: sessions.length > 0 
      ? Math.round((sessions.filter(s => s.status === 'approved').length / sessions.length) * 100)
      : 0,
    avgSessionsPerClub: new Set(sessions.map(s => s.club)).size > 0
      ? (sessions.length / new Set(sessions.map(s => s.club)).size).toFixed(1)
      : '0',
  };

  if (!isAuthenticated || !currentUser) return <Navigate to="/admin" />;

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-white/40 animate-spin mx-auto mb-6" />
        <p className="text-white/20 font-black uppercase text-[10px] tracking-widest">Initialisation du Back-Office...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-black/40 border-r border-white/5 flex flex-col shrink-0 backdrop-blur-sm">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 border border-white/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-sm font-black tracking-tighter uppercase leading-none text-white">OMF.ADMIN</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Neon Cloud</span>
            </div>
          </div>
          
          {/* Info utilisateur connecté */}
          {currentUser && (
            <div className="mb-12 p-4 bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse"></div>
                <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Connecté</span>
              </div>
              <p className="text-[11px] font-black text-white uppercase tracking-tight mb-1">{currentUser.username}</p>
              <p className="text-[8px] text-white/40 uppercase tracking-wider mb-2">{currentUser.email}</p>
              <span className={`inline-block px-2 py-1 text-[7px] font-black uppercase tracking-wider border ${
                currentUser.role === 'admin'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                {currentUser.role === 'admin' ? 'SUPER ADMIN' : currentUser.role.toUpperCase()}
              </span>
            </div>
          )}
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-widest group transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-white/[0.05] border border-white/10 text-white'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5 text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </div>
              {activeSection === 'dashboard' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </button>
            <button 
              onClick={() => setActiveSection('sessions')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-widest group transition-all ${
                activeSection === 'sessions'
                  ? 'bg-white/[0.05] border border-white/10 text-white'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5 text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <Layers className="h-4 w-4" /> Sessions
              </div>
              {activeSection === 'sessions' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </button>
            <button 
              onClick={() => setActiveSection('moderators')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-widest group transition-all ${
                activeSection === 'moderators'
                  ? 'bg-white/[0.05] border border-white/10 text-white'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5 text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <Users className="h-4 w-4" /> Modérateurs
              </div>
              {activeSection === 'moderators' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </button>
            <button 
              onClick={() => setActiveSection('systems')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-widest group transition-all ${
                activeSection === 'systems'
                  ? 'bg-white/[0.05] border border-white/10 text-white'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5 text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <Settings className="h-4 w-4" /> Systèmes
              </div>
              {activeSection === 'systems' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </button>
          </nav>
        </div>

        <div className="mt-auto p-10 border-t border-white/5">
          <div className="p-6 bg-white/[0.02] border border-white/5 mb-8">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Statut Serveur</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-white/60">En ligne</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-white/5"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto h-screen p-10 lg:p-16">
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4 opacity-30">
              <div className="h-[1px] w-12 bg-white"></div>
              <span className="text-[10px] font-bold tracking-[0.6em] uppercase">Back-Office Terminal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-4">
              {activeSection === 'dashboard' && 'BACK-OFFICE'}
              {activeSection === 'sessions' && 'SESSIONS'}
              {activeSection === 'moderators' && 'MODÉRATEURS'}
              {activeSection === 'systems' && 'SYSTÈMES'}
            </h1>
            <p className="text-white/40 text-sm font-light tracking-wide">
              {activeSection === 'dashboard' && (
                <>Base de données : <span className="text-white">Neon PostgreSQL Serverless</span></>
              )}
              {activeSection === 'sessions' && (
                <>Gestion complète des <span className="text-white">Open Mat Sessions</span></>
              )}
              {activeSection === 'moderators' && (
                <>Contrôle d'accès et <span className="text-white">Permissions</span></>
              )}
              {activeSection === 'systems' && (
                <>Configuration et <span className="text-white">Monitoring</span></>
              )}
            </p>
          </div>
          
          <Link 
            to="/" 
            className="border border-white/10 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center gap-3"
          >
            Accès Public <ArrowUpRight className="h-4 w-4" />
          </Link>
        </header>

        {/* DASHBOARD VIEW */}
        {activeSection === 'dashboard' && (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-white/10 bg-white/[0.02] p-10 relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-40"><Plus className="h-3 w-3 text-white" /></div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">Total Database</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-black text-white tracking-tighter italic">{stats.total}</p>
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-white/40" />
              </div>
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-10 relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-40"><Plus className="h-3 w-3 text-white" /></div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">Action Requise</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-black text-white tracking-tighter italic">{stats.pending}</p>
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white/40" />
              </div>
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-10 relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-40"><Plus className="h-3 w-3 text-white" /></div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">En Ligne</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-black text-white tracking-tighter italic">{stats.approved}</p>
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtrage & Liste */}
        <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row gap-8 justify-between items-center">
            <div className="flex bg-white/[0.05] p-1.5 w-full xl:w-auto">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === 'all' 
                    ? 'bg-white text-black' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                TOUT
              </button>
              <button 
                onClick={() => setFilter('pending')} 
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === 'pending' 
                    ? 'bg-white text-black' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                ATTENTE
              </button>
              <button 
                onClick={() => setFilter('approved')} 
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === 'approved' 
                    ? 'bg-white text-black' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                DIFFUSÉ
              </button>
            </div>

            <div className="relative w-full xl:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text" 
                placeholder="RECHERCHER UN CLUB OU ÉVÉNEMENT..." 
                className="w-full h-16 pl-14 pr-8 bg-white/[0.07] border border-white/20 text-white text-xs font-bold uppercase tracking-wider outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Événement & Club</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Localisation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Date & Heure</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Statut</th>
                  <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group border-b border-white/5">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 border border-white/10 bg-white/[0.02] overflow-hidden shrink-0 relative group-hover:border-white/20 transition-all">
                            {s.photo ? (
                              <img 
                                src={s.photo} 
                                alt={s.title}
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white/20" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1.5">{s.title}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">{s.club}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-[11px] font-black text-white flex items-center gap-2 uppercase tracking-wide">
                          <MapPin className="h-3.5 w-3.5 text-white/40" /> {s.city}
                        </p>
                        <p className="text-[10px] font-bold text-white/30 truncate max-w-[180px] mt-1">{s.address}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-[11px] font-black text-white flex items-center gap-2 uppercase tracking-wide">
                          <Calendar className="h-3.5 w-3.5 text-white/40" /> {new Date(s.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-[10px] font-bold text-white/30 flex items-center gap-2 mt-1 uppercase">
                          <Clock className="h-3.5 w-3.5" /> {s.time}
                        </p>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`inline-block px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border ${
                          s.status === 'approved' 
                            ? 'bg-white/[0.05] text-white border-white/10' 
                            : 'bg-white/[0.05] text-white/60 border-white/5 animate-pulse'
                        }`}>
                          {s.status === 'approved' ? 'DIFFUSÉ' : 'ATTENTE'}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          {s.status === 'pending' ? (
                            <button 
                              onClick={() => handleApprove(s.id)}
                              className="h-10 w-10 bg-white text-black border border-white/20 flex items-center justify-center hover:bg-zinc-200 transition-all"
                              title="Valider et diffuser"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUnapprove(s.id)}
                              className="h-10 w-10 border border-white/20 text-white/60 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                              title="Retirer la diffusion"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEdit(s)}
                            className="h-10 w-10 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                            title="Modifier les informations"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(s.id)}
                            className="h-10 w-10 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="max-w-xs mx-auto text-white/20">
                        <Layers className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-[11px] font-black uppercase tracking-widest">Le flux est vide</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {/* SESSIONS VIEW */}
        {activeSection === 'sessions' && (
          <div className="space-y-8">
            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">Total</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stats.total}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">En Attente</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stats.pending}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">Approuvées</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stats.approved}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">Avec Photo</p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  {sessions.filter(s => s.photo).length}
                </p>
              </div>
            </div>

            {/* Liste complète */}
            <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Toutes les Sessions</h2>
                <p className="text-white/40 text-sm">Gestion complète de la base de données</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5">
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">ID</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Événement</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Club</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Ville</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Date</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Type</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Photo</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Statut</th>
                      <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sessions.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                        <td className="px-10 py-6">
                          <code className="text-[10px] font-mono text-white/60">
                            {s.id.slice(0, 8)}...
                          </code>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-[11px] font-black text-white uppercase tracking-tight">{s.title}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-[11px] font-bold text-white/60 uppercase">{s.club}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-[11px] font-bold text-white/60 uppercase">{s.city}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-[11px] font-bold text-white/60">
                            {new Date(s.date).toLocaleDateString('fr-FR')}
                          </p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="inline-block px-3 py-1 text-[9px] font-black uppercase bg-white/5 border border-white/10 text-white/60">
                            {s.type}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                          {s.photo ? (
                            <Check className="h-4 w-4 text-white/60 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-white/20 mx-auto" />
                          )}
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span className={`inline-block px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border ${
                            s.status === 'approved' 
                              ? 'bg-white/[0.05] text-white border-white/10' 
                              : 'bg-white/[0.05] text-white/60 border-white/5'
                          }`}>
                            {s.status === 'approved' ? 'APPROUVÉE' : 'EN ATTENTE'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-3">
                            {s.status === 'pending' ? (
                              <button 
                                onClick={() => handleApprove(s.id)}
                                className="h-10 w-10 bg-white text-black border border-white/20 flex items-center justify-center hover:bg-zinc-200 transition-all"
                                title="Approuver et diffuser"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUnapprove(s.id)}
                                className="h-10 w-10 border border-white/20 text-white/60 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                                title="Retirer la diffusion"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleEdit(s)}
                              className="h-10 w-10 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                              title="Modifier les informations"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(s.id)}
                              className="h-10 w-10 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODERATORS VIEW */}
        {activeSection === 'moderators' && (
          <div className="space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 border border-white/20 rounded-full mb-8">
                  <Users className="h-8 w-8 text-white/40" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  Gestion des Modérateurs
                </h2>
                <p className="text-white/40 mb-8">
                  Contrôlez les accès et les permissions de votre équipe d'administration.
                </p>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all inline-flex items-center gap-3"
                >
                  <Key className="h-4 w-4" /> Changer mon mot de passe
                </button>
              </div>
            </div>

            {/* Liste actuelle */}
            <div className="border border-white/10 bg-white/[0.02]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Modérateurs Actifs ({admins.length})</h3>
                  <p className="text-white/40 text-sm">Administrateurs avec accès au système</p>
                </div>
                {auth.hasRole('admin') && (
                  <button 
                    onClick={() => setShowAddAdminModal(true)}
                    className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all flex items-center gap-3"
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                )}
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-6 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 border border-white/20 rounded-full flex items-center justify-center bg-white/5">
                          <Users className="h-5 w-5 text-white/60" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{admin.username}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{admin.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 text-[9px] font-black uppercase border tracking-wider ${
                          admin.role === 'admin' 
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-white/5 border-white/10 text-white/60'
                        }`}>
                          {admin.role === 'admin' ? 'SUPER ADMIN' : admin.role.toUpperCase()}
                        </span>
                        {admin.id === currentUser?.id && (
                          <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse"></div>
                        )}
                        {auth.hasRole('admin') && admin.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="h-10 w-10 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Niveaux de Permission</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-white/10 bg-white/[0.02]">
                  <ShieldCheck className="h-6 w-6 text-white/40 mb-4" />
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Super Admin</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Accès complet à toutes les fonctionnalités
                  </p>
                </div>
                <div className="p-6 border border-white/10 bg-white/[0.02]">
                  <Users className="h-6 w-6 text-white/40 mb-4" />
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Modérateur</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Validation et gestion des sessions
                  </p>
                </div>
                <div className="p-6 border border-white/10 bg-white/[0.02]">
                  <Eye className="h-6 w-6 text-white/40 mb-4" />
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Lecture Seule</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Consultation des données uniquement
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEMS VIEW */}
        {activeSection === 'systems' && (
          <div className="space-y-8">
            {/* Informations système */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 border border-white/20 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Système</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Configuration</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Base de données</span>
                    <span className="text-[10px] font-black text-white uppercase">Neon PostgreSQL</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Version</span>
                    <span className="text-[10px] font-black text-white uppercase">1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Environnement</span>
                    <span className="text-[10px] font-black text-white uppercase">Production</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Région</span>
                    <span className="text-[10px] font-black text-white uppercase">EU-WEST-1</span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-white/[0.02] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 border border-white/20 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Performance</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Statistiques Système</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Taux d'approbation</span>
                    <span className="text-[10px] font-black text-white">{stats.approvalRate}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Villes actives</span>
                    <span className="text-[10px] font-black text-white">{stats.uniqueCities}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Clubs partenaires</span>
                    <span className="text-[10px] font-black text-white">{stats.uniqueClubs}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Moy. sessions/club</span>
                    <span className="text-[10px] font-black text-white">{stats.avgSessionsPerClub}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Avec photo</span>
                    <span className="text-[10px] font-black text-white">
                      {stats.withPhoto}/{stats.total} ({stats.total > 0 ? Math.round((stats.withPhoto/stats.total)*100) : 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Distribution</span>
                    <span className="text-[10px] font-black text-white">
                      {stats.byType.jjb}J / {stats.byType.lutaLivre}L / {stats.byType.mixte}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Statut système</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500/80 animate-pulse"></div>
                      <span className="text-[10px] font-black text-white uppercase">Opérationnel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs d'activité */}
            <div className="border border-white/10 bg-white/[0.02]">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Logs d'Activité</h3>
                <p className="text-white/40 text-sm">Historique des actions système récentes</p>
              </div>
              <div className="p-8">
                <div className="space-y-4 font-mono text-[11px]">
                  <div className="flex gap-6 items-start p-4 border-l-2 border-white/10 hover:border-white/30 hover:bg-white/[0.02] transition-all">
                    <span className="text-white/30 shrink-0">[{new Date().toLocaleTimeString('fr-FR')}]</span>
                    <span className="text-white/60">Session approuvée : ID {sessions[0]?.id?.slice(0, 8) || '...'}</span>
                  </div>
                  <div className="flex gap-6 items-start p-4 border-l-2 border-white/10 hover:border-white/30 hover:bg-white/[0.02] transition-all">
                    <span className="text-white/30 shrink-0">[{new Date(Date.now() - 300000).toLocaleTimeString('fr-FR')}]</span>
                    <span className="text-white/60">Nouvelle session créée</span>
                  </div>
                  <div className="flex gap-6 items-start p-4 border-l-2 border-white/10 hover:border-white/30 hover:bg-white/[0.02] transition-all">
                    <span className="text-white/30 shrink-0">[{new Date(Date.now() - 600000).toLocaleTimeString('fr-FR')}]</span>
                    <span className="text-white/60">Connexion admin : admin@openmat.fr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions système */}
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Actions Système</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={handleClearCache}
                  className="p-6 border border-white/10 text-left hover:border-white/20 hover:bg-white/[0.02] transition-all group"
                >
                  <RefreshCw className="h-6 w-6 text-white/40 group-hover:text-white/60 mb-3 transition-colors" />
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Nettoyer Cache</p>
                  <p className="text-[10px] text-white/40">Réinitialiser le cache système</p>
                </button>
                <button 
                  onClick={handleExportData}
                  className="p-6 border border-white/10 text-left hover:border-white/20 hover:bg-white/[0.02] transition-all group"
                >
                  <Download className="h-6 w-6 text-white/40 group-hover:text-white/60 mb-3 transition-colors" />
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Exporter Données</p>
                  <p className="text-[10px] text-white/40">Télécharger une sauvegarde JSON</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modale d'ajout de photo */}
      {showPhotoModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-black border border-white/20 p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Ajouter une Photo
              </h2>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setSelectedSession(null);
                  setPhoto(null);
                  setPhotoPreview(null);
                  setUploadError(null);
                }}
                className="p-2 hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-white/60 text-sm mb-2">Session : <span className="text-white font-bold">{selectedSession.title}</span></p>
              <p className="text-white/60 text-sm">Club : <span className="text-white font-bold">{selectedSession.club}</span></p>
            </div>

            {uploadError && (
              <div className="mb-6 p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{uploadError}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 bg-white/[0.02] hover:border-white/40 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-white/40 group-hover:text-white/60 mb-4 transition-colors" />
                    <p className="mb-2 text-[11px] font-bold text-white/50 uppercase tracking-wider">
                      Cliquez pour télécharger une photo
                    </p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">
                      PNG, JPG, WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              ) : (
                <div className="relative w-full">
                  <div className="relative w-full h-80 border border-white/20 bg-white/[0.02] overflow-hidden group">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-4 right-4 p-3 bg-black/80 border border-white/20 text-white hover:bg-black transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {photo && (
                    <p className="mt-3 text-[9px] text-white/40 uppercase tracking-wider text-center">
                      {photo.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSkipPhoto}
                disabled={isUploading}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider sans Photo
              </button>
              <button
                onClick={handleApproveWithPhoto}
                disabled={isUploading || !photo}
                className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  'Valider avec Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation simple */}
      {showDetailsModal && detailsSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-black border border-white/20 p-8">
            <div className="text-center mb-8">
              {modalAction === 'approve' ? (
                <>
                  <div className="inline-flex items-center justify-center h-16 w-16 border border-white/20 rounded-full mb-6">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                    Valider la Session
                  </h2>
                  <p className="text-white/60 text-sm">
                    Voulez-vous approuver et diffuser<br />
                    <span className="text-white font-bold">"{detailsSession.title}"</span> ?
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center h-16 w-16 border border-red-900/50 rounded-full mb-6">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                    Supprimer la Session
                  </h2>
                  <p className="text-white/60 text-sm">
                    Voulez-vous supprimer définitivement<br />
                    <span className="text-white font-bold">"{detailsSession.title}"</span> ?<br />
                    <span className="text-red-500 text-xs">Cette action est irréversible.</span>
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailsSession(null);
                  setModalAction(null);
                }}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              {modalAction === 'approve' ? (
                <button
                  onClick={confirmApprove}
                  className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all"
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-8 py-4 bg-red-950/50 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-950/70 transition-all"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale d'ajout d'administrateur */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-black border border-white/20 p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Ajouter un Modérateur
              </h2>
              <button
                onClick={() => {
                  setShowAddAdminModal(false);
                  setNewAdmin({ username: '', email: '', password: '', role: 'moderator' });
                  setAdminError('');
                }}
                className="p-2 hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {adminError && (
              <div className="mb-6 p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{adminError}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="ADMIN_ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="admin@openmat.fr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Rôle
                </label>
                <div className="relative group">
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 pr-12 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 hover:border-white/40 hover:bg-white/[0.1] transition-all cursor-pointer appearance-none select-custom-admin"
                  >
                    <option value="moderator">MODÉRATEUR</option>
                    <option value="admin">SUPER ADMIN</option>
                    <option value="viewer">LECTURE SEULE</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowAddAdminModal(false);
                  setNewAdmin({ username: '', email: '', password: '', role: 'moderator' });
                  setAdminError('');
                }}
                disabled={isProcessing}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={isProcessing}
                className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-black border border-white/20 p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Changer le Mot de Passe
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  setAdminError('');
                }}
                className="p-2 hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {adminError && (
              <div className="mb-6 p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{adminError}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  value={passwordChange.oldPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, oldPassword: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Confirmer nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  setAdminError('');
                }}
                disabled={isProcessing}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isProcessing}
                className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-black border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 border border-white/20 rounded-full mb-6">
                <LogOut className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                Déconnexion
              </h2>
              <p className="text-white/60 text-sm">
                Voulez-vous vous déconnecter ?
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'édition de session */}
      {showEditModal && editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-4xl w-full bg-black border border-white/20 p-8 md:p-12 my-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Modifier la Session
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSession(null);
                  setEditPhoto(null);
                  setEditPhotoPreview(null);
                  setEditError(null);
                }}
                className="p-2 hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {editError && (
              <div className="mb-6 p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{editError}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              {/* Titre et Club */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Nom de la Session *
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                    placeholder="EX: OPEN MAT NO-GI PRO"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Académie Hôte *
                  </label>
                  <input
                    type="text"
                    value={editFormData.club}
                    onChange={(e) => setEditFormData({...editFormData, club: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                    placeholder="EX: GRACIE BARRA PARIS"
                  />
                </div>
              </div>

              {/* Ville et Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Localisation (Ville) *
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                    placeholder="PARIS"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Dates *
                  </label>
                  <div className="space-y-3">
                    {editFormData.dates.map((dateValue, index) => (
                      <div key={`edit-date-${index}`} className="flex items-center gap-3">
                        <input
                          type="date"
                          value={dateValue}
                          onChange={(e) => handleEditDateChange(index, e.target.value)}
                          className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditDate(index)}
                          className={`h-12 w-12 border border-white/10 flex items-center justify-center transition-all ${
                            editFormData.dates.length === 1
                              ? 'text-white/20 cursor-not-allowed'
                              : 'text-white/50 hover:text-white hover:border-white/40'
                          }`}
                          disabled={editFormData.dates.length === 1}
                          aria-label="Supprimer cette date"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEditDate}
                      className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
                    >
                      <Plus className="h-3 w-3" /> Ajouter une date
                    </button>
                  </div>
                </div>
              </div>

              {/* Horaires et Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Heure de début *
                  </label>
                  <input
                    type="time"
                    value={editFormData.timeStart}
                    onChange={(e) => setEditFormData({...editFormData, timeStart: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Heure de fin *
                  </label>
                  <input
                    type="time"
                    value={editFormData.timeEnd}
                    onChange={(e) => setEditFormData({...editFormData, timeEnd: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Spécialité *
                  </label>
                  <div className="relative group">
                    <select
                      value={editFormData.type}
                      onChange={(e) => setEditFormData({...editFormData, type: e.target.value as any})}
                      className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 pr-12 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 hover:border-white/40 hover:bg-white/[0.1] transition-all cursor-pointer appearance-none select-custom-admin"
                    >
                      <option value="JJB">JJB (GI)</option>
                      <option value="Luta Livre">LUTA LIVRE (NO-GI)</option>
                      <option value="Mixte">MIXTE / GRAPPLING</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" />
                  </div>
                </div>
              </div>

              {/* Adresse et Prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Adresse Physique *
                  </label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                    placeholder="RUE, CODE POSTAL..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Contribution / Tarif
                  </label>
                  <input
                    type="text"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                    placeholder="EX: 10€ (Optionnel)"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Détails Techniques *
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full bg-white/[0.07] border border-white/20 p-6 min-h-[150px] text-white text-xs font-medium leading-relaxed outline-none focus:border-white/60 transition-all placeholder:text-white/10"
                  placeholder="NIVEAU REQUIS, ÉQUIPEMENT, RÈGLES D'HYGIÈNE..."
                />
              </div>

              {/* Photo */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Photo (Optionnel)
                </label>
                {!editPhotoPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 bg-white/[0.02] hover:border-white/40 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-white/40 group-hover:text-white/60 mb-3 transition-colors" />
                      <p className="mb-2 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                        Cliquez pour télécharger
                      </p>
                      <p className="text-[8px] text-white/30 uppercase tracking-wider">
                        PNG, JPG, WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleEditPhotoChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-full">
                    <div className="relative w-full h-64 border border-white/20 bg-white/[0.02] overflow-hidden group">
                      <img 
                        src={editPhotoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveEditPhoto}
                        className="absolute top-2 right-2 p-2 bg-black/80 border border-white/20 text-white hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSession(null);
                  setEditPhoto(null);
                  setEditPhotoPreview(null);
                  setEditError(null);
                }}
                disabled={isUpdating}
                className="flex-1 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateSession}
                disabled={isUpdating}
                className="flex-1 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
