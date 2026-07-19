import { RefCallBack } from "react-hook-form";

export interface InputConfig {
  error?: boolean;
  name?: string;
  placeholder?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  ref?: RefCallBack;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: removed in Piece 3 (typed render prop)
  onChange?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: removed in Piece 3 (typed render prop)
  onBlur?: (e: any) => void;
  readonly?: boolean;
}
