import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { perfilxpermisos, permisosxperfilxtodo } from '../../model/permisosxperfilxtodo';
import { GlobalserviceService } from '../../service/globalservice.service';
import { ApiResponse } from '../../model/api_response';
import { MessageService, SelectItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PermisosxperfilxtodoService } from '../../service/permisosxperfilxtodo.service';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { permisosxperfil } from '../../model/permisosxperfil';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-permisosxperfilxtodo',
  standalone: true,
  imports: [ReactiveFormsModule,InputTextModule,FormsModule,CommonModule,TableModule,ButtonModule,ProgressSpinnerModule,ToastModule,CheckboxModule,PanelModule,BreadcrumbModule,DropdownModule],
  templateUrl: './permisosxperfilxtodo.component.html',
  styleUrl: './permisosxperfilxtodo.component.scss',
  providers:[MessageService]
})
export class PermisosxperfilxtodoComponent implements OnInit {
    permisosForm: FormGroup;
    permisos:permisosxperfilxtodo[]=[];
    loading: boolean = false;
    items:any[]=[];
    perfiles:perfilxpermisos[] = [];
    selectedperfil:string = "";

    constructor(private fb:FormBuilder,private ptS:PermisosxperfilxtodoService,private gS:GlobalserviceService,private mS:MessageService,private bS:BreadcrumbService) {
        this.permisosForm=this.fb.group({
            codigoPerfil:['',Validators.required],
            codModulo:'01'
        });
    }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/Menu' },
            { label: 'Permisos', routerLink: '/Menu/asignarpermiso' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.loadPerfiles()
        this.cargarPermisos();


    }

    loadPerfiles(){
        this.ptS.getPerfilesCombo().subscribe(
            (data:perfilxpermisos[])=>{
                this.perfiles=data
            }
        )
    }

    onPerfilChange(event:any){
        this.selectedperfil=event.value
        if (!this.selectedperfil) {
            // Si el perfil está vacío (cuando el botón de limpiar es presionado)
            this.permisos = []; // Limpiamos la tabla
        }
    }

    cargarPermisos(): void {
        if (this.permisosForm.invalid) {
            this.mS.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos requeridos'
            });
            return;
        }

        this.loading = true;
        const codigoPerfil = this.selectedperfil || this.permisosForm.get('codigoPerfil')?.value
        const codModulo = this.permisosForm.get('codModulo')?.value;

        this.ptS.getPermisosPorPerfilxtodo(codigoPerfil,codModulo).subscribe({
            next: (response:ApiResponse<permisosxperfilxtodo>)=>{
                if(response.isSuccess){
                    this.permisos=response.data.sort((a,b)=>{
                        const nivel1Diff = a.nivel1?.localeCompare(b.nivel1 || '') || 0;
                        const nivel2Diff = a.nivel2?.localeCompare(b.nivel2 || '') || 0;
                        const nivel3Diff = a.nivel3?.localeCompare(b.nivel3 || '') || 0;
                        return nivel1Diff || nivel2Diff || nivel3Diff;
                    });
                }
            },
            error: (error)=>{
                this.mS.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los datos',
                });
            },
            complete: ()=>{
                this.loading=false;
                this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Permisos Cargados' });
            }
        })
    }

    // Nivel 1: Elementos con nivel2 = "00" y nivel3 = "00".
    isPadre(permiso: permisosxperfilxtodo): boolean {
        return permiso.nivel2 === '00' && permiso.nivel3 === '00';
    }

    // Método para verificar si un permiso es hijo
    isHijo(permiso: permisosxperfilxtodo): boolean {
        return permiso.nivel2 !== '00' && permiso.nivel3 === '00';
    }

    // Método para verificar si un permiso es nieto
    isNieto(permiso: permisosxperfilxtodo): boolean {
        return permiso.nivel3 !== '00';
    }

    // Método para obtener todos los hijos de un padre
    getHijos(padre: permisosxperfilxtodo): permisosxperfilxtodo[] {
        return this.permisos.filter(p =>
            p.nivel1 === padre.nivel1 &&
            p.nivel2 !== '00' &&
            p.nivel3 === '00'
        );
    }

    // Método para obtener todos los nietos de un hijo
    getNietos(hijo: permisosxperfilxtodo): permisosxperfilxtodo[] {
        return this.permisos.filter(p =>
            p.nivel1 === hijo.nivel1 &&
            p.nivel2 === hijo.nivel2 &&
            p.nivel3 !== '00'
        );
    }

    // Método para obtener el padre de un hijo/nieto
    getPadre(permiso: permisosxperfilxtodo): permisosxperfilxtodo | undefined {
        return this.permisos.find(p =>
            p.nivel1 === permiso.nivel1 &&
            p.nivel2 === '00' &&
            p.nivel3 === '00'
        );
    }

    // Método para obtener el hijo padre de un nieto
    getPadreHijo(nieto: permisosxperfilxtodo): permisosxperfilxtodo | undefined {
        return this.permisos.find(p =>
            p.nivel1 === nieto.nivel1 &&
            p.nivel2 === nieto.nivel2 &&
            p.nivel3 === '00'
        );
    }

    // Método para manejar el cambio en un checkbox
    onCheckboxChange(permiso: permisosxperfilxtodo, checked: boolean): void {
        permiso.habilitado = checked ? 'S' : 'N';

        if (this.isPadre(permiso)) {
            // Si es padre, actualizar todos los hijos y nietos
            const hijos = this.getHijos(permiso);
            hijos.forEach(hijo => {
                hijo.habilitado = permiso.habilitado;
                const nietos = this.getNietos(hijo);
                nietos.forEach(nieto => {
                    nieto.habilitado = permiso.habilitado;
                });
            });
        } else if (this.isHijo(permiso)) {
            // Si es hijo, actualizar padre (si es necesario) y nietos
            if (checked) {
                const padre = this.getPadre(permiso);
                if (padre) {
                    padre.habilitado = 'S';
                }
            }

            const nietos = this.getNietos(permiso);
            if (!checked) {
                nietos.forEach(nieto => {
                    nieto.habilitado = 'N';
                });
            }
        } else if (this.isNieto(permiso)) {
            // Si es nieto, actualizar padre y padre-hijo si es necesario
            if (checked) {
                const padreHijo = this.getPadreHijo(permiso);
                if (padreHijo) {
                    padreHijo.habilitado = 'S';
                    const padre = this.getPadre(padreHijo);
                    if (padre) {
                        padre.habilitado = 'S';
                    }
                }
            }
        }
    }

}
