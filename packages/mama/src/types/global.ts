export type SelectOption = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type BaseAction = {
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  onClick?: () => void;
};
