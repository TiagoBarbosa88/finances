import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transaction-data',
  templateUrl: './transaction-data.component.html',
  styleUrls: ['./transaction-data.component.css']
})
export class TransactionDataComponent implements OnInit {
  selectedMonth!: number;
  selectedYear!: number;
  transactions: Transaction[] = []; // Lista original de transações
  filteredTransactions: Transaction[] = []; // Lista filtrada
  isWeb = true; // Responsividade (desktop ou mobile)
  date = new FormControl(moment());

  constructor(
    private dialog: MatDialog,
    private transactionService: TransactionService,
    private filterDataService: FilterDataService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.observeBreakpoint(); // Observa mudanças na responsividade

    // Inscreve-se nas mudanças de mês e ano
    this.filterDataService.monthYearChange$.subscribe(({ month, year }) => {
      this.filteredTransactions = this.filterDataService.filterTransactions(this.transactions, month, year);
    });
  }

  private observeBreakpoint() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isWeb = !result.matches;
    });
  }

  private getTransactions() {
    // Obtém as transações do serviço
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.filteredTransactions = [...transactions]; // Inicializa com todas as transações
    });
  }

  // Método para abrir o diálogo de receita de transação
  openDialog() {
    const dialogRef = this.dialog.open(TransactionInputComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // onMonthChange(event: any): void {
  //   const date = moment(event.value);
  //   this.selectedMonth = date.month();
  //   this.selectedYear = date.year();
  //   this.filterDataService.emitMonthYearChange(this.selectedMonth, this.selectedYear);
  // }

  // chosenMonthHandler(normalizedMonth: moment.Moment, datapicker: any): void {
  //   const ctrValue = moment();
  //   ctrValue.month(normalizedMonth.month()).year(normalizedMonth.year());
  //   this.onMonthChange({ value: ctrValue });
  //   datapicker.close();
  // }

  onMonthChange(event: any): void {
    const date = moment(event.value);
    this.selectedMonth = date.month();
    this.selectedYear = date.year();
    this.filterTransactions();
  }

  setMonthHandler(normalizedMonth: Moment, datapicker: MatDatepicker<Moment>): void {
    const ctrValue = this.date.value ?? moment();
    ctrValue.month(normalizedMonth.month())
    ctrValue.year(normalizedMonth.year());
    this.date.setValue(ctrValue);
    this.selectedMonth = ctrValue.month();
    this.selectedYear = ctrValue.year();
    this.filterTransactions();
    datapicker.close();
  }

  chosenMonthHandler(normalizedMonth: Moment, datapicker: MatDatepicker<Moment>): void {
    const ctrValue = this.date.value ?? moment();
    ctrValue.month(normalizedMonth.month())
    ctrValue.year(normalizedMonth.year());
    this.date.setValue(ctrValue);
    this.selectedMonth = ctrValue.month();
    this.selectedYear = ctrValue.year();
    this.filterTransactions();
    datapicker.close();
  }

  filterTransactions(): void {
    this.filteredTransactions = this.filterDataService.filterTransactions(this.transactions, this.selectedMonth, this.selectedYear);
    this.filterDataService.emitMonthYearChange(this.selectedMonth, this.selectedYear);
    this.filterDataService.emitFilteredTransactions(this.filteredTransactions);
  }

}

