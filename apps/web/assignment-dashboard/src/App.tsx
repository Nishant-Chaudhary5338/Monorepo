import { useState } from "react";
import { getDashboardData } from "./data";
import SummaryCards from "./components/SummaryCards";
import AccuracyChart from "./components/AccuracyChart";
import LeadTimeChart from "./components/LeadTimeChart";
import AgreementChart from "./components/AgreementChart";
import AnnotatorTable from "./components/AnnotatorTable";

const data = getDashboardData();

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "details">("dashboard");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm border-border/50">
        <div className="px-8 py-3 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Annotation Quality Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                WeloData FE Assessment — Annotator performance & accuracy overview
              </p>
            </div>
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`text-sm pb-1 border-b-2 transition-colors ${
                  activeTab === "dashboard"
                    ? "text-foreground border-primary font-medium"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`text-sm pb-1 border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "text-foreground border-primary font-medium"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                Details
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="px-8 py-4 mx-auto max-w-7xl">
        {activeTab === "dashboard" ? (
          <div className="space-y-4">
            <SummaryCards data={data} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AccuracyChart data={data} />
              <LeadTimeChart data={data} />
            </div>

            <AgreementChart data={data} />

            <footer className="py-4 text-xs text-center text-muted-foreground">
              Data sourced from fe_assessment.json · Ground truth comparison based on 9 verified tasks
            </footer>
          </div>
        ) : (
          <div className="space-y-4">
            <AnnotatorTable data={data} />

            <footer className="py-4 text-xs text-center text-muted-foreground">
              Data sourced from fe_assessment.json · Ground truth comparison based on 9 verified tasks
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
