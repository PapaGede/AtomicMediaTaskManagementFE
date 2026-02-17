import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../core/services/task.service';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: Partial<TaskService>;

  beforeEach(async () => {
    mockTaskService = {
      createTask: jest.fn().mockReturnValue(of({ id: 1, title: 'New', completed: false })),
      updateTask: jest.fn().mockReturnValue(of({ id: 1, title: 'Updated', completed: false })),
      getTask: jest.fn().mockReturnValue(of({ id: 1, title: 'Existing', description: 'Desc', completed: false }))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule
      ],
      declarations: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should have title required validation', () => {
    const titleControl = component.form.get('title');
    expect(titleControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Test');
    expect(titleControl?.hasError('required')).toBe(false);
  });

  it('should enforce maxLength on title', () => {
    const titleControl = component.form.get('title');
    titleControl?.setValue('A'.repeat(101));
    expect(titleControl?.hasError('maxlength')).toBe(true);

    titleControl?.setValue('A'.repeat(100));
    expect(titleControl?.hasError('maxlength')).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(mockTaskService.createTask).not.toHaveBeenCalled();
  });

  it('should call createTask on valid submit in create mode', () => {
    component.form.patchValue({ title: 'New Task' });
    component.onSubmit();
    expect(mockTaskService.createTask).toHaveBeenCalled();
  });
});

describe('TaskFormComponent (Edit mode)', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: Partial<TaskService>;

  beforeEach(async () => {
    mockTaskService = {
      createTask: jest.fn(),
      updateTask: jest.fn().mockReturnValue(of({ id: 1, title: 'Updated', completed: false })),
      getTask: jest.fn().mockReturnValue(of({
        id: 1,
        title: 'Existing Task',
        description: 'Description',
        completed: false,
        dueDate: '2026-06-15T17:00:00'
      }))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule
      ],
      declarations: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in edit mode', () => {
    expect(component.isEdit).toBe(true);
    expect(component.taskId).toBe(1);
  });

  it('should populate form with existing task data', () => {
    expect(component.form.get('title')?.value).toBe('Existing Task');
    expect(component.form.get('description')?.value).toBe('Description');
  });

  it('should call updateTask on valid submit', () => {
    component.form.patchValue({ title: 'Updated Task' });
    component.onSubmit();
    expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Updated Task' }));
  });
});
