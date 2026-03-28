import { SlideComponent as Slide } from "@repo/present";

export function TitleSlide() {
  return (
    <Slide layout="center" title="Title">
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-12">
        <div className="mb-6 text-sm uppercase tracking-[0.2em] text-purple-600">
          Engineering Transformation
        </div>
        <h1 className="mb-4 text-[3.5rem] font-extrabold leading-tight">
          <span className="gradient-text">From Scattered Codebase</span>
          <br />
          <span className="text-gray-800">to AI-Driven Monorepo</span>
        </h1>
        <p className="mt-6 max-w-[600px] text-center text-xl text-gray-500">
          Cutting Costs · Boosting Productivity · Unleashing Innovation
        </p>
        <div className="mt-8 rounded-full border border-purple-300 px-6 py-2 text-sm text-purple-600">
          Press → to continue · F for fullscreen
        </div>
      </div>
    </Slide>
  );
}