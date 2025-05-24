import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalserviceService } from './globalservice.service';
import { map, Observable } from 'rxjs';
import { horario_personal } from '../model/horario_personal';
import { ApiResponse } from '../model/api_response';

@Injectable({
    providedIn: 'root',
})
export class HorariopersonalService {
    private apiUrl = '';
    constructor(private http: HttpClient, private gs: GlobalserviceService) {
        this.apiUrl = `${gs.getUrl_Servidor()}/HorarioPersonal`;
    }

    getAll(EmpresaCod: string = '01'): Observable<horario_personal[]> {
        return this.http
            .get<ApiResponse<horario_personal>>(`${this.apiUrl}/SpTrae`, {
                params: { EmpresaCod },
            })
            .pipe(map((response) => response.data));
    }

    getHorarioPorEmpleado(idpersonal: number): Observable<any[]> {
        const empresaCod = '01';
        const dia = '00';

        return this.http
            .get<ApiResponse<any>>(`${this.apiUrl}/SpTraeDet`, {
                params: {
                    empresaCod,
                    idpersonal,
                    dia,
                },
            })
            .pipe(map((response) => response.data));
    }

    actualizarHorariosMasivo(xml: string): Observable<any> {

        return this.http.put<any>(
            `${this.apiUrl}/SpActualizaMasivo`,
            { xmlhorarios: xml } // Aquí está el body
        );
    }
}
