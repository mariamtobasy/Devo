// motivational-quote.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-motivational-quote',
  template: `
     <div class="widget-card motivational-quote"
     [style.background-image]="'url(/assets/bg2.jpg)'"
     [style.width.px]="350"
     [style.height.px]="200"
     [style.background-size]="'contain'">
      <h4>Quote of the Day</h4>
      <p>"{{ quote }}"</p>
      <button (click)="newQuote()">New Quote</button>
    </div>
  `,
  styles: [` 
     .motivational-quote {
      width: 340px;
      height: 220px;
      background-image: url('/assets/bg2.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 20px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h4 {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 700;
      color: #542621ff; /* deep red-brown, visible on bg */
      text-shadow: 0 1px 2px rgba(255,255,255,0.6);
    }

    p {
      font-size: 20px;
      font-style: italic;
      font-weight:630;
      margin: 0 0 15px 0;
      line-height: 1.4;
      color: #0b0201ff; /* readable on red/white */
      text-shadow: 0 3px 4px rgba(255,255,255,0.7);
    }

    button {
      padding: 8px 16px;
      border-radius: 12px;
      border: none;
      background-color: rgba(125, 52, 44, 0.9);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    button:hover {
      background-color: #7d342c;
      transform: translateY(-2px);
    }
  `]
})
export class MotivationalQuote{
  quotes = [
    "Believe you can and you're halfway there.",
    "Dream big and dare to fail.",
    "Do something today that your future self will thank you for.",
    "Stay positive, work hard, make it happen.",
    "Every day is a second chance."
  ];
  quote = this.randomQuote();

  randomQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  newQuote() {
    this.quote = this.randomQuote();
  }
}
