addLayer("ach", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    symbol: "A",
    tooltip: "Achievements",
    color: "#e0f000",
    resource: "achievements",
    row: "side",
    position: 0,
    type: "none",
    layerShown() { return true },
    achievements: {
        11: {
            name: "Begin The Synergism!",
            tooltip: "Start converting for either Space or Time.",
            done() {return player.st.converting},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        12: {
            name: "Time for Spacetime",
            tooltip: "Do a Spacetime reset for the first time.",
            done() {return hasMilestone('st', 0)},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        13: {
            name: "First Improvement",
            tooltip: "Purchase the <b>Doubler</b> spacetime upgrade.",
            done() {return hasUpgrade('st', 11)},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        14: {
            name: "Enhanced Cosmos",
            tooltip: "Level up the <b>Point Enhancement</b> buyable once.",
            done() {return getBuyableAmount('st', 11).gte(1)},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        15: {
            name: "More At Once",
            tooltip: "Increase your Convert Rate.",
            done() {return tmp.st.getConvertRate.gte(2)},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        16: {
            name: "Decisions, Decisions",
            tooltip: "Purchase the <b>Split In Two</b> spacetime upgrade.",
            done() {return hasUpgrade('st', 24)},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        101: {
            name: "Lunar Ascent!",
            tooltip: "Unlock the Moon layer.",
            done() {return player.mn.unlocked},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        201: {
            name: "Solar Ascent!",
            tooltip: "Unlock the Sun layer.",
            done() {return player.sn.unlocked},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        /*
        11: {
            name: "",
            tooltip: "",
            done() {return false},
            onComplete() {
                player.ach.points = player.ach.points.add(1)
            },
            unlocked() {return true}
        },
        */
    },
    microtabs: {
        "achievements": {
            "Spacetime Achievements": {
                content: [
                    "blank",
                    ["achievements", [1, 2, 3, 4, 5]]
                ],
                unlocked() {return true}
            },
            "Moon Achievements": {
                content: [
                    "blank",
                    ["achievements", [10, 11, 12, 13, 14]]
                ],
                unlocked() {return player.mn.unlocked}
            },
            "Sun Achievements": {
                content: [
                    "blank",
                    ["achievements", [20, 21, 22, 23, 24]]
                ],
                unlocked() {return player.sn.unlocked}
            },
        }
    },
    tabFormat: [
        "main-display",
        "blank",
        ["microtabs", "achievements"]
    ]
})
addLayer("sta", {
    startData() { return {
        unlocked: true,
    }},
    symbol: "S",
    tooltip: "Statistics",
    color: "#ff6671",
    row: "side",
    position: 1,
    type: "none",
    layerShown() { return true },
})
addLayer("gal", {
    startData() { return {
        unlocked: true,
    }},
    symbol: "G",
    tooltip: "Gallery",
    color: "#7e00f5",
    row: "side",
    position: 3,
    type: "none",
    layerShown() { return true },
})