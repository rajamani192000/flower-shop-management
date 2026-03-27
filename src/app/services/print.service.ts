import { Injectable } from '@angular/core';

export interface PrintLineItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface SalePrintPayload {
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  gstNumber?: string;
  saleNo: string;
  date: string;
  paymentType: string;
  customerName: string;
  items: PrintLineItem[];
  grandTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private readonly style = `
    <style>
      @page { size: 80mm auto; margin: 0; }
      body { font-family: 'Courier New', monospace; margin: 0; }
      .receipt { width: 78mm; padding: 6mm 3mm; color: #111; }
      .center { text-align: center; }
      .row { display: flex; justify-content: space-between; font-size: 12px; margin: 2px 0; }
      .divider { border-top: 1px dashed #000; margin: 6px 0; }
      .title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
      .small { font-size: 11px; }
      .bold { font-weight: 700; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th, td { text-align: left; padding: 2px 0; }
      th:last-child, td:last-child { text-align: right; }
    </style>
  `;

  printSaleReceipt(payload: SalePrintPayload): void {
    const lines = payload.items
      .map(
        (item) =>
          `<tr><td>${this.escape(item.name)}</td><td>${item.qty}</td><td>${item.total.toFixed(2)}</td></tr>`
      )
      .join('');

    const html = `
      <html>
        <head>
          <title>Receipt</title>
          ${this.style}
        </head>
        <body>
          <div class="receipt">
            <div class="center title">Flower Shop</div>
            <div class="center small">${this.escape(payload.shopName || 'Flower Shop')}</div>
            <div class="center small">${this.escape(payload.shopAddress || '')}</div>
            <div class="center small">${this.escape(payload.shopPhone || '')}</div>
            <div class="center small">${payload.gstNumber ? `GST: ${this.escape(payload.gstNumber)}` : ''}</div>
            <div class="center small">Sales Receipt</div>
            <div class="divider"></div>
            <div class="row"><span>Bill No:</span><span>${this.escape(payload.saleNo)}</span></div>
            <div class="row"><span>Date:</span><span>${this.escape(payload.date)}</span></div>
            <div class="row"><span>Customer:</span><span>${this.escape(payload.customerName)}</span></div>
            <div class="row"><span>Pay Mode:</span><span>${this.escape(payload.paymentType)}</span></div>
            <div class="divider"></div>
            <table>
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
              </thead>
              <tbody>${lines}</tbody>
            </table>
            <div class="divider"></div>
            <div class="row bold"><span>Grand Total</span><span>${payload.grandTotal.toFixed(2)}</span></div>
            <div class="divider"></div>
            <div class="center small">Thank you. Visit again.</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=420,height=640');
    if (!printWindow) {
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }

  printTable(title: string, columns: string[], rows: Array<Array<string | number>>): void {
    const header = columns.map((column) => `<th>${this.escape(String(column))}</th>`).join('');
    const body = rows
      .map((row) => `<tr>${row.map((item) => `<td>${this.escape(String(item))}</td>`).join('')}</tr>`)
      .join('');

    const html = `
      <html>
        <head>
          <title>${this.escape(title)}</title>
          ${this.style}
        </head>
        <body>
          <div class="receipt">
            <div class="center title">${this.escape(title)}</div>
            <div class="divider"></div>
            <table>
              <thead><tr>${header}</tr></thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=700,height=900');
    if (!printWindow) {
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }

  private escape(value: string): string {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
