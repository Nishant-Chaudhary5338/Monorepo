import { Deck, Progress } from "@repo/present";
import {
  TitleSlide,
  ProblemSlide,
  CostImpactSlide,
  SolutionSlide,
  FrontendAutomationSlide,
  CreativitySlide,
  CallToActionSlide,
} from "./slides";
import "./presentation.css";

function App() {
  return (
    <Deck theme="light" initialSlide={0}>
      <TitleSlide />
      <ProblemSlide />
      <SolutionSlide />
      <FrontendAutomationSlide />
      <CostImpactSlide />
      <CreativitySlide />
      <CallToActionSlide />
      <Progress />
    </Deck>
  );
}

export default App;