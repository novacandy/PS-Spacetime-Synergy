const LIGHT_TREE = [['sp', 'sm'], ['ss']]
addNode('sp', {
    color: "#7ec86b",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "SP",
    tooltip() {return formatWhole(player.lh.solarPrestige) + " solar prestige points"},
    canClick: true,
    onClick() {
        player.subtabs['lh']['light'] = 'Solar Prestige'
    },
    layerShown() {return true},
})
addNode('ss', {
    color: "#bc6c6e",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "SS",
    tooltip() {return formatWhole(player.dk.lunarAlternators) + " solar sacrifice points"},
    canClick: true,
    branches: ['sp', 'sm'],
    onClick() {
        player.subtabs['lh']['light'] = 'Solar Sacrifice'
    },
    layerShown() {return challengeCompletions('sn', 11) >= 1},
})
addNode('sm', {
    color: "#d96c13",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "SM",
    tooltip() {return formatWhole(player.dk.lunarDynamos) + " solar magnets"},
    canClick: true,
    branches: ['ss'],
    onClick() {
        player.subtabs['lh']['light'] = 'Solar Magnets'
    },
    layerShown() {return challengeCompletions('sn', 12) >= 1},
})

addLayer("lh", {
    name: "light",
    symbol: "L",
    row: 3,
    displayRow: 5,
    position: 0,
    startData() { return {

        unlocked: true,
        light: new Decimal(0),
        bestLight: new Decimal(0),

        solarPrestige: new Decimal(0),
        solarSacrifice: new Decimal(0),
        solarMagnets: new Decimal(0),

    }},
    tooltip() {return formatWhole(player.dk.darkness) + " light"},
    nodeStyle() {
        return {
            "color": "#000000",
            "border-color": "#ffffff",
            "animation": 'lightOrbit 60s infinite linear',
        }
    },
    color() {
        return "#ffffff"
    },
    componentStyles: {
        "prestige-button"() {if (inChallenge('mn', 11)) return {
            "color": "#000000"
        }},
        "clickable"() {if (inChallenge('mn', 11)) return {
            "color": "#000000"
        }},
        "buyable"() {if (inChallenge('mn', 11)) return {
            "color": "#000000"
        }},
        "upgrade"() {if (inChallenge('mn', 11)) return {
            "color": "#000000"
        }},
        "milestone"() {if (inChallenge('mn', 11)) return {
            "color": "#000000",
            "background-color": "#0a371d"
        }},
    },
    type: "none",

    getLightGen() {
        let gen = tmp.sn.lightEssenceEffect
        if (inChallenge('sn', 11)) gen = gen.mul(player.st.points.div(1e3).pow(0.5).add(1))
        if (inChallenge('sn', 12)) gen = gen.mul(player.sn.sunEnergy.pow(0.5).add(1))
        if (inChallenge('sn', 13)) gen = gen.mul(Decimal.pow(1.5, player.points.add(1).log(5).add(1)))
        gen = gen.mul(tmp.lh.solarPrestigeEffect)
        gen = gen.mul(buyableEffect('lh', 11))
        gen = gen.mul(buyableEffect('lh', 21))
        if (challengeCompletions('sn', 12) >= 1) gen = gen.mul(tmp.lh.attractionMulti)
        return gen
    },

    getSolarPrestigeGain() {
        let gain = player.lh.light.div(1000).pow(0.5)
        gain = gain.mul(tmp.lh.solarPrestigeGainMult)
        return gain.floor()
    },
    getNextSolarPrestige() {
        let next = tmp.lh.getSolarPrestigeGain.div(tmp.lh.solarPrestigeGainMult).add(1).pow(2).mul(1000)
        return next.floor()
    },
    solarPrestigeGainMult() {
        let mult = new Decimal(1)
        mult = mult.mul(buyableEffect('lh', 12))
        mult = mult.mul(buyableEffect('lh', 22))
        if (challengeCompletions('sn', 13) >= 1) mult = mult.mul(tmp.lh.attractionMulti)
        return mult
    },
    solarPrestigeEffect() {
        let effect = player.lh.solarPrestige.add(1).log(10).add(1)
        return effect
    },

    getSolarSacrificeGain() {
        let gain = player.lh.light.div(1000000).pow(1/3)
        gain = gain.mul(tmp.lh.solarSacrificeGainMult)
        return gain.floor()
    },
    getNextSolarSacrifice() {
        let next = tmp.lh.getSolarSacrificeGain.div(tmp.lh.solarSacrificeGainMult).add(1).pow(3).mul(1000000)
        return next.floor()
    },
    solarSacrificeGainMult() {
        let mult = new Decimal(1)
        return mult
    },
    solarSacrificeEffect() {
        let effect = player.lh.solarSacrifice.add(1).log(10).add(1)
        return effect
    },

    getSolarMagnetGen() {
        let gen = new Decimal(1)
        gen = gen.mul(buyableEffect('lh', 23))
        gen = gen.mul(buyableEffect('lh', 32))
        return gen
    },
    attractionMulti() {
        let mult = new Decimal(1)
        mult = mult.mul(buyableEffect('lh', 31))
        return mult
    },

    upgrades: {
        
    }, 
    buyables: {
        11: {
            title() {return "Light Boost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.5).add(1)).mul(Decimal.pow(1.05, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(9999)
                return start
            },
            display() { 
                return `Increasing light generation multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar prestige points ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarPrestige.gte(this.cost())},
            buy() {
                player.lh.solarPrestige = player.lh.solarPrestige.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title() {return "Solar Prestige Boost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(5).mul(x.mul(1.5).add(1)).mul(Decimal.pow(1.1, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(9999)
                return start
            },
            display() { 
                return `Increasing solar prestige point gain multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar prestige points ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarPrestige.gte(this.cost())},
            buy() {
                player.lh.solarPrestige = player.lh.solarPrestige.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            title() {return "Light Boost II (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.5).add(1)).mul(Decimal.pow(1.05, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Increasing light generation multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar sacrifice points ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(0.5)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarSacrifice.gte(this.cost())},
            buy() {
                player.lh.solarSacrifice = player.lh.solarSacrifice.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },   
        22: {
            title() {return "Solar Prestige Boost II (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(1.25).add(1)).mul(Decimal.pow(1.15, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Increasing solar prestige point gain multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar sacrifice points ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(0.5)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarSacrifice.gte(this.cost())},
            buy() {
                player.lh.solarSacrifice = player.lh.solarSacrifice.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        23: {
            title() {return "Solar Magnet Boost II (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(5).mul(x.mul(0.75).add(1)).mul(Decimal.pow(1.25, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Increasing solar magnet generation multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar sacrifice points ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.lh.solarSacrifice.gte(this.cost())},
            buy() {
                player.lh.solarSacrifice = player.lh.solarSacrifice.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        31: {
            title() {return "Solar Attraction (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.5).add(1)).mul(Decimal.pow(1.05, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Increasing attraction multiplier by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar magnets ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarMagnets.gte(this.cost())},
            buy() {
                player.lh.solarMagnets = player.lh.solarMagnets.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        32: {
            title() {return "Solar Magnet Boost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.5).add(1)).mul(Decimal.pow(1.05, x))
                if (x.gte(this.softcapStart())) cost = cost
                return cost.floor()
            },
            softcapStart() {
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Increasing magnet generation by +x${format(this.effectBase())} each
                    Currently: x${format(this.effect())}
                    Cost: ${format(this.cost())} solar magnets ${getBuyableAmount(this.layer, this.id).gte(this.softcapStart())? "<br><b style='color: #ff0000'>[SOFTCAPPED]</b>" : ""}
                `
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id)).add(1)
                return effect
            },
            canAfford() { return player.lh.solarMagnets.gte(this.cost())},
            buy() {
                player.lh.solarMagnets = player.lh.solarMagnets.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    clickables: {
        11: {
            title: "Return",
            canClick() {return true},
            onClick() {
                player.subtabs['lh']['light'] = 'Main'
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
        21: {
            title() {return `Reset for +${formatWhole(tmp.lh.getSolarPrestigeGain)} solar prestige points`},
            display() {if (player.lh.solarPrestige.lt(1000) && tmp.lh.getSolarPrestigeGain.lt(100)) return `
                Next at ${format(tmp.lh.getNextSolarPrestige)} light
            `},
            canClick() {return player.lh.light.gte(1000)},
            onClick() {
                player.lh.solarPrestige = player.lh.solarPrestige.add(tmp.lh.getSolarPrestigeGain)
                player.lh.light = new Decimal(0)
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
        22: {
            title() {return `Reset for +${formatWhole(tmp.lh.getSolarSacrificeGain)} solar sacrifice points`},
            display() {if (player.lh.solarSacrifice.lt(1000) && tmp.lh.getSolarSacrificeGain.lt(100)) return `
                Next at ${format(tmp.lh.getNextSolarSacrifice)} light
            `},
            canClick() {return player.lh.light.gte(1000000)},
            onClick() {
                player.lh.solarSacrifice = player.lh.solarSacrifice.add(tmp.lh.getSolarSacrificeGain)
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            style() {return {
                "width": "200px",
                "height": "100px",
                "border-color": "#ffffff"
            }}
        },
    },
    microtabs: {
        light: {
            "Main": {
                content: [
                    ['tree', LIGHT_TREE],
                ]
            },
            "Solar Prestige": {
                content: [
                    ['clickable', [11]],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: #7ec86b; text-shadow: 0px 0px 10px #7ec86b'>" + formatWhole(player.lh.solarPrestige) + "</h2> solar prestige points, which multiply light gain by x" + format(tmp.lh.solarPrestigeEffect)}],
                    "blank",
                    ['clickable', [21]],
                    "blank",
                    ['buyables', [1]]
                ]
            },
            "Solar Sacrifice": {
                content: [
                    ['clickable', [11]],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: #bc6c6e; text-shadow: 0px 0px 10px #bc6c6e'>" + formatWhole(player.lh.solarSacrifice) + "</h2> solar sacrifice points, which multiply solar prestige point gain by x" + format(tmp.lh.solarSacrificeEffect)}],
                    "blank",
                    ['clickable', [22]],
                    "blank",
                    ['buyables', [2]]
                ]
            },
            "Solar Magnets": {
                content: [
                    ['clickable', [11]],
                    "blank",
                    ["display-text", () => {return "You have <h2 style='color: #d96c13; text-shadow: 0px 0px 10px #d96c13'>" + formatWhole(player.lh.solarMagnets) + "</h2> solar magnets (+" + format(tmp.lh.getSolarMagnetGen) +"/s)"}],
                    "blank",
                    ["buyables", [3]],
                    "blank",
                    ["display-text", () => {
                        return "Your attraction multiplier is currently x" + format(tmp.lh.attractionMulti)
                    }],
                    ["display-text", () => {
                        if (challengeCompletions('sn', 13) >= 1) return "Solar trial completions are making your Attraction multiplier affect Light and Solar Prestige Points"
                        return "Solar trial completions are making your Attraction multiplier affect Light"
                    }]

                ]
            },
        },
    },
    infoboxes: {
    },
    tabFormat: [
        ["display-text", () => {return "You have <h2 style='color: #ffffff; text-shadow: 0px 0px 10px #ffffff'>" + format(player.lh.light) + "</h2> light"}],
        ["display-text", () => {return "(+" + format(tmp.lh.getLightGen) + "/s)<br><br>"}],
        "blank",
        ['buttonless-microtabs', 'light']
    ],
    update(diff) {
        if (player.sn.activeChallenge !== null) {
            player.lh.light = player.lh.light.add(tmp.lh.getLightGen.mul(diff))
            player.lh.solarMagnets = player.lh.solarMagnets.add(tmp.lh.getSolarMagnetGen.mul(diff))
            if (player.lh.light.gte(player.lh.bestLight)) player.lh.bestLight = player.lh.light
        }
    },
    layerShown() {return (player.sn.activeChallenge !== null)}
})
const lightOrbit = document.createElement('style'); // orbit code stolen from Gods of Incremental adkv
lightOrbit.innerHTML = `
@keyframes lightOrbit {
    0% {
        transform: rotate(0deg) translateX(-350px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(-350px) rotate(-360deg);
      }
  }
  `
document.head.appendChild(lightOrbit);