import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../task.model';

export interface CreateTaskDto {
  title: string;
  description: string;
  tags: string[];
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedToEmail: string;
  dueDate?: string; // optional string
}

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTask {

  @Input() assignedBy!: string; // manager email
 // @Input() employeesList: string[] = []; // list of employee emails

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<CreateTaskDto>();


    newTask = {
    //  id: 0, // backend will set this
      title: '',
      description: '',
      tags: [] as string[],
      status: 'todo',
      assignedBy: '',
      assignedTo: '',
    };
  

   ngOnInit() {
    this.newTask.assignedBy = this.assignedBy;
  }

  // Add tag to the task
  addTag(tagInput: HTMLInputElement) {
    const value = tagInput.value.trim();
    if (value && !this.newTask.tags.includes(value)) {
      this.newTask.tags.push(value);
    }
    tagInput.value = '';
  }

    removeTag(tag: string) {
    this.newTask.tags = this.newTask.tags.filter(t => t !== tag);
  }

create() {
  console.log('AssignedTo before payload:', this.newTask.assignedTo);
  if (!this.newTask.title || !this.newTask.assignedTo) {
    alert('Title and Assignee are required.');
    return;
  }

  const payload: CreateTaskDto = {
    title: this.newTask.title,
    description: this.newTask.description,
    tags: this.newTask.tags.map(t => t.toString()), // <-- here
    status: this.newTask.status as 'todo' | 'in-progress' | 'review' | 'done',
    assignedToEmail: this.newTask.assignedTo.trim() // optional trim
  };

  this.created.emit(payload);
}


  closeModal() {
    this.close.emit();
  }
}
