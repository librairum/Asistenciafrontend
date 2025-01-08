import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutorizacionService } from '../../service/autorizacion.service';
import { MessageService } from 'primeng/api';
import { Autenticacion } from '../../model/autentication';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Router, RouterModule } from '@angular/router';
import { GlobalserviceService } from '../../service/globalservice.service';

@Component({
  selector: 'app-autorizacion',
  standalone: true,
  imports: [ToastModule,CommonModule,ReactiveFormsModule,CardModule,ButtonModule,InputTextModule,CheckboxModule,RouterModule],
  templateUrl: './autorizacion.component.html',
  styleUrl: './autorizacion.component.scss',
  providers:[MessageService]
})
export class AutorizacionComponent implements OnInit {
    perfilglobal:string = '';

    loginForm:FormGroup;
    constructor(private fb:FormBuilder,private aS:AutorizacionService,private mS:MessageService, private link:Router, private globalService:GlobalserviceService){
        this.loginForm=fb.group({
            nombreusuario:['', Validators.required],
            claveusuario:['',Validators.required],
            codigoempresa:'00001',
        });
    }


    ngOnInit(): void {
        const valor=null
        this.globalService.setCodigoPerfil(valor)
    }

    onSubmit() {
        if (this.loginForm.valid) {
        const autenticacion: Autenticacion = this.loginForm.value;

        this.aS.autenticacion(autenticacion).subscribe({
            next: (response) => {
            if (response.isSuccess) {
                this.globalService.setCodigoPerfil(response.data[0].codigoPerfil)
                console.log(this.globalService.getCodigoPerfil())
                this.link.navigate(['/Menu']);

            } else {
                this.mS.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
                });
            }
            },
            error: (err) => {
            this.mS.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error en la autenticación',
            });
            console.error('Error en la solicitud:', err);
            },
        });
        } else {
        this.mS.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Complete todos los campos',
        });
        }
    }
}
