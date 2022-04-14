import json

data = [json.loads(line) for line in open('first_test.json', 'r', encoding='utf-8')]


### json 파일 내 불필요한 key값 삭제
for n in data:
    del (n['time'], n['channel'], n['votes'], n['photo'], n['heart'])


### json 파일 time parsed 순서로 정렬
data.sort(key = lambda x:x["time_parsed"])


### 광고/도배 중복 제거
del_set = set()
for i in range (0,len(data)) :
    curr_text = data[i]['text']
    curr_author = data[i]['author']
    # print(i)
    for j in range (i+1, len(data)):
        target_text = data[j]['text']
        target_author = data[j]['author']
        if curr_text == target_text and curr_author == target_author :
            del_set.add(i)      # i와
            del_set.add(j)      # j set에 삽입

del_list = list(del_set)        # indexing 위해 list로 변환
del_list.sort()

for i in range (len(del_list)-1, -1, -1 ) :     # 역순으로 끝에서부터 pop
    print(data.pop(del_list[i]))


### 이 밑이 스코어 코드 들어갈 자리!


### 수정한 내용을 배열화 해서 json 파일 저장
with open('first_test_refactor.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, indent="\t", ensure_ascii=False)