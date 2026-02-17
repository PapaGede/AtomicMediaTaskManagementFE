import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, EMPTY } from 'rxjs';
import { Task, TaskFilter, TaskPage } from '../models/task.model';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  private tasksSubject = new BehaviorSubject<TaskPage>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  tasks$ = this.tasksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  loadTasks(filter: TaskFilter = {}): void {
    this.loadingSubject.next(true);
    let params = new HttpParams();

    if (filter.completed !== undefined) {
      params = params.set('completed', filter.completed.toString());
    }
    if (filter.dueDateFrom) {
      params = params.set('dueDateFrom', filter.dueDateFrom);
    }
    if (filter.dueDateTo) {
      params = params.set('dueDateTo', filter.dueDateTo);
    }
    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.sortBy) {
      params = params.set('sortBy', filter.sortBy);
    }
    if (filter.sortDir) {
      params = params.set('sortDir', filter.sortDir);
    }
    if (filter.page !== undefined) {
      // Backend is 1-indexed, frontend paginator is 0-indexed
      params = params.set('page', (filter.page + 1).toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    this.http.get<TaskPage>(this.apiUrl, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(err => {
        this.loadingSubject.next(false);
        return EMPTY;
      })
    ).subscribe(page => this.tasksSubject.next(page));
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleComplete(task: Task): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${task.id}/toggle`, {});
  }
}
