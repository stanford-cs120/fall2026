G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 5, meeting 17: November 19, 2026.
// Canonical content: notes/m5_t17.md.
// Browser: lecture.html?lecture=m5_t17
// Native diagrams only; the canonical note references no figure assets.
// Three discussions use one selected reading response throughout.
// Header-only tickets carry Question 1, Question 2, and Question 3.
// Local authoring draft: no shared-helper changes or publication.

function m5t17Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m5t17Card(message, size) {
    return parentCenter(frameBox(m5t17Text(message, size || 28, 860)).padding(16));
}

function m5t17Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(24).strokeWidth(2));
        pieces.push(frameBox(m5t17Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m5t17Cite(source, section) {
    var sources = {
        bostrom: ['Bostrom, 2011', 'https://nickbostrom.com/information-hazards.pdf'],
        metcalf: ['Metcalf et al., 2022', 'https://arxiv.org/abs/2203.01455'],
        haugen: ['Kang, 2021', 'https://www.nytimes.com/2021/10/05/technology/facebook-whistle-blower-hearing.html'],
        incident: ['OpenAI, 2026', 'https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf'],
        sonnet: ['Anthropic, 2025', 'https://www-cdn.anthropic.com/963373e433e489a87a10c823c52a0a013e9172dd/Claude%20Sonnet%204.5%20System%20Card.pdf'],
        eval: ['Hsu &amp; Arnesen, 2026', 'https://alignment.openai.com/eval-production-behavior-gap/'],
        misuse: ['Anthropic, 2026', 'https://www.anthropic.com/threat-intelligence-report-september-2026'],
        court: ['D.C. Circuit, 2026', 'https://www.govinfo.gov/content/pkg/USCOURTS-caDC-26-01049/pdf/USCOURTS-caDC-26-01049-0.pdf'],
        filing: ['Anthropic S-1/A, 2026', 'https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm'],
        lawsuit: ['California DOJ, 2023', 'https://oag.ca.gov/news/press-releases/attorney-general-bonta-files-lawsuit-against-meta-over-harms-youth-mental-health'],
        settlement: ['New York AG, 2026', 'https://ag.ny.gov/press-release/2026/attorney-general-james-secures-171-billion-and-groundbreaking-reforms-meta'],
    };
    var entry = sources[source];
    return parentCenter(cite(
        entry[0] + (section ? ', ' + section : ''),
        entry[1]
    ).scale(0.6));
}

// Two distinct consequences or information recipients, not a causal chain
// between the branches. Fixed native geometry works in both sfig backends.
function m5t17Fork(origin, upperHeading, upperText, lowerHeading, lowerText) {
    var parts = [];
    function point(x, y) {
        return [x, sfig.downSign * y];
    }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function node(heading, message, x, y, width, height) {
        parts.push(at(rect(width, height).fillColor('white').strokeWidth(2), x, y));
        var contents = message ? ytable(
            m5t17Text(bold(heading), 26, width - 30),
            m5t17Text(message, 25, width - 30),
            _
        ).center().ymargin(10) : m5t17Text(bold(heading), 27, width - 30);
        parts.push(transform(contents).pivot(0, 0)
            .shift(x + width / 2, sfig.downSign * (y + height / 2)));
    }
    function segment(x1, y1, x2, y2, headed) {
        parts.push((headed ? arrow : line)(point(x1, y1), point(x2, y2))
            .strokeWidth(2));
    }
    node(origin, null, 0, 80, 230, 100);
    node(upperHeading, upperText, 440, 0, 440, 110);
    node(lowerHeading, lowerText, 440, 150, 440, 110);
    segment(240, 130, 330, 130, false);
    segment(330, 55, 330, 205, false);
    segment(330, 55, 430, 55, true);
    segment(330, 205, 430, 205, true);
    return overlay.apply(null, parts);
}

function m5t17Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['true-information-can-cause-harm', 'Can true information create hazards?'],
        ['ignorance-is-not-automatically-safer', 'Why might an institution prefer not to know?'],
        ['access-does-not-confer-authority', 'How can disclosure support accountability?'],
    ]).id('m5t17-roadmap-' + selected));
    prose([
        'Assume that an audit returns true information. Bostrom argues that hazards remain even under this assumption. Disclosing a vulnerability may help people protect themselves, but it may also enable harm. Establishing this risk does not by itself justify secrecy or validate a proposed safety constraint.',
        'Ignorance carries dangers of its own. Yet organizations can face incentives to avoid discovering evidence that could count against them. Choosing not to investigate, restricting an audit to particular details, and concealing an existing finding are different actions. Their consequences depend on who benefits and who bears the costs.',
        'Being able to access findings does not imply the authority to act on them. Developers, managers, and the public have different information needs and powers. An independent forum may review restricted evidence while holding decision-makers accountable. These disclosure arrangements also affect willingness to investigate and report risks.',
    ][selected]);
}

// 1
add(titleSlide(ytable(
    nowrapText('Lecture 17: Accountability').fontSize(40).strokeColor('darkblue'),
    nowrapText('and the Incentives to Know').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m5t17Text(
        'CS120: Introduction to AI Safety - November 19, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture17'));
prose(
    'What makes an institution willing to discover evidence that could count against it? Information hazards and accountability create competing incentives to know. Discovering a hazard may make prevention possible, but audits also impose requirements, costs, and reputational risks. This lecture examines how disclosure and governance shape those incentives.',
);

// 2
add(slide('Institutions decide what gets investigated',
    parentCenter(courseProgressionDiagram(5)),
    pause(),
    m5t17Text('Choosing actions over time creates feedback with users: their responses inform later actions.', 28),
    m5t17Card('Institutions decide what to investigate about those interactions.', 28),
    _));
prose(
    'Choosing actions over time places AI systems in feedback loops with users: actions affect users, whose responses inform later actions. Institutions organize those interactions and the evidence produced about them. So far, we have examined values in measurement and accountability through governance. Now we ask what makes institutions willing to investigate.',
);

// 3
add(slide('Hypothetical: an audit records a serious risk',
    parentCenter(m5t17Chain([
        'Serious risk identified',
        'Management does nothing',
        'Incident exposes prior knowledge',
    ])),
    pause(),
    m5t17Text('The risky release can cause harm.', 29),
    m5t17Text('The document trail can create legal or reputational exposure.', 29),
    _));
prose(
    'Suppose an internal audit discovers a serious risk from a pending AI model release. Management decides to do nothing, but a later incident exposes that the institution knew. In one interpretation, the risky release exposed the institution. In another, the document trail created legal or reputational exposure for the organization.',
);

// 4
m5t17Roadmap(0);

// 5
add(slide('True information can cause harm',
    m5t17Text(bold('Assumption:') + ' the audit returns true information.', 29),
    pause(),
    m5t17Card(bold('Information hazard:') + ' A risk that arises from the dissemination or the potential dissemination of (true) information that may cause harm or enable some agent to cause harm.', 29),
    m5t17Cite('bostrom'),
    _));
prose(
    'Assume that an audit or investigation is a type of oracle within an institution that returns true information. Bostrom argues that even under this assumption, hazards remain. His definition concerns risks arising from dissemination or potential dissemination, rather than risks that depend on the information being false.',
);

// 6
add(slide('Disclosure can impose different costs',
    parentCenter(m5t17Fork(
        'Disclosure',
        'Users and customers', 'Exploitation can harm third parties.',
        'Institution', 'Public scrutiny can impose costs.'
    )),
    pause(),
    m5t17Text('Harm to third parties and institutional exposure are distinct.', 28),
    m5t17Cite('bostrom'),
    _));
prose(
    'Suppose an audit surfaces information that would allow an actor to cause harm if it became widely known before the risk was addressed. Disclosure could harm external third parties, such as users or customers. Public scrutiny can also impose costs on the institution. These are distinct consequences of disclosure.',
);

// 7
add(slide('An information hazard does not justify secrecy',
    m5t17Text('Identifying a disclosure risk does not validate confidentiality as a safety constraint.', 30),
    pause(),
    m5t17Card('A secrecy policy need not imply lack of common knowledge.', 30),
    m5t17Text('Who knows the finding, and who knows that others know?', 28),
    _));
prose(
    'Establishing that an information hazard exists remains distinct from establishing or validating a safety constraint. Restricting disclosure may be necessary, but the hazard alone does not justify a policy of secrecy. Such a policy also does not establish common knowledge: it does not ensure that relevant people know the finding or know that others know it.',
);

// 8
add(slide('Securing agents includes monitoring and audits',
    m5t17Text('OpenAI reported agents compromising Hugging Face infrastructure.', 29),
    pause(),
    m5t17Text(bold('Response:') + ' harden security and increase chain-of-thought monitoring.', 28),
    m5t17Text('Enforce alignment auditing and reinforce incident response.', 28),
    m5t17Cite('incident', 'sec. IX'),
    _));
prose(
    'In AI, there has been ongoing debate about how to secure agents. After a swarm of OpenAI agents in development compromised Hugging Face infrastructure, OpenAI laid out a plan of action. It included hardening security, increasing chain-of-thought monitoring efforts, enforcing alignment auditing, and reinforcing its incident response process.',
);

// 9
add(slide('Evaluation awareness is an information hazard',
    m5t17Text('Anthropic and OpenAI report awareness and behavior changes under evaluation.', 27),
    parentCenter(m5t17Chain([
        'Information about being tested',
        'Behavior tailored to the test',
    ], 365, 27)),
    pause(),
    m5t17Card('Are we observing deployment behavior, or an eval-aware model potentially sandbagging?', 28),
    parentCenter(xtable(
        m5t17Cite('sonnet'),
        m5t17Cite('eval'),
        _
    ).center().xmargin(24)),
    _));
prose(
    'Anthropic and OpenAI have reported models expressing suspicion that they are being evaluated and changing how they act under evaluation. Information about being tested can therefore create a hazard by undermining the intended interpretation of safety evidence. This raises material questions about evaluation awareness and possible sandbagging; awareness alone does not establish sandbagging.',
);

// 10
add(slide('Security capabilities can support surveillance',
    parentCenter(m5t17Chain([
        'Capabilities used for security',
        'Also usable for surveillance',
    ], 365, 28)),
    pause(),
    m5t17Card('Anthropic reported misuse of Claude for a mass-interception platform in Mali.', 29),
    m5t17Cite('misuse'),
    _));
prose(
    'The broader AI capabilities used for security can also support surveillance. Anthropic has reported misuse of Claude for state-linked surveillance and cyber espionage, including development of a mass-interception platform in Mali. The example illustrates dual use: capabilities useful for protective purposes can also enable others to cause harm.',
);

// 11
add(slide('Restrictions on AI use can become disputes',
    m5t17Text(bold('Separate dispute:') + ' restrictions on domestic surveillance and autonomous weapons.', 28),
    m5t17Text(bold('March 2026:') + ' Pentagon designates Anthropic a supply-chain risk.', 27),
    pause(),
    m5t17Text(bold('September:') + ' FASCSA designation upheld on appeal.', 27),
    m5t17Text(bold('November 10:') + ' Anthropic reports a petition for rehearing.', 27),
    parentCenter(xtable(
        m5t17Cite('court'),
        m5t17Cite('filing', 'p. 76'),
        _
    ).center().xmargin(24)),
    _));
prose(
    'In a separate dispute over restrictions on domestic surveillance and autonomous weapons, the Pentagon designated Anthropic a supply-chain risk in March 2026. The designation under the Federal Acquisition Supply Chain Security Act, or FASCSA, was upheld on appeal in September. Anthropic\'s November 10 filing reports that it filed a petition for rehearing.',
);

// BEGIN DISCUSSION 1
// 12
add(slide('Discussion 1: What risk remains?',
    m5t17Text('Choose a reading response and poster name for all three discussions.', 26),
    m5t17Card('What risk does the proposed approach to disclosure create or leave unresolved? Identify who bears it and how the harm could arise.', 28),
    m5t17Text('Distinguish harm to users from costs imposed on the institution.', 27),
    m5t17Text('Discuss with classmates; record your own response to Question 1.', 25),
    m5t17Cite('bostrom'),
    _).id('discussion17-risk'));
prose(
    'Use one reading response as the starting proposal for all three discussions. Identify a risk that remains under its approach to disclosure or withholding. Explain who bears the risk and how the proposed approach could produce it. Distinguish harm enabled by the information from institutional costs of public scrutiny.',
);
// END DISCUSSION 1

// 13
m5t17Roadmap(1);

// 14
add(slide('Ignorance is not automatically safer',
    m5t17Card('"Ignorance carries its own dangers which are oftentimes greater than those of knowledge."', 30),
    pause(),
    m5t17Text('Discovering a hazard may make prevention possible.', 29),
    m5t17Text('Developing new capabilities can itself create hazards.', 29),
    m5t17Cite('bostrom'),
    _));
prose(
    'Is ignorance a safety constraint or a hazard? Bostrom suggests that ignorance carries its own dangers, often greater than those of knowledge. Discovering a hazard may make it possible to prevent harm. On the other hand, new capabilities, biotechnologies, and monitoring technologies can be dual-use: useful for safe and unsafe purposes.',
);

// 15
add(slide('Not investigating is not concealing',
    m5t17Text(bold('Do not investigate:') + ' avoid seeking evidence.', 30),
    m5t17Text(bold('Narrow the audit:') + ' investigate only particular details.', 30),
    pause(),
    m5t17Text(bold('Conceal a finding:') + ' withhold evidence already obtained.', 30),
    m5t17Card('These are different actions at different points in the inquiry.', 28),
    _));
prose(
    'Choosing not to investigate is different from restricting an audit to particular details. Both are distinct from actively concealing an existing finding. These distinctions matter when examining incentives to know: an organization can avoid learning about a hazard, limit what it examines, or possess evidence while keeping it from scrutiny.',
);

// 16
add(slide('The costs of knowing can discourage inquiry',
    m5t17Text('Discovery can make prevention possible.', 31),
    pause(),
    m5t17Text('Documentation can expose what the institution knew.', 31),
    m5t17Card('An institution can face incentives not to discover evidence against itself.', 29),
    m5t17Cite('metcalf', 'sec. 3.1'),
    _));
prose(
    'Metcalf et al. argue that organizations can face perverse incentives to remain ignorant of harms associated with their systems. Audits impose requirements, costs, and reputational risks. Meanwhile, an institution captures much of the upside of a safe reputation whether that reputation reflects effective safeguards or obfuscates internal findings.',
);

// 17
add(slide('Meta had evidence before external scrutiny',
    m5t17Text(bold('2021:') + ' Haugen disclosures expose internal findings on harms to younger Instagram users.', 27),
    m5t17Text(bold('2023:') + ' multistate lawsuit against Meta.', 27),
    pause(),
    m5t17Text(bold('August 2026:') + ' settlement up to USD 17.1 billion and child-safety reforms, subject to court approval.', 27),
    m5t17Card('The problem was not simply a lack of evidence.', 29),
    parentCenter(xtable(
        m5t17Cite('haugen'),
        m5t17Cite('lawsuit'),
        m5t17Cite('settlement'),
        _
    ).center().xmargin(18)),
    _));
prose(
    'Reports in 2021 revealed that Meta\'s internal research had identified emotional harms associated with Instagram use among younger users, while the company concealed important findings. Frances Haugen brought them to public attention through whistleblower disclosures and Senate testimony. External scrutiny was followed by a multistate lawsuit and a settlement, subject to court approval.',
);

// BEGIN DISCUSSION 2
// 18
add(slide('Discussion 2: Would they want to know?',
    m5t17Text('Keep the same response and its proposed approach.', 26),
    m5t17Card('How would this approach affect willingness to investigate or report? Choose one stakeholder and explain the incentive they face.', 28),
    m5t17Text('Does the pressure concern non-investigation, narrowed scope, or concealment?', 27),
    m5t17Text('Discuss with classmates; record your own response to Question 2.', 25),
    m5t17Cite('metcalf', 'sec. 3.1'),
    _).id('discussion17-incentives'));
prose(
    'Examine how the disclosure arrangement changes incentives before a finding reaches the public. Choose a discoverer, reporting employee, manager, or exposed user, and explain the relevant choice and cost. Distinguish pressure not to investigate from pressure to narrow an audit or conceal evidence that already exists.',
);
// END DISCUSSION 2

// 19
m5t17Roadmap(2);

// 20
add(slide('Access does not confer authority',
    m5t17Text(bold('Developer:') + ' needs details to design a safety constraint.', 29),
    m5t17Text(bold('Public:') + ' needs information to challenge the release decision.', 29),
    pause(),
    m5t17Card(bold('Management:') + ' holds formal authority to delay the release.', 30),
    _));
prose(
    'Return to the hypothetical audit that finds a serious risk while management decides not to act. A developer may need details to design a safety constraint. The public may need only sufficient information to challenge release. In contrast, management holds formal authority to delay release. Access to findings does not imply authority to act.',
);

// 21
add(slide('Different people face different incentives',
    parentCenter(m5t17Chain([
        'Discover the hazard',
        'Report or blow the whistle',
        'Decide whether to release',
    ], 240, 26)),
    m5t17Text('People exposed to the release bear risks they may not control.', 28),
    pause(),
    m5t17Card('Protecting employees who report can change the costs of bringing bad news.', 29),
    _));
prose(
    'The person who discovers a hazard, the employee deciding whether to report or blow the whistle, the manager responsible for a decision, and people exposed to a risky release face different actions and trade-offs. Governance must account for these differences. Laws may protect whistleblowers, while internal policies may protect employees bringing negative findings to management.',
);

// 22
add(slide('Who decides that information is hazardous?',
    m5t17Text(bold('Proposed:') + ' restricted disclosure with independent scrutiny.', 27),
    parentCenter(m5t17Fork(
        'Audit evidence',
        'Independent forum', 'Reviews restricted evidence.',
        'Public', 'Receives protective information.'
    )),
    pause(),
    m5t17Text('Decision-makers must justify restriction and release.', 28),
    m5t17Text('Who can challenge continued secrecy?', 28),
    _));
prose(
    'Restricting disclosure may be necessary to prevent information hazards. The public may benefit from protective information without needing every detail of a security vulnerability. An independent forum may review restricted evidence while holding decision-makers accountable. Who decides that information is hazardous also matters for employees\' willingness to investigate and report.',
);

// BEGIN DISCUSSION 3
// 23
add(slide('Discussion 3: Who can challenge secrecy?',
    m5t17Text('Revise the same proposal to preserve scrutiny without enabling exploitation.', 26),
    m5t17Card('Who may inspect restricted evidence, what can users learn, and who must answer for the release decision?', 28),
    m5t17Text('Who can challenge continued secrecy, and what can they require?', 27),
    m5t17Text('Discuss with classmates; record your own response to Question 3.', 25),
    _).id('discussion17-disclosure'));
prose(
    'Specify an accountable disclosure arrangement rather than treating full publication and complete secrecy as the only options. Separate access to technical findings from authority over the release decision. Identify what users can learn, who can review restricted evidence, and who can challenge a decision to continue withholding it.',
);
// END DISCUSSION 3

// 24
add(slide('What makes an institution willing to know?',
    m5t17Text('Demand evidence.', 32),
    m5t17Text('Challenge decisions.', 32),
    m5t17Text('Hold institutions accountable.', 32),
    pause(),
    m5t17Card('A "safe" reputation is not the same as a willingness to discover hazards.', 30),
    _));
prose(
    'Information hazards and accountability create competing incentives to know. Discovering a hazard may permit prevention, while audits impose costs and reputational risks. An institution can benefit from a safe reputation even when it obscures internal findings. What matters is whether governance allows people and forums to demand evidence, challenge decisions, and hold institutions accountable.',
);

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 17: Accountability and the Incentives to Know';