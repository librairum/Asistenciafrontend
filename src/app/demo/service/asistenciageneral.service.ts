import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Marcador } from '../model/Marcador';
import { Marcador_ins } from '../model/Marcador';
import { ApiResponse } from '../model/api_response';
import { Asistenciageneral } from '../model/asistenciageneral';
import { GlobalserviceService } from './globalservice.service';
@Injectable({
    providedIn: 'root',
})
export class AsistenciaGeneralService {
    // private apiUrl = 'http://104.225.142.105:2060/Asistencia';
    // private apiUrl = 'http://localhost:2060/Asistencia';
    private apiUrl='';
    constructor(private http: HttpClient, private gs: GlobalserviceService) {
        this.apiUrl = this.gs.getUrl_Servidor();
    }

    getAsistenciaByDateRange(fechainicio: string,fechafin: string): Observable<Asistenciageneral[]> {
        return this.http.get<ApiResponse<Asistenciageneral>>(`${this.apiUrl}/SpListAsistenciGeneral?fechainicio=${fechainicio}&fechafin=${fechafin}`)
                  .pipe(map(response => response.data));
    }
}
