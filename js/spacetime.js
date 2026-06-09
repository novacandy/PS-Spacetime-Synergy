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
        convertBuyableAmount: new Decimal(0),

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
    passiveGeneration() {
        if (hasMilestone('st', 3)) return 0.5
    },
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade('st', 14)) mult = mult.mul(upgradeEffect('st', 14))
        mult = mult.mul(buyableEffect('st', 12))
    	if (hasUpgrade('st', 23)) mult = mult.mul(upgradeEffect('st', 23))
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        return exp
    },
    getConvertRate() {
        let rate = new Decimal(1)
        rate = rate.add(buyableEffect('st', 21))
        return rate
    },
    getConvertReduction() {
        let reduction = new Decimal(0.25)
        if (hasUpgrade('st', 24)) reduction = reduction.div(2)
        return reduction
    },
    getConvertOutputMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('st', 21)) mult = mult.mul(1.75)
        if (hasUpgrade('st', 23)) mult = mult.mul(upgradeEffect('st', 23))
        return mult
    },
    hotkeys: [
        {key: "s", description: "S: Reset for spacetime", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Doubler",
            description() {return "Double point gain."},
            cost: new Decimal(5),
        },
        12: {
            title: "Efficient Space",
            description() {return "Space grants twice as much point capacity."},
            cost: new Decimal(10),
        },
        13: {
            title: "Speedrun",
            description() {
                if (this.effect().gte(10)){
                    return "Earn a multiplier to points based on spacetime. Effect: x" + format(this.effect()) + " <b style='color: #ff0000'>[SOFTCAPPED]<b>"
                } else {
                    return "Earn a multiplier to points based on spacetime. Effect: x" + format(this.effect())
                }
            },
            cost: new Decimal(15),
            effect() {
                let effect = player.st.points.pow(0.5).div(2).add(1)
                if (effect.gte(10)) effect = effect.sub(10).pow(0.2).add(10)
                return effect
            },
        },
        14: {
            title: "Further Expansion",
            description() {return "Earn a multiplier to spacetime based on time. Effect: x" + format(this.effect())},
            cost: new Decimal(25),
            effect() {
                let effect = player.timePoints.add(1).log(2).add(1)
                return effect
            },
        },
        21: {
            title: "Efficient Conversion",
            description() {return "Multiply convert output by x1.75."},
            cost: new Decimal(10000),
            unlocked() {return hasMilestone('st', 2)}
        },
        22: {
            title: "Extra Spacious",
            description() {
                return "Earn a multiplier to point capacity based on space. Effect: x" + format(this.effect())
            },
            cost: new Decimal(100000),
            effect() {
                let effect = player.spacePoints.pow(0.25).div(5).add(1)
                return effect
            },
            unlocked() {return hasMilestone('st', 2)}
        },
        23: {
            title: "Tickspeed",
            description() {
                return "Earn a multiplier to points, convert output, and spacetime based on time, but also multiplies time consumption. Effect: x" + format(this.effect())
            },
            cost: new Decimal(250000),
            effect() {
                let effect = player.timePoints.pow(0.25).div(5).add(1)
                return effect
            },
            unlocked() {return hasMilestone('st', 2)}
        },
        23: {
            title: "Tickspeed",
            description() {
                return "Earn a multiplier to points, convert output, and spacetime based on time, but also multiplies time consumption. Effect: x" + format(this.effect())
            },
            cost: new Decimal(250000),
            effect() {
                let effect = player.timePoints.pow(0.25).div(5).add(1)
                return effect
            },
            unlocked() {return hasMilestone('st', 2)}
        },
        24: {
            title: "Split In Two",
            description() {
                return "Halves convert rate reduction. Also unlocks a pair of new layers."
            },
            cost: new Decimal(1e6),
            unlocked() {return hasMilestone('st', 2)}
        },
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
        },
        2: {
            requirementDescription: "1000 spacetime",
            effectDescription: "Unlock a buyable in the Convert Module that increases spacetime convert rate and more upgrades in the Upgrade Module",
            done() { return player.st.points.gte(1000)}
        },
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
        21: {
            title: () => {return "-"},
            canClick() {
                return player.st.convertBuyableAmount.gt(0)
            },
            onClick() {
                player.st.convertBuyableAmount = player.st.convertBuyableAmount.sub(1)
            },
            unlocked() {return hasMilestone('st', 2)}
        },
        22: {
            title: () => {return "+"},
            canClick() {
                return player.st.convertBuyableAmount.lt(getBuyableAmount('st', 21))
            },
            onClick() {
                player.st.convertBuyableAmount = player.st.convertBuyableAmount.add(1)
            },
            unlocked() {return hasMilestone('st', 2)}
        },
    },
    buyables: {
        11: {
            title() {return "Point Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { 
                let cost = new Decimal(10).mul(x.add(1)).mul(new Decimal(1.25).pow(x))
                if (x.gte(30)) cost = cost.pow(1.33)
                return cost
            },
            display() {
                if (getBuyableAmount('st', 11).gte(30)) {
                    return "\
                    Multiplying points by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>"
                } else {
                    return "\
                    Multiplying points by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    "
                }
            },
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
            cost(x) {
                let cost = new Decimal(25).mul(x.mul(1.5).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(1.33)
                return cost
            },
            display() {
                if (getBuyableAmount('st', 13).gte(10)) {
                    return "\
                    Multiplying spacetime gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>"
                } else {
                    return "\
                    Multiplying spacetime gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    "
                }
                
            },
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
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x)) 
                if (x.gte(10)) cost = cost.pow(1.33)
                return cost
            },
            display() { 
                if (getBuyableAmount('st', 13).gte(10)) {
                    return "\
                    Multiplying space gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying space gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    " 
                }
                
            },
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
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x))
                if (x.gte(10)) cost = cost.pow(1.33)
                return cost
            },
            display() { 
                if (getBuyableAmount('st', 14).gte(10)) {
                    return "\
                    Multiplying time gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying time gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime\n\
                    " 
                }
            },
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
        21: {
            title() {return "Convert Rate (" + formatWhole(player.st.convertBuyableAmount) + "/" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) { 
                let cost = new Decimal(1000).mul(x.mul(0.25).add(1)).mul(new Decimal(1.05).pow(x))
                if (x.gte(10)) cost = cost.pow(1.75)
                return cost
            },
            display() { 
                if (getBuyableAmount('st', 21).gte(10)) {
                    return "\
                    Increasing convert rate by +" + format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" points\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing convert rate by +" + format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" points\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(player.st.convertBuyableAmount)
                return effect
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.st.convertBuyableAmount = player.st.convertBuyableAmount.add(1)
            },
            unlocked() {return hasMilestone('st', 2)}
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
                    ["display-text", () => {
                        if (tmp.st.getConvertRate.gt(1)) return "As your convert rate increases, convert output gets reduced by " + format(tmp.st.getConvertReduction.mul(100)) +"% per 1 convert rate."
                    }],
                    ["display-text", () => {
                        if (tmp.st.getConvertRate.gt(1)) return "Convert rate is dividing convert output by /" + format(new Decimal(1).div(new Decimal(1).sub(tmp.st.getConvertReduction).pow(tmp.st.getConvertRate)))
                    }],
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
                        if (player.st.converting && player.st.convertOutput == "SPACE") {
                            return "SPACE: " + format(player.spacePoints) + " (+" + format(getSpaceMultis().mul(tmp.st.getConvertOutputMult).mul(tmp.st.getConvertRate).mul(new Decimal(1).sub(tmp.st.getConvertReduction).pow(tmp.st.getConvertRate.sub(1)))) + "/s)"
                        } else {
                            return "SPACE: " + format(player.spacePoints) + " (+0.00/s)"
                        }
                    }],
                    ["display-text", () => {
                        if (player.st.converting && player.st.convertOutput == "TIME") {
                            return "TIME: " + format(player.timePoints) + " (+" + format(getTimeMultis().mul(tmp.st.getConvertOutputMult).mul(tmp.st.getConvertRate).mul(new Decimal(1).sub(tmp.st.getConvertReduction).pow(tmp.st.getConvertRate.sub(1)))) + "/s)"
                        } else {
                            return "TIME: " + format(player.timePoints) + " (+0.00/s)"
                        }
                    }],
                    "blank",
                    ["clickables", [1]],
                    "blank",
                    ["display-text", "Starting/ending a spacetime conversion will force a Spacetime reset"],
                    "blank",
                    ["row", [
                        ["clickable", 21],
                        ["buyables", [2]],
                        ["clickable", 22],
                    ]],
                    "blank",
                    ["display-text", () => {if (hasMilestone('st', 2)) return "This is a variable buyable, you can increase/decrease its amount up to its max without spending anything"}],
                    "blank",

                ],
            },
            "Spacetime Upgrade Module": {
                unlocked() {return hasMilestone('st', 0)},
                content: [
                    "blank",
                    "upgrades",
                    "blank",
                    ["buyables", [1]],
                    "blank"
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
            }
            if (player.st.convertOutput == "TIME") {
                player.timePoints = player.timePoints.add(getTimeMultis().mul(tmp.st.getConvertRate).mul(tmp.st.getConvertOutputMult).mul((new Decimal(1).sub(tmp.st.getConvertReduction)).pow(tmp.st.getConvertRate.sub(1))).mul(diff))
            } else if (player.st.convertOutput == "SPACE") {
                player.spacePoints = player.spacePoints.add(getSpaceMultis().mul(tmp.st.getConvertRate).mul(tmp.st.getConvertOutputMult).mul((new Decimal(1).sub(tmp.st.getConvertReduction)).pow(tmp.st.getConvertRate.sub(1))).mul(diff))
            } 
        }
    },
    layerShown() {return true}
})
