G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 2, meeting 4: learning, generalization, and underspecification.
// Canonical note: notes/m2_t4.md.
// Printed questions: operations/2026-10-01-discussion.md.
// Additional discussion framing follows Zach's September 28 instructions.
// Ticket extraction: worksheets/configs/m2_t4.json.
// Retain the printed case/questions; the additional scope slide is lecture-only.
// Build and review locally before any publication.

function m2t4Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m2t4Card(message, size) {
    return parentCenter(frameBox(m2t4Text(message, size || 28, 860)).padding(16));
}

function m2t4Small(message) {
    return parentCenter(m2t4Text(message, 20, 900));
}

function m2t4Cell(message, width, size) {
    return m2t4Text(message, size || 25, width);
}

function m2t4BorderedCell(message, height, header) {
    return frame(m2t4Cell(message, 415, 24)).padding(12).bg
        .width(439).height(height)
        .fillColor(header ? '#F2F2F2' : 'white')
        .strokeColor('#666666').strokeWidth(1).end;
}

function m2t4Math(message, size) {
    return parentCenter(m2t4Text(message, size || 30, 920));
}

function m2t4Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

var m2t4Sources = {
    reflex: 'https://stanford-cs221.github.io/spring2026/modules/module.html#include=machine-learning%2Flecture1.js&slideId=reflex-based-models&level=0',
    underspecification: 'https://arxiv.org/abs/2011.03395',
};

function m2t4Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['reflex-based-prediction', 'Learn a predictor inside an ordering system'],
        ['training-test-and-population-risk', 'Evaluate a claim, not just a score'],
        ['good-performance-can-leave-a-set', 'Probe what the pipeline leaves unresolved'],
    ]).id('m2t4-roadmap-' + selected));
    prose([
        'We walk through problem formulation, model specification, learning, and inference inside one hypothetical food-ordering system.',
        'Learning gives us a predictor, but it does not by itself tell us whether that predictor will behave well on inputs that were not sampled during training.',
        'Good predictive performance may identify a set of acceptable predictors rather than one particular predictor.',
    ][selected]);
}

// Native slide diagrams; the same coordinate convention works in both backends.
function m2t4At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m2t4Box(lines, x, y, width, height) {
    var contents = ytable.apply(null, lines.map(function (message) {
        return nowrapText(message).fontSize(22);
    })).center().ymargin(4);
    return overlay(
        m2t4At(rect(width, height).fillColor('#F6F6F6')
            .strokeColor('#777777').strokeWidth(1.5), x, y),
        transform(contents).pivot(0, 0)
            .shift(x + width / 2, sfig.downSign * (y + height / 2)),
    );
}

function m2t4Segment(x1, y1, x2, y2, headed) {
    return (headed ? arrow : line)([x1, sfig.downSign * y1],
        [x2, sfig.downSign * y2]).strokeWidth(2);
}

function m2t4SplitDiagram() {
    return overlay(
        rect(940, 300).strokeWidth(0).fillColor('white'),
        m2t4Box(['Source $S$'], 0, 110, 155, 70),
        m2t4Box(['$S_{\\mathrm{train}}$'], 250, 25, 200, 70),
        m2t4Box(['Fitting'], 515, 25, 155, 70),
        m2t4Box(['Fixed predictor', '$\\hat\\theta$'], 740, 25, 190, 70),
        m2t4Box(['$S_{\\mathrm{test}}$'], 250, 215, 200, 70),
        m2t4Box(['Evaluation'], 650, 215, 280, 70),
        m2t4Segment(155, 145, 200, 145),
        m2t4Segment(200, 60, 200, 250),
        m2t4Segment(200, 60, 250, 60, true),
        m2t4Segment(200, 250, 250, 250, true),
        m2t4Segment(450, 60, 515, 60, true),
        m2t4Segment(670, 60, 740, 60, true),
        m2t4Segment(835, 95, 835, 215, true),
        m2t4Segment(450, 250, 650, 250, true),
    ).recMouseShowHide(false);
}

// Keep baseline, action, and proposed-confirmation views at the same scale.
function m2t4Control(options) {
    return foodOrderingControlDiagram(options).scale(0.67);
}

// 1
add(titleSlide('Lecture 4: Learning, Generalization, and Underspecification',
    nil(),
    parentCenter(m2t4Text(
        'CS120: Introduction to AI Safety - October 1, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1.0));
prose(
    'We now turn our attention towards learned predictors as components of systems. The technical focus is how a predictor\'s behavior is shaped by its development system. The safety analysis asks how that behavior can contribute to harm scenarios.',
);

// 2
add(slide('From system assurance to model behavior',
    parentCenter(courseProgressionDiagram(2)),
    m2t4Text('How is a predictor\'s behavior shaped by its development system?', 28),
    m2t4Text('How can that behavior contribute to harm scenarios in the system?', 28),
    _));
prose(
    'The technical focus here is narrow; the safety analysis is broader. Prediction accuracy is evidence about one component, not the whole system.',
);

// 3
m2t4Roadmap(0);

// 4
add(slide('Reflex-based prediction',
    parentCenter(table(
        [nowrapText(brownbold('input')).fontSize(20), nil(),
        nowrapText(brownbold('predictor')).fontSize(20), nil(),
        nowrapText(brownbold('output')).fontSize(20)],
        [nowrapText('$x$').fontSize(30), rightArrow(60).strokeWidth(5),
        frameBox(nowrapText('$f$').fontSize(30)), rightArrow(60).strokeWidth(5),
        nowrapText('$y$').fontSize(30)],
    ).center().margin(24, 10)),
    m2t4Text('A predictor function $f$ takes an input $x$ and produces an output $y$.', 28),
    m2t4Text('Binary classification: $f(x)\\in\\{-1,+1\\}$.', 28),
    pause(),
    m2t4Card('The space of possible predictors $\\mathcal H$ is the hypothesis class.', 28),
    m2t4Cite('Adapted from CS221 Spring 2026, Reflex-based models', m2t4Sources.reflex),
    _).id('reflex-based-prediction'));
prose(
    'Machine learning is the process of turning data into a model. After learning a model, inference can convert inputs into predictions for downstream tasks.',
    _,
    'Modeling chooses a family, learning fits a member, and inference applies the fitted predictor. We search the hypothesis class using a loss function and an optimization algorithm.',
);

// 5
add(slide('Formulate the preference problem',
    m2t4Text('Fix one customer. If the requested item is unavailable, compare substitutes $(x,z)$.', 28),
    parentCenter(table(
        [m2t4Cell('$x=\\text{Apple}$', 390, 28),
        m2t4Cell('$z=\\text{Spinach}$', 390, 28)],
        [m2t4Cell('$y=-1$', 390, 28),
        m2t4Cell('$y=+1$', 390, 28)],
        [m2t4Cell('Selection of $x$', 390, 28),
        m2t4Cell('Selection of $z$', 390, 28)],
    ).margin(82, 14).xjustify('l')),
    pause(),
    m2t4Card('Intended construct: preference between food types at comparable freshness.', 28),
    m2t4Text('Recorded comparisons may instead confound food type with freshness.', 27),
    _));
prose(
    'Features can represent food type, freshness, and other properties. Labels record this customer\'s choices in binary-choice experiments. Freshness can genuinely influence those choices without identifying the intended matched-freshness preference.',
);

// 6
add(slide('STPA 1: purpose, harm, and hazard',
    m2t4Text('Hypothetical service: equal prices, comparable acceptable freshness, delegated ordering without confirmation of each purchase.', 23),
    parentCenter(table(
        [m2t4Cell(bold('Harm $L_F$'), 175, 23),
        m2t4Cell('The customer is charged for the alternative they would reject in favor of the other.', 685, 24)],
        [m2t4Cell(bold('Hazard $H_F$'), 175, 23),
        m2t4Cell('A predicted choice can become a nonrefundable purchase without an effective opportunity for the customer to confirm or correct it.', 685, 24)],
        [m2t4Cell(bold('Constraint $SC_F$'), 175, 23),
        m2t4Cell('Prevent nonrefundable purchase of an order that would contradict the customer\'s intended choice.', 685, 24)],
    ).margin(16, 14).xjustify('l')),
    m2t4Small('The hazard is an upstream condition rather than the charge itself.'),
    _));
prose(
    'Systems-Theoretic Process Analysis (STPA) begins with the purpose, harms, hazards, and boundary. Here the purpose is to learn how preference predictions contribute to unwanted purchasing and what could prevent or limit this from happening. We set aside food hygiene, dietary restrictions, and changes in preference during an ordering episode.',
    _,
    'The hazard does not create a harm if the prediction matches the customer\'s intended choice.',
);

// 7
add(slide('STPA 2: controller, process, and feedback',
    parentCenter(ytable(
        m2t4Control(),
        m2t4Text('Submission and commitment can be separated by a delay; commitment makes the charge nonrefundable.', 22, 930),
    ).center().ymargin(10)),
    _));
prose(
    'The ordering controller consists of the preference predictor and a fixed ordering rule. It can submit an order or request cancellation. The controlled process is the merchant\'s order-and-charge process.',
    'Delayed order-status feedback can reveal that the requested item is unavailable and trigger a substitute choice.',
    _,
    'Development is above the ordering-system boundary. Installing parameters is not an order. In the baseline, a notice and later correction need not prevent the charge.',
);

// 8
add(slide('Keep learning and testing separate',
    m2t4Text('Assume independent and identically distributed examples $(x,z,y)\\sim S$.', 26),
    parentCenter(m2t4SplitDiagram()),
    m2t4Small('No test-to-fitting or test-to-selection arrow in this design.'),
    _));
prose(
    'We draw samples to construct a training set and separately draw a test set to evaluate the trained model. A random split does not by itself establish i.i.d. sampling or a match to deployment.',
);

// 9
add(slide('Modeling: scores become preference probabilities',
    m2t4Text('Represent alternatives in a common feature space: $x,z\\in\\mathbb R^k$.', 27),
    m2t4Text('Parameters $\\theta\\in\\mathbb R^k$ give scores $\\theta^\\top x$ and $\\theta^\\top z$.', 28),
    pause(),
    m2t4Math(
        '$\\Pr_\\theta(x\\succ z\\mid x,z)=\\frac{e^{\\theta^\\top x}}{e^{\\theta^\\top x}+e^{\\theta^\\top z}}$',
        34
    ),
    m2t4Text('The probability of choosing $z$ is the complement.', 27),
    m2t4Small('Bradley-Terry model; a chosen hypothesis class, not an observed customer law.'),
    _));
prose(
    'The model assigns each alternative a score and models the probability that one is preferred to the other. Only the score difference determines the comparison probability. Under our label convention, choosing $x$ is $y=-1$.',
);

// 10
add(slide('Learning: minimize average log loss',
    m2t4Math('$\\ell_{\\log}(\\theta;x,z,y)=-\\log\\Pr_\\theta(y\\mid x,z)$', 31),
    m2t4Math(
        '$\\hat R_{\\mathrm{train}}^{\\log}(\\theta)=\\frac{1}{|S_{\\mathrm{train}}|}\\sum_{(x,z,y)\\in S_{\\mathrm{train}}}\\ell_{\\log}(\\theta;x,z,y)$',
        29
    ),
    pause(),
    m2t4Card('Learning seeks parameters that minimize this average loss.', 28),
    m2t4Text('With the i.i.d. likelihood: equivalent to maximizing the training likelihood.', 25),
    m2t4Small('Gradient descent is one fitting algorithm.'),
    _));
prose(
    'Negating and averaging the log-likelihood gives the empirical-risk objective. The objective is differentiable with respect to the model parameters, so gradient descent is a popular algorithm. The objective and the algorithm are distinct; a finite minimizer need not exist on every dataset.',
);

// 11
add(slide('Inference predicts; the ordering rule acts',
    m2t4Text('Fix the fitted model $\\hat\\theta$. Choose the higher-scoring option:', 28),
    parentCenter(table(
        [m2t4Cell('$\\hat\\theta^\\top x\\geq\\hat\\theta^\\top z$', 440, 30),
        m2t4Cell('$\\hat y=-1$: choose $x$', 380, 28)],
        [m2t4Cell('Otherwise', 440, 28),
        m2t4Cell('$\\hat y=+1$: choose $z$', 380, 28)],
    ).margin(20, 18).xjustify('l')),
    m2t4Text(bold('Ties choose $x$.'), 28),
    pause(),
    m2t4Card('This is a prediction; the ordering rule separately turns it into a purchase instruction.', 28),
    _));
prose(
    'This rule picks the option with the highest predicted probability, breaking ties in favor of $x$. Converting a probability into a classification and converting a classification into a purchase instruction are separate operations.',
);

// 12
add(slide('STPA 3: an unsafe ordering action',
    parentCenter(ytable(
        m2t4Control({ focus: 'action' }),
        m2t4Text(
            bold('Unsafe ordering action:') + ' The ordering controller submits $x$ when the intended choice is $z$, while the order can become nonrefundable before correction.',
            22, 930
        ),
    ).center().ymargin(8)),
    _));
prose(
    'The ordering controller submits an order for $x$ when the customer\'s intended choice is $z$, while the order can become nonrefundable before the customer can correct it. The unsafe control action is submission in this context, not the prediction alone.',
);

// 13
m2t4Roadmap(1);

// 14
add(slide('Training, test, and population risk',
    m2t4Text(bold('Switch to bounded zero-one evaluation loss, not fitting log loss.'), 25),
    m2t4Math('$\\ell_{01}(\\hat y_\\theta(x,z),y)=1\\{\\hat y_\\theta(x,z)\\neq y\\}$', 30),
    parentCenter(table(
        [m2t4Cell('$\\hat R_{\\mathrm{train}}(\\hat\\theta)$', 250, 28),
        m2t4Cell('Average error on training examples', 590, 26)],
        [m2t4Cell('$\\hat R_{\\mathrm{test}}(\\hat\\theta)$', 250, 28),
        m2t4Cell('Average error on held-out test examples', 590, 26)],
        [m2t4Cell('$R_S(\\hat\\theta)$', 250, 28),
        m2t4Cell('Expected error on the source distribution', 590, 26)],
    ).margin(18, 14).xjustify('l')),
    m2t4Math('$R_S(\\theta)=\\mathbb E_{(x,z,y)\\sim S}[\\ell_{01}(\\hat y_\\theta(x,z),y)]$', 28),
    _).id('training-test-and-population-risk'));
prose(
    'The training, test, and population risks now all use zero-one evaluation loss. Training risk is measured on the examples used to obtain the predictor. Since we can only sample $S$, the test average estimates population risk.',
);

// 15
add(slide('What does held-out evaluation support?',
    parentCenter(table(
        [m2t4Cell(bold('Sampling'), 210),
        m2t4Cell('Test examples are i.i.d. from $S$.', 650)],
        [m2t4Cell(bold('Independence'), 210),
        m2t4Cell('The predictor is fixed independently of these examples.', 650)],
        [m2t4Cell(bold('Estimation'), 210),
        m2t4Cell('Bounded loss; sufficient sample size; reported uncertainty.', 650)],
    ).margin(18, 15).xjustify('l')),
    pause(),
    m2t4Card('Good test performance supports good performance on future samples from the same $S$.', 28),
    m2t4Small('Finite-sample evidence, not correct behavior on every future input.'),
    _));
prose(
    'We cannot use training risk directly in the same way because the fitted model depends on the training data. A training-based argument requires separate reasoning about the learning procedure and hypothesis class.',
);

// 16
add(slide('Generalization: behavior and evidence',
    m2t4Text('Low population error and a small training-to-population gap are different properties.', 27),
    m2t4Text(bold('One sufficient learning argument:'), 26),
    m2t4Math('$\\hat R_{\\mathrm{train}}(\\hat\\theta)\\leq r,\\qquad \\sup_{\\theta\\in\\Theta}|R_S(\\theta)-\\hat R_{\\mathrm{train}}(\\theta)|\\leq\\epsilon$', 28),
    m2t4Math('$\\Longrightarrow\\quad R_S(\\hat\\theta)\\leq r+\\epsilon$', 32),
    m2t4Small('The uniform bound needs justification; any confidence qualification carries through.'),
    pause(),
    m2t4Text('A predictor can perform well without anyone collecting an independent test set.', 27),
    _));
prose(
    'A small gap alone permits high error on both training and population examples. Low training error plus a justified uniform bound gives a sufficient low-risk argument.',
    _,
    'Held-out samples instead support estimating a fixed predictor\'s risk. Assumptions sufficient for that inference are not automatically necessary conditions for the behavior.',
);

// 17 (the conditional bridge originally numbered 18 in the outline)
add(slide('When does model error measure harm?',
    m2t4Text(bold('For error to correspond to $L_F$ per order:'), 25),
    parentCenter(table(
        [m2t4Cell('Population and labels', 250, 23),
        m2t4Cell('Ordering episodes match $S$; labels give the intended binary choice.', 610, 23)],
        [m2t4Cell('Baseline execution', 250, 23),
        m2t4Cell('The prediction is faithfully ordered and charged before effective correction.', 610, 23)],
    ).margin(16, 12).xjustify('l')),
    m2t4Math('$\\Pr(L_F\\text{ per order})=R_S(\\hat\\theta)\\quad\\text{under those assumptions}$', 27),
    pause(),
    m2t4Text(bold('For zero-one loss to represent disutility:'), 25),
    m2t4Math('$u=a-b\\ell_{01},\\quad b>0\\quad\\text{with fixed }a,b$', 28),
    m2t4Small('Equal-cost errors, up to positive affine rescaling. Equal prices alone do not imply this utility shape.'),
    _));
prose(
    'The event correspondence is conditional on labels and control structure. Treating zero-one error as disutility further assigns the same cost to each error and the same lower cost to each correct choice, up to positive affine rescaling.',
    _,
    'Preference labels alone do not identify utility differences. Error frequency is not monetary severity or preference regret, and does not establish acceptable risk over the intended exposure. Effective confirmation changes the error-to-harm relationship.',
);

// 18
add(slide('STPA 4: from a freshness shortcut to a charge',
    m2t4Text(bold('A hypothetical harm scenario'), 26),
    parentCenter(table(
        [m2t4Cell('1', 35, 27),
        m2t4Cell('Development comparisons confound food type with freshness.', 810, 26)],
        [m2t4Cell('2', 35, 27),
        m2t4Cell('Both substitutes are fresh; the customer would choose spinach. The freshness-based predictor ties and returns $\\hat y=-1$ for $x=\\text{Apple}$.', 810, 25)],
        pause(),
        [m2t4Cell('3', 35, 27),
        m2t4Cell('The ordering rule submits the apple order: an unsafe control action occurs.', 810, 26)],
        [m2t4Cell('4', 35, 27),
        m2t4Cell('The merchant commits before notice. Later correction cannot prevent $L_F$.', 810, 26)],
    ).margin(16, 17).xjustify('l')),
    _));
prose(
    'The scenario combines a development-data relationship, a learned prediction rule, an automatic control action, and ineffective feedback timing. It is a possible causal account, not an observed training result.',
);

// 19
add(slide('From the scenario to requirements and evidence',
    parentCenter(table(
        [m2t4BorderedCell(bold('Proposed requirement'), 54, true),
        m2t4BorderedCell(bold('Evidence to seek'), 54, true)],
        [m2t4BorderedCell('Limit prediction error under the given ordering conditions to a justified tolerance.', 146),
        m2t4BorderedCell('Independent labeled comparisons under those conditions, with evaluation uncertainty reported.', 146)],
        pause(),
        [m2t4BorderedCell('Require explicit customer confirmation; without confirmation, do not allow nonrefundable commitment.', 146),
        m2t4BorderedCell('Log confirmed, rejected, delayed, and missing responses; inspect actual order and charge records.', 146)],
    ).margin(0, 0).xjustify('l')),
    m2t4Small('Model-level requirement versus proposed system control; neither evidence substitutes for the other.'),
    _));
prose(
    'Prediction evaluation does not establish correct order execution, effective correction, or an adequate tolerance for the harm and exposure. A nonzero error tolerance does not by itself establish the categorical constraint $SC_F$.',
    _,
    'Confirmation is proposed, not baseline. Even correct enforcement does not alone establish that confirmation matches the customer\'s intended choice.',
);

// 20
add(slide('Proposed confirmation changes the control structure',
    parentCenter(ytable(
        m2t4Control({ confirmation: true, focus: 'confirmation' }),
        m2t4Text('Proposed, not implemented: without confirmation, do not allow nonrefundable commitment.', 22, 930),
    ).center().ymargin(10)),
    _));
prose(
    'The second requirement is a proposed system control addressing $SC_F$, not a feature of the baseline system. Confirmation must concern the current selection and be enforced before nonrefundable commitment. Drawing the paths does not establish either property.',
);

// 21
m2t4Roadmap(2);

// 22
add(slide('Good performance can leave a set',
    m2t4Card('Good predictive performance may identify a set of acceptable predictors rather than one particular predictor.', 28),
    m2t4Math('$\\Theta_\\epsilon^*=\\{\\theta\\in\\Theta:R_S(\\theta)\\leq\\inf_{\\theta\'\\in\\Theta}R_S(\\theta\')+\\epsilon\\}$', 28),
    pause(),
    m2t4Text('Which predictors can the pipeline return with the same effective validation performance?', 28),
    m2t4Small('The population-level set need not be the set of outputs of a particular pipeline.'),
    _).id('good-performance-can-leave-a-set'));
prose(
    'A performance criterion can admit multiple predictors. Distinct parameter values alone do not establish distinct behavior, and membership in this population-level set does not establish that a particular pipeline can return the predictor.',
);

// 23
add(slide('Underspecification is a pipeline property',
    parentCenter(xtable(
        frameBox(m2t4Text('Fixed training data, model class, and procedure', 25, 290)),
        rightArrow(45).strokeWidth(3),
        ytable(
            frameBox(m2t4Text('Predictor A', 25, 200)),
            frameBox(m2t4Text('Predictor B', 25, 200)),
        ).ymargin(16),
    ).center().xmargin(22)),
    m2t4Text('Otherwise incidental choices can yield distinct, validation-equivalent predictors.', 27),
    pause(),
    m2t4Card('This becomes consequential when those predictors differ in application-relevant behavior.', 28),
    m2t4Cite('D\'Amour et al., JMLR 2022', m2t4Sources.underspecification),
    _));
prose(
    'A machine-learning pipeline is underspecified when it can return multiple distinct, validation-equivalent predictors with core components held fixed. Validation here judges which outputs are acceptable during development. The diagram shows a possibility, not measured results.',
);

// 24
add(slide('Three ways to stress-test a behavioral requirement',
    m2t4Text('Test food-type preference at comparable freshness for the same customer.', 26),
    parentCenter(table(
        [m2t4Cell(bold('Stratified'), 185, 25),
        m2t4Cell('Report performance on fresh-spoiled and matched-freshness subsets.', 665, 25)],
        [m2t4Cell(bold('Shifted'), 185, 25),
        m2t4Cell('Collect a new population $S\'$: both foods have comparable, acceptable freshness.', 665, 25)],
        [m2t4Cell(bold('Contrastive'), 185, 25),
        m2t4Cell('For photographs, alter the background while preserving food and freshness; justify the expected invariance.', 665, 25)],
    ).margin(18, 20).xjustify('l')),
    m2t4Small('Each probes a specified behavioral requirement, not complete safety.'),
    m2t4Cite('D\'Amour et al., JMLR 2022', m2t4Sources.underspecification),
    _));
prose(
    'Subgroup differences indicate a gap, not by themselves freshness use. Too few matched comparisons require more data. A shifted test supplies evidence about that particular change. Contrastive tests require a justified anticipated effect.',
);

// 25
add(slide('Test repeated runs, not just one predictor',
    parentCenter(table(
        [m2t4Cell('1', 35, 27),
        m2t4Cell('Hold training data, model class, and procedure fixed.', 805, 27)],
        [m2t4Cell('2', 35, 27),
        m2t4Cell('Vary an otherwise incidental choice, such as a training seed.', 805, 27)],
        [m2t4Cell('3', 35, 27),
        m2t4Cell('Identify effectively validation-equivalent outputs, accounting for uncertainty.', 805, 27)],
        [m2t4Cell('4', 35, 27),
        m2t4Cell('Compare those outputs on the same application-relevant stress test.', 805, 27)],
    ).margin(16, 15).xjustify('l')),
    pause(),
    m2t4Small('Seed changes need not yield different predictors; one failed predictor is insufficient.'),
    _));
prose(
    'Define a meaningful stress-test difference and effective validation equivalence. Failure to detect a validation difference does not automatically establish equivalence. Seed changes need not alter this Bradley-Terry predictor.',
    _,
    'A positive result is a model-level difference, not an unwanted charge or evidence that $SC_F$ holds. A negative result constrains only these runs and this test.',
);

// 26
add(slide('Evaluation also creates selection pressure',
    m2t4Text('An evaluation criterion does two jobs:', 28),
    parentCenter(table(
        [m2t4Cell(bold('Evidence'), 190),
        m2t4Cell('Produces evidence about a fixed predictor.', 640, 28)],
        [m2t4Cell(bold('Selection'), 190),
        m2t4Cell('Helps determine which predictor we get.', 640, 28)],
    ).margin(20, 22).xjustify('l')),
    pause(),
    m2t4Card('Once evaluation results are used for selection, the selected predictor is no longer independent of that evaluation data.', 27),
    m2t4Small('Fresh held-out data, or an additional argument accounting for selection.'),
    _));
prose(
    'Degrees of freedom left unresolved by the pipeline can become directions along which optimization pressure acts. Selection changes the evidence relationship. Fresh evaluation addresses reuse, not construct validity or complete coverage.',
);

// 27
add(slide('Discussion setting: food preferences',
    m2t4Card('A predictor learns from human choices between pairs of foods. The intended construct is preference between food types at comparable freshness. Development comparisons may instead confound food type with freshness.', 28),
    m2t4Small('Use this setting for the stress test and repeated-run comparison.'),
    _));
prose(
    'Freshness can genuinely influence recorded choices without identifying the intended matched-freshness preference. The baseline ordering rule submits the predicted choice automatically.',
);

// 28
add(slide('Discussion: generalization and underspecification',
    m2t4Text('Use the food-preference task and the baseline food-ordering control structure. Keep $L_F$, $H_F$, and the unsafe ordering action fixed.', 27),
    m2t4Text('For questions 2-4, connect the evaluation to the predictor\'s role in the harm scenario: state what observation your proposed evaluation would supply and what would remain unestablished about $SC_F$.', 27),
    m2t4Card('Do not assume that the proposed confirmation control has already been implemented.', 27),
    _));
prose(
    'In the harm scenario, a freshness-based prediction contributes to an unsafe ordering action; automatic submission and late feedback complete the path to $L_F$. Predictor evaluation alone does not establish that the system prevents a nonrefundable purchase contrary to the customer\'s intended choice.',
);

// 29
add(slide('Discussion: generalization',
    m2t4Card('Come up with sufficient conditions for a predictor to generalize, how is this distinct from necessary conditions?', 29),
    _));
prose(
    'The distribution, loss, and target property matter. Low empirical loss plus a justified uniform bound is one sufficient learning argument, with the bound\'s confidence qualification. Held-out estimation is a different argument and is not necessary for the predictor to perform well.',
);

// 30
add(slide('Discussion: stress testing',
    m2t4Card('Design a stratified, shifted, or contrastive evaluation for the food-preference predictor.', 29),
    _));
prose(
    'An evaluation can supply matched-freshness error estimates or evidence of sensitivity to a justified intervention. Subgroup error differences alone do not prove freshness use. These observations concern the predictor in the harm scenario; timely correction and prevention of nonrefundable commitment remain unestablished.',
);

// 31
add(slide('Discussion: underspecification',
    m2t4Card('What comparison across repeated training runs would demonstrate consequential underspecification, rather than merely one poorly performing predictor? Explain what consequential underspecification your group\'s stress test could elicit.', 28),
    _));
prose(
    'The relevant observation is a meaningful difference on the group\'s stress test among validation-equivalent outputs of repeated runs, with uncertainty accounted for. One failed predictor or a changed seed is insufficient. Such variation concerns the predictor\'s contribution to the harm scenario, not whether $SC_F$ is enforced.',
);

// 32
add(slide('Discussion: selection pressure',
    m2t4Card('If developers use those evaluation results to choose a predictor, what additional evidence is needed afterward?', 29),
    _));
prose(
    'Fresh held-out evaluation of the frozen predictor can supply new error or stress-test estimates; an alternative argument must account for selection. The population and metric must match the claim. Fresh data do not establish the ordering and feedback controls required for $SC_F$.',
);

// 33
add(slide('Generalization and safety are different claims',
    parentCenter(table(
        [m2t4Cell(bold('Training'), 215, 25),
        m2t4Cell('Fit to observed examples under the chosen loss.', 635, 25)],
        [m2t4Cell(bold('Generalization'), 215, 25),
        m2t4Cell('Behavior under a specified population distribution.', 635, 25)],
        [m2t4Cell(bold('Stress testing'), 215, 25),
        m2t4Cell('Behavior under a specified subset, shift, or intervention.', 635, 25)],
        [m2t4Cell(bold('System safety'), 215, 25),
        m2t4Cell('A harm-related claim requiring controls, evidence, and an adequate risk criterion.', 635, 25)],
    ).margin(18, 16).xjustify('l')),
    pause(),
    m2t4Card('Evaluation provides evidence and, when used for selection, helps determine which predictor we get.', 26),
    _));
prose(
    'A harm scenario connects model behavior to the control structure. Requirements need evidence of implementation and effectiveness; predictor performance alone is not the whole safety argument. The next meeting examines proxies and model-selection pressure.',
);