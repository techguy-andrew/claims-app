export type VariantProps<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K];
} & {
  className?: string;
};

export const createVariants = <T extends Record<string, Record<string, string>>>(
  variants: T
) => {
  return (props: VariantProps<T>) => {
    const { className, ...variantProps } = props;
    
    const variantClasses = Object.entries(variantProps)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const variantGroup = variants[key as keyof T];
        return variantGroup?.[value as string];
      })
      .filter(Boolean);
    
    return [
      ...variantClasses,
      className
    ].filter(Boolean).join(' ');
  };
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export type ScreenSize = keyof typeof BREAKPOINTS;

export const getScreenSize = (width: number): ScreenSize => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};