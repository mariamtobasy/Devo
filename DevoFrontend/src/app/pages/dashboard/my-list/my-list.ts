import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyListService, MyListTask } from '../../../services/my-list.service';
import { RecentService } from '../../../services/RecentService';


@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.html',
  styleUrls: ['./my-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MyList {
  tasks: MyListTask[] = [];
  showAddModal = false;
  newTask: Partial<MyListTask> = {};

  constructor(private myListService: MyListService,private recentServic:RecentService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.myListService.getTasks().subscribe({
      next: (res) => this.tasks = res,
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  openAddTaskModal() {
    this.newTask = {};
    this.showAddModal = true;
  }

  closeAddTaskModal() {
    this.showAddModal = false;
  }

  addTask() {
  if (!this.newTask.title || !this.newTask.priority) return;

  const payload: Partial<MyListTask> = {
    title: this.newTask.title,
    description: this.newTask.description || '',
  //  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: this.newTask.priority!,
     isCompleted: false


  }


  this.myListService.addTask(payload).subscribe({
    next: (task) => {
      this.tasks.unshift(task);
        this.recentServic.add(`Created task: "${task.title}"`);
      this.closeAddTaskModal();
      this.newTask = {};          // reset form
     // this.showAddModal = false;  // close modal
    },
    error: (err) => console.error('Failed to add task', err)
  });
}


  toggleDone(task: MyListTask) {
    const wasCompleted = task. isCompleted;
    task. isCompleted = !task. isCompleted;
    this.myListService.updateTask(task).subscribe({
      next: () => {
         if (!wasCompleted && task. isCompleted) {
        this.recentServic.add(`Completed task: "${task.title}"`);
      }
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  deleteTask(task: any) {
  this.myListService.deleteTask(task.myListTaskId).subscribe({
    next: () =>{
      this.tasks = this.tasks.filter(t => t.myListTaskId !== task.myListTaskId),
       this.recentServic.add(`deleted task: "${task.title}"`);},
    error: err => console.error('Failed to delete task', err)
  });
}


/*  editTask(task: MyListTask) {
    console.log('Edit task:', task);
    // later: open modal and save changes using updateTask()
  }*/
}
