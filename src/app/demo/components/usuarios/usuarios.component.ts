import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
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
  imports: [CardModule,ReactiveFormsModule,CommonModule,TableModule,ButtonModule,InputTextModule,ToastModule,DropdownModule,InputMaskModule,PanelModule,BreadcrumbModule,ConfirmDialogModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  providers:[MessageService,ConfirmationService]
})
export class UsuariosComponent implements OnInit {
    usuarios:Usuario[]=[];
    loading:boolean = false;
    usuarioForm:FormGroup;
    selectedUsuario:Usuario |null = null;
    showPassword:boolean = false;
    formDisabled:boolean = true;
    tableDisabled:boolean = true;
    items:any[] = [];
    currentMode:'edit' | 'delete' | null=null;
    buttonStates = {
        add: true,
        save: false,
        edit: true,
        delete: true,
        cancel: false
    };

    perfiles=[
        { label:'Administrador', value:'Administrador'},
        { label:'Estándar', value:'Estándar'},
    ];

    constructor(private fb:FormBuilder,private uS:UsuarioService,private mS:MessageService,private bS:BreadcrumbService,private cS:ConfirmationService){ }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/' },
            { label: 'Usuarios', routerLink: '/usuarios' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.initForm();
        this.loadUsuarios();
    }

    initForm(){
        this.usuarioForm=this.fb.group({
            idUsuario:[{ value: '', disabled: this.formDisabled },Validators.required],
            Clave:[{ value: '', disabled: this.formDisabled },Validators.required],
            Perfil:[{ value: '', disabled: this.formDisabled },Validators.required],
        });
    }

    enableForm():void{
        this.formDisabled=false;
        Object.keys(this.usuarioForm.controls).forEach(key => {
            this.usuarioForm.controls[key].enable();
        });
        this.buttonStates = {
            add: false,
            save: true,
            edit: false,
            delete: false,
            cancel: true
        };
    }

    disableForm():void{
        this.formDisabled = true;
        Object.keys(this.usuarioForm.controls).forEach(key => {
            this.usuarioForm.controls[key].disable();
        });
    }

    enableTable():void{
        this.tableDisabled=false;
    }

    disableTable():void{
        this.tableDisabled=true;
    }

    editMode():void{
        this.enableTable();
        this.selectedUsuario=null;
        this.currentMode='edit';
        this.buttonStates = {
            add: false,
            save: true,
            edit: false,
            delete: false,
            cancel: true
        };
    }

    enableDeleteMode():void{
        this.tableDisabled=false;
        this.selectedUsuario=null;
        this.currentMode='delete';
        this.buttonStates = {
            add: false,
            save: false,
            edit: false,
            delete: false,
            cancel: true
        };
    }

    onRowSelect(rowData:Usuario): void{
        if (this.currentMode === 'edit') {
            this.selectedUsuario = {...rowData};
            this.usuarioForm.patchValue(this.selectedUsuario);
            this.enableForm();
        } else if (this.currentMode === 'delete') {
            this.confirmDelete(rowData);
        }
    }

    cancelAction(): void {
        this.usuarioForm.reset();
        this.disableForm();
        this.disableTable();
        this.selectedUsuario = null;
        this.currentMode = null;
        this.buttonStates = {
            add: true,
            save: false,
            edit: true,
            delete: true,
            cancel: false
        };
        this.mS.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Acción cancelada'
        });
    }

    loadUsuarios():void{
        this.loading=true;
        this.uS.getUsuario().subscribe({
            next: (data)=>{
                this.usuarios=data;
            },
            error:(err)=>{
                this.mS.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los usuarios'
                });
            },
            complete: ()=>{
                this.loading=false;
            }
        })
    }

    createUsuario():void{
        if(this.usuarioForm.valid){
            this.uS.createUsuario(this.usuarioForm.value).subscribe({
                next: (data)=>{
                    this.mS.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario creado correctamente'
                    });
                    this.loadUsuarios();
                    this.usuarioForm.reset();
                    this.disableForm();
                    this.buttonStates = {
                        add: true,
                        save: false,
                        edit: true,
                        delete: true,
                        cancel: false
                    };

                },
                error: (err)=>{
                    this.mS.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo crear el usuario'
                    });
                }
            });
        } else{
            this.mS.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Complete todos los campos para registrar'
            });
        }
    }

    editUsuario(usuario:Usuario):void{
        this.selectedUsuario={...usuario};
        this.usuarioForm.patchValue(this.selectedUsuario);
    }

    updateUsuario():void{
        if(this.usuarioForm.valid && this.selectedUsuario){
            const updatedUsuario = {
                ...this.selectedUsuario,
                ...this.usuarioForm.value
            };
            this.uS.updateUsuario(this.selectedUsuario.id,updatedUsuario).subscribe({
                next: ()=>{
                    this.mS.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario actualizado correctamente'
                    });
                    this.loadUsuarios();
                    this.usuarioForm.reset();
                    this.selectedUsuario=null;
                    this.disableForm();
                    this.disableTable();
                    this.buttonStates = {
                        add: true,
                        save: false,
                        edit: true,
                        delete: true,
                        cancel: false
                    };
                },
                error: ()=>{
                    this.mS.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo actualizar el usuario'
                    });
                }
            });
        }
    }

    confirmDelete(usuario:Usuario):void{
        this.cS.confirm({
            message: `¿Está seguro de eliminar al usuario ${usuario.idUsuario}?`,
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept:()=>{
                this.deleteUsuario(usuario.id);
                this.tableDisabled=true;
                this.buttonStates = {
                    add: true,
                    save: false,
                    edit: true,
                    delete: true,
                    cancel: false
                };
            },
            reject:()=>{
                this.tableDisabled=true;
                this.buttonStates = {
                    add: true,
                    save: false,
                    edit: true,
                    delete: true,
                    cancel: false
                };
            }
        });
        this.selectedUsuario=null;
        this.usuarioForm.reset();
    }

    deleteUsuario(id:string):void{
        this.uS.deleteUsuario(id).subscribe({
            next:()=>{
                this.mS.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario eliminado correctamente'
                });
                this.loadUsuarios();
                this.buttonStates = {
                    add: true,
                    save: false,
                    edit: true,
                    delete: true,
                    cancel: false
                };
            },
            error:()=>{
                this.mS.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo eliminar el usuario'
                })
            }
        })
    }
    togglePassword():void{
        this.showPassword=!this.showPassword;
    }





}
