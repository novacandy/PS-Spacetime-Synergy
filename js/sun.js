addLayer("sn", {
    name: "sun",
    symbol: "SN",
    row: 1,
    displayRow: 3,
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
        
        sunEnergy: new Decimal(0),
        absoluteTime: new Decimal(0),

        solarFlares: new Decimal(0),
        resonance: new Decimal(1),
        lightEssence: new Decimal(0),

    }},
    onPrestige() {
        player.spacePoints = new Decimal(5)
        player.timePoints = new Decimal(15)
        player.sn.sunEnergy = new Decimal(0)
        if (hasMilestone('sn', 1)) {
            player.sn.absoluteTime = player.sn.absoluteTime.add(tmp.st.getStoredAbsTime)
        }
    },
    effectDescription() {
        return "which multiplies point gain by x" + format(tmp.sn.effect) + ", but also multiplies time consumption speed by the same amount"
    },
    effect() {
        let effect = new Decimal(1).mul(player.sn.points.pow(0.33)).add(1)
        if (effect.gte(1000)) effect = effect.div(1000).pow(0.25).mul(1000)
        return effect
    },
    color: "#ffa200",
    nodeStyle() {
        if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 0) return {
            "color": "#ffffff",
            "animation": 'sunOrbit 25s infinite linear',
        }
        return {
            "animation": 'sunOrbit 25s infinite linear',
        }
    },
    requires: new Decimal(10000),
    resource: "sun essence",
    baseResource: "time",
    baseAmount() {return player.timePoints},
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
    sunEnergyMult() {
        let mult = player.sn.points.pow(0.75)
        return mult
    },
    sunEnergyEffect() {
        let effect = player.sn.sunEnergy.pow(0.5).add(1)
        if (effect.gte(10)) effect = effect.div(10).pow(0.75).mul(10)
        return effect
    },
    absoluteTimeEffect() {
        let effect = player.sn.absoluteTime.add(1).log(10).pow(1.5).add(1)
        return effect
    },
    getResonanceMult() {
        let mult = new Decimal(0)
        mult = mult.add(buyableEffect('sn', 21))
        mult = mult.mul(tmp.sn.solarFlareEffect)
        mult = mult.add(1)
        mult = mult.root(tmp.sn.getResonanceOverflowRoot)
        return mult
    },
    getResonanceOverflowStart() {
        let start = new Decimal(10)
        start = start.mul(buyableEffect('sn', 22))
        return start
    },
    getResonanceOverflowRoot() {
        let root = player.sn.resonance.div(tmp.sn.getResonanceOverflowStart).pow(2)
        root = root.mul(buyableEffect('sn', 23))
        return root.max(1)
    },
    getSolarFlareMultis() {
        let mult = new Decimal(1)
        return mult
    },
    getLightEssenceMultis() {
        let mult = new Decimal(1)
        return mult
    },
    solarFlareEffect() {
        let effect = player.sn.solarFlares.add(1).log(10).div(5).add(1)
        return effect
    },
    lightEssenceEffect() {
        let effect = player.sn.solarFlares.add(1).log(10).div(5).add(1)
        return mult
    },
    hotkeys: [
        {key: "N", description: "N: Reset for sun essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Resonant Awakening",
            description: "Unlock the potential of your Light Essence",
            cost: new Decimal(1e7),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost)},
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
        },
    },
    milestones: {
        0: {
            requirementDescription: "Reset for sun essence once",
            effectDescription: "Start resets with 5 space and 15 time, unlock a new time buyable",
            done() { return player.sn.points.gte(1) }
        },
        1: {
            requirementDescription: "10 sun essence",
            effectDescription: "Start resets with all Spacetime upgrades, 30 Point Enhancement levels, and 10 Spacetime, Space, and Time Enhancement levels. Unlock the Absolute Time Module (in Spacetime)",
            done() { return player.sn.points.gte(10) }
        },
        2: {
            requirementDescription: "1000 sun essence",
            effectDescription: "Start resets with 10 Convert Rate levels, unlock Solar Flare Module and a new spacetime conversion input",
            done() { return player.sn.points.gte(1000) }
        },
    },
    buyables: {
        11: {
            title() {return "Time Points (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(100).mul(x.mul(1.25).add(1)).mul(new Decimal(1.25).pow(x))
                if (x.gte(15)) cost = cost.pow(1.25)
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 11).gte(15)) {
                    return "\
                    Multiplying point capacity by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying point capacity by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
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
            canAfford() { return player.timePoints.gte(this.cost()) },
            buy() {
                player.timePoints = player.timePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        21: {
            title() {return "Resonant Enhancement Type-A (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.25).add(1)).mul(new Decimal(1.05).pow(x))
                if (x.gte(10)) cost = cost.pow(2)
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 21).gte(10)) {
                    return "\
                    Increasing resonance multiplier by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing resonance multiplier by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(0.01)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        22: {
            title() {return "Resonant Enhancement Type-B (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(0.25).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(x.div(33).add(1))
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 22).gte(10)) {
                    return "\
                    Delaying resonance overflow by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Delaying resonance overflow by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(2)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        23: {
            title() {return "Resonant Enhancement Type-C (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(150).mul(x.mul(0.25).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(x.div(20).add(1))
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 23).gte(10)) {
                    return "\
                    Weakening resonance overflow by "+ format(Decimal.sub(1, this.effectBase()).mul(100)) + "% each\n\
                    Currently: " + format(this.effect().mul(100)) + "%\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Weakening resonance overflow by "+ format(Decimal.sub(1, this.effectBase()).mul(100)) +"% each\n\
                    Currently: " + format(this.effect().mul(100)) + "%\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(0.75)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
    },
    microtabs: {
        sun: {
            "Time Buyable Module": {
                content: [
                    "blank",
                    ["buyables", [1]]
                ]
            },
            "Solar Flare Module": {
                content: [
                    "blank",
                    ["microtabs", "solarFlares"]
                ],
                unlocked() {return hasMilestone('sn', 2)}
            },
        },
        solarFlares: {
            "Solar Flare Sub-Module": {
                content: [
                    "blank",
                    ["display-text", () => {return "You have " + format(player.sn.solarFlares) + " solar flares, which multiply the resonance multiplier by " + format(tmp.sn.solarFlareEffect)}],
                    ["display-text", () => {return "You have " + format(player.sn.resonance) + " resonance (x" + format(tmp.sn.getResonanceMult) +  "/s)" }],
                    ["display-text", () => {
                        if (player.sn.resonance.gte(tmp.sn.getResonanceOverflowStart)) {
                            return "Due to having more than " + format(tmp.sn.getResonanceOverflowStart) + " resonance, your resonance multiplier is being brought to the " + format(tmp.sn.getResonanceOverflowRoot) + "th root"
                        }
                    }],
                    "blank",
                    ["display-text", "Note: Anything that costs Resonance divides its amount instead of subtracting"],
                    "blank",
                    ["buyables", [2]],
                    "blank",
                    ["upgrades", [1, 2, 3, 4]],
                ]
            },
            "Solar Trial Sub-Module": {
                content: [
                    "blank",
                    ["display-text", () => {
                        if (hasUpgrade('sn', 11)) return "You have " + format(player.sn.lightEssence) + " light essence, which generate a base of " + format(tmp.sn.getLightEssenceEffect) + " light per second while in a Solar Trial"
                        return "You have " + format(player.sn.lightEssence) + " light essence, which ???"
                    }],
                    "blank",
                ]
            }
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => {
            if (tmp.sn.sunEnergyEffect.gte(10)) {
                return "You have <h2 style='color: #FBC02D; text-shadow: 0px 0px 10px #FBC02D'>" + format(player.sn.sunEnergy) + "</h2> sun energy, (+" + format(new Decimal(0.01).mul(tmp.sn.sunEnergyMult)) + "/s) which multiplies time gain from all sources by x" + format(tmp.sn.sunEnergyEffect) + " <b style='color: #ff0000'>[SOFTCAPPED]<b>"
            } else {
                return "You have <h2 style='color: #FBC02D; text-shadow: 0px 0px 10px #FBC02D'>" + format(player.sn.sunEnergy) + "</h2> sun energy, (+" + format(new Decimal(0.01).mul(tmp.sn.sunEnergyMult)) + "/s) which multiplies time gain from all sources by x" + format(tmp.sn.sunEnergyEffect)
            }
        }],
        "blank",
        ["display-text", () => {
            if (hasMilestone('sn', 0)) return "You have <h2 style='color: #ffffff; text-shadow: 0px 0px 10px #ffffff'>" + formatTime(player.sn.absoluteTime) + "</h2> of absolute time, which multiplies spacetime gain by x" + format(tmp.sn.absoluteTimeEffect)
        }],
        "blank",
        "milestones",
        ["microtabs", "sun"]
    ],
    update(diff) {
        player.sn.sunEnergy = player.sn.sunEnergy.add(new Decimal(0.01).mul(tmp.sn.sunEnergyMult).mul(diff))
        player.sn.resonance = player.sn.resonance.mul(tmp.sn.getResonanceMult.pow(diff))
    },
    layerShown() {return hasUpgrade('st', 24) || player.sn.unlocked && !player.mn.unlocked}
})
const sunOrbit = document.createElement('style'); // orbit code stolen from Gods of Incremental adkv
sunOrbit.innerHTML = `
@keyframes sunOrbit {
    0% {
        transform: translateY(120px) rotate(0deg) translateX(-175px) rotate(0deg);
      }
      100% {
        transform: translateY(120px) rotate(360deg) translateX(-175px) rotate(-360deg);
      }
  }
  `
document.head.appendChild(sunOrbit);