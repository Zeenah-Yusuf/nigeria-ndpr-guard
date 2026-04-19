import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ndprData from "@/data/ndpr_dataset.json";
import { Search, BookOpen } from "lucide-react";

const ClauseFinder = () => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof ndprData.clauses>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const searchClauses = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      const matched = ndprData.clauses
        .filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.keywords.some(k => k.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setResults(matched);
      setSearched(true);
      setSearching(false);
    }, 400);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setTimeout(() => { 
      const q = term.toLowerCase();
      const matched = ndprData.clauses
        .filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.summary.toLowerCase().includes(q) || 
          c.keywords.some(k => k.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setResults(matched); 
      setSearched(true);
    }, 100);
  };

  const popularSearches = [
    t('search.terms.consent'),
    t('search.terms.breach'),
    t('search.terms.children'),
    t('search.terms.transfer'),
    t('search.terms.audit'),
    t('search.terms.penalty')
  ];

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'consent': t('search.categories.consent'),
      'data_subject_rights': t('search.categories.rights'),
      'data_controller_obligations': t('search.categories.obligations'),
      'cross_border_transfer': t('search.categories.transfer'),
      'enforcement': t('search.categories.enforcement'),
      'security': t('search.categories.security'),
      'breach': t('search.categories.breach'),
    };
    return categoryMap[category] || category.replace(/_/g, " ");
  };

  return (
    <div className="space-y-5">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchClauses()}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Quick search chips */}
      <div className="flex flex-wrap gap-2">
        {popularSearches.map(term => (
          <button
            key={term}
            onClick={() => handleQuickSearch(term)}
            className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary active:scale-95 transition-all duration-200"
          >
            {term}
          </button>
        ))}
      </div>

      <button
        onClick={searchClauses}
        disabled={!query.trim() || searching}
        className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {searching ? (
          <>
            <div className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
            {t('search.searching')}
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            {t('search.button')}
          </>
        )}
      </button>

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {results.length === 0 
              ? t('search.noResults') 
              : t('search.resultsFound').replace('{{count}}', results.length.toString())}
          </p>
          {results.map((clause, i) => (
            <div
              key={clause.id}
              className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold bg-brand-gradient text-primary-foreground px-2.5 py-0.5 rounded-full">
                  {clause.article_ref}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getCategoryLabel(clause.category)}
                </span>
              </div>
              <h4 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{clause.summary}</p>
              {clause.penalty_info && (
                <p className="text-xs text-destructive mt-2 font-medium">
                  ⚠ {clause.penalty_info}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {clause.keywords.slice(0, 4).map(kw => (
                  <span
                    key={kw}
                    onClick={() => handleQuickSearch(kw)}
                    className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClauseFinder;