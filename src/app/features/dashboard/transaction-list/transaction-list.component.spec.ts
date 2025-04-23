import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { Category } from '../../../shared/models/category.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { CategoriesService } from '../../../shared/services/categories.service';
import { FilterDataService } from '../../../shared/services/filter-data.service';
import { MenssageriaService } from '../../../shared/services/menssageria.service';
import { TransactionService } from '../../../shared/services/transaction.service';
import { TestModule } from '../../../test.module';
import { TransactionListComponent } from './transaction-list.component';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;
  let messageService: jasmine.SpyObj<MenssageriaService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let router: jasmine.SpyObj<Router>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      title: 'Test Transaction 1',
      value: 100,
      type: 'receita',
      date: '2024-04-22',
      categoryId: '1',
      category: {
        id: '1',
        categoryName: 'Category 1'
      }
    },
    {
      id: '2',
      title: 'Test Transaction 2',
      value: 200,
      type: 'despesa',
      date: '2024-04-22',
      categoryId: '2',
      category: {
        id: '2',
        categoryName: 'Category 2'
      }
    }
  ];

  const mockCategories: Category[] = [
    {
      id: '1',
      category_name: 'Category 1',
      categoryName: 'Category 1'
    },
    {
      id: '2',
      category_name: 'Category 2',
      categoryName: 'Category 2'
    }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions', 'deleteTransaction']);
    const categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', ['getCategories']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', ['filterTransactions']);
    const messageServiceSpy = jasmine.createSpyObj('MenssageriaService', ['showSuccess', 'showError']);
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    transactionServiceSpy.getTransactions.and.returnValue(of(mockTransactions));
    transactionServiceSpy.deleteTransaction.and.returnValue(of(void 0));
    categoriesServiceSpy.getCategories.and.returnValue(of(mockCategories));
    filterDataServiceSpy.filterTransactions.and.returnValue(mockTransactions);
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

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
    messageService = TestBed.inject(MenssageriaService) as jasmine.SpyObj<MenssageriaService>;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial data', () => {
    expect(transactionService.getTransactions).toHaveBeenCalled();
    expect(categoriesService.getCategories).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockTransactions);
  });

  it('should filter transactions based on month and year', () => {
    expect(filterDataService.getSelectedMonth).toHaveBeenCalled();
    expect(filterDataService.getSelectedYear).toHaveBeenCalled();
  });

  it('should delete transaction', () => {
    const transactionId = '1';
    component.deleteTransaction(transactionId);
    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(transactionId);
  });

  it('should handle error when deleting transaction', fakeAsync(() => {
    const transactionId = '1';
    const errorMessage = 'Error deleting transaction';
    transactionService.deleteTransaction.and.returnValue(throwError(() => new Error(errorMessage)));

    component.deleteTransaction(transactionId);
    tick();

    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(transactionId);
  }));

  it('should update paginator when data source changes', () => {
    component.dataSource.data = mockTransactions;
    fixture.detectChanges();
    expect(component.dataSource.paginator).toBeTruthy();
    expect(component.dataSource.sort).toBeTruthy();
  });

  it('should handle empty transactions list', fakeAsync(() => {
    transactionService.getTransactions.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(component.transactions.length).toBe(0);
    expect(component.dataSource.data.length).toBe(0);
  }));
}); 