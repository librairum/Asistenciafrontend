import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { permisosxperfilxtodo } from '../model/permisosxperfilxtodo';

@Injectable({
  providedIn: 'root'
})
export class PermisosxperfilxtodoService {
    private apiUrl='http://localhost:7089/Permisos'

    constructor(private http:HttpClient) { }

    getPermisosPorPerfilxtodo(codigoPerfil:string,codModulo:string):Observable<ApiResponse<permisosxperfilxtodo>>{
        const params = new HttpParams()
            .set('codigoPerfil',codigoPerfil)
            .set('codModulo',codModulo);

        return this.http.get<ApiResponse<permisosxperfilxtodo>>(`${this.apiUrl}/SpTodoMenuxPerfil`, { params });
    }

    insertarPermisos(codModulo:string,codigoPerfil:string,xmlPermisos:string):Observable<ApiResponse<permisosxperfilxtodo>>{
        const body={
            codModulo:codModulo
            ,codigoPerfil:codigoPerfil
            ,xmlPermisos:xmlPermisos
        };
        const headers=new HttpHeaders({
            'Content-Type':'application/json'
        })
        return this.http.post<ApiResponse<permisosxperfilxtodo>>(`${this.apiUrl}/SpInsertaMenuxPerfil`, body, { headers });
    }
}
