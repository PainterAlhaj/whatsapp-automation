import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export interface CountryOption {
  code: CountryCode;
  callingCode: string;
  name: string;
  flag: string;
  label: string;
}

/**
 * Converts a 2-letter ISO country code into a flag emoji.
 */
const getFlagEmoji = (countryCode: string): string => {
  try {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  } catch {
    return "🌐";
  }
};

const displayNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

/**
 * Returns a sorted list of all countries with ISO code, calling code, name, and flag emoji.
 * Sourced directly from `libphonenumber-js`.
 */
export const getAllCountries = (): CountryOption[] => {
  const countries = getCountries();
  const list: CountryOption[] = countries.map((code) => {
    let callingCode = "";
    try {
      callingCode = getCountryCallingCode(code);
    } catch {
      callingCode = "";
    }
    const name = displayNames?.of(code) || code;
    const flag = getFlagEmoji(code);
    return {
      code,
      callingCode: callingCode ? `+${callingCode}` : "",
      name,
      flag,
      label: `${flag} ${name} (${callingCode ? `+${callingCode}` : ""})`,
    };
  });

  return list.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Validates a mobile number for a specific country using libphonenumber-js.
 */
export const validatePhoneForCountry = (
  phoneNumber: string,
  countryCode: CountryCode
): boolean => {
  if (!phoneNumber || !phoneNumber.trim()) return false;
  try {
    return isValidPhoneNumber(phoneNumber.trim(), countryCode);
  } catch {
    return false;
  }
};

/**
 * Formats a phone number in international format (+91 98765 43210).
 */
export const formatPhoneInternational = (
  phoneNumber: string,
  countryCode: CountryCode
): string => {
  try {
    const parsed = parsePhoneNumberFromString(phoneNumber, countryCode);
    if (parsed && parsed.isValid()) {
      return parsed.formatInternational();
    }
  } catch {
    // fallback
  }
  return phoneNumber;
};
