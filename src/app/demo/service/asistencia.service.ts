import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asistencia } from '../model/Asistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
    private apiUrl='http://104.225.142.105:2060/Asistencias';

    constructor(private http: HttpClient) { }

    //listar las asistencias
    getAsistencias():Observable<Asistencia[]>{
        return this.http.get<Asistencia[]>(this.apiUrl);
    }

    //registrar una nueva asistencia
    createAsistencia(asistencia:Asistencia):Observable<Asistencia>{
        return this.http.post<Asistencia>(`${this.apiUrl}`, asistencia);
    }

    actualizarAsistencia(codigo:string,asistencia:Asistencia):Observable<Asistencia>{
        return this.http.put<Asistencia>(`${this.apiUrl}/${codigo}`, asistencia);
    }

    eliminarAsistencia(codigo:string):Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
    }
}
