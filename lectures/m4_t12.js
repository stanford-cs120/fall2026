G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 4, meeting 12: October 29, 2026.
// Compact technical lecture and discussion.
// All figures are native sfig drawings; no additional image assets are needed.
// Canonical content: notes/m4_t12.md.
// Browser: lecture.html?lecture=m4_t12
// Ticket: worksheets/configs/m4_t12.json; viewing/update instructions:
// worksheets/README.md#october-27-and-29-lectures-11-and-12-starters
// Displayed card/text literals are the ticket source; retain prose() boundaries.
// No dependency on another deck, no publication or coded-ticket generation.

// Optional separator lays out one ticket-source literal as multiple slide rows.
function m4t12Text(message, size, width, separator) {
    if (separator) {
        return ytable.apply(null, message.split(separator).map(function (row) {
            return m4t12Text(row, size, width);
        })).ymargin(12);
    }
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m4t12Card(message, size) {
    return parentCenter(frameBox(m4t12Text(message, size || 28, 860)).padding(16));
}

function m4t12Math(message, size) {
    return parentCenter(nowrapText(message).fontSize(size || 30));
}

function m4t12Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

function m4t12Panel(heading, message, width, size) {
    return frameBox(ytable(
        m4t12Text(bold(heading), 24, width || 260),
        m4t12Text(message, size || 27, width || 260),
        _
    ).ymargin(14)).padding(14);
}

function m4t12Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m4t12Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m4t12Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['elicitation-is-not-aggregation', 'Whose views are reflected?'],
        ['consistent-rankings-can-produce-a-majority-cycle', 'How are judgements combined?'],
        ['population-share-does-not-settle-influence', 'What changes after deployment?'],
    ]).id('m4t12-roadmap-' + selected));
    prose([
        'Individual judgements do not specify how those judgements should be combined. People can disagree about facts, task interpretation, and what matters. Before combining their views, it is worth asking whose perspectives a model reflects and whether that population is relevant to the decision.',
        'Social choice provides a vocabulary for making aggregation assumptions explicit. Consistent individual rankings can produce a majority cycle. Fitting a shared reward model or selecting principles for AI feedback makes choices about how disagreement influences a shared outcome; neither procedure makes those choices disappear.',
        'A representative feedback process need not remain representative after deployment. The system can change participation, exposure, and opportunities to report preferences. Recruitment and nonresponse also affect whose views are recorded, while unequal implementation burdens raise a separate question about whose interests should influence the decision.',
    ][selected]);
}

function m4t12MajorityCycle() {
    var parts = [], ink = '#245A81';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function edge(x1, y1, x2, y2) {
        parts.push(arrow(point(x1, y1), point(x2, y2))
            .strokeColor(ink).strokeWidth(2.5));
    }
    parts.push(at(rect(440, 285).fillColor('white').strokeWidth(0), 0, 0));
    edge(80, 40, 360, 40);
    edge(370, 65, 242, 184);
    edge(198, 184, 73, 65);
    [['A', 50, 40], ['B', 390, 40], ['C', 220, 210]].forEach(function (item) {
        parts.push(transform(overlay(
            circle(25).fillColor('#F3F6FA').strokeColor(ink).strokeWidth(1.6),
            nowrapText(item[0]).fontSize(28),
            _
        ).center()).pivot(0, 0).shift(item[1], sfig.downSign * item[2]));
    });
    [[194, 4], [320, 123], [70, 123]].forEach(function (position) {
        parts.push(at(nowrapText('2 to 1').fontSize(21)
            .strokeColor(ink), position[0], position[1]));
    });
    parts.push(at(nowrapText('Arrow: majority winner to loser').fontSize(21), 48, 260));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// Same geometry and wording as m4t11PlatformDiagram; keep the two in sync.
// Drawing pattern adapted from lecture 9, without loading that presentation.
// The developer box groups collection, reward modeling, and model training.
// Dashed paths are between-release updates/data, not runtime retraining.
function m4t12PlatformDiagram() {
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

function m4t12DiagramAnchor(id) {
    add(slide('Social platform: control and feedback',
        parentCenter(m4t12PlatformDiagram().scale(0.94)),
        _
    ).id(id));
    prose(
        'This is the same hypothetical platform and diagram as Lecture 11. Development and deployment remain separate. Fixed model weights within a release do not prevent recommendation history, participation, or user preferences from changing.',
        _,
        'The diagram locates authority but does not settle who ought to exercise it. Designers choose objectives and release criteria; developers implement collection and aggregation. Paid raters, users, and creators need not be the same population, and other affected people may be absent.',
        _,
        'In this exercise the platform must choose one shared default. The three group rankings are stipulated summaries, not evidence that real groups are homogeneous or that paid labels represent them. Other safeguards and consultation procedures must be proposed, not assumed from the arrows.',
    );
}

add(titleSlide(ytable(
    nowrapText('Lecture 12: Pluralism, Disagreement,').fontSize(38).strokeColor('darkblue'),
    nowrapText('and Preference Aggregation').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m4t12Text(
        'CS120: Introduction to AI Safety - October 29, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture12'));
prose(
    'Individual judgements can be used to derive reward scores for evaluating AI outputs. Those judgements do not specify how different people should influence a shared outcome. Pluralism concerns accepting different perspectives within a decision, while social choice helps make the assumptions behind combining them explicit.',
);

// 2
add(slide('From agent policies to interaction loops',
    parentCenter(courseProgressionDiagram(4)),
    pause(),
    m4t12Card('Actions change the environment. Interactions also change users, participation, and future feedback.', 28),
    _));
prose(
    'Choosing actions over time changes future states and observations. With users in the loop, a deployed system also influences who participates, what content they encounter, and which feedback opportunities are available. Judgements collected after deployment therefore depend partly on the system that helped produce them.',
);

// 3
m4t12Roadmap(0);

// 4
add(slide('Elicitation is not aggregation',
    parentCenter(xtable(
        m4t12Panel('Elicitation', 'Clarify an individual judgement.', 390),
        m4t12Panel('Aggregation', 'Combine judgements for a shared outcome.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t12Card('Clearer individual judgements do not choose the collective rule.', 28),
    _));
prose(
    'Individual judgements specify a person\'s utility only under certain assumptions, and they do not specify how multiple judgements should be combined. People might disagree about an input, facts, or task interpretation. Reducing ambiguity before elicitation is distinct from deciding how those judgements influence a shared outcome.',
);

// 5
add(slide('Pluralism within one decision',
    m4t12Text('Should a university use facial recognition for building access?', 28),
    parentCenter(xtable(
        m4t12Panel('Students', 'Convenience and privacy', 260, 26),
        m4t12Panel('Security staff', 'Effectiveness of security', 260, 26),
        m4t12Panel('Affected groups', 'Accuracy and disparities', 260, 26),
        _
    ).center().xmargin(20)),
    pause(),
    m4t12Card('Different perspectives can matter within one shared decision.', 28),
    _));
prose(
    'Consider an assistant deciding whether a university should use facial recognition for building access. Stakeholders may emphasize convenience, privacy, effectiveness, accuracy, or disparities. Pluralism accepts different perspectives within what may ultimately be one decision: installing the system, finding alternatives, choosing a shared default, or reaching a compromise.',
);

// 6
add(slide('OpinionQA compares response distributions',
    m4t12Text('1,000+ Pew survey questions; 60 US demographic groups.', 29),
    parentCenter(xtable(
        m4t12Panel('Model responses', 'Distribution over survey answers', 390, 26),
        m4t12Panel('Human responses', 'Weighted distribution for a population', 390, 26),
        _
    ).center().xmargin(32)),
    pause(),
    m4t12Text('Representativeness: compare these response distributions.', 29),
    m4t12Cite('Santurkar et al., 2023', 'https://proceedings.mlr.press/v202/santurkar23a.html'),
    _));
prose(
    'OpinionQA repurposed public opinion surveys to study whose viewpoints language models reflect. It used over a thousand Pew American Trends Panel questions and comparisons with 60 US demographic groups. Representativeness was measured by comparing model response distributions with weighted human response distributions, rather than assuming that human feedback produces representative views.',
);

// 7
add(slide('Representation is a diagnostic, not a universal target',
    m4t12Text('In the studied LLM baselines:', 26),
    parentCenter(ytable(
        m4t12Text(bold('Representativeness:') + ' substantial gaps remained.', 28),
        m4t12Text(bold('Steerability:') + ' prompting produced modest improvements.', 28),
        m4t12Text(bold('Consistency:') + ' group resemblance varied across topics.', 28),
        _
    ).ymargin(18)),
    pause(),
    m4t12Card('Matching a US survey population does not settle whose views should guide an application.', 27),
    m4t12Cite('Santurkar et al., 2023', 'https://proceedings.mlr.press/v202/santurkar23a.html'),
    _));
prose(
    'The study found representativeness gaps across base and fine-tuned baselines. Steering produced modest gains without resolving the problems, and the groups a model resembled varied across topics. These discrepancies are diagnostics whose consequences depend on the application. Maximizing agreement with a dataset restricted to US demographic groups would not provide a universal alignment target.',
);

// 8
m4t12Roadmap(1);

// 9
add(slide('Consistent rankings can produce a majority cycle',
    m4t12Text('University poll: three options, equally weighted groups.', 27),
    parentCenter(xtable(
        ytable(
            nowrapText('$G_1: A\\succ B\\succ C$').fontSize(30),
            nowrapText('$G_2: B\\succ C\\succ A$').fontSize(30),
            nowrapText('$G_3: C\\succ A\\succ B$').fontSize(30),
            _
        ).ymargin(28),
        pause(),
        m4t12MajorityCycle(),
        _
    ).center().xmargin(65)),
    m4t12Text('Each group is transitive. The pairwise majority relation is not.', 28),
    _));
prose(
    'The university assistant polls three equally weighted groups about security options. Each ranking is transitive, but A beats B, B beats C, and C beats A by two votes to one. Soliciting community input has not produced a transitive collective ordering; the aggregation rule can determine the final decision.',
);

// 10
add(slide('One score cannot preserve the cycle',
    m4t12Text('Matching every majority direction would require:', 29),
    m4t12Math('$r_\\theta(A)>r_\\theta(B)>r_\\theta(C)>r_\\theta(A)$', 34),
    pause(),
    m4t12Card('A common scalar reward model must compromise across these comparisons.', 28),
    m4t12Text('Residual disagreement need not be annotation error.', 29),
    m4t12Cite('Conitzer et al., 2024', 'https://proceedings.mlr.press/v235/conitzer24a.html'),
    _));
prose(
    'A single scalar score cannot match all three strict majority directions. A Bradley-Terry model can compromise across the comparisons, but interpreting its fitted ordering as faithfully recovering collective preferences would be a validity threat. Inconsistency can reflect structured disagreement as well as measurement error; here that disagreement is the object of analysis.',
);

// 11
add(slide('Arrow rules out this combination',
    m4t12Text('Goal: a complete, transitive social ranking of at least three options.', 27),
    parentCenter(ytable(
        m4t12Text(bold('Unrestricted domain:') + ' any profile of complete, transitive rankings.', 25),
        m4t12Text(bold('Unanimity:') + ' unanimous strict preferences hold socially.', 25),
        m4t12Text(bold('IIA:') + ' a pair\'s social order depends only on individual orders of that pair.', 25),
        m4t12Text(bold('Non-dictatorship:') + ' no fixed individual\'s strict preferences always prevail.', 25),
        _
    ).ymargin(12)),
    pause(),
    m4t12Card('Arrow: no aggregation rule meets all these requirements.', 28),
    m4t12Cite('Conitzer et al., 2024', 'https://proceedings.mlr.press/v235/conitzer24a.html'),
    _));
prose(
    'Arrow\'s theorem rules out this combination of requirements for a complete, transitive social ranking. IIA means independence of irrelevant alternatives. To obtain the requested ranking, a requirement must change. The earlier majority cycle illustrates an aggregation problem but is not a proof of the theorem, which does not rule out collective decisions.',
);

// 12
add(slide('A common reward model already aggregates',
    parentCenter(m4t12Chain([
        'People\'s comparisons',
        'Shared reward model',
        'Policy optimization',
    ])),
    pause(),
    m4t12Card('Fitting one predictor is already an aggregation choice.', 29),
    m4t12Cite('Conitzer et al., 2024', 'https://proceedings.mlr.press/v235/conitzer24a.html'),
    _));
prose(
    'RLHF collects comparisons between model outputs, trains a shared reward model, and uses that model for policy optimization. Once comparisons come from multiple individuals, choices about aggregation are unavoidable. Even fitting a common predictor is a choice about how different judgements will influence the model\'s behavior.',
);

// 13
add(slide('Aggregate before or after modeling',
    parentCenter(ytable(
        m4t12Text(bold('Before fitting'), 25, 880),
        m4t12Chain(['Individual rankings', 'Aggregate rankings', 'Common predictor'], 235, 25),
        pause(),
        m4t12Text(bold('After fitting'), 25, 880),
        m4t12Chain(['Evaluator labels', 'Conditioned models', 'Aggregate ratings'], 235, 25),
        _
    ).ymargin(16)),
    m4t12Text('Jury Learning: specify whose predictions count, and in what proportion.', 27),
    parentCenter(xtable(
        cite('Conitzer et al., 2024', 'https://proceedings.mlr.press/v235/conitzer24a.html').scale(0.55),
        cite('Gordon et al., 2022').scale(0.55),
        _
    ).center().xmargin(20)),
    _));
prose(
    'Conitzer et al. contrast aggregating rankings before fitting a common predictor with fitting evaluator-conditioned models and then aggregating predicted ratings. Jury Learning is a supervised-learning example of post-fitting aggregation. It makes intended people and proportions explicit, without settling appropriate weights, a common scale, or the legitimacy of combining predicted ratings.',
);

// 14
add(slide('Principles guide critique and revision',
    m4t12Text('Constitutional AI starts with human-selected principles.', 29),
    parentCenter(m4t12Chain([
        'Generate response',
        'Critique using principles',
        'Revise response',
    ])),
    pause(),
    m4t12Card('Revised responses train the model by supervised fine-tuning.', 28),
    m4t12Cite('Bai et al., 2022', 'https://arxiv.org/abs/2212.08073'),
    _));
prose(
    'Constitutional AI uses human-selected principles to guide model feedback. A model generates an output, critiques it against those principles, and produces a refined response for supervised fine-tuning. Broad goals such as helpfulness and harmlessness still require interpretation when applied to particular outputs under realistic conditions.',
);

// 15
add(slide('AI feedback still reflects human choices',
    m4t12Text('Original Constitutional AI experiment:', 27),
    parentCenter(xtable(
        ytable(
            frameBox(m4t12Text('Human: helpfulness', 26, 270)).padding(12),
            frameBox(m4t12Text('AI: harmlessness', 26, 270)).padding(12),
            _
        ).ymargin(20),
        rightArrow(28).strokeWidth(2),
        frameBox(m4t12Text('Preference model', 27, 230)).padding(12),
        rightArrow(28).strokeWidth(2),
        frameBox(m4t12Text('RL', 29, 100)).padding(12),
        _
    ).center().xmargin(14)),
    pause(),
    m4t12Card('Who selects the principles, interprets them, and resolves conflicts?', 28),
    m4t12Cite('Bai et al., 2022', 'https://arxiv.org/abs/2212.08073'),
    _));
prose(
    'In the original experiment, human helpfulness feedback and AI harmlessness comparisons train a preference model for reinforcement learning. The normative decisions include who selects the principles and how adherence is determined. Principles can conflict, and abstract statements that are easier to express may be harder to apply under realistic conditions.',
);

// 16
m4t12Roadmap(2);

// 17
add(slide('Population share does not settle influence',
    m4t12Text('Return to the university recognition proposal.', 28),
    parentCenter(xtable(
        m4t12Panel('Group G1', 'Underrepresented relative to its campus population share.', 390, 26),
        m4t12Panel('Group G3', 'Recognition error rate: 5x that of other groups.', 390, 26),
        _
    ).center().xmargin(32)),
    pause(),
    m4t12Card('Correcting a sampling gap is not deciding how unequal burdens should count.', 28),
    _));
prose(
    'Recruitment and nonresponse have left G1 underrepresented relative to its campus population share. G3 faces a recognition error rate five times that of other groups. The implementation burden is unequal, so population share alone does not settle appropriate influence. Sampling correction and allocating influence are distinct decisions.',
);

// 18
add(slide('Deployment changes the next feedback',
    parentCenter(m4t12PlatformDiagram().scale(0.83)),
    pause(),
    m4t12Text('Exposure and participation shape the data for later releases.', 28),
    _).id('lecture12-system'));
prose(
    'Even a sufficiently representative feedback process need not maintain that status after deployment. The platform influences who participates, what content they encounter, and which feedback opportunities are available. Model weights remain fixed between releases, but exposure and participation can change the data used to train the next model.',
);

// 19
add(slide('Personalization can narrow exposure',
    parentCenter(m4t12Chain([
        'Condition on a person',
        'Select alternatives',
        'Change exposure',
    ])),
    pause(),
    m4t12Text('Better fit can reduce contact with competing views.', 29),
    m4t12Text('Reports may become strategic when they affect future choices.', 28),
    _));
prose(
    'Jury Learning can support personalized evaluation and help people have their preferences represented. Its deployment can also change which alternatives they encounter. Such systems may reduce exposure to competing views and incentivize strategic preference expression. Representing a person\'s preferences therefore does not leave the surrounding interaction process unchanged.',
);

// 20
add(slide('A higher average can hide a narrower population',
    m4t12Text('Module 2 callback: hypothetical satisfaction reports.', 26),
    parentCenter(table(
        [m4t12Text(bold('Group'), 24, 150),
            m4t12Text(bold('Satisfied before'), 24, 175),
            m4t12Text(bold('Satisfied after'), 24, 175),
            m4t12Text(bold('Responses: before / after'), 24, 270)],
        [m4t12Text('X', 26, 150),
            m4t12Text('90%', 27, 175), m4t12Text('80%', 27, 175),
            m4t12Text('100 / 100', 27, 270)],
        [m4t12Text('Y', 26, 150),
            m4t12Text('30%', 27, 175), m4t12Text('20%', 27, 175),
            m4t12Text('100 / 25', 27, 270)],
        pause(),
        [m4t12Text(bold('Aggregate'), 24, 150),
            m4t12Text(bold('60%'), 27, 175),
            m4t12Text(bold('68%'), 27, 175),
            m4t12Text('200 / 125', 27, 270)],
        _
    ).margin(18, 12).xjustify('l')),
    m4t12Text('At the original 50/50 mix: 0.5 x 80% + 0.5 x 20% = 50%.', 26),
    m4t12Card('Simpson\'s paradox: the mixture reverses the comparison.', 27),
    _));
prose(
    'These hypothetical surveys use the same satisfaction question, with one response per respondent per round. X and Y are illustrative groups, not the three discussion groups. X contributes 100 responses in each round; Y contributes 100 before and 25 after. The fraction satisfied falls in both groups.',
    _,
    'Before, 90 plus 30 satisfied respondents out of 200 gives 60%. After, 80 plus 5 out of 125 gives 68%. Y now supplies only 20% of responses instead of 50%. Holding the original equal weights fixed gives 50% satisfaction after, below the original 60%. This is the changing-mixture reversal from Module 2, now producing apparent improvement rather than apparent deterioration.',
    _,
    'Fewer survey responses do not establish platform departure or why people stopped responding. These are respondent-group rates, not evidence of within-person changes or population satisfaction. Fixed weighting diagnoses this composition effect but cannot recover absent users\' views or settle whose interests should count. Recheck group outcomes and participation, not just the average.',
);

// 21-26: discussion diagram, setting, and questions.
m4t12DiagramAnchor('discussion12-system');

// BEGIN DISCUSSION: only displayed literals below are extracted into tickets.
add(slide('Discussion: One platform, different preferences',
    m4t12Card('Choose one shared default for everyone: A = familiar-interest feed; B = diverse-view feed; C = chronological feed. Give the three groups equal weight.', 27),
    parentCenter(m4t12Text('G1: A over B over C; G2: B over C over A; G3: C over A over B.', 32, 600, '; ')),
    _).id('discussion12-setting'));
prose(
    'In these rankings, "over" means strictly preferred to, with the most preferred feed first. Each group has a transitive ranking; the comparisons do not specify numerical utility differences.',
    _,
    'Equal group weights are the initial rule for Q1, not a claim of equal population sizes or an endorsed allocation of influence. Q2 asks whether and why to revise that rule. Group-conditioned predictions in Q3 still inform one shared default.',
);

add(slide('1. Can one score preserve the disagreement?',
    m4t12Card('Find the majority winner for A versus B, B versus C, and C versus A. Can one scalar score per feed match every majority direction? What would fitting a common reward model conceal?', 28),
    m4t12Text('Distinguish structured disagreement from inconsistent individual rankings.', 27),
    _).id('discussion12-cycle'));
prose(
    'The pairwise majorities are A over B, B over C, and C over A, each two to one. No scalar ordering preserves all three strict directions. This does not imply that an individual has inconsistent rankings.',
    _,
    'A fitted Bradley-Terry model can approximate or compromise across the comparisons; it cannot exactly represent this cycle with one score per option. Residuals need not be mere annotation error.',
    _,
    'A majority cycle is not by itself a proof of Arrow\'s theorem, nor does Arrow rule out collective decisions. Its impossibility result concerns a complete transitive social ranking with the specified domain and aggregation requirements.',
);

add(slide('2. Representation is not just head count',
    m4t12Card('G1 is most of the user population but rarely answers polls. G3 is small and experiences much more harassment under A. What evidence is missing? Propose and justify who should influence the shared default, and with what weight.', 28),
    m4t12Text('Separate correcting a sampling gap from deciding whose interests count.', 27),
    _).id('discussion12-representation'));
prose(
    'These added facts do not prescribe a uniquely correct weighting. Distinguish the intended population, the participating sample, the distribution of burdens, and the normative allocation of influence.',
    _,
    'Ask what recruitment and nonresponse evidence is needed, how harassment is measured, and whose interests the three groups omit. Population-proportional sampling is not automatically an adequate rule for distributing risk.',
    _,
    'As with OpinionQA, representativeness is a diagnostic relative to a specified population and measure, not a universal alignment target.',
);

add(slide('3. Who chooses the aggregation rule?',
    m4t12Card('Choose a design: group-conditioned reward predictions combined with explicit weights, or AI feedback guided by human-selected principles. Who chooses the weights or principles, and how is a conflict over the shared default resolved?', 28),
    m4t12Text('Name one normative choice your design makes explicit and one disagreement it could hide.', 27),
    _).id('discussion12-aggregation'));
prose(
    'The two design sketches are not exhaustive or mutually exclusive. Group-conditioned modeling makes post-fitting aggregation possible; it does not settle the weights, common scale, or legitimacy of combining predicted ratings.',
    _,
    'A constitution does not eliminate human choices: who writes principles, who interprets them, and how conflicts are resolved all matter. AI-generated comparisons inherit those choices rather than becoming independent votes.',
    _,
    'Neither approach automatically preserves every view or establishes an acceptable shared default. Keep the representation of disagreement distinct from the procedure that makes a decision.',
);

add(slide('4. Whose satisfaction improved?',
    m4t12Card('After launch, average satisfaction rises while G3 participation falls. Give two explanations consistent with that pattern. Propose a monitoring or intervention rule, its responsible actor, and evidence that would trigger action.', 28),
    m4t12Text('Why would a rise in the measured average not establish representative improvement?', 27),
    _).id('discussion12-feedback-loop'));
prose(
    'A composition shift can raise the average without within-group improvement; genuine improvement for some users can coexist with departure or exclusion of others. The pattern alone does not identify why G3 participation fell.',
    _,
    'Consider group-specific outcomes, participation denominators, feedback from people who leave, and exposure to alternatives. A monitoring rule needs an actor and an action path; a dashboard alone is not enforcement.',
    _,
    'Connect deployment choices to exposure, participation, collected labels, and the next release. A passing trigger check remains bounded evidence, not proof of ongoing representativeness.',
);
// END DISCUSSION

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 12: Pluralism, Disagreement, and Preference Aggregation';