import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ConsultaAsistenciaComponent } from './demo/components/consulta-asistencia/consulta-asistencia/consulta-asistencia.component';
import { AutorizacionComponent } from './demo/components/autorizacion/autorizacion.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', redirectTo: 'Inicio_Sesion', pathMatch: 'full'
            },
            {
                path:'Inicio_Sesion',component:AutorizacionComponent,
                children:[
                    {path:'',loadChildren:()=>import('./demo/components/autorizacion/autorizacion.module').then(m=>m.AutorizacionModule)},
                ]
            },
            {
                path: 'Menu', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'asistencia', loadChildren: () => import('./demo/components/consulta-asistencia/asistencia.module').then(m => m.AsistenciaModule) },
                    { path: 'marcaciones', loadChildren: () => import('./demo/components/consulta-marcaciones/marcaciones.module').then(m => m.MarcacionesModule) },
                    { path: 'marcadores', loadChildren: () => import('./demo/components/mantenimiento-marcadores/marcadores.module').then(m => m.MarcadoresModule) },
                    { path: 'usuarios', loadChildren: () => import('./demo/components/usuarios/usuarios.module').then(m => m.UsuariosModule) },
                    { path: 'anio', loadChildren: () => import('./demo/components/anio/anio.module').then(m => m.AnioModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },

            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
