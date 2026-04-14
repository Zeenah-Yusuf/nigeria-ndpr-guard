import { useState } from "react";
import ndprData from "@/data/ndpr_dataset.json";
import { Search } from "lucide-react";

const ClauseFinder = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof ndprData.clauses>([]);
  const [searched, setSearched] = useState(false);

  const searchClauses = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const matched = ndprData.clauses
      .filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.keywords.some(k => k.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
      )
      .slice(0, 3);
    setResults(matched);
    setSearched(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clauses... (e.g., consent, breach, children)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchClauses()}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        onClick={searchClauses}
        className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        Find Clauses
      </button>

      {searched && (
        <div className="space-y-3 animate-fade-in-up">
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No clauses found. Try different keywords.</p>
          ) : (
            results.map(clause => (
              <div key={clause.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{clause.article_ref}</span>
                  <span className="text-xs text-muted-foreground capitalize">{clause.category.replace("_", " ")}</span>
                </div>
                <h4 className="font-heading font-semibold text-foreground">{clause.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{clause.summary}</p>
                {clause.penalty_info && (
                  <p className="text-xs text-destructive mt-2 font-medium">⚠ {clause.penalty_info}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {clause.keywords.slice(0, 5).map(kw => (
                    <span key={kw} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClauseFinder;
