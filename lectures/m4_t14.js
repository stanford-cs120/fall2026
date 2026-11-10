G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 4, meeting 14: November 10, 2026.
// Canonical content: notes/m4_t14.md.
// Browser: lecture.html?lecture=m4_t14
// All diagrams are native sfig schematics; no external figure assets.
// Pacing: reserve 50-60 minutes for the three section-ending discussions.
// Discussion prompts are provisional and may evolve with Ed responses.
// worksheets/configs/m4_t14.json intentionally has three blank response slots.
// Do not extract these prompts into tickets or change the header-only config.

function m4t14Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m4t14Card(message, size) {
    return parentCenter(frameBox(m4t14Text(message, size || 28, 860)).padding(16));
}

function m4t14Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

function m4t14Panel(heading, message, width, size) {
    return frameBox(ytable(
        m4t14Text(bold(heading), 25, width || 390),
        m4t14Text(message, size || 27, width || 390),
        _
    ).ymargin(14)).padding(14);
}

function m4t14Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m4t14Text(message, size || 27, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m4t14Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['who-made-the-reference-changes-what-it-tells-us', 'What can this data establish?'],
        ['safer-outputs-can-depend-on-hazardous-work', 'Who bears the cost of producing it?'],
        ['ai-changes-future-data-production', 'How does AI change future data?'],
    ]).id('m4t14-roadmap-' + selected));
    prose([
        'Quality assurance depends on who produced the reference data and how they produced it. AI assistance can change the relationship between reference data and the system being evaluated. Detecting assistance and assessing whether the reference supports an evaluation are different tasks.',
        'Data can be useful and a model can become safer while producing that data remains hazardous. Working conditions, support, and institutional responsibility must be assessed separately from label quality. An account of provenance therefore includes more than the text or label that enters a dataset.',
        'AI systems can influence future data through reused outputs and changes in human participation. Their use can also impose costs or benefits on people outside the immediate exchange. These mechanisms connect individual choices to the conditions under which shared knowledge is produced.',
    ][selected]);
}

// A potential input to reference production, not a claim that the system
// under evaluation necessarily generated its own reference answers.
function m4t14ReferencePipeline() {
    var parts = [];
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    parts.push(at(rect(930, 225).fillColor('white').strokeWidth(0), 0, 0));
    ['Human submission', 'Reference data', 'AI evaluation'].forEach(function (message, k) {
        parts.push(at(frameBox(m4t14Text(message, 25, 250)).padding(12),
            320 * k, 0));
    });
    parts.push(arrow(point(278, 33), point(310, 33)).strokeWidth(2));
    parts.push(arrow(point(598, 33), point(630, 33)).strokeWidth(2));
    parts.push(pause());
    parts.push(at(frameBox(m4t14Text('AI assistance', 25, 250)).padding(12), 0, 145));
    parts.push(arrow(point(137, 137), point(137, 77))
        .strokeWidth(2).strokeColor('#245A81'));
    parts.push(at(m4t14Text('Possible input to the reference', 24, 440), 330, 155));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

function m4t14SafetyWork() {
    var parts = [];
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    parts.push(at(rect(930, 225).fillColor('white').strokeWidth(0), 0, 0));
    ['Toxic material', 'Human labeling', 'Safety system'].forEach(function (message, k) {
        parts.push(at(frameBox(m4t14Text(message, 25, 250)).padding(12),
            320 * k, 0));
    });
    parts.push(arrow(point(278, 33), point(310, 33)).strokeWidth(2));
    parts.push(arrow(point(598, 33), point(630, 33)).strokeWidth(2));
    parts.push(pause());
    parts.push(arrow(point(457, 77), point(457, 137))
        .strokeWidth(2).strokeColor('#8A302E'));
    parts.push(at(frameBox(m4t14Text('Worker exposure', 25, 250)).padding(12), 320, 145));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// Conceptual loop across releases, not a measured causal-effect diagram.
function m4t14DataLoop() {
    var parts = [], blue = '#245A81';
    function point(x, y) { return [x, sfig.downSign * y]; }
    function at(block, x, y) {
        return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
    }
    function box(message, x, y, width) {
        parts.push(at(rect(width, 66).fillColor('white')
            .strokeWidth(1.8).strokeColor('#222222'), x, y));
        parts.push(at(nowrapText(message).fontSize(24), x + 12, y + 20));
    }
    function route(points, color) {
        for (var i = 1; i < points.length; i++) {
            var a = points[i - 1], b = points[i];
            parts.push((i === points.length - 1 ? arrow : line)(
                point(a[0], a[1]), point(b[0], b[1])
            ).strokeWidth(1.8).strokeColor(color || '#222222'));
        }
    }
    parts.push(at(rect(930, 270).fillColor('white').strokeWidth(0), 0, 0));
    box('AI systems', 0, 80, 210);
    box('Reused AI outputs', 300, 5, 300);
    box('Human contributions', 300, 150, 300);
    box('Future data', 710, 80, 210);
    route([[210, 113], [255, 113], [255, 38], [300, 38]]);
    route([[210, 113], [255, 113], [255, 183], [300, 183]]);
    route([[600, 38], [650, 38], [650, 113], [710, 113]]);
    route([[600, 183], [650, 183], [650, 113], [710, 113]]);
    route([[815, 146], [815, 258], [105, 258], [105, 146]], blue);
    parts.push(at(nowrapText('Later training / evaluation').fontSize(22)
        .strokeColor(blue), 320, 225));
    return overlay.apply(null, parts).recMouseShowHide(false);
}

// 1
add(titleSlide(ytable(
    nowrapText('Lecture 14: Labor, Incentives,').fontSize(40).strokeColor('darkblue'),
    nowrapText('and Data Externalities').fontSize(40).strokeColor('darkblue'),
    _
).center().ymargin(8),
    nil(),
    parentCenter(m4t14Text(
        'CS120: Introduction to AI Safety - November 10, 2026, Zachary Robertson',
        24, 900
    )),
    parentCenter(m4t14Text('Selected questions: Will, Paulina, Hudson, Yujen, Jolie, Orhun, and Justin', 24)),
    _).titleScale(1).titleHeight(110).id('lecture14'));
prose(
    'Who produces training and evaluation data is also a question of whose work is recognized as expertise or labor. This lecture connects three concerns: what reference data establishes, the conditions under which people produce it, and the effects of AI use on future contributions to shared knowledge.',
);

// 2
add(slide('From action choices to data-production loops',
    parentCenter(courseProgressionDiagram(4)),
    pause(),
    m4t14Card('Interactions with users and' + bold(' workers ') + 'also change future data.', 28),
    _));
prose(
    'Module 3 examined policies that choose actions over time. Module 4 shifts attention to interaction loops with people. Users and workers do not only supply fixed inputs: AI systems can change how they work, what they contribute, and the data available to train or evaluate later systems.',
);

// 3
add(slide('Who produces data, and who gets recognized?',
    m4t14Text(bold('Commissioned:') + ' experts, contractors, crowdworkers.', 30),
    pause(),
    m4t14Text(bold('Not commissioned:') + ' end-user feedback and public knowledge contributions.', 30),
    m4t14Card('Producing useful data is not the same as being recognized or compensated as a worker.', 28),
    _));
prose(
    'Paid training data comes from experts, contractors, and crowdworkers. Unpaid sources include end users who agree to terms of service and knowledge contributors whose outputs are treated as public goods. Who produces data is therefore also a question of whose work is recognized as expertise and compensated as labor.',
);

// 4
m4t14Roadmap(0);

// 5
add(slide('Who made the reference changes what it tells us',
    m4t14Text('Consider a reference used to evaluate medical answers:', 29),
    parentCenter(ytable(
        m4t14Text('A domain expert provides a diagnosis.', 29, 850),
        m4t14Text('A user gives a chat response a thumbs-up.', 29, 850),
        m4t14Text('A crowdworker submits an AI-assisted answer.', 29, 850),
        _
    ).ymargin(22)),
    pause(),
    m4t14Card('Who produced it, and what judgement were they asked to make?', 28),
    _));
prose(
    'Quality assurance depends not only on how an evaluation was established, but also on who participated in its construction. Expert diagnosis, user approval, and a crowdworker answer are different kinds of evidence. Their suitability depends on the intended task and the process that produced the reference, not simply its designation as human data.',
);

// 6
add(slide('Estimating LLM assistance in crowdwork',
    m4t14Text('June 2023 MTurk study: summarize medical abstracts in about 100 words.', 29),
    m4t14Text('46 submitted summaries from 44 workers.', 30),
    pause(),
    parentCenter(nowrapText(redbold('33-46%')).fontSize(56)),
    m4t14Text('Estimated share of summaries incorporating LLM assistance.', 29),
    m4t14Cite('Veselovsky et al., 2023 (v1)', 'https://arxiv.org/html/2306.07899v1'),
    _));
prose(
    'Veselovsky and colleagues studied 46 medical-abstract summaries submitted by 44 MTurk workers. Workers were asked to produce summaries of about 100 words. Using text classification and keystroke analysis, the authors estimated that 33-46% incorporated LLM assistance. This is an estimate for their June 2023 case study, not all crowdwork.',
);

// 7
add(slide('AI-assisted references may not be independent',
    parentCenter(m4t14ReferencePipeline()),
    m4t14Card('A reference described as human input may depend on AI outputs.', 29),
    _));
prose(
    'Crowdsourced data is often used as a reference for evaluating LLM outputs. When workers use LLMs to produce that reference, AI outputs enter a process intended to supply human input. This can introduce dependence between reference data and downstream systems; it does not establish that the submitted text is inherently low-quality.',
);

// 8
add(slide('Detecting AI use is not assessing quality',
    m4t14Text(bold('Veselovsky et al.:') + ' text classification and keystroke analysis estimate assistance.', 28),
    m4t14Text(bold('Pangram:') + ' reports high-accuracy detection from text alone.', 28),
    pause(),
    m4t14Card('Was AI used? Does the reference support the intended evaluation? These are different questions.', 29),
    parentCenter(xtable(
        cite('Veselovsky et al., 2023 (v1)', 'https://arxiv.org/html/2306.07899v1').scale(0.55),
        cite('Pangram', 'https://www.pangram.com/').scale(0.55),
        _
    ).center().xmargin(24)),
    _));
prose(
    'Veselovsky and colleagues use text classification and keystroke evidence to estimate assistance. Pangram reports high-accuracy detection of AI-generated text without keystroke recording. Both address the source of a response. Even successful detection does not determine whether that response is accurate, suitable as a reference, or independent of the system being evaluated.',
);

// BEGIN DISCUSSION 1: provisional slide-only prompt; preserve blank ticket.
// 9: allow approximately 18 minutes, including whole-class synthesis.
add(slide('Discussion 1: What makes this reference trustworthy?',
    m4t14Text(bold('Hypothetical'), 25),
    m4t14Card('A lab needs independent human reference summaries, but workers may use LLMs. Choose one intervention: detect AI use, change pay/workload, or redesign the task. What evidence would convince you that it improves the reference data?', 29),
    m4t14Card('Related Students Questions: Will and Paulina'),
    m4t14Text('Discuss with classmates; record your own response to Question 1.', 26),
    _).id('discussion14-reference'));
prose(
    'LLM assistance does not inherently make a summary low-quality. It does change the provenance of the reference. Assessing the evaluation requires considering both whether the summary is suitable for the task and how its production relates to the system being evaluated. A detector result alone does not resolve either question.',
);
// END DISCUSSION 1

// 10
m4t14Roadmap(1);

// 11
add(slide('Safer outputs can depend on hazardous work',
    parentCenter(m4t14SafetyWork()),
    m4t14Card('A model can become safer for users while producing its safety data remains hazardous.', 29),
    m4t14Cite('Perrigo, TIME, 2023', 'https://time.com/6247678/openai-chatgpt-kenya-workers/'),
    _));
prose(
    'Data can be high-quality and a model can become safer for its users while the work required to produce that safety remains hazardous. Labeling toxic material can expose workers to psychological harm. Worker protection is therefore a separate safety concern, not simply a means of improving the accuracy of labels.',
);

// 12
add(slide('Workers reported harm and constrained support',
    m4t14Text('TIME: Kenyan Sama workers labeled toxic text for OpenAI safety systems.', 29),
    m4t14Text('Reported take-home pay: roughly USD 1.32-2 per hour.', 30),
    pause(),
    m4t14Text('Four interviewed workers described psychological harm and counseling constrained by productivity demands.', 28),
    m4t14Text('Sama disputes their accounts of counseling access.', 26),
    m4t14Cite('Perrigo, TIME, 2023', 'https://time.com/6247678/openai-chatgpt-kenya-workers/'),
    _));
prose(
    'TIME reports that Kenyan workers employed by Sama labeled toxic text for OpenAI, with take-home pay of roughly USD 1.32-2 per hour. Four interviewed workers described psychological harm and counseling constrained by productivity demands. Sama disputes their accounts of counseling access. The disagreement concerns working conditions, not just the resulting labels.',
);

// 13
add(slide('Ending a contract does not erase its effects',
    parentCenter(ytable(
        m4t14Panel('February 2022', 'Sama ends its OpenAI work eight months early.', 830, 28),
        m4t14Panel('January 2023', 'Sama announces an exit from all content moderation work by March.', 830, 28),
        _
    ).ymargin(20)),
    pause(),
    m4t14Text('Contract termination is not the same as worker recovery.', 29),
    parentCenter(xtable(
        cite('Perrigo: OpenAI work', 'https://time.com/6247678/openai-chatgpt-kenya-workers/').scale(0.55),
        cite('Perrigo: moderation exit', 'https://time.com/6246018/facebook-sama-quits-content-moderation/').scale(0.55),
        _
    ).center().xmargin(24)),
    _));
prose(
    'Reporting connected the traumatic nature of the work to Sama ending its OpenAI contract in February 2022, eight months early. In January 2023, Sama announced it would leave all content moderation work by March, including a major Meta contract. Ending the work did not erase its effects on workers or the industry.',
);

// 14
add(slide('Outsourcing changes control and accountability',
    parentCenter(m4t14Chain(['OpenAI', 'Sama', 'Workers'])),
    m4t14Text('Contract rate: USD 12.50 per hour to Sama; reported take-home of USD 1.32-2.', 28),
    pause(),
    m4t14Text(bold('Possible considerations:') + ' costs; legal and regulatory oversight.', 29),
    m4t14Card('Who sets worker protections, and who checks conditions on the ground?', 29),
    m4t14Cite('Perrigo, TIME, 2023', 'https://time.com/6247678/openai-chatgpt-kenya-workers/'),
    _));
prose(
    'Costs and differences in legal oversight may matter, but the outsourcing motives are not established. In a separate pilot, Sama delivered 1,400 sensitive images. TIME reported that some were illegal under U.S. law; OpenAI denied intending to collect child sexual abuse images. Provenance includes institutional arrangements as well as technical processes.',
);

// BEGIN DISCUSSION 2: provisional slide-only prompt; preserve blank ticket.
// 15: allow approximately 18 minutes, including whole-class synthesis.
add(slide('Discussion 2: Who can make the work safe?',
    m4t14Text(bold('Hypothetical'), 25),
    m4t14Card('A lab proposes LLM labeling with humans reviewing only difficult cases. Would you approve the change? Identify the main worker-safety risk and who should be responsible for addressing it.', 29),
    m4t14Card('Related student questions: Hudson and Yujen'),
    m4t14Text('Discuss with classmates; record your own response to Question 2.', 26),
    _).id('discussion14-workers'));
prose(
    'Useful labels and safer model outputs do not establish that workers are protected. A constraint on working conditions must address the hazardous exposure itself and the institutions able to change it. Label quality alone cannot stand in for evidence about psychological harm, access to support, or the conditions under which work continues.',
);
// END DISCUSSION 2

// 16
m4t14Roadmap(2);

// 17
add(slide('AI can change its own future data supply',
    m4t14Text(bold('Data endogeneity:') + ' AI influences the production of future training or evaluation data.', 28),
    pause(),
    parentCenter(m4t14DataLoop()),
    _));
prose(
    'Data endogeneity occurs when AI systems influence the production of data used to train or evaluate future systems. This can happen through reuse of their outputs or through changes in human contributions. Crowdworkers may use LLMs, while other users may stop contributing to public knowledge platforms. Both change the future data supply.',
);

// 18
add(slide('Private AI use can impose public costs',
    m4t14Text(bold('Externalities:') + ' costs or benefits that fall on others without being fully accounted for by decision-makers.', 28),
    parentCenter(m4t14Chain(['Ask a chatbot', 'Receive a private answer'], 365)),
    pause(),
    m4t14Card('Possible effect: fewer public contributions for other people to use.', 29),
    _));
prose(
    'An externality is a cost or benefit that falls on others without being fully accounted for by those making the decision. A user may benefit from a private chatbot answer while contributing less to a public knowledge resource. This concerns who bears the consequences, whereas data endogeneity concerns how future data is produced.',
);

// 19
add(slide('Public contributions fell after ChatGPT\'s release',
    m4t14Text('Study window: the six months following ChatGPT\'s release.', 29),
    m4t14Text('Comparisons across programming and mathematics forums.', 29),
    pause(),
    m4t14Card('Activity declined; contributions fell across experience levels.', 30),
    m4t14Cite('del Rio-Chanona et al., 2024', 'https://doi.org/10.1093/pnasnexus/pgae400'),
    _));
prose(
    'Del Rio-Chanona and colleagues studied the six months after ChatGPT was released, comparing activity on programming and mathematics forums. They found that activity declined and contributions fell across experience levels. The results connect individual use of a chatbot to changes in a public resource that other people can use.',
);

// 20
add(slide('Access differences provide comparison settings',
    m4t14Text('The study uses differences in access, not only a before/after trend.', 29),
    parentCenter(xtable(
        m4t14Panel('Greater access', 'Stack Overflow', 390, 28),
        m4t14Panel('More limited access', 'Russian- and Chinese-language counterparts', 390, 28),
        _
    ).center().xmargin(32)),
    pause(),
    m4t14Text('Compare whether declines are larger where ChatGPT was more available.', 28),
    m4t14Cite('del Rio-Chanona et al., 2024', 'https://doi.org/10.1093/pnasnexus/pgae400'),
    _));
prose(
    'The study leveraged disparities in access to ChatGPT. Users of Russian- and Chinese-language counterparts of Stack Overflow had more limited access. These settings provide comparisons for changes in contribution activity. Access was not randomly assigned, so interpreting the comparison requires considering whether other differences between the settings could explain their trajectories.',
);

// 21
add(slide('Language differences provide a second test',
    m4t14Text('A separate analysis compares programming languages.', 29),
    parentCenter(m4t14Chain([
        'More popular language',
        'Richer training data',
        'Expected stronger answers',
    ], 240, 26)),
    pause(),
    m4t14Card('Do contribution changes differ where ChatGPT is expected to be more capable?', 29),
    m4t14Cite('del Rio-Chanona et al., 2024', 'https://doi.org/10.1093/pnasnexus/pgae400'),
    _));
prose(
    'A separate analysis leveraged differences in programming-language popularity. ChatGPT was expected to be more capable of answering questions about popular languages with richer training data. Comparing contribution changes across languages adds another way to examine the relationship between chatbot usefulness and public participation, distinct from the comparison based on access.',
);

// 22
add(slide('Stable peer ratings do not establish community health',
    parentCenter(xtable(
        m4t14Panel('Contribution activity', 'Declined across experience levels.', 390, 28),
        m4t14Panel('Peer-voted post quality', 'No significant change detected.', 390, 28),
        _
    ).center().xmargin(32)),
    pause(),
    m4t14Card('If the people voting change, does a vote mean the same thing before/after ChatGPT?', 28),
    m4t14Cite('del Rio-Chanona et al., 2024', 'https://doi.org/10.1093/pnasnexus/pgae400'),
    _));
prose(
    'The study found no significant change in post quality as measured by peer voting. This does not establish that the knowledge-sharing community is unchanged or healthy. Individual chatbot use may reduce contributions to a public resource while the remaining posts receive similar ratings. Contribution volume, distribution, and measured quality describe different aspects of the resource.',
);

// 23
add(slide('Expert contributions can also be unpaid',
    m4t14Text('Academic collaborators help explain results from frontier AI models.', 30),
    parentCenter(m4t14Chain([
        'Scientific explanation',
        'Access, visibility, recognition',
    ], 365)),
    pause(),
    m4t14Text('OpenAI describes unpaid collaborations as supporting independence.', 28),
    m4t14Cite('OpenAI: academic communities',
        'https://openai.com/index/building-scientific-understanding-with-academic-communities/'),
    _));
prose(
    'Safety filtering, text generation, and mathematical explanation can all be organized to produce useful data. OpenAI invites academic researchers to help explain frontier-model results in exchange for access, visibility, and recognition. The company describes unpaid collaborations as supporting independence. This extends the question of recognized data labor beyond contractors and crowdworkers.',
);

// 24
add(slide('Recognized status shapes rights and protections',
    m4t14Text('Employee, contractor, volunteer: the recognized role matters.', 30),
    pause(),
    m4t14Card('Rights and protections depend on where people live and how their work is classified.', 30),
    m4t14Text('Institutions influence both the production of data and its working conditions.', 28),
    _));
prose(
    'The institutions that organize data production also influence its working conditions. Rights and protections depend on where contributors live and the roles they are officially recognized as occupying, including employment, contracting, and volunteering. Provenance therefore concerns not just who supplied an artifact but the institutional relationship under which it was produced.',
);

// BEGIN DISCUSSION 3: provisional slide-only prompt; preserve blank ticket.
// 25: allow approximately 18 minutes, including whole-class synthesis.
add(slide('Discussion 3: A healthy knowledge commons?',
    m4t14Card('Suppose contributions fall after ChatGPT, but vote scores remain stable. What evidence would convince you that the public knowledge resource is getting worse?', 29),
    m4t14Text('Discuss with classmates; record your own response to Question 3.', 26),
    m4t14Card('Related student questions: Jolie, Orhun, and Justin'),
    m4t14Cite('del Rio-Chanona et al., 2024', 'https://doi.org/10.1093/pnasnexus/pgae400'),
    _).id('discussion14-commons'));
prose(
    'Which measures establish the health of a knowledge-sharing community? The Meta Stack Overflow discussion raises this question, but is not evidence for the study findings. A proposed measure should distinguish what remains visible in existing posts from effects on contribution volume, the distribution of participation, or people who depend on the shared resource.',
);
// END DISCUSSION 3

// 26
add(slide('Provenance links evidence, costs, and future data',
    m4t14Text('Useful data need not imply safe work.', 32),
    m4t14Text('Safer outputs need not imply safe production.', 32),
    m4t14Text('Private benefits need not capture public effects.', 32),
    pause(),
    m4t14Card('Ask what the data supports, who bears its costs, and how its production is changing.', 29),
    _));
prose(
    'Provenance connects three distinct concerns: whether data supports an intended use, whether the conditions of producing it are safe, and how AI changes future contributions and their public value. These concerns can move in different directions. Neither label quality nor improved model behavior is sufficient to establish safe and sustainable data production.',
);

if (!sfig.serverSide)
    document.title = 'CS120: Lecture 14: Labor, Incentives, and Data Externalities';