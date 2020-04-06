alsa_eq = (function() {
	
settings = {
}

alsaEqEnabled = true

$(document).on("alsa-eq", function(event, data) {
	
	console.log(data.header);
	
	if (data.header == "eqSettings") {
		
		if (data.content.settings) {
			settings = data.content.settings;
			for (var hz in settings) {
				console.log("slider-"+hz, settings[hz] )
				$(".eq-slider-"+hz).slider("value", settings[hz]);
			}
		}	
	}
	
	if (data.header == "alsaEqEnabled") {
		try {
			console.log("event enabled");
			if (data.content.eqEnabled != undefined) {
				alsaEqEnabled = data.content.eqEnabled
				setEnabled(alsaEqEnabled)
				console.log("eq enabled", alsaEqEnabled);
			}
		} catch (error) {
			console.error("Exception enabling/disabling eq: ", error);
		}
		beo.notify(false,"alsa-eq");
	}
});


$(".alsa-eq-slider").slider({
	min: 0,
	max: 100,
	value: 66,
	slide: function( event, ui ) {
		sliderid = event.target.id.split("-").pop();
		
		beo.send({target: "alsa-eq", header: "setEq", content: {"hz": sliderid, "percent": ui.value}});
	}
});



function setEnabled(enable) {
	if (enable) {
		$("#alsa-eq-enabled-toggle").addClass("on");
	} else {
		$("#alsa-eq-enabled-toggle").removeClass("on");
	}
}
function toggleEnabled() {
	enabled = (!alsaEqEnabled) ? true : false;
	if (enabled) {
		beo.notify({title: "Turning ALSA EQ on...", icon: "attention", timeout: 30});
	} else {
		beo.notify({title: "Turning ALSA EQ off...", icon: "attention", timeout: 30});
	}
	beo.send({target: "alsa-eq", header: "alsaEqEnable", content: {eqEnable: enabled}});
}


return {
	toggleEnabled: toggleEnabled
}

})();