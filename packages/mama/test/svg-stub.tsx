import React from "react";

// Test stand-in for svgr: every .svg import resolves to a plain <svg> component.
const SvgStub: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg data-testid="svg-stub" {...props} />
);

export default SvgStub;
