import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCard } from '../task-card/task-card';
import { Task } from '../../task.model';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../../services/TaskService';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,TaskCard,FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList {
  @Input() title!: string;
  @Input() status!: Task['status'];
  @Input() tasks: Task[] = [];
  @Input() role!: 'manager' | 'employee';


@Output() statusChanged = new EventEmitter<Task>();

 onTaskStatusChanged(task: Task) {
    this.statusChanged.emit(task); // parent handles backend call and reload
  }

}

