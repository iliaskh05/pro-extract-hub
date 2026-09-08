declare module "react-simple-maps" {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode, SVGProps } from "react";

  export type ProjectionConfig = {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  };

  export type GeographyStyle = {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  };

  export type GeographyType = {
    rsmKey: string;
    svgPath: string;
    properties: Record<string, string | number | undefined>;
  };

  export const ComposableMap: ComponentType<
    SVGProps<SVGSVGElement> & {
      projection?: string;
      projectionConfig?: ProjectionConfig;
      width?: number;
      height?: number;
      children?: ReactNode;
    }
  >;

  export const Geographies: ComponentType<{
    geography: string | object;
    children: (data: { geographies: GeographyType[] }) => ReactNode;
  }>;

  export const Geography: ComponentType<{
    geography: GeographyType;
    style?: GeographyStyle;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onClick?: (event: MouseEvent) => void;
  }>;
}
