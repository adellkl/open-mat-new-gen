import emailjs from '@emailjs/browser';

interface OpenMatNotificationData {
  title: string;
  club: string;
  city: string;
  address: string;
  date: string;
  time: string;
  type: string;
  price: string;
  description: string;
  instagram?: string;
}

/**
 * Envoie une notification par email lorsqu'un nouvel Open Mat est ajouté.
 * Réutilise le même template EmailJS que le formulaire de contact
 * (from_name, from_email, subject, message).
 * L'envoi est silencieux : en cas d'échec, on log l'erreur sans bloquer l'utilisateur.
 */
export const sendNewOpenMatNotification = async (data: OpenMatNotificationData): Promise<void> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Ne pas envoyer si les variables d'environnement ne sont pas configurées
  if (!serviceId || !templateId || !publicKey) {
    console.warn('⚠️ EmailJS notification non configuré. Vérifiez les variables VITE_EMAILJS_*.');
    return;
  }

  // Formater le message avec toutes les infos de la session
  const message = [
    `Session : ${data.title}`,
    `Club : ${data.club}`,
    `Ville : ${data.city}`,
    `Adresse : ${data.address}`,
    `Date : ${data.date}`,
    `Horaire : ${data.time}`,
    `Discipline : ${data.type}`,
    `Prix : ${data.price || 'Non spécifié'}`,
    `Instagram : ${data.instagram || 'Non renseigné'}`,
    ``,
    `Description :`,
    data.description,
  ].join('\n');

  const templateParams = {
    from_name: 'Open Mat France - Alerte',
    from_email: 'notification@openmat.fr',
    subject: `Nouvel Open Mat ajouté : ${data.title} - ${data.club} (${data.city})`,
    message,
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('✅ Notification email envoyée avec succès');
  } catch (error) {
    // On ne bloque pas l'utilisateur en cas d'échec de la notification
    console.error('❌ Erreur lors de l\'envoi de la notification email:', error);
  }
};
