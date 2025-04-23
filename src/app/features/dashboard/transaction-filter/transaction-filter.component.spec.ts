import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import * as moment from 'moment';
import { of } from 'rxjs';
import { Transaction } from '../../../shared/models/transaction.model';
import { FilterDataService } from '../../../shared/services/filter-data.service';
import { TransactionService } from '../../../shared/services/transaction.service';
import { TestModule } from '../../../test.module';
import { TransactionFilterComponent } from './transaction-filter.component';

describe('TransactionFilterComponent', () => {
  let component: TransactionFilterComponent;
  let fixture: ComponentFixture<TransactionFilterComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      title: 'Salário',
      value: 5000,
      type: 'receita',
      date: '2024-04-01',
      categoryId: '1',
      category: {
        id: '1',
        categoryName: 'Salário'
      }
    },
    {
      id: '2',
      title: 'Aluguel',
      value: 1500,
      type: 'despesa',
      date: '2024-04-05',
      categoryId: '2',
      category: {
        id: '2',
        categoryName: 'Moradia'
      }
    },
    {
      id: '3',
      title: 'Freelance',
      value: 2000,
      type: 'receita',
      date: '2024-03-10',
      categoryId: '3',
      category: {
        id: '3',
        categoryName: 'Freelance'
      }
    }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', ['filterTransactions']);
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    transactionServiceSpy.getTransactions.and.returnValue(of(mockTransactions));
    filterDataServiceSpy.filterTransactions.and.returnValue(mockTransactions);
    breakpointObserverSpy.observe.and.returnValue(of({ matches: true }));

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

  it('should load transactions on init', () => {
    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(component.transactions).toEqual(mockTransactions);
  });

  it('should handle breakpoint changes', fakeAsync(() => {
    breakpointObserver.observe.and.returnValue(of({ matches: false } as BreakpointState));
    component.ngOnInit();
    tick();
    expect(component.isWeb).toBeTrue();
  }));
});