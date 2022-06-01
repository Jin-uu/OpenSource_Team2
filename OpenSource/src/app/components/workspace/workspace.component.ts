import { Component, OnInit } from '@angular/core';
import { ICommentApiDataInfo } from 'src/app/shared/models/comment-data';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  disabled_1 = false;
  disabled_2 = false;
  commentData : string[]=[];

  constructor() {
    this.commentData.push('./assets/data/frizia_3_6.json');
    // this.commentData.push('./assets/data/frizia_3_24.json');
    // this.commentData.push('./assets/data/frizia_5_6.json');
    // this.commentData.push('./assets/data/frizia_5_24.json');

  }

  ngOnInit(): void {
  }

}
