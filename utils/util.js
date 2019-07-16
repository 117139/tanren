const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
function dateLater(dates, later) {
  let dateObj = {};
  // let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let show_day = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time =  yearDate+'-'+ month + '-' + dayFormate;
	if(month=='01'){
		dateObj.month='January';
	}else if(month=='02'){
		dateObj.month='February';
	}else if(month=='03'){
		dateObj.month='March';
	}else if(month=='04'){
		dateObj.month='April';
	}else if(month=='05'){
		dateObj.month='May';
	}else if(month=='06'){
		dateObj.month='June';
	}else if(month=='07'){
		dateObj.month='July';
	}else if(month=='08'){
		dateObj.month='August';
	}else if(month=='09'){
		dateObj.month='September';
	}else if(month=='10'){
		dateObj.month='October';
	}else if(month=='11'){
		dateObj.month='November';
	}else if(month=='12'){
		dateObj.month='December';
	}
	dateObj.day=dayFormate
  dateObj.week = show_day[day];
  return dateObj;
}



module.exports = {
  formatTime: formatTime,
	getDates: getDates
}
