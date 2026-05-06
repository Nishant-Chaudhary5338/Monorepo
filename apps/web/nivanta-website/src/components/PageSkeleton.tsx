export default function PageSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      {/* Navbar placeholder */}
      <div className="h-16 bg-[#032105]" />
      {/* Hero placeholder */}
      <div className="h-screen skeleton-pulse" />
    </div>
  );
}
