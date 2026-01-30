addLayer("st", {
    name: "spacetime",
    symbol: "ST",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(10),
        resetTime: 0,
        convertInput: "SPACETIME",
        convertOutput: "SPACE",
    }},
    color: "#360d87",
    requires: new Decimal(5),
    resource: "spacetime",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        return exp
    },
    row: 0,
    hotkeys: [
        {key: "s", description: "S: Reset for spacetime", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            title: "Convert 1",
            canClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(1)) {
                    return true
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(1)) {
                    return true
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(1)) {
                    return true
                } else {
                    return false
                }
            },
            onClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(1)) {
                    player.st.points = player.st.points.sub(1)
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(1)) {
                    player.spacePoints = player.spacePoints.sub(1)
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(1)) {
                    player.timePoints = player.timePoints.sub(1)
                }
                if (player.st.convertOutput == "SPACETIME") {
                    player.st.points = player.st.points.add(1)
                } else if (player.st.convertOutput == "SPACE") {
                    player.spacePoints = player.spacePoints.add(1)
                } else if (player.st.convertOutput == "TIME") {
                    player.timePoints = player.timePoints.add(1)
                }
                doReset('st', true)
            }
        }
    },
    microtabs: {
        spacetime: {
            "Spacetime Conversion Module": {
                content: [
                    "blank",
                    ["display-text", "<h3>INPUT</h3>"],
                    ["drop-down", ["convertInput", ["SPACETIME", "SPACE", "TIME"]]],
                    "blank",
                    ["display-text", "<h3>OUTPUT</h3>"],
                    ["drop-down", ["convertOutput", ["SPACETIME", "SPACE", "TIME"]]],
                    "blank",
                    ["display-text", "Convert Mode: "],
                    "blank",
                    "clickables",
                    "blank",
                    ["display-text", "Converting spacetime will force a Spacetime reset"],
                ],
            },
            "Upgrade Module": {
                content: [
                    "blank",
                    "upgrades"
                ],
            }
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["microtabs", "spacetime"]
    ],
    update(diff) {
        if (player.points.gte(player.spacePoints)) player.points = player.spacePoints
    },
    layerShown() {return true}
})
