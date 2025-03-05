import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDataComponent } from './transaction-data.component';

describe('TransactionDataComponent', () => {
  let component: TransactionDataComponent;
  let fixture: ComponentFixture<TransactionDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionDataComponent]
    });
    fixture = TestBed.createComponent(TransactionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
