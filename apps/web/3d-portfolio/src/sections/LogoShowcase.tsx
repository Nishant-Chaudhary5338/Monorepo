import { logoIconsList } from "../constants";
import { LogoIconProps } from "../types";

const LogoIcon = ({ icon }: LogoIconProps) => {
  return (
    <div className="flex-none flex-center marquee-item">
      <div
        className="rounded-xl p-3 flex-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <img src={icon.imgPath} alt={icon.imgPath} className="size-14 object-contain" />
      </div>
    </div>
  );
};

const LogoShowcase = () => (
  <div className="md:my-20 my-10 relative">
    <div className="gradient-edge" />
    <div className="gradient-edge" />

    <div className="marquee h-52">
      <div className="marquee-box md:gap-12 gap-5">
        {logoIconsList.map((icon, index) => (
          <LogoIcon key={index} icon={icon} />
        ))}

        {logoIconsList.map((icon, index) => (
          <LogoIcon key={index} icon={icon} />
        ))}
      </div>
    </div>
  </div>
);

export default LogoShowcase;
