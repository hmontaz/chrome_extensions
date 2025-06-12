/*chrome.runtime.onMessage.addListener((message) => {
	if (message.type === "updateOptions") {
		console.log("Potential settings saved!");
		// Perform your desired action here (e.g., send notification, update data)
	}
});*/

/*chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === "sync" && changes.settingsSaved) {
		if (changes.settingsSaved.newValue) {
			console.log("Settings potentially saved, notifying content script");
			chrome.runtime.sendMessage({ type: "settingsSaved" });
			// Optionally reset the flag in storage after a delay
			chrome.storage.sync.set({ settingsSaved: false }, () => {
				console.log("Settings saved flag cleared");
			});
		}
	}
});*/
