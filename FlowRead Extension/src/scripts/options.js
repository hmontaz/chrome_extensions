let txtHeight = null;
let txtColor = null;
let txtOpacity = null;
let cbEnabled = null;
let txtExcludedSites = null;
const defaultHosts = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'music.youtube.com', 'tiktok.com', 'x.com']

function SaveSettings() {
	const settings = {
		excludedSites: txtExcludedSites.val().split('\n').map(s => s.trim()).filter(s => s.length > 0),
		rectangleHeight: parseInt(txtHeight.val()),
		rectangleColor: txtColor.val(),
		rectangleOpacity: parseFloat(txtOpacity.val()),
		enabled: cbEnabled.prop('checked'),
	}

	Settings.save(settings)
	//chrome.storage.sync.set({ settingsSavedOn: new Date().getTime(), settings: { ...Settings.default, ...settings } }, () => {
	//	console.log("Settings saved!")
	//});
}
function LoadSettings() {
	Settings.read(function ({ settings }) {
		var excludedSites = settings.excludedSites || defaultHosts;
		txtHeight.val(settings.rectangleHeight)
		txtColor.val(settings.rectangleColor)
		txtOpacity.val(settings.rectangleOpacity)
		cbEnabled.prop('checked', settings.enabled)
		txtExcludedSites.val(excludedSites.join('\n'))
	})
}
function SetColor(color) {
	txtColor.val(color)
	SaveSettings()
}

$(document).ready(function () {
	txtHeight = $('#txtHeight')
	txtColor = $('#txtColor')
	txtOpacity = $('#txtOpacity')
	cbEnabled = $('#cbEnabled')
	txtExcludedSites = $('#txtExcludedSites')
	let colorPresets = $('.color-preset')
	colorPresets.each(function () {
		let color = $(this).attr('data-color')
		let { h, s, l } = ColorTools.HexToHSL(color)
		$(this).css('background-color', `hsl(${h},${s}%,${l * .7}%)`)
	}).on('click', function () {
		let color = $(this).attr('data-color')
		SetColor(color)
	})

	LoadSettings();
	txtHeight.on('change', function () { SaveSettings() })
	txtColor.on('change', function () { SaveSettings() })
	txtOpacity.on('change', function () { SaveSettings() })
	cbEnabled.on('change', function () { SaveSettings() })
	txtExcludedSites.on('change', function () { SaveSettings() })

	$('#btnSave').on('click', function () {

		SaveSettings()
	});
})