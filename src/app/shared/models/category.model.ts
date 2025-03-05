// export interface Category {
//   id: number;
//   category_name: string;
// }

// category.model.ts
export interface Category {
  id: string;
  category_name: string; // Para exibir no formulário
  categoryName?: string; // Para compatibilidade com o backend
}
