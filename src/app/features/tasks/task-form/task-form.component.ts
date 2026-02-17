import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      dueDate: [null],
      assignedTo: [''],
      completed: [false]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.taskId = id;
      this.loading = true;
      this.taskService.getTask(this.taskId).subscribe({
        next: (task: Task) => {
          this.form.patchValue({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            assignedTo: task.assignedTo || '',
            completed: task.completed
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    const task: Partial<Task> = {
      title: formValue.title,
      description: formValue.description || undefined,
      dueDate: formValue.dueDate ? this.formatDateTime(formValue.dueDate) : undefined,
      assignedTo: formValue.assignedTo || undefined,
      completed: formValue.completed
    };

    const request$ = this.isEdit
      ? this.taskService.updateTask(this.taskId!, task)
      : this.taskService.createTask(task);

    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => this.loading = false
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  private formatDateTime(date: Date): string {
    return date.toISOString();
  }
}
