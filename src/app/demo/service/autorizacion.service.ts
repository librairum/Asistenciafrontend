import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticacion } from '../model/autentication';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

    private apiUrl='https://localhost:7089/Autenticacion';

  constructor(private http:HttpClient) { }

    autenticacion(autenticacion: Autenticacion): Observable<ApiResponse<Autenticacion>>{
        const url=`${this.apiUrl}/SpList`
        return this.http.post<ApiResponse<Autenticacion>>(url,autenticacion);
    }
}
