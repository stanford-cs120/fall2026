G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 5, meeting 16: November 17, 2026.
// Canonical content: notes/m5_t16.md.
// Browser: lecture.html?lecture=m5_t16
// Native diagrams only; the canonical note references no figure assets.
// Three discussions use one selected reading response throughout.
// Header-only tickets are independent of these displayed prompts.
// Local authoring draft: no shared-helper changes or publication.

function m5t16Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m5t16Card(message, size) {
    return parentCenter(frameBox(m5t16Text(message, size || 28, 860)).padding(16));
}

function m5t16Panel(heading, message, width, size) {
    return frameBox(ytable(
        m5t16Text(bold(heading), 25, width || 390),
        m5t16Text(message, size || 27, width || 390),
        _
    ).ymargin(14)).padding(14);
}

function m5t16Chain(messages, width, size, gap) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(22).strokeWidth(2));
        pieces.push(frameBox(m5t16Text(message, size || 26, width || 240))
            .padding(10));
    });
    return xtable.apply(null, pieces).center().xmargin(gap || 8);
}

function m5t16Cite(source, section) {
    var sources = {
        raji: ['Raji et al., 2020', 'https://arxiv.org/pdf/2001.00973'],
        bovens: ['Bovens, 2007', 'https://doi.org/10.1111/j.1468-0386.2007.00378.x'],
        iso: ['ISO 37000:2021', 'https://www.iso.org/standard/65036.html'],
        ecat: ['European Commission, 2026', 'https://digital-strategy.ec.europa.eu/en/policies/dsa-cooperation'],
        forensics: ['AI Forensics', 'https://aiforensics.org/'],
    };
    var entry = sources[source];
    return parentCenter(cite(
        entry[0] + (section ? ', ' + section : ''),
        entry[1]
    ).scale(0.6));
}

// Native sfig actor/forum relationship. The audit supplies evidence to the
// forum, rather than acquiring its decision authority. Coordinates work in
// both the browser and metapost backends.
function m5t16Accountability(withAudit) {
    var parts = [];
    var offset = withAudit ? 90 : 0;
    function point(x, y) {
        return [x, sfig.downSign * y];
    }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function label(message, x, y, size) {
        parts.push(transform(nowrapText(message).fontSize(size || 24))
            .pivot(0, 0).shift(x, sfig.downSign * y));
    }
    function node(heading, message, x) {
        parts.push(at(rect(235, 90).fillColor('white').strokeWidth(2),
            x, offset + 25));
        parts.push(transform(ytable(
            m5t16Text(bold(heading), 26, 215),
            m5t16Text(message, 23, 215),
            _
        ).center().ymargin(5)).pivot(0, 0)
            .shift(x + 117.5, sfig.downSign * (offset + 70)));
    }
    function segment(x1, y1, x2, y2, headed) {
        parts.push((headed ? arrow : line)(point(x1, y1), point(x2, y2))
            .strokeWidth(2));
    }
    node('Actor', 'Must explain conduct', 10);
    node('Forum', 'Can question and judge', 655);
    label('Explanation and justification', 450, offset + 42, 22);
    segment(255, offset + 78, 640, offset + 78, true);
    segment(772, offset + 115, 772, offset + 165, false);
    segment(772, offset + 165, 127, offset + 165, false);
    segment(127, offset + 165, 127, offset + 120, true);
    label('Judgment and possible consequences', 450, offset + 195, 24);
    if (withAudit) {
        parts.push(at(rect(235, 48).fillColor('white').strokeWidth(2), 655, 0));
        label('Audit evidence', 772.5, 24, 25);
        segment(772, 53, 772, offset + 15, true);
    }
    return overlay.apply(null, parts);
}

function m5t16Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['independent-scrutiny-is-growing', 'Who must answer, and to whom?'],
        ['smactr-organizes-an-internal-audit', 'What evidence would test the mechanism?'],
        ['who-chooses-and-revises-the-standards', 'What can the mechanism miss?'],
    ]).id('m5t16-roadmap-' + selected));
    prose([
        'Governance directs and oversees an institution. Accountability concerns who must answer for conduct and its consequences. Auditing examines compliance with standards and provides evidence. These functions are connected, but producing an audit finding does not by itself create a forum with authority to demand a response.',
        'SMACTR organizes an internal audit through scoping, mapping, artifact collection, testing, and reflection. These stages connect methods already introduced in the course. The question is what evidence they provide for evaluating a proposed accountability mechanism, rather than whether an organization has completed the paperwork.',
        'An auditing process can make values, principles, and decision criteria explicit within an organization. It does not settle who chooses or revises those standards. A mechanism that scrutinizes responses to findings may still leave unanswered who is accountable for defining what the audit examines.',
    ][selected]);
}

// 1
add(titleSlide(ytable(
    nowrapText('Lecture 16: When Do Audits').fontSize(40).strokeColor('darkblue'),
    nowrapText('Support Accountability?').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m5t16Text(
        'CS120: Introduction to AI Safety - November 17, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture16'));
prose(
    'Audits examine AI systems and the institutions working on them. The previous lecture asked whether evaluation evidence supports its intended interpretation and use. Here we ask how that evidence enters institutional decisions: who must respond, who can act, and what makes an institution accountable when a safeguard fails.',
);

// 2
add(slide('Institutions shape evaluation and action',
    parentCenter(courseProgressionDiagram(5)),
    pause(),
    m5t16Text('Institutions are coalitions that can interact.', 29),
    m5t16Card('Competing interests shape what evidence gets produced and whether anyone acts on it.', 29),
    _));
prose(
    'Choosing actions over time places AI systems in feedback loops with users. Institutions organize those interactions and interpret evidence about them. Thinking of institutions as coalitions highlights potentially competing interests within and between them. A central risk is that evidence of harm does not translate into an effective governing decision.',
);

// 3
m5t16Roadmap(0);

// 4
add(slide('Independent scrutiny is growing',
    m5t16Text(bold('ECAT:') + ' tests algorithmic systems and supports Digital Services Act enforcement.', 28),
    m5t16Text(bold('AI Forensics:') + ' conducts independent algorithmic audits.', 28),
    pause(),
    m5t16Card('External scrutiny does not replace internal governance.', 30),
    parentCenter(xtable(
        m5t16Cite('ecat'),
        m5t16Cite('forensics'),
        _
    ).center().xmargin(24)),
    _));
prose(
    'Third-party auditing and assurance institutions have become more prevalent, influenced by demand for independent assessment, external accountability, and support for enforcement. The European Centre for Algorithmic Transparency and AI Forensics illustrate different roles. Raji et al. focus on the continuing challenge of internal auditing and organization-wide accountability.',
);

// 5
add(slide('Governance is human-based',
    m5t16Card('A "human-based system by which an organization is directed, overseen and held accountable for achieving its defined purpose."', 29),
    pause(),
    m5t16Text('Ultimate organizational accountability lies with a governing body composed of people.', 30),
    m5t16Cite('iso', 'secs. 3.1.1, 3.3.4'),
    _));
prose(
    'ISO 37000 defines governance as a human-based system for directing, overseeing, and holding an organization accountable for its defined purpose. AI governance therefore concerns institutions and people, not merely technical mechanisms controlling system behavior. AI may support these processes, but ultimate organizational accountability lies with a governing body composed of people.',
);

// 6
add(slide('Responsibility is not accountability',
    parentCenter(xtable(
        m5t16Panel('Responsibility', 'An obligation to act or make decisions.', 390),
        m5t16Panel('Accountability', 'Answerability for how responsibilities are fulfilled.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t16Card('Assigning responsibility does not establish an accountability relationship.', 29),
    m5t16Cite('iso', 'secs. 3.2.2-3.2.3'),
    _));
prose(
    'Responsibility refers to the state of obligation to act or make decisions. Accountability refers to answerability for how those responsibilities are fulfilled. Assigning a person responsibility for a system does not by itself establish an effective accountability relationship: someone must be able to examine how that responsibility was exercised.',
);

// 7
add(slide('Accountability connects an actor to a forum',
    parentCenter(m5t16Accountability(false)),
    pause(),
    m5t16Text('Raji et al.: "responsible or answerable" for a system and its impacts.', 27),
    parentCenter(xtable(
        m5t16Cite('bovens'),
        m5t16Cite('raji', 'sec. 2'),
        _
    ).center().xmargin(24)),
    _));
prose(
    'Raji et al. use accountability broadly to mean being responsible or answerable for a system, its behavior, and its potential impacts. Bovens offers a narrower relational perspective: an actor must explain and justify conduct to a forum that can question, judge, and potentially impose consequences. The diagram expresses that relational account.',
);

// 8
add(slide('Audits provide evidence, not answerability',
    parentCenter(m5t16Accountability(true)),
    pause(),
    m5t16Text('An audit examines compliance with standards. Findings do not create authority.', 28),
    _));
prose(
    'An internal or external audit provides evidence that may help determine whether responsibilities have been fulfilled, such as whether an organization follows its ethical standards. Findings may reveal failures, but they do not establish accountability. That requires an obligated respondent, a forum able to evaluate the response, and possible consequences.',
);

// 9
add(slide('Responsible AI needs organization-wide governance',
    m5t16Text(bold('If') + ' responsible AI development is a core organizational purpose...', 30),
    pause(),
    m5t16Card('...then governance should hold the whole organization accountable for that purpose.', 31),
    m5t16Cite('raji', 'secs. 1-2'),
    _));
prose(
    'Raji et al. argue that many harms from AI systems are recognized only after deployment. If responsible AI development is a core purpose of an organization creating AI, a governance system should hold the whole organization accountable. This is a claim about organizational governance, not only about the work assigned to auditors.',
);

// 10
add(slide('An audit report is not the end of the process',
    parentCenter(m5t16Chain([
        'Audit finding',
        'Go/no-go decision',
        'Design mitigations',
        'Track implementation',
    ], 173, 25, 7)),
    pause(),
    m5t16Card('What changes because of the finding?', 31),
    m5t16Cite('raji', 'secs. 4-5'),
    _));
prose(
    'An audit obtains decision-relevant evidence. Raji et al. also identify post-audit activities, including go/no-go decisions, design mitigations, and tracking implementation. These activities determine whether the audit supports accountability. They need not form a one-pass sequence: mitigation may require further testing and reconsideration of the deployment decision.',
);

// 11
add(slide('Hypothetical: a finding without a response',
    parentCenter(m5t16Chain([
        'Significant risk identified',
        'Disagreement remains unresolved',
        'Release by default',
    ], 240, 26)),
    pause(),
    m5t16Card('A later incident exposes the documented warning and prior inaction.', 29),
    _));
prose(
    'Suppose an audit exposes problems, but groups disagree about whether they are hazardous or warrant a safety constraint. Without an effective mechanism for turning the finding into a decision, release remains the default. After an incident, the audit may expose that the organization knew about potential harms and did nothing.',
);

// BEGIN DISCUSSION 1
// 12
add(slide('Discussion 1: Where is the accountability gap?',
    m5t16Text('Choose a reading response and poster name for all three discussions.', 26),
    m5t16Card('Who must justify the deployment decision, to whom, and what can that forum do? Identify the missing or ineffective link.', 28),
    m5t16Text('What evidence beyond deployment itself supports your diagnosis?', 27),
    m5t16Text('Discuss with classmates; record your own response to Question 1.', 25),
    _).id('discussion16-gap'));
prose(
    'Use the selected response to identify an accountability relationship, rather than treating deployment itself as proof of a gap. An organization may deploy after scrutiny and an explicit decision to accept residual risk. Distinguish problems with auditor incentives, decision authority, and the obligation to explain or justify the decision.',
);
// END DISCUSSION 1

// 13
m5t16Roadmap(1);

// 14
add(slide('SMACTR organizes an internal audit',
    parentCenter(m5t16Chain([
        'Scoping',
        'Mapping',
        'Artifact Collection',
        'Testing',
        'Reflection',
    ], 130, 24, 6)),
    pause(),
    m5t16Card('A framework for organizing methods already introduced in the course.', 29),
    m5t16Cite('raji', 'sec. 4'),
    _));
prose(
    'SMACTR consists of five stages: Scoping, Mapping, Artifact Collection, Testing, and Reflection. The framework organizes methods already introduced in the course, from system boundaries and hazard analysis to datasheets, model cards, and robustness evaluations. Together these stages support an assurance claim and its connection to institutional decisions.',
);

// 15
add(slide('Scoping and mapping define the audit\'s reach',
    parentCenter(xtable(
        m5t16Panel('Scoping', 'Define objectives, system boundaries, and potential harms.', 390),
        m5t16Panel('Mapping', 'Use hazard analysis, such as FMEA, alongside ethical principles.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m5t16Text('What the audit examines depends on these choices.', 29),
    m5t16Cite('raji', 'sec. 4'),
    _));
prose(
    'During scoping, the organization defines audit objectives alongside ethical principles and potential harms. This corresponds to specifying system boundaries and assurance claims. In mapping, a hazard-analysis method such as FMEA is used alongside assessment against the organization\'s ethical principles. These stages shape the reach of the subsequent evidence collection.',
);

// 16
add(slide('Artifact collection documents the system and data',
    parentCenter(xtable(
        frameBox(m5t16Text('Datasheets', 29, 290)).padding(16),
        frameBox(m5t16Text('Model cards', 29, 290)).padding(16),
        _
    ).center().xmargin(40)),
    parentCenter(downArrow(45).strokeWidth(2)),
    m5t16Card('Evidence available to the audit', 30),
    m5t16Cite('raji', 'sec. 4'),
    _));
prose(
    'Datasheets and model cards support artifact collection by documenting the data and system being examined. This connects the audit to documentation methods introduced earlier in the course. The documentation also helps establish what later tests were intended to cover and what remains outside their scope.',
);

// 17
add(slide('Testing has a documented scope',
    parentCenter(frameBox(ytable(
        m5t16Text(bold('Within the documented scope'), 26, 810),
        m5t16Text('Robustness evaluations', 30, 810),
        m5t16Text('Group-disparity analysis and adversarial testing', 28, 810),
        _
    ).ymargin(18)).padding(18)),
    pause(),
    m5t16Text('What remains out of scope?', 30),
    m5t16Cite('raji', 'sec. 4'),
    _));
prose(
    'During testing, robustness evaluations are conducted. These may include group-disparity analysis and adversarial testing. Documentation helps establish what those tests were intended to cover and what remains out of scope. Interpreting the findings therefore requires connecting the results to the objectives and boundaries established earlier in the audit.',
);

// 18
add(slide('Reflection connects assurance to decisions',
    parentCenter(m5t16Chain([
        'Audit evidence',
        'Assurance claim',
    ], 365, 29)),
    pause(),
    m5t16Text('Who must respond?', 30),
    m5t16Text('What decisions change?', 30),
    m5t16Text('Who is accountable for residual risk?', 30),
    m5t16Cite('raji', 'sec. 4'),
    _));
prose(
    'In reflection, an assurance claim is synthesized. Institutional assurance is not only about the safety-relevant claim: it also specifies who must respond to findings, what decisions the assurance changes, and who is accountable for residual risk. This connects the evidence produced by the audit to the governance structure receiving it.',
);

// BEGIN DISCUSSION 2
// 19
add(slide('Discussion 2: What would show the mechanism works?',
    m5t16Text('Keep the same response and its proposed accountability mechanism.', 26),
    m5t16Card('What record or observation would distinguish the proposed mechanism from paperwork alone? Connect your test to one SMACTR stage or artifact.', 28),
    m5t16Text('What result would reveal that the mechanism failed?', 27),
    m5t16Text('Discuss with classmates; record your own response to Question 2.', 25),
    _).id('discussion16-test'));
prose(
    'Examine what the proposed mechanism would make observable. A named signatory, a completed form, or a committee described as independent does not alone establish effective scrutiny. Specify evidence that would distinguish an accountability relationship from documentation alone, and a result that would challenge the mechanism\'s effectiveness.',
);
// END DISCUSSION 2

// 20
m5t16Roadmap(2);

// 21
add(slide('Who chooses and revises the standards?',
    parentCenter(m5t16Chain([
        'Who chooses?',
        'Audit standards',
        'Who can revise?',
    ], 240, 29)),
    pause(),
    m5t16Card('Embedding ethical principles in an audit does not settle authority over them.', 29),
    m5t16Text('This remains a social-choice problem.', 28),
    _));
prose(
    'An organization\'s ethical principles may be embedded in its auditing process. This does not determine who chooses those standards or has the power to revise them. Governance remains human-based, and the allocation of authority over standards remains a social-choice problem rather than a question settled by completing the audit.',
);

// 22
add(slide('Audits make decision criteria common knowledge',
    m5t16Text('Values, principles, and decision criteria become explicit within the organization.', 31),
    pause(),
    m5t16Card('What remains outside the audit?', 32),
    _));
prose(
    'Audits can make accountability gaps explicit by making values, principles, and decision criteria common knowledge within an organization. The slow and potentially politically costly process of administering an audit may also counterbalance rapid AI development. Its usefulness still depends on the governance structure in which it is embedded.',
);

// BEGIN DISCUSSION 3
// 23
add(slide('Discussion 3: Can the mechanism miss the gap?',
    m5t16Text('Hypothetical variant: leadership narrows the audit, so the significant risk is never recorded.', 26),
    m5t16Card('Would the same mechanism expose this gap? Propose one rule about who can set or challenge the audit scope.', 28),
    m5t16Text('Who must answer if that rule is ignored?', 27),
    m5t16Text('Discuss with classmates; record your own response to Question 3.', 25),
    _).id('discussion16-scope'));
prose(
    'This hypothetical changes the earlier setting: the significant risk is not recorded because leadership narrows the audit. Test whether the same proposed mechanism can expose this gap. A mechanism for responding to findings may leave scope decisions unscrutinized. Identify who can challenge those decisions and who must answer if the proposed rule is ignored.',
);
// END DISCUSSION 3

// 24
add(slide('When do audits support accountability?',
    m5t16Text('Who must respond?', 32),
    m5t16Text('Who can scrutinize and judge?', 32),
    m5t16Text('What consequences can follow?', 32),
    pause(),
    m5t16Card('An audit is only as useful as the governance structure it is embedded in.', 30),
    _));
prose(
    'Audits provide evidence about systems and institutions. They can help close an accountability gap by making it explicit, but they do not create accountability out of thin air. Their usefulness depends on who must respond to findings, who can evaluate that response, and what consequences can follow.',
);

// Fit the longest title without changing the discussion block or its wording.
prez.slides.forEach(function (lectureSlide) {
    if (lectureSlide.id().get() === 'discussion16-test')
        lectureSlide.titleScale(1.4);
});

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 16: When Do Audits Support Accountability?';