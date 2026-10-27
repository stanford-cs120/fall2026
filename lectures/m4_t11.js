G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 4, meeting 11: October 27, 2026.
// Technical lecture and preserved discussion, following the lecture-8 layout.
// All figures are native sfig drawings; no additional image assets are needed.
// Canonical content: notes/m4_t11.md.
// Browser: lecture.html?lecture=m4_t11
// Ticket: worksheets/configs/m4_t11.json; viewing/update instructions:
// worksheets/README.md#october-27-and-29-lectures-11-and-12-starters
// Displayed card/text literals are the ticket source; retain prose() boundaries.
// No dependency on another deck, no publication or coded-ticket generation.

function m4t11Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m4t11Card(message, size) {
    return parentCenter(frameBox(m4t11Text(message, size || 28, 860)).padding(16));
}

function m4t11Math(message, size) {
    return parentCenter(nowrapText(message).fontSize(size || 30));
}

function m4t11Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

function m4t11Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['a-recorded-choice-is-not-the-preference-itself', 'What does preference feedback represent?'],
        ['the-interface-can-change-the-label', 'How is feedback produced?'],
        ['preferences-can-change-through-interaction', 'Interaction loops and effective control'],
    ]).id('m4t11-roadmap-' + selected));
    prose([
        'Preferences and observed choices are not interchangeable. Utility representations and statistical choice models make different assumptions and answer different questions.',
        'Feedback is produced under particular interfaces, instructions, and working conditions. Those conditions matter for interpreting labels and protecting the people who supply them.',
        'Recommendations can shape preferences and later data. Effective control requires ways to observe, evaluate, and intervene on these interactions, not merely authority to approve an output.',
    ][selected]);
}

function m4t11Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m4t11Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m4t11Panel(heading, message, width, size) {
    return frameBox(ytable(
        m4t11Text(bold(heading), 24, width || 260),
        m4t11Text(message, size || 27, width || 260),
        _
    ).ymargin(14)).padding(14);
}

function m4t11PreferenceLoop() {
    var parts = [];
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    parts.push(at(rect(920, 175).fillColor('white').strokeWidth(0), 0, 0));
    ['Recommended foods', 'Repeated choices', 'Later preferences'].forEach(function (message, k) {
        parts.push(at(frameBox(m4t11Text(message, 26, 250))
            .padding(12), 320 * k, 0));
    });
    parts.push(arrow(point(278, 35), point(312, 35)).strokeWidth(2));
    parts.push(arrow(point(598, 35), point(632, 35)).strokeWidth(2));
    parts.push(line(point(775, 82), point(775, 153)).strokeWidth(2)
        .strokeColor('#245A81'));
    parts.push(line(point(775, 153), point(135, 153)).strokeWidth(2)
        .strokeColor('#245A81'));
    parts.push(arrow(point(135, 153), point(135, 82)).strokeWidth(2)
        .strokeColor('#245A81'));
    parts.push(at(nowrapText('Later interactions').fontSize(23)
        .strokeColor('#245A81'), 351, 112));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// Same geometry and wording as m4t12PlatformDiagram; keep the two in sync.
// Drawing pattern adapted from lecture 9, without loading that presentation.
// The developer box groups collection, reward modeling, and model training.
// Dashed paths are between-release updates/data, not runtime retraining.
function m4t11PlatformDiagram() {
    var parts = [], ink = '#222222', blue = '#245A81', purple = '#654375';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function label(message, x, y, size, color) {
        parts.push(at(nowrapText(message).fontSize(size || 20)
            .strokeColor(color || ink), x, y));
    }
    function panel(x, y, width, title, detail, fill, titleSize) {
        parts.push(at(rect(width, 66).fillColor(fill || 'white')
            .strokeColor(ink).strokeWidth(1.6), x, y));
        label(title, x + 12, y + 8, titleSize || 24);
        label(detail, x + 12, y + 39, 18);
    }
    function route(points, color, dashed) {
        for (var i = 1; i < points.length; i++) {
            var a = points[i - 1], b = points[i];
            if (!dashed) {
                parts.push((i === points.length - 1 ? arrow : line)(
                    point(a[0], a[1]), point(b[0], b[1])
                ).strokeColor(color || ink).strokeWidth(1.8));
            } else {
                var dx = b[0] - a[0], dy = b[1] - a[1];
                var length = Math.sqrt(dx * dx + dy * dy);
                var last = i === points.length - 1;
                var stop = last ? length - 8 : length;
                for (var d = 0; d < stop; d += 13) {
                    var end = Math.min(d + 7, stop);
                    parts.push(line(
                        point(a[0] + dx * d / length, a[1] + dy * d / length),
                        point(a[0] + dx * end / length, a[1] + dy * end / length)
                    ).strokeColor(color || ink).strokeWidth(1.8));
                }
                if (last) parts.push(arrow(
                    point(b[0] - dx * 8 / length, b[1] - dy * 8 / length),
                    point(b[0], b[1])
                ).strokeColor(color || ink).strokeWidth(1.8));
            }
        }
    }

    parts.push(at(rect(1000, 440).fillColor('white').strokeWidth(0), 0, 0));
    label('Development and release decisions', 20, 0, 22, purple);
    panel(20, 45, 240, 'Designer', 'Goals / release authority', '#F8F6FA');
    panel(390, 45, 300, 'Developer', 'Data / reward / training', '#F8F6FA');
    panel(800, 45, 180, 'Paid raters', 'Pairwise labels', '#F8F6FA');
    label('Goals / approval', 265, 28, 18);
    route([[260, 57], [390, 57]]);
    route([[390, 90], [260, 90]], blue);
    label('Release evidence', 265, 115, 18, blue);
    label('Pairs / rubric', 696, 28, 18);
    route([[690, 57], [800, 57]]);
    route([[800, 90], [690, 90]], blue);
    label('Judgements', 696, 115, 18, blue);

    parts.push(at(rect(990, 170).fillOpacity(0)
        .strokeColor('#777777').strokeWidth(1.6), 5, 220));
    label('Deployment: fixed model per release', 20, 233, 21, blue);
    panel(20, 285, 240, 'Users', 'View / act / report');
    panel(390, 285, 300, 'Platform', 'Recommender + interface', '#F3F6FA');
    panel(800, 285, 180, 'Creators', 'Provide posts');

    route([[450, 111], [450, 285]], purple, true);
    label('Release update', 465, 161, 20, purple);
    route([[650, 285], [650, 111]], purple, true);
    label('Logs + context', 665, 190, 20, purple);

    label('Ranked feed', 268, 265, 19);
    route([[390, 302], [260, 302]]);
    route([[260, 333], [390, 333]], blue);
    label('Acts / reports', 268, 357, 19, blue);
    label('Posts', 726, 287, 20);
    route([[800, 318], [690, 318]]);
    label('Dashed: between releases. Recommendations shape later feedback.',
        20, 411, 22, purple);
    return overlay.apply(null, parts).recMouseShowHide(false);
}

function m4t11DiagramAnchor(id) {
    add(slide('Social platform: control and feedback',
        parentCenter(m4t11PlatformDiagram().scale(0.94)),
        _
    ).id(id));
    prose(
        'The designer sets goals and release authority; the developer implements collection, reward modeling, training, and release changes. These roles may belong to different people.',
        _,
        'The upper loop supplies tasks and rubrics to paid raters and returns judgements. Raters need not be end users. Creator and user roles can overlap. The diagram is deliberately scoped; advertisers, moderators, and other affected people may matter in a fuller analysis.',
        _,
        'The deployed recommender and interface determine exposure and opportunities to act or report. Logs should retain what was shown and the collection context, not only the eventual label. Dashed paths represent data and updates between releases; a like does not retrain the current model.',
        _,
        'Fixed weights do not mean fixed recommendations: user history and other runtime inputs can change. Recommendations can also change participation and preferences. Release evidence and approval are channels, not proof of effective control. The exercise asks students to propose safeguards that are not already implemented here.',
    );
}

add(titleSlide(ytable(
    nowrapText('Lecture 11: Human Feedback,').fontSize(40).strokeColor('darkblue'),
    nowrapText('Preferences, and Reward Models').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m4t11Text(
        'CS120: Introduction to AI Safety - October 27, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture11'));
prose(
    'Module 3 examined policies that choose actions over time. Module 4 shifts the unit of analysis to interaction loops with people. Human judgements shape training, evaluation, and approval, while the system can change what people see, what they can evaluate, and what they come to value.',
);

// 2
add(slide('From agent policies to interaction loops',
    parentCenter(courseProgressionDiagram(4)),
    pause(),
    m4t11Card('Actions change the environment. Interactions with users also shape preferences and future feedback.', 28),
    _));
prose(
    'An agent policy selects actions that affect future states and observations. The interaction loop also includes the people whose judgements guide the system. Recommendations affect which alternatives are explored and repeatedly chosen; later feedback can therefore depend on the system that helped produce it.',
);

// 3
add(slide('Human participation is not effective control',
    parentCenter(m4t11PlatformDiagram().scale(0.83)),
    pause(),
    m4t11Text('Designers, evaluators, and end users need not be the same people.', 28),
    _).id('lecture11-system'));
prose(
    'Designers create models to achieve certain ends, but the designer, evaluator, and end user are often different entities. Judgements depend on the evaluator, alternatives, and collection interface. Participation in development or authority to approve a release does not by itself establish effective control.',
);

// 4
m4t11Roadmap(0);

// 5
add(slide('A recorded choice is not the preference itself',
    parentCenter(xtable(
        m4t11Panel('Stated wants', 'What does the user say they want?', 390),
        m4t11Panel('Observed behavior', 'What does the user choose or watch?', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t11Card('Both depend on context, available alternatives, and how the question is asked.', 28),
    m4t11Cite('Lambert, 2025', 'https://arxiv.org/abs/2504.12501'),
    _));
prose(
    'There is a distinction between what a user says they want and the preferences inferred from behavior. Judgements of whether a designer\'s ends have been achieved depend on the evaluator, context, comparable alternatives, and interface. Predicting a recorded choice does not automatically identify a stable preference.',
);

// 6
add(slide('A lottery is a distribution over outcomes',
    m4t11Text('Let $\\mathcal O$ be a finite set of outcomes.', 29),
    m4t11Math('$p_L(o) = \\text{probability that lottery }L\\text{ produces }o$', 29),
    m4t11Math('$p_L(o)\\geq 0,\\qquad \\sum_{o\\in\\mathcal O}p_L(o)=1$', 30),
    pause(),
    m4t11Card('A pure outcome is a lottery with probability one on that outcome.', 28),
    _));
prose(
    'A lottery is a probability distribution over a finite set of outcomes. The probability that lottery L produces outcome o is written as p_L(o). A pure outcome is the special case with no randomness: its probability is one, and all other outcomes have probability zero.',
);

// 10
add(slide('Bradley-Terry models choice between pure outcomes',
    m4t11Math('$P_\\theta(\\text{select }a\\mid a,b)=\\sigma(r_\\theta(a)-r_\\theta(b))$', 32),
    m4t11Math('$\\sigma(z)=\\frac{1}{1+e^{-z}}$', 32),
    m4t11Text('Equal scores give selection probability $1/2$.', 28),
    pause(),
    m4t11Card('This models observed choices between pure lotteries.', 28),
    m4t11Text('Bradley-Terry is a utility model. Testing if it represents agent preference under risk (VNM) is a separate question.', 27),
    _));
prose(
    'Bradley-Terry models probabilities over the observed choice. A logistic function converts the difference between two outcome scores into a probability of selecting the first. This comparison model differs from the VNM representation of preferences over distributions of outcomes. Neither its scores nor its predictions automatically identify an individual\'s utility.',
);

// 9
add(slide('Expected utility requires assumptions',
    m4t11Text(bold('Completeness:') + ' every comparison resolves, allowing ties.', 27),
    m4t11Text(bold('Transitivity:') + ' comparisons are consistent across lotteries.', 27),
    m4t11Text(bold('Continuity:') + ' strict comparisons survive small probability changes.', 27),
    pause(),
    m4t11Text(bold('Independence:') + ' mixing in the same lottery preserves the comparison.', 27),
    m4t11Math('$L\\succeq M\\iff \\alpha L+(1-\\alpha)N\\succeq\\alpha M+(1-\\alpha)N$', 27),
    m4t11Math('$0<\\alpha<1$', 25),
    _));
prose(
    'Write L at least as favored as M using the preference relation. Assume comparisons resolve and are transitive, strict comparisons are stable under small changes in outcome probabilities, and mixing a third lottery into both alternatives in the same proportion does not change their comparison. Observed choices need not satisfy these assumptions.',
);

// 10
add(slide('Von Neumann Morgenstern axioms',
    m4t11Text('Under these assumptions, there exists $u:\\mathcal O\\to\\mathbb R$ such that', 28),
    m4t11Math('$L\\succeq M\\iff\\sum_{o\\in\\mathcal O}p_L(o)u(o)\\geq\\sum_{o\\in\\mathcal O}p_M(o)u(o)$', 30),
    pause(),
    m4t11Text('The representation is unique up to a positive affine transformation:', 27),
    m4t11Math('$u^{\\prime}=a u+b,\\qquad a>0$', 32),
    m4t11Cite('von Neumann and Morgenstern, 1947'),
    _));
prose(
    'The VNM theorem gives conditions under which an individual\'s preferences over lotteries admit an expected-utility representation. Utility is unique up to a positive affine transformation. This is a representation result, not evidence that observed choices satisfy its assumptions or that utilities can be compared across individuals.',
);

// 11
add(slide('Individual models do not resolve aggregation',
    m4t11Card('Utility scales are not automatically comparable across people.', 29),
    pause(),
    parentCenter(m4t11Chain([
        'Individual judgements',
        'Aggregation rule',
        'Shared model behavior',
    ])),
    m4t11Text('Whose judgements should shape the model?', 29),
    m4t11Cite('Conitzer et al., 2024', 'https://proceedings.mlr.press/v235/conitzer24a.html'),
    _));
prose(
    'Preference data usually comes from many annotators rather than one individual. Integrating these judgements requires choices about aggregation and pluralism: how diverse groups, beliefs, and interests share influence. An individual preference model does not make those choices. The next lecture examines this population-level problem.',
);

// 11
m4t11Roadmap(1);

// 12
add(slide('The interface can change the label',
    parentCenter(xtable(
        m4t11Panel('Compare', 'Choose between two outputs.', 260),
        m4t11Panel('Rank', 'Order several outputs.', 260),
        m4t11Panel('Rate', 'Score one output.', 260),
        _
    ).center().xmargin(20)),
    pause(),
    m4t11Text('Option order, framing, and the ability to tie or abstain affect reports.', 29),
    m4t11Cite('Lambert, 2025', 'https://arxiv.org/abs/2504.12501'),
    _));
prose(
    'Pairwise comparisons are not the only way to collect feedback. Rankings and ratings are other possibilities. For bounded actors, option order, framing, and the possibility of indecision or ties can affect the resulting reward model. Models that predict validation labels equally well may still behave differently in application.',
);

// 13
add(slide('Truthful revelation need not be feasible',
    m4t11Text(bold('Revelation principle:') + ' under its assumptions, the same equilibrium outcomes can be obtained through a truthful direct mechanism.', 28),
    parentCenter(m4t11Chain([
        'Indirect mechanism',
        'Truthful direct mechanism',
    ], 365)),
    pause(),
    m4t11Card('Comparing two outputs does not mean being able to specify preferences over every possible output.', 28),
    m4t11Cite('Conitzer and Sandholm, 2004', 'https://doi.org/10.1145/988772.988824'),
    _));
prose(
    'The revelation principle relates the equilibrium outcomes of indirect mechanisms to truthful direct mechanisms under its assumptions. A direct mechanism may nevertheless be infeasible to compute or use. Being able to compare two outputs does not imply being able to communicate a complete preference over the entire output space.',
);

// 14
add(slide('Expressing intent is not verifying an output',
    parentCenter(xtable(
        m4t11Panel('Intent', 'Know what you want.', 260),
        m4t11Panel('Instruction', 'Articulate it as a specification.', 260),
        m4t11Panel('Verification', 'Check whether the output satisfies it.', 260),
        _
    ).center().xmargin(20)),
    pause(),
    m4t11Card('Instructions, output observation, and verification are not interchangeable.', 28),
    _));
prose(
    'A prompt author may understand their intent without having the expertise to express it as a specification. Even an approximately correct specification does not ensure the author has the knowledge needed to verify the generated output. Seeing an answer and knowing that it meets the intended requirements are different capabilities.',
);

// 15
add(slide('Expertise is task-specific',
    parentCenter(xtable(
        m4t11Panel('Code', 'Detect a security issue.', 390),
        m4t11Panel('Art', 'Judge a subtle aesthetic difference.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t11Text('Hiring an expert does not specify which judgement they should make.', 29),
    _));
prose(
    'An expert may detect differences that a general evaluator misses, such as a subtle nuance or a security issue in code. Expertise is task-specific: qualification to check code need not transfer to critiquing art. Hiring an expert also does not specify the decision on which their judgement is needed.',
);

// 16
add(slide('Contracts shape what labels mean',
    m4t11Text('A data worker may be asked to:', 28),
    parentCenter(ytable(
        m4t11Text(bold('Express') + ' a personal preference.', 30),
        m4t11Text(bold('Demonstrate') + ' how to complete a task.', 30),
        m4t11Text(bold('Apply') + ' a rubric.', 30),
        _
    ).ymargin(22)),
    pause(),
    m4t11Text('Recruitment, instructions, quality assurance, and payment shape the task.', 28),
    _));
prose(
    'Data workers produce judgements under instructions and payment contracts. The task may be to express a personal preference, demonstrate how to complete a task, or apply a rubric. Recruitment, quality assurance, and payment enter into the conditions under which the label is produced, and therefore into its interpretation.',
);

// 17
add(slide('Voluntary feedback comes from participants',
    parentCenter(xtable(
        m4t11Panel('Behavioral logs', 'Which videos are watched or liked?', 390),
        m4t11Panel('Explicit comparisons', 'Which model response is selected?', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t11Text('Chatbot Arena offers model access in exchange for voluntary comparisons.', 28),
    m4t11Cite('Chiang et al., 2024', 'https://arxiv.org/abs/2403.04132'),
    _));
prose(
    'Platforms can collect behavioral data such as which videos are watched or liked, including through terms-of-service agreements. Chatbot Arena explicitly collects comparisons from people with access to frontier language models. These collection arrangements differ from contracted rubric application; their labels must be interpreted in light of who participates and what they encounter.',
);

// 18
add(slide('Retain how the data was produced',
    m4t11Text('A label alone does not preserve its collection conditions.', 29),
    parentCenter(ytable(
        xtable(
            m4t11Panel('People and conditions', 'Recruitment, expertise, payment', 390, 25),
            m4t11Panel('Task and interface', 'Instructions, rubrics, alternatives', 390, 25),
            _
        ).center().xmargin(28),
        pause(),
        xtable(
            m4t11Panel('Selection', 'Filtering and quality assurance', 390, 25),
            m4t11Panel('Intended use', 'Where the judgements should apply', 390, 25),
            _
        ).center().xmargin(28),
        _
    ).ymargin(22)),
    _));
prose(
    'Retaining provenance is often as important as retaining the dataset itself. Collection context, rubrics used to evaluate data and annotators, filtering decisions, and intended uses remain important. The diversity of data sources creates useful opportunities, but decisions about how a dataset was constructed are often overlooked.',
);

// 19
add(slide('Protect workers, not only label quality',
    m4t11Text('Data work can expose people to monotonous, unsettling, or toxic material.', 30),
    pause(),
    m4t11Card('Hazardous working conditions require worker protection, not only better labels.', 29),
    m4t11Cite('Perrigo, TIME, 2023', 'https://time.com/6247678/openai-chatgpt-kenya-workers/'),
    _));
prose(
    'Training data requires human labor, including when synthetic preference data comes from models trained on human data. Workers may face monotonous, unsettling, or toxic conditions. The potential for hazardous outputs requires worker protection, not merely discussion of whether the data is accurate, high quality, or representative of diverse preferences.',
);

// 20
m4t11Roadmap(2);

// 21
add(slide('Preferences can change through interaction',
    m4t11Text('Candy today; health and spending constraints later.', 30),
    pause(),
    parentCenter(m4t11PreferenceLoop()),
    m4t11Text('Recommendations also change what is explored and repeatedly chosen.', 28),
    m4t11Cite('Jiang et al., 2019', 'https://arxiv.org/abs/1902.10730'),
    _));
prose(
    'Someone who once chose candy over vegetables may later need to reduce sugar or track spending. Preferences, constraints, and values can change and separate. Recommendations also affect which alternatives are explored and repeatedly chosen. The interaction with the ordering system can therefore shape preferences and values over time.',
);

// 22
add(slide('A working demo can hide a safety failure',
    parentCenter(m4t11Chain([
        'Repair a visible UI bug',
        'Approve a backend patch',
        'Visible workflow succeeds',
    ])),
    pause(),
    m4t11Card('The patch also removes an authorization check.', 30),
    _));
prose(
    'A user asks a coding assistant to repair a visible interface bug. The assistant proposes a backend patch, the user approves it, and the visible workflow succeeds. But the backend change removes an authorization check. The user has expressed a preference without establishing that the system\'s safety constraints are preserved.',
);

// 23
add(slide('Approval can be an unsafe control action',
    parentCenter(xtable(
        m4t11Panel('Unsafe control action', 'Approve using only a partial view.', 260, 26),
        m4t11Panel('Hazard', 'Information is accessible to unauthorized users.', 260, 26),
        _
    ).center().xmargin(36)),
    pause(),
    m4t11Card('Harm: information is disclosed to unauthorized users.', 29),
    m4t11Cite('Leveson and Thomas, 2018',
        'https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf'),
    _));
prose(
    'Approval authority alone does not resolve the gap between intent and understanding. The unsafe control action is approving the patch using only a partial view to verify its acceptability. The hazardous condition permits unauthorized access, and the potential loss is disclosure of information to unauthorized users.',
);

// 24
add(slide('Safety constraints need more than approval',
    m4t11Text(bold('Scope edits:') + ' limit what the assistant can change.', 29),
    m4t11Text(bold('Test separately:') + ' verify safety-critical functions, including authorization.', 29),
    pause(),
    m4t11Text(bold('Retain rollback:') + ' restore a previous version after a failure.', 29),
    m4t11Card('Rollback can support recovery; it cannot undo information already disclosed.', 28),
    _));
prose(
    'Scoped edits, rollback, and separate tests for safety-critical functions are candidate ways to implement appropriate safety constraints. They serve different purposes. Limiting changes and testing authorization can prevent an unsafe release, while rollback supports recovery. A successful visible workflow alone does not establish that those constraints hold.',
);

// 25
add(slide('Today\'s feedback shapes tomorrow\'s model',
    parentCenter(m4t11PlatformDiagram().scale(0.83)),
    pause(),
    m4t11Text('Outputs and ratings become data for a later release.', 29),
    _));
prose(
    'Users rate model outputs; the ratings and outputs become preference data, and new models are trained on that data. Feedback can be both preferential and performative: it helps shape the model the contributor will encounter next. The deployed model is fixed between releases, but its recommendations and later feedback can change.',
);

// 26
add(slide('Observe, evaluate, and intervene',
    parentCenter(xtable(
        m4t11Panel('Observe', 'What can the designer see?', 260),
        m4t11Panel('Evaluate', 'Can they verify safety constraints?', 260),
        m4t11Panel('Intervene', 'Can they prevent or correct unsafe changes?', 260),
        _
    ).center().xmargin(20)),
    pause(),
    m4t11Card('Human approval and feedback are not a fixed specification waiting to be articulated.', 28),
    m4t11Cite('Perdomo et al., 2020', 'https://proceedings.mlr.press/v119/perdomo20a.html'),
    _));
prose(
    'Human approval and feedback are produced by people interacting with a system. That system can change what they see, what they can evaluate, and what they ultimately come to value. Effective control requires ways to observe, evaluate, and intervene on the interaction loop, rather than treating approval as a fixed specification.',
);

// 27: preserve the existing discussion diagram and its notes.
m4t11DiagramAnchor('discussion11-system');

// BEGIN DISCUSSION: only displayed literals below are extracted into tickets.
add(slide('Discussion: Human feedback on a social platform',
    m4t11Card('A social platform aims to help users find worthwhile posts. A designer sets goals and approves releases; developers train a recommender using watch/like logs and paid pairwise judgements. Users and creators are not necessarily the raters.', 27),
    m4t11Text('Assume a fixed model between releases. The interface determines which posts and feedback options people see.', 26),
    _).id('discussion11-setting'));
prose(
    'Do not equate worthwhile with watch time. The questions develop measurement, provenance, effective control, and endogenous feedback using the same system.',
    _,
    'The ticket includes the local setting and every displayed follow-up, but not the diagram, technical placeholder, or speaker notes.',
);

add(slide('1. What does the feedback measure?',
    m4t11Card('A user watches a post to the end but later says it was not worth seeing. What does each signal measure? Propose an elicitation change and a comparison that tests whether the interface changes the label.', 28),
    m4t11Text('Distinguish predicting a recorded choice from identifying a stable preference.', 27),
    _).id('discussion11-measurement'));
prose(
    'A watch event and a retrospective judgement need not measure the same construct. Neither automatically identifies a stable utility. A comparison might vary option order, framing, or the ability to abstain while holding the content and task fixed.',
    _,
    'Bradley-Terry models observed selection probabilities under a specified collection process. VNM is a representation theorem under assumptions, not a guarantee about these labels or a derivation of Bradley-Terry.',
);

add(slide('2. Whose judgements become data?',
    m4t11Card('Contracted raters compare posts under a platform rubric. What must be recorded about recruitment, instructions, shown alternatives, and payment to interpret their labels? Identify one worker-protection requirement beyond label accuracy.', 28),
    m4t11Text('Explain why these judgements need not represent the end-user population.', 27),
    _).id('discussion11-provenance'));
prose(
    'Distinguish applying a rubric from expressing a personal preference. Recruitment, expertise, payment, filtering, and collection conditions can affect what the labels mean and to whom they generalize.',
    _,
    'Worker protection is an obligation, not merely a data-quality technique. A proposal could address exposure to distressing material, support, or the ability to decline a task without penalty.',
);

add(slide('3. What would justify rollout?',
    m4t11Card('A new recommender scores better on paid-rater evaluations and passes its demo. But demo accounts have no blocked creators. Real users can block creators to keep their posts out of the feed. Would you approve rollout? What evidence would change your decision?', 27),
    m4t11Text('Where should the block rule be enforced? What might a passing test miss?', 27),
    _).id('discussion11-control'));
prose(
    'Better preference scores do not establish that explicit user constraints are respected. Approving a broad release using only this evidence may be an unsafe control action.',
    _,
    'The platform must not recommend posts from creators blocked by the viewer. Enforce this constraint in the serving system, independently of the learned ranking score.',
    _,
    'Test accounts with blocked creators whose posts would otherwise rank highly. Verify the constraint across feed refreshes and cached recommendations. A passing test does not establish correctness across all serving paths or future states.',
);

add(slide('4. Feedback changes the next feedback',
    m4t11Card('After a release, watch time and positive ratings rise. Could this happen without users finding the feed more worthwhile? Trace a loop through exposure, participation or preferences, and later training data.', 28),
    m4t11Text('What independently collected or longitudinal evidence would help distinguish explanations?', 27),
    _).id('discussion11-feedback-loop'));
prose(
    'Do not infer harm or improvement from the aggregate alone. Users may genuinely benefit; exposure, respondent composition, or preferences may also change. Distinguish a change in preferences from a change in who is observed.',
    _,
    'Ask who remains absent from the proposed evidence, and whether the measure is itself affected by the recommendation or feedback interface. This prepares the collective-choice questions in Lecture 12 without resolving them.',
);
// END DISCUSSION

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 11: Human Feedback, Preferences, and Reward Models';