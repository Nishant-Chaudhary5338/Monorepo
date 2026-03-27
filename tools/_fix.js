const fs=require("fs"),path=require("path"),b="/Users/nishantchaudhary/Desktop/my-turborepo/tools";function ttn(h){return h.replace(/^handle/,"").replace(/([A-Z])/g,"_$1").toLowerCase().replace(/^_/,"")};var t={"analyze-ui-design":[{h:"handleAnalyze",d:"Analyze UI design"},{h:"handleAnalyzeAndSave",d:"Analyze and save"},{h:"handleGetFormats",d:"List formats"}],"component-fixer":[{h:"handleFix",d:"Fix component issues"}],"component-improver":[{h:"handleImprove",d:"Improve components"}],"component-reviewer":[{h:"handleReview",d:"Review components"}],"config-manager":[{h:"handleValidatePackageJson",d:"Validate package.json"},{h:"handleCheckTsconfigExtends",d:"Check tsconfig extends"},{h:"handleCompareConfigs",d:"Compare configs"},{h:"handleGenerateEnvExample",d:"Generate env example"},{h:"handleExtractEnvUsage",d:"Extract env usage"},{h:"handleCheckConfigDrift",d:"Check config drift"},{h:"handleListConfigFiles",d:"List config files"}],"dep-auditor":[{h:"handleFindUnusedDeps",d:"Find unused deps"},{h:"handleFindDuplicateDeps",d:"Find duplicate deps"},{h:"handleCheckOutdated",d:"Check outdated"},{h:"handleAnalyzeBundleImpact",d:"Bundle impact"},{h:"handleFindUndeclaredDeps",d:"Phantom deps"},{h:"handleDepSizes",d:"Dependency sizes"}],"enforce-design-tokens":[{h:"handleScan",d:"Scan hardcoded values"},{h:"handleSuggest",d:"Suggest tokens"},{h:"handleEnforce",d:"Enforce tokens"}],"fix-failing-tests":[{h:"handleRunTests",d:"Run tests"},{h:"handleAnalyzeFailures",d:"Analyze failures"},{h:"handleAutoFix",d:"Auto fix"}],"generate-tests":[{h:"handleGenerateUnitTests",d:"Generate unit tests"},{h:"handleGenerateComponentTests",d:"Component tests"},{h:"handleGenerateHookTests",d:"Hook tests"},{h:"handleGenerateAllTests",d:"All tests"}],"lighthouse-runner":[{h:"handleRunLighthouse",d:"Run Lighthouse"},{h:"handleCollectMetrics",d:"Collect metrics"},{h:"handleCompareAudits",d:"Compare audits"},{h:"handleStaticAudit",d:"Static audit"}],"monorepo-manager":[{h:"handleListPackages",d:"List packages"},{h:"handleFindDependents",d:"Find dependents"},{h:"handleDependencyGraph",d:"Dep graph"},{h:"handleCheckHealth",d:"Check health"},{h:"handleRunAcrossPackages",d:"Run across packages"},{h:"handleFindSharedDeps",d:"Shared deps"},{h:"handleSyncConfig",d:"Sync config"}],"performance-audit":[{h:"handleAuditBundle",d:"Audit bundle"},{h:"handleDetectHeavy",d:"Heavy imports"},{h:"handleRenderPerf",d:"Render perf"}],"quality-pipeline":[{h:"handleFullPipeline",d:"Full pipeline"},{h:"handlePartialPipeline",d:"Partial pipeline"}],"render-analyzer":[{h:"handleDetectRerenders",d:"Detect re-renders"},{h:"handleCheckMemo",d:"Memo usage"},{h:"handleAnalyzeProps",d:"Props analysis"}],"storybook-generator":[{h:"handleGenerate",d:"Generate stories"},{h:"handleCoverage",d:"Coverage"}]};Object.entries(t).forEach(function(e){var dr=e[0],defs=e[1],fp=path.join(b,dr,"src","index.ts");if(!fs.existsSync(fp)){console.log("SKIP:",dr);return}var c=fs.readFileSync(fp,"utf8");var calls=defs.map(function(x){var tn=ttn(x.h);return "    this.addTool(
      '"+tn+"',
      '"+x.d+"',
      {
        type: 'object',
        properties: { path: { type: 'string', description: 'Path to analyze' } },
        required: ['path'],
      },
      this."+x.h+".bind(this)
    );"}).join("

");c=c.replace(/protected registerTools(): void {s*
s*
s*
s*}/,"protected registerTools(): void {
"+calls+"
  }");c=c.replace(/constructor() {s*
s*process.on('SIGINT'[^;]*;s*
s*}/,"constructor() {
    super({ name: '"+dr+"', version: '2.0.0' });
  }");c=c.replace(/s*process.on('SIGINT'[^;]*;/g,"");c=c.replace(/imports*{[^}]*}s*froms*'@modelcontextprotocol\/sdk\/[^']+';s*
/g,"");c=c.replace(/
{4,}/g,"


");fs.writeFileSync(fp,c);console.log("Fixed:",dr)});console.log("Done!")