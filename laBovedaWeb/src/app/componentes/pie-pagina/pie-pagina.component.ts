import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrl: './pie-pagina.component.css'
})
export class PiePaginaComponent {
  
  constructor(private sanitizer: DomSanitizer) {}

  phoneNumber = '669195823'; // Reemplaza esto con el número de teléfono deseado

  // Método para generar el enlace de WhatsApp
  generateWhatsAppLink(phoneNumber: string): SafeUrl {
    const url = `https://wa.me/${phoneNumber}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  scrollTopCabecera(){
    window.scrollTo({ top: 0});
  }
}
