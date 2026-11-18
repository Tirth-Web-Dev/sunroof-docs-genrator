// Solar Pricing Plans for APS, WAREE, and ADANI based on official rate charts
export const SOLAR_PRICING_PLANS = {
  aps: {
    id: 'aps',
    brand: 'APS',
    label: 'APS Solar',
    models: [
      {
        id: 'aps_bifacial',
        name: 'APS 550 (BIFACIAL)',
        badge: 'Bifacial',
        makeDescription: 'APS (550 W) Bifacial Dual Glass, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 2.75, totalCost: 133000, subsidy: 78000, payable: 55000 },
          { panels: 6, kw: 3.30, totalCost: 152000, subsidy: 78000, payable: 74000 },
          { panels: 7, kw: 3.85, totalCost: 170000, subsidy: 78000, payable: 92000 },
          { panels: 8, kw: 4.40, totalCost: 193000, subsidy: 78000, payable: 115000 },
          { panels: 9, kw: 4.95, totalCost: 222000, subsidy: 78000, payable: 144000 },
          { panels: 10, kw: 5.50, totalCost: 247000, subsidy: 78000, payable: 169000 },
          { panels: 11, kw: 6.05, totalCost: 265000, subsidy: 78000, payable: 187000 },
          { panels: 12, kw: 6.60, totalCost: 310000, subsidy: 78000, payable: 232000 },
          { panels: 13, kw: 7.15, totalCost: 330000, subsidy: 78000, payable: 252000 },
          { panels: 14, kw: 7.70, totalCost: 355000, subsidy: 78000, payable: 277000 },
          { panels: 15, kw: 8.25, totalCost: 375000, subsidy: 78000, payable: 297000 },
          { panels: 16, kw: 8.80, totalCost: 395000, subsidy: 78000, payable: 317000 },
          { panels: 17, kw: 9.35, totalCost: 418000, subsidy: 78000, payable: 340000 },
          { panels: 18, kw: 9.90, totalCost: 438000, subsidy: 78000, payable: 360000 }
        ]
      },
      {
        id: 'aps_topcon',
        name: 'APS 600 (TOPCON)',
        badge: 'TOPCon',
        makeDescription: 'APS (600 W) TOPCon N-Type Bifacial, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 3.00, totalCost: 150000, subsidy: 78000, payable: 72000 },
          { panels: 6, kw: 3.60, totalCost: 165000, subsidy: 78000, payable: 87000 },
          { panels: 7, kw: 4.20, totalCost: 192000, subsidy: 78000, payable: 114000 },
          { panels: 8, kw: 4.80, totalCost: 220000, subsidy: 78000, payable: 142000 },
          { panels: 9, kw: 5.40, totalCost: 246000, subsidy: 78000, payable: 168000 },
          { panels: 10, kw: 6.00, totalCost: 280000, subsidy: 78000, payable: 202000 },
          { panels: 11, kw: 6.60, totalCost: 318000, subsidy: 78000, payable: 240000 },
          { panels: 12, kw: 7.20, totalCost: 348000, subsidy: 78000, payable: 270000 },
          { panels: 13, kw: 7.80, totalCost: 370000, subsidy: 78000, payable: 292000 },
          { panels: 14, kw: 8.40, totalCost: 395000, subsidy: 78000, payable: 317000 },
          { panels: 15, kw: 9.00, totalCost: 420000, subsidy: 78000, payable: 342000 },
          { panels: 16, kw: 9.60, totalCost: 445000, subsidy: 78000, payable: 367000 }
        ]
      }
    ]
  },
  waree: {
    id: 'waree',
    brand: 'WAREE',
    label: 'Waaree Solar',
    models: [
      {
        id: 'waree_bifacial',
        name: 'WAREE 540-545-550 (BIFACIAL)',
        badge: 'Bifacial',
        makeDescription: 'WAREE (545 W) Bifacial Dual Glass, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 2.70, totalCost: 142000, subsidy: 78000, payable: 64000 },
          { panels: 6, kw: 3.24, totalCost: 160000, subsidy: 78000, payable: 82000 },
          { panels: 7, kw: 3.78, totalCost: 180000, subsidy: 78000, payable: 102000 },
          { panels: 8, kw: 4.32, totalCost: 203000, subsidy: 78000, payable: 125000 },
          { panels: 9, kw: 4.86, totalCost: 230000, subsidy: 78000, payable: 152000 },
          { panels: 10, kw: 5.40, totalCost: 252000, subsidy: 78000, payable: 174000 },
          { panels: 11, kw: 5.94, totalCost: 277000, subsidy: 78000, payable: 199000 },
          { panels: 12, kw: 6.48, totalCost: 318000, subsidy: 78000, payable: 240000 },
          { panels: 13, kw: 7.02, totalCost: 338000, subsidy: 78000, payable: 260000 },
          { panels: 14, kw: 7.56, totalCost: 359000, subsidy: 78000, payable: 281000 },
          { panels: 15, kw: 8.10, totalCost: 382000, subsidy: 78000, payable: 304000 },
          { panels: 16, kw: 8.64, totalCost: 397000, subsidy: 78000, payable: 319000 },
          { panels: 17, kw: 9.18, totalCost: 422000, subsidy: 78000, payable: 344000 },
          { panels: 18, kw: 9.72, totalCost: 442000, subsidy: 78000, payable: 364000 }
        ]
      },
      {
        id: 'waree_topcon',
        name: 'WAREE 580 (TOPCON)',
        badge: 'TOPCon',
        makeDescription: 'WAREE (580 W) TOPCon N-Type Bifacial, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 2.90, totalCost: 148000, subsidy: 78000, payable: 70000 },
          { panels: 6, kw: 3.48, totalCost: 166000, subsidy: 78000, payable: 88000 },
          { panels: 7, kw: 4.06, totalCost: 194000, subsidy: 78000, payable: 116000 },
          { panels: 8, kw: 4.64, totalCost: 216000, subsidy: 78000, payable: 138000 },
          { panels: 9, kw: 5.22, totalCost: 242000, subsidy: 78000, payable: 164000 },
          { panels: 10, kw: 5.80, totalCost: 268000, subsidy: 78000, payable: 190000 },
          { panels: 11, kw: 6.38, totalCost: 297000, subsidy: 78000, payable: 219000 },
          { panels: 12, kw: 6.96, totalCost: 345000, subsidy: 78000, payable: 267000 },
          { panels: 13, kw: 7.54, totalCost: 362000, subsidy: 78000, payable: 284000 },
          { panels: 14, kw: 8.12, totalCost: 380000, subsidy: 78000, payable: 302000 },
          { panels: 15, kw: 8.70, totalCost: 407000, subsidy: 78000, payable: 329000 },
          { panels: 16, kw: 9.28, totalCost: 432000, subsidy: 78000, payable: 354000 }
        ]
      }
    ]
  },
  adani: {
    id: 'adani',
    brand: 'ADANI',
    label: 'Adani Solar',
    models: [
      {
        id: 'adani_bifacial',
        name: 'Adani 540-545-550 (BIFACIAL)',
        badge: 'Bifacial',
        makeDescription: 'Adani (545 W) Bifacial Solar PV Module, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 2.73, totalCost: 145000, subsidy: 78000, payable: 67000 },
          { panels: 6, kw: 3.27, totalCost: 165000, subsidy: 78000, payable: 87000 },
          { panels: 7, kw: 3.82, totalCost: 183000, subsidy: 78000, payable: 105000 },
          { panels: 8, kw: 4.36, totalCost: 203000, subsidy: 78000, payable: 125000 },
          { panels: 9, kw: 4.91, totalCost: 235000, subsidy: 78000, payable: 157000 },
          { panels: 10, kw: 5.45, totalCost: 262000, subsidy: 78000, payable: 184000 },
          { panels: 11, kw: 6.00, totalCost: 282000, subsidy: 78000, payable: 204000 },
          { panels: 12, kw: 6.54, totalCost: 325000, subsidy: 78000, payable: 247000 },
          { panels: 13, kw: 7.09, totalCost: 348000, subsidy: 78000, payable: 270000 },
          { panels: 14, kw: 7.63, totalCost: 365000, subsidy: 78000, payable: 287000 },
          { panels: 15, kw: 8.18, totalCost: 388000, subsidy: 78000, payable: 310000 },
          { panels: 16, kw: 8.72, totalCost: 403000, subsidy: 78000, payable: 325000 },
          { panels: 17, kw: 9.27, totalCost: 428000, subsidy: 78000, payable: 350000 },
          { panels: 18, kw: 9.81, totalCost: 450000, subsidy: 78000, payable: 372000 }
        ]
      },
      {
        id: 'adani_topcon',
        name: 'Adani 615-620-625 (TOPCON)',
        badge: 'TOPCon',
        makeDescription: 'Adani (620 W) TOPCon N-Type High Efficiency, 25-Year Performance Warranty',
        rows: [
          { panels: 5, kw: 3.10, totalCost: 160000, subsidy: 78000, payable: 82000 },
          { panels: 6, kw: 3.72, totalCost: 185000, subsidy: 78000, payable: 107000 },
          { panels: 7, kw: 4.34, totalCost: 210000, subsidy: 78000, payable: 132000 },
          { panels: 8, kw: 4.96, totalCost: 234000, subsidy: 78000, payable: 156000 },
          { panels: 9, kw: 5.58, totalCost: 266000, subsidy: 78000, payable: 188000 },
          { panels: 10, kw: 6.20, totalCost: 292000, subsidy: 78000, payable: 214000 },
          { panels: 11, kw: 6.82, totalCost: 335000, subsidy: 78000, payable: 257000 },
          { panels: 12, kw: 7.44, totalCost: 370000, subsidy: 78000, payable: 292000 },
          { panels: 13, kw: 8.06, totalCost: 393000, subsidy: 78000, payable: 315000 },
          { panels: 14, kw: 8.68, totalCost: 415000, subsidy: 78000, payable: 337000 },
          { panels: 15, kw: 9.30, totalCost: 445000, subsidy: 78000, payable: 367000 },
          { panels: 16, kw: 9.92, totalCost: 470000, subsidy: 78000, payable: 392000 }
        ]
      }
    ]
  }
};
