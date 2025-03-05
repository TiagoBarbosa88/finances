// export interface Transaction {
//   id?: number;
//   title: string;
//   value: number;
//   type: 'receita' | 'despesa'; 
//   categoryId: number;
//   category_name: string;
//   date: string;
//   styleClass?: string;
// }

// transaction.model.ts
export interface Transaction {
  id?: string;
  date: string;
  title: string;
  value: number;
  type: string;
  categoryId: string;
  category: {
    id: string;
    categoryName: string;
  };
  styleClass?: string; // Este campo é específico para o frontend
}
