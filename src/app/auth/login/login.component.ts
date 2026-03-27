import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async login(): Promise<void> {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    try {
      await this.auth.loginWithEmail(
        String(this.form.value.email || ''),
        String(this.form.value.password || '')
      );
      this.snackBar.open('Welcome back!', 'OK', { duration: 2000 });
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.error = error?.message || 'Unable to login';
      this.snackBar.open(this.error || 'Login failed', 'Close', { duration: 2500 });
    } finally {
      this.isLoading = false;
    }
  }
}
