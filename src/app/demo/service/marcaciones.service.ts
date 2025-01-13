import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marcaciones } from '../model/Marcaciones';

@Injectable({
  providedIn: 'root'
})
export class MarcacionesService {
    private apiUrl='http://104.225.142.105:2060/Marcaciones'
    constructor(private http:HttpClient) { }

  //listar
  getMarcaciones():Observable<Marcaciones[]>{
    return this.http.get<Marcaciones[]>(this.apiUrl)
  }
  // parametros
  getMarcacionesParametros(
    nombreSedeEquipo?: string,
    nombreEquipo?: string,
    nombreSedeTrabajador?: string,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Observable<Marcaciones[]>{
    let params=new HttpParams();
    if (nombreSedeEquipo) {
        params = params.set('nombreSedeEquipo', nombreSedeEquipo);
      }
      if (nombreEquipo) {
        params = params.set('nombreEquipo', nombreEquipo);
      }
      if (nombreSedeTrabajador) {
        params = params.set('nombreSedeTrabajador', nombreSedeTrabajador);
      }
      if (fechaInicio) {
        params = params.set('fechaInicio', fechaInicio.toISOString());
      }
      if (fechaFin) {
        params = params.set('fechaFin', fechaFin.toISOString());
      }
      return this.http.get<Marcaciones[]>(this.apiUrl, { params });
    }

}
