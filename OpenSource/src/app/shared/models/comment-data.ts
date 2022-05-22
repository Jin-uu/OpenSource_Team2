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
  datatype : number;                      // 댓글 종류 0:원댓글 , 1:대댓글, 2:@언급댓글
	toWho: string;                          // 0:공백, 1,2: 대상 댓글 index
	author: string;                         // 댓글 작성자 이름
  published_date : string;                // 댓글 작성 시간
	time_num: number;                       // 댓글 고유 id
	text: string;                           // 댓글 내용
  score: number;                          // 우호도 산출 결과 0 or 1
}



// "0": {
//   "datatype": "0",
//   "toWho": "",
//   "author": "엠프리",
//   "published_date": "2022-05-16T01:34:28Z",
//   "time_num": "20220516013428",
//   "text": "솔직한 예슬씨 응원 합니다",
//   "score": 1
// },

/*
  {
		"cid": "Ugx7PTBjVuorsFye9XJ4AaABAg",
		"text": "요즘 유튜버 한명 키울때 소속사에서 집,차,명품가방 등등 막대한 자금 투자로 금수저 코스프레해서 마케팅 하는 곳 많음 . 청담 주식사기꾼 이희진도 뒤에서 자금지원으로 이희진이 마치 주식으로 엄청난 부자가 된 것 마냥 연출하기도 했었고 .. 근데 얘도 그런거 아닌가 모르겠다",
		"author": "째미",
		"time_parsed": 1644227077.540119,
		"datatype": "1",
		"toWho": "",
		"score": 0.6000000238418579
	}
*/
export interface IBindedData {
  time: string;
  total: number;
  friendly_stance: number;
  hostile_stance: number;
  middle_stance: number;
}

export interface ICommentApiDataInfo {
  datatype : number;        // 0:원댓글, 1:대댓글, 2:언급댓글
  toWho : number;           // 댓글 단 대상 인덱스
  cid : string;             // 댓글 고유 해시값
  author : string;          // 작성자 닉네임
  published_date : string;  // 작성 시기 표준 표기
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

