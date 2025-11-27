import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
 // template: '<h1>Hello Angular!</h1>',
  templateUrl: './app.html',
 // styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('employee-tracking-app');
}
