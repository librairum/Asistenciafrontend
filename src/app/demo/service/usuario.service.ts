import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Usuario, UsuarioCrear } from '../model/Usuario';
import { ApiResponse } from '../model/api_response';


@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'https://104.225.142.105/Usuario';

    constructor(private http: HttpClient) { }

    //listar usuarios
    getAll(): Observable<Usuario[]> {
        return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/SpList`)
            .pipe(map(response => response.data));
    }
    // crear un nuevo usuario
    create(usuarioCrear: UsuarioCrear): Observable<string> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/SpCreate`, usuarioCrear)
            .pipe(
                map(response => response.item || ''),
                catchError(error => {
                    console.error('Error al crear el usuario:', error);
                    return throwError(() => new Error('No se pudo crear al usuario. Intente nuevamente.'));
                })
            );
    }

    //editar un usuario
    update(usuarioActualizar: UsuarioCrear): Observable<string> {
        return this.http.put<ApiResponse<string>>(`${this.apiUrl}/SpUpdate`, usuarioActualizar)
            .pipe(map(response => response.item));
    }
    // eliminar
    delete(usuario: Usuario): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/SpDelete?codigo=${usuario.codigousuario}&cuentacod=0000001&empresacod=00001`)
            .pipe(
                catchError((error) => {
                    console.error('Error al eliminar el usuario:', error);
                    return throwError(error);
                })
            );
    }
}
