import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isLoading = false;
  error = '';
  success = '';

  form = this.fb.group({
    shopName: ['', Validators.required],
    ownerName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    address: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async register(): Promise<void> {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    try {
      await this.auth.registerShop({
        shopName: String(this.form.value.shopName),
        ownerName: String(this.form.value.ownerName),
        phone: String(this.form.value.phone),
        email: String(this.form.value.email),
        password: String(this.form.value.password),
        city: String(this.form.value.city),
        address: String(this.form.value.address)
      });
      this.success = 'Shop created successfully';
      this.snackBar.open('Shop registered successfully. Please login.', 'OK', { duration: 2500 });
      await this.router.navigate(['/login']);
    } catch (error: any) {
      this.error = error?.message || 'Registration failed';
      this.snackBar.open(this.error || 'General error occurred', 'Close', { duration: 2500 });
    } finally {
      this.isLoading = false;
    }
  }

}
