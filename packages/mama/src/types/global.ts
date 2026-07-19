export type SelectOption = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: made generic with the form typing work (Piece 3)
  value: any;
};

export type BaseAction = {
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  onClick?: () => void;
};
