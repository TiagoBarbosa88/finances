import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

  const headers = new HttpHeaders({
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsApi = environment.transactionUrl;
  
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  private cache: Transaction[] | null = null;
  private cacheTimestamp: number | null = null;
  private cacheDuration = 5 * 60 * 1000; // Cache duration in milliseconds (e.g., 5 minutes)

  constructor(private http: HttpClient) {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    if (this.cache && this.cacheTimestamp && (Date.now() - this.cacheTimestamp < this.cacheDuration)) {
      this.transactionsSubject.next(this.cache);
    } else {
      this.http
        .get<Transaction[]>(this.transactionsApi, { headers })
        .pipe(
          tap((transactions) => {
            this.cache = transactions;
            this.cacheTimestamp = Date.now();
            this.transactionsSubject.next(transactions);
          })
        )
        .subscribe();
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  refreshTransactions(): void {
    this.http
      .get<Transaction[]>(this.transactionsApi, { headers })
      .pipe(
        tap((transactions) => {
          this.cache = transactions;
          this.cacheTimestamp = Date.now();
          this.transactionsSubject.next(transactions);
        })
      )
      .subscribe();
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionsApi, transaction).pipe(
      tap(() => this.refreshTransactions())
    );
  }

  readTransactionById(id: string): Observable<Transaction> {
    const url = `${this.transactionsApi}/${id}`;
    return this.http.get<Transaction>(url);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    const url = `${this.transactionsApi}/${transaction.id}`;
    return this.http.put<Transaction>(url, transaction).pipe(
      tap(() => this.refreshTransactions())
    );
  }

  deleteTransaction(id: string): Observable<Transaction> {
    const url = `${this.transactionsApi}/${id}`;
    return this.http.delete<Transaction>(url).pipe(
      tap(() => this.refreshTransactions())
    );
  }
}