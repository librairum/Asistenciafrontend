import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticacion } from '../model/autentication';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResponse } from '../model/api_response';

@Injectable({
    providedIn: 'root'
})
export class AutorizacionService {

    private apiUrl = 'http://104.225.142.105:2060/Autenticacion';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());


    constructor(private http: HttpClient) { }

    autenticacion(autenticacion: Autenticacion): Observable<ApiResponse<Autenticacion>> {
        const url = `${this.apiUrl}/SpList`;
        return this.http.post<ApiResponse<Autenticacion>>(url, autenticacion).pipe(
            tap(response => {
                if (response.isSuccess) {
                    // Guardar datos de sesión
                    localStorage.setItem('userSession', JSON.stringify({
                        isAuthenticated: true,
                        userData: response.data[0]
                    }));
                    this.isAuthenticatedSubject.next(true);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('userSession');
        this.isAuthenticatedSubject.next(false);
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    private checkAuthStatus(): boolean {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session).isAuthenticated : false;
    }
}
