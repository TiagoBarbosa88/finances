import { inject, Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { environment } from 'src/environments/environment';
import { MenssageriaService } from './menssageria.service';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {
  private http = inject(HttpClient);
  private msg = inject(MenssageriaService);

  private transactionsApi = environment.transactionUrl;
  transactions: Transaction[] = []

  // evento de mudança de transações filtradas para a LISTA
  private monthYearChangeSource = new BehaviorSubject<{ month: number, year: number }>({
    month: moment().month() + 1,
    year: moment().year(),
  });
  monthYearChange$ = this.monthYearChangeSource.asObservable();

  emitMonthYearChange(month: number, year: number): void {
    this.monthYearChangeSource.next({ month, year })
  }

  // evento de mudança de transações filtradas para o BALANCE
  private readonly filteredTransactionsSource = new BehaviorSubject<Transaction[]>([]);
  filteredTransactions$ = this.filteredTransactionsSource.asObservable();

  emitFilteredTransactions(filteredTransactions: Transaction[]): void {
    this.filteredTransactionsSource.next(filteredTransactions);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsApi).pipe(
      catchError(error => {
        this.msg.showMessage('Erro ao buscar transações', error);
        return throwError(() => error)
      })
    );
  }

  filterTransactions(transactions: Transaction[], month: number, year: number): Transaction[] {
    return transactions.filter((transaction) => {
      const transactionDate = moment(transaction.date);
      return transactionDate.month() === month - 1 && transactionDate.year() === year; // Ajuste de mês (0-11)
    });
  }


  calculateTotals(transactions: Transaction[], month: number, year: number): { receita: number, despesa: number, saldo: number } {
    if (!transactions.length) {
      return { receita: 0, despesa: 0, saldo: 0 };
    }

    const filteredTransactions = this.filterTransactions(transactions, month, year);

    const receita = filteredTransactions.filter((t) => t.type === 'receita').reduce((acc, t) => acc + t.value, 0);
    const despesa = filteredTransactions.filter((t) => t.type === 'despesa').reduce((acc, t) => acc + t.value, 0);
    const saldo = receita - despesa;

    return { receita, despesa, saldo };
  }
}