import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface UploadResponse {
  url: string;
  path: string;
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  async uploadPurchaseBill(file: File, shopId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('shopId', shopId);

    const response = await firstValueFrom(
      this.http.post<ApiEnvelope<UploadResponse>>(`${this.apiBase}/upload`, formData)
    );

    return response.data.url;
  }
}
