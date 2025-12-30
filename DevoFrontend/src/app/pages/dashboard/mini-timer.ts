// mini-timer.component.ts
import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
@Component({
  imports: [CommonModule],
  selector: 'app-mini-timer',
  template: `
   <div class="widget-card mini-timer-widget">

  <h4>Focus Timer ⏰</h4>
  <p>{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</p>
  <div class="widget-buttons">
    <button (click)="start()">Start</button>
    <button (click)="pause()">Pause</button>
    <button (click)="reset()">Reset</button>
  </div>
</div>

  `,
 styles: [`


.mini-timer-widget {
  width: 340px;
  height: 240px;
  background-color: #fdf6e3; /* light neutral background */
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.mini-timer-widget h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 500;
  color: #7c0d0dff;
}

.mini-timer-widget p {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.widget-buttons {
  display: flex;
  gap: 10px;
}

.widget-buttons button {
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  background-color: #a4584e; 
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.widget-buttons button:hover {
  background-color: #7d342c;
  transform: translateY(-2px);
}
`]

})
export class MiniTimer {
  totalSeconds = 1500; // 25 min
  secondsLeft = this.totalSeconds;
  interval: any;
  
  get minutes() { return Math.floor(this.secondsLeft / 60); }
  get seconds() { return this.secondsLeft % 60; }

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if (this.secondsLeft > 0) this.secondsLeft--;
        else this.pause();
      }, 1000);
    }
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.pause();
    this.secondsLeft = this.totalSeconds;
  }
}
