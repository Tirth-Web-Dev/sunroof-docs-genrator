import React from 'react';
import { Stamp } from './Stamp';
import { COMPANY_PROFILES } from '../utils/constants';

/* ─── Letterhead: top accent bar + logo + company info + scheme badge ─── */
function PageLetterhead({ companyId }) {
  const profile = COMPANY_PROFILES[companyId] || COMPANY_PROFILES.sunroof;
  return (
    <>
      {/* Top accent bar */}
      <div className="doc-top-bar" />

      <div className="doc-letterhead">
        {/* Left: logo + info */}
        <div className="doc-letterhead-left">
          <img src={profile.logo} alt={profile.name} className="doc-letterhead-logo" />
          <div className="doc-letterhead-info">
            <span className="doc-letterhead-name">{profile.name}</span>
            <span className="doc-letterhead-address">{profile.address}</span>
            <span className="doc-letterhead-contact">
              {/* Phone icon */}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
                <path d="M6.015 3.32c-.378-.388-.944-.463-1.394-.147l-1.603 1.1C1.87 5.063 1.315 6.472 1.8 7.72c1.124 2.941 3.052 6.037 5.942 8.927 2.89 2.89 5.986 4.818 8.927 5.942 1.248.485 2.657-.07 3.447-1.218l1.1-1.603c.316-.45.241-1.016-.147-1.394l-2.532-2.532a1 1 0 0 0-1.278-.097l-1.738 1.238c-.41.292-.967.22-1.31-.122l-4.74-4.74c-.343-.343-.414-.9-.122-1.31l1.238-1.738a1 1 0 0 0-.097-1.278L6.015 3.32Z" />
              </svg>
              {profile.contact}
              <span className="doc-contact-sep" />
              {/* Email icon */}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 8.586 5.172a2 2 0 0 0 2.172.048L22 7" />
              </svg>
              {profile.email}
            </span>
          </div>
        </div>

        {/* Right: scheme badge */}
        <div className="doc-letterhead-badge">
          <span className="doc-letterhead-scheme">PM Surya Ghar</span>
          <span className="doc-letterhead-sub">Muft Bijli Yojana</span>
          <span className="doc-letterhead-ref">Govt. of India Scheme</span>
        </div>
      </div>

      {/* Double rule separator */}
      <div className="doc-letterhead-rule-wrap">
        <div className="doc-letterhead-rule-thick" />
        <div className="doc-letterhead-rule-thin" />
      </div>
    </>
  );
}

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
    customStampUrl = null,
    selectedCompany = 'sunroof',
  } = data;

  const isVisible = (pageId) => {
    if (activeTab === 'all') return true;
    return activeTab === pageId;
  };

  const executionDateText = includeDate
    ? `${executionDay} (Day)   ${executionMonth} (Month)   ${executionYear} (Year)`
    : `____ (Day)   ____ (Month)   ________ (Year)`;

  const signatureDateText = includeDate
    ? `${executionDay.padStart(2, '0')} / ${executionMonth.padStart(2, '0')} / ${executionYear}`
    : `___ / ___ / ________`;

  return (
    <div className="document-pages-container" id="printable-agreement">

      {/* ══════════════════════ PAGE 1 ══════════════════════ */}
      <div className="a4-page" id="agreement-page-1" style={{ display: isVisible('1') ? 'flex' : 'none' }}>
        <PageLetterhead companyId={selectedCompany} />

        <div className="a4-page-content">

          {/* Title block */}
          <div className="doc-header-block">
            <div className="doc-annexure-label">Annexure — II</div>
            <h1 className="doc-title-main">
              Model Draft Agreement between Consumer &amp; Vendor<br />
              for Installation of Grid Connected Rooftop Solar (RTS) Project<br />
              <span className="doc-title-scheme">under PM–Surya Ghar: Muft Bijli Yojana</span>
            </h1>
            <div className="doc-title-ornament">
              <div className="doc-ornament-line" />
              <div className="doc-ornament-diamond" />
              <div className="doc-ornament-line" />
            </div>
          </div>

          {/* Execution clause */}
          <p className="doc-paragraph">
            This agreement is executed on&nbsp;
            <span className="underline-span">{executionDateText}</span>
            &nbsp;for design, supply, installation, commissioning and 5-year comprehensive
            maintenance of RTS project/system along with warranty under PM Surya Ghar: Muft Bijli Yojana.
          </p>

          {/* Parties */}
          <div className="doc-party-block">
            <div className="doc-between-row">
              <div className="doc-between-line" /><span className="doc-between-word">Between</span><div className="doc-between-line" />
            </div>

            <div className="doc-party-card">
              <div className="doc-party-card-label">First Party — Consumer / Owner</div>
              <p className="doc-paragraph doc-party-text">
                <span className="underline-span fw-bold">{consumerName || '___________________________'}</span>
                &nbsp;having address:&nbsp;
                <span className="underline-span">{consumerAddress || '_____________________________________'}</span>
                &nbsp;(hereinafter referred to as <em>First Party</em> i.e., Consumer / Purchaser / Owner of System).
              </p>
            </div>

            <div className="doc-between-row">
              <div className="doc-between-line" /><span className="doc-between-word">And</span><div className="doc-between-line" />
            </div>

            <div className="doc-party-card">
              <div className="doc-party-card-label">Second Party — Vendor / Contractor</div>
              <p className="doc-paragraph doc-party-text">
                <span className="underline-span fw-bold">{vendorName || '___________________________'}</span>
                &nbsp;having registered office at&nbsp;
                <span className="underline-span">{vendorAddress || '_____________________________________'}</span>
                &nbsp;(hereinafter referred to as <em>Second Party</em> i.e. Vendor / Contractor / System Integrator).
              </p>
            </div>
          </div>

          {/* Recitals */}
          <div className="doc-recital-block">
            <p className="doc-paragraph">
              <span className="doc-recital-tag">Whereas,</span> First Party wishes to install a Grid Connected Rooftop Solar Plant on the rooftop of the residential building of the Consumer under PM Surya Ghar: Muft Bijli Yojana.
            </p>
            <p className="doc-paragraph">
              <span className="doc-recital-tag">And Whereas,</span> Second Party has verified availability of appropriate roof and found it feasible to install a Grid Connected Roof Top Solar plant and that the Second Party is willing to design, supply, install, test, commission and carry out Operation &amp; Maintenance of the Rooftop Solar plant for a 5-year period.
            </p>
          </div>

          <p className="doc-paragraph">
            On this day, the First Party and Second Party agree to the following:
          </p>

          <div className="doc-undertaking-heading">
            The First Party hereby undertakes to perform the following activities:
          </div>
        </div>

        <div className="a4-page-footer">
          <div className="doc-footer-inner">
            <span className="doc-footer-company">{(COMPANY_PROFILES[selectedCompany] || COMPANY_PROFILES.sunroof).name}</span>
            <span className="doc-footer-page">1 / 4</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════ PAGE 2 ══════════════════════ */}
      <div className="a4-page" id="agreement-page-2" style={{ display: isVisible('2') ? 'flex' : 'none' }}>
        <PageLetterhead companyId={selectedCompany} />

        <div className="a4-page-content">
          <ol className="clause-list" start="1">
            <li>Submission of online application at National Portal for installation of RTS project/system, submission of application for net-metering and system inspection and upload of the relevant documents on the National Portal of the scheme.</li>
            <li>Provide secure storage of the material of the RTS plant delivered at the premises till handover of the system.</li>
            <li>Provide access to the Roof Top during installation of the plant, operation &amp; maintenance, testing of the plant and equipment and for meter reading from solar meter, inverter etc.</li>
            <li>Provide electricity during plant installation and water for cleaning of the panels.</li>
            <li>Report any malfunctioning of the plant to the Vendor during the warranty period.</li>
            <li>Pay the amount as per the payment schedule as mutually agreed with the vendor, including any additional amount to the second party for any additional work / customization required depending upon the building condition.</li>
          </ol>

          <div className="doc-section-break">
            <div className="doc-section-break-line" />
            <div className="doc-section-break-label">Second Party Obligations</div>
            <div className="doc-section-break-line" />
          </div>

          <div className="doc-undertaking-heading">
            The Second Party hereby undertakes to perform the following activities:
          </div>

          <ol className="clause-list" start="1">
            <li>The Vendor must follow all the standards and safety guidelines prescribed under state regulations and technical standards prescribed by MNRE for RTS projects, failing which the vendor is liable for blacklisting from participation in the govt. project / scheme and other penal actions in accordance with the law. The responsibility of supply, installation and commissioning of the rooftop solar project/system in complete compliance with MNRE scheme guidelines lies with the Vendor.</li>
            <li><span className="clause-heading">Site Survey:</span> Site visit, survey and development of detailed project report for installation of RTS system. This also includes feasibility study of roof, strength of roof and shadow free area. If any additional work or customization is involved for the plant installation as per site condition and requirement of the consumer building, the Vendor shall prepare an estimate and can raise separate invoice including GST in addition to the amount towards standard plant cost. The consumer shall pay the amount for such additional work directly to the Vendor.</li>
            <li><span className="clause-heading">Design &amp; Engineering:</span> Design of plant along with drawings and selection of components as per standard provided by the DISCOM/SERC/MNRE for best performance and safety of the plant.</li>
          </ol>
        </div>

        <div className="a4-page-footer">
          <div className="doc-footer-inner">
            <span className="doc-footer-company">{(COMPANY_PROFILES[selectedCompany] || COMPANY_PROFILES.sunroof).name}</span>
            <span className="doc-footer-page">2 / 4</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════ PAGE 3 ══════════════════════ */}
      <div className="a4-page" id="agreement-page-3" style={{ display: isVisible('3') ? 'flex' : 'none' }}>
        <PageLetterhead companyId={selectedCompany} />

        <div className="a4-page-content">
          <ol className="clause-list" start="4">
            <li><span className="clause-heading">Module and Inverter:</span> The solar modules, including the solar cells, should be manufactured in India. Both the solar modules and inverters shall conform to the relevant standards and specifications prescribed by MNRE. Any other requirement, viz. star labeling (solar modules), quality control orders and standards &amp; labeling (inverters) etc., shall also be complied.</li>
            <li><span className="clause-heading">Procurement &amp; Supply:</span> Procurement of complete system as per BIS/IS/IEC standard (whatever applicable) &amp; safety guidelines for installation of rooftop solar plants. The supplied materials should comply with all MNRE standards for release of subsidy.</li>
            <li><span className="clause-heading">Installation &amp; Civil Work:</span> Complete civil work, structure work and electrical work (including drawings) following all the safety and relevant BIS standards.</li>
            <li><span className="clause-heading">Documentation (Technical Catalogues / Warranty Certificates / BIS certificates / other test reports etc):</span> All such documents shall be provided to the consumer for online uploading and submission of technical specifications, IEC/BIS report, Sr. Nos, Warranty card of Solar Panel &amp; Inverter, Layout &amp; Electrical SLD, Structure Design and Drawing, Cable and other detailed documents.</li>
            <li><span className="clause-heading">Project Completion Report (PCR):</span> Assisting the consumer in filling and uploading of signed documents (Consumer &amp; Vendor) on the national portal.</li>
            <li><span className="clause-heading">Warranty:</span> System warranty certificates should be provided to the consumer. The complete system should be warranted for 5 years from the date of commissioning by DISCOM. Individual component warranty documents provided by the manufacturer shall be provided to the consumer and all possible assistance should be extended to the consumer for claiming the warranty from the manufacturer.</li>
            <li><span className="clause-heading">NET Meter &amp; Grid Connectivity:</span> Net meter supply/procurement, testing and approvals shall be in the scope of vendor. Grid connection of the plant shall be in the scope of the vendor.</li>
            <li><span className="clause-heading">Testing and Commissioning:</span> The vendor shall be present at the time of testing and commissioning by the DISCOM.</li>
            <li><span className="clause-heading">Operation &amp; Maintenance:</span> Five (5) years Comprehensive Operation and Maintenance including overhauling, wear and tear and regular checking of healthiness of system at proper interval shall be in the scope of vendor. The vendor shall also educate the consumer on best practices for cleaning of the modules and system maintenance.</li>
          </ol>
        </div>

        <div className="a4-page-footer">
          <div className="doc-footer-inner">
            <span className="doc-footer-company">{(COMPANY_PROFILES[selectedCompany] || COMPANY_PROFILES.sunroof).name}</span>
            <span className="doc-footer-page">3 / 4</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════ PAGE 4 ══════════════════════ */}
      <div className="a4-page" id="agreement-page-4" style={{ display: isVisible('4') ? 'flex' : 'none' }}>
        <PageLetterhead companyId={selectedCompany} />

        <div className="a4-page-content">
          <ol className="clause-list" start="13">
            <li><span className="clause-heading">Insurance:</span> Any insurance cost pertaining to material transfer / storage before commissioning of the system shall be in the scope of the vendor.</li>
            <li><span className="clause-heading">Applicable Standard:</span> The system must meet the technical standards and specifications notified by MNRE. The vendor is solely responsible to supply component and service which meets the technical standards and specification prescribed by MNRE and State DISCOMs.</li>
            <li><span className="clause-heading">Project/System Cost &amp; Payment Terms:</span> The cost of the plant and payment schedule should be mutually discussed and decided between the vendor and consumer. The consumer may opt for milestone-based payment to the vendor and the same shall be included in the agreement.</li>
            <li><span className="clause-heading">Dispute:</span> In case of any dispute between consumer and vendor (in supply / installation / maintenance of system or payment terms), both parties must settle the same mutually or as per law. MNRE/DISCOM shall not be liable for, and would not be a party to any dispute arising between vendor and consumer.</li>
            <li><span className="clause-heading">Subsidy / Project Related Documents:</span> Vendor must provide all the documents to consumer and help in uploading the same to National Portal for smooth release of subsidy.</li>
            <li><span className="clause-heading">Performance of Plant:</span> The Performance Ratio (PR) of Plant must be 75% at the time of commissioning of the project by DISCOM or its authorized agency. Vendor must provide (returnable basis) radiation sensor with valid calibration certificate of any NABL / International laboratory at the time of commissioning / testing of the plant. Vendor must maintain the PR of the plant till warranty of project i.e. 5 years from the date of commissioning.</li>
          </ol>

          {/* Payment clause */}
          <div className="doc-payment-heading">19.&nbsp;&nbsp;Mutually Agreed Terms of Payment</div>
          <p className="doc-paragraph" style={{ fontSize: 12.5 }}>
            The payment schedule, milestone-based terms, and any additional charges shall be as mutually agreed between the First Party and Second Party and documented separately.
          </p>

          {/* Signature Section */}
          <div className="doc-sig-intro">
            In witness whereof, the parties hereto have executed this Agreement on the date first written above.
          </div>

          <table className="sig-table">
            <thead>
              <tr>
                <th className="sig-th">First Party &mdash; Consumer</th>
                <th className="sig-th">Second Party &mdash; Vendor</th>
              </tr>
            </thead>
            <tbody>
              {/* Name */}
              <tr>
                <td className="sig-td">
                  <span className="sig-lbl">Name</span>
                  <span className="sig-val underline-span">{consumerName || '________________________________'}</span>
                </td>
                <td className="sig-td">
                  <span className="sig-lbl">Name</span>
                  <span className="sig-val underline-span">{vendorName || '________________________________'}</span>
                </td>
              </tr>
              {/* Address */}
              <tr>
                <td className="sig-td">
                  <span className="sig-lbl">Address</span>
                  <span className="sig-val underline-span" style={{ fontSize: 11.5 }}>{consumerAddress || '________________________________'}</span>
                </td>
                <td className="sig-td">
                  <span className="sig-lbl">Address</span>
                  <span className="sig-val underline-span" style={{ fontSize: 11.5 }}>{vendorAddress || '________________________________'}</span>
                </td>
              </tr>
              {/* Signature box */}
              <tr>
                <td className="sig-td sig-box-cell">
                  <span className="sig-lbl">Signature &amp; Thumb Impression</span>
                  <div className="sig-area">
                    {consumerSignatureUrl
                      ? <img src={consumerSignatureUrl} alt="Consumer Signature" className="first-party-sig-img" />
                      : <div className="sig-blank"><span className="sig-blank-hint">Sign here</span></div>
                    }
                  </div>
                </td>
                <td className="sig-td sig-box-cell">
                  <span className="sig-lbl">Authorised Signature &amp; Stamp</span>
                  <div className="sig-area">
                    {includeStamp
                      ? <Stamp stampImg={vendorStamp} vendorName={vendorName} customStampUrl={customStampUrl} />
                      : <div className="sig-blank"><span className="sig-blank-hint">Stamp &amp; Sign</span></div>
                    }
                  </div>
                </td>
              </tr>
              {/* Date */}
              <tr>
                <td className="sig-td">
                  <span className="sig-lbl">Date</span>
                  <span className="sig-val">{signatureDateText}</span>
                </td>
                <td className="sig-td">
                  <span className="sig-lbl">Date</span>
                  <span className="sig-val">{signatureDateText}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Disclaimer */}
          <div className="doc-disclaimer">
            <span className="doc-disclaimer-title">Disclaimer:</span>
            &nbsp;This agreement is between vendor and consumer and any dispute related to the same
            shall not involve any third party including MNRE and Distribution Utilities (DISCOMs).
            This agreement is governed by the laws of India.
          </div>
        </div>

        <div className="a4-page-footer">
          <div className="doc-footer-inner">
            <span className="doc-footer-company">{(COMPANY_PROFILES[selectedCompany] || COMPANY_PROFILES.sunroof).name}</span>
            <span className="doc-footer-page">4 / 4</span>
          </div>
        </div>
      </div>

    </div>
  );
}
