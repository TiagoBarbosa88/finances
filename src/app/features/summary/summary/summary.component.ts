import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  public currentYear: number = new Date().getFullYear();
  public totalBalance: number = 0;
  public totalDespesa: number = 0;
  public totalReceita: number = 0;

  months: {name: string, entrada: number, saida: number, total: number}[] = [];
  minYear: number = 2025;
  transactions: Transaction[] = [];

  constructor(private filterDataService: FilterDataService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.filterDataService.getTransactions().subscribe( transactions => {
      this.transactions = transactions;
      this.loadMonthyData();
    })
  }

  loadMonthyData(): void {
    this.months = [];
    this.totalBalance = 0;
    this.totalDespesa = 0;
    this.totalReceita = 0;

    for(let month =0; month < 12; month++){
      const filteredTransactions = this.filterDataService.filterTransactions(this.transactions, month +1, this.currentYear);
      const entrada = filteredTransactions.filter(t => t.type === 'receita').reduce((acc, t) => acc + t.value, 0);
      const saida = filteredTransactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + t.value, 0);
      const total = entrada - saida;

      this.months.push({
        name: new Date(0, month).toLocaleString('pt-br', {month: 'long'}),
        entrada: entrada || 0,
        saida: saida || 0,
        total: total || 0
      });

      this.totalBalance += total;
      this.totalDespesa += saida;
      this.totalReceita += entrada;
    }
  }

  filterYears(year: number): boolean {
    return year >= this.minYear;
  }

  changeYear(year: number): void {
    if(this.filterYears(year)){
      this.currentYear = year;
      this.loadTransactions();
    }
  }

}
