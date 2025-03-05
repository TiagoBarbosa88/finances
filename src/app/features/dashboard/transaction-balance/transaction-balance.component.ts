import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-transaction-balance',
  templateUrl: './transaction-balance.component.html',
  styleUrls: ['./transaction-balance.component.css']
})
export class TransactionBalanceComponent implements OnInit {
  receita: number = 0;
  despesa: number = 0;
  saldo: number = 0;

  selectedMonth: number = moment().month() + 1;
  selectedYear: number = moment().year();

  filteredTransactions: Transaction[] = []; // Lista de transações filtradas

  constructor(
    private filterDateService: FilterDataService,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.filterDateService.monthYearChange$.subscribe((monthYear) => {
      this.selectedMonth = monthYear.month;
      this.selectedYear = monthYear.year;
      this.initializeTransactions(); // Atualiza as transações sempre que o mês/ano mudar
    });

    this.transactionService.transactions$.subscribe(transactions => {
      console.log('Transações recebidas no TransactionBalanceComponent:', transactions);
      this.filteredTransactions = this.filterTransactions(transactions);
      this.updateTotals();
    });

    this.initializeTransactions(); // Inicializa as transações ao carregar o componente
  } 

  /**
   * Inicializa as transações e atualiza os totais
   **/
  private currentMonth: number | null = null;
  private currentYear: number | null = null;
  
  initializeTransactions(): void {
    // Verifica se o mês/ano mudou para evitar requisições desnecessárias
    if (this.selectedMonth !== this.currentMonth || this.selectedYear !== this.currentYear) {
      this.currentMonth = this.selectedMonth;
      this.currentYear = this.selectedYear;

      this.transactionService.getTransactions().subscribe({
        next: (transactions: Transaction[]) => {
          console.log('Transações recebidas na inicialização:', transactions);
          this.filteredTransactions = this.filterTransactions(transactions);
          this.updateTotals();
        },
        error: (error) => {
          console.error('Erro ao carregar transações:', error);
        },
      });
    }
  }

  private filterTransactions(transactions: Transaction[]): Transaction[] {
    console.log('Filtrando transações:', transactions);
    const filtered = this.filterDateService.filterTransactions(transactions, this.selectedMonth, this.selectedYear);
    console.log('Transações após filtro:', filtered);
    return filtered;
  }

  /**
   * Atualiza os totais (receita, despesa, saldo) com base nas transações filtradas
   **/
  private updateTotals(): void {
    this.receita = 0;
    this.despesa = 0;
    this.saldo = 0;

    this.filteredTransactions.forEach(transaction => {
      if (transaction.type === 'receita') {
        this.receita += transaction.value;
      } else if (transaction.type === 'despesa') {
        this.despesa += transaction.value;
      }
    });

    this.saldo = this.receita - this.despesa;

    console.log('Totais atualizados:', {
      receita: this.receita,
      despesa: this.despesa,
      saldo: this.saldo
    });
  }

  // Função para atualizar mês e ano selecionados
  onMonthYearChange(month: number, year: number): void {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.filterDateService.emitMonthYearChange(month, year);
  }

  /**
   * Determina a classe CSS com base no saldo
   */ 
  getBalanceClass(): string {
    if (this.saldo > 0) return 'saldo'; 
    if (this.saldo < 0) return 'despesa'; 
    return 'neutro'; 
  }

  /**
   * Determina a classe do ícone com base no saldo
   */
  getIconClass(): string {
    if (this.saldo > 0) return 'icon-saldo'; 
    if (this.saldo < 0) return 'icon-negative'; 
    return 'icon-neutral'; 
  }
}