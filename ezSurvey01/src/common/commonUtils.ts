export function alertlater(msg, timeout = 10) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      alert(msg);
      resolve("done");
    }, timeout);
  })
};

const oneDay = 1000 * 60 * 60 * 24;

export const diffDays = (date1: Date, date2: Date) => {

  let days = null;
  let _date1 = new Date(date1);
  let _date2 = new Date(date2);

  try {
    _date1.setHours(0, 0, 0, 0);
    _date2.setHours(0, 0, 0, 0);

    days = (_date1.getTime() - _date2.getTime()) / oneDay;
  }
  catch (ex) {

  }

  return days;
}

export const getNextId = (list, propName) => {

  const nextId = list && list.length > 0 ? Math.max(...list.map(x => x[propName])) + 1 : 1;
  return nextId;
}


export const removeTags = (str) => {
  if (typeof str === 'string') {
    return str.replace(/(<([^>]+)>)/ig, '');
  }
  return str;
}

export const inView = (target) => {
  let options = {
    rootMargin: '0px',
    threshold: 1.0
  }

  return new Promise(resolve => {
    let observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    function callback(entries, observer) {
      resolve(entries[0].isIntersecting)
      observer.disconnect();
    }
  })
}

export const clearUrl = (_url) => _url.replace(/([^:]\/)\/+/g, "$1");

export const NoExamMsg = (qnrid) => `無此問卷(${qnrid})`

export const removeParam = (key) => sessionStorage.removeItem(key);
export const removeParams = (partialkey) => {
  var n = sessionStorage.length;
  let rePartialkey = new RegExp(partialkey, "ig")

  while (n--) {
    var key = sessionStorage.key(n);
    if (rePartialkey.test(key)) {
      sessionStorage.removeItem(key);
    }
  }
};

export const saveParams = (key, params) =>
  sessionStorage.setItem(key, JSON.stringify(params));

export const getParams = (key) => {
  let params = sessionStorage.getItem(key);
  return params && JSON.parse(params);
}

// export const trimSpace = (str) => str?.replace(/\&nbsp;|[^\w]/g, '');
// https://blog.typeart.cc/%E6%AD%A3%E5%89%87%E8%A1%A8%E9%81%94%E5%BC%8F-%E5%85%A8%E5%9E%8B%E8%8B%B1%E6%95%B8%E4%B8%AD%E6%96%87%E5%AD%97%E3%80%81%E5%B8%B8%E7%94%A8%E7%AC%A6%E8%99%9Funicode%E5%B0%8D%E7%85%A7%E8%A1%A8/
export const trimSpace = (str) => str?.replace(/\&nbsp;|[^\w\u4e00-\u9fff\uFF10-\uFF19\uFF41-\uFF5A\uFF21-\uFF3A]/g, '');

export const classWarning = ".warning";

export const scrollToWarning = async ($warning) => {

  const _inView = await inView($warning);
  if (!_inView) {
    $warning.scrollIntoView({ block: "center" })
  }

}

export const scrollIntoView = async (element, position = {}) => {
  //const $warning = $(classWarning)[0];
  if (element) {
    const _inView = await inView(element);
    if (!_inView) {
      element.scrollIntoView(position)
    }
  }
}

export const matchsize = (file, maxsize, unit) => {
  // const maxsize = 1;
  const fsize = sizeUnit(file, unit);
  return file.size > 0 && fsize <= maxsize;
}

export const sizeUnit = (file, unit) => {
  const baseKB = 1024;
  const baseUnit = unit === "MB" ? Math.pow(baseKB, 2) : baseKB;
  // console.log("sizeUnit", unit, file.size, baseUnit, Math.floor(file.size * 10 / baseUnit) / 10);
  return file && Math.floor(file.size * 10 / baseUnit) / 10;
}

export const matchextention = (file, extentionList) => {
  let extentions = extentionList.replaceAll(",", "|");
  let reExtentions = new RegExp(`.*(${extentions})$`, "ig")
  // console.log("extentions", extentions, reExtentions);
  return file.name.match(reExtentions);
  // return file.name.match(/.*\.((xls|xlsx|ppt|pptx|doc|docx|pdf|png|jpg|jpeg)$)/ig)
}

export const list_radio = (orien) => orien === "h" ? "list_radios_inline" : "list_radios";
export const list_checkbox = (orien) => orien === "h" ? "list_checkbox_inline" : "list_checkbox";

export const scrolltoStarWord = () => {
  setTimeout(() => {
    const starWord = $(".star-word__Container")[0];
    starWord.scrollIntoView();
  }, 100)
}

export const restoreScrollY = (pathname) => {
  const [unload, ScrollY] = ["unload", "ScrollY"];
  const currentScrollY = pathname + ScrollY;

  $(function () {
    setTimeout(() => {
      const scrollY = getParams(currentScrollY) || 0;
      // console.log("ready!", currentScrollY, scrollY);
      window.scrollTo(0, scrollY);
      removeParams(ScrollY);
    }, 380)
  });

  $(window).off(unload).on(unload, saveScrollY)

  function saveScrollY() { saveParams(currentScrollY, this.window.scrollY); }

}



// http://ilog4.blogspot.com/2015/09/javascript-convert-full-width-and-half.html
String.prototype.toHalfWidth = function () {
  return this.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) });
};

String.prototype.toFullWidth = function () {
  return this.replace(/[A-Za-z0-9]/g, function (s) { return String.fromCharCode(s.charCodeAt(0) + 0xFEE0); });
};