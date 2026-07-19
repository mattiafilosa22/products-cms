export type SelectOption<TValue = string> = {
  label: string;
  value: TValue;
};

export type BaseAction = {
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  onClick?: () => void;
};
