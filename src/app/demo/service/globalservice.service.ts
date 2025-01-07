import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalserviceService {

  constructor() { }

  private codigoperfil:string = ''

  setCodigoPerfil(codigo:string){
    this.codigoperfil=codigo;
  }

  getCodigoPerfil(): string {
    return this.codigoperfil;
  }
}
