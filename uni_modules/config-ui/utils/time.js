// 获取当前时间
const currentTime = (format) => {
  let d = new Date();
  let year = d.getFullYear(); //获取年
  let month = d.getMonth() + 1; //获取月，从 Date 对象返回月份 (0 ~ 11)，故在此处+1
  let day = d.getDay(); //获取日
  let days = d.getDate(); //获取日期
  let hour = d.getHours(); //获取小时
  let minute = d.getMinutes(); //获取分钟
  let second = d.getSeconds(); //获取秒

  if (month < 10) month = "0" + month;
  if (days < 10) days = "0" + days;
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (second < 10) second = "0" + second;

  let week = new Array(
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  );

  let ym = `${year}年${month}月${days}日`; // 年月
  let yymm = `${year}-${month}`; // 年月
  let yymmhh = `${year}-${month}-${days}`;
  let time = hour + ":" + minute;
  var weekend = week[day];

  if (format == "YYYY年MM月") {
    return `${year}年${month}月`;
  }
  if (format == "YYYY-MM") {
    return `${year}-${month}`;
  }
  return {
    ym,
    time,
    yymm,
    weekend,
    yymmhh,
  };
}

/**
 * 计算两个时间的时间差
 * @param {String} time1 第一个时间点
 * @param {String} time2 第二个时间点
 * @return {String} 带天时分秒的时间差
 */
const timeDifference = (time1, time2) => {
  let dateBegin;
  let dateEnd;
  if (new Date(time1).getTime() > new Date(time2).getTime()) {
    dateEnd = new Date(time1).getTime();
    dateBegin = new Date(time2).getTime();
  } else {
    dateEnd = new Date(time2).getTime();
    dateBegin = new Date(time1).getTime();
  }
  let dateDiff = dateEnd - dateBegin; //时间差的毫秒数
  //计算出相差天数
  let dayDiff =
    Math.floor(dateDiff / (24 * 3600 * 1000)) != 0
      ? Math.floor(dateDiff / (24 * 3600 * 1000)) + "天"
      : "";
  let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  //计算出小时数
  let hours =
    Math.floor(leave1 / (3600 * 1000)) != 0
      ? Math.floor(leave1 / (3600 * 1000)) + "小时"
      : "";
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  let minutes =
    Math.floor(leave2 / (60 * 1000)) != 0
      ? Math.floor(leave2 / (60 * 1000)) + "分"
      : ""; //计算相差分钟数
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  let seconds =
    Math.round(leave3 / 1000) != 0 ? Math.round(leave3 / 1000) + "秒" : "";
  // console.log('相差 ' + dayDiff + hours + minutes + seconds)
  return dayDiff + hours + minutes + seconds;
}

/**
 * 获取指定日期的月份开始和结束时间
 * @param {String} time 指定日期
 * @return {String} value_description
 */
const getMonthBetween = (time, type = 1) => {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0, 23, 59, 59);
  if (type === 1) {
    return {
      firstDay: formatDate({ date: firstDay }),
      lastDay: formatDate({ date: lastDay }),
    };
  }
  if (type === 2) {
    return { firstDay, lastDay };
  }
  if (type === 3) {
    return {
      firstDay: firstDay.getTime(),
      lastDay: lastDay.getTime(),
    };
  }
}

/**
 * 格式化秒转成天时分秒
 * @param {Number} timestamp 时间戳的差
 * @return {String} 时分秒数据
 */
const formatSecond = (timestamp) => {
	if (!timestamp) return '-'
	
	const formatTen = (num) => {
		return num < 10 ? `0${num}` : num
	}
	
	const d = parseInt(timestamp / (1000 * 60 * 60 * 24));
	const h = parseInt((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const m = parseInt((timestamp % (1000 * 60 * 60)) / (1000 * 60));
	const s = ((timestamp % (1000 * 60)) / 1000).toFixed(0);
	const days = d > 0 ? d + "天" : "";
	const hours = h > 0 ? formatTen(h) + "小时" : "";
	const minutes = m > 0 ? formatTen(m) + "分钟" : "";
	const seconds = s > 0 ? formatTen(s) + "秒" : "";
	return `${days}${hours}${minutes}${seconds}`;
}

/**
 * 根据模板格式化时间
 * @param {String|Number} date 时间
 * @param {String} format 模板，默认：yyyy-MM-dd
 * @return {String} 模板时间
 */
const formatDate = (params) => {
  let { date, format } = params
  if (typeof date === "string") {
    date = date.replace("+08:00", "").replace("T", " ").replace("Z", "");
  }
  format = typeof format === "string" ? format : "YYYY-MM-DD HH:mm:ss";
	if (date) {
		date = new Date(date)
	}
	else {
		date = new Date()
	}
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "D+": date.getDate(), // 日
    "H+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(Y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
}

export {
	formatDate,
	formatSecond,
	getMonthBetween,
	timeDifference,
	currentTime
}
