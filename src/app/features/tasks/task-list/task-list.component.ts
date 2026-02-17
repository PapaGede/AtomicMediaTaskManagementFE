import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskFilter } from '../../../core/models/task.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns = ['title', 'assignedTo', 'completed', 'dueDate', 'actions'];
  filter: TaskFilter = { page: 0, size: 10, sortBy: 'createdAt', sortDir: 'desc' };
  completionFilter: string = 'all';
  searchInput$ = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tasks$ = this.taskService.tasks$;
  loading$ = this.taskService.loading$;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();

    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.filter.search = search || undefined;
      this.filter.page = 0;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskService.loadTasks(this.filter);
  }

  onPageChange(event: PageEvent): void {
    this.filter.page = event.pageIndex;
    this.filter.size = event.pageSize;
    this.loadTasks();
  }

  onSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.filter.sortBy = sort.active as TaskFilter['sortBy'];
      this.filter.sortDir = sort.direction as 'asc' | 'desc';
    } else {
      this.filter.sortBy = undefined;
      this.filter.sortDir = undefined;
    }
    this.filter.page = 0;
    this.loadTasks();
  }

  onCompletionFilterChange(): void {
    if (this.completionFilter === 'all') {
      this.filter.completed = undefined;
    } else {
      this.filter.completed = this.completionFilter === 'completed';
    }
    this.filter.page = 0;
    this.loadTasks();
  }

  onSearchChange(value: string): void {
    this.searchInput$.next(value);
  }

  onDateFilterChange(type: 'from' | 'to', event: any): void {
    const value = event.value;
    if (type === 'from') {
      this.filter.dueDateFrom = value ? this.formatDateTime(value) : undefined;
    } else {
      this.filter.dueDateTo = value ? this.formatDateTime(value) : undefined;
    }
    this.filter.page = 0;
    this.loadTasks();
  }

  clearDateFilters(): void {
    this.filter.dueDateFrom = undefined;
    this.filter.dueDateTo = undefined;
    this.filter.page = 0;
    this.loadTasks();
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task).subscribe(() => this.loadTasks());
  }

  viewTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.deleteTask(task.id).subscribe(() => this.loadTasks());
      }
    });
  }

  private formatDateTime(date: Date): string {
    return date.toISOString();
  }
}
