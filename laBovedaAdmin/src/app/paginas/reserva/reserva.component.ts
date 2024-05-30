import { Component, OnInit } from '@angular/core';
import { ReservaModel } from '../../Models/reserva.model';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit{
  
  reserva: ReservaModel = new ReservaModel();

  horasApertura = 13; 
  horasCierre = 23; 
  intervaloHoras = 1; 

  horasRestaurante: number[] = [];
  horasDisponibles: number[] = [];
  numComensales: number[] = [];

  constructor(private reservasService: ReservasService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    
    if (id !== 'nuevo') {
      this.reservasService.getReserva(id)
        .subscribe((resp) => {
          if (resp) {
            this.reserva = resp as ReservaModel; 
            this.reserva.id = id;
          }
        });
    }
  }
  
  disponible: boolean = true;
  diaDisponible: boolean = true;

  private generarNumComensales(max: number){
    this.diaDisponible = true;
    if(this.maxComensalesHora >= 20){
      this.disponible = false;
      this.numComensales = [];
      return;
    }
    this.numComensales = [];
    for(let i = 1; i<=20;i++){
      this.disponible = true;
      if(i+max <= 20){
        this.numComensales.push(i);
      }
    }
    if(this.maxComensales >= 20){
      this.maxComensales = 0;
      this.diaDisponible = false;
      this.disponible = false;
    }
  }

  private generarHorasRestaurante(max: number) {
    if(!this.diaDisponible){
      this.horasDisponibles = [];
      this.horasRestaurante = []
      return;
    }
    this.horasRestaurante = []
    for (let i = this.horasApertura; i <= this.horasCierre; i += this.intervaloHoras) {
      if(this.detectarDia() == 'fin de semana'){
        if(i<=15 ||i>=21){
          this.horasRestaurante.push(i);
        }
      }else{
        if(i<=15){
          this.horasRestaurante.push(i);
        }
      }
    }
    this.maxComensalesHora = 0;
  }

  guardar(form:NgForm){
    if(form.invalid){
      return;
    }

    if (this.reserva.diaReserva && this.reserva.horaResrva != 'Hora' && parseInt(this.reserva.comensales) >0) {
      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      })
      Swal.showLoading();
  
      let peticion: Observable<any>;
  
      if(this.reserva.id){
        peticion = this.reservasService.actualizarReserva(this.reserva);
        peticion.subscribe((resp) =>{
          Swal.fire({
            title: this.reserva.nombre,
            text: 'Se actualizó correctamente',
            icon: 'success'
          })
        })
      }else{
        peticion = this.reservasService.crearReserva(this.reserva);
        peticion.subscribe((resp) =>{
          Swal.fire({
            title: this.reserva.nombre,
            text: 'Se creó correctamente',
            icon: 'success'
          })
          this.router.navigateByUrl('/reservas')
        })
      }
    }
  }

  seleccionarReservas: string = 'Todas';
  maxComensales: number = 0;
  maxComensalesHora: number = 0;

  maximoComensales(e: Event){
    this.detectarDia()
    this.maxComensales = 0;
    this.maxComensalesHora = 0;
    this.reservasService.getReservas()
      .subscribe(resp => {
        const horasSet = new Set<number>();
        resp.forEach(reserva => {
          if(reserva.diaReserva.toString() === this.reserva.diaReserva.toString()){
            this.maxComensales += parseInt(reserva.comensales.toString());
            if(reserva.horaResrva.toString() === this.reserva.horaResrva.toString()){
              this.maxComensalesHora += parseInt(reserva.comensales.toString());
              if(this.maxComensalesHora > 20){
                horasSet.add(parseInt(reserva.horaResrva));
              }
            }
          }
        });
        this.horasDisponibles = Array.from(horasSet);
        this.generarNumComensales(this.maxComensales);
        this.generarHorasRestaurante(this.maxComensalesHora);
      });
  }

  fechaSeleccionada: string = '';

  detectarDia(): string {
    const fecha = new Date(this.reserva.diaReserva);
    const diaSemana = fecha.getDay();
    if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
      return 'fin de semana';
    } else {
      return 'día de semana';
    }
  }
}
