let modInfo = {
	name: "Prestigious Saplings: Synergetic Spacetime!",
	author: "Team Sapling",
	pointsName: "points",
	modFiles: ["spacetime.js", "life.js", "death.js", "tree.js"],

	discordName: "The Supernova",
	discordLink: "https://discord.gg/5K4DXpGeU2",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return new Decimal(getTimeConsumptionMultis().mul(player.st.resetTime)).lt(getPointTime())
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('st', 11)) gain = gain.mul(2)
	if (hasUpgrade('st', 13)) gain = gain.mul(upgradeEffect('st', 13))
	gain = gain.mul(buyableEffect('st', 11))
	if (hasUpgrade('st', 23)) gain = gain.mul(upgradeEffect('st', 23))
	gain = gain.mul(buyableEffect('lf', 11))
	return gain
}

function getPointCapacity() {
	let cap = player.spacePoints
	if (hasUpgrade('st', 12)) cap = cap.mul(2)
	if (hasUpgrade('st', 22)) cap = cap.mul(upgradeEffect('st', 22))
	cap = cap.mul(tmp.lf.effect)
	return cap
}

function getPointTime() {
	let time = player.timePoints
	return time
}

function getTimeConsumptionMultis() {
	let mult = new Decimal(1)
	if (hasUpgrade('st', 23)) mult = mult.mul(upgradeEffect('st', 23))
	return mult
}

function getSpaceMultis() {
	let mult = new Decimal(1)
	mult = mult.mul(buyableEffect('st', 13))
	mult = mult.mul(tmp.lf.lifeEnergyEffect)
	return mult
}

function getTimeMultis() {
	let mult = new Decimal(1)
	mult = mult.mul(buyableEffect('st', 14))
	return mult
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	spacePoints: new Decimal(0),
	timePoints: new Decimal(0),
}}

// Display extra things at the top of the page
var displayThings = [
	() => "You have " + format(player.spacePoints) + " space and " + format(player.timePoints) + " time",
	() => "Space is granting a point capacity of " + format(getPointCapacity()) + "",
	() => "Time is allowing points to be generated for " + format(new Decimal(getTimeConsumptionMultis().mul(player.st.resetTime)).min(getPointTime())) + "/" + format(getPointTime()) + " seconds",
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}