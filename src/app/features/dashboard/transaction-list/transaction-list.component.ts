import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Category } from 'src/app/shared/models/category.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { MenssageriaService } from 'src/app/shared/services/menssageria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() filteredTransactions: Transaction[] = [];

  transactions: Transaction[] = [];
  categories: Category[] = [];
  isWeb: boolean = true;
  dataSource = new MatTableDataSource<Transaction>();
  selectedMonth!: number;
  selectedYear!: number;

  private router = Inject(Router);

  displayedColumns: string[] = ['title', 'value', 'type', 'category', 'date', 'actions'];

  constructor(
    private transactionService: TransactionService,
    private categoriesService: CategoriesService,
    private msg: MenssageriaService,
    private breakpointObserver: BreakpointObserver,
    private filterDataService: FilterDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; 
    this.selectedYear = currentDate.getFullYear(); 

    // Defina manualmente para testar
  // this.selectedMonth = 12; 
  // this.selectedYear = 2024;

    this.loadInitialData();

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isWeb = !result.matches;
      this.cdr.markForCheck();
    });

    this.filterDataService.filteredTransactions$.subscribe(filteredTransactions => {
      this.updateDataSource(filteredTransactions);
    });
  }

  private loadInitialData() {
    this.getCategories();
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions.map(transaction => ({
        ...transaction,
        category_name: this.getCategoryName(transaction.categoryId) // Adiciona o nome da categoria
      }));
      this.filterTransaction();
      this.cdr.markForCheck(); // Marcar para verificação de mudanças
    });
    this.transactionService.getTransactions().subscribe();
  }

  private getCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.markForCheck(); // Marcar para verificação de mudanças
    });
  }

  private updateDataSource(data: Transaction[]) {
    this.filteredTransactions = data;
    this.dataSource.data = data;
    this.dataSource._updateChangeSubscription(); // Força a atualização do dataSource
    console.log('DataSource após atualização:', this.dataSource.data);
    this.cdr.markForCheck(); // Marca para verificação de mudanças
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.markForCheck(); // Marcar para verificação de mudanças
  }

  getCategoryName(categoryId: number | string): string {
    const category = this.categories.find(cat => `${cat.id}` === `${categoryId}`);
    return category ? category.category_name : 'Desconhecido';
  }

  public deleteTransaction(id: string) {
    this.transactionService.deleteTransaction(id.toString()).subscribe(() => {
      this.msg.showMessage('Item removido com sucesso!');
      const updatedTransactions = this.transactions.filter(transaction => transaction.id !== id);
      this.updateDataSource(updatedTransactions);
      this.cdr.markForCheck(); // Marcar para verificação de mudanças
    });
  }

  filterTransaction(): void {
    console.log('selectedMonth:', this.selectedMonth, 'selectedYear:', this.selectedYear);
  
    if (this.selectedMonth !== undefined && this.selectedYear !== undefined) {
      this.filteredTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date); // Converte a string para Date
        const transactionMonth = transactionDate.getMonth() + 1; // Mês (1-12)
        const transactionYear = transactionDate.getFullYear();
  
        return transactionMonth === this.selectedMonth && transactionYear === this.selectedYear;
      });
  
      console.log('Transações após filtro:', this.filteredTransactions);
    } else {
      this.filteredTransactions = this.transactions;
    }
  
    this.updateDataSource(this.filteredTransactions);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}