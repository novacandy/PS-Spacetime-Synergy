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
    layerShown() {return false},
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
    layerShown() {return false},
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

        solarPrestige: new Decimal(0)

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
        gen = gen.mul(tmp.lh.solarPrestigeEffect)
        gen = gen.mul(buyableEffect('lh', 11))
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
        return mult
    },
    solarPrestigeEffect() {
        let effect = player.lh.solarPrestige.add(1).log(10).add(1)
        return effect
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
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Multiplying light generation by +x${format(this.effectBase())} each
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
                let start = new Decimal(999)
                return start
            },
            display() { 
                return `Multiplying solar prestige point gain by +x${format(this.effectBase())} each
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

                ]
            },
            "Solar Magnets": {
                content: [
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
            if (player.lh.light.gte(player.lg.bestLight)) player.lh.bestLight = player.lh.light
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