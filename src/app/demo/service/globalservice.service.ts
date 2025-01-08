import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalserviceService {

  constructor() { }

  private codigoperfil:string = ''
  private nombreusuario:string = 'Sin Usuario'

  setCodigoPerfil(codigo:string){
    this.codigoperfil=codigo;
  }

  getCodigoPerfil(): string {
    return this.codigoperfil;
  }

  setNombre_Usuario(nombre:string){
    this.nombreusuario=nombre;
  }

  getNombre_Usuario(): string {
    return this.nombreusuario;
  }
}
