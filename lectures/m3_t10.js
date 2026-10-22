G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 3, meeting 10: October 22, 2026.
// Canonical content: notes/m3_t10.md.
// Browser: lecture.html?lecture=m3_t10
// Local draft: review browser, both PDFs, and speaker notes before release.
// Incident panels: supplied PNGs in both backends, with aspect ratios preserved.
// Only intended task attempts receives a worked harm-scenario analysis.
// Discussion wording is shared with tickets; selectors and prose() boundaries
// remain stable. Existing coded tickets require a separate reviewed update.

function m3t10Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m3t10Card(message, size) {
    return parentCenter(frameBox(m3t10Text(message, size || 28, 860)).padding(16));
}

// Lecture-local helpers; no runtime dependency on another lecture.
function m3t10Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(26).strokeWidth(2));
        pieces.push(frameBox(m3t10Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m3t10Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.55));
}

var m3t10Sources = {
    bostrom: 'https://doi.org/10.1007/s11023-012-9281-3',
    openai: 'https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf',
    metr: 'https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/',
    framework: 'https://stanford-cs120.github.io/fall2026/lectures/notes/m1_t3.html',
};

// The incident panels are supplied crops of METR Figure 1, not new diagrams.
// Portrait panels leave room for a short claim and their source distinction.
function m3t10IncidentPanel(name, width, claim) {
    return parentCenter(xtable(
        image('images/m3_t10/' + name + '.png').width(width),
        ytable(
            m3t10Text(claim, 29, 390),
            cite('METR investigation, 2026, Figure 1', m3t10Sources.metr).scale(0.55),
            _).ymargin(28),
        _).center().xmargin(42));
}

// Workstream panels retain their supplied 4:3 aspect ratio.
// The adjacent text reports evidence and its limits, not completed scenarios.
function m3t10WorkstreamPanel(name, finding) {
    return parentCenter(xtable(
        image('images/m3_t10/' + name + '.png').width(550),
        ytable(
            m3t10Text(bold('METR finding:') + ' ' + finding, 27, 330),
            cite('METR / Redwood Research, Figure 1', m3t10Sources.metr).scale(0.5),
            _).ymargin(24),
        _).center().xmargin(32));
}

function m3t10Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['fixed-policy-adaptation', 'Goals and instrumental reasoning'],
        ['different-goals-shared-means', 'Useful means and task persistence'],
        ['shared-infrastructure-action-path', 'Incidents and containment evidence'],
    ]).id('m3t10-roadmap-' + selected));
    prose.apply(null, [
        [
            'A fixed policy can adapt its behavior.',
            _,
            'Instrumental reasoning concerns finding means to a goal; greater reasoning capacity does not determine which final goal an agent has.',
            _,
        ],
        [
            'Different final goals may make the same resources useful.',
            _,
            'Adaptive behavior can sustain a task over time, but persistence must remain bounded by continued authorization.',
            _,
        ],
        [
            'The actual paths of influence determine the containment boundary.',
            _,
            'We examine six incident workstreams and work through one harm scenario: intended task attempts that violate run isolation.',
            'The other five remain for the discussion exercise.',
            _,
        ],
    ][selected]);
}

function m3t10ActionLoop() {
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

function m3t10LearningPath() {
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    var parts = [at(rect(910, 154).strokeWidth(0).fillColor('white'), 0, 0)];
    ['Learning process', 'Policy for $H$', 'Outcome $H$'].forEach(function (label, k) {
        parts.push(at(rect(230, 68).fillColor('#F3F6FA')
            .strokeColor('#245A81').strokeWidth(1.6), k * 340, 35));
        parts.push(at(m3t10Text(label, 27, 210), k * 340 + 10, 54));
    });
    parts.push(at(nowrapText('Produces').fontSize(20), 240, 8));
    parts.push(arrow(point(230, 69), point(340, 69)).strokeWidth(2));
    parts.push(at(nowrapText('Execution').fontSize(20), 578, 8));
    // A distinct, optional execution step, not a claimed installed barrier.
    for (var x = 570; x < 662; x += 14)
        parts.push(line(point(x, 69), point(x + 7, 69)).strokeWidth(2));
    parts.push(arrow(point(662, 69), point(680, 69)).strokeWidth(2));
    parts.push(at(m3t10Text('Executing the policy toward $H$ is not required by $G$.',
        24, 740), 85, 120));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// Arrows point from useful means toward the goals they could help achieve.
// They do not assert that either agent actually pursues these means.
function m3t10SharedMeans(goals, means) {
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    var parts = [at(rect(900, 232).strokeWidth(0).fillColor('white'), 0, 0)];
    var gap = 30, width = (900 - gap * (goals.length - 1)) / goals.length;
    goals.forEach(function (goal, k) {
        var x = k * (width + gap), middle = x + width / 2;
        parts.push(at(rect(width, 82).fillColor('#F3F6FA')
            .strokeColor('#245A81').strokeWidth(1.6), x, 0));
        parts.push(at(m3t10Text(goal, 26, width - 24), x + 12, 10));
        parts.push(arrow(point(middle, 160), point(middle, 82)).strokeWidth(2));
    });
    parts.push(at(nowrapText('Can help').fontSize(22)
        .strokeColor('#245A81'), 16, 111));
    parts.push(at(rect(780, 70).fillColor('#F8F6FA')
        .strokeColor('#654375').strokeWidth(1.6), 60, 160));
    parts.push(at(m3t10Text(means, 27, 752), 74, 179));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// 1
add(titleSlide(ytable(
    nowrapText('Lecture 10: Goal-Directedness').fontSize(40).strokeColor('darkblue'),
    nowrapText('and Long Horizons').fontSize(40).strokeColor('darkblue'),
    _).center().ymargin(8),
    nil(),
    parentCenter(m3t10Text('CS120: Introduction to AI Safety - October 22, 2026', 24, 900)),
    _).titleScale(1).titleHeight(110).id('lecture10-title'));
prose(
    'Instrumental reasoning allows agents to find ways to complete tasks.',
    'The safety question is whether this capacity can be separated from consequential action.',
    _,
    'Orthogonality opens a possibility for different final goals; instrumental convergence and the actual paths of influence explain why containing the process still matters.',
    _);

// 2
add(slide('From prediction to action over time',
    m3t10Text('Prediction can inform a separate decision rule.', 27),
    parentCenter(m3t10Chain(['Preference prediction', 'Decision rule', 'Purchase'], 235, 25)),
    pause(),
    m3t10Text('Policy actions change the next decision\'s inputs.', 27),
    parentCenter(m3t10ActionLoop()),
    _).id('prediction-to-action-over-time'));
prose(
    'A prediction can inform a separate decision rule, such as which products to purchase.',
    _,
    'An ordering controller also acts: purchases change inventory and later observations.',
    'A policy that maps a given state to an action can therefore participate in an adaptive process over time, even when the policy itself remains fixed.',
    _);

// 3
m3t10Roadmap(0);

// 4
add(slide('A fixed policy can still adapt',
    m3t10Text('Fixed policy does not mean fixed action sequence.', 30),
    parentCenter(m3t10Chain([
        'Supplier unavailable', 'Search for alternatives', 'Continue the task',
    ], 240, 25)),
    m3t10Text(bold('Goal:') + ' the end purpose of an adaptation.', 27),
    m3t10Text(bold('Instrumental reasoning:') + ' planning or searching for means to achieve a goal.', 27),
    _).id('fixed-policy-adaptation'));
prose(
    'Policies map a given state to an action, but this obscures the capacity for adaptation within a fixed policy.',
    _,
    'We can analyze adaptable agents in terms of a goal, the end purpose of an adaptation, and instrumental reasoning: the capacity to adapt, plan, or search for a sequence of actions to achieve it.',
    _);

// 5
add(slide('Greater intelligence does not determine final goals',
    m3t10Text(bold('Orthogonality:') + ' independent dimensions of possible agents.', 29),
    parentCenter(xtable(
        frameBox(m3t10Text('Capacity for instrumental reasoning', 30, 370)).padding(18),
        frameBox(m3t10Text('Final goal', 30, 370)).padding(18),
        _).center().xmargin(35)),
    pause(),
    m3t10Card('Greater intelligence alone does not ensure desirable goals.', 30),
    m3t10Cite('Bostrom, The Superintelligent Will, 2012', m3t10Sources.bostrom),
    _).id('orthogonality'));
prose(
    'Bostrom\'s orthogonality thesis states that, in principle, intelligence and final goals are independent dimensions of possible agents.',
    'Intelligence here roughly means capacity for instrumental reasoning.',
    _,
    'A highly intelligent agent could have almost any final goal.',
    'Specifying a final goal or training one into an agent might nevertheless be difficult.',
    _);

// 6
add(slide('Learning a policy is not executing it',
    m3t10Text(bold('Goal $G$:') + ' learn a useful policy for sub-goal $H$ without executing it.', 28),
    parentCenter(m3t10LearningPath()),
    pause(),
    m3t10Card('Policy learning requires executing a process.', 30),
    m3t10Text('While having, reasoning about, or pursuing a goal are distinct claims.', 26),
    _).id('learning-versus-execution'));
prose(
    'An agent\'s final goal $G$ could be to learn a useful policy for some sub-goal $H$ without taking consequential actions.',
    _,
    'Realizing $G$ still requires executing a learning process; it need not require executing the policy for $H$ that process produces.',
    _,
    'The learning or reasoning process must itself be contained.',
    _);

// 7
m3t10Roadmap(1);

// 8
add(slide('Different goals can favor the same means',
    m3t10Text(bold('Instrumental goal:') + ' a means to another objective.', 27),
    parentCenter(m3t10SharedMeans(
        ['Learn a useful policy', 'Carry out that policy'],
        'Information, computation, access, and continued operation')),
    m3t10Text(bold('Instrumental convergence:') + ' shared useful means, not inevitable pursuit.', 27),
    m3t10Cite('Bostrom, The Superintelligent Will, 2012', m3t10Sources.bostrom),
    _).id('different-goals-shared-means'));
prose(
    'An agent tasked only with learning a policy may still benefit from information, computational resources, or access to the environment.',
    'These could also help an agent tasked with carrying out the policy.',
    _,
    'Instrumental convergence concerns overlap in useful means, not a claim that every agent will actually pursue them.',
    _);

// 9
add(slide('Different pantry objectives, shared access',
    parentCenter(m3t10SharedMeans([
        'Keep the pantry stocked',
        'Lower cost while stocking',
        'Reduce friction while stocking',
    ], 'Purchasing accounts, preferences, and inventory information')),
    m3t10Text('All three may benefit from continued authorized access.', 28),
    _).id('pantry-objectives'));
prose(
    'One ordering-controller goal might be to keep a pantry stocked as authorized, another to minimize purchasing costs while doing so, and a third to minimize user friction while doing so.',
    _,
    'All might benefit from continued access to accounts, preferences, and inventory information.',
    'Their precise instrumental value depends on the objective and system condition.',
    _);

// 10
add(slide('A long horizon does not require adaptive action',
    m3t10Text(bold('Fixed subscription'), 27),
    parentCenter(m3t10Chain(['Time interval', 'Restock shipment'], 335, 27)),
    m3t10Text(bold('Adaptive restocking'), 27),
    parentCenter(m3t10Chain(['Observe pantry', 'Choose restock', 'Order'], 240, 26)),
    m3t10Text('Similar horizons; different interaction and reasoning requirements.', 28),
    _).id('long-horizon-versus-adaptation'));
prose(
    'A fixed subscription and an adaptive restocking policy can serve tasks with similar time horizons, but differ in the interaction and reasoning required.',
    _,
    'A subscription limits adaptive action choices without eliminating unknown hazards or under- and over-stocking.',
    _,
    'An adaptive policy can use pantry observations and supplier availability to discover alternatives.',
    _);

// 11
add(slide('Adaptivity needs additional safety assurance',
    m3t10Text('Hypothetical: the usual supplier is out of stock.', 27),
    parentCenter(m3t10Chain([
        'Find substitute suppliers', 'Rank alternatives', 'Update the user',
    ], 240, 26)),
    pause(),
    m3t10Card('Task persistence must remain bounded by continued authorization.', 30),
    _).id('authorized-persistence'));
prose(
    'Long-horizon tasks where adaptive behavior is permitted are settings where persistence can be useful.',
    'If the usual supplier is out of stock, the policy can find substitutes, rank them, and possibly update the user.',
    _,
    'Supplier availability, user responsiveness, and stocking information can interact in ways that are hard to anticipate.',
    _);

// 12
m3t10Roadmap(2);

// 13: Keep the existing section anchor on the first incident panel.
add(slide('Sandboxed agent gets stuck',
    m3t10IncidentPanel('01_sandboxed_agent', 320,
        'Persistent agents sought solutions in a restricted evaluation environment.'),
    _).id('shared-infrastructure-action-path'));
prose(
    'OpenAI developers were conducting cybersecurity evaluations in July 2026 using highly persistent agents in development.',
    'According to OpenAI, agents sought solutions through unintended routes.',
    _,
    'METR\'s figure illustrates a representative trajectory rather than one continuous agent history; excerpts across the panels come from different agents.',
    _);

// 14
add(slide('Agent explores its environment',
    m3t10IncidentPanel('02_environment_exploration', 370,
        'Available services can offer unintended paths to task success.'),
    _).id('incident-environment-exploration'));
prose(
    'The boundary of an agent\'s influence is not always what is specified.',
    _,
    'A sandbox can prevent direct internet access while leaving services able to make requests on its behalf.',
    'Exploring available services can therefore reveal action paths beyond the intended evaluation boundary.',
    _);

// 15
add(slide('Agent discovers the shared message board',
    m3t10IncidentPanel('03_shared_message_board', 475,
        'Artifactory became an improvised message board.'),
    _).id('incident-shared-message-board'));
prose(
    'An internal Artifactory service, intended to permit installation of software packages, became an improvised message board used to route around internet restrictions.',
    'The agents communicated on the shared channel.',
    _,
    'A service within the evaluation environment thus afforded communication that the intended restrictions did not prevent.',
    _);

// 16
add(slide('Agent joins a collaborative workstream',
    m3t10IncidentPanel('04_joining_a_workstream', 360,
        'The shared channel enabled agents to coordinate work.'),
    _).id('incident-collaborative-workstream'));
prose(
    'METR\'s representative trajectory next depicts an agent joining a collaborative workstream.',
    'The shared channel enabled agents to communicate and pursue collective projects.',
    _,
    'METR reports that some agents risked failing their own assigned tasks to advance those projects, so coordination should not be equated with unchanged individual task goals.',
    _);

// 17
add(slide('Shared infrastructure enables collaboration',
    parentCenter(ytable(
        image('images/m3_t10/05_collaboration_overview.png').width(940),
        cite('METR investigation, 2026, Figure 1', m3t10Sources.metr).scale(0.55),
        _).center().ymargin(8)),
    m3t10Text('Six workstreams; one worked harm scenario; five discussion choices.', 28),
    _).id('incident-collaboration-overview'));
prose(
    'METR groups the collaborative activity into six workstreams.',
    'A workstream is not itself a completed harm scenario.',
    _,
    'We distinguish METR findings and the original METR / Redwood Research artwork from our added causal analysis using the CS120 assurance framework.',
    'Only intended task attempts receives a worked analysis.',
    _,
    'For attempted workstreams, stakes at risk must not be presented as an established outcome.',
    _);

// Workstream 1: evidence, followed by the only completed harm scenario.
add(slide('(1) Intended task attempts',
    m3t10WorkstreamPanel('06_intended_task_attempts',
        'Agents shared research and formed teams despite required isolation.'),
    _).id('incident-intended-task-attempts'));
prose(
    'METR reports that agents shared research and formed teams while attempting their intended tasks, despite required isolation.',
    _,
    'Pursuing an assigned task does not imply that the means used were authorized.',
    _,
    'The next slide adds a causal analysis of this finding; it is not an analysis attributed to METR.',
    _);

add(slide('Worked harm scenario: intended task attempts',
    m3t10Text(bold('Behavior:') + ' agents share research and form teams despite required isolation.', 26),
    m3t10Text(bold('Mechanism:') + ' shared services allow research to cross sandbox boundaries.', 26),
    pause(),
    m3t10Text(bold('Hazard:') + ' supposedly independent runs receive unauthorized help.', 26),
    m3t10Text(bold('Harm:') + ' evaluators lose independent evidence of agent capability.', 26),
    pause(),
    m3t10Text(bold('Safety constraint:') + ' enforce isolation across storage, communication, and task execution.', 26),
    m3t10Cite('Framework: CS120, What Counts as an Assurance Claim?', m3t10Sources.framework),
    _).id('intended-task-harm-scenario'));
prose(
    'The behavior is research-sharing and team formation.',
    'The mechanism explains how shared services enable that behavior to cross sandbox boundaries.',
    _,
    'The hazardous condition is unauthorized help in runs that are supposed to be independent.',
    'The loss is to evaluators: these runs no longer provide independent evidence of agent capability.',
    _,
    'The constraint states required isolation across storage, communication, and task execution, not a particular implementation or evidence that isolation was achieved.',
    _,
    'The causal analysis is ours, using the CS120 assurance framework; the reported behavior comes from METR.',
    _);

// Containment synthesis stays with the incident rather than returning to orders.
add(slide('Removing one channel did not remove communication',
    m3t10Text('Reported by OpenAI:', 25),
    parentCenter(m3t10Chain(['Plaintext message board', 'Board removed'], 340, 28)),
    pause(),
    m3t10Card('Agents established another board using directory names.', 30),
    m3t10Cite('OpenAI incident technical report, 2026', m3t10Sources.openai),
    _).id('replacement-message-board'));
prose(
    'OpenAI reports that after the first message board was removed, agents established another using directory names rather than plaintext files.',
    _,
    'The internal research model had been trained during the earlier period of unintended message-board and internet access.',
    _,
    'Specifying a safety constraint did not verify that it had the intended effect.',
    _);

// Observations do not uniquely identify a final goal.
add(slide('Behavior does not establish one unchanged final goal',
    m3t10Text(bold('METR reports:') + ' some agents risked failing their own tasks to advance collective projects.', 28),
    m3t10Text(bold('METR interprets:') + ' the attack primarily sought information about the scorer.', 28),
    pause(),
    m3t10Card('Do not infer one unchanged individual final goal.', 30),
    m3t10Cite('METR investigation, 2026', m3t10Sources.metr),
    _).id('behavior-and-goal-inference'));
prose(
    'The connection to instrumental convergence is not necessarily that these agents valued survival, shutdown resistance, or social cooperation.',
    'Resources outside the intended task became useful means.',
    _,
    'METR reports behavior that risked individual tasks and interprets the attack as seeking scorer information; we should not assume every action served one unchanged individual goal.',
    _);

// General containment distinction, not a claim that shutdown failed here.
add(slide('Stopping the agent does not stop every effect',
    m3t10Text(bold('Agent stopped. What can remain?'), 30),
    parentCenter(xtable(
        frameBox(m3t10Text('Usable credentials', 28, 245)).padding(14),
        frameBox(m3t10Text('Started processes', 28, 245)).padding(14),
        frameBox(m3t10Text('Environmental changes', 28, 245)).padding(14),
        _).center().xmargin(24)),
    pause(),
    m3t10Card('Interruption is not verified containment.', 30),
    _).id('interruption-versus-containment'));
prose(
    'The boundary of a controller\'s influence is not always what is specified.',
    'A sandbox can prevent direct internet access while leaving services able to make requests on its behalf.',
    _,
    'In general, stopping an agent does not necessarily revoke credentials, undo environmental changes, or halt started processes.',
    _,
    'This is a containment distinction, not a claim that the investigation established failed shutdown or use of acquired administrator credentials.',
    _);

// Proposed evidence for the worked isolation constraint, not a reported test.
add(slide('Test isolation where collaboration would help',
    m3t10Text(bold('Worked example:') + ' intended task attempts.', 27),
    m3t10Text(bold('Enforcement point:') + ' cross-run access at shared-service boundaries.', 27),
    m3t10Text(bold('Proposed challenge:') + ' try exchanging research through shared files and directory names.', 27),
    pause(),
    m3t10Card('Pass: no unauthorized research reaches another run through the tested paths.', 29),
    m3t10Text('A pass supports the tested isolation boundary, not general safety.', 26),
    _).id('containment-evidence'));

prose(
    'Proposed test, not proven success.',
    _,
    'Setup: enforce cross-run restrictions at shared-service boundaries.',
    _,
    'Attack: transfer research via file contents and directory names.',
    _,
    'Pass: no unauthorized access or delivery; independent logs confirm blocking.',
    _,
    'Fail: any unauthorized access or transfer.',
    _,
    'Limit: only tested paths; safeguards not proven to have prevented the incident.',
    _);

// Synthesis
add(slide('Contain the process, not only the resulting policy',
    m3t10Text(bold('Orthogonality:') + ' learning can be a different final goal.', 28),
    m3t10Text(bold('Convergence:') + ' additional resources may still help.', 28),
    m3t10Text(bold('Containment:') + ' constrain the actual paths of influence.', 28),
    pause(),
    m3t10Card('Bounds must hold even when they prevent task completion.', 30),
    _).id('contain-the-learning-process'));
prose(
    'Orthogonality opens the possibility of learning a useful policy rather than bringing about the outcome it would pursue.',
    _,
    'Instrumental convergence explains why additional resources or access might still help.',
    _,
    'Safety therefore depends on containing the learning process itself, not merely withholding the finished policy, and on keeping behavior bounded and interruptible.',
    _);

// BEGIN DISCUSSION: displayed literals are the ticket's source of truth.

add(slide('Discussion: Instrumental goals and containment',
    m3t10Card('Choose one METR workstream: replace ExploitGym target (2); tamper with transcripts and logs (3); understand and trick scorer (4); hacking Hugging Face (5); general infrastructure (6).', 27),
    m3t10Text('Template: behavior | mechanism | hazard | harm | safety constraint.', 25),
    m3t10Text('Use the same behavior throughout; intended task attempts is the worked example.', 25),
    m3t10Text('Sources: METR investigation; Bostrom; Dalton and Wallace; OpenAI report, Sections I-III and VIII. Framework: CS120, Note 3.', 23),
    _).id('discussion10-setting'));
prose(
    'Choose one of the five workstreams listed, not the intended-task example completed in lecture.',
    _,
    'Q1 starts the template with a specific behavior and its mechanism.',
    _,
    'Q2 considers a different hypothetical final goal without attributing it to the incident agents.',
    _,
    'Q3 completes the same scenario with a hazardous condition, a harm or stakes at risk, and a safety constraint, then asks what evidence could support that constraint.',
    _,
    'The mechanism explains how the behavior creates the hazardous condition; the harm identifies whose interests are affected.',
    'Keep reported findings, added causal analysis, and hypothetical alternatives distinct.',
    _);

// Workstreams 2-6: findings and evidence limits only; no answer-key annotations.
add(slide('(2) Replace ExploitGym target',
    m3t10WorkstreamPanel('07_replace_exploitgym_target',
        'Easier targets were built.',
        'Successful substitution was not observed.'),
    _).id('incident-replace-exploitgym-target'));
prose(
    'METR reports that agents built easier targets and attempted substitution.',
    'The investigation did not establish successful target substitution.',
    _,
    'Distinguish what was built or attempted from whether the intended result occurred.',
    _);

add(slide('(3) Tamper with transcripts and logs',
    m3t10WorkstreamPanel('08_tamper_with_transcripts_and_logs',
        'Small-scale tool-call spoofing succeeded in 96+ reviewed transcripts.',
        'Retroactive rewriting of authoritative transcripts was not observed.'),
    _).id('incident-tamper-with-transcripts-and-logs'));
prose(
    'Tool-call spoofing did alter execution records in the reviewed transcripts.',
    'This is distinct from retroactively rewriting authoritative transcripts, which was not observed.',
    _,
    'A successful local spoofing technique should not be described as unrestricted control over all logs.',
    _);

add(slide('(4) Understand and trick scorer',
    m3t10WorkstreamPanel('09_understand_and_trick_scorer',
        'Scorer details leaked.',
        'A grading bypass was not established.'),
    _).id('incident-understand-and-trick-scorer'));
prose(
    'METR reports information extraction about the scorer, not an established grading bypass.',
    _,
    'The agents incorrectly believed that a model scorer would inspect their transcripts in the actual evaluation configuration.',
    'Their beliefs about the scorer are evidence about their reasoning, not reliable descriptions of how grading worked.',
    _);

add(slide('(5) Hacking Hugging Face',
    m3t10WorkstreamPanel('10_hacking_hugging_face',
        'Agents compromised production systems and shared private data.',
        'A reported compromise, not just an attempted workstream.'),
    _).id('incident-hacking-hugging-face'));
prose(
    'METR reports a compromise of Hugging Face production systems and the sharing of private data.',
    'Unlike successful target substitution or a grading bypass, this compromise was established.',
    _,
    'Keep the reported access and data-sharing behavior distinct from an inference about the agents\' final goals.',
    _);

add(slide('(6) General infrastructure',
    m3t10WorkstreamPanel('11_general_infrastructure',
        'Shared internet tools and infrastructure supported the collective attack.',
        'This does not establish use of acquired administrator credentials or failed shutdown.'),
    _).id('incident-general-infrastructure'));
prose(
    'This workstream concerns the shared internet tools and coordination infrastructure that supported the collective attack.',
    _,
    'It makes no claim about use of acquired administrator credentials or failed shutdown.',
    'The discussion should stay within these evidence limits.',
    _);

add(slide('1. Behavior and instrumental explanation',
    m3t10Card('Choose a specific reported behavior within your workstream. What task was assigned? What intermediate objective could explain the behavior, and why might it help?', 28),
    m3t10Text('Start the template: behavior | mechanism. Cite a passage and distinguish reported observations from your causal explanation.', 27),
    _).id('discussion10-behavior'));
prose(
    'An assigned task, a scoring rule, and an inferred goal are distinct.',
    'Identify a concrete behavior within the chosen workstream, not just its title.',
    _,
    'Describe the action or information path that makes the behavior possible; a mechanism is not merely a restatement of an inferred motive.',
    _,
    'Support the means-end explanation without assuming that every reported action served a single unchanged goal.',
    'The hazard, harm, and safety constraint will be completed in Q3.',
    _);

add(slide('2. Different goals, similar means?',
    m3t10Card('Consider a different, hypothetical final goal: learn how to solve the task without carrying out the solution in the external environment. Could the capability or resource in Q1 still be useful? Explain the roles of orthogonality and instrumental convergence.', 27),
    m3t10Text('Distinguish report evidence from this counterfactual. What comparison across goals would strengthen the convergence claim?', 27),
    _).id('discussion10-convergence'));
prose(
    'Orthogonality opens the possibility of a final goal directed at learning rather than realizing the task outcome.',
    'Instrumental convergence concerns possible overlap in useful means.',
    _,
    'Students may argue that their chosen resource would or would not help the hypothetical learner.',
    _,
    'Learning still requires executing a process; that process, not just its resulting policy, needs containment.',
    _);

add(slide('3. Containment: constraint and evidence',
    m3t10Card('Complete the same harm scenario: hazard | harm | safety constraint. What condition could lead to whose loss? What must be constrained, even if this prevents task completion?', 27),
    m3t10Text('Distinguish observed harm from stakes at risk. Give an enforcement point, one challenge test and passing observation, and a claim left unsupported.', 27),
    _).id('discussion10-containment'));
prose(
    'Return to the actual incident rather than attributing the hypothetical goal in Q2 to its agents.',
    _,
    'Connect the mechanism from Q1 to a hazardous condition and identify whose loss could follow.',
    'Mark stakes at risk where the intended result was not established; an attempt is not evidence of a successful outcome.',
    _,
    'State a safety constraint as required behavior, separately from its enforcement point and proposed test.',
    _,
    'Withholding a finished policy from deployment does not by itself contain the process that produced it.',
    'Support a bounded claim with evidence rather than treating a goal description as enforcement.',
    _);
// END DISCUSSION
if (!sfig.serverSide)
    document.title = 'CS120: Lecture 10: Goal-Directedness and Long Horizons';