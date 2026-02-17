import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../core/services/task.service';
import { TaskPage } from '../../../core/models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: Partial<TaskService>;

  const mockPage: TaskPage = {
    content: [
      { id: 1, title: 'Task 1', completed: false, dueDate: '2026-12-31T17:00:00', assignedTo: 'Alice' },
      { id: 2, title: 'Task 2', completed: true, assignedTo: 'Bob' }
    ],
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0
  };

  beforeEach(async () => {
    mockTaskService = {
      tasks$: new BehaviorSubject(mockPage),
      loading$: new BehaviorSubject(false),
      loadTasks: jest.fn(),
      toggleComplete: jest.fn().mockReturnValue(of({})),
      deleteTask: jest.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatDialogModule,
        MatProgressBarModule,
        MatTooltipModule
      ],
      declarations: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(mockTaskService.loadTasks).toHaveBeenCalled();
  });

  it('should call toggleComplete when toggling', () => {
    const task = mockPage.content[0];
    component.toggleComplete(task);
    expect(mockTaskService.toggleComplete).toHaveBeenCalledWith(task);
  });

  it('should update filter on completion filter change', () => {
    component.completionFilter = 'completed';
    component.onCompletionFilterChange();
    expect(component.filter.completed).toBe(true);
    expect(mockTaskService.loadTasks).toHaveBeenCalled();
  });

  it('should set completed to undefined for "all" filter', () => {
    component.completionFilter = 'all';
    component.onCompletionFilterChange();
    expect(component.filter.completed).toBeUndefined();
  });

  it('should update page on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 25, length: 50 });
    expect(component.filter.page).toBe(1);
    expect(component.filter.size).toBe(25);
    expect(mockTaskService.loadTasks).toHaveBeenCalled();
  });

  it('should update sort on sort change', () => {
    component.onSortChange({ active: 'title', direction: 'desc' });
    expect(component.filter.sortBy).toBe('title');
    expect(component.filter.sortDir).toBe('desc');
  });
});
