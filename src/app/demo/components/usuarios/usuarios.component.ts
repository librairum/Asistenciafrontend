import { Component, OnInit } from '@angular/core';
import { ListarPerfil, Usuario, UsuarioCrear } from '../../model/Usuario';
import { UsuarioService } from '../../service/usuario.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CardModule, ReactiveFormsModule, ReactiveFormsModule, CommonModule, TableModule, ButtonModule, InputTextModule, ToastModule, DropdownModule, InputMaskModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class UsuariosComponent implements OnInit {
    UsuarioForm: FormGroup;
    mUsuarioList: Usuario[] = [];
    ocultarCodigoPerfil = false;
    showPassword: boolean = false;
    isEditingData: boolean = false;
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingUsuario: Usuario | null = null;
    editingRows: { [s: string]: boolean } = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    clonedUsuario: { [s: string]: Usuario } = {}
    items: any[] = [];
    passwordVisible: boolean = false;
    isEditingAnyRow: boolean = false;
    perfil: ListarPerfil[] = [];
    selectPerfil: string | null = null;
    perfilesL: string[] = [];

    // perfiles = [
    //     { label: 'Administrador', value: '03' },
    //     { label: 'Estándar', value: '04' },
    // ];

    constructor(private fb: FormBuilder, private uS: UsuarioService, private mS: MessageService, private confirmationsService: ConfirmationService, private bS: BreadcrumbService) { }
    loadPerfiles() {
        this.uS.getAllPerfil()
            .subscribe(
                (data: ListarPerfil[]) => {
                    this.perfil = data;
                    console.log('perfiles: ',data)
                },
            );
    }
    onPerfilChange(event:any){
        this.selectPerfil=event.value;
    }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/' },
            { label: 'Usuarios', routerLink: '/usuarios' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.initForm();
        this.loadUsuario();
        this.loadPerfiles();
    }
    initForm() {
        this.UsuarioForm = this.fb.group({
            codigo: ['', Validators.required],
            nombreUsuario: ['', Validators.required],
            claveUsuario: ['', Validators.required],
            codigoPerfil: ['', Validators.required],
        });
    }

    loadUsuario(): void {
        this.uS.getAll()
            .subscribe({
                next: (data) => {
                    this.mUsuarioList = data;
                },
            });
    }
    onRowEditInit(usuario: Usuario, index: number) {
        this.editingRowIndex = index;
        this.editingUsuario = { ...usuario }
        this.isEditingAnyRow = true;
    }
    //Actualizar datos
    onRowEditSave(rowData: any) {
        if (rowData) {
            const updUsuario: UsuarioCrear = {
                codigo: rowData.codigousuario,
                cuentaCod: '0000001',
                nombreUsuario: rowData.nombreUsuario,
                claveUsuario: rowData.claveUsuario,
                codigoPerfil: rowData.codigoperfil,
                codigoempresa: '00001'
            };

            this.uS.update(updUsuario).subscribe({
                next: () => {
                    this.editingUsuario = null;
                    this.isEditingAnyRow = false;
                    this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
                    this.loadPerfiles();
                    this.loadUsuario();
                },
                error: () => {
                    this.mS.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
                }
            });
        }
    }
    onRowEditCancel(usuario: Usuario, index: number) {
        if (this.editingUsuario) {
            this.mUsuarioList[index] = { ...this.editingUsuario };
            this.editingUsuario = null;
            this.isEditingAnyRow = false;
            this.loadUsuario()
        }
    }
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        this.UsuarioForm.reset();
    }
    onSave() {
        if (this.UsuarioForm.valid) {
            // Obtener los datos del formulario
            const formData = this.UsuarioForm.value;

            // Agregar los valores predeterminados
            const newUsuario: UsuarioCrear = {
                ...formData,
                cuentaCod: '0000001',
                codigoempresa: '00001'
            };
            this.uS.create(newUsuario).subscribe({
                next: () => {
                    this.isEditing = false;
                    this.isNew = false;
                    this.UsuarioForm.reset();
                    this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
                    this.loadUsuario();
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    this.mS.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro' });
                },
            });
        }
    }

    onCancel() {
        this.isEditing = false;
        this.isNew = false;
        this.UsuarioForm.reset();
    }

    onDelete(usuario: Usuario, index: number) {
        this.confirmationsService.confirm({
            message: `¿Está seguro que desea eliminar al usuario <b>${usuario.nombreUsuario}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No, cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.uS.delete(usuario).subscribe({
                    next: () => {
                        this.mUsuarioList.splice(index, 1);
                        this.mS.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Registro eliminado'
                        });
                    }
                });
            }
        });
    }
    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }
    ocultarTexto(rowData: any) {
        const claveUsuario = String(rowData.claveUsuario);
        return '•'.repeat(claveUsuario.length);
    }
    // // Función que reemplaza el texto con puntos
    // ocultarTexto(texto: string): string {
    //     return '•'.repeat(texto.length); 
    // }
}
