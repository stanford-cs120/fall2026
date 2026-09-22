G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 1, Topic 1: Framing safety and assurance.
// Spine: course note "Module 1: Framing Safety and Assurance" (meeting 1).
// Assets: inherited lec1_1 images are worked in sparingly; see prose deviations.

function lecImage(filename, width) {
    return image('images/lec1_1/' + filename).width(width);
}

function promptCard(message) {
    return parentCenter(frameBox(message));
}

function small(x) { return text(x).scale(0.8); }

// One-column module table: number, unit of analysis, one column of cells.
// Used three times in a row (systems, hazards, harms) so the geometry matches.
function moduleTable(header, cells) {
    var units = ['Model behavior', 'Agent policy', 'Interaction process', 'Institutional ecosystem'];
    var rows = [[nil(), nil(), small(bold(header))]];
    units.forEach(function (u, k) {
        rows.push([bold(String(k + 2)), bold(u), small(cells[k])]);
    });
    return parentCenter(table.apply(null, rows).margin(18, 12).xjustify('l').scale(0.9));
}

// Recurring diagrams (expressivenessLadder, pressureLadder, stagesDiagram)
// live in utils.js so module openers can reuse them in roadmap mode.

add(titleSlide('Lecture 1: Framing Safety and Assurance',
    nil(),
    parentCenter('CS120: Introduction to AI Safety - September 22, 2026, Zachary Robertson'),
));
prose(
    'Module 1, meeting 1. This lecture introduces the organizing abstraction of the course, the basic vocabulary of failures, hazards, risks, and harms, and the four modules that follow. The two remaining meetings of Module 1 take up the object of assurance and what counts as an assurance claim.',
);

add(slide('Instructor: Hi, I\'m Zach',
    parentCenter(image('../images/zachary.png').width(300)),
    'Ph.D. candidate, Stanford Computer Science',
    'Research: evaluating AI without ground truth - measurement, incentives, and auditability',
    _));
prose(
    'Instructor introduction. Research on intrinsic (ground-truth-free) evaluation of AI systems previews the Module 5 question of evaluation as an object of optimization.',
);

add(slide('Course assistant: Milan',
    parentCenter(image('../images/milan.jpg').width(300)),
    'Ph.D. student, Stanford Computer Science',
    'Research: reliable, adaptive AI systems for open-world physical autonomy',
    _).id('course-assistant'));
prose(
    'Milan is a Ph.D. student in Stanford Computer Science. His research focuses on reliable, adaptive AI systems for open-world physical autonomy.',
);

add(slide('Logistics',
    stmt('Course webpage', 'stanford-cs120.github.io/fall2026'),
    stmt('Ed', 'Course questions, announcements, and reading posts'),
    stmt('Gradescope', 'Homework, project check-ins, and discussion tickets'),
    stmt('Office hours', 'Wednesdays, 2:00-3:00 p.m.; Gates 315'),
    stmt('Sensitive matters', 'zroberts@stanford.edu'),
    _));
prose(
    'We meet Tuesdays and Thursdays, 11:30 a.m.-12:50 p.m., in Hewlett Teaching Center 102. The course webpage links to Ed, Canvas, and Gradescope and is the authoritative location for the schedule and course policies. Use public Ed posts for course questions whenever possible; email the instructor for sensitive matters.',
    _,
);

add(slide('How the course works',
    stmt('Before class', 'Readings and short written responses'),
    stmt('During class', 'Lecture, then discussion or a group activity'),
    stmt('Discussion ticket', 'Keep your sheet; submit its code and your responses'),
    stmt('Project', 'Mid-quarter plan, final project, and two peer reviews'),
    parentCenter(small('Grading breakdown and full policies: course webpage')),
    _));
prose(
    'The course includes reading responses, definitional checks, discussion participation, and a final project. Reading posts may be submitted on Ed; homework, project check-ins, and discussion tickets go to Gradescope. The website lists the grading breakdown and policies; the complete grading, deadline, and project late-policy package will be finalized before the end of Week 2.',
    _,
    'Today is a modest pilot of the discussion-ticket workflow. Each student receives a sheet with a unique code, discusses the prompts with classmates, and records their own responses. We will walk through the Gradescope submission at the end of the meeting.',
);

add(slide('What comes to mind when you hear "safe AI"?',
    promptCard('Take one minute to write three associations.'),
    _));
prose(
    'Elicit the room\'s prior associations before offering any definitions. Ask for technical concerns, social concerns, present-day harms, and long-term risks without evaluating the answers yet. Return to these at the end when the four modules are on the board: most associations will land on a rung.',
    _,
);

////////////////////////////////////////////////////////////
// What we inherit from CS 221: three slides, then we leave it.

add(slide('A course about AI safety',
    bold('We adapt CS 221\'s basic paradigm: representations and their instantiation as artifacts.'),
    expressivenessLadder(9).scale(0.75),
    pause(),
    stagesDiagram(),
    _));
prose(
    'Part of the course is organized by adapting a pedagogical abstraction from Stanford\'s CS 221, which organizes AI systems into a basic paradigm of increasingly expressive representations and their instantiation as artifacts.',
    _,
    'What makes this course distinct is that it asks different questions, so the use of the abstraction shifts. The two diagrams are the two axes of the paradigm; the next two slides expand each one.',
);

add(slide('Four levels of expressiveness',
    bold('The appropriate assurance depends on the expressiveness of the representation.'),
    expressivenessLadder(9),
    _));
prose(
    'The representation axis. Reflex-based systems perform a fixed sequence of operations on a given input. State-based systems model the state of a world and transitions between states triggered by actions. Variable-based systems represent a desired solution as an assignment subject to constraints. Logic-based systems represent knowledge, rules, and constraints as formulas and derive consequences with explicit inference rules.',
    _,
    'The nature of the appropriate assurance depends on the expressiveness of the representation: what can go wrong with a reflex is not what can go wrong with a planner. The ladder is not a safety ranking and it is not the module structure, which comes later.',
);

add(slide('Machine learning and generalization',
    bold('If done properly, the model makes usable inferences beyond the training examples.'),
    stagesDiagram({ subs: ['fix an architecture', 'fit to data', 'predict beyond the data'] }),
    pause(),
    parentCenter('This is generalization.'),
    parentCenter(small('Statistics and probability theory formalize it.')),
    _));
prose(
    'The stages axis. Modeling sets the architecture of the AI system and determines which aspects can be adjusted. Learning determines how the system is adjusted, whether through data, optimization, prompt iteration, or other adaptation. Inference determines how the system is deployed or used for its end purpose.',
    _,
    'Machine learning focuses on using large amounts of data to train a model, and the stages are mostly fixed. If done properly, the resulting model makes usable inferences beyond the training examples, i.e., it generalizes. Statistical learning theory makes this precise.',
    _,
    'Generalization is a genuine achievement. The basic shift in AI safety is that successful generalization is not taken as the end of the story.',
);

add(slide('Assurance beyond generalization',
    bold('Successful generalization is <b>not</b> taken as the end of the story.'),
    parentCenter(ytable(
        'Optimization pressure in increasingly capable systems exploits:',
        parentCenter(xtable(
            frameBox('misspecification'),
            frameBox('incomplete evaluation'),
            frameBox('feedback processes'),
            frameBox('institutional structure'),
        ).center().xmargin(15).scale(0.85)),
    ).center().ymargin(20)),
    _));
prose(
    'The basic shift in the study of AI safety is that successful generalization is not taken as the end of the story. Instead, the focus is on what types of assurance are required as optimization pressure in increasingly capable systems exploits misspecification, incomplete evaluation, feedback processes, and institutional structure.',
    _,
    'The four boxes preview the four modules in order.',
);

add(slide('Evaluation is itself an object of optimization',
    parentCenter(ytable(
        'Classical safety asks whether a system is acceptable.',
        pause(),
        redbold('This course also asks when the process for deciding acceptability becomes an object of optimization.'),
    ).center().ymargin(25)),
    _));
prose(
    'Institutions, groups of individuals, and environments shape norms and influence what is considered sufficiently "safe." These groups can game the specification of what counts as safe and can influence how the evaluation of safety is carried out or interpreted.',
    _,
    'Who defines, measures, and assesses "safety" becomes a central aspect of the AI safety problem as the course progresses. This is the top rung of the ladder shown later.',
);

add(slide('Failure, hazard, risk, and harm',
    parentCenter(ytable(
        stmt('Failure', 'a component or process that departs from its intended behavior'),
        pause(),
        stmt('Hazard', 'a system condition or mechanism that is a source of potential harm'),
        pause(),
        stmt('Risk', 'the likelihood and severity of harm arising from a hazard under operating conditions'),
        pause(),
        stmt('Harm', 'a realized outcome that is negative to interests'),
    ).ymargin(18).xjustify('l')),
    pause(),
    parentCenter(small('These terms are distinguished in causal order, but the sequence is not mandatory.')),
    _));
prose(
    'Fixing a unit of analysis fixes which artifact or system\'s behavior must be assured. Assurance here consists of identifying hazards and characterizing the risk that potential harms are realized by the system.',
    _,
    'These terms help explain how harm can arise, but they are not a mandatory sequence of events. A failure departs from intended behavior. A hazard is a condition or mechanism that could produce harm, including when components work as specified. Risk characterizes the likelihood and severity of possible harm under operating conditions; it is not another event in the chain. A harm is a realized negative outcome.',
    _,
    'For example, a moderation rule can operate exactly as specified and still create a hazardous situation. Calling something a failure requires identifying the intended behavior from which it departs. Meeting 3 introduces the hazard-analysis methods FMEA, FTA, and STPA.',
);

add(slide('Running example: a content filter',
    bold('A content filter trained on crowd-sourced toxicity labels.'),
    parentCenter(ytable(
        stmt('Failure', 'shortcut learning that fits dialect as a proxy for toxicity'),
        pause(),
        stmt('Hazard', 'the resulting spurious correlation in the deployed filter'),
        pause(),
        stmt('Risk', 'depends on dialect prevalence, deployment scale, and the impact of wrongful filtering'),
        pause(),
        stmt('Harm', 'systematic filtering of content from speakers of that dialect'),
    ).ymargin(18).xjustify('l')),
    _));
prose(
    'Consider a content filter trained on crowd-sourced toxicity labels. Shortcut learning that fits dialect as a proxy for toxicity is a failure of the learning stage. The spurious correlation it leaves in the deployed filter is a hazard. The risk depends on the operating conditions of the filter: prevalence of the dialect versus toxicity, the scale of the deployment, and the impact of wrongful filtering. Systematic filtering of content from speakers of that dialect is the harm.',
    _,
    'For this worked example, the intended behavior is to distinguish toxicity rather than penalize dialect. Reliance on dialect can violate that intention while still predicting held-out labels well, especially if those labels share the same annotation biases. Shortcut learning need not imply a statistical generalization gap. Good prediction of the available labels does not establish that moderation decisions are safe. This example recurs in meeting 2 when we ask where the safety problem is located.',
);


////////////////////////////////////////////////////////////
// The course's own frames: recurring question, pressure ladder, modules.

add(slide('The recurring question',
    parentCenter(frameBox(text(bold('What must be assured for this unit of analysis, and what can optimization pressure exploit?')).width(800)).padding(20)),
    _));
prose(
    'With these abstractions in place, the recurring question of the course has a simple slogan. The aim is to break down assurance by unit of analysis, hazards, and potential harms, with case studies based on typical systems. Every module opener returns to this sentence.',
    _,
    'The slides that follow answer the two halves in turn: the ladder says what pressure exploits at each unit of analysis, the stages slide locates where hazards can enter, and the module slides fix the units of analysis the course will study.',
);

add(slide('Optimization pressure by unit of analysis',
    nil(),
    pressureLadder(9),
    _));
prose(
    'The course\'s recurring schema, introduced once here: what does optimization pressure exploit at each unit of analysis? Model behavior (shortcut learning, miscalibration), agent policy (reward hacking, specification gaming), interaction process (sycophancy, feedback-loop amplification), and the institutional ecosystem (benchmark gaming, endogenous evaluation). The arrow runs from model-level to institution-level.',
    _,
    'The sub-items are failure modes in the vocabulary of the earlier slide: departures from intended behavior that leave hazards. This slide is the failure-mode column of the course note\'s module table, so the module slides that follow do not repeat it.',
    _,
);

add(slide('Where hazards can enter',
    stagesDiagram({ subs: ['design choices', 'fitted behavior', 'deployment context'] }).scale(0.9),
    pause(),
    parentCenter(text('Hazards can enter at any stage. Whether harm occurs depends on how the system is used and under what conditions.').width(850).autowrap(true)),
    _));
prose(
    'The one return to the CS 221 stages locates possible sources of hazards. In the content-filter example, the label-collection design shapes the target, learning can fit a spurious feature, and deployment connects the score to a consequential moderation decision.',
    _,
    'These are not fixed slots for failure, hazard, and harm. A hazardous situation can arise from a deployment rule even when the model performs as intended. Operating conditions, exposure, and safeguards affect whether and how severely people are harmed.',
);

add(slide('Four modules and their units of analysis',
    moduleTable('Typical systems', [
        'classifier, content filter',
        'chess engine, robot planner, tool-using LLM',
        'recommender, team coordinator, assistant',
        'platform market, regulator, benchmark organization',
    ]),
    _));
prose(
    'After the framing module, each module studies one unit of analysis: reactive model behavior and development-time optimization (module 2), sequential decision-making and agency (module 3), adaptive interaction and sociotechnical dynamics (module 4), and evaluation, governance, and institutional assurance (module 5).',
    _,
    'The failure-mode column is on the pressure ladder two slides back, so this slide carries only the units of analysis and their typical systems. The next two slides add the hazard and potential-harm columns from the course note\'s table.',
    _,
    'Later modules inherit rather than replace the hazards introduced in earlier ones.',
);

add(slide('Hazards by module',
    moduleTable('Hazards', [
        'spurious correlations, untested inputs, evaluation blind spots',
        'proxy rewards, world-model errors, long horizons',
        'human bias, strategic responses, non-stationarity',
        'metric definitions, evaluator dependence, jurisdiction gaps',
    ]),
    pause(),
    parentCenter(small('Each entry is a system condition or mechanism that can be a source of potential harm.')),
    _));
prose(
    'Same rows, hazard column. Three entries per cell from the course note\'s table; the full lists are in the note. The discipline from the vocabulary slide applies to every cell: a hazard is a condition or mechanism of the system.',
);

add(slide('Potential harms by module',
    moduleTable('Potential harms', [
        'wrongful filtering, unequal error burdens, unsafe decisions',
        'irreversible side-effects, resource loss, policy violations',
        'loss of autonomy, entrenched inequities, distorted decisions',
        'weakened oversight, concentrated power, systemic externalities',
    ]),
    pause(),
    parentCenter(small('Each entry names an outcome that would be negative to interests if realized.')),
    _));
prose(
    'Same rows, potential-harm column. Every entry is an outcome, which is the other half of the hazard/harm discipline. Risk is deliberately not tabulated in any of the three slides: it depends on deployment conditions, so it is a property of a system in context rather than of a module.',
    _,
    'Do not read all four rows on either of these two slides; the tables are references, not a script. Return briefly to the opening associations. The applied exercise comes in the ticket discussion after the lecture.',
);


add(slide('The content filter across four units of analysis',
    parentCenter(ytable(
        stmt('Model behavior', 'the classifier fits dialect as a shortcut for toxicity'),
        pause(),
        stmt('Agent policy', 'the pipeline removes, warns, or escalates based on classifier outputs'),
        pause(),
        stmt('Interaction process', 'users rephrase to evade the filter, and the input distribution shifts'),
        pause(),
        stmt('Institutional ecosystem', 'the platform reports accuracy using a metric it defines'),
    ).ymargin(20).xjustify('l')),
    _));
prose(
    'The same content filter viewed at each unit of analysis. The shortcut is a model-behavior hazard. Wrapping the classifier in a moderation pipeline turns its outputs into actions with consequences, and the pipeline\'s policy (what to remove, what to escalate) becomes something that can be gamed. Once users learn what the filter penalizes they rephrase, and the strategic-response and non-stationarity hazards from the module-4 row appear. When the platform reports accuracy on a metric it defines, the metric-definition hazard from the module-5 row appears.',
    _,
    'The module-2 hazard does not disappear at any later rung; each rung adds hazards without removing earlier ones. This is the concrete version of "inherit rather than replace" and the setup for the next slide.',
    _,
);

add(slide('Units of analysis as perspectives',
    bold('Each unit of analysis is a perspective. The modules are neither exclusive categories nor hierarchical.'),
    pause(),
    parentCenter(ytable(
        small('An RL agent may use reflexes to navigate.'),
        small('An assurance question will not always reduce to one module.'),
    ).center().ymargin(12)),
    _));
prose(
    'The course progresses through the four modules one at a time, but each unit of analysis is a perspective, not a declaration of exclusive categories. It is possible for an RL agent to use reflexes to navigate an environment. Assurance will not always cleanly reduce to one module of analysis.',
);

add(slide('Two further questions for Module 1',
    parentCenter(ytable(
        stmt('Meeting 2', 'What is the <b>object</b> of assurance?'),
        pause(),
        stmt('Meeting 3', 'What <b>counts</b> as an assurance claim?'),
    ).ymargin(25).xjustify('l')),
    _));
prose(
    'Today introduced the basic vocabulary of failures, hazards, risks, and harms, in that order, and the organizing modules. Two further questions remain for this module. First, what is the object of assurance: models, development pipelines, deployed systems, or institutions? Second, what counts as an assurance claim: system boundaries, evidence, uncertainty, and hazard-analysis methods.',
    _,
    'Readings for meeting 2: "Concrete Problems in AI Safety" (2016) and "Fairness and Abstraction in Sociotechnical Systems" (2019). The website currently assigns "From Silos to Systems" and Chapter 2 of the STPA Handbook for meeting 3. Consult the website for the current reading list.',
);

// One module entry on the course-plan slide: header plus two sub-lines.
// nowrapText (not bulletedText) keeps each line out of a TeX minipage, so
// ten sub-lines fit vertically; keep each under ~90 characters.
function planModule(title, topics, arc) {
    return ytable(
        text(stmt(title)).scale(0.85),
        indent(nowrapText(bold('topics') + ': ' + topics).scale(0.65), 40),
        indent(nowrapText(bold('arc') + ': ' + arc).scale(0.65), 40),
    ).ymargin(2);
}

add(slide('Course plan',
    ytable(
        planModule('Module 1: framing safety and assurance',
            'failure, hazard, risk, harm; object of assurance; what counts as an assurance claim',
            'vocabulary and the recurring question; three meetings'),
        planModule('Module 2: model behavior',
            'shortcut learning, adversarial vulnerability, miscalibration, distribution shift',
            'development-time optimization; classifier and content-filter case studies'),
        planModule('Module 3: agent policy',
            'reward hacking, specification gaming, unsafe exploration, side-effects',
            'sequential decisions and agency; planners and tool-using LLMs'),
        planModule('Module 4: interaction process',
            'sycophancy, manipulation, preference shaping, feedback-loop amplification',
            'humans enter the loop; recommenders and assistants'),
        planModule('Module 5: institutional ecosystem',
            'benchmark gaming, endogenous evaluation, regulatory capture',
            'evaluation itself becomes an object of optimization'),
    ).ymargin(10).xjustify('l'),
    _));
prose(
    'The arc as a module list. Each module has two sub-lines: the topics it covers (failure modes from the module table) and its place in the arc. Module 1 is three meetings. Per-meeting topics live in the reconstruction plan and on the website.',
    _,
);

////////////////////////////////////////////////////////////
// Discussion half: the shared case and prompts match the printed ticket.

add(slide('Discussion: a content filter',
    parentCenter(frameBox(text('A platform recently implemented a content filter using a classifier trained on crowd-sourced toxicity labels. The platform has observed a large increase in account-suspension appeals. The toxicity classifier appears to be triggering automatic account suspensions.').width(850).autowrap(true).scale(0.85))),
    parentCenter(small('Discuss with classmates; record your own responses on your ticket.')),
    _));
prose(
    'This is the lecture-to-discussion handoff.',
);

add(slide('Discussion: apply the vocabulary',
    parentCenter(frameBox(text('Identify one possible failure, hazard, or harm. Label the category and explain briefly. What operating conditions would you need to clarify to assess the risk?').width(850).autowrap(true))),
    parentCenter(small('Short answers are sufficient. Make assumptions explicit.')),
    _));
prose(
    'Prompt 1 asks for one category, not a complete failure-to-harm chain. Have students label their choice and explain why it fits. A possible harm is wrongful suspension of a user; a hazardous condition might be automatic suspension without an effective safeguard against false positives. A claimed failure requires specifying intended behavior and evidence of a departure from it.',
    _,
    'Useful operating-condition questions include whether suspensions are reversible, how long appeals take, what consequences suspension has, and how many users are exposed. More appeals could reflect more suspensions, easier access to appeals, or other changes. Neither automatic suspension nor the appeal increase alone proves a failure.',
);

add(slide('Discussion: test an assurance inference',
    parentCenter(frameBox(text('Suppose the classifier performs well on held-out toxicity labels. What does that establish? What does it leave unresolved about the increase in appeals?').width(850).autowrap(true))),
    parentCenter(small('Separate the measurement from the assurance claim.')),
    _));
prose(
    'Prompt 2 asks students to scope the evidence. Held-out performance provides evidence about prediction of the evaluation labels under the measured conditions. Its strength depends on the metric, sample, and evaluation procedure; "performs well" does not specify those details.',
    _,
    'It does not by itself establish that the labels capture the relevant notion of toxicity, that errors are acceptably distributed, that the suspension rule is justified, or that the deployed process avoids harm. It also does not explain the appeal increase. During whole-room synthesis, ask students to connect an unresolved question to the additional observation they would want.',
);

add(slide('Discussion: record a revision or clarification',
    parentCenter(frameBox(text('After discussion, identify one assumption to clarify or one revision to make. Explain why.').width(850).autowrap(true))),
    parentCenter(small('Write your own final response before submitting.')),
    _));
prose(
    'Prompt 3 makes the discussion visible in the submitted response. A student need not reverse their answer: making an assumption explicit or narrowing a claim is a meaningful clarification. For example, an initial claim about rising wrongful suspensions might become a conditional claim after noticing that only the appeal count was observed.',
);

add(slide('Submit your discussion ticket',
    stmt('Q1', 'Enter the code printed on your September 22 ticket.'),
    stmt('Q2', 'Type your responses or upload a readable photo or scan.'),
    stmt('Deadline', 'Use the due time shown in the Gradescope assignment.'),
    parentCenter(small('One student per code. Keep the same code if you resubmit.')),
    _));
prose(
    'Codes belong to one meeting and one student. The posted policy says that if two students submit the same code, neither receives credit, even if Gradescope initially awards it. Correcting your own submission with the same code is not duplicate use by two students. Ask students to contact the teaching team if they lose or mistype a code.',
);

add(slide('Questions and next meeting',
    stmt('September 24', 'What is the object of assurance?'),
    parentCenter(ytable(
        text('Concrete Problems in AI Safety').scale(0.85),
        cite('Amodei et al., 2016', 'https://arxiv.org/abs/1606.06565').scale(0.6),
    ).center().ymargin(5)),
    parentCenter(ytable(
        text('Fairness and Abstraction in Sociotechnical Systems').scale(0.85),
        cite('Selbst et al., 2019', 'https://dl.acm.org/doi/10.1145/3287560.3287598').scale(0.6),
    ).center().ymargin(5)),
    parentCenter(small('Course website and Ed: readings and response instructions')),
    _));
prose(
    'Before the next meeting, read the two papers linked in the September 24 schedule row and follow the reading-response instructions on Ed. In summary, today distinguished failures, hazards, risks, and harms and introduced the course map. Next time we ask how a safety claim changes when its object is a model, a development pipeline, a deployed system, or an institution.',
);
