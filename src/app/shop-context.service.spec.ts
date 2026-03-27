import { TestBed } from '@angular/core/testing';

import { ShopContextService } from './shop-context.service';

describe('ShopContextService', () => {
  let service: ShopContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
