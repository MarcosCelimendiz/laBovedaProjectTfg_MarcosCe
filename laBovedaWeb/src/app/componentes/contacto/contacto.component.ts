import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ReservaModel } from '../../Models/reserva.model';
import Notiflix from 'notiflix';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
//Objeto de reservas
reserva: ReservaModel = new ReservaModel();

//Array donde se guardan todas las reservas
reservas: ReservaModel[] = [];

//Variables de fechas
fechaSeleccionada: string;
fechaAyer = new Date();
fechaAyerString: string;

horasApertura = 13; 
horasCierre = 23; 
intervaloHoras = 1; 

horasRestaurante: string[] = [];
numComensales: string[] = [];
horasDisponibles: number[] = [];

fechaInvalida: boolean = false;

//Comprobadores de los dias y fechas disponibles
disponible: boolean = true;
diaDisponible: boolean = true;

constructor(private httpclient:HttpClient,
            private reservasService: ReservasService,
            private route: ActivatedRoute,
            private datePipe: DatePipe,
            private router: Router,) {
   
  this.fechaAyer.setDate(this.fechaAyer.getDate() - 1);
  const dia = this.fechaAyer.getDate().toString().padStart(2, '0');
  const mes = (this.fechaAyer.getMonth() + 1).toString().padStart(2, '0');
  const anio = this.fechaAyer.getFullYear();
  this.fechaAyerString = `${anio}-${mes}-${dia}`;
  this.fechaSeleccionada = this.fechaAyerString;

}
ngOnInit(): void {
  const id: any = this.route.snapshot.paramMap.get('id');

  if (id !== 'nuevo') {
  this.reservasService.getReserva(id)
  .subscribe((resp) => {
    if (resp) {
      this.reserva = resp as ReservaModel; 
      this.reserva.id = id;
    }});
  }
}


  //enviar correo a la bóveda
  enviarcorreo(form: NgForm) {
    Notiflix.Loading.dots('Enviando...', {
      svgColor: 'rgba(244,204,123,255)'
    })
  
    let params = {
      gmail: this.reserva.gmail,
      nombre: this.reserva.nombre,
      apellido: this.reserva.apellido,
      tel: this.reserva.tel,
      contenido: this.reserva.peticion
    }
  
    this.httpclient.post('http://localhost:3000/envioContactoCliente', params).subscribe(resp => {
    })
  
    this.httpclient.post('http://localhost:3000/envioCorreoContacto', params).subscribe(resp => {
      Notiflix.Loading.remove()
      Notiflix.Notify.success('Correo enviado con exito')
      form.reset();
    })
  }
}
