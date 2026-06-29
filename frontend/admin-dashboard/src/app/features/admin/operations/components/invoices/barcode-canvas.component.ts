import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import bwipjs from 'bwip-js/browser';

@Component({
  selector: 'mm-barcode-canvas',
  standalone: true,
  template: `
    <canvas #canvas class="h-full w-full"></canvas>
  `,
  host: { class: 'block h-full w-full' },
})
export class BarcodeCanvasComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) value = '';
  @Input() bcid: 'code128' | 'qrcode' = 'code128';
  @Input() foreground = '111827';
  @Input() background = 'FFFFFF';

  @ViewChild('canvas', { static: true }) private readonly canvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.render();
  }

  private render(): void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.value) return;

    try {
      bwipjs.toCanvas(canvas, {
        bcid: this.bcid,
        text: this.value,
        scale: this.bcid === 'qrcode' ? 3 : 2,
        height: this.bcid === 'qrcode' ? 12 : 9,
        includetext: this.bcid === 'code128',
        textsize: 8,
        textxalign: 'center',
        barcolor: this.foreground.replace('#', ''),
        textcolor: this.foreground.replace('#', ''),
        backgroundcolor: this.background.replace('#', ''),
        paddingwidth: 4,
        paddingheight: 2,
      });
    } catch {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#991b1b';
      ctx.font = '12px sans-serif';
      ctx.fillText(this.value, 8, 22);
    }
  }
}
