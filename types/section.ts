import type { HeadingProps } from '@/components/Headings';

const SectionAsElement = {
  section: 'section',
  header: 'header',
  footer: 'footer',
} as const;

const SectionPadding = {
  none: 'none',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const SectionPaddingControl = {
  removeTop: 'removeTop',
  removeBottom: 'removeBottom',
} as const;

export type SectionClassNames = {
  main?: string;
  inner?: string;
  image?: string;
  imageImg?: string;
  heading?: string;
  description?: string;
};

export type SectionImage = {
  src: string;
  alt?: string;
};

export type SectionProps = {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  classNames?: SectionClassNames;
  image?: SectionImage;
  animationID?: string | null;
  heading?: HeadingProps;
  headingVariant?: string;
  size?: 'fixed' | 'full' | 'full-max' | 'breakout' | 'small';
  height?: 'full' | 'half' | 'quarter';
  description?: string;
  contentAlign?: 'center' | 'left' | 'right';
  imageAlignment?: 'top' | 'bottom';
  as?: (typeof SectionAsElement)[keyof typeof SectionAsElement];
  padding?: (typeof SectionPadding)[keyof typeof SectionPadding];
  paddingControl?: keyof typeof SectionPaddingControl | null;
  disableAnimation?: boolean;
};
