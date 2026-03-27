import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreExampleService {
  private readonly apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  async writeExampleUser(uid: string, payload: { name: string; email: string; shopId: string }): Promise<void> {
    await firstValueFrom(
      this.http.post<ApiEnvelope<unknown>>(`${this.apiBase}/users`, {
        uid,
        ...payload,
        status: 'active'
      })
    );
  }

  async readExampleUser(uid: string): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/users`)
    );
    return (response.data || []).find((x) => x.uid === uid) || null;
  }

  async testFirestore(): Promise<void> {
    await firstValueFrom(
      this.http.get<ApiEnvelope<{ status: string }>>(`${this.apiBase}/health`)
    );
  }
}
