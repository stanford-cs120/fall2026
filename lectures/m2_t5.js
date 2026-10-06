G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 2, meeting 5: proxies and model-selection pressure.
// Canonical note: notes/m2_t5.md.
// Retain Zach's September 30 discussion setting and questions unchanged.
// Ticket extraction: worksheets/configs/m2_t5.json.
// Local draft: review slides and public speaker notes before publication.

function m2t5Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m2t5Card(message, size) {
    return parentCenter(frameBox(m2t5Text(message, size || 28, 860)).padding(16));
}

function m2t5Small(message) {
    return parentCenter(m2t5Text(message, 20, 900));
}

function m2t5Cell(message, width, size) {
    return m2t5Text(message, size || 25, width);
}

function m2t5Math(message, size) {
    return parentCenter(m2t5Text(message, size || 30, 920));
}

function m2t5Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

var m2t5Sources = {
    shortcuts: 'https://arxiv.org/abs/2004.07780',
    goodhart: 'https://arxiv.org/abs/1803.04585',
    ladder: 'https://arxiv.org/abs/1502.04585',
    length: 'https://arxiv.org/abs/2310.03716',
};

function m2t5Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['target-criterion-and-object-selected', 'Separate the target from the criterion'],
        ['selection-pressure-and-goodhart-effects', 'Diagnose the selection mechanism'],
        ['a-leaderboard-becomes-part-of-development', 'Follow selection through two (new) worked examples'],
    ]).id('m2t5-roadmap-' + selected));
    prose([
        'We distinguish finite-sample estimation from whether the measured criterion captures the intended construct. Shortcut learning makes the difference between development success and the required application behavior explicit.',
        'Goodhart effects concern how proxy-based selection can separate measured success from the target. We distinguish possible mechanisms by their explanations and the evidence needed to support them.',
        'The leaderboard example concerns selecting predictors using evaluation feedback. The language-model example concerns fitting a preference model and then using its score as an objective for downstream optimization.',
    ][selected]);
}

// Native diagrams share the browser and TeX coordinate convention.
function m2t5At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m2t5Box(lines, x, y, width, height) {
    var contents = ytable.apply(null, lines.map(function (message) {
        return nowrapText(message).fontSize(23);
    })).center().ymargin(5);
    return overlay(
        m2t5At(rect(width, height).fillColor('#F6F6F6')
            .strokeColor('#777777').strokeWidth(1.5), x, y),
        transform(contents).pivot(0, 0)
            .shift(x + width / 2, sfig.downSign * (y + height / 2)),
    );
}

function m2t5Segment(x1, y1, x2, y2, headed) {
    return (headed ? arrow : line)([x1, sfig.downSign * y1],
        [x2, sfig.downSign * y2]).strokeWidth(2);
}

function m2t5LeaderboardDiagram() {
    return overlay(
        rect(940, 290).strokeWidth(0).fillColor('white'),
        m2t5Box(['Submit', 'predictor'], 20, 20, 250, 100),
        m2t5Box(['Reusable', 'evaluation set'], 345, 20, 250, 100),
        m2t5Box(['Reported', 'score'], 670, 20, 250, 100),
        m2t5Segment(270, 70, 345, 70, true),
        m2t5Segment(595, 70, 670, 70, true),
        m2t5Segment(795, 120, 795, 205),
        m2t5Segment(795, 205, 145, 205),
        m2t5Segment(145, 205, 145, 120, true),
        m2t5At(m2t5Text('Revise or select using the reported score', 26, 780), 100, 235),
    ).recMouseShowHide(false);
}

function m2t5HarmPath() {
    return xtable(
        frameBox(m2t5Text('Predict an unwanted substitute', 23, 230)),
        rightArrow(30).strokeWidth(3),
        frameBox(m2t5Text('Automatically submit that order', 23, 230)),
        rightArrow(30).strokeWidth(3),
        frameBox(m2t5Text('Commit the charge before effective correction', 23, 230)),
    ).center().xmargin(10);
}

// 1
add(titleSlide('Lecture 5: Proxies and Model-Selection Pressure',
    nil(),
    parentCenter(m2t5Text(
        'CS120: Introduction to AI Safety - October 6, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1.0));
prose(
    'In the previous meeting, we introduced the machine-learning pipeline and discussed a harm scenario where a food-preference predictor contributes to an unwanted substitute purchases through timing and merchant committment.',
    _,
    'Now we ask how objectives, learning procedures, and development choices can favor particular predictors. Selection can exploit estimation error or the gap between the intended target and the measured criterion.',
);

// 2
add(slide('A substitute still has to be chosen',
    parentCenter(ytable(
        foodOrderingControlDiagram().scale(0.67),
        m2t5Text('Delayed status can reveal an unavailable item. The predictor chooses a substitute; commitment makes its charge nonrefundable.', 22, 930),
    ).center().ymargin(10)),
    _));
prose(
    'We keep the same customer, intended matched-freshness preference, and baseline ordering controller. The predictor chooses a substitute if the customer\'s originally requested item is unavailable. Both alternatives have the same price and comparable, acceptable freshness.',
    _,
    'The harm $L_F$ is that the customer is charged for the alternative they would reject in favor of the other. The hazard $H_F$ is that a predicted choice can become a nonrefundable purchase without an effective opportunity for the customer to confirm or correct it. The safety constraint $SC_F$ is to prevent nonrefundable purchase of an order that would contradict the customer\'s intended choice.',
    _,
    'Submission and commitment can be separated by a delay. That delay does not by itself give the customer an effective opportunity to intervene. The baseline ordering rule submits the predicted choice automatically; customer confirmation before commitment remains a proposed selection.',
);

// 3
m2t5Roadmap(0);

// 4
add(slide('Target, criterion, and object selected',
    parentCenter(table(
        [m2t5Cell(bold('Target $G$'), 220, 26),
        m2t5Cell('Accurate preference prediction for this customer at equal prices and comparable, acceptable freshness.', 630, 26)],
        [m2t5Cell(bold('Measured criterion $M$'), 220, 26),
        m2t5Cell('Measured prediction accuracy on recorded choices, which may confound food type with freshness.', 630, 26)],
        [m2t5Cell(bold('Object selected'), 220, 26),
        m2t5Cell('The predictor installed in the ordering controller.', 630, 26)],
    ).margin(18, 18).xjustify('l')),
    m2t5Small('Here we use accuracy scores: larger is better.'),
    _).id('target-criterion-and-object-selected'));
prose(
    'Let $G$ represent the target property and $M$ the measured criterion used for selection. The target may be observable, but simply too expensive or underrepresented to be effectively available for evaluation.',
    _,
    'Recall the food-ordering setting. The intended model-level target is accurate preference prediction for this customer between food types at equal prices and comparable, acceptable freshness, while the development criterion measures prediction of recorded choices, which may confound food type with freshness.',
    _,
    'Achieving this model-level target supports the prediction-quality requirement, but does not by itself establish $SC_F$. As a reminder, failure does not necessarily imply a hazard, and a hazard does not necessarily result in harm.',
);

// 5
add(slide('Separate Threats to Validity',
    parentCenter(table(
        [m2t5Cell(bold('Estimation'), 220, 28),
        m2t5Cell('Does the measured score accurately estimate the population value of the criterion?', 630, 28)],
        [m2t5Cell(bold('Construct validity'), 220, 28),
        m2t5Cell('Does that criterion capture the intended target, even when measured accurately?', 630, 28)],
    ).margin(18, 25).xjustify('l')),
    pause(),
    m2t5Card('Accurately estimating recorded-choice prediction does not establish intended-preference prediction.', 27),
    _));
prose(
    'What happens when we use a proxy $M$ for selection? There are two gaps that we will distinguish. First, its finite-sample measurement may inaccurately estimate the population value of that criterion. This is a generalization problem.',
    _,
    'We want to distinguish this gap from a second: the criterion may not fully capture the intended construct even when measured accurately. More precise estimation of the wrong criterion does not, by itself, resolve this construct-validity problem.',
);

// 6
add(slide('Shortcut learning: success under which conditions?',
    m2t5Text(bold('Shortcut learning concerns what solutions the criterion allows and learning favors.'), 27),
    m2t5Card('A freshness-based rule can predict recorded choices without identifying food-type preference at comparable freshness.', 28),
    pause(),
    m2t5Text('Development-distribution success and the required application behavior are different claims.', 28),
    m2t5Cite('Geirhos et al., Nature Machine Intelligence 2020', m2t5Sources.shortcuts),
    _));
prose(
    'Shortcut learning is about what solutions the criterion allows and learning favors. Geirhos et al. articulate this, writing, "Shortcuts are decision rules that perform well on standard benchmarks, but fail to transfer to more challenging testing conditions, such as real-world scenarios."',
    _,
    'Returning to the food preference example: freshness might predict recorded choices, so a predictor can perform well without learning the food-type preference needed for matched-freshness comparisons.',
    _,
    'The shortcut phenomenon makes the difference between generalizing to new samples from the development distribution and generalizing under the required conditions of the application explicit.',
);

// 7
add(slide('Make the shortcut and intended behavior disagree',
    m2t5Text('Detection requires evaluations that distinguish the suspected shortcut from the intended behavior.', 27),
    parentCenter(table(
        [m2t5Cell(bold('Stratified'), 185, 25),
        m2t5Cell('Compare fresh-spoiled and matched-freshness subsets; obtain enough examples of each.', 665, 25)],
        [m2t5Cell(bold('Shifted'), 185, 25),
        m2t5Cell('Collect choices from this customer with both foods at comparable, acceptable freshness.', 665, 25)],
        [m2t5Cell(bold('Contrastive'), 185, 25),
        m2t5Cell('Intervene on a suspected cue and justify the expected effect on the intended choice.', 665, 25)],
    ).margin(18, 17).xjustify('l')),
    m2t5Small('Subset error differences alone do not establish freshness use.'),
    _));
prose(
    'Detection requires evaluations that distinguish the suspected shortcut from the intended behavior. In the previous note three strategies were presented: stratified, shifted, or contrastive evaluations.',
    _,
    'A gap between fresh-spoiled and matched-freshness performance is relevant, but other differences between the subsets could explain it. A shifted evaluation supplies evidence about that particular change. Contrastive evaluations require a justified anticipated effect: changing freshness can genuinely change a customer\'s choice, so invariance to that change should not simply be assumed.',
    _,
    'These evaluations concern predictor behavior. They do not establish correct ordering, effective customer correction, or prevention of a nonrefundable charge.',
);

// 8
m2t5Roadmap(1);

// 9
add(slide('Selection pressure and Goodhart effects',
    m2t5Text('A shortcut shows that development success can coexist with failure of the intended generalization.', 27),
    pause(),
    m2t5Card('What happens to the proxy-target relationship when we increasingly select or optimize for the proxy?', 28),
    m2t5Text('Measured improvement may overstate genuine improvement.', 27),
    m2t5Small('Not every shortcut leads to a Goodhart effect; not every Goodhart effect comes from a shortcut.'),
    m2t5Cite('Manheim and Garrabrant, 2018', m2t5Sources.goodhart),
    _).id('selection-pressure-and-goodhart-effects'));
prose(
    'A shortcut shows that success on the development criterion can coexist with failure of the intended generalization. What happens to the relationship between measured success and the target when we increasingly select or optimize for that criterion?',
    _,
    'Manheim and Garrabrant categorize variants of this phenomenon by which the relationship between the intended target and the proxy can become less reliable under selection pressure. Goodhart effects are about how proxy-based selection can separate measured success from the target. Measured improvements may simply overstate genuine improvements.',
    _,
    'From the paper, there are several ways this can happen: regressional, extremal, causal, and adversarial. Not every shortcut leads to a Goodhart effect, not every Goodhart effect comes from a shortcut, and the taxonomy is neither mutually exclusive nor exhaustive.',
);

// 10
add(slide('Regressional: selecting favorable error',
    m2t5Math('$M_i=G_i+\\eta_i$', 32),
    m2t5Small('Illustrative example: an aligned criterion with measurement noise.'),
    parentCenter(table(
        [m2t5Cell(bold('Candidate'), 160, 25),
        m2t5Cell(bold('Target $G_i$'), 160, 25),
        m2t5Cell(bold('Noise $\\eta_i$'), 210, 25),
        m2t5Cell(bold('Measured $M_i$'), 210, 25)],
        [m2t5Cell('A', 160, 26), m2t5Cell('70', 160, 26),
        m2t5Cell('$-2$', 210, 26), m2t5Cell('68', 210, 26)],
        [m2t5Cell('B', 160, 26), m2t5Cell('70', 160, 26),
        m2t5Cell('$+1$', 210, 26), m2t5Cell('71', 210, 26)],
        [m2t5Cell('C', 160, 26), m2t5Cell('70', 160, 26),
        m2t5Cell('$+4$', 210, 26), m2t5Cell(bold('74'), 210, 26)],
    ).margin(22, 10).xjustify('l')),
    pause(),
    m2t5Card('Selecting C also selects its favorable measurement error.', 27),
    _));
prose(
    'Regressional effects can exploit favorable measurement errors to select extreme proxy values. This selection goes beyond genuine target performance. Suppose the target and proxy are related by $M=G+\\eta$ where $\\eta$ is measurement noise. A high measured score could reflect target performance improvement or "lucky" measurement error.',
    _,
    'The table is a deliberately simplified illustration. All three candidates have the same target score. Selecting the largest measured score selects candidate C, whose apparent advantage is entirely favorable measurement error.',
    _,
    'This illustration isolates estimation rather than construct validity. In a real selection problem, both genuine differences and measurement error can contribute to the winning score. Independent remeasurement can help assess how much of the reported advantage persists.',
);

// 11
add(slide('Extremal: beyond the supported relationship',
    parentCenter(table(
        [m2t5Cell(bold('Supporting region'), 240, 27),
        m2t5Cell('The proxy-target relationship is supported among ordinary candidates.', 610, 27)],
        [m2t5Cell(bold('Selected region'), 240, 27),
        m2t5Cell('Strong selection favors candidates with unusually high proxy values.', 610, 27)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t5Card('Does the relationship still hold in the region selection reaches?', 28),
    m2t5Small('The relevant extrapolation can be over model space, not only input space.'),
    _));
prose(
    'Extremal effects can occur when selection operates over regions of the model space, beyond just input space, where the proxy-target relationship differs from ordinary conditions. This might happen when an inference relies on extrapolation beyond the supporting region of the development data.',
    _,
    'The issue is not necessarily a noisy estimate of an otherwise adequate criterion. The relationship may change in the selected region even if the proxy is measured accurately. Target measurements in that region are needed to investigate whether the earlier relationship extends there.',
);

// 12
add(slide('Causal: changing the proxy is not changing the target',
    m2t5Text('Example: a rideshare app reports the expected wait for a driver.', 27),
    parentCenter(table(
        [m2t5Cell(bold('Observation'), 210, 27),
        m2t5Cell('A shorter displayed wait can be associated with a shorter actual wait.', 640, 27)],
        pause(),
        [m2t5Cell(bold('Intervention'), 210, 27),
        m2t5Cell('Simply display a shorter wait time. This does not make them arrive any faster.', 640, 27)],
    ).margin(18, 22).xjustify('l')),
    m2t5Card('An observational relationship may not survive an intervention aimed at improving the proxy.', 27),
    _));
prose(
    'Causal effects show up when an intervention changes the relationship on which the proxy\'s interpretation depends. Just because there is an observational relationship between proxy and target does not mean intervening to improve the proxy has the intended effect on the target.',
    _,
    'For example, simply displaying a shorter wait time on a rideshare app does not actually make a driver arrive faster. The displayed number and actual arrival must be distinguished. Evidence about an intervention should measure what happens to the target, not merely verify that the proxy changed.',
);

// 13
add(slide('Adversarial: another optimizer exploits the criterion',
    parentCenter(table(
        [m2t5Cell(bold('Evaluator'), 210, 27),
        m2t5Cell('Uses a criterion to select for an intended target.', 640, 27)],
        [m2t5Cell(bold('Other optimizer'), 210, 27),
        m2t5Cell('Has different goals and exploits that criterion.', 640, 27)],
    ).margin(18, 24).xjustify('l')),
    pause(),
    m2t5Card('Measured success can increase without the corresponding improvement the evaluator intended.', 28),
    m2t5Small('Optimization alone does not establish an adversarial mechanism.'),
    _));
prose(
    'Adversarial effects happen when another optimizer with different goals exploits the criterion. This can increase measured success without the corresponding improvement the evaluator intended.',
    _,
    'To support this explanation, identify the other optimizer, its goals, and how its behavior exploits the criterion. Ordinary selection for a high score, or a single favorable measurement error, does not by itself establish this mechanism. Mechanisms may overlap, and the available evidence may leave the classification unresolved.',
);

// 14
add(slide('A mechanism needs an explanation and evidence',
    parentCenter(table(
        [m2t5Cell(bold('Mechanism'), 195, 24),
        m2t5Cell(bold('Distinguishing evidence to seek'), 655, 24)],
        [m2t5Cell('Regressional', 195, 25),
        m2t5Cell('Independent remeasurement of the selected candidates and their apparent advantages.', 655, 25)],
        [m2t5Cell('Extremal', 195, 25),
        m2t5Cell('Target measurements in the unusually high-proxy region reached by selection.', 655, 25)],
        [m2t5Cell('Causal', 195, 25),
        m2t5Cell('An intervention that distinguishes changing the proxy from changing the target.', 655, 25)],
        [m2t5Cell('Adversarial', 195, 25),
        m2t5Cell('Another optimizer\'s goals and behavior exploiting the criterion.', 655, 25)],
    ).margin(18, 12).xjustify('l')),
    m2t5Small('These are diagnostic directions, not a mutually exclusive or exhaustive checklist.'),
    m2t5Cite('Mechanisms: Manheim and Garrabrant, 2018', m2t5Sources.goodhart),
    _));
prose(
    'A classification should follow from an explanation of the selection process, not from a disappointing score alone. The observations listed here are ways to investigate and distinguish explanations; none is a mechanical test that uniquely identifies a mechanism.',
    _,
    'Doing a Goodhart classification does not replace specifying a harm scenario. Specifying the harm scenario would additionally identify what is selected, the criterion, and how the resulting behavior could contribute to the unsafe control action.',
);

// 15
m2t5Roadmap(2);

// 16
add(slide('A leaderboard becomes part of development',
    m2t5Text('A finite, reusable benchmark supplies feedback for repeated development choices.', 27),
    parentCenter(m2t5LeaderboardDiagram()),
    m2t5Small('The examples and item labels are not public: reported scores can supply feedback.'),
    _).id('a-leaderboard-becomes-part-of-development'));
prose(
    'Leaderboards and benchmarks estimate performance with respect to a specified task distribution. A fresh held-out benchmark can estimate this target under the sampling and independence assumptions from the previous meeting. However, in practice, performance on a finite and reusable evaluation set is often used as a proxy.',
    _,
    'One selection pressure in this setting is that researchers or automated searches may repeatedly choose and revise models using reported scores. Importantly, the examples or item labels themselves are not be public.',
);

// 17
add(slide('The winner is no longer independent of the benchmark',
    parentCenter(table(
        [m2t5Cell(bold('Original argument'), 235, 26),
        m2t5Cell('Evaluate a predictor fixed independently of the held-out examples.', 615, 26)],
        [m2t5Cell(bold('After reuse'), 235, 26),
        m2t5Cell('The selected predictor depends on the benchmark through reported scores.', 615, 26)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t5Card('Selecting the best reported score can also select favorable estimation noise.', 28),
    m2t5Small('The original held-out argument no longer applies without an argument accounting for selection.'),
    _));
prose(
    'Repeated selection can result in a failure mode where selecting the best model implicitly selects favorable estimation noise rather than better population performance. This means the evaluation set is no longer independent of the selected predictor, so the simple held-out argument for generalization no longer applies without an additional argument accounting for selection.',
    _,
    'In the ordering example, an overoptimistic score can favor a predictor whose error under the ordering conditions is higher than reported. Score inflation here is upstream of the harm scenario. It does not by itself establish an incorrect substitute choice or an unwanted charge.',
);

// 18
add(slide('The Ladder limits informative feedback',
    m2t5Text('Instead of releasing every exact candidate score:', 28),
    parentCenter(table(
        [m2t5Cell('1', 40, 28),
        m2t5Cell('Update the reported best-so-far score only for sufficiently large improvements.', 800, 28)],
        [m2t5Cell('2', 40, 28),
        m2t5Cell('Round the released value.', 800, 28)],
    ).margin(16, 22).xjustify('l')),
    pause(),
    m2t5Card('Limit informative feedback to control leaderboard estimation error.', 28),
    m2t5Small('The bound depends on the mechanism and its statistical assumptions.'),
    m2t5Cite('Blum and Hardt, ICML 2015', m2t5Sources.ladder),
    _));
prose(
    'One way to address this failure mode is to update the reported best-so-far score only for sufficiently large improvements over the previous report, and round the released value. This is the "Ladder" mechanism proposed in Blum and Hardt\'s paper.',
    _,
    'The mechanism limits informative feedback and can bound the leaderboard estimation error under the method\'s statistical assumptions. This is a high-level description, not a complete implementation: arbitrary rounding or an arbitrary improvement threshold does not inherit the paper\'s guarantee.',
    _,
    'Controlling leaderboard estimation error does not establish that the benchmark measures the intended construct or that the system using the predictor prevents harm.',
);

// 19
add(slide('What would repair the leaderboard claim?',
    m2t5Text(bold('Requirement: account for adaptive selection in reported prediction error.'), 27),
    parentCenter(table(
        [m2t5Cell(bold('Evidence to seek'), 225, 26),
        m2t5Cell('Fresh independent evaluation of the selected predictor, or a justified selection-aware bound; report uncertainty.', 625, 26)],
        [m2t5Cell(bold('Not established alone'), 225, 26),
        m2t5Cell('Construct validity, correct order execution, or effective customer confirmation.', 625, 26)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t5Card('Repairing estimation does not automatically repair the criterion.', 28),
    _));
prose(
    'The proposed requirement is to account for adaptive selection in reported prediction error. Evidence could be fresh independent evaluation or a justified selection-aware bound, with uncertainty reported.',
    _,
    'Fresh evaluation requires a predictor fixed independently of those new examples. If the new results are themselves used to revise or select the predictor, that use must again be accounted for.',
    _,
    'Neither fresh data nor a selection-aware bound establishes construct validity, order execution, or effective customer confirmation. The population and measured criterion must still match the intended claim.',
);

// 20
add(slide('From food comparisons to response comparisons',
    m2t5Text('Replace food alternatives with LLM responses $(R_1,R_2)$ to the same prompt $c$.', 28),
    m2t5Text('A shared scoring function $r_\\phi(c,R)$ predicts recorded preferences:', 27),
    m2t5Math('$\\Pr_\\phi(R_1\\succ R_2\\mid c)=\\sigma\\!\\left(r_\\phi(c,R_1)-r_\\phi(c,R_2)\\right)$', 30),
    m2t5Math('$\\sigma(t)=\\frac{1}{1+e^{-t}}$', 29),
    pause(),
    m2t5Card('This is preference-model fitting, as in the Bradley-Terry example.', 28),
    _));
prose(
    'Reinforcement learning from human feedback (RLHF) trains a large language model (LLM) using a learned preference model. Reinforcement learning will be discussed in more depth in the next module. For this example, replace the food alternatives with a pair of LLM responses $(R_1,R_2)$ to the same prompt $c$, and collect recorded preferences between them.',
    _,
    'Here the target is response quality under the intended task criterion. The proxy is the learned scalar reward score. From the previous note, this can be formulated as maximum likelihood estimation of a shared scoring function $r_\\phi(c,R)$ assigning scores to each response $R$ given prompt $c$, followed by a logistic map that takes the score difference and converts it to a preference probability.',
);

// 21
add(slide('The fitted score becomes an objective',
    parentCenter(table(
        [m2t5Cell(bold('Fit the preference model'), 265, 27),
        m2t5Cell('Recorded comparisons determine a scoring function $r_\\phi$.', 585, 27)],
        pause(),
        [m2t5Cell(bold('Optimize against its score'), 265, 27),
        m2t5Cell('Downstream optimization changes the language-model policy and the responses it produces.', 585, 27)],
    ).margin(18, 23).xjustify('l')),
    m2t5Card('Predicting recorded comparisons well and providing a useful objective for downstream use are separate claims.', 27),
    m2t5Small('The selected object has changed. Policy optimization is developed in Module 3.'),
    _));
prose(
    'This is preference-model fitting. Downstream of this, an optimization procedure tunes the LLM using the resulting preference model. Notice the distinction: predicting recorded comparisons well and providing a useful objective for downstream use are separate claims.',
    _,
    'One selection pressure in this setting is that policy optimization favors responses receiving higher predicted reward. Notice the shift from which predictor we obtain to which outputs the system actually produces.',
    _,
    'If some superficial feature predicts preference judgments in the training comparisons, the reward model may rely on it. This can result in improvements that increase reward without increasing quality. That is a possible failure mode, not something established merely by observing optimization.',
);

// 22
add(slide('Length in RLHF: what did the study establish?',
    m2t5Text(bold('In the settings studied by Singhal et al.:'), 26),
    parentCenter(table(
        [m2t5Cell(bold('Reward improvement'), 245, 25),
        m2t5Cell('Increasing response length accounts for much of the reward improvement.', 605, 25)],
        [m2t5Cell(bold('Measured preferences'), 245, 25),
        m2t5Cell('A length-based reward reproduces much of the measured preference improvement.', 605, 25)],
    ).margin(18, 19).xjustify('l')),
    pause(),
    m2t5Card('This evidence of selection pressure goes beyond length correlation.', 27),
    m2t5Small('However, it does not establish longer responses are worse or that harm occurs.'),
    m2t5Cite('Singhal et al., A Long Way to Go', m2t5Sources.length),
    _));
prose(
    'Singhal et al. investigate this in practice through observational comparisons and interventions on the RLHF pipeline.',
    _,
    'Specifically, in their studied settings, increasing response length accounts for much of the reward improvement, and a length-based reward reproduces much of the measured preference improvement.',
);

// 23
add(slide('Intervene where the behavior originates',
    parentCenter(table(
        [m2t5Cell(bold('Preference data'), 230, 25),
        m2t5Cell('Intervene on the comparisons used for fitting.', 620, 25)],
        [m2t5Cell(bold('Reward modeling'), 230, 25),
        m2t5Cell('Intervene on how the scoring function is learned.', 620, 25)],
        [m2t5Cell(bold('Optimization'), 230, 25),
        m2t5Cell('Intervene on how the fitted score is optimized.', 620, 25)],
    ).margin(18, 17).xjustify('l')),
    pause(),
    m2t5Text('A hard output-length cap limits length; a soft penalty does not impose a hard bound.', 27),
    m2t5Small('No intervention worked uniformly across the paper\'s settings. Determining where to intervene requires additional evidence.'),
    m2t5Cite('Singhal et al., A Long Way to Go', m2t5Sources.length),
    _));
prose(
    'One way to investigate this failure mode is to intervene on preference data, reward modeling, and optimization. In the paper, these interventions provide empirical evidence about where length-related behavior originates and which changes reduce it, not a general guarantee on response quality. No intervention works uniformly across their settings.',
    _,
    'Another approach is to cap the response length, which directly limits length. Imposing only a soft penalty can discourage behavior but does not necessarily produce a hard bound. Measuring the effectiveness of a proposed constraint requires additional supporting evidence.',
    _,
    'The main takeaway is that a particular failure mode may originate as one part of a larger development pipeline. This example transfers the proxy analysis beyond food ordering; a separate harm scenario still requires specifying the system using the responses, its relevant control actions, and the conditions under which those actions could lead to harm.',
);

// 24
add(slide('Return to the unwanted-charge scenario',
    m2t5Text('Selection can change which predictor is installed in the ordering controller.', 27),
    parentCenter(m2t5HarmPath()),
    pause(),
    parentCenter(table(
        [m2t5Cell(bold('Development'), 185, 24),
        m2t5Cell('Audit intended choices independently of the proxy; evaluate the selected predictor on fresh data.', 665, 24)],
        [m2t5Cell(bold('System control'), 185, 24),
        m2t5Cell('Require confirmation before commitment; inspect confirmation, order, and charge records.', 665, 24)],
    ).margin(18, 16).xjustify('l')),
    m2t5Small('Evidence for one intervention does not establish the other. Confirmation is proposed, not baseline.'),
    _));
prose(
    'In the ordering system, selection can affect which predictor enters the controller and why its development evidence may be insufficient. An overoptimistic score can favor a predictor whose error under the ordering conditions is higher than reported; a construct-validity gap can persist even when the criterion is estimated accurately.',
    _,
    'Trace the resulting behavior through the existing harm scenario. The predictor selects an unwanted substitute. The ordering controller submits that choice while the order can become nonrefundable before effective correction: the unsafe control action occurs in this context, not in the prediction alone. The merchant then commits the charge before effective customer correction.',
    _,
    'A development intervention can change the predictor or the evidence about it. It does not by itself change automatic submission, merchant commitment, or feedback timing. A proposed confirmation control changes the system, but requires evidence that confirmation concerns the current order and is enforced before nonrefundable commitment. Neither type of evidence supplies the other.',
);

// 25-29: retain the discussion source and wording unchanged.
add(slide('Discussion: extend the ordering analysis',
    m2t5Card('The ordering platform decides to use customer cancellation requests as additional data for repeated selection of the food-choice predictor.', 28),
    _));
prose(
    'Carry this setting through all four questions. Retain the same customer, intended matched-freshness preference, and baseline ordering controller from the previous meeting.',
    _,
    'The setting leaves open exactly how cancellation requests enter selection. State a plausible interpretation and keep it explicit. A cancellation request is not automatically a preference label; absence of a request can reflect late notice or difficulty requesting cancellation. A request and a successful cancellation are also different observations.',
);

add(slide('Discussion: target, criterion, and selection',
    m2t5Card('Identify the model-level target, measured criterion, and object selected. Is the gap estimation, construct validity, or both?', 28),
    _));
prose(
    'Distinguish the intended prediction target from the chosen use of cancellation data and from the predictor selected. Finite-sample estimation and construct validity are separate questions. Accurately estimating cancellation behavior does not establish accurate prediction of intended food preference.',
);

add(slide('Discussion: Goodhart mechanisms',
    m2t5Card('Which Goodhart mechanism does the explanation support? What evidence would distinguish an alternative?', 28),
    _));
prose(
    'Use the explanation developed in the preceding answer. The setting alone does not identify a unique Goodhart mechanism, or establish that a Goodhart effect has occurred.',
    _,
    'Repeated selection can favor favorable estimation noise; dependence of cancellation observations on ordering and feedback can instead undermine the criterion even when measured accurately. Explain the supported mechanism, allow overlapping mechanisms or insufficient evidence, and propose observations that distinguish alternatives.',
);

add(slide('Discussion: the harm scenario',
    m2t5Card('Place the mechanism into the previous harm scenario. Which causal step changes, and which control actions and feedback conditions remain unchanged?', 28),
    _));
prose(
    'Changing development data or selection can change which predictor is installed in the ordering controller. It does not by itself change automatic submission, merchant commitment, or whether notice and correction arrive in time.',
    _,
    'Trace the proposed model behavior through the unsafe ordering action to the unwanted charge. Do not treat score inflation or a cancellation request alone as proof that the harm occurred.',
);

add(slide('Discussion: interventions and evidence',
    m2t5Card('Propose one development intervention and one system-control intervention. For each, state the evidence needed and what it would not establish alone.', 28),
    _));
prose(
    'A development intervention might audit intended choices independently of whether customers requested cancellation, or reserve independent evaluation after selection. Its evidence must match the intended population and construct.',
    _,
    'A system-control intervention might require explicit confirmation before nonrefundable commitment. Evidence must address the current order, actual enforcement, and failure cases such as delayed or missing confirmation. Neither intervention supplies the evidence needed for the other.',
);

// 30
add(slide('From selection to behavior under changed conditions',
    m2t5Small('Discussion reminder: cancellation requests, successful cancellations, and preference labels are different observations.'),
    parentCenter(table(
        [m2t5Cell(bold('Selection'), 220, 26),
        m2t5Cell('Which predictor or outputs does the measured criterion favor?', 630, 26)],
        [m2t5Cell(bold('Next: robustness'), 220, 26),
        m2t5Cell('Hold the predictor fixed. Which changed conditions can it tolerate?', 630, 26)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t5Card('Which conditions support the evidence, and does the intended claim extend beyond them?', 28),
    m2t5Small('A fixed predictor does not remove optimization: an adversary may still optimize its inputs.'),
    _));
prose(
    'Selection can affect the predictor and which outputs from the pipeline are obtained. The examples demonstrate how optimization pressure can exploit estimation error or the gap between the intended target and proxy. In the ordering system, this can affect which predictor enters the controller and why its development evidence may be insufficient.',
    _,
    'Testing for consequential underspecification and understanding how shortcut learning and Goodhart effects can exploit such gaps is a foundation for understanding how to address such failure modes.',
    _,
    'In the next note, we hold the predictor fixed and ask which changed conditions it can tolerate. This does not remove optimization: an adversary may still optimize the inputs presented to the fixed predictor. We revisit the shared assurance question: which conditions support the evidence, and does the intended claim extend beyond them?',
);