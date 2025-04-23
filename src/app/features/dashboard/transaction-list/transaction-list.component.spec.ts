import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../shared/material.module';
import { TransactionService } from '../../../shared/services/transaction.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { FilterDataService } from '../../../shared/services/filter-data.service';
import { MenssageriaService } from '../../../shared/services/menssageria.service';
import { TransactionListComponent } from './transaction-list.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { TestModule } from '../../../test.module';
import { of } from 'rxjs';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let messageService: jasmine.SpyObj<MenssageriaService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let router: jasmine.SpyObj<Router>;

  const mockTransactions = [
    {
      id: '1',
      title: 'Transaction 1',
      value: 100,
      type: 'income',
      date: '2024-03-15',
      categoryId: '1',
      userId: '1'
    },
    {
      id: '2',
      title: 'Transaction 2',
      value: 200,
      type: 'expense',
      date: '2024-03-16',
      categoryId: '2',
      userId: '1'
    }
  ];

  const mockCategories = [
    { id: '1', name: 'Category 1', type: 'income', userId: '1' },
    { id: '2', name: 'Category 2', type: 'expense', userId: '1' }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions', 'deleteTransaction']);
    const categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', ['getCategories']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', ['getSelectedMonth', 'getSelectedYear']);
    const messageServiceSpy = jasmine.createSpyObj('MenssageriaService', ['showSuccess', 'showError']);
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    transactionServiceSpy.getTransactions.and.returnValue(of(mockTransactions));
    categoriesServiceSpy.getCategories.and.returnValue(of(mockCategories));
    filterDataServiceSpy.getSelectedMonth.and.returnValue(3);
    filterDataServiceSpy.getSelectedYear.and.returnValue(2024);
    breakpointObserverSpy.observe.and.returnValue(of({ matches: true }));

    TestBed.configureTestingModule({
      imports: [
        TestModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: CategoriesService, useValue: categoriesServiceSpy },
        { provide: FilterDataService, useValue: filterDataServiceSpy },
        { provide: MenssageriaService, useValue: messageServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
    messageService = TestBed.inject(MenssageriaService) as jasmine.SpyObj<MenssageriaService>;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    transactionService.getTransactions.and.returnValue(of(mockTransactions));
    categoriesService.getCategories.and.returnValue(of(mockCategories));
    breakpointObserver.observe.and.returnValue(of({ matches: false }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month and year', () => {
    const currentDate = new Date();
    expect(component.selectedMonth).toBe(currentDate.getMonth() + 1);
    expect(component.selectedYear).toBe(currentDate.getFullYear());
  });

  it('should load initial data on init', () => {
    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(categoriesService.getCategories).toHaveBeenCalled();
  });

  it('should update transactions when service emits new data', () => {
    const newTransactions = [...mockTransactions];
    transactionService.transactions$ = of(newTransactions);

    component.ngOnInit();

    expect(component.transactions.length).toBe(newTransactions.length);
    expect(component.transactions).toEqual(jasmine.arrayContaining(
      newTransactions.map(t => jasmine.objectContaining({
        ...t,
        category_name: component.getCategoryName(t.categoryId)
      }))
    ));
  });

  it('should get correct category name', () => {
    component.categories = mockCategories;
    expect(component.getCategoryName('1')).toBe('Category 1');
    expect(component.getCategoryName('2')).toBe('Category 2');
    expect(component.getCategoryName('3')).toBe('Desconhecido');
  });

  it('should delete transaction', () => {
    const transactionId = '1';
    transactionService.deleteTransaction.and.returnValue(of(void 0));

    component.deleteTransaction(transactionId);

    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(transactionId);
    expect(messageService.showMessage).toHaveBeenCalledWith('Item removido com sucesso!');
  });

  it('should filter transactions by month and year', () => {
    const currentDate = new Date();
    component.selectedMonth = currentDate.getMonth() + 1;
    component.selectedYear = currentDate.getFullYear();
    component.transactions = mockTransactions;

    component.filterTransaction();

    expect(component.filteredTransactions.length).toBeLessThanOrEqual(mockTransactions.length);
    component.filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      expect(transactionDate.getMonth() + 1).toBe(component.selectedMonth);
      expect(transactionDate.getFullYear()).toBe(component.selectedYear);
    });
  });

  it('should navigate to home', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle breakpoint changes', () => {
    breakpointObserver.observe.and.returnValue(of({ matches: true }));

    component.ngOnInit();

    expect(component.isWeb).toBeFalse();

    breakpointObserver.observe.and.returnValue(of({ matches: false }));

    component.ngOnInit();
    tick();

    expect(component.isWeb).toBeTrue();
  }));

it('should update data source when filtered transactions change', fakeAsync(() => {
  const newTransactions = [...mockTransactions];
  filterDataService.filteredTransactions$ = of(newTransactions);

  component.ngOnInit();
  tick();

  expect(component.dataSource.data).toEqual(newTransactions);
}));

it('should handle error when deleting transaction', fakeAsync(() => {
  const transactionId = '1';
  const errorMessage = 'Error deleting transaction';
  transactionService.deleteTransaction.and.returnValue(throwError(() => new Error(errorMessage)));

  component.deleteTransaction(transactionId);
  tick();

  expect(transactionService.deleteTransaction).toHaveBeenCalledWith(transactionId);
  expect(mensageriaService.showMessage).toHaveBeenCalledWith('Erro ao remover item!');
}));

it('should update paginator when data source changes', () => {
  const newTransactions = [...mockTransactions];
  component.dataSource.data = newTransactions;

  fixture.detectChanges();

  expect(component.dataSource.paginator).toBeTruthy();
  expect(component.dataSource.sort).toBeTruthy();
});

it('should format currency value correctly', () => {
  const value = 1234.56;
  const formattedValue = component.formatCurrency(value);
  expect(formattedValue).toBe('R$ 1.234,56');
});

it('should handle empty transactions list', fakeAsync(() => {
  transactionService.transactions$ = of([]);

  component.ngOnInit();
  tick();

  expect(component.transactions.length).toBe(0);
  expect(component.dataSource.data.length).toBe(0);
}));

it('should apply filter correctly', () => {
  const filterValue = 'test';
  component.dataSource.data = mockTransactions;

  component.applyFilter(filterValue);

  expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
});

it('should handle month change', () => {
  const newMonth = 6;
  spyOn(component, 'filterTransaction');

  component.onMonthChange(newMonth);

  expect(component.selectedMonth).toBe(newMonth);
  expect(component.filterTransaction).toHaveBeenCalled();
});

it('should handle year change', () => {
  const newYear = 2024;
  spyOn(component, 'filterTransaction');

  component.onYearChange(newYear);

  expect(component.selectedYear).toBe(newYear);
  expect(component.filterTransaction).toHaveBeenCalled();
});

it('should calculate total income correctly', () => {
  component.transactions = [
    { ...mockTransactions[0], type: 'income', value: 100 },
    { ...mockTransactions[1], type: 'income', value: 200 }
  ];

  const total = component.calculateTotalIncome();
  expect(total).toBe(300);
});

it('should calculate total expense correctly', () => {
  component.transactions = [
    { ...mockTransactions[0], type: 'expense', value: 50 },
    { ...mockTransactions[1], type: 'expense', value: 150 }
  ];

  const total = component.calculateTotalExpense();
  expect(total).toBe(200);
});

it('should handle navigation to edit transaction', () => {
  const transactionId = '1';
  component.editTransaction(transactionId);
  expect(router.navigate).toHaveBeenCalledWith(['/transactions/edit', transactionId]);
});
}); 