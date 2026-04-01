import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import countries from "@/components/ui/common/PhoneInput/Countries";
import type { PhoneInputValue } from "@/components/ui/common/PhoneInput/PhoneInput";

function mapPhoneType(
  parsed: ReturnType<typeof parsePhoneNumberFromString>,
): PhoneInputValue["phoneType"] {
  if (!parsed) return null;
  const t = parsed.getType();
  if (t === "MOBILE") return "MOBILE";
  if (t === "FIXED_LINE") return "FIXED_LINE";
  if (t === "FIXED_LINE_OR_MOBILE") return "FIXED_LINE_OR_MOBILE";
  return "UNKNOWN";
}

/**
 * Convierte el string guardado en el formulario (`v.fullNumber`, p. ej. +5255… mientras se escribe)
 * al objeto `PhoneInputValue`. Antes solo se parseaba E.164 completo y con números parciales
 * devolvía `undefined`, rompiendo el modo controlado y bloqueando el teclado.
 */
export function e164ToPhoneInputValue(
  stored: string,
  defaultCountry: CountryCode = "MX",
): PhoneInputValue | undefined {
  const trimmed = (stored ?? "").trim();
  if (!trimmed) return undefined;

  const asGlobal = parsePhoneNumberFromString(trimmed);
  if (asGlobal?.country) {
    const country = countries.find((c) => c.code === asGlobal.country);
    if (country) {
      return {
        country,
        phoneNumber: asGlobal.nationalNumber,
        fullNumber: asGlobal.format("E.164"),
        formattedNumber: asGlobal.formatInternational(),
        nationalNumber: asGlobal.formatNational(),
        isValid: asGlobal.isValid(),
        phoneType: mapPhoneType(asGlobal),
      };
    }
  }

  const allDigits = trimmed.replace(/\D/g, "");
  if (!allDigits) return undefined;

  const sorted = [...countries].sort(
    (a, b) =>
      b.dialCode.replace(/\D/g, "").length -
      a.dialCode.replace(/\D/g, "").length,
  );

  let country: (typeof countries)[number] | null = null;
  let nationalDigits = "";

  for (const c of sorted) {
    const d = c.dialCode.replace(/\D/g, "");
    if (d && allDigits.startsWith(d)) {
      country = c;
      nationalDigits = allDigits.slice(d.length);
      break;
    }
  }

  if (!country) {
    country = countries.find((c) => c.code === defaultCountry) ?? null;
    if (!country) return undefined;
    nationalDigits = allDigits;
  }

  try {
    const parsed = parsePhoneNumberFromString(nationalDigits, country.code);
    if (parsed) {
      return {
        country,
        phoneNumber: nationalDigits,
        fullNumber: parsed.format("E.164"),
        formattedNumber: parsed.formatInternational(),
        nationalNumber: parsed.formatNational(),
        isValid: parsed.isValid(),
        phoneType: mapPhoneType(parsed),
      };
    }
  } catch {
    /* seguir con fallback */
  }

  return {
    country,
    phoneNumber: nationalDigits,
    fullNumber: `${country.dialCode}${nationalDigits}`,
    formattedNumber: nationalDigits,
    nationalNumber: nationalDigits,
    isValid: false,
    phoneType: null,
  };
}
