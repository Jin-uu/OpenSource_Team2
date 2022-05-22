import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { IBindedData, ICommentDataInfo, ILayoutInfo } from 'src/app/shared/models/comment-data';

@Component({
  selector: 'app-comment-stacked-bar',
  templateUrl: './comment-stacked-bar.component.html',
  styleUrls: ['./comment-stacked-bar.component.css']
})
export class CommentStackedBarComponent implements OnInit {
	@ViewChild('rootSvg') svgRoot !: ElementRef;
  layout : ILayoutInfo;
	binded_data !: IBindedData[];
	x_axis_tick_num: number;
	x_axis_tick_size!: number;
	timeStampMin !: number;
	timeStampMax !: number;
  xDomain : string[] = [];
  bound_frd : number;     // 긍정 댓글 경계
  bound_hst : number;     // 부정 댓글 경계
  color : string[];
  frizia_json = './assets/data/frizia.json';
  hanyeseul_20687_json = './assets/data/hanyeseul_20687.json';


  constructor() {
		this.layout = {
			marginTop: 20, marginRight: 20, marginBottom: 30, marginLeft: 40,
			height: 500, width: 960
		}
		this.x_axis_tick_num = 15;
    this.bound_frd = 0.1;
    this.bound_hst = -0.1;
    this.color=["#89BAF5", "#F3EBD3", "#F04148"]
	}

  ngAfterViewInit(): void {
		d3.json(this.frizia_json).then((d: any) => {
			d.datatype = +d.datatype;
			d.toWho = d.toWho;
			d.author = d.author;
			d.published_date = d.published_date;
			d.time_num = +d.time_num;
			d.text = d.text;
      d.score = + d.score;
			return d;
		}).then((data: ICommentDataInfo[]) => {
			console.log("data[1]: ",data[1]);
			this.prepare_data(data);
			this.render(this.binded_data);
		})
	}

  ngOnInit(): void {
  }

  prepare_data(data: ICommentDataInfo[]){
    console.log("data[1]: ",data[1]);
    console.log("data: ",data);
    console.log("data Obj: ",Object.values(data));
    const array_data = Object.values(data);


		this.timeStampMin = d3.min(array_data, (d: ICommentDataInfo) => d.time_num) as number;
		this.timeStampMax = d3.max(array_data, (d: ICommentDataInfo) => d.time_num) as number;
		this.x_axis_tick_size = (this.timeStampMax - this.timeStampMin) / this.x_axis_tick_num;
    console.log(this.timeStampMin);
    console.log(this.timeStampMax);
    console.log(this.x_axis_tick_size);


		for (let i = 0; i < this.x_axis_tick_num; i++) {
			this.xDomain[i] = (this.timeStampMin + this.x_axis_tick_size*i).toString();
		}
    for(let times of this.xDomain){
      let temp_data:IBindedData={time:times,total:0,friendly_stance:0,middle_stance:0,hostile_stance:0};
      this.binded_data.push(temp_data)
    }

    let comments:ICommentDataInfo
    for(comments of data){
      let idx=0;
      for(let i=0; i<this.x_axis_tick_num; i++){
        let left=Number(this.xDomain[i]);
        let middle = comments.time_num;
        if(i==this.x_axis_tick_num-1){
          idx=i;
          // console.log("True:"+i,left, middle, "NAN");
          break;
        }
        let right=Number(this.xDomain[i+1]);

        if(left<=middle && middle<=right){
          idx=i;
          // console.log("True:"+i,left, middle, right);
          break;
        }
      }
      if(comments.score > this.bound_frd){
        this.binded_data[idx].friendly_stance++;
        this.binded_data[idx].total++;
      }
      else if(comments.score < this.bound_hst){
        this.binded_data[idx].hostile_stance++;
        this.binded_data[idx].total++;
      }
      else{
        this.binded_data[idx].middle_stance++;
        this.binded_data[idx].total++;
      }
    }
    console.log("binded_data:",this.binded_data);
  }

  render(data: IBindedData[]){

  }

}
