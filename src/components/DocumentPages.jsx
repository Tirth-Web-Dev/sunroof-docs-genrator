import React from 'react';
import { Stamp } from './Stamp';
import './DocumentPages.css';

function OfficialPageFooter({ pageNumber, consumerSignatureUrl, includeStamp, vendorStamp, vendorName, customStampUrl }) {
  return (
    <div className="official-page-footer">
      <div className="official-footer-signs">
        <div className="official-footer-sig-slot">
          {consumerSignatureUrl && (
            <img src={consumerSignatureUrl} alt="First Party Signature" className="official-footer-sig-img" />
          )}
        </div>
        <div className="official-footer-stamp-slot">
          {includeStamp && (
            <Stamp stampImg={vendorStamp} vendorName={vendorName} customStampUrl={customStampUrl} />
          )}
        </div>
      </div>
      <div className="official-page-number">{pageNumber}</div>
    </div>
  );
}

export function DocumentPages({ data, activeTab = 'all' }) {
  const {
    consumerName = '',
    consumerAccountNo = '',
    consumerAddress = '',
    consumerSignatureUrl = null,
    vendorName = 'SUNROOF ENERGY',
    vendorAddress = '',
    vendorStamp = null,
    includeDate = false,
    executionDay = '19',
    executionMonth = '09',
    executionYear = '2026',
    includeStamp = true,
    customStampUrl = null,
  } = data;

  const isVisible = (pageId) => {
    if (activeTab === 'all') return true;
    return activeTab === pageId;
  };

  const dayText = executionDay ? executionDay.toString().padStart(2, '0') : '____';
  const monthText = executionMonth ? executionMonth.toString().padStart(2, '0') : '____';
  const yearText = executionYear ? executionYear.toString() : '________';

  const executionDateText = includeDate
    ? `${dayText} (Day) ${monthText} (Month) ${yearText} (Year)`
    : `____ (Day) ____ (Month) ________ (Year)`;

  const signatureDateText = includeDate
    ? `${dayText}/${monthText}/${yearText}`
    : `___/___/________`;

  return (
    <div className="document-pages-container" id="printable-agreement">

      {/* ══════════════════════ PAGE 1 ══════════════════════ */}
      <div
        className="a4-page official-a4-page"
        id="agreement-page-1"
        style={{ display: isVisible('1') ? 'flex' : 'none' }}
      >
        <div className="official-page-body">
          <div className="official-annexure-heading">Annexure 2</div>

          <h1 className="official-main-title">
            Model Draft Agreement between Consumer &amp; Vendor for installation of grid connected rooftop solar (RTS) project under PM –<br />
            Surya Ghar: Muft Bijli Yojana
          </h1>

          <p className="official-para">
            This agreement is executed on <strong>{executionDateText}</strong> for design, supply, installation, commissioning and 5-year comprehensive
            maintenance of RTS project/system along with warranty under PM Surya Ghar: Muft Bijli Yojana
          </p>

          <div className="official-center-word">Between</div>

          <p className="official-para">
            <strong>{consumerName || '___________________________'}</strong> (Consumer Account No: {consumerAccountNo || '____________'}) having Address : {consumerAddress || '_____________________________________'} (Hereinafter referred to as first Party i.e., /consumer/purchaser /owner of system).
          </p>

          <div className="official-center-word">And</div>

          <p className="official-para">
            <strong>{vendorName || '___________________________'}</strong> (Name of Vendor) having registered office at {vendorAddress || '_____________________________________'} (hereinafter referred to as second Party i.e. Vendor/ contractor/ System Integrator).
          </p>

          <div className="official-center-word">Whereas</div>

          <p className="official-para">
            First Party wishes to install a Grid Connected Rooftop Solar Plant on the rooftop of the residential building of the Consumer under PM Surya Ghar: Muft Bijli Yojana.
          </p>

          <div className="official-center-word">And whereas</div>

          <p className="official-para">
            Second Party has verified availability of appropriate roof and found it feasible to install a Grid Connected Roof Top Solar plant and that the
            second party is willing to design, supply, install, test, commission and carry out Operation &amp; Maintenance of the Rooftop Solar plant for 5 year
            period
          </p>

          <p className="official-para">
            On this day, the First Party and Second Party agree to the following:
          </p>

          <div className="official-undertaking-title">
            The First Party hereby undertakes to perform the following activities:
          </div>

          <ol className="official-clause-list" start="1">
            <li>Submission of online application at National Portal for installation of RTS project/system, Submission of application for net-metering and system inspection and upload of the relevant documents on the National Portal of the scheme</li>
            <li>Provide secure storage of the material of the RTS plant delivered at the premises till handover of the system.</li>
            <li>Provide access to the Roof Top during installation of the plant, operation &amp; maintenance, testing of the plant and equipment and for meter reading from solar meter, inverter etc.</li>
            <li>Provide electricity during plant installation and water for cleaning of the panels.</li>
            <li>Report any malfunctioning of the plant to the Vendor during the warranty period.</li>
            <li>Pay the amount as per the payment schedule as mutually agreed with the vendor, including any additional amount to the second party for any additional work /customization required depending upon the building condition.</li>
          </ol>

          <div className="official-undertaking-title" style={{ marginTop: '11px', marginBottom: '6px' }}>
            The Second Party hereby undertakes to perform the following activities:
          </div>

          <ol className="official-clause-list" start="1">
            <li>The Vendor must follow all the standards and safety guidelines prescribed under state regulations and technical standards prescribed by MNRE for RTS projects, failing which the vendor is liable for blacklisting from participation in the govt. project/ scheme and other penal actions in accordance with the law. The responsibility of supply, installation and commissioning of the rooftop solar project/system in complete compliance with MNRE scheme guidelines lies with the Vendor.</li>
            <li><span className="official-clause-lead">Site Survey:</span> Site visit, survey and development of detailed project report for installation of RTS system. This also includes feasibility study of roof, strength of roof and shadow free area. If any additional work or customization is involved for the plant installation as per site condition and requirement of the consumer building, the Vendor shall prepare an estimate and can raise separate invoice including GST in addition to the amount towards standard plant cost. The consumer shall pay the amount for such additional work directly to the Vendor.</li>
          </ol>
        </div>

        <OfficialPageFooter
          pageNumber={1}
          consumerSignatureUrl={consumerSignatureUrl}
          includeStamp={includeStamp}
          vendorStamp={vendorStamp}
          vendorName={vendorName}
          customStampUrl={customStampUrl}
        />
      </div>

      {/* ══════════════════════ PAGE 2 ══════════════════════ */}
      <div
        className="a4-page official-a4-page"
        id="agreement-page-2"
        style={{ display: isVisible('2') ? 'flex' : 'none' }}
      >
        <div className="official-page-body">
          <ol className="official-clause-list" start="3">
            <li><span className="official-clause-lead">Design &amp; Engineering:</span> Design of plant along with drawings and selection of components as per standard provided by the DISCOM/SERC/MNRE for best performance and safety of the plant.</li>
            <li><span className="official-clause-lead">Module and Inverter:</span> The solar modules, including the solar cells, should be manufactured in India. Both the solar modules and inverters shall conform to the relevant standards and specifications prescribed by MNRE. Any other requirement, viz. star labeling (solar modules), quality control orders and standards &amp; labeling (inverters) etc., shall also be complied.</li>
            <li><span className="official-clause-lead">Procurement &amp; Supply:</span> Procurement of complete system as per BIS/IS/IEC standard (whatever applicable) &amp; safety guidelines for installation of rooftop solar plants. The supplied materials should comply with all MNRE standards for release of subsidy.</li>
            <li><span className="official-clause-lead">Installation &amp; Civil work:</span> Complete civil work, structure work and electrical work (including drawings) following all the safety and relevant BIS standards.</li>
            <li><span className="official-clause-lead">Documentation (Technical Catalogues/Warranty Certificates/BIS certificates/other test reports etc):</span> All such documents shall be provided to the consumer for online uploading and submission of technical specifications, IEC/BIS report, Sr. Nos, Warranty card of Solar Panel &amp; Inverter, Layout &amp; Electrical SLD, Structure Design and Drawing, Cable and other detailed documents.</li>
            <li><span className="official-clause-lead">Project completion report (PCR):</span> Assisting the consumer in filling and uploading of signed documents (Consumer &amp; Vendor) on the national portal.</li>
            <li><span className="official-clause-lead">Warranty:</span> System warranty certificates should be provided to the consumer. The complete system should be warranted for 5 years from the date of commissioning by DISCOM. Individual component warranty documents provided by the manufacturer shall be provided to the consumer and all possible assistance should be extended to the consumer for claiming the warranty from the manufacturer.</li>
            <li><span className="official-clause-lead">NET meter &amp; Grid Connectivity:</span> Net meter supply/procurement, testing and approvals shall be in the scope of vendor. Grid connection of the plant shall be in the scope of the vendor.</li>
            <li><span className="official-clause-lead">Testing and Commissioning:</span> The vendor shall be present at the time of testing and commissioning by the DISCOM.</li>
            <li><span className="official-clause-lead">Operation &amp; Maintenance:</span> Five (5) years Comprehensive Operation and Maintenance including overhauling, wear and tear and regular checking of healthiness of system at proper interval shall be in the scope of vendor. The vendor shall also educate the consumer on best practices for cleaning of the modules and system maintenance.</li>
            <li><span className="official-clause-lead">Insurance:</span> Any insurance cost pertaining to material transfer/storage before commissioning of the system shall be in the scope of the vendor.</li>
          </ol>
        </div>

        <OfficialPageFooter
          pageNumber={2}
          consumerSignatureUrl={consumerSignatureUrl}
          includeStamp={includeStamp}
          vendorStamp={vendorStamp}
          vendorName={vendorName}
          customStampUrl={customStampUrl}
        />
      </div>

      {/* ══════════════════════ PAGE 3 ══════════════════════ */}
      <div
        className="a4-page official-a4-page"
        id="agreement-page-3"
        style={{ display: isVisible('3') ? 'flex' : 'none' }}
      >
        <div className="official-page-body">
          <ol className="official-clause-list" start="14">
            <li><span className="official-clause-lead">Applicable Standard:</span> The system must meet the technical standards and specifications notified by MNRE. The vendor is solely responsible to supply component and service which meets the technical standards and specification prescribed by MNRE and State DISCOMs.</li>
            <li><span className="official-clause-lead">Project/system cost &amp; payment terms:</span> The cost of the plant and payment schedule should be mutually discussed and decided between the vendor and consumer. The consumer may opt for milestone-based payment to the vendor and the same shall be included in the agreement.</li>
            <li><span className="official-clause-lead">Dispute:</span> In-case of any dispute between consumer and vendor (in supply/installation/maintenance of system or payment terms), both parties must settle the same mutually or as per law. MNRE/DISCOM shall not be liable for, and would not be a party to any dispute arising between vendor and consumer.</li>
            <li><span className="official-clause-lead">Subsidy / Project Related Documents:</span> Vendor must provide all the documents to consumer and help in uploading the same to National Portal for smooth release of subsidy.</li>
            <li><span className="official-clause-lead">Performance of Plant:</span> The Performance Ratio (PR) of Plant must be 75% at the time of commissioning of the project by DISCOM or its authorized agency. Vendor must provide (returnable basis) radiation sensor with valid calibration certificate of any NABL / International laboratory at the time of commissioning / testing of the plant. Vendor must maintain the PR of the plant till warranty of project i.e. 5 years from the date of commissioning.</li>
          </ol>

          <div className="official-payment-heading">19. Mutually Agreed Terms of Payment …</div>

          <div className="hu-table-shell official-hu-table" role="table" aria-label="Agreement Signatories">
            <div className="hu-table-head official-hu-grid" role="row">
              <div className="hu-th" role="columnheader">First Party</div>
              <div className="hu-th" role="columnheader">Second Party</div>
            </div>

            <div className="hu-table-body-card" role="rowgroup">
              <div className="hu-tr official-hu-grid" role="row">
                <div className="hu-td official-hu-cell" role="cell">
                  <div><strong>NAME :</strong> {consumerName || '________________________________'}</div>
                  <div className="official-table-subline"><strong>Consumer A/C No:</strong> {consumerAccountNo || '____________'}</div>
                </div>
                <div className="hu-td official-hu-cell" role="cell">
                  <div><strong>Name :</strong> {vendorName || '________________________________'}</div>
                </div>
              </div>

              <div className="hu-tr official-hu-grid" role="row">
                <div className="hu-td official-hu-cell" role="cell">
                  <strong>Address :</strong> {consumerAddress || '________________________________'}
                </div>
                <div className="hu-td official-hu-cell" role="cell">
                  <strong>Address :</strong> {vendorAddress || '________________________________'}
                </div>
              </div>

              <div className="hu-tr official-hu-grid" role="row">
                <div className="hu-td official-hu-cell official-sign-cell" role="cell">
                  <div className="official-sign-label">SIGN</div>
                  <div className="official-table-sig-wrap">
                    {consumerSignatureUrl && (
                      <img src={consumerSignatureUrl} alt="First Party Signature" className="official-table-sig-img" />
                    )}
                  </div>
                </div>
                <div className="hu-td official-hu-cell official-sign-cell" role="cell">
                  <div className="official-sign-label">SIGN</div>
                  <div className="official-table-sig-wrap">
                    {includeStamp && (
                      <div className="official-table-stamp">
                        <Stamp stampImg={vendorStamp} vendorName={vendorName} customStampUrl={customStampUrl} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="hu-tr official-hu-grid" role="row">
                <div className="hu-td official-hu-cell" role="cell">
                  <strong>DATE:</strong> {signatureDateText}
                </div>
                <div className="hu-td official-hu-cell" role="cell">
                  <strong>DATE:</strong> {signatureDateText}
                </div>
              </div>
            </div>
          </div>

          <div className="official-disclaimer">
            <strong>Disclaimer:</strong> This agreement is between vendor and consumer and any dispute related to the same shall not involve any third party including MNRE and Distribution Utilities.
          </div>
        </div>

        <div className="official-page-number" style={{ marginTop: '8px' }}>3</div>
      </div>

    </div>
  );
}
