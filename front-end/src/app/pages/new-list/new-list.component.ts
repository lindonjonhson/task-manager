import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.sass']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  }

  createNewList(title: string){
    this.taskService.createList(title).subscribe((response: any) =>{
      console.log(response);
      //Go back to lists/:id
    });
  }

}
