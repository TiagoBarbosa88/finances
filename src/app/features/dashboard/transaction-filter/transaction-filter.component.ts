import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FilterDataService } from 'src/app/shared/services/filter-data.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

const moment = _rollupMoment || _moment;

// Formatos personalizados para exibir apenas mês e ano
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionFilterComponent implements OnInit {
  selectedMonth!: number;
  selectedYear!: number;
  transactions: Transaction[] = []; // Lista original de transações
  filteredTransactions: Transaction[] = []; // Lista filtrada
  isWeb = true; // Responsividade (desktop ou mobile)
  // FormControl para gerenciar o input de data
  date = new FormControl(moment());

  // Limitar as datas exibidas
  startDate = moment(); // Começa no mês e ano atuais
  minDate = moment(); // Mínimo é o mês e ano atuais
  maxDate = moment().add(5, 'years'); // Máximo é 5 anos no futuro

  constructor(
    private transactionService: TransactionService,
    private filterDataService: FilterDataService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    // Define o mês e ano inicial como o mês atual
    const now = moment();
    this.selectedMonth = now.month(); 
    this.selectedYear = now.year(); 

    this.getTransactions(); // Carrega as transações

    // Observa mudanças na responsividade
    this.observeBreakpoint();

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
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;

      // Filtra as transações com o mês e ano inicial
      this.filteredTransactions = this.filterDataService.filterTransactions(this.transactions, this.selectedMonth, this.selectedYear);
    });
  }


  /**
   * Define o mês e o ano selecionados e atualiza o FormControl
   */
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);

    this.selectedMonth = ctrlValue.month()+1;
    this.selectedYear = ctrlValue.year();
    this.filterTransactions();

    datepicker.close();

    // const selectedMonth = ctrlValue.month();
    // const selectedYear = ctrlValue.year();

    // Emite os valores de filtro para o serviço
    // this.filterDataService.emitMonthYearChange(selectedMonth, selectedYear);
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
