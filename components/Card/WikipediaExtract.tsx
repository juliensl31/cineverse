import React, { useState, useEffect } from 'react';

interface WikiExtractProps {
  title: string;
  fallbackDescription?: string;
  type: 'artist' | 'movie' | 'tv';
}

interface WikiInfo {
  extract: string;
  url: string;
}

const WikiExtract = ({ title, fallbackDescription, type }: WikiExtractProps) => {
  const [wikiInfo, setWikiInfo] = useState<WikiInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWikiInfo = async () => {
      try {
        const response = await fetch(
          `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        if (response.ok) {
          const data = await response.json();
          setWikiInfo({
            extract: data.extract,
            url: data.content_urls.desktop.page
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données Wikipedia:', error);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchWikiInfo();
    }
  }, [title]);

  if (loading) {
    return null;
  }

  if (!wikiInfo && !fallbackDescription) {
    return null;
  }

  const getHeading = () => {
    if (type === 'artist') return 'Biographie';
    if (type === 'movie' || type === 'tv') return 'Synopsis';
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        {getHeading()}
      </h2>
      <p className="text-white/80 leading-relaxed">
        {fallbackDescription ? fallbackDescription : wikiInfo?.extract}
      </p>
      {wikiInfo?.url && (
        <div className="flex justify-end mt-4">
          <button className="btn-gradient flex items-center justify-center gap-2 px-4 h-10 rounded-xl">
            <a 
              href={wikiInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium"
            >
              Wikipédia →
            </a>
          </button>
        </div>
      )}
    </div>
  );
};

export default WikiExtract;