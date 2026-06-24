const DARK_TREE = [['lg'], ['la', 'ld']]
addNode('lg', {
    color: "rgb(4, 38, 22)",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "LG",
    tooltip() {return formatWhole(player.dk.lunarGenerators) + " lunar generators"},
    canClick: true,
    onClick() {
        player.subtabs['dk']['darkness'] = 'Lunar Generators'
    },
    layerShown() {return true},
})
addNode('la', {
    color: "rgb(105, 13, 13)",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "LA",
    tooltip() {return formatWhole(player.dk.lunarAlternators) + " lunar alternators"},
    canClick: true,
    branches: ['lg'],
    onClick() {
        player.subtabs['dk']['darkness'] = 'Lunar Alternators'
    },
    layerShown() {return challengeCompletions('mn', 11) >= 1},
})
addNode('ld', {
    color: "rgb(105, 64, 13)",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "LD",
    tooltip() {return formatWhole(player.dk.lunarDynamos) + " lunar dynamos"},
    canClick: true,
    branches: ['lg'],
    onClick() {
        player.subtabs['dk']['darkness'] = 'Lunar Dynamos'
    },
    layerShown() {return challengeCompletions('mn', 11) >= 2},
})
addLayer("dk", {
    name: "darkness",
    symbol: "D",
    row: 3,
    position: 0,
    startData() { return {
        unlocked: true,
        darkness: new Decimal(0),
        bestDarkness: new Decimal(0),

        lunarGenerators: new Decimal(0),
        lunarGenPower: new Decimal(0),

        lunarAlternators: new Decimal(0),
        lunarAC: new Decimal(0),

        lunarDynamos: new Decimal(0),
        lunarDC: new Decimal(0),

    }},
    tooltip() {return formatWhole(player.dk.darkness) + " darkness"},
    nodeStyle() {
        return {
            "color": "#ffffff",
            "animation": 'darknessOrbit 60s infinite linear',
        }
    },
    color() {
        return "#000000"
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
    type: "none",
    getDarknessGen() {
        let gen = tmp.mn.getDarkEssenceEffect
        if (hasUpgrade('st', 14)) gen = gen.mul(upgradeEffect('st', 14))
        gen = gen.mul(buyableEffect('st', 12))
        gen = gen.mul(tmp.dk.getLunarGenPowerEffect)
        return gen
    },

    getLunarGenEffect() {
        let effect = tmp.dk.getLunarGenBase.pow(player.dk.lunarGenerators.add(tmp.dk.getFreeLunarGens)).sub(1)
        return effect
    },
    getLunarGenBase() {
        let base = new Decimal(2)
        base = base.add(buyableEffect('dk', 11))
        return base
    },
    getFreeLunarGens() {
        let freeGens = new Decimal(0)
        freeGens = freeGens.add(buyableEffect('dk', 12))
        return freeGens
    },
    getLunarGenReq() {
        let req = new Decimal(100).mul(new Decimal(12.5).pow(player.dk.lunarGenerators))
        req = req.div(buyableEffect('mn', 12))
        return req
    },
    getLunarGenPowerMult() {
        let mult = new Decimal(1)
        mult = mult.mul(buyableEffect('mn', 13))
        return mult
    },
    getLunarGenPowerEffect() {
        let effect = player.dk.lunarGenPower.add(1).log(10).pow(2).add(1)
        if (hasUpgrade('dk', 15)) effect = effect.pow(1.5)
        return effect
    },

    getLunarAltEffect() {
        let effect = tmp.dk.getLunarAltBase.pow(player.dk.lunarAlternators.add(tmp.dk.getFreeLunarAlts)).sub(1)
        return effect
    },
    getLunarAltBase() {
        let base = new Decimal(2)
        return base
    },
    getFreeLunarAlts() {
        let freeAlts = new Decimal(0)
        return freeAlts
    },
    getLunarAltReq() {
        let req = new Decimal(1e9).mul(new Decimal(25).pow(player.dk.lunarAlternators))
        return req
    },
    getLunarACMult() {
        let mult = new Decimal(1)
        mult = mult.mul(tmp.mn.absoluteSpaceEffect)
        return mult
    },
    getLunarACEffect() {
        let effect = player.dk.lunarAC.add(1).log(10).pow(2).add(1)
        return effect
    },

    getLunarDynEffect() {
        let effect = tmp.dk.getLunarDynBase.pow(player.dk.lunarDynamos.add(tmp.dk.getFreeLunarDyns)).sub(1)
        return effect
    },
    getLunarDynBase() {
        let base = new Decimal(2)
        return base
    },
    getFreeLunarDyns() {
        let freeDyns = new Decimal(0)
        return freeDyns
    },
    getLunarDynReq() {
        let req = new Decimal(1e25).mul(new Decimal(12.5).pow(player.dk.lunarDynamos))
        return req
    },
    getLunarDCMult() {
        let mult = new Decimal(1)
        mult = mult.mul(tmp.mn.absoluteSpaceEffect)
        return mult
    },
    getLunarDCEffect() {
        let effect = player.dk.lunarDC.add(1).log(10).pow(2).add(1)
        return effect
    },

    upgrades: {
        11: {
            title: "Deeper Into Space",
            description() {return "Multiply point and space gain by 10."},
            cost: new Decimal(1e9),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        12: {
            title: "Break Through Darkness",
            description() {return "Best darkness multiplies dark moon energy generation. Effect: x" + format(this.effect())},
            cost: new Decimal(1e16),
            effect() {
                let effect = player.dk.bestDarkness.add(1).log(15).add(1)
                return effect
            },
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        13: {
            title: "Space Compression",
            description() {return "Space buyables are cheaper based on lunar generators. Effect: /" + format(this.effect())},
            cost: new Decimal(1e25),
            effect() {
                let effect = player.dk.lunarGenerators.div(2).add(1)
                return effect
            },
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        14: {
            title: "Enhanced Enhancers",
            description() {return "Increase effect bases of spacetime enhancement buyables by +0.1."},
            cost: new Decimal(1e36),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        15: {
            title: "Slightly Stronger Power",
            description() {return "Raise lunar generator power effect to the power of ^1.5."},
            cost: new Decimal(1e49),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 1}
        },
        21: {
            description: "Keep above upgrade when leaving DSoTM",
            cost: new Decimal(1e16),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        22: {
            description: "Keep above upgrade when leaving DSoTM",
            cost: new Decimal(1e32),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        23: {
            description: "Keep above upgrade when leaving DSoTM",
            cost: new Decimal(1e48),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        24: {
            description: "Keep above upgrade when leaving DSoTM",
            cost: new Decimal(1e64),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
        25: {
            description: "Keep above upgrade when leaving DSoTM",
            cost: new Decimal(1e80),
            currencyLayer: "dk",
            currencyDisplayName: "lunar generator power",
            currencyInternalName: "lunarGenPower",
            unlocked() {return challengeCompletions('mn', 11) >= 2}
        },
    }, 
    buyables: {
        11: {
            title() {return "Lunar Generator Base (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(3).add(x.mul(2))
                if (x.gte(999)) cost = cost
                return cost
            },
            display() { 
                if (getBuyableAmount('dk', 11).gte(999)) {
                    return "\
                    Increasing lunar generator base by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" lunar generators\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing lunar generator base by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" lunar generators\n\
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
            canAfford() { return player.dk.lunarGenerators.gte(this.cost()) },
            buy() {
                player.dk.lunarGenerators = player.dk.lunarGenerators.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title() {return "Free Lunar Generators (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1000).mul(new Decimal(5).add(x.mul(0.25)).pow(x))
                if (x.gte(5)) cost = cost.pow(1.33)
                return cost
            },
            display() { 
                if (getBuyableAmount('dk', 12).gte(5)) {
                    return "\
                    Increasing free lunar generators by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" lunar generator power\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Increasing free lunar generators by +"+ format(this.effectBase()) +" each\n\
                    Currently: +" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" lunar generator power\n\
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
            canAfford() { return player.dk.lunarGenPower.gte(this.cost()) },
            buy() {
                player.dk.lunarGenPower = player.dk.lunarGenPower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    clickables: {
        11: {
            title: "Return",
            canClick() {return true},
            onClick() {
                player.subtabs['dk']['darkness'] = 'Main'
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
        21: {
            title: "Reset for +1 Lunar Generators",
            display() {return `
                ${format(player.dk.darkness)}/${format(tmp.dk.getLunarGenReq)} darkness
            `},
            canClick() {return player.dk.darkness.gte(tmp.dk.getLunarGenReq)},
            onClick() {
                player.dk.darkness = new Decimal(0)
                player.dk.lunarGenPower = new Decimal(0)
                player.dk.lunarGenerators = player.dk.lunarGenerators.add(1)
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
        22: {
            title: "Reset for +1 Lunar Alternators",
            display() {return `
                ${format(player.dk.darkness)}/${format(tmp.dk.getLunarAltReq)} darkness
            `},
            canClick() {return player.dk.darkness.gte(tmp.dk.getLunarAltReq)},
            onClick() {
                player.dk.darkness = new Decimal(0)
                player.dk.lunarGenerators = new Decimal(0)
                player.dk.lunarGenPower = new Decimal(0)
                player.dk.lunarAC = new Decimal(0)
                player.dk.lunarAlternators = player.dk.lunarAlternators.add(1)
                setBuyableAmount('dk', 11, new Decimal(0))
                setBuyableAmount('dk', 12, new Decimal(0))
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
        23: {
            title: "Reset for +1 Lunar Dynamos",
            display() {return `
                ${format(player.dk.lunarGenPower)}/${format(tmp.dk.getLunarDynReq)} lunar generator power
            `},
            canClick() {return player.dk.lunarGenPower.gte(tmp.dk.getLunarDynReq)},
            onClick() {
                player.dk.darkness = new Decimal(0)
                player.dk.lunarGenerators = new Decimal(0)
                player.dk.lunarGenPower = new Decimal(0)
                player.dk.lunarDC = new Decimal(0)
                player.dk.lunarDynamos = player.dk.lunarDynamos.add(1)
                setBuyableAmount('dk', 11, new Decimal(0))
                setBuyableAmount('dk', 12, new Decimal(0))
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        }
    },
    microtabs: {
        darkness: {
            "Main": {
                content: [
                    ['tree', DARK_TREE],
                ]
            },
            "Lunar Generators": {
                content: [
                    ['clickable', 11],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: rgb(13, 105, 62); text-shadow: 0px 0px 10px rgb(13, 105, 62)'>" + formatWhole(player.dk.lunarGenerators) + "</h2> lunar generators, which generate " + format(tmp.dk.getLunarGenEffect) + " lunar generator power per second"}],
                    "blank",
                    ['clickable', 21],
                    "blank",
                    ["display-text", () => {return "Lunar Generator Base: " + format(tmp.dk.getLunarGenBase)}],
                    ["display-text", () => {return "Free Lunar Generators: " + format(tmp.dk.getFreeLunarGens)}],
                    "blank",
                    ["display-text", () => {return "You have " + format(player.dk.lunarGenPower) + " lunar generator power, which multiply darkness by x" + format(tmp.dk.getLunarGenPowerEffect) }],
                    "blank",
                    ["buyables", [1]],
                    "blank",
                    ["display-text", () => {
                        if (challengeCompletions('mn', 11) >= 1) {
                            return "unar generator upgrades are reset after leaving DSoTM"
                        } else {
                            return "Reach Depth 1 to unlock Lunar Generator Upgrades"
                        }
                        
                    }],
                    "blank",
                    ["upgrades", [1, 2]]
                ]
            },
            "Lunar Alternators": {
                content: [
                    ['clickable', 11],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: rgb(105, 13, 13); text-shadow: 0px 0px 10px rgb(105, 13, 13)'>" + formatWhole(player.dk.lunarAlternators) + "</h2> lunar alternators, which generate " + format(tmp.dk.getLunarAltEffect) + " lunar alternating current per second"}],
                    "blank",
                    ['clickable', 22],
                    "blank",
                    ["display-text", () => {return "Lunar Alternator Base: " + format(tmp.dk.getLunarAltBase)}],
                    ["display-text", () => {return "Free Lunar Alternators: " + format(tmp.dk.getFreeLunarAlts)}],
                    "blank",
                    ["display-text", () => {return "You have " + format(player.dk.lunarAC) + " lunar alternating current, which multiply dark spacetime by x" + format(tmp.dk.getLunarACEffect) }],
                    "blank",
                    ["buyables", [2]],
                    "blank",
                    ["upgrades", [3, 4]]
                ]
            },
            "Lunar Dynamos": {
                content: [
                    ['clickable', 11],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: rgb(105, 65, 13); text-shadow: 0px 0px 10px rgb(105, 65, 13)'>" + formatWhole(player.dk.lunarDynamos) + "</h2> lunar dynamos, which generate " + format(tmp.dk.getLunarDynEffect) + " lunar direct current per second"}],
                    "blank",
                    ['clickable', 23],
                    "blank",
                    ["display-text", () => {return "Lunar Dynamo Base: " + format(tmp.dk.getLunarDynBase)}],
                    ["display-text", () => {return "Free Lunar Dynamos: " + format(tmp.dk.getFreeLunarDyns)}],
                    "blank",
                    ["display-text", () => {return "You have " + format(player.dk.lunarDC) + " lunar direct current, which multiply dark moon essence by x" + format(tmp.dk.getLunarDCEffect) }],
                    "blank",
                    ["buyables", [3]],
                    "blank",
                    ["upgrades", [5, 6]]
                ]
            },
        },
    },
    infoboxes: {
    },
    tabFormat: [
        ["display-text", () => {return "You have <h2 style='color: #ffffff; text-shadow: 0px 0px 10px #ffffff'>" + format(player.dk.darkness) + "</h2> darkness"}],
        ["display-text", () => {return "(+" + format(tmp.dk.getDarknessGen) + "/s)<br><br>"}],
        "blank",
        ['buttonless-microtabs', 'darkness']
    ],
    update(diff) {
        if (inChallenge('mn', 11)) {
            player.dk.darkness = player.dk.darkness.add(tmp.dk.getDarknessGen.mul(diff))
            if (player.dk.darkness.gte(player.dk.bestDarkness)) player.dk.bestDarkness = player.dk.darkness
            player.dk.lunarGenPower = player.dk.lunarGenPower.add(tmp.dk.getLunarGenEffect.mul(tmp.dk.getLunarGenPowerMult).mul(diff))
            player.dk.lunarAC = player.dk.lunarAC.add(tmp.dk.getLunarAltEffect.mul(tmp.dk.getLunarACMult).mul(diff))
            player.dk.lunarDC = player.dk.lunarDC.add(tmp.dk.getLunarDynEffect.mul(tmp.dk.getLunarDCMult).mul(diff))
        }
    },
    layerShown() {return inChallenge('mn', 11)}
})
const darknessOrbit = document.createElement('style'); // orbit code stolen from Gods of Incremental adkv
darknessOrbit.innerHTML = `
@keyframes darknessOrbit {
    0% {
        transform: rotate(0deg) translateX(350px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(350px) rotate(-360deg);
      }
  }
  `
document.head.appendChild(darknessOrbit);