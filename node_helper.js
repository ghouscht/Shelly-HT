var NodeHelper = require("node_helper");
const request = require('request');
module.exports = NodeHelper.create({
	start: function() {},
	// Frontend module pings the node helper to fetch data from Shelly HT
	socketNotificationReceived: function (notification, payload) {
		if (notification == "GetShelly"){
			self = this;
			request(payload.apiPath, {json: true }, (err, res, body) => {
				if (err) { 
					return console.log(err); 
				}

				var options = { 
					month: 'long', 
					day: 'numeric', 
					hour: 'numeric', 
					minute: 'numeric' 
				};

				var printed_date = new Intl.DateTimeFormat(payload.language, options).format(new Date());

				payload = {
					tmp: body.tmp.tC,
					hum: body.hum.value,
					bat: body.bat.value,
					voltage: body.bat.voltage,
					updated: printed_date
				}

				console.log("Sending Shelly data to FE module", payload);
				self.sendSocketNotification('ShellyHTData', payload)
			});
		}
	}
});
