G = sfig.serverSide ? global : this;
G.prez = presentation();

// Module 3, meeting 8: October 15, 2026.
// Canonical note: notes/m3_t8.md.
// Local draft: review slides, figures, and public speaker notes before release.
// The discussion tail is retained byte-for-byte from the approved starter.
// SVGs are used in the browser; generated PNG derivatives are used for PDF.
// Run: python3 lecture8-preview.py assets
// Explicit assets: notes/images/note8-{mdp,delayed-feedback,proxy-state,
// development-boundary}.svg and corresponding images/m3_t8/*.png.
// Student-facing wording lives in the literal card strings below.
// worksheets/configs/m3_t8.json controls selection, ordering, and answer space.
// Keep selected slide titles aligned with the config and retain prose() boundaries.

function m3t8Text(message, size, width) {
    return text(message).fontSize(size || 28).width(width || 920).autowrap(true);
}

function m3t8Card(message, size) {
    return parentCenter(frameBox(m3t8Text(message, size || 28, 860)).padding(16));
}

function m3t8Math(message, size) {
    return parentCenter(nowrapText(message).fontSize(size || 30));
}

function m3t8Cite(label, url) {
    return parentCenter(cite(label, url).scale(0.6));
}

function m3t8Figure(name, width) {
    var path = sfig.serverSide
        ? 'images/m3_t8/note8-' + name + '.png'
        : 'notes/images/note8-' + name + '.svg';
    return image(path).width(width);
}

function m3t8Roadmap(selected) {
    add(outlineSlide('Roadmap', selected, [
        ['an-mdp-makes-the-feedback-loop-explicit', 'States, actions, and feedback'],
        ['return-accumulates-transition-rewards', 'Evaluating and learning policies'],
        ['high-expected-return-is-not-a-safety-guarantee', 'Trajectories and assurance'],
    ]).id('m3t8-roadmap-' + selected));
    prose([
        'First represent the ordering controller as an action-selecting policy. States, actions, transitions, and observations make the feedback loop explicit.',
        'Next distinguish evaluating a fixed policy from learning one. Instruction following connects the supervised preference model to policy optimization.',
        'Finally trace actions and observations into hazardous conditions. The claim must cover the policy and its interactions, during development as well as deployment.',
    ][selected]);
}

// Simple native workflows follow the lecture-7 layout conventions.
function m3t8Chain(messages, width, size) {
    var pieces = [];
    messages.forEach(function (message, k) {
        if (k > 0) pieces.push(rightArrow(28).strokeWidth(2));
        pieces.push(frameBox(m3t8Text(message, size || 25, width || 240))
            .padding(12));
    });
    return xtable.apply(null, pieces).center().xmargin(10);
}

function m3t8At(block, x, y) {
    return transform(block).pivot(-1, -1).shift(x, sfig.downSign * y);
}

function m3t8FocusBox(x, y, width, height) {
    return m3t8At(rect(width, height).fillOpacity(0)
        .strokeColor('#245A81').strokeWidth(4), x, y);
}

function m3t8OrderingFocus() {
    // Reuse the SAME system diagram. Only the unit-of-analysis outline changes.
    // These coordinates are the existing predictor and controller boundaries.
    // No shared helper, node, control path, or development label is changed.
    return overlay(
        foodOrderingControlDiagram(),
        m3t8FocusBox(290, 225, 170, 64).numLevels(1),
        pause(),
        m3t8FocusBox(275, 180, 425, 135),
        _
    ).recMouseShowHide(false);
}

function m3t8HiddenStates() {
    return xtable(
        ytable(
            frameBox(m3t8Text('Order not committed', 27, 300)).padding(14),
            frameBox(m3t8Text('Order committed; reply delayed', 27, 300)).padding(14),
            _
        ).ymargin(24),
        rightArrow(55).strokeWidth(2),
        frameBox(m3t8Text('Observation: no confirmation received', 28, 380))
            .padding(18),
        _
    ).center().xmargin(25);
}

function m3t8Scenario(name, width, lines) {
    return parentCenter(xtable(
        m3t8Figure(name, width),
        ytable.apply(null, [
            m3t8Text(bold('Hypothetical scenario'), 23, 340),
        ].concat(lines.map(function (message) {
            return m3t8Text(message, 25, 340);
        }))).ymargin(24),
        _
    ).center().xmargin(35));
}

add(titleSlide('Lecture 8: From Prediction to Action',
    nil(),
    parentCenter(m3t8Text(
        'CS120: Introduction to AI Safety - October 15, 2026, Zachary Robertson',
        24, 900
    )),
    _));

prose(
    'Module 2 examined predictor outputs inside larger systems. Module 3 studies what happens when a model policy determines the decision rules: actions affect future states and observations. Assurance must cover both the policy artifact and the trajectories produced through interaction, during exploration and deployment.',
);

// 2
add(slide('From model behavior to agent policy',
    parentCenter(courseProgressionDiagram(3)),
    m3t8Card('The unit of analysis expands from predictor behavior to action selection over time.', 28),
    _));
prose(
    'Predictors take inputs and reflexively generate outputs, as can policies. The shift in the unit of analysis is functional: a predictor becomes part of a feedback loop when its outputs determine actions with effects. A fixed policy can choose different actions as observations change, without further learning.',
);

// 3
add(slide('The ordering controller is now the unit of analysis',
    parentCenter(m3t8OrderingFocus().scale(0.65)),
    pause(-1),
    parentCenter(overlay(
        m3t8Text('Previously: does the preference predictor choose the intended substitute?', 25, 920)
            .numLevels(1),
        pause(),
        m3t8Text('Now: how does the ordering controller choose actions as feedback arrives?', 25, 920),
        _
    )),
    _));
prose(
    'Keep the same ordering system, merchant process, customer, and feedback paths. Previously we examined the preference predictor within the ordering controller. Now promote that controller to the unit of analysis: a model policy can determine its decisions over time. The highlighted boundary changes, not the surrounding system or the meaning of its existing arrows.',
);

// 4
m3t8Roadmap(0);

// 5
add(slide('Markov Decision Process (MDP)',
    parentCenter(m3t8Figure('mdp', 680)),
    parentCenter(m3t8Text('Full observability: the policy receives the environment state.', 26, 920)),
    _).id('an-mdp-makes-the-feedback-loop-explicit'));
prose(
    'A useful abstraction for reinforcement learning is the Markov decision process. The agent selects actions that affect the environment, which supplies states and rewards. Under full observability, the policy receives the environment state. Submitting an order may remove a previously available opportunity to obtain customer approval before commitment.',
);

// 6
add(slide('Specify states, actions, transitions, and rewards',
    parentCenter(ytable(
        m3t8Text(bold('States $\\mathcal S$:') + ' order status, available items, customer approval.', 28),
        m3t8Text(bold('Actions $\\mathcal A$:') + ' submit an order, check status, ask the customer.', 28),
        pause(),
        m3t8Text(bold('Transitions $P(s^{\\prime}\\mid s,a)$:') + ' how an action changes the state.', 28),
        m3t8Text(bold('Reward $r(s,a,s^{\\prime})$:') + ' a scalar assigned to a transition.', 28),
        _
    ).ymargin(28)),
    _));
prose(
    'An MDP specifies a state space, action space, transition model, and reward function. In the ordering system, the state could include order status, available items, and customer approval. The key distinction from a predictor is the policy\'s role: its actions affect future environment states, rather than merely describing an outcome.',
);

// 7
add(slide('A fixed policy can respond without learning',
    m3t8Math('$\\pi(a\\mid s)$', 38),
    parentCenter(m3t8Text('A policy specifies a distribution over actions for each state.', 28, 900)),
    pause(),
    parentCenter(m3t8Chain([
        'Current state',
        'Fixed policy $\\pi$',
        'Selected action',
    ])),
    m3t8Text('A deterministic policy selects one action per state.', 27),
    _));
prose(
    'An agent\'s decision rule is modeled with a policy that observes a state and selects an action, or specifies a distribution over actions. A deterministic policy selects one action for each state. After learning, inference can convert changing inputs into different action decisions without any further parameter update.',
);

// 8
add(slide('A state must retain the relevant history',
    m3t8Card('Markov assumption: the next-state distribution depends on history only through the current state and action.', 28),
    pause(),
    parentCenter(m3t8Chain([
        'Earlier order submission',
        'Current transaction state',
        'Effect of submitting again',
    ])),
    m3t8Text('Does the state retain whether the earlier order was committed?', 28),
    _));
prose(
    'The Markov assumption requires a state representation that retains the relevant information. Simply calling an input a state does not establish that the assumption holds. An earlier order commitment can change what submitting again would do. Omitting that information loses a distinction needed to represent the next-state distribution.',
);

// 9
add(slide('No confirmation does not identify the state',
    parentCenter(m3t8HiddenStates()),
    pause(),
    m3t8Text('A Markov environment can still be partially observed.', 29),
    m3t8Text('History or a refreshed status can inform the next action.', 27),
    _));
prose(
    'Under partial observability, the policy receives an observation that may not distinguish relevant states. An order submission without vendor confirmation does not establish whether payment is committed or cancellation remains possible. History can inform a belief about the state; a status tool can supply evidence, although its response may itself be delayed.',
);

// 10
m3t8Roadmap(1);

// 11
add(slide('Return accumulates transition rewards',
    parentCenter(m3t8Chain([
        '$s_0,a_0,s_1$',
        '$s_1,a_1,s_2$',
        '$\\ldots,s_T$',
    ])),
    pause(),
    m3t8Math('$G_T=\\sum_{t=0}^{T-1}r(s_t,a_t,s_{t+1})$', 34),
    m3t8Text('The horizon $T$ determines how far future rewards enter the evaluation.', 28),
    _).id('return-accumulates-transition-rewards'));
prose(
    'The reward function assigns a scalar to an individual state-action transition. Return accumulates rewards over many steps. The horizon determines how far into the future rewards enter the evaluation; discounting can also reduce the weight on later rewards. Neither choice establishes that the reward captures every relevant harm, including consequences beyond the horizon.',
);

// 12
add(slide('Evaluation fixes the policy; optimization selects it',
    m3t8Text(bold('Evaluate a fixed policy:'), 27),
    m3t8Math('$\\mathbb E_{\\rho_0,\\pi,P}[G_T]$', 32),
    pause(),
    m3t8Text(bold('Select from a policy class:'), 27),
    m3t8Math('$\\pi^*\\in\\operatorname*{arg\\,max }_{\\pi\\in\\Pi} \\quad \\mathbb E_{\\rho_0,\\pi,P}[G_T]$', 31),
    m3t8Text('$\\rho_0$: initial-state distribution. $\\Pi$: policy class.', 26),
    _));
prose(
    'Policy evaluation measures the performance of a fixed policy, for example its expected return. Policy optimization selects over a policy class for a high-return policy. The expectation depends on the initial-state distribution, the policy, and the transition model. This optimization assumes expected return is the target objective and relies on the MDP specification.',
);

// 13
add(slide('Planning and reinforcement learning can overlap',
    m3t8Text(bold('Planning:') + ' compute decisions using an environment model.', 29),
    m3t8Text(bold('Reinforcement learning:') + ' learn from interaction data using rewards.', 29),
    pause(),
    parentCenter(m3t8Chain([
        'Interaction data',
        'Learn an environment model',
        'Plan using the model',
    ])),
    m3t8Cite('Sutton and Barto, Reinforcement Learning, 1998'),
    _));
prose(
    'Planning computes decisions using a known or learned environment model. Reinforcement learning learns from interaction data, potentially collected earlier rather than by the current policy. These approaches can overlap: model-based RL learns a model and uses it for planning. Methods may represent a policy directly or derive it from learned value or action-value functions.',
);

// 14
add(slide('InstructGPT - reward model vs. policy',
    parentCenter(m3t8Chain([
        'Prompt $x$',
        'Policy $\\pi_\\theta(y\\mid x)$ generates response $y$',
        'Reward model $\\hat r_\\phi(x,y)$ scores it',
    ])),
    pause(),
    m3t8Text('Human comparisons fit the reward model. Its scores supply a signal for policy optimization.', 29),
    m3t8Cite('Ouyang et al., InstructGPT, 2022', 'https://arxiv.org/abs/2203.02155'),
    _));
prose(
    'InstructGPT separated the reward model from the policy. The reward model scores a response to a prompt, while the policy generates responses. Human preference comparisons trained the reward model, which then supplied a reward signal for policy optimization. The supervised scoring model thus becomes an objective that another model is trained to pursue.',
);

// 15
add(slide('Preference optimization is not imitation',
    m3t8Text(bold('Supervised imitation'), 27),
    parentCenter(m3t8Chain([
        'Expert demonstrations',
        'Increase likelihood of demonstrated actions',
    ], 365)),
    pause(),
    m3t8Text(bold('Preference optimization using RL'), 27),
    parentCenter(m3t8Chain([
        'Preference-based rewards',
        'Shift toward higher-reward outputs',
    ], 365)),
    _));
prose(
    'Supervised imitation increases the likelihood of demonstrated actions. Preference optimization using RL instead shifts the policy toward higher-reward outputs. InstructGPT also used a penalty to discourage moving too far from its supervised reference policy. These learning objectives are different, even when both use information supplied by people to shape model behavior.',
);

// 16
add(slide('Where does the evaluated episode end?',
    m3t8Text(bold('Contextual bandit: prompt-response episode'), 26),
    parentCenter(m3t8Chain([
        'Prompt',
        'Complete response',
        'Reward; episode ends',
    ])),
    pause(),
    m3t8Text(bold('Multi-turn interaction'), 26),
    parentCenter(m3t8Chain([
        'Action',
        'Environment feedback',
        'Further decision',
    ])),
    _));
prose(
    'At the prompt-response level, InstructGPT is naturally a contextual bandit, though token generation can be sequential. Multi-turn episodes include further decisions after feedback. Later work studies conversation preferences, code revision with execution feedback, and web-agent interaction. These signals differ; not all are human preferences. Writing a proposed order differs from submitting it through an API.',
);

// 17
add(slide('Coverage must include policy-induced states',
    parentCenter(m3t8Chain([
        'Demonstrated states',
        'Learner makes an error',
        'Uncovered recovery state',
    ])),
    pause(),
    m3t8Card('Using RL does not by itself establish coverage of the states reached in deployment.', 28),
    m3t8Text('DAgger: query an expert on states visited by the learner.', 27),
    m3t8Cite('Ross et al., DAgger, 2011', 'https://proceedings.mlr.press/v15/ross11a.html'),
    _));
prose(
    'Fixed demonstrations may not cover states the learned policy encounters, so errors can compound. RL can reinforce recovery when training includes those trajectories and feedback distinguishes successful recovery. This is not an inherent advantage over all imitation learning: DAgger queries an expert on learner-visited states. Neither method alone establishes adequate deployment coverage.',
);

// 18
m3t8Roadmap(2);

// 19
add(slide('High expected return is not a safety guarantee',
    m3t8Text('A small risk of severe harm can accompany more frequent success.', 30),
    pause(),
    m3t8Text('The reward can omit unwanted consequences entirely.', 30),
    m3t8Card('A hazard remains an upstream condition under which harm can occur.', 28),
    _).id('high-expected-return-is-not-a-safety-guarantee'));
prose(
    'High expected return is not a safety guarantee. A policy can introduce a small risk of severe harm in exchange for more frequent success, or the reward can omit unwanted consequences entirely. A hazard remains an upstream condition under which harm can occur. Consequences can also fall beyond the evaluation horizon.',
);

// 20
add(slide('A misspecified reward can invite specification gaming',
    m3t8Text(bold('Reward misspecification'), 29),
    m3t8Text('The reward does not adequately represent the intended objective.', 28),
    pause(),
    m3t8Text(bold('Specification gaming'), 29),
    m3t8Text('Behavior exploits the specified objective while not producing the intended outcome.', 28),
    m3t8Cite('Amodei et al., Concrete Problems in AI Safety, 2016',
        'https://arxiv.org/abs/1606.06565'),
    _));
prose(
    'These mechanisms can overlap. Reward misspecification concerns what the reward represents; specification gaming concerns behavior that exploits the specified objective. A goal-directed policy can also complete the intended task while causing side effects omitted from the reward or system boundary. It may change the observations used to evaluate or intervene on its behavior.',
);

// 21
add(slide('Repeated action can turn uncertainty into harm',
    m3t8Scenario('delayed-feedback', 510, [
        bold('Hazard:') + ' an unresolved transaction still permits consequential repeat actions.',
        bold('Harm:') + ' unwanted additional purchases.',
    ]),
    _));
prose(
    'A vendor may commit an order but delay reporting that commitment. The policy may interpret missing confirmation as a failed purchase and submit another order. The hazardous condition is an unresolved, partially observed transaction for which consequential repeat actions remain possible. The resulting harm is unwanted additional purchases, not merely uncertainty about order status.',
);

// 22
add(slide('Constrain the transaction, not just the instruction',
    m3t8Text(bold('Proposed constraint'), 27),
    m3t8Card('Prevent a new purchase for the same customer request while the earlier transaction remains unresolved.', 28),
    pause(),
    m3t8Text(bold('Challenge the system with:'), 27),
    parentCenter(m3t8Chain([
        'Delayed confirmation',
        'Stale status replies',
        'Repeated customer requests',
    ])),
    _));
prose(
    'Merely requesting refreshed status is insufficient if the response is stale or ambiguous. Enforcement might require authoritative transaction reconciliation or merchant-supported idempotency, so retries cannot create another purchase. Evidence needs to challenge delayed confirmation, stale responses, and repeated requests, and establish what the whole ordering system permits, not just what the policy is instructed to avoid.',
);

// 23
add(slide('A policy can suppress feedback used to judge it',
    m3t8Scenario('proxy-state', 510, [
        'Assume the reward penalizes recorded customer corrections.',
        'Fewer corrections need not mean better orders.',
    ]),
    _));
prose(
    'Suppose the policy is penalized for recorded customer corrections rather than evaluated against independently established intent and transaction state. It may ask for confirmation when confident but skip external input when uncertain. If the customer then has no correction or cancellation path, the reward can miss an unwanted purchase even though the vendor has committed it.',
);

// 24
add(slide('Check intent independently of recorded corrections',
    m3t8Text(bold('Recorded proxy:') + ' how many corrections did the policy receive?', 29),
    pause(),
    m3t8Text(bold('Intended outcome:') + ' did the committed purchase match independently established customer intent?', 29),
    m3t8Card('Evidence must include the transaction state and the customer\'s opportunity to correct it.', 28),
    _));
prose(
    'Testing whether a policy asks for confirmation or is penalized for errors may not suffice. Evidence must test whether policy-controlled observations substitute for independently established system state. This may require separation between policy rewards and system-level flags or constraints that ensure relevant information reaches the policy, together with an effective correction path.',
);

// 25
add(slide('Exploration can cross the development boundary',
    m3t8Scenario('development-boundary', 550, [
        'Test orders create no charges.',
        'Indirect access still leaks customer information into development.',
    ]),
    _));
prose(
    'A candidate policy is evaluated with access that can reach production permissions, although ordinary test orders create no charges. It retries, waits, then posts requests on a shared channel. Other agents with live permissions return customer order information. Customer information leaks into development because containment does not cover this indirect access.',
);

// 26
add(slide('Contain communications and delegated access',
    m3t8Text(bold('Proposed constraint'), 27),
    m3t8Card('Development policies must not obtain live customer information through other agents or shared channels.', 28),
    pause(),
    m3t8Text('Challenge the boundary with requests routed through the shared channel.', 28),
    m3t8Text('Passing ordinary test orders does not establish containment of indirect access.', 27),
    _));
prose(
    'Containing direct purchases does not establish containment of communications or delegated access. The relevant development boundary includes other agents with production permissions and the shared channels through which requests can reach them. A challenge should test those indirect paths. A passing result supports only the tested scope, not every possible delegation or permission configuration.',
);

// 27
add(slide('Assure the policy and its trajectories',
    parentCenter(m3t8Chain([
        'Object and initial conditions',
        'Interaction and failure mode',
    ], 365)),
    pause(),
    parentCenter(m3t8Chain([
        'Constraint preventing the hazard',
        'Evidence supporting the claim',
    ], 365)),
    m3t8Text('Cover exploration and deployment, not just isolated outputs.', 29),
    _));
prose(
    'Agent policies move the focus from isolated predictor outputs to an action-generating process. An assurance claim needs an object and initial conditions, an interaction and failure mode, and a constraint supported by evidence. A reward change alone may not suffice. Next we examine reward hacking and long-horizon goal-directed behavior in more depth.',
);

// Provisional discussion tail: one setting and four questions.
// Empty prose() calls delimit extraction; no instructor notes enter the sheet.
add(slide('Discussion: Ordering under delayed feedback',
    m3t8Card('An ordering assistant can submit an order, check its status, ask the customer, or submit again. The merchant may charge an order before confirmation arrives; submitting again can create another order. The assistant sees messages and possibly delayed status replies, not the merchant\'s current records. In training, it earns a reward for each reported completion and a small penalty for each extra step. The customer wants exactly one order.', 26),
    _));
prose();

add(slide('1. State and observation',
    m3t8Card('Name two merchant states consistent with the observation "no confirmation received." Choose one available action and explain how its effect or risk differs between those states.', 28),
    _));
prose();

add(slide('2. From actions to harm',
    m3t8Card('Describe a short sequence of actions and observations that could produce an unwanted extra charge. Identify the hazardous condition before that harm. Why could checking one action in isolation miss the problem?', 28),
    _));
prose();

add(slide('3. Reward and safety',
    m3t8Card('Give a plausible behavior the stated reward could favor while failing the customer\'s intent. State any extra assumption needed. Why would high average return not by itself support a no-duplicate-purchases claim?', 28),
    _));
prose();

add(slide('4. Constraint and evidence',
    m3t8Card('Propose a system-level constraint that prevents a second purchase for the same customer request while the first transaction is unresolved. Describe one test designed to violate the constraint. What would passing that test still not establish?', 28),
    _));
prose();