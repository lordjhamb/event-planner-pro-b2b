export const WEDDING_TEMPLATES = [
    {
        id: 'tmpl_punjabi',
        name: 'Punjabi Hindu Wedding',
        icon: '🥁',
        description: 'The quintessential "Big Fat Delhi Wedding." High energy, grand scale, and extensive festivities.',
        events_count: '9 events',
        default_events: [
            {
                name: 'Roka Ceremony',
                type: 'Pre-Wedding',
                description: 'Formal acceptance of marriage proposal.',
                suggested_budget: 150000,
                budget_share: 0.03,
                day_offset: -90,
                suggested_guests: 50,
                defaultTasks: [
                    { title: 'Book photographer', subtasks: [], due_date_offset: -30 },
                    { title: 'Finalize guest list', subtasks: [], due_date_offset: -15 },
                    { title: 'Order mithai/snacks', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange shagun items', subtasks: ['Tilak', 'Dried fruits', 'Clothes'], due_date_offset: -5 },
                    { title: 'Coordinate family schedules', subtasks: [], due_date_offset: -14 }
                ]
            },
            {
                name: 'Kurmai/Sagai (Engagement)',
                type: 'Pre-Wedding',
                description: 'Ring exchange and Chunni ceremony.',
                suggested_budget: 400000,
                budget_share: 0.08,
                day_offset: -45,
                suggested_guests: 200,
                defaultTasks: [
                    { title: 'Book venue', subtasks: [], due_date_offset: -90 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -60 },
                    { title: 'Book decorator', subtasks: [], due_date_offset: -45 },
                    { title: 'Order engagement rings', subtasks: [], due_date_offset: -45 },
                    { title: 'Design invitations', subtasks: [], due_date_offset: -30 },
                    { title: 'Book DJ/music', subtasks: [], due_date_offset: -30 },
                    { title: 'Finalize menu', subtasks: [], due_date_offset: -21 },
                    { title: 'Confirm priest availability', subtasks: [], due_date_offset: -14 },
                    { title: 'Arrange gift trays/platters', subtasks: [], due_date_offset: -7 },
                    { title: 'Day-before setup coordination', subtasks: [], due_date_offset: -1 },
                    { title: 'Day-of vendor arrival coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Sangeet Night',
                type: 'Pre-Wedding',
                description: 'Grand musical night with dance performances.',
                suggested_budget: 600000,
                budget_share: 0.12,
                day_offset: -2,
                suggested_guests: 300,
                defaultTasks: [
                    { title: 'Book venue', subtasks: [], due_date_offset: -180 }, // 6 months
                    { title: 'Book choreographer', subtasks: [], due_date_offset: -90 },
                    { title: 'Start dance rehearsals', subtasks: [], due_date_offset: -60 },
                    { title: 'Book DJ/band', subtasks: [], due_date_offset: -90 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Finalize song list', subtasks: [], due_date_offset: -30 },
                    { title: 'Finalize menu', subtasks: [], due_date_offset: -21 },
                    { title: 'Arrange stage/backdrop', subtasks: [], due_date_offset: -14 },
                    { title: 'Coordinate lighting', subtasks: [], due_date_offset: -7 },
                    { title: 'Final rehearsal', subtasks: [], due_date_offset: -2 },
                    { title: 'Setup supervision', subtasks: [], due_date_offset: 0 },
                    { title: 'Sound check', subtasks: [], due_date_offset: 0 },
                    { title: 'Performance coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Mehndi Ceremony',
                type: 'Pre-Wedding',
                description: 'Henna application for bride and guests.',
                suggested_budget: 200000,
                budget_share: 0.05,
                day_offset: -1,
                suggested_guests: 150,
                defaultTasks: [
                    { title: 'Book mehndi artists', subtasks: ['3-5 for bride', '2-3 for guests'], due_date_offset: -60 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Order decorations', subtasks: ['Marigold flowers', 'Yellow drapes'], due_date_offset: -30 },
                    { title: 'Arrange seating', subtasks: ['Low seats', 'Cushions'], due_date_offset: -7 },
                    { title: 'Confirm mehndi artist timing', subtasks: [], due_date_offset: -3 },
                    { title: 'Setup venue decorations', subtasks: [], due_date_offset: -1 },
                    { title: 'Arrange refreshments for artists', subtasks: [], due_date_offset: 0 },
                    { title: 'Coordinate artist schedules', subtasks: [], due_date_offset: 0 },
                    { title: 'Photography coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Jaggo/Jago Ceremony',
                type: 'Pre-Wedding',
                description: 'Lively procession with decorated copper pots.',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: -1,
                time_of_day: 'Night',
                suggested_guests: 100,
                defaultTasks: [
                    { title: 'Book dhol players', subtasks: [], due_date_offset: -60 },
                    { title: 'Prepare decorated pots (gaggar)', subtasks: ['Diyas', 'Oil'], due_date_offset: -3 },
                    { title: 'Coordinate route through neighborhood', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange safety/security', subtasks: [], due_date_offset: -2 },
                    { title: 'Evening coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Haldi/Maiyan Ceremony',
                type: 'Pre-Wedding',
                description: 'Turmeric paste application ritual.',
                suggested_budget: 150000,
                budget_share: 0.03,
                day_offset: 0,
                time_of_day: 'Morning',
                suggested_guests: 80,
                defaultTasks: [
                    { title: 'Prepare haldi paste', subtasks: [], due_date_offset: -1 },
                    { title: 'Arrange flowers', subtasks: ['Marigolds'], due_date_offset: -1 },
                    { title: 'Setup decorations', subtasks: [], due_date_offset: 0 },
                    { title: 'Coordinate family members', subtasks: [], due_date_offset: 0 },
                    { title: 'Photography setup', subtasks: [], due_date_offset: 0 },
                    { title: 'Cleanup arrangements', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Chooda/Chura Ceremony',
                type: 'Pre-Wedding',
                description: 'Bangle ceremony by maternal uncle.',
                suggested_budget: 50000,
                budget_share: 0.02,
                day_offset: 0,
                time_of_day: 'Early Morning',
                suggested_guests: 40,
                defaultTasks: [
                    { title: 'Purchase chooda', subtasks: ['Red & white bangles'], due_date_offset: -30 },
                    { title: 'Purchase kalire', subtasks: [], due_date_offset: -15 },
                    { title: 'Coordinate mama/mami arrival', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange morning breakfast', subtasks: [], due_date_offset: -1 },
                    { title: 'Photography coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Wedding Day',
                type: 'Wedding',
                description: 'Baraat, Milni, Varmala, and Pheras.',
                suggested_budget: 1800000,
                budget_share: 0.35,
                day_offset: 0,
                time_of_day: 'Evening',
                suggested_guests: 500,
                defaultTasks: [
                    { title: 'Final venue walkthrough', subtasks: [], due_date_offset: -7 },
                    { title: 'Confirm all vendor timings', subtasks: [], due_date_offset: -3 },
                    { title: 'Arrange baraat vehicle', subtasks: ['Horse', 'Vintage car'], due_date_offset: -30 },
                    { title: 'Book band for baraat', subtasks: [], due_date_offset: -90 },
                    { title: 'Finalize mandap design', subtasks: [], due_date_offset: -30 },
                    { title: 'Coordinate priest for muhurat', subtasks: [], due_date_offset: -60 },
                    { title: 'Finalize menu', subtasks: [], due_date_offset: -21 },
                    { title: 'Arrange wedding outfit', subtasks: [], due_date_offset: -120 },
                    { title: 'Book makeup artist', subtasks: [], due_date_offset: -120 },
                    { title: 'Guest accommodation arrangements', subtasks: [], due_date_offset: -60 },
                    { title: 'Setup begins', subtasks: [], due_date_offset: 0 },
                    { title: 'Decorator setup oversight', subtasks: [], due_date_offset: 0 },
                    { title: 'Caterer arrival & setup', subtasks: [], due_date_offset: 0 },
                    { title: 'Sound & lighting check', subtasks: [], due_date_offset: 0 },
                    { title: 'Bridal makeup begins', subtasks: [], due_date_offset: 0 },
                    { title: 'Baraat departure coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Milni ceremony coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Varmala stage management', subtasks: [], due_date_offset: 0 },
                    { title: 'Phera ceremony coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Dinner service oversight', subtasks: [], due_date_offset: 0 },
                    { title: 'Bidai ceremony coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Reception',
                type: 'Post-Wedding',
                description: 'Formal party for extended social circle.',
                suggested_budget: 800000,
                budget_share: 0.18,
                day_offset: 1,
                suggested_guests: 600,
                defaultTasks: [
                    { title: 'Book venue', subtasks: [], due_date_offset: -270 }, // 9 months
                    { title: 'Book caterer', subtasks: [], due_date_offset: -180 },
                    { title: 'Book decorator', subtasks: [], due_date_offset: -120 },
                    { title: 'Design stage/backdrop', subtasks: [], due_date_offset: -60 },
                    { title: 'Order reception outfits', subtasks: [], due_date_offset: -120 },
                    { title: 'Plan couple\'s entry choreography', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange cake', subtasks: [], due_date_offset: -15 },
                    { title: 'Coordinate bar setup', subtasks: [], due_date_offset: -7 },
                    { title: 'Finalize music playlist', subtasks: [], due_date_offset: -14 },
                    { title: 'Setup coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Sound check', subtasks: [], due_date_offset: 0 },
                    { title: 'Couple\'s entry coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Cake cutting coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Photography direction', subtasks: [], due_date_offset: 0 },
                    { title: 'Dinner service oversight', subtasks: [], due_date_offset: 0 }
                ]
            }
        ],
        optional_events: []
    },
    {
        id: 'tmpl_marwari',
        name: 'Marwari/Baniya Wedding',
        icon: '🏵️',
        description: 'Traditional and opulent, often with high jewelry spend and specific rituals like Myra.',
        events_count: '10 events',
        default_events: [
            {
                name: 'Raatri Jaga',
                type: 'Pre-Wedding',
                description: 'Ongoing ritual with swastika painting and family songs.',
                suggested_budget: 30000,
                budget_share: 0.01,
                day_offset: -7,
                defaultTasks: [
                    { title: 'Arrange priest for initial ceremony', subtasks: [], due_date_offset: -7 },
                    { title: 'Purchase sacred symbols materials', subtasks: [], due_date_offset: -10 },
                    { title: 'Coordinate between both homes', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Ganpati Sthapana',
                type: 'Pre-Wedding',
                description: 'Installation of Lord Ganesh idol.',
                suggested_budget: 30000,
                budget_share: 0.01,
                day_offset: -5,
                defaultTasks: [
                    { title: 'Arrange Vinayak boy', subtasks: [], due_date_offset: -7 },
                    { title: 'Purchase Ganpati idol', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange puja materials', subtasks: [], due_date_offset: -3 },
                    { title: 'Coordinate priest', subtasks: [], due_date_offset: -5 }
                ]
            },
            {
                name: 'Bhaat Nyotana',
                type: 'Pre-Wedding',
                description: 'Formal invitation to maternal family.',
                suggested_budget: 30000,
                budget_share: 0.01,
                day_offset: -4,
                defaultTasks: [
                    { title: 'Prepare invitation packets', subtasks: [], due_date_offset: -7 },
                    { title: 'Coordinate with maternal family', subtasks: [], due_date_offset: -14 },
                    { title: 'Arrange refreshments', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Mahira Dastoor (Bhaat)',
                type: 'Pre-Wedding',
                description: 'Maternal uncle brings gifts for the family.',
                suggested_budget: 250000,
                budget_share: 0.05,
                day_offset: -3,
                defaultTasks: [
                    { title: 'Coordinate with mama', subtasks: [], due_date_offset: -60 },
                    { title: 'Arrange gift display area', subtasks: [], due_date_offset: -7 },
                    { title: 'Organize formal ceremony', subtasks: [], due_date_offset: -3 }
                ]
            },
            {
                name: 'Palla Dastoor',
                type: 'Pre-Wedding',
                description: 'Bridal outfit formally displayed and blessed.',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: -2,
                defaultTasks: [
                    { title: 'Prepare bridal outfit for display', subtasks: [], due_date_offset: -3 },
                    { title: 'Arrange display setup', subtasks: [], due_date_offset: -1 },
                    { title: 'Coordinate family blessing ceremony', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Pithi/Telbaan',
                type: 'Pre-Wedding',
                description: 'Turmeric & oil application with Ghungra sweets.',
                suggested_budget: 150000,
                budget_share: 0.03,
                day_offset: -1,
                defaultTasks: [
                    { title: 'Prepare haldi/oil mixture', subtasks: [], due_date_offset: -2 },
                    { title: 'Order ghungra sweets', subtasks: [], due_date_offset: -3 },
                    { title: 'Arrange decorations', subtasks: [], due_date_offset: -2 },
                    { title: 'Setup coordination', subtasks: [], due_date_offset: -1 }
                ]
            },
            {
                name: 'Sangeet & Mehendi',
                type: 'Pre-Wedding',
                description: 'Combined grand celebration.',
                suggested_budget: 700000,
                budget_share: 0.15,
                day_offset: -1,
                defaultTasks: [
                    { title: 'Book Choreographer', subtasks: [], due_date_offset: -90 },
                    { title: 'Book DJ/Band', subtasks: [], due_date_offset: -90 },
                    { title: 'Book Mehndi artists', subtasks: [], due_date_offset: -60 },
                    { title: 'Book Caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Book Decorator', subtasks: [], due_date_offset: -90 },
                    { title: 'Book Photographer', subtasks: [], due_date_offset: -120 },
                    { title: 'Stage Setup', subtasks: [], due_date_offset: -14 },
                    { title: 'Lighting Coordination', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Thamb Puja',
                type: 'Pre-Wedding',
                description: 'Worship of the ceremonial pillar at entrance.',
                suggested_budget: 50000,
                budget_share: 0.01,
                day_offset: 0,
                defaultTasks: [
                    { title: 'Arrange ceremonial pillar', subtasks: [], due_date_offset: -7 },
                    { title: 'Decorate pillar', subtasks: [], due_date_offset: -1 },
                    { title: 'Coordinate priest for specific mantras', subtasks: [], due_date_offset: -3 }
                ]
            },
            {
                name: 'Wedding Ceremony',
                type: 'Wedding',
                description: 'Grand wedding with Havan (11 Brahmins).',
                suggested_budget: 2000000,
                budget_share: 0.40,
                day_offset: 0,
                time_of_day: 'Evening',
                suggested_guests: 800,
                defaultTasks: [
                    { title: 'Confirm availability of 11 Brahmins', subtasks: [], due_date_offset: -60 },
                    { title: 'Arrange aanjhala (jeweled money bag)', subtasks: [], due_date_offset: -30 },
                    { title: 'Book Venue', subtasks: [], due_date_offset: -180 },
                    { title: 'Book Caterer (Vegetarian)', subtasks: [], due_date_offset: -180 },
                    { title: 'Book Decorator', subtasks: [], due_date_offset: -120 },
                    { title: 'Book Photographer/Videographer', subtasks: [], due_date_offset: -120 },
                    { title: 'Book DJ/Lighting', subtasks: [], due_date_offset: -90 },
                    { title: 'Baraat coordination', subtasks: [], due_date_offset: 0 },
                    { title: 'Havan Samagri', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Reception',
                type: 'Post-Wedding',
                description: 'Grand post-wedding celebration.',
                suggested_budget: 1000000,
                budget_share: 0.20,
                day_offset: 1,
                suggested_guests: 800,
                defaultTasks: [
                    { title: 'Book venue', subtasks: [], due_date_offset: -270 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -180 },
                    { title: 'Book decorator', subtasks: [], due_date_offset: -120 },
                    { title: 'Design stage/backdrop', subtasks: [], due_date_offset: -60 },
                    { title: 'Order reception outfits', subtasks: [], due_date_offset: -120 },
                    { title: 'Plan couple\'s entry', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange cake', subtasks: [], due_date_offset: -14 },
                    { title: 'Bar setup', subtasks: [], due_date_offset: -7 },
                    { title: 'Finalize music', subtasks: [], due_date_offset: -14 },
                    { title: 'Guest management', subtasks: [], due_date_offset: 0 }
                ]
            }
        ],
        optional_events: []
    },
    {
        id: 'tmpl_jain',
        name: 'Jain Wedding',
        icon: '🕉️',
        description: 'Values-driven celebration with strict Sattvic food and specific 4-phera ritual.',
        events_count: '9 events',
        default_events: [
            {
                name: 'Gol Dhana (Engagement)',
                type: 'Pre-Wedding',
                description: 'Exchange of coriander seeds (dhana) and jaggery (gol).',
                suggested_budget: 300000,
                budget_share: 0.08,
                day_offset: -60,
                suggested_guests: 150,
                defaultTasks: [
                    { title: 'Book venue with Sattvic kitchen', subtasks: [], due_date_offset: -180 },
                    { title: 'Verify caterer\'s Jain credentials', subtasks: [], due_date_offset: -120 },
                    { title: 'Arrange coriander-jaggery packets', subtasks: [], due_date_offset: -30 },
                    { title: 'Confirm Jain Pandit availability', subtasks: [], due_date_offset: -60 },
                    { title: 'Book photographer', subtasks: [], due_date_offset: -120 },
                    { title: 'Finalize strictly Jain menu', subtasks: [], due_date_offset: -45 }
                ]
            },
            {
                name: 'Lagana Lekhan',
                type: 'Pre-Wedding',
                description: 'Written commitment of marriage.',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: -30,
                defaultTasks: [
                    { title: 'Prepare formal documents', subtasks: [], due_date_offset: -30 },
                    { title: 'Coordinate witness attendance', subtasks: [], due_date_offset: -14 },
                    { title: 'Arrange temple/home ceremony', subtasks: [], due_date_offset: -21 }
                ]
            },
            {
                name: 'Mandap Mahurat',
                type: 'Pre-Wedding',
                description: 'Auspicious mandap installation.',
                suggested_budget: 50000,
                budget_share: 0.02,
                day_offset: -3,
                time_of_day: 'Morning',
                defaultTasks: [
                    { title: 'Confirm muhurat timing with Jain astrologer', subtasks: [], due_date_offset: -60 },
                    { title: 'Coordinate mandap designer', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange installation materials', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Pithi (Haldi)',
                type: 'Pre-Wedding',
                description: 'Turmeric paste application.',
                suggested_budget: 100000,
                budget_share: 0.03,
                day_offset: -2,
                defaultTasks: [
                    { title: 'Prepare turmeric paste', subtasks: [], due_date_offset: -2 },
                    { title: 'Arrange decorations', subtasks: [], due_date_offset: -3 },
                    { title: 'Confirm Sattvic catering', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Mehendi',
                type: 'Pre-Wedding',
                description: 'Henna ceremony.',
                suggested_budget: 200000,
                budget_share: 0.04,
                day_offset: -1,
                defaultTasks: [
                    { title: 'Book Mehendi artists', subtasks: [], due_date_offset: -60 },
                    { title: 'Verify Sattvic refreshments', subtasks: [], due_date_offset: -14 },
                    { title: 'Decor', subtasks: [], due_date_offset: -30 }
                ]
            },
            {
                name: 'Sangeet',
                type: 'Pre-Wedding',
                description: 'Musical celebration.',
                suggested_budget: 500000,
                budget_share: 0.12,
                day_offset: -1,
                defaultTasks: [
                    { title: 'Book DJ/Band', subtasks: [], due_date_offset: -90 },
                    { title: 'Book Sattvic Caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Book Decorator', subtasks: [], due_date_offset: -90 },
                    { title: 'Book Choreographer', subtasks: [], due_date_offset: -60 },
                    { title: 'Verification of no root vegetables in menu', subtasks: [], due_date_offset: -21 }
                ]
            },
            {
                name: 'Wedding Ceremony (Vivah)',
                type: 'Wedding',
                description: 'Vivah with 4 Pheras.',
                suggested_budget: 1500000,
                budget_share: 0.35,
                day_offset: 0,
                time_of_day: 'Day/Evening',
                suggested_guests: 500,
                defaultTasks: [
                    { title: 'Confirm Jain Pandit', subtasks: [], due_date_offset: -90 },
                    { title: 'Verify venue has NO onion/garlic in any kitchen', subtasks: [], due_date_offset: -180 },
                    { title: 'Book caterer specializing in Jain cuisine', subtasks: [], due_date_offset: -180 },
                    { title: 'Arrange Jain religious items', subtasks: ['Tilak', 'Sacred thread'], due_date_offset: -30 },
                    { title: 'Madhuparka arrangement', subtasks: [], due_date_offset: 0 },
                    { title: 'Var Puja arrangement', subtasks: [], due_date_offset: 0 },
                    { title: '4 Pheras setup', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Jina Grahe Dhan Arpana',
                type: 'Post-Wedding',
                description: 'Temple visit and donation.',
                suggested_budget: 50000,
                budget_share: 0.02,
                day_offset: 2,
                defaultTasks: [
                    { title: 'Coordinate temple visit', subtasks: [], due_date_offset: -7 },
                    { title: 'Prepare donation', subtasks: [], due_date_offset: -1 }
                ]
            },
            {
                name: 'Reception',
                type: 'Post-Wedding',
                description: 'Formal reception (No Alcohol).',
                suggested_budget: 800000,
                budget_share: 0.18,
                day_offset: 1,
                suggested_guests: 500,
                defaultTasks: [
                    { title: 'Book Venue', subtasks: [], due_date_offset: -270 },
                    { title: 'Sattvic Catering Verification', subtasks: [], due_date_offset: -60 },
                    { title: 'Decor', subtasks: [], due_date_offset: -90 },
                    { title: 'Photographer', subtasks: [], due_date_offset: -120 },
                    { title: 'Confirm NO alcohol service', subtasks: [], due_date_offset: -30 }
                ]
            }
        ],
        optional_events: []
    },
    {
        id: 'tmpl_sikh',
        name: 'Sikh Wedding (Anand Karaj)',
        icon: '⚔️',
        description: 'Centered around the Gurudwara ceremony. Must be held before noon.',
        events_count: '11 events',
        default_events: [
            {
                name: 'Roka Ceremony',
                type: 'Pre-Wedding',
                description: 'Formal acceptance.',
                suggested_budget: 150000,
                budget_share: 0.03,
                day_offset: -90,
                defaultTasks: [
                    { title: 'Book Photographer', subtasks: [], due_date_offset: -30 },
                    { title: 'Finalize guest list', subtasks: [], due_date_offset: -15 },
                    { title: 'Order mithai/snacks', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange shagun items', subtasks: [], due_date_offset: -5 }
                ]
            },
            {
                name: 'Kurmai (Engagement)',
                type: 'Pre-Wedding',
                description: 'Engagement ceremony with Kirtan.',
                suggested_budget: 300000,
                budget_share: 0.08,
                day_offset: -60,
                suggested_guests: 200,
                defaultTasks: [
                    { title: 'Book Gurudwara', subtasks: [], due_date_offset: -180 },
                    { title: 'Book Banquet (Lunch)', subtasks: [], due_date_offset: -180 },
                    { title: 'Arrange Raagi musicians', subtasks: [], due_date_offset: -90 },
                    { title: 'Coordinate Langar arrangements', subtasks: [], due_date_offset: -14 }
                ]
            },
            {
                name: 'Akhand Path',
                type: 'Pre-Wedding',
                description: '48-hour continuous scripture reading.',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: -5,
                defaultTasks: [
                    { title: 'Arrange Guru Granth Sahib and platform', subtasks: [], due_date_offset: -30 },
                    { title: 'Book Paathis for continuous reading shifts', subtasks: [], due_date_offset: -30 },
                    { title: 'Setup reading area at home/Gurudwara', subtasks: [], due_date_offset: -14 },
                    { title: 'Coordinate family attendance shifts', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange refreshments for Paathis', subtasks: [], due_date_offset: -3 }
                ]
            },
            {
                name: 'Maiyan/Vatna',
                type: 'Pre-Wedding',
                description: 'Turmeric application (Haldi).',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: -3,
                defaultTasks: [
                    { title: 'Prepare ubtan mixture', subtasks: [], due_date_offset: -5 },
                    { title: 'Arrange decorations', subtasks: [], due_date_offset: -5 },
                    { title: 'Coordinate daily ceremonies', subtasks: [], due_date_offset: -5 }
                ]
            },
            {
                name: 'Sangeet',
                type: 'Pre-Wedding',
                description: 'Dance and music night.',
                suggested_budget: 500000,
                budget_share: 0.12,
                day_offset: -2,
                suggested_guests: 300,
                defaultTasks: [
                    { title: 'Book Choreographer', subtasks: [], due_date_offset: -90 },
                    { title: 'Book DJ/Dhol players', subtasks: [], due_date_offset: -90 },
                    { title: 'Book Caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Book Decorator', subtasks: [], due_date_offset: -90 }
                ]
            },
            {
                name: 'Mehendi',
                type: 'Pre-Wedding',
                description: 'Henna ceremony.',
                suggested_budget: 200000,
                budget_share: 0.04,
                day_offset: -2,
                defaultTasks: [
                    { title: 'Book Mehndi artists', subtasks: [], due_date_offset: -60 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Decorations', subtasks: [], due_date_offset: -30 },
                    { title: 'Seating arrangements', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Jaggo',
                type: 'Pre-Wedding',
                description: 'Lively procession with oil lamps.',
                suggested_budget: 150000,
                budget_share: 0.04,
                day_offset: -1,
                time_of_day: 'Night',
                defaultTasks: [
                    { title: 'Book dhol players', subtasks: [], due_date_offset: -60 },
                    { title: 'Prepare decorated pots (gaggar)', subtasks: ['Diyas', 'Oil'], due_date_offset: -7 },
                    { title: 'Plan procession route', subtasks: [], due_date_offset: -14 },
                    { title: 'Coordinate neighborhood permissions', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange safety measures', subtasks: [], due_date_offset: -3 }
                ]
            },
            {
                name: 'Chooda/Churha Ceremony',
                type: 'Pre-Wedding',
                description: 'Bangle ceremony by maternal uncle.',
                suggested_budget: 100000,
                budget_share: 0.02,
                day_offset: 0,
                time_of_day: 'Early Morning',
                defaultTasks: [
                    { title: 'Purchase chooda', subtasks: [], due_date_offset: -30 },
                    { title: 'Purchase kalire', subtasks: [], due_date_offset: -30 },
                    { title: 'Coordinate mama/mami arrival', subtasks: [], due_date_offset: -7 },
                    { title: 'Arrange morning meal', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Anand Karaj',
                type: 'Wedding',
                description: 'Morning ceremony at Gurudwara.',
                suggested_budget: 300000,
                budget_share: 0.08,
                day_offset: 0,
                time_of_day: 'Morning',
                suggested_guests: 400,
                defaultTasks: [
                    { title: 'Book Gurudwara', subtasks: [], due_date_offset: -365 }, // 12 months+
                    { title: 'Confirm Raagi musicians', subtasks: [], due_date_offset: -90 },
                    { title: 'Coordinate Langar arrangements', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange Rumala Sahib', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange Palki Sahib', subtasks: [], due_date_offset: -30 },
                    { title: 'Coordinate family seating', subtasks: [], due_date_offset: -14 },
                    { title: 'Confirm Lavaan timing', subtasks: [], due_date_offset: -3 }
                ]
            },
            {
                name: 'Langar',
                type: 'Wedding',
                description: 'Community meal served to all.',
                suggested_budget: 0, // Included in Anand Karaj usually, or tracked separately
                budget_share: 0.00,
                day_offset: 0,
                time_of_day: 'Afternoon',
                defaultTasks: [
                    { title: 'Coordinate meal arrangements', subtasks: [], due_date_offset: -30 },
                    { title: 'Ensure sufficient quantity', subtasks: [], due_date_offset: -7 },
                    { title: 'Volunteer coordination', subtasks: [], due_date_offset: -7 }
                ]
            },
            {
                name: 'Reception',
                type: 'Post-Wedding',
                description: 'Evening party with alcohol permitted.',
                suggested_budget: 1000000,
                budget_share: 0.25,
                day_offset: 0,
                time_of_day: 'Evening',
                suggested_guests: 600,
                defaultTasks: [
                    { title: 'Book Venue', subtasks: [], due_date_offset: -270 },
                    { title: 'Book Caterer', subtasks: [], due_date_offset: -180 },
                    { title: 'Book Decorator', subtasks: [], due_date_offset: -120 },
                    { title: 'Book DJ/Band', subtasks: [], due_date_offset: -120 },
                    { title: 'Book Photographer', subtasks: [], due_date_offset: -120 },
                    { title: 'Bar service', subtasks: [], due_date_offset: -60 }
                ]
            }
        ],
        optional_events: []
    },
    {
        id: 'tmpl_sindhi',
        name: 'Sindhi Wedding',
        icon: '🪔',
        description: 'Fun-filled, dance-heavy, often with late-night Baraat and unique rituals like Saanth.',
        events_count: '10 events',
        default_events: [
            {
                name: 'Berana Satsang',
                type: 'Pre-Wedding',
                description: 'Worship of Jhulelal, starting 10-day prayer period.',
                suggested_budget: 30000,
                budget_share: 0.01,
                day_offset: -10,
                defaultTasks: [
                    { title: 'Arrange Jhulelal idol/image', subtasks: [], due_date_offset: -15 },
                    { title: 'Coordinate priest for initial satsang', subtasks: [], due_date_offset: -12 },
                    { title: 'Setup prayer area', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Pakki (Formal Engagement)',
                type: 'Pre-Wedding',
                description: 'Ring exchange and formal engagement.',
                suggested_budget: 350000,
                budget_share: 0.07,
                day_offset: -45,
                suggested_guests: 200,
                defaultTasks: [
                    { title: 'Book Venue', subtasks: [], due_date_offset: -90 },
                    { title: 'Rings', subtasks: [], due_date_offset: -45 },
                    { title: 'Caterer', subtasks: [], due_date_offset: -60 },
                    { title: 'Music', subtasks: [], due_date_offset: -30 },
                    { title: 'Decorator', subtasks: [], due_date_offset: -45 }
                ]
            },
            {
                name: 'Kacchi Misri',
                type: 'Pre-Wedding',
                description: 'Sweetening the relationship with rock sugar.',
                suggested_budget: 50000,
                budget_share: 0.02,
                day_offset: -30,
                defaultTasks: [
                    { title: 'Purchase special misri', subtasks: ['Rock sugar'], due_date_offset: -30 },
                    { title: 'Arrange silver/decorative plates', subtasks: [], due_date_offset: -21 },
                    { title: 'Coordinate ceremony timing', subtasks: [], due_date_offset: -14 }
                ]
            },
            {
                name: 'Sagri',
                type: 'Pre-Wedding',
                description: 'Groom\'s family sends gifts to bride.',
                suggested_budget: 100000,
                budget_share: 0.03,
                day_offset: -7,
                defaultTasks: [
                    { title: 'Coordinate gift selection with groom\'s family', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange gift display area', subtasks: [], due_date_offset: -14 },
                    { title: 'Organize formal presentation ceremony', subtasks: [], due_date_offset: -10 }
                ]
            },
            {
                name: 'Mehendi',
                type: 'Pre-Wedding',
                description: 'Henna application ceremony.',
                suggested_budget: 200000,
                budget_share: 0.05,
                day_offset: -2,
                defaultTasks: [
                    { title: 'Book Mehndi artists', subtasks: [], due_date_offset: -60 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -120 },
                    { title: 'Decorations', subtasks: [], due_date_offset: -30 },
                    { title: 'Photographer', subtasks: [], due_date_offset: -120 }
                ]
            },
            {
                name: 'Sangeet',
                type: 'Pre-Wedding',
                description: 'Grand competitive dance party.',
                suggested_budget: 700000,
                budget_share: 0.15,
                day_offset: -2,
                suggested_guests: 400,
                defaultTasks: [
                    { title: 'Book Choreographer (Essential)', subtasks: [], due_date_offset: -150 }, // 5 months
                    { title: 'Extended rehearsal schedule', subtasks: [], due_date_offset: -90 },
                    { title: 'Book DJ and live band', subtasks: [], due_date_offset: -120 },
                    { title: 'Plan elaborate stage design', subtasks: [], due_date_offset: -60 },
                    { title: 'Lighting', subtasks: [], due_date_offset: -30 }
                ]
            },
            {
                name: 'Dev Bithana',
                type: 'Pre-Wedding',
                description: 'Installation of Lord Ganesha and Jhulelal.',
                suggested_budget: 50000,
                budget_share: 0.02,
                day_offset: -1,
                defaultTasks: [
                    { title: 'Arrange idols', subtasks: [], due_date_offset: -7 },
                    { title: 'Coordinate priest', subtasks: [], due_date_offset: -14 },
                    { title: 'Setup worship area', subtasks: [], due_date_offset: -2 }
                ]
            },
            {
                name: 'Saanth',
                type: 'Pre-Wedding',
                description: 'Ritualistic tearing of groom\'s clothes.',
                suggested_budget: 20000,
                budget_share: 0.01,
                day_offset: 0,
                time_of_day: 'Morning',
                suggested_guests: 40,
                defaultTasks: [
                    { title: 'Arrange old clothes for ritual', subtasks: [], due_date_offset: -7 },
                    { title: 'Explain ritual to groom', subtasks: [], due_date_offset: -3 },
                    { title: 'Photography coordination', subtasks: [], due_date_offset: 0 }
                ]
            },
            {
                name: 'Wedding Ceremony',
                type: 'Wedding',
                description: 'Late night Pheras and Jhulelal worship.',
                suggested_budget: 1800000,
                budget_share: 0.35,
                day_offset: 0,
                time_of_day: 'Night',
                suggested_guests: 600,
                defaultTasks: [
                    { title: 'Book all vendors', subtasks: ['Venue', 'Caterer', 'Decorator'], due_date_offset: -270 },
                    { title: 'Communicate expected baraat delay', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange Jhulelal worship materials', subtasks: [], due_date_offset: -30 },
                    { title: 'Coordinate thread-measuring ritual items', subtasks: [], due_date_offset: -14 },
                    { title: 'Book Venue', subtasks: ['Extended Hours'], due_date_offset: -30 },
                    { title: 'White Horse for Groom', subtasks: [], due_date_offset: -30 }
                ]
            },
            {
                name: 'Reception',
                type: 'Post-Wedding',
                description: 'High energy party.',
                suggested_budget: 900000,
                budget_share: 0.20,
                day_offset: 1,
                suggested_guests: 600,
                defaultTasks: [
                    { title: 'Book venue', subtasks: [], due_date_offset: -270 },
                    { title: 'Book caterer', subtasks: [], due_date_offset: -180 },
                    { title: 'Book decorator', subtasks: [], due_date_offset: -120 },
                    { title: 'Design stage/backdrop', subtasks: [], due_date_offset: -60 },
                    { title: 'Order reception outfits', subtasks: [], due_date_offset: -120 },
                    { title: 'Plan couple\'s entry', subtasks: [], due_date_offset: -30 },
                    { title: 'Arrange cake', subtasks: [], due_date_offset: -15 },
                    { title: 'Coordinate bar setup', subtasks: [], due_date_offset: -7 },
                    { title: 'Finalize music', subtasks: [], due_date_offset: -14 }
                ]
            }
        ],
        optional_events: []
    }
];
