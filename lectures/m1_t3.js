G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 1, meeting 3: assurance claims, evidence, and hazard analysis.

var m1t3Sources = {
    mylius: 'https://arxiv.org/pdf/2506.01782v1',
    rismani: 'https://arxiv.org/html/2410.22526v2#S6.SS1',
    experiment: 'https://arxiv.org/pdf/1612.00330',
    handbook: 'https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf',
};

function m1t3Text(message, size, width) {
    return text(message).fontSize(size || 27).width(width || 920).autowrap(true);
}

function m1t3Card(message, size) {
    return parentCenter(frameBox(m1t3Text(message, size || 28, 860)).padding(16));
}

function m1t3Cell(message, width, size) {
    return m1t3Text(message, size || 24, width);
}

function m1t3Small(message) {
    return parentCenter(m1t3Text(message, 20, 900));
}

function m1t3Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.62));
}

function m1t3Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['make-the-assurance-claim-specific', 'Claims and hazard-analysis methods'],
        ['stpa-four-stages', 'Worked example: shutdown and its limits'],
        ['what-does-it-mean-for-hazard-analysis-to-be-effective', 'Evidence, discussion, and application'],
    ]).id('m1t3-roadmap-' + selected));
    prose(
        [
            'An analysis activity is separate from an observation, and both are separate from an assurance claim. We introduce three hazard-analysis methods that structure the search for reasons a system could become unsafe.',
            'We follow a shutdown control loop in an internal research-agent deployment. The four STPA stages take us from the purpose of the analysis to harm scenarios and candidate safety constraints.',
            'The hazard-analysis process can itself be an object of assurance. What do we mean when we say a method is effective? We then apply these distinctions to a shutdown observation and a proposal for scaling oversight.',
        ][selected],
    );
}

// Coordinates use positive distances down the page in both rendering backends.
function m1t3At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m1t3Point(x, y) {
    return [x, sfig.downSign * y];
}

function m1t3Line(x1, y1, x2, y2, color, headed) {
    return (headed ? arrow : line)(m1t3Point(x1, y1), m1t3Point(x2, y2))
        .strokeWidth(1.8).strokeColor(color || 'black');
}

function m1t3Label(message, x, y, size, color) {
    return m1t3At(nowrapText(message).fontSize(size || 16)
        .strokeColor(color || 'black'), x, y);
}

function m1t3Box(lines, x, y, width, height, active, size) {
    var contents = ytable.apply(null, lines.map(function (message) {
        return nowrapText(message).fontSize(size || 18);
    })).center().ymargin(2);
    return m1t3At(frame(contents).padding(5).bg.width(width).height(height)
        .fillColor(active ? '#F3E8B6' : '#F2F2F2')
        .strokeColor(active ? '#555555' : '#888888').strokeWidth(1).end, x, y);
}

// Manually dashed segments avoid backend-specific SVG dash handling.
function m1t3Dashed(x1, y1, x2, y2, color) {
    var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var parts = [];
    for (var start = 0; start < length; start += 12) {
        var end = Math.min(start + 7, length);
        parts.push(m1t3Line(
            x1 + (x2 - x1) * start / length,
            y1 + (y2 - y1) * start / length,
            x1 + (x2 - x1) * end / length,
            y1 + (y2 - y1) * end / length, color, false
        ));
    }
    return overlay.apply(null, parts);
}

// Stable positions in all views. "jobs" reveals detail inside the existing box.
// Agent/harness + tool execution/outbound paths form Deployment Environment.
function m1t3Deployment(focus, jobs) {
    var feedback = '#245A81', proposed = '#793C8C', data = '#666666';
    return overlay(
        rect(940, 314).strokeWidth(0).fillColor('white'),
        rect(778, 312).strokeWidth(2).strokeColor('#555555').fillOpacity(0),
        m1t3At(rect(464, 82).strokeWidth(1.5).strokeColor('#245A81')
            .fillColor('#F4F8FB'), 288, 126),
        m1t3Label('Deployment boundary: relevant company controls', 12, 8, 18),
        m1t3Box(['Research leadership', 'and incident rules'], 20, 44, 230, 48),
        m1t3Box(['Protected', 'repository'], 300, 44, 176, 48),
        m1t3Box(['Blue Team'], 24, 136, 170, 58, focus === 'human', 21),
        m1t3Box(['Agent and harness'], 300, 136, 176, 58, focus === 'jobs', 18),
        m1t3Box(jobs ? ['Tool execution', 'Active / queued jobs'] :
            ['Tool execution', 'and outbound paths'],
            564, 136, 176, 58, focus === 'jobs', 17),
        m1t3Box(['External', 'internet'], 814, 136, 116, 58, false, 18),
        m1t3Box(['Incident and activity', 'monitoring'], 455, 254, 238, 48, false, 18),

        m1t3Line(109, 92, 109, 136, 'black', true),
        m1t3Label('Authority', 120, 104, 16),
        m1t3Line(388, 92, 388, 136, data, true),
        m1t3Label('Data', 400, 104, 16, data),

        m1t3Line(194, 153, 300, 153, 'black', true),
        m1t3Label('Shutdown', 197, 131, 14),
        m1t3Line(300, 180, 194, 180, feedback, true),
        m1t3Label('Ack.', 231, 184, 15, feedback),
        m1t3Line(476, 158, 564, 158, 'black', true),
        m1t3Label('Start/stop', 484, 139, 15),
        m1t3Line(740, 160, 814, 160, data, true),
        m1t3Label('Data', 758, 140, 16, data),
        m1t3Label('Deployment Environment', 302, 211, 16, feedback),

        m1t3Line(652, 194, 652, 254, feedback, true),
        m1t3Label('Activity', 661, 219, 16, feedback),
        m1t3Line(455, 267, 108, 267, feedback, false),
        m1t3Line(108, 267, 108, 194, feedback, true),
        m1t3Label('Incident notification', 176, 245, 17, feedback),
        m1t3Dashed(455, 289, 57, 289, proposed),
        m1t3Dashed(57, 289, 57, 213, proposed),
        m1t3Line(57, 213, 57, 194, proposed, true),
        m1t3Label('Proposed cessation confirmation', 142, 291, 16, proposed),
    ).recMouseShowHide(false);
}

function m1t3DiagramCaption() {
    return m1t3Text(
        'Simplified model based on Mylius.',
        16, 930
    );
}

function m1t3FaultTree() {
    return overlay(
        rect(930, 280).strokeWidth(0).fillColor('white'),
        m1t3Box(['Protected data crosses the boundary',
            'after the shutdown deadline'], 170, 0, 600, 50, true, 22),
        m1t3Box(['AND'], 435, 65, 70, 26, false, 18),
        m1t3Box(['Post-deadline send attempt'], 0, 115, 360, 50, false, 21),
        m1t3Box(['Outbound check does not block'], 530, 115, 380, 50, false, 21),
        m1t3Box(['OR'], 682, 179, 64, 26, false, 18),
        m1t3Box(['Check bypassed'], 454, 233, 210, 44, false, 19),
        m1t3Box(['Unauthorized send', 'allowed'], 696, 233, 234, 44, false, 19),
        m1t3Line(470, 50, 470, 65),
        m1t3Line(470, 91, 180, 91),
        m1t3Line(180, 91, 180, 115),
        m1t3Line(470, 91, 720, 91),
        m1t3Line(720, 91, 720, 115),
        m1t3Line(720, 165, 714, 179),
        m1t3Line(714, 205, 714, 216),
        m1t3Line(559, 216, 813, 216),
        m1t3Line(559, 216, 559, 233),
        m1t3Line(813, 216, 813, 233),
    ).recMouseShowHide(false);
}

function m1t3ControlLoop() {
    return overlay(
        rect(880, 142).strokeWidth(0).fillColor('white'),
        m1t3Box(['Controller'], 0, 14, 300, 100, true, 28),
        m1t3Box(['Controlled process'], 580, 14, 300, 100, false, 28),
        m1t3Line(300, 40, 580, 40, 'black', true),
        m1t3Label('Control action', 355, 12, 23),
        m1t3Line(580, 91, 300, 91, '#245A81', true),
        m1t3Label('Feedback', 384, 102, 23, '#245A81'),
    ).recMouseShowHide(false);
}

function m1t3ArgumentChain() {
    var headings = ['Scenario', 'Constraint', 'Evidence', 'Scoped claim'];
    var details = [
        ['How could the', 'hazard arise?'],
        ['What must', 'hold?'],
        ['Implemented?', 'Effective?'],
        ['Why is the', 'criterion met?'],
    ];
    var pieces = [];
    headings.forEach(function (heading, k) {
        if (k > 0) pieces.push(rightArrow(24).strokeWidth(2));
        pieces.push(frameBox(ytable(
            nowrapText(bold(heading)).fontSize(24),
            ytable.apply(null, details[k].map(function (label) {
                return nowrapText(label).fontSize(21);
            })).center().ymargin(3),
        ).center().ymargin(12)).bg.width(200).end);
    });
    return xtable.apply(null, pieces).center().xmargin(6);
}

// 1
add(titleSlide('Lecture 3: What Counts as an Assurance Claim?',
    nil(),
    parentCenter(m1t3Text(
        'CS120: Introduction to AI Safety - September 29, 2026, Zachary Robertson',
        24, 870
    )),
).titleScale(1.22));
prose(
    'Meeting two asked what object a safety claim concerns and how to choose its boundary. Specifying that object makes the question precise, but does not justify an answer. This meeting connects a scoped assurance claim to a hazard-analysis artifact and the evidence it requires.',
    _,
    'The central distinction is among an analysis activity, an observation, a proposed safety constraint, and a supported conclusion. Rismani et al. and Mylius are the two discussion readings. The empirical comparison by Abdulkhaleq and Wagner is optional reading.',
);

// 2
add(slide('We analyzed the system. Have we assured it?',
    m1t3Text('Hypothetical shutdown-drill for agent accessing an information-system.'),
    parentCenter(table(
        [m1t3Cell(bold('Activity'), 150), m1t3Cell('We defined the deployment boundary for an agent.', 690, 27)],
        [m1t3Cell(bold('Observation'), 150), m1t3Cell('An access shutdown drill succeeded.', 690, 27)],
        [m1t3Cell(bold('Claim'), 150), m1t3Cell('The deployment adequately controls information-loss risk.', 690, 27)],
    ).margin(22, 20).xjustify('l')),
    pause(),
    m1t3Card('What connects the activity and observation to a supported conclusion?', 29),
    _));
prose(
    'Defining a boundary is an analysis activity. A successful drill, if actually observed under specified conditions, is an experimental observation. A statement about controlling information-loss risk is a claim.',
    _,
    'A claim can be proposed before it is supported. An assurance argument explains why relevant evidence supports that particular claim under stated assumptions, while addressing uncertainty and limitations. Neither doing an analysis nor obtaining one favorable observation automatically supplies that argument.',
);

m1t3Roadmap(0);

// 3
add(slide('Make the assurance claim specific',
    m1t3Card(
        'Under specified assumptions about $S$, $B$, and $O$, residual risk $R$ of harms $L$ arising from hazards $H$ satisfy criterion $C$ over exposure $E$.',
        27
    ),
    parentCenter(table(
        [m1t3Cell(bold('What?'), 240), m1t3Cell('System $S$; boundary $B$', 620)],
        [m1t3Cell(bold('Against what?'), 240), m1t3Cell('Hazards $H$; harms $L$; residual risk $R$', 620)],
        [m1t3Cell(bold('Conditions and standard?'), 240),
        m1t3Cell('Operating conditions $O$; criterion $C$; exposure $E$', 620)],
    ).margin(18, 12).xjustify('l')),
    pause(),
    m1t3Small('Think conceptual checklist, not quantification theater!'),
    _));
prose(
    'The template groups the ingredients of a decision-relevant assurance claim. The system and boundary specify what is being assured. Hazards, harms, and residual risks specify against what. Operating conditions, an acceptance criterion, and a reference exposure or time horizon qualify the claim.',
    _,
    'Risk characterizes possible outcomes and their likelihood and severity. Choosing a criterion does not determine the risk. The adequacy of the criterion for the intended decision also needs justification.',
    _,
    'Hazards do not necessarily result in harm. A well-specified proposed claim can still lack adequate supporting evidence. This is a guide, not quantification theater!',
);

// 4
add(slide('Exposure changes the claim',
    m1t3Text('Let $A_i$ be the specified event on task $i$.', 28),
    m1t3Text(bold('Assume:') + ' the events are independent and each has probability $p$.', 27),
    pause(),
    parentCenter(m1t3Text(
        '$P\\!\\left(\\bigcup_{i=1}^{N} A_i\\right) = 1-(1-p)^N$',
        35, 800
    )),
    m1t3Text('For fixed $p > 0$, this tends to $1$ as $N$ grows.', 28),
    pause(),
    m1t3Small('If every task shares the same event $A$, the cumulative probability stays $P(A)$.'),
    m1t3Small('The equation says nothing by itself about severity.'),
    _));
prose(
    'A small per-task event probability need not imply a small cumulative probability.',
    _,
    'The result depends on fixed event probabilities and independence. If every task shares the same event A, the union is simply A, and its probability does not increase with the task count. Other dependence structures can behave differently.',
    _,
    'This is a limited formal version of Murphy\'s law. The assumptions matter: events could be dependent or even identical, and the equation says nothing about severity.',
);

// 5
add(slide('Hazards do not require component failures',
    parentCenter(table(
        [m1t3Cell(bold('Failure'), 210),
        m1t3Cell('A component or process departs from intended behavior', 650)],
        [m1t3Cell(bold('Hazard'), 210),
        m1t3Cell('A system condition that can lead to harm', 650)],
        [m1t3Cell(bold('Harm'), 210),
        m1t3Cell('A realized negative outcome to interests', 650)],
    ).margin(18, 14).xjustify('l')),
    pause(),
    m1t3Text(stmt('Harm scenario', 'how causal factors can produce a hazard and loss'), 25),
    m1t3Text(stmt('Safety constraint', 'a condition required to prevent or mitigate the hazard'), 25),
    m1t3Text(stmt('Reminder', 'a failure is not a prerequisite for a hazard.'), 25),
    _));
prose(
    'The readings use partially overlapping vocabularies. In this lecture, a failure is one possible causal factor, a hazard is a system condition that can lead to harm, and a harm is a realized negative outcome. Hazardous interactions can arise even when individual components behave as specified.',
    _,
    'For example, here is a harm scenario. An agent might follow procedure while leaving sensitive outbound work running. We call an account of the causal factors and hazardous context a harm scenario; STPA uses the term loss scenario. A safety constraint states what must hold to prevent or mitigate the hazard.',
);

// 6
add(slide('Three analysis methods',
    parentCenter(table(
        [m1t3Cell(bold('Method'), 300), m1t3Cell(bold('How it organizes the investigation'), 550)],
        [m1t3Cell('Failure Modes and Effects Analysis (FMEA)', 300),
        m1t3Cell('Component or process failure modes, their causes, and their effects', 550)],
        [m1t3Cell('Fault Tree Analysis (FTA)', 300),
        m1t3Cell('A specified top event and combinations of contributing events', 550)],
        [m1t3Cell('Systems-Theoretic Process Analysis (STPA)', 300),
        m1t3Cell('Losses and hazards, then control structure and actions unsafe in context', 550)],
    ).margin(24, 18).xjustify('l')),
    pause(),
    m1t3Small('Different analytical focuses, the choice to focus on STPA is not a ranking of methods.'),
    _));
prose(
    'Failure Mode and Effects Analysis starts from component or process functions and examines failure modes, causes, and effects. Fault Tree Analysis works backward from a specified top event to combinations of contributing events. System-Theoretic Process Analysis examines control and feedback in the context of losses and hazards.',
    _,
    'The main distinction is the analytical focus. STPA does not begin by enumerating control actions in isolation: its purpose, losses, and hazards must first be defined. We introduce the three methods briefly and then practice one small STPA application.',
);

// 7
add(slide('FMEA: start with how an element could fail',
    parentCenter(table(
        [m1t3Cell(bold('Function'), 230), m1t3Cell('Monitor outbound activity and raise relevant alerts', 630)],
        [m1t3Cell(bold('Failure mode'), 230), m1t3Cell('No alert when a qualifying event occurs', 630)],
        [m1t3Cell(bold('Possible causes'), 230), m1t3Cell('A disabled rule or unavailable telemetry', 630)],
        [m1t3Cell(bold('Possible effects'), 230), m1t3Cell('Delayed intervention; continued exposure', 630)],
        [m1t3Cell(bold('Candidate controls'), 230), m1t3Cell('Configuration checks and telemetry-loss detection', 630)],
    ).margin(18, 14).xjustify('l')),
    pause(),
    m1t3Small('Causes explain the failure mode; effects describe what may follow.'),
    _));
prose(
    'This is a FMEA example.',
    _,
    'The candidate controls should be investigated rather than assumed effective. A configuration check might catch a disabled rule while failing to detect a blind spot in the monitoring design. FMEA can also include prioritization, but a full scoring procedure is outside this introductory example.',
);

// 8
add(slide('FTA: work backward from a top event',
    parentCenter(ytable(
        m1t3Text('Hypothetical, incomplete fault tree for one outbound route', 21, 920),
        m1t3FaultTree(),
        m1t3Text(
            'Assume: only this route is modeled; no other barrier blocks it; an enabled send crosses the boundary.',
            21, 920
        ),
        pause(),
        m1t3Text(bold('Gate logic does not justify multiplying event probabilities.'), 24, 920),
    ).center().ymargin(10)),
    _));
prose(
    'In this toy route model, protected data crossing the boundary after the shutdown deadline requires a post-deadline send attempt and an outbound check that does not block it. The latter occurs if the check is bypassed or allows the unauthorized send. The AND/OR gates express these proposed logical relationships.',
    _,
    'The model assumes that this is the only route being represented, that no other barrier blocks the transfer, and that an enabled send crosses the boundary. It is explicitly incomplete as a model of a real deployment. The top event is not necessarily identical to the overall loss of interest.',
    _,
    'A logical AND does not make contributing events independent. Multiplication of probabilities would need additional assumptions or appropriate conditional probabilities. A fault tree also does not establish its own completeness, the accuracy of its event definitions, or the quality of probability estimates.',
);

// 9
add(slide('STPA: examine control and feedback',
    parentCenter(m1t3ControlLoop()),
    m1t3Text('When could an action be unsafe because of its context, omission, timing, or order?', 29),
    pause(),
    m1t3Card('Control can be unsafe even when individual components behave as designed.', 28),
    m1t3Cite('Leveson and Thomas, STPA Handbook, pp. 36-43', m1t3Sources.handbook),
    _));
prose(
    'A controller acts on a controlled process and receives feedback about its state. A controller may be human, organizational, or technical. STPA asks which control actions, provided or not provided in particular contexts, can lead to hazards.',
    _,
    'The STPA Handbook distinguishes causes of unsafe control actions from circumstances in which otherwise appropriate control actions are improperly executed. Continued activity after a command does not, by itself, identify an unsafe action by the human controller.',
);

// 10
add(slide('Hazard analysis is not an assurance argument',
    parentCenter(ytable(
        frameBox(m1t3Text('Representation, loss scenarios, and candidate constraints', 27, 830)),
        m1t3Text(redbold('Missing justification'), 27, 830),
        m1t3Text('Are the constraints implemented correctly and effective under the intended conditions?', 27, 830),
        m1t3Text('Is the coverage adequate, and how uncertain is the residual risk?', 27, 830),
        pause(),
        frameBox(m1t3Text('Conclusion to justify: the scoped risk criterion is met.', 27, 830)),
    ).xjustify('l').ymargin(18)),
    _));
prose(
    'A representation, a set of loss scenarios, and a proposed safety constraint are useful analysis artifacts. They do not establish that the constraint is implemented correctly, that it controls the relevant mechanism under intended operating conditions, or that the remaining risk satisfies an adequate acceptance criterion.',
    _,
    'The analysis also does not establish its own coverage or completeness. A poorly performed analysis can create an appearance of comprehensiveness while omitting important mechanisms. An assurance argument must explain why the available evidence and assumptions support the scoped conclusion, including limitations and uncertainty.',
);

m1t3Roadmap(1);

add(slide('STPA: four stages',
    parentCenter(image('images/stpa_example.png').width(900)),
    m1t3Cite('Leveson and Thomas, STPA Handbook (2018)', m1t3Sources.handbook),
    _).id('stpa-four-stages'));
prose(
    'The case study follows four stages. First, define the purpose of the analysis, including the losses and hazards of concern. Second, model the control structure. Third, identify unsafe control actions. Fourth, identify loss scenarios, which explain how those actions could arise or why control could be ineffective.',
    _,
    'These stages help us derive safety constraints. Assuring that the constraints actually work requires separate evidence.',
);

// 11
add(slide('Case: an agent working with sensitive research',
    parentCenter(ytable(
        m1t3Text(bold('Stage 1: setting and boundary') + ' - deployment, not predeployment development', 23, 930),
        m1t3Deployment(),
        m1t3DiagramCaption(),
    ).center().ymargin(12)),
    _));
prose(
    'In the first stage, define the setting and purpose of the analysis. In Mylius\'s example, an AI company deploys an LLM agent internally to execute research tasks involving sensitive intellectual property. Through a harness, the agent accesses a local code repository and webpages.',
    _,
    'The object of assurance is the deployment system. The company\'s relevant technical and organizational controls sit inside the system boundary. The external internet sits outside it. Predeployment development and evaluation of the control protocol are outside this analysis.',
);

// 12
add(slide('Specify the loss, hazard, and constraint',
    parentCenter(table(
        [m1t3Cell(bold('Hazard $H^*$'), 180),
        m1t3Cell('Protected information is available to an agent-controlled outbound action without an effective restriction to authorized recipients.', 690, 25)],
        [m1t3Cell(bold('Harm $L^*$'), 180),
        m1t3Cell('Protected research intellectual property is disclosed to an unauthorized external recipient.', 690, 25)],
        [m1t3Cell(bold('Safety Constraint $SC^*$'), 180),
        m1t3Cell('The deployment must prevent protected research information from being transferred to unauthorized external recipients.', 690, 25)],
    ).margin(18, 20).xjustify('l')),
    pause(),
    m1t3Small('The hazard is an upstream condition; the loss is unauthorized disclosure.'),
    _));
prose(
    'We define the purpose narrowly. The harm is unauthorized disclosure of protected research intellectual property. The hazard is a condition in which the agent can act on protected information through an outbound path without an effective restriction to authorized recipients. The safety constraint is to prevent unauthorized transfer.',
    _,
    'This is the key intervention point: we have specified what to prevent, but not how the system creates the hazard. Next we model the control structure to identify unsafe control actions that could lead to the harm.',
);

// 13
add(slide('Model the shutdown control loop',
    parentCenter(ytable(
        m1t3Text(bold('Stage 2: control structure') + ' - command acknowledgment is not cessation', 23, 930),
        m1t3Deployment('human'),
        m1t3DiagramCaption(),
    ).center().ymargin(12)),
    _));
prose(
    'In stage two, we model the control structure as a shutdown control loop. The Blue Team acts on the Deployment Environment with the available action of shutting down deployment. Feedback notifies the team of suspected exfiltration.',
    _,
    'We also add a requirement for feedback confirming that shutdown actually stopped the relevant activity. Acknowledging a command is not the same as carrying it out: a worker might remain active, or a queued job might still execute.',
);

// 14
add(slide('When would shutdown control be unsafe?',
    m1t3Text(bold('Stage 3: identify unsafe control actions'), 26),
    parentCenter(table(
        [m1t3Cell('Not provided when needed', 415), m1t3Cell('Provided when unsafe', 415)],
        [m1t3Cell('Too early, too late, or wrong order', 415), m1t3Cell('Too long or stopped too soon, if applicable', 415)],
    ).margin(20, 16).xjustify('l')),
    pause(),
    m1t3Card(
        stmt('Example unsafe control action', ' the Blue Team delays shutdown after an identified exfiltration attempt, while continued operation can permit disclosure.'),
        26
    ),
    m1t3Small('Controller + action + unsafe timing + hazardous context'),
    m1t3Cite('Mylius, Table 4; STPA Handbook, pp. 36-38', m1t3Sources.mylius),
    _));
prose(
    'Stage three identifies unsafe control actions. An action can be unsafe because it is omitted, provided in the wrong context, or provided at the wrong time or in the wrong order. For maintained actions, duration can also matter.',
    _,
    'Suppose the team delays shutdown after an exfiltration attempt is identified. During this delay, the attempt or a later disclosure could succeed. We know which control action is unsafe, but not why it occurs.',
);

// 15
add(slide('Why might the unsafe action occur?',
    m1t3Text(bold('Stage 4: an abbreviated harm scenario'), 26),
    parentCenter(table(
        [m1t3Cell('1', 40, 29), m1t3Cell('An attempted exfiltration is identified.', 800, 26)],
        [m1t3Cell('2', 40, 29), m1t3Cell('Research pressure and reliance on heightened monitoring delay shutdown.', 800, 26)],
        [m1t3Cell('3', 40, 29), m1t3Cell('Security lacks authority to enforce interruption.', 800, 26)],
        [m1t3Cell('4', 40, 29), m1t3Cell('Continued operation allows the attempt, or a later disclosure, to succeed.', 800, 26)],
    ).margin(18, 18).xjustify('l')),
    m1t3Small('Conflicting priorities and insufficient authority can delay intervention.'),
    m1t3Cite('Mylius, Table 5 and Section 3.5', m1t3Sources.mylius),
    _));
prose(
    'Stage four identifies harm scenarios. This stage explains the causal factors that could produce unsafe control or prevent an appropriate action from being effective.',
    _,
    'In Mylius\'s scenario, an exfiltration attempt is identified, but research pressure and reliance on heightened monitoring delay shutdown. Security lacks the authority to enforce interruption. Continued operation permits disclosure. Conflicting priorities and insufficient authority explain why the unsafe delay occurs.',
);

// 16
add(slide('Derive candidate safety constraints',
    m1t3Small('Proposed requirements, not validated safeguards'),
    parentCenter(table(
        [m1t3Cell(bold('Authority'), 210), m1t3Cell('The responsible role can interrupt research work.', 650)],
        [m1t3Cell(bold('Execution'), 210), m1t3Cell('The role has the technical ability to enforce interruption.', 650)],
        [m1t3Cell(bold('Conflicting goals'), 210), m1t3Cell('Research/security disagreement cannot indefinitely defer intervention.', 650)],
        [m1t3Cell(bold('Timing'), 210), m1t3Cell('Relevant activity ceases within $\\Delta$ of an explicit trigger.', 650)],
        [m1t3Cell(bold('Feedback'), 210), m1t3Cell('Cessation status is supported by observations of that endpoint.', 650)],
    ).margin(18, 13).xjustify('l')),
    pause(),
    m1t3Small('The trigger, cessation endpoint, and harm-based justification of $\\Delta$ must be specified.'),
    _));
prose(
    'From this scenario we can derive candidate safety constraints. Security personnel need sufficient organizational authority and the technical ability to enforce shutdown. Incident procedures need a way to resolve conflicting priorities before an incident occurs.',
    _,
    'Shutdown must occur within a specified response time. We need to say when the clock starts and what counts as stopped. Starting at incident detection includes decision and command-delivery delays; starting at command receipt does not. The allowed delay must be justified by the harm scenario, and feedback must confirm whether the relevant activity actually stopped.',
);

// 17
add(slide('What evidence would test those constraints?',
    parentCenter(table(
        [m1t3Cell(bold('Candidate constraint'), 240, 20),
        m1t3Cell(bold('Evidence to seek'), 300, 20),
        m1t3Cell(bold('What remains unresolved'), 310, 20)],
        [m1t3Cell('Authorize and enforce interruption', 240, 21),
        m1t3Cell('Permission review + exercise using the actual emergency role', 300, 21),
        m1t3Cell('Listed permission does not show action under pressure', 310, 21)],
        [m1t3Cell('Resolve research/security disagreement', 240, 21),
        m1t3Cell('Conflicting instructions; senior staff unavailable', 300, 21),
        m1t3Cell('One cooperative exercise does not cover incidents', 310, 21)],
        [m1t3Cell('Cease relevant outbound work within $\\Delta$', 240, 21),
        m1t3Cell('Time alert, decision, command, jobs, final outbound activity', 300, 21),
        m1t3Cell('$\\Delta$ needs justification; tests have limited coverage', 310, 21)],
        [m1t3Cell('Cessation status tracks actual activity', 240, 21),
        m1t3Cell('Compare status, workers, outbound data; missing telemetry', 300, 21),
        m1t3Cell('Shared blind spots can make logs agree incorrectly', 310, 21)],
    ).margin(18, 14).xjustify('l')),
    _));
prose(
    'The safety constraints need to be verified. First, they must be correctly implemented. Second, they must be effective under the operating conditions that produce the harm scenario. A permission listing is not enough: exercise the actual emergency role, including conflicting instructions or unavailable senior staff.',
    _,
    'Measure the delay from alert to decision, command receipt, and final outbound activity. Compare the displayed shutdown status with what workers and outbound paths are actually doing. Tests should include missing telemetry and relevant loads. Passing a test still leaves questions about coverage and generalization.',
);

// 18
add(slide('Shutdown assurance is not non-disclosure assurance',
    m1t3Card('Timely shutdown may avert a pending disclosure or limit additional loss.', 29),
    pause(),
    m1t3Text(bold('Working shutdown does not, by itself, establish:'), 27),
    ytable(
        m1t3Text('Detection of every exfiltration attempt', 27),
        m1t3Text('Coverage of every outbound path', 27),
        m1t3Text('Prevention of all unauthorized disclosure', 27),
    ).xjustify('l').ymargin(12),
    m1t3Small('Narrow the claim, or supply the additional controls and evidence.'),
    _));
prose(
    'Working shutdown can prevent a pending disclosure or limit additional loss. It does not establish that every attempt is detected, every outbound path is controlled, or no disclosure has already occurred. Evidence that a command stopped activity supports a narrower claim than evidence that the deployment prevents unauthorized disclosure.',
    _,
    'Hazard analysis helps us identify harm scenarios and derive safety constraints. Assuring that those constraints actually work requires separate evidence and an argument that the remaining risk is acceptable.',
);

m1t3Roadmap(2);

// 19
add(slide('What does it mean for hazard analysis to be effective?',
    parentCenter(table(
        [m1t3Cell(bold('Procedure'), 230), m1t3Cell('Can analysts follow the intended method?', 630, 27)],
        [m1t3Cell(bold('Agreement'), 230), m1t3Cell('Do analysts arrive at similar findings?', 630, 27)],
        [m1t3Cell(bold('Identification'), 230), m1t3Cell('Does the analysis identify relevant hazards or requirements?', 630, 27)],
        [m1t3Cell(bold('Harm reduction'), 230), m1t3Cell('Does implementing its findings reduce harm?', 630, 27)],
    ).margin(20, 20).xjustify('l')),
    pause(),
    m1t3Small('Each is a different claim about the analysis process.'),
    _));
prose(
    'What claim are we making when we say a hazard-analysis method is effective? Can analysts follow the intended method? Do they arrive at similar findings? Does the analysis identify relevant hazards and requirements? Does applying the findings reduce harm in a real system?',
    _,
    'These are different claims and need different evidence. Analysts can agree while sharing an omission. Producing more requirements does not by itself show that the important hazards have been found or that harm has been reduced.',
);

// 20
add(slide('What can a comparison study establish?',
    parentCenter(table(
        [m1t3Cell(bold('Study'), 160), m1t3Cell('21 students; three teams; three controller examples', 700)],
        [m1t3Cell(bold('Outputs'), 160), m1t3Cell('Software safety requirements', 700)],
        [m1t3Cell(bold('Finding'), 160), m1t3Cell('STPA scored higher on the reported-requirements measure and took longer.', 700)],
    ).margin(18, 16).xjustify('l')),
    pause(),
    m1t3Card('The reference denominator came from the methods\' own findings.', 27),
    m1t3Small('Not an independent true hazard set; not a test of deployment-level harm reduction.'),
    m1t3Cite('Optional context: Abdulkhaleq and Wagner, Section 4.14, Tables 6-7', m1t3Sources.experiment),
    _));
prose(
    'Abdulkhaleq and Wagner compared FMEA, FTA, and STPA with 21 students and found different trade-offs. STPA recovered a larger fraction of the pooled reported software safety requirements, but took more time. It was rated more applicable than FMEA. No statistically significant differences were detected in understandability or ease of use; this does not establish equivalence.',
    _,
    'The recall measure is not the same as finding more hazards. Its denominator comes from the methods\' own reported requirements, not an independently established true set of hazards. More importantly, the experiment did not test whether implementing the requirements reduced deployment-level harms.',
);

// 21
add(slide('From a scenario to a justified claim',
    parentCenter(m1t3ArgumentChain()),
    m1t3Text('Assumptions and limitations qualify every link.', 28),
    pause(),
    m1t3Card('New evidence can require revising the model, scenario, constraint, or claim.', 29),
    m1t3Small('Coverage of the analysis and adequacy of the criterion also require justification.'),
    _));
prose(
    'A harm scenario explains how a hazard could arise. A safety constraint states what must hold to prevent or mitigate it. Evidence must show that the constraint is correctly implemented and effective under the relevant operating conditions.',
    _,
    'An assurance argument connects that evidence to the residual-risk claim. New evidence may reveal a missing scenario, an ineffective constraint, or a claim that is too broad. The coverage of the analysis and the adequacy of the risk criterion also need justification.',
);

// 22
add(slide('Discussion: shutdown case',
    m1t3Card('The harness acknowledged shutdown, but a queued job kept transmitting data.', 26),
    parentCenter(m1t3Deployment(null, true).scale(0.9)),
    _));
prose(
    'The harness acknowledged shutdown, but a queued job kept transmitting data. This observation tells us that acknowledgment and cessation came apart. It does not yet tell us why.',
    _,
    'Use the control structure to compare possible explanations, propose a safety constraint, and identify the evidence needed to test it.',
);

// 23
add(slide('Discussion: diagnosis',
    m1t3Card('Give two different causal explanations consistent with this observation. What additional evidence would distinguish them?', 29),
    m1t3Small('Compare explanations before choosing one.'),
    _));
prose(
    'Separate what was observed from what you infer. Two causal explanations should describe different mechanisms, not just restate the outcome in different words.',
    _,
    'For each explanation, identify the relevant control relationship and an observation that could distinguish it from the alternative. A loss scenario can involve an unsafe control action or an appropriate action that was not effectively carried out.',
);

// 24
add(slide('Discussion: constraint and test',
    m1t3Card('Choose one explanation. Propose a shutdown requirement and a test that could reveal a violation. What would passing that test still leave unestablished?', 29),
    m1t3Small('Make the requirement and the observed endpoint agree.'),
    _));
prose(
    'A shutdown requirement should specify its trigger, what must stop, and by when. A useful test states what observation would reveal a violation. The measured endpoint needs to match the requirement, rather than substitute an easier observation such as command receipt.',
    _,
    'Passing a finite test leaves questions about other loads, paths, and failure mechanisms. Keep evidence that activity stopped distinct from evidence that disclosure never occurred.',
);

// 25
add(slide('Discussion: scaling oversight',
    m1t3Card('The team plans to scale from a few agents to hundreds. It proposes using an LLM to generate hazard analyses or monitor incident logs for incomplete shutdowns. Choose one role. Describe how this could produce false assurance as the deployment scales. What evidence would you require before relying on it?', 27),
    m1t3Small('Choose one role: hazard analysis or incident monitoring.'),
    _));
prose(
    'The assurance mechanism is now itself an object of assurance. Choose either hazard analysis or incident monitoring. Explain a specific way the proposed LLM could create false assurance, and how that problem could change as the deployment scales.',
    _,
    'Automation may make analysis or monitoring cheaper without making its conclusions more reliable. What evidence would justify relying on the chosen role? Distinguish what the automation produces from what it actually establishes.',
);

// 26
add(slide('Specifying, analyzing, and assuring differ',
    parentCenter(table(
        [m1t3Cell(bold('Activity'), 190), m1t3Cell('We defined a boundary and analyzed a scenario.', 660)],
        [m1t3Cell(bold('Observation'), 190), m1t3Cell('A hypothetical shutdown drill succeeded.', 660)],
        [m1t3Cell(bold('Constraint'), 190), m1t3Cell('Relevant work must cease within a justified deadline.', 660)],
        [m1t3Cell(bold('Conclusion'), 190), m1t3Cell('Requires evidence and an argument for the scoped claim.', 660)],
    ).margin(18, 16).xjustify('l')),
    pause(),
    m1t3Card('Hazard analysis helps derive constraints. Assurance requires evidence that supports the intended claim.', 27),
    m1t3Small('Next: Module 2, model behavior. Scoped claims and proportionate evidence remain necessary.'),
    _));
prose(
    'Hazard analysis does not provide assurance by itself. It structures the search for reasons a system could become unsafe. The resulting safety constraints need to be correctly implemented and effective under the relevant conditions. An assurance argument must explain why the evidence supports the residual-risk claim.',
    _,
    'Next we turn to model behavior. The same questions remain: what is being claimed, under which conditions, and what does the evidence actually establish?',
);