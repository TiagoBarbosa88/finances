import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { of } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TestModule } from '../../../test.module';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { TransactionDataComponent } from './transaction-data.component';

describe('TransactionDataComponent', () => {
  let component: TransactionDataComponent;
  let fixture: ComponentFixture<TransactionDataComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let router: jasmine.SpyObj<Router>;

  const mockTransactions: Transaction[] = [
    { id: 1, description: 'Salário', value: 5000, type: 'receita', date: '2024-04-01', category: 'Salário' },
    { id: 2, description: 'Aluguel', value: 1500, type: 'despesa', date: '2024-04-05', category: 'Moradia' }
  ];

  beforeEach(() => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions', 'createTransaction']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', [
      'filterTransactions',
      'emitMonthYearChange',
      'emitFilteredTransactions'
    ], {
      monthYearChange$: of({ month: moment().month(), year: moment().year() })
    });
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TransactionDataComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: FilterDataService, useValue: filterDataServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDataComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default spy behavior
    transactionService.getTransactions.and.returnValue(of(mockTransactions));
    breakpointObserver.observe.and.returnValue(of({ matches: false } as BreakpointState));
    filterDataService.filterTransactions.and.returnValue(mockTransactions);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(component.transactions).toEqual(mockTransactions);
    expect(component.filteredTransactions).toEqual(mockTransactions);
  }));

  it('should handle breakpoint changes', fakeAsync(() => {
    // Desktop view
    breakpointObserver.observe.and.returnValue(of({ matches: false } as BreakpointState));
    component.ngOnInit();
    tick();
    expect(component.isWeb).toBeTrue();

    // Mobile view
    breakpointObserver.observe.and.returnValue(of({ matches: true } as BreakpointState));
    component.ngOnInit();
    tick();
    expect(component.isWeb).toBeFalse();
  }));

  it('should open transaction dialog', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(null));
    dialog.open.and.returnValue(dialogRef);

    component.openDialog();

    expect(dialog.open).toHaveBeenCalledWith(TransactionInputComponent);
  });

  it('should create transaction when dialog is closed with data', fakeAsync(() => {
    const newTransaction: Transaction = {
      id: 3,
      description: 'Nova Transação',
      value: 1000,
      type: 'receita',
      date: '2024-04-15',
      category: 'Outros'
    };

    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(newTransaction));
    dialog.open.and.returnValue(dialogRef);
    transactionService.createTransaction.and.returnValue(of(newTransaction));

    component.openDialog();
    tick();

    expect(transactionService.createTransaction).toHaveBeenCalledWith(newTransaction);
  }));

  it('should handle month change', () => {
    const date = moment('2024-03-15');
    component.onMonthChange({ value: date });

    expect(component.selectedMonth).toBe(2); // March (0-based)
    expect(component.selectedYear).toBe(2024);
    expect(filterDataService.filterTransactions).toHaveBeenCalled();
    expect(filterDataService.emitMonthYearChange).toHaveBeenCalledWith(2, 2024);
  });

  it('should navigate to summary', () => {
    component.goToSummary();
    expect(router.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should filter transactions when month/year changes', () => {
    const month = 3;
    const year = 2024;
    const filteredMockTransactions = [mockTransactions[0]];
    filterDataService.filterTransactions.and.returnValue(filteredMockTransactions);

    component.selectedMonth = month;
    component.selectedYear = year;
    component.filterTransactions();

    expect(filterDataService.filterTransactions).toHaveBeenCalledWith(component.transactions, month, year);
    expect(filterDataService.emitMonthYearChange).toHaveBeenCalledWith(month, year);
    expect(filterDataService.emitFilteredTransactions).toHaveBeenCalledWith(filteredMockTransactions);
    expect(component.filteredTransactions).toEqual(filteredMockTransactions);
  });

  it('should handle month picker selection', () => {
    const date = moment('2024-03-15');
    const datepicker = jasmine.createSpyObj('MatDatepicker', ['close']);

    component.chosenMonthHandler(date, datepicker);

    expect(component.selectedMonth).toBe(2); // March (0-based)
    expect(component.selectedYear).toBe(2024);
    expect(datepicker.close).toHaveBeenCalled();
    expect(filterDataService.filterTransactions).toHaveBeenCalled();
  });
});
