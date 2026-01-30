addLayer("st", {
    name: "spacetime",
    symbol: "ST",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(10),
        resetTime: 0,
        convertMode: true,
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
            canClick() {return player.st.points.gte(1)},
            onClick() {
                player.st.points = player.st.points.sub(1)
                if (player.st.convertMode) {
                    player.spacePoints = player.spacePoints.add(1)
                } else {
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
                    ["toggle", ["st", "convertMode"]],
                    "blank",
                    ["display-text", () => {
                        if (player.st.convertMode) {
                            return "Convert Mode: SPACE"
                        } else {
                            return "Convert Mode: TIME"
                        }
                    }],
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
