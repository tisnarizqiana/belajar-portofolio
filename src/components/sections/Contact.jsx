import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { validateContactForm } from '../../utils/validation';

export const Contact = () => {
  const { contact, personal } = portfolioData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'prepared' | null
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateContactForm({
      name: formData.name,
      email: formData.email,
      message: formData.message
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmissionStatus(null);
      return;
    }

    setErrors({});

    // Construct safe mailto URI
    const subjectLine = encodeURIComponent(
      formData.subject.trim() || `Kontak Portofolio dari ${formData.name.trim()}`
    );
    const bodyContent = encodeURIComponent(
      `Nama: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nPesan:\n${formData.message.trim()}`
    );

    const mailtoUrl = `mailto:${contact.email}?subject=${subjectLine}&body=${bodyContent}`;

    // Trigger user's mail client safely
    window.location.href = mailtoUrl;

    // Display honest client-side confirmation
    setSubmissionStatus('prepared');
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          tag="Hubungi Saya"
          title={contact.title}
          subtitle={contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-[#0B1F3A]/90 border-[#1E3A5F] p-6 space-y-6" hoverEffect={false}>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Mari Terhubung</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {contact.availabilityText}
                </p>
              </div>

              {/* Email direct copy box */}
              <div className="bg-[#071426] p-4 rounded-xl border border-[#1E3A5F] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Email Langsung</span>
                    <span className="text-sm font-semibold text-slate-200 truncate block">{contact.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[#0B1F3A] hover:bg-[#132d54] text-slate-300 hover:text-white border border-[#1E3A5F] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  aria-label="Salin alamat email"
                  title="Salin email ke clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Profiles & Links */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Profil & Jejaring Profesional:
                </span>

                <div className="flex flex-col gap-2.5">
                  {personal.github && (
                    <a
                      href={personal.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-[#071426]/70 hover:bg-[#071426] border border-[#1E3A5F] text-slate-300 hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <GithubIcon className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium">GitHub</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono group-hover:text-sky-300">Lihat Profil &rarr;</span>
                    </a>
                  )}

                  {personal.linkedin && (
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-[#071426]/70 hover:bg-[#071426] border border-[#1E3A5F] text-slate-300 hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LinkedinIcon className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono group-hover:text-sky-300">Terhubung &rarr;</span>
                    </a>
                  )}

                  {personal.whatsapp && (
                    <a
                      href={personal.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-[#071426]/70 hover:bg-[#071426] border border-[#1E3A5F] text-slate-300 hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono group-hover:text-emerald-300">Kirim Pesan &rarr;</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Client-side transparency note */}
              <div className="pt-2 border-t border-[#1E3A5F]/60">
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {contact.note}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Accessible Contact Form */}
          <div className="lg:col-span-7">
            <Card className="bg-[#0B1F3A]/90 border-[#1E3A5F] p-6 sm:p-8" hoverEffect={false}>
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 font-mono">
                <Send className="w-5 h-5 text-sky-400" aria-hidden="true" />
                <span>Formulir Pesan</span>
              </h3>

              {submissionStatus === 'prepared' && (
                <div
                  className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-start gap-3"
                  role="status"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="font-semibold block">Draf email telah disiapkan!</strong>
                    <span>Aplikasi email default Anda telah dibuka dengan isi pesan di atas. Silakan periksa dan tekan 'Kirim' pada aplikasi email Anda.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name field */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Nama Lengkap <span className="text-rose-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="Contoh: Alex Pratama"
                    className={`w-full px-4 py-3 rounded-lg bg-[#071426] border text-slate-100 placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors ${
                      errors.name ? 'border-rose-500 focus-visible:ring-rose-400' : 'border-[#1E3A5F] focus-visible:border-sky-500'
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Alamat Email <span className="text-rose-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="nama@domain.com"
                    className={`w-full px-4 py-3 rounded-lg bg-[#071426] border text-slate-100 placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors ${
                      errors.email ? 'border-rose-500 focus-visible:ring-rose-400' : 'border-[#1E3A5F] focus-visible:border-sky-500'
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Subject field (Optional) */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Subjek <span className="text-slate-400 text-[10px] lowercase">(opsional)</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Topik diskusi atau penawaran proyek"
                    className="w-full px-4 py-3 rounded-lg bg-[#071426] border border-[#1E3A5F] text-slate-100 placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-500 transition-colors"
                  />
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Isi Pesan <span className="text-rose-400" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    placeholder="Tuliskan pesan, rincian proyek, atau pertanyaan Anda di sini..."
                    className={`w-full px-4 py-3 rounded-lg bg-[#071426] border text-slate-100 placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors resize-y ${
                      errors.message ? 'border-rose-500 focus-visible:ring-rose-400' : 'border-[#1E3A5F] focus-visible:border-sky-500'
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    icon={Send}
                    iconPosition="right"
                  >
                    Buka Draf Email
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
