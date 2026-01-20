
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Info, CheckCircle2, Globe, Shield, Zap, Plus, ChevronDown } from 'lucide-react';

const FillingLine = () => (
  <div className="relative h-[1px] w-full bg-white/10 overflow-hidden my-24">
    <div className="absolute inset-0 bg-white/40 animate-[slideHorizontal_6s_infinite]" />
  </div>
);

const AboutBlock = ({ title, content, icon: Icon, delay = 0 }) => (
  <div className="reveal group border border-white/5 bg-white/[0.01] p-12 transition-all hover:border-white/20" style={{ transitionDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between mb-16">
      <div className="h-12 w-12 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/40 transition-all">
        <Icon className="h-5 w-5" />
      </div>
      <Plus className="h-4 w-4 text-white/10" />
    </div>
    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">{title}</h3>
    <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
      {content}
    </p>
  </div>
);

const ModusOperandiFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    {
      step: "01",
      question: "Les responsables de clubs publient leurs créneaux libres via notre terminal.",
      answer: "Les académies accèdent à notre plateforme sécurisée pour enregistrer leurs sessions d'Open Mat. Le processus est simple : identification du club, sélection du créneau horaire, définition des paramètres (niveau requis, équipement, tarif). Chaque publication est instantanément soumise à notre protocole de validation."
    },
    {
      step: "02",
      question: "Notre équipe vérifie l'authenticité et la conformité de l'académie.",
      answer: "Chaque nouvelle académie est vérifiée manuellement par notre équipe. Nous validons l'existence physique du club, ses certifications, et sa conformité aux standards de sécurité et d'hygiène. Cette étape garantit la qualité et la fiabilité du réseau. Le délai de validation est généralement de 24 à 48 heures."
    },
    {
      step: "03",
      question: "La session est injectée dans le réseau national en temps réel.",
      answer: "Une fois validée, la session apparaît immédiatement sur la carte interactive du site. Les pratiquants peuvent la localiser géographiquement, consulter tous les détails techniques (adresse, horaires, tarifs, niveau requis), et s'inscrire pour participer. Le système est synchronisé en temps réel sur tous les appareils."
    },
    {
      step: "04",
      question: "Les pratiquants accèdent aux détails techniques et rejoignent le tapis.",
      answer: "Les grapplers consultent les informations complètes de chaque session : adresse précise, créneaux horaires, tarifs, niveau technique requis, équipement nécessaire (GI/NO-GI), et règles spécifiques. Ils peuvent ensuite se rendre directement à l'académie pour participer à l'Open Mat. Aucune réservation préalable n'est requise, mais nous recommandons de vérifier les disponibilités."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`border border-white/5 bg-white/[0.01] transition-all duration-300 overflow-hidden ${
            openIndex === idx ? 'border-white/20 bg-white/[0.02]' : 'hover:border-white/10'
          }`}
        >
          <button
            onClick={() => toggleItem(idx)}
            className="w-full flex items-start gap-6 p-6 text-left group cursor-pointer"
          >
            <span className={`font-black text-2xl tracking-tighter transition-colors flex-shrink-0 ${
              openIndex === idx ? 'text-white' : 'text-white/20 group-hover:text-white'
            }`}>
              {item.step}
            </span>
            <div className="flex-1 flex items-start justify-between gap-4">
              <p className={`font-medium text-sm leading-relaxed transition-colors pt-1 ${
                openIndex === idx ? 'text-white' : 'text-white/40 group-hover:text-white/70'
              }`}>
                {item.question}
              </p>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 text-white/30 ${
                  openIndex === idx ? 'rotate-180 text-white' : ''
                }`}
              />
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6 pl-[72px]">
              <p className="text-white/60 text-sm font-medium leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const About: React.FC = () => {
  // Auto-scroll en haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-black min-h-screen pt-32 pb-60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <header className="max-w-4xl reveal active" data-always-active="true">
          <div className="flex items-center gap-4 mb-10 opacity-30">
            <div className="h-[1px] w-12 bg-white"></div>
            <span className="text-[10px] font-bold tracking-[0.6em] uppercase">Document de référence</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase mb-12 italic">MISSION.</h1>
          <p className="text-xl md:text-2xl text-white/40 font-light leading-relaxed tracking-wide">
            OpenMat France est l'infrastructure numérique dédiée à la <span className="text-white">décentralisation</span> et à l'organisation du grappling français.
          </p>
        </header>

        <FillingLine />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/5 border border-white/5 overflow-hidden">
          <AboutBlock 
            title="Vision"
            content="Nous croyons en la force du tapis libre. Notre plateforme facilite la connexion entre les académies et les pratiquants sans distinction d'origine club."
            icon={Globe}
            delay={100}
          />
          <AboutBlock 
            title="L'Open Mat"
            content="Une session d'entraînement libre, sans cours structuré. L'essence même du grappling : échange technique et sparring dans le respect absolu."
            icon={Zap}
            delay={200}
          />
          <AboutBlock 
            title="Sécurité"
            content="Chaque session référencée adhère à notre protocole de sécurité et d'hygiène. La confiance est le socle de notre réseau."
            icon={Shield}
            delay={300}
          />
        </div>

        <FillingLine />

        {/* Technical Process */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="reveal active" data-always-active="true">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-10">MODUS<br />OPERANDI.</h2>
            <ModusOperandiFAQ />
          </div>
          
          <div className="reveal active border border-white/10 p-16 bg-white/[0.01] flex flex-col items-center text-center" data-always-active="true" style={{ transitionDelay: '200ms' }}>
             <HelpCircle className="h-16 w-16 text-white/10 mb-12" />
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">UNE QUESTION ?</h3>
             <p className="text-white/40 text-sm mb-12 leading-relaxed">
               Besoin d'aide pour configurer votre académie sur le réseau ? Notre support technique est à votre disposition.
             </p>
             <Link to="/contact" className="px-12 py-5 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
               Contacter le support
             </Link>
          </div>
        </section>
      </div>
      <style>{`
        @keyframes slideHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default About;
