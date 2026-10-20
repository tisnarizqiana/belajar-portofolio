import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Clock, User, ArrowRight, X, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const Articles = () => {
  const { articles, settings } = usePortfolio();
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (settings.enable_blog === 'false' || !articles || articles.length === 0) {
    return null;
  }

  const renderCleanHtml = (markdownContent) => {
    const rawHtml = marked.parse(markdownContent || '');
    return DOMPurify.sanitize(rawHtml);
  };

  return (
    <section id="articles" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Catatan & Tulisan"
          title="Artikel & Wawasan Teknis"
          subtitle="Dokumentasi rekayasa perangkat lunak, eksplorasi arsitektur web modern, dan catatan pembelajaran"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id || art.slug}
              className="bg-[#0B1F3A]/90 border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-950/40 transition-all flex flex-col group cursor-pointer"
              onClick={() => setSelectedArticle(art)}
            >
              {art.cover_url ? (
                <div className="h-44 bg-[#071426] overflow-hidden border-b border-[#1E3A5F]">
                  <img
                    src={art.cover_url}
                    alt={art.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-tr from-blue-950/60 to-slate-900 border-b border-[#1E3A5F] flex items-center justify-center text-sky-400">
                  <BookOpen className="w-8 h-8 opacity-60" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{art.reading_time_minutes || 1} menit baca</span>
                  </span>
                  <span>•</span>
                  <span>
                    {art.published_at
                      ? new Date(art.published_at).toLocaleDateString('id-ID', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Baru ini'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
                  {art.excerpt || art.content?.slice(0, 150) + '...'}
                </p>

                <div className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-between text-xs text-sky-400 font-medium">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <BookOpen className="w-4 h-4" />
                <span>/{selectedArticle.slug}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {selectedArticle.cover_url && (
                <img
                  src={selectedArticle.cover_url}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-xl border border-[#1E3A5F]"
                />
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{selectedArticle.reading_time_minutes || 1} menit baca</span>
                  </span>
                  <span>•</span>
                  <span>Oleh {selectedArticle.author_name || 'Tisna Rizqiana'}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight">
                  {selectedArticle.title}
                </h1>
              </div>

              {/* Markdown Content safely sanitized */}
              <div
                className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: renderCleanHtml(selectedArticle.content) }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
