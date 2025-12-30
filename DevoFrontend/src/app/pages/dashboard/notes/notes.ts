import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authService';

interface Note {
  id?: number;
  title: string;
  content: string;
  date?: string;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.html',
  styleUrls: ['./notes.css'],
})
export class Notes implements OnInit {

  notes: Note[] = [];
  newTitle = '';
  newContent = '';
  editId: number | null = null;
  employeeId!: number;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user || !user.id) {
      console.error('User not logged in or missing id');
      return;
    }

    this.employeeId = user.id;
    this.loadNotes();
  }

  // 🔹 Load notes
  loadNotes(): void {
    this.authService.getNotes().subscribe({
      next: (res: any) => {
        // ✅ Handle ASP.NET $values response
        this.notes = Array.isArray(res)
          ? res
          : res?.$values ?? [];

        console.log('Loaded notes:', this.notes);
      },
      error: (err) => console.error('Error loading notes:', err)
    });
  }

  // 🔹 Add note
  addNote(): void {
    if (!this.newTitle.trim() || !this.newContent.trim()) return;

    const noteData = {
      employeeId: this.employeeId,
      title: this.newTitle,
      content: this.newContent
    };

    this.authService.addNote(noteData).subscribe({
      next: () => {
        this.resetForm();
        this.loadNotes();
      },
      error: (err) => console.error('Error adding note:', err)
    });
  }

  // 🔹 Start editing
  startEdit(note: Note): void {
    if (!note.id) return;

    this.editId = note.id;
    this.newTitle = note.title;
    this.newContent = note.content;
  }

  // 🔹 Update note
  updateNote(): void {
    if (this.editId === null) return;

    const noteData = {
      id: this.editId,
      employeeId: this.employeeId,
      title: this.newTitle,
      content: this.newContent
    };

    this.authService.updateNote(noteData).subscribe({
      next: () => {
        this.resetForm();
        this.loadNotes();
      },
      error: (err) => console.error('Error updating note:', err)
    });
  }

  // 🔹 Cancel edit
  cancelEdit(): void {
    this.resetForm();
  }

  // 🔹 Delete note
  deleteNote(id?: number): void {
    if (!id) return;

    if (!confirm('Delete this note?')) return;

    this.authService.deleteNote(id).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error deleting note:', err)
    });
  }

  // 🔹 Helper
  private resetForm(): void {
    this.editId = null;
    this.newTitle = '';
    this.newContent = '';
  }
}