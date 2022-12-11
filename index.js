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

function fight(defenders, attackers, min_attackers, history) {
    if (!history)
        history = [{attackers, defenders}];
    if (!min_attackers)
        min_attackers = 1;
    if (attackers < min_attackers || defenders < 1)
        return [defenders, attackers, history];

    const d = dice_throws(Math.min(defenders, 2));
    const a = dice_throws(Math.min(attackers, 3));
    history.push({attackers_dice: a, defenders_dice: d});
    for (let i=0;i<Math.min(d.length, a.length);i++) {
        if (d[i] >= a[i])
             attackers -= 1;
        else defenders -= 1;
        history[history.length - 1].attackers = attackers;
        history[history.length - 1].defenders = defenders;
        if (DEBUG) console.log({
            attack_dices: a,
            defend_dices: d,
            state: [attackers, "/", defenders].join(),
            i: i
        });
    }
    return fight(defenders, attackers, min_attackers, history);
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

    const [defenders, attackers, history] = fight(_defenders, _attackers, min_attackers);

    const details = `<details><summary>Fight details</summary><pre>${JSON.stringify(history, null, 2)}</pre></details>`;
    if (defenders === 0) {
        log(
            SWORD, " Attackers win!<br>",
            "Move ", attackers, " troops to the territory.",
            " ( <span style=\"color: red;\">", attackers - _attackers, "</span> )",
            details,
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
            details,
        );
        attackers_input.value = attackers;
        defenders_input.value = defenders;
        attackers_input.focus();
    }
}

function attackers_add(k) {attackers_input.value = Math.min(Math.max(parseInt(attackers_input.value) + k, attackers_input.min), attackers_input.max) || 0};
function defenders_add(k) {defenders_input.value = Math.min(Math.max(parseInt(defenders_input.value) + k, defenders_input.min), defenders_input.max) || 0};
