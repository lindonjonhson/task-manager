import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.sass']
})
export class TaskViewComponent implements OnInit {

  private whatevs = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  }

  createNewList() {
    //Inserting a dummy title 
    var title: string ="Título " + this.whatevs;
    this.taskService.createList(title).subscribe((response: any) =>{
      console.log(response);
    });

  }

}
