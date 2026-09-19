import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the 4 agreement pages into a pristine, high-resolution A4 multi-page PDF.
 * @param {Object} metadata
 * @param {Function} onProgress
 * @returns {Promise<void>}
 */
export async function generateAgreementPdf(metadata = {}, onProgress = () => {}) {
  const pageIds = [
    'agreement-page-1',
    'agreement-page-2',
    'agreement-page-3',
    'agreement-page-4'
  ];

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const a4Width = 210;
  const a4Height = 297;

  for (let i = 0; i < pageIds.length; i++) {
    const pageId = pageIds[i];
    const element = document.getElementById(pageId);

    if (!element) {
      console.warn(`Element with id "${pageId}" not found`);
      continue;
    }

    onProgress({ current: i + 1, total: pageIds.length, stage: `Rendering page ${i + 1} of 4...` });

    // Render page to canvas with high resolution scale
    const canvas = await html2canvas(element, {
      scale: 2.2, // crisp high DPI
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height, undefined, 'FAST');
  }

  onProgress({ current: 4, total: 4, stage: 'Finalizing PDF...' });

  const cleanName = (metadata.consumerName || 'Consumer')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 30);
  const cleanAppNo = (metadata.applicationNo || 'Agreement')
    .replace(/[^a-zA-Z0-9\-]/g, '_');

  const filename = `Agreement_${cleanName}_${cleanAppNo}.pdf`;
  pdf.save(filename);

  return filename;
}
