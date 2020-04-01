import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  //LIST METHODS

  getLists() { 
    //Sent request to create a new list
    return this.webReqService.get('lists');
  }

  createList(title: string) { 
    //Sent request to create a new list
    return this.webReqService.post('lists', {title});
  }

  //TASK METHODS

  getTasks(listId: string) { 
    //Sent request to create a new list
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

}
