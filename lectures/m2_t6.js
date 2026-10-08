G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 2, meeting 6: robustness beyond the development distribution.
// Canonical note: notes/m2_t6.md.
// Retain the existing September 30 discussion setting and questions unchanged.
// Ticket extraction: worksheets/configs/m2_t6.json.
// Local draft: review slides and public speaker notes before publication.
// Explicit slide assets:
//   notes/images/gender_shade_table.png
//   notes/images/reliability_example_plot.png

function m2t6Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m2t6Card(message, size) {
    return parentCenter(frameBox(m2t6Text(message, size || 28, 860)).padding(16));
}


function m2t6Cell(message, width, size) {
    return m2t6Text(message, size || 25, width);
}

function m2t6Math(message, size) {
    return parentCenter(m2t6Text(message, size || 30, 920));
}

function m2t6Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

var m2t6Sources = {
    gender: 'https://proceedings.mlr.press/v81/buolamwini18a.html',
    adversarial: 'https://arxiv.org/abs/1412.6572',
    calibration: 'https://arxiv.org/abs/1906.02530',
};

function m2t6Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['specify-the-robustness-claim', 'Distribution shift: which mixtures?'],
        ['from-reweighting-to-targeted-inputs', 'Adversarial inputs: which transformations?'],
        ['what-does-a-reported-probability-mean', 'Calibration: which probability-outcome relationships?'],
    ]).id('m2t6-roadmap-' + selected));
    prose([
        'Start with shifts that change the prevalence of familiar groups.',
        'Now let an adversary target the predictor by changing individual inputs.',
        'Calibration restricts probability-outcome relationships. Which shifts preserve that restriction?',
    ][selected]);
}

// Native diagram coordinates work in both the browser and TeX backends.
function m2t6At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m2t6Box(lines, x, y, width, height) {
    var contents = ytable.apply(null, lines.map(function (message) {
        return nowrapText(message).fontSize(22);
    })).center().ymargin(4);
    return overlay(
        m2t6At(rect(width, height).fillColor('#F6F6F6')
            .strokeColor('#777777').strokeWidth(1.5), x, y),
        transform(contents).pivot(0, 0)
            .shift(x + width / 2, sfig.downSign * (y + height / 2)),
    );
}

function m2t6Segment(x1, y1, x2, y2, headed) {
    return (headed ? arrow : line)([x1, sfig.downSign * y1],
        [x2, sfig.downSign * y2]).strokeWidth(2);
}

function m2t6GateDiagram() {
    return overlay(
        rect(940, 280).strokeWidth(0).fillColor('white'),
        m2t6Box(['Fixed predictor', 'Choice + confidence'], 20, 100, 245, 80),
        m2t6Box(['Confidence', 'above threshold?'], 340, 100, 240, 80),
        m2t6Box(['Yes:', 'Automatic route'], 690, 20, 230, 80),
        m2t6Box(['No:', 'Confirm first'], 690, 190, 230, 80),
        m2t6Segment(265, 140, 340, 140, true),
        m2t6Segment(580, 140, 630, 140),
        m2t6Segment(630, 140, 630, 60),
        m2t6Segment(630, 60, 690, 60, true),
        m2t6Segment(630, 140, 630, 230),
        m2t6Segment(630, 230, 690, 230, true),
    ).recMouseShowHide(false);
}

function m2t6MarginDiagram() {
    // Input coordinates have their second axis pointing upward.
    // Example: y = +1, w = (1, 1); the origin lies on the diagonal boundary.
    var parts = [
        rect(440, 325).strokeWidth(0).fillColor('white'),
    ];
    function label(message, x, y, size, color) {
        parts.push(m2t6At(nowrapText(message).fontSize(size || 23)
            .strokeColor(color || '#222222'), x, y));
    }
    function segment(x1, y1, x2, y2, color, headed, width) {
        parts.push(m2t6Segment(x1, y1, x2, y2, headed)
            .strokeColor(color).strokeWidth(width || 2));
    }

    label('Input space ($y=+1$)', 14, 4, 22);

    // Boundary and the axis-aligned infinity-norm ball around x.
    segment(38, 56, 284, 302, '#333333', false, 2.5);
    parts.push(m2t6At(rect(108, 108).fillColor('#EAF2F8')
        .strokeColor('#245A81').strokeWidth(2), 248, 94));

    // The gray dimension arrow is perpendicular to the boundary.
    // Its dashed extension ends at x, so its length is m / ||w||_2.
    segment(138, 156, 224, 70, '#777777', true, 2);
    segment(146, 164, 154, 156, '#777777', false, 1.2);
    segment(154, 156, 146, 148, '#777777', false, 1.2);
    for (var k = 0; k < 78; k += 12) {
        var end = Math.min(k + 6, 78);
        segment(224 + k, 70 + k, 224 + end, 70 + end,
            '#999999', false, 1.2);
    }
    label('Margin', 93, 39, 20, '#555555');
    label('$m/\\|w\\|_2$', 84, 65, 23, '#555555');

    // For this w, the worst-case edit points to the lower-left corner.
    segment(302, 148, 248, 202, '#B45F06', true, 3);
    parts.push(transform(circle(4.5).fillColor('#222222').strokeWidth(0))
        .pivot(0, 0).shift(302, sfig.downSign * 148));
    label('$x$', 314, 124, 26);
    label('$x+\\eta^*$', 272, 211, 24, '#B45F06');

    label('Decision boundary', 15, 235, 22);
    label('$w^\\top u=0$', 49, 267, 24);
    label('Perturbation box', 270, 239, 22, '#245A81');
    label('$\\|\\eta\\|_\\infty\\le\\epsilon$', 289, 269, 24, '#245A81');
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// 1
add(titleSlide('Lecture 6: Robustness Beyond the Development Distribution',
    nil(),
    parentCenter(m2t6Text(
        'CS120: Introduction to AI Safety - October 8, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(0.95));
prose(
    'Previous lectures examined risk under a fixed distribution and how development selects a predictor. Now ask which changed deployment conditions the predictor can tolerate. The central choice is the uncertainty set: which distributions does our claim cover?',
);

// 2
add(slide('Same predictor, changed conditions',
    parentCenter(ytable(
        foodOrderingControlDiagram({ focus: 'predictor' }).scale(0.64),
        m2t6Text('Hold the predictor fixed. Which changes in deployment can alter its performance?', 28, 920),
    ).center().ymargin(10)),
    _));
prose(
    'Keep the same customer and intended choice between equally priced alternatives of comparable, acceptable freshness. The baseline automatically submits the predicted substitute. Harm occurs when the customer is charged for the unwanted alternative; the hazard is commitment without effective correction. The safety constraint is to prevent that nonrefundable purchase. Confirmation remains a proposed control.',
);

// 3
add(slide('The uncertainty set',
    m2t6Text('Which deployment distributions does the claim cover?', 30),
    parentCenter(table(
        [m2t6Cell(bold('Group mixtures'), 245, 27),
        m2t6Cell('Allow familiar groups to occur in different proportions.', 605, 27)],
        [m2t6Cell(bold('Adversarial inputs'), 245, 27),
        m2t6Cell('Allow targeted changes to individual inputs.', 605, 27)],
        [m2t6Cell(bold('Calibration'), 245, 27),
        m2t6Cell('Require reported probabilities to agree with outcome frequencies.', 605, 27)],
    ).margin(18, 18).xjustify('l')),
    m2t6Card('Assuming calibration restricts the distributions covered. It does not make arbitrary shifts safe.', 27),
    _));
prose(
    'An uncertainty set specifies possible deployment distributions. Calibration adds a restriction on probability-outcome relationships, not a mechanism that prevents shift. We will ask whether group reweighting and targeted input changes preserve the assumptions supporting a claim.',
);

// 4
m2t6Roadmap(0);

// 5
add(slide('Specify the robustness claim',
    m2t6Text('Fix $\\hat\\theta$. Evaluate prediction error against the intended-choice labels under deployment distribution $S^{\\prime}$.', 26),
    m2t6Math('$R_{S^{\\prime}}(\\hat\\theta)=\\mathbb{E}_{(x,z,y)\\sim S^{\\prime}}[\\ell_{01}(\\hat y_{\\hat\\theta}(x,z),y)]$', 29),
    pause(),
    m2t6Card('For every shift in the specified family:', 27),
    m2t6Math('$\\forall S^{\\prime}\\in\\mathcal U:\\quad R_{S^{\\prime}}(\\hat\\theta)\\le\\tau.$', 33),

    _).id('specify-the-robustness-claim'));
prose(
    'Source-distribution evidence does not automatically transfer to deployment. Specify the family $\\mathcal U$ and tolerance $\\tau$. Here risk measures prediction error against intended-choice labels, not training log loss or unwanted charges. The tolerance needs justification, and writing a requirement does not establish that it holds.',
);

// 6
add(slide('A shift can change the weighting of familiar groups',
    m2t6Text('Freshness matched and unmatched categories:', 25),
    parentCenter(table(
        [m2t6Cell(bold('Group'), 240, 24),
        m2t6Cell(bold('Group error'), 170, 24),
        m2t6Cell(bold('Source weight'), 185, 24),
        m2t6Cell(bold('Shifted weight'), 185, 24)],
        [m2t6Cell('Unmatched Category', 240, 26),
        m2t6Cell('2%', 170, 26), m2t6Cell('95%', 185, 26), m2t6Cell('50%', 185, 26)],
        [m2t6Cell('Matched Category', 240, 26),
        m2t6Cell('20%', 170, 26), m2t6Cell('5%', 185, 26), m2t6Cell('50%', 185, 26)],
        pause(),
        [m2t6Cell(bold('Aggregate error'), 240, 25),
        m2t6Cell('', 170, 25), m2t6Cell(bold('2.9%'), 185, 26),
        m2t6Cell(bold('11%'), 185, 26)],
    ).margin(18, 14).xjustify('l')),

    _));
prose(
    'The prevelance of groups can shift from the training data i.e. predictor is used for substitution. Source error is $0.95(0.02)+0.05(0.20)=0.029$; shifted error is $0.50(0.02)+0.50(0.20)=0.11$. A familiar but difficult category becomes more common.',
);

// 7
add(slide('Better in both groups, worse overall',
    m2t6Text('Suppose you do stratified evals + DRO. Deployment distribution changes still:', 26),
    parentCenter(table(
        [m2t6Cell(bold('Group'), 155, 24),
        m2t6Cell(bold('Error before'), 190, 24),
        m2t6Cell(bold('Error after'), 190, 24),
        m2t6Cell(bold('Weight: before / after'), 290, 24)],
        [m2t6Cell('Unmatched Category', 155, 25),
        m2t6Cell('2%', 190, 27), m2t6Cell('1%', 190, 27),
        m2t6Cell('95% / 50%', 290, 27)],
        [m2t6Cell('Matched Category', 155, 25),
        m2t6Cell('20%', 190, 27), m2t6Cell('12%', 190, 27),
        m2t6Cell('5% / 50%', 290, 27)],
        pause(),
        [m2t6Cell(bold('Aggregate'), 155, 24),
        m2t6Cell(bold('2.9%'), 190, 27),
        m2t6Cell(bold('6.5%'), 190, 27),
        m2t6Cell('', 290, 27)],
    ).margin(18, 14).xjustify('l')),
    m2t6Card('Simpson\'s paradox: different mixtures reverse the aggregate comparison.', 28),
    _));
prose(
    'Now suppose you do stratified evaluation + DRO and improve both group errors. Aggregate error rises from 2.9% to 6.5%! Under the original fixed weights, the improved predictor instead has 1.55% error. The reversal comes from comparing different mixtures, not from improvement making either group worse.',
);

// 8
add(slide('Robust optimization changes the selection objective',
    m2t6Text(bold('Average-risk objective'), 27),
    m2t6Math('$\\min_\\theta R_S(\\theta)$', 32),
    pause(),
    m2t6Text(bold('Distributionally robust objective'), 27),
    m2t6Math('$\\min_\\theta\\sup_{S^{\\prime}\\in\\mathcal U}R_{S^{\\prime}}(\\theta)$', 32),
    m2t6Card('Specifying $\\mathcal U$ defines which changes the robustness claim covers.', 27),
    _));
prose(
    'DRO selects for worst-case risk over a specified uncertainty set rather than average source risk. This is a development objective, not a population guarantee: estimation and optimization error remain. We then evaluate the selected predictor with its parameters fixed.',
);

// 9
add(slide('For group mixtures, the worst group determines risk',
    m2t6Text('Let $S_g$ be fixed within-group distributions. Allow every mixture:', 26),
    m2t6Math('$\\mathcal U_{\\mathrm{group}}=\\left\\{\\sum_{g=1}^m q_gS_g:q_g\\ge0,\\ \\sum_{g=1}^m q_g=1\\right\\}$', 29),
    m2t6Math('$R_{\\sum_gq_gS_g}(\\hat\\theta)=\\sum_gq_gR_{S_g}(\\hat\\theta)$', 31),
    pause(),
    m2t6Math('$\\sup_{S^{\\prime}\\in\\mathcal U_{\\mathrm{group}}}R_{S^{\\prime}}(\\hat\\theta)=\\max_gR_{S_g}(\\hat\\theta)$', 31),

    _));
prose(
    'Expected loss is linear in mixture weights. A weighted average cannot exceed the largest group risk, and placing all weight on that group attains it. The identity requires all mixtures of fixed within-group distributions; restricted weights or within-group changes define different families.',
);

// 10
add(slide('What evidence covers every mixture?',
    parentCenter(table(
        [m2t6Cell(bold('Evidence'), 220, 26),
        m2t6Cell('Simultaneously valid upper bounds establish $R_{S_g}(\\hat\\theta)\\le\\tau$ for every group.', 630, 26)],
        [m2t6Cell(bold('Scope'), 220, 26),
        m2t6Cell('The predictor, within-group distributions, labels, and evaluation loss match the claim.', 630, 26)],
        [m2t6Cell(bold('Estimation challenge'), 220, 26),
        m2t6Cell('Small groups can have substantial uncertainty even when observed error is low.', 630, 26)],
    ).margin(18, 19).xjustify('l')),
    pause(),
    m2t6Card('Stratified evaluation estimates group risk; group DRO uses group losses to select a predictor.', 27),
    _));
prose(
    'Simultaneous group-risk bounds transfer to every allowed mixture, at their joint confidence level. Separate intervals need not provide joint coverage. Use held-out evaluation or a selection-aware argument if data helped choose the predictor. Small-group uncertainty remains important; prediction bounds do not establish ordering controls.',
);

// 11
add(slide('Gender Shades: disaggregate performance',
    parentCenter(ytable(
        image('notes/images/gender_shade_table.png').width(850),
        m2t6Text('Commercial binary gender classification, evaluated across annotated gender and skin-tone groups.', 22, 920),
    ).center().ymargin(10)),

    m2t6Cite('Buolamwini and Gebru, Gender Shades, 2018', m2t6Sources.gender),
    _));
prose(
    'The table reports accuracy and exposes subgroup disparities hidden by aggregation. If the groups are representative, the worst-performing group determines worst-case performance in deployment.',
);

// 12
m2t6Roadmap(1);

// 13
add(slide('From reweighting to targeted inputs',
    m2t6Text('Reweighting changes which cases arrive. An adversary can change the case itself to exploit the predictor.', 29),
    parentCenter(table(
        [m2t6Cell(bold('Ordering example'), 240, 27),
        m2t6Cell('Edit a food photograph so the fixed predictor selects the unwanted substitute.', 610, 27)],
        [m2t6Cell(bold('Robustness question'), 240, 27),
        m2t6Cell('Does the prediction remain correct under every allowed, label-preserving edit?', 610, 27)],
    ).margin(18, 24).xjustify('l')),
    m2t6Card('Define the allowed transformations before searching for an attack.', 29),
    _).id('from-reweighting-to-targeted-inputs'));
prose(
    'Group mixtures change prevalence without changing cases. An adversary instead tailors inputs to the predictor. In the ordering example, preserve the actual food and intended choice while changing its presentation. This motivates specifying the transformation set.',
);

// 14
add(slide('Specify what the adversary may change',
    m2t6Text('Here $x$ is the complete predictor input: the full comparison in the food example.', 26),
    m2t6Math('$\\tilde x=x+\\eta,\\qquad \\|\\eta\\|_\\infty\\le\\epsilon$', 32),
    parentCenter(table(
        [m2t6Cell(bold('Permitted changes'), 240, 26),
        m2t6Cell('Each coordinate can vary by at most $\\epsilon$, subject to valid-input constraints.', 610, 26)],
        [m2t6Cell(bold('Intended label'), 240, 26),
        m2t6Cell('Justify preservation of food identity, freshness, and the customer\'s intended choice.', 610, 26)],
    ).margin(18, 19).xjustify('l')),

    _).id('specify-what-the-adversary-may-change'));
prose(
    'The infinity-norm bound permits each input coordinate to vary by at most $\\epsilon$. Input validity and label preservation are additional requirements: a small norm alone proves neither. Changing the depicted food or obscuring freshness may change the task rather than test robustness.',
);

// 15
add(slide('Small coordinate changes can accumulate',
    m2t6Text('For the linear predictor $f_w(x)=\\operatorname{sign}(w^\\top x)$:', 27),
    m2t6Math('$w^\\top\\tilde x=w^\\top x+w^\\top\\eta$', 32),
    pause(),
    m2t6Math('$\\eta=\\epsilon\\operatorname{sign}(w)$', 32),
    m2t6Math('$w^\\top\\eta=\\epsilon\\sum_{i=1}^n|w_i|=\\epsilon\\|w\\|_1$', 32),

    m2t6Cite('Goodfellow et al., 2014', m2t6Sources.adversarial),
    _));
prose(
    'Aligning the perturbation with the weight signs accumulates a score increase of $\\epsilon\\|w\\|_1$, if that input is permitted. Many small coordinate changes can add up. Whether this harms correctness depends on the true label and distance to the decision boundary.',
);

// 16
add(slide('Can the perturbation cross the decision boundary?',
    parentCenter(xtable(
        ytable(
            m2t6Text('For a correctly classified input, the signed margin is $m=y\\,w^\\top x>0$.', 25, 455),
            nowrapText('$y\\,w^\\top(x+\\eta)\\ge m-\\epsilon\\|w\\|_1$').fontSize(27),
            pause(),
            m2t6Text(bold('Sufficient for unchanged classification:'), 25, 455),
            frameBox(nowrapText('$m>\\epsilon\\|w\\|_1$').fontSize(31)).padding(12),
            _).center().ymargin(24),
        pause(-1),
        m2t6MarginDiagram(),
        _).center().xmargin(35)),
    _));
prose(
    'For $y=+1$ and $w=(1,1)$, the square is the infinity-norm ball; the orange arrow is $\\eta^*=-\\epsilon\\operatorname{sign}(w)$. The gray arrow shows geometric distance $m/\\|w\\|_2$, not score $m$. Strict separation preserves classification. Correctness requires label preservation, and valid-input constraints can exclude the worst-case corner.',
);

// 17
add(slide('A failed search is not a certificate',
    parentCenter(table(
        [m2t6Cell(bold('Successful attack'), 235, 26),
        m2t6Cell('A permitted, label-preserving counterexample refutes the claimed invariance for that instance.', 615, 26)],
        [m2t6Cell(bold('Unsuccessful search'), 235, 26),
        m2t6Cell('The tested procedure did not find a counterexample within its search budget.', 615, 26)],
        [m2t6Cell(bold('Certificate'), 235, 26),
        m2t6Cell('A justified bound or verification covers every permitted perturbation in its stated scope.', 615, 26)],
    ).margin(18, 18).xjustify('l')),

    _));
prose(
    'Permitted transformations induce an uncertainty family. A successful, label-preserving attack supplies a counterexample; a failed search does not cover the family. A certificate covers its stated inputs and transformations, not automatically the whole population. Whether prediction errors become unwanted charges still depends on ordering and correction.',
);

// 18
m2t6Roadmap(2);

// 19
add(slide('What does a reported probability mean?',
    m2t6Text('If a predictor reports 0.9, does label $+1$ occur 90% of the time among those cases?', 28),
    m2t6Text('Calibration under $S$:', 27),
    m2t6Math('$\\Pr_S(Y=+1\\mid\\hat p(X)=p)=p$', 32),
    pause(),
    m2t6Text('For a binary predictor choosing the more probable label:', 27),
    m2t6Math('$C(X)=\\max\\{\\hat p(X),\\ 1-\\hat p(X)\\}$', 32),

    _));
prose(
    'Calibration matches reported probabilities to conditional outcome frequencies on the distribution\'s support. Label $+1$ denotes choosing the second alternative. Reporting 0.1 for that label gives confidence 0.9 in choosing the first. For binary argmax prediction, probability calibration implies selected-label calibration: among predictions with confidence $c$, fraction $c$ are correct.',
);

// 20
add(slide('Reading a reliability diagram',
    parentCenter(xtable(
        image('notes/images/reliability_example_plot.png').width(600),
        ytable(
            m2t6Text('Horizontal: mean predicted probability of label $+1$. Vertical: observed fraction of label $+1$.', 25, 350),
            m2t6Text('The diagonal represents agreement. Check the counts, uncertainty, and population behind each bin.', 25, 350),
        ).ymargin(24),
    ).center().xmargin(30)),
    _));
prose(
    'Each bin compares mean reported probability with observed label frequency. Selected-label confidence diagrams instead plot accuracy vertically. Binning hides within-bin variation, and sparse bins have high uncertainty. This figure illustrates the method; it is not an ordering-system measurement or an Ovadia et al. result.',
);

// 21
add(slide('Calibration does not imply discrimination',
    m2t6Text('Illustrative population: label $+1$ occurs in 70% of cases.', 28),
    parentCenter(table(
        [m2t6Cell(bold('Predictor'), 220, 28),
        m2t6Cell('Reports $\\hat p(X)=0.7$ for every input.', 630, 28)],
        [m2t6Cell(bold('Calibration'), 220, 28),
        m2t6Cell('Among cases receiving 0.7, label $+1$ occurs 70% of the time.', 630, 28)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t6Card('Perfectly calibrated, but unable to distinguish individual cases. Always selecting $+1$ gives 30% error.', 27),
    _));
prose(
    'A constant base-rate predictor can be perfectly calibrated without distinguishing cases. Here it always chooses $+1$, so its error is 30%. Calibration interprets probabilities; it does not imply accurate individual decisions. These are illustrative population quantities.',
);

// 22
add(slide('Calibration restricts the uncertainty set',
    m2t6Text('For a fixed probability predictor, define the calibrated distributions:', 27),
    m2t6Math('$\\mathcal U_{\\mathrm{cal}}=\\{S^{\\prime}:\\Pr_{S^{\\prime}}(Y=+1\\mid\\hat p(X)=p)=p\\}$', 28),
    pause(),
    m2t6Text('A claim assuming deployment calibration covers:', 28),
    m2t6Math('$S^{\\prime}\\in\\mathcal U\\cap\\mathcal U_{\\mathrm{cal}}$', 34),
    m2t6Card('Calibration on $S$ does not show that deployment lies in this smaller set.', 28),
    m2t6Cite('Ovadia et al., NeurIPS 2019', m2t6Sources.calibration),
    _));
prose(
    'The calibration equality holds almost surely over reported probabilities. Intersecting with $\\mathcal U_{\\mathrm{cal}}$ narrows a claim; it does not justify excluding plausible miscalibrated shifts. Ovadia et al. find that calibration often degrades under studied shifts. Calibration on the source is insufficient deployment evidence.',
);

// 23
add(slide('Reweighting can break pooled calibration',
    m2t6Text('A fixed predictor reports $\\hat p(X)=0.9$ for every case.', 28),
    parentCenter(table(
        [m2t6Cell(bold('Group'), 180, 24),
        m2t6Cell(bold('Frequency of $+1$'), 240, 24),
        m2t6Cell(bold('Source weight'), 195, 24),
        m2t6Cell(bold('Shifted weight'), 195, 24)],
        [m2t6Cell('A', 180, 27), m2t6Cell('100%', 240, 27),
        m2t6Cell('50%', 195, 27), m2t6Cell('20%', 195, 27)],
        [m2t6Cell('B', 180, 27), m2t6Cell('80%', 240, 27),
        m2t6Cell('50%', 195, 27), m2t6Cell('80%', 195, 27)],
        pause(),
        [m2t6Cell(bold('Pooled'), 180, 25), m2t6Cell('', 240, 27),
        m2t6Cell(bold('90%'), 195, 27), m2t6Cell(bold('84%'), 195, 27)],
    ).margin(18, 14).xjustify('l')),
    m2t6Card('Calibrated at one mixture does not mean calibrated at every mixture.', 28),
    _));
prose(
    'This illustrative predictor is calibrated in the source mixture but not after reweighting: the same 0.9 report now accompanies 84% positive labels. Within-group distributions remain fixed. Calibration within every group at each reported probability would survive arbitrary reweighting of those groups; pooled calibration alone does not.',
);

// 24
add(slide('Using calibration: a proposed confidence gate',
    m2t6Text('Automatically submit only if selected-label confidence $C>t$.', 28),
    parentCenter(m2t6GateDiagram().scale(0.85)),
    m2t6Text('Assume calibration. With selected-label calibration under deployment $S^{\\prime}$:', 25),
    m2t6Math('$\\Pr_{S^{\\prime}}(\\hat y\\ne Y\\mid C>t)=\\mathbb E_{S^{\\prime}}[1-C\\mid C>t]\\le 1-t$', 27),
    _).id('a-proposed-confidence-gate'));
prose(
    'Deployment calibration gives the error bound by averaging $1-C$ over the automatic branch, assuming that branch has positive probability. This bounds prediction error, not unwanted charges. On the other branch, valid confirmation must precede nonrefundable commitment; missing, rejected, or delayed confirmation must block it.',
);

// 25
add(slide('Routing changes the labeled distribution',
    m2t6Text('Fix a calibrated predictor and source $S$. If every requested confirmation yields a faithful label:', 26),
    m2t6Math('$S_{\\mathrm{conf}}=S(\\cdot\\mid C\\le t)$', 31),
    pause(),
    parentCenter(table(
        [m2t6Cell(bold('Thresholding alone'), 245, 26),
        m2t6Cell('Exact calibration survives at retained confidence levels. There are no labels for $C>t$.', 605, 26)],
        [m2t6Cell(bold('Selective responses'), 245, 26),
        m2t6Cell('If only customers given a wrong prediction respond at $C=0.8\\le t$, observed accuracy is 0%, not 80%.', 605, 26)],
    ).margin(18, 20).xjustify('l')),
    _));
prose(
    'For a positive-probability branch, conditioning only on confidence preserves exact calibration: $\\Pr_S(\\hat y=Y\\mid C=c,C\\le t)=c$ for retained $c$. This assumes faithful labels. Outcome-dependent response can break calibration at fixed confidence; labels below threshold cannot establish performance above it.',
);

// 26
add(slide('Recap: does the claim cover deployment?',
    parentCenter(table(
        [m2t6Cell(bold('Group mixtures'), 245, 26),
        m2t6Cell('All mixtures: worst risk = worst-group risk. Changing weights can reverse the aggregate comparison.', 605, 26)],
        [m2t6Cell(bold('Adversarial edits'), 245, 26),
        m2t6Cell('A margin bound can certify allowed edits; a failed attack search is not a certificate.', 605, 26)],
        [m2t6Cell(bold('Calibration and routing'), 245, 26),
        m2t6Cell('Assuming calibration restricts covered shifts. Routing changes label coverage; response selection can break calibration.', 605, 26)],
    ).margin(18, 17).xjustify('l')),
    m2t6Card('Specify the uncertainty set. Match evidence to the claim. Check the remaining system controls.', 27),
    _).id('does-the-claim-cover-deployment'));
prose(
    'The common thread is coverage of a specified uncertainty set. Group-risk bounds cover mixtures of fixed groups; margin bounds cover permitted edits. Calibration-based guarantees require deployment calibration. Confidence thresholding preserves exact calibration but changes observed support. Ordering controls still need separate evidence.',
);

// 27
add(slide('Which causal step does the intervention change?',
    parentCenter(ytable(
        foodOrderingControlDiagram({ confirmation: true, focus: 'confirmation' }).scale(0.62),
        m2t6Text('Changing inputs, improving the predictor, and enforcing confirmation constrain different causal steps.', 25, 920),
    ).center().ymargin(10)),

    _));
prose(
    'Input normalization changes what reaches the predictor; confirmation changes the ordering control structure. Prediction guarantees do not establish timely correction or faithful execution. The dashed paths are proposed controls requiring separate enforcement evidence. Choosing confirmation can retain the model requirement while adding a system-control requirement.',
);

// 28-32: retain the displayed discussion setting and questions unchanged.
add(slide('Discussion: requirements, controls, and evidence',
    m2t6Card('The ordering platform is considering an operating change. For example, label-preserving normalization of food photographs or requiring explicit customer confirmation. Pick one change and retain it for the questions below.', 28),
    _));
prose(
    'Keep one intervention throughout. Normalization changes inputs; confirmation changes controls and need not change the predictor requirement. All groups compare both confirmation policies in the final question.',
);

add(slide('Discussion: changed operating conditions',
    m2t6Card('Specify one changed operating condition relevant to the ordering harm scenario. What remains fixed, including the customer\'s intended choice?', 28),
    _));
prose(
    'Specify the baseline and change. Justify label preservation for normalization. For confirmation, distinguish eliciting a choice from changing it, and specify response timing.',
);

add(slide('Discussion: model-level requirements',
    m2t6Card('State the corresponding model-level requirement. What evidence would establish it, and which conditions would remain outside its scope?', 28),
    _));
prose(
    'State the population or transformation family, loss, tolerance, and evidence. Distinguish testing from guarantees. Confirmation may leave the predictor requirement unchanged while adding an enforcement requirement.',
);

add(slide('Discussion: causal steps and remaining evidence',
    m2t6Card('Identify the causal step that meeting this requirement would constrain. What further evidence is needed about ordering and feedback?', 28),
    _));
prose(
    'Identify the constrained causal link and the links needing separate evidence. Prediction guarantees do not establish execution, notice, cancellation, or confirmation enforcement.',
);

add(slide('Discussion: confirmation policies',
    m2t6Card('Compare universal confirmation with confirmation only for low-confidence predictions. Which routes to unwanted charges remain under each proposal, and what evidence would test the relevant controls?', 28),
    _));
prose(
    'Both policies need valid, current, order-specific confirmation enforced before commitment wherever required. Selective confirmation additionally exposes high-confidence errors. Low-confidence labels cannot audit the automatic branch; obtain representative evidence there and inspect actual ordering and feedback.',
);

// 33
add(slide('Next: data as specification',
    m2t6Text('Picking a population, uncertainty set, subgroups, labels, or permitted transformations is specification work.', 28),
    parentCenter(table(
        [m2t6Cell(bold('Population and groups'), 265, 26),
        m2t6Cell('Which conditions and comparisons does the claim cover?', 585, 26)],
        [m2t6Cell(bold('Labels and transformations'), 265, 26),
        m2t6Cell('Whose intended choice is recorded, and which changes preserve it?', 585, 26)],
        [m2t6Cell(bold('Tolerance and controls'), 265, 26),
        m2t6Cell('What error is acceptable, and what prevents an error from becoming an unwanted charge?', 585, 26)],
    ).margin(18, 17).xjustify('l')),
    _));
prose(
    'Populations, groups, labels, transformations, and tolerances specify the claim. Data collection and documentation encode these choices. Next we examine that specification work, retaining the distinction between evidence about predictions and evidence about the surrounding controls.',
);