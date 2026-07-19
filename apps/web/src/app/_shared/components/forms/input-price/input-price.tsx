import React, { ChangeEvent, useState, useEffect } from "react";
import styles from "./input-price.module.scss";
import { InputConfig } from "../input-config";

interface ContainerProps extends InputConfig {
  placeholder?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  skinny?: boolean;
  readonly?: boolean;
  currency?: string;
  prefix?: string;
}

export const InputPrice: React.FC<ContainerProps> = ({
  name,
  ref,
  error,
  icon = null,
  skinny = false,
  onChange = null,
  onBlur = null,
  value = "",
  readonly = false,
  placeholder = undefined,
  currency = "EUR",
  prefix = "",
}) => {
  const [price, setPrice] = useState(value || "");
  const [focused, setFocused] = useState(false);

  const unformatPrice = (raw: string) => {
    if (!raw) return "";
    const cleaned = String(raw).replace(/[^0-9.,]/g, "");
    const lastDot = cleaned.lastIndexOf(".");
    const lastComma = cleaned.lastIndexOf(",");

    if (lastDot === -1 && lastComma === -1) return cleaned;

    // scegli quale separatore è usato come decimale (l'ultimo tra ',' e '.')
    const decimalSep = lastComma > lastDot ? "," : ".";

    const decIndex = cleaned.lastIndexOf(decimalSep);
    if (decIndex === -1) return cleaned.replace(/[.,]/g, "");

    const whole = cleaned.slice(0, decIndex).replace(/[.,]/g, "");
    const frac = cleaned.slice(decIndex + 1).replace(/[.,]/g, "");
    return frac ? `${whole}${decimalSep}${frac}` : whole;
  };

  const handleFocus = () => {
    setFocused(true);
    setPrice((prev: string) => unformatPrice(prev));
  };

  useEffect(() => {
    if (focused) return;
    const raw = value || "";
    const parsed = parseFloat(String(raw).replace(",", "."));
    if (raw !== "" && !isNaN(parsed)) {
      const formatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: currency,
        currencyDisplay: "symbol",
      }).format(parsed);
      setPrice(formatted);
    } else {
      setPrice(raw);
    }
  }, [value, focused, currency]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*[,.]?[0-9]{0,2}$/;
    if (regex.test(value)) {
      setPrice(value);
      const numberValue = parseFloat(value.replace(",", "."));
      onChange?.(isNaN(numberValue) ? null : numberValue);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (price) {
      const numberValue = parseFloat(price.replace(",", "."));
      if (!isNaN(numberValue)) {
        const formatted = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: currency,
          currencyDisplay: "symbol",
        }).format(numberValue);

        setPrice(formatted);
        onBlur?.(numberValue);
        return;
      }
    }
    onBlur?.(null);
  };

  const Icon = icon;

  return (
    <div className={styles.appInputPrice}>
      <div
        className={`${styles.inputContainer} ${
          readonly ? "readonly-field" : ""
        } ${error ? styles.inputError : ""} ${skinny ? styles.skinny : ""}`}
      >
        {prefix && readonly && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={name}
          ref={ref}
          type="text"
          value={price}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={readonly}
          placeholder={placeholder}
        />
        {Icon && <Icon className="inputIcon" width={24} height={24} />}
      </div>
    </div>
  );
};
