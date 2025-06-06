import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalserviceService {

    private readonly CODIGO_PERFIL_KEY = 'codigoperfil';
    private readonly NOMBRE_USUARIO_KEY = 'nombreUsuario';
    private readonly URL_SERVIDOR = 'http://104.225.142.105:2060';
    private readonly URL_SERVIDORLOCAL = 'http://localhost:2060';
    constructor() { }

    setCodigoPerfil(codigo: string) {
      sessionStorage.setItem(this.CODIGO_PERFIL_KEY, codigo);
    }

    getCodigoPerfil(): string {
      return sessionStorage.getItem(this.CODIGO_PERFIL_KEY) || '';
    }

    setNombre_Usuario(nombre: string) {
      sessionStorage.setItem(this.NOMBRE_USUARIO_KEY, nombre);
    }

    getNombre_Usuario(): string {
      return sessionStorage.getItem(this.NOMBRE_USUARIO_KEY) || '';
    }

    getUrl_Servidor():string{
      // return this.URL_SERVIDORLOCAL;
      return this.URL_SERVIDORLOCAL;
    }
    // getUrl_ServidorLocal():string{
    //   return this.URL_SERVIDORLOCAL;
    // }
    // Método para limpiar los datos al cerrar sesión
    clearSession() {
      sessionStorage.removeItem(this.CODIGO_PERFIL_KEY);
      sessionStorage.removeItem(this.NOMBRE_USUARIO_KEY);
      // O si prefieres limpiar todo el sessionStorage:
      // sessionStorage.clear();
    }

    // Método para verificar si hay una sesión activa
    hasActiveSession(): boolean {
      return !!sessionStorage.getItem(this.CODIGO_PERFIL_KEY);
    }
}
