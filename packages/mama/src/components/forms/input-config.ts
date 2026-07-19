import { RefCallBack } from "react-hook-form";

export interface InputConfig {
  error?: boolean;
  name?: string;
  placeholder?: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  ref?: RefCallBack;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  readonly?: boolean;
}
