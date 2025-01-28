/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApbPaymentService } from './apb-payment.service';

describe('Service: ApbPayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApbPaymentService]
    });
  });

  it('should ...', inject([ApbPaymentService], (service: ApbPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
