import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { IBindedData, ICommentDataInfo, ILayoutInfo, ILineChartData, IPercentageData } from 'src/app/shared/models/comment-data';


@Component({
  selector: 'app-percentage-line',
  templateUrl: './percentage-line.component.html',
  styleUrls: ['./percentage-line.component.css']
})
export class PercentageLineComponent implements OnInit {
  @ViewChild('rootSvg') svgRoot !: ElementRef;
  @Input() data !: string;
  layout: ILayoutInfo;
  original_data !: ICommentDataInfo[];
  preprocessed_data!: ICommentDataInfo[];
  binded_data: IBindedData[] = [];
  percentage_data: IPercentageData[] = [];
  linchart_data: ILineChartData[] = [];
  x_axis_tick_num: number;
  x_axis_tick_size!: number;
  timeStampMin !: number;
  timeStampMax !: number;
  xDomain: string[] = [];
  bound_frd: number;     // 긍정 댓글 경계
  bound_hst: number;     // 부정 댓글 경계


  constructor() {
    this.layout = {
      marginTop: 20, marginRight: 20, marginBottom: 70, marginLeft: 40,
      height: 300, width: 960
    }
    this.x_axis_tick_num = 30;
    this.bound_frd = 0.6;
    this.bound_hst = 0.4;
  }
  ngAfterViewInit(): void {
    // console.log("string data: ",this.data);
    d3.json(this.data).then((d: any) => {
      d.index = +d.index;
      d.datatype = +d.datatype;
      d.toWho = +d.toWho;
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
      // console.log(data);
      console.log(data.length);
      this.bind_data(this.preprocessed_data);
      this.get_data_percentage(this.binded_data);
      // console.log(this.binded_data);
      
      this.get_data_linechart(this.percentage_data);
      this.render(this.linchart_data);
    })
  }
  ngOnInit(): void {
  }

  preprocess(data: ICommentDataInfo[]) {
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

  bind_data(data: ICommentDataInfo[]) {
    this.timeStampMin = d3.min(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;

    this.timeStampMax = d3.max(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;

    this.x_axis_tick_size = Math.round((this.timeStampMax - this.timeStampMin) / this.x_axis_tick_num);


    for (let i = 0; i < this.x_axis_tick_num; i++) {
      this.xDomain[i] = (this.timeStampMin + this.x_axis_tick_size * i).toString();
    }


    for (let times of this.xDomain) {
      let temp_data: IBindedData = {
        time: times,
        total: 0,
        friendly_stance: 0,
        hostile_stance: 0
      };
      this.binded_data.push(temp_data)
    }

    let comments: ICommentDataInfo;
    for (comments of data) {
      let idx = 0;
      for (let i = 0; i < this.x_axis_tick_num; i++) {
        let left = Number(this.xDomain[i]);
        let middle = Date.parse(comments.publishedDate);
        if (i == this.x_axis_tick_num - 1) {
          idx = i;
          break;
        }
        let right = Number(this.xDomain[i + 1]);

        if (left <= middle && middle <= right) {
          idx = i;
          break;
        }
      }

      if (comments.score > this.bound_frd) {
        this.binded_data[idx].friendly_stance++;
        this.binded_data[idx].total++;
      }
      else if (comments.score < this.bound_hst) {
        this.binded_data[idx].hostile_stance++;
        this.binded_data[idx].total++;
      }
    }
  }
  get_data_percentage(data: IBindedData[]) {
    for (let datas of data) {
      let friendly;
      let hostile;
      if(datas.total == 0){
        friendly = 0;
        hostile = 0;
      }
      else{
        friendly = datas.friendly_stance / datas.total;
        hostile = datas.hostile_stance / datas.total;
      }
      let temp_data: IPercentageData = { time: datas.time, friendly_prctg: friendly, hostile_prctg: hostile };
      this.percentage_data.push(temp_data)
    }
  }

  get_data_linechart(data:IPercentageData[]){
    this.linchart_data = data.map(d => ({
      time : d.time,
      value : d.hostile_prctg
    }))
  }

  render(data : ILineChartData[]){
    const svg = d3.select(this.svgRoot.nativeElement)
    .attr('width', this.layout.width)
    .attr('height', this.layout.height);

    const width = +svg.attr('width') - this.layout.marginLeft - this.layout.marginRight;
    const height = +svg.attr('height') - this.layout.marginTop - this.layout.marginBottom;

    const keys = Object.getOwnPropertyNames(data[0]);
    keys.splice(0, 1);

    const x = d3.scaleBand().range([0, width]);
    const y = d3.scaleLinear<number>().range([height, 0]);

    x.domain(data.map((d: ILineChartData) => d.time));

    y.domain([0, 1]);

    const graph = svg.append('g')
      .attr('transform', 'translate(' + this.layout.marginLeft + ',' + this.layout.marginTop + ")");

    graph.append('g')
    .attr('class', 'axis axis--x')
    .call(d3.axisBottom(x).tickFormat((d, i) => {
      var date = new Date(Number(d) * 1);
      return "" + date.getFullYear()
        + "/" + (date.getMonth() + 1)
        + "/" + date.getDate()
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

    const line = d3.line<ILineChartData>()
      .defined(d => !isNaN(d.value))
      .x((d:any) => x(d.time)!)
      .y((d:any) => y(d.value))
      .curve(d3.curveMonotoneX);

    graph.append("path")
        .datum(data)
          .attr("fill", 'none')
          .attr("stroke-width",2)
          .attr("stroke","black")
        .attr("d", line);
  }
}
