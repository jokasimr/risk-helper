const DEBUG = false;
const SWORD = "⚔️";
const SHIELD = "🛡️";

function dice() {
    return 1 + Math.floor(Math.random() * 6);
}

function dice_throws(n) {
    const r = [];
    for(let i=0;i<n;i++)
        r.push(dice());
    return r.sort().reverse();
}

function fight(defenders, attackers, min_attackers) {
    if (!min_attackers)
        min_attackers = 1;
    if (attackers < min_attackers || defenders < 1)
        return [defenders, attackers];

    const d = dice_throws(Math.min(defenders, 2));
    const a = dice_throws(Math.min(attackers, 3));
    for (let i=0;i<Math.min(d.length, a.length);i++) {
        if (d[i] >= a[i])
             attackers -= 1;
        else defenders -= 1;
        if (DEBUG) console.log({
            attack_dices: a,
            defend_dices: d,
            state: [attackers, "/", defenders].join(),
            i: i
        });
    }
    return fight(defenders, attackers, min_attackers);
}



const defenders_input = document.getElementById("defenders");
const attackers_input = document.getElementById("attackers");
const min_attackers_input = document.getElementById("min_attackers");
const fight_console = document.getElementById("fight_console");


function log() {
    const p = document.createElement("p");
    p.innerHTML = Array.from(arguments).join("");
    fight_console.prepend(p);
}


function go() {
    const _defenders = parseInt(defenders_input.value);
    const _attackers = parseInt(attackers_input.value);
    const min_attackers = parseInt(min_attackers_input.value);

    const [defenders, attackers] = fight(_defenders, _attackers, min_attackers);
    if (defenders === 0) {
        log(
            SWORD, " Attackers win!<br>",
            "Move ", attackers, " troops to the territory.",
            " ( <span style=\"color: red;\">", attackers - _attackers, "</span> )",
        );
        attackers_input.value = attackers - 1;
        defenders_input.value = 1;
        defenders_input.focus();
    }
    else {
        log(
            SHIELD, "Defenders win!",
            "<br>Remaining defenders: ", defenders, ".",
            " ( <span style=\"color: red;\">", defenders - _defenders, "</span> )",
            "<br>Remaining attackers: ", attackers, ".",
            " ( <span style=\"color: red;\">", attackers - _attackers, "</span> )",
        );
        attackers_input.value = attackers;
        defenders_input.value = defenders;
        attackers_input.focus();
    }
}