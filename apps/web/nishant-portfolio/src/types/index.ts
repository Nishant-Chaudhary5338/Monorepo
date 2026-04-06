import { ReactNode } from 'react';

export interface ButtonProps {
  text: string;
  className?: string;
  id?: string;
}

export interface ExpCard {
  review: string;
  imgPath: string;
  logoPath: string;
  title: string;
  company: string;
  date: string;
  location?: string;
  highlights?: string[];
  responsibilities: string[];
  techStack?: string[];
}

export interface ExpContentProps {
  expContent: ExpCard;
}

export interface GlowCard {
  name: string;
  mentions?: string;
  review: string;
  imgPath: string;
}

export interface GlowCardProps {
  card: GlowCard | ExpCard;
  index: number;
  children: ReactNode;
}

export interface TitleHeaderProps {
  title: string;
  sub: string;
}

export interface LogoIconProps {
  icon: {
    imgPath: string;
  };
}

export interface TechIconCardExperienceProps {
  model: {
    name: string;
    modelPath: string;
    scale: number;
    rotation: [number, number, number];
  };
}

export interface ComputerProps {
  [key: string]: unknown;
}

export interface RoomProps {
  [key: string]: unknown;
}

export interface TechStackIcon {
  name: string;
  modelPath: string;
  scale: number;
  rotation: [number, number, number];
}
