import React, { useState, useMemo, useRef, useEffect } from "react";

/* ---- 39 hospital records, extracted verbatim from src/data/hospitals.ts ---- */
const DATA = {"hospitals":[{"id":"msh-main","name":"The Mount Sinai Hospital","network":"Mount Sinai","type":"Academic Medical Center","borough":"Manhattan","neighborhood":"Upper East Side / East Harlem","address":"1468 Madison Ave, New York, NY 10029","lat":40.7903,"lng":-73.9527,"subway":[{"station":"103 St","lines":["6"],"walkMinutes":6},{"station":"96 St","lines":["6"],"walkMinutes":9},{"station":"Lexington Av/110 St (uptown)","lines":["6"],"walkMinutes":7}],"blurb":"Flagship academic medical center. One of NYC's largest pharmacy operations."},{"id":"msh-morningside","name":"Mount Sinai Morningside","network":"Mount Sinai","type":"Academic Medical Center","borough":"Manhattan","neighborhood":"Morningside Heights","address":"1111 Amsterdam Ave, New York, NY 10025","lat":40.8043,"lng":-73.9636,"subway":[{"station":"Cathedral Pkwy (110 St)","lines":["1"],"walkMinutes":4},{"station":"Cathedral Pkwy (110 St)","lines":["B","C"],"walkMinutes":7}],"blurb":"Formerly St. Luke's. Teaching hospital on the Columbia border."},{"id":"msh-west","name":"Mount Sinai West","network":"Mount Sinai","type":"Academic Medical Center","borough":"Manhattan","neighborhood":"Hell's Kitchen","address":"1000 10th Ave, New York, NY 10019","lat":40.7705,"lng":-73.9883,"subway":[{"station":"59 St \u2013 Columbus Circle","lines":["1","A","B","C","D"],"walkMinutes":8},{"station":"50 St","lines":["C","E"],"walkMinutes":9}],"blurb":"Formerly Roosevelt. Midtown West teaching hospital."},{"id":"msh-bi","name":"Mount Sinai Beth Israel","network":"Mount Sinai","type":"Community Hospital","borough":"Manhattan","neighborhood":"Gramercy / Stuy Town","address":"281 1st Ave, New York, NY 10003","lat":40.7322,"lng":-73.9805,"subway":[{"station":"1 Av","lines":["L"],"walkMinutes":8},{"station":"3 Av","lines":["L"],"walkMinutes":10}],"blurb":"Downsizing campus but still operating with active pharmacy services."},{"id":"nyp-cornell","name":"NewYork-Presbyterian / Weill Cornell","network":"NewYork-Presbyterian","type":"Academic Medical Center","borough":"Manhattan","neighborhood":"Upper East Side","address":"525 E 68th St, New York, NY 10065","lat":40.7649,"lng":-73.9542,"subway":[{"station":"68 St \u2013 Hunter College","lines":["6"],"walkMinutes":12},{"station":"Roosevelt Island","lines":["F"],"walkMinutes":15}],"blurb":"Top-tier teaching hospital. Large inpatient pharmacy & oncology."},{"id":"nyp-columbia","name":"NewYork-Presbyterian / Columbia (Milstein)","network":"NewYork-Presbyterian","type":"Academic Medical Center","borough":"Manhattan","neighborhood":"Washington Heights","address":"177 Fort Washington Ave, New York, NY 10032","lat":40.8407,"lng":-73.9425,"subway":[{"station":"168 St","lines":["1","A","C"],"walkMinutes":5}],"blurb":"Major academic medical center anchoring upper Manhattan."},{"id":"nyp-allen","name":"NewYork-Presbyterian Allen Hospital","network":"NewYork-Presbyterian","type":"Community Hospital","borough":"Manhattan","neighborhood":"Inwood","address":"5141 Broadway, New York, NY 10034","lat":40.8714,"lng":-73.9192,"subway":[{"station":"Dyckman St","lines":["1"],"walkMinutes":6},{"station":"207 St","lines":["1"],"walkMinutes":10}],"blurb":"Quiet community satellite of NYP at the very top of Manhattan."},{"id":"nyp-lm","name":"NewYork-Presbyterian Lower Manhattan","network":"NewYork-Presbyterian","type":"Community Hospital","borough":"Manhattan","neighborhood":"Financial District","address":"170 William St, New York, NY 10038","lat":40.7106,"lng":-74.0058,"subway":[{"station":"Fulton St","lines":["2","3","4","5","A","C","J","Z"],"walkMinutes":5},{"station":"Brooklyn Bridge \u2013 City Hall","lines":["4","5","6"],"walkMinutes":7}],"blurb":"Downtown hospital with strong transit access across nearly every line."},{"id":"hh-bellevue","name":"NYC H+H / Bellevue","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Manhattan","neighborhood":"Kips Bay","address":"462 1st Ave, New York, NY 10016","lat":40.7396,"lng":-73.9756,"subway":[{"station":"33 St","lines":["6"],"walkMinutes":12},{"station":"1 Av","lines":["L"],"walkMinutes":14}],"blurb":"America's oldest public hospital. Massive 24/7 pharmacy operation."},{"id":"hh-harlem","name":"NYC H+H / Harlem","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Manhattan","neighborhood":"Harlem","address":"506 Lenox Ave, New York, NY 10037","lat":40.8141,"lng":-73.9402,"subway":[{"station":"135 St","lines":["2","3"],"walkMinutes":3}],"blurb":"Major safety-net hospital serving central Harlem."},{"id":"hh-metropolitan","name":"NYC H+H / Metropolitan","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Manhattan","neighborhood":"East Harlem","address":"1901 1st Ave, New York, NY 10029","lat":40.7836,"lng":-73.9445,"subway":[{"station":"96 St","lines":["6"],"walkMinutes":13},{"station":"103 St","lines":["6"],"walkMinutes":14}],"blurb":"Public hospital affiliated with NY Medical College."},{"id":"nl-lenox","name":"Lenox Hill Hospital","network":"Northwell","type":"Community Hospital","borough":"Manhattan","neighborhood":"Upper East Side","address":"100 E 77th St, New York, NY 10075","lat":40.7745,"lng":-73.9605,"subway":[{"station":"77 St","lines":["6"],"walkMinutes":3},{"station":"68 St \u2013 Hunter College","lines":["6"],"walkMinutes":9}],"blurb":"Northwell's Manhattan flagship."},{"id":"msh-brooklyn","name":"Mount Sinai Brooklyn","network":"Mount Sinai","type":"Community Hospital","borough":"Brooklyn","neighborhood":"Midwood","address":"3201 Kings Hwy, Brooklyn, NY 11234","lat":40.6235,"lng":-73.9442,"subway":[{"station":"Kings Hwy","lines":["B","Q"],"walkMinutes":12}],"blurb":"Small community campus in deep Brooklyn."},{"id":"nyp-methodist","name":"NYP Brooklyn Methodist","network":"NewYork-Presbyterian","type":"Community Hospital","borough":"Brooklyn","neighborhood":"Park Slope","address":"506 6th St, Brooklyn, NY 11215","lat":40.6679,"lng":-73.9817,"subway":[{"station":"7 Av","lines":["F","G"],"walkMinutes":4},{"station":"4 Av \u2013 9 St","lines":["F","G","R"],"walkMinutes":10}],"blurb":"Park Slope teaching hospital with strong residency programs."},{"id":"maimonides","name":"Maimonides Medical Center","network":"Maimonides","type":"Academic Medical Center","borough":"Brooklyn","neighborhood":"Borough Park","address":"4802 10th Ave, Brooklyn, NY 11219","lat":40.6398,"lng":-73.9942,"subway":[{"station":"Fort Hamilton Pkwy","lines":["F","G"],"walkMinutes":7},{"station":"55 St","lines":["D"],"walkMinutes":9}],"blurb":"Largest single hospital pharmacy in Brooklyn. Heavy oncology workload."},{"id":"hh-kings","name":"NYC H+H / Kings County","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Brooklyn","neighborhood":"East Flatbush","address":"451 Clarkson Ave, Brooklyn, NY 11203","lat":40.6566,"lng":-73.9442,"subway":[{"station":"Winthrop St","lines":["2","5"],"walkMinutes":8},{"station":"Sterling St","lines":["2","5"],"walkMinutes":10}],"blurb":"Major Level 1 trauma center, co-located with SUNY Downstate."},{"id":"hh-woodhull","name":"NYC H+H / Woodhull","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Brooklyn","neighborhood":"Bedford-Stuyvesant","address":"760 Broadway, Brooklyn, NY 11206","lat":40.7,"lng":-73.9425,"subway":[{"station":"Flushing Av","lines":["J","M"],"walkMinutes":2},{"station":"Myrtle Av","lines":["J","M","Z"],"walkMinutes":6}],"blurb":"Brutalist landmark public hospital. Right on the J/M line."},{"id":"hh-coney","name":"NYC H+H / Coney Island","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Brooklyn","neighborhood":"Coney Island","address":"2601 Ocean Pkwy, Brooklyn, NY 11235","lat":40.5867,"lng":-73.9622,"subway":[{"station":"Ocean Pkwy","lines":["Q"],"walkMinutes":10},{"station":"Brighton Beach","lines":["B","Q"],"walkMinutes":14}],"blurb":"Public hospital serving south Brooklyn beach communities."},{"id":"suny-downstate","name":"SUNY Downstate Health Sciences University","network":"SUNY Downstate","type":"Academic Medical Center","borough":"Brooklyn","neighborhood":"East Flatbush","address":"450 Clarkson Ave, Brooklyn, NY 11203","lat":40.6555,"lng":-73.945,"subway":[{"station":"Winthrop St","lines":["2","5"],"walkMinutes":7}],"blurb":"SUNY teaching hospital, co-located with Kings County."},{"id":"brookdale","name":"Brookdale University Hospital Medical Center","network":"One Brooklyn Health","type":"Community Hospital","borough":"Brooklyn","neighborhood":"Brownsville","address":"1 Brookdale Plaza, Brooklyn, NY 11212","lat":40.658,"lng":-73.9094,"subway":[{"station":"Rockaway Av","lines":["3"],"walkMinutes":14},{"station":"Junius St","lines":["3"],"walkMinutes":15}],"blurb":"Safety-net hospital in Brownsville. Bus-heavy commute."},{"id":"interfaith","name":"Interfaith Medical Center","network":"One Brooklyn Health","type":"Community Hospital","borough":"Brooklyn","neighborhood":"Bedford-Stuyvesant","address":"1545 Atlantic Ave, Brooklyn, NY 11213","lat":40.6781,"lng":-73.9398,"subway":[{"station":"Nostrand Av","lines":["A","C"],"walkMinutes":7},{"station":"Kingston-Throop","lines":["C"],"walkMinutes":7}],"blurb":"Behavioral-health-heavy community hospital in Bed-Stuy."},{"id":"nyu-brooklyn","name":"NYU Langone Hospital \u2014 Brooklyn","network":"NYU Langone","type":"Community Hospital","borough":"Brooklyn","neighborhood":"Sunset Park","address":"150 55th St, Brooklyn, NY 11220","lat":40.645,"lng":-74.0142,"subway":[{"station":"53 St","lines":["R"],"walkMinutes":9},{"station":"59 St","lines":["N","R"],"walkMinutes":11}],"blurb":"Formerly Lutheran Medical Center. Major Sunset Park employer."},{"id":"msh-queens","name":"Mount Sinai Queens","network":"Mount Sinai","type":"Community Hospital","borough":"Queens","neighborhood":"Astoria","address":"25-10 30th Ave, Astoria, NY 11102","lat":40.77,"lng":-73.9233,"subway":[{"station":"30 Av","lines":["N","W"],"walkMinutes":5},{"station":"Broadway","lines":["N","W"],"walkMinutes":9}],"blurb":"Astoria community hospital, easy N/W access."},{"id":"nyp-queens","name":"NewYork-Presbyterian Queens","network":"NewYork-Presbyterian","type":"Community Hospital","borough":"Queens","neighborhood":"Flushing","address":"56-45 Main St, Flushing, NY 11355","lat":40.743,"lng":-73.8245,"subway":[{"station":"Flushing \u2013 Main St","lines":["7"],"walkMinutes":18}],"blurb":"Large Queens community hospital. Bus from 7 train."},{"id":"hh-elmhurst","name":"NYC H+H / Elmhurst","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Queens","neighborhood":"Elmhurst","address":"79-01 Broadway, Elmhurst, NY 11373","lat":40.7445,"lng":-73.8866,"subway":[{"station":"Elmhurst Av","lines":["M","R"],"walkMinutes":6},{"station":"Grand Av \u2013 Newtown","lines":["M","R"],"walkMinutes":11}],"blurb":"Major public hospital, one of the busiest pharmacies in Queens."},{"id":"hh-queens","name":"NYC H+H / Queens","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Queens","neighborhood":"Jamaica","address":"82-68 164th St, Jamaica, NY 11432","lat":40.7117,"lng":-73.7977,"subway":[{"station":"Jamaica \u2013 179 St","lines":["F"],"walkMinutes":16},{"station":"Parsons Blvd","lines":["F"],"walkMinutes":18}],"blurb":"Jamaica public hospital. F train + bus typical commute."},{"id":"lij-fh","name":"Long Island Jewish Forest Hills","network":"Northwell","type":"Community Hospital","borough":"Queens","neighborhood":"Forest Hills","address":"102-01 66th Rd, Forest Hills, NY 11375","lat":40.7253,"lng":-73.8516,"subway":[{"station":"67 Av","lines":["M","R"],"walkMinutes":6},{"station":"Forest Hills \u2013 71 Av","lines":["E","F","M","R"],"walkMinutes":11}],"blurb":"Northwell community hospital. Forest Hills neighborhood."},{"id":"flushing","name":"Flushing Hospital Medical Center","network":"MediSys","type":"Community Hospital","borough":"Queens","neighborhood":"Flushing","address":"4500 Parsons Blvd, Flushing, NY 11355","lat":40.7546,"lng":-73.8237,"subway":[{"station":"Flushing \u2013 Main St","lines":["7"],"walkMinutes":16}],"blurb":"MediSys community hospital, near downtown Flushing."},{"id":"jamaica","name":"Jamaica Hospital Medical Center","network":"MediSys","type":"Community Hospital","borough":"Queens","neighborhood":"Richmond Hill / Jamaica","address":"8900 Van Wyck Expy, Jamaica, NY 11418","lat":40.7011,"lng":-73.829,"subway":[{"station":"Sutphin Blvd","lines":["E","J","Z"],"walkMinutes":15},{"station":"121 St","lines":["J","Z"],"walkMinutes":14}],"blurb":"MediSys Level 1 trauma center. Bus-heavy access."},{"id":"monte-moses","name":"Montefiore Medical Center \u2014 Moses Campus","network":"Montefiore","type":"Academic Medical Center","borough":"Bronx","neighborhood":"Norwood","address":"111 E 210th St, Bronx, NY 10467","lat":40.881,"lng":-73.8788,"subway":[{"station":"Mosholu Pkwy","lines":["4"],"walkMinutes":6},{"station":"Norwood \u2013 205 St","lines":["D"],"walkMinutes":10}],"blurb":"Montefiore flagship. Massive pharmacy footprint."},{"id":"monte-einstein","name":"Montefiore Einstein (Weiler Hospital)","network":"Montefiore","type":"Academic Medical Center","borough":"Bronx","neighborhood":"Morris Park","address":"1825 Eastchester Rd, Bronx, NY 10461","lat":40.8528,"lng":-73.8458,"subway":[{"station":"Morris Park","lines":["5"],"walkMinutes":12},{"station":"Pelham Pkwy","lines":["2","5"],"walkMinutes":14}],"blurb":"Einstein-affiliated campus with strong research pharmacy."},{"id":"monte-wakefield","name":"Montefiore Wakefield Campus","network":"Montefiore","type":"Community Hospital","borough":"Bronx","neighborhood":"Wakefield","address":"600 E 233rd St, Bronx, NY 10466","lat":40.8916,"lng":-73.8553,"subway":[{"station":"233 St","lines":["2","5"],"walkMinutes":9}],"blurb":"Community campus serving the north Bronx."},{"id":"hh-jacobi","name":"NYC H+H / Jacobi","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Bronx","neighborhood":"Morris Park","address":"1400 Pelham Pkwy S, Bronx, NY 10461","lat":40.8568,"lng":-73.847,"subway":[{"station":"Pelham Pkwy","lines":["5"],"walkMinutes":11},{"station":"Morris Park","lines":["5"],"walkMinutes":10}],"blurb":"Major Bronx public hospital, Level 1 trauma."},{"id":"hh-lincoln","name":"NYC H+H / Lincoln","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Bronx","neighborhood":"Mott Haven","address":"234 E 149th St, Bronx, NY 10451","lat":40.8166,"lng":-73.9259,"subway":[{"station":"3 Av \u2013 149 St","lines":["2","5"],"walkMinutes":4},{"station":"149 St \u2013 Grand Concourse","lines":["2","4","5"],"walkMinutes":6}],"blurb":"South Bronx safety-net hospital. Strong subway access."},{"id":"hh-ncb","name":"NYC H+H / North Central Bronx","network":"NYC Health + Hospitals","type":"Public Hospital","borough":"Bronx","neighborhood":"Norwood","address":"3424 Kossuth Ave, Bronx, NY 10467","lat":40.8806,"lng":-73.8801,"subway":[{"station":"Mosholu Pkwy","lines":["4"],"walkMinutes":5},{"station":"Norwood \u2013 205 St","lines":["D"],"walkMinutes":10}],"blurb":"Co-located with Montefiore Moses."},{"id":"bronxcare","name":"BronxCare Health System","network":"BronxCare","type":"Community Hospital","borough":"Bronx","neighborhood":"Morrisania","address":"1650 Grand Concourse, Bronx, NY 10457","lat":40.8418,"lng":-73.9116,"subway":[{"station":"170 St","lines":["4"],"walkMinutes":3},{"station":"170 St","lines":["B","D"],"walkMinutes":6}],"blurb":"Formerly Bronx-Lebanon. On the Grand Concourse, great transit."},{"id":"calvary","name":"Calvary Hospital","network":"Calvary","type":"Specialty Hospital","borough":"Bronx","neighborhood":"Eastchester","address":"1740 Eastchester Rd, Bronx, NY 10461","lat":40.8636,"lng":-73.8439,"subway":[{"station":"Pelham Pkwy","lines":["5"],"walkMinutes":18}],"blurb":"Palliative care specialty hospital. Bus from the 5 train."},{"id":"siuh-north","name":"Staten Island University Hospital \u2014 North","network":"Northwell","type":"Community Hospital","borough":"Staten Island","neighborhood":"Ocean Breeze","address":"475 Seaview Ave, Staten Island, NY 10305","lat":40.5832,"lng":-74.0846,"subway":[{"station":"Old Town (SIR)","lines":["SIR"],"walkMinutes":14}],"blurb":"Northwell's main SI campus. SIR + bus."},{"id":"rumc","name":"Richmond University Medical Center","network":"Richmond University","type":"Community Hospital","borough":"Staten Island","neighborhood":"West Brighton","address":"355 Bard Ave, Staten Island, NY 10310","lat":40.6363,"lng":-74.1063,"subway":[{"station":"St George Terminal (SIR/Ferry)","lines":["SIR"],"walkMinutes":25}],"blurb":"North Shore SI community hospital. Ferry + bus commute."}],"networkColors":{"Mount Sinai":"#00a3e0","NewYork-Presbyterian":"#003da5","NYC Health + Hospitals":"#e4002b","Northwell":"#5e2d91","Montefiore":"#0b8457","Maimonides":"#c8102e","MediSys":"#f5a623","One Brooklyn Health":"#ff6b35","BronxCare":"#8e44ad","SUNY Downstate":"#1d4e89","Wyckoff Heights":"#d35400","NYU Langone":"#57068c","Richmond University":"#2c7a7b","Calvary":"#7f8c8d","Interfaith":"#16a085"},"lineColors":{"1":{"bg":"#EE352E","fg":"#fff"},"2":{"bg":"#EE352E","fg":"#fff"},"3":{"bg":"#EE352E","fg":"#fff"},"4":{"bg":"#00933C","fg":"#fff"},"5":{"bg":"#00933C","fg":"#fff"},"6":{"bg":"#00933C","fg":"#fff"},"7":{"bg":"#B933AD","fg":"#fff"},"A":{"bg":"#0039A6","fg":"#fff"},"C":{"bg":"#0039A6","fg":"#fff"},"E":{"bg":"#0039A6","fg":"#fff"},"B":{"bg":"#FF6319","fg":"#fff"},"D":{"bg":"#FF6319","fg":"#fff"},"F":{"bg":"#FF6319","fg":"#fff"},"M":{"bg":"#FF6319","fg":"#fff"},"G":{"bg":"#6CBE45","fg":"#fff"},"J":{"bg":"#996633","fg":"#fff"},"Z":{"bg":"#996633","fg":"#fff"},"L":{"bg":"#A7A9AC","fg":"#fff"},"N":{"bg":"#FCCC0A","fg":"#000"},"Q":{"bg":"#FCCC0A","fg":"#000"},"R":{"bg":"#FCCC0A","fg":"#000"},"W":{"bg":"#FCCC0A","fg":"#000"},"S":{"bg":"#808183","fg":"#fff"},"SIR":{"bg":"#0078C6","fg":"#fff"}}};

/* ---------- design tokens (from the app's styles.css) ---------- */
const PAPER = "#FBFAF6";
const INK = "#16161D";
const RULE = "#DEDBD2";
const SIGNAL = "#F2C230"; // MTA caution yellow
const MUTED = "#6B6B75";

const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

/* Reference points for "home" — no geocoding API available offline, so we
   offer known NYC anchor points plus click-to-place on the map. */
const ANCHORS = [
  { label: "Bed-Stuy, Brooklyn", lat: 40.6872, lng: -73.9418 },
  { label: "Bushwick, Brooklyn", lat: 40.6944, lng: -73.9213 },
  { label: "Park Slope, Brooklyn", lat: 40.6710, lng: -73.9814 },
  { label: "Flatbush, Brooklyn", lat: 40.6409, lng: -73.9624 },
  { label: "Harlem, Manhattan", lat: 40.8116, lng: -73.9465 },
  { label: "Lower East Side, Manhattan", lat: 40.7150, lng: -73.9843 },
  { label: "Astoria, Queens", lat: 40.7644, lng: -73.9235 },
  { label: "Jackson Heights, Queens", lat: 40.7557, lng: -73.8831 },
  { label: "Fordham, Bronx", lat: 40.8610, lng: -73.8900 },
  { label: "St. George, Staten Island", lat: 40.6437, lng: -74.0765 },
];

const BORO_PATHS = {"Staten Island":"M250.5,428.7 254.6,428.9 260.4,433.6 261.8,432.5 262.6,434.5 263.9,433.6 263.1,434.8 264.8,436.2 263.3,437.6 265.6,437.5 262.0,438.5 265.8,438.2 262.1,438.8 262.3,439.9 266.0,439.7 262.1,440.5 263.0,444.1 261.6,445.5 265.4,445.6 261.7,446.0 263.3,446.4 261.7,446.6 262.2,456.1 268.5,458.4 262.3,456.5 263.1,464.7 266.3,469.9 270.4,473.4 271.1,472.7 270.8,473.7 271.8,473.0 270.2,474.7 273.3,474.5 272.2,475.5 273.7,475.8 278.2,484.1 278.7,482.7 278.3,484.2 283.1,491.1 286.5,493.2 287.0,501.4 288.5,502.4 275.9,514.3 272.3,518.9 273.1,520.0 264.8,527.8 264.1,529.3 265.2,530.1 263.8,529.8 259.7,533.8 261.7,535.2 259.6,533.9 259.2,535.8 258.4,535.3 254.3,539.2 255.0,540.1 252.7,540.2 245.8,547.4 244.6,549.4 245.5,550.1 244.1,549.2 241.6,552.4 239.4,552.8 235.5,558.9 233.8,558.2 232.3,559.9 230.8,564.5 227.0,565.6 226.3,569.8 224.1,569.3 221.9,573.7 218.7,571.9 211.8,581.5 207.0,581.5 202.9,585.2 199.6,586.2 189.1,601.8 181.2,609.8 178.7,608.6 176.9,600.8 185.0,600.2 188.5,596.7 187.7,596.1 185.1,598.7 190.0,593.5 187.7,596.0 188.5,596.7 193.2,590.8 193.1,588.2 190.7,585.1 186.5,583.1 181.0,584.4 182.3,585.8 180.9,584.7 181.3,586.4 179.9,584.3 178.8,585.7 180.3,587.0 178.9,586.0 179.8,587.5 177.9,586.9 179.4,588.1 176.8,587.3 178.3,588.7 177.0,587.9 177.5,589.9 175.7,588.8 176.9,590.1 175.5,588.9 177.0,590.5 175.6,589.6 176.1,591.3 174.4,590.0 174.5,596.3 175.7,597.8 174.6,596.6 175.3,597.9 172.6,597.7 171.3,599.9 165.7,602.2 156.8,610.8 149.1,613.0 139.3,619.3 136.7,618.9 129.7,625.1 125.3,622.8 120.5,624.9 107.4,639.2 101.7,637.0 102.1,634.5 91.7,636.3 79.1,649.3 69.7,651.7 61.8,651.6 54.7,654.3 50.9,658.0 45.2,658.1 42.1,660.2 38.6,659.1 33.8,653.7 31.3,648.1 31.0,642.4 33.3,640.0 32.3,639.2 33.8,639.3 33.5,636.6 35.3,633.5 37.9,631.4 37.3,629.8 39.0,631.4 38.1,629.8 39.8,629.7 38.7,628.5 39.9,627.8 41.1,630.4 42.5,630.1 41.8,628.2 44.1,628.0 43.5,626.8 47.7,626.5 50.9,623.8 47.0,622.0 47.1,617.8 45.6,616.4 48.8,607.1 48.1,602.1 45.4,598.2 43.9,598.2 45.0,596.4 43.6,592.0 40.5,588.8 46.4,581.5 47.9,582.9 50.2,581.8 55.2,577.5 55.2,574.7 59.1,574.4 62.4,569.8 65.4,568.5 72.7,570.0 74.9,569.2 76.3,571.2 77.0,569.4 77.8,571.1 77.6,569.1 78.8,570.6 81.0,569.8 82.3,567.9 84.5,568.2 86.1,565.5 86.9,557.7 91.2,547.0 95.8,527.0 95.4,518.5 98.8,516.0 97.5,515.7 98.8,515.9 104.5,507.0 102.9,499.6 98.5,493.1 97.8,489.6 98.2,482.0 100.8,477.2 99.3,467.0 100.3,456.0 107.3,448.6 108.1,445.3 118.4,436.1 120.5,435.0 122.0,437.9 122.0,434.3 126.6,434.8 126.7,433.3 127.8,434.2 127.2,438.4 127.7,436.8 128.9,438.1 130.2,436.6 131.3,437.8 130.9,436.2 132.2,436.3 132.1,434.1 133.8,433.5 135.9,436.8 137.6,437.0 137.3,439.7 135.6,440.6 137.3,439.8 138.0,437.4 137.8,438.7 143.7,439.1 144.3,437.6 144.7,439.4 145.7,437.9 145.4,440.3 146.4,439.2 146.7,441.3 146.9,439.7 147.1,441.5 147.9,439.8 149.9,440.4 149.1,443.2 150.9,442.2 151.6,443.7 152.2,441.4 151.7,443.8 152.9,444.6 153.3,443.1 155.6,444.4 155.8,442.4 155.7,444.4 157.4,445.1 158.7,442.5 158.8,445.3 161.1,445.7 161.8,443.9 163.2,444.8 162.9,442.2 165.4,445.2 166.1,443.3 166.5,445.2 166.2,443.0 172.4,443.0 174.4,440.8 184.5,438.4 189.8,440.2 190.6,439.2 190.9,440.8 191.4,439.5 193.8,442.3 194.6,439.3 195.5,439.1 195.1,441.0 197.4,441.1 199.4,440.4 199.2,439.1 202.7,439.5 202.7,437.9 203.8,439.1 203.4,437.7 204.4,439.0 204.1,437.4 204.7,439.0 205.1,438.0 206.1,438.9 206.2,436.7 206.9,438.1 206.9,436.5 208.6,437.5 210.3,435.0 215.7,433.0 229.5,433.6 236.9,432.2 246.1,427.8 250.5,428.7ZM152.7,439.1 150.6,438.5 150.2,434.8 155.3,436.3 152.7,439.1ZM287.4,536.1 286.2,537.0 285.1,536.0 285.2,532.7 286.7,531.8 287.4,536.1Z","Queens":"M582.0,196.3 590.6,202.3 592.5,200.7 601.2,203.7 607.8,203.0 612.5,204.3 615.1,205.7 614.4,210.3 617.1,214.9 620.3,212.6 630.1,211.1 627.8,210.4 631.1,211.3 632.3,206.9 629.2,205.6 634.1,202.9 637.3,203.2 640.5,206.3 645.2,215.4 640.6,218.0 638.0,215.3 648.3,229.1 650.1,228.5 648.3,229.2 652.2,237.7 660.4,247.5 665.1,249.4 670.0,256.0 675.7,259.7 678.1,263.9 673.4,256.3 670.6,255.8 664.9,247.2 665.8,245.4 664.3,241.2 667.1,238.6 664.3,231.8 665.6,231.6 667.5,226.3 670.3,223.9 731.2,269.0 733.0,272.7 734.6,290.3 725.0,307.6 711.5,310.4 696.3,316.3 700.6,334.8 702.2,381.1 699.8,389.3 698.8,406.2 701.8,414.3 702.7,423.0 690.2,426.5 682.2,430.8 682.2,440.5 681.1,441.1 684.1,448.7 680.9,448.7 682.8,445.4 681.6,444.2 679.0,444.5 679.3,442.8 677.9,445.8 675.4,446.2 677.3,443.8 675.1,446.0 676.2,440.7 674.8,436.5 672.8,433.4 665.3,429.4 674.6,439.2 673.2,448.3 652.3,457.4 649.8,460.3 645.0,471.7 643.8,470.3 645.0,466.7 643.8,466.3 639.4,472.9 643.8,466.3 638.2,460.4 634.3,460.6 626.7,471.6 627.7,476.3 632.3,480.0 632.2,481.5 622.4,486.8 618.9,490.6 619.2,489.3 616.0,488.5 614.6,486.4 607.0,484.0 614.9,467.8 621.1,467.8 628.9,459.4 630.0,456.1 621.3,450.0 610.4,454.9 619.6,450.0 618.5,448.2 585.0,431.7 581.1,427.4 578.3,417.9 579.7,411.8 584.3,409.2 593.7,409.9 584.3,407.6 578.2,410.8 576.4,417.8 578.7,429.1 574.9,426.0 574.6,428.6 571.9,427.4 568.8,423.6 568.0,420.4 571.2,416.8 567.8,420.1 567.2,419.3 571.3,415.1 569.8,411.2 571.1,414.9 567.7,418.7 566.3,414.7 567.5,416.7 566.7,414.2 568.8,413.6 565.7,413.8 568.6,428.4 564.3,429.0 562.8,428.1 558.9,407.1 557.4,408.0 557.6,410.1 562.5,432.9 545.3,435.0 541.6,430.1 545.4,423.9 541.5,425.2 537.2,424.1 530.3,416.3 532.2,415.5 532.5,413.2 530.8,413.3 531.2,411.9 530.4,412.8 532.3,413.5 530.9,415.6 528.0,413.5 535.0,410.7 534.0,405.6 537.5,405.0 535.0,393.1 531.5,393.7 529.0,381.7 527.8,381.8 526.8,376.8 524.4,377.5 520.7,357.4 514.2,358.8 507.3,363.5 500.9,370.3 494.5,374.0 493.8,372.8 490.8,375.2 488.7,372.4 485.8,376.9 479.9,368.4 480.8,368.0 479.0,364.1 479.8,363.0 474.0,358.9 475.9,356.5 466.4,350.1 467.8,348.4 465.0,346.4 466.4,344.8 453.6,335.7 455.1,334.0 450.8,327.0 455.3,325.6 453.2,325.1 449.5,316.0 450.4,314.1 455.5,314.0 449.8,312.7 444.3,307.0 433.1,303.6 428.6,295.5 423.1,292.9 428.8,290.3 432.5,284.7 430.6,284.2 427.2,290.5 421.6,292.3 413.2,289.4 408.6,289.8 404.4,292.1 402.0,291.0 403.7,288.6 403.8,285.1 405.6,283.8 404.5,282.8 406.9,282.2 405.8,281.2 407.2,281.5 406.2,280.7 409.4,275.7 414.0,277.4 409.9,275.4 410.1,274.4 411.6,274.5 426.2,251.8 430.9,246.5 437.1,243.4 437.7,241.3 433.9,239.6 433.4,238.1 435.3,232.9 438.4,231.1 441.1,231.5 443.5,234.0 445.1,233.4 459.6,221.9 465.4,214.0 468.8,211.6 480.9,214.6 486.5,219.7 482.9,224.0 479.9,224.1 478.1,227.8 479.7,225.4 483.0,225.2 488.4,221.8 486.3,223.5 488.0,224.8 487.2,225.7 488.2,224.8 487.3,225.9 488.7,224.5 490.1,225.4 490.5,223.7 491.9,224.9 490.2,225.5 491.9,227.0 490.8,228.9 492.5,230.4 490.8,232.2 492.2,233.8 491.7,236.1 493.9,231.6 493.8,237.9 494.7,238.1 501.7,237.2 500.5,235.9 500.5,228.3 508.3,227.4 507.0,223.9 512.8,226.0 517.8,219.1 519.6,220.1 522.0,217.1 519.5,220.5 520.0,222.7 521.2,222.7 516.1,227.0 538.3,240.1 536.5,243.0 534.3,243.0 536.8,245.2 532.8,247.9 528.5,248.4 533.5,255.6 535.0,254.0 534.1,253.3 535.0,254.0 535.8,252.5 535.1,254.0 536.3,254.6 534.3,255.0 536.3,256.2 533.8,255.8 543.8,259.5 545.6,258.3 544.8,257.0 542.0,258.1 544.9,256.8 546.5,258.4 553.9,251.7 558.4,249.6 557.9,247.9 551.9,250.4 547.4,248.4 546.4,243.8 545.0,243.6 546.3,242.3 544.7,240.5 543.0,240.7 544.7,240.5 546.0,238.1 546.0,231.3 545.1,229.0 542.8,229.8 544.9,228.8 541.7,229.5 545.2,228.5 542.5,228.5 545.3,228.2 543.5,226.6 545.6,224.8 538.0,225.3 537.8,223.5 534.4,222.6 534.6,221.1 532.6,219.8 534.4,217.5 536.0,218.1 537.1,216.6 541.1,215.8 538.6,215.2 539.0,212.6 541.3,211.3 540.0,206.9 541.3,205.5 545.9,207.9 546.3,204.8 549.4,203.7 552.8,205.6 553.2,203.6 554.5,204.5 553.7,202.5 555.3,204.8 556.8,201.4 560.0,200.1 557.0,201.5 559.4,202.8 561.1,207.2 560.8,214.6 562.8,213.7 566.3,215.3 568.2,214.3 567.3,213.0 568.3,211.0 572.1,209.4 571.0,208.4 572.6,208.7 570.7,202.7 573.3,202.7 574.1,201.2 576.2,201.9 582.0,196.3ZM650.2,480.5 652.1,481.2 652.3,483.9 656.5,484.1 658.4,485.7 656.7,488.4 658.7,485.6 659.0,486.7 664.2,486.8 673.9,483.4 676.7,483.9 680.0,491.1 686.3,498.0 686.4,505.7 683.9,507.9 683.2,506.7 681.7,507.2 684.1,508.2 686.4,506.2 687.0,510.7 675.7,510.8 666.8,516.0 657.0,514.8 638.6,516.9 590.9,527.3 565.1,536.2 528.6,553.1 527.5,552.4 523.6,553.8 524.0,554.6 520.3,554.8 518.5,555.7 519.0,556.7 518.2,555.8 516.3,557.6 515.3,556.9 487.8,567.5 477.8,568.0 472.6,569.7 430.1,589.1 429.7,590.7 430.9,571.3 436.1,567.3 440.9,566.4 448.2,560.7 459.0,558.7 466.3,555.4 466.2,554.1 466.3,555.4 469.0,555.0 469.0,556.5 471.3,556.7 472.7,558.7 479.4,558.5 486.0,555.1 486.8,552.3 490.7,550.0 495.1,551.0 501.2,549.8 501.0,551.0 501.7,549.5 509.7,549.6 544.1,529.4 558.2,529.8 559.2,528.4 571.9,525.2 572.5,523.4 576.6,521.7 580.8,522.3 591.0,516.0 590.8,514.8 591.2,515.8 593.2,515.0 593.4,513.0 593.7,514.7 594.0,512.8 595.4,514.0 595.9,511.9 600.4,514.3 600.7,516.2 600.6,514.6 602.7,514.6 597.9,511.1 600.3,508.9 602.8,510.8 603.2,513.0 604.9,513.4 603.8,510.9 605.0,510.5 603.6,510.6 601.4,506.9 604.2,503.9 617.7,502.2 625.1,497.2 620.2,503.4 619.4,509.0 620.1,510.2 619.9,508.1 620.5,510.1 620.4,508.2 621.0,510.2 621.8,505.2 628.9,498.3 628.7,494.1 635.1,487.5 639.2,487.4 640.7,488.6 640.2,490.9 638.4,488.2 640.2,491.1 640.1,495.6 635.7,501.6 633.2,501.1 630.9,503.5 631.6,505.6 633.3,507.0 639.7,499.5 641.5,505.0 648.4,505.5 644.5,503.1 647.3,487.9 643.2,484.7 641.7,485.3 642.2,486.7 640.7,484.2 641.7,481.4 650.2,480.5ZM578.4,442.8 581.3,456.9 587.6,464.7 585.3,465.5 584.1,467.7 588.1,469.5 588.5,471.6 586.2,472.9 585.5,475.5 587.2,480.4 590.2,480.0 588.4,480.8 589.0,482.4 587.5,482.5 588.5,486.4 589.6,485.3 589.3,489.3 588.3,492.8 586.0,494.3 584.6,503.1 581.1,510.1 566.9,510.4 563.9,509.0 567.0,505.5 572.5,505.7 575.1,503.0 576.8,505.0 577.9,502.1 580.8,502.2 577.0,501.0 578.9,498.2 579.0,493.3 583.2,486.2 581.6,483.5 582.0,486.6 580.6,489.3 575.6,480.7 573.5,481.8 573.2,480.6 568.8,479.3 564.9,480.3 565.7,461.4 568.6,452.5 565.7,443.6 567.2,442.9 572.4,447.6 575.2,447.8 577.1,447.1 577.4,441.4 578.4,442.8ZM610.7,460.5 613.5,462.4 609.0,465.5 616.1,463.9 610.4,467.1 608.1,473.9 605.8,471.8 606.4,478.0 604.6,481.5 601.6,481.7 602.0,478.1 598.3,469.9 599.2,465.8 607.9,461.2 606.8,460.3 610.7,460.5ZM615.3,490.4 616.2,492.5 614.2,491.1 615.3,493.2 611.8,495.9 602.6,495.3 601.4,491.9 602.7,488.9 606.0,486.6 609.5,486.4 615.3,490.4ZM561.5,509.9 566.7,514.2 564.6,515.3 566.8,515.4 566.8,517.1 563.7,517.8 565.6,518.4 560.9,517.8 557.4,514.5 557.5,513.1 555.6,514.1 552.4,512.2 558.6,507.9 561.5,509.9Z","Brooklyn":"M412.4,290.5 422.4,293.8 421.7,297.6 423.6,294.3 424.1,296.0 424.9,294.8 427.6,296.1 433.1,304.8 444.3,308.3 450.2,320.8 449.7,322.0 444.8,323.0 444.0,326.1 440.5,327.2 441.8,329.1 440.0,330.1 440.8,332.4 439.2,333.3 440.9,332.7 442.9,336.7 441.4,332.0 442.3,331.5 441.0,330.9 442.8,330.0 442.3,327.3 445.3,326.4 445.6,324.0 450.1,322.7 451.4,323.6 452.1,325.1 449.8,326.8 455.1,334.0 453.6,335.7 466.4,344.8 465.0,346.4 467.8,348.4 466.4,350.1 475.9,356.5 474.0,358.9 479.8,363.0 479.0,364.1 480.8,368.0 479.9,368.4 485.8,376.9 488.7,372.4 490.8,375.2 500.9,370.3 507.3,363.5 514.2,358.8 521.3,358.0 524.4,377.5 526.8,376.8 527.8,381.8 529.0,381.7 531.5,393.7 535.0,393.1 537.5,405.0 534.0,405.6 535.0,410.7 528.0,413.5 527.9,415.5 535.9,425.2 534.0,430.6 535.6,435.7 528.3,437.4 523.5,441.3 524.9,443.2 521.0,439.9 518.6,433.9 516.1,432.8 507.5,419.1 519.5,442.9 521.9,444.2 519.8,445.7 519.9,444.4 515.6,446.8 513.7,446.4 508.5,442.8 503.9,435.6 502.3,434.4 499.6,435.2 497.3,432.3 496.9,429.3 492.7,427.1 495.5,432.1 494.7,430.7 496.3,430.4 496.5,433.5 508.4,443.9 510.3,447.4 502.0,455.1 501.5,457.2 503.3,459.1 502.0,460.2 500.2,458.3 497.1,459.1 491.0,466.1 486.7,467.9 483.5,467.2 479.9,463.1 460.6,453.4 459.2,454.3 478.4,465.0 477.6,466.2 480.4,469.3 485.8,469.6 486.9,472.0 485.6,475.8 486.6,480.1 492.8,482.6 489.0,485.1 492.6,483.5 494.4,484.7 489.8,491.9 481.5,493.8 480.2,491.6 481.1,486.8 479.6,484.3 478.2,484.1 479.6,486.2 470.2,475.6 470.8,477.0 469.8,477.0 471.2,478.2 470.0,476.3 469.2,477.2 478.5,486.3 479.3,493.4 474.7,494.7 473.8,492.5 470.4,492.0 471.2,494.0 470.1,492.2 468.9,493.0 470.8,496.0 464.0,496.1 460.1,491.8 460.3,487.8 459.7,488.8 463.0,484.4 463.2,479.4 460.5,481.5 461.2,482.5 460.3,481.7 461.4,484.2 458.4,486.6 458.5,489.8 457.3,489.6 458.4,490.5 456.8,489.9 458.2,491.2 456.6,490.4 463.1,497.8 467.7,499.1 469.9,498.1 467.7,499.1 470.0,499.7 482.8,496.6 491.2,497.0 497.0,494.1 501.6,493.7 503.3,495.7 502.5,497.7 508.2,520.4 510.8,525.1 507.0,532.4 487.0,537.5 485.0,532.8 485.7,528.0 483.5,522.2 481.7,521.7 482.6,520.9 479.8,521.4 481.4,520.4 480.4,520.3 475.9,522.1 473.1,520.4 473.2,521.9 466.8,523.4 466.1,510.5 462.2,504.0 454.1,499.2 449.8,502.4 443.1,496.0 440.7,497.8 442.0,499.6 446.9,502.3 463.3,518.6 457.0,523.5 450.0,524.0 446.3,521.4 446.7,520.4 445.8,520.9 451.0,515.7 445.1,519.6 442.6,517.6 443.4,511.3 440.0,509.9 442.1,514.5 441.8,518.1 443.7,519.5 443.7,521.1 441.7,522.2 445.1,521.9 445.7,523.7 446.5,522.9 449.3,525.5 455.8,525.6 464.2,523.3 465.6,527.5 459.4,527.8 461.8,529.0 466.2,528.1 466.7,529.9 462.3,530.3 450.4,527.2 442.1,528.5 428.7,527.1 413.6,528.1 413.8,529.6 418.4,529.1 427.2,531.1 440.1,530.7 442.0,538.4 437.1,539.9 425.1,539.0 406.6,542.6 396.2,542.8 393.6,544.3 391.0,543.8 391.2,544.9 388.9,544.1 388.6,545.4 388.3,544.4 385.8,545.7 383.4,545.0 383.0,546.0 382.1,545.0 376.4,545.5 375.3,545.7 375.7,548.5 375.2,545.7 366.3,547.4 353.3,547.2 352.0,548.5 350.8,544.5 339.4,540.4 338.2,535.8 340.1,532.5 347.0,529.6 356.9,530.4 357.4,531.7 369.3,534.4 371.5,532.9 372.3,530.0 369.9,533.1 365.3,531.0 367.0,525.6 360.4,529.2 354.4,527.9 354.2,526.2 357.1,524.4 355.2,523.1 362.2,519.4 357.3,521.5 361.2,519.3 360.6,518.4 354.2,522.8 357.3,519.9 355.3,518.6 358.2,514.9 354.4,515.1 356.7,512.0 353.3,513.5 350.1,508.1 340.9,501.1 328.0,496.8 316.6,494.9 309.0,488.0 303.7,479.3 302.0,470.9 302.6,456.4 308.0,442.9 305.6,441.9 308.1,442.6 309.4,440.3 308.1,438.9 311.5,434.7 313.7,435.9 316.0,433.3 318.9,435.2 321.7,431.8 317.4,427.9 322.1,431.2 323.4,430.5 321.4,428.9 324.1,429.7 322.3,426.4 323.2,425.2 321.7,424.6 324.0,424.4 322.5,423.1 325.7,424.3 322.5,421.9 327.8,424.8 324.5,421.5 326.9,422.7 327.8,421.8 325.3,419.9 327.3,420.5 327.2,418.7 331.1,420.8 329.3,418.0 332.0,419.9 332.9,418.8 329.6,416.2 333.6,418.0 330.5,414.9 331.1,414.1 334.6,416.6 332.3,413.2 335.6,415.5 336.4,414.5 332.6,411.7 335.0,409.7 339.7,412.5 340.6,411.3 336.9,408.5 338.6,407.9 343.8,411.6 345.2,410.0 341.5,407.2 342.6,405.9 349.2,408.7 347.2,406.1 350.2,407.5 344.9,403.6 347.0,405.0 347.5,404.0 350.1,406.7 348.5,403.2 353.2,406.5 355.3,404.2 351.0,401.0 355.9,398.0 356.2,393.2 354.3,397.6 351.9,397.8 351.0,399.7 347.2,398.7 345.8,401.7 348.6,394.6 347.8,394.3 345.1,400.1 345.7,397.8 342.2,397.9 340.0,403.1 333.3,403.5 330.2,393.2 332.5,394.1 333.8,403.4 339.1,402.1 341.6,397.1 339.9,394.8 336.6,396.1 339.8,394.7 336.6,393.6 335.4,394.5 336.6,392.4 334.8,394.1 338.2,390.6 335.5,392.4 334.0,391.2 335.7,388.5 330.9,392.2 332.8,390.2 332.1,387.7 330.8,387.9 332.0,385.7 329.4,384.8 331.3,383.6 329.8,382.9 331.5,382.6 330.2,381.0 338.4,374.9 339.3,376.0 336.8,377.8 338.2,379.8 342.4,375.5 341.0,373.8 339.6,374.5 344.6,370.9 347.2,371.0 350.9,364.6 353.4,365.0 352.5,361.6 361.5,343.3 366.1,343.9 367.0,342.5 382.1,340.9 383.2,345.1 385.1,342.8 383.9,345.7 384.9,346.7 385.9,345.5 385.1,347.0 386.9,347.6 385.4,350.7 387.5,348.0 389.6,349.7 388.6,347.5 391.7,350.0 389.1,345.8 393.3,349.2 389.1,344.9 394.0,347.3 386.8,340.8 389.4,340.6 386.8,338.3 391.3,341.1 389.7,336.2 392.3,339.5 392.4,342.5 395.8,344.8 393.6,342.3 392.7,334.1 396.1,324.2 401.6,316.5 402.7,311.7 407.9,312.5 403.3,310.6 404.1,306.2 402.4,298.2 407.4,292.0 412.4,290.5ZM548.0,457.9 544.9,462.3 548.1,461.7 552.8,466.9 536.2,471.7 530.6,475.2 527.4,475.0 526.9,472.9 530.1,473.2 530.7,465.4 527.6,466.6 527.8,462.7 531.5,463.9 533.8,459.6 536.4,457.9 539.6,460.2 539.1,458.3 543.8,459.6 546.6,457.1 548.0,457.9ZM553.5,475.2 553.7,476.9 552.3,476.2 551.6,479.5 556.1,482.3 559.5,481.1 556.3,493.6 548.3,496.7 542.4,491.7 547.5,488.1 547.0,483.1 549.5,475.2 553.5,475.2ZM518.3,476.4 508.9,478.7 513.2,466.3 523.3,459.8 525.7,463.1 524.1,474.1 518.3,476.4ZM548.2,453.5 546.5,456.3 533.8,455.8 536.9,448.8 548.9,443.2 552.9,446.6 550.9,451.7 548.2,453.5ZM523.1,529.4 520.6,530.0 519.3,528.6 517.9,522.1 519.6,518.2 524.0,514.5 527.9,516.0 530.4,520.5 527.9,526.7 523.1,529.4Z","Manhattan":"M447.9,79.7 453.0,81.0 452.7,84.6 454.4,86.6 456.3,85.8 454.9,83.0 457.4,84.2 457.9,86.4 459.1,84.4 458.7,85.4 461.5,84.4 465.5,85.6 468.1,89.0 465.4,96.6 463.1,100.2 461.2,100.0 461.8,101.8 456.7,108.3 454.0,106.4 453.6,107.8 455.5,109.3 453.0,111.7 453.0,113.1 454.1,111.7 443.7,129.0 437.1,144.2 438.5,167.8 437.8,183.3 444.6,196.2 444.2,204.1 435.9,211.4 434.4,214.0 435.6,214.7 434.3,214.3 430.9,220.3 426.6,223.2 425.8,226.3 428.1,234.1 427.0,236.4 390.9,283.3 389.5,295.5 386.9,295.4 389.2,296.0 387.0,296.3 390.8,308.4 388.2,321.4 384.2,332.4 378.4,335.1 369.4,336.1 368.9,334.8 357.1,337.1 353.2,339.6 353.9,341.7 352.8,342.6 350.5,341.4 350.9,342.7 350.1,341.7 348.9,342.7 350.2,344.2 347.9,343.4 349.3,345.4 347.5,343.8 346.3,344.4 347.7,346.3 346.1,344.6 342.9,347.0 343.6,348.3 344.8,347.6 344.1,349.0 342.5,347.2 340.5,347.8 341.0,349.7 340.5,348.6 339.5,349.9 338.1,349.2 338.1,350.3 337.0,348.5 335.6,349.5 330.2,340.7 331.6,338.1 332.2,330.5 333.6,331.5 334.0,329.6 332.2,330.1 333.5,321.7 338.1,321.2 336.3,318.8 338.2,319.1 339.9,310.6 335.4,309.9 340.0,309.8 340.2,307.0 336.4,306.7 336.9,303.3 340.5,303.7 340.8,299.8 336.9,299.3 341.1,299.1 339.4,298.2 341.0,297.8 341.5,290.4 339.0,289.5 340.1,288.2 338.6,288.0 342.6,288.0 339.3,286.5 342.6,286.9 343.2,284.7 339.3,283.7 343.4,283.2 343.6,281.7 339.7,280.6 342.7,280.4 340.0,279.1 343.0,278.8 340.2,277.5 343.2,277.3 343.3,276.3 340.5,275.9 342.6,274.0 341.0,273.3 342.9,273.9 343.9,271.0 342.9,270.3 344.0,270.6 342.0,269.4 344.1,270.3 348.6,262.0 345.8,259.9 346.5,258.9 349.7,259.6 351.7,256.3 348.9,254.9 351.9,256.1 352.7,254.7 350.1,252.9 352.9,254.4 353.4,253.5 350.7,251.5 355.1,253.3 355.7,252.3 351.8,250.2 356.1,251.7 356.9,250.2 352.7,248.0 357.1,249.8 358.0,248.3 353.8,246.1 358.3,247.8 359.2,246.4 355.0,244.2 358.4,245.4 359.0,244.4 355.9,242.8 359.3,243.8 359.9,241.3 361.1,241.2 358.3,239.6 361.7,239.9 358.9,238.1 362.1,239.7 359.5,237.4 362.3,238.6 364.5,235.7 368.8,228.7 365.4,228.9 368.7,228.4 373.1,220.1 372.2,219.0 371.0,220.3 372.2,218.8 373.1,220.0 372.7,218.8 374.1,218.3 372.5,218.4 374.1,218.2 400.1,173.8 406.8,165.1 405.8,162.8 407.6,163.9 405.9,161.8 410.0,155.3 412.2,155.4 416.3,148.4 422.9,131.0 421.8,121.0 428.3,115.9 440.3,95.0 440.9,89.6 443.4,84.7 447.9,79.7ZM454.3,196.5 463.0,204.4 463.9,207.2 462.2,210.0 457.8,213.5 450.3,224.7 445.7,226.9 437.0,223.7 435.6,221.8 436.1,219.6 440.3,213.5 443.7,211.0 448.3,211.9 447.7,210.2 448.9,210.3 446.0,211.6 447.0,210.1 445.5,209.5 447.2,204.7 446.8,197.2 449.3,194.8 452.7,195.0 454.3,196.5ZM333.5,360.1 337.6,362.0 339.7,361.4 337.8,362.1 339.7,363.6 338.0,368.0 333.1,370.0 335.5,370.6 332.5,372.3 333.0,370.0 328.6,372.4 330.1,372.7 326.0,373.8 325.5,376.0 325.8,373.9 321.9,373.8 321.2,371.0 329.6,360.5 333.5,360.1ZM428.4,244.9 414.8,263.1 403.3,274.8 406.6,268.4 424.7,243.8 430.4,239.0 430.3,242.5 428.4,244.9ZM472.9,82.5 470.0,88.0 467.1,84.7 461.3,82.6 468.2,77.6 472.9,82.5ZM304.1,348.6 306.9,351.0 304.8,352.9 302.4,350.7 304.1,353.5 301.9,355.4 299.3,353.0 304.1,348.6Z","Bronx":"M515.6,38.9 532.7,44.9 532.5,41.9 534.3,42.1 535.6,37.6 537.1,37.6 536.0,36.3 539.9,33.8 538.9,32.0 540.9,29.9 543.3,29.9 540.3,34.2 543.5,35.6 544.4,34.2 551.2,37.2 551.1,39.3 555.6,39.3 558.3,46.5 557.8,49.7 559.4,54.7 579.3,61.4 579.1,59.0 616.9,71.0 613.6,75.0 614.3,76.5 611.2,83.5 608.2,85.0 606.9,88.9 604.8,90.5 603.7,87.5 602.5,89.5 604.2,92.6 600.5,92.7 597.3,89.5 599.5,93.2 601.8,94.0 602.1,96.4 604.2,95.8 604.1,97.7 605.1,98.0 610.8,87.9 614.6,86.4 616.7,80.6 615.1,79.7 617.0,77.2 621.2,74.2 621.3,77.6 627.8,78.5 624.2,87.1 625.4,87.7 626.9,85.8 626.7,88.6 628.8,85.6 629.3,90.3 626.2,93.8 625.7,91.9 623.3,91.5 618.9,94.1 617.3,100.2 618.8,103.2 618.3,105.3 616.2,105.7 614.9,108.2 615.2,111.8 612.0,112.2 609.6,114.3 610.8,118.8 607.6,124.6 602.7,116.7 602.3,114.4 603.5,113.2 601.9,104.1 600.5,103.6 600.2,106.7 598.1,106.0 598.3,108.7 594.1,102.9 590.3,100.3 588.9,101.9 587.2,104.7 590.5,105.7 591.9,108.2 592.4,115.4 587.2,115.5 586.3,119.8 588.1,120.5 587.4,121.4 588.8,123.0 587.6,127.1 590.8,126.1 589.0,128.6 591.3,127.5 590.2,128.5 591.3,127.9 591.2,129.0 591.7,127.3 591.7,129.1 592.3,127.0 592.1,129.4 593.2,126.8 592.0,130.6 592.1,129.4 590.1,129.6 591.1,131.1 589.8,132.3 588.2,130.3 584.9,130.3 586.9,131.0 589.3,134.9 589.9,137.5 587.1,140.5 589.2,150.6 590.4,150.8 591.8,154.8 595.4,154.9 590.5,157.0 591.6,157.7 590.5,159.3 592.7,158.9 590.3,161.0 596.5,158.5 599.2,159.2 602.1,168.9 607.1,170.4 611.3,173.8 609.2,174.2 606.3,179.0 604.1,178.9 602.0,174.6 599.7,172.6 602.1,175.7 599.1,172.7 601.6,178.2 605.2,182.3 606.7,181.5 606.1,182.4 617.8,187.4 619.6,186.7 620.6,189.6 619.4,191.3 616.4,191.4 605.5,184.1 603.0,184.8 595.4,178.2 590.4,177.1 589.6,178.2 587.5,176.8 577.5,179.3 575.9,181.0 569.8,181.3 567.3,184.9 568.0,190.3 560.6,188.4 556.8,178.7 558.7,164.1 554.4,153.6 558.8,146.6 557.7,137.6 557.9,146.0 553.4,152.5 557.3,167.5 554.8,169.3 549.5,181.6 548.2,181.7 543.2,175.9 541.0,175.8 540.4,177.1 537.9,176.1 545.7,179.1 544.7,184.8 546.2,185.1 545.3,185.6 547.8,189.5 546.4,190.7 536.8,190.7 537.6,190.1 533.0,188.3 533.3,182.2 531.8,183.2 532.8,185.4 531.2,183.2 522.3,181.7 518.3,175.8 511.1,173.3 510.8,174.4 516.3,176.6 518.6,179.4 521.7,187.6 516.4,197.6 515.9,196.1 509.0,195.8 508.7,193.7 500.3,194.6 495.0,188.9 493.8,190.3 494.8,188.8 491.7,189.3 490.6,188.2 491.8,190.1 490.5,188.2 487.9,189.1 487.5,187.4 487.3,189.1 486.9,187.8 486.6,189.0 486.3,187.9 478.5,190.3 466.5,203.0 457.1,199.3 452.3,194.2 446.3,193.7 446.3,191.8 444.9,191.6 440.5,185.1 439.5,143.5 445.1,129.8 452.8,116.9 465.8,101.0 472.9,82.5 468.2,77.6 461.3,82.6 458.8,82.7 452.5,77.8 449.8,77.8 455.5,64.4 465.3,33.4 466.8,24.7 468.2,22.0 515.6,38.9ZM495.5,199.8 516.5,211.5 518.3,216.0 517.3,217.9 515.0,219.5 508.8,220.1 495.2,217.0 493.6,213.2 491.2,212.4 490.4,208.8 491.7,202.7 493.0,200.8 496.1,200.7 495.5,199.8ZM620.4,108.6 623.1,110.2 622.1,111.7 622.6,115.0 624.6,115.6 623.2,116.5 625.9,119.0 629.0,119.3 627.5,120.1 628.0,121.6 629.5,123.2 631.4,122.7 629.9,124.6 632.1,124.1 630.0,124.7 631.5,125.0 630.6,126.9 632.8,126.4 630.2,127.2 629.3,128.9 631.0,128.2 629.5,129.2 631.0,128.6 629.1,130.2 628.9,131.4 632.7,130.1 633.4,131.0 632.7,130.2 630.5,131.7 629.8,131.0 629.7,132.2 628.9,131.4 629.7,133.2 632.3,131.6 633.0,132.4 633.0,131.2 633.0,132.6 629.7,133.2 632.6,132.7 630.5,134.2 633.1,133.8 631.0,134.4 632.3,135.0 631.2,135.3 631.9,137.7 629.8,142.5 625.9,141.2 626.1,138.1 623.9,137.4 623.8,135.7 623.0,136.2 623.7,135.1 621.9,132.0 620.8,132.3 621.3,130.4 618.4,126.7 619.4,123.3 621.0,122.5 619.4,122.0 620.8,120.8 619.4,121.1 621.3,119.8 619.4,119.8 621.1,119.5 619.5,119.4 620.5,118.3 617.5,119.4 620.5,118.3 616.7,119.3 618.9,117.8 616.2,118.3 620.1,117.1 617.1,117.9 619.6,116.9 617.0,117.3 619.3,115.8 617.6,116.3 619.3,115.7 617.5,115.9 619.0,114.8 616.7,111.9 618.1,112.3 617.0,110.4 618.3,111.1 617.6,109.8 618.3,111.0 620.4,108.6ZM648.7,115.0 646.8,117.9 647.8,120.5 646.5,125.4 648.7,128.9 647.2,129.2 644.0,125.5 644.9,122.1 642.2,118.5 643.8,118.0 642.2,116.0 643.3,115.0 643.2,106.5 646.7,107.5 651.9,114.1 648.7,115.0ZM483.4,194.2 485.8,196.6 483.1,199.2 481.1,198.9 481.3,196.4 483.4,194.2ZM605.2,134.5 599.2,134.7 599.4,133.2 603.0,133.0 605.2,134.5Z"};

const NBHD_PATH = "M546.4,88.8 550.0,90.9 536.6,110.2 518.0,110.6 518.6,91.8 535.2,92.0 540.1,86.3 546.4,88.8ZM679.8,290.8 678.9,288.0 671.5,289.5 666.9,285.5 678.0,284.1 675.8,278.7 679.2,277.6 674.5,264.6 670.7,259.6 668.3,258.6 666.9,260.5 661.2,260.7 657.8,263.3 657.8,266.5 656.6,261.5 661.1,258.5 660.7,255.6 676.1,252.3 682.9,264.8 684.9,263.2 681.7,268.6 689.8,278.3 692.6,286.4 691.9,290.7 685.9,292.0 679.8,290.8ZM139.6,561.4 145.3,587.0 139.4,590.1 130.0,592.5 131.1,586.7 125.8,583.3 128.2,578.8 124.0,576.6 122.6,570.3 120.8,572.5 118.9,571.3 116.2,573.3 117.7,574.6 115.8,577.2 104.3,564.7 110.7,558.9 111.0,556.5 113.0,556.4 113.6,558.4 120.0,556.1 121.2,553.1 123.1,552.9 123.3,554.6 139.6,561.4ZM152.3,439.1 150.6,438.5 150.2,434.8 155.3,436.3 152.3,439.1ZM277.7,512.5 272.3,518.9 273.1,520.0 266.7,525.5 253.0,517.3 248.6,509.0 245.9,508.4 247.2,506.1 251.2,504.4 261.4,506.4 272.8,501.9 276.3,507.8 275.1,509.4 277.7,512.5ZM621.3,502.2 619.3,506.4 619.5,509.6 619.9,508.1 620.5,510.1 620.4,508.2 621.0,510.2 621.0,507.9 621.7,509.5 621.7,505.8 622.7,505.9 623.1,510.5 625.9,509.8 626.5,519.2 622.2,521.3 607.4,523.5 606.4,516.1 601.2,516.6 601.3,514.8 602.7,514.6 598.1,512.3 598.0,510.8 600.3,508.9 602.8,510.8 603.2,513.0 604.9,513.4 603.8,510.9 605.0,510.5 603.6,510.6 601.4,506.9 604.2,503.9 615.3,503.0 623.4,497.4 625.5,497.5 621.3,502.2ZM479.3,246.9 476.8,249.9 480.2,262.2 472.0,263.3 469.8,262.4 464.2,268.6 454.9,263.8 451.7,268.4 443.6,263.9 449.2,255.7 433.1,245.3 436.7,244.0 437.7,241.3 433.9,239.6 433.6,235.7 436.9,231.4 441.1,231.5 443.5,234.0 445.5,233.0 451.0,236.4 452.2,235.3 460.4,242.9 479.3,246.9ZM362.5,499.2 352.3,511.3 347.7,505.9 340.9,501.1 330.0,497.8 335.0,491.8 333.1,490.5 339.8,482.8 362.5,499.2ZM337.2,329.2 333.7,342.8 336.7,349.8 330.2,340.7 331.6,338.1 332.2,330.5 333.6,331.5 334.0,329.6 332.2,330.1 333.6,321.6 337.9,322.1 338.9,321.0 337.2,329.2ZM336.0,450.5 327.8,474.1 318.8,467.5 301.9,462.6 302.7,456.2 308.0,442.9 305.7,441.7 308.1,442.6 312.6,439.0 322.0,440.4 336.0,450.5ZM645.2,225.1 638.6,230.4 617.2,237.7 613.7,219.4 614.4,216.0 616.4,213.7 617.1,214.9 620.3,212.6 630.1,211.1 627.8,210.4 631.1,211.3 632.3,206.9 629.2,205.6 636.3,202.9 640.5,206.3 645.2,215.4 640.6,218.0 638.0,215.3 645.2,225.1ZM186.7,557.8 183.9,561.8 192.4,568.3 182.3,577.6 180.7,576.0 175.4,578.9 174.0,577.1 171.3,577.5 169.0,568.8 173.5,565.4 172.4,564.3 174.1,563.2 166.8,555.6 168.6,553.3 174.1,557.1 178.7,552.0 186.7,557.8ZM568.6,98.1 571.1,104.1 546.4,88.8 540.1,86.3 553.2,77.4 563.9,83.1 568.6,98.1ZM676.8,271.5 679.2,277.6 675.8,278.7 678.0,284.1 666.9,285.5 671.5,289.5 678.9,288.0 679.8,290.8 655.2,296.3 654.1,290.3 649.0,280.7 645.0,285.2 638.9,284.5 626.3,254.2 623.0,251.8 617.8,243.9 617.2,237.7 638.6,230.4 645.2,225.1 648.3,229.1 650.1,228.5 648.3,229.2 649.7,233.1 658.3,245.5 662.5,255.2 660.7,255.6 661.1,258.5 656.6,261.5 656.9,265.2 658.5,266.2 657.8,263.3 658.9,262.0 666.9,260.5 668.3,258.6 670.7,259.6 674.5,264.6 676.8,271.5ZM652.3,481.5 652.3,483.9 656.5,484.1 658.4,485.7 656.7,488.4 658.7,485.6 659.0,486.7 667.0,486.2 663.7,496.3 648.9,507.9 648.6,505.0 644.5,503.1 647.3,487.9 643.2,484.7 641.7,485.3 642.2,486.7 640.7,484.2 641.7,481.4 650.2,480.5 652.3,481.5ZM650.2,479.5 641.0,477.8 647.6,470.4 649.2,471.0 650.2,479.5ZM429.2,349.6 474.4,380.4 471.4,383.3 471.1,386.2 414.9,382.5 407.5,380.7 402.9,352.8 429.2,349.6ZM548.1,529.6 553.7,541.4 537.1,548.5 531.2,536.8 540.8,530.7 548.1,529.6ZM712.4,283.0 720.9,302.9 721.4,308.6 711.5,310.4 697.3,315.7 694.8,308.3 677.0,303.3 675.6,301.7 683.8,291.4 691.9,290.7 691.9,284.8 696.6,280.0 701.1,271.1 705.6,267.7 707.7,269.6 712.4,283.0ZM505.8,110.8 501.0,127.8 485.0,118.7 492.9,104.4 505.8,110.8ZM388.9,488.7 369.3,491.3 362.5,499.2 339.8,482.8 355.5,464.6 388.9,488.7ZM459.4,455.0 478.4,465.0 477.6,466.2 480.4,469.3 485.8,469.6 486.6,480.1 492.8,482.6 489.0,485.1 492.6,483.5 494.4,484.6 489.8,491.9 481.5,493.8 480.2,491.6 481.1,486.8 471.4,475.7 469.8,476.1 471.0,478.4 465.5,472.0 459.5,472.4 457.8,453.4 460.8,451.0 480.6,462.1 479.4,464.0 460.6,453.4 459.4,455.0ZM141.3,469.4 134.7,470.9 131.7,473.6 119.8,497.0 121.6,498.1 118.8,499.3 113.5,498.5 108.5,500.5 106.6,498.7 105.1,502.2 103.4,501.2 97.8,489.6 98.2,482.0 100.8,477.2 99.3,467.0 100.3,456.0 106.4,448.9 141.3,469.4ZM380.1,369.1 382.5,373.0 379.9,377.6 365.6,372.1 367.3,369.2 364.0,366.5 365.1,363.7 380.1,369.1ZM368.6,435.0 381.9,444.5 388.9,488.7 338.8,452.5 359.6,428.7 368.6,435.0ZM528.6,552.7 524.9,553.1 524.0,554.6 523.3,553.8 518.5,555.7 519.0,556.7 518.2,555.8 516.3,557.6 515.3,556.9 487.8,567.5 478.1,568.0 472.6,569.7 430.1,589.1 429.7,590.7 430.9,571.3 436.1,567.3 440.9,566.4 448.2,560.7 459.0,558.7 466.3,555.4 466.2,554.1 466.3,555.4 469.0,555.0 469.0,556.5 471.3,556.7 472.7,558.7 479.4,558.5 486.0,555.1 486.8,552.3 490.7,550.0 495.1,551.0 501.2,549.8 501.0,551.0 501.7,549.5 509.4,549.7 526.8,539.6 527.9,541.5 523.5,543.0 523.4,544.2 526.1,549.0 525.7,551.0 527.2,550.0 528.6,552.7ZM598.3,326.4 600.9,334.4 604.5,338.3 586.4,343.9 582.0,334.6 575.1,326.3 580.9,325.2 598.3,326.4ZM397.0,525.6 398.7,526.8 402.7,526.2 406.6,528.3 412.8,527.9 415.0,541.3 396.2,542.8 393.6,544.3 391.0,543.8 391.2,544.9 388.9,544.1 388.6,545.4 388.3,544.4 385.8,545.7 383.4,545.0 383.0,546.0 379.2,545.3 376.5,527.5 383.1,528.4 397.0,525.6ZM561.5,510.2 566.1,512.8 566.7,514.5 564.8,514.2 564.6,515.3 566.8,515.4 566.9,516.9 563.7,517.8 565.6,518.4 560.9,517.8 557.4,514.5 557.5,513.1 555.6,514.1 552.4,512.2 558.6,507.9 561.5,510.2ZM591.0,495.5 595.5,499.3 595.0,503.7 593.3,505.0 589.0,499.0 589.9,495.4 591.0,495.5ZM573.6,490.1 575.2,492.3 571.8,493.3 572.3,490.1 573.6,490.1ZM615.3,490.4 616.2,492.5 614.2,491.1 615.3,493.2 611.8,495.9 602.6,495.3 601.4,491.9 602.7,488.9 606.0,486.6 609.5,486.4 615.3,490.4ZM566.9,493.2 562.6,493.6 564.6,488.2 566.8,486.4 569.6,489.3 569.4,492.0 566.9,493.2ZM616.2,467.5 621.1,467.8 626.9,471.2 627.7,476.3 632.4,480.6 628.8,484.0 622.4,486.8 618.9,490.6 619.2,489.3 616.0,488.5 614.6,486.4 607.0,484.0 608.9,481.8 609.2,478.5 611.5,476.8 614.0,469.2 616.2,467.5ZM610.7,460.5 613.5,462.4 609.0,465.5 616.1,463.9 610.4,467.1 608.1,473.9 605.8,471.8 606.4,478.0 604.6,481.5 601.6,481.7 602.0,478.1 598.3,469.9 599.2,465.8 607.9,461.2 606.8,460.3 610.7,460.5ZM591.4,457.6 590.9,460.6 592.1,459.0 593.7,464.6 592.7,470.1 595.0,477.1 594.2,477.5 589.6,468.1 590.0,466.1 586.7,462.1 590.5,462.4 587.4,460.9 586.1,455.6 588.9,454.8 591.4,457.6ZM578.4,442.8 581.3,456.9 587.6,464.7 585.3,465.5 584.1,467.7 588.1,469.5 588.5,471.6 586.2,472.9 585.5,475.5 587.2,480.4 590.2,480.0 588.4,480.8 589.0,482.4 587.5,482.5 588.5,486.4 589.6,485.3 589.3,489.3 588.3,492.8 586.0,494.3 584.6,503.1 581.1,510.1 566.9,510.4 563.9,509.0 567.0,505.5 572.5,505.7 575.1,503.0 576.8,505.0 577.9,502.1 580.8,502.2 577.0,501.0 578.9,498.2 579.0,493.3 583.2,486.2 581.6,483.5 582.0,486.6 580.6,489.3 575.6,480.7 573.5,481.8 573.2,480.6 569.3,479.4 564.9,480.3 565.7,461.4 568.6,452.3 565.7,443.6 567.2,442.9 572.4,447.6 575.2,447.8 577.1,447.1 577.4,441.4 578.4,442.8ZM519.4,112.8 521.6,120.4 520.3,122.9 521.4,123.3 517.2,131.3 513.6,134.6 509.1,133.0 510.1,130.7 502.7,124.4 506.0,105.5 501.9,98.4 502.8,96.4 511.5,90.6 518.1,78.3 520.1,79.0 519.0,82.0 518.0,110.6 521.5,109.8 519.4,112.8ZM520.7,110.7 536.6,110.2 525.1,121.3 521.1,118.6 519.4,112.8 520.7,110.7ZM356.1,354.3 353.3,353.2 354.0,351.9 356.7,352.9 357.2,351.9 354.6,350.8 355.3,349.5 358.3,350.3 358.8,348.7 357.0,347.7 359.5,344.9 366.2,348.8 366.8,359.5 364.3,365.7 349.6,360.3 350.3,359.0 353.1,360.2 353.5,359.0 350.8,357.9 351.6,356.5 354.3,357.7 355.4,355.5 354.1,354.5 356.1,354.3ZM476.9,387.3 482.5,414.9 470.7,425.2 448.6,401.4 448.9,397.9 452.7,398.1 467.1,391.0 471.1,386.2 476.9,387.3ZM168.2,489.6 168.4,493.8 166.8,493.5 166.8,494.6 169.5,498.9 169.0,507.8 175.0,508.2 176.4,505.9 185.2,507.8 179.0,519.0 169.9,519.7 170.2,517.4 158.0,509.1 152.4,507.6 151.6,509.3 149.6,509.3 148.7,512.6 141.5,510.6 142.6,499.2 135.9,497.7 129.1,502.6 119.8,497.0 132.2,472.9 134.7,470.9 141.3,469.4 150.5,474.6 168.2,489.6ZM474.0,359.0 479.3,362.5 474.4,370.0 476.7,372.5 475.3,371.9 474.1,374.2 477.8,376.8 478.0,379.4 476.2,378.2 474.4,380.4 429.2,349.6 448.4,341.2 453.9,335.6 466.2,344.5 464.8,346.3 467.8,348.4 466.4,350.0 475.9,356.6 474.0,359.0ZM700.8,345.5 701.9,375.5 692.0,372.0 689.5,377.6 671.0,371.8 677.9,360.4 673.1,347.6 681.9,344.6 700.8,345.5ZM493.6,427.6 492.5,427.4 495.5,432.1 494.7,430.7 496.3,430.4 496.4,433.5 508.4,443.9 510.3,447.4 502.1,455.1 501.5,457.2 503.3,459.1 502.0,460.2 500.2,458.3 497.1,459.1 491.0,466.1 486.7,467.9 479.4,464.0 480.6,462.1 460.8,451.0 457.8,453.4 455.8,451.5 452.7,451.6 452.4,448.1 457.0,445.1 456.3,436.9 478.6,419.0 481.5,415.0 482.5,414.9 484.0,421.0 487.4,419.3 493.6,427.6ZM365.6,372.1 368.4,373.4 361.5,385.7 359.2,384.3 356.0,392.3 350.3,380.9 353.5,372.4 360.7,374.7 362.4,370.6 365.6,372.1ZM537.9,175.9 535.5,164.1 553.7,161.2 552.8,156.7 554.4,156.5 557.3,167.5 554.8,169.3 549.5,181.6 548.2,181.7 543.2,175.9 541.0,175.8 540.4,177.1 537.9,175.9ZM215.3,470.7 220.7,473.5 231.0,486.2 215.6,486.6 209.8,485.1 181.8,490.3 168.2,489.6 168.5,486.7 189.1,483.1 187.4,467.6 188.3,462.1 201.1,459.8 204.6,463.7 215.3,470.7ZM418.4,202.3 388.8,252.2 378.5,246.9 378.2,245.4 407.4,197.3 418.4,202.3ZM79.1,570.5 78.8,573.3 74.3,577.9 75.3,580.8 70.2,598.0 70.8,605.2 67.2,611.6 47.4,611.1 48.8,607.1 48.1,602.1 45.4,598.2 43.9,598.2 45.0,596.4 43.6,592.0 40.5,588.8 42.8,584.9 46.4,581.5 47.9,582.9 50.2,581.8 55.2,577.5 55.2,574.7 59.1,574.4 62.4,569.8 64.8,568.7 75.3,569.3 76.3,571.2 76.9,569.4 77.9,571.0 77.7,569.1 79.1,570.5ZM362.9,270.6 370.0,274.1 362.0,287.6 367.6,290.4 365.1,296.4 342.5,284.2 339.3,283.8 343.4,283.2 342.6,281.1 339.7,281.3 339.9,280.0 342.7,280.4 340.1,278.5 343.0,278.8 340.2,277.5 343.2,277.3 343.3,276.3 340.5,275.9 342.6,274.0 341.0,273.3 343.1,273.4 341.1,272.3 343.3,272.9 343.9,271.0 341.7,270.0 343.9,270.8 342.0,269.4 344.1,270.3 347.6,263.1 362.9,270.6ZM113.3,537.3 106.0,534.2 96.7,532.7 93.8,533.8 96.1,523.6 95.4,518.5 98.8,516.0 97.5,515.7 98.8,515.9 104.5,507.0 103.4,501.2 105.1,502.2 106.6,498.7 108.5,500.5 113.5,498.5 118.8,499.3 121.6,498.1 129.1,502.6 126.3,505.0 128.6,506.9 119.9,516.0 118.9,520.5 117.8,519.8 113.9,524.0 112.0,522.5 111.0,523.6 113.3,537.3ZM354.7,322.6 357.5,324.4 359.1,321.0 368.4,324.6 367.2,329.6 357.2,330.6 354.1,328.1 354.7,324.8 350.2,323.4 352.3,320.5 354.7,322.6ZM627.5,107.0 626.8,108.3 623.9,108.1 624.6,106.5 627.6,105.8 627.5,107.0ZM629.8,131.0 629.7,133.2 632.3,131.6 633.0,132.4 633.0,131.2 633.0,132.6 629.7,133.2 632.6,132.7 630.3,133.3 631.5,133.7 630.5,134.4 633.1,133.8 631.0,134.4 632.3,135.0 631.2,135.3 631.9,137.7 629.8,142.5 625.9,141.2 626.1,138.1 624.0,137.4 623.8,135.7 623.0,136.2 623.7,135.1 621.9,132.0 620.8,132.3 621.3,130.4 618.4,126.7 619.4,123.3 621.0,122.5 619.4,122.0 620.8,120.8 619.4,121.1 621.3,119.8 619.4,119.8 621.1,119.5 619.5,119.4 620.5,118.3 617.5,119.4 620.5,118.3 616.7,119.3 618.9,117.8 616.3,118.7 620.1,117.1 617.0,117.6 619.6,116.9 616.8,116.6 619.3,115.8 617.5,116.2 619.3,115.7 617.5,115.9 619.0,114.8 618.1,112.3 616.7,112.1 618.1,112.3 616.7,111.6 618.5,111.3 616.9,111.1 618.3,111.1 617.6,109.8 618.3,111.0 618.8,109.3 619.5,110.2 620.4,108.6 622.0,108.8 623.2,110.3 622.2,110.5 622.6,115.0 624.6,115.6 623.2,116.5 625.9,119.0 629.0,119.3 627.5,120.1 628.9,123.0 631.4,122.7 629.9,124.6 632.1,124.1 630.0,124.7 631.5,125.0 630.6,126.9 632.8,126.4 630.1,127.2 629.3,128.9 631.0,128.2 629.5,129.2 631.0,128.6 629.3,128.9 628.9,131.4 632.7,130.1 633.4,131.0 629.8,131.0ZM357.2,330.6 357.5,331.8 350.4,332.9 347.9,331.5 343.8,332.7 350.2,323.4 354.7,324.8 354.1,328.1 357.2,330.6ZM477.9,130.0 485.7,131.4 477.0,148.8 461.2,142.4 465.6,135.4 467.3,129.1 477.9,130.0ZM537.9,176.1 545.7,179.1 544.7,184.8 546.2,185.1 545.3,185.6 547.8,188.8 547.3,190.2 537.6,191.0 534.4,189.5 532.8,187.7 534.0,185.3 533.3,182.2 531.8,183.2 532.8,185.4 531.2,183.2 522.3,181.7 518.3,175.8 511.1,173.3 510.8,174.4 513.7,175.5 508.5,173.8 502.6,167.0 506.0,169.7 535.5,164.1 537.9,176.1ZM267.0,472.6 264.8,471.1 255.8,478.8 251.9,475.1 244.2,481.9 243.4,478.9 246.6,467.5 259.6,463.2 260.7,461.4 262.5,461.1 264.7,467.5 269.4,472.5 267.0,472.6ZM407.4,379.2 407.5,380.7 395.9,377.8 391.7,353.3 402.9,352.8 407.4,379.2ZM582.3,67.7 580.8,78.5 578.5,84.5 578.7,91.4 582.5,94.8 582.9,102.3 583.9,103.1 573.7,107.9 566.1,92.5 563.9,83.1 565.5,78.5 569.4,73.9 582.3,67.7ZM364.3,365.7 367.3,369.2 365.6,372.1 362.4,370.6 360.7,374.7 353.5,372.4 356.4,365.3 355.6,362.8 364.3,365.7ZM567.3,212.9 569.0,215.5 574.6,216.1 577.0,218.0 575.5,228.7 572.8,234.4 563.2,242.9 558.2,251.0 557.9,247.9 552.3,250.3 548.2,249.1 546.4,243.8 545.0,243.6 546.4,242.3 544.7,240.5 543.0,240.7 544.7,240.5 546.0,238.1 546.0,231.3 545.1,229.0 542.8,229.8 544.9,228.8 541.7,229.5 545.2,228.4 542.5,228.5 545.3,228.2 543.5,226.6 545.6,224.8 538.0,225.3 537.8,223.5 534.4,222.6 534.6,221.1 532.6,219.8 534.4,217.5 536.0,218.1 537.1,216.6 541.1,215.8 538.6,215.1 539.0,212.6 541.3,211.3 539.9,209.4 541.3,205.5 545.9,207.9 546.7,204.6 549.4,203.7 552.8,205.6 553.2,203.7 554.5,204.5 553.7,202.5 555.3,204.8 556.8,201.4 560.0,200.1 557.0,201.5 559.4,202.8 561.1,207.2 560.8,214.6 562.8,213.7 566.3,215.3 568.2,214.3 567.3,212.9ZM352.5,361.6 355.6,362.8 356.4,365.3 350.3,380.9 345.8,374.8 339.1,380.8 335.2,377.6 338.4,374.9 339.3,376.0 336.8,377.8 338.2,379.8 342.4,375.5 341.0,373.8 339.2,374.2 344.1,370.7 347.2,371.0 347.5,370.1 344.7,369.2 345.3,367.9 348.3,368.9 348.8,367.9 346.1,367.0 346.6,365.7 349.8,366.8 350.3,365.8 347.4,364.9 347.9,363.6 353.4,365.0 348.6,362.5 349.1,361.4 352.5,361.6ZM251.7,492.1 261.8,492.9 270.4,497.1 272.8,501.9 261.4,506.4 251.2,504.4 247.2,506.1 245.9,508.4 236.4,506.7 238.4,504.1 237.1,500.5 237.6,491.4 240.5,487.9 251.7,492.1ZM461.9,141.6 456.2,149.2 446.7,169.6 440.2,168.1 439.4,154.8 444.9,153.4 451.0,144.4 457.2,139.4 461.9,141.6ZM472.4,146.9 468.3,154.0 455.1,164.0 449.2,170.3 446.7,169.6 456.2,149.2 461.4,142.2 472.4,146.9ZM379.2,545.3 375.3,545.7 375.7,548.5 375.2,545.7 366.3,547.4 353.3,547.2 352.0,548.5 349.8,530.1 357.0,530.4 357.4,531.7 369.3,534.4 376.5,527.5 379.2,545.3ZM546.1,291.7 526.4,298.4 522.4,287.7 520.1,275.2 529.9,274.0 541.9,269.9 543.7,273.8 539.1,275.6 544.6,287.9 547.5,288.9 546.1,291.7ZM587.3,123.9 587.6,127.1 590.8,126.1 589.0,128.6 591.3,127.5 590.2,128.5 591.3,127.9 591.2,129.0 591.7,127.3 591.7,129.1 592.4,127.0 592.1,129.4 593.2,126.8 592.0,130.6 592.1,129.4 590.1,129.6 591.1,131.2 589.8,132.3 588.2,130.3 584.9,130.3 586.9,131.0 589.3,134.9 589.9,137.5 587.4,139.6 587.7,143.0 578.4,145.5 577.0,143.4 575.1,146.1 576.1,144.2 574.9,128.8 582.1,124.0 587.3,123.9ZM496.0,139.1 485.2,145.5 479.8,143.8 485.7,131.4 496.0,139.1ZM401.1,387.2 399.8,378.8 414.9,382.5 471.1,386.2 467.1,391.0 452.7,398.1 448.9,397.9 449.1,401.9 440.0,405.5 423.7,404.4 403.0,406.0 403.7,403.6 401.1,387.2ZM635.8,314.5 639.4,311.7 636.4,304.0 645.8,301.7 638.9,284.5 645.0,285.2 649.0,280.7 655.5,294.4 655.2,296.3 652.1,297.3 660.3,307.3 666.4,308.6 660.8,310.6 646.7,310.7 636.8,316.0 635.8,314.5ZM521.8,363.4 524.4,377.5 526.8,376.8 530.3,388.0 516.7,383.5 513.0,379.9 511.3,379.8 488.9,386.5 471.1,386.2 471.4,383.3 476.2,378.2 482.8,381.1 485.5,379.8 488.3,372.9 489.6,375.5 493.7,372.7 496.3,376.6 512.2,367.3 521.8,363.4ZM371.6,342.4 374.3,341.6 374.0,347.8 364.8,347.6 360.4,345.0 362.4,343.1 365.5,343.9 367.0,342.5 371.6,342.4ZM479.3,246.9 460.3,242.9 452.2,235.3 451.0,236.4 445.5,233.0 459.6,221.9 465.4,214.0 468.8,211.6 480.9,214.6 486.5,219.7 482.9,224.0 479.9,224.1 478.4,228.0 479.7,225.4 483.0,225.2 488.4,221.8 486.3,223.5 488.0,224.8 487.2,225.7 488.2,224.8 487.3,225.9 488.8,224.5 490.1,225.4 490.5,223.7 491.9,224.9 490.2,225.5 491.9,227.0 490.8,228.9 492.5,230.4 490.8,232.2 492.2,233.8 491.7,236.1 493.9,231.6 493.8,237.9 496.0,247.9 492.5,248.7 479.3,246.9ZM258.4,535.3 254.3,539.2 255.0,540.1 254.2,539.3 252.3,540.6 244.3,533.6 242.0,537.0 236.3,534.1 234.1,537.1 217.9,527.0 225.4,519.3 226.8,515.8 258.4,535.3ZM676.1,231.3 677.8,237.9 681.7,238.0 685.4,242.3 701.9,270.4 696.6,280.0 691.9,284.8 689.8,278.3 681.7,268.6 684.9,263.2 682.9,264.8 676.1,252.3 662.5,255.2 655.3,241.8 660.7,247.7 665.1,249.4 669.2,253.3 664.9,247.2 665.8,245.4 664.3,241.2 667.1,238.6 664.3,231.8 665.6,231.6 667.5,226.3 670.3,223.9 673.2,230.0 676.1,231.3ZM371.4,348.3 372.9,352.3 379.3,352.7 379.4,355.3 376.9,356.1 376.7,361.8 380.1,369.1 365.1,363.7 366.8,359.5 366.2,348.8 364.8,347.6 371.4,348.3ZM338.8,452.5 355.5,464.6 333.1,490.5 335.0,491.8 330.4,496.4 327.9,495.4 328.3,493.5 326.2,492.0 327.4,490.3 323.4,487.0 336.0,450.5 338.8,452.5ZM476.8,249.9 479.3,246.9 494.9,248.2 510.7,240.0 516.1,239.9 522.6,242.4 525.6,245.1 533.7,255.8 535.0,254.0 534.1,253.3 535.0,254.0 536.2,252.7 535.1,254.0 536.1,254.9 535.0,254.0 534.3,255.0 536.3,256.2 533.8,255.8 538.1,257.5 538.8,261.0 483.0,267.7 476.8,249.9ZM470.7,425.2 456.3,436.9 457.0,445.1 452.4,448.1 452.7,451.6 422.5,453.9 416.6,447.3 414.3,418.1 431.2,416.9 430.8,404.9 442.3,405.4 449.1,401.9 470.7,425.2ZM438.5,168.1 437.8,183.3 444.6,196.2 444.6,202.8 443.1,206.1 435.9,211.4 434.4,214.0 435.6,214.7 434.3,214.3 430.9,220.3 426.1,224.1 410.7,216.2 424.8,192.9 426.9,193.9 429.2,190.1 427.2,189.1 438.3,170.8 438.5,168.1ZM510.5,142.8 504.5,150.2 502.9,154.8 498.6,156.0 496.5,153.9 485.1,155.1 488.1,151.2 487.3,146.0 486.0,146.8 485.2,145.5 496.0,139.1 497.5,139.8 499.1,136.1 505.8,140.7 511.5,142.3 510.5,142.8ZM530.3,388.0 531.5,393.7 535.0,393.1 537.5,405.0 534.0,405.6 535.0,410.7 528.0,413.5 527.9,416.4 532.3,419.3 535.9,425.2 534.0,431.1 535.6,435.7 528.3,437.4 523.5,441.3 524.9,443.2 521.0,439.9 519.3,435.1 516.1,432.8 507.1,419.2 519.5,442.9 521.9,444.2 514.9,447.0 508.5,442.8 503.9,435.6 502.3,434.4 499.6,435.2 497.2,432.3 497.0,429.4 493.6,427.6 487.4,419.3 484.0,421.0 476.9,387.3 493.6,385.6 511.3,379.8 513.0,379.9 516.7,383.5 530.3,388.0ZM366.4,297.1 390.6,309.3 388.1,321.7 364.0,313.3 366.4,304.7 363.7,304.2 366.4,297.1ZM568.8,57.5 579.3,61.4 579.1,59.0 615.5,70.5 615.0,71.4 601.5,66.9 587.6,66.0 575.8,69.9 569.4,73.9 565.5,78.5 563.9,83.1 553.2,77.4 568.4,68.9 568.8,57.5ZM568.8,57.5 568.4,68.9 553.2,77.4 543.8,72.8 550.7,61.6 549.4,57.3 559.8,54.6 568.8,57.5ZM648.4,505.5 648.9,507.9 652.8,508.8 654.0,515.1 636.4,517.3 622.5,521.1 626.5,519.2 625.9,509.8 623.1,510.5 621.7,505.4 628.9,498.3 628.4,494.7 634.1,488.1 639.2,487.4 640.7,488.6 640.2,490.9 638.4,488.2 640.2,491.1 640.1,495.6 635.6,501.6 633.2,501.1 630.9,503.5 631.6,505.6 633.3,507.0 639.7,499.5 641.5,505.0 648.4,505.5ZM301.9,355.4 299.3,353.0 304.1,348.6 306.9,351.0 304.8,352.9 302.4,350.7 304.1,353.5 301.9,355.4ZM522.5,284.1 522.4,287.7 526.4,298.4 522.0,298.3 518.3,300.3 517.5,305.5 514.0,308.7 499.5,316.5 497.8,313.9 495.9,297.5 496.9,297.8 493.8,290.4 492.2,278.7 520.1,275.2 522.5,284.1ZM174.6,594.8 175.7,597.8 174.6,596.6 175.3,597.9 172.6,597.7 163.8,604.8 154.6,598.6 145.3,587.0 139.6,561.4 143.0,580.6 155.5,577.9 156.1,579.7 162.6,576.6 167.2,587.2 174.6,594.8ZM206.8,485.7 209.2,498.9 206.7,499.3 206.9,503.6 205.4,504.6 203.4,504.7 203.2,499.4 196.4,505.0 188.8,503.9 180.8,497.2 174.8,497.0 167.8,492.6 168.2,489.6 181.8,490.3 206.8,485.7ZM673.9,483.4 676.7,483.9 680.0,491.1 686.3,498.0 686.4,505.7 683.9,507.9 683.2,506.7 681.7,507.2 684.1,508.2 686.4,506.2 687.0,510.7 675.6,510.8 666.8,516.0 654.0,515.1 652.8,508.8 650.2,507.8 663.7,496.3 667.0,486.2 673.9,483.4ZM557.7,173.0 562.6,173.1 562.7,170.9 564.9,168.5 565.9,169.6 574.2,164.6 578.6,172.4 572.1,175.1 574.8,180.7 570.8,180.8 568.4,182.5 567.2,185.1 568.0,190.3 561.2,188.8 559.8,187.2 557.0,180.2 557.7,173.0ZM485.1,45.2 485.9,55.1 483.6,61.6 477.7,62.1 471.9,69.3 472.6,67.0 471.0,61.8 472.1,46.6 476.1,44.0 485.1,45.2ZM337.2,329.2 343.8,332.7 347.9,331.5 355.8,337.9 353.2,339.6 353.9,341.7 352.8,342.6 350.5,341.4 350.9,342.7 350.1,341.7 348.9,342.7 350.2,344.2 347.9,343.4 349.3,345.4 346.9,343.9 347.7,346.3 346.1,344.6 342.9,347.0 343.6,348.3 344.8,347.6 344.1,349.0 342.5,347.2 340.5,347.8 341.0,349.7 340.5,348.6 339.5,349.9 338.1,349.2 338.1,350.3 334.2,346.1 333.7,342.8 337.2,329.2ZM414.3,418.1 416.6,447.3 423.7,455.3 397.9,458.6 390.0,425.1 402.9,418.7 403.1,419.9 414.3,418.1ZM375.7,287.0 373.4,290.9 371.3,289.9 370.2,291.7 362.0,287.6 365.6,281.9 375.7,287.0ZM452.7,451.6 455.8,451.5 457.8,453.4 459.9,477.4 450.5,484.7 436.5,469.9 424.6,477.8 421.2,455.6 423.7,455.3 422.5,453.9 452.7,451.6ZM721.4,308.6 720.9,302.9 712.4,283.0 722.6,276.5 717.3,272.3 724.7,264.4 732.6,270.1 734.7,290.2 725.0,307.6 721.4,308.6ZM501.6,493.7 503.3,495.7 502.5,497.7 508.2,520.4 510.8,525.1 507.0,532.4 504.5,533.9 487.0,537.5 485.0,532.8 485.7,528.0 483.5,522.2 481.7,521.7 482.6,520.9 479.8,521.4 481.4,520.4 480.4,520.3 475.9,522.1 473.1,520.4 473.1,521.9 466.2,522.8 470.2,518.7 470.9,514.4 468.1,504.0 463.2,498.7 469.9,498.1 467.7,499.1 470.0,499.7 482.8,496.6 489.2,497.3 501.6,493.7ZM617.2,237.4 617.8,243.9 623.0,251.8 626.3,254.2 632.7,268.8 614.7,273.1 614.9,282.3 611.5,288.3 618.5,310.8 596.6,319.7 594.4,310.0 588.7,306.2 589.3,298.6 580.3,297.6 580.6,296.1 576.0,296.6 575.5,300.9 565.1,303.6 562.3,298.1 560.2,284.6 563.9,277.6 563.9,274.6 559.8,267.0 549.5,271.2 545.6,270.4 544.9,268.8 553.3,265.8 550.3,259.0 543.0,261.5 538.8,261.0 538.8,258.4 544.3,259.4 545.6,258.3 544.8,257.0 542.0,258.1 544.9,256.8 546.3,258.5 553.9,251.7 558.2,251.0 563.2,242.9 571.5,236.3 573.6,232.8 617.2,237.4ZM565.1,303.6 569.3,310.0 573.5,312.7 575.7,319.9 575.1,326.3 569.0,327.9 570.2,326.2 563.8,320.6 557.6,307.1 551.8,299.8 548.5,291.1 546.1,291.7 547.5,288.9 544.6,287.9 539.1,275.6 543.7,273.8 538.8,261.0 543.0,261.5 550.3,259.0 553.3,265.8 544.9,268.8 545.6,270.4 549.5,271.2 559.8,267.0 563.9,274.6 563.9,277.6 560.2,284.6 562.3,298.1 565.1,303.6ZM502.8,96.4 501.7,99.6 506.0,105.5 505.8,110.8 492.9,104.4 485.0,118.7 483.7,118.2 481.2,122.9 477.9,118.9 473.2,116.5 478.1,105.6 487.4,90.9 493.5,88.8 494.7,86.1 500.4,91.6 502.8,96.4ZM548.5,291.1 551.8,299.8 557.6,307.1 563.8,320.6 570.2,326.2 559.8,333.4 551.0,337.0 546.0,337.1 538.6,339.7 538.8,342.5 541.8,346.6 538.0,346.1 533.5,340.6 532.3,332.0 536.5,332.7 535.5,317.3 540.0,309.0 542.1,309.1 542.5,306.7 536.4,294.8 548.5,291.1ZM545.3,352.7 543.8,349.7 539.4,348.8 541.2,353.7 521.1,358.1 522.9,363.2 512.2,367.3 496.3,376.6 493.7,372.7 489.6,375.5 488.3,372.9 485.5,379.8 482.8,381.1 478.0,379.4 477.8,376.8 474.1,374.2 475.3,371.9 476.7,372.5 474.4,370.0 475.3,367.8 480.8,360.2 484.7,359.0 485.2,362.3 489.5,361.7 486.7,358.5 491.0,357.2 491.6,358.6 498.7,355.5 496.9,353.8 496.9,350.5 503.2,348.9 504.4,350.8 512.2,346.4 528.4,344.8 533.9,345.5 533.4,348.0 535.4,348.2 538.0,346.1 541.8,346.6 538.8,342.5 538.6,339.7 546.0,337.1 551.0,337.0 562.3,332.0 564.8,334.7 559.8,340.0 561.2,343.8 551.0,351.0 545.3,352.7ZM391.7,353.3 395.9,377.8 383.3,374.3 376.7,361.8 376.9,356.1 379.4,355.3 379.3,352.7 391.7,353.3ZM327.8,474.1 323.4,487.0 327.4,490.3 326.2,492.0 328.3,493.5 327.9,495.4 331.1,496.6 330.0,497.8 316.6,494.9 309.0,488.0 303.7,479.3 301.9,462.6 318.8,467.5 327.8,474.1ZM277.7,512.5 275.1,509.4 276.3,507.8 272.8,501.9 281.8,498.6 278.2,492.6 282.7,489.9 286.5,493.2 287.0,501.4 288.5,502.5 277.7,512.5ZM638.9,284.5 645.8,301.7 636.4,304.0 639.4,311.7 635.8,314.5 631.9,305.5 618.5,310.8 611.5,288.3 614.9,282.3 614.7,273.1 632.7,268.8 638.9,284.5ZM113.3,537.3 111.0,523.6 112.0,522.5 113.9,524.0 117.8,519.8 118.9,520.5 119.9,516.0 128.6,506.9 126.3,505.0 135.9,497.7 142.6,499.2 141.5,510.6 147.6,512.9 142.2,518.6 140.5,518.6 141.2,521.5 139.5,521.3 138.9,524.0 140.8,524.4 139.8,552.9 149.7,548.5 154.2,548.3 156.7,546.6 160.1,547.6 161.8,545.6 162.7,546.4 163.1,545.3 168.6,544.4 155.7,559.0 147.2,562.6 137.5,561.0 123.3,554.6 123.1,552.9 121.2,553.1 120.0,556.1 113.6,558.4 113.0,556.4 111.0,556.5 110.7,558.9 104.3,564.7 101.5,561.7 93.6,565.8 86.4,567.2 86.9,557.7 91.2,547.0 93.8,533.8 96.7,532.7 106.0,534.2 113.3,537.3ZM437.0,499.5 438.8,498.1 448.5,508.4 446.4,509.7 458.5,522.8 450.0,524.0 446.3,521.4 446.7,520.4 446.0,521.1 446.2,519.4 450.7,515.3 445.1,519.6 442.9,517.9 443.5,511.6 439.5,510.0 437.0,499.5ZM718.2,259.4 724.8,264.5 717.3,272.3 722.6,276.5 712.4,283.0 707.7,269.6 705.6,267.7 710.4,261.0 718.2,259.4ZM538.0,346.1 535.4,348.2 533.4,348.0 533.9,345.5 528.4,344.8 512.2,346.4 504.4,350.8 503.2,348.9 496.9,350.5 496.9,353.8 498.7,355.5 491.6,358.6 491.0,357.2 486.7,358.5 489.5,361.7 485.2,362.3 484.7,359.0 480.8,360.2 488.4,348.8 485.5,340.7 491.0,339.1 492.5,336.9 499.1,340.4 513.1,339.3 532.5,329.6 533.0,339.2 538.0,346.1ZM325.5,376.0 325.8,373.9 322.1,374.0 321.0,371.4 329.7,360.5 339.7,361.4 337.8,362.2 339.7,363.6 338.0,368.0 333.1,370.0 335.5,370.6 332.5,372.3 333.0,370.0 328.6,372.4 330.1,372.7 326.0,373.8 325.5,376.0ZM379.9,377.6 363.8,402.5 360.8,400.2 356.0,392.3 359.2,384.3 361.5,385.7 369.0,372.5 379.9,377.6ZM381.9,293.9 376.8,302.3 365.1,296.4 367.6,290.4 370.2,291.7 371.3,289.9 373.4,290.9 374.0,289.9 381.9,293.9ZM169.6,464.2 172.2,464.1 169.7,486.4 168.5,486.7 168.2,489.6 150.5,474.6 141.3,469.4 143.7,460.5 169.6,464.2ZM227.6,533.0 220.6,541.2 209.2,533.9 217.9,527.0 227.6,533.0ZM395.6,487.9 399.5,512.3 397.0,525.6 383.1,528.4 376.5,527.5 369.9,533.1 365.1,530.8 367.0,525.6 359.7,529.4 354.3,527.8 354.2,526.2 357.1,524.4 355.2,523.1 362.2,519.4 357.3,521.5 361.2,519.3 360.6,518.4 354.2,522.8 357.3,519.9 355.3,518.6 358.3,515.3 354.6,515.6 356.7,512.0 353.3,513.5 352.2,511.5 369.3,491.3 395.6,487.9ZM166.8,555.6 174.1,563.2 172.4,564.3 173.5,565.4 169.0,568.8 171.3,577.5 174.0,577.1 175.4,578.9 180.7,576.0 182.3,577.6 179.1,580.6 182.6,583.7 180.9,584.7 182.3,585.8 180.9,584.7 181.3,586.4 179.9,584.3 178.8,585.7 180.3,587.0 178.9,586.0 179.8,587.5 177.9,586.9 179.4,588.1 176.8,587.3 178.3,588.7 177.0,587.9 177.5,589.9 175.7,588.8 176.9,590.1 175.5,588.9 177.0,590.5 175.6,589.6 176.1,591.3 174.5,590.0 174.6,594.8 167.2,587.2 162.6,576.6 156.1,579.7 155.5,577.9 143.0,580.6 139.6,561.4 147.2,562.6 155.7,559.0 160.9,552.7 164.9,557.5 166.8,555.6ZM210.8,581.2 207.0,581.5 202.9,585.2 199.6,586.2 185.5,606.4 181.2,609.8 178.7,608.8 176.9,600.7 184.8,600.3 193.3,590.4 190.2,584.6 185.9,583.1 182.6,583.7 179.1,580.6 193.4,567.2 203.3,574.8 207.1,580.3 209.5,579.6 210.8,581.2ZM369.3,412.0 377.7,418.1 379.5,429.6 368.6,435.0 352.0,421.6 360.8,411.4 367.1,414.5 369.3,412.0ZM402.5,299.9 400.2,299.9 402.4,299.6 404.7,294.7 409.2,290.8 413.9,290.7 422.4,293.8 421.7,297.6 422.8,295.0 424.3,294.6 424.3,296.1 425.1,294.8 428.5,296.8 433.1,304.8 444.3,308.3 448.9,319.5 450.1,319.8 437.4,323.8 435.5,318.7 429.9,320.4 429.7,318.9 425.7,320.2 424.4,318.4 421.1,320.7 414.4,321.9 411.2,319.5 414.2,316.1 408.4,311.8 406.9,314.9 402.7,311.7 407.9,312.5 403.3,310.6 404.1,306.2 402.5,299.9ZM365.5,301.7 358.8,311.3 351.0,306.9 358.7,293.1 366.4,297.1 365.5,301.7ZM245.9,471.9 243.4,478.9 244.2,481.9 240.5,487.9 235.3,485.7 230.3,485.8 223.6,477.2 228.4,472.3 230.9,473.6 235.7,471.4 240.4,472.6 241.4,471.3 245.9,471.9ZM648.7,115.0 646.8,117.9 647.8,120.5 646.5,125.4 648.7,128.9 647.3,129.2 644.0,125.5 644.9,122.1 642.2,118.5 643.8,118.0 642.2,116.0 643.3,115.0 643.2,106.5 646.7,107.5 651.9,114.1 648.7,115.0ZM366.4,264.9 362.9,270.6 347.6,263.1 348.3,261.2 345.8,259.9 346.4,258.9 349.8,259.4 351.7,256.3 348.9,254.9 351.9,256.1 352.7,254.7 350.1,252.9 352.9,254.4 353.4,253.5 350.7,251.5 355.1,253.3 355.7,252.3 352.2,251.3 352.1,249.8 356.1,251.7 356.8,250.2 352.7,248.1 357.1,249.8 358.0,248.3 353.8,246.1 358.3,247.8 359.2,246.4 355.0,244.2 358.4,245.4 359.0,244.4 356.2,242.2 359.3,243.8 359.9,241.3 361.1,241.2 358.3,239.6 361.7,239.9 358.9,238.1 377.0,247.4 366.4,264.9ZM452.6,129.9 454.3,136.9 453.0,142.8 444.9,153.4 439.4,154.8 439.4,144.3 445.1,129.8 445.7,128.8 452.6,129.9ZM287.6,532.8 286.2,537.0 285.2,532.7 286.7,531.8 287.6,532.8ZM668.2,334.4 640.7,342.3 638.6,341.8 637.4,338.1 633.4,339.3 630.0,330.3 649.4,323.7 659.4,318.0 668.2,334.4ZM683.8,291.4 666.4,308.6 660.3,307.3 652.1,297.3 679.8,290.8 683.8,291.4ZM654.1,310.0 652.6,312.4 659.4,318.0 641.5,327.0 636.8,316.0 643.2,311.8 654.1,310.0ZM530.4,413.5 532.3,413.5 530.9,415.6 528.0,413.5 535.0,410.7 534.0,405.6 537.5,405.0 535.0,393.1 531.5,393.7 530.6,389.5 558.4,400.7 565.9,401.6 571.9,415.0 574.5,428.6 571.4,427.0 568.3,421.9 568.0,420.3 571.2,416.8 567.8,420.1 567.2,419.3 571.3,415.1 569.8,411.2 571.1,414.9 567.7,418.7 566.3,414.7 567.5,416.7 566.7,414.2 568.8,413.6 565.7,413.8 568.7,428.3 562.9,428.4 558.4,408.5 559.3,407.6 557.5,407.9 562.5,432.9 545.3,435.0 541.6,430.1 545.5,424.0 541.6,425.2 537.2,424.1 530.3,416.4 532.2,415.5 532.5,413.3 530.8,413.3 531.2,411.9 530.4,413.5ZM118.9,436.3 125.6,440.1 137.7,440.5 137.9,451.2 144.1,451.0 143.7,460.5 141.3,469.4 106.8,448.9 108.1,445.3 118.9,436.3ZM163.1,604.6 156.8,610.8 149.1,613.0 139.3,619.3 136.7,618.9 129.7,625.1 125.5,612.6 118.7,602.5 125.6,599.7 129.7,595.0 130.1,592.5 139.4,590.1 145.3,587.0 154.6,598.6 163.1,604.6ZM502.6,167.0 508.5,173.8 516.3,176.6 518.6,179.4 521.7,187.6 516.4,197.6 515.9,196.0 509.0,195.8 508.0,193.6 499.9,194.4 494.8,189.7 493.9,183.2 487.8,184.3 487.2,179.7 483.9,178.1 497.6,163.8 501.2,163.4 502.6,167.0ZM453.1,113.2 450.0,104.2 446.3,108.0 443.2,108.4 439.5,106.8 436.3,108.2 433.4,106.8 440.3,95.0 442.0,87.2 447.8,79.7 453.0,81.0 452.7,84.6 454.4,86.6 456.3,85.8 454.9,83.0 457.4,84.2 457.9,86.4 459.1,84.4 458.7,85.4 461.5,84.4 465.5,85.6 468.1,89.0 465.4,96.6 463.1,100.2 461.2,100.0 461.8,101.8 456.6,108.4 454.0,106.4 453.6,107.8 455.6,109.3 453.1,113.2ZM520.1,275.2 488.5,279.1 483.0,267.7 538.8,261.0 541.9,269.9 529.9,274.0 520.1,275.2ZM638.6,341.8 641.0,350.3 636.7,352.7 635.2,350.4 627.7,354.0 637.6,367.7 646.3,374.7 657.2,370.6 658.1,375.3 656.3,381.9 649.9,400.2 642.3,399.6 621.3,401.3 623.1,391.1 606.5,389.0 586.4,343.9 621.5,331.7 630.0,330.3 633.4,339.3 637.4,338.1 638.6,341.8ZM521.7,529.6 520.6,530.0 518.7,527.5 517.9,522.1 519.6,518.2 524.0,514.5 527.9,516.0 530.4,520.5 527.9,526.7 521.7,529.6ZM519.1,503.7 518.0,503.8 518.7,498.2 519.1,503.7ZM538.4,507.8 531.4,507.5 527.8,502.5 529.6,498.9 538.6,499.3 541.2,500.7 543.7,503.9 538.4,507.8ZM564.3,491.2 562.6,493.6 562.3,491.0 564.6,488.2 564.3,491.2ZM519.8,492.2 517.9,495.0 515.5,486.1 518.0,487.4 519.8,492.2ZM538.0,477.6 537.9,482.2 541.7,482.2 539.9,480.7 541.3,479.2 545.0,479.1 544.5,486.6 538.1,492.9 535.7,492.3 535.7,489.5 533.2,487.8 533.0,485.0 536.5,482.1 533.8,476.4 538.0,477.6ZM553.5,475.2 553.7,476.9 552.3,476.2 551.6,479.5 556.1,482.3 559.5,481.1 556.3,493.6 548.3,496.7 542.4,491.7 547.5,488.1 547.0,483.1 549.5,475.2 553.5,475.2ZM565.7,461.4 564.5,480.3 560.1,478.5 563.7,475.1 562.7,472.3 564.0,472.0 563.5,463.4 565.7,461.4ZM518.3,476.4 508.9,478.7 513.2,466.3 523.3,459.8 525.7,463.1 524.1,474.1 518.3,476.4ZM548.0,457.9 544.9,462.3 548.1,461.7 552.8,466.9 536.2,471.7 530.6,475.2 527.4,475.0 526.9,472.9 530.1,473.2 530.7,465.4 527.6,466.6 527.8,462.7 531.5,463.9 533.8,459.6 536.4,457.9 539.6,460.2 539.1,458.3 543.8,459.6 546.6,457.1 548.0,457.9ZM562.1,454.8 555.9,464.8 551.7,456.8 554.3,454.2 560.3,452.2 562.1,454.8ZM548.2,453.5 546.5,456.3 533.8,455.8 536.9,448.8 548.9,443.2 552.9,446.6 550.9,451.7 548.2,453.5ZM636.8,316.0 641.5,327.0 616.8,333.7 616.0,328.7 619.2,320.8 598.3,326.3 596.6,319.7 631.9,305.5 636.8,316.0ZM616.8,333.7 604.5,338.3 600.9,334.4 598.3,326.3 619.2,320.8 616.0,328.7 616.8,333.7ZM666.6,430.7 674.6,439.2 672.9,448.6 652.3,457.4 645.2,471.6 643.9,471.1 645.0,467.3 643.8,466.3 639.4,472.9 643.8,466.3 639.2,461.1 636.3,460.0 633.1,461.8 626.9,471.2 621.1,467.8 628.9,459.4 630.0,456.1 621.3,450.0 610.4,454.9 619.6,450.0 618.5,448.2 584.8,431.6 580.5,426.5 578.3,417.9 580.5,410.8 584.3,409.2 593.8,410.0 584.3,407.6 578.2,410.8 576.4,417.8 579.0,429.0 574.9,426.0 574.5,428.6 571.9,415.0 566.7,403.0 589.1,406.7 606.9,402.7 632.4,407.1 641.1,411.4 663.4,426.2 666.6,430.7ZM396.7,453.0 384.3,460.2 381.9,444.5 368.6,435.0 381.0,428.9 381.2,430.0 390.9,428.8 396.7,453.0ZM579.1,332.0 583.2,336.5 584.6,341.4 580.1,342.1 576.2,338.7 577.0,343.8 575.4,343.3 563.3,346.9 559.2,345.0 561.2,343.8 559.8,340.0 564.8,334.7 562.4,332.2 569.0,327.9 575.1,326.3 579.1,332.0ZM569.3,310.0 565.1,303.6 575.5,300.9 576.0,296.6 580.6,296.1 580.3,297.6 589.3,298.6 588.7,306.2 594.4,310.0 598.3,326.4 580.9,325.2 575.1,326.3 575.7,319.9 573.5,312.7 569.3,310.0ZM481.7,66.0 497.8,69.4 500.8,76.4 496.8,80.7 493.5,88.8 487.4,90.9 480.0,102.3 464.7,103.5 463.3,102.7 465.2,101.9 468.1,96.5 472.7,81.2 469.3,77.9 466.8,77.6 461.3,82.6 457.0,82.0 465.4,77.2 468.3,70.9 474.1,67.4 477.7,62.1 483.6,61.6 481.7,66.0ZM390.5,284.5 389.5,295.5 387.0,295.1 388.9,296.6 374.0,289.9 380.4,279.4 390.5,284.5ZM532.5,254.6 522.6,242.4 516.1,239.9 510.7,240.0 496.0,247.9 494.7,238.1 501.7,237.2 500.5,235.9 500.4,228.4 508.3,227.4 507.0,223.9 512.8,226.0 517.8,219.1 519.6,220.1 522.0,217.1 519.5,220.5 520.0,222.7 521.2,222.7 516.1,227.0 538.3,240.1 536.5,243.0 534.3,243.0 536.8,245.2 532.8,247.9 528.5,248.4 532.5,254.6ZM204.1,531.9 201.4,533.3 200.8,532.4 197.8,535.9 197.5,539.0 195.1,539.0 195.5,537.4 193.8,538.1 193.3,532.9 195.0,531.7 194.6,528.8 191.1,526.6 188.0,529.5 185.3,529.9 185.9,532.6 183.3,532.9 183.0,535.0 173.0,537.8 173.2,538.9 167.2,539.2 168.6,544.4 163.1,545.3 162.7,546.4 161.8,545.6 160.1,547.6 156.7,546.6 154.2,548.3 149.7,548.5 139.8,552.9 139.5,546.5 161.5,531.7 169.3,523.5 169.9,519.7 179.0,519.0 185.2,507.8 188.4,504.7 196.4,505.0 203.2,499.4 203.4,504.7 205.4,504.6 206.9,503.6 206.7,499.3 209.2,498.9 213.7,506.7 207.8,508.6 202.4,520.2 198.7,524.8 204.1,531.9ZM671.0,371.8 689.5,377.6 692.0,372.0 700.2,375.0 682.5,401.1 676.3,401.1 670.9,397.6 664.2,386.3 671.0,371.8ZM300.8,365.3 298.4,367.5 294.2,365.3 296.2,363.5 300.8,365.3ZM195.1,539.0 186.0,542.5 174.9,544.4 174.8,547.5 176.7,548.5 175.7,550.3 178.7,552.0 174.1,557.1 168.6,553.3 164.9,557.5 160.9,552.7 168.1,545.7 168.7,541.4 167.2,539.2 173.2,538.9 173.0,537.8 183.0,535.0 183.3,532.9 185.9,532.6 185.3,529.9 188.0,529.5 191.1,526.6 194.6,528.8 195.0,531.7 193.3,532.9 193.8,538.1 195.5,537.4 195.1,539.0ZM361.8,320.3 361.2,321.9 359.1,321.0 357.5,324.4 354.7,322.6 357.6,318.3 361.8,320.3ZM670.3,223.9 718.2,259.4 710.4,261.0 702.2,270.8 685.4,242.3 681.7,238.0 677.8,237.9 676.1,231.3 673.2,230.0 670.3,223.9ZM448.0,277.6 437.8,279.9 438.9,281.3 437.0,292.4 455.4,297.0 449.4,300.6 444.9,307.4 433.1,303.6 428.6,295.5 423.1,292.9 428.8,290.3 432.5,284.7 430.6,284.2 427.2,290.5 421.6,292.3 413.2,289.4 404.4,292.1 402.0,291.0 403.8,285.1 405.6,283.8 404.5,282.8 406.9,282.2 405.8,281.2 407.2,281.5 406.2,280.7 409.4,275.7 414.0,277.4 409.9,275.4 410.1,274.4 411.6,274.5 429.0,248.2 433.1,245.3 449.2,255.7 443.6,263.9 451.7,268.4 454.9,263.8 463.0,268.3 467.9,269.4 469.2,272.3 469.0,274.3 461.8,273.7 455.6,275.2 455.0,278.6 448.0,277.6ZM485.1,155.1 496.5,153.9 498.6,156.0 501.8,154.7 501.2,163.4 495.6,165.5 483.9,178.1 477.9,181.2 475.7,179.1 459.0,173.4 466.5,164.2 469.4,163.0 471.6,157.2 474.9,153.7 481.6,155.7 485.1,155.1ZM386.5,326.9 382.5,333.9 369.4,336.1 368.9,334.8 364.9,335.5 364.0,330.0 367.2,329.6 368.4,324.6 361.2,321.9 364.0,313.3 388.1,321.7 386.5,326.9ZM413.7,528.6 427.2,531.1 440.1,530.7 442.0,538.4 437.1,539.9 425.1,539.0 415.0,541.3 413.7,528.6ZM470.0,88.0 467.5,85.0 461.3,82.6 466.8,77.6 469.3,77.9 472.7,81.2 471.5,87.0 470.0,88.0ZM457.1,502.8 463.1,508.2 464.9,514.3 462.0,515.0 453.7,506.2 453.7,503.8 457.1,502.8ZM450.5,484.7 456.4,491.0 455.2,491.9 454.0,490.5 450.4,493.4 448.1,490.9 437.0,499.5 426.2,488.0 424.6,477.8 436.5,469.9 450.5,484.7ZM454.0,490.5 455.2,491.9 456.4,491.0 468.1,504.0 470.9,515.8 469.2,520.3 466.2,522.8 466.1,510.8 462.2,504.0 454.2,499.3 449.8,502.4 443.9,498.0 444.3,496.1 442.1,496.2 440.6,498.0 462.9,517.5 463.2,519.1 458.4,522.6 446.4,509.7 448.5,508.4 438.8,498.1 448.1,490.9 450.4,493.4 454.0,490.5ZM150.9,442.2 151.6,443.7 152.2,441.4 151.7,443.8 152.9,444.6 153.3,443.1 155.6,444.4 155.8,442.4 156.9,445.1 157.6,443.6 158.5,444.8 158.7,442.5 158.8,445.3 161.1,445.7 161.8,443.9 163.2,444.8 162.9,442.2 165.4,445.2 166.1,443.3 166.5,445.2 166.2,443.0 172.4,443.0 173.4,441.8 170.0,453.2 169.6,464.2 143.7,460.5 144.1,451.0 137.9,451.2 137.8,438.7 143.7,439.1 144.1,437.6 144.9,439.5 145.7,437.9 145.4,440.3 146.4,439.2 146.2,440.8 147.1,439.7 147.6,441.5 148.5,439.7 149.9,440.4 149.1,443.2 150.9,442.2ZM493.8,290.4 496.9,297.8 495.9,297.5 497.8,313.9 499.5,316.5 479.9,327.7 480.6,330.7 451.0,328.6 451.5,326.2 455.3,325.6 453.2,325.1 449.5,316.0 450.4,314.1 455.5,314.0 449.8,312.7 444.9,307.4 452.5,297.7 459.3,302.6 458.6,306.6 466.0,308.0 471.8,286.3 493.8,290.4ZM469.4,163.0 466.5,164.2 459.0,173.4 449.2,170.3 460.7,159.9 469.4,163.0ZM525.7,333.6 513.1,339.3 499.1,340.4 480.6,330.7 479.9,327.7 510.5,310.8 517.5,305.5 520.2,312.8 532.4,328.1 532.5,329.6 525.7,333.6ZM252.3,540.6 245.8,547.4 244.6,549.4 245.5,550.1 244.1,549.2 241.6,552.4 239.3,552.9 220.8,540.9 227.6,533.0 234.1,537.1 236.3,534.1 242.0,537.0 244.3,533.6 252.3,540.6ZM402.5,267.0 395.3,277.0 380.9,269.7 376.3,277.3 380.4,279.4 375.7,287.0 365.6,281.9 370.0,274.1 362.9,270.6 366.4,264.9 373.6,268.5 381.2,256.0 374.0,252.4 377.4,245.9 406.9,261.4 402.5,267.0ZM421.2,455.6 425.5,483.9 388.9,488.8 384.3,460.2 396.7,453.0 397.9,458.6 421.2,455.6ZM471.4,479.0 478.5,486.3 479.3,493.4 474.7,494.7 473.8,492.5 470.4,492.0 471.2,494.0 470.1,492.2 468.9,493.0 470.8,496.0 464.0,496.1 460.1,491.8 460.3,487.8 459.7,488.8 463.0,484.4 463.2,479.4 460.5,481.5 461.2,482.5 460.3,481.7 461.4,484.2 458.4,486.6 458.5,489.8 457.3,489.6 458.4,490.5 456.8,489.9 458.2,491.2 456.6,490.4 464.3,498.6 450.5,484.7 459.9,477.4 459.5,472.4 465.5,472.0 471.4,479.0ZM405.8,196.1 391.4,188.8 404.0,169.4 412.6,181.1 407.6,189.4 407.6,193.1 405.8,196.1ZM472.0,115.9 463.3,129.2 452.6,129.9 445.7,128.8 457.2,110.5 459.1,111.4 459.9,114.7 465.8,116.0 467.1,114.4 472.0,115.9ZM538.1,132.4 535.3,131.4 531.4,124.3 525.1,121.3 535.7,111.0 549.0,110.3 561.8,112.3 556.0,120.0 553.6,127.2 551.5,127.2 551.1,124.6 545.9,129.8 538.1,132.4ZM485.2,145.5 486.0,146.8 487.3,146.0 488.1,151.2 485.1,155.1 481.6,155.7 474.9,153.7 471.6,157.2 469.4,163.0 460.7,159.9 468.3,154.0 472.4,146.9 477.0,148.8 479.8,143.8 485.2,145.5ZM446.7,169.6 475.7,179.1 477.9,181.2 480.2,180.4 473.4,186.5 460.7,192.9 447.3,186.1 440.0,179.7 440.2,168.1 446.7,169.6ZM467.0,129.7 465.6,135.4 461.9,141.6 457.2,139.4 453.0,142.8 454.3,136.9 452.6,129.9 467.0,129.7ZM473.2,116.4 477.9,118.9 481.2,122.9 477.9,130.0 463.3,129.2 472.0,115.9 473.2,116.4ZM395.3,277.0 390.5,284.5 376.3,277.3 380.9,269.7 395.3,277.0ZM395.9,344.0 403.2,350.1 402.9,352.8 379.3,352.7 379.2,347.6 381.5,340.8 383.6,345.4 385.1,342.8 383.9,345.7 384.9,346.7 385.9,345.5 385.1,347.0 386.9,347.6 385.4,350.7 387.5,348.0 389.6,349.7 388.6,347.5 391.7,350.0 389.1,345.8 393.3,349.2 389.1,344.9 394.0,347.3 386.8,340.8 389.4,340.6 387.3,337.8 391.3,341.1 389.7,336.2 392.3,339.5 392.4,342.5 395.7,344.9 395.9,344.0ZM537.1,548.5 528.6,552.7 527.2,550.0 525.7,551.0 526.1,549.0 523.5,543.0 527.4,542.0 526.8,539.6 531.2,536.8 537.1,548.5ZM244.1,444.6 237.6,448.0 233.1,433.1 241.7,430.6 245.1,435.4 244.1,444.6ZM209.2,533.9 222.0,541.7 207.3,557.1 196.4,549.4 201.0,544.7 200.4,540.2 197.5,539.0 198.5,534.7 200.8,532.4 201.4,533.3 204.1,531.9 205.7,536.3 209.2,533.9ZM239.3,552.9 235.5,558.9 233.8,558.2 232.3,559.9 230.7,564.5 227.6,564.4 215.2,556.5 212.5,560.8 207.3,557.1 222.0,541.7 239.3,552.9ZM169.9,519.7 169.3,523.5 161.5,531.7 139.5,546.5 140.8,524.4 138.9,524.0 139.5,521.3 141.2,521.5 140.5,518.6 142.2,518.6 147.4,512.3 148.7,512.6 149.6,509.3 151.6,509.3 152.4,507.6 158.0,509.1 170.2,517.4 169.9,519.7ZM364.0,313.3 358.8,311.3 363.7,304.2 366.4,304.7 364.0,313.3ZM364.0,313.3 361.8,320.3 357.6,318.3 360.5,312.0 364.0,313.3ZM483.4,194.2 485.8,196.6 483.1,199.2 481.1,198.9 481.3,196.4 483.4,194.2ZM485.6,28.2 485.1,45.2 473.6,43.1 463.3,39.4 468.2,22.0 485.6,28.2ZM520.2,75.7 511.5,90.6 502.8,96.4 500.4,91.6 494.7,86.1 496.8,80.7 500.8,76.4 497.8,69.4 505.0,71.9 509.4,65.1 509.0,72.8 513.4,73.7 513.3,76.1 520.2,75.7ZM207.3,557.1 212.5,560.8 215.2,556.5 228.1,564.5 226.2,569.8 224.1,569.3 221.9,573.7 218.7,571.9 211.5,581.6 209.5,579.6 207.1,580.3 203.3,574.8 183.9,561.8 188.0,555.9 196.4,549.4 207.3,557.1ZM529.9,67.4 523.1,82.0 522.9,91.8 518.6,91.8 519.2,78.7 524.1,65.2 529.9,67.4ZM560.4,363.1 568.9,383.3 567.4,387.6 562.5,386.9 561.2,388.5 565.9,401.6 558.4,400.7 530.6,389.5 526.8,376.8 524.4,377.5 524.0,375.6 560.4,363.1ZM267.0,472.6 270.2,473.2 258.2,481.5 251.7,492.1 240.5,487.9 244.2,481.9 251.9,475.1 255.8,478.8 264.8,471.1 267.0,472.6ZM383.3,374.3 391.3,387.7 390.8,390.0 392.1,391.7 384.0,403.8 368.9,395.1 382.5,373.0 383.3,374.3ZM542.6,145.8 530.9,146.7 510.1,154.1 502.9,154.8 504.5,150.2 510.5,142.8 525.5,135.1 538.1,132.4 540.4,133.1 542.6,145.8ZM569.9,109.3 574.6,116.8 573.4,121.6 575.2,128.4 569.5,131.1 561.3,131.8 558.4,133.7 553.6,127.2 556.0,120.0 561.8,112.3 569.9,109.3ZM592.1,66.0 601.5,66.9 616.9,71.0 613.6,75.0 614.3,76.5 611.2,83.5 608.2,85.0 606.9,88.9 604.8,90.5 603.7,87.5 602.5,89.5 604.2,92.6 600.5,92.7 597.3,89.5 599.5,93.2 601.8,94.0 602.1,96.4 604.2,95.8 605.1,98.0 610.8,87.9 614.6,86.4 616.7,80.6 615.1,79.7 615.8,78.2 621.2,74.2 621.3,77.6 627.8,78.5 624.2,87.1 625.4,87.7 626.9,85.8 626.7,88.6 628.8,85.6 629.3,90.3 626.2,93.8 625.8,91.9 623.3,91.5 618.9,94.1 617.3,100.2 618.8,103.2 618.3,105.3 616.2,105.7 614.9,108.2 615.2,111.8 612.0,112.2 609.6,114.3 610.8,118.8 607.6,124.6 602.7,116.7 602.2,114.5 603.5,113.2 601.9,104.1 600.5,103.6 600.2,106.7 598.1,106.0 598.3,108.7 594.4,103.1 590.3,100.3 587.2,104.7 590.5,105.7 591.9,108.2 592.4,115.4 586.7,116.1 586.3,119.8 588.1,120.5 588.2,125.3 587.3,123.9 582.1,124.0 575.2,128.4 573.4,121.6 574.6,116.8 569.9,109.3 583.9,103.1 582.9,102.3 582.5,94.8 578.7,91.4 578.5,84.5 580.8,78.5 582.3,67.7 592.1,66.0ZM571.1,104.1 573.7,107.9 561.8,112.3 549.0,110.3 535.7,111.0 550.0,90.9 571.1,104.1ZM605.2,134.5 599.2,134.7 599.4,133.2 603.0,133.0 605.2,134.5ZM645.0,88.9 646.1,90.6 642.4,89.4 643.2,88.3 645.0,88.9ZM70.8,605.2 74.0,610.8 78.3,611.7 71.4,615.5 69.6,623.1 83.7,619.3 88.1,636.5 71.9,641.2 67.2,625.2 61.3,622.6 51.4,622.0 50.9,623.8 47.0,622.0 47.1,617.8 45.6,616.4 47.4,611.1 66.1,612.3 70.8,605.2ZM444.0,527.4 448.2,524.8 454.7,525.6 462.6,523.1 465.4,524.2 465.6,527.5 459.4,527.8 461.8,529.0 465.5,527.9 467.0,529.3 462.3,530.3 451.8,527.4 444.0,527.4ZM137.8,438.7 137.7,440.5 136.0,440.8 131.9,439.5 125.6,440.1 118.9,436.3 120.5,435.0 122.0,437.9 122.0,434.3 126.6,434.8 126.8,433.3 127.8,434.2 127.2,438.4 127.7,436.8 128.9,438.1 130.2,436.6 131.3,437.8 130.9,436.2 132.2,436.3 132.1,434.1 133.8,433.5 135.9,436.8 137.6,437.0 137.3,439.7 135.5,440.5 137.3,439.8 138.0,437.4 137.8,438.7ZM483.9,178.1 487.2,179.7 487.8,184.3 493.9,183.2 495.1,188.5 494.0,190.4 494.8,188.8 491.7,189.3 490.6,188.2 491.8,190.1 490.5,188.2 487.9,189.1 487.5,187.4 487.3,189.1 486.9,187.8 486.6,189.0 486.3,187.9 478.5,190.3 466.5,203.0 457.2,199.3 452.3,194.2 446.3,193.7 446.8,192.5 444.9,191.6 439.7,182.4 440.0,179.7 447.3,186.1 460.7,192.9 473.4,186.5 483.9,178.1ZM188.8,439.7 188.0,440.8 191.7,445.3 188.3,462.1 185.8,462.0 180.8,465.2 169.6,464.2 170.0,453.2 173.4,441.8 184.5,438.4 188.8,439.7ZM118.7,602.5 125.5,612.6 129.3,624.5 125.3,622.8 120.5,624.9 107.4,639.2 101.7,637.0 102.1,634.5 91.7,636.3 88.5,638.6 83.7,619.3 69.6,623.1 71.4,615.5 74.5,613.4 109.7,600.9 111.8,605.8 118.7,602.5ZM395.9,377.8 399.8,378.8 402.0,393.2 394.1,391.1 393.6,387.9 391.3,387.7 383.3,374.3 395.9,377.8ZM402.0,393.2 403.7,403.6 401.4,407.6 402.9,418.7 389.6,425.0 387.0,413.4 379.8,409.1 392.1,392.1 390.7,389.4 391.7,387.4 393.6,387.9 394.1,391.1 402.0,393.2ZM430.8,404.9 431.2,416.9 403.1,419.9 401.4,407.6 402.5,406.0 430.8,404.9ZM696.3,316.3 700.7,334.6 700.8,345.5 681.9,344.6 673.1,347.6 666.2,328.9 658.6,316.9 652.6,312.4 654.1,310.0 660.8,310.6 666.4,308.6 675.4,300.5 677.0,303.3 694.8,308.3 697.3,315.7 696.3,316.3ZM233.1,433.1 237.6,448.0 236.3,449.0 233.2,447.9 231.5,450.4 209.6,449.3 195.1,450.6 198.8,458.0 201.1,459.8 188.3,462.1 191.7,445.3 188.0,440.8 188.8,439.7 190.6,439.2 190.9,440.8 191.4,439.5 193.8,442.3 194.6,439.3 195.5,439.1 195.1,441.0 197.4,441.1 199.4,440.4 199.2,439.1 202.7,439.5 202.7,437.9 203.8,439.1 203.4,437.7 204.4,439.0 204.1,437.4 204.7,439.0 205.1,438.0 206.1,438.9 206.2,436.7 206.9,438.1 206.9,436.5 208.6,437.5 210.3,435.0 215.7,433.0 233.1,433.1ZM454.3,196.5 463.0,204.4 463.9,207.2 462.2,210.0 457.8,213.5 450.3,224.7 445.7,226.9 437.0,223.7 435.6,221.8 436.1,219.6 440.3,213.5 443.7,211.0 448.3,211.9 447.7,210.2 448.9,210.3 446.0,211.6 447.0,210.1 445.5,209.5 447.2,204.7 446.8,197.2 449.3,194.8 452.7,195.0 454.3,196.5ZM350.3,380.9 356.4,393.1 354.3,397.6 351.9,397.8 350.6,399.8 347.2,398.7 345.9,401.7 348.6,394.6 347.8,394.2 345.1,400.1 345.7,397.8 342.2,397.9 340.0,403.1 333.3,403.5 330.2,393.2 332.5,394.1 333.8,403.4 339.1,402.1 341.6,397.1 339.9,394.8 336.6,396.1 339.8,394.7 336.6,393.6 335.4,394.5 336.6,392.4 334.8,394.1 338.2,390.6 335.5,392.4 334.0,391.2 335.7,388.5 330.9,392.2 332.8,390.2 332.1,387.7 330.8,387.9 332.0,385.7 329.4,384.8 331.3,383.6 329.8,382.9 331.5,382.6 330.2,381.0 335.2,377.6 339.1,380.8 345.1,374.7 347.5,376.0 350.3,380.9ZM532.4,328.1 520.2,312.8 517.5,305.5 517.6,301.6 522.0,298.3 526.4,298.4 536.4,294.8 542.5,306.7 542.1,309.1 540.0,309.0 535.5,317.3 536.5,332.7 532.3,332.0 532.4,328.1ZM584.6,341.4 600.6,376.0 575.3,384.7 568.6,383.2 560.4,363.1 551.0,366.4 545.3,352.7 551.0,351.0 559.2,345.0 563.3,346.9 575.4,343.3 577.0,343.8 576.2,338.7 580.1,342.1 584.6,341.4ZM197.5,539.0 200.4,540.2 201.0,544.7 186.7,557.8 175.7,550.3 176.7,548.5 174.8,547.5 174.9,544.4 197.5,539.0ZM480.6,330.7 492.5,336.9 491.0,339.1 485.5,340.7 488.4,348.8 479.3,362.5 474.0,359.0 475.9,356.6 466.4,350.0 467.8,348.4 464.8,346.3 466.2,344.5 453.9,335.6 455.1,334.1 451.0,328.6 480.6,330.7ZM496.1,200.7 495.3,199.7 516.5,211.5 518.3,216.1 517.3,217.9 515.0,219.5 508.8,220.1 495.2,217.0 493.3,212.9 491.2,212.4 490.4,208.8 492.9,200.9 496.1,200.7ZM478.9,43.8 474.1,45.0 471.3,49.2 471.9,69.3 468.3,70.9 454.7,66.6 462.9,39.4 478.9,43.8ZM601.3,514.8 601.2,516.6 606.4,516.1 607.4,523.5 612.0,523.0 587.2,528.6 583.5,521.4 585.7,518.5 591.0,516.0 590.8,514.8 591.2,515.8 593.2,515.0 593.4,513.0 593.7,514.7 594.0,512.8 595.4,514.0 595.9,511.9 600.4,514.3 600.7,516.2 601.3,514.8ZM587.2,528.6 553.7,541.4 548.1,529.6 558.2,529.8 559.2,528.4 571.9,525.2 572.5,523.4 576.6,521.7 580.8,522.3 583.5,520.6 587.2,528.6ZM424.5,244.3 430.6,239.0 429.3,244.4 414.3,263.7 403.3,274.8 406.6,268.4 424.5,244.3ZM275.1,478.3 259.7,487.7 257.8,491.9 251.7,492.1 258.2,481.5 270.2,473.2 271.8,473.0 270.5,475.0 273.3,474.5 272.2,475.5 275.1,478.3ZM701.9,375.5 698.8,406.2 701.8,414.3 702.9,422.5 696.3,425.5 690.2,426.5 682.2,430.8 682.2,440.5 681.1,441.1 684.7,447.8 681.2,448.9 682.5,444.7 679.0,444.5 679.2,442.8 677.9,445.8 675.4,446.2 677.3,443.8 675.1,446.0 676.2,440.7 674.8,436.5 672.8,433.4 665.3,429.4 663.4,426.2 677.2,401.1 682.5,401.1 700.2,375.0 701.9,375.5ZM104.3,564.7 117.1,578.0 112.1,583.0 104.7,588.5 95.6,590.5 71.0,592.3 75.3,580.8 74.3,577.9 78.8,573.3 79.1,570.5 82.3,567.9 84.5,568.2 85.7,566.2 86.7,567.4 93.6,565.8 101.5,561.7 104.3,564.7ZM575.1,146.1 561.2,155.0 558.8,135.8 557.3,134.4 561.3,131.8 569.5,131.1 574.9,128.8 576.1,144.2 575.1,146.1ZM349.8,530.1 351.5,545.2 340.5,541.5 338.2,535.9 341.1,531.8 345.2,529.9 349.8,530.1ZM439.9,510.9 442.1,514.5 441.8,518.1 443.7,519.5 443.7,521.1 441.7,522.2 445.1,521.9 445.7,523.7 446.5,522.9 449.0,525.0 448.1,524.5 447.8,525.8 442.4,528.4 428.7,527.1 409.7,528.6 402.7,526.2 398.7,526.8 397.0,525.6 399.5,512.3 395.6,487.9 425.5,483.9 426.2,488.0 438.0,500.6 439.9,510.9ZM282.7,489.9 278.2,492.6 281.8,498.6 272.8,501.9 270.4,497.1 257.8,491.9 259.7,487.7 275.1,478.3 282.7,489.9ZM241.4,471.3 240.4,472.6 235.7,471.4 230.9,473.6 228.4,472.3 223.6,477.2 220.7,473.5 215.3,470.7 227.9,465.4 226.9,458.9 229.2,458.5 230.0,454.1 231.6,453.6 244.7,456.0 242.6,458.2 241.4,471.3ZM351.0,306.9 360.5,312.0 354.7,322.6 340.7,310.8 339.5,313.0 339.9,310.6 335.4,309.9 340.0,309.8 341.2,304.6 351.0,306.9ZM534.2,164.3 506.0,169.7 502.6,167.0 500.9,162.6 501.8,154.7 510.1,154.1 528.6,147.6 534.2,164.3ZM245.9,508.4 248.6,509.0 253.0,517.3 266.7,525.5 264.2,528.9 265.2,530.1 263.7,529.8 259.7,533.8 261.6,535.3 259.6,533.9 259.2,535.8 226.8,515.8 228.3,511.5 236.4,506.7 245.9,508.4ZM621.4,401.2 620.5,404.3 602.2,402.9 589.1,406.7 572.3,404.7 566.7,403.0 561.2,388.5 562.5,386.9 567.4,387.6 568.8,383.3 575.3,384.7 600.6,376.0 606.5,389.0 623.1,391.1 621.4,401.2ZM384.0,403.8 378.8,411.2 375.9,409.4 373.6,412.4 363.5,402.8 368.9,395.1 384.0,403.8ZM676.2,363.3 664.2,386.3 670.9,397.6 677.2,401.1 663.4,426.2 641.1,411.4 632.4,407.1 620.5,404.3 621.4,401.2 649.9,400.2 658.1,375.3 657.2,370.6 676.2,363.3ZM468.3,70.9 465.4,77.2 457.0,82.0 453.4,78.3 449.8,77.8 454.7,66.6 468.3,70.9ZM673.1,347.6 677.9,360.4 676.2,363.3 646.3,374.7 637.6,367.7 627.7,354.0 635.2,350.4 636.7,352.7 641.0,350.3 638.6,341.8 649.5,340.4 668.2,334.4 673.1,347.6ZM262.7,444.4 254.9,443.9 248.6,447.8 245.9,446.3 243.8,443.7 245.1,435.4 241.2,430.3 246.1,427.8 253.6,428.5 260.4,433.6 261.8,432.5 262.6,434.5 263.9,433.6 263.1,434.8 264.8,436.2 263.3,437.6 265.6,437.5 262.0,438.5 265.8,438.2 262.1,438.8 262.3,439.9 266.0,439.7 262.4,440.1 262.7,444.4ZM262.7,444.4 261.6,445.5 265.4,445.6 261.7,446.0 263.3,446.4 261.7,446.6 262.2,456.1 268.4,458.7 262.3,456.5 263.1,460.9 260.7,461.4 261.0,462.4 246.6,467.5 248.8,459.7 254.1,453.1 255.7,444.1 262.7,444.4ZM387.1,296.6 388.3,302.4 390.8,305.5 390.6,309.3 376.8,302.3 381.9,293.9 387.1,296.6ZM466.3,275.9 465.1,285.3 471.8,286.3 466.0,308.0 458.6,306.6 459.3,302.6 452.5,297.7 455.4,297.0 437.0,292.4 438.9,281.3 437.8,279.9 448.0,277.6 455.0,278.6 455.6,275.2 461.8,273.7 466.6,273.9 466.3,275.9ZM363.8,402.5 370.9,410.3 367.1,414.5 360.8,411.4 352.0,421.6 359.6,428.7 338.8,452.5 322.0,440.4 314.3,438.8 308.6,441.6 309.4,440.3 308.1,438.9 311.5,434.7 313.7,435.9 316.0,433.3 318.9,435.2 321.7,431.8 317.4,427.9 322.1,431.2 323.5,430.4 321.5,428.8 323.8,430.0 322.3,426.4 323.2,425.2 321.7,424.6 324.0,424.4 322.5,423.1 325.7,424.3 322.5,421.9 327.8,424.8 324.5,421.5 326.9,422.7 327.8,421.8 325.3,419.9 327.3,420.5 327.2,418.7 331.1,420.8 329.3,418.0 332.0,419.9 332.9,418.8 329.6,416.2 333.6,418.0 330.5,414.9 331.1,414.1 334.6,416.6 332.3,413.2 335.6,415.5 336.4,414.5 332.6,411.7 335.0,409.7 339.7,412.5 340.6,411.3 336.9,408.5 338.6,407.9 343.8,411.6 345.2,410.0 341.4,406.8 343.7,405.7 349.2,408.7 347.2,406.1 350.2,407.5 347.1,405.9 345.6,403.4 350.1,406.7 348.5,403.2 353.6,406.3 355.3,404.2 351.0,401.0 355.9,398.0 356.4,393.1 360.8,400.2 363.8,402.5ZM373.6,268.5 366.4,264.9 374.0,252.4 381.2,256.0 373.6,268.5ZM574.8,180.7 572.1,175.1 578.6,172.4 574.2,164.6 565.9,169.6 564.9,168.5 562.7,170.9 562.6,173.1 557.7,173.0 558.7,164.1 554.8,155.3 564.0,153.7 577.0,143.4 578.4,145.5 588.3,143.1 587.7,145.8 589.2,150.7 590.4,150.8 591.8,154.8 595.4,154.9 590.5,157.0 591.6,157.7 590.5,159.3 592.7,158.9 590.3,161.0 598.3,158.4 602.1,168.9 611.1,172.7 606.2,179.0 603.4,178.8 602.5,177.1 603.9,177.5 602.3,176.1 603.9,177.5 603.5,176.6 599.1,172.7 601.4,177.8 605.2,182.3 606.7,181.5 606.1,182.4 617.8,187.4 619.6,186.7 620.6,189.6 619.4,191.3 616.4,191.4 605.7,184.2 603.0,184.8 595.4,178.2 590.4,177.1 589.6,178.2 587.1,176.7 574.8,180.7ZM230.3,485.8 235.3,485.7 240.5,487.9 237.3,493.2 237.1,500.5 238.4,504.1 227.5,512.3 226.9,517.1 222.2,522.7 205.7,536.3 203.6,530.2 198.7,524.8 202.4,520.2 207.8,508.6 213.7,506.7 209.2,498.9 206.8,485.7 230.3,485.8ZM255.7,444.1 254.1,453.1 248.8,459.7 245.9,471.9 244.5,471.0 242.9,472.3 241.4,471.3 242.6,458.2 244.7,456.0 231.6,453.6 231.5,450.4 233.2,447.9 236.3,449.0 244.1,444.6 248.6,447.8 255.7,444.1ZM56.9,622.5 61.3,622.6 67.2,625.2 71.9,641.2 88.1,636.5 88.5,638.6 79.1,649.3 69.7,651.7 61.8,651.6 54.7,654.3 50.9,658.0 45.2,658.1 42.1,660.2 39.0,659.6 34.0,654.2 31.3,648.1 30.9,642.6 33.3,639.9 32.1,639.4 33.8,639.3 33.5,636.6 37.9,631.4 37.3,629.8 39.0,631.4 38.1,629.8 40.2,629.3 38.8,628.5 39.9,627.8 41.1,630.4 42.5,630.1 41.8,628.2 42.5,629.0 44.1,628.0 43.5,626.8 50.0,625.1 51.4,622.0 56.9,622.5ZM485.0,118.7 501.0,127.8 497.5,139.8 485.7,131.4 477.9,130.0 483.7,118.2 485.0,118.7ZM352.3,320.5 343.8,332.7 337.2,329.2 338.9,321.0 337.7,319.5 333.9,319.0 338.2,319.1 334.9,317.2 338.8,317.3 340.7,310.8 352.3,320.5ZM364.9,335.5 355.8,337.9 350.4,332.9 364.0,330.0 364.9,335.5ZM558.8,135.8 561.0,154.0 554.5,154.7 554.9,151.1 558.8,146.6 558.4,138.9 556.9,137.7 558.1,145.2 553.4,152.5 553.7,161.2 534.2,164.3 528.6,147.6 557.3,143.6 555.3,137.9 555.9,136.0 558.8,135.8ZM480.0,102.3 473.2,116.4 467.1,114.4 465.8,116.0 459.9,114.7 459.1,111.4 457.2,110.5 463.3,102.7 467.7,104.0 469.9,102.4 480.0,102.3ZM426.1,224.1 428.1,234.1 427.0,236.4 406.9,261.4 388.8,252.2 410.7,216.2 426.1,224.1ZM407.4,197.3 377.0,247.4 359.4,237.7 362.3,238.6 364.5,235.7 368.8,228.7 365.4,228.9 368.7,228.4 373.1,220.1 372.2,219.0 371.0,220.3 372.2,218.8 373.1,220.0 372.7,218.8 374.1,218.3 372.5,218.4 374.1,218.2 391.4,188.8 407.4,197.3ZM522.0,41.1 519.2,44.5 513.2,48.0 510.3,52.5 506.6,52.9 506.2,56.5 509.4,65.1 505.0,71.9 481.7,66.0 485.9,55.1 485.6,28.2 522.0,41.1ZM525.5,135.1 519.4,137.8 513.6,134.6 517.2,131.3 521.4,123.3 520.3,122.9 521.1,118.6 531.4,124.3 535.3,131.4 538.1,132.4 525.5,135.1ZM381.2,340.9 379.2,347.6 379.3,352.7 372.9,352.3 371.5,347.7 374.0,347.8 374.3,341.6 381.2,340.9ZM559.4,54.7 549.4,57.3 550.7,61.6 543.8,72.8 524.1,65.2 530.9,50.9 533.4,43.0 532.5,41.9 535.1,41.2 535.6,37.6 537.1,37.6 536.0,36.3 539.3,34.9 539.8,33.5 538.4,32.9 541.2,29.8 543.3,29.9 540.3,34.2 543.5,35.6 544.4,34.2 551.2,37.2 551.1,39.3 555.6,39.3 558.4,46.6 557.8,49.7 559.4,54.7ZM453.1,113.2 443.7,129.0 437.1,144.2 437.5,155.0 417.7,145.6 422.9,131.0 421.8,121.1 428.3,115.9 433.4,106.8 436.3,108.2 439.5,106.8 443.2,108.4 446.3,108.0 450.0,104.2 453.1,113.2ZM231.5,450.4 231.6,453.6 230.0,454.1 229.2,458.5 226.9,458.9 227.9,465.4 215.3,470.7 202.5,461.8 198.8,458.0 195.1,450.6 209.6,449.3 231.5,450.4ZM503.4,138.9 499.1,136.1 500.1,129.1 502.7,124.4 510.1,130.7 509.1,133.0 519.4,137.8 511.5,142.3 503.4,138.9ZM343.5,285.5 358.7,293.1 351.0,306.9 341.2,304.6 341.0,307.1 336.4,306.7 336.9,303.3 340.5,303.7 340.8,299.8 336.9,299.7 340.9,299.3 339.5,297.7 341.0,297.8 341.5,290.4 339.0,289.5 340.1,288.2 338.6,288.0 342.5,288.1 339.3,286.5 342.6,286.9 343.5,285.5ZM553.6,127.2 558.4,133.7 557.3,134.4 558.1,135.6 555.9,136.0 555.3,137.9 557.3,143.6 542.6,145.8 540.4,133.1 538.1,132.4 545.9,129.8 551.1,124.6 551.5,127.2 553.6,127.2ZM188.3,462.1 187.4,467.6 189.1,483.1 169.7,486.4 172.2,464.1 180.8,465.2 185.8,462.0 188.3,462.1ZM615.2,214.5 613.7,219.4 617.2,237.4 573.6,232.8 575.5,228.7 577.0,218.0 574.6,216.1 569.0,215.5 567.3,212.9 568.3,211.0 572.1,209.4 571.0,208.4 572.6,208.7 570.7,202.7 573.3,202.7 574.1,201.2 576.2,201.9 582.9,196.3 590.6,202.3 592.5,200.7 601.2,203.7 607.9,203.0 614.8,205.5 615.2,214.5ZM522.9,91.8 523.1,82.0 529.9,67.4 553.2,77.4 543.8,83.0 535.2,92.0 522.9,91.8ZM168.4,493.8 174.8,497.0 180.8,497.2 190.2,504.2 185.2,507.8 176.4,505.9 175.0,508.2 169.3,508.0 169.5,498.9 166.8,494.6 166.8,493.5 168.4,493.8ZM379.9,409.7 387.0,413.4 390.9,428.8 379.5,429.6 377.7,418.1 369.3,412.0 370.9,410.3 373.6,412.4 375.9,409.4 378.8,411.2 379.9,409.7ZM529.0,356.1 541.2,353.7 538.9,349.1 543.8,349.7 551.0,366.4 524.0,375.6 521.1,358.1 529.0,356.1ZM532.7,44.9 520.2,75.7 513.3,76.1 513.4,73.7 509.0,72.8 509.4,65.1 506.2,56.5 506.6,52.9 510.3,52.5 513.2,48.0 519.2,44.5 522.0,41.1 532.7,44.9ZM130.1,592.5 129.7,595.0 125.6,599.7 111.8,605.8 109.7,600.9 78.2,612.2 74.0,610.8 71.1,607.0 71.0,592.3 95.6,590.5 104.7,588.5 115.8,579.9 117.1,578.0 115.8,577.2 117.7,574.6 116.2,573.3 118.9,571.3 120.8,572.5 122.6,570.3 124.0,576.6 128.2,578.8 125.8,583.3 131.1,586.7 130.1,592.5ZM480.2,262.2 488.5,279.1 492.2,278.7 494.3,290.5 465.1,285.3 466.6,273.9 469.0,274.3 469.3,273.1 467.9,269.4 464.2,268.6 469.8,262.4 472.0,263.3 480.2,262.2ZM429.0,316.8 429.9,321.7 427.6,325.8 430.9,339.0 451.8,339.2 457.6,332.3 444.2,308.6 440.0,312.3 433.5,313.5 429.0,316.8ZM417.4,144.7 429.3,150.3 420.5,171.7 403.2,163.3 415.6,144.1 417.4,144.7ZM408.4,311.8 414.2,316.1 411.2,319.5 414.4,321.9 421.1,320.7 424.4,318.4 425.7,320.2 429.4,318.9 429.9,321.7 427.6,325.8 430.9,339.0 450.4,339.2 448.4,341.2 429.2,349.6 402.9,352.8 403.2,350.1 393.6,342.3 392.7,334.1 397.0,322.7 396.1,322.1 397.1,322.6 397.0,320.7 398.3,321.2 398.5,319.4 399.8,319.3 398.9,317.5 400.3,318.1 403.3,312.0 406.9,314.9 408.4,311.8ZM437.5,155.0 438.3,170.8 427.2,189.1 429.2,190.1 426.9,193.9 424.8,192.9 419.2,202.2 405.8,196.1 407.6,193.1 407.6,189.4 412.6,181.1 404.0,169.4 402.7,170.3 406.4,165.0 420.5,171.7 429.1,150.9 437.5,155.0Z";
const NBHD_LABELS = [{"n":"Flushing","x":590.3,"y":270.2,"a":4329},{"n":"John F. Kennedy International Airport","x":624.8,"y":430.8,"a":3748},{"n":"Jamaica","x":622.2,"y":366.7,"a":2838},{"n":"East New York","x":509.1,"y":409.8,"a":2639},{"n":"Freshkills Park","x":123.1,"y":539.1,"a":2320},{"n":"Bayside","x":648.8,"y":261.6,"a":2225},{"n":"East Flatbush","x":439.6,"y":429.6,"a":1918},{"n":"Pelham Bay Park","x":598.0,"y":93.2,"a":1883},{"n":"Long Island City","x":433.1,"y":275.9,"a":1692},{"n":"Sheepshead Bay","x":418.6,"y":508.3,"a":1686},{"n":"Bedford-Stuyvesant","x":433.0,"y":369.8,"a":1642},{"n":"Canarsie","x":481.7,"y":443.1,"a":1597},{"n":"Maspeth","x":474.3,"y":310.2,"a":1528},{"n":"Gravesend","x":378.0,"y":510.3,"a":1506},{"n":"Bull's Head","x":149.9,"y":494.3,"a":1476},{"n":"Borough Park","x":366.9,"y":455.8,"a":1411},{"n":"Richmond Hill","x":574.6,"y":362.4,"a":1400},{"n":"Whitestone","x":594.0,"y":218.0,"a":1395},{"n":"Breezy Point","x":472.9,"y":564.2,"a":1389},{"n":"Forest Park","x":514.5,"y":356.9,"a":1368},{"n":"Queens Village","x":680.8,"y":324.6,"a":1363},{"n":"Sunset Park","x":341.8,"y":425.6,"a":1343},{"n":"Bloomfield","x":113.8,"y":475.4,"a":1284},{"n":"Prince's Bay","x":101.9,"y":619.3,"a":1271},{"n":"Tottenville","x":54.6,"y":641.2,"a":1239},{"n":"Floyd Bennett Field","x":489.9,"y":514.3,"a":1238},{"n":"Williamsburg","x":414.3,"y":335.0,"a":1237},{"n":"Crown Heights","x":429.4,"y":393.1,"a":1222},{"n":"Latourette Park","x":180.4,"y":525.9,"a":1218},{"n":"Rosedale","x":685.6,"y":413.5,"a":1217},{"n":"St. Albans","x":654.6,"y":355.0,"a":1203},{"n":"Springfield Gardens","x":657.1,"y":399.4,"a":1191},{"n":"South Ozone Park","x":591.2,"y":393.7,"a":1186},{"n":"College Point","x":556.0,"y":225.4,"a":1179},{"n":"Throgs Neck","x":583.3,"y":164.7,"a":1169},{"n":"Howard Beach","x":551.3,"y":414.3,"a":1159},{"n":"Woodrow","x":102.0,"y":595.0,"a":1133},{"n":"Todt Hill","x":219.2,"y":506.3,"a":1112},{"n":"Ditmars Steinway","x":473.6,"y":231.6,"a":1106},{"n":"Midwood","x":404.5,"y":471.6,"a":1103},{"n":"East Elmhurst","x":506.2,"y":254.7,"a":1083},{"n":"Bellerose","x":701.4,"y":295.2,"a":1082},{"n":"Upper West Side","x":384.7,"y":217.9,"a":1026},{"n":"Charleston","x":60.3,"y":590.5,"a":1019},{"n":"Forest Hills","x":548.3,"y":319.4,"a":1019},{"n":"Ozone Park","x":549.2,"y":382.0,"a":1009},{"n":"Middle Village","x":507.8,"y":326.2,"a":987},{"n":"Bushwick","x":457.8,"y":356.5,"a":972},{"n":"Van Cortlandt Park","x":498.4,"y":50.2,"a":971},{"n":"Astoria","x":456.3,"y":250.8,"a":962},{"n":"Fresh Meadows","x":627.4,"y":290.7,"a":957},{"n":"Upper East Side","x":409.8,"y":239.1,"a":930},{"n":"Washington Heights","x":434.5,"y":128.1,"a":918},{"n":"Elmhurst","x":508.0,"y":293.2,"a":916},{"n":"Greenpoint","x":423.0,"y":308.0,"a":911},{"n":"Broad Channel","x":576.9,"y":475.1,"a":909},{"n":"Flushing Meadows Corona Park","x":556.5,"y":290.5,"a":900},{"n":"Harlem","x":422.3,"y":177.3,"a":897},{"n":"Douglaston","x":681.4,"y":253.9,"a":888},{"n":"Flatlands","x":442.3,"y":465.2,"a":882},{"n":"Castleton Corners","x":201.4,"y":477.2,"a":875},{"n":"Kingsbridge","x":480.9,"y":82.0,"a":874},{"n":"Rossville","x":93.5,"y":578.6,"a":872},{"n":"Flatbush","x":405.3,"y":438.7,"a":861},{"n":"Huguenot","x":139.7,"y":604.9,"a":839},{"n":"Wakefield","x":542.1,"y":52.8,"a":810},{"n":"Arden Heights","x":127.7,"y":571.0,"a":805},{"n":"East Harlem","x":429.8,"y":202.7,"a":794},{"n":"Great Kills","x":160.6,"y":571.8,"a":780},{"n":"Cambria Heights","x":688.1,"y":360.2,"a":778},{"n":"Bensonhurst","x":361.3,"y":482.5,"a":759},{"n":"Bay Ridge","x":319.0,"y":455.0,"a":740},{"n":"Midtown","x":384.3,"y":266.1,"a":737},{"n":"Brownsville","x":468.2,"y":405.0,"a":734},{"n":"Chelsea, Staten Island","x":110.2,"y":515.7,"a":724},{"n":"Randall Manor","x":212.7,"y":444.3,"a":716},{"n":"Central Park","x":398.0,"y":224.7,"a":713},{"n":"Far Rockaway","x":670.4,"y":502.0,"a":696},{"n":"Hunts Point","x":503.8,"y":181.5,"a":693},{"n":"New Springville","x":152.8,"y":524.8,"a":685},{"n":"Ridgewood","x":473.9,"y":341.8,"a":682},{"n":"Oakwood","x":205.9,"y":564.9,"a":681},{"n":"Sunnyside","x":455.9,"y":289.0,"a":680},{"n":"Longwood","x":481.0,"y":166.0,"a":675},{"n":"Bay Terrace","x":629.2,"y":221.1,"a":670},{"n":"Dyker Heights","x":337.5,"y":472.3,"a":652},{"n":"Bronx Park","x":512.4,"y":109.9,"a":649},{"n":"Howland Hook","x":127.7,"y":451.2,"a":647},{"n":"Jackson Heights","x":512.5,"y":270.0,"a":643},{"n":"Laurelton","x":680.1,"y":385.5,"a":630},{"n":"Jamaica Estates","x":622.1,"y":320.0,"a":627},{"n":"East Williamsburg","x":441.4,"y":326.5,"a":625},{"n":"Pleasant Plains","x":69.0,"y":623.2,"a":618},{"n":"Cypress Hills","x":504.5,"y":378.1,"a":614},{"n":"Glendale","x":507.8,"y":344.6,"a":611},{"n":"Inwood","x":451.4,"y":95.7,"a":611},{"n":"Bergen Beach","x":474.8,"y":472.3,"a":602},{"n":"Mariners Harbor","x":155.2,"y":451.5,"a":595},{"n":"Kew Gardens Hills","x":582.9,"y":312.3,"a":590},{"n":"Brighton Beach","x":395.0,"y":535.4,"a":581},{"n":"Fort Hamilton","x":315.4,"y":479.5,"a":573},{"n":"Floral Park","x":724.9,"y":285.6,"a":566},{"n":"LaGuardia Airport","x":515.6,"y":236.4,"a":561},{"n":"Chelsea","x":354.9,"y":279.0,"a":546},{"n":"Woodlawn","x":518.6,"y":58.1,"a":539},{"n":"Mott Haven","x":457.0,"y":180.7,"a":529},{"n":"Woodside","x":478.2,"y":277.2,"a":527},{"n":"South Beach","x":246.6,"y":519.8,"a":524},{"n":"Fordham","x":489.5,"y":103.8,"a":523},{"n":"West Brighton","x":214.5,"y":458.0,"a":511},{"n":"Clason Point","x":529.6,"y":176.6,"a":510},{"n":"Edgemere","x":636.2,"y":506.4,"a":506},{"n":"Allerton","x":531.9,"y":99.4,"a":502},{"n":"Hollis","x":649.5,"y":331.4,"a":502},{"n":"Prospect Park","x":393.8,"y":406.9,"a":501},{"n":"Rego Park","x":530.2,"y":310.0,"a":499},{"n":"Graniteville","x":159.0,"y":471.9,"a":497},{"n":"Alley Pond Park","x":678.6,"y":273.4,"a":489},{"n":"Little Neck","x":696.5,"y":250.4,"a":488},{"n":"Morris Park","x":543.2,"y":119.8,"a":486},{"n":"Marine Park","x":437.9,"y":484.9,"a":485},{"n":"Co-op City","x":574.1,"y":88.0,"a":475},{"n":"Hell's Kitchen","x":362.1,"y":255.1,"a":474},{"n":"Soundview","x":517.2,"y":159.6,"a":474},{"n":"Eltingville","x":159.5,"y":590.4,"a":473},{"n":"Corona","x":532.8,"y":284.3,"a":472},{"n":"Emerson Hill","x":192.2,"y":495.1,"a":470},{"n":"Unionport","x":544.9,"y":152.7,"a":464},{"n":"Concord","x":252.0,"y":498.8,"a":460},{"n":"Great Kills Park","x":192.0,"y":584.7,"a":457},{"n":"Port Richmond","x":180.3,"y":452.2,"a":456},{"n":"Randall's Island","x":450.0,"y":211.6,"a":449},{"n":"Woodhaven","x":535.2,"y":363.0,"a":447},{"n":"Parkchester","x":524.3,"y":143.4,"a":445},{"n":"Port Morris","x":467.9,"y":190.4,"a":441},{"n":"Kensington","x":385.5,"y":442.1,"a":432},{"n":"Pelham Gardens","x":554.5,"y":103.9,"a":430},{"n":"Williamsbridge","x":534.6,"y":80.5,"a":424},{"n":"Arrochar","x":263.4,"y":512.7,"a":422},{"n":"Coney Island","x":364.2,"y":539.2,"a":417},{"n":"Cunningham Park","x":648.2,"y":300.0,"a":416},{"n":"Bath Beach","x":346.3,"y":496.7,"a":415},{"n":"Arverne","x":613.8,"y":512.2,"a":414},{"n":"Red Hook","x":343.2,"y":388.2,"a":410},{"n":"Dongan Hills","x":236.4,"y":528.9,"a":405},{"n":"Green-Wood Cemetery","x":367.1,"y":422.8,"a":398},{"n":"Riverdale","x":465.3,"y":55.8,"a":397},{"n":"Hamilton Heights","x":417.0,"y":157.7,"a":393},{"n":"Marine Park","x":456.3,"y":505.4,"a":381},{"n":"Norwood","x":506.3,"y":81.9,"a":378},{"n":"Lower East Side","x":374.2,"y":325.3,"a":376},{"n":"Bay Terrace, Staten Island","x":178.9,"y":566.0,"a":374},{"n":"East Village","x":376.8,"y":310.0,"a":372},{"n":"Prospect-Lefferts Gardens","x":416.2,"y":411.9,"a":372},{"n":"Bayswater","x":653.3,"y":492.7,"a":371},{"n":"Edenwald","x":557.4,"y":65.6,"a":371},{"n":"Mill Basin","x":465.9,"y":485.1,"a":371},{"n":"New Dorp Beach","x":224.1,"y":553.7,"a":371},{"n":"Park Slope","x":381.5,"y":390.0,"a":369},{"n":"Lighthouse Hill","x":178.6,"y":542.3,"a":368},{"n":"North Riverdale","x":475.3,"y":34.2,"a":363},{"n":"Westerleigh","x":179.5,"y":474.8,"a":356},{"n":"Rockaway Park","x":567.6,"y":530.8,"a":355},{"n":"New Dorp","x":207.8,"y":544.0,"a":349},{"n":"Midland Beach","x":237.0,"y":542.1,"a":347},{"n":"Pelham Bay","x":565.0,"y":122.1,"a":347},{"n":"Rikers Island","x":503.3,"y":211.4,"a":341},{"n":"Eastchester","x":575.3,"y":68.5,"a":334},{"n":"Fort Greene","x":386.4,"y":364.2,"a":329},{"n":"Gowanus","x":367.1,"y":386.7,"a":327},{"n":"Broad Channel","x":619.5,"y":478.6,"a":326},{"n":"Silver Lake","x":232.4,"y":465.1,"a":324},{"n":"Baychester","x":557.0,"y":88.7,"a":323},{"n":"Briarwood","x":590.2,"y":333.3,"a":318},{"n":"Schuylerville","x":567.2,"y":140.7,"a":313},{"n":"Shore Acres","x":271.7,"y":490.2,"a":309},{"n":"Kew Gardens","x":571.3,"y":337.1,"a":305},{"n":"Clinton Hill","x":399.6,"y":366.1,"a":296},{"n":"St. George","x":252.5,"y":437.3,"a":295},{"n":"Claremont Village","x":473.5,"y":138.0,"a":290},{"n":"East Morrisania","x":497.5,"y":146.8,"a":287},{"n":"Castle Hill","x":546.7,"y":169.4,"a":285},{"n":"Ferry Point Park","x":566.5,"y":177.1,"a":285},{"n":"Morningside Heights","x":402.8,"y":183.8,"a":284},{"n":"Tompkinsville","x":244.6,"y":454.9,"a":283},{"n":"Richmondtown","x":187.9,"y":547.3,"a":281},{"n":"Belmont","x":496.1,"y":115.8,"a":276},{"n":"Concourse","x":448.8,"y":155.0,"a":273},{"n":"Morris Heights","x":458.7,"y":121.8,"a":273},{"n":"West Village","x":347.4,"y":296.9,"a":273},{"n":"Hollis Hills","x":667.1,"y":299.1,"a":266},{"n":"Concourse Village","x":459.7,"y":154.4,"a":264},{"n":"Financial District","x":342.9,"y":339.4,"a":263},{"n":"Belle Harbor","x":542.3,"y":538.6,"a":255},{"n":"Country Club","x":582.4,"y":134.3,"a":254},{"n":"Fieldston","x":478.0,"y":54.3,"a":252},{"n":"Highbridge","x":446.4,"y":141.2,"a":252},{"n":"Westchester Square","x":549.0,"y":136.3,"a":251},{"n":"Manhattan Beach","x":426.9,"y":535.0,"a":249},{"n":"Glen Oaks","x":714.8,"y":269.7,"a":248},{"n":"Rockaway Beach","x":595.6,"y":520.9,"a":245},{"n":"Grymes Hill","x":235.5,"y":478.8,"a":244},{"n":"City Island","x":624.9,"y":126.5,"a":243},{"n":"Clifton","x":255.0,"y":471.0,"a":242},{"n":"Tremont","x":490.2,"y":128.5,"a":241},{"n":"Jamaica Bay","x":538.8,"y":465.7,"a":233},{"n":"Windsor Terrace","x":382.0,"y":419.4,"a":223},{"n":"Park Hill","x":253.1,"y":482.0,"a":216},{"n":"Jamaica Hills","x":608.7,"y":329.5,"a":215},{"n":"Van Nest","x":525.0,"y":129.4,"a":214},{"n":"University Heights","x":468.5,"y":108.9,"a":213},{"n":"Holliswood","x":646.9,"y":317.8,"a":209},{"n":"Stapleton","x":256.3,"y":456.2,"a":207},{"n":"Morrisania","x":476.0,"y":152.7,"a":203},{"n":"Brooklyn Heights","x":360.2,"y":356.0,"a":202},{"n":"SoHo","x":350.1,"y":312.5,"a":191},{"n":"Carroll Gardens","x":358.4,"y":379.6,"a":190},{"n":"Downtown Brooklyn","x":372.0,"y":358.2,"a":187},{"n":"Jamaica Bay","x":551.4,"y":487.1,"a":187},{"n":"Tribeca","x":343.4,"y":322.2,"a":187},{"n":"Willowbrook","x":177.2,"y":502.1,"a":187},{"n":"Gerritsen Beach","x":446.2,"y":512.8,"a":186},{"n":"South Slope","x":373.4,"y":403.9,"a":184},{"n":"Navy Yard","x":390.4,"y":348.1,"a":179},{"n":"Jamaica Bay","x":518.2,"y":469.8,"a":178},{"n":"Prospect Heights","x":394.3,"y":383.4,"a":170},{"n":"Fort Wadsworth","x":281.2,"y":501.4,"a":168},{"n":"West Farms","x":507.1,"y":134.6,"a":168},{"n":"Kips Bay","x":383.3,"y":287.9,"a":167},{"n":"Spuyten Duyvil","x":458.8,"y":74.1,"a":164},{"n":"Broad Channel","x":605.1,"y":469.6,"a":163},{"n":"Columbia St","x":348.6,"y":371.2,"a":156},{"n":"Jamaica Bay","x":543.8,"y":450.6,"a":152},{"n":"Greenwich Village","x":359.1,"y":302.2,"a":151},{"n":"Mount Hope","x":473.1,"y":124.2,"a":151},{"n":"Governors Island","x":330.5,"y":367.1,"a":148},{"n":"Rosebank","x":263.4,"y":482.4,"a":147},{"n":"Murray Hill","x":385.7,"y":277.1,"a":143},{"n":"Sea Gate","x":345.5,"y":537.1,"a":139},{"n":"New Brighton","x":239.6,"y":438.6,"a":138},{"n":"Boerum Hill","x":373.5,"y":370.8,"a":132},{"n":"Grant City","x":218.7,"y":533.9,"a":132},{"n":"Olinville","x":523.0,"y":77.7,"a":131},{"n":"Jamaica Bay","x":523.8,"y":522.2,"a":129},{"n":"Roosevelt Island","x":418.3,"y":255.5,"a":128},{"n":"Mount Eden","x":459.5,"y":134.8,"a":127},{"n":"Gramercy","x":373.5,"y":295.4,"a":121},{"n":"Melrose","x":459.0,"y":166.7,"a":121},{"n":"Theater District","x":373.8,"y":260.4,"a":118},{"n":"Neponsit","x":530.2,"y":545.3,"a":116},{"n":"Crotona Park","x":487.1,"y":139.2,"a":113},{"n":"Jamaica Bay","x":539.0,"y":485.0,"a":113},{"n":"Stuyvesant Town","x":384.2,"y":301.5,"a":107},{"n":"Bronxdale","x":526.4,"y":114.5,"a":105},{"n":"Chinatown","x":360.2,"y":326.0,"a":105},{"n":"Jamaica Bay","x":535.4,"y":503.2,"a":103},{"n":"Broad Channel","x":608.3,"y":491.5,"a":100},{"n":"Battery Park City","x":334.4,"y":332.4,"a":96},{"n":"Hart Island","x":646.0,"y":116.1,"a":94},{"n":"Cobble Hill","x":360.0,"y":369.0,"a":92},{"n":"Broad Channel","x":560.4,"y":513.3,"a":75},{"n":"Plum Beach","x":457.8,"y":526.6,"a":74},{"n":"Broad Channel","x":590.6,"y":463.9,"a":73},{"n":"Vinegar Hill","x":376.5,"y":347.0,"a":72},{"n":"Flatiron District","x":368.7,"y":287.0,"a":71},{"n":"Port Ivory","x":129.4,"y":437.4,"a":71},{"n":"Civic Center","x":351.1,"y":328.9,"a":69},{"n":"Two Bridges","x":358.6,"y":333.9,"a":68},{"n":"Jamaica Bay","x":556.8,"y":457.5,"a":67},{"n":"Marine Park","x":459.3,"y":508.6,"a":66},{"n":"Marble Hill","x":468.1,"y":82.2,"a":62},{"n":"DUMBO","x":368.5,"y":345.1,"a":59},{"n":"Bayswater","x":646.6,"y":475.6,"a":46},{"n":"Broad Channel","x":592.4,"y":500.0,"a":36},{"n":"NoHo","x":363.0,"y":308.9,"a":36},{"n":"Jamaica Bay","x":563.9,"y":472.1,"a":34},{"n":"Broad Channel","x":566.4,"y":490.4,"a":32},{"n":"Nolita","x":361.0,"y":316.1,"a":30},{"n":"Ellis Island","x":303.0,"y":352.0,"a":22},{"n":"Little Italy","x":358.0,"y":321.2,"a":20},{"n":"Jamaica Bay","x":517.8,"y":490.4,"a":16},{"n":"North Brother Island","x":483.1,"y":196.9,"a":14},{"n":"Arlington","x":152.2,"y":436.9,"a":13},{"n":"Liberty Island","x":297.5,"y":365.4,"a":13},{"n":"Broad Channel","x":573.2,"y":491.7,"a":7},{"n":"Pelham Islands","x":601.7,"y":133.9,"a":7},{"n":"City Island","x":625.9,"y":107.2,"a":6},{"n":"Hoffman Island","x":286.4,"y":533.8,"a":6},{"n":"Jamaica Bay","x":563.4,"y":491.0,"a":6},{"n":"Pelham Islands","x":644.2,"y":89.4,"a":4},{"n":"Jamaica Bay","x":518.6,"y":501.9,"a":3}];
const STATIONS = [{"n":"W 4th St - Washington Sq (Lower)","x":354.3,"y":300.9,"l":["B","D","F","M"],"lat":40.73225,"lng":-74.00031},{"n":"Buhre Ave","x":566.7,"y":126.6,"l":["6"],"lat":40.84681,"lng":-73.83257},{"n":"51st St","x":390.2,"y":263.1,"l":["4","6"],"lat":40.75711,"lng":-73.97192},{"n":"86th St","x":384.8,"y":215.1,"l":["1","2"],"lat":40.78864,"lng":-73.97622},{"n":"Brooklyn Bridge - City Hall","x":349.4,"y":330.1,"l":["4","5","6"],"lat":40.71307,"lng":-74.00413},{"n":"33rd St","x":377.4,"y":279.9,"l":["4","6"],"lat":40.74608,"lng":-73.98208},{"n":"Lexington Ave - 59th St","x":395.2,"y":254.9,"l":["4","5","6"],"lat":40.76253,"lng":-73.96797},{"n":"233rd St","x":535.3,"y":56.1,"l":["2","5"],"lat":40.89314,"lng":-73.85736},{"n":"66th St - Lincoln Ctr","x":377.2,"y":238.2,"l":["1","2"],"lat":40.77344,"lng":-73.98221},{"n":"Hunts Point Ave","x":493.3,"y":165.9,"l":["6"],"lat":40.82095,"lng":-73.89055},{"n":"Canal St","x":346.7,"y":315.2,"l":["1","2"],"lat":40.72285,"lng":-74.00628},{"n":"Middletown Rd","x":562.0,"y":131.1,"l":["6"],"lat":40.84386,"lng":-73.83632},{"n":"23rd St","x":371.6,"y":289.3,"l":["4","6"],"lat":40.73986,"lng":-73.9866},{"n":"45th Rd - Court House Sq","x":424.0,"y":278.4,"l":["7"],"lat":40.74702,"lng":-73.94526},{"n":"Astor Pl","x":366.0,"y":304.3,"l":["4","6"],"lat":40.73005,"lng":-73.99107},{"n":"59th St - Columbus Circle","x":377.6,"y":246.1,"l":["1","2"],"lat":40.76825,"lng":-73.98193},{"n":"Hunters Point Ave","x":419.4,"y":285.8,"l":["7"],"lat":40.74222,"lng":-73.94892},{"n":"96th St","x":416.6,"y":219.6,"l":["4","6"],"lat":40.78567,"lng":-73.95107},{"n":"Mets - Willets Point","x":550.2,"y":266.9,"l":["7"],"lat":40.75462,"lng":-73.84562},{"n":"23rd St","x":360.2,"y":282.9,"l":["1","2"],"lat":40.74408,"lng":-73.99566},{"n":"Houston St","x":347.9,"y":307.0,"l":["1","2"],"lat":40.72825,"lng":-74.00537},{"n":"3rd Ave - 138th St","x":448.2,"y":181.9,"l":["6"],"lat":40.81048,"lng":-73.92614},{"n":"Zerega Ave","x":548.4,"y":142.3,"l":["6"],"lat":40.83649,"lng":-73.84704},{"n":"104th St","x":560.3,"y":377.8,"l":["A","S"],"lat":40.68171,"lng":-73.83768},{"n":"Bleecker St (Downtown)","x":361.4,"y":310.5,"l":["4","6"],"lat":40.72593,"lng":-73.99467},{"n":"Castle Hill Ave","x":543.1,"y":145.7,"l":["6"],"lat":40.83426,"lng":-73.85122},{"n":"Broad Channel","x":587.9,"y":489.4,"l":["A","S"],"lat":40.6084,"lng":-73.81583},{"n":"Ocean Pkwy","x":394.6,"y":538.2,"l":["Q"],"lat":40.57631,"lng":-73.9685},{"n":"50th St","x":375.1,"y":256.1,"l":["1","2"],"lat":40.76173,"lng":-73.98385},{"n":"Vernon Blvd - Jackson Ave","x":413.5,"y":285.1,"l":["7"],"lat":40.74263,"lng":-73.95358},{"n":"68th St - Hunter College","x":400.4,"y":246.3,"l":["4","6"],"lat":40.76814,"lng":-73.96387},{"n":"Queensboro Plz","x":430.5,"y":272.9,"l":["7","N","W"],"lat":40.75064,"lng":-73.94016},{"n":"Rockaway Blvd","x":552.5,"y":379.8,"l":["A","S"],"lat":40.68043,"lng":-73.84385},{"n":"Union Sq - 14th St","x":367.4,"y":297.2,"l":["4","5","6"],"lat":40.73467,"lng":-73.98995},{"n":"Junction Blvd","x":519.9,"y":275.2,"l":["7"],"lat":40.74915,"lng":-73.86953},{"n":"Classon Ave","x":405.3,"y":366.9,"l":["G"],"lat":40.68889,"lng":-73.95999},{"n":"Bedford - Nostrand Aves","x":413.5,"y":365.8,"l":["G"],"lat":40.68963,"lng":-73.95352},{"n":"15th St - Prospect Park","x":380.3,"y":410.8,"l":["F","G"],"lat":40.66004,"lng":-73.97974},{"n":"7th Ave","x":379.7,"y":401.4,"l":["F","G"],"lat":40.66625,"lng":-73.98025},{"n":"Ft Hamilton Pkwy","x":385.4,"y":424.9,"l":["F","G"],"lat":40.65078,"lng":-73.97578},{"n":"Church Ave","x":380.4,"y":434.8,"l":["F","G"],"lat":40.64427,"lng":-73.97972},{"n":"Beverly Rd","x":399.8,"y":435.4,"l":["B","Q"],"lat":40.6439,"lng":-73.96436},{"n":"Church Ave","x":401.7,"y":425.3,"l":["B","Q"],"lat":40.65049,"lng":-73.96288},{"n":"Newkirk Ave","x":401.9,"y":448.7,"l":["B","Q"],"lat":40.63514,"lng":-73.96269},{"n":"Parkside Ave","x":403.5,"y":418.4,"l":["B","Q"],"lat":40.65507,"lng":-73.96145},{"n":"Prospect Park","x":402.8,"y":408.4,"l":["B","Q","S"],"lat":40.66163,"lng":-73.96203},{"n":"Grand Army Plaza","x":391.5,"y":387.6,"l":["2","3","4"],"lat":40.6753,"lng":-73.97096},{"n":"Bergen St","x":386.3,"y":379.1,"l":["2","3","4"],"lat":40.68086,"lng":-73.975},{"n":"Atlantic Ave","x":383.1,"y":373.7,"l":["2","3","4","5"],"lat":40.68442,"lng":-73.97755},{"n":"Rockaway Ave","x":466.2,"y":383.0,"l":["A","C"],"lat":40.67834,"lng":-73.91195},{"n":"Fulton St","x":385.9,"y":369.6,"l":["G"],"lat":40.68712,"lng":-73.97537},{"n":"Clinton - Washington Aves","x":396.7,"y":368.1,"l":["G"],"lat":40.68809,"lng":-73.9668},{"n":"7th Ave","x":389.1,"y":384.8,"l":["B","Q"],"lat":40.6771,"lng":-73.97285},{"n":"Atlantic Ave","x":384.1,"y":373.6,"l":["B","Q"],"lat":40.68449,"lng":-73.97678},{"n":"Union St","x":376.1,"y":384.5,"l":["D","N","R"],"lat":40.67732,"lng":-73.98311},{"n":"Atlantic Av - Pacific St","x":381.5,"y":374.9,"l":["D","N","R"],"lat":40.68367,"lng":-73.97881},{"n":"Borough Hall","x":367.1,"y":361.6,"l":["4","5"],"lat":40.6924,"lng":-73.99015},{"n":"Aqueduct Racetrack (To Manh Only)","x":562.5,"y":392.5,"l":["A"],"lat":40.6721,"lng":-73.83592},{"n":"DeKalb Ave","x":377.7,"y":364.3,"l":["B","D","N","Q","R"],"lat":40.69064,"lng":-73.98182},{"n":"Morris Park","x":531.4,"y":115.1,"l":["5"],"lat":40.85436,"lng":-73.86049},{"n":"Pelham Pkwy","x":537.9,"y":108.1,"l":["5"],"lat":40.85899,"lng":-73.85536},{"n":"Nostrand Ave","x":417.5,"y":379.8,"l":["A","C"],"lat":40.68044,"lng":-73.95043},{"n":"Nevins St","x":379.5,"y":367.8,"l":["2","3","4","5"],"lat":40.68831,"lng":-73.98041},{"n":"Eastern Pkwy - Bklyn Museum","x":400.0,"y":392.6,"l":["2","3","4"],"lat":40.67203,"lng":-73.96422},{"n":"Franklin Ave","x":407.7,"y":394.5,"l":["2","3","4","5"],"lat":40.67077,"lng":-73.9581},{"n":"Beverly Rd","x":419.5,"y":433.5,"l":["2","5"],"lat":40.64512,"lng":-73.94885},{"n":"Church Ave","x":418.7,"y":424.8,"l":["2","5"],"lat":40.65086,"lng":-73.94946},{"n":"Newkirk Ave","x":420.2,"y":441.3,"l":["2","5"],"lat":40.63999,"lng":-73.9483},{"n":"Brooklyn College - Flatbush Ave","x":421.1,"y":452.2,"l":["2","5"],"lat":40.63284,"lng":-73.94754},{"n":"Winthrop St","x":417.9,"y":416.0,"l":["2","5"],"lat":40.65666,"lng":-73.95008},{"n":"Sterling St","x":417.1,"y":406.6,"l":["2","5"],"lat":40.66277,"lng":-73.95073},{"n":"Crown Hts - Utica Ave","x":439.6,"y":397.2,"l":["3","4"],"lat":40.66898,"lng":-73.93293},{"n":"Kingston Ave","x":427.9,"y":396.4,"l":["3","4"],"lat":40.66948,"lng":-73.94216},{"n":"Kingston - Throop Aves","x":429.6,"y":380.6,"l":["A","C"],"lat":40.67992,"lng":-73.94086},{"n":"Nassau Ave","x":416.5,"y":312.7,"l":["G"],"lat":40.72448,"lng":-73.95118},{"n":"Greenpoint Ave","x":412.4,"y":302.4,"l":["G"],"lat":40.73127,"lng":-73.95443},{"n":"Marcy Ave","x":408.1,"y":337.2,"l":["J","M","Z"],"lat":40.70838,"lng":-73.95783},{"n":"Hewes St","x":413.6,"y":339.5,"l":["J","M"],"lat":40.70689,"lng":-73.95349},{"n":"Essex St","x":370.6,"y":322.1,"l":["J","M","Z"],"lat":40.71831,"lng":-73.98741},{"n":"138th St - Grand Concourse","x":443.5,"y":177.7,"l":["4","5"],"lat":40.81322,"lng":-73.92985},{"n":"5th Ave - 53rd St","x":386.0,"y":258.6,"l":["E","M"],"lat":40.76009,"lng":-73.97525},{"n":"Lexington Ave - 53rd St","x":393.8,"y":262.5,"l":["E","M"],"lat":40.75747,"lng":-73.96907},{"n":"28th St","x":369.0,"y":280.8,"l":["N","R"],"lat":40.74545,"lng":-73.9887},{"n":"Herald Sq - 34th St","x":369.9,"y":274.5,"l":["N","Q","R"],"lat":40.74964,"lng":-73.98794},{"n":"1st Ave","x":377.9,"y":302.9,"l":["L"],"lat":40.73098,"lng":-73.98168},{"n":"Grand Central - 42nd St","x":381.0,"y":269.7,"l":["S"],"lat":40.75277,"lng":-73.97919},{"n":"Times Sq - 42nd St","x":372.1,"y":264.8,"l":["S"],"lat":40.75598,"lng":-73.98623},{"n":"42nd St - Bryant Pk","x":374.2,"y":267.5,"l":["B","D","F","M"],"lat":40.75418,"lng":-73.98459},{"n":"Times Sq - 42nd St","x":371.4,"y":266.9,"l":["N","Q","R"],"lat":40.75461,"lng":-73.98677},{"n":"Metropolitan Ave","x":416.2,"y":330.6,"l":["G"],"lat":40.71277,"lng":-73.95142},{"n":"Grand St","x":430.0,"y":332.4,"l":["L"],"lat":40.71158,"lng":-73.9405},{"n":"Graham Ave","x":425.7,"y":327.8,"l":["L"],"lat":40.71458,"lng":-73.94394},{"n":"Lorimer St","x":417.7,"y":328.6,"l":["L"],"lat":40.71407,"lng":-73.95025},{"n":"Bedford Ave","x":409.6,"y":323.9,"l":["L"],"lat":40.71717,"lng":-73.95666},{"n":"Broadway","x":417.6,"y":340.7,"l":["G"],"lat":40.70613,"lng":-73.95031},{"n":"Lorimer St","x":421.4,"y":344.1,"l":["J","M"],"lat":40.70384,"lng":-73.94735},{"n":"Montrose Ave","x":430.9,"y":338.8,"l":["L"],"lat":40.70739,"lng":-73.93979},{"n":"23rd St - Ely Av","x":423.0,"y":277.3,"l":["E","M"],"lat":40.74777,"lng":-73.94605},{"n":"Long Island City - Court Sq","x":425.8,"y":279.5,"l":["G"],"lat":40.74631,"lng":-73.94382},{"n":"21st St","x":418.5,"y":282.8,"l":["G"],"lat":40.74413,"lng":-73.9496},{"n":"39th Ave","x":439.7,"y":269.7,"l":["N","Q"],"lat":40.75276,"lng":-73.93285},{"n":"36th Ave","x":443.5,"y":264.1,"l":["N","Q"],"lat":40.75644,"lng":-73.92986},{"n":"145th St","x":417.5,"y":157.4,"l":["1"],"lat":40.82655,"lng":-73.95036},{"n":"157th St","x":424.5,"y":146.0,"l":["1"],"lat":40.83404,"lng":-73.94489},{"n":"96th St","x":389.7,"y":207.1,"l":["1","2","3"],"lat":40.79392,"lng":-73.97232},{"n":"103rd St","x":394.7,"y":198.7,"l":["1"],"lat":40.79945,"lng":-73.96838},{"n":"Central Park North (110th St)","x":415.7,"y":199.2,"l":["2","3"],"lat":40.79908,"lng":-73.95182},{"n":"103rd St","x":403.6,"y":203.8,"l":["A","B","C"],"lat":40.79606,"lng":-73.96137},{"n":"Cathedral Pkwy (110th St)","x":407.8,"y":196.9,"l":["A","B","C"],"lat":40.80058,"lng":-73.95807},{"n":"72nd St","x":377.5,"y":230.6,"l":["1","2","3"],"lat":40.77845,"lng":-73.98197},{"n":"72nd St","x":384.6,"y":235.1,"l":["A","B","C"],"lat":40.77552,"lng":-73.97634},{"n":"81st St","x":390.0,"y":226.2,"l":["A","B","C"],"lat":40.78135,"lng":-73.9721},{"n":"75th Ave","x":561.2,"y":322.5,"l":["E","F"],"lat":40.71804,"lng":-73.83692},{"n":"Kew Gardens - Union Tpke","x":569.5,"y":328.6,"l":["E","F"],"lat":40.71404,"lng":-73.83037},{"n":"86th St","x":394.2,"y":219.4,"l":["A","B","C"],"lat":40.78582,"lng":-73.96883},{"n":"96th St","x":399.5,"y":210.6,"l":["A","B","C"],"lat":40.79162,"lng":-73.9646},{"n":"Cathedral Pkwy (110th St)","x":396.7,"y":191.8,"l":["1"],"lat":40.80397,"lng":-73.96685},{"n":"116th St - Columbia University","x":400.1,"y":186.1,"l":["1"],"lat":40.80772,"lng":-73.96411},{"n":"125th St","x":423.7,"y":186.0,"l":["2","3"],"lat":40.80775,"lng":-73.9455},{"n":"135th St","x":429.7,"y":176.2,"l":["2","3"],"lat":40.81423,"lng":-73.94077},{"n":"149th St - Grand Concourse","x":446.6,"y":170.0,"l":["4"],"lat":40.8183,"lng":-73.92738},{"n":"116th St","x":418.5,"y":194.6,"l":["2","3"],"lat":40.8021,"lng":-73.94963},{"n":"Tremont Ave","x":474.7,"y":121.1,"l":["B","D"],"lat":40.85041,"lng":-73.90523},{"n":"182nd-183rd Sts","x":480.4,"y":112.5,"l":["B","D"],"lat":40.85609,"lng":-73.90074},{"n":"137th St - City College","x":413.3,"y":164.3,"l":["1"],"lat":40.82201,"lng":-73.95368},{"n":"145th St","x":435.4,"y":166.8,"l":["3"],"lat":40.82042,"lng":-73.93624},{"n":"176th St","x":466.4,"y":124.1,"l":["4"],"lat":40.84848,"lng":-73.91179},{"n":"Burnside Ave","x":471.6,"y":116.5,"l":["4"],"lat":40.85345,"lng":-73.90768},{"n":"170th St","x":464.4,"y":138.0,"l":["B","D"],"lat":40.83931,"lng":-73.9134},{"n":"174th-175th Sts","x":468.5,"y":128.0,"l":["B","D"],"lat":40.8459,"lng":-73.91014},{"n":"168th St","x":430.5,"y":136.1,"l":["1"],"lat":40.84056,"lng":-73.94013},{"n":"181st St","x":438.8,"y":122.5,"l":["1"],"lat":40.84951,"lng":-73.9336},{"n":"168th St","x":431.2,"y":135.9,"l":["A","C"],"lat":40.84072,"lng":-73.93956},{"n":"191st St","x":444.1,"y":113.8,"l":["1"],"lat":40.85523,"lng":-73.92941},{"n":"175th St","x":431.0,"y":125.7,"l":["A"],"lat":40.84739,"lng":-73.9397},{"n":"Beach 44th St","x":638.4,"y":512.9,"l":["A"],"lat":40.59294,"lng":-73.77601},{"n":"Beach 60th St","x":622.5,"y":513.8,"l":["A"],"lat":40.59237,"lng":-73.78852},{"n":"Beach 105th St","x":573.1,"y":527.6,"l":["A","S"],"lat":40.58327,"lng":-73.82758},{"n":"Beach 98th St","x":582.0,"y":524.4,"l":["A","S"],"lat":40.58539,"lng":-73.82052},{"n":"Rockaway Park - Beach 116 St","x":562.9,"y":531.2,"l":["A","S"],"lat":40.58096,"lng":-73.83559},{"n":"Beach 90th St","x":590.7,"y":520.3,"l":["A","S"],"lat":40.58809,"lng":-73.81365},{"n":"Beach 36th St","x":648.3,"y":509.2,"l":["A"],"lat":40.5954,"lng":-73.76817},{"n":"Beach 25th St","x":657.0,"y":502.1,"l":["A"],"lat":40.60007,"lng":-73.76135},{"n":"Parsons Blvd","x":603.8,"y":338.5,"l":["F"],"lat":40.70757,"lng":-73.80329},{"n":"169th St","x":616.3,"y":334.0,"l":["F"],"lat":40.71052,"lng":-73.79347},{"n":"103rd St - Corona Plaza","x":528.6,"y":274.1,"l":["7"],"lat":40.74987,"lng":-73.8627},{"n":"111th St","x":537.9,"y":271.3,"l":["7"],"lat":40.75173,"lng":-73.85533},{"n":"63rd Dr - Rego Park","x":530.0,"y":304.7,"l":["E","M","R"],"lat":40.72976,"lng":-73.86162},{"n":"Grant Ave","x":525.6,"y":384.9,"l":["A","S"],"lat":40.67704,"lng":-73.86505},{"n":"79th St","x":380.1,"y":222.3,"l":["1","2"],"lat":40.78393,"lng":-73.97992},{"n":"Atlantic Ave","x":477.4,"y":387.5,"l":["L"],"lat":40.67534,"lng":-73.9031},{"n":"Christopher St - Sheridan Sq","x":351.0,"y":299.1,"l":["1","2"],"lat":40.73342,"lng":-74.00291},{"n":"E 149th St","x":476.1,"y":179.4,"l":["6"],"lat":40.81212,"lng":-73.9041},{"n":"Ozone Park - Lefferts Blvd","x":575.3,"y":371.4,"l":["A","S"],"lat":40.68595,"lng":-73.8258},{"n":"Times Sq - 42nd St","x":370.3,"y":265.6,"l":["7"],"lat":40.75548,"lng":-73.98769},{"n":"77th St","x":405.5,"y":238.0,"l":["4","6"],"lat":40.77362,"lng":-73.95987},{"n":"Woodside - 61st St","x":477.6,"y":280.6,"l":["7"],"lat":40.74563,"lng":-73.90298},{"n":"111th St","x":567.3,"y":373.8,"l":["A","S"],"lat":40.68433,"lng":-73.83216},{"n":"Flushing - Main St","x":570.0,"y":259.3,"l":["7"],"lat":40.7596,"lng":-73.83003},{"n":"W 8th St - NY Aquarium","x":385.1,"y":538.6,"l":["F","Q"],"lat":40.57603,"lng":-73.97596},{"n":"28th St","x":363.1,"y":278.2,"l":["1","2"],"lat":40.74722,"lng":-73.99337},{"n":"28th St","x":374.6,"y":284.5,"l":["4","6"],"lat":40.74307,"lng":-73.98426},{"n":"Pelham Bay Park","x":572.4,"y":118.0,"l":["6"],"lat":40.85246,"lng":-73.82812},{"n":"Westchester Sq - E Tremont Ave","x":553.6,"y":137.1,"l":["6"],"lat":40.83989,"lng":-73.84295},{"n":"18th St","x":357.4,"y":287.5,"l":["1","2"],"lat":40.74104,"lng":-73.99787},{"n":"Grand Central - 42nd St","x":384.2,"y":271.2,"l":["4","5","6"],"lat":40.75181,"lng":-73.97671},{"n":"Grand Central - 42nd St","x":385.0,"y":271.7,"l":["7"],"lat":40.75143,"lng":-73.97604},{"n":"Canal St","x":354.4,"y":321.4,"l":["4","6"],"lat":40.7188,"lng":-74.00019},{"n":"Beach 67th St","x":611.9,"y":516.0,"l":["A"],"lat":40.59093,"lng":-73.79692},{"n":"W 4th St - Washington Sq (Upper)","x":354.0,"y":300.8,"l":["A","C","E"],"lat":40.73234,"lng":-74.0005},{"n":"67th Ave","x":541.0,"y":309.7,"l":["E","M","R"],"lat":40.72651,"lng":-73.85286},{"n":"85th St - Forest Pky","x":531.9,"y":361.5,"l":["J"],"lat":40.69243,"lng":-73.86009},{"n":"Woodhaven Blvd","x":542.1,"y":359.6,"l":["J","Z"],"lat":40.6937,"lng":-73.85205},{"n":"111th St","x":561.4,"y":354.4,"l":["J"],"lat":40.69712,"lng":-73.83679},{"n":"121st St","x":572.1,"y":349.3,"l":["J","Z"],"lat":40.70048,"lng":-73.82835},{"n":"Sutphin Blvd - Archer Av","x":597.9,"y":349.4,"l":["E","J","Z"],"lat":40.70038,"lng":-73.808},{"n":"Halsey St","x":476.4,"y":356.8,"l":["L"],"lat":40.69552,"lng":-73.90393},{"n":"Myrtle Ave","x":467.4,"y":350.8,"l":["L"],"lat":40.69947,"lng":-73.91098},{"n":"New Lots Ave","x":501.5,"y":401.3,"l":["3","4"],"lat":40.66632,"lng":-73.88411},{"n":"Van Siclen Ave","x":494.8,"y":402.5,"l":["3","4"],"lat":40.66552,"lng":-73.8894},{"n":"Pennsylvania Ave","x":487.8,"y":403.7,"l":["3","4"],"lat":40.66471,"lng":-73.89489},{"n":"Van Siclen Ave","x":493.5,"y":391.5,"l":["A","C"],"lat":40.67271,"lng":-73.89036},{"n":"Van Siclen Ave","x":491.9,"y":383.4,"l":["J","Z"],"lat":40.67803,"lng":-73.89166},{"n":"Cleveland St","x":500.1,"y":380.8,"l":["J"],"lat":40.67978,"lng":-73.88519},{"n":"Livonia Ave","x":480.6,"y":404.7,"l":["L"],"lat":40.66406,"lng":-73.90056},{"n":"Sutter Ave","x":478.9,"y":397.0,"l":["L"],"lat":40.66915,"lng":-73.90192},{"n":"Junius St","x":478.2,"y":405.4,"l":["3","4"],"lat":40.66359,"lng":-73.90245},{"n":"Rockaway Ave","x":470.0,"y":406.9,"l":["3","4"],"lat":40.66262,"lng":-73.90896},{"n":"Canarsie - Rockaway Pkwy","x":479.0,"y":431.2,"l":["L"],"lat":40.64665,"lng":-73.90185},{"n":"E 105th St","x":481.9,"y":425.4,"l":["L"],"lat":40.65047,"lng":-73.89955},{"n":"Saratoga Ave","x":460.6,"y":408.5,"l":["3","4"],"lat":40.66153,"lng":-73.91633},{"n":"Sutter Ave - Rutland Road","x":452.8,"y":403.6,"l":["3","4"],"lat":40.66477,"lng":-73.92252},{"n":"New Lots Ave","x":482.2,"y":412.5,"l":["L"],"lat":40.65892,"lng":-73.89928},{"n":"Far Rockaway - Mott Ave","x":664.5,"y":496.1,"l":["A"],"lat":40.604,"lng":-73.7554},{"n":"Chauncey St","x":468.2,"y":376.1,"l":["J","Z"],"lat":40.68285,"lng":-73.91038},{"n":"Broadway Junction","x":475.9,"y":381.4,"l":["J","Z"],"lat":40.67937,"lng":-73.90429},{"n":"Halsey St","x":460.3,"y":370.7,"l":["J"],"lat":40.68642,"lng":-73.91664},{"n":"Alabama Ave","x":483.2,"y":385.0,"l":["J"],"lat":40.677,"lng":-73.89853},{"n":"Shepherd Ave","x":505.7,"y":389.4,"l":["A","C"],"lat":40.67413,"lng":-73.88075},{"n":"Norwood Ave","x":507.1,"y":378.1,"l":["J","Z"],"lat":40.68152,"lng":-73.87963},{"n":"Crescent St","x":514.4,"y":375.6,"l":["J","Z"],"lat":40.68315,"lng":-73.87393},{"n":"Cypress Hills","x":515.1,"y":365.8,"l":["J"],"lat":40.68962,"lng":-73.87332},{"n":"75th St - Eldert Ln","x":522.8,"y":363.3,"l":["J","Z"],"lat":40.69129,"lng":-73.86729},{"n":"69th St","x":485.9,"y":279.5,"l":["7"],"lat":40.74633,"lng":-73.8964},{"n":"74th St - Broadway","x":492.5,"y":278.7,"l":["7"],"lat":40.74687,"lng":-73.89121},{"n":"65th St","x":482.9,"y":274.3,"l":["E","M","R"],"lat":40.74972,"lng":-73.89879},{"n":"Woodhaven Blvd - Queens Mall","x":520.1,"y":299.6,"l":["E","M","R"],"lat":40.7331,"lng":-73.86943},{"n":"Wyckoff Ave","x":465.9,"y":350.8,"l":["M"],"lat":40.69945,"lng":-73.91218},{"n":"Seneca Ave","x":471.7,"y":345.6,"l":["M"],"lat":40.70292,"lng":-73.90758},{"n":"DeKalb Ave","x":458.2,"y":344.4,"l":["L"],"lat":40.70369,"lng":-73.91823},{"n":"52nd St","x":465.4,"y":282.8,"l":["7"],"lat":40.74415,"lng":-73.91255},{"n":"46th St","x":464.2,"y":264.3,"l":["E","M","R"],"lat":40.75632,"lng":-73.91352},{"n":"Northern Blvd","x":473.7,"y":269.6,"l":["E","M","R"],"lat":40.75283,"lng":-73.90607},{"n":"46th St","x":458.0,"y":284.4,"l":["7"],"lat":40.74313,"lng":-73.91844},{"n":"82nd St - Jackson Hts","x":502.0,"y":277.5,"l":["7"],"lat":40.74766,"lng":-73.8837},{"n":"90th St - Elmhurst Av","x":511.0,"y":276.3,"l":["7"],"lat":40.74841,"lng":-73.87661},{"n":"Grand Ave - Newtown","x":510.2,"y":294.0,"l":["E","M","R"],"lat":40.73681,"lng":-73.87722},{"n":"Elmhurst Ave","x":504.1,"y":285.5,"l":["E","M","R"],"lat":40.74237,"lng":-73.88203},{"n":"Howard Beach - JFK Airport","x":569.6,"y":410.1,"l":["A"],"lat":40.66048,"lng":-73.8303},{"n":"Aqueduct - North Conduit Av","x":564.9,"y":398.3,"l":["A"],"lat":40.66823,"lng":-73.83406},{"n":"104th-102nd Sts","x":551.7,"y":357.4,"l":["J","Z"],"lat":40.69517,"lng":-73.84443},{"n":"Briarwood - Van Wyck Blvd","x":581.8,"y":336.1,"l":["E","F"],"lat":40.70916,"lng":-73.82069},{"n":"Forest Hills - 71st Av","x":551.6,"y":317.1,"l":["E","F","M","R"],"lat":40.72159,"lng":-73.84452},{"n":"Sutphin Blvd","x":594.3,"y":341.8,"l":["F"],"lat":40.70542,"lng":-73.81083},{"n":"Jamaica - Van Wyck","x":586.5,"y":345.6,"l":["E"],"lat":40.7029,"lng":-73.81701},{"n":"Jamaica Ctr - Parsons / Archer","x":606.6,"y":346.9,"l":["E","J","Z"],"lat":40.70207,"lng":-73.8011},{"n":"Simpson St","x":490.1,"y":161.3,"l":["2","5"],"lat":40.82398,"lng":-73.89307},{"n":"Freeman St","x":491.8,"y":152.2,"l":["2","5"],"lat":40.82999,"lng":-73.89175},{"n":"225th St","x":531.7,"y":63.9,"l":["2","5"],"lat":40.88803,"lng":-73.86021},{"n":"Elder Ave","x":507.7,"y":154.3,"l":["6"],"lat":40.82858,"lng":-73.87916},{"n":"Morrison Av - Soundview","x":513.6,"y":152.9,"l":["6"],"lat":40.82952,"lng":-73.87452},{"n":"Longwood Ave","x":485.8,"y":173.3,"l":["6"],"lat":40.8161,"lng":-73.89643},{"n":"Astoria Blvd","x":458.4,"y":243.4,"l":["N","Q"],"lat":40.77004,"lng":-73.9181},{"n":"Astoria - Ditmars Blvd","x":466.1,"y":235.8,"l":["N","Q"],"lat":40.77504,"lng":-73.91203},{"n":"Jackson Ave","x":471.6,"y":172.8,"l":["2","5"],"lat":40.81644,"lng":-73.9077},{"n":"Prospect Ave","x":479.1,"y":168.2,"l":["2","5"],"lat":40.81949,"lng":-73.90178},{"n":"Cypress Ave","x":463.5,"y":189.7,"l":["6"],"lat":40.80537,"lng":-73.91404},{"n":"Whitlock Ave","x":498.7,"y":157.5,"l":["6"],"lat":40.82653,"lng":-73.88628},{"n":"Intervale Ave","x":485.6,"y":164.1,"l":["2","5"],"lat":40.82214,"lng":-73.89662},{"n":"174th St","x":496.9,"y":141.2,"l":["2","5"],"lat":40.8372,"lng":-73.88769},{"n":"Pelham Pkwy","x":522.5,"y":110.8,"l":["2","5"],"lat":40.85719,"lng":-73.86748},{"n":"Allerton Ave","x":522.8,"y":98.2,"l":["2","5"],"lat":40.86548,"lng":-73.86723},{"n":"E 143rd St - St Mary's St","x":471.6,"y":184.6,"l":["6"],"lat":40.80872,"lng":-73.90766},{"n":"Kingsbridge Rd","x":484.9,"y":94.7,"l":["4"],"lat":40.86776,"lng":-73.89717},{"n":"Bedford Park Blvd - Lehman College","x":493.9,"y":86.1,"l":["4"],"lat":40.87341,"lng":-73.89006},{"n":"Harlem - 148 St","x":435.1,"y":161.5,"l":["3"],"lat":40.82388,"lng":-73.93647},{"n":"Mt Eden Ave","x":462.7,"y":130.2,"l":["4"],"lat":40.84443,"lng":-73.91468},{"n":"Fordham Rd","x":484.2,"y":104.5,"l":["B","D"],"lat":40.8613,"lng":-73.89775},{"n":"170th St","x":458.8,"y":136.8,"l":["4"],"lat":40.84008,"lng":-73.91779},{"n":"Kingsbridge Rd","x":489.6,"y":95.9,"l":["B","D"],"lat":40.86698,"lng":-73.89351},{"n":"Bedford Park Blvd","x":497.6,"y":86.4,"l":["B","D"],"lat":40.87324,"lng":-73.88714},{"n":"Marble Hill - 225th St","x":468.9,"y":84.4,"l":["1"],"lat":40.87456,"lng":-73.90983},{"n":"231st St","x":475.2,"y":77.8,"l":["1"],"lat":40.87886,"lng":-73.90483},{"n":"215th St","x":462.0,"y":92.1,"l":["1"],"lat":40.86944,"lng":-73.91528},{"n":"207th St","x":457.5,"y":99.5,"l":["1"],"lat":40.86461,"lng":-73.91882},{"n":"Inwood - 207th St","x":456.1,"y":94.2,"l":["A"],"lat":40.86807,"lng":-73.9199},{"n":"238th St","x":480.2,"y":69.0,"l":["1"],"lat":40.88467,"lng":-73.90087},{"n":"Van Cortlandt Park - 242nd St","x":483.1,"y":62.0,"l":["1"],"lat":40.88925,"lng":-73.89858},{"n":"West Farms Sq - E Tremont Av","x":506.7,"y":136.6,"l":["2","5"],"lat":40.84021,"lng":-73.87996},{"n":"St Lawrence Ave","x":522.4,"y":149.9,"l":["6"],"lat":40.83151,"lng":-73.86762},{"n":"Bronx Park East","x":521.4,"y":123.6,"l":["2","5"],"lat":40.84877,"lng":-73.86836},{"n":"Gun Hill Rd","x":524.2,"y":79.4,"l":["2","5"],"lat":40.87784,"lng":-73.86613},{"n":"219th St","x":528.8,"y":70.2,"l":["2","5"],"lat":40.88389,"lng":-73.86251},{"n":"Mosholu Pkwy","x":500.8,"y":76.5,"l":["4"],"lat":40.87975,"lng":-73.88465},{"n":"Norwood - 205th St","x":508.1,"y":84.0,"l":["D"],"lat":40.87481,"lng":-73.87885},{"n":"Burke Ave","x":523.1,"y":89.4,"l":["2","5"],"lat":40.87126,"lng":-73.86705},{"n":"Baychester Ave","x":559.1,"y":78.1,"l":["5"],"lat":40.87866,"lng":-73.83859},{"n":"Eastchester - Dyre Ave","x":568.9,"y":63.5,"l":["5"],"lat":40.8883,"lng":-73.83083},{"n":"Jamaica - 179th St","x":628.5,"y":330.8,"l":["F"],"lat":40.71265,"lng":-73.78382},{"n":"Wakefield - 241st St","x":543.9,"y":40.9,"l":["2"],"lat":40.90313,"lng":-73.85062},{"n":"Botanic Garden","x":406.3,"y":395.1,"l":["S"],"lat":40.67034,"lng":-73.95924},{"n":"Bushwick - Aberdeen","x":474.7,"y":376.1,"l":["L"],"lat":40.68286,"lng":-73.90526},{"n":"Wilson Ave","x":476.3,"y":366.9,"l":["L"],"lat":40.68887,"lng":-73.90396},{"n":"Broadway Junction","x":477.4,"y":382.8,"l":["L"],"lat":40.67846,"lng":-73.90312},{"n":"Gun Hill Rd","x":549.2,"y":92.0,"l":["5"],"lat":40.86953,"lng":-73.84638},{"n":"E 180th St","x":515.1,"y":134.1,"l":["2","5"],"lat":40.84186,"lng":-73.87335},{"n":"Dyckman St","x":449.0,"y":105.7,"l":["1"],"lat":40.86053,"lng":-73.92554},{"n":"125th St","x":407.4,"y":174.1,"l":["1"],"lat":40.81558,"lng":-73.95837},{"n":"Park Pl","x":408.3,"y":388.4,"l":["S"],"lat":40.67477,"lng":-73.95762},{"n":"Franklin Ave - Fulton St","x":410.6,"y":379.5,"l":["S"],"lat":40.6806,"lng":-73.95583},{"n":"Nereid Ave (238 St)","x":539.2,"y":48.3,"l":["2","5"],"lat":40.89829,"lng":-73.85432},{"n":"149th St - Grand Concourse","x":447.5,"y":169.9,"l":["2","5"],"lat":40.81833,"lng":-73.92672},{"n":"3rd Ave - 149th St","x":458.8,"y":173.4,"l":["2","5"],"lat":40.81603,"lng":-73.91779},{"n":"161st St - Yankee Stadium","x":448.8,"y":154.9,"l":["4"],"lat":40.82823,"lng":-73.92569},{"n":"167th St","x":454.2,"y":143.7,"l":["4"],"lat":40.83554,"lng":-73.9214},{"n":"Brook Ave","x":457.0,"y":186.3,"l":["6"],"lat":40.80757,"lng":-73.91924},{"n":"33rd St","x":442.1,"y":282.1,"l":["7"],"lat":40.74459,"lng":-73.931},{"n":"40th St","x":450.9,"y":283.4,"l":["7"],"lat":40.74378,"lng":-73.92402},{"n":"145th St","x":425.5,"y":160.1,"l":["A","B","C","D"],"lat":40.82477,"lng":-73.94409},{"n":"155th St","x":432.9,"y":152.0,"l":["B","D"],"lat":40.83014,"lng":-73.93821},{"n":"161st St - Yankee Stadium","x":448.8,"y":155.4,"l":["B","D"],"lat":40.82791,"lng":-73.92565},{"n":"167th St","x":458.0,"y":146.4,"l":["B","D"],"lat":40.83377,"lng":-73.91843},{"n":"Ralph Ave","x":455.0,"y":382.2,"l":["A","C"],"lat":40.67882,"lng":-73.92079},{"n":"Utica Ave","x":442.4,"y":381.4,"l":["A","C"],"lat":40.67936,"lng":-73.93073},{"n":"36th St","x":444.6,"y":270.9,"l":["E","M","R"],"lat":40.75196,"lng":-73.92902},{"n":"Steinway St","x":455.3,"y":263.3,"l":["E","M","R"],"lat":40.75699,"lng":-73.92053},{"n":"Kosciuszko St","x":445.2,"y":360.4,"l":["J"],"lat":40.69317,"lng":-73.92851},{"n":"Gates Ave","x":453.3,"y":365.8,"l":["J","Z"],"lat":40.68958,"lng":-73.92216},{"n":"Central Ave","x":446.8,"y":353.2,"l":["M"],"lat":40.69787,"lng":-73.92724},{"n":"Knickerbocker Ave","x":456.4,"y":352.0,"l":["M"],"lat":40.69866,"lng":-73.91972},{"n":"Broadway","x":448.6,"y":256.5,"l":["N","Q"],"lat":40.76143,"lng":-73.92582},{"n":"30th Ave","x":454.1,"y":248.4,"l":["N","Q"],"lat":40.76678,"lng":-73.92148},{"n":"Jefferson St","x":452.3,"y":339.9,"l":["L"],"lat":40.70661,"lng":-73.92291},{"n":"Morgan Ave","x":439.3,"y":340.6,"l":["L"],"lat":40.70615,"lng":-73.93315},{"n":"Queens Plz","x":434.3,"y":275.6,"l":["E","M","R"],"lat":40.74892,"lng":-73.93714},{"n":"18th Ave","x":383.8,"y":456.9,"l":["F"],"lat":40.62976,"lng":-73.97697},{"n":"Ditmas Ave","x":382.3,"y":447.2,"l":["F"],"lat":40.63612,"lng":-73.97817},{"n":"77th St","x":322.4,"y":456.9,"l":["R"],"lat":40.62974,"lng":-74.02551},{"n":"Bay Ridge Ave","x":325.1,"y":449.0,"l":["R"],"lat":40.63497,"lng":-74.02338},{"n":"55th St","x":360.6,"y":454.3,"l":["D"],"lat":40.63148,"lng":-73.99535},{"n":"50th St","x":361.4,"y":447.0,"l":["D"],"lat":40.63626,"lng":-73.99466},{"n":"Ft Hamilton Pkwy","x":347.9,"y":454.4,"l":["N"],"lat":40.63139,"lng":-74.00535},{"n":"8th Ave","x":340.1,"y":449.0,"l":["N"],"lat":40.63497,"lng":-74.01152},{"n":"25th Ave","x":371.3,"y":505.7,"l":["D"],"lat":40.5977,"lng":-73.98683},{"n":"Bay Pky","x":362.7,"y":499.2,"l":["D"],"lat":40.60195,"lng":-73.99368},{"n":"20th Ave","x":374.3,"y":476.1,"l":["N"],"lat":40.61711,"lng":-73.98452},{"n":"18th Ave","x":366.8,"y":470.7,"l":["N"],"lat":40.62069,"lng":-73.99045},{"n":"Bay Ridge - 95th St","x":315.6,"y":476.9,"l":["R"],"lat":40.61662,"lng":-74.03088},{"n":"86th St","x":318.7,"y":467.7,"l":["R"],"lat":40.62269,"lng":-74.0284},{"n":"79th St","x":353.9,"y":482.1,"l":["D"],"lat":40.61316,"lng":-74.00058},{"n":"71st St","x":356.1,"y":472.9,"l":["D"],"lat":40.61926,"lng":-73.99884},{"n":"20th Ave","x":357.0,"y":495.1,"l":["D"],"lat":40.60468,"lng":-73.99817},{"n":"18th Ave","x":352.6,"y":490.4,"l":["D"],"lat":40.60774,"lng":-74.00159},{"n":"62nd St","x":358.6,"y":462.3,"l":["D"],"lat":40.62622,"lng":-73.99686},{"n":"New Utrecht Ave","x":359.3,"y":464.4,"l":["N"],"lat":40.62484,"lng":-73.99635},{"n":"Ave U","x":388.4,"y":508.4,"l":["F"],"lat":40.59593,"lng":-73.97338},{"n":"Kings Hwy","x":389.7,"y":497.2,"l":["F"],"lat":40.60326,"lng":-73.97236},{"n":"Brighton Beach","x":403.6,"y":536.1,"l":["B","Q"],"lat":40.57771,"lng":-73.96135},{"n":"Sheepshead Bay","x":412.9,"y":522.6,"l":["B","Q"],"lat":40.58655,"lng":-73.95406},{"n":"Ave U","x":410.6,"y":503.2,"l":["B","Q"],"lat":40.59931,"lng":-73.95581},{"n":"Kings Hwy","x":408.4,"y":489.0,"l":["B","Q"],"lat":40.60864,"lng":-73.95761},{"n":"Ave U","x":381.2,"y":506.4,"l":["N"],"lat":40.59724,"lng":-73.97908},{"n":"Kings Hwy","x":379.5,"y":496.0,"l":["N"],"lat":40.60406,"lng":-73.98037},{"n":"Neptune Ave","x":386.8,"y":531.5,"l":["F"],"lat":40.58074,"lng":-73.97459},{"n":"Ave X","x":387.3,"y":518.2,"l":["F"],"lat":40.58945,"lng":-73.97427},{"n":"Bay 50th St","x":375.2,"y":519.2,"l":["D"],"lat":40.58884,"lng":-73.98377},{"n":"Gravesend - 86th St","x":382.3,"y":513.6,"l":["N"],"lat":40.59247,"lng":-73.97819},{"n":"Ave P","x":388.9,"y":488.7,"l":["F"],"lat":40.60884,"lng":-73.973},{"n":"Ave N","x":387.5,"y":480.3,"l":["F"],"lat":40.61436,"lng":-73.97405},{"n":"Bay Pky","x":386.0,"y":470.6,"l":["F"],"lat":40.62073,"lng":-73.97526},{"n":"Ave M","x":406.3,"y":475.7,"l":["B","Q"],"lat":40.6174,"lng":-73.95924},{"n":"Bay Pky","x":377.7,"y":484.7,"l":["N"],"lat":40.61146,"lng":-73.98178},{"n":"Ave I","x":385.0,"y":464.1,"l":["F"],"lat":40.62502,"lng":-73.97607},{"n":"Ave J","x":404.5,"y":464.1,"l":["B","Q"],"lat":40.62502,"lng":-73.96069},{"n":"Ave H","x":403.4,"y":457.7,"l":["B","Q"],"lat":40.62921,"lng":-73.96152},{"n":"Neck Rd","x":411.6,"y":509.3,"l":["B","Q"],"lat":40.59532,"lng":-73.95508},{"n":"21st St - Queensbridge","x":428.2,"y":268.2,"l":["F"],"lat":40.75374,"lng":-73.94194},{"n":"50th St","x":372.4,"y":255.0,"l":["A","C","E"],"lat":40.76246,"lng":-73.98598},{"n":"7th Ave","x":377.8,"y":254.2,"l":["B","D","E"],"lat":40.76297,"lng":-73.9817},{"n":"47th-50th Sts - Rockefeller Ctr","x":378.3,"y":260.8,"l":["B","D","F","M"],"lat":40.75864,"lng":-73.98133},{"n":"57th St","x":383.3,"y":252.5,"l":["F"],"lat":40.76409,"lng":-73.97737},{"n":"Lexington Ave - 63rd St","x":397.6,"y":251.7,"l":["F"],"lat":40.76462,"lng":-73.96609},{"n":"Roosevelt Island - Main St","x":413.9,"y":260.0,"l":["F"],"lat":40.75917,"lng":-73.95324},{"n":"59th St - Columbus Circle","x":377.9,"y":246.1,"l":["A","B","C","D"],"lat":40.76825,"lng":-73.98165},{"n":"49th St","x":374.7,"y":259.0,"l":["N","Q","R"],"lat":40.7598,"lng":-73.98421},{"n":"57th St","x":379.1,"y":251.7,"l":["N","Q","R"],"lat":40.76457,"lng":-73.98073},{"n":"5th Ave - 59th St","x":388.4,"y":251.4,"l":["N","Q","R"],"lat":40.76481,"lng":-73.97335},{"n":"Lexington Ave - 59th St","x":396.0,"y":254.6,"l":["N","Q","R"],"lat":40.76271,"lng":-73.96738},{"n":"34th St - Penn Station","x":366.0,"y":273.3,"l":["1","2","3"],"lat":40.75037,"lng":-73.99106},{"n":"Times Sq - 42nd St","x":370.5,"y":265.9,"l":["1","2","3"],"lat":40.75529,"lng":-73.9875},{"n":"Broadway - Nassau St","x":345.0,"y":334.5,"l":["A","C"],"lat":40.71016,"lng":-74.00762},{"n":"Chambers St","x":343.8,"y":328.5,"l":["A","C"],"lat":40.71411,"lng":-74.00858},{"n":"42nd St - Port Authority Bus Term","x":367.7,"y":262.8,"l":["A","C","E"],"lat":40.75731,"lng":-73.98974},{"n":"Myrtle-Willoughby Aves","x":419.2,"y":358.2,"l":["G"],"lat":40.69462,"lng":-73.94907},{"n":"Flushing Ave","x":417.7,"y":349.4,"l":["G"],"lat":40.70038,"lng":-73.95023},{"n":"23rd St","x":363.8,"y":284.6,"l":["F","M"],"lat":40.74295,"lng":-73.99277},{"n":"Herald Sq - 34th St","x":370.2,"y":274.2,"l":["B","D","F","M"],"lat":40.74979,"lng":-73.98777},{"n":"Hoyt - Schermerhorn Sts","x":373.6,"y":367.6,"l":["A","C","G"],"lat":40.68841,"lng":-73.98504},{"n":"Jay St - Borough Hall","x":370.9,"y":361.5,"l":["A","C","F"],"lat":40.69247,"lng":-73.98722},{"n":"East Broadway","x":367.1,"y":328.9,"l":["F"],"lat":40.71386,"lng":-73.99018},{"n":"Delancey St","x":369.8,"y":321.6,"l":["F"],"lat":40.71868,"lng":-73.98808},{"n":"Lower East Side - 2nd Ave","x":367.4,"y":314.4,"l":["F"],"lat":40.7234,"lng":-73.98994},{"n":"Flushing Ave","x":428.9,"y":349.4,"l":["J","M"],"lat":40.7004,"lng":-73.94138},{"n":"Myrtle Ave","x":436.2,"y":354.3,"l":["J","M","Z"],"lat":40.6972,"lng":-73.93562},{"n":"4th Ave","x":367.6,"y":395.2,"l":["F","G"],"lat":40.67027,"lng":-73.98978},{"n":"Smith - 9th Sts","x":359.9,"y":390.1,"l":["F","G"],"lat":40.67364,"lng":-73.99589},{"n":"Bergen St","x":366.4,"y":371.1,"l":["F","G"],"lat":40.68611,"lng":-73.99076},{"n":"Lawrence St","x":372.3,"y":361.8,"l":["N","R"],"lat":40.69226,"lng":-73.98606},{"n":"Court St","x":365.0,"y":358.8,"l":["N","R"],"lat":40.6942,"lng":-73.99182},{"n":"Union Sq - 14th St","x":366.7,"y":295.4,"l":["N","Q","R"],"lat":40.73587,"lng":-73.99054},{"n":"23rd St","x":368.2,"y":287.1,"l":["N","R"],"lat":40.7413,"lng":-73.98934},{"n":"Prospect Ave","x":363.7,"y":402.6,"l":["D","N","R"],"lat":40.66541,"lng":-73.99287},{"n":"9th St","x":369.5,"y":394.4,"l":["D","N","R"],"lat":40.67085,"lng":-73.9883},{"n":"3rd Ave","x":372.7,"y":300.3,"l":["L"],"lat":40.73269,"lng":-73.98575},{"n":"Union Sq - 14th St","x":366.5,"y":297.1,"l":["L"],"lat":40.73476,"lng":-73.99067},{"n":"Liberty Ave","x":485.7,"y":388.7,"l":["A","C"],"lat":40.67454,"lng":-73.89655},{"n":"Broadway Junction","x":474.6,"y":383.0,"l":["A","C"],"lat":40.67833,"lng":-73.90532},{"n":"59th St","x":332.0,"y":439.2,"l":["N","R"],"lat":40.64136,"lng":-74.01788},{"n":"45th St","x":342.0,"y":427.7,"l":["N","R"],"lat":40.64894,"lng":-74.01001},{"n":"36th St","x":350.2,"y":418.3,"l":["D","N","R"],"lat":40.65514,"lng":-74.00355},{"n":"9th Ave","x":361.7,"y":431.4,"l":["D"],"lat":40.64648,"lng":-73.99445},{"n":"53rd St","x":336.9,"y":433.6,"l":["N","R"],"lat":40.64507,"lng":-74.01403},{"n":"Ft Hamilton Pkwy","x":362.0,"y":439.9,"l":["D"],"lat":40.64091,"lng":-73.9942},{"n":"25th St","x":357.1,"y":410.3,"l":["D","N","R"],"lat":40.6604,"lng":-73.99809},{"n":"Carroll St","x":361.1,"y":380.0,"l":["F","G"],"lat":40.68027,"lng":-73.99495},{"n":"Spring St","x":349.9,"y":310.1,"l":["A","C","E"],"lat":40.72623,"lng":-74.00374},{"n":"181st St","x":433.2,"y":119.2,"l":["A"],"lat":40.8517,"lng":-73.93797},{"n":"190th St","x":438.0,"y":108.0,"l":["A"],"lat":40.85902,"lng":-73.93418},{"n":"116th St","x":411.9,"y":190.1,"l":["A","B","C"],"lat":40.80506,"lng":-73.9548},{"n":"125th St","x":415.2,"y":181.0,"l":["A","B","C","D"],"lat":40.81107,"lng":-73.95225},{"n":"Prince St","x":357.6,"y":313.0,"l":["N","R"],"lat":40.72433,"lng":-73.9977},{"n":"8th St - NYU","x":364.2,"y":303.6,"l":["N","R"],"lat":40.73047,"lng":-73.99251},{"n":"Fulton St","x":346.3,"y":335.7,"l":["2","3"],"lat":40.70942,"lng":-74.00657},{"n":"Park Pl","x":343.5,"y":330.1,"l":["2","3"],"lat":40.71305,"lng":-74.00881},{"n":"Chambers St","x":342.9,"y":326.4,"l":["1","2","3"],"lat":40.71548,"lng":-74.00927},{"n":"Hoyt St","x":373.6,"y":364.4,"l":["2","3"],"lat":40.69054,"lng":-73.98506},{"n":"Borough Hall","x":367.3,"y":360.3,"l":["2","3"],"lat":40.69322,"lng":-73.99},{"n":"183rd St","x":476.4,"y":108.9,"l":["4"],"lat":40.85841,"lng":-73.90388},{"n":"Fordham Rd","x":480.0,"y":102.3,"l":["4"],"lat":40.8628,"lng":-73.90103},{"n":"World Trade Center","x":342.3,"y":330.9,"l":["E"],"lat":40.71256,"lng":-74.00974},{"n":"Canal St - Holland Tunnel","x":348.0,"y":318.3,"l":["A","C","E"],"lat":40.72082,"lng":-74.00523},{"n":"155th St","x":428.7,"y":151.4,"l":["A","C"],"lat":40.83052,"lng":-73.94151},{"n":"163rd St - Amsterdam Av","x":430.8,"y":143.0,"l":["A","C"],"lat":40.83601,"lng":-73.93989},{"n":"Fulton St","x":344.6,"y":334.7,"l":["J","Z"],"lat":40.71002,"lng":-74.00794},{"n":"Chambers St","x":350.4,"y":329.9,"l":["J","Z"],"lat":40.71323,"lng":-74.00341},{"n":"Canal St","x":354.9,"y":322.3,"l":["J","Z"],"lat":40.71817,"lng":-73.99983},{"n":"City Hall","x":345.8,"y":329.8,"l":["N","R"],"lat":40.71327,"lng":-74.00699},{"n":"Canal St","x":352.4,"y":320.4,"l":["N","R"],"lat":40.71947,"lng":-74.00183},{"n":"South Ferry","x":338.0,"y":347.4,"l":["1"],"lat":40.70173,"lng":-74.01317},{"n":"Bowling Green","x":336.9,"y":342.5,"l":["4","5"],"lat":40.70491,"lng":-74.01401},{"n":"Wall St","x":339.6,"y":338.5,"l":["4","5"],"lat":40.70756,"lng":-74.01186},{"n":"Whitehall St","x":338.2,"y":345.2,"l":["N","R"],"lat":40.70314,"lng":-74.01301},{"n":"Rector St","x":338.2,"y":338.2,"l":["N","R"],"lat":40.70775,"lng":-74.01297},{"n":"Fresh Pond Rd","x":486.5,"y":340.5,"l":["M"],"lat":40.70623,"lng":-73.8959},{"n":"Middle Village - Metropolitan Ave","x":494.5,"y":332.6,"l":["M"],"lat":40.71143,"lng":-73.88958},{"n":"Rector St","x":337.2,"y":338.6,"l":["1"],"lat":40.70751,"lng":-74.01378},{"n":"Cortlandt St (Temporarily Closed)","x":339.2,"y":332.0,"l":["1"],"lat":40.71184,"lng":-74.01219},{"n":"Fulton St","x":342.6,"y":334.2,"l":["4","5"],"lat":40.71037,"lng":-74.00951},{"n":"Broad St","x":340.7,"y":340.1,"l":["J","Z"],"lat":40.70648,"lng":-74.01106},{"n":"Cortlandt St (NB only)","x":340.6,"y":334.0,"l":["N","R"],"lat":40.71051,"lng":-74.01113},{"n":"Wall St","x":343.1,"y":339.6,"l":["2","3"],"lat":40.70682,"lng":-74.0091},{"n":"Dyckman St","x":446.8,"y":98.2,"l":["A"],"lat":40.86549,"lng":-73.92727},{"n":"Grand St","x":362.6,"y":322.2,"l":["B","D"],"lat":40.71827,"lng":-73.99375},{"n":"Broadway - Lafayette St","x":359.5,"y":311.5,"l":["B","D","F","M"],"lat":40.7253,"lng":-73.9962},{"n":"Bowery","x":362.5,"y":319.2,"l":["J","Z"],"lat":40.72025,"lng":-73.99381},{"n":"Canal St","x":353.3,"y":321.4,"l":["N","Q"],"lat":40.71881,"lng":-74.00105},{"n":"23rd St","x":357.1,"y":280.1,"l":["A","C","E"],"lat":40.74591,"lng":-73.99804},{"n":"34th St - Penn Station","x":363.0,"y":270.4,"l":["A","C","E"],"lat":40.75229,"lng":-73.99339},{"n":"Jackson Hts - Roosevelt Av","x":492.4,"y":279.2,"l":["E","F","M","R"],"lat":40.74654,"lng":-73.8913},{"n":"14th St","x":354.4,"y":292.4,"l":["1","2","3"],"lat":40.73783,"lng":-74.0002},{"n":"135th St","x":421.1,"y":170.6,"l":["A","B","C"],"lat":40.81791,"lng":-73.94753},{"n":"14th St","x":359.5,"y":291.8,"l":["F","M"],"lat":40.73823,"lng":-73.99621},{"n":"6th Ave","x":357.5,"y":292.6,"l":["L"],"lat":40.73774,"lng":-73.99775},{"n":"8th Ave","x":351.4,"y":289.5,"l":["L"],"lat":40.73978,"lng":-74.00258},{"n":"14th St","x":352.5,"y":287.8,"l":["A","C","E"],"lat":40.74089,"lng":-74.00169},{"n":"Nostrand Ave","x":417.5,"y":395.7,"l":["3","4"],"lat":40.66994,"lng":-73.95043},{"n":"Clark St","x":363.4,"y":353.9,"l":["2","3"],"lat":40.69747,"lng":-73.99309},{"n":"Franklin Ave","x":409.3,"y":378.3,"l":["A","C"],"lat":40.68138,"lng":-73.95685},{"n":"Clinton - Washington Aves","x":397.9,"y":375.5,"l":["A","C"],"lat":40.68326,"lng":-73.96584},{"n":"Forest Ave","x":477.4,"y":343.3,"l":["M"],"lat":40.70441,"lng":-73.90307},{"n":"110th St","x":425.3,"y":205.4,"l":["4","6"],"lat":40.79502,"lng":-73.94425},{"n":"86th St","x":410.9,"y":229.0,"l":["4","5","6"],"lat":40.77949,"lng":-73.95559},{"n":"York St","x":371.3,"y":350.4,"l":["F"],"lat":40.69974,"lng":-73.98688},{"n":"High St","x":366.7,"y":351.0,"l":["A","C"],"lat":40.69934,"lng":-73.99053},{"n":"Lafayette Ave","x":387.7,"y":371.1,"l":["A","C"],"lat":40.68611,"lng":-73.97395},{"n":"President St","x":417.3,"y":398.9,"l":["2","5"],"lat":40.66788,"lng":-73.95059},{"n":"Woodlawn","x":508.2,"y":66.9,"l":["4"],"lat":40.88604,"lng":-73.87875},{"n":"Bleecker St (Uptown)","x":361.4,"y":310.6,"l":["4","6"],"lat":40.72591,"lng":-73.99466},{"n":"103rd St","x":421.2,"y":212.1,"l":["4","6"],"lat":40.7906,"lng":-73.94748},{"n":"Euclid Ave","x":516.7,"y":387.5,"l":["A","C","S"],"lat":40.67538,"lng":-73.87211},{"n":"88th St","x":542.8,"y":380.7,"l":["A","S"],"lat":40.67984,"lng":-73.85147},{"n":"Cortelyou Rd","x":400.5,"y":439.9,"l":["B","Q"],"lat":40.64094,"lng":-73.96379},{"n":"116th St","x":428.6,"y":199.9,"l":["4","6"],"lat":40.79863,"lng":-73.94162},{"n":"Parkchester","x":531.0,"y":147.3,"l":["6"],"lat":40.83323,"lng":-73.86082},{"n":"Franklin St","x":345.9,"y":320.6,"l":["1","2"],"lat":40.71932,"lng":-74.00689},{"n":"80th St","x":533.3,"y":381.4,"l":["A","S"],"lat":40.67937,"lng":-73.85899},{"n":"5th Ave - Bryant Pk","x":377.5,"y":268.1,"l":["7"],"lat":40.75382,"lng":-73.98196},{"n":"Spring St","x":358.3,"y":316.1,"l":["4","6"],"lat":40.7223,"lng":-73.99714},{"n":"125th St","x":433.7,"y":191.5,"l":["4","5","6"],"lat":40.80414,"lng":-73.93759},{"n":"Coney Island - Stillwell Av","x":378.4,"y":536.7,"l":["D","F","N","Q"],"lat":40.57728,"lng":-73.98124}];
const LANDMARKS = [{"n":"Bronx Park","x":511.4,"y":113.3},{"n":"Van Cortlandt Park","x":495.3,"y":51.4},{"n":"Woodlawn Cemetery","x":517.2,"y":61.1},{"n":"Seton Falls Park","x":559.1,"y":65.5},{"n":"Pelham Bay Park","x":595.6,"y":79.2},{"n":"Botanical Garden","x":508.8,"y":99.8},{"n":"Saint  Raymond's Cemetery","x":563.3,"y":162.4},{"n":"Ferry Point Park","x":566.4,"y":176.0},{"n":"Sound View Park","x":516.6,"y":174.3},{"n":"Crotona Park","x":488.6,"y":139.3},{"n":"Zoo/Wildlife Conser. Park","x":512.7,"y":123.3},{"n":"Hart Island","x":646.3,"y":119.7},{"n":"Saint Mary's Park","x":466.4,"y":180.4},{"n":"Inwood Hill Park","x":448.2,"y":88.0},{"n":"Fort Tryon Park","x":440.9,"y":102.0},{"n":"Rikers Island","x":503.2,"y":210.0},{"n":"Marcus Garvey Park","x":427.3,"y":192.6},{"n":"Randall's Island Park","x":453.8,"y":204.0},{"n":"Ward's Island Park","x":443.4,"y":221.7},{"n":"Central Park","x":398.2,"y":223.9},{"n":"Columbus Circle","x":377.6,"y":246.4},{"n":"Times Square","x":377.7,"y":261.7},{"n":"Madison Square","x":369.8,"y":285.8},{"n":"Union Square","x":366.9,"y":295.3},{"n":"Governors Island","x":331.4,"y":366.1},{"n":"McCarren Park","x":415.5,"y":318.2},{"n":"Astoria Park","x":450.6,"y":233.1},{"n":"Botanic Garden","x":397.6,"y":395.7},{"n":"Prospect Park","x":393.8,"y":409.0},{"n":"Greenwood Cemetery","x":366.8,"y":423.0},{"n":"Holy Cross Cemetery","x":433.6,"y":430.9},{"n":"Bush Terminal","x":331.1,"y":418.3},{"n":"Owls Head Park","x":313.7,"y":441.4},{"n":"Fort Hamilton","x":318.2,"y":490.9},{"n":"Dyker Beach Park","x":329.9,"y":484.7},{"n":"Washington Cemetery","x":385.8,"y":471.4},{"n":"Marine Park","x":450.8,"y":497.1},{"n":"Floyd Bennett Field","x":493.9,"y":515.4},{"n":"Canarsie Beach Park","x":483.7,"y":463.4},{"n":"Aqueduct Race Track","x":569.2,"y":392.3},{"n":"Bayside Cemetery","x":538.3,"y":384.6},{"n":"Brookville Park","x":668.3,"y":423.2},{"n":"Baisley Pond Park","x":624.6,"y":390.7},{"n":"Roy Wilkins Park","x":643.4,"y":368.4},{"n":"Forest Park","x":549.9,"y":344.5},{"n":"Cypress Hills Cemetery","x":511.6,"y":356.3},{"n":"Saint  Johns Cemetery","x":523.2,"y":326.9},{"n":"Linden Hill Cemetery","x":463.6,"y":334.0},{"n":"Mount Olivet Cemetery","x":486.5,"y":318.3},{"n":"Juniper Valley Park","x":507.1,"y":319.0},{"n":"Lutheran Cemetery","x":497.2,"y":331.4},{"n":"Montefiore Cemetery","x":681.8,"y":371.5},{"n":"Flushing Meadows Corona Park","x":555.5,"y":292.2},{"n":"Mount Hebron Cemetery","x":569.6,"y":298.1},{"n":"Kissena Park","x":602.8,"y":282.2},{"n":"Cunningham Park","x":647.2,"y":305.8},{"n":"Fort Totten","x":637.1,"y":209.2},{"n":"Clearview Park","x":622.1,"y":224.3},{"n":"Crocheron Park","x":647.3,"y":241.4},{"n":"Alley Pond Park","x":678.6,"y":268.3},{"n":"Douglaston Park","x":693.8,"y":271.4},{"n":"Fort Schuyler","x":616.7,"y":189.2},{"n":"Calvary Cemetery","x":443.2,"y":299.2},{"n":"New Calvary Cemetery","x":464.7,"y":293.6},{"n":"Mount Zion Cemetery","x":471.3,"y":301.2},{"n":"Jacob Riis Park","x":517.3,"y":551.0},{"n":"Fort Tilden","x":487.8,"y":560.6},{"n":"Liberty Island","x":297.3,"y":365.2},{"n":"Ellis Island","x":303.8,"y":351.2},{"n":"Snug Harbor","x":224.0,"y":437.8},{"n":"Silver Lake Park","x":234.8,"y":460.7},{"n":"Clove Lakes Park","x":214.4,"y":474.6},{"n":"Fort Wadsworth","x":280.2,"y":495.5},{"n":"Miller Field","x":229.5,"y":550.8},{"n":"Great Kills Park","x":195.6,"y":580.6},{"n":"Moravian Cemetery","x":206.0,"y":528.5},{"n":"LaTourette Park","x":174.2,"y":529.3},{"n":"Willowbrook Park","x":154.2,"y":501.2},{"n":"Blue Heron Park","x":132.6,"y":606.8},{"n":"Wolfe's Pond Park","x":110.9,"y":621.3},{"n":"Mount Loretto","x":78.5,"y":639.6},{"n":"Conference House Park","x":39.8,"y":655.0},{"n":"South Shore Golf Course","x":95.0,"y":576.5},{"n":"Fresh Kills","x":107.7,"y":541.7},{"n":"Plumb Beach","x":462.2,"y":527.7},{"n":"John F. Kennedy International Airport","x":625.7,"y":429.0},{"n":"LaGuardia Airport","x":513.9,"y":235.2},{"n":"Jamaica Bay Wildlife Refuge","x":574.7,"y":467.4},{"n":"Calvert Vaux","x":362.7,"y":524.9},{"n":"High Rock Park","x":209.1,"y":516.7},{"n":"Red Hook Park","x":347.6,"y":392.5},{"n":"Saint Michael's Cemetery","x":483.3,"y":251.9},{"n":"Riverdale Park","x":460.0,"y":57.4},{"n":"Forest Park (Golf Course)","x":528.6,"y":350.8},{"n":"Spring Creek Park Preserve (No Access)","x":525.6,"y":432.4},{"n":"Spring Creek Park Gateway National Recreation Area","x":552.0,"y":431.7}];

const SUBWAY_PATHS = {"1":"M335.6,344.6 337.9,347.9 335.6,344.6M335.6,344.6 339.5,331.2 345.7,322.1 348.4,304.5 376.9,252.6 377.4,231.5 379.5,223.2 394.4,199.4 395.9,193.1 449.4,105.0 456.6,100.9 463.8,89.2 473.7,80.4 483.1,62.0","2":"M341.9,328.0 345.7,322.0 348.4,304.5 376.9,252.6 378.8,225.0 389.7,207.1M373.6,364.4 367.9,361.5 365.3,354.6 349.3,349.0 342.3,342.7 347.4,334.1 341.9,328.0M415.7,395.8 393.6,390.8 378.9,367.2 373.6,364.4M389.7,207.1 395.4,199.0 404.1,202.6 415.1,200.0 433.5,169.8M421.0,452.2 417.3,396.7 415.7,395.8M433.5,169.8 442.3,168.5 460.4,173.9 470.3,173.4 491.2,160.5 491.8,151.2 497.1,140.8 508.0,135.1 513.7,135.1 518.0,131.0 522.1,121.6 523.2,81.1 538.2,49.5 543.9,40.9","3":"M341.9,328.0 345.7,322.0 348.4,304.5 376.9,252.6 378.8,225.0 389.7,207.1M373.6,364.4 367.9,361.5 365.3,354.6 349.3,349.0 342.3,342.7 347.4,334.1 341.9,328.0M439.6,397.3 411.3,395.5 394.0,391.0 378.9,367.2 373.6,364.4M389.7,207.1 395.4,199.0 404.1,202.6 415.2,199.9 436.9,164.7 437.3,162.7 435.1,161.5M501.5,401.4 458.2,409.0 448.8,398.1 439.6,397.3","4":"M439.6,397.3 411.3,395.5 394.0,391.0 378.9,367.2 373.6,364.4M433.7,191.5 444.6,176.1 448.1,165.9 447.0,158.5 455.6,141.0 487.1,91.3 495.0,85.0 508.2,66.9M373.6,364.4 347.4,356.4 336.8,346.8 336.3,344.0 343.6,332.9 349.4,330.1 366.4,303.8 367.5,296.1 382.2,271.9 385.8,270.4 433.7,191.5","5":"M519.5,127.7 536.7,109.7 568.9,63.5M416.1,395.8 393.6,390.8 378.9,367.1 368.2,361.8M368.2,361.8 347.4,356.4 336.8,346.8 336.4,343.7 343.6,332.9 349.4,330.1 366.4,303.8 367.5,296.1 382.2,271.9 385.8,270.4 437.4,185.4 444.3,176.6 446.1,171.2M421.0,452.2 417.3,396.7 416.1,395.8M446.1,171.2 445.7,169.4 460.7,173.9 470.7,173.2 491.2,160.5 491.8,151.2 497.1,140.8 508.0,135.1 513.7,135.1 518.0,131.0 522.1,121.6 523.2,81.1 539.1,48.1","6":"M349.4,330.1 366.5,303.7 367.5,296.1 382.2,272.0 385.8,270.4 442.1,179.4M442.1,179.4 444.5,179.0 465.9,190.4 470.6,187.8 472.6,182.2 482.6,177.1 491.5,166.7 497.1,163.5 499.5,155.3 510.4,154.0 529.4,147.5 545.2,145.3 567.9,125.5 572.4,118.0","7":"M370.3,265.6 409.5,284.1 417.9,286.1 424.6,283.5 424.5,276.7 428.0,272.1 433.0,274.6 439.7,281.8 460.3,284.6 472.2,281.0 530.6,273.8 570.0,259.3","A":"M371.1,354.4 369.8,351.5 355.7,347.1 348.1,336.6 341.8,332.3 347.9,322.1 348.1,315.5 355.1,298.9 351.5,289.6 414.1,186.4 414.3,182.2 419.3,174.9 430.8,144.7 432.1,130.4 430.6,127.3 435.0,112.9 442.9,100.8 456.1,94.2M525.6,384.9 488.2,392.4 486.4,391.3 484.7,384.8 482.4,383.5 413.8,379.4 370.7,366.1 371.1,354.4M555.2,379.2 531.3,381.6 525.6,384.9M575.3,371.4 555.2,379.2M562.9,531.2 593.0,519.3 595.7,516.4 596.1,512.6M596.1,512.6 598.5,515.7 603.9,517.1 620.5,513.9 643.1,512.3 664.5,496.1M596.1,512.6 587.6,488.5 571.6,415.3 558.5,382.6 555.2,379.2","B":"M403.6,536.2 405.7,535.4 412.1,524.7 412.8,518.8 399.6,434.8 403.6,417.2 402.3,406.8 391.7,388.3M375.8,359.6 361.2,326.7 365.0,314.0 351.5,306.2 380.4,257.3 379.8,255.3M375.2,253.0 374.8,251.1 414.0,186.5 414.3,182.1 419.2,175.1 425.3,160.1M425.3,160.1 431.3,152.1 442.8,152.3 450.9,156.1 453.4,155.6 464.1,138.5 467.3,129.3 473.2,123.4 485.5,101.9 497.6,86.4M379.8,255.3 375.2,253.0M391.7,388.3 384.4,376.2 383.2,369.2 378.7,366.6 375.8,359.6","C":"M371.1,354.4 369.8,351.5 355.7,347.1 348.1,336.6 341.8,332.3 347.9,322.1 348.1,315.5 355.1,298.9 351.5,289.6 414.0,186.5 414.3,182.1 419.2,175.1 426.7,157.7 430.9,144.5 431.2,135.9M516.7,387.5 488.2,392.4 486.4,391.3 484.7,384.8 482.4,383.5 413.5,379.4 370.7,366.1 371.1,354.4","D":"M350.1,418.3 364.1,402.1 382.4,373.2 382.1,368.7 378.7,366.5 375.6,359.1M378.4,536.5 378.9,526.1 375.6,521.7 373.3,507.2 352.6,491.5 360.5,453.7 362.0,436.5 363.8,433.7 348.0,421.8 350.1,418.3M375.6,359.1 361.2,326.7 365.0,314.0 351.5,306.2 380.4,257.3 379.7,255.3M375.2,253.0 374.8,251.1 414.0,186.5 414.3,182.1 419.2,175.1 425.3,160.1M425.3,160.1 431.5,152.0 442.8,152.3 453.2,155.7 464.1,138.5 467.2,129.5 473.2,123.4 499.7,81.5 502.2,80.8 508.1,84.0M379.7,255.3 375.2,253.0","E":"M342.3,330.9 347.9,322.1 348.1,315.5 355.1,298.9 351.5,289.5 373.3,253.6M584.8,341.7 588.1,349.0 592.0,350.9 606.6,346.7M373.3,253.6 375.3,253.0 402.0,266.5 412.6,274.4 426.8,278.0 434.5,275.3 440.2,271.0 459.6,268.1 473.4,269.4 504.6,285.7 512.5,296.6 541.5,309.8 568.7,328.0 580.3,333.9 584.8,341.7","F":"M378.4,536.5 379.9,538.6 386.5,538.0M383.2,252.6 386.4,248.1 390.1,247.9 435.2,272.7 437.9,272.0M368.9,366.4 370.6,363.0 371.7,343.0 367.1,328.4 371.4,316.5 357.7,310.8 351.5,306.0 383.2,252.6M386.5,538.0 389.8,495.1 380.4,435.2M380.4,435.2 380.3,430.8 385.3,425.6 384.2,417.7 379.4,413.2 383.7,404.2 363.5,392.8 357.9,387.6 368.9,366.4M437.9,272.0 459.3,268.1 473.7,269.5 504.6,285.7 512.5,296.6 541.5,309.8 568.7,328.0 580.3,333.9 587.0,343.4 628.5,330.8","G":"M369.0,366.5 381.1,370.2 419.8,364.1 415.1,322.2 418.1,316.3 412.8,304.8 411.1,291.7 413.0,286.3 425.8,279.2M380.4,435.2 380.3,430.8 385.3,425.6 384.2,417.7 379.4,413.2 383.7,404.2 363.5,392.8 357.9,387.6 369.0,366.5","J":"M370.6,322.1 403.9,334.4 415.9,340.5 481.5,385.2 494.3,383.0 516.0,375.0 514.4,366.4 520.7,363.7 557.4,356.9 567.3,350.5 578.0,347.8 586.6,352.2 593.9,350.8M340.7,340.1 349.7,330.9 358.1,317.8 370.6,322.1M593.9,350.8 606.6,346.7","L":"M479.0,431.2 483.9,420.2 477.2,389.4 477.7,384.1 474.0,373.3 475.0,368.9 480.1,361.8 479.8,359.4 450.6,338.8 431.9,341.5 428.0,327.7 415.6,328.4 389.0,308.5 351.4,289.5","M":"M368.3,321.3 404.0,334.5 416.0,340.6 437.4,355.1M437.4,355.1 467.2,350.6 472.6,344.7 490.6,339.2 494.5,332.7M380.4,257.3 351.5,306.0 364.7,313.6 365.4,318.8 368.3,321.3M380.4,257.3 382.5,256.8 402.0,266.5 413.0,274.6 427.1,278.1 434.5,275.3 439.3,271.2 450.3,270.2 456.4,261.6 458.7,261.1 503.9,285.2 512.8,296.8 540.6,309.3 551.6,317.0","N":"M328.4,443.5 363.7,402.6 375.3,386.0 382.6,372.5 382.0,368.7 378.7,366.5 375.7,359.5M437.6,272.2 455.2,246.9 466.1,235.8M375.7,359.5 360.7,326.9 352.6,320.3 365.5,301.6 372.2,263.9 380.7,249.1 389.7,251.4 433.9,275.1 437.6,272.2M378.4,536.5 378.2,531.5 382.5,515.4 376.2,478.5 360.5,466.1 356.6,460.7 340.3,449.1 329.4,445.2 328.4,443.5","Q":"M384.5,376.3 383.2,369.2 378.9,366.8 377.0,362.6M437.8,272.0 455.2,246.9 466.1,235.8M386.5,538.0 395.7,538.2 405.4,535.7 412.3,524.4 412.9,519.5 399.6,434.8 403.6,417.2 402.3,406.7 384.5,376.3M377.0,362.6 360.7,326.9 352.6,320.3 365.5,301.6 372.2,263.9 380.6,249.2 389.7,251.4 433.9,275.1 437.8,272.0M378.4,536.5 379.9,538.6 386.5,538.0","R":"M315.6,476.9 326.2,446.0 363.9,402.3 382.3,373.4 382.0,368.7 378.8,366.7 377.1,362.9M377.1,362.9 368.6,361.6 366.6,359.5 340.2,349.3 336.9,340.4 365.4,301.8 372.2,263.9 380.6,249.2 389.7,251.4 425.4,270.0 428.2,276.1 431.1,276.8M431.1,276.8 439.3,271.2 450.3,270.2 456.4,261.6 458.7,261.1 503.9,285.2 512.8,296.8 540.6,309.3 551.6,317.0","S":"M402.5,408.4 410.6,379.5M372.1,264.8 381.0,269.7M562.9,531.2 581.0,525.0 595.5,516.8 596.1,512.6 587.8,489.4","SIR":"M35.5,634.9 51.1,627.6 99.9,616.2 119.3,596.3 140.7,589.6 164.4,575.6 173.6,573.3 181.3,568.5 203.2,545.2 243.1,509.0 259.6,477.3 264.4,472.0 259.3,458.1 260.5,451.0 259.2,442.5 261.4,435.6","Z":"M370.6,322.1 403.9,334.4 415.9,340.5 481.5,385.2 494.3,383.0 516.0,375.0 514.4,366.4 520.7,363.7 557.4,356.9 567.3,350.5 578.0,347.8 586.6,352.2 593.9,350.8M340.7,340.1 349.7,330.9 358.1,317.8 370.6,322.1M593.9,350.8 606.6,346.7"};

const BORO_LABELS = {"Manhattan":[285,215],"Bronx":[520,100],"Queens":[610,360],"Brooklyn":[352,568],"Staten Island":[160,520]};

/* ---------- geometry ---------- */
function haversineMiles(a, b) {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* Crude transit-time estimate. NOT a routed time — see the disclosure in the UI.
   Base wait + straight-line distance at an effective ~9 mph door-to-door,
   with a penalty when the trip crosses a borough (usually a transfer). */
function estimateTransitMinutes(home, h) {
  const miles = haversineMiles(home, h);
  const crossBorough = home.borough && home.borough !== h.borough ? 8 : 0;
  const walk = h.subway.length ? h.subway[0].walkMinutes : 8;
  return Math.round(6 + (miles / 9) * 60 + crossBorough + walk);
}

/* ---------- map projection ---------- */
const BOUNDS = { minLat: 40.47, maxLat: 40.93, minLng: -74.28, maxLng: -73.68 };
const MAP_W = 760;
const MAP_H = 700;
function project(lat, lng) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * MAP_W;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_H;
  return { x, y };
}
function unproject(x, y) {
  return {
    lng: BOUNDS.minLng + (x / MAP_W) * (BOUNDS.maxLng - BOUNDS.minLng),
    lat: BOUNDS.minLat + (1 - y / MAP_H) * (BOUNDS.maxLat - BOUNDS.minLat),
  };
}

/* ---------- subway line bullet ---------- */
function Bullet({ line, size = 20 }) {
  const c = DATA.lineColors[line] || { bg: "#6B6B75", fg: "#fff" };
  const isSIR = line === "SIR";
  return (
    <span
      title={`${line} train`}
      style={{
        background: c.bg,
        color: c.fg,
        width: isSIR ? size * 1.9 : size,
        height: size,
        fontSize: size * (isSIR ? 0.44 : 0.58),
        borderRadius: isSIR ? size / 3 : "50%",
      }}
      className="inline-flex flex-none items-center justify-center font-bold leading-none"
    >
      {line}
    </span>
  );
}

function Bullets({ lines, size = 20 }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {lines.map((l, i) => (
        <Bullet key={`${l}-${i}`} line={l} size={size} />
      ))}
    </span>
  );
}

/* ---------- main ---------- */
export default function Atlas() {
  const hospitals = DATA.hospitals;

  const [search, setSearch] = useState("");
  const [boroughs, setBoroughs] = useState(new Set());
  const [networks, setNetworks] = useState(new Set());
  const [lineFilter, setLineFilter] = useState(new Set());
  const [maxCommute, setMaxCommute] = useState(125);
  const [home, setHome] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [pinned, setPinned] = useState(new Set());
  const [hoverId, setHoverId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showSubway, setShowSubway] = useState(true);

  const allNetworks = useMemo(
    () => [...new Set(hospitals.map((h) => h.network))].sort(),
    [hospitals]
  );
  const allLines = useMemo(() => {
    const s = [...new Set(hospitals.flatMap((h) => h.subway.flatMap((x) => x.lines)))];
    const order = "123456 7ABCDEFGJLMNQRWZ".split("");
    return s.sort((a, b) => {
      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      return ia === ib ? a.localeCompare(b) : ia - ib;
    });
  }, [hospitals]);

  const commutes = useMemo(() => {
    if (!home) return {};
    const out = {};
    for (const h of hospitals) {
      out[h.id] = {
        minutes: estimateTransitMinutes(home, h),
        miles: haversineMiles(home, h),
      };
    }
    return out;
  }, [home, hospitals]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = hospitals.filter((h) => {
      if (boroughs.size && !boroughs.has(h.borough)) return false;
      if (networks.size && !networks.has(h.network)) return false;
      if (lineFilter.size) {
        const hl = new Set(h.subway.flatMap((x) => x.lines));
        if (![...lineFilter].some((l) => hl.has(l))) return false;
      }
      if (q) {
        const hay = `${h.name} ${h.neighborhood} ${h.network} ${h.address} ${h.subway
          .map((s) => s.station)
          .join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (home && maxCommute < 125 && commutes[h.id] && commutes[h.id].minutes > maxCommute) return false;
      return true;
    });
    if (home) list = [...list].sort((a, b) => commutes[a.id].minutes - commutes[b.id].minutes);
    return list;
  }, [hospitals, search, boroughs, networks, lineFilter, home, commutes, maxCommute]);

  const filteredIds = useMemo(() => new Set(filtered.map((h) => h.id)), [filtered]);
  const selected = selectedId ? hospitals.find((h) => h.id === selectedId) : null;
  const pinnedList = hospitals.filter((h) => pinned.has(h.id));

  const toggle = (set, val, setter) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };
  const togglePin = (id) => {
    const next = new Set(pinned);
    if (next.has(id)) next.delete(id);
    else if (next.size < 4) next.add(id);
    setPinned(next);
    if (next.size) setShowCompare(true);
  };

  const clearAll = () => {
    setSearch("");
    setBoroughs(new Set());
    setNetworks(new Set());
    setLineFilter(new Set());
    setMaxCommute(125);
  };
  const activeFilters =
    boroughs.size + networks.size + lineFilter.size + (search ? 1 : 0) + (home && maxCommute < 125 ? 1 : 0);

  /* ---------- pan + zoom ---------- */
  const svgRef = useRef(null);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const drag = useRef(null);
  const pinch = useRef(null);
  const MIN_K = 1;
  const MAX_K = 12;

  // clamp so you can never pan the map completely off screen
  const clamp = (v) => {
    const k = Math.max(MIN_K, Math.min(MAX_K, v.k));
    const maxX = 0;
    const minX = MAP_W * (1 - k);
    const maxY = 0;
    const minY = MAP_H * (1 - k);
    return { k, x: Math.min(maxX, Math.max(minX, v.x)), y: Math.min(maxY, Math.max(minY, v.y)) };
  };

  // convert a client point to untransformed map coords
  const toMap = (clientX, clientY, v = view) => {
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * MAP_W;
    const sy = ((clientY - rect.top) / rect.height) * MAP_H;
    return { x: (sx - v.x) / v.k, y: (sy - v.y) / v.k, sx, sy };
  };

  const zoomAt = (clientX, clientY, factor) => {
    setView((v) => {
      const { x: mx, y: my, sx, sy } = toMap(clientX, clientY, v);
      const k = Math.max(MIN_K, Math.min(MAX_K, v.k * factor));
      return clamp({ k, x: sx - mx * k, y: sy - my * k });
    });
  };

  const zoomCenter = (factor) => {
    const rect = svgRef.current.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  };

  // wheel / trackpad zoom — non-passive so preventDefault works
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const mid = (a, b) => ({ clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 });

  const onPointerDown = (e) => {
    if (placing) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: view.x, oy: view.y, moved: 0 };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    const rect = svgRef.current.getBoundingClientRect();
    const scale = MAP_W / rect.width;
    setView((v) => clamp({ ...v, x: d.ox + dx * scale, y: d.oy + dy * scale }));
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    // a drag should never register as a click
    if (d && d.moved > 4) return;
    if (placing) {
      const { x, y } = toMap(e.clientX, e.clientY);
      const { lat, lng } = unproject(x, y);
      setHome({ lat, lng, label: `Dropped pin (${lat.toFixed(3)}, ${lng.toFixed(3)})`, borough: null });
      setPlacing(false);
    }
  };

  // two-finger pinch on touch
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      drag.current = null;
      pinch.current = { d: dist(e.touches[0], e.touches[1]), k: view.k };
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const nd = dist(e.touches[0], e.touches[1]);
      const m = mid(e.touches[0], e.touches[1]);
      const factor = nd / pinch.current.d;
      pinch.current.d = nd;
      zoomAt(m.clientX, m.clientY, factor);
    }
  };
  const onTouchEnd = () => { pinch.current = null; };

  const resetView = () => setView({ k: 1, x: 0, y: 0 });

  // zoom to fit the currently filtered hospitals
  const zoomToFiltered = (list) => {
    if (!list.length) return;
    const pts = list.map((h) => project(h.lat, h.lng));
    const pad = 60;
    const minX = Math.min(...pts.map((p) => p.x)) - pad;
    const maxX = Math.max(...pts.map((p) => p.x)) + pad;
    const minY = Math.min(...pts.map((p) => p.y)) - pad;
    const maxY = Math.max(...pts.map((p) => p.y)) + pad;
    const k = Math.max(MIN_K, Math.min(MAX_K, Math.min(MAP_W / (maxX - minX), MAP_H / (maxY - minY))));
    setView(clamp({ k, x: -minX * k + (MAP_W - (maxX - minX) * k) / 2, y: -minY * k + (MAP_H - (maxY - minY) * k) / 2 }));
  };

  // keep strokes and markers at constant screen size
  const iv = (n) => n / view.k;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setPlacing(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      style={{ background: PAPER, color: INK, fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" }}
      className="min-h-screen w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .chip { transition: background .12s, color .12s, border-color .12s; }
        *:focus-visible { outline: 2px solid ${INK}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
      `}</style>

      {/* header */}
      <header
        style={{ borderColor: INK, background: PAPER }}
        className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b-2 px-4 py-3"
      >
        <div
          style={{ background: INK, color: PAPER }}
          className="mono flex h-9 w-9 flex-none items-center justify-center text-xs font-bold"
        >
          1199
        </div>
        <div className="flex-none">
          <h1 className="text-sm font-bold leading-tight tracking-tight">NYC PHARMACY TECH ATLAS</h1>
          <p className="mono text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
            1199SEIU network · 5 boroughs · {hospitals.length} sites
          </p>
        </div>

        <div className="ml-auto flex flex-1 items-center gap-2" style={{ minWidth: 220 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital, neighborhood, station…"
            style={{ borderColor: RULE, background: "#fff" }}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              style={{ borderColor: INK }}
              className="mono flex-none rounded border px-2 py-2 text-[11px] uppercase tracking-wider"
            >
              Clear {activeFilters}
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-0 lg:grid-cols-[300px_1fr_380px]">
        {/* ---------------- filters ---------------- */}
        <aside
          style={{ borderColor: RULE }}
          className="border-b p-4 lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:overflow-y-auto lg:border-b-0 lg:border-r"
        >
          {/* home */}
          <section className="mb-6">
            <h2 className="mono mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>
              Starting point
            </h2>
            <select
              value={home?.label || ""}
              onChange={(e) => {
                const a = ANCHORS.find((x) => x.label === e.target.value);
                setHome(a ? { ...a, borough: a.label.split(", ")[1] } : null);
              }}
              style={{ borderColor: RULE, background: "#fff" }}
              className="w-full rounded border px-2 py-2 text-sm"
            >
              <option value="">Select a neighborhood…</option>
              {ANCHORS.map((a) => (
                <option key={a.label} value={a.label}>
                  {a.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setPlacing((p) => !p)}
              style={{ borderColor: placing ? INK : RULE, background: placing ? SIGNAL : "transparent" }}
              className="mono mt-2 w-full rounded border px-2 py-2 text-[11px] uppercase tracking-wider"
            >
              {placing ? "Click the map…" : "Or drop a pin on the map"}
            </button>
            {home && (
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="mono text-[11px]" style={{ color: MUTED }}>
                  {home.label}
                </span>
                <button onClick={() => setHome(null)} className="mono text-[11px] underline">
                  clear
                </button>
              </div>
            )}
          </section>

          {home && (
            <section className="mb-6">
              <h2 className="mono mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>
                Max estimated trip · {maxCommute >= 125 ? "no limit" : `${maxCommute} min`}
              </h2>
              <input
                type="range"
                min={15}
                max={125}
                step={5}
                value={maxCommute}
                onChange={(e) => setMaxCommute(+e.target.value)}
                className="w-full"
                style={{ accentColor: INK }}
              />
              <p className="mono mt-1 text-[10px]" style={{ color: MUTED }}>
                Drag right for no limit
              </p>
            </section>
          )}

          <FilterGroup title="Borough">
            {BOROUGHS.map((b) => {
              const n = hospitals.filter((h) => h.borough === b).length;
              return (
                <Chip
                  key={b}
                  active={boroughs.has(b)}
                  onClick={() => toggle(boroughs, b, setBoroughs)}
                  label={`${b}`}
                  count={n}
                />
              );
            })}
          </FilterGroup>

          <FilterGroup title="Subway line">
            <div className="flex flex-wrap gap-1.5">
              {allLines.map((l) => (
                <button
                  key={l}
                  onClick={() => toggle(lineFilter, l, setLineFilter)}
                  className="chip"
                  style={{
                    opacity: lineFilter.size === 0 || lineFilter.has(l) ? 1 : 0.28,
                    transform: lineFilter.has(l) ? "scale(1.12)" : "none",
                  }}
                  aria-pressed={lineFilter.has(l)}
                  title={`${l} train`}
                >
                  <Bullet line={l} size={24} />
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Network">
            {allNetworks.map((n) => (
              <Chip
                key={n}
                active={networks.has(n)}
                onClick={() => toggle(networks, n, setNetworks)}
                label={n}
                count={hospitals.filter((h) => h.network === n).length}
                dot={DATA.networkColors[n]}
              />
            ))}
          </FilterGroup>
        </aside>

        {/* ---------------- map ---------------- */}
        <main style={{ borderColor: RULE }} className="border-b p-4 lg:border-b-0">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] uppercase tracking-widest" style={{ color: MUTED }}>
                {filtered.length} of {hospitals.length} shown
              </span>
              <label className="mono flex cursor-pointer items-center gap-1.5 text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
                <input type="checkbox" checked={showSubway} onChange={(e) => setShowSubway(e.target.checked)} style={{ accentColor: INK }} />
                Subway
              </label>
            </div>
            {pinned.size > 0 && (
              <button
                onClick={() => setShowCompare((s) => !s)}
                style={{ borderColor: INK }}
                className="mono rounded border px-2 py-1 text-[11px] uppercase tracking-wider"
              >
                {showCompare ? "Hide" : "Show"} compare ({pinned.size})
              </button>
            )}
          </div>

          <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => (drag.current = null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onDoubleClick={(e) => zoomAt(e.clientX, e.clientY, 1.8)}
            className="w-full rounded"
            style={{
              background: "#fff",
              border: `1px solid ${RULE}`,
              cursor: placing ? "crosshair" : drag.current ? "grabbing" : "grab",
              maxHeight: "72vh",
              touchAction: "none",
            }}
            role="img"
            aria-label="Map of 1199SEIU hospitals across New York City. Drag to pan, scroll to zoom."
          >
            {/* grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke={RULE} strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width={MAP_W} height={MAP_H} fill="#E8EEF2" />

            <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            <rect width={MAP_W} height={MAP_H} fill="url(#grid)" opacity={0.5 / view.k} />

            {/* borough landmasses */}
            {Object.entries(BORO_PATHS).map(([name, dPath]) => {
              const dim = boroughs.size > 0 && !boroughs.has(name);
              return (
                <path
                  key={name}
                  d={dPath}
                  fill={dim ? "#F0EEE8" : "#FDFCF8"}
                  stroke={dim ? "#DDE3E8" : "#B6BEC6"}
                  strokeWidth={iv(dim ? 0.7 : 1)}
                  strokeLinejoin="round"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!placing) toggle(boroughs, name, setBoroughs);
                  }}
                />
              );
            })}
            {/* neighborhood boundaries — revealed on zoom */}
            {view.k >= 1.6 && (
              <path
                d={NBHD_PATH}
                fill="none"
                stroke="#CFC8B8"
                strokeWidth={iv(0.6)}
                opacity={Math.min(1, (view.k - 1.6) / 0.8)}
                style={{ pointerEvents: "none" }}
              />
            )}

            {Object.entries(BORO_LABELS).map(([name, [lx, ly]]) => (
              <text
                key={name}
                x={lx}
                y={ly}
                textAnchor="middle"
                className="mono"
                fontSize={iv(10)}
                letterSpacing={iv(1.5)}
                fill={MUTED}
                opacity={boroughs.size > 0 && !boroughs.has(name) ? 0.35 : 0.75}
                style={{ pointerEvents: "none", textTransform: "uppercase" }}
              >
                {name.toUpperCase()}
              </text>
            ))}

            {/* subway routes */}
            {showSubway && (
              <g>
                {Object.entries(SUBWAY_PATHS).map(([rid, dPath]) => (
                  <path
                    key={`casing-${rid}`}
                    d={dPath}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={iv(4.4)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.85}
                  />
                ))}
                {Object.entries(SUBWAY_PATHS).map(([rid, dPath]) => {
                  const dim = lineFilter.size > 0 && !lineFilter.has(rid);
                  return (
                    <path
                      key={`line-${rid}`}
                      d={dPath}
                      fill="none"
                      stroke={(DATA.lineColors[rid] || { bg: "#8A8A94" }).bg}
                      strokeWidth={iv(dim ? 1.2 : lineFilter.has(rid) ? 3.4 : 2.2)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={dim ? 0.18 : 1}
                    />
                  );
                })}
              </g>
            )}

            {/* commute rings */}
            {home &&
              [3, 6, 9].map((mi) => {
                const p = project(home.lat, home.lng);
                const edge = project(home.lat, home.lng + mi / 52.9);
                return (
                  <circle
                    key={mi}
                    cx={p.x}
                    cy={p.y}
                    r={Math.abs(edge.x - p.x)}
                    fill="none"
                    stroke={INK}
                    strokeWidth={iv(0.8)}
                    strokeDasharray={`${iv(3)} ${iv(4)}`}
                    opacity="0.25"
                  />
                );
              })}

            {/* connector from home to hovered/selected */}
            {home &&
              (() => {
                const target = hospitals.find((h) => h.id === (hoverId || selectedId));
                if (!target) return null;
                const a = project(home.lat, home.lng);
                const b = project(target.lat, target.lng);
                return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={INK} strokeWidth={iv(1.4)} strokeDasharray={`${iv(5)} ${iv(3)}`} />;
              })()}

            {/* station dots — revealed on zoom */}
            {view.k >= 2.4 && (
              <g style={{ pointerEvents: "none" }} opacity={Math.min(1, (view.k - 2.4) / 0.8)}>
                {STATIONS.map((st, i) => {
                  const on = lineFilter.size === 0 || st.l.some((l) => lineFilter.has(l));
                  if (!on) return null;
                  return (
                    <circle
                      key={i}
                      cx={st.x}
                      cy={st.y}
                      r={iv(2)}
                      fill="#fff"
                      stroke={INK}
                      strokeWidth={iv(0.8)}
                    />
                  );
                })}
              </g>
            )}

            {/* neighborhood names — revealed on zoom, largest first */}
            {view.k >= 1.8 && (
              <g style={{ pointerEvents: "none" }} opacity={Math.min(1, (view.k - 1.8) / 0.7)}>
                {NBHD_LABELS.slice(0, view.k >= 4 ? 291 : view.k >= 2.6 ? 150 : 60).map((l, i) => (
                  <text
                    key={i}
                    x={l.x}
                    y={l.y}
                    textAnchor="middle"
                    fontSize={iv(7)}
                    fill="#7C8791"
                    className="mono"
                  >
                    {l.n}
                  </text>
                ))}
              </g>
            )}

            {/* station names — only when zoomed well in */}
            {view.k >= 4.5 && (
              <g style={{ pointerEvents: "none" }} opacity={Math.min(1, (view.k - 4.5) / 1)}>
                {STATIONS.map((st, i) => {
                  const on = lineFilter.size === 0 || st.l.some((l) => lineFilter.has(l));
                  if (!on) return null;
                  return (
                    <text
                      key={i}
                      x={st.x + iv(3.5)}
                      y={st.y + iv(1.8)}
                      fontSize={iv(4.6)}
                      fill={INK}
                      className="mono"
                    >
                      {st.n}
                    </text>
                  );
                })}
              </g>
            )}

            {/* parks & landmarks */}
            {view.k >= 3 && (
              <g style={{ pointerEvents: "none" }} opacity={Math.min(1, (view.k - 3) / 0.8)}>
                {LANDMARKS.map((l, i) => (
                  <text
                    key={i}
                    x={l.x}
                    y={l.y}
                    textAnchor="middle"
                    fontSize={iv(5.4)}
                    fill="#5C8A5E"
                    className="mono"
                  >
                    {l.n}
                  </text>
                ))}
              </g>
            )}

            {/* hospital dots */}
            {hospitals.map((h) => {
              const p = project(h.lat, h.lng);
              const on = filteredIds.has(h.id);
              const isSel = selectedId === h.id;
              const isPin = pinned.has(h.id);
              const color = DATA.networkColors[h.network] || INK;
              return (
                <g
                  key={h.id}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!placing) setSelectedId(h.id);
                  }}
                  onMouseEnter={() => setHoverId(h.id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{ cursor: placing ? "crosshair" : "pointer", opacity: on ? 1 : 0.13 }}
                >
                  {isSel && <circle r={iv(13)} fill="none" stroke={INK} strokeWidth={iv(1.5)} />}
                  {isPin && <circle r={iv(9.5)} fill={SIGNAL} />}
                  <circle r={iv(isSel ? 6.5 : 5)} fill={color} stroke="#fff" strokeWidth={iv(1.5)} />
                  {(hoverId === h.id || isSel) && on && (
                    <g>
                      <rect
                        x={iv(10)}
                        y={iv(-11)}
                        width={iv(Math.min(h.name.length * 5.4 + 12, 210))}
                        height={iv(20)}
                        rx={iv(2)}
                        fill={INK}
                      />
                      <text x={iv(16)} y={iv(3)} fill={PAPER} fontSize={iv(11)} className="mono">
                        {h.name.length > 34 ? h.name.slice(0, 33) + "…" : h.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* home marker */}
            {home &&
              (() => {
                const p = project(home.lat, home.lng);
                return (
                  <g transform={`translate(${p.x},${p.y})`}>
                    <circle r={iv(10)} fill={SIGNAL} stroke={INK} strokeWidth={iv(2)} />
                    <circle r={iv(3)} fill={INK} />
                  </g>
                );
              })()}
            </g>
          </svg>

            {/* zoom controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1">
              <ZoomBtn label="+" title="Zoom in" onClick={() => zoomCenter(1.5)} />
              <ZoomBtn label="−" title="Zoom out" onClick={() => zoomCenter(1 / 1.5)} />
              <ZoomBtn label="⤢" title="Fit to results" onClick={() => zoomToFiltered(filtered)} />
              <ZoomBtn label="↺" title="Reset view" onClick={resetView} />
            </div>

            {view.k > 1.02 && (
              <div
                className="mono absolute bottom-3 left-3 rounded px-2 py-1 text-[10px] uppercase tracking-widest"
                style={{ background: INK, color: PAPER }}
              >
                {view.k.toFixed(1)}× ·{" "}
                {view.k >= 4.5
                  ? "stations named"
                  : view.k >= 3
                    ? "landmarks"
                    : view.k >= 2.4
                      ? "stations"
                      : view.k >= 1.6
                        ? "neighborhoods"
                        : "drag to pan"}
              </div>
            )}
          </div>

          <p className="mono mt-2 text-[10px] leading-relaxed" style={{ color: MUTED }}>
            Borough outlines and MTA subway alignments from open geodata; hospitals plotted at real coordinates. Drag to pan, scroll or pinch to zoom. Zoom in to reveal neighborhoods, then stations, landmarks, and station names. Click a borough to filter, or a line bullet to highlight its route. Dashed rings ≈ 3 / 6 / 9 straight-line miles.
          </p>

          {/* compare table */}
          {showCompare && pinnedList.length > 0 && (
            <div style={{ borderColor: INK }} className="mt-4 overflow-x-auto rounded border-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr style={{ background: INK, color: PAPER }}>
                    <th className="mono p-2 text-[10px] uppercase tracking-widest">Compare</th>
                    {pinnedList.map((h) => (
                      <th key={h.id} className="p-2 font-semibold">
                        {h.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Network", (h) => h.network],
                    ["Type", (h) => h.type],
                    ["Borough", (h) => h.borough],
                    ["Neighborhood", (h) => h.neighborhood],
                    ["Nearest station", (h) => (h.subway[0] ? `${h.subway[0].station} · ${h.subway[0].walkMinutes} min walk` : "—")],
                    ["Est. trip", (h) => (home ? `${commutes[h.id].minutes} min` : "set a starting point")],
                    ["Straight-line", (h) => (home ? `${commutes[h.id].miles.toFixed(1)} mi` : "—")],
                  ].map(([label, fn]) => (
                    <tr key={label} style={{ borderTop: `1px solid ${RULE}` }}>
                      <td className="mono p-2 text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
                        {label}
                      </td>
                      {pinnedList.map((h) => (
                        <td key={h.id} className="p-2">
                          {fn(h)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ borderTop: `1px solid ${RULE}` }}>
                    <td className="mono p-2 text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
                      Lines
                    </td>
                    {pinnedList.map((h) => (
                      <td key={h.id} className="p-2">
                        <Bullets lines={[...new Set(h.subway.flatMap((s) => s.lines))]} size={17} />
                      </td>
                    ))}
                  </tr>
                  <tr style={{ borderTop: `1px solid ${RULE}` }}>
                    <td />
                    {pinnedList.map((h) => (
                      <td key={h.id} className="p-2">
                        <button onClick={() => togglePin(h.id)} className="mono text-[11px] underline">
                          remove
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* ---------------- list ---------------- */}
        <aside
          style={{ borderColor: RULE }}
          className="p-4 lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:overflow-y-auto lg:border-l"
        >
          {home && (
            <p className="mono mb-3 text-[10px] leading-relaxed" style={{ color: MUTED }}>
              Sorted by estimated trip from <span style={{ color: INK }}>{home.label}</span>.
            </p>
          )}
          {filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold">No hospitals match these filters.</p>
              <button onClick={clearAll} className="mono mt-2 text-[11px] underline">
                Clear filters
              </button>
            </div>
          )}
          <ul className="space-y-2">
            {filtered.map((h) => {
              const c = commutes[h.id];
              return (
                <li key={h.id}>
                  <div
                    onMouseEnter={() => setHoverId(h.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => setSelectedId(h.id)}
                    style={{
                      borderColor: selectedId === h.id ? INK : RULE,
                      borderWidth: selectedId === h.id ? 2 : 1,
                      background: "#fff",
                    }}
                    className="cursor-pointer rounded p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full"
                        style={{ background: DATA.networkColors[h.network] }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{h.name}</p>
                        <p className="mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
                          {h.neighborhood} · {h.borough}
                        </p>
                        <div className="mt-1.5">
                          <Bullets lines={[...new Set(h.subway.flatMap((s) => s.lines))]} size={16} />
                        </div>
                      </div>
                      <div className="flex flex-none flex-col items-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(h.id);
                          }}
                          title={pinned.has(h.id) ? "Unpin" : pinned.size >= 4 ? "4 pinned already" : "Pin to compare"}
                          style={{
                            background: pinned.has(h.id) ? SIGNAL : "transparent",
                            borderColor: pinned.has(h.id) ? INK : RULE,
                          }}
                          className="mono rounded border px-1.5 py-0.5 text-[10px] uppercase"
                        >
                          {pinned.has(h.id) ? "pinned" : "pin"}
                        </button>
                        {c && (
                          <span className="mono text-[11px] font-semibold">~{c.minutes}m</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* ---------------- detail sheet ---------------- */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setSelectedId(null)}>
          <div style={{ background: "rgba(22,22,29,.35)" }} className="absolute inset-0" />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: PAPER, borderColor: INK }}
            className="relative h-full w-full max-w-md overflow-y-auto border-l-2 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="mono inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ background: DATA.networkColors[selected.network], color: "#fff" }}
                >
                  {selected.network}
                </span>
                <h2 className="mt-2 text-lg font-bold leading-tight">{selected.name}</h2>
              </div>
              <button onClick={() => setSelectedId(null)} className="mono text-lg leading-none">
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{selected.blurb}</p>

            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Type" value={selected.type} />
              <Row label="Borough" value={`${selected.neighborhood} · ${selected.borough}`} />
              <Row label="Address" value={selected.address} />
              {home && (
                <>
                  <Row label="Est. trip" value={`~${commutes[selected.id].minutes} min from ${home.label}`} />
                  <Row label="Straight-line" value={`${commutes[selected.id].miles.toFixed(1)} mi`} />
                </>
              )}
            </dl>

            <h3 className="mono mt-5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>
              Subway access
            </h3>
            <ul className="mt-2 space-y-2">
              {selected.subway.map((s, i) => (
                <li
                  key={i}
                  style={{ borderColor: RULE, background: "#fff" }}
                  className="flex items-center gap-2 rounded border p-2"
                >
                  <Bullets lines={s.lines} size={19} />
                  <span className="text-sm">{s.station}</span>
                  <span className="mono ml-auto text-[11px]" style={{ color: MUTED }}>
                    {s.walkMinutes} min walk
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => togglePin(selected.id)}
                style={{ background: pinned.has(selected.id) ? SIGNAL : "transparent", borderColor: INK }}
                className="mono flex-1 rounded border-2 px-3 py-2 text-[11px] uppercase tracking-wider"
              >
                {pinned.has(selected.id) ? "Pinned" : "Pin to compare"}
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selected.name + " " + selected.address
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: INK }}
                className="mono flex-1 rounded border-2 px-3 py-2 text-center text-[11px] uppercase tracking-wider"
              >
                Open in Maps ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* footer disclosure */}
      <footer style={{ borderColor: RULE }} className="border-t px-4 py-5">
        <p className="mono mx-auto max-w-3xl text-[10px] leading-relaxed" style={{ color: MUTED }}>
          <strong style={{ color: INK }}>About the numbers.</strong> Trip times here are rough
          estimates derived from straight-line distance, not routed transit directions — the live app
          calls the Google Routes API for real times, which needs a server and API key. Treat these as
          relative ordering, not schedule. Hospital coordinates, nearest stations, and walk minutes were
          hand-compiled and are approximate. 1199SEIU bargaining units change; confirm current
          representation and pharmacy-tech hiring directly with each employer.
        </p>
      </footer>
    </div>
  );
}

function ZoomBtn({ label, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="mono flex h-8 w-8 items-center justify-center rounded text-sm leading-none"
      style={{ background: "#fff", border: `1px solid ${INK}`, color: INK }}
    >
      {label}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-3">
      <dt className="mono w-24 flex-none text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
        {label}
      </dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="mono mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>
        {title}
      </h2>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </section>
  );
}

function Chip({ active, onClick, label, count, dot }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="chip inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[11px]"
      style={{
        borderColor: active ? INK : RULE,
        background: active ? INK : "transparent",
        color: active ? PAPER : INK,
      }}
    >
      {dot && <span className="h-2 w-2 flex-none rounded-full" style={{ background: dot }} />}
      {label}
      <span className="mono opacity-60">{count}</span>
    </button>
  );
}
