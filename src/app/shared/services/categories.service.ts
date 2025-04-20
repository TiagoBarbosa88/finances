import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const headers = new HttpHeaders({
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
});

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  public categories: Category[] = [];

  private categoriesApi = environment.categoryUrl;

  constructor(private http: HttpClient) {}

  getCategoryId(categoryName: string): number {
    const category = this.categories.find(
      (cat) => cat.category_name === categoryName
    );
    return category ? Number(category.id) : 0;
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesApi, { headers });
  }
}
