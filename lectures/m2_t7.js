G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 2, meeting 7: October 13, 2026.
// Canonical note: notes/m2_t7.md.
// Native diagrams adapt the simple workflow conventions of m1_t2.js.
// No additional image assets are required.
// Local draft: review slides and public speaker notes before publication.
// Edit student-facing prompts here, then regenerate with worksheets/tickets.py.
// The ticket extracts the literal card text; do not duplicate it in the config.
// ASCII HTML entities preserve punctuation across browser, slide PDF, and ticket.

function m2t7Text(message, size, width) {
    // sfig's PDF backend does not preserve inline hyperlinks and cannot safely
    // strip multiple anchors at once. Keep their labels before its TeX pass.
    // A control-word space terminates \S without braces that sfig would escape.
    // Browser links and ticket-PDF links use the original literal unchanged.
    if (sfig.serverSide) {
        message = message.replace(/<a href="[^"]+">([^<]*)<\/a>/g, '$1')
            .replace(/&sect;/g, '\\S ');
    }
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m2t7Card(message, size) {
    return parentCenter(frameBox(m2t7Text(message, size || 28, 860)).padding(16));
}

function m2t7Cell(message, width, size) {
    return m2t7Text(message, size || 25, width);
}

function m2t7Small(message) {
    return parentCenter(m2t7Text(message, 20, 900));
}

function m2t7Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

var m2t7Sources = {
    attitudes: 'https://arxiv.org/abs/2111.07997',
    datasheets: 'https://arxiv.org/abs/1803.09010',
    filtering: 'https://openai.com/index/dall-e-2-pre-training-mitigations/',
};

function m2t7Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['a-recorded-rating-is-not-the-intended-policy', 'Whose judgments become labels?'],
        ['datasheets-make-choices-traceable', 'Document consequential choices'],
        ['filtering-can-change-more-than-its-target', 'Change data and trace consequences'],
    ]).id('m2t7-roadmap-' + selected));
    prose([
        'Sap et al. study annotator attitudes and their associations with annotations. We also ask about researchers\' own choices.',
        'Datasheets document researcher decisions. The goal is to identify evidence that would change a decision about using the data.',
        'Filtering and reweighting help specify the training objective. We extend the moderation example into a hypothetical harm scenario.',
    ][selected]);
}

// Fixed coordinates use the same downward convention in both backends.
// These are ordinary sfig blocks, not linked or embedded SVG images.
function m2t7At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m2t7Box(lines, x, y, width, height, active) {
    var contents = ytable.apply(null, lines.map(function (message) {
        return nowrapText(message).fontSize(21);
    })).center().ymargin(3);
    return overlay(
        m2t7At(rect(width, height).fillColor(active ? '#F3E8B6' : '#F6F6F6')
            .strokeColor('#666666').strokeWidth(1.5), x, y),
        transform(contents).pivot(0, 0)
            .shift(x + width / 2, sfig.downSign * (y + height / 2)),
        _
    );
}

function m2t7Segment(x1, y1, x2, y2, headed) {
    return (headed ? arrow : line)([x1, sfig.downSign * y1],
        [x2, sfig.downSign * y2]).strokeWidth(2);
}

function m2t7Label(message, x, y, size) {
    return m2t7At(nowrapText(message).fontSize(size || 18), x, y);
}

function m2t7ModerationFlow() {
    // Adapt Lecture 2's simple workflow: separate the inference input from
    // development, and show commands and feedback rather than conflating them.
    return overlay(
        m2t7At(rect(930, 352).fillColor('white').strokeWidth(0), 0, 0),
        m2t7At(rect(912, 242).fillOpacity(0).strokeColor('#999999')
            .strokeWidth(1.5), 9, 102),
        m2t7Label('Moderation-system boundary', 25, 111, 18),
        m2t7Box(['Annotated', 'posts'], 25, 10, 165, 60),
        m2t7Box(['Fitting and', 'evaluation'], 275, 10, 160, 60),
        m2t7Segment(190, 40, 275, 40, true),
        m2t7Label('Labels', 204, 14, 17),
        m2t7Segment(355, 70, 355, 150, true),
        m2t7Label('Install model', 367, 78, 17),
        m2t7Box(['Posted', 'comment'], 25, 150, 140, 60),
        m2t7Box(['Toxicity', 'predictor'], 275, 150, 160, 60),
        m2t7Box(['Moderation', 'rule'], 540, 150, 160, 60, true),
        m2t7Box(['Post', 'visibility'], 790, 150, 120, 60),
        m2t7Segment(165, 180, 275, 180, true),
        m2t7Segment(435, 180, 540, 180, true),
        m2t7Label('Score', 464, 153, 18),
        m2t7Segment(700, 169, 790, 169, true),
        m2t7Label('Command', 701, 141, 16),
        m2t7Segment(790, 195, 700, 195, true),
        m2t7Label('Status', 714, 205, 17),
        m2t7Box(['Author'], 540, 285, 160, 50),
        m2t7Segment(575, 210, 575, 285, true),
        m2t7Label('Notice', 497, 242, 18),
        m2t7Segment(670, 285, 670, 210, true),
        m2t7Label('Appeal', 683, 250, 18),
        _
    ).recMouseShowHide(false);
}

function m2t7Chain(messages) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m2t7Text(message, 24, 235)).padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m2t7ProductionFlow() {
    return overlay(
        m2t7At(rect(920, 350).fillColor('white').strokeWidth(0), 0, 0),
        m2t7Box(['Post selection'], 20, 20, 250, 65),
        m2t7Box(['Annotator recruitment'], 335, 20, 250, 65),
        m2t7Box(['Task and instructions'], 650, 20, 250, 65),
        m2t7Segment(145, 85, 145, 120),
        m2t7Segment(460, 85, 460, 120),
        m2t7Segment(775, 85, 775, 120),
        m2t7Segment(145, 120, 775, 120),
        m2t7Segment(460, 120, 460, 165, true),
        m2t7Box(['Label processing,', 'inclusion, and weights'], 305, 165, 310, 70, true),
        m2t7Segment(460, 235, 460, 280, true),
        m2t7Box(['Fitting and evaluation'], 305, 280, 310, 60),
        _
    ).recMouseShowHide(false);
}

function m2t7FrequencyChart() {
    // Reported reductions, each relative to that word's pre-filter frequency.
    // Bar lengths share a zero baseline; these are not output-disparity rates.
    var parts = [
        m2t7At(rect(900, 228).fillColor('white').strokeWidth(0), 0, 0),
        m2t7Label('"woman"', 25, 42, 24),
        m2t7Label('"man"', 25, 104, 24),
        m2t7At(rect(14 * 35, 32).fillColor('#245A81').strokeWidth(0), 180, 40),
        m2t7At(rect(6 * 35, 32).fillColor('#245A81').strokeWidth(0), 180, 102),
        m2t7Label('14%', 682, 42, 24),
        m2t7Label('6%', 402, 104, 24),
        m2t7Segment(180, 145, 705, 145),
        m2t7Label('Reduction relative to each word\'s pre-filter frequency (%)', 80, 197, 20),
    ];
    [0, 5, 10, 15].forEach(function (tick) {
        var xpos = 180 + tick * 35;
        parts.push(m2t7Segment(xpos, 145, xpos, 153));
        parts.push(m2t7Label(String(tick), xpos - 7, 162, 19));
    });
    return overlay.apply(null, parts).recMouseShowHide(false);
}

add(titleSlide('Lecture 7: Data as Specification',
    nil(),
    parentCenter(m2t7Text(
        'CS120: Introduction to AI Safety - October 13, 2026, Zachary Robertson',
        24, 900
    )),
    _));
prose(
    'Who makes the dataset? We return to the crowd-sourced toxicity predictor and examine how development decisions about the dataset can produce shortcuts, such as a spurious correlation between dialect and toxicity. The platform intends to remove targeted abuse while allowing other comments.',
);

add(slide('Who specifies the task?',
    parentCenter(table(
        [m2t7Cell(bold('Generalization'), 215, 26),
        m2t7Cell('Performance on future samples from a specified population.', 635, 26)],
        [m2t7Cell(bold('Robustness'), 215, 26),
        m2t7Cell('Behavior under specified changes in inputs or conditions.', 635, 26)],
    ).margin(18, 22).xjustify('l')),
    pause(),
    m2t7Card('Who chose the population, labels, groups, and permitted changes?', 28),
    m2t7Small('Today: trace those choices into data production and model selection.'),
    _));
prose(
    'In this module we have considered generalization and robustness and why neither alone is sufficient to claim the data specifies the intended task. Now we examine how choices about populations, labels, groups, and permitted changes enter data production and model selection.',
);

add(slide('A score does not remove a post',
    parentCenter(m2t7ModerationFlow().scale(0.93)),
    m2t7Small('Intended policy: remove targeted abuse while allowing other comments.'),
    _));
prose(
    'Development supplies a fitted predictor; the score does not itself remove a post. The moderation rule controls visibility and receives status feedback. The author receives a decision notice and can appeal, but restoration may come too late to preserve participation. This simplified workflow leaves the data-production decisions to be examined below.',
);

m2t7Roadmap(0);

add(slide('A recorded rating is not the intended policy',
    parentCenter(table(
        [m2t7Cell(bold('Recorded judgment'), 235, 27),
        m2t7Cell('How offensive or toxic does an annotator perceive this comment to be?', 615, 27)],
        [m2t7Cell(bold('Intended decision'), 235, 27),
        m2t7Cell('Does the comment violate the platform\'s policy against targeted abuse?', 615, 27)],
    ).margin(18, 24).xjustify('l')),
    pause(),
    m2t7Card('Accurate prediction of ratings does not establish accurate application of the policy.', 27),
    _).id('a-recorded-rating-is-not-the-intended-policy'));
prose(
    'Sap et al. measure perceived offensiveness of online comments. The platform instead intends to remove targeted abuse while allowing other comments. Reusing the ratings as policy-violation labels assumes these constructs align. Accurate prediction of recorded ratings does not resolve that assumption.',
);

add(slide('Annotators with Attitudes',
    m2t7Text('Sap et al. study perceived offensiveness and its associations with dialect, prejudice, and vulgarity.', 27),
    m2t7Small('Studied comments include African American English (AAE), racism, and vulgarity.'),
    pause(),
    parentCenter(table(
        [m2t7Cell(bold('Higher racist-belief scores'), 300, 26),
        m2t7Cell('Associated with lower toxicity ratings for anti-Black posts.', 550, 26)],
        [m2t7Cell('The same attitude measure', 300, 26),
        m2t7Cell('Associated with higher toxicity ratings for AAE posts.', 550, 26)],
    ).margin(18, 20).xjustify('l')),
    m2t7Cite('Sap et al., NAACL 2022', m2t7Sources.attitudes),
    _));
prose(
    'In Annotators with Attitudes, Sap et al. measure perceived offensiveness and its associations with dialect, prejudice, and vulgarity. They focus on comments exhibiting AAE, racism, or vulgarity. Higher scores on their racist-belief scale were associated with lower toxicity ratings for anti-Black posts and higher toxicity ratings for AAE posts.',
);

add(slide('Where can a dialect shortcut originate?',
    m2t7Text('A possible mechanism upstream of model fitting:', 27),
    parentCenter(m2t7Chain([
        'Annotator composition and judgments',
        'Dialect-toxicity associations in labels',
        'A predictor that relies on dialect',
    ])),
    pause(),
    m2t7Card('A dataset can reward the association before a model learns it.', 28),
    _));
prose(
    'The paper suggests a mechanism upstream of model fitting: the composition of the annotator pool can embed spurious associations directly into the training labels. In our original crowd-sourced predictor example, we focused on a model exploiting a spurious correlation between dialect and toxicity. Here we examine how annotation decisions can create or reinforce that correlation.',
);

add(slide('Researchers also make specification choices',
    m2t7Text('Breadth-of-posts study: 173 annotators label 571 tweets.', 26),
    parentCenter(table(
        [m2t7Cell(bold('Measurement'), 210, 25),
        m2t7Cell('One questionnaire item per attitude dimension, selected using the earlier study.', 640, 25)],
        [m2t7Cell(bold('Assignment'), 210, 25),
        m2t7Cell('Two White conservatives, two White liberals, and two Black annotators per post.', 640, 25)],
    ).margin(18, 21).xjustify('l')),
    pause(),
    m2t7Text(bold('Which comparisons and measurement claims does this design support?'), 27),
    m2t7Cite('Sap et al., section 3.2 and Appendix D', m2t7Sources.attitudes),
    _));
prose(
    'In the breadth-of-posts study, 173 annotators label 571 tweets. Each attitude dimension uses a single questionnaire item selected from the earlier study. The assignment scheme politically differentiates White annotators but not Black annotators. These decisions influence which comparisons the design supports and raise questions about the reliability and scope of the attitude measurements. Pointing out study decisions is not itself a critique.',
);

add(slide('What did the study establish?',
    parentCenter(table(
        [m2t7Cell(bold('Evidence reported'), 235, 26),
        m2t7Cell('Associations among measured attitudes, identities, and annotations in the study.', 615, 26)],
        [m2t7Cell(bold('Further model claim'), 235, 26),
        m2t7Cell('Training on those labels produces a predictor that relies on dialect.', 615, 26)],
        [m2t7Cell(bold('Further system claim'), 235, 26),
        m2t7Cell('That predictor causes permitted posts to be removed with consequential delays.', 615, 26)],
    ).margin(18, 20).xjustify('l')),

    _));
prose(
    'The paper studies annotator attitudes and their associations with annotations. Tracing those associations into harm requires evidence about model behavior and the moderation rule. A predictor using dialect as a proxy for toxicity could contribute to speakers losing timely participation because their allowed posts are removed.',
);

m2t7Roadmap(1);

add(slide('Datasheets make choices traceable',
    m2t7Text('Gebru et al. propose documenting how a dataset was made and how it should be used.', 27),
    parentCenter(table(
        [m2t7Cell(bold('Purpose and composition'), 325, 25),
        m2t7Cell('Why this dataset? What does it contain?', 525, 25)],
        [m2t7Cell(bold('Collection process'), 325, 25),
        m2t7Cell('How were instances and judgments obtained?', 525, 25)],
        [m2t7Cell(bold('Processing and labeling'), 325, 25),
        m2t7Cell('Which transformations produced the usable data?', 525, 25)],
        [m2t7Cell(bold('Uses'), 325, 25),
        m2t7Cell('Which uses are recommended or discouraged?', 525, 25)],
    ).margin(18, 15).xjustify('l')),
    m2t7Cite('Gebru et al., Datasheets for Datasets', m2t7Sources.datasheets),
    _).id('datasheets-make-choices-traceable'));
prose(
    'Gebru et al. propose documentation as a way to give researcher decisions traceable provenance. Recommended components include motivation, composition, collection, preprocessing, cleaning, labeling, and uses to recommend or avoid. A datasheet is more than checking boxes: its goal is to identify information or evidence that would change a decision about using the data.',
);

add(slide('Documented, inferred, or unknown?',
    parentCenter(table(
        [m2t7Cell(bold('Documented'), 220, 27),
        m2t7Cell('An attributed claim about what was done or observed.', 630, 27)],
        [m2t7Cell(bold('Inferred'), 220, 27),
        m2t7Cell('A conclusion requiring reasoning and explicit assumptions.', 630, 27)],
        [m2t7Cell(bold('Unknown'), 220, 27),
        m2t7Cell('A question the available sources do not answer.', 630, 27)],
    ).margin(18, 23).xjustify('l')),
    pause(),
    m2t7Card('An unanswered question does not establish that a step was omitted.', 27),
    _));
prose(
    'It is important to document attributed claims, inferences, and what remains uncertain. Just because a question is unanswered does not establish that a step was omitted. A documented fact may support a proposed use or limit its suitability; an unknown identifies where further inquiry is needed.',
);

add(slide('Follow provenance into a reuse decision',
    parentCenter(table(
        [m2t7Cell(bold('Source'), 170, 25),
        m2t7Cell('Ratings elicited to measure perceived offensiveness.', 680, 25)],
        [m2t7Cell(bold('Assumption'), 170, 25),
        m2t7Cell('Those ratings can stand for violations of the intended policy.', 680, 25)],
        [m2t7Cell(bold('Check'), 170, 25),
        m2t7Cell('Compare ratings with independently justified policy judgments.', 680, 25)],
        [m2t7Cell(bold('Decision'), 170, 25),
        m2t7Cell('Substantial mismatch may require new labels or a narrower use.', 680, 25)],
    ).margin(18, 20).xjustify('l')),

    _));
prose(
    'Using perceived-offensiveness ratings as policy-violation labels introduces an assumption about their suitability. Compare the ratings with independently justified policy judgments, documenting how those judgments were made. A substantial mismatch may call for new labels, narrower use, or declining reuse. This proposed check connects provenance to a decision about using the data.',
);

add(slide('Expand the development boundary',
    parentCenter(m2t7ProductionFlow().scale(0.9)),

    _));
prose(
    'Instead of conceptualizing data production as a black box, we ask which decisions and assumptions flowed into its construction. Expanding the development boundary brings post selection, annotator recruitment, task instructions, label processing, inclusion, and weighting into view. Documentation helps identify where to investigate the effects of these choices on model behavior.',
);

add(slide('Documentation guides inquiry; it does not certify safety',
    m2t7Card('Which fact or empirical result would change the decision to use this data?', 28),
    pause(),
    parentCenter(table(
        [m2t7Cell(bold('Can support'), 220, 26),
        m2t7Cell('Tracing choices, exposing limitations, and targeting further investigation.', 630, 26)],
        [m2t7Cell(bold('Does not establish alone'), 220, 26),
        m2t7Cell('Construct validity, acceptable predictor behavior, or timely correction of removals.', 630, 26)],
    ).margin(18, 24).xjustify('l')),
    _));
prose(
    'The end-goal of using a datasheet is to identify what information or evidence would change a decision about using the data. Such documentation can help identify where to investigate; it does not by itself establish that a dataset or its downstream use is safe.',
);

m2t7Roadmap(2);

add(slide('Filtering can change more than its target',
    m2t7Text('DALL-E 2 pre-training: filter sexual and violent imagery to reduce problematic outputs.', 26),
    parentCenter(m2t7FrequencyChart()),

    m2t7Cite('OpenAI, DALL-E 2 Pre-Training Mitigations, 2022', m2t7Sources.filtering),
    _).id('filtering-can-change-more-than-its-target'));
prose(
    'OpenAI\'s DALL-E 2 report describes filtering sexual and violent imagery from training data to reduce problematic outputs. Filtering reduced caption-word frequencies for "woman" by 14 percent, versus 6 percent for "man," suggesting amplified gender skew in dataset composition. Each reduction is relative to that word\'s pre-filter frequency. The chart shows these reported values.',
);

add(slide('Reweighting is a second intervention',
    parentCenter(table(
        [m2t7Cell(bold('Filtering'), 220, 28),
        m2t7Cell('Changes which examples are retained.', 630, 28)],
        [m2t7Cell(bold('Reweighting'), 220, 28),
        m2t7Cell('Changes the influence of retained examples during fitting.', 630, 28)],
    ).margin(18, 26).xjustify('l')),
    pause(),
    m2t7Card('A control aimed at one problem can motivate a further mitigation.', 28),
    m2t7Cite('OpenAI, DALL-E 2 Pre-Training Mitigations, 2022', m2t7Sources.filtering),
    _));
prose(
    'The report then describes reweighting the filtered data to address filtering-induced bias. Filtering and reweighting are distinct interventions: filtering changes which examples are retained, while reweighting changes their influence during fitting. A control aimed at one problem can introduce another, motivating a further mitigation.',
);

add(slide('Data choices enter the training objective',
    parentCenter(m2t7Text(
        '$\\hat\\theta_c\\in\\arg\\min_{\\theta\\in\\Theta}\\frac{\\sum_{i\\in I_c}w_i^{(c)}\\ell(\\theta;x_i,y_i^{(c)})}{\\sum_{i\\in I_c}w_i^{(c)}}$',
        30, 920
    )),
    pause(),
    parentCenter(table(
        [m2t7Cell('$I_c$', 180, 27),
        m2t7Cell('Which instances are retained', 670, 27)],
        [m2t7Cell('$y_i^{(c)}$', 180, 27),
        m2t7Cell('Which label is used', 670, 27)],
        [m2t7Cell('$w_i^{(c)}$', 180, 27),
        m2t7Cell('How much each instance contributes', 670, 27)],
    ).margin(18, 18).xjustify('l')),
    m2t7Small('Weights are nonnegative and their total is positive. Here, i can index annotations.'),
    _));
prose(
    'Development controls such as inclusion, labels, and weights are choices $c$ that help specify the training objective. In moderation, $i$ can index annotations, $I_c$ identifies retained annotations, and $y_i^{(c)}$ is the label used under choice $c$. The weights $w_i^{(c)}$ are nonnegative, with a positive total weight, and help shape which model is selected. The hypothesis class and loss form are held fixed.',
);

add(slide('Choose the policy, then fit the model',
    parentCenter(m2t7Chain([
        'Choose development policy $c$',
        'Fit parameters $\\hat\\theta_c$',
        'Evaluate application behavior',
    ])),
    pause(),
    parentCenter(table(
        [m2t7Cell(bold('Intended change'), 220, 26),
        m2t7Cell('Which measured problem should the intervention reduce?', 630, 26)],
        [m2t7Cell(bold('Intended invariance'), 220, 26),
        m2t7Cell('Which relevant behavior should remain acceptable?', 630, 26)],
    ).margin(18, 23).xjustify('l')),

    _));
prose(
    'Researchers choose $c$ and then fitting chooses parameters for the model. A safety intervention may change the training distribution. We must ask what changes, what should stay invariant, and how to connect the researcher choice to observable evidence. For example, does filtering or reweighting reduce one measured problem while suppressing subgroup representation or preserving a harmful shortcut?',
);

add(slide('First fix the baseline pipeline',
    m2t7Text(bold('Hypothetical harm scenario'), 26),
    parentCenter(table(
        [m2t7Cell(bold('Fixed policy $c_0$'), 245, 26),
        m2t7Cell('Repeated training runs return context-sensitive and dialect-shortcut predictors.', 605, 26)],
        [m2t7Cell(bold('Validation equivalence'), 245, 26),
        m2t7Cell('Their validation performance is statistically indistinguishable.', 605, 26)],
        [m2t7Cell(bold('Unresolved behavior'), 245, 26),
        m2t7Cell('Validation omits non-abusive AAE; the predictors differ on permitted posts.', 605, 26)],
    ).margin(18, 20).xjustify('l')),
    _));
prose(
    'Under a fixed baseline development policy $c_0$, assume repeated training runs yield context-sensitive and dialect-shortcut predictors with statistically indistinguishable validation performance. Suppose validation omits non-abusive AAE, leaving their different treatments of allowed speech unresolved. This is consequential underspecification under a fixed pipeline. These are assumptions for our hypothetical scenario, not reported findings of Sap et al.',
);

add(slide('Then change the development policy',
    m2t7Text('Change $c_0\\rightarrow c_1$; keep the same validation check.', 26),
    parentCenter(m2t7Chain([
        'Treat one attitude item as a reliability measure',
        'Upweight high-scoring annotators',
        'Select a dialect-shortcut predictor',
    ])),
    pause(),
    m2t7Text('Assume the pilot confounds dialect with toxicity and those annotators rate dialect itself as toxic.', 27),
    m2t7Card('Changing the objective does not repair the validation gap.', 27),
    _));
prose(
    'Suppose a moderation pilot confounds dialect with toxicity. The team treats a strongly correlating questionnaire item as an annotator reliability measure and upweights high scorers. Suppose these annotators tend to rate dialect itself as toxic. Changing $c_0$ to $c_1$ increases their annotations\' weights and can favor a dialect-shortcut predictor; assume it is selected and passes unchanged validation. The original validation equivalence was under $c_0$: changing $c$ changes the training objective, not the adequacy of the validation check.',
);

add(slide('From a label association to lost participation',
    m2t7Text('The deployed predictor encounters an AAE post the policy permits.', 26),
    parentCenter(m2t7Chain([
        'Predictor flags the permitted post',
        'Moderation rule issues a removal',
        'Appeal restores it too late',
    ])),
    pause(),
    parentCenter(table(
        [m2t7Cell(bold('Hazard $H_T$'), 205, 25),
        m2t7Cell('An allowed post is hidden while timely correction is unavailable.', 645, 25)],
        [m2t7Cell(bold('Harm $L_T$'), 205, 25),
        m2t7Cell('The speaker loses timely participation because the post was removed.', 645, 25)],
    ).margin(18, 19).xjustify('l')),
    _));
prose(
    'The predictor flags an AAE post that the intended policy permits, and the moderation rule issues a removal instruction. The platform enters hazardous state $H_T$: an allowed post is hidden while timely correction is unavailable. An appeal restores it after the conversation has moved on. The participant realizes harm $L_T$: loss of timely participation. Repetition can produce systematic exclusion.',
);

add(slide('Requirements need evidence at different points',
    m2t7Text(bold('$SC_T$: prevent or correct erroneous removals before the participation window closes.'), 27),
    parentCenter(table(
        [m2t7Cell(bold('Development check'), 230, 25),
        m2t7Cell('Evaluate permitted non-abusive AAE before and after reweighting; compare validation-equivalent predictors.', 620, 25)],
        [m2t7Cell(bold('System check'), 230, 25),
        m2t7Cell('Compare removal, appeal, and restoration times with a defined participation window.', 620, 25)],
    ).margin(18, 22).xjustify('l')),

    _));
prose(
    'A potential constraint is to prevent or correct erroneous removals before the participation window closes. Evaluate non-abusive AAE against the intended policy before and after reweighting, comparing predictors indistinguishable on the original validation check. Testing alone does not prevent a removal; results must inform selection or deployment. Check correction timeliness using removal, appeal, and restoration logs against an explicitly defined participation window, including unresolved cases.',
);

add(slide('Data specifies learning, not safety by itself',
    parentCenter(table(
        [m2t7Cell(bold('Provenance'), 205, 26),
        m2t7Cell('Makes data-production choices and uncertainty traceable.', 645, 26)],
        [m2t7Cell(bold('Validation'), 205, 26),
        m2t7Cell('Tests specified behavior; other differences may remain unresolved.', 645, 26)],
        [m2t7Cell(bold('Selection'), 205, 26),
        m2t7Cell('Determines which predictor is installed.', 645, 26)],
        [m2t7Cell(bold('System controls'), 205, 26),
        m2t7Cell('Shape whether prediction errors become participation harm.', 645, 26)],
    ).margin(18, 18).xjustify('l')),
    pause(),
    m2t7Small('Discussion: should the platform reuse the breadth-of-posts data?'),
    _));
prose(
    'Researcher choices can influence data in ways that are hard to detect within the development pipeline. Available evaluations may leave safety-relevant differences among well-performing models unresolved. Documenting decisions from data collection to intended use makes provenance traceable and helps identify consequential sources of underspecification before model behavior contributes to harm. The discussion applies this approach to a reuse decision.',
);

// Discussion tail: one setting and exactly four numbered questions.
// prose() calls mark extraction boundaries without adding instructor notes.
add(slide('Discussion: Data as specification',
    m2t7Card('A moderation team is considering reusing the <i>breadth-of-posts</i> data from Sap et al., <i><a href="https://arxiv.org/abs/2111.07997">Annotators with Attitudes</a></i>, to train the toxicity predictor from lecture. The platform intends to remove targeted abuse while allowing other comments. Use Sap et al. &sect;3.2 and Appendix D.1&ndash;D.2, and Gebru et al., <i><a href="https://arxiv.org/abs/1803.09010">Datasheets for Datasets</a></i>, &sect;3.2 (Composition), &sect;3.3 (Collection Process), and &sect;3.5 (Uses). If the sources do not answer a question, mark it <b>unknown</b> rather than inferring an answer. Do not use the lecture\'s one-item attitude/reweighting example.', 26),
    _));
prose();

add(slide('1. Proposed reuse',
    m2t7Card('What did Sap et al. collect the ratings to study, and what would the platform ask those ratings to stand for? State one assumption needed for this reuse.', 28),
    _));
prose();

add(slide('2. Composition and sampling',
    m2t7Card('For the posts, annotators, and ratings, what are the dataset\'s instance types and how were they sampled? What larger population, if any, can each reasonably represent?', 28),
    _));
prose();

add(slide('3. Consequential provenance',
    m2t7Card('Choose one documented collection choice or one <b>unknown</b> from Question 2. Give a plausible route by which it could contribute to a permitted post being removed. What additional assumption does your route require?', 28),
    _));
prose();

add(slide('4. Reuse decision',
    m2t7Card('Using <i>Datasheets</i> &sect;3.5, identify one additional fact or empirical check that would most affect reuse. What result would make you more or less willing to reuse the data, and what safety claim would still remain unsupported? Conclude: <b>reuse / reuse with conditions / do not reuse yet</b>.', 28),
    _));
prose();