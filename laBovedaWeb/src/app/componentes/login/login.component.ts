import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../Models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { UsuarioService } from '../../services/usuario.service';
import Notiflix from 'notiflix';


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
              private usu: UsuarioService,
              private authService: AuthService) { 
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


    if(localStorage.getItem('recuperarContraseña') == 'true'){
      localStorage.setItem('gmail',this.usuario.email)
      if (typeof localStorage !== 'undefined') {
        const id: any = localStorage.getItem('gmail');
        const emailWithoutDots = id.replace(/\./g, '');
      
        if (emailWithoutDots !== 'nuevo') {
          this.usu.getUsuario(emailWithoutDots).subscribe((resp) => {
            if (resp) {
              const primeraEntrada = Object.entries(resp)[0][0];
              this.idUsuario = primeraEntrada;
              this.gmailUsuario = emailWithoutDots;
              this.usu.getUsuarioEspe(emailWithoutDots,primeraEntrada).subscribe((resp) => {
              })
            } else {
            }
          });
        } 
      }
  
      this.actualizarDatos()
    }

    this.auth.login(this.usuario)
      .subscribe( resp => {
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

  actualizarDatos(){
    return this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
    })
  }

  email: string = '';

  recuperarContrasena() {
    if (this.email.trim() !== '') {
      this.authService.recuperarContraseña(this.email).subscribe(
        () => {
          this.showPasswordRecovery = false;
          localStorage.setItem('recuperarContraseña','true')
          Notiflix.Notify.success('Petición solicitado')
        },
        (error) => {
          this.showPasswordRecovery = false;
          Notiflix.Notify.failure('Error al enviar el correo')
        }
      );
    } else {
      this.showPasswordRecovery = false; 
      Notiflix.Notify.failure('Ingrese un correo válido')
    }
  }

  showPasswordRecovery: boolean = false;

  seePass(){
    this.showPasswordRecovery = true;
  }

}
