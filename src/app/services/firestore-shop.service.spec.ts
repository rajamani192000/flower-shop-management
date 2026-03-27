import { TestBed } from '@angular/core/testing';

import { FirestoreShopService } from './firestore-shop.service';

describe('FirestoreShopService', () => {
  let service: FirestoreShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
