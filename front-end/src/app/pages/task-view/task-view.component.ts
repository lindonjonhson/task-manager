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
    // This method check if we have any listId in the parameters
    // So we can retrieve the tasks that belong to that listId
    this.route.params.subscribe(
      (params: Params) => {
        // First we send the LIST parameters
        // console.log("These are the parameters");
        // console.log(params);
        this.taskService.getTasks(params.id).subscribe((tasks: any[]) => {
            // Then we receive the TASKS of that list
            // console.log("These are the tasks");
             console.log(tasks);
            this.tasks = tasks;
          });
      });

    // This method retrieve all the lists avaliable
    this.taskService.getLists().subscribe(
      (lists: any[]) => {
        // console.log("These are the lists");
        // console.log(lists);
        this.lists = lists;
      });
  }

}
