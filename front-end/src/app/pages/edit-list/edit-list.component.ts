import { Task } from './../../models/task.model';
import { List } from './../../models/list.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.sass']
})
export class EditListComponent implements OnInit {

  private selectedListId: string;

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.selectedListId = params.id;
      });
  }

  updateList(title: string) {
    this.taskService.editList(this.selectedListId, title).subscribe((list: List) => {
      // console.log(list);
      // Go back to lists/:id
      this.router.navigate([`/lists`, this.selectedListId]);
    });
  }

}
