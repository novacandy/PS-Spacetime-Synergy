addLayer("mn", {
    name: "moon",
    symbol() {
        if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return "DM"
        return "MN"
    },
    row: 1,
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),

        moonEnergy: new Decimal(0),
        absoluteSpace: new Decimal(0),

        moonstone: new Decimal(0),
        radiance: new Decimal(0),
        darkEssence: new Decimal(0),
    }},
    onPrestige() {
        player.spacePoints = new Decimal(15)
        player.timePoints = new Decimal(5)
        player.mn.moonEnergy = new Decimal(0)
        if (hasMilestone('mn', 1)) {
            player.mn.absoluteSpace = player.mn.absoluteSpace.add(tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims))
            
        }
    },
    effectDescription() {
       return "which multiplies point capacity by x" + format(tmp.mn.effect)
    },
    effect() {
        let effect = new Decimal(1).mul(player.mn.points.pow(0.5)).add(1)
        return effect
    },
    nodeStyle() {
        if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff",
            "animation": 'moonOrbit 25s infinite linear',
        }
        return {
            "animation": 'moonOrbit 25s infinite linear',
        }
    },
    color() {
        if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return "#3f3f3f"
        return "#7f7f7f"
    },
    componentStyles: {
        "prestige-button"() {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff"
        }},
        "clickable"() {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff"
        }},
        "buyable"() {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff"
        }},
        "upgrade"() {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff"
        }},
        "milestone"() {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff",
            "background-color": "#0a371d"
        }},
    },
    requires: new Decimal(10000),
    resource() {
        if (inChallenge('mn', 11)) return "dark moon essence"
        return "moon essence"
    },    
    baseResource: "space",
    baseAmount() {return player.spacePoints},
    type: "normal",
    exponent: 0.9,

    softcap() {
        let softcap = new Decimal(1e36)
        return softcap
    },
    softcapPower() {
        let power = new Decimal(0.1)
        return power
    },
    passiveGeneration() {
        return buyableEffect('mn', 31)
    },

    gainMult() {
        let mult = new Decimal(1)
        mult = mult.mul(buyableEffect('mn', 13))
        if (inChallenge('mn', 11)) mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    moonEnergyMult() {
        let mult = player.mn.points.pow(0.75)
        if (hasUpgrade('mn', 42)) mult = player.mn.points.pow(0.775)
        if (hasUpgrade('dk', 12)) mult = mult.mul(upgradeEffect('dk', 12))
        return mult
    },
    moonEnergyEffect() {
        let effect = player.mn.moonEnergy.pow(0.5).add(1)
        if (effect.gte(10)) effect = effect.sub(10).pow(0.75).add(10)
        return effect
    },
    absoluteSpaceEffect() {
        let effect = player.mn.absoluteSpace.add(1).log(10).pow(1.5).add(1)
        return effect
    },
    getMoonstoneMultis() {
        let mult = new Decimal(1)
        return mult
    },
    moonstoneEffect() {
        let effect = player.mn.moonstone.add(1).log(5)
        return effect
    },
    getRadianceGen() {
        let gen = tmp.mn.moonstoneEffect
        gen = gen.mul(buyableEffect('mn', 22))
        return gen
    },
    getRadianceExponent() {
        let exp = new Decimal(1)
        exp = exp.add(buyableEffect('mn', 21))
        if (hasUpgrade('mn', 12)) exp = exp.add(upgradeEffect('mn', 12))
        if (hasUpgrade('mn', 23)) exp = exp.add(upgradeEffect('mn', 23))
        return exp
    },
    getRadianceOverflowStart() {
        let start = new Decimal(1e9)
        return start
    },
    getRadianceOverflowDiv() {
        let div = player.mn.radiance.div(tmp.mn.getRadianceOverflowStart).pow(0.1).max(1)
        return div
    },
    getDarkEssenceMultis() {
        let mult = new Decimal(1)
        return mult
    },
    getDarkEssenceEffect() {
        let effect = player.mn.darkEssence.add(1).log(2)
        return effect
    },
    hotkeys: [
        {key: "m", description: "M: Reset for moon essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Brighten Up The Night",
            description: "Unlock the potential of your Dark Essence",
            cost: new Decimal(1e7),
            currencyLayer: "mn",
            currencyDisplayName: "radiance",
            currencyInternalName: "radiance",
        },
        12: {
            title: "Starry Sky",
            description() {return "Space increases the radiance exponent. Effect: +" + format(this.effect())},
            cost: new Decimal(1e9),
            effect() {
                let effect = player.spacePoints.add(1).log(50).pow(0.5).div(5)
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "radiance",
            currencyInternalName: "radiance",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        13: {
            title: "Even More Spacious",
            description() {return "Radiance exponent multiplies the " + tmp.st.getAbsSpaceName + "'s side lengths. Effect: x" + format(this.effect())},
            cost: new Decimal(1e15),
            effect() {
                let effect = tmp.mn.getRadianceExponent.add(1).pow(0.5)
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "radiance",
            currencyInternalName: "radiance",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        14: {
            title: "Absolute Space Galaxy?",
            description() {return "Quaternary Ω-space building increases <b>Dimension Shift</b> limit at 20% efficiency. Currently: +" + format(this.effect())},
            cost: new Decimal(1e24),
            effect() {
                let effect = buyableEffect('st', 44).div(5).floor()
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "radiance",
            currencyInternalName: "radiance",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        21: {
            title: "Enhancing Exponentially",
            description() {return "Raise <b>Radiant Enhancement Type-B</b>'s effect to the power of ^1.5."},
            cost: new Decimal(10000),
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        22: {
            title: "Radiant Conversion",
            description() {return "Divide convert rate penalty based on radiance. Effect: /" + format(this.effect())},
            cost: new Decimal(100000),
            effect() {
                let effect = player.mn.radiance.add(1).log(10).pow(0.2).add(1)
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        23: {
            title: "Extraponential",
            description() {return "Earn an extra +0.05 radiance exponent per 4 <b>Radiant Enhancement Type-B</b>. Effect: +" + format(this.effect())},
            cost: new Decimal(1000000),
            effect() {
                let effect = getBuyableAmount('mn', 21).div(4).floor().mul(0.05)
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        24: {
            title: "Will I Ever Fill This Up?",
            description() {return "Earn a multiplier to points based on point capacity. Effect: x" + format(this.effect())},
            cost: new Decimal(1e17),
            effect() {
                let effect = getPointCapacity().add(1).log(10).pow(1.25).add(1)
                return effect
            },
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        31: {
            title: "Spacetime Compression",
            description() {return "Unlock the Secondary Ω-Space Building. Unlock the ability to destroy individual Ω-buildings."},
            cost: new Decimal(1e12),
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        32: {
            title: "Less Is More",
            description() {return "Unlock the Tertiary Ω-Space Building. Remember that there's useful upgrades in DSoTM you can obtain! :>"},
            cost: new Decimal(1e23),
            currencyLayer: "mn",
            currencyDisplayName: "radiance",
            currencyInternalName: "radiance",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        33: {
            title: "Past Your Limits",
            description() {return "Unlock the Quaternary Ω-Space Building."},
            cost: new Decimal(1e18),
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        34: {
            title: "All At Once",
            description() {return "Unlock the Quinary Ω-Space Building. Ω-space requirement scales 50% slower."},
            cost: new Decimal(1e18),
            currencyLayer: "mn",
            currencyDisplayName: "moonstone",
            currencyInternalName: "moonstone",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        41: {
            fullDisplay() {return `<h3>Bright Side of The Moon?</h3><br>
                Unlock the Lunarity Module.<br><br>
                Cost: 1e24 moonstone, 1e28 radiance`
            },
            canAfford() {return player.mn.moonstone.gte(1e24) && player.mn.radiance.gte(1e28)},
            pay() {player.mn.moonstone = player.mn.moonstone.sub(1e24), player.mn.radiance = player.mn.radiance.sub(1e28)},
            unlocked() {return hasUpgrade('mn', 34)}
        },
        42: {
            fullDisplay() {
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 2) {
                    return `
                    <h3><s>Energized Moon</s> Less Really Is More</h3><br>
                    Non-free levels of the Tertiary Ω-Space building add free Lunar Alternators. Effect: +${format(this.effect())}<br><br>
                    Cost: 1e26 moonstone, 100 lunarity`
                }
                return `
                <h3>Energized Moon</h3><br>
                Improve moon essence to moon energy exponent. (0.75 -> 0.775)<br><br>
                Cost: 1e26 moonstone, 100 lunarity`
            },
            canAfford() {return player.mn.moonstone.gte(1e26) && getBuyableAmount('mn', 31).gte(100)},
            pay() {player.mn.moonstone = player.mn.moonstone.sub(1e26), setBuyableAmount('mn', 31, getBuyableAmount('mn', 31).sub(100))},
            effect() {
                let effect = getBuyableAmount('st', 43).mul(2)
                return effect
            },
            unlocked() {return hasUpgrade('mn', 41)}
        },
        43: {
            fullDisplay() {return `
                <h3>This Building Sucks!</h3><br>
                Double the Quinary Ω-Space Building's base effect and give it a free level.<br><br>
                Cost: 1e34 radiance, 1,000,000 lunarity`
            },
            canAfford() {return player.mn.radiance.gte(1e34) && getBuyableAmount('mn', 31).gte(1e6)},
            pay() {player.mn.moonstone = player.mn.radiance.sub(1e34), setBuyableAmount('mn', 31, getBuyableAmount('mn', 31).sub(1e6))},
            unlocked() {return hasUpgrade('mn', 41)}
        },
        44: {
            fullDisplay() {return `
                <h3>You Know What Sucks More, Though?</h3><br>
                Unlock Total Eclipses. See you on the other side... :><br><br>
                Cost: 1e43 moonstone, 1e9 regolith dust`
            },
            canAfford() {return player.mn.moonstone.gte(1e43) && getBuyableAmount('mn', 43).gte(1e9)},
            pay() {player.mn.moonstone = player.mn.moonstone.sub(1e43), setBuyableAmount('mn', 43, getBuyableAmount('mn', 43).sub(1e9))},
            unlocked() {return hasUpgrade('mn', 41)}
        }
    },
    milestones: {
        0: {
            requirementDescription: "Reset for moon essence once",
            effectDescription: "Start resets with 15 space and 5 time, unlock a new space buyable",
            done() {return player.mn.points.gte(1)}
        },
        1: {
            requirementDescription: "10 moon essence",
            effectDescription: "Start resets with all Spacetime upgrades, 50 Point Enhancement levels, and 25 Spacetime, Space, and Time Enhancement levels. Unlock the Absolute Space Module (in Spacetime)",
            done() {return player.mn.points.gte(10)}
        },
        2: {
            requirementDescription: "1000 moon essence",
            effectDescription: "Start resets with 100 Convert Rate levels, unlock Dark Side Module and a new spacetime conversion input",
            done() {return player.mn.points.gte(1000)}
        },
        100: {
            requirementDescription: "Complete Depth 0",
            effectDescription: "You can buy max Convert Rate and Lengtheners, unlock two new space buyables and more moonstone upgrades",
            done() {return challengeCompletions('mn', 11) >= 1}
        },
        101: {
            requirementDescription: "Complete Depth 1",
            effectDescription: "You can buy max spacetime enhancement buyables, unlock Absolute Space Buildings and even more moonstone upgrades",
            done() {return challengeCompletions('mn', 11) >= 2}
        },
        102: {
            requirementDescription: "Complete Depth 2",
            effectDescription: "Re-unlock the Sun",
            done() {return challengeCompletions('mn', 11) >= 3}
        },
        200: {
            requirementDescription: "1000 lunarity",
            effectDescription: "Generate 5% of lunarity gain per second",
            done() {return getBuyableAmount('mn', 31).gte(1000)}
        }
    },
    clickables: {
    },
    buyables: {
        11: {
            title() {return "Space Points (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(100).mul(x.mul(1.25).add(1)).mul(new Decimal(1.25).pow(x))
                if (x.gte(15)) cost = cost.pow(1.25)
                if (hasUpgrade('dk', 13)) cost = cost.div(upgradeEffect('dk', 13))
                return cost
            },
            display() { 
                if (getBuyableAmount('mn', 11).gte(15)) {
                    return "\
                    Multiplying point gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying point gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1.1)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(250)
                return limit
            },
            canAfford() { return player.spacePoints.gte(this.cost()) },
            buy() {
                player.spacePoints = player.spacePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('mn', 0)}
        },
        12: {
            title() {
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) return "Spacier <s>Spacetime</s> Generators (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"
                return "Spacier Spacetime (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"
            },
            cost(x) {
                let cost = new Decimal(100000).mul(x.mul(1.25).add(1)).mul(new Decimal(1.25).pow(x))
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) cost = cost.div(1000)
                if (x.gte(15)) cost = cost.pow(1.25)
                if (hasUpgrade('dk', 13)) cost = cost.div(upgradeEffect('dk', 13))
                return cost
            },
            display() { 
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) {
                    if (getBuyableAmount('mn', 12).gte(15)) {
                        return "\
                        Dividing lunar generator req by /"+ format(this.effectBase()) +" each\n\
                        Currently: /" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" space\n\
                        <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                    } else {
                        return "\
                        Dividing lunar generator req by /"+ format(this.effectBase()) +" each\n\
                        Currently: /" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" space\n\
                        " 
                    }
                }
                if (getBuyableAmount('mn', 12).gte(15)) {
                    return "\
                    Multiplying spacetime gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying spacetime gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1.075)
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) base = new Decimal(1.5)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(250)
                return limit
            },
            canAfford() { return player.spacePoints.gte(this.cost()) },
            buy() {
                player.spacePoints = player.spacePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('mn', 100)}
        },
        13: {
            title() {
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) return "Space <s>Essence</s> Power (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"
                return "Space Essence (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"
            },
            cost(x) {
                let cost = new Decimal(10000000).mul(x.mul(1.25).add(1)).mul(new Decimal(1.25).pow(x))
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) cost = cost.div(10000)
                if (x.gte(15)) cost = cost.pow(1.25)
                if (hasUpgrade('dk', 13)) cost = cost.div(upgradeEffect('dk', 13))
                return cost
            },
            display() { 
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) {
                    if (getBuyableAmount('mn', 13).gte(15)) {
                        return "\
                        Multiplying lunar generator power generation by x"+ format(this.effectBase()) +" each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" space\n\
                        <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                    } else {
                        return "\
                        Multiplying lunar generator power generation by x"+ format(this.effectBase()) +" each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" space\n\
                        " 
                    }
                }
                if (getBuyableAmount('mn', 13).gte(15)) {
                    return "\
                    Multiplying moon essence gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying moon essence gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" space\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1.05)
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) base = new Decimal(1.5)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(250)
                return limit
            },
            canAfford() { return player.spacePoints.gte(this.cost()) },
            buy() {
                player.spacePoints = player.spacePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('mn', 100)}
        },
        21: {
            title() {return "Radiant Enhancement Type-A (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(100).mul(x.mul(2).add(1)).mul(new Decimal(2.5).pow(x))
                if (x.gte(10)) cost = new Decimal(100).mul(x.mul(2).add(1)).mul(new Decimal(3).add(x.mul(0.1)).pow(x))
                return cost
            },
            display() { 
                if (getBuyableAmount('mn', 21).gte(10)) {
                    return "\
                    Increasing radiance exponent by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" radiance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing radiance exponent by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" radiance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(0.1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.mn.radiance.gte(this.cost()) },
            buy() {
                player.mn.radiance = player.mn.radiance.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        22: {
            title() {return "Radiant Enhancement Type-B (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1000).mul(x.mul(2).add(1)).mul(new Decimal(1.25).pow(x))
                if (x.gte(999)) cost = new Decimal(100).mul(x.mul(2).add(1)).mul(new Decimal(2).pow(x))
                return cost
            },
            display() { 
                if (getBuyableAmount(this.layer, this.id).gte(999)) {
                    return "\
                    Increasing base radiance generation multiplier by +"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" radiance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing base radiance generation multiplier by +"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" radiance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                if (hasUpgrade('mn', 21)) effect = effect.pow(1.5)
                return effect
            },
            canAfford() { return player.mn.radiance.gte(this.cost()) },
            buy() {
                player.mn.radiance = player.mn.radiance.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        31: {
            title() {return "Lunarity (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = player.mn.points.div(1e36).pow(0.9)
                gain = gain.mul(buyableEffect('mn', 41))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Moon Essence for " + format(this.cost()) + " Lunarity\n\
                Generates " + format(this.effect().mul(100)) + "% of Spacetime and Moon Essence gain on reset per second\n\
                Requires: 1e36 moon essence\n\
                " 
            },
            effect() {
                let effect = Decimal.sub(1, Decimal.div(1, getBuyableAmount('mn', 31).add(1).pow(0.25))).pow(3)
                return effect
            },
            canAfford() { return player.mn.points.gte(1e36) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('mn', true)
                player.mn.points = new Decimal(0)
            },
        },
        41: {
            title() {return "Lunar Cores (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('mn', 31).div(10).pow(0.25)
                return gain
            },
            display() {
                return "\
                Sacrifice all your Lunarity for " + format(this.cost()) + " Lunar Cores\n\
                Multiplies lunarity gain by x" + format(this.effect()) + "\n\
                Requires: 10 lunarity\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('mn', 41).add(1).log(2).add(1).log(2).add(1)
                return effect
            },
            canAfford() { return getBuyableAmount('mn', 31).gte(10) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('mn', true)
                setBuyableAmount('mn', 31, new Decimal(0))
            },
        },
        42: {
            title() {return "Impact Craters (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('mn', 31).div(100).pow(0.5).mul(player.mn.moonEnergy.div(1e30).pow(0.75))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Lunarity and Moon Energy for " + format(this.cost()) + " Impact Craters\n\
                Multiplies " + tmp.st.getAbsSpaceName + " side lengths by x" + format(this.effect()) + "\n\
                Requires: 100 lunarity, 1e30 moon energy\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('mn', 42).add(1).log(10).pow(0.9).add(1)
                return effect
            },
            canAfford() { return getBuyableAmount('mn', 31).gte(100) && player.mn.moonEnergy.gte(1e30) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('mn', true)
                setBuyableAmount('mn', 31, new Decimal(0))
                player.mn.moonEnergy = new Decimal(0)
            },
        },
        43: {
            title() {return "Regolith Dust (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('mn', 31).div(500).pow(0.5).mul(player.mn.moonstone.div(1e27).pow(0.4))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Lunarity and Moonstone for " + format(this.cost()) + " Regolith Dust\n\
                Increases Ω-Space Building Power by +" + format(this.effect().mul(100)) + "%\n\
                Requires: 500 lunarity, 1e30 moonstone\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('mn', 43).add(1).log(10).add(1).log(10).div(10)
                return effect
            },
            canAfford() { return getBuyableAmount('mn', 31).gte(500) && player.mn.moonstone.gte(1e30) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('mn', true)
                setBuyableAmount('mn', 31, new Decimal(0))
                player.mn.moonstone = new Decimal(0)
            },
        },
        51: {
            title() {return "Total Eclipses (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('mn', 31).div(5000000).pow(0.33).mul(player.mn.darkEssence.div(1e43).pow(0.33))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Lunarity and Dark Essence for " + format(this.cost()) + " Total Eclipses\n\
                Raises base darkness gain to the power of ^" + format(this.effect()) + "\n\
                Requires: 5,000,000 lunarity, 1e43 dark essence\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('mn', 51).add(1).log(2).add(1).log(2).add(1)
                return effect
            },
            canAfford() { return getBuyableAmount('mn', 31).gte(5000000) && player.mn.darkEssence.gte(1e43) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('mn', true)
                setBuyableAmount('mn', 31, new Decimal(0))
                player.mn.darkEssence = new Decimal(0)
            },
        }
    },
    challenges: {
        11: {
            name: "Dark Side of The Moon",
            fullDisplay() {return `
                Envelops your ${this.currenciesAffectedDisplay()[challengeCompletions('mn', 11)]} in darkness, resetting them and making their direct multipliers ineffective. Unlocks challenge-exclusive layers based on Depth.<br>
                Goal: ${format(this.goals()[challengeCompletions('mn', 11)])} darkness (Depth ${formatWhole(challengeCompletions('mn', 11))}/5)<br>
               `
            },
            currenciesAffectedDisplay() {
                return ['Spacetime', 'Spacetime, Moon Essence, and Moon Energy', 'Spacetime, Moon Essence, Moon Energy, Moonstone, and Radiance', 'Spacetime, Moon Essence, Moon Energy, Moonstone, Radiance, Sun Essence, and Sun Energy']
            },
            onEnter() {
                doReset('mn', true)
                player.spacePoints = new Decimal(15)
                player.timePoints = new Decimal(5)
                if (challengeCompletions('mn', 11) >= 1) {
                    player.mn.points = new Decimal(0)
                    player.mn.moonEnergy = new Decimal(0)
                    setBuyableAmount('st', 11, new Decimal(0))
                    setBuyableAmount('st', 12, new Decimal(0))
                    setBuyableAmount('st', 13, new Decimal(0))
                    setBuyableAmount('st', 14, new Decimal(0))
                    setBuyableAmount('mn', 11, new Decimal(0))
                    setBuyableAmount('mn', 12, new Decimal(0))
                    setBuyableAmount('mn', 13, new Decimal(0))
                }
                if (challengeCompletions('mn', 11) >= 2) {
                    player.mn.moonstone = new Decimal(0)
                    player.mn.radiance = new Decimal(0)
                    setBuyableAmount('mn', 21, new Decimal(0))
                    setBuyableAmount('mn', 22, new Decimal(0))
                }
            },
            onExit() {
                player.dk.darkness = new Decimal(0)
                player.dk.lunarGenerators = new Decimal(0)
                player.dk.lunarGenPower = new Decimal(0)
                player.dk.lunarAlternators = new Decimal(0)
                player.dk.lunarAC = new Decimal(0)
                player.dk.lunarDynamos = new Decimal(0)
                player.dk.lunarDC = new Decimal(0)
                setBuyableAmount('dk', 11, new Decimal(0))
                setBuyableAmount('dk', 12, new Decimal(0))

                let keptUpgrades = []

                if(hasUpgrade('dk', 21)) keptUpgrades.push(11, 21)
                if(hasUpgrade('dk', 22)) keptUpgrades.push(12, 22)
                if(hasUpgrade('dk', 23)) keptUpgrades.push(13, 23)
                if(hasUpgrade('dk', 24)) keptUpgrades.push(14, 24)
                if(hasUpgrade('dk', 25)) keptUpgrades.push(15, 25)

                if(hasUpgrade('dk', 41)) keptUpgrades.push(31, 41)
                if(hasUpgrade('dk', 42)) keptUpgrades.push(32, 42)
                if(hasUpgrade('dk', 43)) keptUpgrades.push(33, 43)
                if(hasUpgrade('dk', 44)) keptUpgrades.push(34, 44)
                if(hasUpgrade('dk', 45)) keptUpgrades.push(35, 45)

                console.log(keptUpgrades)
                player.dk.upgrades = []
                player.dk.upgrades.push(...keptUpgrades)
            },
            goals() {
                return [new Decimal(10000000), new Decimal(1e15), new Decimal(1e36), new Decimal(1e100)]
            },
            canComplete() {return player.dk.darkness.gte(this.goals()[challengeCompletions('mn', 11)])},
            style() {return {
                "width": "350px",
                "height": "350px",
                "border-color": "#0f0f0f",
                "background-color": "rgba(0, 0, 0, 0)",
                "color": "#7f7f7f",
                "text-shadow": "0px 0px 10px #4f4f4f",
                "box-shadow": "0px 0px 10px #4f4f4f",
                "align-content": "center"
            }},
            completionLimit: 6
        },
    },
    microtabs: {
        moon: {
            "Space Buyable Module": {
                content: [
                    "blank",
                    ["infobox", "moonEssenceInfo"],
                    "blank",
                    ["buyables", [1]]
                ]
            },
            "Dark Side Module": {
                content: [
                    "blank",
                    ["microtabs", "darkSide"]
                ],
                unlocked() {return hasMilestone('mn', 2)}
            },
            "Lunarity Module": {
                content: [
                    "blank",
                    ["display-text", "All lunarity buyables will force a Moon reset"],
                    "blank",
                    ["milestones", [200]],
                    "blank",
                    ["buyables", [3, 4, 5]]
                ],
                unlocked() {return hasUpgrade('mn', 41)}
            }
        },
        darkSide: {
            "Moonstone Sub-Module": {
                content: [
                    "blank",
                    ["display-text", () => {return "You have " + format(player.mn.moonstone) + " moonstone, which produce a base of +" + format(tmp.mn.moonstoneEffect) +  " radiance/s"}],
                    ["display-text", () => {return "You have " + format(player.mn.radiance) + " radiance<sup>" + format(tmp.mn.getRadianceExponent) + "</sup> (+" + format(tmp.mn.getRadianceGen) +  "/s, then raised to displayed exponent)" }],
                    ["display-text", () => {
                        if (player.mn.radiance.gte(1e9)) {
                            return "Due to having more than " + format(tmp.mn.getRadianceOverflowStart) + " radiance, your radiance is dividing itself by " + format(tmp.mn.getRadianceOverflowDiv) + " every second"
                        }
                    }],
                    "blank",
                    ["buyables", [2]],
                    "blank",
                    ["upgrades", [1, 2, 3, 4]],
                ]
            },
            "Dark Side of The Moon": {
                content: [
                    "blank",
                    ["display-text", () => {
                        if (inChallenge('mn', 11)) return "You have " + format(player.mn.darkEssence) + " dark essence, which produce a base of " + format(tmp.mn.getDarkEssenceEffect) + " darkness per second"
                        return "You have " + format(player.mn.darkEssence) + " dark essence, which ???"
                    }],
                    "blank",
                    "challenges",
                    "blank",
                    ["milestones", [100, 101, 102]]
                ]
            }
        }
    },
    infoboxes: {
        moonEssenceInfo: {
            title: "AUDIO LOG [ID: MN-SBY]",
            body() {return `
                DATE: 6/10/XX<br>
                AUTHOR(S): GRACE<br>
                TRANSCRIPT:<br>
                <br>
                GRACE: So you wanna choose MY space-aligned layer? Great choice, player! Welcome to the Moon!<br><br>
                GRACE: Notice how you're constantly running out of point capacity when you're constantly in the mood for MORE? You're in luck! Moon Essence, the currency for this layer, boosts point capacity by a massive amount!<br><br>
                GRACE: It also produces Moon Energy, which directly multiplies the objectively better of the two currencies: space! Don't tell Clyde that by the way, he'll probably hardcap your points at zero (0) if you do. I'll see you again once you gather ten (10) moon essence, player!`
            },
        },
    },
    tabFormat: [
        ["row", [
            () => {if (!(inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1)) return "main-display"},
            ["display-text", () => {if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) return "You have <h2 style='color: #3f3f3f; text-shadow: 0px 0px 10px #3f3f3f'>" + formatWhole(player.mn.points) + "</h2> <h3 style='color: #4f4f4f; text-shadow: 0px 0px 10px #4f4f4f'>dark</h3> moon essence, " + layers.mn.effectDescription() + "<br><br>"}],
        ]],        "prestige-button",
        "blank",
        ["display-text", () => {if (getResetGain('mn').gte(1e36) || player.mn.points.gte(1e36)) return "<b style='color: #ff0000; text-shadow: 0px 0px 10px #ff0000'>[SOFTCAPPED: GAIN PAST " + format(tmp.mn.softcap) + " IS RAISED TO THE POWER OF " + format(tmp.mn.softcapPower) + "]</b><br><br>"}],
        ["display-text", () => {
            if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) {
                if (tmp.mn.moonEnergyEffect.gte(10)) {
                    return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> <h3 style='color: #4f4f4f; text-shadow: 0px 0px 10px #4f4f4f'>dark</h3> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect) + " <b style='color: #ff0000'>[SOFTCAPPED]<b>"
                } else {
                    return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> <h3 style='color: #4f4f4f; text-shadow: 0px 0px 10px #4f4f4f'>dark</h3> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect)
                }
            } 
            if (tmp.mn.moonEnergyEffect.gte(10)) {
                return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect) + " <b style='color: #ff0000'>[SOFTCAPPED]<b>"
            } else {
                return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect)
            }
        }],
        ["display-text", () => {
            if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) {
                return "You have <h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>" + format(player.mn.absoluteSpace) + "</h2> absolute space, which multiplies <s>spacetime gain</s> lunar AC/DC generation by x" + format(tmp.mn.absoluteSpaceEffect)
            }
            if (hasMilestone('mn', 0)) return "You have <h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>" + format(player.mn.absoluteSpace) + "</h2> absolute space, which multiplies spacetime gain by x" + format(tmp.mn.absoluteSpaceEffect)
        }],
        "blank",
        ["milestones", [0, 1, 2, 3]],
        ["microtabs", "moon"]
    ],
    update(diff) {
        player.mn.moonEnergy = player.mn.moonEnergy.add(new Decimal(0.01).mul(tmp.mn.moonEnergyMult).mul(diff))
        player.mn.radiance = player.mn.radiance.root(tmp.mn.getRadianceExponent).add(tmp.mn.getRadianceGen.mul(diff)).pow(tmp.mn.getRadianceExponent)
        if (player.mn.radiance.gte(tmp.mn.getRadianceOverflowStart)) player.mn.radiance = player.mn.radiance.div(tmp.mn.getRadianceOverflowDiv.pow(diff))
        if (hasMilestone('mn', 200)) setBuyableAmount('mn', 31, getBuyableAmount('mn', 31).add(tmp.mn.buyables[31].cost.mul(0.05).mul(diff)))
    },
    layerShown() {return hasUpgrade('st', 24) || player.mn.unlocked}
})
const moonOrbit = document.createElement('style'); // orbit code stolen from Gods of Incremental adkv
moonOrbit.innerHTML = `
@keyframes moonOrbit {
    0% {
        transform: translateY(160px) rotate(0deg) translateX(175px) rotate(0deg);
      }
      100% {
        transform: translateY(160px) rotate(360deg) translateX(175px) rotate(-360deg);
      }
  }
  `
document.head.appendChild(moonOrbit);