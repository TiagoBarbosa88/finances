import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/shared/models/category.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { MenssageriaService } from 'src/app/shared/services/menssageria.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.css']
})
export class TransactionEditComponent implements OnInit {
  transaction!: Transaction;
  transactionForm!: FormGroup
  categories: Category[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoriesService: CategoriesService,
    private msg: MenssageriaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      value: [0, Validators.required],
      type: ['', Validators.required],
      category: [null, Validators.required],
      selectedDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Carregar as Categorias
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.transactionService.readTransactionById(id).subscribe((transaction) => {
        this.transaction = transaction;

        this.transactionForm.setValue({
          title: transaction.title,
          value: transaction.value,
          type: transaction.type,
          category: transaction.categoryId,
          selectedDate: transaction.date
        });
      });
    }
  }

  onSubmit(): void {
  
    if (this.transactionForm.valid) {
      const formValues = this.transactionForm.value;
  
      const selectedCategory = this.categories.find(cat => cat.id === formValues.category);
  
      if (!selectedCategory) {
        this.msg.showMessage('Categoria inválida');
        return;
      }
  
      const newTransaction: Transaction = {
        id: this.transaction.id,
        date: new Date(formValues.selectedDate).toISOString().split('T')[0],
        title: formValues.title,
        value: formValues.value,
        type: formValues.type,
        categoryId: selectedCategory.id,
        category: {
          id: selectedCategory.id,
          categoryName: selectedCategory.category_name // Atualizar com o nome da categoria
        },
        styleClass: formValues.type === 'receita' ? 'receita' : 'despesa'    
      };
  
      this.transactionService.updateTransaction(newTransaction).subscribe(() => {
        this.msg.showMessage('Transação atualizada com sucesso!');
        this.router.navigate(['/']);
      });
    } else {
      this.msg.showMessage('Formulário inválido, revise os dados!');
    }
  }
  
  
  cancel(): void {
    this.router.navigate(['/'])
  }
}

