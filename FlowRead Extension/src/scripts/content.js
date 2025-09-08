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

let currentY = 0;
let baseY = 0;
let nextY = null;
let rafId = null;

function createRectangle() {
	rectangle = document.createElement("div")
	document.body.appendChild(rectangle);
	updateRectangle()

	rectangle.addEventListener("pointerdown", onDown, { passive: false });
	rectangle.addEventListener("pointermove", onMove, { passive: false });
	rectangle.addEventListener("pointerup", onUp, { passive: false });
	rectangle.addEventListener("lostpointercapture", onUp, { passive: false });
	rectangle.addEventListener("pointercancel", onUp, { passive: false });
	window.addEventListener("blur", onUp, { passive: false });
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) onUp();
	});
}

function siteIsExcluded() {
	excludedSites = settings.excludedSites || [];

	const currentHost = window.location.hostname;
	return excludedSites.some(site => isMatching(currentHost, site));
}

function siteIsIncluded() {
	includedSites = settings.includedSites || [];
	const currentHost = window.location.hostname;
	return includedSites.some(site => isMatching(currentHost, site));
}

function showRectangle() {
	if (!settings.enabled) return false
	if (settings.mode == 'blacklist' && siteIsExcluded()) return false
	if (settings.mode == 'whitelist' && !siteIsIncluded()) return false
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

	// rectangle.style.borderTop = "solid 1px #aa0";
	// rectangle.style.borderBottom = "solid 1px #aa0";
	// rectangle.style.boxShadow = "rgba(149, 157, 165, 1) 0px 0px 8px";

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
	return (currentMouseY - y0) / devicePixelRatio;
}

function onDown(e) {
	if (!e.isPrimary) return;
	dragStarted = true;
	y0 = e.clientY;
	currentY = e.clientY;
	rectangle.setPointerCapture(e.pointerId);
	updateRectangle();
	e.preventDefault();
}

function onMove(e) {
	if (!dragStarted) return;

	// if the page was janky and we missed pointerup, stop when buttons is 0
	if (e.buttons === 0) return onUp(e);

	currentY = e.clientY;
	const y = baseY + (currentY - y0);

	if (nextY === null) {
		nextY = y;
		rafId = requestAnimationFrame(() => {
			rectangle.style.transform = `translateY(${nextY}px)`;
			nextY = null;
		});
	} else {
		nextY = y; // coalesce to the latest position
	}

	e.preventDefault();
}

function onUp(e) {
	if (!dragStarted) return;
	dragStarted = false;

	// commit the final position using the last known delta
	baseY = baseY + (currentY - y0);
	rectangle.style.transform = `translateY(${baseY}px)`;

	try {
		if (e && e.pointerId != null) rectangle.releasePointerCapture(e.pointerId);
	} catch { }

	updateRectangle();
}