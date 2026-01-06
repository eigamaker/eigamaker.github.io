// English-only diagnosis details for MBTI, 16PF, and DISC.
// This extends resultTranslations without modifying the core data file.
if (typeof resultTranslations !== 'undefined') {
  resultTranslations.en = resultTranslations.en || {};

  resultTranslations.en.mbti = {
    typeNames: {
      ENFP: 'Campaigner',
      ENFJ: 'Protagonist',
      ENTP: 'Debater',
      ENTJ: 'Commander',
      ESFP: 'Entertainer',
      ESFJ: 'Consul',
      ESTP: 'Entrepreneur',
      ESTJ: 'Executive',
      INFP: 'Mediator',
      INFJ: 'Advocate',
      INTP: 'Logician',
      INTJ: 'Architect',
      ISFP: 'Adventurer',
      ISFJ: 'Defender',
      ISTP: 'Virtuoso',
      ISTJ: 'Logistician'
    },
    typeDescriptions: {
      ENFP: 'Imaginative and people-focused, you spot possibilities and connect ideas quickly. You thrive on inspiration and authentic relationships.',
      ENFJ: 'Warm and organized, you motivate people toward shared goals. You value harmony and long-term growth.',
      ENTP: 'Inventive and analytical, you enjoy debating ideas and challenging assumptions. You are energized by novelty and exploration.',
      ENTJ: 'Strategic and decisive, you aim for results and structure. You like taking charge and improving systems.',
      ESFP: 'Energetic and spontaneous, you live in the present and learn by doing. You bring enthusiasm and warmth to groups.',
      ESFJ: 'Practical and caring, you look after people and keep things running smoothly. You value tradition, responsibility, and community.',
      ESTP: 'Action-oriented and pragmatic, you solve problems quickly and take calculated risks. You stay calm under pressure and adapt fast.',
      ESTJ: 'Structured and dependable, you focus on efficiency and clear standards. You prefer order, plans, and measurable outcomes.',
      INFP: 'Idealistic and empathetic, you are guided by inner values and meaning. You seek authenticity and creative expression.',
      INFJ: 'Insightful and purpose-driven, you look for deeper patterns and long-term impact. You combine empathy with vision.',
      INTP: 'Curious and independent, you explore complex ideas and build logical frameworks. You value precision and intellectual freedom.',
      INTJ: 'Visionary and self-directed, you plan ahead and pursue improvement with focus. You trust systems, strategy, and competence.',
      ISFP: 'Gentle and flexible, you value beauty, authenticity, and lived experience. You prefer freedom to explore at your own pace.',
      ISFJ: 'Loyal and attentive, you protect stability and support people quietly. You value duty, consistency, and practical care.',
      ISTP: 'Hands-on and adaptable, you like figuring out how things work and fixing problems. You prefer autonomy and real-world results.',
      ISTJ: 'Responsible and methodical, you value rules, reliability, and clear procedures. You build trust through consistency.'
    },
    typeStrengths: {
      ENFP: 'Creativity, enthusiasm, empathy, adaptability, idea generation',
      ENFJ: 'Leadership, empathy, organization, encouragement, relationship building',
      ENTP: 'Innovation, analysis, debate skill, adaptability, curiosity',
      ENTJ: 'Strategic thinking, decisiveness, leadership, efficiency, goal focus',
      ESFP: 'Energy, social awareness, spontaneity, practical learning, positivity',
      ESFJ: 'Supportiveness, reliability, teamwork, attention to needs, responsibility',
      ESTP: 'Action orientation, problem solving, risk management, adaptability, realism',
      ESTJ: 'Organization, dependability, execution, accountability, structure',
      INFP: 'Empathy, creativity, values focus, depth, authenticity',
      INFJ: 'Insight, empathy, vision, persistence, mentoring',
      INTP: 'Analytical thinking, systems building, curiosity, objectivity, independence',
      INTJ: 'Strategic vision, planning, self-direction, improvement mindset, focus',
      ISFP: 'Sensitivity, flexibility, aesthetics, authenticity, calm presence',
      ISFJ: 'Loyalty, attention to detail, service mindset, stability, follow-through',
      ISTP: 'Technical problem solving, calm under pressure, adaptability, hands-on skill, independence',
      ISTJ: 'Reliability, diligence, consistency, planning, integrity'
    },
    typeGrowthTips: {
      ENFP: 'Prioritize a few goals at a time and build routines to follow through.',
      ENFJ: 'Set boundaries and make space for your own needs alongside others\'.',
      ENTP: 'Slow down for execution details and practice listening to emotional cues.',
      ENTJ: 'Balance drive with empathy and leave room for alternative viewpoints.',
      ESFP: 'Add structure and long-term planning to sustain momentum.',
      ESFJ: 'Embrace change and allow flexibility when routines shift.',
      ESTP: 'Consider long-term consequences and check in with others\' feelings.',
      ESTJ: 'Stay open to new approaches and avoid rigid expectations.',
      INFP: 'Translate values into concrete plans and take small, consistent steps.',
      INFJ: 'Protect your energy and avoid overextending yourself for others.',
      INTP: 'Pair analysis with action and test ideas in the real world.',
      INTJ: 'Invite feedback early and stay flexible when plans evolve.',
      ISFP: 'Set clear priorities and practice asserting your needs.',
      ISFJ: 'Practice saying no and adapt more comfortably to change.',
      ISTP: 'Communicate intent early and consider collaborative approaches.',
      ISTJ: 'Allow flexibility and explore improvements beyond proven methods.'
    },
    typeCareerAdvice: {
      ENFP: 'Roles that blend creativity and people impact such as marketing, design, coaching, or entrepreneurship.',
      ENFJ: 'Leadership or people-development roles like education, HR, coaching, or program management.',
      ENTP: 'Innovation-heavy roles such as product, consulting, research, or startups.',
      ENTJ: 'Strategy, management, operations, or leadership roles with clear targets.',
      ESFP: 'People-facing roles like sales, hospitality, events, or customer success.',
      ESFJ: 'Service-oriented roles in HR, education, healthcare, or community support.',
      ESTP: 'Fast-paced roles like sales, operations, emergency response, or entrepreneurship.',
      ESTJ: 'Structured roles in management, administration, finance, or logistics.',
      INFP: 'Mission-driven roles such as counseling, writing, design, or nonprofit work.',
      INFJ: 'Purpose-driven roles like counseling, research, education, or strategy.',
      INTP: 'Analytical roles in engineering, data, research, or systems design.',
      INTJ: 'Strategic roles in planning, architecture, analytics, or leadership.',
      ISFP: 'Creative or hands-on roles such as design, crafts, arts, or care services.',
      ISFJ: 'Stable service roles like healthcare, administration, education, or support.',
      ISTP: 'Technical or tactical roles like engineering, mechanics, IT, or field work.',
      ISTJ: 'Reliable operations roles like accounting, compliance, quality, or project management.'
    },
    typeRelationships: {
      ENFP: 'You connect through enthusiasm and empathy; depth grows when you also follow through.',
      ENFJ: 'You bring warmth and direction; ensure mutuality instead of over-responsibility.',
      ENTP: 'You bond through ideas and humor; remember to validate emotions.',
      ENTJ: 'You respect competence and clarity; soften directness to build trust.',
      ESFP: 'You bring joy and energy; long-term bonds strengthen with consistency.',
      ESFJ: 'You create harmony and support; express your own needs openly.',
      ESTP: 'You keep things dynamic; slow down to listen and build deeper trust.',
      ESTJ: 'You provide stability and clarity; balance standards with empathy.',
      INFP: 'You seek authentic connection; share feelings while setting practical expectations.',
      INFJ: 'You invest deeply and thoughtfully; protect boundaries to avoid burnout.',
      INTP: 'You value intellectual honesty; communicate feelings plainly to avoid distance.',
      INTJ: 'You show commitment through planning; share emotions to increase closeness.',
      ISFP: 'You offer quiet care; state preferences to avoid misunderstandings.',
      ISFJ: 'You support steadily; ask for support when you need it.',
      ISTP: 'You value independence; communicate clearly to keep trust strong.',
      ISTJ: 'You are loyal and consistent; be open to emotional expression.'
    },
    fallbacks: {
      typeDescription: 'Detailed characteristics for this type are available in the app.',
      strengths: 'Strengths for this type are available in the app.',
      growthTips: 'Growth tips for this type are available in the app.',
      careerAdvice: 'Career advice for this type is available in the app.',
      relationships: 'Relationship insights for this type are available in the app.'
    },
    trademark: 'MBTI is a registered trademark of the Myers-Briggs Type Indicator. This service is not an official MBTI offering.'
  };

  resultTranslations.en.sixteenFactor = {
    factors: {
      warmth: {
        name: 'Warmth',
        description: 'Interest in close, friendly relationships and emotional connection.',
        high: 'High: approachable, cooperative, and supportive.',
        low: 'Low: reserved, objective, and comfortable with distance.',
        advice: 'High: build trust and collaboration. Low: use objectivity while staying open to others.'
      },
      reasoning: {
        name: 'Reasoning',
        description: 'Comfort with abstract thinking and learning complex ideas.',
        high: 'High: enjoys analysis, concepts, and problem solving.',
        low: 'Low: prefers practical, concrete information.',
        advice: 'High: take on analytical challenges. Low: focus on hands-on learning and applied skills.'
      },
      emotional_stability: {
        name: 'Emotional Stability',
        description: 'Resilience under stress and emotional steadiness.',
        high: 'High: calm, resilient, and steady under pressure.',
        low: 'Low: sensitive to stress and emotional swings.',
        advice: 'High: provide stability for teams. Low: build recovery habits and stress management.'
      },
      dominance: {
        name: 'Dominance',
        description: 'Tendency to lead, influence, and assert.',
        high: 'High: decisive, competitive, and willing to take charge.',
        low: 'Low: cooperative, agreeable, and supportive.',
        advice: 'High: lead with clarity and empathy. Low: speak up and own decisions when needed.'
      },
      liveliness: {
        name: 'Liveliness',
        description: 'Energy, spontaneity, and social expressiveness.',
        high: 'High: lively, expressive, and enthusiastic.',
        low: 'Low: serious, measured, and cautious.',
        advice: 'High: channel energy into momentum. Low: use steady focus to deliver results.'
      },
      rule_consciousness: {
        name: 'Rule-Consciousness',
        description: 'Preference for structure, rules, and responsibility.',
        high: 'High: dutiful, reliable, and consistent.',
        low: 'Low: flexible, experimental, and open to change.',
        advice: 'High: keep standards while avoiding rigidity. Low: add structure to improve follow-through.'
      },
      social_boldness: {
        name: 'Social Boldness',
        description: 'Confidence in social settings and with new people.',
        high: 'High: confident, outgoing, and comfortable in groups.',
        low: 'Low: private, cautious, and reserved.',
        advice: 'High: use presence to build networks. Low: build confidence gradually and choose small steps.'
      },
      sensitivity: {
        name: 'Sensitivity',
        description: 'Emotional awareness and aesthetic sensitivity.',
        high: 'High: empathetic, artistic, and attuned to feelings.',
        low: 'Low: practical, tough-minded, and objective.',
        advice: 'High: use empathy in collaboration. Low: balance logic with awareness of impact.'
      },
      vigilance: {
        name: 'Vigilance',
        description: 'Skepticism versus trust toward others\' motives.',
        high: 'High: cautious, questioning, and risk aware.',
        low: 'Low: trusting, accepting, and optimistic.',
        advice: 'High: verify without becoming cynical. Low: keep healthy boundaries and check assumptions.'
      },
      abstractedness: {
        name: 'Abstractedness',
        description: 'Focus on ideas and imagination versus concrete facts.',
        high: 'High: imaginative, conceptual, and future-oriented.',
        low: 'Low: grounded, realistic, and detail-focused.',
        advice: 'High: pair ideas with execution. Low: stay open to new concepts and possibilities.'
      },
      privateness: {
        name: 'Privateness',
        description: 'Tendency to keep personal thoughts and feelings private.',
        high: 'High: discreet, guarded, and selective in sharing.',
        low: 'Low: open, transparent, and willing to self-disclose.',
        advice: 'High: share enough to build trust. Low: protect privacy when appropriate.'
      },
      apprehension: {
        name: 'Apprehension',
        description: 'Self-criticism and tendency to worry.',
        high: 'High: self-doubting, cautious, and vigilant.',
        low: 'Low: confident, self-assured, and optimistic.',
        advice: 'High: practice self-compassion and realistic risk checks. Low: seek feedback to avoid blind spots.'
      },
      openness_to_change: {
        name: 'Openness to Change',
        description: 'Preference for novelty and new approaches.',
        high: 'High: flexible, curious, and change-oriented.',
        low: 'Low: traditional, consistent, and stable.',
        advice: 'High: focus change on clear goals. Low: experiment gradually to stay adaptable.'
      },
      self_reliance: {
        name: 'Self-Reliance',
        description: 'Preference for independence versus group reliance.',
        high: 'High: autonomous, self-directed, and independent.',
        low: 'Low: collaborative, team-oriented, and consultative.',
        advice: 'High: coordinate to avoid isolation. Low: build confidence in independent decisions.'
      },
      perfectionism: {
        name: 'Perfectionism',
        description: 'Attention to detail and desire for order.',
        high: 'High: organized, precise, and standards-driven.',
        low: 'Low: flexible, relaxed, and adaptable.',
        advice: 'High: avoid over-polishing; set limits. Low: add structure to reduce errors.'
      },
      tension: {
        name: 'Tension',
        description: 'Impatience and internal pressure.',
        high: 'High: driven, restless, and easily stressed.',
        low: 'Low: relaxed, patient, and easygoing.',
        advice: 'High: manage stress and pace yourself. Low: use calm focus to sustain performance.'
      }
    },
    trademark: '16PF is a registered trademark of the 16 Personality Factor assessment. This service is not an official 16PF offering.'
  };

  resultTranslations.en.disc = {
    styles: {
      D: {
        name: 'Dominance',
        description: 'Direct, results-driven, and comfortable taking charge.',
        traits: ['Decisive', 'Results-focused', 'Direct', 'Competitive', 'Independent'],
        strengths: ['Leadership', 'Fast decisions', 'Goal focus', 'Problem solving', 'Drive'],
        weaknesses: ['Impatient', 'May overlook details', 'Can seem blunt', 'Low tolerance for slow pace'],
        workStyle: 'Moves quickly, sets goals, and pushes for results.',
        communication: 'Direct and concise; prefers clarity and action.',
        careerAdvice: 'Roles with ownership and targets, such as leadership, sales management, operations, or entrepreneurship.',
        relationships: 'Respects competence and clarity; build trust by listening and showing empathy.',
        growthTips: 'Slow down for input and balance urgency with collaboration.'
      },
      I: {
        name: 'Influence',
        description: 'Sociable, optimistic, and energized by people.',
        traits: ['Outgoing', 'Persuasive', 'Optimistic', 'Enthusiastic', 'People-focused'],
        strengths: ['Motivating others', 'Networking', 'Communication', 'Inspiring energy', 'Collaboration'],
        weaknesses: ['May overlook details', 'Disorganized at times', 'Avoids tough feedback', 'Overcommits'],
        workStyle: 'Enjoys collaboration and keeps energy high.',
        communication: 'Warm, expressive, and encouraging.',
        careerAdvice: 'People-facing roles like sales, marketing, community, HR, coaching, or events.',
        relationships: 'Creates connection quickly; follow-through builds long-term trust.',
        growthTips: 'Add structure and time management to support reliability.'
      },
      S: {
        name: 'Steadiness',
        description: 'Calm, reliable, and focused on stability and support.',
        traits: ['Patient', 'Supportive', 'Reliable', 'Calm', 'Cooperative'],
        strengths: ['Consistency', 'Team support', 'Listening', 'Stability', 'Follow-through'],
        weaknesses: ['Resists change', 'Avoids conflict', 'Slow decisions', 'Under-assertive'],
        workStyle: 'Prefers steady pace, clear routines, and predictable expectations.',
        communication: 'Calm, considerate, and steady.',
        careerAdvice: 'Stable roles like operations, customer support, administration, or quality control.',
        relationships: 'Builds trust through reliability; appreciates reassurance during change.',
        growthTips: 'Practice assertiveness and take small risks to adapt.'
      },
      C: {
        name: 'Conscientiousness',
        description: 'Analytical, careful, and quality-focused.',
        traits: ['Analytical', 'Precise', 'Systematic', 'Cautious', 'Quality-minded'],
        strengths: ['Accuracy', 'Critical thinking', 'Planning', 'Quality control', 'Risk awareness'],
        weaknesses: ['Perfectionism', 'Slow decisions', 'Can seem distant', 'Overly critical'],
        workStyle: 'Prefers clear standards, data, and time to do things right.',
        communication: 'Logical, structured, and detail-focused.',
        careerAdvice: 'Precision roles like analytics, engineering, finance, research, or quality.',
        relationships: 'Shows care through competence; balance analysis with empathy.',
        growthTips: 'Set time limits and allow good enough when appropriate.'
      }
    },
    trademark: 'DISC is a registered trademark of the DISC assessment. This service is not an official DISC offering.'
  };
}
