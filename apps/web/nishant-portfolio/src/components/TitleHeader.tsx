import { TitleHeaderProps } from '../types';

const TitleHeader = ({ num, label, title, className = "" }: TitleHeaderProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <div className="section-eyebrow">{num} / {label}</div>
    <h2 className="display-headline" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
      {title}
    </h2>
  </div>
);

export default TitleHeader;
