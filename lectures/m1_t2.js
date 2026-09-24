G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 1, meeting 2. Course-note source: notes/m1_t2.md.
// Diagram helpers are local to this deck; shared helpers remain in utils.js.

function m1t2Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 940).autowrap(true);
}

function m1t2Card(message, size) {
    return parentCenter(frameBox(m1t2Text(message, size || 30, 840)).padding(18));
}

function m1t2Cell(message, width, size) {
    return m1t2Text(message, size || 24, width);
}

function m1t2Panel(heading, message, width) {
    return frameBox(ytable(
        m1t2Cell(bold(heading), width, 26),
        m1t2Cell(message, width, 26),
    ).xjustify('l').ymargin(16)).padding(16);
}

function m1t2FlowNode(lines, active, width) {
    var contents = ytable.apply(null, lines.map(function (label) {
        return nowrapText(label).fontSize(18).strokeColor(active ? 'black' : '#666666');
    })).center().ymargin(4);
    return frame(contents).bg.width(width || 122).height(78)
        .fillColor(active ? '#F3E8B6' : '#F2F2F2')
        .strokeColor(active ? '#555555' : '#AAAAAA').strokeWidth(1).end;
}

// A horizontal production/use flow, with a separate inference input and
// a return path. The same components occupy the same positions in each view.
// "deployment" includes relevant data collection and retraining in this example.
function m1t2FilterFlow(scope) {
    var ranges = { model: [2, 2], pipeline: [0, 2], deployment: [0, 5] };
    var selected = ranges[scope];
    var labels = [
        ['Sampling,', 'annotation'],
        ['Model choice', 'and training'],
        ['Toxicity', 'classifier'],
        ['Decision', 'rule'],
        ['Moderation', 'workflow'],
        ['Users,', 'appeals'],
    ];
    var nodes = labels.map(function (lines, k) {
        return m1t2FlowNode(lines, !selected || (k >= selected[0] && k <= selected[1]), 120);
    });
    var pieces = [];
    var links = [];
    // Captioned edges need room for larger type and the nearby boundary.
    var linkWidths = [30, 38, 52, 46, 30];
    nodes.forEach(function (block, k) {
        if (k > 0) {
            var link = rightArrow(linkWidths[k - 1]).strokeWidth(2).strokeColor('#555555');
            links.push(link);
            pieces.push(link);
        }
        pieces.push(block);
    });
    var row = xtable.apply(null, pieces).center().xmargin(5);
    var returnY = nodes[5].bottom().down(48);
    var returning = arrow(
        [nodes[5].xmiddle(), returnY],
        [nodes[0].xmiddle(), returnY]
    ).strokeWidth(2).strokeColor('#666666');
    var feedbackLabel = moveBottomOf(
        nowrapText('Records and user responses can inform future data').fontSize(18),
        returning, 10
    );

    // Keep every view aligned, including space for the full feedback caption.
    // Convert coordinate differences to positive heights in both backends.
    var fullHeight = feedbackLabel.bottom().sub(nodes[0].top()).mul(sfig.downSign);
    var reserve = rect(row.realWidth().add(24), fullHeight.add(24))
        .shift(nodes[0].left().sub(12), nodes[0].top().up(12))
        .fillOpacity(0).strokeColor('white').strokeWidth(2);
    var boundary = nil();
    if (selected) {
        var first = nodes[selected[0]], last = nodes[selected[1]];
        var boundaryBottom = scope === 'deployment' ? feedbackLabel.bottom() : first.bottom();
        var boundaryHeight = boundaryBottom.sub(first.top()).mul(sfig.downSign).add(10);
        boundary = rect(last.right().sub(first.left()).add(10), boundaryHeight)
            .shift(first.left().sub(5), first.top().up(5))
            .fillOpacity(0).strokeColor('darkblue').strokeWidth(3);
    }

    return overlay(
        row,
        moveTopOf(nowrapText('Comments at inference').fontSize(18), nodes[2], 40),
        arrow(
            [nodes[2].xmiddle(), nodes[2].top().up(32)],
            [nodes[2].xmiddle(), nodes[2].top()]
        ).strokeWidth(2),
        moveTopOf(nowrapText('fits').fontSize(18), links[1], 7),
        moveTopOf(nowrapText('score').fontSize(18), links[2], 7),
        moveTopOf(nowrapText('action').fontSize(18), links[3], 7),
        line(
            [nodes[5].xmiddle(), nodes[5].bottom()],
            [nodes[5].xmiddle(), returnY]
        ).strokeWidth(2).strokeColor('#666666'),
        returning,
        arrow(
            [nodes[0].xmiddle(), returnY],
            [nodes[0].xmiddle(), nodes[0].bottom()]
        ).strokeWidth(2).strokeColor('#666666'),
        feedbackLabel,
        reserve,
        boundary,
    ).recMouseShowHide(false);
}

function m1t2BoundaryLegend() {
    return parentCenter(nowrapText(
        'Figure: object of assurance; gray components are environment not irrelevant.'
    ).fontSize(18));
}

function m1t2FeedbackFlow() {
    var labels = [
        ['Moderation'],
        ['User', 'behavior'],
        ['Future', 'data'],
        ['Retraining'],
        ['Updated', 'model'],
    ];
    var nodes = labels.map(function (lines) { return m1t2FlowNode(lines, true, 145); });
    var pieces = [];
    nodes.forEach(function (block, k) {
        if (k > 0) pieces.push(rightArrow(30).strokeWidth(2));
        pieces.push(block);
    });
    var row = xtable.apply(null, pieces).center().xmargin(5);
    var returnY = nodes[4].bottom().down(35);
    var returning = arrow(
        [nodes[4].xmiddle(), returnY],
        [nodes[0].xmiddle(), returnY]
    ).strokeWidth(2);
    return overlay(
        row,
        line([nodes[4].xmiddle(), nodes[4].bottom()],
            [nodes[4].xmiddle(), returnY]).strokeWidth(2),
        returning,
        arrow([nodes[0].xmiddle(), returnY],
            [nodes[0].xmiddle(), nodes[0].bottom()]).strokeWidth(2),
    ).recMouseShowHide(false);
}

add(titleSlide('Lecture 2: What Is the Object of Assurance?',
    nil(),
    parentCenter(m1t2Text(
        'CS120: Introduction to AI Safety - September 24, 2026, Zachary Robertson',
        24, 870
    )),
).titleScale(1.3));
prose(
    'Safety claims require specifying the intended system under consideration. A claim about a trained model differs from a claim about its development pipeline, deployment, or institution.',
);

add(slide('The classifier performs well. Is AI safe?',
    m1t2Text(bold('Safety claims require specifying the intended system under consideration.')),
    parentCenter(ytable(
        m1t2Text('The toxicity classifier performs well on held-out labels.', 28, 880),
        m1t2Text('Account-suspension appeals have increased.', 28, 880),
    ).xjustify('l').ymargin(16)),
    pause(),
    m1t2Card('What does the evaluation establish - and about what?'),
    _));
prose(
    'It is tempting to ask, "Is AI safe?" Yet AI at a system level is a moving target in terms of deployment, capabilities, and operating conditions. The content-filter example makes the ambiguity concrete: a classifier evaluation and an increase in appeals concern different aspects of the platform.',
    _,
    'More appeals do not, by themselves, establish more wrongful suspensions. Good prediction of held-out toxicity labels does not, by itself, establish that the moderation system avoids harm. Neither observation explains the relationship between the two.',
);

add(slide('Object, boundary, and unit of analysis',
    ytable(
        m1t2Text(stmt('Object of assurance',
            'the bounded artifact, system, or institution about which a claim is actually made'), 27),
        m1t2Text(stmt('System boundary',
            'specifies the variables intended to be modeled in a system'), 27),
        pause(),
        m1t2Text(stmt('Unit of analysis',
            'provides a representation for generating well-specified claims'), 27),
    ).xjustify('l').ymargin(22),
    _));
prose(
    'The object of assurance is distinct from the unit of analysis. A deployed moderation system is an object; model behavior and interaction process are perspectives through which it can be studied. The choice of perspective does not uniquely determine the object or its boundary.',
    _,
    'A system boundary specifies which variables and interactions are included in the analysis and which are treated through assumptions about the environment.',
);

add(slide('Choose a boundary for the claim',
    m1t2Card(bold('Choose a system boundary narrow enough to analyze, but broad enough to contain the variables and interactions relevant to the claim.')),
    pause(),
    parentCenter(m1t2Text(
        'System boundaries are specifications - not inherent factorizations of the world.',
        28, 880
    )),
    _));
prose(
    'A system boundary helps determine which hazards are plainly visible, which aspects are treated as endogenous, and ultimately which claims are falsifiable. Endogenous aspects are represented as part of the system rather than supplied as fixed environmental assumptions.',
    _,
    'Treating a process as environment does not make it irrelevant. Evidence about a fixed model can come from an external evaluation process, but the assumptions about that process must still support the intended claim.',
);

add(slide('Running example: a content-filter system',
    parentCenter(m1t2FilterFlow()),
    m1t2Text(stmt('Potential hazard',
        'a spurious correlation between dialect and toxicity'), 25),
    pause(),
    parentCenter(m1t2Text(bold('However, "where" is the relevant safety problem located?'), 28, 880)),
    _));
prose(
    'A platform trains a classifier to identify toxic comments. Human annotators provide toxicity labels and the resulting data is used to train a classifier model. At inference time, a decision rule is used to choose which comments are shown and which are filtered for moderation. Users can appeal moderation decisions, and the platform can retrain or adjust the model periodically.',
    _,
    'A spurious dialect correlation can produce a high false-positive rate for comments in that dialect; a potential harm is systematic filtering of non-toxic comments written by its speakers.',
);

add(slide('Models as objects of assurance',
    parentCenter(m1t2FilterFlow('model')),
    m1t2BoundaryLegend(),
    parentCenter('$f: \\mathcal{X} \\to \\mathcal{Y}$'),
    parentCenter(m1t2Text(
        'A comment $x \\in \\mathcal{X}$ is mapped to a toxicity score $y \\in \\mathcal{Y}$.',
        25, 880
    )),
    _));
prose(
    'The most tightly scoped object of assurance considered here is the trained reflex model itself. It is represented as a function mapping a comment to a toxicity score. The annotation process, platform and moderation policy, and users are treated as part of the environment.',
    _,
    'The boundary concerns the scoring function, not the process that produced it or the consequential decisions made using its outputs. Useful input-output comparisons remain possible under explicit evaluation assumptions.',
);

add(slide('What useful assurances remain?',
    parentCenter(table(
        [m1t2Cell(bold('Question'), 365), m1t2Cell(bold('Required reference'), 515)],
        [m1t2Cell('How do false-positive rates compare across linguistic groups?', 365),
        m1t2Cell('Specified labels, groups, samples, and a score threshold', 515)],
        [m1t2Cell('Is the score calibrated?', 365),
        m1t2Cell('A specified outcome and evaluation distribution', 515)],
        [m1t2Cell('Is there evidence of overfitting?', 365),
        m1t2Cell('Information relating fitting performance to held-out performance', 515)],
    ).margin(24, 16).xjustify('l')),
    pause(),
    parentCenter(m1t2Text(bold('What useful assurances remain within this boundary?'), 26, 880)),
    _));
prose(
    'A model-level evaluation can support meaningful claims about error rates or calibration. Those claims depend on the evaluated distribution, labels, metric, and procedure. For a scoring model, a false-positive rate also requires specifying a threshold or prediction rule; that evaluation convention need not be the platform\'s suspension rule.',
    _,
    'False-positive rates and calibration can be evaluated without access to training data. Claims about overfitting require additional information relating the fitting process or training performance to held-out performance. None of these measurements alone establishes the quality of a moderation or appeals process.',
);

add(slide('Access is not the same as scope',
    parentCenter(xtable(
        m1t2Panel('Black-box access', 'Inputs and outputs', 390),
        m1t2Panel('White-box access', 'Parameters, architecture, or internal activations', 390),
    ).center().xmargin(30)),
    pause(),
    m1t2Card('Either way, such an object boundary scopes assurance claims.', 28),
    _));
prose(
    'The function can be considered through a black-box interface, or through white-box access to parameters, architecture, and internal activations. Either approach can concern the same trained model.',
    _,
    'Access changes the evidence and analyses available. It does not automatically change the object of assurance. Inspecting model weights does not make the annotation process, moderation policy, or institutional response part of the object being assured.',
);

add(slide('Development pipelines as objects of assurance',
    parentCenter(m1t2FilterFlow('pipeline')),
    m1t2BoundaryLegend(),
    m1t2Text(
        'Include data collection, annotation, model and objective selection, and training.',
        26
    ),
    pause(),
    m1t2Text(bold('An observed dialect correlation may originate from several places.'), 26),
    _));
prose(
    'The object of assurance can be expanded to include activities such as data collection, annotation, or model and objective selection. Crowd workers may systematically assign higher toxicity scores to particular dialects. The sampling procedure may underrepresent or misrepresent certain associations. The training process could prioritize aggregate metrics over certain subgroups.',
    _,
    'An observed model disparity does not, by itself, identify which mechanism produced it. Including development in the object makes these candidate explanations available for investigation; distinguishing them still requires evidence.',
);

add(slide('Generalization is not deployment assurance',
    parentCenter(xtable(
        frameBox(ytable(
            nowrapText('Performance').fontSize(27),
            nowrapText('during training').fontSize(27),
        ).center().ymargin(4)).bg.width(340).end,
        nowrapText('compared with').fontSize(22),
        frameBox(ytable(
            nowrapText('Performance').fontSize(27),
            nowrapText('on held-out data').fontSize(27),
        ).center().ymargin(4)).bg.width(340).end,
    ).center().xmargin(24)),
    pause(),
    m1t2Text(bold('Generalization does not yet imply good performance under realistic deployment conditions.'), 29),
    m1t2Text(
        'Assurance of the model, the process that produced it, and the performance in the intended setting remain distinct problems.',
        26
    ),
    _));
prose(
    'The difference between training and held-out performance is an empirical estimate of a generalization gap, subject to the sampling and evaluation procedure. Formal claims require probabilistic or statistical learning assumptions. Generalization can be studied for a fixed model.',
    _,
    'A classifier can predict held-out labels well while those labels reproduce annotation biases. A small generalization gap also does not guarantee low error. Even good predictive performance leaves questions about subgroup error burdens, moderation rules, and deployment conditions unresolved.',
);

add(slide('Deployed systems as objects of assurance',
    parentCenter(m1t2FilterFlow('deployment')),
    parentCenter(nowrapText(
        'Here the boundary includes relevant user responses and retraining.'
    ).fontSize(18)),
    m1t2Text(
        'The content filter is no longer an isolated scoring function or a well-fit classifier.',
        26
    ),
    pause(),
    m1t2Text(bold('Now its predictions are used for decision-making.'), 28),
    _));
prose(
    'The boundary can be expanded to include the system in which the model is actually used. Predictions feed into decision rules for moderation and an appeal process. Relevant user responses and later data collection or retraining are included in this example because they can affect the behavior being investigated.',
    _,
    'The additional interactions make new hazards visible to the analysis. Assurance now concerns more than the accuracy of a score: it concerns how technical components and organizational procedures produce consequential decisions.',
);

add(slide('Same classifier, different consequences',
    parentCenter(frameBox(nowrapText('The same toxicity classifier').fontSize(28))),
    parentCenter(downArrow(30).strokeWidth(3)),
    parentCenter(xtable(
        m1t2Panel('Deployment A', 'Flag a comment for human review', 380),
        m1t2Panel('Deployment B', 'Automatically suspend an account', 380),
    ).center().xmargin(30)),
    pause(),
    m1t2Text(
        'Whether a classifier\'s false-positive rate causes harm depends on the system the model is embedded within.',
        27
    ),
    _));
prose(
    'These two hypothetical deployments hold the classifier fixed while changing what is done with its predictions. A false positive may create a review burden in one setting and immediately suspend an account in another. Human review can also fail or impose harmful delays; neither policy is safe simply from its description.',
    _,
    'The relevant operating conditions include the consequences of suspension, reversibility, review quality, appeal accessibility, and time to correction. Evidence about the shared classifier does not establish that either deployed process controls these risks.',
);

add(slide('Deployment creates feedback',
    parentCenter(m1t2FeedbackFlow()),
    m1t2Text(stmt('Sociotechnical system',
        'technical components interacting with people, social context, and organizational procedures'), 26),
    pause(),
    m1t2Text(
        'These interactions often vanish when the technical artifact is abstracted from its original context.',
        26
    ),
    parentCenter(cite('Selbst et al., 2019', 'https://dl.acm.org/doi/10.1145/3287560.3287598').scale(0.65)),
    _));
prose(
    'Users may change their engagement, rephrase comments, or leave the platform in response to moderation. Those responses can change future inputs and the data used for retraining. The deployment context contains feedback loops that lie outside the model or learning boundary.',
    _,
    'This is a central concern of Fairness and Abstraction in Sociotechnical Systems. Selbst et al. argue that properties attributed to technical systems can depend on the social context in which the system is embedded. Broadening the analysis makes relevant interactions visible; drawing a boundary does not itself create them.',
);

add(slide('The role of institutions',
    m1t2Text(bold('How are safety judgments produced and legitimized?'), 30),
    ytable(
        m1t2Text('Who chooses the evaluation criteria?', 28),
        m1t2Text('Are incidents documented, and is the organization accountable for responding?', 28),
        m1t2Text('Who has the authority to pause or remediate a deployment?', 28),
    ).xjustify('l').ymargin(20),
    _));
prose(
    'Institutions are organizations and processes that specify, develop, deploy, evaluate, or regulate other organizations or processes. They concern the process by which safety judgements are produced and legitimized.',
    _,
    'A platform may report accuracy using criteria it selects. An evaluator or platform may have incentives that shape what is measured, disclosed, or acted on. A claim that an institution reliably detects and responds to safety-critical hazards requires evidence about those processes, not just about the model under evaluation.',
);

add(slide('Broader is not automatically better',
    m1t2Text(
        'Just because institutions provide coverage of scope does not mean they should always be included in the system boundary.',
        30
    ),
    pause(),
    m1t2Card(bold('Claims about an institution cannot be justified solely based on technical artifacts it oversees.'), 29),
    _));
prose(
    'The boundary should be chosen intentionally. A narrowly scoped model-performance claim need not encompass every organizational process. Including more processes can make the analysis less tractable and creates additional evidence obligations.',
    _,
    'Conversely, model accuracy cannot establish that an institution documents incidents, resolves conflicts of interest, or responds effectively. There is no universally correct boundary, but a boundary can be inadequate for a particular claim.',
);

add(slide('Boundary misspecification',
    parentCenter(ytable(
        frameBox(m1t2Cell('The classifier predicts held-out toxicity labels well.', 800, 28)),
        redbold('Does not, by itself, establish'),
        frameBox(m1t2Cell('The moderation system is safe.', 800, 28)),
    ).center().ymargin(18)),
    pause(),
    m1t2Text(bold('Evidence concerns one object of assurance while the claim is about another.'), 28),
    _));
prose(
    'Model-level evaluation outcomes are sometimes used to justify qualities of development or deployment. Evidence can concern one object of assurance while the claim is about another. Abstraction can erase interactions responsible for the claim under investigation.',
    _,
    'One repair is to narrow the conclusion to what the evidence supports. Another is to investigate the additional mechanisms needed for the broader claim. Expanding the boundary without obtaining relevant evidence is not, by itself, a repair.',
);

add(slide('Two readings, complementary questions',
    parentCenter(xtable(
        ytable(
            m1t2Panel('Concrete Problems in AI Safety',
                'What concrete safety problem can arise in learning or acting?', 395),
            cite('Amodei et al., 2016', 'https://arxiv.org/abs/1606.06565').scale(0.65),
        ).center().ymargin(12),
        ytable(
            m1t2Panel('Fairness and Abstraction in Sociotechnical Systems',
                'What relevant interactions vanish in the abstraction?', 395),
            cite('Selbst et al., 2019', 'https://dl.acm.org/doi/10.1145/3287560.3287598').scale(0.65),
        ).center().ymargin(12),
    ).center().xmargin(26)),
    pause(),
    m1t2Text(
        'What must be included - or explicitly assumed - to investigate the intended claim?',
        28
    ),
    _));
prose(
    'Concrete Problems in AI Safety examines problems such as negative side effects, reward hacking, scalable supervision, safe exploration, and robustness to distribution shift. Its examples motivate questions about objectives, feedback, and environments.',
    _,
    'Fairness and Abstraction in Sociotechnical Systems examines how abstractions can omit relationships needed to understand fairness. These are complementary questions, not a division between exclusively technical and exclusively social objects. Both can be applied to the same system.',
    _,
    'The connection need not be a rejection of technical mitigation. A robot might avoid physical damage while changing workplace responsibilities. Adapting to new inputs need not establish that a task remains appropriate in a new social setting. Reward hacking concerns exploiting a reward signal at the expense of the intended goal; disagreement over what the goal should be is a related but distinct problem.',
);

add(slide('Match the object, claim, and evidence',
    parentCenter(table(
        [m1t2Cell(bold('Object of assurance'), 270), m1t2Cell(bold('Focus in the content-filter example'), 610)],
        [m1t2Cell('Trained model', 270),
        m1t2Cell('Scoring behavior under specified evaluation conditions', 610)],
        [m1t2Cell('Development pipeline', 270),
        m1t2Cell('Sampling, annotation, objectives, and training', 610)],
        [m1t2Cell('Deployed system', 270),
        m1t2Cell('Moderation decisions, consequences, appeals, and feedback', 610)],
        [m1t2Cell('Institution', 270),
        m1t2Cell('Evaluation criteria, accountability, and authority to intervene', 610)],
    ).margin(24, 14).xjustify('l')),
    pause(),
    m1t2Text(
        'What exactly are we claiming about it, and what evidence would justify that claim?',
        27
    ),
    _));
prose(
    'The recurring principle is to choose a system boundary narrow enough to analyze, but broad enough to contain the variables and interactions relevant to the intended claim. Evidence about one object does not automatically justify a claim about another.',
    _,
    'The objects considered here are choices for analysis, not a mandatory sequence of ever-larger boundaries. Once the object and boundary are fixed, the next question becomes more precise: what exactly are we claiming about it, and what evidence would justify that claim?',
);

add(slide('Discussion: connect, apply, revise',
    m1t2Text('Start from your reading response; test and refine the connection with classmates.', 27),
    ytable(
        m1t2Text(stmt('Questions 1-2: connect the readings',
            'Use a specific idea or example from each paper to explain how an abstraction trap complicates, challenges, or extends the safety problem.'), 26),
        m1t2Text(stmt('Questions 3-4: apply the comparison',
            'Return to the content filter: choose an object and boundary, then identify evidence and its limit.'), 26),
        m1t2Text(stmt('Question 5: revise individually',
            'Reconsider your boundary, make an assumption explicit, or narrow your conclusion.'), 26),
    ).xjustify('l').ymargin(18),
    parentCenter(m1t2Text(
        'Short answers on the ticket; this is separate from the pre-class reading response.',
        22, 880
    )),
    _));
prose(
    'The readings can be connected by examining an assumption on which a concrete safety problem depends. An abstraction trap can reveal a missing relationship, a limit of a proposed mitigation, or a reason to reconsider the task.',
);

add(slide('Discussion: a concrete safety problem',
    parentCenter(cite('Amodei et al., 2016', 'https://arxiv.org/abs/1606.06565').scale(0.7)),
    m1t2Card('Choose one problem discussed in the paper. What system is being considered, and what could go wrong?', 29),
    m1t2Text(
        'Which assumptions about the objective or environment matter to that problem?',
        28
    ),
    parentCenter(m1t2Text('Ground your interpretation in an example or passage from the paper.', 22, 880)),
    _));
prose(
    'A concrete safety problem is posed with respect to an objective, an environment, and a system that learns or acts.',
    _,
    'Examples from different parts of the paper may require different objects of assurance.',
);

add(slide('Discussion: an abstraction trap',
    parentCenter(cite('Selbst et al., 2019', 'https://dl.acm.org/doi/10.1145/3287560.3287598').scale(0.7)),
    m1t2Card('Choose one abstraction trap. In an example from the paper, what relevant relationship is omitted or misrepresented?', 29),
    m1t2Text(
        'Would widening the system boundary address the problem, or would the problem definition itself need to change?',
        28
    ),
    parentCenter(m1t2Text('Use the paper\'s example before comparing it with another system.', 22, 880)),
    _));
prose(
    'Abstraction is necessary for analysis, but it can omit relationships on which the intended claim depends.',
    _,
    'Including more variables is not always sufficient. The objective, meaning of the measured property, or proposed intervention may itself need reconsideration.',
);

add(slide('Discussion: return to the content filter',
    m1t2Card(
        'A platform uses a toxicity classifier trained on crowd-sourced labels to trigger automatic account suspensions. Account-suspension appeals have increased. The classifier performs well on held-out toxicity labels.',
        29
    ),
    parentCenter(m1t2Text(bold('Distinguish observations from assumptions.'), 28, 880)),
    _));
prose(
    'The case reports an increase in appeals, not an established increase in wrongful suspensions. Changes in the number of suspensions, access to appeals, user behavior, or other operating conditions could matter.',
    _,
    'Held-out performance concerns prediction of evaluation labels under measured conditions. The case does not specify the metric, evaluation sample, suspension rule, or appeal procedure. These omissions leave room for different, well-scoped investigations.',
);

add(slide('Choose an object and boundary',
    m1t2Card('Choose one question you would investigate about the increase in appeals.', 30),
    m1t2Text(
        'What is the object of your investigation? What belongs inside the boundary, and what remains an assumption about the environment?',
        29
    ),
    parentCenter(m1t2Text('Choose a question narrow enough to investigate.', 22, 880)),
    _));
prose(
    'Different questions can reasonably target different objects of assurance. The criterion is whether the boundary includes the mechanisms needed for the question while keeping environmental assumptions explicit.',
    _,
    'A proposed investigation need not establish that the entire platform is safe. Its conclusion should remain proportionate to its object and evidence.',
);

add(slide('Identify evidence - and its limit',
    m1t2Card('What observation would help answer your question? What would it still leave unresolved?', 30),
    m1t2Text(
        'Identify one assumption or omitted relationship that either paper would prompt you to examine.',
        29
    ),
    parentCenter(m1t2Text('Separate a useful measurement from the broader claim it might be used to support.', 22, 880)),
    _));
prose(
    'An observation can be informative without settling a broader assurance claim. Evidence about classifier errors differs from evidence about suspension rules, appeal accessibility, or institutional responses.',
);

add(slide('Revise the boundary or narrow the claim',
    m1t2Card('After discussion, would you change your boundary, make an assumption explicit, or narrow your intended conclusion? Explain why.', 30),
    parentCenter(m1t2Text('Record your own final response. A justified clarification is sufficient.', 24, 880)),
    _));
prose(
    'Narrowing an unsupported conclusion or making a necessary assumption explicit can improve the investigation.',
    _,
    'A boundary is useful because it helps make the claim precise, not because drawing it supplies assurance.',
);

add(slide('Next meeting: what counts as an assurance claim?',
    m1t2Card(bold('Specifying the object makes the question precise. It does not yet justify the answer.'), 30),
    m1t2Text(stmt('Meeting 3',
        'system boundaries, evidence, uncertainty, and systematic hazard analysis'), 28),
    parentCenter(m1t2Text('Course website and Ed: readings and response instructions', 22, 880)),
    _));
prose(
    'The object of assurance and its boundary determine what a claim is about. They do not establish that the claim is true. An evaluation is likewise an observation, not automatically an assurance argument.',
    _,
    'Hazard-analysis methods can help identify harm scenarios and safety constraints. Evidence is still required to show that those constraints work under the intended operating conditions.',
);