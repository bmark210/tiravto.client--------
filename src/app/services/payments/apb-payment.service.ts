import { Injectable } from '@angular/core';
import { ApbInvoice } from '../Client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApbPaymentService {
  constructor() { }

  goToPaymentPage(invoice: ApbInvoice) {
    const apbPageUrl = environment.apbPaymentUrl + `?` +
      `MerchantLogin=${invoice.merchant}` +
      `&nivid=${invoice.ivId}` +
      `&istest=${invoice.isTest}` +
      `&RequestSum=${invoice.sum}` +
      `&RequestCurrCode=${invoice.currency}` +
      `&Desc=${invoice.description}` +
      `&SignatureValue=${invoice.signatureValue}`;
      window.location.href = apbPageUrl;
  }
}
