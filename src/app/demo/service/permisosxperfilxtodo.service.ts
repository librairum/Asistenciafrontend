import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { perfilxpermisos, permisosxperfilxtodo } from '../model/permisosxperfilxtodo';
import { O } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class PermisosxperfilxtodoService {
    //private apiUrl='http://104.225.142.105:2060/Permisos'
    //private apiUrl2='http://104.225.142.105:2060/Perfil/Splist'

    private apiUrl='https://localhost:7089/Permisos'
    private apiUrl2='https://localhost:7089/Perfil/Splist'
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
        console.log('Datos enviados en la solicitud:', body); // Agregado para depuración
        const headers=new HttpHeaders({
            'Content-Type':'application/json'
        })
        return this.http.post<ApiResponse<permisosxperfilxtodo>>(`${this.apiUrl}/SpInsertaMenuxPerfil`, body, { headers });

    }

    getPerfilesCombo():Observable<perfilxpermisos[]>{
        return this.http.get<ApiResponse<perfilxpermisos>>(this.apiUrl2).pipe(map(response => response.data));
    }
}
