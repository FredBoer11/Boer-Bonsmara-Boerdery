import { FinancialYear } from "../types";

// This assumes jsPDF and html2canvas are loaded via CDN in index.html
declare const jspdf: any;
declare const html2canvas: any;

export const exportAsPDF = async (
    farmName: string,
    narrative: string,
    financials: FinancialYear[]
) => {
  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - (margin * 2);
  let yPos = 0;

  // --- Helper Functions ---
  const addPageHeader = (pageNumber: number) => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor('#5C3D2E'); // brand-brown
    pdf.text(`${farmName} Proposal`, margin, 10);
    pdf.text(`Page ${pageNumber}`, pageW - margin, 10, { align: 'right' });
    pdf.setDrawColor('#D4C5A1'); // brand-tan
    pdf.line(margin, 12, pageW - margin, 12);
  };

  const addCanvasToPdf = async (elementId: string, y: number) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`PDF Export Error: Element with ID #${elementId} not found.`);
        return y;
    };

    // Temporarily make the element visible for rendering if it's styled to be hidden
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff' // Ensure background is white for components
    });
    element.style.display = originalDisplay; // Hide it again

    const imgData = canvas.toDataURL('image/png');
    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = imgW / imgH;
    const imgHeight = contentW / ratio;
    
    // Check if there is enough space, otherwise add a new page
    if (y + imgHeight > pageH - margin) {
      pdf.addPage();
      addPageHeader(pdf.internal.getNumberOfPages());
      y = margin + 15; // Start after header
    }

    pdf.addImage(imgData, 'PNG', margin, y, contentW, imgHeight);
    return y + imgHeight + 10; // Add some space after the element
  };

  // --- 1. Cover Page ---
  pdf.setFillColor('#2E4034'); // brand-green
  pdf.rect(0, 0, pageW, pageH, 'F');
  
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor('#FFFFFF');
  pdf.text('Cattle Stud Farm Proposal', pageW / 2, pageH / 2 - 20, { align: 'center' });
  
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor('#D4C5A1'); // brand-tan
  pdf.text(farmName, pageW / 2, pageH / 2, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }), pageW / 2, pageH - 20, { align: 'center' });

  // --- 2. Content Pages ---
  pdf.addPage();
  addPageHeader(pdf.internal.getNumberOfPages());
  yPos = margin + 15; // Start after header

  // --- Add Summary & Overview ---
  yPos = await addCanvasToPdf('pdf-summary-container', yPos);
  yPos = await addCanvasToPdf('pdf-financial-overview', yPos);

  // --- Add Investment Narrative (as selectable text) ---
  pdf.setFontSize(11); // Set font size before calculating height
  // Use splitTextToSize to estimate height for layout purposes
  const narrativeLines = pdf.splitTextToSize(narrative, contentW);
  const fontLineHeight = pdf.getLineHeight(contentW) / pdf.internal.scaleFactor;
  const narrativeHeight = (narrativeLines.length * fontLineHeight) + 20; // Approx height + title

  if (yPos + narrativeHeight > pageH - margin) {
    pdf.addPage();
    addPageHeader(pdf.internal.getNumberOfPages());
    yPos = margin + 15;
  }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor('#2E4034');
  pdf.text('Investment Narrative', margin, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor('#374151');
  // Render the text with justification and max width
  pdf.text(narrative, margin, yPos, { 
    align: 'justify',
    maxWidth: contentW 
  });
  // Advance yPos by the estimated height
  yPos += (narrativeLines.length * fontLineHeight) + 10;

  // --- Add Chart ---
  yPos = await addCanvasToPdf('pdf-chart-container', yPos);
  
  // --- Add Financial Table ---
  yPos = await addCanvasToPdf('pdf-table-container', yPos);

  // --- Save the PDF ---
  pdf.save(`${farmName.replace(/ /g, '_')}_Proposal.pdf`);
};