import { Task } from './../models/task.model';
import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  // LIST METHODS

  getLists() {
    // Sent request to create a new list
    return this.webReqService.get('lists');
  }

  getList(listId: string) {
    return this.webReqService.get(`lists/${listId}`);
  }

  createList(title: string) {
    // Sent request to create a new list
    return this.webReqService.post('lists', {title});
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  editList(id: string, title: string) {
    return this.webReqService.patch(`lists/${id}`, {title});
  }

  // TASK METHODS

  getTasks(listId: string) {
    // Sent request to create a new list
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  getTask(listId: string, taskId: string) {
    return this.webReqService.get(`lists/${listId}/tasks/${taskId}`);
  }

  createTask(title: string, listId: string) {
    // return this.webReqService.post();
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  updateTask(listId: string, taskId: string, title: string) {
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }

  deleteTask(listId: string, id: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${id}`);
  }

  // Set task as completed

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

}
