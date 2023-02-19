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
    // this.commentData.push('./assets/data/frizia_3_6.json');
    this.commentData.push('./assets/data/1.json');
    this.commentData.push('./assets/data/2.json');
    this.commentData.push('./assets/data/3.json');
    this.commentData.push('./assets/data/4.json');
    this.commentData.push('./assets/data/5.json');
    this.commentData.push('./assets/data/6.json');
    // this.commentData.push('./assets/data/7.json');
    this.commentData.push('./assets/data/8.json');
    this.commentData.push('./assets/data/9.json');
    this.commentData.push('./assets/data/10.json');
    this.commentData.push('./assets/data/11.json');
    this.commentData.push('./assets/data/11_new.json');
    this.commentData.push('./assets/data/12.json');
    this.commentData.push('./assets/data/13.json');
    this.commentData.push('./assets/data/14.json');
    this.commentData.push('./assets/data/15.json');
    this.commentData.push('./assets/data/16.json');
    this.commentData.push('./assets/data/17.json');
    this.commentData.push('./assets/data/18.json');
    this.commentData.push('./assets/data/19.json');
    this.commentData.push('./assets/data/20.json');
    this.commentData.push('./assets/data/21.json');
    this.commentData.push('./assets/data/22.json');
    this.commentData.push('./assets/data/23.json');
    this.commentData.push('./assets/data/24.json');
    this.commentData.push('./assets/data/25.json');
    this.commentData.push('./assets/data/26.json');
    // this.commentData.push('./assets/data/27.json');
    this.commentData.push('./assets/data/28.json');
    this.commentData.push('./assets/data/29.json');
    this.commentData.push('./assets/data/30.json');
    this.commentData.push('./assets/data/31.json');
    this.commentData.push('./assets/data/32.json');
    this.commentData.push('./assets/data/33.json');
    this.commentData.push('./assets/data/34.json');
    this.commentData.push('./assets/data/35.json');
    this.commentData.push('./assets/data/36.json');
    this.commentData.push('./assets/data/37.json');
    this.commentData.push('./assets/data/38.json');
    this.commentData.push('./assets/data/39.json');
    this.commentData.push('./assets/data/40.json');
    this.commentData.push('./assets/data/41.json');
    this.commentData.push('./assets/data/42.json');
    this.commentData.push('./assets/data/43.json');
    this.commentData.push('./assets/data/44.json');
    this.commentData.push('./assets/data/45.json');
    this.commentData.push('./assets/data/46.json');
    this.commentData.push('./assets/data/47.json');
    this.commentData.push('./assets/data/48.json');
    this.commentData.push('./assets/data/49.json');
    this.commentData.push('./assets/data/50.json');
    this.commentData.push('./assets/data/51.json');
    this.commentData.push('./assets/data/52.json');
    this.commentData.push('./assets/data/53.json');
    this.commentData.push('./assets/data/54.json');
    this.commentData.push('./assets/data/55.json');
    this.commentData.push('./assets/data/56.json');
    this.commentData.push('./assets/data/57.json');
    this.commentData.push('./assets/data/58.json');
    this.commentData.push('./assets/data/59.json');
    this.commentData.push('./assets/data/60.json');
    this.commentData.push('./assets/data/61.json');
    this.commentData.push('./assets/data/62.json');
    this.commentData.push('./assets/data/63.json');
    this.commentData.push('./assets/data/64.json');
    this.commentData.push('./assets/data/65.json');
    this.commentData.push('./assets/data/66.json');
    this.commentData.push('./assets/data/67.json');
    this.commentData.push('./assets/data/68.json');
    this.commentData.push('./assets/data/69.json');
    this.commentData.push('./assets/data/70.json');
    this.commentData.push('./assets/data/71.json');
    this.commentData.push('./assets/data/72.json');
    this.commentData.push('./assets/data/73.json');
    this.commentData.push('./assets/data/74.json');
    this.commentData.push('./assets/data/75.json');
    this.commentData.push('./assets/data/76.json');
    this.commentData.push('./assets/data/77.json');
    this.commentData.push('./assets/data/78.json');
    this.commentData.push('./assets/data/79.json');
    this.commentData.push('./assets/data/80.json');
    this.commentData.push('./assets/data/81.json');
    this.commentData.push('./assets/data/82.json');
    this.commentData.push('./assets/data/83.json');
    this.commentData.push('./assets/data/84.json');
    this.commentData.push('./assets/data/85.json');
    this.commentData.push('./assets/data/86.json');
    this.commentData.push('./assets/data/87.json');
    this.commentData.push('./assets/data/88.json');
    this.commentData.push('./assets/data/89.json');
    this.commentData.push('./assets/data/90.json');
    this.commentData.push('./assets/data/91.json');
    this.commentData.push('./assets/data/92.json');
    this.commentData.push('./assets/data/93.json');
    this.commentData.push('./assets/data/94.json');
    this.commentData.push('./assets/data/95.json');
    this.commentData.push('./assets/data/96.json');
    this.commentData.push('./assets/data/97.json');
    this.commentData.push('./assets/data/98.json');
    this.commentData.push('./assets/data/99.json');
    this.commentData.push('./assets/data/100.json');
    this.commentData.push('./assets/data/101.json');
    this.commentData.push('./assets/data/102.json');


  }

  ngOnInit(): void {
  }

}
