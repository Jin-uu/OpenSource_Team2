export interface IGeoCoordinateModel {
  address: string;
  lat: number;
  lon: number;
}

export interface ILayoutInfo {
	marginTop: number;
	marginRight: number;
	marginBottom: number;
	marginLeft: number;
	height: number;
	width: number;
}

export interface ICommentDataInfo {
  index : number;                         // 인덱스
  datatype : number;                      // 댓글 종류 0:원댓글 , 1:대댓글, 2:@언급댓글
	toWho: string;                          // 0:공백, 1,2: 대상 댓글 index
	author: string;                         // 댓글 작성자 이름
  publishedDate : string;                // 댓글 작성 시간
	timeNum: string;                       // 댓글 고유 id
	text: string;                           // 댓글 내용
  score: number;                          // 우호도 산출 결과 0 or 1
}

// {
//   "index": 786,
//   "datatype": "1",
//   "toWho": 785,
//   "author": "김덕배",
//   "publishedDate": "2022-05-22T10:05:17Z",
//   "timeNum": "20220522100517",
//   "text": "위로 좀 더 올라 오실게요~ 는 못 들어봤고 딱 뒤로 내려 갈 때 내려가요~ 이렇게 하던데 ㅎ.ㅎ",
//   "score": 0
// },

export interface IBindedData {
  time: string;
  total: number;
  friendly_stance: number;
  hostile_stance: number;
}

export interface ICommentApiDataInfo {
  datatype : number;        // 0:원댓글, 1:대댓글, 2:언급댓글
  toWho : number;           // 댓글 단 대상 인덱스
  cid : string;             // 댓글 고유 해시값
  author : string;          // 작성자 닉네임
  published_date : Date;  // 작성 시기 표준 표기
  time_num : number;        // 작성 시기 숫자 표기
  text : string;            // 댓글 내용
  score : number;           // 자연어 처리 점수 0 or 1
}

// "1": {
//   "datatype": "0",
//   "toWho": "",
//   "cid": "UCjhOFz6KNxDp1JCnHQfGMJQ",
//   "author": "단타",
//   "published_date": "2022-03-18T09:00:35Z",
//   "time_num": "20220318090035",
//   "text": "아니 콧구멍 시강!!"
// },

export interface IPercentageData{
  time:string;
  friendly_prctg: number;
  hostile_prctg: number;
}
