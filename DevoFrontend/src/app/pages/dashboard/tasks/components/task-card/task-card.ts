// src/app/pages/dashboard/tasks/components/task-card/task-card.ts
import { Component, Input,Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../task.model';
import { FormsModule } from '@angular/forms';
import { NgControl } from '@angular/forms';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCard {
  @Input() task!: Task;
  @Input() role!: 'manager' | 'employee';

  @Output() statusChanged = new EventEmitter<Task>();

updateStatus() {
  this.statusChanged.emit(this.task); // parent (TaskList or Tasks) will call backend
}

}
