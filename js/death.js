addLayer("dt", {
    name: "death",
    symbol: "DT",
    row: 1,
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
    }},
    tooltip() {
        if (!player.dt.unlocked) {
            return "You'll never know how much you have left, until it's all gone. (Requires 25000 time)"
        } else {
            return format(player.lf.points) + " death essence"
        }
    },
    color: "#360d87",
    requires: new Decimal(25000),
    resource: "death essence",
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
    hotkeys: [
        {key: "d", description: "D: Reset for death essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        
    },
    milestones: {
        0: {
            requirementDescription: "Reset for death essence once",
            effectDescription: "Unlock ",
            done() { return player.dt.points.gte(1) }
        },
    },
    clickables: {
    },
    buyables: {
    },
    microtabs: {
        death: {
            "": {
                content: [
                    "blank",
                ]
            },
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "milestones",
        ["microtabs", "death"]
    ],
    update(diff) {
        
    },
    layerShown() {return hasUpgrade('st', 24)}
})
