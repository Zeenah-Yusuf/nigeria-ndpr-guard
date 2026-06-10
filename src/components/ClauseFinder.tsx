import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDatasetByFramework } from "@/data/index";
import { Search, BookOpen, ExternalLink, X, TrendingUp } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";
import clauseFinderImage from "@/assets/clause-finder.png";

interface Clause {
  id: string;
  article_ref: string;
  title: string;
  summary: string;
  keywords?: string[];
  category: string;
  penalty_info?: string;
}

// FIXED: Aligned prop naming convention with DemoSection.tsx
interface ClauseFinderProps {
  activeFramework?: string;
}

const ClauseFinder = ({ activeFramework = "NDPA" }: ClauseFinderProps) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Clause[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const dataset = getDatasetByFramework(activeFramework);
  const clausesData: Clause[] = useMemo(() => {
    return (dataset?.clauses || []).map((c: any) => ({
      ...c,
      keywords: c.keywords || [],
      penalty_info: c.penalty_info || undefined,
    }));
  }, [dataset]);

  // FIXED: Reset local query/results state cleanly when user changes framework context tabs
  useEffect(() => {
    setQuery("");
    setResults([]);
    setSearched(false);
    
    const saved = localStorage.getItem(`clauseFinder_recent_${activeFramework}`);
    if (saved) {
      try { setRecentSearches(JSON.parse(saved).slice(0, 5)); }
      catch { setRecentSearches([]); }
    } else {
      setRecentSearches([]);
    }
  }, [activeFramework]);

  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches(prev => {
      const newSearches = [term, ...prev.filter(t => t !== term)].slice(0, 5);
      localStorage.setItem(`clauseFinder_recent_${activeFramework}`, JSON.stringify(newSearches));
      return newSearches;
    });
  }, [activeFramework]);

  const searchClauses = useCallback((searchTerm: string = query) => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      const q = searchTerm.toLowerCase();
      const matched = clausesData.filter(clause =>
        clause.title.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        (clause.keywords || []).some(k => k.toLowerCase().includes(q)) ||
        clause.category.toLowerCase().includes(q)
      ).slice(0, 8);
      
      setResults(matched);
      setSearched(true);
      setSearching(false);
      if (matched.length > 0) saveRecentSearch(searchTerm);
    }, 300);
  }, [query, clausesData, saveRecentSearch]);

  const handleQuickSearch = useCallback((term: string) => {
    setQuery(term);
    searchClauses(term);
    inputRef.current?.focus();
  }, [searchClauses]);

  const handleClearSearch = useCallback(() => {
    setQuery(""); setResults([]); setSearched(false);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchClauses();
    if (e.key === "Escape") handleClearSearch();
  }, [searchClauses, handleClearSearch]);

  useEffect(() => {
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, []);

  const popularSearches = useMemo(() => ['consent', 'breach', 'KYC', 'CDD', 'penalty', 'registration'], []);

  return (
    <div className="space-y-5">
      <div className="text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 bg-secondary/10 text-secondary">
        <span>Searching: {activeFramework}</span>
      </div>

      <div className="rounded-xl overflow-hidden border border-border shadow-card">
        <OptimizedImage src={clauseFinderImage} alt="Search regulatory framework" className="w-full h-32 object-cover" />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input ref={inputRef} type="text" placeholder={t('search.placeholder')} value={query}
          onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
          aria-label="Search clauses" />
        {query && (
          <button onClick={handleClearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors" aria-label="Clear search">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {recentSearches.length > 0 && !query && !searched && (
        <div className="space-y-2">
          <div className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Recent searches</span></div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(term => (
              <button key={term} onClick={() => handleQuickSearch(term)} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">{term}</button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Popular searches</span>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map(term => (
            <button key={term} onClick={() => handleQuickSearch(term)} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary active:scale-95 transition-all">{term}</button>
          ))}
        </div>
      </div>

      <button onClick={() => searchClauses()} disabled={!query.trim() || searching}
        className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2">
        {searching ? <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />{t('search.searching')}</> : <><BookOpen className="w-4 h-4" />{t('search.button')}</>}
      </button>

      {searched && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{results.length === 0 ? t('search.noResults') : `${results.length} results found`}</p>
          {results.map((clause, i) => (
            <div key={clause.id} className={`rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up delay-[${i * 50}ms]`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">{clause.article_ref}</span>
                <span className="text-xs text-muted-foreground capitalize">{clause.category?.replace(/_/g, " ")}</span>
              </div>
              <h4 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{clause.summary}</p>
              {clause.penalty_info && (
                <p className="text-xs text-destructive mt-2 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />{clause.penalty_info}
                </p>
              )}
              {(clause.keywords && clause.keywords.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {clause.keywords.slice(0, 5).map(kw => (
                    <button key={kw} onClick={() => handleQuickSearch(kw)} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">{kw}</button>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border">
                <a href={activeFramework.startsWith("CBN") ? "https://www.cbn.gov.ng" : activeFramework.startsWith("SEC") ? "https://sec.gov.ng" : activeFramework.startsWith("NITDA") ? "https://nitda.gov.ng" : "https://ndpc.gov.ng"}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">
                  View official guidance <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && !query && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Search for clauses by keyword, category, or section number</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try searching for "consent", "breach", or "KYC"</p>
        </div>
      )}
    </div>
  );
};

export default ClauseFinder;