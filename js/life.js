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
    }},
    tooltip() {
        if (!player.lf.unlocked) {
            return "(Requires 25000 space)"
        } else {
            return format(player.lf.points) + " life"
        }
    },
    color: "#C5E1A5",
    requires: new Decimal(25000),
    resource: "life essence",
    baseResource: "space",
    baseAmount() {return player.spacePoints},
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
        {key: "l", description: "L: Reset for life essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        
    },
    milestones: {
        0: {
            requirementDescription: "Reset for life once",
            effectDescription: "Unlock Genetics",
            done() { return player.lf.points.gte(1) }
        },
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
                ]
            },
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "milestones",
        ["microtabs", "life"]
    ],
    update(diff) {
        
    },
    layerShown() {return hasUpgrade('st', 24)}
})
