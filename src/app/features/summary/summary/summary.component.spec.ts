import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { TransactionService } from '../../../shared/services/transaction.service';
import { FilterDataService } from '../../../shared/services/filter-data.service';
import { TestModule } from '../../../test.module';
import { SummaryComponent } from './summary.component';
import { Transaction } from '../../../shared/models/transaction.model';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let filterDataService: jasmine.SpyObj<FilterDataService>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      title: 'Salário',
      value: 5000,
      type: 'receita',
      date: '2024-01-15',
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
      date: '2024-02-05',
      categoryId: '2',
      category: {
        id: '2',
        categoryName: 'Moradia'
      }
    }
  ];

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    const filterDataServiceSpy = jasmine.createSpyObj('FilterDataService', ['filterTransactions']);

    transactionServiceSpy.getTransactions.and.returnValue(of(mockTransactions));
    filterDataServiceSpy.filterTransactions.and.callFake((transactions: Transaction[], month: number, year: number) => {
      return transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
    });

    TestBed.configureTestingModule({
      imports: [
        TestModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: FilterDataService, useValue: filterDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    filterDataService = TestBed.inject(FilterDataService) as jasmine.SpyObj<FilterDataService>;
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

    expect(filterDataService.filterTransactions).toHaveBeenCalled();
    expect(component.months.length).toBe(12);
  }));

  it('should filter years correctly', () => {
    component.minYear = 2023;

    expect(component.filterYears(2025)).toBeTrue();
    expect(component.filterYears(2024)).toBeTrue();
    expect(component.filterYears(2023)).toBeTrue();
    expect(component.filterYears(2022)).toBeFalse();
  });

  it('should change year and reload data', fakeAsync(() => {
    const newYear = 2025;
    component.minYear = 2023;

    component.changeYear(newYear);
    tick();

    expect(component.currentYear).toBe(newYear);
    expect(component.months.length).toBe(12);
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

    const januaryData = component.months[0];
    const februaryData = component.months[1];

    expect(januaryData.entrada).toBe(5000);
    expect(februaryData.saida).toBe(1500);
  }));
});
