import sunroofStamp from '../assets/sunroof-stamp.jpeg';
import sunlightStamp from '../assets/sunlight-stamp.jpeg';
import logoSr from '../assets/logo_sr.png';
import logoSunlight from '../assets/logo_sunlight.png';

export const COMPANY_PROFILES = {
  sunroof: {
    id: 'sunroof',
    label: 'Sunroof Energy',
    name: 'SUNROOF ENERGY',
    logo: logoSr,
    address: '40-SARTHAK PALACE,52 STREET ,Nr. Radhanpur Bypass Circle, Mehsana-384002',
    stamp: sunroofStamp,
    contact: '84600 43385',
    email: 'sunroofenergymeh@gmail.com'
  },
  sunlight: {
    id: 'sunlight',
    label: 'Sunlight Green',
    fullName: 'Sunlight Green Energy',
    name: 'SUNLIGHT GREEN ENERGY',
    logo: logoSunlight,
    address: '408-409 SILICON SPONTA, OPP. SHUBH RESIDENCY,Nr. Radhanpur Bypass Circle, Mehsana-384002',
    stamp: sunlightStamp,
    contact: '84600 43385',
    email: 'sunlightgreenmeh@gmail.com'
  }
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
  includeDate: false, // Default disabled as requested
  executionDay: '19',
  executionMonth: '09',
  executionYear: '2026',

  // Company selection (Default: Sunroof Energy)
  selectedCompany: 'sunroof',
  vendorName: COMPANY_PROFILES.sunroof.name,
  vendorAddress: COMPANY_PROFILES.sunroof.address,
  vendorStamp: COMPANY_PROFILES.sunroof.stamp,

  // Stamp & Sign
  includeStamp: true,
  customStampUrl: null
};
