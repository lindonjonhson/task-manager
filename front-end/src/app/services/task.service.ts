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

  createList(title: string) {
    // Sent request to create a new list
    return this.webReqService.post('lists', {title});
  }

  // TASK METHODS

  getTasks(listId: string) {
    // Sent request to create a new list
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    // return this.webReqService.post();
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  // Set task as completed

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

}
