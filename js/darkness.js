const DARK_TREE = [['lg'], ['la', 'ld']]
addNode('lg', {
    color: "rgb(4, 38, 22)",
    nodeStyle() {return {
        "border-radius": "100px"
    }},
    symbol: "LG",
    tooltip: "Lunar Generators",
    canClick: true,
    onClick() {
        player.subtabs['dk']['darkness'] = 'Lunar Generators'
    },
    layerShown() {return true},
})
addNode('la', {
    color: "rgb(105, 13, 13)",
    symbol: "LA",
    tooltip: "Lunar Alternators",
    canClick: true,
    branches: ['lg'],
    onClick() {
        
    },
    layerShown() {return false},
})
addNode('ld', {
    color: "rgb(105, 64, 13)",
    symbol: "LD",
    tooltip: "Lunar Dynamos",
    canClick: true,
    branches: ['lg'],
    onClick() {
        
    },
    layerShown() {return false},
})
addLayer("dk", {
    name: "darkness",
    symbol: "DK",
    row: 3,
    position: 0,
    startData() { return {
        unlocked: true,
        darkness: new Decimal(0),

        lunarGenerators: new Decimal(0),
        lunarGenPower: new Decimal(0),

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
        return req
    },
    getLunarGenPowerMult() {
        let mult = new Decimal(1)
        return mult
    },
    getLunarGenPowerEffect() {
        let effect = player.dk.lunarGenPower.add(1).log(10).pow(2).add(1)
        return effect
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
                let cost = new Decimal(1000).mul(new Decimal(5).pow(x))
                if (x.gte(5)) cost = cost.pow(1.25)
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
                    ["buyables", [1]]
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
        if (inChallenge('mn', 11)) player.dk.darkness = player.dk.darkness.add(tmp.dk.getDarknessGen.mul(diff))
        if (inChallenge('mn', 11)) player.dk.lunarGenPower = player.dk.lunarGenPower.add(tmp.dk.getLunarGenEffect.mul(diff))
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