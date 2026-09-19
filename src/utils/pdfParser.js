import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker safely for Vite / browser environments
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    // Fallback to unpkg/cdnjs if URL resolution fails
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
  }
}

/**
 * Parses an uploaded PDF file and extracts details based on MNRE Rooftop Solar
 * Application Acknowledgement format.
 * @param {File} file 
 * @returns {Promise<Object>} extracted fields
 */
export async function parseApplicationPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  const pageTexts = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageString = textContent.items
      .map(item => item.str)
      .join(' ');
    pageTexts.push(pageString);
    fullText += '\n' + pageString;
  }

  return extractDetailsFromText(fullText);
}

/**
 * Robust regex extractor for MNRE Rooftop Solar Acknowledgement text
 * @param {string} text 
 * @returns {Object}
 */
export function extractDetailsFromText(text) {
  const result = {
    applicantName: '',
    address: '',
    applicationNo: '',
    applicationDate: '',
    mobileNo: '',
    consumerAccountNo: '',
    appliedCapacity: '',
    sanctionedLoad: '',
    discom: '',
    category: 'Residential',
    rawText: text
  };

  if (!text) return result;

  // 1. Applicant Name
  // Matches: Sh/Smt THAKOR MANORJI PRATAPJI or Name of Applicant THAKOR MANORJI PRATAPJI
  const nameFromTable = text.match(/Name of Applicant\s+([A-Z\s\.\,\'\-]+?)(?=\s+(?:Mobile|Email|Consumer|\d{10}))/i);
  const nameFromHeader = text.match(/(?:Sh\/Smt|Shri\/Smt|Shri|Smt|Mr\.|Mrs\.)\s+([A-Z\s\.\,\'\-]+?)(?=\s+(?:Date|1\.|Your))/i);

  if (nameFromTable && nameFromTable[1].trim()) {
    result.applicantName = cleanText(nameFromTable[1]);
  } else if (nameFromHeader && nameFromHeader[1].trim()) {
    result.applicantName = cleanText(nameFromHeader[1]);
  }

  // 2. Application Reference Number
  // Format: NP-GJUG25-8615248 or similar
  const appNoMatch = text.match(/(?:Application Reference Number\s*[–\-:]*|NP-[A-Z0-9]+)\s*([A-Z0-9]{2,4}-[A-Z0-9\-]+)/i)
    || text.match(/\b(NP-[A-Z0-9\-]{8,25})\b/i);
  if (appNoMatch) {
    result.applicationNo = (appNoMatch[1] || appNoMatch[0]).trim();
  }

  // 3. Application Date
  // Matches 22-09-2025 or 22/09/2025
  const dateMatch = text.match(/Date:\s*(\d{2}[-/]\d{2}[-/]\d{4})/i)
    || text.match(/\/\s*(\d{2}[-/]\d{2}[-/]\d{4})/i)
    || text.match(/\b(\d{2}[-/]\d{2}[-/]\d{4})\b/);
  if (dateMatch) {
    result.applicationDate = dateMatch[1].trim();
  }

  // 4. Mobile No
  const mobileMatch = text.match(/Mobile No\.\s*(\d{10})/i)
    || text.match(/\b([6-9]\d{9})\b/);
  if (mobileMatch) {
    result.mobileNo = mobileMatch[1].trim();
  }

  // 5. Consumer Account Number in Discom
  const accountMatch = text.match(/Consumer Account Number in Discom\s*(\d+)/i)
    || text.match(/Consumer Account\s*(?:Number|No\.?)?\s*(?:in Discom)?\s*[:\-]?\s*(\d{8,16})/i);
  if (accountMatch) {
    result.consumerAccountNo = accountMatch[1].trim();
  }

  // 6. Applied Capacity (in kWp)
  const capacityMatch = text.match(/Applied Roof Top Solar Capacity\s*(?:\(in kWp\))?\s*([0-9\.]+)/i)
    || text.match(/Applied Capacity\s*[–\-:]*\s*([0-9\.]+\s*(?:kWp)?)/i);
  if (capacityMatch) {
    result.appliedCapacity = capacityMatch[1].trim();
    if (!result.appliedCapacity.toLowerCase().includes('kwp')) {
      result.appliedCapacity += ' kWp';
    }
  }

  // 7. Sanctioned Load
  const loadMatch = text.match(/Contract Demand\/Sanctioned Load in Discom\s*([0-9\.]+\s*(?:kW)?)/i);
  if (loadMatch) {
    result.sanctionedLoad = loadMatch[1].trim();
  }

  // 8. DISCOM Name
  const discomMatch = text.match(/submitted to the\s+([A-Za-z\s]+(?:Company\s+Limited|DISCOM|Nigam|Vidyut|Power))/i);
  if (discomMatch) {
    result.discom = cleanText(discomMatch[1]);
  } else if (text.includes('Uttar Gujarat Vij Company Limited') || text.includes('UGVCL')) {
    result.discom = 'Uttar Gujarat Vij Company Limited';
  } else if (text.includes('Paschim Gujarat Vij Company Limited') || text.includes('PGVCL')) {
    result.discom = 'Paschim Gujarat Vij Company Limited';
  } else if (text.includes('Dakshin Gujarat Vij Company Limited') || text.includes('DGVCL')) {
    result.discom = 'Dakshin Gujarat Vij Company Limited';
  } else if (text.includes('Madhya Gujarat Vij Company Limited') || text.includes('MGVCL')) {
    result.discom = 'Madhya Gujarat Vij Company Limited';
  }

  // 9. Address of Premises for Installation
  // In screenshot:
  // "11 Address of Premises for Installation: AT-HARIJ,, District: Patan, State: GUJARAT, PIN Code: 384240"
  const addressMatch = text.match(/Address of Premises for Installation:\s*([\s\S]+?)(?=\s*(?:3\.|Your application|Disclaimer|Self-Declaration|$))/i);
  if (addressMatch) {
    const rawAddr = addressMatch[1];
    // Clean up excessive whitespace and unwanted line numbers
    const cleanAddr = rawAddr
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\b11\b/g, '')
      .trim();
    result.address = cleanAddr;
  } else {
    // Fallback: search for District, State, PIN Code
    const pinMatch = text.match(/PIN Code:\s*(\d{6})/i) || text.match(/\b(3\d{5})\b/);
    const distMatch = text.match(/District:\s*([A-Za-z]+)/i);
    const stateMatch = text.match(/State:\s*([A-Za-z]+)/i);
    const atMatch = text.match(/AT-([A-Za-z0-9\s]+)/i);

    const parts = [];
    if (atMatch) parts.push(`AT-${atMatch[1].trim()}`);
    if (distMatch) parts.push(`District: ${distMatch[1].trim()}`);
    if (stateMatch) parts.push(`State: ${stateMatch[1].trim()}`);
    if (pinMatch) parts.push(`PIN Code: ${pinMatch[1] || pinMatch[0]}`);

    if (parts.length > 0) {
      result.address = parts.join(', ');
    }
  }

  return result;
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Default sample data directly from the user's uploaded application screenshot!
 */
export const SAMPLE_APPLICATION_DATA = {
  applicantName: "THAKOR MANORJI PRATAPJI",
  address: "AT-HARIJ,, District: Patan, State: GUJARAT, PIN Code: 384240",
  applicationNo: "NP-GJUG25-8615248",
  applicationDate: "22-09-2025",
  mobileNo: "9913997154",
  consumerAccountNo: "28527134225",
  appliedCapacity: "3.300 kWp",
  sanctionedLoad: "1.000 kW",
  discom: "Uttar Gujarat Vij Company Limited",
  category: "Residential"
};
