(() => {
  const media = window.LESSON_MEDIA || (window.LESSON_MEDIA = {});

  const V = {
    fluxFull:{id:'OM9BBIJs_pA',title:'How to freelance as a web designer',channel:'Courtesy: Flux Academy · YouTube',practiceType:'FIELD EXPERIENCE',credential:'Ran Segall / Flux Academy — long-time freelance designer sharing lessons from real client work and business growth.',note:'A 2+ hour practitioner compilation covering first clients, working without a portfolio, client problems, pricing, negotiation, difficult requests, habits and lessons from scaling a freelance business.',watch:['Listen for what actually changed results in client work','Notice the mistakes and trade-offs, not only the success stories','Turn the relevant chapter into one action for this lesson']},
    fluxClients:{id:'FLIPzusbcSY',title:'Getting Freelance Clients CONSISTENTLY',channel:'Courtesy: Flux Academy · YouTube',practiceType:'CLIENT ACQUISITION IN PRACTICE',credential:'Ran Segall / Flux Academy — freelance designer and business owner teaching from his own client-acquisition experience.',note:'A practical freelancer-focused discussion about creating a repeatable flow of client opportunities instead of relying on luck.',watch:['Look for repeatable client sources rather than one-off tactics','Notice how positioning and visibility support outreach','Translate the ideas into a weekly lead-generation routine']},
    fluxOnboarding:{id:'IfaPrQxPf-I',title:'Client Onboarding - Complete walkthrough',channel:'Courtesy: Flux Academy · YouTube',practiceType:'HANDS-ON WORKFLOW',credential:'Rachel / Flux Academy — a working designer walking through her actual onboarding and offboarding system.',note:'A real process walkthrough using Asana, onboarding email, welcome PDF, contract, kickoff call, final invoice, asset delivery, testimonial request, referrals and later follow-up.',watch:['Notice the exact documents and touchpoints used with clients','See how the system reduces confusion and builds trust','Adapt the workflow to your own tools rather than copying software blindly']},
    fluxNegotiation:{id:'NeuDrH1tTWE',title:'The Complete Guide: How to Negotiate as a Freelancer',channel:'Courtesy: Flux Academy · YouTube',practiceType:'FREELANCE NEGOTIATION',credential:'Flux Academy — negotiation tactics taught specifically for active freelance client work.',note:'A practical negotiation lesson for freelancers covering win-win framing, pricing discomfort, tactics and asking for the close.',watch:['Notice where the freelancer protects value without becoming aggressive','Look for trade-offs instead of automatic discounting','Practice the language before your next client conversation']},
    joshStory:{id:'nq0PplJ_FqI',title:'How I Made $800,000 Freelancing on Upwork',channel:'Courtesy: Josh Burns Tech · YouTube',practiceType:'REAL FREELANCER STORY',credential:'Josh Burns — Expert-Vetted Upwork freelancer who has publicly documented seven-figure freelance earnings and years of platform experience.',note:'A first-person Upwork career breakdown from a high-earning freelancer, including what worked, what changed and what beginners often misunderstand.',watch:['Separate repeatable principles from platform-specific details','Notice the persistence and positioning behind the earnings headline','Pay attention to how proof, specialization and client trust compound']},
    joshProposal:{id:'dOVtO9JVLVY',title:'How to Write Upwork Proposals That Win High-Paying Jobs',channel:'Courtesy: Josh Burns Tech · YouTube',practiceType:'PROPOSAL WALKTHROUGH',credential:'Josh Burns — experienced Upwork freelancer explaining the proposal system he used after crossing $1M in platform earnings.',note:'A concrete proposal and job-selection walkthrough showing hooks, relevance, client activity, portfolio proof and proposal strategy.',watch:['Watch how he decides whether a job is worth applying to','Study the first lines and relevance signals in the proposal','Use examples as patterns, not copy-paste templates']},
    joshProfile:{id:'s8yoRD7thRc',title:'Upwork Profile Video - Josh Burns',channel:'Courtesy: Josh Burns Tech · YouTube',practiceType:'REAL PROFILE EXAMPLE',credential:'Josh Burns — an experienced Upwork freelancer showing the kind of positioning used on his own profile.',note:'Instead of another abstract profile lecture, this gives learners an actual freelancer profile-video example to critique against the lesson framework.',watch:['Notice how quickly credibility and specialization are communicated','Compare the example with your own profile promise and proof','Identify what should be updated for today’s platform standards']},
    futurCall:{id:'lwipfn9znk0',title:'Watch This Before Your Next Client Call Or Regret It Later',channel:'Courtesy: The Futur · YouTube',practiceType:'CLIENT-CALL COACHING',credential:'Chris Do / The Futur — creative-business practitioner and coach known for live client, pricing and sales breakdowns.',note:'A compact client-call coaching session focused on money, rapport, better questions, diagnosis and helping the client make the right decision.',watch:['Notice how questions create more value than premature answers','See why money and fit should not be avoided','Practice diagnosing before prescribing']},
    futurValue:{id:'w_TYQQIagwc',title:'How to Find Clients that Value Design',channel:'Courtesy: The Futur · YouTube',practiceType:'EXPERT CONVERSATION',credential:'The Futur with Ran Segall — practitioners discussing how real freelance positioning, content and client value work in the market.',note:'A practitioner conversation about finding better-fit clients, building visibility, content, confidence and the realities of a freelance creative career.',watch:['Notice how the discussion connects reputation to client quality','Look for the role of consistent public proof','Compare geographic limitations with online opportunity']},
    futurChange:{id:'pYzRq3fvuDQ',title:'When Clients Change Their Mind – Building A Brand Ep. 7',channel:'Courtesy: The Futur · YouTube',practiceType:'REAL CLIENT PROJECT',credential:'The Futur — documentary-style footage from an actual branding project where the client changes direction.',note:'This is not a classroom-only explanation: it shows professionals dealing with real client feedback, uncertainty and a major change of direction inside a live project.',watch:['Observe the emotional pressure before the professional response','Notice how the team separates feedback from ego','Look for how the project is reframed without damaging the relationship']},
    futurHighPay:{id:'Snvo9y6mSAw',title:"How To Attract Higher Paying Clients (It's Not Your Work)",channel:'Courtesy: The Futur · YouTube',practiceType:'VALUE POSITIONING',credential:'Chris Do / The Futur — real-world creative business pricing and positioning experience.',note:'A practical explanation of why higher-paying clients buy business outcomes rather than deliverables alone, with concrete examples of pain, value and budget.',watch:['Translate your service into the client outcome behind it','Notice how problem size changes perceived value','Use the questions to improve your own discovery process']},
    futurWhiteboard:{id:'SsuiKyAwDhM',title:'How to Get Clients to Value YOU — Whiteboard AdobeMAX',channel:'Courtesy: The Futur · YouTube',practiceType:'LIVE WORKSHOP',credential:'Chris Do / The Futur — an interactive workshop with real audience questions around value, risk, niche and pricing.',note:'A workshop-style session rather than a polished theory lecture, useful for seeing how a practitioner responds to real participant concerns.',watch:['Notice how vague concerns are turned into specific business decisions','Watch the interaction around price, risk and specialization','Write down the question that most closely matches your own situation']},
    portfolioAdobe:{id:'s58dnaBkgQw',title:'Behance Portfolio Review: Live | Adobe',channel:'Courtesy: Adobe · YouTube',practiceType:'LIVE PORTFOLIO CRITIQUE',credential:'Adobe/Behance — live portfolio review with industry experts evaluating real creative work.',note:'A hands-on portfolio critique where learners can see what reviewers notice, question and value in actual portfolios.',watch:['Notice what experts understand within the first few seconds','See where context and process improve credibility','Use the critique to audit your own portfolio presentation']},
    projectTool:{id:'eFe64U1WVs8',title:'ClickUp Tutorial for Beginners (Step by Step)',channel:'Courtesy: George Vlasyev · YouTube',practiceType:'TOOL WALKTHROUGH',credential:'A practical end-to-end project-management tool walkthrough that shows the system on screen.',note:'Useful when the lesson needs learners to see tasks, hierarchy, deadlines, views and collaboration rather than only read about project management.',watch:['Focus on the workflow logic more than the specific software','See how ownership and deadlines become visible','Identify which parts can be recreated in your preferred tool']},
    invoice:{id:'cM1mIPNRoUg',title:'How To Create an Invoice on FreshBooks',channel:'Courtesy: FreshBooks · YouTube',practiceType:'BILLING WALKTHROUGH',credential:'FreshBooks — an actual invoicing product walkthrough showing the billing process on screen.',note:'A concrete demonstration of creating and managing an invoice, useful alongside the course’s payment-terms and deposit framework.',watch:['Check where due dates and payment terms appear','Notice the record-keeping workflow','Separate software mechanics from the agreement you make with the client']},
    budget:{id:'d5EZJBhyWmw',title:'How to Budget on an Irregular Income as a Freelancer',channel:'Courtesy: Do It Myself Peg · YouTube',practiceType:'FREELANCER MONEY SYSTEM',credential:'A freelancer-specific budgeting walkthrough built around irregular income rather than a salaried monthly paycheck.',note:'A practical money-management companion for baseline expenses, buffers and decisions in weak versus strong months.',watch:['Calculate your real baseline rather than guessing','See how strong months can fund future weak months','Separate business cash flow from personal lifestyle inflation']},
    aiClient:{id:'CxTWoMn0rRM',title:'I Created a brand strategy for a client using AI',channel:'Courtesy: Flux Academy · YouTube',practiceType:'AI + CLIENT WORK',credential:'Flux Academy — a start-to-finish experiment using ChatGPT on a realistic client-brand strategy workflow.',note:'A practical AI experiment covering client profile, competitor analysis, credibility, mission, brand voice, avatar, pain points and creative direction—while also revealing where human judgment is still necessary.',watch:['Notice where AI accelerates work and where it becomes generic','Verify how the human reframes and judges the output','Use AI as an assistant inside a workflow, not as the final authority']},
    burnoutTed:{id:'Dvhu2OK7ffg',title:'How burnout makes us less creative | The Way We Work',channel:'Courtesy: TED · YouTube',practiceType:'WORK-LIFE REALITY',credential:'TED workplace perspective on burnout, creative capacity and sustainable performance.',note:'A concise reality check on the performance cost of chronic overload—useful for translating the course’s workload and boundary system into sustainable behavior.',watch:['Recognize early overload signals before output collapses','Treat recovery as part of professional capacity','Choose one boundary you can operationalize this week']}
  };

  const TITLES = {
    1:'Freelancing Explained: Career, Business & Value',2:'Freelancer Mindset: From Earner to Problem Solver',3:'Skills, Services & Client Value',4:'Understanding Client Problems: Known vs Unknown Phase',5:'Choosing Problems Worth Solving',6:'Building Your Personal Freelancing Roadmap',7:'Choosing a Freelancing Skill Strategically',8:'Building a Skill Practice System',9:'From Skill to Service Offer',10:'Niche Selection Without Boxing Yourself In',11:'Portfolio Strategy: What Clients Need to See',12:'Creating Strong Case Studies',13:'Positioning Yourself as the Right Choice',14:'Creating a Professional Freelancer Profile',15:'Personal Branding Fundamentals',16:'Choosing the Right Platforms for Your Skill',17:'Content Strategy for Freelancers',18:'Showing Your Work Consistently',19:'Understanding Reach, Algorithms & Niche Signals',20:'Building Trust Before the First Conversation',21:'Defining Your Ideal Client',22:'Where Freelance Clients Actually Come From',23:'Upwork, Fiverr & Marketplace Fundamentals',24:'LinkedIn & Professional Networking',25:'Organic Client Acquisition Through Content',26:'Prospect Research & Lead Qualification',27:'Cold Outreach That Feels Human',28:'Referrals, Communities & Relationship Building',29:'Building a Repeatable Lead Generation System',30:'The First Client Message',31:'Discovery Conversations That Reveal Real Needs',32:'Asking Better Questions',33:'Understanding Requirements & Scope',34:'Writing Proposals That Make Sense to Clients',35:'Pricing Your Work',36:'Negotiation Without Undervaluing Yourself',37:'Handling Objections & Client Doubts',38:'Closing the Right Client',39:'Professional Client Onboarding',40:'Scope, Milestones & Project Planning',41:'Managing Deadlines & Communication',42:'Feedback, Revisions & Scope Creep',43:'Quality Control Before Delivery',44:'Professional Final Handoff',45:'Testimonials, Reviews & Case Study Follow-up',46:'Turning One Project Into a Long-Term Relationship',47:'Fixed Price, Hourly & Value-Based Pricing',48:'Invoices, Deposits & Payment Schedules',49:'Payment Safety & Avoiding Non-Payment',50:'Contracts, Terms & Professional Boundaries',51:'Tracking Income, Expenses & Profit',52:'Managing Irregular Freelance Income',53:'Scams, Red Flags & Risk Management',54:'Client Retention & Recurring Work',55:'Retainers & Recurring Revenue',56:'Upselling and Expanding Client Value',57:'High-Ticket Services & Specialization',58:'Building Authority in Your Niche',59:'Systems, Templates & Workflow Automation',60:'Using AI Responsibly in Freelance Workflows',61:'Outsourcing & Working With Collaborators',62:'From Freelancer to Small Agency',63:'Burnout Prevention & Sustainable Performance',64:'Designing Your Long-Term Freelancing Career'
  };

  // [videoKey, startSeconds, lesson-specific field focus]
  const MAP = {
    1:['fluxFull',7214,'Listen to the $0→$300k lessons as evidence that freelancing is a professional business system, not simply online earning.'],
    2:['fluxFull',6095,'Focus on the habits Ran says mattered after years of actual freelance work.'],
    3:['futurHighPay',0,'Watch how a practitioner turns a deliverable into an outcome the client can value.'],
    4:['futurCall',0,'Use the client-call advice to practice diagnosing before prescribing.'],
    5:['fluxFull',2000,'Use the “18 problems designers solve” chapter to judge which problems are commercially meaningful.'],
    6:['fluxFull',7214,'Use the career lessons to pressure-test your own 90-day roadmap.'],
    7:['fluxFull',6095,'Focus on career habits and whether the skill you choose supports sustained practice and market demand.'],
    8:['fluxFull',6095,'Convert the successful-freelancer habits into your own weekly practice system.'],
    9:['futurHighPay',0,'Watch how services become valuable when they are tied to a bigger client outcome.'],
    10:['futurWhiteboard',0,'Use the live niche and value discussion to test how narrow or broad your positioning should be.'],
    11:['portfolioAdobe',0,'Audit your own portfolio while experts review real work.'],
    12:['portfolioAdobe',0,'Look for the story and context missing from weak project presentation.'],
    13:['futurHighPay',0,'Connect positioning with the size and importance of the problem you solve.'],
    14:['joshProfile',0,'Treat this as a real profile artifact to critique, not a template to copy.'],
    15:['futurWhiteboard',0,'Notice how personal brand, specialization and perceived value connect in live questions.'],
    16:['futurValue',0,'Watch practitioners discuss how platform, geography, content and client value interact.'],
    17:['futurValue',0,'Focus on how Ran used content as a business and reputation asset rather than posting for vanity.'],
    18:['futurValue',0,'Look for the consistency required to become recognizable over time.'],
    19:['futurValue',0,'Notice which repeated public signals help the right people understand what you do.'],
    20:['futurValue',0,'Focus on the trust signals visible before a prospect ever contacts you.'],
    21:['futurHighPay',0,'Identify the kind of client problem large enough to justify strong buyer intent.'],
    22:['fluxClients',0,'Build your acquisition map from the sources an experienced freelancer actually uses.'],
    23:['joshStory',0,'Use a high-earning freelancer’s real Upwork journey to understand what the platform feels like beyond the interface.'],
    24:['futurValue',0,'Study networking as reputation and useful relationships, not connection collecting.'],
    25:['fluxClients',0,'Connect organic visibility with a repeatable client-acquisition system.'],
    26:['joshProposal',0,'Watch how an experienced freelancer filters jobs before spending time on a proposal.'],
    27:['joshProposal',0,'Study real proposal decisions, hooks and proof instead of abstract outreach formulas.'],
    28:['fluxClients',0,'Look for relationship sources that can become referrals and warm opportunities.'],
    29:['fluxClients',0,'Turn the ideas into a measurable weekly lead-generation rhythm.'],
    30:['joshProposal',0,'Use the opening of a real proposal system to improve your first client message.'],
    31:['futurCall',0,'Study how better discovery questions change the entire sales conversation.'],
    32:['futurCall',0,'Pause and write down the questions you would ask in the same situation.'],
    33:['fluxOnboarding',720,'Use the welcome, contract and onboarding sections to see how requirements become a shared operating agreement.'],
    34:['joshProposal',0,'Compare a proven proposal workflow with your lesson’s context → approach → scope → price structure.'],
    35:['fluxFull',2638,'Use the “make more money per hour” chapter to connect pricing with value and leverage.'],
    36:['fluxNegotiation',0,'Practice the specific negotiation behaviors before your next pricing conversation.'],
    37:['fluxNegotiation',0,'Observe how objections can be turned into trade-offs and clarification rather than panic.'],
    38:['fluxNegotiation',0,'Focus on closing only when both sides have a workable agreement.'],
    39:['fluxOnboarding',0,'Follow a working designer’s complete onboarding system from tools to kickoff.'],
    40:['fluxOnboarding',363,'Watch the Asana/project setup section to see milestones and ownership become visible.'],
    41:['fluxOnboarding',0,'Notice how the onboarding system establishes communication expectations before problems happen.'],
    42:['fluxFull',5270,'Jump directly to the “extra requests from clients” chapter for a real freelancer perspective on scope creep.'],
    43:['projectTool',0,'Turn quality-control steps into visible tasks and checkpoints inside a working project system.'],
    44:['fluxOnboarding',1434,'Use the offboarding section to see final call, invoice, assets and handoff as one process.'],
    45:['fluxOnboarding',1601,'Watch the testimonial and feedback step in the actual offboarding workflow.'],
    46:['fluxOnboarding',1665,'Use the future-work, referral and follow-up steps to design retention intentionally.'],
    47:['fluxFull',2638,'Compare the practical money-per-hour discussion with fixed, hourly and value-based models in the lesson.'],
    48:['invoice',0,'Watch a real invoice being created, then compare it with your deposit and milestone rules.'],
    49:['fluxFull',4837,'Use the “freeloaders / clients wasting your time” chapter to strengthen payment and stop-work boundaries.'],
    50:['fluxOnboarding',1200,'Watch where the contract enters a real onboarding process and what it protects operationally.'],
    51:['budget',0,'Use a freelancer-specific budget rather than salaried-income assumptions.'],
    52:['budget',0,'Build your low/normal/strong-month rules while watching the irregular-income workflow.'],
    53:['joshStory',0,'Listen for platform realities, risk, persistence and why verification matters in a real freelance career.'],
    54:['fluxOnboarding',1728,'Use the post-project check-in step to design retention after delivery.'],
    55:['fluxFull',2638,'Connect recurring revenue to the value and economics of your freelance service.'],
    56:['fluxOnboarding',1665,'Watch how future collaboration is introduced after value has already been delivered.'],
    57:['futurHighPay',0,'Study why specialization and larger business problems support premium fees.'],
    58:['futurWhiteboard',0,'Use the live workshop to see authority and niche questions handled in real time.'],
    59:['fluxOnboarding',363,'Use the actual project board and templates as evidence of what systems replace memory and improvisation.'],
    60:['aiClient',0,'Watch AI used on a realistic client strategy from start to finish, including where human judgment must intervene.'],
    61:['fluxOnboarding',363,'Study how a visible project system makes it easier to hand work to collaborators without losing control.'],
    62:['fluxFull',7214,'Use the business-growth lessons to think about what must become repeatable before adding people.'],
    63:['burnoutTed',0,'Translate the burnout warning into specific workload, recovery and communication boundaries.'],
    64:['fluxFull',7214,'Use the long-term lessons from a real freelance career to design the kind of business and life you want to sustain.']
  };

  Object.entries(MAP).forEach(([key, cfg]) => {
    const n=Number(key), [videoKey,start,fieldFocus]=cfg, base=V[videoKey];
    if(!base) return;
    if(!media[n]) media[n]={type:'grid',title:`Lesson ${n} Visual Model`,items:[]};
    media[n].video={...base,start,fieldFocus,note:`${base.note} For Lesson ${n} — ${TITLES[n]} — ${fieldFocus}`};
  });

  const enhance=()=>{
    const spec=media[Number(document.body.dataset.lesson?.match(/(\d+)/)?.[1]||new URLSearchParams(location.search).get('lesson')||location.pathname.match(/lesson-(\d+)/)?.[1]||0)]?.video;
    if(!spec) return false;
    const card=document.querySelector('.workspace-rail-video');
    if(!card) return false;
    const label=card.querySelector('.workspace-video-copy small');
    if(label) label.textContent=`▶ ${spec.practiceType||'EXPERT IN PRACTICE'}`;
    const iframe=card.querySelector('iframe');
    if(iframe&&spec.start){const u=new URL(iframe.src);u.searchParams.set('start',String(spec.start));iframe.src=u.toString()}
    if(!card.querySelector('.workspace-practice-proof')){
      const copy=card.querySelector('.workspace-video-copy');
      const proof=document.createElement('div');
      proof.className='workspace-practice-proof';
      proof.innerHTML=`<b>Why this source</b><span>${spec.credential||''}</span>`;
      copy?.appendChild(proof);
      if(spec.watch?.length){const watch=document.createElement('div');watch.className='workspace-practice-watch';watch.innerHTML=`<b>Watch for</b><ul>${spec.watch.map(x=>`<li>${x}</li>`).join('')}</ul>`;card.appendChild(watch)}
    }
    return true;
  };
  const style=document.createElement('style');
  style.textContent=`.workspace-practice-proof{margin-top:9px;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);display:grid;gap:3px}.workspace-practice-proof b,.workspace-practice-watch b{font-size:.58rem;letter-spacing:.08em;color:var(--primary)}.workspace-practice-proof span{font-size:.61rem;line-height:1.4;color:var(--muted)}.workspace-practice-watch{padding:0 13px 13px}.workspace-practice-watch ul{margin:6px 0 0;padding-left:17px}.workspace-practice-watch li{font-size:.59rem;line-height:1.45;color:var(--muted)}.workspace-practice-watch li+li{margin-top:3px}`;
  document.head.appendChild(style);
  if(!enhance()){const mo=new MutationObserver(()=>{if(enhance())mo.disconnect()});mo.observe(document.documentElement,{childList:true,subtree:true})}
})();