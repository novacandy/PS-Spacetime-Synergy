addLayer("st", {
    name: "spacetime",
    symbol() {
        if (inChallenge('mn', 11)) return "DST"
        return "ST"
    },
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
    color() {
        if (inChallenge('mn', 11)) return "#290e58"
        return "#360d87"
    },
    nodeStyle() {
        
        if (inChallenge('mn', 11)) return {
            "color": "#ffffff",
            "transform": "translateY(325px)"
        }
        return {
            "transform": "translateY(325px)"
        }
    },
    componentStyles: {
        "prestige-button"() {if (inChallenge('mn', 11)) return {
            "color": "#ffffff"
        }},
        "clickable"() {if (inChallenge('mn', 11)) return {
            "color": "#ffffff"
        }},
        "buyable"() {if (inChallenge('mn', 11)) return {
            "color": "#ffffff"
        }},
        "upgrade"() {if (inChallenge('mn', 11)) return {
            "color": "#ffffff"
        }},
        "milestone"() {if (inChallenge('mn', 11)) return {
            "color": "#ffffff",
            "background-color": "#0a371d"
        }},
    },
    requires: new Decimal(5),
    resource() {
        if (inChallenge('mn', 11)) return "dark spacetime"
        return "spacetime"
    },
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade('st', 14)) mult = mult.mul(upgradeEffect('st', 14))
        mult = mult.mul(buyableEffect('st', 12))
    	if (hasUpgrade('st', 23)) mult = mult.mul(upgradeEffect('st', 23))
        mult = mult.mul(tmp.mn.absoluteSpaceEffect)
        if (inChallenge('mn', 11)) {
            mult = new Decimal(1)
            mult = mult.mul(tmp.dk.getLunarACEffect)
        }
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
        if (hasUpgrade('mn', 22)) reduction = reduction.div(upgradeEffect('mn', 22))
            reduction = reduction.div(buyableEffect('st', 43))
        return reduction
    },
    getConvertInputs() {
        let inputs = ['SPACETIME']
        if (hasMilestone('mn', 2)) inputs.push('MOON ESSENCE')
        return inputs
    },
    getConverOutputs() {
        let outputs = []
        if (player.st.convertInput == 'SPACETIME') outputs = ['SPACE', 'TIME']
        if (player.st.convertInput == 'MOON ESSENCE') outputs = ['MOONSTONE', 'DARK ESSENCE']
        return outputs
    },
    getConvertOutputMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('st', 21)) mult = mult.mul(1.75)
        if (hasUpgrade('st', 23)) mult = mult.mul(upgradeEffect('st', 23))
        mult = mult.mul(tmp.st.getStoredAbsSpaceEffect)
        return mult
    },
    getAbsSpaceName() {
        if (tmp.st.getAbsoluteSpaceDims.eq(1)) return "Line"
        if (tmp.st.getAbsoluteSpaceDims.eq(2)) return "Square"
        if (tmp.st.getAbsoluteSpaceDims.eq(3)) return "Cube"
        if (tmp.st.getAbsoluteSpaceDims.eq(4)) return "Tesseract"
        if (tmp.st.getAbsoluteSpaceDims.eq(5)) return "Penteract"
        if (tmp.st.getAbsoluteSpaceDims.eq(6)) return "Hexeract"
        if (tmp.st.getAbsoluteSpaceDims.eq(7)) return "Hepteract"
        if (tmp.st.getAbsoluteSpaceDims.eq(8)) return "Octeract"
        if (tmp.st.getAbsoluteSpaceDims.eq(9)) return "Enneract"
        if (tmp.st.getAbsoluteSpaceDims.eq(10)) return "Dekeract"
        return format(tmp.st.getAbsoluteSpaceDims) + "-eract"
    },
    getStoredAbsSpaceEffect() {
        let effect = tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims).pow(0.33)
        return effect
    },
    getAbsoluteSpaceLengths() {
        let len = new Decimal(1)
        len = len.add(buyableEffect('st', 31))
        if (hasUpgrade('mn', 13)) len = len.mul(upgradeEffect('mn', 13))
        return len
    },
    getAbsoluteSpaceDims() {
        let dims = new Decimal(1)
        dims = dims.add(buyableEffect('st', 32))
        return dims
    },
    getSpaceBuildingPower() {
        let power = new Decimal(1)
        return power
    },
    getSpaceBuildingCap() {
        let cap = tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims).add(1).log(1e12).pow(1.25)
        return cap.floor()
    },
    getNextSpaceBuildingCap() {
        let next = new Decimal(1e12).pow(new Decimal(tmp.st.getSpaceBuildingCap.add(1)).pow(0.8))
        return next
    },
    getBaseOmegaSpace() {
        let space = tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims).div(1e11).add(1).log(10).pow(0.6)
        if (hasUpgrade('mn', 34)) space = tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims).div(1e11).add(1).log(10).pow(0.6).div(0.50)
        return space.floor()
    },
    getOmegaSpace() {
        let space = tmp.st.getBaseOmegaSpace
        space = space.sub(tmp.st.getSpentOmegaSpace)
        return space.floor()
    },
    getSpentOmegaSpace() {
        let spent = getBuyableAmount('st', 41).add(getBuyableAmount('st', 42).mul(2)).add(getBuyableAmount('st', 43).mul(3)).add(getBuyableAmount('st', 44).mul(4)).add(getBuyableAmount('st', 45).mul(12))
        return spent
    },
    getNextOmegaSpace() {
        let next = new Decimal(10).pow(new Decimal(tmp.st.getBaseOmegaSpace.add(1)).root(0.6)).mul(1e11)
        if (hasUpgrade('mn', 34)) next = new Decimal(10).pow(new Decimal(tmp.st.getBaseOmegaSpace.add(1).mul(0.50)).root(0.6)).mul(1e11)
        return next
    },
    hotkeys: [
        {key: "s", description: "S: Reset for spacetime", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Doubler",
            description() {return "Double point gain."},
            cost: new Decimal(5),
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
        12: {
            title: "Efficient Space",
            description() {return "Space grants twice as much point capacity."},
            cost: new Decimal(10),
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
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
                if (effect.gte(this.softcapStart())) effect = effect.div(this.softcapStart()).pow(0.2).mul(this.softcapStart())
                return effect
            },
            softcapStart() {
                let start = new Decimal(10)
                start = start.pow(buyableEffect('st', 41))
                return start
            },
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
        14: {
            title() {
                if (inChallenge('mn', 11)) return "<s>Further Expansion</s> Dark Revival"
                return "Further Expansion"
            },
            description() {
                if (inChallenge('mn', 11)) return "Earn a multiplier to <s>spacetime</s> darkness based on time. Effect: x" + format(this.effect())
                return "Earn a multiplier to spacetime based on time. Effect: x" + format(this.effect())
            },
            cost: new Decimal(25),
            effect() {
                let effect = player.timePoints.pow(buyableEffect('st', 42)).add(1).log(2).add(1)
                return effect
            },
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
        21: {
            title: "Efficient Conversion",
            description() {return "Multiply convert output by x1.75."},
            cost: new Decimal(10000),
            unlocked() {return hasMilestone('st', 2)},
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
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
            unlocked() {return hasMilestone('st', 2)},
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
        23: {
            title: "Tickspeed",
            description() {
                if (inChallenge('mn', 11)) return "Earn a multiplier to points, convert output, and <s>spacetime</s> darkness based on time, but also multiplies time consumption. Effect: x" + format(this.effect())
                return "Earn a multiplier to points, convert output, and spacetime based on time, but also multiplies time consumption. Effect: x" + format(this.effect())
            },
            cost: new Decimal(250000),
            effect() {
                let effect = player.timePoints.pow(0.25).div(5).add(1)
                return effect
            },
            unlocked() {return hasMilestone('st', 2)},
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
        24: {
            title: "Split In Two",
            description() {
                return "Halves convert rate reduction. Also unlocks a pair of new layers."
            },
            cost: new Decimal(1e6),
            unlocked() {return hasMilestone('st', 2)},
            style() {
                if (inChallenge('mn', 11) && hasUpgrade(this.layer, this.id)) return {
                    "background-color": "#0a371d"
                }
            }
        },
    },
    milestones: {
        0: {
            requirementDescription() {
                if (inChallenge('mn', 11)) return "Reset for dark spacetime once"
                return "Reset for spacetime once"
            },
            effectDescription: "Unlock the Upgrade Module",
            done() { return player.st.total.gte(16) }
        },
        1: {
            requirementDescription() {
                if (inChallenge('mn', 11)) return "50 dark spacetime"
                return "50 spacetime"
            },
            effectDescription: "Unlock enhancement buyables in the Upgrade Modules",
            done() { return player.st.points.gte(50)}
        },
        2: {
            requirementDescription() {
                if (inChallenge('mn', 11)) return "1000 dark spacetime"
                return "1000 spacetime"
            },
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
                }
                if (player.st.convertInput == "MOON ESSENCE" && player.mn.points.gte(1)) {
                    return true
                }
                return false
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
            title() {return "Point Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
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
                if (hasUpgrade('dk', 14)) base = base.add(0.1)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(50)
                limit = limit.add(buyableEffect('st', 44).mul(2))
                return limit
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        12: {
            title() {
                if (inChallenge('mn', 11)) return "<s>Spacetime</s> Darkness Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"
                return "Spacetime Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"
            },
            cost(x) {
                let cost = new Decimal(25).mul(x.mul(1.5).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(1.5)
                return cost
            },
            display() {
                if (inChallenge('mn', 11)) {
                    if (getBuyableAmount('st', 12).gte(10)) {
                        return "\
                        Multiplying <s>spacetime</s> darkness gain by x"+ format(this.effectBase()) + " each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" dark spacetime\n\
                        <b style='color: #ff0000'>[SOFTCAPPED]<b>"
                    } else {
                        return "\
                        Multiplying <s>spacetime</s> darkness gain by x"+ format(this.effectBase()) +" each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" dark spacetime\n\
                        "
                    }
                }
                if (getBuyableAmount('st', 12).gte(10)) {
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
                if (inChallenge('mn', 11)) base = new Decimal(2)
                if (hasUpgrade('dk', 14)) base = base.add(0.1)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(25)
                limit = limit.add(buyableEffect('st', 44))
                return limit
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        13: {
            title() {return "Space Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x)) 
                if (x.gte(10)) cost = cost.pow(1.5)
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
                if (hasUpgrade('dk', 14)) base = base.add(0.1)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(25)
                limit = limit.add(buyableEffect('st', 44))
                return limit
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('st', 1)}
        },
        14: {
            title() {return "Time Enhancement (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x))
                if (x.gte(10)) cost = cost.pow(1.5)
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
                if (hasUpgrade('dk', 14)) base = base.add(0.1)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(25)
                limit = limit.add(buyableEffect('st', 44))
                return limit
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
                if (x.gte(10)) cost = cost.pow(2.5)
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
        31: {
            title() {return "Lengthener (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(1.5).add(1)).mul(new Decimal(1.3).pow(x))
                return cost
            },
            display() { 
                if (getBuyableAmount('st', 31).gte(999)) {
                    return "\
                    Increasing the " + tmp.st.getAbsSpaceName + "'s side lengths by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" moon energy\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing the " + tmp.st.getAbsSpaceName + "'s side lengths by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" moon energy\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.mn.moonEnergy.gte(this.cost()) },
            buy() {
                player.mn.moonEnergy = player.mn.moonEnergy.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        32: {
            title() {return "Dimension Shift (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(new Decimal(100).pow(x))
                return cost
            },
            display() { 
                if (getBuyableAmount('st', 32).gte(999)) {
                    return "\
                    Increasing the " + tmp.st.getAbsSpaceName + "'s dimension by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" moon essence\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing the " + tmp.st.getAbsSpaceName + "'s dimensions by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" moon essence\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.mn.points.gte(this.cost()) },
            buy() {
                player.mn.points = player.mn.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                let limit = new Decimal(10)
                if (hasUpgrade('mn', 14)) limit = limit.add(upgradeEffect('mn', 14))
                return limit
            }
        },
        41: {
            title() {return "Primary Ω-Space Building (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")" + (this.freeLevels().gte(1) ? ("(+" + formatWhole(this.freeLevels())) + ")": "")},
            cost(x) { 
                let cost = new Decimal(1e18).mul(new Decimal(100).pow(x.pow(1.5)))
                return cost
            },
            display() {
                if (this.effect().gte(9999)) { // placeholder
                    return "\
                    Extending <b>Speedrun</b> softcap by +^"+ format(this.effectBase()) +" each (effect decays with amount)\n\
                    Currently: ^" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 1 Ω-space\n\
                    <b style='color: #ff0000'>[EFFECT SOFTCAPPED]<b>"
                } else {
                    return "\
                    Extending <b>Speedrun</b> softcap by +^"+ format(this.effectBase()) +" each (effect decays with amount)\n\
                    Currently: ^" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 1 Ω-space\n\
                    "
                }
            },
            effectBase() {
                let base = new Decimal(1)
                base = base.mul(tmp.st.getSpaceBuildingPower)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id).add(this.freeLevels()).pow(0.75)).add(1)
                return effect
            },
            purchaseLimit() {
                let limit = tmp.st.getSpaceBuildingCap
                return limit
            },
            freeLevels() {
                let lvl = new Decimal(0)
                if (hasUpgrade('dk', 31) && this.unlocked()) lvl = lvl.add(1)
                lvl = lvl.add(buyableEffect('st', 45))
                return lvl
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && tmp.st.getOmegaSpace.gte(1)},
            canSellOne() {return hasUpgrade('mn', 31)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            sellOne() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).sub(1).max(0))
            },
            unlocked() {return hasMilestone('mn', 101)}
        },
        42: {
            title() {return "Secondary Ω-Space Building (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")" + (this.freeLevels().gte(1) ? ("(+" + formatWhole(this.freeLevels())) + ")": "")},
            cost(x) { 
                let cost = new Decimal(1e21).mul(new Decimal(100).pow(x.pow(1.25)))
                return cost
            },
            display() {
                if (this.effect().gte(9999)) { // placeholder
                    return "\
                    Raising time amount in <b>" + tmp.st.upgrades[14].title + "</b>'s effect by +^"+ format(this.effectBase()) +" each (effect decays with amount)\n\
                    Currently: ^" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 2 Ω-space\n\
                    <b style='color: #ff0000'>[EFFECT SOFTCAPPED]<b>"
                } else {
                    return "\
                    Raising time amount in <b>" + tmp.st.upgrades[14].title + "</b>'s effect by +^"+ format(this.effectBase()) +" each (effect decays with amount)\n\
                    Currently: ^" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 2 Ω-space\n\
                    "
                }
            },
            effectBase() {
                let base = new Decimal(1.5)
                base = base.mul(tmp.st.getSpaceBuildingPower)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id).add(this.freeLevels()).pow(0.5)).add(1)
                return effect
            },
            purchaseLimit() {
                let limit = tmp.st.getSpaceBuildingCap
                return limit
            },
            freeLevels() {
                let lvl = new Decimal(0)
                if (hasUpgrade('dk', 31) && this.unlocked()) lvl = lvl.add(1)
                lvl = lvl.add(buyableEffect('st', 45))
                return lvl
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && tmp.st.getOmegaSpace.gte(2)},
            canSellOne() {return hasUpgrade('mn', 31)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            sellOne() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).sub(1).max(0))
            },
            unlocked() {return hasMilestone('mn', 101) && hasUpgrade('mn', 31)}
        },
        43: {
            title() {return "Tertiary Ω-Space Building (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")" + (this.freeLevels().gte(1) ? ("(+" + formatWhole(this.freeLevels())) + ")": "")},
            cost(x) { 
                let cost = new Decimal(1e24).mul(new Decimal(1000).pow(x.pow(1.2)))
                return cost
            },
            display() {
                if (this.effect().gte(9999)) { // placeholder
                    return "\
                    Dividing convert rate penalty by /"+ format(this.effectBase()) +" each\n\
                    Currently: /" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 3 Ω-space\n\
                    <b style='color: #ff0000'>[EFFECT SOFTCAPPED]<b>"
                } else {
                    return "\
                    Dividing convert rate penalty by /"+ format(this.effectBase()) +" each\n\
                    Currently: /" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 3 Ω-space\n\
                    "
                }
            },
            effectBase() {
                let base = new Decimal(4)
                base = base.mul(tmp.st.getSpaceBuildingPower)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id).add(this.freeLevels()))
                return effect
            },
            purchaseLimit() {
                let limit = tmp.st.getSpaceBuildingCap
                return limit
            },
            freeLevels() {
                let lvl = new Decimal(0)
                if (hasUpgrade('dk', 31) && this.unlocked()) lvl = lvl.add(1)
                lvl = lvl.add(buyableEffect('st', 45))
                return lvl
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && tmp.st.getOmegaSpace.gte(3)},
            canSellOne() {return hasUpgrade('mn', 31)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            sellOne() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).sub(1).max(0))
            },
            unlocked() {return hasMilestone('mn', 101) && hasUpgrade('mn', 32)}
        },
        44: {
            title() {return "Quaternary Ω-Space Building (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")" + (this.freeLevels().gte(1) ? ("(+" + formatWhole(this.freeLevels())) + ")": "")},
            cost(x) { 
                let cost = new Decimal(1e27).mul(new Decimal(10000).pow(x.pow(1.15)))
                return cost
            },
            display() {
                if (this.effect().gte(9999)) { // placeholder
                    return "\
                    Extending spacetime enhancement buyable caps by +"+ format(this.effectBase()) +" each (2x effective on <b>Point Enhancement</b>)\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 4 Ω-space\n\
                    <b style='color: #ff0000'>[EFFECT SOFTCAPPED]<b>"
                } else {
                    return "\
                    Extending spacetime enhancement buyable caps by +"+ format(this.effectBase()) +" each (2x effective on <b>Point Enhancement</b>)\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 4 Ω-space\n\
                    "
                }
            },
            effectBase() {
                let base = new Decimal(5)
                base = base.mul(tmp.st.getSpaceBuildingPower)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id).add(this.freeLevels()))
                return effect.floor()
            },
            purchaseLimit() {
                let limit = tmp.st.getSpaceBuildingCap
                return limit
            },
            freeLevels() {
                let lvl = new Decimal(0)
                if (hasUpgrade('dk', 31) && this.unlocked()) lvl = lvl.add(1)
                lvl = lvl.add(buyableEffect('st', 45))
                return lvl
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && tmp.st.getOmegaSpace.gte(4)},
            canSellOne() {return hasUpgrade('mn', 31)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            sellOne() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).sub(1).max(0))
            },
            unlocked() {return hasMilestone('mn', 101) && hasUpgrade('mn', 33)}
        },
        45: {
            title() {return "Quinary Ω-Space Building (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")" + (this.freeLevels().gte(1) ? ("(+" + formatWhole(this.freeLevels())) + ")": "")},
            cost(x) { 
                let cost = new Decimal(1e32).mul(new Decimal(1e6).pow(x.pow(1.25)))
                return cost
            },
            display() {
                if (this.effect().gte(9999)) { // placeholder
                    return "\
                    Adding +"+ format(this.effectBase()) +" extra levels to previous Ω-space buildings each \n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 12 Ω-space\n\
                    <b style='color: #ff0000'>[EFFECT SOFTCAPPED]<b>"
                } else {
                    return "\
                    Adding +"+ format(this.effectBase()) +" extra levels to previous Ω-space buildings each \n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" spacetime and 12 Ω-space\n\
                    "
                }
            },
            effectBase() {
                let base = new Decimal(1)
                base = base.mul(tmp.st.getSpaceBuildingPower)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id).add(this.freeLevels()))
                return effect.floor()
            },
            purchaseLimit() {
                let limit = tmp.st.getSpaceBuildingCap
                return limit
            },
            freeLevels() {
                let lvl = new Decimal(0)
                if (hasUpgrade('dk', 31) && this.unlocked()) lvl = lvl.add(1)
                return lvl
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && tmp.st.getOmegaSpace.gte(12)},
            canSellOne() {return hasUpgrade('mn', 31)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            sellOne() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).sub(1).max(0))
            },
            unlocked() {return hasMilestone('mn', 101) && hasUpgrade('mn', 33)}
        },
    },
    infoboxes: {
        conversionInfo: {
            title: "AUDIO LOG [ID: ST-CNV]",
            body() {return `
                DATE: 6/09/XX<br>
                AUTHOR(S): GRACE & CLYDE<br>
                TRANSCRIPT:<br>
                <br>
                GRACE: Hello, new player! Boss told Clyde and I that apparently we needed to explain to new players how EVERY feature within our sapling works, including earlygame ones!<br><br>
                GRACE: Really, boss? You think our players are idiots? I'm not explaining how this stuff works, it's so obvious-<br><br>
                CLYDE: (sigh) You want us to get evicted or not? Explain how the Spacetime Conversion Module works!<br><br>
                GRACE: Fine! (clears throat) The Spacetime Conversion Module is a section of the Spacetime layer where you can convert certain resources into another.<br><br>
                GRACE: The first checklist determines your input currency, and- ugh, THIS IS STUPID! There are LABELS, it's not that hard to read-<br><br>
                CLYDE: Whatever. I'll take over for now. The first checklist determines your input currency, and the second determines your output currency.<br><br>
                CLYDE: As of right now, you can only convert your fifteen (15) given spacetime into either Space or Time, but more options will be unlocked later.<br><br>
                CLYDE: For now, you'll want to obtain five (5) space and five (5) time, which is enough to allow you to generate the five (5) points needed to perform a Spacetime reset.<br><br>
                CLYDE: See, Grace? It's not that hard to simply explain.<br><br>
                GRACE: But we're practically stating the obvious here! If only I could try convincing-<br><br>
                CLYDE: Remember what happened last time you tried that?<br><br>
                GRACE: Ugh, nevermind then, let's just start another audio recording for the next feature. What was it again?<br><br>
                CLYDE: The Upgrade Module.`
            },
            unlocked() {return !inChallenge('mn', 11)}
        },
        upgradeInfo: {
            title: "AUDIO LOG [ID: ST-UPG]",
            body() {return `
                DATE: 6/09/XX<br>
                AUTHOR(S): GRACE & CLYDE<br>
                TRANSCRIPT:<br>
                <br>
                GRACE: We have to explain THAT? Really?<br><br>
                CLYDE: Listen, Grace. We were given a job by the boss, and we need to follow them. If you don't want to listen, so be it.<br><br>
                CLYDE: Also, we've been given only one (1) take to do these recordings, so please, stop interrupting.<br><br>
                CLYDE: Where were we? Oh right, the Upgrade Module. Here, you can purchase upgrades that'll help a lot with general progression.<br><br>
                CLYDE: You'll also eventually unlock buyables that'll multiply your point, spacetime, space, and time earnings.<br><br> 
                CLYDE: Your next goal will be to reach one million (1000000) spacetime to unlock the next two (2) layers. This will take a few minutes of grinding, so good luck, player!`
            },
            unlocked() {return !inChallenge('mn', 11)}
        }
    },
    microtabs: {
        spacetime: {
            "Spacetime Conversion Module": {
                content: [
                    "blank",
                    ["infobox", "conversionInfo"],
                    "blank",
                    ["display-text", "<h3>INPUT</h3>"],
                    ["drop-down", ["convertInput", () => {return tmp.st.getConvertInputs}]],
                    "blank",
                    ["display-text", "<h3>OUTPUT</h3>"],
                    ["drop-down", ["convertOutput", () => {return tmp.st.getConverOutputs}]],
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
                        let displayCurrency = new Decimal(0)
                        if (player.st.convertInput == "SPACETIME") displayCurrency = player.st.points
                        if (player.st.convertInput == "MOON ESSENCE") displayCurrency = player.mn.points
                        return player.st.convertInput + ": " + format(displayCurrency) + " (-" + (player.st.converting ? format(tmp.st.getConvertRate) : "0.00") + "/s)"
                    }],
                    ["display-text", "↓"],
                    ["display-text", () => {
                        let displayCurrency = new Decimal(0)
                        let displayMult = new Decimal(0)
                        let convertMult = tmp.st.getConvertOutputMult.mul(tmp.st.getConvertRate).mul(new Decimal(1).sub(tmp.st.getConvertReduction).pow(tmp.st.getConvertRate.sub(1)))
                        if (player.st.convertOutput == "SPACE") {
                            displayCurrency = player.spacePoints
                            displayMult = getSpaceMultis()
                        }
                        if (player.st.convertOutput == "TIME") {
                            displayCurrency = player.timePoints
                            displayMult = getTimeMultis()
                        }
                        if (player.st.convertOutput == "MOONSTONE") {
                            displayCurrency = player.mn.moonstone
                            displayMult = tmp.mn.getMoonstoneMultis
                        }
                        if (player.st.convertOutput == "DARK ESSENCE") {
                            displayCurrency = player.mn.darkEssence
                            displayMult = tmp.mn.getDarkEssenceMultis
                        }
                        return player.st.convertOutput + ": " + format(displayCurrency) + " (+" + (player.st.converting ? format(displayMult.mul(convertMult)) : "0.00") + "/s)"
                    }],
                    "blank",
                    ["clickables", [1]],
                    "blank",
                    ["display-text", "Starting/ending a spacetime conversion will force a Spacetime reset"],
                    "blank",
                    ["row", [
                        ["clickable", 21],
                        ["buyable", 21],
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
                    ["infobox", "upgradeInfo"],
                    "blank",
                    "upgrades",
                    "blank",
                    ["buyables", [1]],
                    "blank"
                ],
            },
            "Absolute Spacetime Module": {
                unlocked() {return hasMilestone('mn', 1) || false},
                content: [
                    "blank",
                    ["microtabs", "absoluteSpacetime"]
                ]
            }
        },
        absoluteSpacetime: {
            "Main Sub-Module": {
                content: [
                    "blank",
                    ["display-text", "Requires both Absolute Space and Absolute Time to be unlocked at the same time"],
                ],
                unlocked() {return false}
            },
            "Absolute Space Sub-Module": {
                content: [
                    "blank",
                    ["display-text", () => {return "<h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>The " + tmp.st.getAbsSpaceName + "</h2> has a side length of <h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>" + format(tmp.st.getAbsoluteSpaceLengths) + "</h2> and is storing <h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>" + format(tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims)) +  "</h2> absolute space"}],
                    ["display-text", () => {return "Stored absolute space is multiplying convert output by " + format(tmp.st.getStoredAbsSpaceEffect)}],
                    ["display-text", () => {return "Performing moon resets will grant absolute space in the moon layer"}],
                    "blank",
                    ["row", [
                        ["buyable", 31],
                        "blank",
                        ["buyable", 32]
                    ]],
                    "blank",
                    ["display-text", () => {return "Ω-Space Building Power: " + format(tmp.st.getSpaceBuildingPower.mul(100)) + "%"}],
                    ["display-text", () => {return "Stored absolute space is granting an Ω-space building cap of " + formatWhole(tmp.st.getSpaceBuildingCap) + " (Next at " + format(tmp.st.getNextSpaceBuildingCap) + ")"}],
                    ["display-text", () => {return "Stored absolute space is also granting " + formatWhole(tmp.st.getOmegaSpace) + " Ω-space for absolute space buildings (Next at " + format(tmp.st.getNextOmegaSpace) + ")"}],
                    "blank",
                    ["buyables", [4]]         
                ],
                unlocked() {return hasMilestone('mn', 2)}
            },
            "Absolute Time Sub-Module": {
                content: [
                    "blank",
                ],
                unlocked() {return false}
            }
        },
    },
    tabFormat: [
        ["row", [
            () => {if (!inChallenge('mn', 11)) return "main-display"},
            ["display-text", () => {if (inChallenge('mn', 11)) return "You have <h2 style='color: #290e58; text-shadow: 0px 0px 10px #290e58'>" + formatWhole(player.st.points) + "</h2> <h3 style='color: #4f4f4f; text-shadow: 0px 0px 10px #4f4f4f'>dark</h3> spacetime<br><br>"}],
        ]],
        "prestige-button",
        "blank",
        "milestones",
        ["microtabs", "spacetime"]
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
        let keep = [];
        keep.push("milestones")
        layerDataReset(this.layer, keep);
    },
    update(diff) {
        if (player.points.gte(getPointCapacity())) player.points = getPointCapacity()
        if (player.st.converting == true) {
            // convert inputs
            if (player.st.convertInput == "SPACETIME") {
                player.st.points = player.st.points.sub(tmp.st.getConvertRate.mul(diff)).max(0)
                if (player.st.points.eq(0)) player.st.converting = false
            }
            if (player.st.convertInput == "MOON ESSENCE") {
                player.mn.points = player.mn.points.sub(tmp.st.getConvertRate.mul(diff)).max(0)
                if (player.mn.points.eq(0)) player.st.converting = false
            }
            let convertMult = tmp.st.getConvertRate.mul(tmp.st.getConvertOutputMult).mul((new Decimal(1).sub(tmp.st.getConvertReduction)).pow(tmp.st.getConvertRate.sub(1))).mul(diff)
            // convert outputs
            if (player.st.convertOutput == "TIME") {
                player.timePoints = player.timePoints.add(getTimeMultis().mul(convertMult))
            }
            if (player.st.convertOutput == "SPACE") {
                player.spacePoints = player.spacePoints.add(getSpaceMultis().mul(convertMult))
            }
            if (player.st.convertOutput == "MOONSTONE") {
                player.mn.moonstone = player.mn.moonstone.add(tmp.mn.getMoonstoneMultis.mul(convertMult))
            }
            if (player.st.convertOutput == "DARK ESSENCE") {
                player.mn.darkEssence = player.mn.darkEssence.add(tmp.mn.getDarkEssenceMultis.mul(convertMult))
            } 
        }
        if (!tmp.st.getConverOutputs.includes(player.st.convertOutput)) player.st.convertOutput = tmp.st.getConverOutputs[0]
    },
    layerShown() {return true}
})
