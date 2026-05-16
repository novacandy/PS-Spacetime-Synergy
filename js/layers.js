addLayer("st", {
    name: "spacetime",
    symbol: "ST",
    row: 0,
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(10),
        resetTime: 0,
        total: new Decimal(10),
        convertInput: "SPACETIME",
        convertOutput: "SPACE",

        spaceRefillAmount: new Decimal(0),
        spaceExtractedAmount: new Decimal(0),

        timeRefillAmount: new Decimal(0),
        timeExtractedAmount: new Decimal(0),
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
    getSpaceTankCap() {
        let cap = new Decimal(1e100)
        return cap
    },
    getTimeTankCap() {
        let cap = new Decimal(1e100)
        return cap
    },
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
            done() { return player.st.total.gte(1) }
        },
        1: {
            requirementDescription: "100 spacetime",
            effectDescription: "Unlock the Spacetime Extraction Module and more options for spacetime conversion",
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
        },
        12: {
            title: "Convert 10%",
            canClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(10)) {
                    return true
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(10)) {
                    return true
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(10)) {
                    return true
                } else {
                    return false
                }
            },
            onClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(10)) {
                    convertAmount = player.st.points.mul(0.1).floor()
                    player.st.points = player.st.points.sub(convertAmount)
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(10)) {
                    convertAmount = player.spacePoints.mul(0.1).floor()
                    player.spacePoints = player.spacePoints.sub(convertAmount)
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(10)) {
                    convertAmount = player.timePoints.mul(0.1).floor()
                    player.timePoints = player.timePoints.sub(convertAmount)
                }
                if (player.st.convertOutput == "SPACETIME") {
                    player.st.points = player.st.points.add(convertAmount)
                } else if (player.st.convertOutput == "SPACE") {
                    player.spacePoints = player.st.points.add(convertAmount)
                } else if (player.st.convertOutput == "TIME") {
                    player.timePoints = player.st.points.add(convertAmount)
                }
                doReset('st', true)
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        13: {
            title: "Convert 50%",
            canClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(2)) {
                    return true
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(2)) {
                    return true
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(2)) {
                    return true
                } else {
                    return false
                }
            },
            onClick() {
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(2)) {
                    convertAmount = player.st.points.mul(0.5).floor()
                    player.st.points = player.st.points.sub(convertAmount)
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(2)) {
                    convertAmount = player.spacePoints.mul(0.5).floor()
                    player.spacePoints = player.spacePoints.sub(convertAmount)
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(2)) {
                    convertAmount = player.timePoints.mul(0.5).floor()
                    player.timePoints = player.timePoints.sub(convertAmount)
                }
                if (player.st.convertOutput == "SPACETIME") {
                    player.st.points = player.st.points.add(convertAmount)
                } else if (player.st.convertOutput == "SPACE") {
                    player.spacePoints = player.st.points.add(convertAmount)
                } else if (player.st.convertOutput == "TIME") {
                    player.timePoints = player.st.points.add(convertAmount)
                }
                doReset('st', true)
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        14: {
            title: "Convert All",
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
                let convertAmount
                if (player.st.convertInput == "SPACETIME" && player.st.points.gte(1)) {
                    convertAmount = player.st.points
                    player.st.points = new Decimal(0)
                } else if (player.st.convertInput == "SPACE" && player.spacePoints.gte(1)) {
                    convertAmount = player.spacePoints
                    player.spacePoints = new Decimal(0)
                } else if (player.st.convertInput == "TIME" && player.timePoints.gte(1)) {
                    convertAmount = player.timePoints
                    player.timePoints = new Decimal(0)
                }
                if (player.st.convertOutput == "SPACETIME") {
                    player.st.points = player.st.points.add(convertAmount)
                } else if (player.st.convertOutput == "SPACE") {
                    player.spacePoints = player.spacePoints.add(convertAmount)
                } else if (player.st.convertOutput == "TIME") {
                    player.timePoints = player.timePoints.add(convertAmount)
                }
                doReset('st', true)
            },
            unlocked() {return hasMilestone('st', 1)}
        }
    },
    bars: {
        spaceTankBar: {
            direction: UP,
            width: 150,
            height: 200,
            progress() {return new Decimal(1).sub(player.st.spaceExtractedAmount.max(1).log(10).div(tmp.st.getSpaceTankCap.pow(player.st.spaceRefillAmount.add(1)).log(10)))},
            display() {return "Space Tank: " + format(tmp.st.getSpaceTankCap.pow(player.st.spaceRefillAmount.add(1)).sub(player.st.spaceExtractedAmount)) + "/" + format(tmp.st.getSpaceTankCap.pow(player.st.spaceRefillAmount.add(1)))},
            fillStyle: {"background-color": "rgb(63, 63, 63)"},
        },
        timeTankBar: {
            direction: UP,
            width: 150,
            height: 200,
            progress() {return new Decimal(1).sub(player.st.timeExtractedAmount.max(1).log(10).div(tmp.st.getTimeTankCap.pow(player.st.timeRefillAmount.add(1)).log(10)))},
            display() {return "Time Tank: " + format(tmp.st.getTimeTankCap.pow(player.st.timeRefillAmount.add(1)).sub(player.st.timeExtractedAmount)) + "/" + format(tmp.st.getTimeTankCap.pow(player.st.timeRefillAmount.add(1)))},
            fillStyle: {"background-color": "rgb(191, 191, 191)"},
            textStyle: {"color": "#000000"}
        },
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
            "Spacetime Upgrade Module": {
                unlocked() {return hasMilestone('st', 0)},
                content: [
                    "blank",
                    "upgrades"
                ],
            },
            "Spacetime Extraction Module": {
                unlocked() {return hasMilestone('st', 1)},
                content: [
                    "blank",
                    ["row", [["bar", "spaceTankBar"], ["blank", ["60px", "0px"]],  ["bar", "timeTankBar"]]]
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
