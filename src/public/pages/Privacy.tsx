import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, UserCheck, Plus, ArrowRight, Database, Clock, FileText, Server, Globe, AlertCircle } from 'lucide-react';

const FillingLine = () => (
  <div className="relative h-[1px] w-full bg-white/10 overflow-hidden my-24">
    <div className="absolute inset-0 bg-white/40 animate-[slideHorizontal_6s_infinite]" />
  </div>
);

const PrivacyBlock = ({ title, content, icon: Icon, delay = 0 }: { title: string; content: string; icon: any; delay?: number }) => (
  <div className="reveal active group border border-white/5 bg-white/[0.01] p-6 sm:p-8 lg:p-12 transition-all hover:border-white/20" style={{ transitionDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between mb-8 sm:mb-12 lg:mb-16">
      <div className="h-10 w-10 sm:h-12 sm:w-12 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/40 transition-all">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white/10" />
    </div>
    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">{title}</h3>
    <p className="text-white/40 text-xs sm:text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
      {content}
    </p>
  </div>
);

const PrivacySection = ({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) => (
  <div className="reveal active mb-12 sm:mb-16 lg:mb-24" style={{ transitionDelay: `${delay}ms` }}>
    <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-12 lg:p-16 relative group hover:border-white/20 transition-all">
      <div className="absolute top-0 left-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>
      <div className="absolute top-0 right-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>
      
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 opacity-40">
        <span className="text-[8px] sm:text-[9px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white">{title}</span>
        <div className="h-[1px] flex-grow bg-white/10"></div>
      </div>
      {children}
    </div>
  </div>
);

const Privacy: React.FC = () => {
  return (
    <div className="bg-black min-h-screen pt-24 sm:pt-32 pb-20 sm:pb-40 lg:pb-60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <header className="max-w-4xl reveal active" data-always-active="true">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 opacity-30">
            <div className="h-[1px] w-8 sm:w-12 bg-white"></div>
            <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.6em] uppercase">Document légal</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-8 sm:mb-12 italic">CONFIDENTIALITÉ.</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/40 font-light leading-relaxed tracking-wide">
            Chez OpenMat France, nous prenons la <span className="text-white">confidentialité</span> de vos informations personnelles très au sérieux.
          </p>
          <p className="text-xs sm:text-sm text-white/30 font-medium mt-4 sm:mt-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <FillingLine />

        {/* Introduction */}
        <div className="max-w-4xl mb-12 sm:mb-16 lg:mb-24">
          <div className="reveal active border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-12 lg:p-16 relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 left-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>
            <div className="absolute top-0 right-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>
            <p className="text-base sm:text-lg text-white/60 font-medium leading-relaxed mb-4 sm:mb-6">
              Cette politique de confidentialité décrit comment OpenMat France collecte, utilise, stocke et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <p className="text-xs sm:text-sm text-white/40 font-medium leading-relaxed">
              En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique. Nous nous engageons à respecter votre vie privée et à protéger vos informations personnelles.
            </p>
          </div>
        </div>

        {/* Privacy Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5 border border-white/5 overflow-hidden mb-12 sm:mb-16 lg:mb-24">
          <PrivacyBlock
            title="Utilisation Interne"
            content="Vos informations personnelles sont utilisées uniquement pour les besoins de la plateforme, comme la gestion des sessions et la communication. Aucune donnée n'est exploitée à des fins commerciales ou partagée avec des partenaires publicitaires."
            icon={Lock}
            delay={100}
          />
          <PrivacyBlock
            title="Non-Partage"
            content="Nous ne partageons pas vos informations avec des tiers sans votre consentement explicite, sauf obligation légale ou judiciaire. Votre confiance est notre priorité absolue."
            icon={EyeOff}
            delay={200}
          />
          <PrivacyBlock
            title="Sécurité Maximale"
            content="Nous mettons en œuvre des mesures de sécurité avancées (chiffrement SSL/TLS, base de données sécurisée Neon PostgreSQL, authentification forte) pour protéger vos données contre les accès non autorisés."
            icon={ShieldCheck}
            delay={300}
          />
          <PrivacyBlock
            title="Vos Droits RGPD"
            content="Vous avez le droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition concernant vos données personnelles. Vous pouvez exercer ces droits à tout moment."
            icon={UserCheck}
            delay={400}
          />
        </div>

        <FillingLine />

        {/* Collecte de Données */}
        <PrivacySection title="01 / COLLECTE DE DONNÉES" delay={100}>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <Database className="h-5 w-5 text-white/40" /> Types de données collectées
              </h3>
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <p><strong className="text-white">Données d'identification :</strong> Nom, prénom, email (lors de la publication d'une session)</p>
                <p><strong className="text-white">Données de localisation :</strong> Ville, adresse complète (pour les sessions d'Open Mat)</p>
                <p><strong className="text-white">Données techniques :</strong> Adresse IP, type de navigateur, cookies (pour le fonctionnement du site)</p>
                <p><strong className="text-white">Données de contenu :</strong> Informations saisies dans les formulaires (titre de session, description, horaires, tarifs)</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <FileText className="h-5 w-5 text-white/40" /> Finalités de traitement
              </h3>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed list-none">
                <li className="flex items-start gap-3">
                  <span className="text-white/20 mt-1">•</span>
                  <span>Gestion et publication des sessions d'Open Mat sur la plateforme</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/20 mt-1">•</span>
                  <span>Amélioration de l'expérience utilisateur et du fonctionnement du site</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/20 mt-1">•</span>
                  <span>Communication avec les utilisateurs (réponses aux demandes de contact)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/20 mt-1">•</span>
                  <span>Respect des obligations légales et réglementaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/20 mt-1">•</span>
                  <span>Prévention de la fraude et sécurisation de la plateforme</span>
                </li>
              </ul>
            </div>
          </div>
        </PrivacySection>

        {/* Base Légale */}
        <PrivacySection title="02 / BASE LÉGALE DU TRAITEMENT" delay={200}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <p>
              Le traitement de vos données personnelles est fondé sur les bases légales suivantes :
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-1">•</span>
                <span><strong className="text-white">Consentement :</strong> Pour la publication de sessions et l'utilisation de cookies non essentiels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-1">•</span>
                <span><strong className="text-white">Exécution d'un contrat :</strong> Pour la fourniture des services de la plateforme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-1">•</span>
                <span><strong className="text-white">Intérêt légitime :</strong> Pour l'amélioration du service et la sécurité de la plateforme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-1">•</span>
                <span><strong className="text-white">Obligation légale :</strong> Pour le respect des obligations légales et réglementaires</span>
              </li>
            </ul>
          </div>
        </PrivacySection>

        {/* Conservation */}
        <PrivacySection title="03 / DURÉE DE CONSERVATION" delay={300}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-white/40 mt-1 flex-shrink-0" />
              <div>
                <p className="mb-4">
                  <strong className="text-white">Données de sessions :</strong> Conservées jusqu'à la date de l'événement + 1 an, puis archivées pendant 3 ans pour des raisons légales.
                </p>
                <p className="mb-4">
                  <strong className="text-white">Données de contact :</strong> Conservées pendant 3 ans à compter du dernier contact, sauf opposition de votre part.
                </p>
                <p>
                  <strong className="text-white">Données techniques :</strong> Conservées pendant 13 mois maximum conformément à la réglementation sur les cookies.
                </p>
              </div>
            </div>
          </div>
        </PrivacySection>

        {/* Droits RGPD */}
        <PrivacySection title="04 / VOS DROITS" delay={400}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <p className="mb-6">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white font-bold mb-2">Droit d'accès</p>
                <p className="text-sm">Vous pouvez obtenir une copie de vos données personnelles.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Droit de rectification</p>
                <p className="text-sm">Vous pouvez corriger vos données inexactes ou incomplètes.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Droit à l'effacement</p>
                <p className="text-sm">Vous pouvez demander la suppression de vos données dans certains cas.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Droit à la limitation</p>
                <p className="text-sm">Vous pouvez demander la limitation du traitement de vos données.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Droit à la portabilité</p>
                <p className="text-sm">Vous pouvez récupérer vos données dans un format structuré.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Droit d'opposition</p>
                <p className="text-sm">Vous pouvez vous opposer au traitement de vos données.</p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white/[0.02] border border-white/5">
              <p className="text-white font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Pour exercer vos droits
              </p>
              <p className="text-sm">
                Contactez-nous à <strong className="text-white">adelloukal2@gmail.com</strong> avec la mention "Exercice de droits RGPD" et une copie de votre pièce d'identité. Nous répondrons dans un délai d'un mois.
              </p>
            </div>
          </div>
        </PrivacySection>

        {/* Cookies */}
        <PrivacySection title="05 / COOKIES ET TRACEURS" delay={500}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <p>
              Notre site utilise des cookies et technologies similaires pour assurer le bon fonctionnement de la plateforme et améliorer votre expérience.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-white font-bold mb-2">Cookies essentiels</p>
                <p className="text-sm">Nécessaires au fonctionnement du site (authentification, sécurité). Ils ne peuvent pas être désactivés.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Cookies de performance</p>
                <p className="text-sm">Nous n'utilisons pas de cookies de suivi publicitaire ou de profilage. Aucune donnée n'est partagée avec des réseaux publicitaires.</p>
              </div>
            </div>
            <p className="text-sm mt-6">
              Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
            </p>
          </div>
        </PrivacySection>

        {/* Sécurité */}
        <PrivacySection title="06 / SÉCURITÉ DES DONNÉES" delay={600}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <Server className="h-5 w-5 text-white/40 mt-1 flex-shrink-0" />
              <div>
                <p className="mb-4">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                </p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-white/20 mt-1">•</span>
                    <span>Chiffrement SSL/TLS pour toutes les communications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/20 mt-1">•</span>
                    <span>Base de données sécurisée Neon PostgreSQL avec authentification forte</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/20 mt-1">•</span>
                    <span>Sauvegardes régulières et sécurisées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/20 mt-1">•</span>
                    <span>Accès restreint aux données personnelles (principe du moindre privilège)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/20 mt-1">•</span>
                    <span>Surveillance et détection d'intrusions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </PrivacySection>

        {/* Transferts */}
        <PrivacySection title="07 / TRANSFERTS DE DONNÉES" delay={700}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-white/40 mt-1 flex-shrink-0" />
              <div>
                <p className="mb-4">
                  Vos données sont hébergées sur des serveurs situés dans l'Union Européenne (région EU-West-1 pour Neon PostgreSQL).
                </p>
                <p>
                  Aucun transfert de données personnelles n'est effectué vers des pays tiers en dehors de l'UE. Si un tel transfert devait avoir lieu, il serait encadré par des garanties appropriées conformes au RGPD.
                </p>
              </div>
            </div>
          </div>
        </PrivacySection>

        {/* Modifications */}
        <PrivacySection title="08 / MODIFICATIONS" delay={800}>
          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une mise à jour de la date de dernière modification.
            </p>
            <p>
              En cas de modification substantielle, nous vous en informerons par email ou via une notification sur la plateforme.
            </p>
          </div>
        </PrivacySection>

        <FillingLine />

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto">
          <div className="reveal active border border-white/10 p-8 sm:p-12 lg:p-16 bg-white/[0.01] flex flex-col items-center text-center" data-always-active="true">
            <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 text-white/10 mb-8 sm:mb-12" />
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8">QUESTIONS ?</h3>
            <p className="text-white/40 text-xs sm:text-sm mb-8 sm:mb-12 leading-relaxed max-w-md px-4">
              Si vous avez des préoccupations concernant vos données ou souhaitez exercer vos droits, n'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <Link 
              to="/contact" 
              className="px-8 sm:px-12 py-4 sm:py-5 border border-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:bg-white hover:text-black transition-all flex items-center gap-3 group"
            >
              Nous Contacter <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
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

export default Privacy;
