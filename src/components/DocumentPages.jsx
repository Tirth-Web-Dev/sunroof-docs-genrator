import React from 'react';
import { Stamp } from './Stamp';

export function DocumentPages({ data, activeTab = 'all' }) {
  const {
    consumerName = '',
    consumerAddress = '',
    consumerSignatureUrl = null,
    vendorName = '',
    vendorAddress = '',
    vendorStamp = null,
    includeDate = false,
    executionDay = '19',
    executionMonth = '09',
    executionYear = '2026',
    includeStamp = true,
    customStampUrl = null
  } = data;

  const isVisible = (pageId) => {
    if (activeTab === 'all') return true;
    return activeTab === pageId;
  };

  // Format date display
  const executionDateText = includeDate
    ? `${executionDay}(Day) ${executionMonth} (Month) ${executionYear} (Year)`
    : `____(Day) ____ (Month) ________ (Year)`;

  const signatureDateText = includeDate
    ? `${executionDay.padStart(2, '0')}/${executionMonth.padStart(2, '0')}/${executionYear}`
    : `________________`;

  return (
    <div className="document-pages-container" id="printable-agreement">
      {/* PAGE 1 */}
      <div
        className="a4-page"
        id="agreement-page-1"
        style={{ display: isVisible('1') ? 'flex' : 'none' }}
      >
        <div className="a4-page-content">
          <div className="doc-header-block">
            <div className="annexure-title">Annexure 2</div>
            <h1 className="doc-title-main">
              Model Draft Agreement between Consumer & Vendor for installation of grid connected rooftop solar (RTS) project under PM – Surya Ghar: Muft Bijli Yojana
            </h1>
          </div>

          <p className="doc-paragraph execution-clause">
            This agreement is executed on <span className="underline-bold">{executionDateText}</span> for design, supply, installation, commissioning and 5-year comprehensive maintenance of RTS project/system along with warranty under PM Surya Ghar: Muft Bijli Yojana
          </p>

          <div className="center-party-divider">Between</div>

          <p className="doc-paragraph party-clause">
            <span className="underline-bold">{consumerName || '___________________________'}</span> ( Name of Consumer) having Address : <span className="underline-bold">{consumerAddress || '_____________________________________________________'}</span> (Hereinafter referred to asfirst Party i.e., /consumer/consumer/purchaser /owner of system).
          </p>

          <div className="center-party-divider">And</div>

          <p className="doc-paragraph party-clause">
            <span className="underline-bold">{vendorName || '___________________________'}</span> (Name of Vendor) having registered office at <span className="underline-bold">{vendorAddress || '_____________________________________________________'}</span> (hereinafter referred to as second Party i.e. Vendor/ contractor/System Integrator).
          </p>

          <div className="doc-section-tag">Whereas</div>

          <p className="doc-paragraph recital-clause">
            First Party wishesto install a Grid Connected Rooftop Solar Plant on the rooftop of the residential building of the Consumer under PM Surya Ghar: Muft Bijli Yojana.
          </p>

          <div className="doc-section-tag">And whereas</div>

          <p className="doc-paragraph recital-clause">
            Second Party has verified availability of appropriate roof and found it feasible to install a Grid Connected Roof Top Solar plant and that the second party is willing to design, supply, install, test, commission and carry out Operation & Maintenance of the Rooftop Solar plant for 5 year period
          </p>

          <p className="doc-paragraph">
            On this day, the First Party and Second Party agree to the following:
          </p>

          <div className="undertaking-heading underline-bold">
            The First Party hereby undertakes to perform the following activities:
          </div>
        </div>
        <div className="a4-page-footer">1</div>
      </div>

      {/* PAGE 2 */}
      <div
        className="a4-page"
        id="agreement-page-2"
        style={{ display: isVisible('2') ? 'flex' : 'none' }}
      >
        <div className="a4-page-content">
          <ol className="clause-numbered-list" start="1">
            <li>
              Submission of online application at National Portal for installation of RTS project/system, Submission of application for net-metering and system inspection and upload of the relevant documents on the National Portal of the scheme
            </li>
            <li>
              Provide secure storage of the material of the RTS plant delivered at the premises till handover of the system.
            </li>
            <li>
              Provide access to the Roof Top during installation of the plant, operation & maintenance, testing of the plant and equipment and for meter reading from solar meter, inverter etc.
            </li>
            <li>
              Provide electricity during plant installation and water for cleaning of the panels.
            </li>
            <li>
              Report any malfunctioning of the plant to the Vendor during the warranty period.
            </li>
            <li>
              Pay the amount as per the payment schedule as mutually agreed with the vendor, including any additional amount to the second party for any additional work /customization required depending upon the building condition.
            </li>
          </ol>

          <div className="undertaking-heading underline-bold" style={{ marginTop: '22px', marginBottom: '14px' }}>
            The Second Party hereby undertakes to perform the following activities:
          </div>

          <ol className="clause-numbered-list" start="1">
            <li>
              The Vendor must follow all the standards and safety guidelines prescribed under state regulations and technical standards prescribed by MNRE for RTS projects, failing which the vendor is liable for blacklisting from participation in the govt. project/ scheme and other penal actions in accordance with the law. The responsibility of supply, installation and commissioning of the rooftop solar project/system in complete compliance with MNRE scheme guidelines lies with the Vendor.
            </li>
            <li>
              <strong>Site Survey:</strong> Site visit, survey and development of detailed project report for installation of RTS system. This also includes feasibility study of roof, strength of roof and shadow free area. If any additional work or customization is involved for the plant installation as per site condition and requirement of the consumer building, the Vendor shall prepare an estimate and can raise separate invoice including GST in addition to the amount towards standard plant cost. The consumer shall pay the amount for such additional work directly to the Vendor.
            </li>
            <li>
              <strong>Design & Engineering:</strong> Design of plant along with drawings and selection of components as per standard provided by the DISCOM/SERC/MNRE for best performance and safety of the plant.
            </li>
          </ol>
        </div>
        <div className="a4-page-footer">2</div>
      </div>

      {/* PAGE 3 */}
      <div
        className="a4-page"
        id="agreement-page-3"
        style={{ display: isVisible('3') ? 'flex' : 'none' }}
      >
        <div className="a4-page-content">
          <ol className="clause-numbered-list" start="4">
            <li>
              <strong>Module and Inverter:</strong> The solar modules, including the solar cells, should be manufactured in India. Both the solar modules and inverters shall conform to the relevant standards and specifications prescribed by MNRE. Any other requirement, viz. star labeling (solar modules), quality control orders and standards & labeling (inverters) etc., shall also be complied.
            </li>
            <li>
              <strong>Procurement & Supply:</strong> Procurement of complete system as per BIS/IS/IEC standard (whatever applicable) & safety guidelines for installation of rooftop solar plants. The supplied materials should comply with all MNRE standards for release of subsidy.
            </li>
            <li>
              <strong>Installation & Civil work:</strong> Complete civil work, structure work and electrical work (including drawings) following all the safety and relevant BIS standards.
            </li>
            <li>
              <strong>Documentation (Technical Catalogues/Warranty Certificates/BIS certificates/other test reports etc):</strong> All such documents shall be provided to the consumer for online uploading and submission of technical specifications, IEC/BIS report, Sr. Nos, Warranty card of Solar Panel & Inverter, Layout & Electrical SLD, Structure Design and Drawing, Cable and other detailed documents.
            </li>
            <li>
              <strong>Project completion report (PCR):</strong> Assisting the consumer in filling and uploading of signed documents (Consumer & Vendor) on the national portal.
            </li>
            <li>
              <strong>Warranty:</strong> System warranty certificates should be provided to the consumer. The complete system should be warranted for 5 years from the date of commissioning by DISCOM. Individual component warranty documents provided by the manufacturer shall be provided to the consumer and all possible assistance should be extended to the consumer for claiming the warranty from the manufacturer.
            </li>
            <li>
              <strong>NET meter & Grid Connectivity:</strong> Net meter supply/procurement, testing and approvals shall be in the scope of vendor. Grid connection of the plant shall be in the scope of the vendor.
            </li>
            <li>
              <strong>Testing and Commissioning:</strong> The vendor shall be present at the time of testing and commissioning by the DISCOM.
            </li>
            <li>
              <strong>Operation & Maintenance:</strong> Five (5) years Comprehensive Operation and Maintenance including overhauling, wear and tear and regular checking of healthiness of system at proper interval shall be in the scope of vendor. The vendor shall also educate the consumer on best practices for cleaning of the modules and system maintenance.
            </li>
          </ol>
        </div>
        <div className="a4-page-footer">3</div>
      </div>

      {/* PAGE 4 */}
      <div
        className="a4-page"
        id="agreement-page-4"
        style={{ display: isVisible('4') ? 'flex' : 'none' }}
      >
        <div className="a4-page-content">
          <ol className="clause-numbered-list" start="13">
            <li>
              <strong>Insurance:</strong> Any insurance cost pertaining to material transfer/storage before commissioning of the system shall be in the scope of the vendor.
            </li>
            <li>
              <strong>Applicable Standard:</strong> The system must meet the technical standards and specifications notified by MNRE. The vendor is solely responsible to supply component and service which meets the technical standards and specification prescribed by MNRE and State DISCOMs.
            </li>
            <li>
              <strong>Project/system cost & payment terms:</strong> The cost of the plant and payment schedule should be mutually discussed and decided between the vendor and consumer. The consumer may opt for milestone-based payment to the vendor and the same shall be included in the agreement.
            </li>
            <li>
              <strong>Dispute:</strong> In-case of any dispute between consumer and vendor (in supply/installation/maintenance of system or payment terms), both parties must settle the same mutually or as per law. MNRE/DISCOM shall not be liable for, and would not be a party to any dispute arising between vendor and consumer.
            </li>
            <li>
              <strong>Subsidy / Project Related Documents:</strong> Vendor must provide all the documents to consumer and help in uploading the same to National Portal for smooth release of subsidy.
            </li>
            <li>
              <strong>Performance of Plant:</strong> The Performance Ratio (PR) of Plant must be 75% at the time of commissioning of the project by DISCOM or its authorized agency. Vendor must provide (returnable basis) radiation sensor with valid calibration certificate of any NABL / International laboratory at the time of commissioning /testing of the plant. Vendor must maintain the PR of the plant till warranty of project i.e. 5 years from the date of commissioning.
            </li>
          </ol>

          <div className="payment-clause-title">
            19. Mutually Agreed Terms of Payment …
          </div>

          <table className="signature-grid-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>First Party</th>
                <th style={{ width: '50%' }}>Second Party</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>NAME: </strong>
                  <span className="underline-bold">{consumerName}</span>
                </td>
                <td>
                  <strong>Name: - </strong>
                  <span className="underline-bold">{vendorName}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Address: </strong>
                  <span className="underline-bold">{consumerAddress}</span>
                </td>
                <td>
                  <strong>Address: </strong>
                  <span className="underline-bold">{vendorAddress}</span>
                </td>
              </tr>
              <tr>
                <td className="signature-box-cell">
                  <div className="signature-box-label">SIGN</div>
                  <div className="signature-first-party-box">
                    {consumerSignatureUrl ? (
                      <img
                        src={consumerSignatureUrl}
                        alt="Consumer Signature"
                        className="first-party-sig-img"
                      />
                    ) : (
                      <div className="signature-blank-box"></div>
                    )}
                  </div>
                </td>
                <td className="signature-box-cell">
                  <div className="signature-box-label">SIGN</div>
                  <div className="signature-vendor-box">
                    {includeStamp && (
                      <Stamp
                        stampImg={vendorStamp}
                        vendorName={vendorName}
                        customStampUrl={customStampUrl}
                      />
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>DATE: </strong>
                  <span>{signatureDateText}</span>
                </td>
                <td>
                  <strong>DATE: </strong>
                  <span>{signatureDateText}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="doc-disclaimer-note">
            Disclaimer: This agreement is between vendor and consumer and any dispute related to the same shall not involve any third party including MNRE and Distribution Utilities.
          </div>
        </div>
        <div className="a4-page-footer">4</div>
      </div>
    </div>
  );
}
