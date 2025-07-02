let txtHeight = null;
let txtColor = null;
let txtOpacity = null;
let cbEnabled = null;
let txtExcludedSites = null;
let txtIncludedSites = null;
let ddlMode = null;
let trExcludedSites = null;
let trIncludedSites = null;

function splitSites(sites) {
	return sites.split('\n')
		.map(s => normalizeHost(s))
		.filter(s => s.length > 0)
		.map(s => s.toLowerCase())
		.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function SaveSettings() {
	const settings = {
		mode: ddlMode.val(),
		excludedSites: splitSites(txtExcludedSites.val()),
		includedSites: splitSites(txtIncludedSites.val()),
		rectangleHeight: parseInt(txtHeight.val()),
		rectangleColor: txtColor.val(),
		rectangleOpacity: parseFloat(txtOpacity.val()),
		enabled: cbEnabled.prop('checked'),
	}

	Settings.save(settings)
	LoadSettings()
}
function LoadSettings() {
	Settings.read(function ({ settings }) {
		let excludedSites = settings.excludedSites/*|| defaultExcludedHosts;*/
		let includedSites = settings.includedSites
		txtHeight.val(settings.rectangleHeight)
		txtColor.val(settings.rectangleColor)
		txtOpacity.val(settings.rectangleOpacity)
		cbEnabled.prop('checked', settings.enabled)
		ddlMode.val(settings.mode)
		txtExcludedSites.val(excludedSites.join('\n'))
		txtIncludedSites.val(includedSites.join('\n'))
		trExcludedSites.toggle(settings.mode === 'blacklist')
		trIncludedSites.toggle(settings.mode === 'whitelist')
	})
}
function SetColor(color) {
	txtColor.val(color)
	SaveSettings()
}

$(document).ready(function () {
	initializeUI();
})

function initializeUI() {
	txtHeight = $('#txtHeight')
	txtColor = $('#txtColor')
	txtOpacity = $('#txtOpacity')
	cbEnabled = $('#cbEnabled')
	ddlMode = $('#ddlMode')
	txtExcludedSites = $('#txtExcludedSites')
	txtIncludedSites = $('#txtIncludedSites')
	trExcludedSites = $('#trExcludedSites')
	trIncludedSites = $('#trIncludedSites')

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
	txtIncludedSites.on('change', function () { SaveSettings() })
	ddlMode.on('change', function () { SaveSettings() });

	$('#btnSave').on('click', function () {
		SaveSettings()
	});

}