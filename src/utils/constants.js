import sunroofStamp from '../assets/sunroof-stamp.jpeg';
import logoSr from '../assets/logo_sr.png';

export const SUNROOF_ADDRESSES = [
  {
    key: 'silicon_sponta',
    label: 'Silicon Sponta (Default)',
    address: 'Forth Floor 408/409, Sillicon Sponta, Opp. Shubh Residency, Radhanpur road, Mehsana-384002.'
  },
  {
    key: 'sarthak_palace',
    label: 'Sarthak Palace',
    address: '40, Sarthak Palace, 52 Street, Nr. Radhanpur Bypass Circle, Mehsana - 384002'
  }
];

export const COMPANY_PROFILES = {
  sunroof: {
    id: 'sunroof',
    label: 'Sunroof Energy',
    name: 'SUNROOF ENERGY',
    logo: logoSr,
    address: SUNROOF_ADDRESSES[0].address,
    stamp: sunroofStamp,
    contact: '84603 43385',
    email: 'sunroofenergymeh@gmail.com'
  }
};

export const DEFAULT_QUOTATION_SPECS = {
  // Capacity & Plan Specs
  q_capacityKw: '3.48',
  q_panelQty: '6 Panel',
  q_solarPanelMake: 'WAREE (580 W), 25-year performance warranty',
  q_inverterMake: 'PV BLINK / POLYCAB (10 years warranty)',
  q_inverterQty: '3600 W',

  // Costing & Subsidy
  q_includeSubsidy: true,
  q_netSystemCost: '169000',
  q_subsidyAmount: '78000',
  q_basePriceListCost: '152100',

  // Balance of System (BOS)
  q_monitoringDetails: 'Reputed, based on Wi-Fi',
  q_monitoringQty: '1 Set',
  q_mountingStructureDetails: 'Hot Dip Galvanized 60×40 pipe 2mm / 40×40 pipe 2mm',
  q_mountingStructureQty: 'As per Plant Capacity',
  q_dcBoxDetails: 'DB with DC MCB — Havells & L&T make. Surge protecting device — Surgear make',
  q_dcBoxQty: '16 ADC, 600V SPD',
  q_acBoxDetails: 'DB with AC MCB — Havells & L&T make. Surge protecting device — Surgear make',
  q_acBoxQty: '32 ADP',
  q_dcCableDetails: 'Polycab, TUV Approved',
  q_dcCableQty: '4 sq.mm',
  q_acCableDetails: 'Polycab Copper Flexible Industrial Cable',
  q_acCableQty: '4 sq.mm',
  q_cableConduitDetails: '25mm WireGuard Rigid PVC, UV Protected',
  q_cableConduitQty: '25mm LMS',
  q_lightningArresterDetails: '1.3 mtr copper coated, with earthing',
  q_lightningArresterQty: '16 sq.mm AL.',
  q_earthingDetails: 'Copper bonded rod 1.5 mtr with chemical compound bag',
  q_earthingQty: '3 Set'
};

export const INITIAL_AGREEMENT_DATA = {
  // Consumer Details
  consumerName: 'THAKOR MANORJI PRATAPJI',
  consumerAddress: 'AT-HARIJ,, District: Patan, State: GUJARAT, PIN Code: 384240',
  mobileNo: '9913997154',
  consumerAccountNo: '28527134225',
  applicationNo: 'NP-GJUG25-8615248',
  appliedCapacity: '3.300 kWp',
  discom: 'Uttar Gujarat Vij Company Limited',
  consumerSignatureUrl: null, // First party uploaded signature image

  // Agreement Execution Date
  includeDate: true, // Enabled by default
  executionDay: '19',
  executionMonth: '09',
  executionYear: '2026',

  // Company selection (Fixed: Sunroof Energy)
  selectedCompany: 'sunroof',
  vendorName: COMPANY_PROFILES.sunroof.name,
  vendorAddress: COMPANY_PROFILES.sunroof.address,
  vendorStamp: COMPANY_PROFILES.sunroof.stamp,

  // Stamp & Sign
  includeStamp: true,
  customStampUrl: null,

  // Merge Quotation & BOS defaults
  ...DEFAULT_QUOTATION_SPECS
};

export const BANK_PRESETS = {
  sarvodaya: {
    key: 'sarvodaya',
    label: 'Sarvodaya Bank',
    bankName: 'SARVODAYA COMMERCIAL CO-OP. BANK',
    branchName: 'DAIRY ROAD',
    accountNumber: '805003101001463',
    ifscCode: 'IBKL0443SCC'
  },
  dcb: {
    key: 'dcb',
    label: 'DCB Bank',
    bankName: 'DCB Bank',
    branchName: '(419) Mehsana',
    accountNumber: '41922900002097',
    ifscCode: 'DCBL0000419'
  },
  bob: {
    key: 'bob',
    label: 'Bank of Baroda',
    bankName: 'BANK OF BARODA',
    branchName: 'PANCHOT CIRCLE',
    accountNumber: '26660200000003',
    ifscCode: 'BARB0PANCHO'
  }
};

export const ALL_SUNROOF_BANKS = [
  BANK_PRESETS.sarvodaya,
  BANK_PRESETS.dcb,
  BANK_PRESETS.bob
];

export function applyCompanyToData(companyKey = 'sunroof', currentData = INITIAL_AGREEMENT_DATA) {
  const profile = COMPANY_PROFILES.sunroof;
  const bankKey =
    currentData?.q_bankPreset === 'all' || (currentData?.q_bankPreset && BANK_PRESETS[currentData.q_bankPreset])
      ? currentData.q_bankPreset
      : 'all';
  const defaultBank = BANK_PRESETS[bankKey] || BANK_PRESETS.sarvodaya;

  return {
    ...DEFAULT_QUOTATION_SPECS,
    ...currentData,
    selectedCompany: 'sunroof',
    vendorName: profile.name,
    vendorAddress: profile.address,
    vendorStamp: profile.stamp,
    q_companyPreset: 'sunroof',
    q_brandName: profile.name,
    q_regOfficeAddress: profile.address,
    q_contactNumber: profile.contact,
    q_emailAddress: profile.email,
    q_bankPreset: bankKey,
    q_bankName: currentData?.q_bankName || defaultBank.bankName,
    q_branchName: currentData?.q_branchName || defaultBank.branchName,
    q_accountNumber: currentData?.q_accountNumber || defaultBank.accountNumber,
    q_ifscCode: currentData?.q_ifscCode || defaultBank.ifscCode,
  };
}
