import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ICommentApiDataInfo, ICommentDataInfo, ILayoutInfo } from 'src/app/shared/models/comment-data';

@Component({
  selector: 'app-dot-chart',
  templateUrl: './dot-chart.component.html',
  styleUrls: ['./dot-chart.component.css']
})
export class DotChartComponent implements OnInit {
  @ViewChild('rootSvg') svgRoot !: ElementRef;
  json_file_path: string;
  layout: ILayoutInfo;
  law_data !: ICommentDataInfo;
  prepared_data !: ICommentApiDataInfo;

  constructor() {
    this.json_file_path = '../../../assets/data/0516_final.json';   // TODO 파일 경로 설정
    this.layout = {
      marginTop: 20, marginRight: 20, marginBottom: 30, marginLeft: 40,
      height: 500, width: 960
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    d3.json(this.json_file_path).then((d: any) => {
      d.datatype = +d.datatype;
      d.toWho = +d.toWho;
      d.cid = +d.cid;
      d.author = d.author;
      d.published_date = d.published_date;
      d.time_num = +d.time_num;
      d.text = d.text;
      d.score = +d.score;
      return d;
    }).then((data: ICommentApiDataInfo[]) => {
      console.log(data);

      this.prepare_data(data);
      this.render(data);
    })
  }

  second_preprocessing(data: ICommentApiDataInfo[]) {


  }

  prepare_data(data: ICommentApiDataInfo[]) {
    console.log(data);
  }

  render(data: ICommentApiDataInfo[]) {

  }

}
