import re
from googleapiclient.discovery import build
import json
from transformers import ElectraForSequenceClassification, ElectraTokenizerFast

### 개인정보로 하단의 key git 상 삭제
api_key = ''
video_id = ''

api_obj = build('youtube', 'v3', developerKey=api_key)
response = api_obj.commentThreads().list(part="id, replies, snippet", videoId=video_id, maxResults=100).execute()

cur_index = 0
result = []

while response:
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']
        ### datatype "0" 원댓글
        result_format = {
            "index": cur_index,
            "datatype": "0",
            "toWho": "",
            "author": comment['authorDisplayName'],
            "publishedDate": comment['publishedAt'],
            "timeNum": re.sub(r'[^0-9]', '', comment['publishedAt']),
            "text": comment['textDisplay']
        }
        result.append(result_format)
        cur_index = cur_index + 1

        if 'replies' in item.keys():
            reply_num = 0
            for reply in item['replies']['comments']:
                reply['snippet']['textDisplay'] = reply['snippet']['textDisplay'].lstrip()

                ### datatype "2" 언급대댓글
                if reply['snippet']['textDisplay'][0] == '@':
                    reference = reply['snippet']['textDisplay'].split(' ', 1)
                    reference = reference[0].replace("@", "")

                    close_reference_index = 0
                    close_reference = []
                    reference_toWho = 0

                    ### 언급한 댓글 찾는 과정
                    for re_reply in item['replies']['comments']:
                        close_reference_index = close_reference_index + 1
                        if re_reply['snippet']['authorDisplayName'] == reference:
                            close_reference.append(close_reference_index)

                    if len(close_reference) == 0:
                        if reference == comment['authorDisplayName']:
                            reference_toWho = cur_index - reply_num
                        else:
                            reference_toWho = "대댓글 수 문제(언급자 존재 X)"
                    else:
                        close_reference_list = []
                        for i in range(0, len(close_reference)):
                            if reply_num < close_reference[i]:
                                close_reference_list.append((reply_num - close_reference[i]))
                        if len(close_reference_list) == 0:
                            reference_toWho = "대댓글 수 문제(언급 이후 동일인물 댓글 존재)"
                        else:
                            close_index = close_reference_list.index(min(close_reference_list))
                            reference_toWho = cur_index + close_reference[close_index]

                    result_format = {
                        "index": cur_index,
                        "datatype": "2",
                        "toWho": reference_toWho,
                        "author": reply['snippet']['authorDisplayName'],
                        "publishedDate": reply['snippet']['publishedAt'],
                        "timeNum": re.sub(r'[^0-9]', '', reply['snippet']['publishedAt']),
                        "text": reply['snippet']['textDisplay']
                    }
                    result.append(result_format)
                    cur_index = cur_index + 1
                    reply_num = reply_num + 1

                ### datatype "1" 대댓글
                else:
                    result_format = {
                        "index": cur_index,
                        "datatype": "1",
                        "toWho": cur_index - reply_num - 1,
                        "author": reply['snippet']['authorDisplayName'],
                        "publishedDate": reply['snippet']['publishedAt'],
                        "timeNum": re.sub(r'[^0-9]', '', reply['snippet']['publishedAt']),
                        "text": reply['snippet']['textDisplay']
                    }
                    result.append(result_format)
                    cur_index = cur_index + 1
                    reply_num = reply_num + 1

    if 'nextPageToken' in response:
        response = api_obj.commentThreads().list(part='snippet,replies', videoId=video_id,
                                                 pageToken=response['nextPageToken'], maxResults=100).execute()
    else:
        break


### 광고도배(중복), html 태그, 5글자 미만 댓글 삭제
del_set = set()
for i in range(0, len(result)):
    result[i]['text'] = result[i]['text'].replace('<br>', ' ').replace('\r', ' ') # <br>, \r 제거
    result[i]['text'] = re.sub('<a.*a>', '', result[i]['text']) # <a href= ~~> 제거
    curr_text = result[i]['text']
    curr_author = result[i]['author']
    for j in range(i+1, len(result)):
        target_text = result[j]['text']
        target_author = result[j]['author']
        if curr_text == target_text and curr_author == target_author:
            del_set.add(i)
            del_set.add(j)
        # text 5 미만 삭제
        elif len(curr_text) < 5:
            del_set.add(i)

for i in del_set:
    for j in range(0, len(result)-1):
        if result[j]['index'] == i:
            result.pop(j)


### 시간순 정렬
result = sorted(result, key=lambda x: x['timeNum'], reverse=False)


######################## 감성분석 ##########################

args = {
    'train_data_path': './ratings_train.txt',
    'val_data_path': './ratings_test.txt',
    'save_path': './model',
    'max_epochs': 1,
    'model_path': 'beomi/KcELECTRA-base',
    'batch_size': 32,
    'learning_rate': 5e-5,
    'warmup_ratio': 0.0,
    'max_seq_len': 128
}

model = ElectraForSequenceClassification.from_pretrained(args['save_path'])
tokenizer = ElectraTokenizerFast.from_pretrained(args['model_path'])

### 한 줄씩 감성 분석
for i in result:
    try:
        input_vector = tokenizer.encode(i['text'], return_tensors='pt')
        pred = model(input_ids=input_vector, labels=None).logits.argmax(dim=-1).tolist()
    except:
        continue
    i['score'] = pred[0]

with open('frizia.json', 'w', encoding='utf-8') as make_file:
    json.dump(result, make_file, ensure_ascii=False, indent='\t')
