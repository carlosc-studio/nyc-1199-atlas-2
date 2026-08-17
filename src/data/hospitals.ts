// Curated list of major 1199SEIU-affiliated NYC hospitals that staff pharmacy
// technicians. Coordinates and nearest-subway data are approximate and
// hand-compiled — verify before any commute-critical decision. Add/edit
// entries freely; the UI is fully data-driven.

export type Borough = "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";

export type Network =
  | "Mount Sinai"
  | "NewYork-Presbyterian"
  | "NYC Health + Hospitals"
  | "Northwell"
  | "Montefiore"
  | "Maimonides"
  | "MediSys"
  | "One Brooklyn Health"
  | "BronxCare"
  | "SUNY Downstate"
  | "Wyckoff Heights"
  | "NYU Langone"
  | "Richmond University"
  | "Calvary"
  | "Interfaith";

export type HospitalType =
  | "Academic Medical Center"
  | "Community Hospital"
  | "Public Hospital"
  | "Specialty Hospital"
  | "Children's Hospital";

export interface SubwayAccess {
  station: string;
  lines: string[]; // e.g. ["4", "5", "6"] or ["N", "Q", "R", "W"]
  walkMinutes: number;
}

export interface Hospital {
  id: string;
  name: string;
  network: Network;
  type: HospitalType;
  borough: Borough;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  subway: SubwayAccess[];
  blurb: string;
}

export const NETWORK_COLORS: Record<Network, string> = {
  "Mount Sinai": "#00a3e0",
  "NewYork-Presbyterian": "#003da5",
  "NYC Health + Hospitals": "#e4002b",
  Northwell: "#5e2d91",
  Montefiore: "#0b8457",
  Maimonides: "#c8102e",
  MediSys: "#f5a623",
  "One Brooklyn Health": "#ff6b35",
  BronxCare: "#8e44ad",
  "SUNY Downstate": "#1d4e89",
  "Wyckoff Heights": "#d35400",
  "NYU Langone": "#57068c",
  "Richmond University": "#2c7a7b",
  Calvary: "#7f8c8d",
  Interfaith: "#16a085",
};

// MTA subway line colors (official)
export const LINE_COLORS: Record<string, { bg: string; fg: string }> = {
  "1": { bg: "#EE352E", fg: "#fff" },
  "2": { bg: "#EE352E", fg: "#fff" },
  "3": { bg: "#EE352E", fg: "#fff" },
  "4": { bg: "#00933C", fg: "#fff" },
  "5": { bg: "#00933C", fg: "#fff" },
  "6": { bg: "#00933C", fg: "#fff" },
  "7": { bg: "#B933AD", fg: "#fff" },
  A: { bg: "#0039A6", fg: "#fff" },
  C: { bg: "#0039A6", fg: "#fff" },
  E: { bg: "#0039A6", fg: "#fff" },
  B: { bg: "#FF6319", fg: "#fff" },
  D: { bg: "#FF6319", fg: "#fff" },
  F: { bg: "#FF6319", fg: "#fff" },
  M: { bg: "#FF6319", fg: "#fff" },
  G: { bg: "#6CBE45", fg: "#fff" },
  J: { bg: "#996633", fg: "#fff" },
  Z: { bg: "#996633", fg: "#fff" },
  L: { bg: "#A7A9AC", fg: "#fff" },
  N: { bg: "#FCCC0A", fg: "#000" },
  Q: { bg: "#FCCC0A", fg: "#000" },
  R: { bg: "#FCCC0A", fg: "#000" },
  W: { bg: "#FCCC0A", fg: "#000" },
  S: { bg: "#808183", fg: "#fff" },
  SIR: { bg: "#0078C6", fg: "#fff" },
};

export const HOSPITALS: Hospital[] = [
  // ===== MANHATTAN =====
  {
    id: "msh-main",
    name: "The Mount Sinai Hospital",
    network: "Mount Sinai",
    type: "Academic Medical Center",
    borough: "Manhattan",
    neighborhood: "Upper East Side / East Harlem",
    address: "1468 Madison Ave, New York, NY 10029",
    lat: 40.7903,
    lng: -73.9527,
    subway: [
      { station: "103 St", lines: ["6"], walkMinutes: 6 },
      { station: "96 St", lines: ["6"], walkMinutes: 9 },
      { station: "Lexington Av/110 St (uptown)", lines: ["6"], walkMinutes: 7 },
    ],
    blurb: "Flagship academic medical center. One of NYC's largest pharmacy operations.",
  },
  {
    id: "msh-morningside",
    name: "Mount Sinai Morningside",
    network: "Mount Sinai",
    type: "Academic Medical Center",
    borough: "Manhattan",
    neighborhood: "Morningside Heights",
    address: "1111 Amsterdam Ave, New York, NY 10025",
    lat: 40.8043,
    lng: -73.9636,
    subway: [
      { station: "Cathedral Pkwy (110 St)", lines: ["1"], walkMinutes: 4 },
      { station: "Cathedral Pkwy (110 St)", lines: ["B", "C"], walkMinutes: 7 },
    ],
    blurb: "Formerly St. Luke's. Teaching hospital on the Columbia border.",
  },
  {
    id: "msh-west",
    name: "Mount Sinai West",
    network: "Mount Sinai",
    type: "Academic Medical Center",
    borough: "Manhattan",
    neighborhood: "Hell's Kitchen",
    address: "1000 10th Ave, New York, NY 10019",
    lat: 40.7705,
    lng: -73.9883,
    subway: [
      { station: "59 St – Columbus Circle", lines: ["1", "A", "B", "C", "D"], walkMinutes: 8 },
      { station: "50 St", lines: ["C", "E"], walkMinutes: 9 },
    ],
    blurb: "Formerly Roosevelt. Midtown West teaching hospital.",
  },
  {
    id: "msh-bi",
    name: "Mount Sinai Beth Israel",
    network: "Mount Sinai",
    type: "Community Hospital",
    borough: "Manhattan",
    neighborhood: "Gramercy / Stuy Town",
    address: "281 1st Ave, New York, NY 10003",
    lat: 40.7322,
    lng: -73.9805,
    subway: [
      { station: "1 Av", lines: ["L"], walkMinutes: 8 },
      { station: "3 Av", lines: ["L"], walkMinutes: 10 },
    ],
    blurb: "Downsizing campus but still operating with active pharmacy services.",
  },
  {
    id: "nyp-cornell",
    name: "NewYork-Presbyterian / Weill Cornell",
    network: "NewYork-Presbyterian",
    type: "Academic Medical Center",
    borough: "Manhattan",
    neighborhood: "Upper East Side",
    address: "525 E 68th St, New York, NY 10065",
    lat: 40.7649,
    lng: -73.9542,
    subway: [
      { station: "68 St – Hunter College", lines: ["6"], walkMinutes: 12 },
      { station: "Roosevelt Island", lines: ["F"], walkMinutes: 15 },
    ],
    blurb: "Top-tier teaching hospital. Large inpatient pharmacy & oncology.",
  },
  {
    id: "nyp-columbia",
    name: "NewYork-Presbyterian / Columbia (Milstein)",
    network: "NewYork-Presbyterian",
    type: "Academic Medical Center",
    borough: "Manhattan",
    neighborhood: "Washington Heights",
    address: "177 Fort Washington Ave, New York, NY 10032",
    lat: 40.8407,
    lng: -73.9425,
    subway: [
      { station: "168 St", lines: ["1", "A", "C"], walkMinutes: 5 },
    ],
    blurb: "Major academic medical center anchoring upper Manhattan.",
  },
  {
    id: "nyp-allen",
    name: "NewYork-Presbyterian Allen Hospital",
    network: "NewYork-Presbyterian",
    type: "Community Hospital",
    borough: "Manhattan",
    neighborhood: "Inwood",
    address: "5141 Broadway, New York, NY 10034",
    lat: 40.8714,
    lng: -73.9192,
    subway: [
      { station: "Dyckman St", lines: ["1"], walkMinutes: 6 },
      { station: "207 St", lines: ["1"], walkMinutes: 10 },
    ],
    blurb: "Quiet community satellite of NYP at the very top of Manhattan.",
  },
  {
    id: "nyp-lm",
    name: "NewYork-Presbyterian Lower Manhattan",
    network: "NewYork-Presbyterian",
    type: "Community Hospital",
    borough: "Manhattan",
    neighborhood: "Financial District",
    address: "170 William St, New York, NY 10038",
    lat: 40.7106,
    lng: -74.0058,
    subway: [
      { station: "Fulton St", lines: ["2", "3", "4", "5", "A", "C", "J", "Z"], walkMinutes: 5 },
      { station: "Brooklyn Bridge – City Hall", lines: ["4", "5", "6"], walkMinutes: 7 },
    ],
    blurb: "Downtown hospital with strong transit access across nearly every line.",
  },
  {
    id: "hh-bellevue",
    name: "NYC H+H / Bellevue",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Manhattan",
    neighborhood: "Kips Bay",
    address: "462 1st Ave, New York, NY 10016",
    lat: 40.7396,
    lng: -73.9756,
    subway: [
      { station: "33 St", lines: ["6"], walkMinutes: 12 },
      { station: "1 Av", lines: ["L"], walkMinutes: 14 },
    ],
    blurb: "America's oldest public hospital. Massive 24/7 pharmacy operation.",
  },
  {
    id: "hh-harlem",
    name: "NYC H+H / Harlem",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Manhattan",
    neighborhood: "Harlem",
    address: "506 Lenox Ave, New York, NY 10037",
    lat: 40.8141,
    lng: -73.9402,
    subway: [
      { station: "135 St", lines: ["2", "3"], walkMinutes: 3 },
    ],
    blurb: "Major safety-net hospital serving central Harlem.",
  },
  {
    id: "hh-metropolitan",
    name: "NYC H+H / Metropolitan",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Manhattan",
    neighborhood: "East Harlem",
    address: "1901 1st Ave, New York, NY 10029",
    lat: 40.7836,
    lng: -73.9445,
    subway: [
      { station: "96 St", lines: ["6"], walkMinutes: 13 },
      { station: "103 St", lines: ["6"], walkMinutes: 14 },
    ],
    blurb: "Public hospital affiliated with NY Medical College.",
  },
  {
    id: "nl-lenox",
    name: "Lenox Hill Hospital",
    network: "Northwell",
    type: "Community Hospital",
    borough: "Manhattan",
    neighborhood: "Upper East Side",
    address: "100 E 77th St, New York, NY 10075",
    lat: 40.7745,
    lng: -73.9605,
    subway: [
      { station: "77 St", lines: ["6"], walkMinutes: 3 },
      { station: "68 St – Hunter College", lines: ["6"], walkMinutes: 9 },
    ],
    blurb: "Northwell's Manhattan flagship.",
  },

  // ===== BROOKLYN =====
  {
    id: "msh-brooklyn",
    name: "Mount Sinai Brooklyn",
    network: "Mount Sinai",
    type: "Community Hospital",
    borough: "Brooklyn",
    neighborhood: "Midwood",
    address: "3201 Kings Hwy, Brooklyn, NY 11234",
    lat: 40.6235,
    lng: -73.9442,
    subway: [
      { station: "Kings Hwy", lines: ["B", "Q"], walkMinutes: 12 },
    ],
    blurb: "Small community campus in deep Brooklyn.",
  },
  {
    id: "nyp-methodist",
    name: "NYP Brooklyn Methodist",
    network: "NewYork-Presbyterian",
    type: "Community Hospital",
    borough: "Brooklyn",
    neighborhood: "Park Slope",
    address: "506 6th St, Brooklyn, NY 11215",
    lat: 40.6679,
    lng: -73.9817,
    subway: [
      { station: "7 Av", lines: ["F", "G"], walkMinutes: 4 },
      { station: "4 Av – 9 St", lines: ["F", "G", "R"], walkMinutes: 10 },
    ],
    blurb: "Park Slope teaching hospital with strong residency programs.",
  },
  {
    id: "maimonides",
    name: "Maimonides Medical Center",
    network: "Maimonides",
    type: "Academic Medical Center",
    borough: "Brooklyn",
    neighborhood: "Borough Park",
    address: "4802 10th Ave, Brooklyn, NY 11219",
    lat: 40.6398,
    lng: -73.9942,
    subway: [
      { station: "Fort Hamilton Pkwy", lines: ["F", "G"], walkMinutes: 7 },
      { station: "55 St", lines: ["D"], walkMinutes: 9 },
    ],
    blurb: "Largest single hospital pharmacy in Brooklyn. Heavy oncology workload.",
  },
  {
    id: "hh-kings",
    name: "NYC H+H / Kings County",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Brooklyn",
    neighborhood: "East Flatbush",
    address: "451 Clarkson Ave, Brooklyn, NY 11203",
    lat: 40.6566,
    lng: -73.9442,
    subway: [
      { station: "Winthrop St", lines: ["2", "5"], walkMinutes: 8 },
      { station: "Sterling St", lines: ["2", "5"], walkMinutes: 10 },
    ],
    blurb: "Major Level 1 trauma center, co-located with SUNY Downstate.",
  },
  {
    id: "hh-woodhull",
    name: "NYC H+H / Woodhull",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Brooklyn",
    neighborhood: "Bedford-Stuyvesant",
    address: "760 Broadway, Brooklyn, NY 11206",
    lat: 40.7000,
    lng: -73.9425,
    subway: [
      { station: "Flushing Av", lines: ["J", "M"], walkMinutes: 2 },
      { station: "Myrtle Av", lines: ["J", "M", "Z"], walkMinutes: 6 },
    ],
    blurb: "Brutalist landmark public hospital. Right on the J/M line.",
  },
  {
    id: "hh-coney",
    name: "NYC H+H / Coney Island",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Brooklyn",
    neighborhood: "Coney Island",
    address: "2601 Ocean Pkwy, Brooklyn, NY 11235",
    lat: 40.5867,
    lng: -73.9622,
    subway: [
      { station: "Ocean Pkwy", lines: ["Q"], walkMinutes: 10 },
      { station: "Brighton Beach", lines: ["B", "Q"], walkMinutes: 14 },
    ],
    blurb: "Public hospital serving south Brooklyn beach communities.",
  },
  {
    id: "suny-downstate",
    name: "SUNY Downstate Health Sciences University",
    network: "SUNY Downstate",
    type: "Academic Medical Center",
    borough: "Brooklyn",
    neighborhood: "East Flatbush",
    address: "450 Clarkson Ave, Brooklyn, NY 11203",
    lat: 40.6555,
    lng: -73.9450,
    subway: [
      { station: "Winthrop St", lines: ["2", "5"], walkMinutes: 7 },
    ],
    blurb: "SUNY teaching hospital, co-located with Kings County.",
  },
  {
    id: "brookdale",
    name: "Brookdale University Hospital Medical Center",
    network: "One Brooklyn Health",
    type: "Community Hospital",
    borough: "Brooklyn",
    neighborhood: "Brownsville",
    address: "1 Brookdale Plaza, Brooklyn, NY 11212",
    lat: 40.6580,
    lng: -73.9094,
    subway: [
      { station: "Rockaway Av", lines: ["3"], walkMinutes: 14 },
      { station: "Junius St", lines: ["3"], walkMinutes: 15 },
    ],
    blurb: "Safety-net hospital in Brownsville. Bus-heavy commute.",
  },
  {
    id: "interfaith",
    name: "Interfaith Medical Center",
    network: "One Brooklyn Health",
    type: "Community Hospital",
    borough: "Brooklyn",
    neighborhood: "Bedford-Stuyvesant",
    address: "1545 Atlantic Ave, Brooklyn, NY 11213",
    lat: 40.6781,
    lng: -73.9398,
    subway: [
      { station: "Nostrand Av", lines: ["A", "C"], walkMinutes: 7 },
      { station: "Kingston-Throop", lines: ["C"], walkMinutes: 7 },
    ],
    blurb: "Behavioral-health-heavy community hospital in Bed-Stuy.",
  },
  {
    id: "nyu-brooklyn",
    name: "NYU Langone Hospital — Brooklyn",
    network: "NYU Langone",
    type: "Community Hospital",
    borough: "Brooklyn",
    neighborhood: "Sunset Park",
    address: "150 55th St, Brooklyn, NY 11220",
    lat: 40.6450,
    lng: -74.0142,
    subway: [
      { station: "53 St", lines: ["R"], walkMinutes: 9 },
      { station: "59 St", lines: ["N", "R"], walkMinutes: 11 },
    ],
    blurb: "Formerly Lutheran Medical Center. Major Sunset Park employer.",
  },

  // ===== QUEENS =====
  {
    id: "msh-queens",
    name: "Mount Sinai Queens",
    network: "Mount Sinai",
    type: "Community Hospital",
    borough: "Queens",
    neighborhood: "Astoria",
    address: "25-10 30th Ave, Astoria, NY 11102",
    lat: 40.7700,
    lng: -73.9233,
    subway: [
      { station: "30 Av", lines: ["N", "W"], walkMinutes: 5 },
      { station: "Broadway", lines: ["N", "W"], walkMinutes: 9 },
    ],
    blurb: "Astoria community hospital, easy N/W access.",
  },
  {
    id: "nyp-queens",
    name: "NewYork-Presbyterian Queens",
    network: "NewYork-Presbyterian",
    type: "Community Hospital",
    borough: "Queens",
    neighborhood: "Flushing",
    address: "56-45 Main St, Flushing, NY 11355",
    lat: 40.7430,
    lng: -73.8245,
    subway: [
      { station: "Flushing – Main St", lines: ["7"], walkMinutes: 18 },
    ],
    blurb: "Large Queens community hospital. Bus from 7 train.",
  },
  {
    id: "hh-elmhurst",
    name: "NYC H+H / Elmhurst",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Queens",
    neighborhood: "Elmhurst",
    address: "79-01 Broadway, Elmhurst, NY 11373",
    lat: 40.7445,
    lng: -73.8866,
    subway: [
      { station: "Elmhurst Av", lines: ["M", "R"], walkMinutes: 6 },
      { station: "Grand Av – Newtown", lines: ["M", "R"], walkMinutes: 11 },
    ],
    blurb: "Major public hospital, one of the busiest pharmacies in Queens.",
  },
  {
    id: "hh-queens",
    name: "NYC H+H / Queens",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Queens",
    neighborhood: "Jamaica",
    address: "82-68 164th St, Jamaica, NY 11432",
    lat: 40.7117,
    lng: -73.7977,
    subway: [
      { station: "Jamaica – 179 St", lines: ["F"], walkMinutes: 16 },
      { station: "Parsons Blvd", lines: ["F"], walkMinutes: 18 },
    ],
    blurb: "Jamaica public hospital. F train + bus typical commute.",
  },
  {
    id: "lij-fh",
    name: "Long Island Jewish Forest Hills",
    network: "Northwell",
    type: "Community Hospital",
    borough: "Queens",
    neighborhood: "Forest Hills",
    address: "102-01 66th Rd, Forest Hills, NY 11375",
    lat: 40.7253,
    lng: -73.8516,
    subway: [
      { station: "67 Av", lines: ["M", "R"], walkMinutes: 6 },
      { station: "Forest Hills – 71 Av", lines: ["E", "F", "M", "R"], walkMinutes: 11 },
    ],
    blurb: "Northwell community hospital. Forest Hills neighborhood.",
  },
  {
    id: "flushing",
    name: "Flushing Hospital Medical Center",
    network: "MediSys",
    type: "Community Hospital",
    borough: "Queens",
    neighborhood: "Flushing",
    address: "4500 Parsons Blvd, Flushing, NY 11355",
    lat: 40.7546,
    lng: -73.8237,
    subway: [
      { station: "Flushing – Main St", lines: ["7"], walkMinutes: 16 },
    ],
    blurb: "MediSys community hospital, near downtown Flushing.",
  },
  {
    id: "jamaica",
    name: "Jamaica Hospital Medical Center",
    network: "MediSys",
    type: "Community Hospital",
    borough: "Queens",
    neighborhood: "Richmond Hill / Jamaica",
    address: "8900 Van Wyck Expy, Jamaica, NY 11418",
    lat: 40.7011,
    lng: -73.8290,
    subway: [
      { station: "Sutphin Blvd", lines: ["E", "J", "Z"], walkMinutes: 15 },
      { station: "121 St", lines: ["J", "Z"], walkMinutes: 14 },
    ],
    blurb: "MediSys Level 1 trauma center. Bus-heavy access.",
  },

  // ===== BRONX =====
  {
    id: "monte-moses",
    name: "Montefiore Medical Center — Moses Campus",
    network: "Montefiore",
    type: "Academic Medical Center",
    borough: "Bronx",
    neighborhood: "Norwood",
    address: "111 E 210th St, Bronx, NY 10467",
    lat: 40.8810,
    lng: -73.8788,
    subway: [
      { station: "Mosholu Pkwy", lines: ["4"], walkMinutes: 6 },
      { station: "Norwood – 205 St", lines: ["D"], walkMinutes: 10 },
    ],
    blurb: "Montefiore flagship. Massive pharmacy footprint.",
  },
  {
    id: "monte-einstein",
    name: "Montefiore Einstein (Weiler Hospital)",
    network: "Montefiore",
    type: "Academic Medical Center",
    borough: "Bronx",
    neighborhood: "Morris Park",
    address: "1825 Eastchester Rd, Bronx, NY 10461",
    lat: 40.8528,
    lng: -73.8458,
    subway: [
      { station: "Morris Park", lines: ["5"], walkMinutes: 12 },
      { station: "Pelham Pkwy", lines: ["2", "5"], walkMinutes: 14 },
    ],
    blurb: "Einstein-affiliated campus with strong research pharmacy.",
  },
  {
    id: "monte-wakefield",
    name: "Montefiore Wakefield Campus",
    network: "Montefiore",
    type: "Community Hospital",
    borough: "Bronx",
    neighborhood: "Wakefield",
    address: "600 E 233rd St, Bronx, NY 10466",
    lat: 40.8916,
    lng: -73.8553,
    subway: [
      { station: "233 St", lines: ["2", "5"], walkMinutes: 9 },
    ],
    blurb: "Community campus serving the north Bronx.",
  },
  {
    id: "hh-jacobi",
    name: "NYC H+H / Jacobi",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Bronx",
    neighborhood: "Morris Park",
    address: "1400 Pelham Pkwy S, Bronx, NY 10461",
    lat: 40.8568,
    lng: -73.8470,
    subway: [
      { station: "Pelham Pkwy", lines: ["5"], walkMinutes: 11 },
      { station: "Morris Park", lines: ["5"], walkMinutes: 10 },
    ],
    blurb: "Major Bronx public hospital, Level 1 trauma.",
  },
  {
    id: "hh-lincoln",
    name: "NYC H+H / Lincoln",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Bronx",
    neighborhood: "Mott Haven",
    address: "234 E 149th St, Bronx, NY 10451",
    lat: 40.8166,
    lng: -73.9259,
    subway: [
      { station: "3 Av – 149 St", lines: ["2", "5"], walkMinutes: 4 },
      { station: "149 St – Grand Concourse", lines: ["2", "4", "5"], walkMinutes: 6 },
    ],
    blurb: "South Bronx safety-net hospital. Strong subway access.",
  },
  {
    id: "hh-ncb",
    name: "NYC H+H / North Central Bronx",
    network: "NYC Health + Hospitals",
    type: "Public Hospital",
    borough: "Bronx",
    neighborhood: "Norwood",
    address: "3424 Kossuth Ave, Bronx, NY 10467",
    lat: 40.8806,
    lng: -73.8801,
    subway: [
      { station: "Mosholu Pkwy", lines: ["4"], walkMinutes: 5 },
      { station: "Norwood – 205 St", lines: ["D"], walkMinutes: 10 },
    ],
    blurb: "Co-located with Montefiore Moses.",
  },
  {
    id: "bronxcare",
    name: "BronxCare Health System",
    network: "BronxCare",
    type: "Community Hospital",
    borough: "Bronx",
    neighborhood: "Morrisania",
    address: "1650 Grand Concourse, Bronx, NY 10457",
    lat: 40.8418,
    lng: -73.9116,
    subway: [
      { station: "170 St", lines: ["4"], walkMinutes: 3 },
      { station: "170 St", lines: ["B", "D"], walkMinutes: 6 },
    ],
    blurb: "Formerly Bronx-Lebanon. On the Grand Concourse, great transit.",
  },
  {
    id: "calvary",
    name: "Calvary Hospital",
    network: "Calvary",
    type: "Specialty Hospital",
    borough: "Bronx",
    neighborhood: "Eastchester",
    address: "1740 Eastchester Rd, Bronx, NY 10461",
    lat: 40.8636,
    lng: -73.8439,
    subway: [
      { station: "Pelham Pkwy", lines: ["5"], walkMinutes: 18 },
    ],
    blurb: "Palliative care specialty hospital. Bus from the 5 train.",
  },

  // ===== STATEN ISLAND =====
  {
    id: "siuh-north",
    name: "Staten Island University Hospital — North",
    network: "Northwell",
    type: "Community Hospital",
    borough: "Staten Island",
    neighborhood: "Ocean Breeze",
    address: "475 Seaview Ave, Staten Island, NY 10305",
    lat: 40.5832,
    lng: -74.0846,
    subway: [
      { station: "Old Town (SIR)", lines: ["SIR"], walkMinutes: 14 },
    ],
    blurb: "Northwell's main SI campus. SIR + bus.",
  },
  {
    id: "rumc",
    name: "Richmond University Medical Center",
    network: "Richmond University",
    type: "Community Hospital",
    borough: "Staten Island",
    neighborhood: "West Brighton",
    address: "355 Bard Ave, Staten Island, NY 10310",
    lat: 40.6363,
    lng: -74.1063,
    subway: [
      { station: "St George Terminal (SIR/Ferry)", lines: ["SIR"], walkMinutes: 25 },
    ],
    blurb: "North Shore SI community hospital. Ferry + bus commute.",
  },
];

export const BOROUGHS: Borough[] = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
];

export const NETWORKS = Array.from(
  new Set(HOSPITALS.map((h) => h.network)),
).sort() as Network[];

export const HOSPITAL_TYPES: HospitalType[] = [
  "Academic Medical Center",
  "Community Hospital",
  "Public Hospital",
  "Specialty Hospital",
  "Children's Hospital",
];
