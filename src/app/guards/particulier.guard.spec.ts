import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { particulierGuard } from './particulier.guard';

describe('particulierGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => particulierGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
