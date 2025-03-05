import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { Transaction } from '../models/transaction.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  transactions: Transaction[] = [];

  private _totalReceitas = new BehaviorSubject<number>(0);
  private _totalDespesas = new BehaviorSubject<number>(0);
  private _totalBalance = new BehaviorSubject<number>(0);

  totalReceitas$ = this._totalReceitas.asObservable();
  totalDespesas$ = this._totalDespesas.asObservable();
  totalBalance$ = this._totalBalance.asObservable();

  constructor(
    private transactionService: TransactionService
  ) {
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.calculateTotal();
    })
  }

  calculateTotal(): void {
    const totalReceitas = this.transactions
      .filter(transactions => transactions.type === 'receita')
      .reduce((sun, transction) => sun + transction.value, 0)
    
    const totalDespesas = this.transactions
      .filter(transactions => transactions.type === 'despesa')
      .reduce((sun, transactions) => sun + transactions.value, 0)

    const totalBalance = totalReceitas - totalDespesas

    // Atualiza o Behavior
    this._totalReceitas.next(totalReceitas);
    this._totalDespesas.next(totalDespesas);
    this._totalBalance.next(totalBalance);
  }

  refreshTotals(): void {
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.calculateTotal();
    });
  }

}
