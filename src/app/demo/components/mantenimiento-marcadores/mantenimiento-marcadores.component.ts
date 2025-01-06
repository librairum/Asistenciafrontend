import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { EditableRow, TableModule } from 'primeng/table';
import { Marcador } from '../../model/Marcador';
import { MarcadorService } from '../../service/marcador.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-mantenimiento-marcadores',
  standalone: true,
  imports: [PanelModule, TableModule, FormsModule, ReactiveFormsModule, InputTextModule,CommonModule,ButtonModule,BreadcrumbModule],
  templateUrl: './mantenimiento-marcadores.component.html',
  styleUrl: './mantenimiento-marcadores.component.scss',
  providers:[MessageService]

})
export class MantenimientoMarcadoresComponent implements OnInit{
    marcadores:Marcador[]=[];
    originalMarcadores:{[s:string]:Marcador}={};
    loading:boolean = false;
    searchForm: FormGroup;

    columns:any[]=[];
    items:any[]=[]
    constructor(private mrS:MarcadorService,private fb:FormBuilder,private messageService:MessageService,private bS:BreadcrumbService){}


    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/' },
            { label: 'Mantenimiento Marcadores', routerLink: '/marcadores' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.Columnas();
        this.loadMarcadores();


    }

    onRowEditInit(marcador:Marcador): void{
        this.originalMarcadores[marcador.CodigoMarcador]={...marcador};
    }

    loadMarcadores():void{
        this.loading=true;
        this.mrS.getMarcadores().subscribe({
            next:(data)=>{
                this.marcadores=data
            },
            error:(err)=>{
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los marcadores'
                });
            },
            complete:()=>{
                this.loading=false;
            }
        })
    }
    Columnas():void{
        this.columns=[
            { field: 'CodigoMarcador', header: 'Código Marcador' },
            { field: 'DescripcionMarcador', header: 'Descripción Marcador' },
            { field: 'IP', header: 'IP' },
            { field: 'CodigoEquipo', header: 'Código Equipo' },
            { field: 'NombreEquipo', header: 'Nombre Equipo' },
        ]
    }

    savingRows: { [key: string]: boolean } = {};
    onRowEditSave(marcador:Marcador):void{
        if (marcador.CodigoEquipo && marcador.NombreEquipo) {
            this.mrS.updateMarcador(marcador.id, marcador).subscribe({
                next: () => {
                    delete this.originalMarcadores[marcador.CodigoMarcador];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Marcador actualizado correctamente'
                    });
                },
                error: (err) => {
                    const index = this.marcadores.findIndex(m => m.CodigoMarcador === marcador.CodigoMarcador);
                    if (index !== -1) {
                        this.marcadores[index] = this.originalMarcadores[marcador.CodigoMarcador];
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar: ' + err.message
                    });
                }
            });
        }
    }
    onRowEditCancel(marcador: Marcador, index: number): void {
        this.marcadores[index] = this.originalMarcadores[marcador.CodigoMarcador];
        delete this.originalMarcadores[marcador.CodigoMarcador];
    }

    clearEquipmentFields(marcador:Marcador): void{
        marcador.CodigoEquipo=null;
        marcador.NombreEquipo=null;
        this.mrS.updateMarcador(marcador.id, marcador).subscribe({
             next: () => {

                delete this.originalMarcadores[marcador.CodigoMarcador];
                this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Marcador actualizado correctamente'
                });
             },
                error: (err) => {
                    const index = this.marcadores.findIndex(m => m.CodigoMarcador === marcador.CodigoMarcador);
                    if (index !== -1) {
                        this.marcadores[index] = this.originalMarcadores[marcador.CodigoMarcador];
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar: ' + err.message
                    });
                }
            });
    }

}
