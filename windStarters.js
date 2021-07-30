const getCurrentWind = () => {
	let url = `https://api.climate.ncsu.edu/data?loc=GRANDFATHR&var=windspeed,winddir,gustspeed&start=-20%20minutes&end=now&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922`
	console.log(url)

	const xhr = new XMLHttpRequest();

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
				let stationSpeed
				let stationGust
				let stationDirection
				let stationObTime
				if (stationLength == 1){
					for(let key in stationObj){
						const stationDirectionHold = stationObj[key].winddir.value
						stationDirection = toCardinal(stationDirectionHold)

						const stationSpeedHold = stationObj[key].windspeed.value
						if (stationSpeedHold == 'NA' || stationSpeedHold == 'QCF' || stationSpeedHold == 'MV'){
							stationSpeed = null
						}else {
							stationSpeed = stationSpeedHold
						}

						const stationGustHold = stationObj[key].gustspeed.value
						if (stationGustHold == 'NA' || stationGustHold == 'QCF' || stationGustHold == 'MV'){
							stationGust = null
						}else {
							stationGust = stationGustHold
						}

						stationObTime = stationObj[key].windspeed.obtime
					}
				}else {
					for (let key in stationObj){
						if (stationCount == stationLength-1){
							const stationDirectionHold = stationObj[key].winddir.value
							stationDirection = toCardinal(stationDirectionHold)

							const stationSpeedHold = stationObj[key].windspeed.value
							if (stationSpeedHold == 'NA' || stationSpeedHold == 'QCF' || stationSpeedHold == 'MV'){
								stationSpeed = null
							}else {
								stationSpeed = eval(stationSpeedHold)
							}

							const stationGustHold = stationObj[key].gustspeed.value
							if (stationGustHold == 'NA' || stationGustHold == 'QCF' || stationGustHold == 'MV'){
								stationGust = null
							}else {
								stationGust = stationGustHold
							}

							stationObTime = stationObj[key].windspeed.obtime
						}
						stationCount = stationCount + 1
					}
				}

				if(stationSpeed == null){
					console.log('null')
				}else{
					console.log(stationSpeed)
				}

				getMax(stationSpeed,stationDirection,stationGust)
				//buildGaugeChart(stationSpeed,stationGust,stationDirection)

			} catch(err) {
				console.log('Could not generate graph')
			}
		}
	}
	xhr.open("GET",url)
	xhr.send()
}


const getSeriesWind = () => {
	let timeFull
	let timeSplit
	let time
	let gust
	let speedAvg
	let speedMin
	let directionAvg
	let timeList = []
	let gustAvgList = []
	let gustMaxList = []
	let speedAvgList = []
	let speedMinList = []
	let directionAvgList = []
	let periodSpeed = []
	let periodDir = []

	let url = 'https://api.climate.ncsu.edu/data?loc=GRANDFATHR&var=gustspeedmax,windspeedmin,windspeedavg,gustspeedavg,winddiravg&start=-24%20hours&end=now&int=15%20MINUTE&obtype=O&output=json&attr=location,datetime,var,value,value_accum,unit,score,nettype,paramtype,obtype,obnum,obtime&hash=8de315acb7cf795cf0e5a4b9d351caa2efd2a922'

	const xhr = new XMLHttpRequest();

	xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if(xhr.readyState === XMLHttpRequest.DONE){
			//Station Data Objects
			const stationObj = xhr.response.data.GRANDFATHR
			console.log(stationObj)
			for(let key in stationObj){
				try{
					timeFull = stationObj[key].gustspeedmax.datetime
					timeSplit = timeFull.substring(11,16)
					time = convert12(timeSplit)
					timeList.push(time)

					gustAvg = eval(stationObj[key].gustspeedavg.value)
					gustAvgList.push(gustAvg)

					gustMax = eval(stationObj[key].gustspeedmax.value)
					gustMaxList.push(gustMax)

					speedAvg = eval(stationObj[key].windspeedavg.value)
					speedAvgList.push(speedAvg)

					speedMin = eval(stationObj[key].windspeedmin.value)
					speedMinList.push(speedMin)

					directionAvg = eval(stationObj[key].winddiravg.value)
					directionAvgList.push(directionAvg)
				} catch {}
			}
			buildWindChart(timeList,gustAvgList,gustMaxList,speedAvgList,speedMinList,directionAvgList)
			console.log(directionAvgList)
		}
	}
	xhr.open("GET",url)
	xhr.send()

}
