import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.sass']
})
export class TaskViewComponent implements OnInit {

  lists: any;
  tasks: any;

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log("These are the parameters");
        console.log(params);
        this.taskService.getTasks(params.id).subscribe((tasks: any[]) => {
            console.log("These are the tasks");
            console.log(tasks);
            this.tasks = tasks;
          }
        )
      }
    )
    this.taskService.getLists().subscribe(
      (lists: any[]) => {
        console.log("These are the lists");
        console.log(lists);
        this.lists = lists;
      }
    )
  }

  /*
  createNewList() {
    //Inserting a dummy title 
    
    var title: string ="Título " + this.whatevs;
    this.taskService.createList(title).subscribe((response: any) =>{
      console.log(response);
    });
  }
  */

}
