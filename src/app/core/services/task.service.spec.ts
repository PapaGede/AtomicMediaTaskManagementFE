import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from './task.service';
import { Task, TaskPage } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    dueDate: '2026-12-31T17:00:00'
  };

  const mockPage: TaskPage = {
    content: [mockTask],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks and update state', (done) => {
    service.loadTasks({});

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);

    service.tasks$.subscribe(page => {
      if (page.content.length > 0) {
        expect(page.content[0].title).toBe('Test Task');
        expect(page.totalElements).toBe(1);
        done();
      }
    });
  });

  it('should load tasks with filter params and 1-indexed page', () => {
    service.loadTasks({ completed: true, page: 0, size: 5, sortBy: 'title', sortDir: 'asc' });

    const req = httpMock.expectOne(r => {
      return r.url.includes('/api/tasks')
        && r.params.get('completed') === 'true'
        && r.params.get('page') === '1'
        && r.params.get('size') === '5'
        && r.params.get('sortBy') === 'title'
        && r.params.get('sortDir') === 'asc';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get a single task', (done) => {
    service.getTask(1).subscribe(task => {
      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create a task', (done) => {
    const newTask = { title: 'New Task', completed: false };

    service.createTask(newTask).subscribe(task => {
      expect(task.id).toBe(1);
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('New Task');
    req.flush(mockTask);
  });

  it('should update a task', (done) => {
    const updated = { title: 'Updated Task' };

    service.updateTask(1, updated).subscribe(task => {
      expect(task).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks/1'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockTask);
  });

  it('should delete a task', (done) => {
    service.deleteTask(1).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should toggle task completion via PATCH', (done) => {
    service.toggleComplete(mockTask).subscribe(task => {
      expect(task).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('/api/tasks/1/toggle'));
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...mockTask, completed: true });
  });
});
