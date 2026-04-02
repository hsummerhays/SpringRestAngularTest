import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { Customer } from '../models/customer.model';
import { MsalService } from '@azure/msal-angular';
import { apiScope } from '../app.config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient, private authService: MsalService) { }

  private getAuthHeaders(): Observable<HttpHeaders> {
    const account = this.authService.instance.getActiveAccount();
    if (!account) {
      console.error('No active account found for token acquisition');
      return from([new HttpHeaders()]);
    }
    
    return from(this.authService.instance.acquireTokenSilent({
      scopes: [apiScope],
      account: account
    })).pipe(
      switchMap(response => {
        return [new HttpHeaders({
          'Authorization': `Bearer ${response.accessToken}`
        })];
      })
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<Customer[]>(this.apiUrl, { headers }))
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<Customer>(`${this.apiUrl}/${id}`, { headers }))
    );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.post<Customer>(this.apiUrl, customer, { headers }))
    );
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.put<Customer>(`${this.apiUrl}/${id}`, customer, { headers }))
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }))
    );
  }
}
