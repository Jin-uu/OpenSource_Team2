import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { IBindedData, ICommentDataInfo, ILayoutInfo, IPercentageData } from 'src/app/shared/models/comment-data';

@Component({
  selector: 'app-percentage-stacked-bar',
  templateUrl: './percentage-stacked-bar.component.html',
  styleUrls: ['./percentage-stacked-bar.component.css']
})
export class PercentageStackedBarComponent implements OnInit {
  @ViewChild('rootSvg') svgRoot !: ElementRef;
  layout: ILayoutInfo;
  preprocessed_data!: ICommentDataInfo[];
  binded_data: IBindedData[] = [];
  percentage_data: IPercentageData[] = [];
  x_axis_tick_num: number;
  x_axis_tick_size!: number;
  timeStampMin !: number;
  timeStampMax !: number;
  xDomain: string[] = [];
  bound_frd: number;     // 긍정 댓글 경계
  bound_hst: number;     // 부정 댓글 경계
  color: string[];

  frizia_json = './assets/data/frizia.json';
  frizia_1 = './assets/data/frizia_1.json';
  frizia_2 = './assets/data/frizia_2.json';
  frizia_3 = './assets/data/frizia_3.json';
  frizia_4 = './assets/data/frizia_4.json';
  frizia_5 = './assets/data/frizia_5.json';
  frizia_6 = './assets/data/frizia_6.json';
  frizia_7 = './assets/data/frizia_7.json';
  hanyeseul_20687_json = './assets/data/hanyeseul_20687.json';
  dentist_0522_json = './assets/data/dentist_0522.json'

  constructor() {
    this.layout = {
      marginTop: 20, marginRight: 20, marginBottom: 50, marginLeft: 40,
      height: 500, width: 960
    }
    this.x_axis_tick_num = 30;
    this.bound_frd = 0.6;
    this.bound_hst = 0.4;
    // this.color = ["#89BAF5", "#F3EBD3", "#F04148"]
    this.color=["#89BAF5", "#F04148"]
  }

  ngAfterViewInit(): void {
    d3.json(this.frizia_1).then((d: any) => {
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
      console.log("data: ", data);
      this.preprocess(data);
      console.log("preprocessed_data: ", this.preprocessed_data);
      this.bind_data(this.preprocessed_data);
      console.log("binded_data: ", this.binded_data);
      this.get_data_percentage(this.binded_data);
      console.log("percentage_data: ",this.percentage_data);
      this.render(this.percentage_data);
    })
  }
  ngOnInit(): void {
  }
  preprocess(data: ICommentDataInfo[]) {
    this.preprocessed_data = data;
  }

  bind_data(data: ICommentDataInfo[]) {
    this.timeStampMin = d3.min(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;
    console.log("timeStampMin: ", this.timeStampMin);

    this.timeStampMax = d3.max(data, (d: ICommentDataInfo) => Date.parse(d.publishedDate))!;
    console.log("timeStampMax: ", this.timeStampMax);

    this.x_axis_tick_size = Math.round((this.timeStampMax - this.timeStampMin) / this.x_axis_tick_num);
    console.log("x_axis_tick_size: ", this.x_axis_tick_size);


    for (let i = 0; i < this.x_axis_tick_num; i++) {
      this.xDomain[i] = (this.timeStampMin + this.x_axis_tick_size * i).toString();
    }
    console.log("xDomain:", this.xDomain);


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
          // console.log("True:"+i,left, middle, "NAN");
          break;
        }
        let right = Number(this.xDomain[i + 1]);

        if (left <= middle && middle <= right) {
          idx = i;
          // console.log("True:"+i,left, middle, right);
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

  render(data: IPercentageData[]) {
    const svg = d3.select(this.svgRoot.nativeElement)
      .attr('width', this.layout.width)
      .attr('height', this.layout.height);

    const width = +svg.attr('width') - this.layout.marginLeft - this.layout.marginRight;
    const height = +svg.attr('height') - this.layout.marginTop - this.layout.marginBottom;

    const keys = Object.getOwnPropertyNames(data[0]);
    keys.splice(0, 1);
    console.log("keys:" + keys);
    // keys : friendly_stance,middle_stance,hostile_stance

    const x = d3.scaleBand<string>().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear<number>().rangeRound([height, 0]);
    const z = d3.scaleOrdinal<string>().domain(keys).range(this.color);

    x.domain(data.map((d: IPercentageData) => d.time));
    y.domain([0, 1]);

    const stackedData = d3.stack<IPercentageData>().keys(keys)(data);


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

    graph.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('fill', d => z(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => (x(d.data.time))!)
      .attr('y', (d: any) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => y(d[0]) - y(d[1]))
  }
}
