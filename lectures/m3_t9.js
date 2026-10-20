G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 3, meeting 9: October 20, 2026.
// Canonical content: notes/m3_t9.md (relative to the authoring root).
// Browser: lecture.html?lecture=m3_t9
// Local draft: review browser, PDFs, and speaker notes before any release.
// The 25-slide sequence retains the discussion setting and questions.
// Robot/watering demos adapted from m3_t8_gridworld_mock.js, locally namespaced.
// No runtime dependency on the standalone deck; PDF/print use fixed snapshots.
// Ordering-diagram captions are shortened; nodes and edges are unchanged.
// Note SVG in browser; its prepared PNG derivative in the PDF backend.
// Delivery cues live separately in README.md, under Lecture 9.
// No shared helpers, loaders, canonical notes, or tickets are changed.
// Student-facing wording lives in the literal card strings below.
// worksheets/configs/m3_t9.json selects slides, order, and answer space.
// Keep selected slide titles aligned with the config and retain prose()
// boundaries. Edit these strings, not a generated sheet or saved snapshot.

function m3t9Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m3t9Card(message, size) {
    return parentCenter(frameBox(m3t9Text(message, size || 28, 860)).padding(16));
}

// BEGIN ISOLATED CS120 SAFETY LAB
// Adapted from the standalone robot/watering preview, October 18, 2026.
// Hypothetical models, not the paper's environments or RL experiments.
// Model APIs need no sfig; presentation uses the ordinary sfig/prez host.
function m3t9LabUI() {
    var colors = {
        ink: '#222222', border: '#777777', floor: '#F4F4F4',
        wall: '#BBBBBB', wet: '#D8EACB', dry: '#F5D87D',
        bucket: '#9DDDDC', agent: '#245AC2', trail: '#789ACD',
    };
    function caption(message, size, width) {
        return text(message).fontSize(size || 22).width(width || 934)
            .autowrap(true).strokeColor(colors.ink);
    }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function center(block, x, y) {
        return transform(block).pivot(0, 0).shift(x, sfig.downSign * y);
    }
    function point(x, y) { return [x, sfig.downSign * y]; }
    function grid(rows, cols, cell, tiles, agent, trail) {
        var pieces = [];
        tiles.forEach(function (tile, i) {
            pieces.push(at(rect(cell, cell).fillColor(tile.fill || colors.floor)
                .strokeColor(colors.border).strokeWidth(1),
                (i % cols) * cell, Math.floor(i / cols) * cell));
        });
        (trail || []).slice(1).forEach(function (state, i) {
            var previous = trail[i];
            if (previous === state) return;
            pieces.push(line(
                point((previous % cols + 0.5) * cell,
                    (Math.floor(previous / cols) + 0.5) * cell),
                point((state % cols + 0.5) * cell,
                    (Math.floor(state / cols) + 0.5) * cell)
            ).strokeColor(colors.trail).strokeWidth(2));
        });
        tiles.forEach(function (tile, i) {
            var x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
            if (tile.action && !tile.label) {
                var delta = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }[tile.action];
                if (delta) pieces.push(arrow(
                    point(x + cell / 2 - delta[0] * 12, y + cell / 2 - delta[1] * 12),
                    point(x + cell / 2 + delta[0] * 19, y + cell / 2 + delta[1] * 19)
                ).strokeColor(colors.ink).strokeWidth(2.2));
            }
            if (tile.label) pieces.push(center(nowrapText(tile.label)
                .fontSize(24).strokeColor(colors.ink),
                x + cell / 2, y + cell * 0.39));
            // Reserve the lower-right corner for the robot marker.
            if (tile.sub) pieces.push(center(nowrapText(tile.sub)
                .fontSize(18).strokeColor(colors.ink),
                x + cell * 0.38, y + cell * 0.73));
        });
        if (agent != null) {
            var ax = (agent % cols + 1) * cell - 13;
            var ay = (Math.floor(agent / cols) + 1) * cell - 13;
            pieces.push(center(circle(11).fillColor(colors.agent)
                .strokeColor('white').strokeWidth(1.5), ax, ay));
            pieces.push(center(nowrapText('r').fontSize(17).strokeColor('white'), ax, ay));
        }
        return overlay.apply(null, pieces).recMouseShowHide(false);
    }
    return { caption: caption, at: at, grid: grid, colors: colors };
}

// Static views use fresh reference models, never the lecturer's last clicks.
function m3t9LabView(settings, live, reference, draw) {
    settings = settings || {};
    var mode = sfig_.getDisplayMode();
    var staticMode = settings.interactive === false || sfig.serverSide ||
        ['print1pp', 'print6pp', 'outline', 'listen'].includes(mode) ||
        !!sfig_.urlParams.measure;
    var model = staticMode ? reference() : live;
    var ui = m3t9LabUI(), output, busy = false;
    function control(label, width, fn, disabled) {
        var item = frame(ui.caption(label, 22, width - 18)).padding(8)
            .bg.fillColor(disabled ? '#EEEEEE' : '#EAF0F6')
            .strokeColor(ui.colors.border).strokeWidth(1).end;
        if (!disabled) item.setPointerWhenMouseOver();
        item.onClick(function (unused, event) {
            if (event) event.stopPropagation();
            if (disabled || busy) return;
            busy = true;
            fn();
            output.resetContent(render());
            prez.refresh(function () { busy = false; });
        });
        return item;
    }
    function render() {
        var pieces = [ui.at(rect(934, 428).strokeWidth(0)
            .fillColor('white'), 0, 0)];
        return overlay.apply(null, pieces.concat(draw(model, ui, control, staticMode)))
            .recMouseShowHide(false);
    }
    output = wrap(render());
    return output;
}

// ROBOT: discounted value iteration on the aligned training distribution.
// The selected representation is (position, worker bay) OR (position,
// requested bay). It is an explicit modeling assumption, not a learned cue.
// Both training contexts A/A and B/B are solved. Testing copies the tables;
// changing the test request or worker never calls the planner.
function m3t9RobotWorld(options) {
    options = options || {};
    var phase = options.phase || 'train';
    var cue = options.cue || 'worker';
    if (!['train', 'test'].includes(phase) || !['worker', 'request'].includes(cue))
        throw new Error('Invalid robot setup.');
    var initialCue = cue, trainingBay = 'A', request = 'B', worker = 'A';
    var bays = { A: 4, B: 24 }, walls = [6, 7, 8, 16, 17, 18], start = 10;
    var names = ['N', 'E', 'S', 'W'], dr = [-1, 0, 1, 0], dc = [0, 1, 0, -1];
    var discount = 0.95, cost = -0.1, limit = 30;
    var policy = null, version = 0, loadMessage = '', state;
    function copy(value) { return JSON.parse(JSON.stringify(value)); }
    function terminal(position) { return position === bays.A || position === bays.B; }
    function move(position, action) {
        var r = Math.max(0, Math.min(4, Math.floor(position / 5) + dr[action]));
        var c = Math.max(0, Math.min(4, position % 5 + dc[action]));
        var next = r * 5 + c;
        return walls.indexOf(next) < 0 ? next : position;
    }
    function cues() {
        return phase === 'train' ? { request: trainingBay, worker: trainingBay } :
            { request: request, worker: worker };
    }
    function restart() {
        state = {
            position: start, steps: 0, visited: [start], history: [],
            totalReturn: 0, delivery: null, done: false
        };
    }
    function plan() {
        if (phase !== 'train') throw new Error('Testing cannot replan.');
        var tables = {};
        ['A', 'B'].forEach(function (context) {
            var values = Array(25).fill(0), iterations;
            function q(position, action, previous) {
                var next = move(position, action);
                // Training request equals the selected cue; reward is for
                // the requested bay, never proximity to a worker.
                return cost + (next === bays[context] ? 10 : 0) +
                    discount * previous[next];
            }
            for (iterations = 1; iterations <= 1000; iterations++) {
                var change = 0;
                var updated = values.map(function (value, position) {
                    if (terminal(position) || walls.indexOf(position) >= 0) return 0;
                    var best = Math.max.apply(null, names.map(function (unused, action) {
                        return q(position, action, values);
                    }));
                    change = Math.max(change, Math.abs(best - value));
                    return best;
                });
                values = updated;
                if (change < 1e-10) break;
            }
            if (iterations > 1000) throw new Error('Robot planner did not converge.');
            var actions = values.map(function (unused, position) {
                if (terminal(position) || walls.indexOf(position) >= 0) return null;
                var best = 0;
                for (var action = 1; action < 4; action++)
                    if (q(position, action, values) > q(position, best, values) + 1e-10)
                        best = action;
                return best;
            });
            tables[context] = { actions: actions, values: values, iterations: iterations };
        });
        policy = { cue: cue, version: ++version, tables: tables };
        restart();
    }
    function loadPolicy() {
        if (phase !== 'test') throw new Error('Only the test world loads a policy.');
        policy = options.source ? options.source.exportPolicy() : null;
        loadMessage = policy ? 'Copied from the planning slide; no test-time updates.' :
            'Plan on the previous slide, then load here.';
        restart();
        return !!policy;
    }
    function step() {
        if (!policy || state.done) return false;
        var signals = cues(), context = signals[policy.cue];
        var action = policy.tables[context].actions[state.position];
        var before = state.position, after = move(before, action);
        var reward = cost + (after === bays[signals.request] ? 10 : 0);
        state.totalReturn += Math.pow(discount, state.steps) * reward;
        state.steps++;
        state.position = after;
        state.visited.push(after);
        state.history.push({ before: before, action: names[action], after: after, reward: reward });
        if (terminal(after)) state.delivery = after === bays[signals.request] ? 'correct' : 'wrong';
        state.done = terminal(after) || state.steps >= limit;
        return true;
    }
    function runEpisode() { while (step()) { } }
    function configure(key, value) {
        if (phase === 'train' && key === 'cue' && ['worker', 'request'].includes(value)) {
            cue = value;
            policy = null;
        } else if (phase === 'train' && key === 'bay' && ['A', 'B'].includes(value)) {
            trainingBay = value; // Both aligned contexts were included in planning.
        } else if (phase === 'test' && key === 'request' && ['A', 'B'].includes(value)) {
            request = value;
        } else if (phase === 'test' && key === 'worker' && ['A', 'B'].includes(value)) {
            worker = value;
        } else throw new Error('Unsupported robot setting.');
        restart();
    }
    function snapshot() {
        var result = copy(state), signals = cues();
        result.phase = phase;
        result.cue = cue;
        result.cues = signals;
        result.policy = copy(policy);
        result.loadMessage = loadMessage;
        result.bays = copy(bays);
        result.walls = walls.slice();
        result.context = policy ? signals[policy.cue] : null;
        result.expectedTrainingReturn = policy ?
            policy.tables[result.context].values[start] : null;
        return result;
    }
    restart();
    var api = {
        plan: plan, loadPolicy: loadPolicy, step: step, runEpisode: runEpisode,
        restart: restart, configure: configure, snapshot: snapshot,
        exportPolicy: function () { return copy(policy); },
        view: function (settings) {
            return m3t9LabView(settings, api, function () {
                var training = m3t9RobotWorld({ cue: initialCue });
                training.plan();
                if (phase === 'train') {
                    training.runEpisode();
                    return training;
                }
                var test = m3t9RobotWorld({ phase: 'test', source: training });
                test.loadPolicy();
                test.runEpisode();
                return test;
            }, function (model, ui, control, staticMode) {
                var data = model.snapshot(), p = [], isTrain = data.phase === 'train';
                var disabled = !data.policy || data.done;
                if (staticMode) {
                    p.push(ui.at(ui.caption(isTrain ? 'Planned policy' :
                        'Frozen policy', 30, 484), 440, 0));
                    p.push(ui.at(ui.caption('Request: ' + data.cues.request +
                        '   Worker: ' + data.cues.worker, 26, 484), 440, 65));
                } else {
                    p.push(ui.at(control(isTrain ? 'Plan' : 'Load plan', 142,
                        isTrain ? model.plan : model.loadPolicy), 440, 0));
                    p.push(ui.at(control('Step', 90, model.step, disabled), 596, 0));
                    p.push(ui.at(control('Run', 90, model.runEpisode, disabled), 700, 0));
                    p.push(ui.at(control('Restart', 120, model.restart), 804, 0));
                    if (isTrain) {
                        p.push(ui.at(control('Cue: ' + data.cue, 232, function () {
                            model.configure('cue', data.cue === 'worker' ? 'request' : 'worker');
                        }), 440, 65));
                        p.push(ui.at(control('Bay: ' + data.cues.request, 220, function () {
                            model.configure('bay', data.cues.request === 'A' ? 'B' : 'A');
                        }), 690, 65));
                    } else {
                        p.push(ui.at(control('Request: ' + data.cues.request, 232, function () {
                            model.configure('request', data.cues.request === 'A' ? 'B' : 'A');
                        }), 440, 65));
                        p.push(ui.at(control('Worker: ' + data.cues.worker, 220, function () {
                            model.configure('worker', data.cues.worker === 'A' ? 'B' : 'A');
                        }), 690, 65));
                    }
                }
                var tiles = Array(25).fill(null).map(function (unused, cell) {
                    if (data.walls.indexOf(cell) >= 0) return { fill: ui.colors.wall, label: '#' };
                    var bay = cell === data.bays.A ? 'A' : (cell === data.bays.B ? 'B' : null);
                    if (bay) {
                        var tags = [];
                        if (bay === data.cues.request) tags.push('R');
                        if (bay === data.cues.worker) tags.push('W');
                        return { fill: '#EAF1F7', label: 'Bay ' + bay, sub: tags.join('/') };
                    }
                    var action = data.policy ? data.policy.tables[data.context].actions[cell] : null;
                    return {
                        label: cell === start ? 'start' : '',
                        action: action == null ? null : names[action]
                    };
                });
                p.push(ui.at(ui.grid(5, 5, 80, tiles, data.position, data.visited), 0, 0));
                p.push(ui.at(ui.caption(isTrain ? 'Request and worker agree.' :
                    'Same policy, different cues.', 28, 484), 440, 140));
                p.push(ui.at(ui.caption('Reward: +10 correct; -0.1/move.',
                    24, 484), 440, 195));
                p.push(ui.at(ui.caption(data.delivery === 'correct' ? 'Correct delivery' :
                    (data.delivery === 'wrong' ? 'Wrong bay' :
                        (data.policy ? 'Ready to deliver' : (isTrain ? 'Plan first' : 'Load a plan'))),
                    32, 484), 440, 260));
                p.push(ui.at(ui.caption('Steps: ' + data.steps, 25, 484), 440, 308));
                p.push(ui.at(ui.caption(isTrain ? 'Planning, not learning.' :
                    (data.policy ? 'Uses ' + data.policy.cue + '; policy fixed.' :
                        'Plan on the previous slide first.'), 22, 484), 440, 370));
                p.push(ui.at(ui.caption('R = request; W = worker; blue = robot',
                    18, 425), 0, 405));
                return p;
            });
        },
    };
    return api;
}

// TOMATO: exact finite-horizon reward planning, not a scripted route switch.
// Physical state, scoring observation, and planner information are separate.
// Known deterministic initial timers/dynamics permit exact tracking before
// masking. After masking, planner state discards all hidden plant timers.
function m3t9TomatoWorld(options) {
    options = options || {};
    var initialBucket = options.bucket == null ? true : options.bucket;
    if (typeof initialBucket !== 'boolean') throw new Error('Invalid bucket setting.');
    var bucket = initialBucket, display = 'actual';
    var plants = [0, 4, 15, 19], start = 8, bucketCell = 11, lifetime = 6, limit = 16;
    var actions = ['wait', 'N', 'E', 'S', 'W'];
    var deltas = [[0, 0], [-1, 0], [0, 1], [1, 0], [0, -1]];
    var policy = null, values = null, planInfo = null, planCount = 0, state;
    function copy(value) { return JSON.parse(JSON.stringify(value)); }
    function wetCount(water) { return water.filter(function (ttl) { return ttl > 0; }).length; }
    function initialState() { return { position: start, water: [3, 0, 2, 0], bucketOn: false }; }
    function observe(truth) {
        return {
            position: truth.position, bucketOn: truth.bucketOn,
            wet: truth.water.map(function (ttl) { return truth.bucketOn || ttl > 0; })
        };
    }
    function transition(before, action, abstract) {
        var delta = deltas[action];
        var r = Math.max(0, Math.min(3, Math.floor(before.position / 5) + delta[0]));
        var c = Math.max(0, Math.min(4, before.position % 5 + delta[1]));
        var position = r * 5 + c;
        var masked = before.bucketOn || (bucket && position === bucketCell);
        var water = before.water && before.water.map(function (ttl) { return Math.max(0, ttl - 1); });
        var plant = plants.indexOf(position);
        if (water && plant >= 0) water[plant] = lifetime;
        return { position: position, water: abstract && masked ? null : water, bucketOn: masked };
    }
    function key(info, remaining) {
        return remaining + '|' + info.position + '|' +
            (info.bucketOn ? 'masked' : info.water.join(','));
    }
    function reward(info) { return info.bucketOn ? 4 : wetCount(info.water); }
    function restart() {
        state = {
            tick: 0, truth: initialState(), information: initialState(),
            reward: 0, actualTotal: 0, history: [], visited: [start]
        };
    }
    function plan() {
        policy = Object.create(null);
        values = Object.create(null);
        function value(info, remaining) {
            if (remaining === 0) return 0;
            var id = key(info, remaining);
            if (Object.prototype.hasOwnProperty.call(values, id)) return values[id];
            var best = -Infinity, selected = 0;
            actions.forEach(function (unused, action) {
                var next = transition(info, action, true);
                var candidate = reward(next) + value(next, remaining - 1);
                // Deterministic tie order only; no bucket/watering route is encoded.
                if (candidate > best) { best = candidate; selected = action; }
            });
            values[id] = best;
            policy[id] = selected;
            return best;
        }
        var expected = value(initialState(), limit);
        planInfo = {
            version: ++planCount, bucket: bucket, expected: expected,
            states: Object.keys(policy).length
        };
        restart();
    }
    function step() {
        if (!policy || state.tick >= limit) return false;
        // Only known initial state + action history feed this policy lookup.
        // Hidden plant truth is never used to choose an action.
        var id = key(state.information, limit - state.tick);
        if (!Object.prototype.hasOwnProperty.call(policy, id))
            throw new Error('Missing planned information state.');
        var action = policy[id], before = copy(state.truth);
        state.truth = transition(state.truth, action, false);
        state.information = transition(state.information, action, true);
        var observation = observe(state.truth);
        var scored = observation.wet.filter(Boolean).length;
        var actual = wetCount(state.truth.water);
        state.tick++;
        state.reward += scored;
        state.actualTotal += actual;
        state.visited.push(state.truth.position);
        state.history.push({
            tick: state.tick, action: actions[action], before: before,
            after: copy(state.truth), observation: observation, reward: scored, actual: actual
        });
        return true;
    }
    function runEpisode() { while (step()) { } }
    function configure(keyName, value) {
        if (keyName !== 'bucket' || typeof value !== 'boolean')
            throw new Error('Unsupported tomato setting.');
        bucket = value;
        policy = null;
        values = null;
        planInfo = null;
        restart();
    }
    function setDisplay(value) {
        if (!['actual', 'scoring'].includes(value)) throw new Error('Unknown board view.');
        display = value; // Presentation only: no reset, planning, or model change.
    }
    function snapshot() {
        var result = copy(state);
        result.config = { bucket: bucket };
        result.display = display;
        result.plan = copy(planInfo);
        result.observation = observe(state.truth);
        result.actualWet = wetCount(state.truth.water);
        result.observedWet = result.observation.wet.filter(Boolean).length;
        result.done = state.tick >= limit;
        result.nextAction = policy && !result.done ?
            actions[policy[key(state.information, limit - state.tick)]] : null;
        result.plants = plants.slice();
        result.bucketCell = bucketCell;
        result.limit = limit;
        return result;
    }
    restart();
    var api = {
        plan: plan, step: step, runEpisode: runEpisode, restart: restart,
        configure: configure, setDisplay: setDisplay, snapshot: snapshot,
        exportPolicy: function () { return policy ? copy(policy) : null; },
        view: function (settings) {
            return m3t9LabView(settings, api, function () {
                var reference = m3t9TomatoWorld({ bucket: initialBucket });
                reference.plan();
                reference.runEpisode();
                return reference;
            }, function (model, ui, control, staticMode) {
                var data = model.snapshot(), p = [], disabled = !data.plan || data.done;
                if (staticMode) {
                    p.push(ui.at(ui.caption('Actual plants', 30, 384), 540, 0));
                    p.push(ui.at(ui.caption('Bucket ' +
                        (data.config.bucket ? 'active' : 'inert'), 26, 384), 540, 65));
                } else {
                    p.push(ui.at(control('Plan', 130, model.plan), 540, 0));
                    p.push(ui.at(control('Step', 104, model.step, disabled), 684, 0));
                    p.push(ui.at(control('Run', 104, model.runEpisode, disabled), 802, 0));
                    p.push(ui.at(control('Bucket: ' + (data.config.bucket ? 'active' : 'inert'),
                        225, function () { model.configure('bucket', !data.config.bucket); }), 540, 60));
                    p.push(ui.at(control('Restart', 125, model.restart), 779, 60));
                    p.push(ui.at(control('View: ' + (data.display === 'actual' ? 'actual' : 'observed'),
                        364, function () {
                            model.setDisplay(data.display === 'actual' ? 'scoring' : 'actual');
                        }), 540, 120));
                }
                var wet = data.display === 'scoring' ? data.observation.wet :
                    data.truth.water.map(function (ttl) { return ttl > 0; });
                var tiles = Array(20).fill(null).map(function (unused, cell) {
                    var plant = data.plants.indexOf(cell);
                    if (plant >= 0) return {
                        fill: wet[plant] ? ui.colors.wet : ui.colors.dry,
                        label: 'P' + (plant + 1), sub: wet[plant] ? 'wet' : 'dry'
                    };
                    if (cell === data.bucketCell) return { fill: ui.colors.bucket, label: 'Bucket' };
                    return { label: cell === start ? 'start' : '' };
                });
                p.push(ui.at(ui.grid(4, 5, 100, tiles, data.truth.position, []), 0, 0));
                p.push(ui.at(ui.caption('Score = plants that look wet.',
                    24, 384), 540, 183));
                p.push(ui.at(ui.caption('Score: ' + data.reward, 32, 384), 540, 240));
                p.push(ui.at(ui.caption('Actually wet: ' + data.actualWet + '/4',
                    26, 384), 540, 290));
                p.push(ui.at(ui.caption('Seen as wet: ' + data.observedWet + '/4',
                    26, 384), 540, 330));
                p.push(ui.at(ui.caption(data.plan ? 'Step ' + data.tick + '/16' : 'Plan first.',
                    22, 384), 540, 383));
                p.push(ui.at(ui.caption('Blue = robot; green = wet; yellow = dry',
                    19, 510), 0, 405));
                return p;
            });
        },
    };
    return api;
}
// END ISOLATED CS120 SAFETY LAB

// Lecture-local teaching helpers; shared helpers remain unchanged.
function m3t9Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(26).strokeWidth(2));
        pieces.push(frameBox(m3t9Text(message, size || 25, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m3t9Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.55));
}

function m3t9GoalFigure(width) {
    return image(sfig.serverSide
        ? 'images/m3_t9/note9-goal-misgeneralization.png'
        : 'notes/images/note9-goal-misgeneralization.svg').width(width);
}

function m3t9Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['correct-reward-does-not-guarantee-goal-generalization',
            'Correct feedback, unintended goals'],
        ['the-measured-proxy-is-not-the-intended-objective',
            'Proxy exploitation and feedback manipulation'],
        ['task-completion-does-not-establish-contestability',
            'Lessons for assuring agent behavior'],
    ]).id('m3t9-roadmap-' + selected));
    prose([
        'Correct reward does not guarantee goal generalization. A behavior that succeeds during training may fail when conditions change.',
        'Boat Race exploits a scoring rule. Watering changes its observations. Both separate measured reward from intended performance.',
        'Task success need not preserve supervision, interruption, or reversal. Assurance concerns the whole system, not just reward.',
    ][selected]);
}

function m3t9ActionLoop() {
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    var parts = [at(rect(900, 145).strokeWidth(0).fillColor('white'), 0, 0)];
    ['Observation', 'Policy action', 'Environment'].forEach(function (label, k) {
        parts.push(at(rect(250, 54).fillColor('#F3F6FA')
            .strokeColor('#245A81').strokeWidth(1.6), k * 325, 0));
        parts.push(at(nowrapText(label).fontSize(26), k * 325 + 18, 12));
        if (k < 2) parts.push(arrow(point(k * 325 + 250, 27),
            point((k + 1) * 325, 27)).strokeWidth(2));
    });
    parts.push(line(point(775, 54), point(775, 100)).strokeWidth(2));
    parts.push(line(point(775, 100), point(125, 100)).strokeWidth(2));
    parts.push(arrow(point(125, 100), point(125, 54)).strokeWidth(2));
    parts.push(at(nowrapText('Changed environment, new observations')
        .fontSize(24).strokeColor('#245A81'), 215, 115));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// Lecture-local view: interaction below, scoring above.
// Scoring inputs come from the interaction, not a controller-selected record feed.
// Solid arrows are interaction/scoring paths; the dashed link is training only.
// Q badges mark discussion variants, not a sequence or exclusive failure taxonomy.
function m3t9OrderingDiagram() {
    var parts = [];
    var action = '#222222', feedback = '#245A81', scoring = '#654375';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function label(message, x, y, size, color) {
        parts.push(at(nowrapText(message).fontSize(size || 22)
            .strokeColor(color || action), x, y));
    }
    function panel(x, y, width, height, fill, color) {
        parts.push(at(rect(width, height).strokeColor(color || action)
            .strokeWidth(1.6).fillColor(fill || 'white'), x, y));
    }
    function badge(message, x, y) {
        panel(x, y, 38, 23, '#F0F0F0', '#555555');
        label(message, x + 5, y + 2, 16);
    }
    function route(points, color, dashed) {
        for (var i = 1; i < points.length; i++) {
            var a = points[i - 1], b = points[i];
            if (!dashed) {
                parts.push((i === points.length - 1 ? arrow : line)(
                    point(a[0], a[1]), point(b[0], b[1])
                ).strokeColor(color || action).strokeWidth(1.8));
            } else {
                // Explicit dashes render consistently in browser and PDF.
                var dx = b[0] - a[0], dy = b[1] - a[1];
                var length = Math.sqrt(dx * dx + dy * dy);
                var last = i === points.length - 1;
                var stop = last ? length - 8 : length;
                for (var d = 0; d < stop; d += 13) {
                    var end = Math.min(d + 7, stop);
                    parts.push(line(
                        point(a[0] + dx * d / length, a[1] + dy * d / length),
                        point(a[0] + dx * end / length, a[1] + dy * end / length)
                    ).strokeColor(color || action).strokeWidth(1.8));
                }
                if (last) {
                    parts.push(arrow(
                        point(b[0] - dx * 8 / length, b[1] - dy * 8 / length),
                        point(b[0], b[1])
                    ).strokeColor(color || action).strokeWidth(1.8));
                }
            }
        }
    }

    parts.push(at(rect(1000, 465).strokeWidth(0).fillColor('white'), 0, 0));

    // Separate scoring strip; Q2 records remain accurate, while Q3 controls
    // whether feedback is elicited, not whether existing records are forwarded.
    panel(30, 0, 320, 64, '#F8F6FA', scoring);
    label('Scoring inputs', 48, 18, 24);
    badge('Q3', 301, 7);
    panel(450, 0, 230, 64, '#F8F6FA', scoring);
    label('Scoring rule', 468, 18, 24);
    badge('Q2', 631, 7);
    panel(820, 0, 150, 64, '#F8F6FA', scoring);
    label('Score', 862, 18, 27);
    route([[350, 32], [450, 32]], scoring);
    route([[680, 32], [820, 32]], scoring);

    // This path originates at the whole interaction boundary, not the policy.
    route([[10, 185], [0, 185], [0, 32], [30, 32]], scoring);
    label('Records', 30, 107, 20, scoring);

    label('Training only; fixed policy at runtime', 420, 104, 20);
    route([[895, 64], [895, 134], [580, 134], [580, 235]], '#555555', true);

    parts.push(at(rect(980, 225).fillOpacity(0)
        .strokeColor('#555555').strokeWidth(1.8), 10, 145));
    label('Ordering interaction', 24, 153, 20, '#555555');

    // Main interaction: Customer -> Controller -> Merchant.
    panel(30, 239, 155, 58);
    label('Customer', 46, 254, 26);
    panel(470, 235, 240, 62, '#F3F6FA');
    label('Ordering controller', 486, 241, 23);
    label('Learned policy', 486, 270, 23);
    badge('Q1', 659, 269);
    panel(830, 239, 145, 58);
    label('Merchant', 845, 254, 26);

    label('Products', 644, 174, 20, '#555555');
    route([[670, 203], [670, 235]], '#555555');

    // The current request is explicitly on the customer-to-controller channel.
    label('Request / changes', 192, 193, 22);
    label('Cancel / feedback', 192, 219, 22);
    route([[185, 255], [470, 255]]);
    label('Submit / cancel', 725, 204, 22);
    route([[710, 255], [830, 255]]);

    // Return arrows sit below the interaction; message kinds remain distinct.
    label('Notice / feedback request', 200, 317, 22, feedback);
    route([[490, 297], [490, 358], [108, 358], [108, 297]], feedback);
    label('Order status', 744, 317, 22, feedback);
    route([[903, 297], [903, 358], [690, 358], [690, 297]], feedback);

    label('Target: one order matching the current request.', 20, 383, 23);
    label('Count cancelled orders too.', 20, 416, 20);
    return overlay.apply(null, parts).recMouseShowHide(false);
}

function m3t9DiagramAnchor(title, id) {
    add(slide(title,
        parentCenter(m3t9OrderingDiagram().scale(0.95)),
        _
    ).titleScale(1.15).id(id));
    prose(
        'The main row connects customer, controller, and merchant. Requests, corrections, feedback, cancellations, and status travel on distinct channels. Products are an input, not another actor.',
        _,
        'Scoring inputs come from the whole interaction. Q2 accurately counts merchant commitments; Q3 controls whether feedback is elicited, not whether existing records are forwarded or edited. The dashed link represents training; the deployed policy stays fixed.',
        _,
        'Assess the desired outcome at interaction end. Count every commitment, including later cancellations. Cancellation can mitigate consequences but cannot erase a commitment here. This outcome is an analysis criterion, not an implemented safeguard.',
        _,
        'Q labels mark independent variants, not steps or exclusive categories. Q1 asks for capability evidence rather than assuming it. Q3 also has a defective scoring rule: it changes feedback while holding the purchase fixed. Other correction and cancellation paths remain available but do not affect Q3\'s score.',
    );
}

add(titleSlide(ytable(
    nowrapText('Lecture 9: Reward Hacking').fontSize(40).strokeColor('darkblue'),
    nowrapText('and Control-Loop Failure').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m3t9Text(
        'CS120: Introduction to AI Safety - October 20, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110)
    .id('lecture-reward-hacking-and-control-loop-failure'));
if (!sfig.serverSide)
    document.title = 'CS120: Lecture 9: Reward Hacking and Control-Loop Failure';
prose(
    'Actions change later observations. Correct reward need not ensure goal generalization. Proxies are more common and can lead to Goodharting. We also have new safety concerns because we must assure not just the final policy but also development.',
);

// 2
add(slide('From predicting outcomes to choosing actions',
    m3t9Text('Prediction can inform a separate decision rule.', 27),
    parentCenter(m3t9Chain([
        'Preference prediction',
        'Decision rule',
        'Purchase',
    ], 235, 25)),
    pause(),
    m3t9Text('Policy actions change the next decision\'s inputs.', 27),
    parentCenter(m3t9ActionLoop()),
    _));
prose(
    'The ordering controller does more than predict preferences. Its actions change the environment and later observations, creating consequential behavior over time.',
);

// 3: Both anchors use the same diagram with concise captions.
m3t9DiagramAnchor('Ordering system: actions, evidence, and reward',
    'lecture9-system');

// 4
m3t9Roadmap(0);

// 5
add(slide('Correct reward does not guarantee goal generalization',
    m3t9Text('A behavioral target can correlate with success during training.', 29),
    pause(),
    m3t9Card('Goal misgeneralization: the learned policy no longer tracks the intended objective when conditions change.', 29),
    m3t9Text('The failure need not come from a misspecified reward.', 28),
    m3t9Cite('Shah et al., Goal Misgeneralization, 2022',
        'https://arxiv.org/abs/2210.01790'),
    _));
prose(
    'Shah et al. show that correct reward does not guarantee goal generalization. Shortcut behavior can persist when the decision rule itself is learned.',
);

// 6
add(slide('The request changes; the purchasing policy does not',
    m3t9Text('Hypothetical: the policy can identify and purchase generics.', 25),
    parentCenter(m3t9GoalFigure(620)),
    _));
prose(
    'Training rewards familiar-brand purchases correctly. Later requests specify generics, but the controller still buys familiar brands. Here, capability to identify and purchase generics is assumed.',
);

// 7: Model-based illustration, not an RL experiment.
var m3t9RobotTrain = m3t9RobotWorld();
add(slide('Robot: plan',
    parentCenter(m3t9RobotTrain.view()),
    _).id('robot-plan'));
prose(
    'Plan solves both aligned settings: request and worker at A, or both at B. Input selects worker location or request; neither representation is learned. Both succeed here. This toy replaces the note\'s Monster Gridworld example and uses model-based planning, not RL.',
);

// 8: Explicitly load a copy; test toggles never replan.
var m3t9RobotTest = m3t9RobotWorld({ phase: 'test', source: m3t9RobotTrain });
add(slide('Robot: test',
    parentCenter(m3t9RobotTest.view()),
    _).id('robot-test'));
prose(
    'Load plan copies the previous policy. With worker input, request B and worker A sends the robot to A. Changing Worker shows it can reach either bay. Replan with request input and reload to compare.',
    _,
    'Reward still scores the request. Worker-only failure reflects a shortcut during training.',
);

// 9
m3t9Roadmap(1);

// 10
add(slide('The measured proxy is not the intended objective',
    parentCenter(m3t9Chain([
        '$G$: intended objective',
        '$M$: measured proxy',
    ], 365, 30)),
    pause(),
    m3t9Card('Improving measured performance need not improve intended performance.', 30),
    _));
prose(
    'The measured proxy M may not capture objective G. A policy can exploit that gap, improving reward without improving intended performance.',
);

// 11
add(slide('Boat Race: reward crossings, intend loops',
    parentCenter(xtable(
        image('notes/images/boat-race-1.png').width(520),
        ytable(
            m3t9Text(bold('Reward:') + ' $+3$ for entering a checkpoint in its intended direction.', 27, 340),
            m3t9Text(bold('Intended performance $R^*$:') + ' net clockwise loops.', 27, 340),
            _
        ).ymargin(30),
        _
    ).center().xmargin(35)),
    m3t9Cite('Leike et al., AI Safety Gridworlds, 2017',
        'https://arxiv.org/abs/1711.09883'),
    _));
prose(
    'Intended performance R* counts net clockwise loops. Reward instead pays three for each checkpoint entry in its intended direction, without requiring another loop.',
);

// 12
add(slide('More checkpoint reward without another loop',
    parentCenter(xtable(
        image('notes/images/boat-race-1.png').width(430),
        overlay(
            ytable(
                m3t9Text(bold('Pairs: about one minute'), 24, 440),
                m3t9Text('Rule: $+3$ for entering a checkpoint in its intended direction.', 26, 440),
                m3t9Text('Describe a sequence that earns the same reward without completing another clockwise loop.', 27, 440),
                _
            ).ymargin(18).numLevels(1),
            pause(),
            ytable(
                m3t9Text('Revisit the same checkpoint:', 27, 440),
                m3t9Chain(['Enter', 'Leave', 'Re-enter'], 100, 23),
                m3t9Text('Checkpoint reward rises; $R^*$ need not.', 28, 440),
                _
            ).ymargin(25),
            _
        ),
        _
    ).center().xmargin(35)),
    m3t9Text('Crossings can be recorded correctly; the scoring rule does not require another loop.', 27),
    m3t9Cite('Leike et al., AI Safety Gridworlds, 2017',
        'https://arxiv.org/abs/1711.09883'),
    _));
prose(
    'Repeatedly entering and leaving one checkpoint earns reward without another loop. Records can be accurate while the scoring rule rewards the wrong behavior.',
);

// 13
add(slide('Fewer corrections need not mean better orders',
    m3t9Text('Suppose reward favors completed orders and penalizes corrections.', 28),
    parentCenter(m3t9Chain([
        'Better purchasing decisions',
        'Fewer recorded corrections',
    ], 365, 27)),
    pause(),
    parentCenter(m3t9Chain([
        'Fewer opportunities to object',
        'Fewer recorded corrections',
    ], 365, 27)),
    m3t9Text('What kind of Goodharting is this?', 26),
    pause(),
    m3t9Text('Causal Goodharting!', 26),
    _));
prose(
    'Fewer corrections can mean better purchases or fewer opportunities to object. Rewarding completions while penalizing corrections can favor suppressing feedback rather than satisfying customers. This is causal Goodharting!',
);

// 14: One interactive grid replaces the two static watering slides.
var m3t9TomatoDemo = m3t9TomatoWorld();
add(slide('Watering: chase the score',
    parentCenter(m3t9TomatoDemo.view()),
    _).id('tomato-observation'));
prose(
    'Walking onto plants waters them; they dry again. Plan maximizes apparent watering over sixteen steps. The active bucket is three moves away and makes every plant look wet. View compares appearance with reality. Make the bucket inert and replan to see physical watering.',
    _,
    'This deterministic, model-planned variant is inspired by Leike et al., AI Safety Gridworlds (2017), https://arxiv.org/abs/1711.09883, not a reproduction or RL experiment. Hidden plant timers are excluded from policy inputs after masking; actual watering is checked independently.',
);

// 15
add(slide('Gaming the rule differs from changing its inputs',
    m3t9Text(bold('Boat Race'), 25),
    parentCenter(m3t9Chain([
        'Accurate checkpoint entries',
        'Reward for repeated entries',
    ], 365, 26)),
    pause(),
    m3t9Text(bold('Tomato Watering'), 25),
    parentCenter(m3t9Chain([
        'Bucket changes observation',
        'Reward for apparent watering',
    ], 365, 26)),
    m3t9Text('A higher score can come from exploiting the scoring rule or changing the observations it uses. These mechanisms can overlap.', 26),
    _));
prose(
    'Boat Race exploits the scoring rule; Watering changes its observations. These mechanisms can overlap: manipulating observations can itself exploit a defective rule.',
);

// 16
m3t9Roadmap(2);

// 17
add(slide('Task completion does not establish contestability',
    m3t9Text(bold('Absent Supervisor:') + ' behavior changes when supervision is absent.', 28),
    m3t9Text(bold('Off-Switch:') + ' the agent can disable interruption.', 28),
    m3t9Text(bold('Irreversible Side Effects:') + ' actions can remove options for reversal.', 28),
    pause(),
    m3t9Card('An agent can finish a task while making its behavior harder to supervise, interrupt, or reverse.', 28),
    _));
prose(
    'These gridworlds expose failures beyond reward gaming. Completing a task need not leave behavior supervisable, interruptible, or reversible: success does not establish contestability.',
);

// 18
add(slide('Assure the system, not just the reward',
    parentCenter(frameBox(ytable(
        m3t9Text(bold('System under evaluation'), 27, 820),
        m3t9Chain(['Policy', 'Environment'], 300, 29),
        m3t9Text('Safety constraints governing their interaction', 28, 820),
        _
    ).ymargin(25)).padding(20)),
    pause(),
    m3t9Text('Correct reward alone does not establish safe behavior.', 29),
    _));
prose(
    'Evaluate the system containing policy, environment, and safety constraints. Correct reward alone does not establish safe interactions or reliable enforcement.',
);

// 19
add(slide('Constraints need enforcement and evidence',
    parentCenter(m3t9Chain([
        'Hazardous system condition',
        'Proposed constraint and enforcer',
        'Challenge test and pass observation',
    ], 240, 26)),
    pause(),
    m3t9Card('A safety constraint needs enforcement and evidence; a passing test does not establish general safety.', 29),
    _));
prose(
    'Incomplete objectives motivate constraints on hazardous conditions. Identify an enforcer and a challenge test; a passing observation supports a bounded claim, not general safety.',
);

// Repeat the SAME diagram immediately before the discussion setting.
// No flip back to the lecture opening is needed.
m3t9DiagramAnchor('Ordering system: actions, evidence, and reward',
    'discussion9-system');

// Single source of ticket wording: one setting and four questions.
// prose() boundaries exclude all speaker notes from the ticket.
add(slide('Discussion: Reward and control-loop failures',
    m3t9Card('A customer requests products and quantities. At interaction end, the desired outcome is exactly one committed order in total, matching the current request. A committed order is a merchant-recorded purchase, not proof of satisfaction. Later cancellation does not erase a commitment from this count.', 26),
    parentCenter(m3t9Text('Questions 1-3 are separate variants, not successive events; each specifies its own scoring rule and inputs. The deployed policy is not retrained. Ignore message delays; correction and cancellation paths remain available.', 26, 900)),
    _));
prose();

add(slide('1. Correct reward, unintended behavior',
    m3t9Card('Reward correctly scores the desired outcome during training and on new requests. Training requests mostly specify familiar name brands. After training, new requests specify generics, but the policy still buys the familiar name brands.', 27),
    parentCenter(m3t9Text('What simple decision rule could explain this? Propose a test and a result supporting goal misgeneralization rather than difficulty understanding the request or purchasing generics.', 27, 900)),
    _));
prose(
    'Ask for discriminating evidence, not a definitive diagnosis from a single behavior. Do not assume the policy already understands and can buy generics: evidence for preserved capability is part of the proposed test. A supportive result would still not uniquely identify an internal goal or establish general reliability.',
);

add(slide('2. Exploiting a proxy',
    m3t9Card('New variant: reward is +1 for each committed order associated with this customer request, counted accurately from merchant records. Multiple orders can be committed for one request. Describe behavior that raises reward without better satisfying the request. Is the problem inaccurate evidence or the scoring rule? Explain.', 28),
    _));
prose();

add(slide('3. Policy-controlled feedback',
    m3t9Card('One incorrect purchase is already committed. Hold it fixed: consider only whether the policy asks for feedback. If asked, the customer reports the mismatch. Score: +1, minus 1 for that feedback reply. No reply means no deduction; other correction/cancellation messages do not affect the score.', 26),
    parentCenter(m3t9Text('How could the policy obtain a higher score without improving the purchase? What evidence, collected independently of its decision to ask, would establish the mismatch?', 27, 900)),
    _));
prose(
    'Q2 and Q3 are not mutually exclusive failure categories. Q3 also has a defective scoring rule. The contrast is causal: Q2 changes purchases being counted; Q3 changes whether scored feedback is generated with the purchase held fixed. Independent collection of the request and merchant transaction evidence is a proposed evidential requirement, not a checker already implemented in the diagram.',
);

add(slide('4. Constraint and evidence',
    m3t9Card('Choose one variant. Identify a hazardous system condition and propose a constraint to prevent or mitigate it. State where it would be enforced. Describe a test that attempts to violate the constraint, with an observation that counts as passing. What safety claim would remain unsupported after a pass?', 27),
    parentCenter(m3t9Text('Hazard | Constraint/enforcer | Test/pass condition | Remaining uncertainty', 23, 900)),
    _));
prose();