import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  identifier: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.identifier, this.password).subscribe({
      next: () => {
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Login failed';
      }
  });
  }

}
