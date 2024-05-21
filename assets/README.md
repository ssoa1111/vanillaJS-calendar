# VanillaJs-calendar
바닐라 js로 캘린더 기능 구현

[참고자료]       
요일 구하는 공식
https://terms.naver.com/entry.naver?docId=3534028&cid=60209&categoryId=60209     
요일 구하는 공식 중 월의 값 구하는 공식          
https://terms.naver.com/entry.naver?docId=3534027&cid=60209&categoryId=60209&expCategoryId=60209       

## calendar 사용 방법
```
<script type="module">
    import { Calendar } from '../js/calendar.js'

    const calendarEl = document.querySelector("#calendar")
    const calendar = new Calendar(calendarEl, {
        // ...option
    })
    calendar.init()
</script>
```

## calendar 옵션
```
setDate: String ( default : YYYY-MM-DD ) - 초기에 선택된 값
(미구현)startDay: Number ( default : 0 ) - 처음 요일 값 (일요일)
```

## calendar 구현사항
1. 원하는 날짜를 입력하면 해당 달력이 보여짐
2. 이전/다음 버튼을 누르면 이전/다음달이 보여짐
3. 보여진 달이 중복적으로 렌더링 되지 않게 함
4. 선택한 날을 표시함


### 1. 원하는 날짜를 입력하면 해당 달력이 보여짐
1. 날짜 설정해서 입력하지 않으면 오늘 날짜로 나타나게 함
2. 해당 달의 최대 일수를 구함
3. 1부터 최대 일수까지 렌더링 함

### 2. 이전/다음 버튼을 누르면 이전/다음 달이 보여짐
1. 이전/다음 누르면 기본 설정 달에서 +- 값을 구함
2. 달이 0, 13이 되면 변환함
3. 1.2, 1.3의 과정을 거침

### 3. 보여진 달이 중복적으로 렌더링 되지 않게 함
1. 월의 dom의 dataset의 YYYY, MM을 저장함
( 일의 dom에는 YYYY, MM, DD 저장 )
2. dataset의 YYYY와 MM가 이미 존재하다면 return

### 4. 선택한 날을 표시함
1. 선택 클래스 제거 후 클릭 요소에 클래스 추가