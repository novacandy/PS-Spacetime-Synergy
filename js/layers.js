addLayer("st", {
    name: "spacetime",
    symbol: "ST",
    row: 0,
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(15),
        resetTime: 0,
        total: new Decimal(15),

        convertInput: "SPACETIME",
        convertOutput: "SPACE",
        converting: false,

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
        mult = mult.mul(buyableEffect('st', 12))
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        return exp
    },
    getConvertRate() {
        let rate = new Decimal(1)
        return rate
    },
    getConvertReduction() {
        let reduction = new Decimal(0.25)
        return reduction
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
            done() { return player.st.total.gte(16) }
        },
        1: {
            requirementDescription: "50 spacetime",
            effectDescription: "Unlock enhancement buyables in the Upgrade Modules",
            done() { return player.st.points.gte(50)}
        }
    },
    clickables: {
        11: {
            title: () => {
                    if (player.st.converting == false) {
                        return "BEGIN CONVERSION"
                    } else if (player.st.converting == true) {
                        return "END CONVERSION"
                    }
                },
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
                if (player.st.converting == false) {
                    player.st.converting = true
                } else {
                    player.st.converting = false
                }
                doReset('st', true)
            }
        },
    },
    buyables: {
        11: {
            title() {return "Point Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { return new Decimal(10).mul(x.add(1)).mul(new Decimal(1.25).pow(x)) },
            display() { return "\
                Multiplying points by x"+ format(this.effectBase()) +" each\n\
                Currently: x" + format(this.effect()) + "\n\
                Cost: "+ format(this.cost()) +" spacetime\n\
                " },
            effectBase() {
                let base = new Decimal(1.25)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        12: {
            title() {return "Spacetime Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { return new Decimal(25).mul(x.mul(1.5).add(1)).mul(new Decimal(1.5).pow(x)) },
            display() { return "\
                Multiplying spacetime gain by x"+ format(this.effectBase()) +" each\n\
                Currently: x" + format(this.effect()) + "\n\
                Cost: "+ format(this.cost()) +" spacetime\n\
                " },
            effectBase() {
                let base = new Decimal(1.25)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        13: {
            title() {return "Space Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { return new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x)) },
            display() { return "\
                Multiplying space gain by x"+ format(this.effectBase()) +" each\n\
                Currently: x" + format(this.effect()) + "\n\
                Cost: "+ format(this.cost()) +" spacetime\n\
                " },
            effectBase() {
                let base = new Decimal(1.25)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        14: {
            title() {return "Time Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { return new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x)) },
            display() { return "\
                Multiplying time gain by x"+ format(this.effectBase()) +" each\n\
                Currently: x" + format(this.effect()) + "\n\
                Cost: "+ format(this.cost()) +" spacetime\n\
                " },
            effectBase() {
                let base = new Decimal(1.25)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
    },
    microtabs: {
        spacetime: {
            "Spacetime Conversion Module": {
                content: [
                    "blank",
                    ["display-text", "<h3>INPUT</h3>"],
                    ["drop-down", ["convertInput", ["SPACETIME"]]],
                    "blank",
                    ["display-text", "<h3>OUTPUT</h3>"],
                    ["drop-down", ["convertOutput", ["SPACE", "TIME"]]],
                    "blank",
                    ["display-text", () => {return "Convert Mode: " + player.st.convertInput + " -> " + player.st.convertOutput}],
                    ["display-text", () => {return "Convert Rate: " + format(tmp.st.getConvertRate) + "/s"}],
                    "blank",
                    ["display-text", () => {
                        if (player.st.converting) {
                            return "SPACETIME: " + format(player.st.points) + " (-" + format(tmp.st.getConvertRate) + "/s)"
                        } else {
                            return "SPACETIME: " + format(player.st.points) + " (-0.00/s)"
                        }
                    }],
                    "blank",
                    ["display-text", () => {
                        if (player.st.converting) {
                            return "SPACE: " + format(player.spacePoints) + " (+" + format(getSpaceMultis().mul(tmp.st.getConvertRate.pow(new Decimal(1).sub(tmp.st.getConvertReduction)))) + "/s)"
                        } else {
                            return "SPACE: " + format(player.spacePoints) + " (+0.00/s)"
                        }
                    }],
                    ["display-text", () => {
                        if (player.st.converting) {
                            return "TIME: " + format(player.timePoints) + " (+" + format(getTimeMultis().mul(tmp.st.getConvertRate.pow(new Decimal(1).sub(tmp.st.getConvertReduction)))) + "/s)"
                        } else {
                            return "TIME: " + format(player.timePoints) + " (+0.00/s)"
                        }
                    }],
                    "blank",
                    "clickables",
                    "blank",
                    ["display-text", "Starting/ending a spacetime conversion will force a Spacetime reset"],
                ],
            },
            "Spacetime Upgrade Module": {
                unlocked() {return hasMilestone('st', 0)},
                content: [
                    "blank",
                    "upgrades",
                    "blank",
                    "buyables"
                ],
            },
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
        if (player.st.converting == true) {
            if (player.st.convertInput == "SPACETIME") {
                player.st.points = player.st.points.sub(diff)
                if (player.st.points.lte(0.1)) player.st.converting = false
            } else if (player.st.convertInput == "TIME") {
                player.timePoints = player.timePoints.sub(diff)
                if (player.timePoints.lte(0.1)) player.st.converting = false

            } else if (player.st.convertInput == "SPACE") {
                player.spacePoints = player.spacePoints.sub(diff)
                if (player.spacePoints.lte(0.1)) player.st.converting = false
            } 
            if (player.st.convertOutput == "SPACETIME") {
                player.st.points = player.st.points.add(tmp.st.gainMult.mul(diff))
            } else if (player.st.convertOutput == "TIME") {
                player.timePoints = player.timePoints.add(getTimeMultis().pow(new Decimal(1).sub(tmp.st.getConvertReduction)).mul(diff))
            } else if (player.st.convertOutput == "SPACE") {
                player.spacePoints = player.spacePoints.add(getSpaceMultis().pow(new Decimal(1).sub(tmp.st.getConvertReduction)).mul(diff))
            } 
        }
    },
    layerShown() {return true}
})
