export class Calendar {
    $target
    option = {
        setDate: '',
        startDay: 0, // 일요일 시작
    }
    actions = {}
    DATE = {
        Y: 0,
        M: 1,
        D: 2
    }
    WEEK = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wen: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    }
    dayArr = []
    currentIndex = {
        index: 0,
        year: 0,
        month: 0,
    }
    selectedDate = ''

    constructor(_$target, _option) {
        this.$target = _$target

        if (this.$target.Calendar) return

        this.$target.Calendar = this
        this.option = { ...this.option, ..._option }
    }
    init() {
        this.setSelector()
        this.setProperty(this.option.setDate)
        this.setAction()
        this.setEvent()
        this.render()
    }

    setSelector() { // 생성되는 className
        this.monthTotalWrap = 'month-container'
        this.monthWrapClass = 'month-wrap'
        this.monthTitleClass = 'month-title'
        this.monthClass = 'month'

        this.dayWrapClass = 'day'
        this.dayClass = 'day-txt'

        this.arrowWrap = 'arrow-wrap'
        this.prevArrow = 'prev-arrow'
        this.nextArrow = 'next-arrow'

        this.weekWrapClass = 'week-wrap'
        this.weekClass = 'week'

        this.selectClass = 'selected'
    }
    setProperty(date) {
        this.dateArr = splitText(date, '-')
        this.dateArr[this.DATE.M] -= 1

        if (this.dateArr.length < Object.keys(this.DATE).length) {
            this.dateArr.length = 0

            const today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth()
            const date = today.getDate();

            this.option.setDate = `${year}-${month + 1}-${date}`
            this.dateArr.push(year)
            this.dateArr.push(month)
            this.dateArr.push(date)
        }

        this.currentIndex.year = this.dateArr[this.DATE.Y]
        this.currentIndex.month = this.dateArr[this.DATE.M]
    }
    setAction() { // actions 추가
        this.actions.select = (target) => { // 날짜 선택
            const typeBtn = target.closest(`.${this.dayWrapClass}`)
            if (!typeBtn) return
            const prevSelected = this.$target.querySelector(`.${this.selectClass}`)
            prevSelected?.classList.remove(this.selectClass)
            typeBtn.classList.add(this.selectClass)

            const dayTxt = typeBtn.querySelector(`.${this.dayClass}`)
            this.selectedDate = `${dayTxt.dataset.year}-${dayTxt.dataset.month}-${dayTxt.dataset.day}`
        }

        this.actions.clickArrow = (target) => { // 이전/다음 화살표 선택
            const arrow = target.closest(`.${this.prevArrow}, .${this.nextArrow}`);

            if (arrow) {
                this.currentIndex.index += arrow.classList.contains(this.prevArrow) ? -1 : 1;
                this.calcMonthIndex()
                this.renderMonth(this.currentIndex.year, this.currentIndex.month, 1)
            }
        }
    }
    setEvent() { // 이벤트 선언
        this.$target.addEventListener("click", (e) => {
            this.actions.select(e.target)
            this.actions.clickArrow(e.target)
        })
    }

    // render
    render() {
        this.renderArrow()
        this.renderMonthContainer()
        this.renderMonth(this.dateArr[this.DATE.Y], Number(this.dateArr[this.DATE.M]) + 1, this.dateArr[this.DATE.D])

        this.actions.select(this.$target.querySelector(`[data-day="${this.dateArr[this.DATE.D]}"]`))

        // 토일 표시
        const sat = this.$target.querySelectorAll(`[data-date="Sat"]`)
        const sun = this.$target.querySelectorAll(`[data-date="Sun"]`)
        sat.forEach(date => date.classList.add('date-sat'))
        sun.forEach(date => date.classList.add('date-sun'))
    }
    renderArrow() { // 이전 다음 화살표 생성
        const arrowWrap = makeDom('div', this.arrowWrap)

        const prevBtnEl = makeDom('button', this.prevArrow)
        const prevSpanEl = makeDom('span', `${this.prevArrow}-txt`)
        prevSpanEl.innerText = '이전 달력으로'

        const nextBtnEl = makeDom('button', this.nextArrow)
        const nextSpanEl = makeDom('span', `${this.nextArrow}-txt`)
        nextSpanEl.innerText = '다음 달력으로'

        nextBtnEl.append(nextSpanEl)
        prevBtnEl.append(prevSpanEl)

        arrowWrap.append(prevBtnEl)
        arrowWrap.append(nextBtnEl)
        this.$target.append(arrowWrap)
    }
    renderMonthContainer() { // 월 전체 감싸는 dom 생성
        const monthTotalWrap = makeDom('div', this.monthTotalWrap)
        this.$target.append(monthTotalWrap)
    }
    renderMonth(year, month, day) { // 특정 월 생성
        // 이미 생성된 month 확인
        const allMonth = [...this.$target.querySelectorAll(`.${this.monthWrapClass}`)]
        const isMadeMonth = allMonth.find(el => el.dataset.month == month && el.dataset.year == year)
        if (isMadeMonth) return

        // month 돔 그리기
        const monthWrapEl = makeDom('div', this.monthWrapClass)
        const monthTitle = makeDom('div', this.monthTitleClass)

        monthWrapEl.dataset.year = year
        monthWrapEl.dataset.month = month
        monthTitle.innerText = `${year}.${String(month).padStart(2, 0)}`

        monthWrapEl.append(monthTitle)
        monthWrapEl.append(this.renderWeek())
        monthWrapEl.append(this.renderDay(year, month, day))

        // 현재 기준으로 이전 다음 체크해서 이전/다음에 붙여넣기
        const monthTotalWrap = this.$target.querySelector(`.${this.monthTotalWrap}`)
        if (this.currentIndex.index < 0) {
            monthTotalWrap.insertBefore(monthWrapEl, this.$target.querySelector(`.${this.monthWrapClass}`))
        } else {
            monthTotalWrap.append(monthWrapEl)
        }
    }
    renderWeek() { // 주 생성
        const WeekWrap = makeDom('div', this.weekWrapClass)

        Object.keys(this.WEEK).forEach(week => {
            const weekEl = makeDom('div', this.weekClass)
            weekEl.innerText = week
            WeekWrap.append(weekEl)
        })

        return WeekWrap
    }
    renderDay(year, month, day) { // 일 생성
        const monthEl = makeDom('div', this.monthClass)
        this.$target.append(monthEl)

        const lastDate = this.getDaysInMonth(year, month)
        let dayIndex = 0

        for (let tr = 0; tr <= Object.keys(this.WEEK).length * 5; tr++) {
            const btnEl = makeDom('button', this.dayWrapClass)
            const spanEl = makeDom('span', this.dayClass)

            if (tr % 7 == this.getDay(year, month, dayIndex + 1) && lastDate > dayIndex) {
                spanEl.innerText = ++dayIndex
                spanEl.dataset.year = year
                spanEl.dataset.month = month
                spanEl.dataset.day = dayIndex
                spanEl.dataset.date = Object.entries(this.WEEK).find(([key, value]) => value === tr % 7)[0]
            } else {
                spanEl.innerHtml = ''
            }
            btnEl.append(spanEl)
            monthEl.append(btnEl)
        }

        return monthEl
    }

    calcMonthIndex() { // 이전/다음 년도 넘어갈 때
        this.currentIndex.year = this.dateArr[this.DATE.Y] + Math.floor((this.dateArr[this.DATE.M] + this.currentIndex.index) / 12)
        this.currentIndex.month = ((this.dateArr[this.DATE.M] + this.currentIndex.index) % 12 + 12) % 12 + 1
    }
    getDay(year, month, date) { // 요일 계산
        const L = gauss((year - 1) / 4) - gauss((year - 1) / 100) + gauss((year - 1) / 400)
        const dayNum = (year - 1) + L + this.getMonthValue(year, month) + date

        return dayNum % 7
    }
    isLeapYear(year) { // 윤년 확인
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    getDaysInMonth(year, month) { // 해당 달의 최대 일 수
        const daysInMonth = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[month - 1];
    }
    getMonthValue(year, month) { // 월의 윤년 또는 평년에 따른 값 계산
        let remain = 0
        for (let i = 1; i < month; i++) {
            remain = (this.getDaysInMonth(year, i) + remain) % 7
        }
        return remain
    }
}
