import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { AppUser } from '../shared/models/app.models';
import { ShopContextService } from '../shop-context.service';
import { environment } from '../../environments/environment';

interface RegisterShopPayload {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  city: string;
  address: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: AppUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBase = environment.apiBaseUrl;
  private readonly tokenKey = 'flower_auth_token';
  private readonly profileKey = 'flower_auth_profile';
  private readonly profileSubject = new BehaviorSubject<AppUser | null>(this.loadProfile());

  constructor(
    private http: HttpClient,
    private shopContext: ShopContextService
  ) {
    const current = this.profileSubject.value;
    if (current?.shopId) {
      this.shopContext.setShopId(current.shopId);
    }
  }

  async loginWithEmail(email: string, password: string): Promise<AppUser> {
    const response = await firstValueFrom(
      this.http.post<ApiEnvelope<LoginResponse>>(`${this.apiBase}/auth/login`, { email, password })
    );

    const payload = response.data;
    if (!payload?.token || !payload?.user) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem(this.tokenKey, payload.token);
    localStorage.setItem(this.profileKey, JSON.stringify(payload.user));
    this.profileSubject.next(payload.user);
    this.shopContext.setShopId(payload.user.shopId);

    return payload.user;
  }

  async registerShop(payload: RegisterShopPayload): Promise<void> {
    await firstValueFrom(this.http.post<ApiEnvelope<unknown>>(`${this.apiBase}/auth/register`, payload));
  }

  loginWithPhoneOtp(): Promise<void> {
    return Promise.resolve();
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.profileKey);
    this.profileSubject.next(null);
    this.shopContext.clear();
  }

  async updateProfile(payload: { name: string }): Promise<AppUser> {
    const response = await firstValueFrom(
      this.http.put<ApiEnvelope<AppUser>>(`${this.apiBase}/auth/profile`, payload)
    );
    const profile = response.data;
    localStorage.setItem(this.profileKey, JSON.stringify(profile));
    this.profileSubject.next(profile);
    this.shopContext.setShopId(profile.shopId);
    return profile;
  }

  userProfile$(): Observable<AppUser | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    if (this.profileSubject.value) {
      return this.profileSubject.asObservable();
    }

    this.http.get<ApiEnvelope<AppUser>>(`${this.apiBase}/auth/profile`).pipe(
      tap((response) => {
        const profile = response.data;
        if (profile?.shopId) {
          localStorage.setItem(this.profileKey, JSON.stringify(profile));
          this.profileSubject.next(profile);
          this.shopContext.setShopId(profile.shopId);
        }
      }),
      catchError(() => {
        this.logout();
        return of({ data: null as unknown as AppUser });
      })
    ).subscribe();

    return this.profileSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadProfile(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.profileKey);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }
}
