import type { CountryCode } from "libphonenumber-js";

const countries = [
  // Norteamérica
  {
    code: "US" as CountryCode,
    name: "Estados Unidos",
    dialCode: "+1",
    flag: "🇺🇸",
  },
  { code: "CA" as CountryCode, name: "Canadá", dialCode: "+1", flag: "🇨🇦" },
  { code: "MX" as CountryCode, name: "México", dialCode: "+52", flag: "🇲🇽" },

  // Centroamérica y Caribe
  {
    code: "GT" as CountryCode,
    name: "Guatemala",
    dialCode: "+502",
    flag: "🇬🇹",
  },
  { code: "BZ" as CountryCode, name: "Belice", dialCode: "+501", flag: "🇧🇿" },
  {
    code: "SV" as CountryCode,
    name: "El Salvador",
    dialCode: "+503",
    flag: "🇸🇻",
  },
  { code: "HN" as CountryCode, name: "Honduras", dialCode: "+504", flag: "🇭🇳" },
  {
    code: "NI" as CountryCode,
    name: "Nicaragua",
    dialCode: "+505",
    flag: "🇳🇮",
  },
  {
    code: "CR" as CountryCode,
    name: "Costa Rica",
    dialCode: "+506",
    flag: "🇨🇷",
  },
  { code: "PA" as CountryCode, name: "Panamá", dialCode: "+507", flag: "🇵🇦" },
  { code: "CU" as CountryCode, name: "Cuba", dialCode: "+53", flag: "🇨🇺" },
  {
    code: "DO" as CountryCode,
    name: "República Dominicana",
    dialCode: "+1",
    flag: "🇩🇴",
  },
  {
    code: "PR" as CountryCode,
    name: "Puerto Rico",
    dialCode: "+1",
    flag: "🇵🇷",
  },
  { code: "JM" as CountryCode, name: "Jamaica", dialCode: "+1", flag: "🇯🇲" },
  { code: "HT" as CountryCode, name: "Haití", dialCode: "+509", flag: "🇭🇹" },
  {
    code: "TT" as CountryCode,
    name: "Trinidad y Tobago",
    dialCode: "+1",
    flag: "🇹🇹",
  },

  // Sudamérica
  { code: "AR" as CountryCode, name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "BO" as CountryCode, name: "Bolivia", dialCode: "+591", flag: "🇧🇴" },
  { code: "BR" as CountryCode, name: "Brasil", dialCode: "+55", flag: "🇧🇷" },
  { code: "CL" as CountryCode, name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "CO" as CountryCode, name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "EC" as CountryCode, name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
  { code: "GY" as CountryCode, name: "Guyana", dialCode: "+592", flag: "🇬🇾" },
  { code: "PY" as CountryCode, name: "Paraguay", dialCode: "+595", flag: "🇵🇾" },
  { code: "PE" as CountryCode, name: "Perú", dialCode: "+51", flag: "🇵🇪" },
  { code: "SR" as CountryCode, name: "Surinam", dialCode: "+597", flag: "🇸🇷" },
  { code: "UY" as CountryCode, name: "Uruguay", dialCode: "+598", flag: "🇺🇾" },
  { code: "VE" as CountryCode, name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },

  // Europa Occidental
  { code: "ES" as CountryCode, name: "España", dialCode: "+34", flag: "🇪🇸" },
  { code: "PT" as CountryCode, name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "FR" as CountryCode, name: "Francia", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT" as CountryCode, name: "Italia", dialCode: "+39", flag: "🇮🇹" },
  { code: "DE" as CountryCode, name: "Alemania", dialCode: "+49", flag: "🇩🇪" },
  {
    code: "GB" as CountryCode,
    name: "Reino Unido",
    dialCode: "+44",
    flag: "🇬🇧",
  },
  { code: "IE" as CountryCode, name: "Irlanda", dialCode: "+353", flag: "🇮🇪" },
  {
    code: "NL" as CountryCode,
    name: "Países Bajos",
    dialCode: "+31",
    flag: "🇳🇱",
  },
  { code: "BE" as CountryCode, name: "Bélgica", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH" as CountryCode, name: "Suiza", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT" as CountryCode, name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  {
    code: "LU" as CountryCode,
    name: "Luxemburgo",
    dialCode: "+352",
    flag: "🇱🇺",
  },

  // Europa del Norte
  { code: "SE" as CountryCode, name: "Suecia", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO" as CountryCode, name: "Noruega", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK" as CountryCode, name: "Dinamarca", dialCode: "+45", flag: "🇩🇰" },
  {
    code: "FI" as CountryCode,
    name: "Finlandia",
    dialCode: "+358",
    flag: "🇫🇮",
  },
  { code: "IS" as CountryCode, name: "Islandia", dialCode: "+354", flag: "🇮🇸" },

  // Europa del Este
  { code: "PL" as CountryCode, name: "Polonia", dialCode: "+48", flag: "🇵🇱" },
  {
    code: "CZ" as CountryCode,
    name: "República Checa",
    dialCode: "+420",
    flag: "🇨🇿",
  },
  {
    code: "SK" as CountryCode,
    name: "Eslovaquia",
    dialCode: "+421",
    flag: "🇸🇰",
  },
  { code: "HU" as CountryCode, name: "Hungría", dialCode: "+36", flag: "🇭🇺" },
  { code: "RO" as CountryCode, name: "Rumania", dialCode: "+40", flag: "🇷🇴" },
  { code: "BG" as CountryCode, name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
  { code: "UA" as CountryCode, name: "Ucrania", dialCode: "+380", flag: "🇺🇦" },
  { code: "RU" as CountryCode, name: "Rusia", dialCode: "+7", flag: "🇷🇺" },
  {
    code: "BY" as CountryCode,
    name: "Bielorrusia",
    dialCode: "+375",
    flag: "🇧🇾",
  },

  // Europa del Sur
  { code: "GR" as CountryCode, name: "Grecia", dialCode: "+30", flag: "🇬🇷" },
  { code: "HR" as CountryCode, name: "Croacia", dialCode: "+385", flag: "🇭🇷" },
  {
    code: "SI" as CountryCode,
    name: "Eslovenia",
    dialCode: "+386",
    flag: "🇸🇮",
  },
  { code: "RS" as CountryCode, name: "Serbia", dialCode: "+381", flag: "🇷🇸" },
  { code: "BA" as CountryCode, name: "Bosnia", dialCode: "+387", flag: "🇧🇦" },
  { code: "AL" as CountryCode, name: "Albania", dialCode: "+355", flag: "🇦🇱" },
  {
    code: "MK" as CountryCode,
    name: "Macedonia del Norte",
    dialCode: "+389",
    flag: "🇲🇰",
  },
  {
    code: "ME" as CountryCode,
    name: "Montenegro",
    dialCode: "+382",
    flag: "🇲🇪",
  },
  { code: "XK" as CountryCode, name: "Kosovo", dialCode: "+383", flag: "🇽🇰" },

  // Bálticos
  { code: "EE" as CountryCode, name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
  { code: "LV" as CountryCode, name: "Letonia", dialCode: "+371", flag: "🇱🇻" },
  { code: "LT" as CountryCode, name: "Lituania", dialCode: "+370", flag: "🇱🇹" },

  // Oriente Medio
  { code: "TR" as CountryCode, name: "Turquía", dialCode: "+90", flag: "🇹🇷" },
  { code: "IL" as CountryCode, name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  {
    code: "SA" as CountryCode,
    name: "Arabia Saudita",
    dialCode: "+966",
    flag: "🇸🇦",
  },
  {
    code: "AE" as CountryCode,
    name: "Emiratos Árabes",
    dialCode: "+971",
    flag: "🇦🇪",
  },
  { code: "QA" as CountryCode, name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "KW" as CountryCode, name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "BH" as CountryCode, name: "Bahréin", dialCode: "+973", flag: "🇧🇭" },
  { code: "OM" as CountryCode, name: "Omán", dialCode: "+968", flag: "🇴🇲" },
  { code: "JO" as CountryCode, name: "Jordania", dialCode: "+962", flag: "🇯🇴" },
  { code: "LB" as CountryCode, name: "Líbano", dialCode: "+961", flag: "🇱🇧" },
  { code: "IQ" as CountryCode, name: "Irak", dialCode: "+964", flag: "🇮🇶" },
  { code: "IR" as CountryCode, name: "Irán", dialCode: "+98", flag: "🇮🇷" },
  { code: "EG" as CountryCode, name: "Egipto", dialCode: "+20", flag: "🇪🇬" },

  // Asia
  { code: "CN" as CountryCode, name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "JP" as CountryCode, name: "Japón", dialCode: "+81", flag: "🇯🇵" },
  {
    code: "KR" as CountryCode,
    name: "Corea del Sur",
    dialCode: "+82",
    flag: "🇰🇷",
  },
  { code: "IN" as CountryCode, name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "PK" as CountryCode, name: "Pakistán", dialCode: "+92", flag: "🇵🇰" },
  {
    code: "BD" as CountryCode,
    name: "Bangladesh",
    dialCode: "+880",
    flag: "🇧🇩",
  },
  { code: "ID" as CountryCode, name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { code: "MY" as CountryCode, name: "Malasia", dialCode: "+60", flag: "🇲🇾" },
  { code: "SG" as CountryCode, name: "Singapur", dialCode: "+65", flag: "🇸🇬" },
  { code: "TH" as CountryCode, name: "Tailandia", dialCode: "+66", flag: "🇹🇭" },
  { code: "VN" as CountryCode, name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { code: "PH" as CountryCode, name: "Filipinas", dialCode: "+63", flag: "🇵🇭" },
  { code: "TW" as CountryCode, name: "Taiwán", dialCode: "+886", flag: "🇹🇼" },
  {
    code: "HK" as CountryCode,
    name: "Hong Kong",
    dialCode: "+852",
    flag: "🇭🇰",
  },
  { code: "KZ" as CountryCode, name: "Kazajistán", dialCode: "+7", flag: "🇰🇿" },
  {
    code: "UZ" as CountryCode,
    name: "Uzbekistán",
    dialCode: "+998",
    flag: "🇺🇿",
  },
  { code: "NP" as CountryCode, name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
  { code: "LK" as CountryCode, name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
  { code: "MM" as CountryCode, name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
  { code: "KH" as CountryCode, name: "Camboya", dialCode: "+855", flag: "🇰🇭" },
  { code: "LA" as CountryCode, name: "Laos", dialCode: "+856", flag: "🇱🇦" },

  // Oceanía
  { code: "AU" as CountryCode, name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  {
    code: "NZ" as CountryCode,
    name: "Nueva Zelanda",
    dialCode: "+64",
    flag: "🇳🇿",
  },
  { code: "FJ" as CountryCode, name: "Fiyi", dialCode: "+679", flag: "🇫🇯" },
  {
    code: "PG" as CountryCode,
    name: "Papúa Nueva Guinea",
    dialCode: "+675",
    flag: "🇵🇬",
  },

  // África
  { code: "ZA" as CountryCode, name: "Sudáfrica", dialCode: "+27", flag: "🇿🇦" },
  { code: "NG" as CountryCode, name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "KE" as CountryCode, name: "Kenia", dialCode: "+254", flag: "🇰🇪" },
  { code: "GH" as CountryCode, name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  {
    code: "MA" as CountryCode,
    name: "Marruecos",
    dialCode: "+212",
    flag: "🇲🇦",
  },
  { code: "DZ" as CountryCode, name: "Argelia", dialCode: "+213", flag: "🇩🇿" },
  { code: "TN" as CountryCode, name: "Túnez", dialCode: "+216", flag: "🇹🇳" },
  { code: "ET" as CountryCode, name: "Etiopía", dialCode: "+251", flag: "🇪🇹" },
  { code: "TZ" as CountryCode, name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
  { code: "UG" as CountryCode, name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
  { code: "RW" as CountryCode, name: "Ruanda", dialCode: "+250", flag: "🇷🇼" },
  { code: "SN" as CountryCode, name: "Senegal", dialCode: "+221", flag: "🇸🇳" },
  {
    code: "CI" as CountryCode,
    name: "Costa de Marfil",
    dialCode: "+225",
    flag: "🇨🇮",
  },
  { code: "CM" as CountryCode, name: "Camerún", dialCode: "+237", flag: "🇨🇲" },
  { code: "AO" as CountryCode, name: "Angola", dialCode: "+244", flag: "🇦🇴" },
  {
    code: "MZ" as CountryCode,
    name: "Mozambique",
    dialCode: "+258",
    flag: "🇲🇿",
  },
  { code: "ZW" as CountryCode, name: "Zimbabue", dialCode: "+263", flag: "🇿🇼" },

  // Más países de África
  {
    code: "MG" as CountryCode,
    name: "Madagascar",
    dialCode: "+261",
    flag: "🇲🇬",
  },
  { code: "MW" as CountryCode, name: "Malaui", dialCode: "+265", flag: "🇲🇼" },
  { code: "ZM" as CountryCode, name: "Zambia", dialCode: "+260", flag: "🇿🇲" },
  { code: "BW" as CountryCode, name: "Botsuana", dialCode: "+267", flag: "🇧🇼" },
  { code: "GM" as CountryCode, name: "Gambia", dialCode: "+220", flag: "🇬🇲" },
  { code: "ML" as CountryCode, name: "Malí", dialCode: "+223", flag: "🇲🇱" },
  {
    code: "BF" as CountryCode,
    name: "Burkina Faso",
    dialCode: "+226",
    flag: "🇧🇫",
  },
  { code: "NE" as CountryCode, name: "Níger", dialCode: "+227", flag: "🇳🇪" },
  { code: "TG" as CountryCode, name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { code: "BJ" as CountryCode, name: "Benín", dialCode: "+229", flag: "🇧🇯" },
  {
    code: "SL" as CountryCode,
    name: "Sierra Leona",
    dialCode: "+232",
    flag: "🇸🇱",
  },
  { code: "LR" as CountryCode, name: "Liberia", dialCode: "+231", flag: "🇱🇷" },
  { code: "GA" as CountryCode, name: "Gabón", dialCode: "+241", flag: "🇬🇦" },
  {
    code: "CF" as CountryCode,
    name: "República Centroafricana",
    dialCode: "+236",
    flag: "🇨🇫",
  },
  {
    code: "GQ" as CountryCode,
    name: "Guinea Ecuatorial",
    dialCode: "+240",
    flag: "🇬🇶",
  },
  {
    code: "ST" as CountryCode,
    name: "Santo Tomé y Príncipe",
    dialCode: "+239",
    flag: "🇸🇹",
  },
  { code: "DJ" as CountryCode, name: "Yibuti", dialCode: "+253", flag: "🇩🇯" },
  { code: "SO" as CountryCode, name: "Somalia", dialCode: "+252", flag: "🇸🇴" },
  { code: "SZ" as CountryCode, name: "Esuatini", dialCode: "+268", flag: "🇸🇿" },
  { code: "LS" as CountryCode, name: "Lesoto", dialCode: "+266", flag: "🇱🇸" },

  // Más países de Asia
  { code: "MN" as CountryCode, name: "Mongolia", dialCode: "+976", flag: "🇲🇳" },
  {
    code: "TJ" as CountryCode,
    name: "Tayikistán",
    dialCode: "+992",
    flag: "🇹🇯",
  },
  {
    code: "TM" as CountryCode,
    name: "Turkmenistán",
    dialCode: "+993",
    flag: "🇹🇲",
  },
  {
    code: "KG" as CountryCode,
    name: "Kirguistán",
    dialCode: "+996",
    flag: "🇰🇬",
  },
  { code: "GE" as CountryCode, name: "Georgia", dialCode: "+995", flag: "🇬🇪" },
  { code: "AM" as CountryCode, name: "Armenia", dialCode: "+374", flag: "🇦🇲" },
  {
    code: "AZ" as CountryCode,
    name: "Azerbaiyán",
    dialCode: "+994",
    flag: "🇦🇿",
  },
  { code: "YE" as CountryCode, name: "Yemen", dialCode: "+967", flag: "🇾🇪" },
  {
    code: "AF" as CountryCode,
    name: "Afganistán",
    dialCode: "+93",
    flag: "🇦🇫",
  },
  { code: "SY" as CountryCode, name: "Siria", dialCode: "+963", flag: "🇸🇾" },

  // Más países de Europa
  { code: "MC" as CountryCode, name: "Mónaco", dialCode: "+377", flag: "🇲🇨" },
  {
    code: "LI" as CountryCode,
    name: "Liechtenstein",
    dialCode: "+423",
    flag: "🇱🇮",
  },
  {
    code: "SM" as CountryCode,
    name: "San Marino",
    dialCode: "+378",
    flag: "🇸🇲",
  },
  {
    code: "VA" as CountryCode,
    name: "Ciudad del Vaticano",
    dialCode: "+39",
    flag: "🇻🇦",
  },
  { code: "MD" as CountryCode, name: "Moldavia", dialCode: "+373", flag: "🇲🇩" },
  { code: "MT" as CountryCode, name: "Malta", dialCode: "+356", flag: "🇲🇹" },
  { code: "CY" as CountryCode, name: "Chipre", dialCode: "+357", flag: "🇨🇾" },
  { code: "AD" as CountryCode, name: "Andorra", dialCode: "+376", flag: "🇦🇩" },

  // Más países de Oceanía
  { code: "NR" as CountryCode, name: "Nauru", dialCode: "+674", flag: "🇳🇷" },
  { code: "TV" as CountryCode, name: "Tuvalu", dialCode: "+688", flag: "🇹🇻" },
  { code: "KI" as CountryCode, name: "Kiribati", dialCode: "+686", flag: "🇰🇮" },
  {
    code: "MH" as CountryCode,
    name: "Islas Marshall",
    dialCode: "+692",
    flag: "🇲🇭",
  },

  // Más países de América
  {
    code: "GF" as CountryCode,
    name: "Guayana Francesa",
    dialCode: "+594",
    flag: "🇬🇫",
  },

  {
    code: "PM" as CountryCode,
    name: "San Pedro y Miquelón",
    dialCode: "+508",
    flag: "🇵🇲",
  },
  {
    code: "GL" as CountryCode,
    name: "Groenlandia",
    dialCode: "+299",
    flag: "🇬🇱",
  },

  // Europa adicionales

  // Asia adicionales

  // África adicionales
  { code: "SD" as CountryCode, name: "Sudán", dialCode: "+249", flag: "🇸🇩" },
  { code: "LY" as CountryCode, name: "Libia", dialCode: "+218", flag: "🇱🇾" },

  // Oceanía adicionales
  { code: "WS" as CountryCode, name: "Samoa", dialCode: "+685", flag: "🇼🇸" },
  { code: "TO" as CountryCode, name: "Tonga", dialCode: "+676", flag: "🇹🇴" },
  {
    code: "SB" as CountryCode,
    name: "Islas Salomón",
    dialCode: "+677",
    flag: "🇸🇧",
  },
  { code: "VU" as CountryCode, name: "Vanuatu", dialCode: "+678", flag: "🇻🇺" },
  {
    code: "FM" as CountryCode,
    name: "Micronesia",
    dialCode: "+691",
    flag: "🇫🇲",
  },

  // Caribe y Centroamérica adicionales
  { code: "BS" as CountryCode, name: "Bahamas", dialCode: "+1", flag: "🇧🇸" },
  { code: "BB" as CountryCode, name: "Barbados", dialCode: "+1", flag: "🇧🇧" },
  {
    code: "AG" as CountryCode,
    name: "Antigua y Barbuda",
    dialCode: "+1",
    flag: "🇦🇬",
  },
  {
    code: "KN" as CountryCode,
    name: "San Cristóbal y Nieves",
    dialCode: "+1",
    flag: "🇰🇳",
  },
  {
    code: "LC" as CountryCode,
    name: "Santa Lucía",
    dialCode: "+1",
    flag: "🇱🇨",
  },
];

export type Country = (typeof countries)[number];

export default countries;
