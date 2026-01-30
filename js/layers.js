addLayer("st", {
    name: "spacetime",
    symbol: "ST",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(10),
        resetTime: 0,
        total: new Decimal(10),
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
        if (hasUpgrade('st', 24)) mult = mult.mul(upgradeEffect('st', 24))
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
    upgrades: {
        21: {
            title: "Doubler",
            description() {return "Double point gain."},
            cost: new Decimal(5),
        },
        22: {
            title: "Efficient Space",
            description() {return "Space grants twice as much point capacity."},
            cost: new Decimal(10),
        },
        23: {
            title: "Speedrun",
            description() {return "Earn a multiplier to points based on spacetime. Effect: x" + format(this.effect())},
            cost: new Decimal(15),
            effect() {
                let effect = player.st.points.pow(0.5).div(2).add(1)
                return effect
            },
        },
        24: {
            title: "Further Expansion",
            description() {return "Earn a multiplier to spacetime based on time. Effect: x" + format(this.effect())},
            cost: new Decimal(25),
            effect() {
                let effect = player.timePoints.add(1).log(10).add(1)
                return effect
            },
        }
    },
    milestones: {
        0: {
            requirementDescription: "Reset for spacetime once",
            effectDescription: "Unlock the Upgrade Module",
            done() { return player.st.total.gte(11) }
        },
        1: {
            requirementDescription: "100 spacetime",
            effectDescription: "Unlock the Spacetime Synthesis Module and more options for spacetime conversion",
            done() { return player.st.points.gte(100)}
        }
    },
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
                    ["display-text", () => {return "Convert Mode: " + player.st.convertInput + " -> " + player.st.convertOutput}],
                    "blank",
                    "clickables",
                    "blank",
                    ["display-text", "Converting spacetime will force a Spacetime reset"],
                ],
            },
            "Upgrade Module": {
                unlocked() {return hasMilestone('st', 0)},
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
        "milestones",
        ["microtabs", "spacetime"]
    ],
    update(diff) {
        if (player.points.gte(getPointCapacity())) player.points = getPointCapacity()
    },
    layerShown() {return true}
})
