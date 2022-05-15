import re
import json
from googleapiclient.discovery import build

api_key = 'AIzaSyC4z-yJBlW3uNziSyQxZ7hydDm6GhxMD7U'
video_id = 'fU6lxdxTdU4'

api_obj = build('youtube', 'v3', developerKey=api_key)
response = api_obj.commentThreads().list(part="id, replies, snippet", videoId=video_id, maxResults=100).execute()

i = 0
result = {}

while response:
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']
        ### datatype "0" 원댓글
        result_format = {
            "datatype": "0",
            "toWho": "",
            "cid": comment['authorChannelId']['value'],
            "author": comment['authorDisplayName'],
            "published_date": comment['publishedAt'],
            #"updated_date": comment['updatedAt'],
            "time_num": re.sub(r'[^0-9]', '', comment['publishedAt']),
            "text": comment['textDisplay']
        }
        result[i] = result_format
        i = i + 1

        if 'replies' in item.keys():
            for reply in item['replies']['comments']:
                reply['snippet']['textDisplay'] = reply['snippet']['textDisplay'].lstrip()
                ### datatype "2" 언급대댓글
                if reply['snippet']['textDisplay'][0] == '@':
                    reference = reply['snippet']['textDisplay'].split(' ', 1)
                    reference = reference[0].replace("@", "")
                    toWho = reference
                    result_format = {
                        "datatype": "2",
                        "toWho": reference,
                        "cid": reply['snippet']['authorChannelId']['value'],
                        "author": reply['snippet']['authorDisplayName'],
                        "published_date": reply['snippet']['publishedAt'],
                        #"updated_date": reply['snippet']['updatedAt'],
                        "time_num": re.sub(r'[^0-9]', '', reply['snippet']['publishedAt']),
                        "text": reply['snippet']['textDisplay']
                    }
                    result[i] = result_format
                    i = i + 1
                ### datatype "1" 대댓글
                else:
                    result_format = {
                        "datatype": "1",
                        "toWho": comment['authorChannelId']['value'],
                        "cid": reply['snippet']['authorChannelId']['value'],
                        "author": reply['snippet']['authorDisplayName'],
                        "published_date": reply['snippet']['publishedAt'],
                        #"updated_date": reply['snippet']['updatedAt'],
                        "time_num": re.sub(r'[^0-9]', '', reply['snippet']['publishedAt']),
                        "text": reply['snippet']['textDisplay']
                    }
                    result[i] = result_format
                    i = i + 1

    if 'nextPageToken' in response:
        response = api_obj.commentThreads().list(part='snippet,replies', videoId=video_id,
                                                 pageToken=response['nextPageToken'], maxResults=100).execute()
    else:
        break


### 광고도배 삭제
del_set = set()
for i in range(0, len(result)):
    curr_text = result[i]['text']
    curr_cid = result[i]['cid']
    for j in range(i+1, len(result)):
        target_text = result[j]['text']
        target_cid = result[j]['cid']
        if curr_text == target_text and curr_cid == target_cid:
            del_set.add(i)      # i와
            del_set.add(j)      # j set에 삽입

for i in del_set:
    result.pop(i)


### 시간순 정렬
result = sorted(result.items(), key=lambda x: x[1]['time_num'])
result = dict(result)


### 삭제된 index 메꾸기
final_result = {}
j = 0
for i in result:
    final_result[j] = result[i]
    j = j + 1


with open('0516_final.json', 'w', encoding='utf-8') as make_file:
        json.dump(final_result, make_file, ensure_ascii=False, indent='\t')