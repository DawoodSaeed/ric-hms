import { TestBed } from '@angular/core/testing';

import { TypeTableService } from './type-table.service';

describe('TypeTableService', () => {
  let service: TypeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
