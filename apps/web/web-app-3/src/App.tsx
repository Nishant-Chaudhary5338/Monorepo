import { Deck, Progress } from "@repo/present";
import {
  TitleSlide,
  ProblemSlide,
  MonorepoExplainerSlide,
  ArchitectureSlide,
  SolutionSlide,
  TurborepoSlide,
  FrontendAutomationSlide,
  CostImpactSlide,
  BeforeAfterSlide,
  CreativitySlide,
  TimelineSlide,
  CallToActionSlide,
} from "./slides";
import "./presentation.css";

function App() {
  return (
    <Deck theme="light" initialSlide={0}>
      <TitleSlide />
      <ProblemSlide />
      <MonorepoExplainerSlide />
      <ArchitectureSlide />
      <SolutionSlide />
      <TurborepoSlide />
      <FrontendAutomationSlide />
      <CostImpactSlide />
      <BeforeAfterSlide />
      <CreativitySlide />
      <TimelineSlide />
      <CallToActionSlide />
      <Progress />
    </Deck>
  );
}

export default App;
