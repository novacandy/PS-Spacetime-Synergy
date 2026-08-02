addLayer("sn", {
    name: "sun",
    symbol: "SN",
    row: 1,
    displayRow: 3,
    position: 0,
    increaseUnlockOrder: ['mm'],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        unlockOrder: 0,
        total: new Decimal(0),
        sunTimePassed: new Decimal(0),

        sunEnergy: new Decimal(0),
        absoluteTime: new Decimal(0),

        solarFlares: new Decimal(0),
        resonance: new Decimal(1),
        lightEssence: new Decimal(0),

        activeSolarPowers: [false, false, false, false, false, false, false, false]

    }},
    onPrestige() {
        player.timePassed = new Decimal(0)
        player.spacePoints = new Decimal(5)
        player.timePoints = new Decimal(15)
        player.sn.sunEnergy = new Decimal(0)
        player.sn.sunTimePassed = new Decimal(0)
        if (hasMilestone('sn', 1)) {
            player.sn.absoluteTime = player.sn.absoluteTime.add(tmp.st.getStoredAbsTime)
        }
    },
    effectDescription() {
        if (tmp.sn.effect.gte(1000)) return "which multiplies point gain by x" + format(tmp.sn.effect) + ", but also multiplies time consumption speed by the same amount <b style='color: #ff0000'>[SOFTCAPPED]<b>"
        return "which multiplies point gain by x" + format(tmp.sn.effect) + ", but also multiplies time consumption speed by the same amount"
    },
    effect() {
        let effect = new Decimal(1).mul(player.sn.points.pow(0.33)).add(1)
        if (effect.gte(1000)) effect = effect.div(1000).pow(0.25).mul(1000)
        return effect
    },
    color: "#ffa200",
    nodeStyle() {

        if (inChallenge('mn', 11) && challengeCompletions('mn', 11) > 4) return {
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
    exponent() {
        let exp = new Decimal(0.5)
        if (challengeCompletions('sn', 11) >= 1) exp = exp.add(0.05)
        return exp
    },
    softcap() {
        let softcap = new Decimal(1e36)
        if (hasUpgrade('sn', 33)) softcap = softcap.mul(upgradeEffect('sn', 33))
        return softcap
    },
    softcapPower() {
        let power = new Decimal(0.1)
        return power
    },
    passiveGeneration() {
        return buyableEffect('sn', 31)
    },
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect('sn', 13))
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        return exp
    },
    sunEnergyMult() {
        let mult = player.sn.points.pow(0.75)
        if (inChallenge('sn', 12)) mult = player.sn.points.pow(0.5)
        if (hasUpgrade('sn', 34)) mult = player.sn.points.pow(0.775)
        if (hasUpgrade('sn', 21)) mult = mult.mul(upgradeEffect('sn', 21))
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
        if (hasUpgrade('sn', 12)) {
            mult = new Decimal(1.01).mul(buyableEffect('sn', 21))
        } else {
            mult = mult.add(buyableEffect('sn', 21))
        }
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
        if (player.sn.activeSolarPowers[0]) root = root.pow(1.5)
        root = root.mul(buyableEffect('sn', 23))
        if (player.sn.resonance.gte(tmp.sn.getResonanceSlowdownStart)) root = root.pow(tmp.sn.getResonanceSlowdownPow)
        return root.max(1)
    },
    getResonanceSlowdownStart() {
        let start = new Decimal(1e63)
        return start
    },
    getResonanceSlowdownPow() {
        let pow = player.sn.resonance.add(1).log(tmp.sn.getResonanceSlowdownStart).pow(5)
        return pow.max(1)
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
        let effect = player.sn.lightEssence.add(1).log(2)
        effect = effect.pow(buyableEffect('sn', 51))
        return effect
    },
    hotkeys: [
        {key: "N", description: "N: Reset for sun essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            title() {return "Solar Power I: Capsule (" + (player.sn.activeSolarPowers[0] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "Unlock Absolute Time Capsules, but raise resonance overflow penalty to the power of ^1.5"},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[0] = player.sn.activeSolarPowers[0] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return challengeCompletions('sn', 11) >= 1},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
        12: {
            title() {return "Solar Power II: Time Flux (" + (player.sn.activeSolarPowers[1] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "Absolute Time effect is raised to the power of ^1.5, but time capacity from time is raised to the power of ^0.33."},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[1] = player.sn.activeSolarPowers[1] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return challengeCompletions('sn', 12) >= 1},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
        13: {
            title() {return "Solar Power III: Overflow (" + (player.sn.activeSolarPowers[2] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "Effect of the <b>Tickspeed</b> spacetime upgrade is raised to the power of ^1.2, but point capacity is raised to the power of ^0.75."},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[2] = player.sn.activeSolarPowers[2] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return challengeCompletions('sn', 13) >= 1},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
        14: {
            title() {return "Solar Power IV: Drill (" + (player.sn.activeSolarPowers[3] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "Absolute Time is re-enabled in DSoTM or when the convert input is MOON ESSENCE, but its effect is raised to the power of ^0.25."},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[3] = player.sn.activeSolarPowers[3] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return challengeCompletions('sn', 21) >= 1},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
        21: {
            title() {return "Solar Power V: Shine (" + (player.sn.activeSolarPowers[4] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "The first five lunarity buyable gains are multiplied by x100, but -1.00 radiance exponent."},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[4] = player.sn.activeSolarPowers[4] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return challengeCompletions('sn', 21) >= 1},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
        22: {
            title() {return "Solar Power VI: Illuminate (" + (player.sn.activeSolarPowers[5] ? "ACTIVE" : "INACTIVE")+ ")"},
            display() {return "^1.1 light generation, but all previous solar power debuffs are applied even if their respective solar power is inactive."},
            canClick() {return true},
            onClick() {
                player.sn.activeSolarPowers[5] = player.sn.activeSolarPowers[5] ? false : true
                doReset('sn', true)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
            },
            unlocked() {return hasMilestone('mn', 102)},
            style() {return {
                "width": "200px",
                "height": "200px",
            }}
        },
    },
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
        12: {
            title: "A For Effort",
            description: "Reset <b>Resonant Enhancement Type-A</b> and make it more expensive, but its effect is significantly stronger.",
            cost: new Decimal(2.5e7),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost); setBuyableAmount('sn', 21, new Decimal(0))},
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
            unlocked() {return challengeCompletions('sn', 11) >= 1}
        },
        13: {
            title: "Burning Time",
            description() {return "Earn a multiplier to absolute time speed based on solar flares. Effect: x" + format(this.effect())},
            cost: new Decimal(1e9),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost)},
            effect() {
                let effect = player.sn.solarFlares.add(1).log(10).pow(1.5).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
            unlocked() {return challengeCompletions('sn', 11) >= 1}
        },
        14: {
            title: "Resonant Conversion",
            description() {return "Divide the convert rate penalty based on resonance. Effect: /" + format(this.effect())},
            cost: new Decimal(1e18),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost)},
            effect() {
                let effect = player.sn.resonance.add(1).log(2).pow(0.5).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
            unlocked() {return challengeCompletions('sn', 11) >= 1}
        },
        21: {
            title: "Stellar Evolution",
            description() {return "Earn a multiplier to sun energy generation based on sun essence. Effect: x" + format(this.effect())},
            cost: new Decimal(1e7),
            effect() {
                let effect = player.sn.points.pow(0.2).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "solar flares",
            currencyInternalName: "solarFlares",
        },
        22: {
            title: "Repeated Resonance",
            description() {return "<b>Resonant Enhancement Type-B</b> is stronger based on resonance. Effect: x" + format(this.effect())},
            cost: new Decimal(1e10),
            effect() {
                let effect = player.sn.resonance.add(1).log(10).add(1).log(10).div(5).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "solar flares",
            currencyInternalName: "solarFlares",
        },
        23: {
            title: "Trial Booster",
            description() {return "Earn a multiplier to points based on highest light earned in any Solar Trial. Effect: x" + format(this.effect())},
            cost: new Decimal(1e18),
            effect() {
                let effect = player.lh.bestLight.add(1).pow(0.9)
                if (effect.gte(1e60)) effect = effect.div(1e60).pow(0.1).mul(1e60)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "solar flares",
            currencyInternalName: "solarFlares",
        },
        24: {
            fullDisplay() {return `<h3>Premium Subscription</h3><br>
                Solar Trial I no longer has a penalty.<br><br>
                Cost: 1.00e56 solar flares, 1000 solarity`
            },
            canAfford() {return player.sn.solarFlares.gte(1e56) && getBuyableAmount('sn', 31).gte(1000)},
            pay() {player.sn.solarFlares = player.sn.solarFlares.sub(1e56); setBuyableAmount('sn', 31, getBuyableAmount('sn', 31).sub(1000))},
            unlocked() {return hasUpgrade('sn', 31)}
        },
        31: {
            title: "Permeance",
            description() {return "Resonant Enhancements no longer divide resonance, and earn a multiplier to point capacity after <b>Overflow</b>'s nerf based on resonance. Effect: x" + format(this.effect())},
            cost: new Decimal(1e33),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost)},
            effect() {
                let effect = player.sn.resonance.add(1).log(10).pow(1.25).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
        },
        32: {
            title: "Reverberate",
            description() {return "Earn a multiplier to point, space, and time gains based on resonance. Effect: x" + format(this.effect())},
            cost: new Decimal(1e48),
            pay() {player.sn.resonance = player.sn.resonance.div(this.cost)},
            effect() {
                let effect = player.sn.resonance.add(1).log(10).pow(2).add(1)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "resonance",
            currencyInternalName: "resonance",
        },
        33: {
            fullDisplay() {return `<h3>Sunnier Days</h3><br>
                Delay the sun essence softcap based on solarity. Effect: x${format(this.effect())}<br><br>
                Cost: 1e56 resonance, 10 solar cores`
            },
            canAfford() {return player.sn.resonance.gte(1e56) && getBuyableAmount('sn', 41).gte(10)},
            pay() {player.sn.resonance = player.sn.resonance.div(1e56); setBuyableAmount('sn', 41, getBuyableAmount('sn', 41).sub(10))},
            effect() {
                let effect = getBuyableAmount('sn', 31).add(1).pow(0.4)
                return effect
            },
            unlocked() {return hasUpgrade('sn', 31)}
        },
        34: {
            fullDisplay() {return `<h3>Energized Sun</h3><br>
                Improve the sun essence to sun energy exponent. (0.75 -> 0.775, works in Solar Trial II)<br><br>
                Cost: 1e84 resonance, 10,000,000 coronal waves`
            },
            canAfford() {return player.sn.resonance.gte(1e84) && getBuyableAmount('sn', 42).gte(10000000)},
            pay() {player.sn.resonance = player.sn.resonance.div(1e84); setBuyableAmount('sn', 42, getBuyableAmount('sn', 42).sub(10000000))},
            unlocked() {return hasUpgrade('sn', 31)}
        },
        41: {
            title: "Resonant Galaxy",
            description() {return "All three Resonant Enhancements are stronger based on solar flares. Effect: x" + format(this.effect())},
            cost: new Decimal(1e45),
            effect() {
                let effect = player.sn.solarFlares.div(1e44).add(1).log(10).add(1).log(10).add(1).pow(0.25)
                return effect
            },
            currencyLayer: "sn",
            currencyDisplayName: "solar flares",
            currencyInternalName: "solarFlares",
        },
        42: {
            fullDisplay() {return `<h3>Trial Booster II</h3><br>
                Earn a multiplier to convert output based on best light earned in any Solar Trial. Effect: x${format(this.effect())}.<br><br>
                Cost: 1.00e60 solar flares, 1000 coronal waves`
            },
            canAfford() {return player.sn.solarFlares.gte(1e60) && getBuyableAmount('sn', 42).gte(1000)},
            pay() {player.sn.solarFlares = player.sn.solarFlares.sub(1e60); setBuyableAmount('sn', 42, getBuyableAmount('sn', 42).sub(1000))},
            effect() {
                let effect = player.lh.bestLight.add(1).pow(0.1)
                return effect
            },
            unlocked() {return hasUpgrade('sn', 31)}
        },
        43: {
            fullDisplay() {return `<h3>Low Pass Filter</h3><br>
                Resonant enhancement costs are cheaper based on solarity. Effect: /${format(this.effect())}.<br><br>
                Cost: 1.00e80 solar flares, 100,000 blueshifted flares`
            },
            canAfford() {return player.sn.solarFlares.gte(1e80) && getBuyableAmount('sn', 43).gte(100000)},
            pay() {player.sn.solarFlares = player.sn.solarFlares.sub(1e80); setBuyableAmount('sn', 43, getBuyableAmount('sn', 43).sub(100000))},
            effect() {
                let effect = getBuyableAmount('sn', 31).add(1).pow(0.5)
                return effect
            },
            unlocked() {return hasUpgrade('sn', 31)}
        },
        44: {
            fullDisplay() {return `<h3>A Little More Sun</h3><br>
                Unlock Tachoclinal Plasma. Good luck with Solar Trial IV...<br><br>
                Cost: 1.00e84 solar flares, 1.00e12 solarity`
            },
            canAfford() {return player.sn.solarFlares.gte(1e84) && getBuyableAmount('sn', 31).gte(1e12)},
            pay() {player.sn.solarFlares = player.sn.solarFlares.sub(1e84); setBuyableAmount('sn', 31, getBuyableAmount('sn', 31).sub(100000))},
            unlocked() {return hasUpgrade('sn', 31)}
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
        100: {
            requirementDescription: "1000 solarity",
            effectDescription: "Generate 5% of solarity gain per second",
            done() { return getBuyableAmount('sn', 31).gte(1000) }
        }
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
        12: {
            title() {return "Time Conversion (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(1e15).mul(x.mul(1.5).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(25)) cost = cost.pow(1.25)
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 12).gte(25)) {
                    return "\
                    Multiplying convert output by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying convert output by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
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
            purchaseLimit() {
                let limit = new Decimal(100)
                return limit
            },
            canAfford() { return player.timePoints.gte(this.cost()) },
            buy() {
                player.timePoints = player.timePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return challengeCompletions('sn', 12) >= 1}
        },
        13: {
            title() {return "Time Essence (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")"},
            cost(x) {
                let cost = new Decimal(1e75).mul(x.mul(1.5).add(1)).mul(new Decimal(1.75).pow(x))
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 13).gte(999)) {
                    return "\
                    Multiplying sun essence gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Multiplying sun essence gain by x"+ format(this.effectBase()) +" each\n\
                    Currently: x" + format(this.effect()) + "\n\
                    Cost: "+ format(this.cost()) +" time\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(1.75)
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            purchaseLimit() {
                let limit = new Decimal(100)
                return limit
            },
            canAfford() { return player.timePoints.gte(this.cost()) },
            buy() {
                player.timePoints = player.timePoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return challengeCompletions('sn', 12) >= 1}
        },
        21: {
            title() {return "Resonant Enhancement Type-A (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(1).mul(x.mul(0.25).add(1)).mul(new Decimal(1.05).pow(x))
                if (hasUpgrade('sn', 12)) cost = new Decimal(1).mul(x.mul(2).add(1)).mul(new Decimal(2.5).pow(x))
                if (x.gte(10)) cost = cost.pow(2)
                if (hasUpgrade('sn', 43)) cost = cost.div(upgradeEffect('sn', 43))
                return cost
            },
            display() { 
                if (hasUpgrade('sn', 12)) {
                    if (getBuyableAmount('sn', 21).gte(10)) {
                        return "\
                        Multiplying resonance multiplier by x"+ format(this.effectBase()) +" each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" resonance\n\
                        <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                    } else {
                        return "\
                        Multiplying resonance multiplier by x"+ format(this.effectBase()) +" each\n\
                        Currently: x" + format(this.effect()) + "\n\
                        Cost: "+ format(this.cost()) +" resonance\n\
                        " 
                    }
                } else {
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
                }
            },
            effectBase() {
                let base = new Decimal(0.01)
                if (hasUpgrade('sn', 12)) base = new Decimal(1.5)
                if (hasUpgrade('sn', 41)) base = base.mul(upgradeEffect('sn', 41))
                return base
            },
            effect() {
                let effect = this.effectBase().mul(getBuyableAmount(this.layer, this.id))
                if (hasUpgrade('sn', 12)) effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('sn', 31)) player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        22: {
            title() {return "Resonant Enhancement Type-B (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(50).mul(x.mul(0.25).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(x.div(33).add(1))
                if (hasUpgrade('sn', 43)) cost = cost.div(upgradeEffect('sn', 43))
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
                if (hasUpgrade('sn', 22)) base = base.mul(upgradeEffect('sn', 22))
                if (hasUpgrade('sn', 41)) base = base.mul(upgradeEffect('sn', 41))
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                if (hasUpgrade('sn', 41)) effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id).mul(upgradeEffect('sn', 41)))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('sn', 31)) player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        23: {
            title() {return "Resonant Enhancement Type-C (" + formatWhole(getBuyableAmount(this.layer, this.id)) + ")"},
            cost(x) {
                let cost = new Decimal(150).mul(x.mul(0.25).add(1)).mul(new Decimal(1.5).pow(x))
                if (x.gte(10)) cost = cost.pow(x.div(20).add(1))
                if (hasUpgrade('sn', 43)) cost = cost.div(upgradeEffect('sn', 43))
                return cost
            },
            display() { 
                if (getBuyableAmount('sn', 23).gte(10)) {
                    return "\
                    Weakening resonance overflow by x"+ format(this.effectBase()) + " each\n\
                    Currently: /" + format(Decimal.div(1, this.effect())) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    <b style='color: #ff0000'>[SOFTCAPPED]<b>" 
                } else {
                    return "\
                    Weakening resonance overflow by x"+ format(this.effectBase()) +" each\n\
                    Currently: /" + format(Decimal.div(1, this.effect())) + "\n\
                    Cost: "+ format(this.cost()) +" resonance\n\
                    " 
                }
            },
            effectBase() {
                let base = new Decimal(0.75)
                if (hasUpgrade('sn', 41)) base = base.div(upgradeEffect('sn', 41))
                return base
            },
            effect() {
                let effect = this.effectBase().pow(getBuyableAmount(this.layer, this.id))
                return effect
            },
            canAfford() { return player.sn.resonance.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('sn', 31)) player.sn.resonance = player.sn.resonance.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone('sn', 0)}
        },
        31: {
            title() {return "Solarity (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = player.sn.points.div(1e36).pow(0.9)
                gain = gain.mul(buyableEffect('sn', 41))
                return gain
            },
            display() {
                return "\
                Sacrifice all your sun essence for " + format(this.cost()) + " Solarity\n\
                Generates " + format(this.effect().mul(100)) + "% of Spacetime and Sun Essence gain on reset per second\n\
                Requires: 1e36 sun essence\n\
                " 
            },
            effect() {
                let effect = Decimal.sub(1, Decimal.div(1, getBuyableAmount('sn', 31).add(1).pow(0.25))).pow(3)
                return effect
            },
            canAfford() { return player.sn.points.gte(1e36) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('sn', true)     
                player.sn.points = new Decimal(0)
                player.spacePoints = new Decimal(5)
            },
        },
        41: {
            title() {return "Solar Cores (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('sn', 31).div(10).pow(0.25)
                return gain
            },
            display() {
                return "\
                Sacrifice all your Solarity for " + format(this.cost()) + " Solar Cores\n\
                Multiplies solarity gain by x" + format(this.effect()) + "\n\
                Requires: 10 Solarity\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('sn', 41).add(1).log(2).add(1).log(2).add(1)
                return effect
            },
            canAfford() { return getBuyableAmount('sn', 31).gte(10) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('sn', true)
                setBuyableAmount('sn', 31, new Decimal(0))
                player.spacePoints = new Decimal(5)
            },
        },
        42: {
            title() {return "Coronal Waves (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('sn', 31).div(100).pow(0.5).mul(player.sn.sunEnergy.div(1e33).pow(0.2))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Solarity and Sun Energy for " + format(this.cost()) + " Coronal Waves\n\
                Speeds up absolute time by x" + format(this.effect()) + "\n\
                Requires: 100 Solarity, 1e33 Sun Energy\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('sn', 42).add(1).pow(1.5)
                return effect
            },
            canAfford() { return getBuyableAmount('sn', 31).gte(100) && player.sn.sunEnergy.gte(1e33)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('sn', true)
                setBuyableAmount('sn', 31, new Decimal(0))
                player.sn.sunEnergy = new Decimal(0)
                player.spacePoints = new Decimal(5)
            },
        },
        43: {
            title() {return "Blueshifted Flares (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('sn', 31).div(1000000).pow(0.5).mul(player.sn.resonance.div(1e63).pow(0.2))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Solarity and Resonance for " + format(this.cost()) + " Blueshifted Flares\n\
                Increases spacetime enhancement buyable caps by +" + formatWhole(this.effect()) + "\n\
                Requires: 1,000,000 Solarity, 1e63 Resonance\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('sn', 43).add(1).log(10).mul(6)
                return effect.floor()
            },
            canAfford() { return getBuyableAmount('sn', 31).gte(1000000) && player.sn.resonance.gte(1e63)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('sn', true)
                setBuyableAmount('sn', 31, new Decimal(0))
                player.sn.sunEnergy = new Decimal(0)
                player.spacePoints = new Decimal(5)
            },
        },
        51: {
            title() {return "Tachoclinal Plasma (" + format(getBuyableAmount(this.layer, this.id)) + ")"},
            cost() { // Return gain
                let gain = getBuyableAmount('sn', 31).div(1e12).pow(0.33).mul(player.sn.lightEssence.div(1e84).pow(0.33))
                return gain
            },
            display() {
                return "\
                Sacrifice all your Solarity and for " + format(this.cost()) + " Tachoclinal Plasma\n\
                Raises base light gain to the power of ^" + format(this.effect()) + "\n\
                Requires: 1e12 Solarity, 1e84 Light Essence\n\
                " 
            },
            effect() {
                let effect = getBuyableAmount('sn', 51).add(1).log(2).add(1).log(2).add(1)
                return effect
            },
            canAfford() { return getBuyableAmount('sn', 31).gte(1e12) && player.sn.lightEssence.gte(1e84) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.cost()))
                doReset('sn', true)
                setBuyableAmount('sn', 31, new Decimal(0))
                player.sn.lightEssence = new Decimal(0)
                player.spacePoints = new Decimal(5)
            },
            unlocked() {return hasUpgrade('sn', 44)}
        },
    },
    challenges: {
        11: {
            name: "Solar Trial I",
            fullDisplay() {return `
                You cannot use Spacetime Conversion. Earn a multiplier to light gain based on spacetime.<br>
                Currently: x${format(inChallenge('sn', 11) ? player.st.points.div(1e3).pow(0.5).add(1) : new Decimal(1))}<br>
                Goal: 10,000,000 light<br>
                Reward: Unlock the Capsule solar power, more solar flare upgrades, and Solar Sacrifice
               `
            },
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(10000000)},
            unlocked() {return hasUpgrade('sn', 11)},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        },
        12: {
            name: "Solar Trial II",
            fullDisplay() {return `
                The sun essence to sun energy exponent is reduced. (0.75 -> 0.5) Earn a multiplier to light gain based on sun energy.<br>
                Currently: x${format(inChallenge('sn', 12) ? player.sn.sunEnergy.pow(0.5).add(1) : new Decimal(1))}<br>
                Goal: 1.00e9 light<br>
                Reward: Unlock the Time Flux solar power, more time buyables, and Solar Magnets
               `
            },
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunEnergy = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(1e9)},
            unlocked() {return challengeCompletions('sn', 12) >= 1},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        },
        13: {
            name: "Solar Trial III",
            fullDisplay() {return `
                Spacetime enhancement buyable effects are set to 1. Earn a multiplier to light gain based on points.<br>
                Currently: x${format(inChallenge('sn', 13) ? Decimal.pow(1.5, player.points.add(1).log(5).add(1)) : new Decimal(1))}<br>
                Goal: 1.00e18 light<br>
                Reward: Unlock the Overflow solar power and the Solarity Module
               `
            },
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(1e18)},
            unlocked() {return challengeCompletions('sn', 12) >= 1},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        },
        14: {
            name: "Solar Trial IV",
            fullDisplay() {return `
                No debuffs, but no bonus light multipliers.<br>
                Goal: 1.00e18 light<br>
                Reward: Re-unlock the Moon
               `
            },
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(1e18)},
            unlocked() {return challengeCompletions('sn', 13) >= 1},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        },
        21: {
            name: "Solar Trial V",
            fullDisplay() {return `
                You can only increase The ${tmp.st.getAbsSpaceName}'s side lengths using the Lengthener. Earn a multiplier to light gain based on stored absolute space.<br>
                Currently: x${format(inChallenge('sn', 21) ? tmp.st.getAbsoluteSpaceLengths.pow(tmp.st.getAbsoluteSpaceDims) : new Decimal(1))}<br>
                Goal: 1.00e42 light<br>
                Reward: Unlock the Drill and Shine solar powers, the Moon requirement is set to 10,000 while in DSoTM, and lunar AC/DC generation is no longer softcapped.
               `
            },
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(1e42)},
            unlocked() {return challengeCompletions('sn', 14) >= 1},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        },
        22: {
            name: "Solar Trial VI",
            fullDisplay() {return `
                You are trapped in all previous solar trials at once, and bonus light multipliers are raised to the power of ^0.5.<br>
                Goal: 1.11e111 light<br>
                Reward: The Moon behaves as if it was unlocked first.
               `
            },
            countsAs: [11, 12, 13, 14, 21],
            onEnter() {
                player.spacePoints = new Decimal(5)
                player.timePoints = new Decimal(15)
                player.timePassed = new Decimal(0)
                player.sn.sunTimePassed = new Decimal(0)
            },
            onExit() {
                player.lh.light = new Decimal(0)
                player.lh.solarPrestige = new Decimal(0)
                setBuyableAmount('lh', 11, new Decimal(0))
                setBuyableAmount('lh', 12, new Decimal(0))
                player.lh.solarSacrifice = new Decimal(0)
                setBuyableAmount('lh', 21, new Decimal(0))
                setBuyableAmount('lh', 22, new Decimal(0))
                setBuyableAmount('lh', 23, new Decimal(0))
                player.lh.solarMagnets = new Decimal(0)
                setBuyableAmount('lh', 31, new Decimal(0))
                setBuyableAmount('lh', 32, new Decimal(0))
            },
            canComplete() {return player.lh.light.gte(1.11e111)},
            onComplete() {player.mn.unlockOrder = 0},
            unlocked() {return challengeCompletions('sn', 14) >= 1},
            style() {return {
                "width": "325px",
                "height": "325px",
                "border-color": "#ffa200",
                "background-color": "#523400",
                "color": "#ffa200",
                "text-shadow": "0px 0px 10px #ffa200",
                "box-shadow": "0px 0px 10px #ffa200",
                "align-content": "center"
            }},
        }
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
            "Solarity Module": {
                content: [
                    "blank",
                    ["display-text", "All solarity buyables will force a Sun reset, but you keep time on reset"],
                    "blank",
                    ["milestones", [100]],
                    "blank",
                    ["buyables", [3, 4, 5]]
                ],
                unlocked() {return challengeCompletions('sn', 13) >= 1}
            }
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
                    ["display-text", () => {
                        if (player.sn.resonance.gte(tmp.sn.getResonanceSlowdownStart)) {
                            return "Due to having more than " + format(tmp.sn.getResonanceSlowdownStart) + " resonance, the first resonance penalty is raised to the power of ^" + format(tmp.sn.getResonanceSlowdownPow)
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
            "Solar Power Sub-Module": {
                content: [
                    "blank",
                    ["display-text", () => {
                        if (hasUpgrade('sn', 11)) return "You have " + format(player.sn.lightEssence) + " light essence, which generate a base of " + format(tmp.sn.lightEssenceEffect) + " light per second while in a Solar Trial\
                        <br>Completing a solar trial will add +0.05 to the sun essence gain exponent (base is 0.5)"
                        return "You have " + format(player.sn.lightEssence) + " light essence, which ???"
                    }],
                    "blank",
                    ["display-text", () => {
                        if (hasUpgrade('sn', 11)) return "Your best light earned in a Solar Trial is " + format(player.lh.bestLight)
                    }],
                    "blank",
                    "challenges",
                    "blank",
                    ["display-text", () => {
                        if (hasUpgrade('sn', 11)) return "Activating a Solar Power will force a Sun reset"
                    }],
                    "blank",
                    "clickables",
                    "blank",
                ]
            },
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => {if (getResetGain('sn').gte(1e36) || player.sn.points.gte(1e36)) return "<b style='color: #ff0000; text-shadow: 0px 0px 10px #ff0000'>[SOFTCAPPED: GAIN PAST " + format(tmp.sn.softcap) + " IS RAISED TO THE POWER OF " + format(tmp.sn.softcapPower) + "]</b><br><br>"}],
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
        ["milestones", [0, 1, 2]],
        ["microtabs", "sun"]
    ],
    update(diff) {
        player.sn.sunEnergy = player.sn.sunEnergy.add(new Decimal(0.01).mul(tmp.sn.sunEnergyMult).mul(diff))
        player.sn.sunTimePassed = player.sn.sunTimePassed.add(getTimeConsumptionMultis().mul(diff))
        player.sn.resonance = player.sn.resonance.mul(tmp.sn.getResonanceMult.pow(diff))
        if (hasMilestone('sn', 100)) setBuyableAmount('sn', 31, getBuyableAmount('sn', 31).add(tmp.sn.buyables[31].cost.mul(0.05).mul(diff)))
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