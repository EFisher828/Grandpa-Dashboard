let currentTempUrl = `https://api.climate.ncsu.edu/data?loc=GRANDFATHR&var=airtemp&start=-20%20minutes&end=now&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
console.log(currentTempUrl)

let xhr = new XMLHttpRequest();

xhr.responseType = 'json';

xhr.onreadystatechange = function() {
	if(xhr.readyState === XMLHttpRequest.DONE){
		//Station Data Objects
		console.log(xhr.response.data.GRANDFATHR)
		let dataList = []
		let timeList = []
		let station
		try {
			const stationObj = xhr.response.data.GRANDFATHR
			const stationLength = Object.keys(stationObj).length
			let stationCount = 2
			let stationTemp
			let stationObTime
			if (stationLength == 1){
				for(let key in stationObj){
					const stationTempHold = stationObj[key].airtemp.value
					if (stationTempHold == 'NA' || stationTempHold == 'QCF' || stationTempHold == 'MV'){
						stationTemp = null
					}else {
						stationTemp = stationTempHold
					}
				}
			}else {
				for (let key in stationObj){
					if (stationCount == stationLength-1){
						const stationTempHold = stationObj[key].airtemp.value
						stationObTime = stationObj[key].airtemp.obtime
						if (stationTempHold == 'NA' || stationTempHold == 'QCF' || stationTempHold == 'MV'){
							stationTemp = null
						}else {
							stationTemp = eval(stationTempHold)
						}
					}
					stationCount = stationCount + 1
				}
			}
			let feelsVar
      getMaxMin(stationTemp)
			//getChill(stationTemp)
		} catch(err) {}
	}
}
xhr.open("GET",currentTempUrl)
xhr.send()

const seriesGet = () => {
	let seriesTempUrl = `https://api.climate.ncsu.edu/data?loc=GRANDFATHR&var=airtemp&start=-24%20hours&end=now&int=30%20MINUTE&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(seriesTempUrl)

	xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			console.log(xhr.response.data.GRANDFATHR)
			let tempList = []
			let timeList = []
			let stationTemp
			let feels
			let time

			const stationObj = xhr.response.data.GRANDFATHR
			for(let key in stationObj){
				const stationTempHold = stationObj[key].airtemp.value
				if (stationTempHold == 'NA' || stationTempHold == 'QCF' || stationTempHold == 'MV'){
					stationTemp = null
				}else {
					stationTemp = eval(stationTempHold)
				}
				tempList.push(stationTemp)

				timeFull = stationObj[key].airtemp.datetime
				timeSplit = timeFull.substring(11,16)
				time = convert12(timeSplit)
				timeList.push(time)
			}
			console.log(tempList)
      getMaxMinSeries(tempList,timeList)

			try {

			} catch(err) {}
		}
	}
	xhr.open("GET",seriesTempUrl)
	xhr.send()

}
