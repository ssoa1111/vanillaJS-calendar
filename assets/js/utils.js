function splitText(str, splitStr) {
    return str.split(splitStr)
}

function gauss(number) {
    const num = typeof number === "string" ? Number(number) : number
    return Math.floor(num)
}

function makeDom(type, name) {
    const dom = document.createElement(type)
    dom.className = name
    return dom
}
