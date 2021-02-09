Module.register("Shelly-HT",{
	// Default module config.
	defaults: {
		//Just a mock API I used for development
		ShellyHTApiPath: "http://www.mocky.io/v2/5e9999183300003e267b2744",
		RefreshInterval: 3000,
	},
	//After startup, we don't have data and might not have it for a long time, until Shelly HT wakes up.
	ShellyHTData: {
		tmp: "--",
		hum: "--",
		updated: "--"
	},
	getStyles: function () {
		return ["Shelly-HT.css", "font-awesome.css"];
	},
	start: function() {
		var self = this;
		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("GetShelly", self.config.ShellyHTApiPath, self.config.language);
			self.updateDom();
		}, this.config.RefreshInterval);
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification = "ShellyHTData"){
			//Log.log(this.name + " received a socket notification: " + notification + " - Temp: " + payload.tmp + " Hum: " + payload.hum + "Updated: " + payload.updated);
			this.ShellyHTData.tmp = payload.tmp
			this.ShellyHTData.hum = payload.hum
			this.ShellyHTData.updated = payload.updated
		}
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		ihtml =  "<div class='container'>"
		ihtml += "  <div class='right'>" + this.ShellyHTData.hum + " %</div>"
		ihtml += "  <div class='right'>" + this.ShellyHTData.tmp + " ℃</div>"
		ihtml += "  <p class='bottom'>" + this.ShellyHTData.updated + "</p>"
		ihtml += "</div>"

		wrapper.innerHTML = ihtml
		return wrapper
	},
});
