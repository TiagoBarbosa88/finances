import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import moment from 'moment';
import { of } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TestModule } from '../../../test.module';
import { TransactionBalanceComponent } from './transaction-balance.component';

describe('TransactionBalanceComponent', () => {
  let component: TransactionBalanceComponent;
  let fixture: ComponentFixture<TransactionBalanceComponent>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let transactionService: jasmine.SpyObj<TransactionService>;

  const mockTransactions: Transaction[] = [
    { id: 1, description: 'Salário', value: 5000, type: 'receita', date: '2024-04-01', category: 'Salário' },
    { id: 2, description: 'Aluguel', value: 1500, type: 'despesa', date: '2024-04-05', category: 'Moradia' },
    { id: 3, description: 'Freelance', value: 2000, type: 'receita', date: '2024-04-10', category: 'Freelance' },
    { id: 4, description: 'Mercado', value: 800, type: 'despesa', date: '2024-04-15', category: 'Alimentação' }
  ];

  beforeEach(() => {
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', ['filterTransactions', 'emitMonthYearChange']);
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions'], {
      transactions$: of(mockTransactions)
    });

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TransactionBalanceComponent],
      providers: [
        { provide: FilterDataService, useValue: filterDataServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionBalanceComponent);
    component = fixture.componentInstance;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;

    // Setup default spy behavior
    filterDataService.filterTransactions.and.returnValue(mockTransactions);
    transactionService.getTransactions.and.returnValue(of(mockTransactions));
    filterDataService.monthYearChange$ = of({ month: moment().month() + 1, year: moment().year() });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month and year', () => {
    expect(component.selectedMonth).toBe(moment().month() + 1);
    expect(component.selectedYear).toBe(moment().year());
  });

  it('should calculate totals correctly', fakeAsync(() => {
    component.initializeTransactions();
    tick();

    expect(component.receita).toBe(7000); // 5000 + 2000
    expect(component.despesa).toBe(2300); // 1500 + 800
    expect(component.saldo).toBe(4700); // 7000 - 2300
  }));

  it('should update totals when transactions change', fakeAsync(() => {
    const newTransactions = [
      { id: 1, description: 'Novo Salário', value: 6000, type: 'receita', date: '2024-04-01', category: 'Salário' }
    ];

    filterDataService.filterTransactions.and.returnValue(newTransactions);
    transactionService.getTransactions.and.returnValue(of(newTransactions));

    component.initializeTransactions();
    tick();

    expect(component.receita).toBe(6000);
    expect(component.despesa).toBe(0);
    expect(component.saldo).toBe(6000);
  }));

  it('should handle month/year change', () => {
    const newMonth = 3;
    const newYear = 2024;

    component.onMonthYearChange(newMonth, newYear);

    expect(component.selectedMonth).toBe(newMonth);
    expect(component.selectedYear).toBe(newYear);
    expect(filterDataService.emitMonthYearChange).toHaveBeenCalledWith(newMonth, newYear);
  });

  it('should return correct balance class based on saldo', () => {
    component.saldo = 1000;
    expect(component.getBalanceClass()).toBe('saldo');

    component.saldo = -1000;
    expect(component.getBalanceClass()).toBe('despesa');

    component.saldo = 0;
    expect(component.getBalanceClass()).toBe('neutro');
  });

  it('should return correct icon class based on saldo', () => {
    component.saldo = 1000;
    expect(component.getIconClass()).toBe('icon-saldo');

    component.saldo = -1000;
    expect(component.getIconClass()).toBe('icon-negative');

    component.saldo = 0;
    expect(component.getIconClass()).toBe('icon-neutral');
  });

  it('should not make unnecessary API calls when month/year hasnt changed', fakeAsync(() => {
    const currentMonth = component.selectedMonth;
    const currentYear = component.selectedYear;

    // First call
    component.initializeTransactions();
    tick();
    expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);

    // Same month/year, should not make new call
    component.onMonthYearChange(currentMonth, currentYear);
    component.initializeTransactions();
    tick();
    expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);

    // Different month, should make new call
    component.onMonthYearChange(currentMonth + 1, currentYear);
    component.initializeTransactions();
    tick();
    expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
  }));
});
