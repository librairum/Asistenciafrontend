import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { permisosxperfil } from '../model/permisosxperfil';

@Injectable({
  providedIn: 'root'
})
export class PermisosxperfilService {
    private apiUrl='https://localhost:7089/Permisos'
    constructor(private http:HttpClient) { }

    getPermisosPorPerfil(codigoPerfil:string,codModulo:string):Observable<ApiResponse<permisosxperfil>>{
        const url = `${this.apiUrl}/SpTraeMenuxPerfil`;
        const params =new HttpParams()
        .set('codigoPerfil',codigoPerfil).set('codModulo',codModulo);
        return this.http.get<ApiResponse<permisosxperfil>>(url, {params});
    }
}
