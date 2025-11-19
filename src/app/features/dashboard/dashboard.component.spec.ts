import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TransactionBalanceComponent } from './transaction-balance/transaction-balance.component';
import { TransactionDataComponent } from './transaction-data/transaction-data.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        DashboardComponent,
        TransactionBalanceComponent,
        TransactionFilterComponent,
        TransactionDataComponent,
        TransactionListComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all dashboard components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-transaction-balance')).toBeTruthy();
    expect(compiled.querySelector('app-transaction-filter')).toBeTruthy();
    expect(compiled.querySelector('app-transaction-data')).toBeTruthy();
    expect(compiled.querySelector('app-transaction-list')).toBeTruthy();
  });
}); 