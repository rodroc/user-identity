import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidationService } from '../services/validation.service';

interface UserIdentity {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  sourceSystem: string;
  lastUpdated: Date;
  isActive: boolean;
}

interface UpdateUserIdentityDto {
  fullName?: string;
  email?: string;
  sourceSystem?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-user-identity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div *ngIf="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ error }}</span>
          <button (click)="error = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span class="sr-only">Dismiss</span>
            <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div *ngIf="success" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ success }}</span>
          <button (click)="success = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span class="sr-only">Dismiss</span>
            <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div *ngIf="userIdentity" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">User ID</label>
            <div class="mt-1 text-gray-900">{{ userIdentity.userId }}</div>
          </div>

          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullName" [(ngModel)]="userIdentity.fullName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="!validationService.isFieldValid(userIdentity.fullName)"
              required>
            <div *ngIf="!validationService.isFieldValid(userIdentity.fullName)" class="text-red-500 text-sm mt-1">
              Full name is required
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" [(ngModel)]="userIdentity.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="!validationService.isFieldValid(userIdentity.email) || !validationService.isValidEmail(userIdentity.email)"
              required>
            <div *ngIf="!validationService.isFieldValid(userIdentity.email) || !validationService.isValidEmail(userIdentity.email)" class="text-red-500 text-sm mt-1">
              Valid email is required
            </div>
          </div>

          <div>
            <label for="sourceSystem" class="block text-sm font-medium text-gray-700">Source System</label>
            <input type="text" id="sourceSystem" [(ngModel)]="userIdentity.sourceSystem"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="!validationService.isFieldValid(userIdentity.sourceSystem)"
              required>
            <div *ngIf="!validationService.isFieldValid(userIdentity.sourceSystem)" class="text-red-500 text-sm mt-1">
              Source system is required
            </div>
          </div>

          <div class="flex items-center">
            <input type="checkbox" id="isActive" [(ngModel)]="userIdentity.isActive"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <label for="isActive" class="ml-2 block text-sm text-gray-900">Active</label>
          </div>

          <div>
            <button (click)="updateUserIdentity()"
              [disabled]="!isFormValid()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Update Profile
            </button>
          </div>
        </div>

        <div *ngIf="!userIdentity && !error" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    </div>
  `
})
export class UserIdentityComponent implements OnInit, OnDestroy {
  userIdentity: UserIdentity | null = null;
  error: string | null = null;
  success: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.loadUserIdentity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserIdentity(): void {
    this.http.get<UserIdentity>('http://localhost:5250/api/identities/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.userIdentity = data;
          this.error = null;
        },
        error: (err: HttpErrorResponse) => {
          this.error = this.getErrorMessage(err);
          console.error('Error loading user identity:', err);
        }
      });
  }

  updateUserIdentity(): void {
    if (!this.userIdentity || !this.isFormValid()) return;

    const updateData: UpdateUserIdentityDto = {
      fullName: this.userIdentity.fullName,
      email: this.userIdentity.email,
      sourceSystem: this.userIdentity.sourceSystem,
      isActive: this.userIdentity.isActive
    };

    this.http.patch(`http://localhost:5250/api/identities/${this.userIdentity.id}`, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = 'Profile updated successfully!';
          this.error = null;
          setTimeout(() => this.success = null, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.error = this.getErrorMessage(err);
          this.success = null;
          console.error('Error updating user identity:', err);
        }
      });
  }

  isFormValid(): boolean {
    if (!this.userIdentity) return false;
    return !!(
      this.validationService.isFieldValid(this.userIdentity.fullName) &&
      this.validationService.isFieldValid(this.userIdentity.email) &&
      this.validationService.isValidEmail(this.userIdentity.email) &&
      this.validationService.isFieldValid(this.userIdentity.sourceSystem)
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'An error occurred. Please try again.';
    }
    return error.error?.message || 'Failed to process your request. Please try again.';
  }
} 