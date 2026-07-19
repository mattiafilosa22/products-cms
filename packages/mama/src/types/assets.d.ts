// Declaration per gli asset importati dai componenti: SCSS modules e SVG
// (gli SVG sono trasformati in componenti React da @svgr, come in apps/web).

declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  import React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
