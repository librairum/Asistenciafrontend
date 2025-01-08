import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { EditableRow, TableModule } from 'primeng/table';
import { Marcador, Marcador_ins } from '../../model/Marcador';
import { MarcadorService } from '../../service/marcador.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-mantenimiento-marcadores',
    standalone: true,
    imports: [
        PanelModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CommonModule,
        ButtonModule,
        ToastModule,
        BreadcrumbModule,
        ConfirmDialogModule,
    ],
    templateUrl: './mantenimiento-marcadores.component.html',
    styleUrl: './mantenimiento-marcadores.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class MantenimientoMarcadoresComponent implements OnInit {
    marcadores: Marcador[] = [];
    originalMarcadores: { [s: string]: Marcador } = {};
    loading: boolean = false;
    searchForm: FormGroup;

    items: any[] = [];
    constructor(
        private mrS: MarcadorService,
        private confirmationsService: ConfirmationService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private bS: BreadcrumbService
    ) {}

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            {
                label: 'Mantenimiento Marcadores',
                routerLink: '/Menu/marcadores',
            },
        ]);
        this.bS.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        this.loadMarcadores();
    }

    loadMarcadores(): void {
        this.loading = true;
        this.mrS.getMarcadores().subscribe({
            next: (data) => {
                //console.log('Datos obtenidos:', data); // Console log para verificar la data
                this.marcadores = data;

                this.marcadores.forEach((marcador, index) => {
                    marcador['id'] = index + 1; // Agregar la propiedad 'id' incrementalmente
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los datos',
                });
            },
            complete: () => {
                this.loading = false;
            },
        });
    }

    onRowEditInit(marcador: Marcador): void {
        this.originalMarcadores[marcador.marcadorProveedorCod] = {
            ...marcador,
        };
    }

    onRowEditSave(marcador: Marcador, index: number): void {
        //console.log('paara actualizar:', marcador); // Console log para verificar la data
        if (marcador.marcadorDesc != '' && marcador.marcadorClienteCod != '') {
            const marcador_ins: Marcador_ins = {
                marcadorClienteCod: marcador.marcadorClienteCod,
                marcadorProveedorCod: marcador.marcadorProveedorCod,
                marcadorDesc: marcador.marcadorDesc,
                marcadorEstado: marcador.marcadorEstado,
            };
            //console.log('paara actualizar:', marcador_ins); // Console log para verificar la data

            this.mrS.createMarcador(marcador_ins).subscribe({
                next: () => {
                    delete this.originalMarcadores[
                        marcador.marcadorProveedorCod
                    ];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Guardado correctamente',
                    });
                    this.loadMarcadores(); // Recargar lista para ver cambios
                },
                error: (err) => {
                    const index = this.marcadores.findIndex(
                        (m) =>
                            m.marcadorProveedorCod ===
                            marcador.marcadorProveedorCod
                    );
                    if (index !== -1) {
                        this.marcadores[index] =
                            this.originalMarcadores[
                                marcador.marcadorProveedorCod
                            ];
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al guardar: ' + err.message,
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Campos incompletos',
            });
            this.loadMarcadores(); // Recargar lista para ver cambios

        }
    }

    onRowEditCancel(marcador: Marcador, index: number): void {
        const originalMarcador =
            this.originalMarcadores[marcador.marcadorProveedorCod];
        if (originalMarcador) {
            this.marcadores[index] = { ...originalMarcador };
            delete this.originalMarcadores[marcador.marcadorProveedorCod];
        }
    }

    onDeleteMarcador(marcador: Marcador) {
        if (
            marcador.marcadorClienteCod != '' &&
            marcador.marcadorProveedorCod != ''
        ) {
            this.confirmationsService.confirm({
                message: `¿Desea eliminar <b>cliente: ${marcador.marcadorClienteCod}</b>?`,
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, eliminar',
                rejectLabel: 'No, cancelar',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button',

                accept: () => {
                    this.mrS
                        .deteleMarcador(
                            marcador.marcadorClienteCod,
                            marcador.marcadorProveedorCod
                        )
                        .subscribe({
                            next: () => {
                                this.marcadores = this.marcadores.filter(
                                    (m) =>
                                        m.marcadorProveedorCod !==
                                        marcador.marcadorProveedorCod
                                );
                                this.loadMarcadores();

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Eliminado correctamente',
                                });
                            },
                            error: (err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Error al eliminar: ' + err.message,
                                });
                            },
                        });
                },
            });
        } else if (marcador.marcadorClienteCod == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Sin codigo de cliente',
            });
        } else if (marcador.marcadorProveedorCod == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Sin codigo de proveedor',
            });
        }
    }
}
