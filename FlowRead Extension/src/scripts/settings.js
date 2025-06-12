const Settings = {
	default: {
		excludedSites: ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'music.youtube.com', 'tiktok.com', 'x.com'],
		rectangleHeight: 40,
		rectangleColor: '#ffff00',
		rectangleOpacity: .2,
		enabled: true,
		lastSavedOn: new Date().getTime(),
	},
	onChange: function (callback) {
		let eventTriggeredOn = null;
		setInterval(() => {
			if (!chrome?.runtime?.id) return
			chrome.storage.sync.get(["settingsSavedOn", "settings"], (data) => {
				if (!data.settingsSavedOn) return
				if (data.settingsSavedOn <= eventTriggeredOn) return
				eventTriggeredOn = data.settingsSavedOn;
				callback({ data: data });
			});
		}, 100);
	},
	everSaved: function () {
		let everSaved = false;
		chrome.storage.sync.get(["settingsSavedOn"], (data) => {
			console.log("everSaved", data.settingsSavedOn);
			everSaved = data.settingsSavedOn != undefined
		});
		return everSaved;
	},
	read: function (callback) {
		if (!Settings.everSaved()) { }//this.save(Settings.default)
		chrome.storage.sync.get(["settings"], (data) => {
			const result = {
				settings: { ...Settings.default, ...data.settings }
			}
			if (callback) callback(result)
		});
	},
	save: function (value, callback) {
		const o = {
			settingsSavedOn: new Date().getTime(),
			settings: { ...Settings.default, ...value }
		}
		chrome.storage.sync.set(o, () => {
			if (callback) callback({});
			console.log("Settings saved!", o)
		});
	},
	setColor: function (color) {
		//txtColor.val(color)
		//SaveSettings()
	}
}