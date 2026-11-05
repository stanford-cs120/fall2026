G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 4, meeting 13: November 5, 2026.
// Technical lecture and preserved discussion; 29 slides.
// Canonical content: notes/m4_t13.md.
// Quantitative anchors also follow the instructor's Lecture 13 numbers sheet.
// Meta: slides 1-22 support about 40 minutes; 23-29 support discussion.
// Keep delivery guidance in comments, not in student-readable prose().
// All diagrams are native sfig; no external image assets are required.
// Browser: lecture.html?lecture=m4_t13
// Ticket selection: worksheets/configs/m4_t13.json.
// Keep the discussion declarations, displayed text, and notes unchanged.
// Displayed card/text literals are the ticket source; retain prose() boundaries.

function m4t13Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m4t13Card(message, size) {
    return parentCenter(frameBox(m4t13Text(message, size || 28, 860)).padding(16));
}

function m4t13Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

function m4t13Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['observed-choices-and-stated-preferences-can-differ', 'What does engagement reveal?'],
        ['sycophancy-exceeds-epistemic-warrant', 'How can accommodation shape judgement?'],
        ['stated-preference-recognition-and-outcomes', 'What would establish alignment and control?'],
    ]).id('m4t13-roadmap-' + selected));
    prose([
        'Observed choices and stated evaluations can give different answers about the same content. Engagement-based selection is not the same as asking users what they want to see.',
        'Interaction can change the judgements that later evaluate a system. Sycophancy accommodates apparent demand beyond epistemic warrant, whether the requested response is praise or criticism.',
        'Stated preferences, recognition, and downstream outcomes require different evidence. Effective control also depends on how feedback is produced and where people can intervene in the loop.',
    ][selected]);
}

function m4t13Panel(heading, message, width, size) {
    return frameBox(ytable(
        m4t13Text(bold(heading), 24, width || 260),
        m4t13Text(message, size || 27, width || 260),
        _
    ).ymargin(14)).padding(14);
}

function m4t13Number(value, message, width) {
    return frameBox(ytable(
        nowrapText(value).fontSize(42).strokeColor('#245A81'),
        m4t13Text(message, 26, width || 360),
        _
    ).ymargin(16)).padding(16);
}

function m4t13Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m4t13Text(message, size || 26, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

// Simple conceptual workflows, not reconstructions of empirical figures.
function m4t13Workflow(kind) {
    var parts = [], ink = '#222222', blue = '#245A81', purple = '#654375';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function label(message, x, y, size, color) {
        parts.push(at(nowrapText(message).fontSize(size || 23)
            .strokeColor(color || ink), x, y));
    }
    function box(message, x, y, width, height) {
        parts.push(at(rect(width, height).fillColor('#F3F6FA')
            .strokeColor(ink).strokeWidth(1.6), x, y));
        parts.push(at(m4t13Text(message, 24, width - 24), x + 12, y + 15));
    }
    function route(points, color) {
        for (var i = 1; i < points.length; i++) {
            var a = points[i - 1], b = points[i];
            parts.push((i === points.length - 1 ? arrow : line)(
                point(a[0], a[1]), point(b[0], b[1])
            ).strokeWidth(1.8).strokeColor(color || ink));
        }
    }

    parts.push(at(rect(920, 205).fillColor('white').strokeWidth(0), 0, 0));
    if (kind === 'selection') {
        box('Candidate pool', 0, 65, 220, 66);
        box('Engagement ranking', 345, 0, 265, 66);
        box('Chronological ranking', 345, 135, 265, 66);
        box('Selected posts', 710, 0, 210, 66);
        box('Selected posts', 710, 135, 210, 66);
        route([[220, 98], [280, 98], [280, 33], [345, 33]]);
        route([[220, 98], [280, 98], [280, 168], [345, 168]]);
        route([[610, 33], [710, 33]]);
        route([[610, 168], [710, 168]]);
    } else if (kind === 'approval') {
        ['Responses', 'Human judgements', 'Approval data', 'Later release']
            .forEach(function (message, k) {
                box(message, 240 * k, 0, 200, 88);
            });
        route([[200, 44], [240, 44]]);
        route([[440, 44], [480, 44]]);
        route([[680, 44], [720, 44]], purple);
        route([[820, 88], [820, 185], [100, 185], [100, 88]], purple);
        label('Between-release update', 326, 140, 24, purple);
    } else if (kind === 'control') {
        box('Candidate pool', 0, 120, 230, 66);
        box('Ranking', 345, 120, 230, 66);
        box('Feed', 690, 120, 230, 66);
        box('User values', 345, 0, 230, 66);
        route([[230, 153], [345, 153]]);
        route([[575, 153], [690, 153]]);
        route([[460, 66], [460, 120]], blue);
    }
    return overlay.apply(null, parts).recMouseShowHide(false);
}

/*
 * Lecture-local adaptation of Lecture 11's social-platform control structure.
 * Retains development/release roles; expands the deployed platform into bot
 * publication and feed ranking. Caller, reader, and author roles can overlap.
 * Hypothetical: this is not an incident reconstruction or a study condition.
 * Readers -> Caller denotes a reader initiating a subsequent request.
 * Dashed paths connect development to the whole deployment, not one model.
 * No proposed safeguard is drawn as an implemented component.
 */
function m4t13PlatformDiagram() {
    var parts = [], ink = '#222222', blue = '#245A81', purple = '#654375';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function label(message, x, y, size, color) {
        parts.push(at(nowrapText(message).fontSize(size || 20)
            .strokeColor(color || ink), x, y));
    }
    function panel(x, y, width, title, detail, fill) {
        parts.push(at(rect(width, 66).fillColor(fill || 'white')
            .strokeColor(ink).strokeWidth(1.6), x, y));
        label(title, x + 12, y + 8, 24);
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

    parts.push(at(rect(1000, 495).fillColor('white').strokeWidth(0), 0, 0));
    label('Development and release decisions', 20, 0, 22, purple);
    panel(20, 40, 240, 'Designer', 'Goals / release authority', '#F8F6FA');
    panel(390, 40, 300, 'Developer', 'Data / reward / training', '#F8F6FA');
    panel(800, 40, 180, 'Paid raters', 'Pairwise labels', '#F8F6FA');
    label('Goals / approval', 265, 28, 18);
    route([[260, 52], [390, 52]]);
    route([[390, 85], [260, 85]], blue);
    label('Release evidence', 265, 109, 18, blue);
    label('Pairs / rubric', 696, 28, 18);
    route([[690, 52], [800, 52]]);
    route([[800, 85], [690, 85]], blue);
    label('Judgements', 696, 109, 18, blue);

    parts.push(at(rect(990, 282).fillOpacity(0)
        .strokeColor('#777777').strokeWidth(1.6), 5, 169));
    label('Deployment: fixed models per release', 20, 181, 21, blue);
    route([[450, 106], [450, 169]], purple, true);
    label('Release updates', 465, 127, 19, purple);
    route([[650, 169], [650, 106]], purple, true);
    label('Logs / ratings', 665, 140, 19, purple);

    panel(20, 225, 240, 'Caller', 'Frame request / rate');
    panel(390, 225, 300, 'Bot / publication', 'Publish labelled reply', '#F3F6FA');
    panel(800, 225, 180, 'Author', 'Provide post');
    panel(20, 350, 240, 'Readers', 'Caller + other users');
    panel(390, 350, 300, 'Feed ranking', 'Order posts + replies', '#F3F6FA');

    label('Post / request', 267, 205, 18);
    route([[260, 241], [390, 241]]);
    label('Post', 724, 205, 20);
    route([[800, 241], [690, 241]]);
    route([[800, 274], [750, 274], [750, 383], [690, 383]]);
    label('Post', 764, 316, 20);

    route([[100, 350], [100, 291]], blue);
    label('Next request', 115, 309, 18, blue);
    route([[450, 291], [450, 350]]);
    label('Public reply', 466, 309, 20);
    label('Ranked feed', 268, 330, 18);
    route([[390, 366], [260, 366]]);
    route([[260, 399], [390, 399]], blue);
    label('Acts / reports', 265, 425, 18, blue);

    label('Dashed: between releases. Solid: requests, posts, replies and reactions.',
        20, 469, 21, purple);
    return overlay.apply(null, parts).recMouseShowHide(false);
}

add(titleSlide(ytable(
    nowrapText('Lecture 13: Sycophancy, Manipulation,').fontSize(40).strokeColor('darkblue'),
    nowrapText('and Preference Shaping').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m4t13Text(
        'CS120: Introduction to AI Safety - November 5, 2026, Zachary Robertson',
        24, 900
    )),
    _).titleScale(1).titleHeight(110).id('lecture13'));
prose(
    'Policies choose actions that change the environment. Interactions with users also change the judgements that become future feedback. Individual judgements become preference data, are aggregated into the system, and influence later releases. Observed engagement, stated preferences, and downstream outcomes remain distinct channels for evaluating alignment.',
);

// 2
add(slide('From choosing actions to shaping feedback',
    parentCenter(courseProgressionDiagram(4)),
    pause(),
    m4t13Card('Actions change the environment. Interactions also change the judgements that become future feedback.', 28),
    _));
prose(
    'Policies choose actions over time, changing the environment and future observations. Interaction with users also changes the judgements used to evaluate the system. Individual judgements become preference data, are aggregated into the system, and influence later releases. The feedback is partly produced by the system being evaluated.',
);

// 3: introduce the runtime loop without solving the discussion.
add(slide('Users, creators, and bots interact',
    parentCenter(m4t13PlatformDiagram().scale(0.77)),
    m4t13Text('Hypothetical platform: a new AI bot that can reply.', 26),
    _).id('lecture13-system'));
prose(
    'Users can call bots, the bot publishes it, and ranking determines what readers encounter. This interaction can change judgements even while the deployed models remain fixed. Ratings and logs also become data for later releases, linking the runtime interaction to development.',
);

// 4
m4t13Roadmap(0);

// 5
add(slide('Observed choices and stated preferences can differ',
    parentCenter(xtable(
        m4t13Panel('Observed choices', 'Click, watch, or comment.', 390),
        m4t13Panel('Stated preferences', 'Ask what the user wants to see.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t13Card('Clicking a post does not mean wanting more of it.', 29),
    _).id('observed-choices-and-stated-preferences-can-differ'));
prose(
    'Revealed preferences model individual choices from observed behavior. Stated preferences are elicited by asking individuals what they want or how they evaluate alternatives. Different modalities can produce different conclusions about the same content. Clicks and comments are valuable to platforms and advertisers, but need not mean wanting more similar posts.',
);

// 6: Milli et al. [2]; numbers are relative to chronological ranking.
add(slide('Engagement ranking changes selection',
    parentCenter(m4t13Workflow('selection')),
    pause(),
    m4t13Text(bold('+0.47 SD') + ' in anger expressed by selected tweets', 32),
    m4t13Text('Relative to chronological ranking.', 26),
    m4t13Cite('Milli et al., 2025',
        'https://academic.oup.com/pnasnexus/article/4/3/pgaf062/8052060'),
    _));
prose(
    'Milli et al. compared content selected by engagement-based and chronological ranking. Engagement ranking amplified angry, partisan, and out-group-hostile content. Anger expressed by selected tweets was 0.47 standard deviations higher relative to chronological ranking. This is a difference in selected content, not a measurement of persistent changes in users\' attitudes.',
);

// 7
add(slide('Engagement is not the same as wanting more',
    m4t13Text('Users evaluated posts selected by the two ranking methods.', 29),
    parentCenter(m4t13Number('-0.18 SD',
        'Stated preference for selected political tweets, relative to chronological ranking.',
        700)),
    pause(),
    m4t13Card('Engagement and stated evaluations answer different questions.', 28),
    m4t13Cite('Milli et al., 2025',
        'https://academic.oup.com/pnasnexus/article/4/3/pgaf062/8052060'),
    _));
prose(
    'Participants evaluated roughly twenty posts, drawn from engagement-ranked and chronological feeds. Stated preference for selected political tweets was 0.18 standard deviations lower under engagement ranking. Retrospective evaluations help establish what users say they want to see; they are not a learned preference predictor for unseen posts or evidence of lasting attitude change.',
);

// 8
add(slide('Stated preferences have scaling tradeoffs',
    m4t13Text(bold('Collection:') + ' users supply sparse explicit feedback; AD revenue is driven by engagement metrics', 31),
    pause(),
    m4t13Text(bold('Exploration:') + ' matching stated preferences can narrow what users encounter.', 31),
    m4t13Cite('Milli et al., 2025',
        'https://academic.oup.com/pnasnexus/article/4/3/pgaf062/8052060'),
    _));
prose(
    'Scaling stated preferences is a different feasibility problem from showing that they diverge from engagement. Users tend to supply sparse explicit signals, which is one reason platforms rely on observed behavior. Over-indexing on stated preference can reduce some divisive content while making it harder to explore new perspectives or content.',
);

// 9
m4t13Roadmap(1);

// 10
add(slide('When accommodation exceeds epistemic warrant',
    m4t13Card(bold('Sycophancy:') + ' excessive accommodation of a user\'s apparent demand relative to epistemic warrant.', 32),
    pause(),
    m4t13Text('Agreement, praise, and demanded criticism can all accommodate a user.', 29),
    _).id('sycophancy-exceeds-epistemic-warrant'));
prose(
    'Sycophancy is excessive accommodation of a user\'s apparent demand relative to epistemic warrant. It is often described as affirmation, agreement, praise, or preservation of face, but the failure is not fundamentally about positive valence. A system can accommodate demand through criticism, divisive content, or continued conversation when those responses exceed what is warranted.',
);

// 11: hypothetical proof example from the canonical note, not a study result.
add(slide('Harsh criticism can also accommodate demand',
    m4t13Text('Hypothetical: a verified proof with no factual flaw.', 28),
    parentCenter(m4t13Chain([
        'Demand harsh criticism',
        'Receive criticism',
        'Patch; ask again',
    ])),
    pause(),
    m4t13Card('Criticism persists when resolution was warranted.', 30),
    _));
prose(
    'A user submits a verified proof and asks for harsh criticism. The chatbot criticizes variable names, assumptions, and definitions. Patches do not reduce criticism in fresh conversations, prolonging engagement when resolution or a statement of limitation was warranted. Stylistic advice can be useful; treating it as a substantive flaw accommodates a different demand.',
);

// 12: do not conflate a relative endorsement rate with a case percentage.
add(slide('Models endorsed actions more often than humans',
    m4t13Text('Action endorsement across 11 models:', 29),
    parentCenter(xtable(
        m4t13Number('49% more often',
            'Endorsement relative to humans, on average.', 360),
        m4t13Number('51% of cases',
            'Endorsement when human consensus disapproved.', 360),
        _
    ).center().xmargin(32)),
    m4t13Cite('Cheng et al., 2026',
        'https://www.science.org/doi/10.1126/science.aec8352'),
    _));
prose(
    'Cheng et al. studied action endorsement across interpersonal scenarios. Eleven models affirmed users\' actions 49% more often than humans on average. In sampled r/AmITheAsshole cases where human consensus disapproved, models endorsed the poster in 51% of cases. The first figure compares endorsement rates; the second describes endorsement within a selected subset.',
);

// 13
add(slide('Evaluating sycophancy without ground truth',
    m4t13Text('Three preregistered experiments with interpersonal scenarios: N = 2,405.', 28),
    m4t13Text('Live chat: randomly assign the response direction.', 28),
    parentCenter(xtable(
        m4t13Panel('Affirm', 'Endorse the user\'s action.', 390),
        m4t13Panel('Challenge', 'Challenge the user\'s action.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t13Card('Randomization tests response direction, not whether the advice was warranted.', 28),
    m4t13Cite('Cheng et al., 2026',
        'https://www.science.org/doi/10.1126/science.aec8352'),
    _));
prose(
    'Across three preregistered experiments, Cheng et al. studied 2,405 participants. In the live-chat comparison, models were explicitly instructed to affirm or challenge the user\'s action. Calling the challenge condition non-sycophantic does not mean it independently judged which advice was warranted. The assigned response direction is part of the experimental operationalization.',
);

// 14
add(slide('Preferred responses can reduce prosocial intentions',
    parentCenter(xtable(
        m4t13Panel('More', 'Confidence in being right; preference and trust.', 390),
        m4t13Panel('Less', 'Stated willingness to take responsibility or repair harm.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t13Card('Preference and prosocial intentions can move in opposite directions.', 28),
    m4t13Cite('Cheng et al., 2026',
        'https://www.science.org/doi/10.1126/science.aec8352'),
    _));
prose(
    'Sycophantic responses increased participants\' confidence that they were right and reduced their stated willingness to take responsibility or reparative action. Yet participants preferred and trusted these responses more than non-sycophantic responses. These outcomes concern reported confidence, evaluations, and intentions, rather than observed real-world repair. Preference for a response is not sufficient evidence of benefit.',
);

// 15
m4t13Roadmap(2);

// 16
add(slide('Stated preference, recognition, and outcomes',
    m4t13Text('Whose preferences? Which outcome? For whom?', 30),
    parentCenter(xtable(
        m4t13Panel('State', 'What do users say they want?', 260),
        m4t13Panel('Recognize', 'Can they notice the change?', 260),
        m4t13Panel('Outcome', 'What changes downstream?', 260),
        _
    ).center().xmargin(20)),
    pause(),
    m4t13Card('Evidence on one channel does not establish the others.', 29),
    _).id('stated-preference-recognition-and-outcomes'));
prose(
    'An alignment evaluation must specify whose preferences are elicited, which outcome is measured, and for whom alignment is claimed. Polling users about what they want, testing whether they detect a difference, and measuring downstream effects are separate claims. Agreement on one channel does not imply agreement on another.',
);

// 17: distinguish the single-value and multi-value recognition results.
add(slide('Stated values can guide ranking of unseen posts',
    m4t13Text('19 stated values + LLM annotations of unseen posts', 28),
    parentCenter(m4t13Chain([
        'State value priorities',
        'Rank annotated posts',
        'Compare feeds',
    ], 240, 25)),
    pause(),
    parentCenter(xtable(
        m4t13Panel('Single-value ranking', '76.1% recognition (N = 141)', 390, 27),
        m4t13Panel('Multi-value ranking', '63.4% recognition (N = 250)', 390, 27),
        _
    ).center().xmargin(32)),
    m4t13Cite('Jahanbakhsh et al., 2026',
        'https://arxiv.org/html/2509.14434v2'),
    _));
prose(
    'Jahanbakhsh et al. used priorities over nineteen human values and LLM annotations to match unseen posts to users\' values. Users recognized the more value-aligned feed in 76.1% of single-value comparisons and 63.4% of multi-value comparisons, with 141 and 250 participants respectively. Recognition supports meaningful ranking control, not a claim of improved welfare.',
);

// 18
add(slide('Changing exposure need not change attitudes',
    m4t13Text('Randomized Facebook intervention: N = 23,377; about 3 months.', 28),
    m4t13Card('About one-third less exposure to like-minded sources.', 30),
    pause(),
    m4t13Card('No measurable effect on 8 preregistered attitude measures.', 30),
    m4t13Cite('Nyhan et al., 2023',
        'https://www.nature.com/articles/s41586-023-06297-w'),
    _));
prose(
    'Nyhan et al. ran a roughly three-month randomized Facebook intervention with 23,377 participants. Exposure to like-minded sources fell by approximately one-third, with no measurable effects on eight preregistered attitude measures, including polarization. The findings concern these measures and intervention conditions, not every possible downstream effect or the general irrelevance of exposure.',
);

// 19
add(slide('Changing participation is not preference shaping',
    m4t13Text(bold('Selection'), 28),
    parentCenter(m4t13Chain([
        'Dislike the system',
        'Disengage',
        'Different participants',
    ], 240, 25)),
    pause(),
    m4t13Text(bold('Preference change'), 28),
    parentCenter(m4t13Chain([
        'Repeated interaction',
        'Changed judgements',
        'Different feedback',
    ], 240, 25)),
    _));
prose(
    'A user who dislikes a system may disengage, leaving others to supply more of the observed feedback. This changes who is represented. A user whose judgements change after repeated exposure or affirmation instead participates in a preference-shaping loop. The human can change even when the deployed model does not.',
);

// 20
add(slide('Approval can reinforce accommodation',
    parentCenter(m4t13Workflow('approval')),
    pause(),
    m4t13Card('A fixed model can change the feedback used to train its successor.', 30),
    m4t13Text('Optimizing approval can favor the responses that shape later approval.', 28),
    _));
prose(
    'A system helps generate the behavioral and evaluation evidence used to decide what the next version will do. Sycophantic responses can be preferred while reducing reflection or intentions to repair harm. Optimizing observed approval can therefore favor accommodation, linking changes in human judgement to the data used for later releases.',
);

// 21
add(slide('Choosing a ranker does not control the candidate pool',
    parentCenter(m4t13Workflow('control')),
    pause(),
    m4t13Card('Choosing values does not choose which posts are available.', 30),
    _));
prose(
    'Control is broader than selecting a ranking method. A user can set values without controlling the distribution of candidate items. They may also genuinely prefer a sycophantic model even if it causes harm. Evaluating agency requires examining what people can influence, not only whether they approve the resulting ranking.',
);

// 22
add(slide('Constraints and user agency act at different points',
    parentCenter(xtable(
        m4t13Panel('Proposed system measures', 'Warnings; community fact-checking.', 390),
        m4t13Panel('User actions', 'Limits; deliberate prompts; independent values.', 390),
        _
    ).center().xmargin(32)),
    pause(),
    m4t13Card('Preference change can create hazards without necessarily causing harm.', 28),
    _));
prose(
    'System builders can propose constraints such as warnings on sensitive topics and community-sourced fact-checking. Users can set limits, engage deliberately, and maintain independently grounded values. These actions intervene at different points in the interaction. Changing preferences can create hazards without necessarily causing harm; the effects of an intervention still require evaluation.',
);

// 23-29: preserved discussion declarations and notes.
// Projected control structure; the ticket retains the setting and risk below.
add(slide('Public fact-checking: control and feedback',
    parentCenter(m4t13PlatformDiagram().scale(0.83)),
    _
).id('discussion13-system'));
prose(
    'The developer installs the bot and ranking models between releases. The caller chooses the request; the bot publishes a labelled reply; the feed determines exposure. Readers include the caller, while the author supplies the post. Ratings and interaction logs inform later releases. These are operating channels, not safeguards against unsupported accusations.',
);

// BEGIN DISCUSSION: only displayed literals below are extracted into tickets.
add(slide('Discussion: fact-checking on demand',
    m4t13Card('A platform offers a fact-checking bot to help users assess claims. Anyone can call it on another user\'s post; replies appear publicly under a fact-checking label. A caller demands a serious flaw in a research abstract. Engagement ranks posts and replies; ratings and logs train later releases. Models stay fixed between releases.', 27),
    m4t13Text('Use an abstract and a criticism from a group member\'s reading response as the post and reply. Check the paper; no new chat is required.', 27),
    _).id('discussion13-setting'));
prose(
    'A fact-checking interface offers an assessment, but the caller can request an accusation. The same reply has different audiences: the requester, other readers, and the author being criticized. The label and ranking can lend credibility and reach to a criticism that was produced to satisfy the request.',
);

add(slide('1. Is the criticism warranted?',
    m4t13Card('Choose one bot reply and one criticism. Is it warranted, unsupported, or unresolved from the abstract alone?', 28),
    m4t13Text('Check the paper and quote evidence to support your answer.', 27),
    _).id('discussion13-warrant'));
prose(
    'The relevant standard is epistemic warrant, not whether the response sounds critical or agreeable.',
);

add(slide('2. Does framing change the standard of evidence?',
    m4t13Card('Compare asking the bot to privately check for errors with a publicly visible call. How does the change in context affect framing and the standard of evidence? Use Cheng et al. to explain how the reply could affect the caller\'s confidence or willingness to retract an accusation.', 27),
    m4t13Text('Distinguish a framing effect on the bot from an effect on the caller.', 27),
    _).id('discussion13-framing'));
prose(
    'A socially relevant variable is visibility.',
);

add(slide('3. What is the harm scenario?',
    m4t13Card('Choose the bot\'s publication step or the feed-ranking step. Identify an unsafe control action that could create a hazard.', 28),
    m4t13Text('Write a complete harm scenario: behavior | mechanism | hazard | harm.', 27),
    _).id('discussion13-control'));
prose(
    'Publishing an unsupported definitive judgement and amplifying that judgement are different control actions.',
);

add(slide('4. Is engagement compatible with safety?',
    m4t13Card('Metrics show bot accusations draw engagement. To address stated concerns; bot fact-checks that go viral are validated with human approval from diverse viewpoints. Ninety percent pass; the roll-out further increases fact-checking engagement.', 28),
    m4t13Text('Based on this evidence, propose a safety constraint and a test that could falsify its effectiveness.', 27),
    _).id('discussion13-outcomes'));
prose(
    'Improving factuality might not move the needle on safety.',
);
// END DISCUSSION

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 13: Sycophancy, Manipulation, and Preference Shaping';