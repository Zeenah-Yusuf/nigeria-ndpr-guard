import { ShieldCheck, Search, ArrowRight } from "lucide-react";

const SolutionSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "NDPR Risk Scanner",
      description: "Answer 8 simple yes/no questions about your app. Get an instant risk score with triggered NDPR clauses and plain-English explanations.",
      flow: "Questionnaire → Risk Score → Plain-English Explanation",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Search,
      title: "Clause Finder",
      description: "Search the full NDPR Implementation Framework by keyword. Find the exact clause that applies to your situation with a clear summary.",
      flow: "Keyword Search → Exact NDPR Clause → Summary",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <section id="solution" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Two tools. Complete clarity.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            RegTrack gives you instant compliance insights powered by the full NDPR framework.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-elevated transition-shadow group">
              <div className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground mb-4">{f.description}</p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                {f.flow.split(" → ").map((step, i, arr) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="bg-primary/10 px-2.5 py-1 rounded-md">{step}</span>
                    {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
