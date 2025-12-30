// tiny-game.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-tiny-game',
  template: `
   <div class="widget-card game-container">

      <h2>🎲 Guess the Number</h2>
      
      <div class="input-row">
        <input type="number" [(ngModel)]="guess" placeholder="1-10" min="1" max="10">
        <button (click)="checkGuess()">Check</button>
        <button (click)="resetGame()">Reset</button>
      </div>
      
      <p class="hint">{{ message }}</p>
    
    </div>
  `,
  styles: [`
    /* Main container */
    .game-container {
      width: 340px;
      height:220px;
      border-radius: 15px;
      border: 10px solid #a65046ff; /* thick dark border */
      background: linear-gradient(145deg, #bc6f65ff, #9f331eff); /* playful gradient */
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      
       place-items: center;
      font-family: 'Arial', sans-serif;
      transition: transform 0.2s, background 0.3s;
    }

    .game-container:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(0,0,0,0.25);
    }

    h2 {
      padding-top:40px;
      margin-bottom: 12px;
      font-size: 20px;
      color: #fff2e6; /* light accent color for title */
      text-shadow: 1px 1px #4d1f1b;
    }

    .input-row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-bottom: 12px;
    }

    input {
      width: 50px;
      padding: 6px;
      font-size: 14px;
      text-align: center;
      border: 2px solid #96534dff;
      border-radius: 8px;
      outline: none;
      transition: border 0.2s, background 0.2s;
      background: #ead8d2ff; /* soft cream inside */
    }

   

   

    button {
      padding: 5px 12px;
      font-size: 14px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: linear-gradient(145deg, #c17a6b, #7d342c); /* main color gradient */
      color: #fff2e6;
      font-weight: bold;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      transition: transform 0.1s, background 0.2s;
    }

    button:hover {
      transform: scale(1.1);
      background: linear-gradient(145deg, #7d342c, #4d1f1b);
    }

    .hint {
      font-size: 14px;
      margin: 5px 0;
      font-weight: bold;
      color: #fff2e6;
      text-shadow: 1px 1px #4d1f1b;
    }

    

   
  `]
})
export class TinyGame {
  guess!: number;
  secret = this.randomNumber();
  message = 'Make a guess!';
  score = 0;

  randomNumber() {
    return Math.floor(Math.random() * 10) + 1; // 1-10
  }

  checkGuess() {
    if (this.guess < 1 || this.guess > 10) {
      this.message = '⚠️ Enter a number 1–10!';
      this.flashInput();
      return;
    }

    if (this.guess === this.secret) {
      this.message = '🎉 Correct!';
      this.score++;
      this.flashCorrect();
    } else {
      this.message = this.guess > this.secret ? '⬆️ Too high!' : '⬇️ Too low!';
    }
  }

  resetGame() {
    this.secret = this.randomNumber();
    this.guess = 0;
    this.message = 'Make a guess!';
    this.score = 0;
  }

  flashCorrect() {
    const container = document.querySelector('.game-container') as HTMLElement;
    container.classList.add('correct');
    setTimeout(() => container.classList.remove('correct'), 300);
  }

  flashInput() {
    const input = document.querySelector('input') as HTMLElement;
    input.classList.add('out-of-range');
    setTimeout(() => input.classList.remove('out-of-range'), 300);
  }
}
