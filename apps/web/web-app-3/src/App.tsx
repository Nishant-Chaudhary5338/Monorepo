import SlideEngine from "./SlideEngine";
import {
  TitleSlide,
  ProblemSlide,
  MonorepoSlide,
  SharedPackagesSlide,
  AppsLayerSlide,
  TurborepoSlide,
  MCPToolsSlide,
  WorkflowSlide,
  ResultsSlide,
  ROISlide,
  CTASlide,
} from "./slides";
import "./presentation.css";

function App() {
  return (
    <SlideEngine>
      <TitleSlide />
      <ProblemSlide />
      <MonorepoSlide />
      <SharedPackagesSlide />
      <AppsLayerSlide />
      <TurborepoSlide />
      <MCPToolsSlide />
      <WorkflowSlide />
      <ResultsSlide />
      <ROISlide />
      <CTASlide />
    </SlideEngine>
  );
}

export default App;
