
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, Loader2, AlertCircle, ArrowRight, Plus,
  Activity, Hash, Cpu, Terminal as TerminalIcon, Circle, Upload, X, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { db } from '../../database/db';
import SEO from '../../shared/components/SEO';
import { searchClubs, Club, DEFAULT_CLUB_LOGO } from '../../data/clubs';

const InputField: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">{label}</label>
    <input 
      {...props}
      className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
    />
  </div>
);

// Composant pour les feux d'artifice
const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: any[] = [];
    const particles: any[] = [];

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      gravity: number;
      color: string;
      exploded: boolean;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * canvas.height * 0.5;
        this.vx = (this.targetX - this.x) / 50;
        this.vy = (this.targetY - this.y) / 50;
        this.gravity = 0.02;
        const colors = ['#ffffff', '#0066ff', '#8b00ff', '#8b4513', '#1a1a1a']; // blanc, bleu, violet, marron, noir (gris très foncé)
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
      }

      update() {
        if (!this.exploded) {
          this.vy += this.gravity;
          this.x += this.vx;
          this.y += this.vy;

          if (this.y <= this.targetY) {
            this.explode();
          }
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: this.color,
            life: 60,
            decay: Math.random() * 0.02 + 0.02
          });
        }
      }

      draw() {
        if (!this.exploded) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded) {
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= p.decay;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

const AddOpenMat: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: '', club: '', city: '', address: '', dates: [''],
    timeStart: '', timeEnd: '', type: 'JJB', price: '', description: '', instagram: '',
    isRecurring: false, recurringDay: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLDivElement>(null);
  const [clubSuggestions, setClubSuggestions] = useState<Club[]>([]);
  const [showClubSuggestions, setShowClubSuggestions] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const clubInputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll en haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fonction pour rechercher les villes via l'API
  const fetchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,code&limit=10`
      );
      const data = await response.json();
      const cities = data.map((city: any) => city.nom);
      setCitySuggestions(cities);
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error);
      setCitySuggestions([]);
    }
  };

  // Fonction pour rechercher les clubs
  const fetchClubs = (query: string) => {
    if (query.length < 2) {
      setClubSuggestions([]);
      return;
    }
    
    const clubs = searchClubs(query);
    setClubSuggestions(clubs);
  };

  // Fonction pour sélectionner un club et charger son logo
  const handleSelectClub = (club: Club) => {
    setSelectedClub(club);
    setFormData({...formData, club: club.name});
    setShowClubSuggestions(false);
    setClubSuggestions([]);
    
    // Charger automatiquement le logo du club comme photo
    loadClubLogo(club.logo);
  };

  // Fonction pour charger le logo du club
  const loadClubLogo = async (logoUrl: string) => {
    try {
      // Pour les URLs data: (logo par défaut), les utiliser directement
      if (logoUrl.startsWith('data:')) {
        setPhotoPreview(logoUrl);
        return;
      }

      // Tenter de charger l'image via fetch (peut échouer à cause de CORS)
      try {
        const response = await fetch(logoUrl, { mode: 'cors' });
        const blob = await response.blob();
        const file = new File([blob], 'club-logo.png', { type: blob.type });
        setPhoto(file);
        
        // Créer la prévisualisation
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (corsError) {
        // Si le fetch échoue (CORS), utiliser directement l'URL pour la prévisualisation
        console.warn('CORS error, using direct URL for preview');
        setPhotoPreview(logoUrl);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
      // En cas d'erreur, utiliser le logo par défaut
      setPhotoPreview(DEFAULT_CLUB_LOGO);
    }
  };

  // Gérer le clic en dehors du dropdown de villes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
      if (clubInputRef.current && !clubInputRef.current.contains(event.target as Node)) {
        setShowClubSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: 'IDENTIFICATION',
      fields: ['title', 'club'],
      validate: () => {
        const valid = formData.title.trim() !== '' && formData.club.trim() !== '';
        return valid;
      }
    },
    {
      id: 2,
      title: 'LOGISTIQUE',
      fields: ['city', 'dates', 'timeStart', 'timeEnd', 'type'],
      validate: () => {
        // Validation différente selon si c'est récurrent ou non
        if (formData.isRecurring) {
          // Si récurrent, vérifier le jour de la semaine au lieu des dates
          if (!formData.city.trim() || !formData.recurringDay || !formData.timeStart || !formData.timeEnd) {
            return false;
          }
        } else {
          // Si non récurrent, vérifier les dates
          const hasEmptyDate = formData.dates.some((date) => !date);
          if (!formData.city.trim() || hasEmptyDate || !formData.timeStart || !formData.timeEnd) {
            return false;
          }
        }
        // Comparer les heures correctement
        const startTime = formData.timeStart.split(':').map(Number);
        const endTime = formData.timeEnd.split(':').map(Number);
        const startMinutes = startTime[0] * 60 + startTime[1];
        const endMinutes = endTime[0] * 60 + endTime[1];
        return startMinutes < endMinutes;
      }
    },
    {
      id: 3,
      title: 'DÉTAILS',
      fields: ['address', 'price', 'description'],
      validate: () => {
        return formData.address.trim() !== '' && formData.description.trim() !== '';
      }
    }
  ];

  const validateStep = (stepId: number): boolean => {
    const step = steps.find(s => s.id === stepId);
    return step ? step.validate() : false;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        setError(null);
      }
    } else {
      const step = steps.find(s => s.id === currentStep);
      let errorMessage = `Veuillez remplir tous les champs de l'étape ${currentStep} avant de continuer.`;
      
      // Message d'erreur plus spécifique pour l'étape 2
      if (currentStep === 2) {
        if (!formData.city.trim()) {
          errorMessage = "Veuillez remplir la ville.";
        } else if (formData.isRecurring && !formData.recurringDay) {
          errorMessage = "Veuillez sélectionner un jour de la semaine pour la session récurrente.";
        } else if (!formData.isRecurring && formData.dates.some((date) => !date)) {
          errorMessage = "Veuillez sélectionner toutes les dates.";
        } else if (!formData.timeStart) {
          errorMessage = "Veuillez sélectionner l'heure de début.";
        } else if (!formData.timeEnd) {
          errorMessage = "Veuillez sélectionner l'heure de fin.";
        } else if (formData.timeStart && formData.timeEnd) {
          const startTime = formData.timeStart.split(':').map(Number);
          const endTime = formData.timeEnd.split(':').map(Number);
          const startMinutes = startTime[0] * 60 + startTime[1];
          const endMinutes = endTime[0] * 60 + endTime[1];
          if (startMinutes >= endMinutes) {
            errorMessage = "L'heure de début doit être antérieure à l'heure de fin.";
          }
        }
      }
      
      setError(errorMessage);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleDateChange = (index: number, value: string) => {
    const nextDates = [...formData.dates];
    nextDates[index] = value;
    setFormData({ ...formData, dates: nextDates });
  };

  const handleAddDate = () => {
    if (!formData.dates[formData.dates.length - 1]) {
      return;
    }
    setFormData({ ...formData, dates: [...formData.dates, ''] });
  };

  const handleRemoveDate = (index: number) => {
    if (formData.dates.length === 1) {
      return;
    }
    const nextDates = formData.dates.filter((_, idx) => idx !== index);
    setFormData({ ...formData, dates: nextDates });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide.');
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      setPhoto(file);
      setError(null);
      
      // Créer une prévisualisation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      setError("Veuillez remplir tous les champs avant de soumettre.");
      return;
    }

    // Validation spécifique pour récurrence
    if (formData.isRecurring && !formData.recurringDay) {
      setError("Veuillez sélectionner un jour de la semaine pour la session récurrente.");
      return;
    }

    // Si récurrent, utiliser "RÉCURRENT" comme marqueur, sinon normaliser les dates
    let finalDate: string;
    if (formData.isRecurring) {
      // Utiliser 'RÉCURRENT' pour les sessions récurrentes
      finalDate = 'RÉCURRENT';
    } else {
      const normalizedDates = Array.from(new Set(formData.dates.filter(Boolean))).sort();
      if (normalizedDates.length === 0) {
        setError("Veuillez ajouter au moins une date.");
        return;
      }
      finalDate = normalizedDates.join(' | ');
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convertir la photo en base64 si elle existe
      let photoBase64 = null;
      if (photo) {
        photoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo);
        });
      }

      // Préparer la description avec info récurrence
      // La description reste telle quelle, le badge récurrent est affiché visuellement
      let finalDescription = formData.description.trim();

      await db.addSession({
        title: formData.title.trim(),
        club: formData.club.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        date: finalDate,
        time: `${formData.timeStart} - ${formData.timeEnd}`,
        price: formData.price.trim(),
        type: formData.type as any,
        description: finalDescription,
        coordinates: { lat: 48.8566, lng: 2.3522, x: 50, y: 50 },
        ...(photoBase64 && { photo: photoBase64 }),
        ...(formData.instagram.trim() && { instagram: formData.instagram.trim() })
      });
      
      // Données soumises avec succès
      setIsSubmitting(false);
      
      // Scroller en haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Démarrer les feux d'artifice
      setShowFireworks(true);
      setSuccess(true);
      
      // Réinitialiser le formulaire après 25 secondes
      setTimeout(() => {
        setFormData({
          title: '', club: '', city: '', address: '', dates: [''],
          timeStart: '', timeEnd: '', type: 'JJB', price: '', description: '', instagram: '',
          isRecurring: false, recurringDay: ''
        });
        setPhoto(null);
        setPhotoPreview(null);
        setCompletedSteps([]);
        setCurrentStep(1);
      }, 25000);
      
      // Redirection automatique vers /explorer après 28 secondes
      setTimeout(() => {
        navigate('/explorer');
      }, 28000);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la session:", err);
      setError("Erreur critique : Échec de la communication avec le réseau. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 relative">
        {showFireworks && <Fireworks />}
        <div className="max-w-2xl w-full border border-white/10 p-8 sm:p-12 md:p-24 text-center reveal active relative z-50" data-always-active="true">
          <div className="inline-flex items-center justify-center h-20 w-20 border border-white/20 rounded-full mb-12 animate-pulse">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter italic">TRANSMIS.</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-16 leading-loose">
            Session injectée avec succès.<br />
            Validation du noeud sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1 bg-white text-black py-5 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-zinc-200 transition-all text-center">
              Terminer
            </Link>
            <button 
              onClick={() => {
                setSuccess(false);
                setShowFireworks(false);
                setFormData({
                  title: '', club: '', city: '', address: '', dates: [''],
                  timeStart: '', timeEnd: '', type: 'JJB', price: '', description: '', instagram: '',
                  isRecurring: false, recurringDay: ''
                });
                setPhoto(null);
                setPhotoPreview(null);
                setError(null);
                setCompletedSteps([]);
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex-1 border border-white/10 text-white py-5 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-white/5 transition-all"
            >
              Nouvelle Saisie
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps.find(s => s.id === currentStep);

  return (
    <>
      <SEO 
        title="Publier votre Session Open Mat JJB Gratuitement | Attirez de nouveaux pratiquants"
        description="📢 Publiez gratuitement votre session Open Mat de JJB, Luta Livre ou Grappling. Touchez des milliers de pratiquants en France. Inscription simple et rapide. Visible en 24h."
        keywords="publier open mat, créer session jjb, annoncer open mat, session grappling, académie jjb, luta livre france, organiser open mat, promouvoir club jjb, attirer pratiquants jjb, visibilité académie jjb, marketing club grappling"
        type="website"
      />
      <div className="relative bg-black min-h-screen pt-8 pb-20 overflow-x-hidden">
        <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40"></div>

        <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 italic">PUBLIER.</h1>
          <p className="text-base md:text-lg text-white/40 font-light">
            Intégrez votre infrastructure à l'écosystème <span className="text-white">Grappling</span> national.
          </p>
        </header>

        {/* Indicateur de progression */}
        <div className="mb-10">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 sm:gap-0 mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1 min-w-[90px]">
                  <div className="relative w-10 h-10">
                    {/* Cercle de fond */}
                    <div className={`absolute inset-0 rounded-full border-2 transition-all ${
                      completedSteps.includes(step.id)
                        ? 'border-white bg-white'
                        : 'border-white/20 bg-transparent'
                    }`}></div>
                    
                    {/* Animation de remplissage pour l'étape active */}
                    {currentStep === step.id && !completedSteps.includes(step.id) && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle
                          cx="20"
                          cy="20"
                          r="18"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeDasharray="113"
                          strokeDashoffset="0"
                          className="animate-[fillCircle_2s_ease-in-out_infinite]"
                        />
                      </svg>
                    )}
                    
                    {/* Contenu du cercle */}
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      currentStep === step.id && !completedSteps.includes(step.id) ? 'animate-pulse' : ''
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-5 w-5 text-black" />
                      ) : (
                        <span className="text-[10px] font-black text-white">{step.id}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-widest mt-2 ${
                    currentStep === step.id ? 'text-white' : 'text-white/30'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-[1px] mx-3 transition-all ${
                    completedSteps.includes(step.id) ? 'bg-white' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 border border-red-900/50 bg-red-950/10 flex items-center gap-4 text-white">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
          </div>
        )}

        {/* Formulaire par étapes */}
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 md:p-12">
          {/* Étape 1: Identification */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-[12px] font-black tracking-[0.5em] uppercase text-white mb-8 opacity-60">
                01 / IDENTIFICATION DU NOEUD
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Nom de la Session"
                required 
                type="text" 
                placeholder="EX: OPEN MAT NO-GI PRO"
                value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
              {/* Champ avec autocomplétion pour le club */}
              <div className="space-y-2 relative" ref={clubInputRef}>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                  Académie Hôte *
                </label>
                <input
                  required
                  type="text"
                  placeholder="EX: ALPHA FIGHT CLUB"
                  value={formData.club}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({...formData, club: value});
                    fetchClubs(value);
                    setShowClubSuggestions(true);
                    // Réinitialiser le club sélectionné si l'utilisateur modifie le texte
                    if (selectedClub && value !== selectedClub.name) {
                      setSelectedClub(null);
                    }
                  }}
                  onFocus={() => {
                    if (clubSuggestions.length > 0) {
                      setShowClubSuggestions(true);
                    }
                  }}
                  className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                />
                {/* Badge du club sélectionné */}
                {selectedClub && (
                  <div className="absolute right-2 top-11 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-sm">
                    <img src={selectedClub.logo} alt={selectedClub.name} className="w-4 h-4 object-contain" onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO;
                    }} />
                    <span className="text-[8px] text-white/60 font-bold">{selectedClub.academy || selectedClub.type}</span>
                  </div>
                )}
                {/* Dropdown de suggestions */}
                {showClubSuggestions && clubSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-black border border-white/20 max-h-72 overflow-y-auto shadow-2xl">
                    {clubSuggestions.map((club, index) => (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => handleSelectClub(club)}
                        className="w-full px-6 py-4 text-left hover:bg-white/10 transition-all border-b border-white/5 last:border-b-0 flex items-center gap-4"
                      >
                        <img 
                          src={club.logo} 
                          alt={club.name} 
                          className="w-8 h-8 object-contain bg-white/5 rounded-sm p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO;
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-white text-xs font-bold uppercase tracking-widest">
                            {club.name}
                          </div>
                          <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-1">
                            {club.city} • {club.academy || club.type}
                          </div>
                        </div>
                      </button>
                    )                    )}
                  </div>
                )}
              </div>
              <InputField
                label="Instagram du Club (optionnel)"
                type="text"
                placeholder="EX: @THOMAS_ALPHA_FIGHT_CLUB"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
              />
              </div>
            </div>
          )}

          {/* Étape 2: Logistique */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-[12px] font-black tracking-[0.5em] uppercase text-white mb-8 opacity-60">
                02 / PARAMÈTRES LOGISTIQUES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Champ avec autocomplétion pour la ville */}
                <div className="space-y-2 relative" ref={cityInputRef}>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Localisation (Ville)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="PARIS"
                    value={formData.city}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, city: value});
                      fetchCities(value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => {
                      if (citySuggestions.length > 0) {
                        setShowCitySuggestions(true);
                      }
                    }}
                    className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                  />
                  {/* Dropdown de suggestions */}
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-black border border-white/20 max-h-60 overflow-y-auto shadow-2xl">
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, city});
                            setShowCitySuggestions(false);
                            setCitySuggestions([]);
                          }}
                          className="w-full px-6 py-4 text-left text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border-b border-white/5 last:border-b-0"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Option Récurrence */}
              <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
                      🔄 Session Récurrente
                    </label>
                    <p className="text-[9px] text-white/40 mt-1 uppercase tracking-wider">
                      Pour les sessions hebdomadaires régulières
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isRecurring: !formData.isRecurring, dates: [''], recurringDay: ''})}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      formData.isRecurring ? 'bg-white' : 'bg-white/10'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform ${
                      formData.isRecurring ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/40'
                    }`} />
                  </button>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-2 mt-4">
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                      Jour de la semaine *
                    </label>
                    <select
                      required={formData.isRecurring}
                      value={formData.recurringDay}
                      onChange={(e) => setFormData({...formData, recurringDay: e.target.value})}
                      className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all appearance-none cursor-pointer select-custom"
                    >
                      <option value="">SÉLECTIONNER UN JOUR</option>
                      <option value="Lundi">LUNDI</option>
                      <option value="Mardi">MARDI</option>
                      <option value="Mercredi">MERCREDI</option>
                      <option value="Jeudi">JEUDI</option>
                      <option value="Vendredi">VENDREDI</option>
                      <option value="Samedi">SAMEDI</option>
                      <option value="Dimanche">DIMANCHE</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dates (seulement si non récurrent) */}
              {!formData.isRecurring && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">
                    Dates de déploiement *
                  </label>
                  <div className="space-y-3">
                    {formData.dates.map((dateValue, index) => (
                      <div key={`date-${index}`} className="flex items-center gap-3">
                        <input
                          required
                          type="date"
                          value={dateValue}
                          onChange={(e) => handleDateChange(index, e.target.value)}
                          className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(index)}
                          className={`h-12 w-12 border border-white/10 flex items-center justify-center transition-all ${
                            formData.dates.length === 1
                              ? 'text-white/20 cursor-not-allowed'
                              : 'text-white/50 hover:text-white hover:border-white/40'
                          }`}
                          disabled={formData.dates.length === 1}
                          aria-label="Supprimer cette date"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddDate}
                      className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
                    >
                      <Plus className="h-3 w-3" /> Ajouter une date
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField 
                  label="Heure de début"
                required 
                type="time" 
                value={formData.timeStart} 
                  onChange={(e) => setFormData({...formData, timeStart: e.target.value})} 
              />
              <InputField 
                  label="Heure de fin"
                required 
                type="time" 
                value={formData.timeEnd} 
                  onChange={(e) => setFormData({...formData, timeEnd: e.target.value})} 
              />
                <div className="space-y-2 relative group">
                <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Spécialité</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white/[0.07] border border-white/20 h-14 px-6 pr-12 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-white/60 hover:border-white/40 hover:bg-white/[0.1] transition-all cursor-pointer appearance-none select-custom"
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="JJB">JJB (GI)</option>
                      <option value="Luta Livre">LUTA LIVRE (NO-GI)</option>
                      <option value="Mixte">MIXTE / GRAPPLING</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-hover:text-white/60 transition-all duration-300 pointer-events-none group-hover:translate-y-[-40%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Détails */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-[12px] font-black tracking-[0.5em] uppercase text-white mb-8 opacity-60">
                03 / ACCÈS & PROTOCOLE
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField 
                label="Adresse Physique"
                required 
                type="text" 
                placeholder="RUE, CODE POSTAL..."
                value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
              <InputField 
                label="Contribution / Tarif"
                type="text" 
                placeholder="EX: 10€ (Optionnel)"
                value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
              />
            </div>
              <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Détails Techniques</label>
              <textarea 
                required 
                  className="w-full bg-white/[0.07] border border-white/20 p-6 min-h-[150px] text-white text-xs font-medium leading-relaxed outline-none focus:border-white/60 transition-all placeholder:text-white/10"
                placeholder="NIVEAU REQUIS, ÉQUIPEMENT, RÈGLES D'HYGIÈNE..."
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

              {/* Champ d'upload de photo */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Photo (Optionnel)</label>
                {!photoPreview ? (
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
                      onChange={handlePhotoChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-full">
                    <div className="relative w-full h-64 border border-white/20 bg-white/[0.02] overflow-hidden group">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 p-2 bg-black/80 border border-white/20 text-white hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-[8px] text-white/40 uppercase tracking-wider text-center">
                      {photo?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-12 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] border transition-all ${
                currentStep === 1
                  ? 'border-white/10 text-white/20 cursor-not-allowed'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              PRÉCÉDENT
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 sm:px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 sm:gap-3"
              >
                SUIVANT <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
            <button 
              type="submit" 
              disabled={isSubmitting} 
                className="px-4 sm:px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                  <>INITIALISATION... <Loader2 className="animate-spin h-4 w-4" /></>
              ) : (
                  <>DÉPLOYER <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            )}
          </div>
        </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fillCircle {
          0% {
            stroke-dashoffset: 113;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 56;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
        }
        select option {
          background-color: #000;
          color: #fff;
          padding: 20px;
        }
      `}</style>
    </>
  );
};

export default AddOpenMat;
