import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Asistencia, AsistenciaDetalle, PLanilla_Combo } from '../model/Asistencia';
import { ApiResponse } from '../model/api_response';
import { GlobalserviceService } from './globalservice.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
    //private apiUrl='http://104.225.142.105:2060/Asistencia/SpListCalculoResumen/20241215/20241231/1
    private apiUrl='http://104.225.142.105:2060/Asistencia';

    constructor(private http: HttpClient) { }

    //listar las asistencias
    getCalculoResumen(fechainicio:string,fechafin:string,codigoplanilla:string):Observable<ApiResponse<Asistencia>>{
        const params=new HttpParams()
        .set('fechainicio', fechainicio)
        .set('fechafin', fechafin)
        .set('codigoplanilla', codigoplanilla);
        return this.http.get<ApiResponse<Asistencia>>(`${this.apiUrl}/SpListCalculoResumen`, { params });

    }

    formatDateForApi(date: Date): string {
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1);

        const year = adjustedDate.getFullYear();
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const day = String(adjustedDate.getDate()).padStart(2, '0');

        return `${year}${month}${day}`;
    }

    parseApiDate(dateStr: string): Date {
        return new Date(dateStr);
    }

    //planilla

    getPlanillaCombo():Observable<PLanilla_Combo[]>{
            return this.http.get<ApiResponse<PLanilla_Combo>>(`${this.apiUrl}/SpListPlanilla`).pipe(map(response => response.data));
    }

    getCalculoDetalle(fechaInicio:string,fechaFin:string,codigoEmpleado:string):Observable<ApiResponse<AsistenciaDetalle>>{
        const params=new HttpParams()
        .set('fechainicio', fechaInicio)
        .set('fechafin', fechaFin)
        .set('codigoempleado',codigoEmpleado);
        return this.http.get<ApiResponse<AsistenciaDetalle>>(`${this.apiUrl}/SpListCalculoDetalle`,{params});
    }
}
