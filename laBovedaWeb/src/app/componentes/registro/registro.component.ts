import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../Models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme: boolean = false;

  constructor(private auth: AuthService,
              private router: Router,
              private usu: UsuarioService) { 
    if (typeof localStorage !== 'undefined') {
      // Código que accede a localStorage
      // Por ejemplo:
      localStorage.setItem('token', 'miToken');
    } else {
    }
  }

  ngOnInit() { 
    if (typeof localStorage !== 'undefined') {}
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }

    Swal.fire({
      allowOutsideClick:false,
      text: 'Espere por favor...',
      icon: 'info'
    })
    Swal.showLoading();


    this.usu.crearUsuario(this.usuario)
      .subscribe(resp =>{
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email)
        }
      }, (err) => {
      })
    
      this.auth.nuevoUsuario(this.usuario)
      .subscribe(resp =>{
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email)
        }
        this.router.navigateByUrl('/usuario')
      }, (err) => {
        Swal.fire({
          title: 'Error al autenticar',
          icon: 'error',
          text: err.error.error.message
        })
      })
  }


}
