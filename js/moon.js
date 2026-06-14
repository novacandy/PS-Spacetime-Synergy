addLayer("mn", {
    name: "moon",
    symbol: "MN",
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
        darkEssence: new Decimal(0)
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
        if (hasMilestone('mn', 1)) player.mn.absoluteSpace = player.mn.absoluteSpace.add(tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims))
    },
    effectDescription() {
       return "which multiplies point capacity by x" + format(tmp.mn.effect)
    },
    effect() {
        let effect = new Decimal(4).mul(player.mn.points.pow(0.75)).add(1)
        return effect
    },
    color: "#7f7f7f",
    requires: new Decimal(10000),
    resource: "moon essence",
    baseResource: "space",
    baseAmount() {return player.spacePoints},
    type: "normal",
    exponent: 0.9,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    moonEnergyMult() {
        let mult = player.mn.points.pow(0.75)
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
    getDarkEssenceMultis() {
        let mult = new Decimal(1)
        return mult
    },
    hotkeys: [
        {key: "m", description: "M: Reset for moon essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        
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
            effectDescription: "Unlock darkness and a new spacetime conversion input",
            done() {return player.mn.points.gte(1000)}
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
    },
    microtabs: {
        moon: {
            "Space Buyable Module": {
                content: [
                    "blank",
                    ["infobox", "moonEssenceInfo"],
                    "blank",
                    "buyables"
                ]
            },
            "Dark Side Module": {
                content: [
                    "blank",
                ],
                unlocked() {return hasMilestone('mn', 2)}
            },
        },
        
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
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => {
            if (tmp.mn.moonEnergyEffect.gte(10)) {
                return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect) + " <b style='color: #ff0000'>[SOFTCAPPED]<b>"
            } else {
                return "You have <h2 style='color: #7f7f7f; text-shadow: 0px 0px 10px #7f7f7f'>" + format(player.mn.moonEnergy) + "</h2> moon energy, (+" + format(new Decimal(0.01).mul(tmp.mn.moonEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.mn.moonEnergyEffect)
            }
        }],
        ["display-text", () => {return "You have <h2 style='color: #000000; text-shadow: 0px 0px 10px #ffffff'>" + format(player.mn.absoluteSpace) + "</h2> absolute space, which multiplies spacetime gain by x" + format(tmp.mn.absoluteSpaceEffect)}],
        "blank",
        "milestones",
        ["microtabs", "moon"]
    ],
    update(diff) {
        player.mn.moonEnergy = player.mn.moonEnergy.add(new Decimal(0.01).mul(tmp.mn.moonEnergyMult).mul(diff))
    },
    layerShown() {return hasUpgrade('st', 24) || player.mn.unlocked}
})
