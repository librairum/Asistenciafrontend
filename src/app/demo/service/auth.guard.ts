import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AutorizacionService } from './autorizacion.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AutorizacionService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authService.isAuthenticated().pipe(
            take(1),
            map(isLoggedIn => {
                if (!isLoggedIn) {
                    this.router.navigate(['/Inicio_Sesion']);
                    return false;
                }
                return true;
            })
        );
    }
}
