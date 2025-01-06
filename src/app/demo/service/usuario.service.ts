import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private apiUrl='http://localhost:5000/Usuario';

    constructor(private http:HttpClient) { }

    //listar usuarios
    getUsuario():Observable<Usuario[]>{
        return this.http.get<Usuario[]>(this.apiUrl);
    }
    // crear un nuevo usuario
    createUsuario(usuario:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(this.apiUrl,usuario);
    }
    //editar un usuario
    updateUsuario(id:string,usuario:Usuario):Observable<Usuario>{
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Usuario>(url, usuario);
    }
    // eliminar
    deleteUsuario(id:string):Observable<void>{
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}
