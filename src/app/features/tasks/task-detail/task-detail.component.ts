import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  loading = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTask(id).subscribe({
        next: (task) => {
          this.task = task;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  deleteTask(): void {
    if (!this.task) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${this.task.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.task) {
        this.taskService.deleteTask(this.task.id).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
