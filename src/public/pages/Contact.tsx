import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Plus, ArrowRight, Check, Loader2 } from 'lucide-react';
import SEO from '../../shared/components/SEO';

const FillingLine = () => (
  <div className="relative h-[1px] w-full bg-white/10 overflow-hidden my-24">
    <div className="absolute inset-0 bg-white/40 animate-[slideHorizontal_6s_infinite]" />
  </div>
);

const ContactInfoCard = ({ icon: Icon, label, value, delay = 0 }: { icon: any; label: string; value: string; delay?: number }) => (
  <div className="reveal active border border-white/5 bg-white/[0.01] p-6 sm:p-8 transition-all hover:border-white/20 group" style={{ transitionDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between mb-4 sm:mb-6">
      <div className="h-10 w-10 sm:h-12 sm:w-12 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/40 transition-all">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white/10" />
    </div>
    <p className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">{label}</p>
    <p className="text-xs sm:text-sm font-bold text-white break-words">{value}</p>
  </div>
);

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Contact - OpenMat France | Nous Contacter"
        description="Contactez l'équipe OpenMat France pour toute question, suggestion ou partenariat. Nous sommes à votre écoute pour développer la communauté grappling française."
        keywords="contact openmat, nous contacter, support openmat, partenariat jjb, question open mat"
      />
      <div className="bg-black min-h-screen pt-24 sm:pt-32 pb-20 sm:pb-40 lg:pb-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <header className="max-w-4xl reveal active" data-always-active="true">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 opacity-30">
              <div className="h-[1px] w-8 sm:w-12 bg-white"></div>
              <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.6em] uppercase">Support Terminal</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-6 sm:mb-8 lg:mb-12 italic">CONTACT.</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/40 font-light leading-relaxed tracking-wide">
              Vous avez des questions, des suggestions ou vous souhaitez devenir <span className="text-white">partenaire</span> ? Contactez-nous.
            </p>
          </header>

          <FillingLine />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8">Informations de contact</p>
                <div className="space-y-4 sm:space-y-6">
                  <ContactInfoCard
                    icon={Mail}
                    label="Email"
                    value="adelloukal2@gmail.com"
                    delay={100}
                  />
                  <ContactInfoCard
                    icon={MessageCircle}
                    label="Communauté"
                    value="Rejoignez-nous sur Instagram"
                    delay={200}
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="reveal active border border-white/10 bg-white/[0.02] p-8 sm:p-12 lg:p-16 text-center" data-always-active="true">
                  <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 border border-white/20 rounded-full mb-8 sm:mb-12">
                    <Check className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">MESSAGE ENVOYÉ.</h3>
                  <p className="text-white/40 text-sm mb-8 sm:mb-12 leading-relaxed px-4">
                    Merci de nous avoir contactés. Nous reviendrons vers vous très rapidement.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 sm:px-12 py-4 sm:py-5 border border-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                  >
                    Nouveau Message
                  </button>
                </div>
              ) : (
                <div className="reveal active border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-12 lg:p-16 relative group hover:border-white/20 transition-all">
                  <div className="absolute top-0 left-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>
                  <div className="absolute top-0 right-0 p-2 opacity-40 hidden sm:block"><Plus className="h-3 w-3 text-white" /></div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 opacity-40">
                    <span className="text-[8px] sm:text-[9px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white">Formulaire de contact</span>
                    <div className="h-[1px] flex-grow bg-white/10"></div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] ml-1">Nom Complet</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-white/[0.07] border border-white/20 h-12 sm:h-14 px-4 sm:px-6 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                          placeholder="JEAN DUPONT"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] ml-1">Email</label>
                        <input
                          required
                          type="email"
                          className="w-full bg-white/[0.07] border border-white/20 h-12 sm:h-14 px-4 sm:px-6 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                          placeholder="JEAN@EXAMPLE.COM"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] ml-1">Sujet</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white/[0.07] border border-white/20 h-12 sm:h-14 px-4 sm:px-6 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest outline-none focus:border-white/60 focus:bg-white/[0.1] transition-all placeholder:text-white/10"
                        placeholder="COMMENT POUVONS-NOUS VOUS AIDER ?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] ml-1">Message</label>
                      <textarea
                        required
                        className="w-full bg-white/[0.07] border border-white/20 p-4 sm:p-6 min-h-[160px] sm:min-h-[200px] text-white text-[10px] sm:text-xs font-medium leading-relaxed outline-none focus:border-white/60 transition-all placeholder:text-white/10"
                        placeholder="VOTRE MESSAGE ICI..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 sm:h-20 bg-white text-black font-black text-[10px] sm:text-[12px] uppercase tracking-[0.4em] sm:tracking-[0.6em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 sm:gap-6 disabled:opacity-50 group shadow-2xl"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="animate-spin h-5 w-5 sm:h-6 sm:w-6" /> ENVOI EN COURS...</>
                      ) : (
                        <>ENVOYER <Send className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" /></>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>{`
        @keyframes slideHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      </div>
    </>
  );
};

export default Contact;
