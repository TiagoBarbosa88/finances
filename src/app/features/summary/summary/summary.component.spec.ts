import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { TransactionService } from '../../../shared/services/transaction.service';
import { TestModule } from '../../../test.module';
import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;

  const mockTransactions = [
    {
      id: '1',
      title: 'Salário',
      value: 5000,
      type: 'income',
      date: '2024-01-15',
      categoryId: '1',
      userId: '1'
    },
    {
      id: '2',
      title: 'Aluguel',
      value: 1500,
      type: 'expense',
      date: '2024-02-05',
      categoryId: '2',
      userId: '1'
    }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    transactionServiceSpy.getTransactions.and.returnValue(of(mockTransactions));

    TestBed.configureTestingModule({
      imports: [
        TestModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should load monthly data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(component.monthlyData.length).toBeGreaterThan(0);
  }));

  it('should filter years correctly', () => {
    const currentYear = new Date().getFullYear();
    component.minYear = currentYear - 2;

    expect(component.filterYears(currentYear)).toBeTrue();
    expect(component.filterYears(currentYear - 1)).toBeTrue();
    expect(component.filterYears(currentYear - 2)).toBeTrue();
    expect(component.filterYears(currentYear - 3)).toBeFalse();
  });

  it('should change year and reload data', fakeAsync(() => {
    const newYear = new Date().getFullYear() - 1;
    component.minYear = newYear;

    component.changeYear(newYear);
    tick();

    expect(component.currentYear).toBe(newYear);
    expect(transactionService.getTransactions).toHaveBeenCalled();
  }));

  it('should not change year if filtered out', fakeAsync(() => {
    const currentYear = component.currentYear;
    const invalidYear = component.minYear - 1;

    component.changeYear(invalidYear);
    tick();

    expect(component.currentYear).toBe(currentYear);
  }));

  it('should calculate monthly totals correctly', fakeAsync(() => {
    component.ngOnInit();
    tick();

    const januaryData = component.monthlyData.find(data => data.month === 0);
    const februaryData = component.monthlyData.find(data => data.month === 1);

    expect(januaryData?.income).toBe(5000);
    expect(februaryData?.expenses).toBe(1500);
  }));

  it('should format currency values correctly', () => {
    expect(component.formatCurrency(1234.56)).toBe('R$ 1.234,56');
    expect(component.formatCurrency(-1234.56)).toBe('R$ -1.234,56');
    expect(component.formatCurrency(0)).toBe('R$ 0,00');
  });
});
