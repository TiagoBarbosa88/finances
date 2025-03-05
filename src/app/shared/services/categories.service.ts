import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: Category[] = [];
  // private categoryApi = 'http://localhost:3001/categories';
  private categoryApi = environment.categoryUrl

  constructor(    
    private http: HttpClient
  ) { }

  getCategoryId(categoryName: string): number {
    const category = this.categories.find(cat => cat.category_name === categoryName);
    return category ? Number(category.id) : 0;
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryApi)
  }
}
