import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditComponent } from './transaction-edit.component';

describe('TransactionEditComponent', () => {
  let component: TransactionEditComponent;
  let fixture: ComponentFixture<TransactionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionEditComponent]
    });
    fixture = TestBed.createComponent(TransactionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
