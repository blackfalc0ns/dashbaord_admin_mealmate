import { Injectable } from '@angular/core';

import { DocumentTemplate } from '../models/document-template.model';

@Injectable({ providedIn: 'root' })
export class DocumentPdfService {
  async exportTemplateElement(
    element: HTMLElement,
    template: DocumentTemplate,
    filename: string,
  ): Promise<void> {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(element, {
      backgroundColor: template.backgroundColor,
      scale: 2,
      useCORS: true,
      removeContainer: true,
      logging: false,
    });
    const pdf = new jsPDF({
      orientation: template.widthPx >= template.heightPx ? 'landscape' : 'portrait',
      unit: 'px',
      format: [template.widthPx, template.heightPx],
      compress: true,
    });

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      template.widthPx,
      template.heightPx,
      undefined,
      'FAST',
    );
    pdf.save(filename);
  }
}
