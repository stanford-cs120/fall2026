G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 5, meeting 15: November 12, 2026.
// Canonical content: notes/m5_t15.md.
// Browser: lecture.html?lecture=m5_t15
// Native sfig layouts only; the canonical note references no figure assets.
// Three provisional discussions are distributed through the lecture.
// Prompts may be adjusted after reading responses; no ticket extraction.
// Local authoring draft: no shared-helper changes or publication.

function m5t15Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m5t15Card(message, size) {
    return parentCenter(frameBox(m5t15Text(message, size || 28, 860)).padding(16));
}

function m5t15Math(message, size) {
    return parentCenter(nowrapText(message).fontSize(size || 32));
}

function m5t15Cite(section) {
    return parentCenter(cite(
        'Jacobs &amp; Wallach, 2021' + (section ? ', ' + section : ''),
        'https://arxiv.org/abs/1912.05511'
    ).scale(0.6));
}

function m5t15Panel(heading, message, width, size) {
    return frameBox(ytable(
        m5t15Text(bold(heading), 24, width || 390),
        m5t15Text(message, size || 27, width || 390),
        _
    ).ymargin(14)).padding(14);
}

function m5t15Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m5t15Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m5t15Evidence(construct, evidence, assumption) {
    return frameBox(ytable(
        m5t15Text(bold(construct), 25, 260),
        m5t15Text(evidence, 26, 260),
        m5t15Text(bold('Assumption:') + ' ' + assumption, 23, 260),
        _
    ).ymargin(18)).padding(14);
}

function m5t15Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['observable-evidence-needs-an-interpretation', 'What does measurement modeling establish?'],
        ['a-task-can-concern-a-construct-without-estimating-it', 'When is inference necessary?'],
        ['height-is-observable', 'What do the diagnostic examples establish?'],
    ]).id('m5t15-roadmap-' + selected));
    prose([
        'Measurement modeling makes assumptions explicit and some implications testable. Jacobs and Wallach use this framework to analyze fairness harms arising from construct-operationalization mismatches. The argument supports the usefulness of the framework, while leaving open whether a particular task requires inference about an unobservable construct.',
        'The central question is not only whether a construct is unobservable, but whether the task needs to infer it. The diagnostic asks about observability, task necessity, evidential warrant, and the explanation of harm. These questions are distinct from the difference between reliability and validity.',
        'Height, socioeconomic status, and teacher effectiveness illustrate different relationships between a construct and its measurement. Each example exposes consequential assumptions. The question is whether explaining the problem or identifying a remedy requires estimating the construct, and what an institution can claim from the available evidence.',
    ][selected]);
}

// 1
add(titleSlide(ytable(
    nowrapText('Lecture 15: What Makes').fontSize(40).strokeColor('darkblue'),
    nowrapText('an Evaluation Valid?').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m5t15Text(
        'CS120: Introduction to AI Safety - November 12, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture15'));
prose(
    'Module 5 concerns the role of institutions in assuring AI systems. Institutions produce evaluations and establish safeguards, while their assurance claims can inform decisions elsewhere. This lecture asks when inference about an unobservable construct is necessary, warranted, or useful compared with observable measurement.',
);

// 2
add(slide('From stakeholder feedback to institutional assurance',
    parentCenter(courseProgressionDiagram(5)),
    pause(),
    m5t15Card('Institutions use evaluation evidence to support decisions about AI systems.', 29),
    _));
prose(
    'Stakeholder feedback loops shape the data available to train and evaluate AI systems. Institutions interpret that evidence and make assurance claims that may inform their own decisions or those of another institution. Failures of measurement, governance, and transparency can therefore have consequences beyond the immediate interaction.',
);

// 3
add(slide('Data work sits inside institutions',
    parentCenter(m5t15Chain([
        'Commission data work',
        'Interpret evidence',
        'Act on assurance claims',
    ])),
    pause(),
    m5t15Card('Who organizes the work also shapes what its results are used to justify.', 29),
    _));
prose(
    'Data work is organized through institutions that commission tasks, set conditions, and use the resulting evidence. The transition to assurance concerns how those institutions interpret the work and what their claims justify. Responsibility extends beyond producing data to decisions about evaluation, safeguards, and accountability.',
);

// 4
add(slide('Assurance requires evidence and safeguards',
    parentCenter(xtable(
        m5t15Panel('Epistemic assurance', 'Produce valid evaluations of capabilities and hazards.', 390),
        m5t15Panel('Safeguards', 'Establish and enforce constraints on development and deployment.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t15Text('An evaluation alone does not establish acceptable residual risk.', 29),
    _));
prose(
    'Part of an institution\'s role is to provide epistemic assurance through valid evaluations of capabilities and hazards. Another role is to establish and enforce safeguards intended to keep residual risk at acceptable levels. Evaluation validity is therefore connected to, but does not replace, institutional accountability.',
);

// 5
m5t15Roadmap(0);

// 6
add(slide('Observable evidence needs an interpretation',
    parentCenter(xtable(
        m5t15Evidence('Preference', 'Choices or rankings',
            'Utility axioms apply to revealed choices.'),
        m5t15Evidence('Toxicity', 'Annotator labels',
            'Labels represent the intended notion of toxicity.'),
        m5t15Evidence('Sycophancy', 'Response given A/B framing',
            'The contrast identifies excessive compliance.'),
        _
    ).center().xmargin(20)),
    _));
prose(
    'Preferences, toxicity, and sycophancy involve inference from observable properties thought to be related to an underlying construct. Construct-operationalization enables this inference but relies on assumptions. A system concerning an unobservable construct does not thereby need to estimate it, and epistemic failures need not reflect intentional wrongdoing.',
);

// 7
add(slide('Values also enter operationalization',
    parentCenter(xtable(
        m5t15Panel('Theoretical understanding', 'For toxicity: which harms count?', 390),
        m5t15Panel('Operationalization', 'Whose labels count as evidence of those harms?', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t15Card('Values enter both the construct and its operationalization.', 29),
    m5t15Cite(),
    _));
prose(
    'Jacobs and Wallach distinguish debates about operationalization from debates about the theoretical understanding of a construct. This makes assumptions available for analysis without treating operationalization as value-free. Values also enter the choices connecting observable properties to the construct that an evaluation claims to measure.',
);

// 8
add(slide('A proposed argument for measurement modeling',
    m5t15Text(bold('P1:') + ' Many sociotechnical harms result from construct-operationalization mismatches.', 27),
    m5t15Text(bold('P2:') + ' Measurement modeling makes these assumptions explicit and some implications testable.', 27),
    pause(),
    m5t15Text(bold('C1:') + ' Measurement modeling can help explain, anticipate, and mitigate some sociotechnical harms.', 27),
    m5t15Math('$P_1 \\land P_2 \\to C_1$', 34),
    m5t15Cite(),
    _));
prose(
    'The proposed argument connects construct-operationalization mismatches to the usefulness of measurement modeling. Making assumptions explicit can help identify mismatches between a theoretical construct and how it is measured. The conclusion is that this framework can help explain, anticipate, and mitigate some sociotechnical harms.',
);

// 9
add(slide('Usefulness does not establish necessity',
    m5t15Card('Measurement modeling helps scrutinize a claimed measurement.', 30),
    pause(),
    parentCenter(xtable(
        m5t15Panel('The paper asks', 'What assumptions support the measurement?', 390),
        m5t15Panel('Our next question', 'Does the decision require this construct estimate?', 390),
        _
    ).center().xmargin(32)),
    _));
prose(
    'Jacobs and Wallach provide tools for examining measurement claims. We add a task-design question: does the institution need this estimate to make its decision? A remedy that avoids estimating the construct can still benefit from examining measurement assumptions.',
);

// BEGIN DISCUSSION 1
add(slide('Discussion 1: What exactly is the disagreement?',
    m5t15Text('Choose a reading response and poster name for all three discussions.', 26),
    m5t15Card('Give the strongest reply to the critique in the selected response. Is the disagreement about what the construct means, whether the proxy measures it, or how the score is used?', 28),
    m5t15Text('Which part of the disagreement could additional evidence resolve?', 27),
    m5t15Text('Discuss with classmates; record your own response to Question 1.', 25),
    m5t15Cite('secs. 1-2'),
    _).id('discussion15-evidence'));
prose(
    'Use the reading response as a starting argument. Develop a substantive reply and locate the disagreement. The reply might challenge the evidence for the critique, defend a particular understanding of the construct, or defend a particular use of the measurement. Identify what further evidence could resolve and what requires an argument about values or purpose.',
);
// END DISCUSSION 1

// 11
m5t15Roadmap(1);

// 12
add(slide('A task can concern a construct without estimating it',
    m5t15Card('Start with the institutional decision: what information does it require?', 30),
    pause(),
    m5t15Text('Would observable information suffice, or must we estimate the construct?', 30),
    _));
prose(
    'The fact that a sociotechnical system concerns an unobservable theoretical construct does not imply that the system must estimate it. Measurement modeling is a methodology for analyzing claims to measure constructs, not a necessary intermediary between theoretical understanding and systematic decision-making. The task itself requires scrutiny.',
);

// 13
add(slide('An operationalization does not establish inferability',
    parentCenter(m5t15Chain([
        'Observable indicators',
        'Claim about a construct',
    ], 365)),
    m5t15Text('What warrants the inference?', 30),
    pause(),
    m5t15Card('Specifying indicators does not establish that they support the construct claim.', 29),
    _));
prose(
    'Specifying an operationalization does not establish that the construct can be inferred from observable indicators. The connection requires an argument about what those indicators warrant. This question remains even when the construct is unobservable and estimating it is an explicit goal of the task.',
);

// 14
add(slide('Reliability is not validity of interpretation and use',
    parentCenter(xtable(
        m5t15Panel('Reliability', 'How consistent is the measurement?', 390),
        m5t15Panel('Validity', 'Does the evidence support this interpretation and use?', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t15Card('A consistent score can still support an invalid interpretation.', 29),
    m5t15Cite('sec. 3'),
    _));
prose(
    'The reliability of a construct-operationalization is distinct from the validity of its intended interpretation and use. The diagnostic addresses a different issue: whether inference about an unobservable construct is necessary for the task, warranted by the evidence, or useful for explaining the relevant harm.',
);

// 15
add(slide('First ask whether the task needs inference',
    parentCenter(ytable(
        m5t15Panel('Observable', 'Is there an argument that the construct is unobservable?', 830, 28),
        pause(),
        m5t15Panel('Descriptive', 'Is inferring it necessary to describe or justify the task?', 830, 28),
        _
    ).ymargin(24)),
    _));
prose(
    'The first question asks whether there is an argument that the construct is unobservable. The second asks whether inferring it is necessary to describe or justify the task. Establishing unobservability does not settle task necessity: a task may be described and addressed through observable variables.',
);

// 16
add(slide('Then ask what the inference explains',
    parentCenter(ytable(
        m5t15Panel('Warranted', 'Do the observable indicators warrant the inference?', 830, 28),
        pause(),
        m5t15Panel('Proximate', 'Is the relevant harm explained by a construct-operationalization mismatch?', 830, 28),
        _
    ).ymargin(24)),
    _));
prose(
    'The remaining questions concern evidential warrant and the explanation of harm. Observable indicators may fail to warrant a construct claim. Separately, identifying a harm does not establish that a construct-operationalization mismatch explains it. The diagnostic asks what the framework contributes to understanding the problem.',
);

// BEGIN DISCUSSION 2
add(slide('Discussion 2: Is this inference necessary?',
    m5t15Text('Keep the same example and focus on the original institutional decision.', 26),
    m5t15Card('Could the institution address the identified harm without estimating the construct? Propose a concrete change based on observable information, or explain why the decision requires that inference.', 28),
    m5t15Text('Would your approach support the original decision, or only address part of the problem?', 27),
    m5t15Text('Discuss with classmates; record your own response to Question 2.', 25),
    _).id('discussion15-necessity'));
prose(
    'Move from criticizing the measurement to examining the task. A targeted change may reduce a harm without supporting the original decision or measuring the construct. Distinguish those outcomes. If estimating the construct remains necessary, explain which part of the task requires it.',
);
// END DISCUSSION 2

// 18
m5t15Roadmap(2);

// 19
add(slide('Height is observable',
    m5t15Text('Height is "not an unobservable theoretical construct."', 30),
    m5t15Text('Jacobs and Wallach model it as latent for exposition.', 28),
    pause(),
    m5t15Card('Even observable height needs a definition that fits its use.', 30),
    m5t15Cite('sec. 2.1'),
    _));
prose(
    'Jacobs and Wallach intentionally model height as latent for exposition while recognizing that it is observable. Observability answers the first question, while the interpretation and use still need scrutiny. Measurement error, shoes, and context-dependence can still matter, but they do not establish that latent inference is necessary to describe the problem.',
);

// 20
add(slide('Socioeconomic status (SES) inference',
    m5t15Text('Universal Credit counted two monthly paychecks in one assessment window.', 28),
    parentCenter(m5t15Chain([
        'Actual pay: GBP 1,000/month',
        'Assessed income: GBP 2,000/month',
    ], 365)),
    pause(),
    m5t15Card('Test timing sensitivity by shifting the window. No socioeconomic status (SES) estimate is needed.', 27),
    m5t15Cite('secs. 2.2, 3.1.1'),
    _));
prose(
    'Socioeconomic status cannot be measured directly. However, the harm discussed concerns monthly income assessments affected by payment timing. Such errors can be identified and corrected without estimating SES, as the income measurement-error model illustrates. The example shows a consequential mismatch, not the necessity of inferring SES itself.',
);

// 21
add(slide('A teacher\'s score changes from 6 to 96',
    parentCenter(xtable(
        ytable(
            m5t15Text('Year 1', 26, 180),
            nowrapText('6').fontSize(68),
            _
        ).center().ymargin(16),
        rightArrow(90).strokeWidth(3),
        ytable(
            m5t15Text('Year 2', 26, 180),
            nowrapText('96').fontSize(68),
            _
        ).center().ymargin(16),
        _
    ).center().xmargin(50)),
    pause(),
    m5t15Card('Evidence of unreliability if underlying effectiveness remained comparably stable.', 29),
    m5t15Cite('secs. 2.3, 3.1'),
    _));
prose(
    'Teacher effectiveness is unobservable, and the evaluation explicitly claims to measure it. One teacher\'s evaluation changes from 6 to 96 across two years. This indicates an unreliable measurement if underlying effectiveness remains comparably stable. The validity of the score still depends on its intended interpretation and use.',
);

// 22
add(slide('Score instability does not identify its cause',
    parentCenter(xtable(
        m5t15Panel('Change', 'Teacher effectiveness changed.', 260),
        m5t15Panel('Noise', 'Evaluations were noisy.', 260),
        m5t15Panel('Bias', 'Scores were biased.', 260),
        _
    ).center().xmargin(20)),
    pause(),
    m5t15Card('The score change alone does not distinguish these explanations.', 29),
    m5t15Cite('secs. 2.3, 3.1'),
    _));
prose(
    'The fact that a score is unstable can be identified without discerning why. Teacher effectiveness may have changed, evaluations may have been noisy, or scores may have been biased. Distinguishing these explanations requires more than observing the change, while validity requires considering what the score was intended to measure.',
);

// 23
add(slide('Explaining harm need not require latent inference',
    m5t15Text(bold('Height:') + ' the construct is observable.', 29),
    m5t15Text(bold('SES:') + ' income errors can be corrected directly.', 29),
    m5t15Text(bold('Teacher effectiveness:') + ' score instability is observable.', 29),
    pause(),
    m5t15Card('Identifying a problem does not establish that latent inference is necessary.', 29),
    _));
prose(
    'These examples show that measurement modeling can identify consequential assumptions. They do not establish that latent-construct inference is necessary to explain the harms or identify remedies. This raises a question about its distinctive explanatory contribution: should analysis begin within a measurement framework, or seek alternatives whenever possible?',
);

// 24
add(slide('Evidence for interpreting teacher scores',
    m5t15Text(bold('Content:') + ' Which aspects of teaching do test scores miss?', 28),
    m5t15Text(bold('Convergent:') + ' Do scores agree with other validated evaluations?', 28),
    m5t15Text(bold('Consequential:') + ' What happens when schools use these scores?', 28),
    pause(),
    m5t15Card('Specify a finding that would challenge the interpretation or use.', 28),
    m5t15Cite('secs. 3.2.2, 3.2.3, 3.2.7'),
    _));
prose(
    'Apply these questions to the intended interpretation and use. Comparison measures also need justification. Each check can supply evidence, but passing one check does not settle validity.',
);

// BEGIN DISCUSSION 3
add(slide('Discussion 3: How would you test the measurement?',
    m5t15Text('Keep the same example and draw on Section 3.', 26),
    m5t15Card('What evidence would help determine whether the proxy actually measures the intended construct?', 28),
    m5t15Text('Propose one concrete test. What result would cast doubt on the measurement?', 27),
    m5t15Text('Discuss with classmates; record your own response to Question 3.', 25),
    m5t15Cite('sec. 3'),
    _).id('discussion15-assurance'));
prose(
    'Focus on measurement validity rather than predictive accuracy. Ask students to describe a feasible comparison or observation and explain what finding would challenge the claimed relationship between proxy and construct.',
);
// END DISCUSSION 3

// 26
add(slide('Shared abstractions shape what gets optimized',
    parentCenter(xtable(
        m5t15Panel('Interpretability', 'A shared vocabulary for discussing the system.', 390),
        m5t15Panel('Observable grounding', 'Connections to variables in the system.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t15Card('Competing interests shape construct choices, measurement, and optimization.', 29),
    _));
prose(
    'Shared abstractions involve a pragmatic trade-off between interpretability and grounding in the observable variables of a system. Stakeholders may have competing interests in describing a system through one construct rather than another. Those choices shape what gets measured and ultimately optimized, placing pressure on evaluation validity.',
);

// 27
add(slide('Does the evidence support the assurance claim?',
    m5t15Text('Does the decision require this construct estimate?', 31),
    m5t15Text('Do the observations justify this estimate?', 31),
    m5t15Text('Does a measurement mismatch explain the harm?', 31),
    pause(),
    m5t15Card('Limit the assurance claim to what the evidence supports about the decision.', 30),
    _));
prose(
    'An institution\'s assurance claims may inform its own decisions or those of another institution. Specifying an operationalization does not establish that an inference is necessary or warranted. The question is whether the available evidence supports the intended interpretation and use, including when institutional interests shape what gets measured.',
);

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 15: What Makes an Evaluation Valid?';