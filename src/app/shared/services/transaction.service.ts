import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsApi = environment.transactionUrl;
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsApi).pipe(
      tap(transactions => { 
        console.log('Transações recebidas da API:', transactions);
        this.transactionsSubject.next(transactions)
      })
    );
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

  private refreshTransactions(): void {
    this.getTransactions().subscribe();
  }
}