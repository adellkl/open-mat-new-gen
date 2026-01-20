import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { db } from '../../database/db';
import { OpenMatSession } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  navigationButtons?: { label: string; path: string }[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allSessions, setAllSessions] = useState<OpenMatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Charger toutes les sessions au démarrage
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await db.getSessions('approved');
        setAllSessions(sessions);
      } catch (error) {
        console.error('Erreur chargement sessions:', error);
      }
    };
    loadSessions();
  }, []);

  // Message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Salut ! Je suis l'**Assistant IA** d'OpenMat France.\n\n" +
        "Je peux t'aider à :\n" +
        "• 🔍 Trouver des open mats par ville\n" +
        "• 📋 Naviguer sur le site\n" +
        "• ❓ Répondre à tes questions\n\n" +
        "Pose-moi une question !",
        [
          { label: "🔍 Trouver un Open Mat", path: "/explorer" },
          { label: "➕ Publier une Session", path: "/publier" },
          { label: "📧 Contact", path: "/contact" }
        ]
      );
    }
  }, [isOpen]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bloquer le scroll de la page quand le chatbot est ouvert
  useEffect(() => {
    if (isOpen) {
      // Bloquer le scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Éviter le saut dû à la scrollbar
    } else {
      // Débloquer le scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const addBotMessage = (text: string, navigationButtons?: { label: string; path: string }[]) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      navigationButtons
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const findSessionsByCity = (city: string): OpenMatSession[] => {
    const normalizedCity = city.toLowerCase().trim();
    return allSessions.filter(session =>
      session.city.toLowerCase().includes(normalizedCity)
    );
  };

  const extractCityFromMessage = (message: string): string | null => {
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'bordeaux', 'lille', 'strasbourg', 'rennes', 'montpellier', 'grenoble', 'dijon', 'angers', 'reims', 'brest', 'tours', 'amiens', 'limoges', 'clermont', 'besancon', 'besançon', 'orléans', 'orleans', 'rouen', 'caen', 'nancy', 'argenteuil', 'mulhouse', 'montreuil', 'saint-denis', 'roubaix', 'tourcoing', 'avignon', 'poitiers', 'nanterre', 'créteil', 'creteil', 'versailles', 'courbevoie', 'pau', 'colombes', 'aulnay', 'asnières', 'asnieres', 'rueil', 'antibes', 'cannes', 'dunkerque', 'quimper', 'valence', 'bourges', 'calais', 'beauvais', 'metz', 'sarcelles', 'saint-maur', 'pessac', 'ivry', 'cergy', 'chambéry', 'chambery', 'lorient', 'niort', 'villejuif', 'saint-andré', 'saint-andre', 'épinay', 'epinay', 'hyères', 'hyeres', 'saint-quentin', 'noisy', 'évry', 'evry', 'antony', 'villeneuve', 'neuilly', 'troyes', 'la rochelle', 'montauban', 'cholet', 'vannes', 'issy', 'levallois', 'ajaccio', 'bastia', 'bayonne', 'angoulême', 'angouleme', 'blois', 'charleville', 'laval', 'albi', 'évreux', 'evreux', 'auxerre', 'nevers', 'arras'];
    const lowerMessage = message.toLowerCase();

    for (const city of cities) {
      if (lowerMessage.includes(city)) {
        return city;
      }
    }
    return null;
  };

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // ==================== RECHERCHE PAR VILLE ====================
    const city = extractCityFromMessage(message);
    if (city || lowerMessage.includes('ville') || lowerMessage.includes('où') || lowerMessage.includes('ou') || lowerMessage.includes('region') || lowerMessage.includes('région') || lowerMessage.includes('departement') || lowerMessage.includes('département')) {
      if (city) {
        const sessions = findSessionsByCity(city);
        if (sessions.length > 0) {
          addBotMessage(
            `🎯 J'ai trouvé **${sessions.length}** open mat${sessions.length > 1 ? 's' : ''} à **${city.toUpperCase()}** !`,
            [{ label: `Voir les ${sessions.length} sessions`, path: "/explorer" }]
          );
        } else {
          addBotMessage(
            `😕 Désolé, aucun open mat trouvé à **${city}**.\n\nEssaie une autre ville ou explore toutes les sessions !`,
            [{ label: "🔍 Voir toutes les sessions", path: "/explorer" }]
          );
        }
      } else {
        addBotMessage(
          "🗺️ Pour quelle ville ?\n\nExemple : *Paris*, *Lyon*, *Marseille*...",
          [{ label: "🔍 Explorer par ville", path: "/explorer" }]
        );
      }
      return;
    }

    // ==================== QU'EST-CE QU'UN OPEN MAT ====================
    if (lowerMessage.includes('open mat') || lowerMessage.includes('openmat') || (lowerMessage.includes('c\'est quoi') && !lowerMessage.includes('site')) || lowerMessage.includes('cest quoi') || lowerMessage.includes('definition') || lowerMessage.includes('définition') || lowerMessage.includes('explique') || lowerMessage.includes('expliquer')) {
      addBotMessage(
        "🥋 **Qu'est-ce qu'un Open Mat ?**\n\n" +
        "Un **Open Mat** est une session d'entraînement libre de grappling (JJB, Luta Livre, etc.) où tu peux :\n\n" +
        "• **Rouler librement** avec d'autres pratiquants\n" +
        "• **Travailler tes techniques** à ton rythme\n" +
        "• **Rencontrer** des gens d'autres clubs\n" +
        "• **Progresser** en sparring libre\n\n" +
        "💡 **Avantages** :\n" +
        "✅ Ambiance décontractée\n" +
        "✅ Pas de cours structuré\n" +
        "✅ Tous niveaux acceptés (généralement)\n" +
        "✅ Parfait pour développer son jeu\n\n" +
        "C'est comme une \"jam session\" de musique, mais pour le grappling ! 🎸🥋",
        [{ label: "🔍 Trouver un Open Mat", path: "/explorer" }]
      );
      return;
    }

    // ==================== BUT DE L'APPLICATION ====================
    if (lowerMessage.includes('but') || lowerMessage.includes('objectif') || lowerMessage.includes('pourquoi') || lowerMessage.includes('mission') || lowerMessage.includes('utilité') || lowerMessage.includes('utilite') || lowerMessage.includes('sert à quoi') || lowerMessage.includes('sert a quoi') || (lowerMessage.includes('quest ce que') && lowerMessage.includes('site')) || (lowerMessage.includes('qu\'est ce que') && lowerMessage.includes('site'))) {
      addBotMessage(
        "🎯 **Le but d'OpenMat France**\n\n" +
        "**Mission principale** :\n" +
        "Réunir TOUTES les sessions d'open mat de France en un seul endroit ! 🇫🇷\n\n" +
        "**Problème résolu** :\n" +
        "Avant, il fallait chercher sur Facebook, Instagram, appeler les clubs... C'était galère ! 😓\n\n" +
        "**Solution** :\n" +
        "Une plateforme centralisée, gratuite et communautaire où :\n\n" +
        "✅ Les **clubs** peuvent publier leurs sessions\n" +
        "✅ Les **pratiquants** trouvent des open mats facilement\n" +
        "✅ La **communauté** grandit ensemble\n\n" +
        "**Vision** :\n" +
        "Devenir LA référence nationale pour les open mats de grappling ! 🚀\n\n" +
        "Créé par des pratiquants, pour les pratiquants. 💪",
        [
          { label: "📖 En savoir plus", path: "/a-propos" },
          { label: "🔍 Explorer", path: "/explorer" }
        ]
      );
      return;
    }

    // ==================== QUI EST LE DÉVELOPPEUR (VARIANTES MASSIVES) ====================
    if (lowerMessage.includes('developpeur') || lowerMessage.includes('développeur') || lowerMessage.includes('createur') || lowerMessage.includes('créateur') || lowerMessage.includes('fondateur') || lowerMessage.includes('qui a fait') || lowerMessage.includes('qui a créé') || lowerMessage.includes('qui a cree') || lowerMessage.includes('qui a créer') || lowerMessage.includes('qui a creer') || lowerMessage.includes('qui a developpe') || lowerMessage.includes('qui a développé') || lowerMessage.includes('qui a code') || lowerMessage.includes('qui a codé') || lowerMessage.includes('qui a construit') || lowerMessage.includes('qui a realise') || lowerMessage.includes('qui a réalisé') || lowerMessage.includes('adel') || lowerMessage.includes('loukal') || lowerMessage.includes('qui est derriere') || lowerMessage.includes('qui est derrière') || lowerMessage.includes('equipe') || lowerMessage.includes('équipe') || lowerMessage.includes('team') || lowerMessage.includes('proprietaire') || lowerMessage.includes('propriétaire') || lowerMessage.includes('patron') || lowerMessage.includes('boss') || lowerMessage.includes('responsable') || lowerMessage.includes('admin') || lowerMessage.includes('webmaster') || lowerMessage.includes('concepteur') || lowerMessage.includes('architecte')) {
      addBotMessage(
        "👨‍💻 **Créateur : Adel Loukal**\n\n" +
        "**Qui suis-je ?**\n" +
        "Un passionné de JJB qui en avait marre de chercher des open mats partout ! 😅\n\n" +
        "**Parcours** :\n" +
        "🥋 Pratiquant de Jiu-Jitsu Brésilien depuis 2023\n" +
        "💻 Développeur Full-Stack (React, TypeScript, Node.js)\n" +
        "🇫🇷 Basé à Paris, France\n" +
        "🎓 Passionné de code et de grappling\n\n" +
        "**Pourquoi ce projet ?**\n" +
        "J'ai développé OpenMat France en 2026 parce que :\n" +
        "• Je galérais à trouver des open mats près de chez moi\n" +
        "• Les infos étaient dispersées partout (FB, Insta, etc.)\n" +
        "• Je voulais aider la communauté BJJ/Grappling française\n\n" +
        "**Projet solo** :\n" +
        "Oui, c'est un projet solo ! Du design au code, tout est fait maison. 🛠️\n\n" +
        "**Contact** :\n" +
        "📧 adelloukal2@gmail.com\n" +
        "💼 LinkedIn : linkedin.com/in/adel-loukal\n\n" +
        "N'hésite pas à me contacter pour des suggestions, bugs ou juste dire bonjour ! 👋",
        [
          { label: "📧 Contacter Adel", path: "/contact" },
          { label: "📖 En savoir plus", path: "/a-propos" }
        ]
      );
      return;
    }

    // ==================== COMMENT PUBLIER ====================
    if (lowerMessage.includes('publier') || lowerMessage.includes('ajouter') || lowerMessage.includes('creer') || lowerMessage.includes('créer') || lowerMessage.includes('poster') || lowerMessage.includes('proposer') || lowerMessage.includes('soumettre') || lowerMessage.includes('envoyer') || lowerMessage.includes('upload') || lowerMessage.includes('partager une session') || lowerMessage.includes('nouvelle session') || lowerMessage.includes('mon open mat') || lowerMessage.includes('mon club')) {
      addBotMessage(
        "➕ **Publier un Open Mat**\n\n" +
        "**Étapes simples** :\n\n" +
        "1️⃣ Va sur la page **PUBLIER**\n" +
        "2️⃣ Remplis le formulaire en 3 étapes :\n" +
        "   • Infos de base (titre, club, ville)\n" +
        "   • Date et horaires\n" +
        "   • Détails (prix, description, photo)\n" +
        "3️⃣ Clique sur **SOUMETTRE**\n" +
        "4️⃣ Validation par nos modérateurs sous **24-48h** ⚡\n\n" +
        "**Conseils** :\n" +
        "💡 Ajoute une photo de qualité (elle attire plus de monde !)\n" +
        "💡 Décris bien les règles (niveau requis, tarif, équipement...)\n" +
        "💡 Pour les sessions hebdomadaires, utilise l'option \"Récurrent\"\n\n" +
        "**Gratuit & rapide** : 2 minutes chrono ! ⏱️",
        [{ label: "➕ Publier maintenant", path: "/publier" }]
      );
      return;
    }

    // ==================== COMMENT UTILISER / FONCTIONNEMENT ====================
    if ((lowerMessage.includes('comment') && (lowerMessage.includes('utiliser') || lowerMessage.includes('marche') || lowerMessage.includes('fonctionne') || lowerMessage.includes('naviguer') || lowerMessage.includes('trouver') || lowerMessage.includes('chercher'))) || lowerMessage.includes('mode d\'emploi') || lowerMessage.includes('mode demploi') || lowerMessage.includes('tutoriel') || lowerMessage.includes('guide') || lowerMessage.includes('aide') || lowerMessage.includes('documentation')) {
      addBotMessage(
        "📱 **Comment utiliser OpenMat France**\n\n" +
        "**🔍 EXPLORER**\n" +
        "1. Va sur la page Explorer\n" +
        "2. Utilise les filtres (ville, type, date)\n" +
        "3. Parcours les sessions\n" +
        "4. Clique sur \"DÉTAILS\" pour plus d'infos\n\n" +
        "**❤️ FAVORIS**\n" +
        "• Clique sur le ❤️ pour sauvegarder une session\n" +
        "• Filtre par \"Favoris\" pour les retrouver\n\n" +
        "**➕ PUBLIER**\n" +
        "• Formulaire simple en 3 étapes\n" +
        "• Validation sous 24-48h\n\n" +
        "**📲 PARTAGER**\n" +
        "• Clique sur \"Partager\" dans les détails\n" +
        "• Envoie le lien à tes partenaires d'entraînement\n\n" +
        "**💡 TIPS**\n" +
        "✅ Le site fonctionne parfaitement sur mobile\n" +
        "✅ Ajoute-le à ton écran d'accueil pour un accès rapide\n" +
        "✅ Active les notifications (bientôt disponible)\n\n" +
        "C'est intuitif et rapide ! 🚀",
        [
          { label: "🔍 Essayer", path: "/explorer" },
          { label: "📖 Guide complet", path: "/a-propos" }
        ]
      );
      return;
    }

    // ==================== RÈGLES & FONCTIONNEMENT ====================
    if (lowerMessage.includes('regle') || lowerMessage.includes('règle') || lowerMessage.includes('reglement') || lowerMessage.includes('règlement') || lowerMessage.includes('condition') || lowerMessage.includes('autorise') || lowerMessage.includes('autorisé') || lowerMessage.includes('interdit') || lowerMessage.includes('permis') || lowerMessage.includes('politique')) {
      addBotMessage(
        "📋 **Règles & Bonnes Pratiques**\n\n" +
        "**POUR LES PRATIQUANTS** 🥋\n" +
        "✅ Respecte les règles du club hôte\n" +
        "✅ Kimono/rashguard PROPRE obligatoire\n" +
        "✅ Ongles courts\n" +
        "✅ Hygiène irréprochable\n" +
        "✅ Respecte le niveau de chacun\n" +
        "✅ Préviens si tu ne peux pas venir\n\n" +
        "**POUR LES CLUBS** 🏠\n" +
        "✅ Sois clair sur les tarifs\n" +
        "✅ Précise les niveaux acceptés\n" +
        "✅ Mentionne les règles spécifiques\n" +
        "✅ Mets à jour si annulation\n\n" +
        "**SUR LE SITE** 💻\n" +
        "✅ Contenu respectueux uniquement\n" +
        "✅ Infos véridiques\n" +
        "✅ Pas de spam\n" +
        "✅ Respect de la communauté\n\n" +
        "**MODÉRATION**\n" +
        "Toutes les sessions sont vérifiées avant publication. Les abus sont sanctionnés. 🛡️",
        [{ label: "📖 En savoir plus", path: "/a-propos" }]
      );
      return;
    }

    // ==================== NIVEAUX ====================
    if (lowerMessage.includes('niveau') || lowerMessage.includes('debutant') || lowerMessage.includes('débutant') || lowerMessage.includes('blanc') || lowerMessage.includes('bleu') || lowerMessage.includes('commencer') || lowerMessage.includes('debuter') || lowerMessage.includes('débuter') || lowerMessage.includes('jamais fait') || lowerMessage.includes('premiere fois') || lowerMessage.includes('première fois') || lowerMessage.includes('ceinture')) {
      addBotMessage(
        "🎯 **Niveaux & Open Mats**\n\n" +
        "**BONNE NOUVELLE** 🎉\n" +
        "La plupart des open mats acceptent **tous les niveaux**, même débutants !\n\n" +
        "**TYPES D'OPEN MATS** :\n\n" +
        "🟢 **Tous niveaux** (90%)\n" +
        "• Débutants à avancés\n" +
        "• Ambiance bienveillante\n" +
        "• Chacun adapte son intensité\n\n" +
        "🔵 **Intermédiaires+** (8%)\n" +
        "• À partir de ceinture bleue\n" +
        "• Rythme plus soutenu\n\n" +
        "🟣 **Avancés** (2%)\n" +
        "• Compétiteurs / ceintures marron-noires\n• Intensité maximale\n\n" +
        "**CONSEILS DÉBUTANTS** :\n" +
        "💡 Vérifie toujours la description\n" +
        "💡 Privilégie les \"tous niveaux\"\n" +
        "💡 Mentionne ton niveau en arrivant\n" +
        "💡 Les gens sont généralement sympas ! 😊\n\n" +
        "Le niveau est toujours indiqué dans la description de la session.",
        [{ label: "🔍 Trouver un Open Mat", path: "/explorer" }]
      );
      return;
    }

    // ==================== PRIX / TARIFS ====================
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('cout') || lowerMessage.includes('coût') || lowerMessage.includes('payant') || lowerMessage.includes('gratuit') || lowerMessage.includes('combien') || lowerMessage.includes('cher') || lowerMessage.includes('budget') || lowerMessage.includes('abonnement') || lowerMessage.includes('payer') || lowerMessage.includes('argent') || lowerMessage.includes('euros') || lowerMessage.includes('€')) {
      addBotMessage(
        "💰 **Tarifs des Open Mats**\n\n" +
        "**POUR LES MEMBRES DU CLUB HÔTE** 🏠\n" +
        "➡️ Généralement **GRATUIT** ! ✅\n\n" +
        "**POUR LES VISITEURS** 🚶\n" +
        "Les tarifs varient selon les clubs :\n\n" +
        "• **Gratuit** (20%) - Super ! 🎉\n" +
        "• **5-10€** (60%) - Tarif le plus courant\n" +
        "• **10-15€** (15%) - Clubs premium\n" +
        "• **15€+** (5%) - Rare, clubs haut de gamme\n\n" +
        "**MOYENS DE PAIEMENT** 💳\n" +
        "• Espèces (le plus courant)\n" +
        "• CB / Lydia (parfois)\n" +
        "• Virement (pour abonnements)\n\n" +
        "**LE SITE OPENMAT.FR** 📱\n" +
        "➡️ **100% GRATUIT** à utiliser !\n" +
        "• Pas d'abonnement\n" +
        "• Pas de frais cachés\n" +
        "• Pas de pub intrusive\n\n" +
        "💡 **Astuce** : Le tarif est TOUJOURS indiqué sur chaque session !",
        [{ label: "🔍 Voir les tarifs", path: "/explorer" }]
      );
      return;
    }

    // ==================== TYPES / DISCIPLINES ====================
    if (lowerMessage.includes('type') || lowerMessage.includes('jjb') || lowerMessage.includes('jiu jitsu') || lowerMessage.includes('jiu-jitsu') || lowerMessage.includes('bjj') || lowerMessage.includes('luta') || lowerMessage.includes('grappling') || lowerMessage.includes('gi') || lowerMessage.includes('no-gi') || lowerMessage.includes('nogi') || lowerMessage.includes('kimono') || lowerMessage.includes('discipline') || lowerMessage.includes('style') || lowerMessage.includes('technique')) {
      addBotMessage(
        "🥋 **Types d'Open Mat**\n\n" +
        "**3 CATÉGORIES PRINCIPALES** :\n\n" +
        "🥋 **JJB / BJJ (GI)** - 45%\n" +
        "• Jiu-Jitsu Brésilien avec kimono\n" +
        "• Prises au col autorisées\n" +
        "• Plus technique et stratégique\n" +
        "• Ambiance traditionnelle\n\n" +
        "🤼 **LUTA LIVRE / NO-GI** - 40%\n" +
        "• Grappling sans kimono\n" +
        "• Rashguard + short de compression\n" +
        "• Plus rapide et explosif\n" +
        "• Style moderne\n\n" +
        "⚡ **MIXTE / GRAPPLING** - 15%\n" +
        "• Gi ET No-Gi dans la même session\n" +
        "• Parfois d'autres disciplines (judo, lutte...)\n" +
        "• Maximum de variété\n\n" +
        "**DIFFÉRENCES** 🤔\n" +
        "• **Gi** = Plus lent, plus de friction, grips au kimono\n" +
        "• **No-Gi** = Plus rapide, moins de friction, pas de col\n\n" +
        "**CONSEIL** 💡\n" +
        "Essaie les deux ! Beaucoup de pratiquants font Gi ET No-Gi.\n\n" +
        "Tu peux filtrer par type dans l'Explorer ! 🔍",
        [{ label: "🔍 Explorer par type", path: "/explorer" }]
      );
      return;
    }

    // ==================== CONTACT ====================
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('joindre') || lowerMessage.includes('ecrire') || lowerMessage.includes('écrire') || lowerMessage.includes('message') || lowerMessage.includes('question') || lowerMessage.includes('repondre') || lowerMessage.includes('répondre') || lowerMessage.includes('support') || lowerMessage.includes('assistance')) {
      addBotMessage(
        "📧 **Me contacter**\n\n" +
        "**EMAIL** 💌\n" +
        "📮 adelloukal2@gmail.com\n" +
        "⏱️ Réponse sous 24-48h généralement\n\n" +
        "**FORMULAIRE DE CONTACT** 📝\n" +
        "Utilise le formulaire sur le site pour un suivi optimal.\n\n" +
        "**QUESTIONS FRÉQUENTES** ❓\n" +
        "• Bug technique sur le site\n" +
        "• Suggestion d'amélioration\n" +
        "• Signaler une session erronée\n" +
        "• Supprimer une session\n" +
        "• Partenariat / collaboration\n" +
        "• Problème de publication\n\n" +
        "**RÉSEAUX SOCIAUX** 📱\n" +
        "Instagram : @openmatfrance (bientôt !)\n\n" +
        "**URGENCE** 🚨\n" +
        "Pour supprimer une session rapidement ou signaler un problème grave, précise bien \"URGENT\" dans l'objet.\n\n" +
        "Je réponds à TOUS les messages ! 💬",
        [{ label: "📧 Formulaire de contact", path: "/contact" }]
      );
      return;
    }

    // ==================== SÉCURITÉ / CONFIDENTIALITÉ ====================
    if (lowerMessage.includes('securite') || lowerMessage.includes('sécurité') || lowerMessage.includes('donnees') || lowerMessage.includes('données') || lowerMessage.includes('confidentiel') || lowerMessage.includes('rgpd') || lowerMessage.includes('vie privée') || lowerMessage.includes('vie privee') || lowerMessage.includes('protection') || lowerMessage.includes('cookies') || lowerMessage.includes('tracking') || lowerMessage.includes('espion')) {
      addBotMessage(
        "🔒 **Sécurité & Confidentialité**\n\n" +
        "**VIE PRIVÉE RESPECTÉE** 🛡️\n\n" +
        "✅ **Aucune donnée personnelle** collectée\n" +
        "✅ **Pas de compte requis** pour consulter\n" +
        "✅ **Favoris stockés localement** (sur ton appareil)\n" +
        "✅ **Pas de tracking** publicitaire\n" +
        "✅ **Pas de revente** de données\n" +
        "✅ **HTTPS** (connexion sécurisée)\n" +
        "✅ **Conforme RGPD** 🇪🇺\n\n" +
        "**COOKIES** 🍪\n" +
        "On utilise uniquement des cookies techniques essentiels (aucun cookie publicitaire).\n\n" +
        "**DONNÉES DES SESSIONS** 📊\n" +
        "• Infos publiques uniquement\n" +
        "• Pas de données sensibles\n" +
        "• Modération active\n\n" +
        "**SUPPRESSION** 🗑️\n" +
        "Tu peux demander la suppression d'une session à tout moment via le formulaire de contact.\n\n" +
        "**TRANSPARENCE** 🔍\n" +
        "Code source ouvert, tout est transparent !",
        [{ label: "🔒 Politique de confidentialité", path: "/confidentialite" }]
      );
      return;
    }

    // ==================== APPLICATION MOBILE ====================
    if (lowerMessage.includes('app') || lowerMessage.includes('mobile') || lowerMessage.includes('telephone') || lowerMessage.includes('téléphone') || lowerMessage.includes('smartphone') || lowerMessage.includes('ios') || lowerMessage.includes('android') || lowerMessage.includes('iphone') || lowerMessage.includes('tablette') || lowerMessage.includes('responsive') || lowerMessage.includes('telecharg') || lowerMessage.includes('télécharg') || lowerMessage.includes('install')) {
      addBotMessage(
        "📱 **Application Mobile**\n\n" +
        "**PAS BESOIN D'APP !** ✨\n" +
        "Le site est **100% responsive** et fonctionne parfaitement sur mobile ! 📲\n\n" +
        "**ASTUCE : Progressive Web App (PWA)** 🚀\n" +
        "Tu peux l'installer comme une vraie app :\n\n" +
        "**📱 SUR IPHONE / SAFARI** :\n" +
        "1. Ouvre le site dans Safari\n" +
        "2. Clique sur le bouton \"Partager\" 📤\n" +
        "3. \"Sur l'écran d'accueil\"\n" +
        "4. Valide ✅\n\n" +
        "**📱 SUR ANDROID / CHROME** :\n" +
        "1. Ouvre le site dans Chrome\n" +
        "2. Menu (⋮) → \"Installer l'application\"\n" +
        "3. Valide ✅\n\n" +
        "**AVANTAGES** 🎯\n" +
        "✅ Icône sur l'écran d'accueil\n" +
        "✅ Ouverture ultra-rapide\n" +
        "✅ Fonctionne comme une vraie app\n" +
        "✅ Pas de téléchargement nécessaire\n" +
        "✅ Mises à jour automatiques\n\n" +
        "**APP NATIVE PRÉVUE ?** 🤔\n" +
        "Peut-être plus tard si la communauté le demande ! Pour l'instant, la PWA suffit largement.",
        [{ label: "🔍 Essayer le site", path: "/explorer" }]
      );
      return;
    }

    // ==================== FAVORIS / LIKES ====================
    if (lowerMessage.includes('favori') || lowerMessage.includes('like') || lowerMessage.includes('coeur') || lowerMessage.includes('cœur') || lowerMessage.includes('sauvegarder') || lowerMessage.includes('enregistrer') || lowerMessage.includes('bookmark') || lowerMessage.includes('marquer') || lowerMessage.includes('garder')) {
      addBotMessage(
        "❤️ **Système de Favoris**\n\n" +
        "**COMMENT ÇA MARCHE** 🔄\n\n" +
        "1️⃣ **Liker une session** :\n" +
        "   • Clique sur le ❤️ sur une session\n" +
        "   • Elle devient rouge = sauvegardée !\n\n" +
        "2️⃣ **Retrouver tes favoris** :\n" +
        "   • Va sur la page Explorer\n" +
        "   • Clique sur le filtre \"FAVORIS\"\n" +
        "   • Toutes tes sessions likées s'affichent\n\n" +
        "3️⃣ **Retirer un favori** :\n" +
        "   • Reclique sur le ❤️\n" +
        "   • Il redevient gris\n\n" +
        "**STOCKAGE** 💾\n" +
        "• Sauvegardé **localement** sur ton appareil\n" +
        "• Pas besoin de compte\n" +
        "• Instantané\n\n" +
        "**IMPORTANT** ⚠️\n" +
        "Si tu vides le cache de ton navigateur, tes favoris seront supprimés.\n\n" +
        "**ASTUCE** 💡\n" +
        "Like les open mats qui t'intéressent pour les retrouver facilement !",
        [{ label: "🔍 Voir mes favoris", path: "/explorer" }]
      );
      return;
    }

    // ==================== HORAIRES ====================
    if (lowerMessage.includes('horaire') || lowerMessage.includes('heure') || lowerMessage.includes('quand') || lowerMessage.includes('jour') || lowerMessage.includes('planning') || lowerMessage.includes('calendrier') || lowerMessage.includes('creneau') || lowerMessage.includes('créneau') || lowerMessage.includes('duree') || lowerMessage.includes('durée') || lowerMessage.includes('combien de temps')) {
      addBotMessage(
        "⏰ **Horaires des Open Mats**\n\n" +
        "**HORAIRES TYPIQUES** 📅\n\n" +
        "**EN SEMAINE** 🌆\n" +
        "• **Midi** : 12h-14h (20%)\n" +
        "  → Pause déjeuner, pratique si tu bosses à côté\n" +
        "• **Soir** : 19h-21h / 20h-22h (65%)\n" +
        "  → Le plus courant après le travail\n\n" +
        "**WEEKEND** 🌅\n" +
        "• **Matin** : 10h-12h (40%)\n" +
        "  → Parfait pour commencer la journée\n" +
        "• **Après-midi** : 14h-16h / 15h-17h (60%)\n" +
        "  → Idéal après avoir fait ses courses\n\n" +
        "**DURÉE MOYENNE** ⏱️\n" +
        "• 1h30 à 2h généralement\n" +
        "• Certains vont jusqu'à 3h !\n\n" +
        "**JOURS POPULAIRES** 📊\n" +
        "1. **Samedi** (30%) 👑\n" +
        "2. **Dimanche** (25%)\n" +
        "3. **Mercredi** (15%)\n" +
        "4. **Vendredi** (12%)\n" +
        "5. Autres jours (18%)\n\n" +
        "**SESSIONS RÉCURRENTES** 🔄\n" +
        "Beaucoup d'open mats ont lieu **chaque semaine** au même horaire !\n\n" +
        "Les horaires exacts sont sur chaque session. 📍",
        [{ label: "🔍 Voir les horaires", path: "/explorer" }]
      );
      return;
    }

    // ==================== VILLES / LOCALISATION ====================
    if (lowerMessage.includes('liste') || lowerMessage.includes('villes disponibles') || lowerMessage.includes('combien de villes') || lowerMessage.includes('quelles villes') || lowerMessage.includes('zones') || lowerMessage.includes('regions') || lowerMessage.includes('régions') || lowerMessage.includes('carte') || lowerMessage.includes('geographie') || lowerMessage.includes('géographie')) {
      const cities = Array.from(new Set(allSessions.map(s => s.city))).sort();
      addBotMessage(
        `📍 **${cities.length} villes** avec des open mats actifs !\n\n` +
        (cities.length > 0 ? '**Principales villes** :\n' + cities.slice(0, 20).join(', ') + (cities.length > 20 ? '...\n\n' : '\n\n') : 'Aucune ville pour le moment.\n\n') +
        '**RÉPARTITION FRANCE** 🇫🇷\n' +
        '• **Île-de-France** : 40% des sessions\n' +
        '• **Grandes villes** : 35%\n' +
        '• **Villes moyennes** : 20%\n' +
        '• **Petites villes** : 5%\n\n' +
        '**ON S\'AGRANDIT !** 📈\n' +
        'Le réseau grandit chaque semaine. Si ta ville n\'est pas encore là, sois le premier à publier ! 🚀\n\n' +
        'Demande-moi une ville pour voir les sessions disponibles ! 🗺️',
        [{ label: "🔍 Voir toutes les villes", path: "/explorer" }]
      );
      return;
    }

    // ==================== ÉQUIPEMENT NÉCESSAIRE ====================
    if (lowerMessage.includes('equipement') || lowerMessage.includes('équipement') || lowerMessage.includes('materiel') || lowerMessage.includes('matériel') || lowerMessage.includes('besoin de quoi') || lowerMessage.includes('apporter') || lowerMessage.includes('affaires') || lowerMessage.includes('sac') || lowerMessage.includes('tenue')) {
      addBotMessage(
        "🎒 **Équipement pour un Open Mat**\n\n" +
        "**POUR LE GI (KIMONO)** 🥋\n" +
        "✅ Kimono de JJB PROPRE\n" +
        "✅ Ceinture\n" +
        "✅ Pas de bijoux, montres, piercings\n" +
        "✅ Ongles courts !\n\n" +
        "**POUR LE NO-GI** 🤼\n" +
        "✅ Rashguard (manches longues ou courtes)\n" +
        "✅ Short de compression / short de grappling\n" +
        "✅ Pas de poches, zips ou boutons\n\n" +
        "**HYGIÈNE** 🧼\n" +
        "✅ Douche AVANT et APRÈS\n" +
        "✅ Kimono/rashguard PROPRE\n" +
        "✅ Pieds propres\n" +
        "✅ Ongles des pieds ET des mains courts\n\n" +
        "**RECOMMANDÉ** 💡\n" +
        "• Bouteille d'eau\n" +
        "• Serviette\n" +
        "• Tongs / claquettes pour les vestiaires\n" +
        "• Sac de sport aéré\n\n" +
        "**INTERDIT** ❌\n" +
        "• Kimono sale ou qui pue\n" +
        "• Bijoux, montres\n" +
        "• Ongles longs\n• Chaussures sur le tatami\n\n" +
        "**L'HYGIÈNE C'EST LA BASE !** 🧼\n" +
        "Un kimono propre = respect pour tes partenaires.",
        [{ label: "🔍 Trouver un Open Mat", path: "/explorer" }]
      );
      return;
    }

    // ==================== COMBIEN DE SESSIONS ====================
    if (lowerMessage.includes('combien') && (lowerMessage.includes('session') || lowerMessage.includes('open mat'))) {
      addBotMessage(
        `📊 **Statistiques OpenMat France**\n\n` +
        `**Sessions actives** : ${allSessions.length}\n\n` +
        `**Croissance** 📈\n` +
        `• Nouvelle plateforme lancée en 2026\n` +
        `• En moyenne +10 nouvelles sessions/semaine\n` +
        `• Objectif : 500+ sessions d'ici fin 2027\n\n` +
        `**Répartition** :\n` +
        `• JJB (Gi) : ~45%\n` +
        `• Luta Livre (No-Gi) : ~40%\n` +
        `• Mixte : ~15%\n\n` +
        `**Ambition** 🚀\n` +
        `Devenir LA référence nationale avec toutes les sessions de France !`,
        [{ label: "🔍 Voir toutes les sessions", path: "/explorer" }]
      );
      return;
    }

    // ==================== NOTIFICATIONS ====================
    if (lowerMessage.includes('notification') || lowerMessage.includes('alerte') || lowerMessage.includes('prevenir') || lowerMessage.includes('prévenir') || lowerMessage.includes('avertir') || lowerMessage.includes('rappel')) {
      addBotMessage(
        "🔔 **Notifications**\n\n" +
        "**STATUT ACTUEL** 📱\n" +
        "Les notifications ne sont pas encore disponibles.\n\n" +
        "**PRÉVU BIENTÔT !** 🚀\n" +
        "On travaille sur un système de notifications pour :\n\n" +
        "✅ Nouvelles sessions dans ta ville\n" +
        "✅ Rappels avant tes favoris\n" +
        "✅ Annulations / modifications\n" +
        "✅ Sessions récurrentes chaque semaine\n\n" +
        "**EN ATTENDANT** 💡\n" +
        "• Like les sessions qui t'intéressent\n" +
        "• Consulte régulièrement l'Explorer\n" +
        "• Ajoute le site à ton écran d'accueil\n\n" +
        "Tu seras prévenu quand les notifications seront dispo ! 📬",
        [{ label: "❤️ Mettre en favoris", path: "/explorer" }]
      );
      return;
    }

    // ==================== ANNULER UNE SESSION ====================
    if (lowerMessage.includes('annuler') || lowerMessage.includes('supprimer') || lowerMessage.includes('retirer') || lowerMessage.includes('effacer') || lowerMessage.includes('enlever') || lowerMessage.includes('delete')) {
      addBotMessage(
        "🗑️ **Annuler / Supprimer une session**\n\n" +
        "**POUR SUPPRIMER UNE SESSION** :\n\n" +
        "1️⃣ **Contact requis** 📧\n" +
        "   Envoie un email à : adelloukal2@gmail.com\n\n" +
        "2️⃣ **Infos à fournir** 📝\n" +
        "   • Nom de la session\n" +
        "   • Ville\n" +
        "   • Date\n" +
        "   • Raison de la suppression\n\n" +
        "3️⃣ **Délai** ⏱️\n" +
        "   Suppression sous 24h max\n\n" +
        "**RAISONS VALABLES** ✅\n" +
        "• Session annulée définitivement\n" +
        "• Erreur dans les infos\n" +
        "• Club fermé\n" +
        "• Tu es le créateur de la session\n\n" +
        "**ALTERNATIVE** 💡\n" +
        "Si c'est juste une modification (horaire, prix...), demande plutôt une mise à jour !",
        [{ label: "📧 Contacter", path: "/contact" }]
      );
      return;
    }

    // ==================== PARTENARIAT ====================
    if (lowerMessage.includes('partenariat') || lowerMessage.includes('collaboration') || lowerMessage.includes('sponsor') || lowerMessage.includes('pub') || lowerMessage.includes('publicite') || lowerMessage.includes('publicité') || lowerMessage.includes('business') || lowerMessage.includes('monetis') || lowerMessage.includes('monétis')) {
      addBotMessage(
        "🤝 **Partenariats & Collaborations**\n\n" +
        "**OUVERT AUX PARTENARIATS !** ✅\n\n" +
        "**TYPES DE COLLABORATIONS** :\n\n" +
        "🥋 **Clubs de JJB/Grappling**\n" +
        "• Mise en avant de vos open mats\n" +
        "• Badge \"Partenaire officiel\"\n" +
        "• Intégration directe\n\n" +
        "🛒 **Marques d'équipement**\n" +
        "• Partenariat sponsoring\n" +
        "• Codes promo pour la communauté\n" +
        "• Visibilité sur le site\n\n" +
        "🎪 **Organisateurs d'événements**\n" +
        "• Promotion de stages, compétitions\n" +
        "• Section dédiée\n\n" +
        "📱 **Médias / Influenceurs BJJ**\n" +
        "• Collaboration de contenu\n" +
        "• Co-marketing\n\n" +
        "**CONTACT** 📧\n" +
        "adelloukal2@gmail.com\n" +
        "Objet : \"PARTENARIAT - [Nom entreprise]\"\n\n" +
        "**PHILOSOPHIE** 💭\n" +
        "On privilégie les partenariats qui apportent de la valeur à la communauté ! 🤙",
        [{ label: "📧 Nous contacter", path: "/contact" }]
      );
      return;
    }

    // ==================== PROBLÈME TECHNIQUE ====================
    if (lowerMessage.includes('bug') || lowerMessage.includes('erreur') || lowerMessage.includes('probleme') || lowerMessage.includes('problème') || lowerMessage.includes('marche pas') || lowerMessage.includes('fonctionne pas') || lowerMessage.includes('casse') || lowerMessage.includes('cassé') || lowerMessage.includes('bloque') || lowerMessage.includes('bloqué')) {
      addBotMessage(
        "🐛 **Problème technique ?**\n\n" +
        "**SOLUTIONS RAPIDES** 🔧\n\n" +
        "1️⃣ **Rafraîchir la page** (F5 ou Ctrl+R)\n" +
        "2️⃣ **Vider le cache** du navigateur\n" +
        "3️⃣ **Essayer un autre navigateur**\n" +
        "4️⃣ **Vérifier ta connexion internet**\n\n" +
        "**TOUJOURS UN PROBLÈME ?** 📧\n\n" +
        "Contacte-moi avec ces infos :\n" +
        "• Description du bug\n" +
        "• Navigateur utilisé (Chrome, Safari...)\n" +
        "• Appareil (PC, iPhone, Android...)\n" +
        "• Captures d'écran si possible\n\n" +
        "📮 adelloukal2@gmail.com\n" +
        "Objet : \"BUG - [Description courte]\"\n\n" +
        "**DÉLAI** ⏱️\n" +
        "Les bugs critiques sont corrigés en priorité (sous 24h généralement).\n\n" +
        "Merci de ton aide pour améliorer le site ! 🙏",
        [{ label: "📧 Signaler un bug", path: "/contact" }]
      );
      return;
    }

    // ==================== SALUTATIONS ====================
    if (lowerMessage.match(/^(salut|bonjour|hello|hey|coucou|yo|hi|bonsoir|bjr|slt)$/)) {
      addBotMessage(
        "👋 Salut ! Comment puis-je t'aider aujourd'hui ?",
        [
          { label: "🔍 Trouver un Open Mat", path: "/explorer" },
          { label: "📖 À propos", path: "/a-propos" }
        ]
      );
      return;
    }

    // ==================== REMERCIEMENTS ====================
    if (lowerMessage.includes('merci') || lowerMessage.includes('thanks') || lowerMessage.includes('thx') || lowerMessage.includes('cool') || lowerMessage.includes('super') || lowerMessage.includes('genial') || lowerMessage.includes('génial') || lowerMessage.includes('top') || lowerMessage.includes('parfait')) {
      addBotMessage("😊 De rien ! N'hésite pas si tu as d'autres questions ! Oss ! 🥋");
      return;
    }

    // ==================== AU REVOIR ====================
    if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye') || lowerMessage.includes('ciao') || lowerMessage.includes('à plus') || lowerMessage.includes('a plus') || lowerMessage.includes('salut') && lowerMessage.includes('bonne') || lowerMessage.includes('bonne journee') || lowerMessage.includes('bonne journée') || lowerMessage.includes('bonne soiree') || lowerMessage.includes('bonne soirée')) {
      addBotMessage("👋 À bientôt sur les tatamis ! Oss ! 🥋");
      return;
    }

    // ==================== OSS ====================
    if (lowerMessage.match(/^(oss|ooss|ossss)$/)) {
      addBotMessage("🥋 Oss ! 💪");
      return;
    }

    // ==================== RÉPONSE PAR DÉFAUT ====================
    addBotMessage(
      "🤔 Je ne suis pas sûr de comprendre...\n\n" +
      "**Essaie de demander** :\n" +
      "• \"Open mat à Paris\"\n" +
      "• \"C'est quoi un open mat ?\"\n" +
      "• \"Comment publier ?\"\n" +
      "• \"Qui est le développeur ?\"\n" +
      "• \"Les tarifs ?\"\n" +
      "• \"JJB ou Luta Livre ?\"\n" +
      "• \"Comment ça marche ?\"\n" +
      "• \"Équipement nécessaire ?\"\n" +
      "• \"Combien de sessions ?\"",
      [
        { label: "🔍 Explorer", path: "/explorer" },
        { label: "📧 Contact", path: "/contact" }
      ]
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addUserMessage(input);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      generateResponse(input);
    }, 800);
  };

  const handleClearChat = () => {
    setMessages([]);
    setTimeout(() => {
      addBotMessage(
        "🗑️ Discussion effacée !\n\n" +
        "Comment puis-je t'aider ?",
        [
          { label: "🔍 Trouver un Open Mat", path: "/explorer" },
          { label: "➕ Publier", path: "/publier" }
        ]
      );
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group relative"
          aria-label="Ouvrir l'assistant IA"
        >
          <span className="text-2xl animate-pulse">💬</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <>
          {/* Overlay pour mobile */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Fenêtre chatbot */}
          <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-[100] w-auto md:w-[420px] lg:w-[440px] h-[75vh] max-h-[600px] md:h-[650px] lg:h-[700px] bg-black border border-white/20 shadow-2xl flex flex-col rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-black border-b border-white/20 px-3 py-3 md:p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative">
                  <span className="text-xl md:text-2xl">🤖</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 md:w-2.5 h-2 md:h-2.5 bg-green-500 rounded-full border border-black"></span>
                </div>
                <div>
                  <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-wider">Assistant IA</h3>
                  <p className="text-white/40 text-[10px] md:text-xs font-medium">OpenMat France</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center min-w-[36px] min-h-[36px]"
                  aria-label="Effacer la discussion"
                  title="Effacer la discussion"
                >
                  <Trash2 className="h-5 w-5 md:h-5 md:w-5 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center min-w-[36px] min-h-[36px]"
                  aria-label="Fermer le chatbot"
                >
                  <X className="h-6 w-6 md:h-6 md:w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-black">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[92%] sm:max-w-[85%] md:max-w-[80%] ${message.isBot ? 'bg-white/5 border border-white/10' : 'bg-white'} ${message.isBot ? 'text-white' : 'text-black'} rounded-lg p-2 sm:p-3 text-[11px] sm:text-sm`}>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>

                    {/* Boutons de navigation */}
                    {message.navigationButtons && message.navigationButtons.length > 0 && (
                      <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                        {message.navigationButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(btn.path);
                              setIsOpen(false);
                            }}
                            className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black text-[9px] sm:text-xs font-black uppercase tracking-wider hover:bg-white/90 transition-all rounded border border-black/10"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/20 p-2 sm:p-4 bg-black shrink-0">
              <div className="flex gap-1.5 sm:gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pose ta question..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-2.5 sm:px-4 py-2 sm:py-2.5 text-white text-[11px] sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                  aria-label="Envoyer le message"
                >
                  <Send className="h-4 w-4 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
