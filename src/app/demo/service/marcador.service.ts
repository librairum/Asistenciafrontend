import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marcador } from '../model/Marcador';

@Injectable({
  providedIn: 'root'
})
export class MarcadorService {
    private apiUrl='http://localhost:5000/Marcadores';

    constructor(private http: HttpClient) { }

    // listar todos los marcadores
    getMarcadores():Observable<Marcador[]>{
        return this.http.get<Marcador[]>(this.apiUrl)
    }

    // editar Marcador - solo se puede actualizar CodigoEquipo y NombreEquipo
    updateMarcador(id:string,marcador:Marcador):Observable<void>{
        console.log('Datos del marcador:', marcador);
        return this.http.put<void>(`${this.apiUrl}/${id}`, marcador);

    }

    //elimanr solo codigo y nombreequipo
    deteleMarcador(CodigoMarcador:string):Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${CodigoMarcador}`);
    }
}
