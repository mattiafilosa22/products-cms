import { RefCallBack } from "react-hook-form";

// Shared contract for form inputs. TValue is the value the input works with:
// InputText/TextArea use the default string, InputPrice uses number|string|null.
export interface InputConfig<TValue = string> {
  error?: boolean;
  name?: string;
  placeholder?: string;
  value?: TValue;
  ref?: RefCallBack;
  onChange?: (value: TValue) => void;
  onBlur?: (value?: TValue) => void;
  readonly?: boolean;
}
