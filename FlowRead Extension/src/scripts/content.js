let rectangle;
let rectangleY = 0;
let settings = Settings.default
let devMode = false;

Settings.read((data) => {
	settings = data.settings;
	createRectangle();
	Settings.onChange((e) => {
		settings = e.data.settings;
		updateRectangle();
	});
});

let dragStarted = false;
let currentMouseY = 0;
let y0 = 0;

function createRectangle() {
	rectangle = document.createElement("div")
	document.body.appendChild(rectangle);
	updateRectangle()

	rectangle.addEventListener("mousedown", startDrag);
	window.addEventListener("mouseup", stopDrag);
	window.addEventListener("mousemove", handleMouseMove);

}

function normalizeHost(host) {
	// Normalize the host by removing 'www.' prefix and converting to lowercase
	return host.replace(/^www\./, '').toLowerCase();
}
function siteIsExcluded() {
	excludedSites = settings.excludedSites || [];

	const currentHost = window.location.hostname;
	return excludedSites.some(site => normalizeHost(currentHost) === normalizeHost(site));
}
function showRectangle() {
	if (!settings.enabled) return false
	if (siteIsExcluded()) return false
	return true;
}
function updateRectangle() {
	rectangle.className = 'focus-bar'
	rectangle.style.top = `${rectangleY}px`
	rectangle.style.position = "fixed";
	rectangle.style.left = "0px";
	rectangle.style.width = "100vw";
	rectangle.style.cursor = 'grab'
	rectangle.style.zIndex = 500000;

	rectangle.style.borderTop = "solid 1px #aa0";
	rectangle.style.borderBottom = "solid 1px #aa0";
	rectangle.style.boxShadow = "rgba(149, 157, 165, 1) 0px 0px 8px";

	rectangle.style.height = settings.rectangleHeight + "px";
	rectangle.style.backgroundColor = settings.rectangleColor;
	rectangle.style.opacity = settings.rectangleOpacity;
	rectangle.style.display = showRectangle() ? 'block' : 'none'

	if (devMode) {
		rectangle.style.color = '#000';
		rectangle.style.fontSize = '12px';
		rectangle.style.fontFamily = 'consolas, monospace';
		$(rectangle).html(normalizeHost(window.location.hostname));
	}
}

function dy() {
	return (currentMouseY - y0) / devicePixelRatio

}
function startDrag(event) {
	if (!dragStarted) {
		dragStarted = true;
		y0 = currentMouseY
		event.preventDefault()
		return false
	}
}
function handleMouseMove(event) {
	currentMouseY = event.screenY
	if (dragStarted) {
		rectangle.style.top = `${rectangleY + dy()}px`
		event.preventDefault()
		return false
	}
}
function stopDrag(event) {
	if (dragStarted) {
		dragStarted = false;
		rectangleY = rectangleY + dy()
		event.preventDefault()
		return false
	}
}
