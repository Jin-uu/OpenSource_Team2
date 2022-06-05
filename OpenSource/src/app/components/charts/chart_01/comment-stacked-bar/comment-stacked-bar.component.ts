import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { IBindedData, ICommentDataInfo, ILayoutInfo } from 'src/app/shared/models/comment-data';

@Component({
  selector: 'app-comment-stacked-bar',
  templateUrl: './comment-stacked-bar.component.html',
  styleUrls: ['./comment-stacked-bar.component.css']
})
export class CommentStackedBarComponent implements OnInit {
	@ViewChild('rootSvg') svgRoot !: ElementRef;
  @Input() data !: string;
  layout : ILayoutInfo;
  preprocessed_data!:ICommentDataInfo[];
	binded_data : IBindedData[] = [];
	x_axis_tick_num: number;
	x_axis_tick_size!: number;
	timeStampMin !: number;
	timeStampMax !: number;
  xDomain : string[] = [];
  bound_frd : number;     // 긍정 댓글 경계
  bound_hst : number;     // 부정 댓글 경계
  color : string[];
  


  constructor() {
		this.layout = {
			marginTop: 20, marginRight: 20, marginBottom: 50, marginLeft: 40,
			height: 300, width: 960
		}
		this.x_axis_tick_num = 30;
    this.bound_frd = 0.6;
    this.bound_hst = 0.4;
    this.color=["#89BAF5", "#F04148"]
	}

  ngAfterViewInit(): void {
		d3.json(this.data).then((d: any) => {
      d.index = +d.index;
			d.datatype = +d.datatype;
			d.toWho = d.toWho;
			d.author = d.author;
			d.publishedDate = d.publishedDate;
			d.timeNum = d.timeNum;
			d.text = d.text;
      d.score = + d.score;
			return d;
		}).then((data: ICommentDataInfo[]) => {
      // if(data.length < 1000) {
      //   console.log("cut : "+this.data);
        
      //   return;
      // }
      this.preprocess(data);
			this.bind_data(this.preprocessed_data);
			this.render(this.binded_data);
		})
	}

  ngOnInit(): void {
  }

  preprocess(data: ICommentDataInfo[]){
    this.preprocessed_data = data.map(d =>({
      index : +d.index,
      datatype : +d.datatype,
      toWho : +d.toWho,
      author : d.author,
      publishedDate : d.publishedDate,
      timeNum : d.timeNum,
      text : d.text,
      score : +d.score
    }))
    // console.log("maped: ",this.preprocessed_data);
    // 정렬
    this.preprocessed_data = this.preprocessed_data.sort((a,b) => {return +a.timeNum - +b.timeNum})
    // 0,1,2 포함여부 결정
    this.preprocessed_data = this.preprocessed_data
      .filter(d => d.datatype == 0 || d.datatype == 1 || d.datatype == 2)
    // 1번 댓글에 대해 원 댓글이 부정이면 toggle
    this.preprocessed_data
      .forEach((d,i,arr) => {
        if(d.datatype == 1){
          // console.log(d);
          if(this.preprocessed_data.find(d2 => d2.index == d.toWho)?.score == 0){
            d.score = +!d.score;
            // console.log(d.index,d.datatype,"--> score:",d.score,"text:"+d.text);
          }
        }
      })

    // 2번 댓글에 대해 대상 댓글이 부정이면 toggle
    this.preprocessed_data
      .forEach(d =>{
        if(d.datatype == 2){
          if(data.find(d2 => d2.index == d.toWho)?.score == 0){
            d.score = +!d.score;
            // console.log(d.index,d.datatype,"--> score:",d.score,"text:"+d.text);
          }
        }
      })
  }

  bind_data(data: ICommentDataInfo[]){
		this.timeStampMin = d3.min(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;
		this.timeStampMax = d3.max(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;

		this.x_axis_tick_size = Math.round((this.timeStampMax - this.timeStampMin) / this.x_axis_tick_num);


		for (let i = 0; i < this.x_axis_tick_num; i++) {
			this.xDomain[i] = (this.timeStampMin + this.x_axis_tick_size*i).toString();
		}


    for(let times of this.xDomain){
      let temp_data:IBindedData={
        time:times,
        total:0,
        friendly_stance:0,
        hostile_stance:0
      };
      this.binded_data.push(temp_data)
    }

    let comments:ICommentDataInfo;
    for(comments of data){
      let idx=0;
      for(let i=0; i<this.x_axis_tick_num; i++){
        let left=Number(this.xDomain[i]);
        let middle = Date.parse(comments.publishedDate);
        if(i==this.x_axis_tick_num-1){
          idx=i;
          break;
        }
        let right=Number(this.xDomain[i+1]);

        if(left<=middle && middle<=right){
          idx=i;
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
    }
  }

  render(data: IBindedData[]){
		const svg = d3.select(this.svgRoot.nativeElement)
			.attr('width', this.layout.width)
			.attr('height', this.layout.height);

		const width = +svg.attr('width') - this.layout.marginLeft - this.layout.marginRight;
		const height = +svg.attr('height') - this.layout.marginTop - this.layout.marginBottom;

    const keys = Object.getOwnPropertyNames(data[0]);
    keys.splice(0, 2);
    console.log("keys:"+keys);
    // keys : friendly_stance,middle_stance,hostile_stance

		const x = d3.scaleBand<string>().rangeRound([0, width]).padding(0.1);
		const y = d3.scaleLinear<number>().rangeRound([height, 0]);
    const z = d3.scaleOrdinal<string>().domain(keys).range(this.color);

    const total_max = d3.max(data, (d:IBindedData) => d.total) as number;
    console.log(total_max);
		x.domain(data.map((d:IBindedData) => d.time));
		y.domain([0, total_max]);

    const stackedData = d3.stack<IBindedData>().keys(keys)(data);


		const graph = svg.append('g')
			.attr('transform', 'translate(' + this.layout.marginLeft + ',' + this.layout.marginTop + ")");

		graph.append('g')
			.attr('class', 'axis axis--x')
			.call(d3.axisBottom(x).tickFormat((d,i) => {
        var date = new Date(Number(d)*1);
        return ""+date.getFullYear()
        +"/"+(date.getMonth()+1)
        +"/"+date.getDate()
        // +" "+date.getHours()
        // +":"+date.getMinutes()
        // +":"+date.getSeconds()
      }))
			.attr('transform', 'translate(0,' + height + ")")
      .selectAll('text')
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr('transform', 'rotate(-45)');

		graph.append('g')
			.attr('class', 'axis axis--y')
			.call(d3.axisLeft(y));

    graph.append('g')
          .selectAll('g')
          .data(stackedData)
          .enter().append('g')
          .attr('class','bar')
          .attr('fill', d=>z(d.key))
          .selectAll('rect')
          .data(d=>d)
          .enter().append('rect')
          .attr('x', d => (x(d.data.time))!)
          .attr('y', (d:any) => y(d[1]))
          .attr('width', x.bandwidth())
          .attr('height', (d:any) => y(d[0]) - y(d[1]))
  }

}
