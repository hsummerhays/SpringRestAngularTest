import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, AccountInfo } from '@azure/msal-browser';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

import { RouterModule } from '@angular/router';
import { apiScope } from '../../app.config';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  currentCustomer: Customer = { firstName: '', lastName: '', email: '' };
  isEditing = false;
  isLoggedIn = false;
  account: AccountInfo | null = null;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private cdr: ChangeDetectorRef
  ) {}

  private initialLoadDone = false;

  ngOnInit(): void {
    // Wait for inProgress$ to be 'none' to ensure MSAL is ready
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginState();
        if (this.isLoggedIn && !this.initialLoadDone) {
          this.initialLoadDone = true;
          this.loadCustomers();
        } else if (!this.isLoggedIn) {
          this.initialLoadDone = false;
          this.customers = [];
          this.cdr.detectChanges();
        }
      });
  }

  setLoginState(): void {
    const activeAccount = this.authService.instance.getActiveAccount();
    const allAccounts = this.authService.instance.getAllAccounts();
    
    if (activeAccount) {
      this.isLoggedIn = true;
      this.account = activeAccount;
    } else if (allAccounts.length > 0) {
      this.isLoggedIn = true;
      this.account = allAccounts[0];
      this.authService.instance.setActiveAccount(allAccounts[0]);
    } else {
      this.isLoggedIn = false;
      this.account = null;
    }
    this.cdr.detectChanges();
  }


  login(): void {
    this.authService.loginRedirect({
      scopes: [apiScope, 'openid', 'profile', 'offline_access']
    });
  }

  logout(): void {
    this.authService.logoutRedirect();
  }

  loadCustomers(): void {
    console.log('Fetching customers from API...');
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        console.log('Successfully fetched customers array of length:', data ? data.length : 'null');
        console.log('Customer data:', data);
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch customers! HTTP Error:', err);
      }
    });
  }

  saveCustomer(): void {
    if (this.isEditing && this.currentCustomer.id) {
      this.customerService.updateCustomer(this.currentCustomer.id, this.currentCustomer).subscribe(() => {
        this.resetForm();
        this.loadCustomers();
      });
    } else {
      this.customerService.createCustomer(this.currentCustomer).subscribe(() => {
        this.resetForm();
        this.loadCustomers();
      });
    }
  }

  editCustomer(customer: Customer): void {
    this.currentCustomer = { ...customer };
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  deleteCustomer(id: number | undefined): void {
    if (id) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

  resetForm(): void {
    this.currentCustomer = { firstName: '', lastName: '', email: '' };
    this.isEditing = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
