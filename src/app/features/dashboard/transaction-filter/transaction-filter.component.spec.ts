import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionFilterComponent } from './transaction-filter.component';
import { TestModule } from '../../../test.module';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { of } from 'rxjs';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

describe('TransactionFilterComponent', () => {
  let component: TransactionFilterComponent;
  let fixture: ComponentFixture<TransactionFilterComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  const mockTransactions: Transaction[] = [
    { id: 1, description: 'Salário', value: 5000, type: 'receita', date: '2024-04-01', category: 'Salário' },
    { id: 2, description: 'Aluguel', value: 1500, type: 'despesa', date: '2024-04-05', category: 'Moradia' },
    { id: 3, description: 'Freelance', value: 2000, type: 'receita', date: '2024-03-10', category: 'Freelance' }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', [
      'filterTransactions',
      'emitMonthYearChange',
      'emitFilteredTransactions'
    ], {
      monthYearChange$: of({ month: moment().month(), year: moment().year() })
    });
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TransactionFilterComponent],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: FilterDataService, useValue: filterDataServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFilterComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;

    // Setup default spy behavior
    transactionService.getTransactions.and.returnValue(of(mockTransactions));
    breakpointObserver.observe.and.returnValue(of({ matches: false } as BreakpointState));
    filterDataService.filterTransactions.and.returnValue(mockTransactions);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month and year', () => {
    const now = moment();
    expect(component.selectedMonth).toBe(now.month());
    expect(component.selectedYear).toBe(now.year());
  });

  it('should load and filter transactions on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(component.transactions).toEqual(mockTransactions);
    expect(filterDataService.filterTransactions).toHaveBeenCalledWith(
      mockTransactions,
      component.selectedMonth,
      component.selectedYear
    );
  }));

  it('should handle breakpoint changes', fakeAsync(() => {
    // Desktop view
    breakpointObserver.observe.and.returnValue(of({ matches: false } as BreakpointState));