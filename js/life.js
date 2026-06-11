addLayer("lf", {
    name: "life",
    symbol: "LF",
    row: 1,
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
        lifeEnergy: new Decimal(0)
    }},
    tooltip() {
        if (!player.lf.unlocked) {
            return "(Requires 25000 space)"
        } else {
            return format(player.lf.points, 0) + " life essence"
        }
    },
    onPrestige() {
        player.spacePoints = new Decimal(15)
        player.timePoints = new Decimal(5)
    },
    effectDescription() {
       return "which multiplies point capacity by " + format(tmp.lf.effect)
    },
    effect() {
        let effect = new Decimal(4).mul(player.lf.points.pow(0.75)).add(1)
        return effect
    },
    color: "#C5E1A5",
    requires: new Decimal(10000),
    resource: "life essence",
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
    lifeEnergyMult() {
        let mult = player.lf.points.pow(0.75)
        return mult
    },
    lifeEnergyEffect() {
        let effect = player.lf.lifeEnergy.pow(0.5).add(1)
        return effect
    },
    hotkeys: [
        {key: "l", description: "L: Reset for life essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        
    },
    milestones: {
        0: {
            requirementDescription: "Reset for life essence once",
            effectDescription: "Start resets with 15 space and 5 time",
            done() {return player.lf.points.gte(1)}
        },
        1: {
            requirementDescription: "10 life essence",
            effectDescription: "Unlock Absolute Space (in Spacetime)",
            done() {return player.lf.points.gte(10)}
        }
    },
    clickables: {
    },
    buyables: {
    },
    microtabs: {
        life: {
            "Genetics": {
                content: [
                    "blank",
                ],
                unlocked() {return hasMilestone('lf', 2)}
            },
        }
    },
    infoboxes: {
        lifeEssenceInfo: {
            title: "AUDIO LOG [ID: LF-MAIN]",
            body() {return `
                DATE: 6/10/XX<br>
                AUTHOR(S): GRACE<br>
                TRANSCRIPT:<br>
                <br>
                GRACE: So you wanna choose MY space-aligned layer? Great choice, player! Welcome to Life!<br><br>
                GRACE: Notice how you're constantly running out of point capacity when you're constantly in the mood for MORE? You're in luck! Life essence, the currency for this layer, boosts point capacity by a massive amount!<br><br>
                GRACE: It also produces Life Energy, which directly multiplies the objectively better of the two currencies: space! Don't tell Clyde that by the way, he'll probably hardcap your points at zero (0) if you do. I'll see you again once you gather ten (10) life essence, player!`
            },
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => {return "You have " + format(player.lf.lifeEnergy) + " life energy, (+" + format(new Decimal(0.01).mul(tmp.lf.lifeEnergyMult)) + "/s) which multiplies space gain from all sources by x" + format(tmp.lf.lifeEnergyEffect)}],
        "blank",
        "milestones",
        "blank",
        ["infobox", "lifeEssenceInfo"],
        "blank",
    ],
    update(diff) {
        player.lf.lifeEnergy = player.lf.lifeEnergy.add(new Decimal(0.01).mul(tmp.lf.lifeEnergyMult).mul(diff))
    },
    layerShown() {return hasUpgrade('st', 24) || player.lf.unlocked}
})
