import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../Models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme: boolean = false;

  idUsuario: string = '';
  gmailUsuario: string = '';

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private usu: UsuarioService) { 
    if (typeof localStorage !== 'undefined') {
    }
  }

  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');
    
    if (id !== 'nuevo') {
      this.usu.getUsuario(id)
        .subscribe((resp) => {
          if (resp) {
            this.usuario = resp as UsuarioModel; 
            this.usuario.id = id;
          }
        });
    }
    
    if (typeof localStorage !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        this.usuario.email = storedEmail;
        this.recordarme = true;
      }else{
        console.log('no se ha guardado')
      }
    }
  }


  login(form:NgForm){

    if(form.invalid){return;}

    Swal.fire({
      allowOutsideClick:false,
      text: 'Espere por favor...',
      icon: 'info'
    })
    Swal.showLoading();

    //this.usu.getUsuario();

    this.auth.login(this.usuario)
      .subscribe( resp => {
        console.log(resp)
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email)
        }
        localStorage.setItem('gmail',this.usuario.email)
        const id: any = localStorage.getItem('gmail');
        const idWithoutDots = id.replace(/\./g, '');
      if (idWithoutDots !== 'nuevo') {
        this.usu.getUsuario(idWithoutDots).subscribe((resp) => {
          if (resp) {
            const primeraEntrada = Object.entries(resp)[0][0];
            this.usuario = resp as UsuarioModel; 
            this.usu.getUsuarioEspe(idWithoutDots,primeraEntrada).subscribe((resp) => {
              this.usuario = resp as UsuarioModel;
              console.log('hola')
              if(this.usuario.rol == 1){
                console.log('hola1')
                this.router.navigateByUrl('reservas')
              }else{
                Swal.fire({
                  title: 'Error al autenticar',
                  icon: 'error',
                  text: 'Usuario no autorizado'
                })
              }
              console.log('hola3')
            })
          } else {
            console.log("No se encontró el usuario con el ID proporcionado.");
          }
        });
      } else {
        console.log("ID de usuario no válido.");
      }
      }, (err) => {
        console.log(err.error.error.message)
        Swal.fire({
          title: 'Error al autenticar',
          icon: 'error',
          text: err.error.error.message
        })
      })

  }

}
