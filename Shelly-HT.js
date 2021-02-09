Module.register("Shelly-HT",{
	// Default module config.
	defaults: {
		//Just a mock API I used for development
		ShellyHTApiPath: "http://www.mocky.io/v2/5e9999183300003e267b2744",
		RefreshInterval: 3000,
		displayUpdated: true,
		displayBattery: false,
		horizontalView: true
	},
	//After startup, we don't have data and might not have it for a long time, until Shelly HT wakes up.
	ShellyHTData: {
		tmp: "--",
		hum: "--",
		bat: "--",
		updated: "--"
	},
	getStyles: function () {
		return ["Shelly-HT.css", "font-awesome.css"];
	},
	start: function() {
		var self = this;

		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("GetShelly", self.config.ShellyHTApiPath, this.config.language);
			self.updateDom();
		}, this.config.RefreshInterval);

	},
	socketNotificationReceived: function (notification, payload) {
		if (notification = "ShellyHTData"){
			//Log.log(this.name + " received a socket notification: " + notification + " - Temp: " + payload.tmp + " Hum: " + payload.hum + "Updated: " + payload.updated);
			this.ShellyHTData.tmp = payload.tmp
			this.ShellyHTData.hum = payload.hum
			this.ShellyHTData.bat = payload.bat
			this.ShellyHTData.updated = payload.updated
		}
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		var tmp = this.translate("TEMPERATURE");
		var hum = this.translate("HUMIDITY");
		var bat = this.translate("BATTERY", {"bat": this.ShellyHTData.bat})
		var updated = this.translate("UPDATED", {"upd": this.ShellyHTData.updated})
		ihtml =  "<div class='container'>"
		if (this.config.horizontalView) {
			ihtml += "  <div class='right'><sup>" + hum + "</sup> " + this.ShellyHTData.hum + " %</div>"
			ihtml += "  <div class='right'><sup>" + tmp + "</sup> " + this.ShellyHTData.tmp + " ℃</div>"
		} else {
			ihtml += "  <div class='newline'><sup>" + hum + "</sup>" + this.ShellyHTData.hum + " %</div>"
			ihtml += "  <div class='newline'><sup>" + tmp + "</sup>" + this.ShellyHTData.tmp + " ℃</div>"
		}
		if (this.config.displayUpdated && this.config.displayBattery){
			ihtml += "  <p class='bottom'>" + updated + "</p>"
		}
		if (this.config.displayBattery) {
			ihtml += " <p class='bottom'>" + bat + "</p"
		}
		ihtml += "</div>"
		wrapper.innerHTML = ihtml
		return wrapper
	},
	getTranslations: function() {
        return  {
			nl:	'translations/nl.json',
			en: 'translations/en.json',
			de: 'translations/de.json'
		};
	}
});
