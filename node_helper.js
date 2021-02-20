const NodeHelper = require("node_helper");
const request = require('request');
const fs = require('fs');

module.exports = NodeHelper.create({
	start: function() {},
	// Frontend module pings the node helper to fetch data from Shelly HT
	socketNotificationReceived: function (notification, payload) {
		if (notification == "GetShelly"){
			self = this;
			const fileName = "ShellyHTData.json"

			request(payload.apiPath, {json: true }, (err, res, body) => {
				if (err) { 
					// Since the shelly is not always on most connection attempts will fail. In this case
					// simply read and return the saved data. This is useful also after restarts of the MagicMirror, so there
					// is always data on screen.
					if (err.code === "EHOSTUNREACH") {
						fs.readFile(fileName, 'utf8', (err, data)=> {
							if (err) {
								return console.log(err);
							}
							
							self.sendSocketNotification('ShellyHTData', JSON.parse(data));
						})

						return
					}

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

				// save read values to file
				fs.writeFile(fileName, JSON.stringify(payload), (err) => {
					if(err) {
						console.log(err);
					}
				});

				self.sendSocketNotification('ShellyHTData', payload)
			});
		}
	}
});
