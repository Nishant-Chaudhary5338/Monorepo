interface Props {
  num: string;
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const TitleHeader = ({ num, label, title, subtitle, className = "" }: Props) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <div className="section-eyebrow">
      <span className="section-eyebrow-num">{num}</span>
      <span>— {label}</span>
    </div>
    <div className="section-rule" />
    <h2 className="section-title">{title}</h2>
    {subtitle && (
      <p className="section-body" style={{ maxWidth: "60ch" }}>{subtitle}</p>
    )}
  </div>
);

export default TitleHeader;
