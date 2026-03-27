import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { ShopProfileService } from '../../../services/shop-profile.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  isSaving = false;
  readonly profile$ = this.shopProfileService.profile$;
  private readonly destroy$ = new Subject<void>();
  form = this.fb.group({
    name: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private shopProfileService: ShopProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.shopProfileService.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      this.form.patchValue({ name: profile.userName || '' }, { emitEvent: false });
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    try {
      await this.auth.updateProfile({ name: String(this.form.value.name || '') });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to update profile', 'Close', { duration: 2500 });
    } finally {
      this.isSaving = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
