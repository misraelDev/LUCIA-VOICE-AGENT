"use client";

import * as React from "react";
import {
  ChevronDown,
  Phone,
  AlertCircle,
  Check,
  Smartphone,
  Building2,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { cn, mergeRefs } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  parsePhoneNumberFromString,
  getExampleNumber,
  AsYouType,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

import countries, { Country } from "./const/countries";

export interface PhoneInputValue {
  country: Country | null;
  phoneNumber: string;
  fullNumber: string;
  formattedNumber: string;
  nationalNumber: string;
  isValid: boolean;
  phoneType:
    | "MOBILE"
    | "FIXED_LINE"
    | "FIXED_LINE_OR_MOBILE"
    | "UNKNOWN"
    | null;
}

export interface PhoneInputProps {
  value?: PhoneInputValue;
  onChange?: (value: PhoneInputValue) => void;
  onBlur?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "modal" | "leadform";
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  containerClassName?: string;
  inputClassName?: string;
  countryButtonClassName?: string;
  defaultCountry?: CountryCode;
  showPhoneType?: boolean;
  formatAsYouType?: boolean;
  id?: string;
  name?: string;
  [key: `data-${string}`]: string | undefined;
}

const sizeClasses = {
  sm: {
    container: "h-9 text-sm",
    countryButton: "h-9 px-2 text-sm gap-1",
    input: "h-9 text-sm px-2",
    flag: "text-base",
    icon: "h-3 w-3",
  },
  md: {
    container: "h-10 text-sm",
    countryButton: "h-10 px-3 text-sm gap-1.5",
    input: "h-10 text-sm px-3",
    flag: "text-lg",
    icon: "h-4 w-4",
  },
  lg: {
    container: "h-12 text-base",
    countryButton: "h-12 px-4 text-base gap-2",
    input: "h-12 text-base px-4",
    flag: "text-xl",
    icon: "h-5 w-5",
  },
};

const variantClasses = {
  /** Misma línea visual que InputWithIcon: fondo único, columna izq. fija ~48px (w-12), sin gris aparte */
  default: {
    container:
      "border border-gray-300 bg-background dark:border-gray-600 dark:bg-background transition-colors focus-within:border-[#1868db] focus-within:ring-1 focus-within:ring-inset focus-within:ring-[#1868db]/50",
    countryButton:
      "border-r border-gray-300 bg-background hover:bg-gray-50/80 dark:border-gray-600 dark:bg-background dark:hover:bg-gray-950/40 focus:outline-none focus-visible:ring-0",
    input: "bg-background",
  },
  outline: {
    container: "border-2 border-input bg-transparent",
    countryButton: "border-r-2 border-input bg-transparent hover:bg-muted/30",
    input: "bg-transparent",
  },
  ghost: {
    container: "border border-transparent bg-muted/30",
    countryButton: "border-r border-muted bg-transparent hover:bg-muted/50",
    input: "bg-transparent",
  },
  modal: {
    container:
      "border border-[var(--field-border,#3EDD77)] bg-[#303030] focus-within:border-[var(--field-border-focus,#22AD5C)]",
    countryButton:
      "border-r border-[var(--field-border,#3EDD77)] bg-[#303030] hover:bg-[#404040] text-white",
    input:
      "bg-transparent text-white placeholder:text-white/60 font-poppins text-[13px] font-medium",
  },
  /** Lead form style: country and phone as two separate fields with gap, no outer container */
  leadform: {
    container:
      "rounded-none overflow-visible border-0 bg-transparent gap-3 focus-within:ring-0 w-full",
    countryButton:
      "border border-[var(--field-border,#8EDCE6)] bg-[var(--field-bg,#3C3E42)] rounded-[var(--field-radius,0.75rem)] hover:bg-white/5 text-[var(--field-text,#fff)] [&_span]:text-[var(--field-text,#fff)] [&_svg]:text-[var(--field-text,#fff)] shrink-0",
    input:
      "border border-[var(--field-border,#8EDCE6)] bg-[var(--field-bg,#3C3E42)] rounded-[var(--field-radius,0.75rem)] text-[var(--field-text,#fff)] placeholder:text-white/70 flex-1 min-w-0 w-full",
  },
};

// Helper para obtener el placeholder dinámico basado en el país
function getPlaceholderForCountry(countryCode: CountryCode): string {
  try {
    const example = getExampleNumber(countryCode, examples);
    if (example) {
      return example.formatNational();
    }
  } catch {
    // Fallback si no hay ejemplo
  }
  return "Número de teléfono";
}

// Helper para parsear y validar el número
function parsePhoneValue(
  phoneNumber: string,
  country: Country | null,
): Omit<PhoneInputValue, "country" | "phoneNumber"> {
  if (!country || !phoneNumber) {
    return {
      fullNumber: country ? `${country.dialCode}${phoneNumber}` : phoneNumber,
      formattedNumber: phoneNumber,
      nationalNumber: phoneNumber,
      isValid: false,
      phoneType: null,
    };
  }

  try {
    const parsed = parsePhoneNumberFromString(phoneNumber, country.code);
    if (parsed) {
      const phoneType = parsed.getType();
      return {
        fullNumber: parsed.format("E.164"),
        formattedNumber: parsed.formatInternational(),
        nationalNumber: parsed.formatNational(),
        isValid: parsed.isValid(),
        phoneType:
          phoneType === "MOBILE"
            ? "MOBILE"
            : phoneType === "FIXED_LINE"
              ? "FIXED_LINE"
              : phoneType === "FIXED_LINE_OR_MOBILE"
                ? "FIXED_LINE_OR_MOBILE"
                : "UNKNOWN",
      };
    }
  } catch {
    // Error parsing
  }

  return {
    fullNumber: `${country.dialCode}${phoneNumber}`,
    formattedNumber: phoneNumber,
    nationalNumber: phoneNumber,
    isValid: false,
    phoneType: null,
  };
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      value,
      onChange,
      onBlur,
      size = "md",
      variant = "default",
      disabled = false,
      required = false,
      error,
      helperText,
      label,
      placeholder,
      className,
      containerClassName,
      inputClassName,
      countryButtonClassName,
      style,
      defaultCountry,
      showPhoneType = false,
      formatAsYouType = true,
      id,
      name,
      ...dataProps
    },
    ref,
  ) {
  const [open, setOpen] = React.useState(false);
  const [internalCountry, setInternalCountry] = React.useState<Country | null>(
    () => {
      if (defaultCountry) {
        return countries.find((c) => c.code === defaultCountry) || null;
      }
      return null;
    },
  );
  const [internalPhone, setInternalPhone] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Use controlled or uncontrolled values
  const selectedCountry = value?.country ?? internalCountry;
  const phoneNumber = value?.phoneNumber ?? internalPhone;

  // Parse and validate the current phone value
  const parsedValue = React.useMemo(
    () => parsePhoneValue(phoneNumber, selectedCountry),
    [phoneNumber, selectedCountry],
  );

  // Auto-detect country from phone number on mount or value change if country is missing
  React.useEffect(() => {
    if (phoneNumber && !selectedCountry) {
      try {
        const parsed = parsePhoneNumberFromString(phoneNumber);
        if (parsed && parsed.country) {
          const country = countries.find((c) => c.code === parsed.country);
          if (country) {
            if (onChange) {
              const parsedVal = parsePhoneValue(phoneNumber, country);
              onChange({
                country,
                phoneNumber,
                ...parsedVal,
              });
            } else {
              setInternalCountry(country);
            }
          }
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
  }, [phoneNumber, selectedCountry, onChange]);

  // Dynamic placeholder based on country
  const dynamicPlaceholder = React.useMemo(() => {
    if (placeholder) return placeholder;
    if (selectedCountry) return getPlaceholderForCountry(selectedCountry.code);
    return "Selecciona un país primero";
  }, [placeholder, selectedCountry]);

  // Computed validation with libphonenumber
  const hasValidNumber = parsedValue.isValid;
  const hasError =
    error ||
    (touched && required && !selectedCountry && phoneNumber.length > 0) ||
    (touched && phoneNumber.length > 0 && selectedCountry && !hasValidNumber);

  const validationMessage = React.useMemo(() => {
    if (error) return error;
    if (touched && required && !selectedCountry && phoneNumber.length > 0) {
      return "Selecciona un país antes de ingresar el número";
    }
    if (
      touched &&
      phoneNumber.length > 0 &&
      selectedCountry &&
      !hasValidNumber
    ) {
      return "El número de teléfono no es válido para este país";
    }
    return null;
  }, [error, touched, required, selectedCountry, phoneNumber, hasValidNumber]);

  const handleCountrySelect = (country: Country) => {
    setOpen(false);

    const parsed = parsePhoneValue(phoneNumber, country);
    const newValue: PhoneInputValue = {
      country,
      phoneNumber,
      ...parsed,
    };

    if (onChange) {
      onChange(newValue);
    } else {
      setInternalCountry(country);
    }

    // Focus on input after selecting country
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Format as you type if enabled
    if (formatAsYouType && selectedCountry) {
      const formatter = new AsYouType(selectedCountry.code);
      const _formatted = formatter.input(inputValue);
      // Extract only numbers for storage but display formatted
      inputValue = inputValue.replace(/\D/g, "");
    } else {
      // Only allow numbers
      inputValue = inputValue.replace(/\D/g, "");
    }

    const parsed = parsePhoneValue(inputValue, selectedCountry);
    const newValue: PhoneInputValue = {
      country: selectedCountry,
      phoneNumber: inputValue,
      ...parsed,
    };

    if (onChange) {
      onChange(newValue);
    } else {
      setInternalPhone(inputValue);
    }
  };

  // Format display value
  const displayValue = React.useMemo(() => {
    if (!formatAsYouType || !selectedCountry || !phoneNumber)
      return phoneNumber;
    const formatter = new AsYouType(selectedCountry.code);
    return formatter.input(phoneNumber);
  }, [formatAsYouType, selectedCountry, phoneNumber]);

  const handleInputFocus = () => {
    if (!selectedCountry) {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];
  const isLeadForm = variant === "leadform";

  return (
    <div className={cn("w-full max-w-full space-y-1.5 box-border", className)} style={style}>
      {label && (
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        className={cn(
          "flex w-full items-stretch rounded-lg box-border max-w-full",
          variant !== "leadform" && "overflow-hidden",
          sizes.container,
          variants.container,
          containerClassName,
          hasError &&
            "border-destructive !ring-1 !ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Country Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label="Seleccionar país"
              className={cn(
                "country-selector-button flex items-center shrink-0 transition-colors",
                sizes.countryButton,
                variants.countryButton,
                countryButtonClassName,
                variant === "default" &&
                  "w-12 min-w-12 max-w-12 justify-center !gap-1 !px-1",
                disabled && "pointer-events-none",
                !selectedCountry && "text-muted-foreground",
              )}
              style={isLeadForm ? style : undefined}
            >
              {selectedCountry ? (
                <>
                  <ReactCountryFlag
                    countryCode={selectedCountry.code}
                    svg
                    style={{ width: "1.25em", height: "0.9em" }}
                    aria-label={selectedCountry.name}
                  />
                  {variant !== "default" && (
                    <span className="font-medium">{selectedCountry.dialCode}</span>
                  )}
                </>
              ) : (
                <>
                  <Phone className={cn(sizes.icon, "text-muted-foreground")} />
                  {variant !== "default" && (
                    <span className="text-muted-foreground">País</span>
                  )}
                </>
              )}
              <ChevronDown
                className={cn(
                  sizes.icon,
                  "text-muted-foreground shrink-0",
                  variant === "default" ? "ml-0" : "ml-0.5",
                )}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 z-[10001]" align="start">
            <Command>
              <CommandInput placeholder="Buscar país..." />
              <CommandList>
                <CommandEmpty>No se encontró el país.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.dialCode}`}
                      onSelect={() => handleCountrySelect(country)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{ width: "1.4em", height: "1em" }}
                        aria-label={country.name}
                      />
                      <span className="flex-1">{country.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {country.dialCode}
                      </span>
                      {selectedCountry?.code === country.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <input
          ref={mergeRefs(inputRef, ref)}
          type="tel"
          inputMode="numeric"
          id={id}
          name={name}
          value={displayValue}
          onChange={handlePhoneChange}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={dynamicPlaceholder}
          className={cn(
            "phone-input-field flex-1 min-w-0 focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed !ring-0",
            !isLeadForm && "!border-none",
            sizes.input,
            variants.input,
            inputClassName,
          )}
          style={isLeadForm ? style : undefined}
          {...dataProps}
        />

        {/* Phone Type Indicator */}
        {showPhoneType && parsedValue.phoneType && hasValidNumber && (
          <div className="flex items-center px-2 text-muted-foreground">
            {parsedValue.phoneType === "MOBILE" && (
              <Smartphone className={cn(sizes.icon, "text-blue-500")} />
            )}
            {parsedValue.phoneType === "FIXED_LINE" && (
              <Building2 className={cn(sizes.icon, "text-slate-500")} />
            )}
          </div>
        )}

      </div>

      {/* Helper/Error Text */}
      {(validationMessage || helperText) && (
        <div
          className={cn(
            "text-sm flex items-start gap-2",
            validationMessage ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {validationMessage && (
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <p className="leading-snug">{validationMessage || helperText}</p>
        </div>
      )}
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

// Hook para validación externa con libphonenumber
export function usePhoneValidation(value: PhoneInputValue | undefined) {
  const isValid = React.useMemo(() => {
    if (!value) return false;
    return value.isValid === true;
  }, [value]);

  const getError = React.useCallback(() => {
    if (!value) return "El teléfono es requerido";
    if (!value.country) return "Selecciona un país";
    if (!value.phoneNumber) return "Ingresa un número de teléfono";
    if (!value.isValid)
      return "El número de teléfono no es válido para este país";
    return null;
  }, [value]);

  const getPhoneType = React.useCallback(() => {
    if (!value || !value.isValid) return null;
    return value.phoneType;
  }, [value]);

  const getFormattedNumber = React.useCallback(
    (format: "international" | "national" | "e164" = "international") => {
      if (!value || !value.isValid) return value?.phoneNumber ?? "";
      switch (format) {
        case "international":
          return value.formattedNumber;
        case "national":
          return value.nationalNumber;
        case "e164":
          return value.fullNumber;
        default:
          return value.formattedNumber;
      }
    },
    [value],
  );

  return { isValid, getError, getPhoneType, getFormattedNumber };
}

/**
 * Parses a phone number string and returns the country and national number
 * @param phoneNumber - Phone number in E.164 format (e.g., "+34612345678") or any format
 * @returns Object with country and nationalNumber, or null if parsing fails
 */
export function parsePhoneNumberToCountry(phoneNumber: string): {
  country: Country | null;
  nationalNumber: string;
} | null {
  if (!phoneNumber) return null;

  try {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (parsed && parsed.country) {
      const country = countries.find((c) => c.code === parsed.country);
      if (country) {
        return {
          country,
          nationalNumber: parsed.nationalNumber,
        };
      }
    }
  } catch {
    // Error parsing
  }

  return null;
}
