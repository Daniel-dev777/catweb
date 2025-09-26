import { Component } from '@angular/core';
import { AuthCardComponent } from '../../shared/components/auth-card/auth-card.component';
import { NavbarPublic } from '../../shared/components/navbar-public/navbar-public';


@Component({
  selector: 'app-home-publica',
  imports: [
    AuthCardComponent,
    NavbarPublic    
  ],
  templateUrl: './home-publica.html',
  styleUrl: './home-publica.css'
})
export class HomePublica {

}
