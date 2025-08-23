export type Library001VariantProps<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K];
} & {
  className?: string;
};

export const createLibrary001Variants = <T extends Record<string, Record<string, string>>>(
  variants: T
) => {
  return (props: Library001VariantProps<T>) => {
    const { className, ...variantProps } = props;
    
    const variantClasses = Object.entries(variantProps)
      .filter(([, value]) => value !== undefined)
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

export const library001Cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const LIBRARY001_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export type Library001ScreenSize = keyof typeof LIBRARY001_BREAKPOINTS;

export const getLibrary001ScreenSize = (width: number): Library001ScreenSize => {
  if (width < LIBRARY001_BREAKPOINTS.mobile) return 'mobile';
  if (width < LIBRARY001_BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};