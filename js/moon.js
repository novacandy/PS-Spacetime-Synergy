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
    tooltip() {
        if (!player.mn.unlocked) {
            return "(Requires 25000 space)"
        } else {
            return format(player.mn.points, 0) + " moon essence"
        }
    },
    onPrestige() {
        player.spacePoints = new Decimal(15)
        player.timePoints = new Decimal(5)
        player.mn.moonEnergy = new Decimal(0)
        if (hasMilestone('mn', 1)) player.mn.absoluteSpace = player.mn.absoluteSpace.add(tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims))
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
    },    baseResource: "space",
    baseAmount() {return player.spacePoints},
    type: "normal",
    exponent: 0.9,
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
    },
    milestones: {
        0: {
            requirementDescription: "Reset for moon essence once",
            effectDescription: "Start resets with 15 space and 5 time, unlock a new space buyable",
            done() {return player.mn.points.gte(1)}
        },
        1: {
            requirementDescription: "10 moon essence",
            effectDescription: "Unlock the Absolute Space Module (in Spacetime)",
            done() {return player.mn.points.gte(10)}
        },
        2: {
            requirementDescription: "1000 moon essence",
            effectDescription: "Unlock Dark Side Module and a new spacetime conversion input",
            done() {return player.mn.points.gte(1000)}
        },
        100: {
            requirementDescription: "Complete Depth 0",
            effectDescription: "Unlock two new space buyables and more moonstone content",
            done() {return challengeCompletions('mn', 11) >= 1}
        },
        101: {
            requirementDescription: "Complete Depth 1",
            effectDescription: "Unlock Absolute Space Buildings and more moonstone upgrades",
            done() {return challengeCompletions('mn', 11) >= 2}
        }
    },
    clickables: {
    },
    buyables: {
        11: {
            title() {return "Space Points (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
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
            canAfford() { return player.spacePoints.gte(this.cost()) },
            buy() {
                player.spacePoints = player.spacePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('mn', 0)}
        },
        12: {
            title() {
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) return "Spacier <s>Spacetime</s> Generators (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"
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
            canAfford() { return player.spacePoints.gte(this.cost()) },
            buy() {
                player.spacePoints = player.spacePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('mn', 100)}
        },
        13: {
            title() {
                if (inChallenge('mn', 11) && challengeCompletions('mn', 11) >= 1) return "Space <s>Essence</s> Power (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"
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
                return ['Spacetime', 'Spacetime, Moon Essence, and Moon Energy', 'Spacetime, Moon Essence, Moon Energy, Moonstone, and Radiance']
            },
            onEnter() {
                doReset('mn', true)
                player.spacePoints = new Decimal(15)
                player.timePoints = new Decimal(5)
                if (challengeCompletions('mn', 11) >= 1) {
                    player.mn.points = new Decimal(0)
                    player.mn.moonEnergy = new Decimal(0)
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

                player.dk.upgrades = []
                player.dk.push(...keptUpgrades)
            },
            goals() {
                return [new Decimal(10000000), new Decimal(1e15), new Decimal(1e100)]
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
                    ["upgrades", [1, 2]]
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
                    ["milestones", [100, 101]]
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
        ["milestones", [1, 2, 3]],
        ["microtabs", "moon"]
    ],
    update(diff) {
        player.mn.moonEnergy = player.mn.moonEnergy.add(new Decimal(0.01).mul(tmp.mn.moonEnergyMult).mul(diff))
        player.mn.radiance = player.mn.radiance.root(tmp.mn.getRadianceExponent).add(tmp.mn.getRadianceGen.mul(diff)).pow(tmp.mn.getRadianceExponent)
        if (player.mn.radiance.gte(tmp.mn.getRadianceOverflowStart)) player.mn.radiance = player.mn.radiance.div(tmp.mn.getRadianceOverflowDiv.pow(diff))
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