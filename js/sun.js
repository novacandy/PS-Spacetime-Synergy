addLayer("sn", {
    name: "sun",
    symbol: "SN",
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
            return "(Requires 25000 time)"
        } else {
            return format(player.mn.points) + " sun essence"
        }
    },
    color: "#360d87",
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
    hotkeys: [
        {key: "d", description: "D: Reset for sun essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        
    },
    milestones: {
        0: {
            requirementDescription: "Reset for sun essence once",
            effectDescription: "Unlock ",
            done() { return player.sn.points.gte(1) }
        },
    },
    clickables: {
    },
    buyables: {
    },
    microtabs: {
        sun: {
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
        ["microtabs", "sun"]
    ],
    update(diff) {
        
    },
    layerShown() {return hasUpgrade('st', 24) && !player.mn.unlocked}
})
