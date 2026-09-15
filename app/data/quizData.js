export const characterIds = ["vitou", "anita", "tohla", "kimly", "mc"];

const bi = (en, km) => ({ en, km });

export const sections = [
  { id: "identity", number: 1, title: bi("Identity & Self - Perception", "អត្តសញ្ញាណ និងការមើលឃើញខ្លួនឯង"), subtitle: bi("How do you see yourself?", "តើអ្នកមើលឃើញខ្លួនឯងបែបណា?"), start: 0, end: 4, color: "#1a4c19", soft: "#fafafa", accent: "#b5d627", art: "mirror" },
  { id: "creativity", number: 2, title: bi("Creativity & Making", "ការបង្កើតថ្មី និងសិល្បៈ"), subtitle: bi("How do you create?", "តើអ្នកបង្កើតអ្វីៗឡើងដោយរបៀបណា?"), start: 5, end: 7, color: "#ff582e", soft: "#fafafa", accent: "#c8320d", accentContrast: "#fafafa", contrast: "#fafafa", patternBackground: "#ff582e", patternMotif: "#c8320d", headerColor: "#c8320d", art: "spark" },
  { id: "uncertainty", number: 3, title: bi("Uncertainty & Decision-Making", "ភាពមិនច្បាស់លាស់ និងការសម្រេចចិត្ត"), subtitle: bi("What do you do when there isn't a clear answer?", "តើអ្នកធ្វើដូចម្តេច នៅពេលគ្មានចម្លើយច្បាស់លាស់?"), start: 8, end: 11, color: "#feb2bf", soft: "#fafafa", accent: "#ff582e", accentContrast: "#fafafa", contrast: "#fafafa", patternBackground: "#feb2bf", patternMotif: "#ff582e", headerColor: "#ff582e", ink: "#2b2b2b", art: "path" },
  { id: "social", number: 4, title: bi("Social & Relationships", "ទំនាក់ទំនងសង្គម"), subtitle: bi("How do you connect with people?", "តើអ្នកបង្កើតទំនាក់ទំនងជាមួយមនុស្សជុំវិញខ្លួនដោយរបៀបណា?"), start: 12, end: 13, color: "#febe14", soft: "#fafafa", accent: "#f57a22", accentContrast: "#fafafa", contrast: "#fafafa", patternBackground: "#febe14", patternMotif: "#f57a22", headerColor: "#f57a22", ink: "#2b2b2b", art: "people" },
  { id: "belonging", number: 5, title: bi("Place & Belonging", "កន្លែងរស់នៅ និងភាពជាម្ចាស់ផ្ទះ"), subtitle: bi("Where do you fit?", "តើអ្នកសមស្របនឹងកន្លែងណា?"), start: 14, end: 14, color: "#4550A7", soft: "#fafafa", accent: "#7889EA", accentContrast: "#2b2b2b", contrast: "#fafafa", patternBackground: "#4550A7", patternMotif: "#7889EA", headerColor: "#7889EA", ink: "#2b2b2b", art: "home" },
];

export const questions = [
  {
    id: "q1", sectionId: "identity", prompt: bi("What word fits you best?", "តើពាក្យមួយណាដែលត្រូវនឹងខ្លួនអ្នកបំផុត?"),
    options: [
      { id: "q1-a", text: bi("Reliable", "គួរឱ្យទុកចិត្ត / ពឹងផ្អែកបាន"), characterId: "tohla" },
      { id: "q1-b", text: bi("Curious", "ចង់ដឹងចង់ឃើញ / ចូលចិត្តសាកអ្វីថ្មី"), characterId: "vitou" },
      { id: "q1-c", text: bi("Energetic", "ពោរពេញដោយថាមពល / ស្រស់ស្រាយ"), characterId: "kimly" },
      { id: "q1-d", text: bi("Responsible", "មានការទទួលខុសត្រូវខ្ពស់"), characterId: "mc" },
      { id: "q1-e", text: bi("Thoughtful", "យល់ចិត្តគេ / គិតគូរច្រើន"), characterId: "anita" },
    ],
  },
  {
    id: "q2", sectionId: "identity", prompt: bi("What do people ask you often?", "តើសំណួរមួយណាដែលមនុស្សជុំវិញខ្លួនតែងតែសួរអ្នកញឹកញាប់?"),
    options: [
      { id: "q2-a", text: bi("“Can you help me?”", '"ជួយមើល/ជួយធ្វើការងារនេះបន្តិចបានទេ?"'), characterId: "tohla" },
      { id: "q2-b", text: bi("“Are you sure you're okay?”", '"ឯងមិនអីមែនទេ?"'), characterId: "anita" },
      { id: "q2-c", text: bi("“Why do you always try new things?”", '"ហេតុអ្វីបានជាចូលចិត្តសាកធ្វើអីថ្មីៗរហូតចឹង?"'), characterId: "kimly" },
      { id: "q2-d", text: bi("“How do you know so much?”", '"ម៉េចក៏ដឹងរឿងច្រើនម៉្លេះ?"'), characterId: "vitou" },
      { id: "q2-e", text: bi("“When will you decide what you want?”", '"តើអង្កាល់ទើបសម្រេចចិត្តច្បាស់ថាចង់បានអី?"'), characterId: "mc" },
    ],
  },
  {
    id: "q3", sectionId: "identity", prompt: bi("What makes you most uncomfortable?", "តើស្ថានភាពមួយណាដែលធ្វើឱ្យអ្នក «មិនស្រួលចិត្ត» ខ្លាំងបំផុត?"),
    options: [
      { id: "q3-a", text: bi("Feeling like nobody needs me.", "មានអារម្មណ៍ថាគ្មាននរណាម្នាក់ត្រូវការយើង។"), characterId: "tohla" },
      { id: "q3-b", text: bi("Being told I'm ordinary.", "ត្រូវគេប្រាប់ថាខ្លួនឯងជាមនុស្សធម្មតា គ្មានអ្វីប្លែក។"), characterId: "vitou" },
      { id: "q3-c", text: bi("Making an important choice without knowing the answer.", "ត្រូវធ្វើការសម្រេចចិត្តសំខាន់ ដោយមិនដឹងថាចម្លើយណាជាចម្លើយត្រូវ។"), characterId: "mc" },
      { id: "q3-d", text: bi("Feeling like I've disappointed someone.", "មានអារម្មណ៍ថាខ្លួនឯងធ្វើឱ្យនរណាម្នាក់ខកបំណង។"), characterId: "anita" },
      { id: "q3-e", text: bi("Having nothing to make or do.", "គ្មានអ្វីត្រូវធ្វើ គ្មានអ្វីត្រូវបង្កើត ឬគ្មានគម្រោងក្នុងដៃ។"), characterId: "kimly" },
    ],
  },
  {
    id: "q4", sectionId: "identity", prompt: bi("Which feels most familiar?", "តើឃ្លាមួយណាដែលស្តាប់ទៅ «ត្រូវចចំអារម្មណ៍» អ្នកខ្លាំងជាងគេ?"),
    options: [
      { id: "q4-a", text: bi("“I wish someone would tell me what to do.”", '"ប្រាថ្នាចង់ឱ្យមាននរណាម្នាក់ ប្រាប់ខ្ញុំថាត្រូវធ្វើអ្វី។"'), characterId: "mc" },
      { id: "q4-b", text: bi("“If everyone is okay, I'm okay.”", '"ឱ្យតែអ្នករាល់គ្នា មិនអី ខ្ញុំក៏មិនអីដែរ។"'), characterId: "tohla" },
      { id: "q4-c", text: bi("“If I'm not making something, who am I?”", '"បើខ្ញុំមិនបានបង្កើត ឬធ្វើអ្វីមួយ តើខ្ញុំជាអ្នកណាឱ្យប្រាកដ?"'), characterId: "kimly" },
      { id: "q4-d", text: bi("“I just want to know what's out there.”", '"ខ្ញុំគ្រាន់តែចង់ដឹងថា តើពិភពខាងក្រៅមានអ្វីប្លែកទៀតខ្លះ។"'), characterId: "vitou" },
      { id: "q4-e", text: bi("“If I could do this right, I'd be enough.”", '"ប្រសិនបើខ្ញុំធ្វើវាបានល្អឥតខ្ចោះ ខ្ញុំប្រហែលជាអាចមានអារម្មណ៍ថាខ្លួនឯងល្អគ្រប់គ្រាន់។"'), characterId: "anita" },
    ],
  },
  {
    id: "q5", sectionId: "identity", prompt: bi("What would you change about yourself?", "ប្រសិនបើអ្នកអាចផ្លាស់ប្តូរចរិតលក្ខណៈមួយបាន តើអ្នកចង់ផ្លាស់ប្តូរអ្វី?"),
    options: [
      { id: "q5-a", text: bi("I wish I could slow down.", "ចង់ឱ្យចិត្តឯងស្ងប់បន្តិច និងឈប់ប្រញាប់ប្រញាល់។"), characterId: "kimly" },
      { id: "q5-b", text: bi("I wish I trusted my decisions more.", "ចង់ជឿជាក់លើការសម្រេចចិត្តរបស់ខ្លួនឯងឱ្យបានច្រើនជាងនេះ។"), characterId: "mc" },
      { id: "q5-c", text: bi("I wish I didn't pressure myself so much.", "ចង់កាត់បន្ថយការដាក់សម្ពាធលើខ្លួនឯងជ្រុល។"), characterId: "anita" },
      { id: "q5-d", text: bi("I wish I didn't need to prove myself.", "ចង់កាត់បន្ថយអារម្មណ៍ដែលតែងតែប្រឹងប្រែងចង់បង្ហាញ/បញ្ជាក់ពីខ្លួនឯង។"), characterId: "vitou" },
      { id: "q5-e", text: bi("I wish I could say no more easily.", 'ចង់មានសមត្ថភាពបដិសេធ (ពាក្យថា "ទេ") ដោយងាយស្រួលជាងមុន។'), characterId: "tohla" },
    ],
  },
  {
    id: "q6", sectionId: "creativity", prompt: bi("You worked hard on something. Someone says, “I don't like it.” What do you do?", 'អ្នកបានខិតខំធ្វើការងារ/ស្នាដៃមួយយ៉ាងខ្លាំង ហើយមានគេនិយាយថា "ខ្ញុំមិនសូវចូលចិត្តវាទេ"។ តើអ្នកនឹងធ្វើដូចម្តេច?'),
    options: [
      { id: "q6-a", text: bi("Ask what I can learn from it.", "សួរគេថាតើមានអ្វីដែលយើងអាចរៀនសូត្របានខ្លះពីចំណុចនោះ។"), characterId: "vitou" },
      { id: "q6-b", text: bi("Wonder if I chose wrong.", "ឆ្ងល់ និងសង្ស័យថាតើខ្លួនឯងបានជ្រើសរើសផ្លូវខុសតាំងពីដំបូងមែនទេ?"), characterId: "mc" },
      { id: "q6-c", text: bi("Try something completely different.", 'និយាយថា "អូខេ តាស!" រួចសាកល្បងធ្វើអ្វីផ្សេងដែលប្លែកស្រឡះពីហ្នឹង។'), characterId: "kimly" },
      { id: "q6-d", text: bi("Pretend I'm fine, then think about it for days.", "ធ្វើដូចជាមិនអី ប៉ុន្តែយកពាក្យនោះមកគិតរាប់ថ្ងៃ។"), characterId: "anita" },
      { id: "q6-e", text: bi("Ask what they would prefer.", "សួរគេថាតើចង់បានបែបណាវិញ។"), characterId: "tohla" },
    ],
  },
  {
    id: "q7", sectionId: "creativity", prompt: bi("You have to make something for tomorrow. What do you do?", "អ្នកត្រូវធ្វើស្នាដៃមួយដើម្បីដាក់បង្ហាញនៅថ្ងៃស្អែក។ តើអ្នកនឹងធ្វើដូចម្តេច?"),
    options: [
      { id: "q7-a", text: bi("Make something and see where it goes.", "ចាប់ផ្តើមធ្វើភ្លាមៗ រួចចាំមើលថាវានឹងចេញជារូបរាងបែបណា។"), characterId: "kimly" },
      { id: "q7-b", text: bi("Research until I know what I'm doing.", "ស្រាវជ្រាវរហូតដល់ដឹងច្បាស់ថាត្រូវធ្វើអ្វីឱ្យប្រាកដ។"), characterId: "mc" },
      { id: "q7-c", text: bi("Refine it until it feels right.", 'អង្គុយកែច្នៃ និងសម្រិតសម្រាំងវារហូតទាល់តែមានអារម្មណ៍ថា "ត្រូវខ្លាំង"។'), characterId: "anita" },
      { id: "q7-d", text: bi("Explore unusual ideas first.", "ស្វែងរកគំនិតប្លែកៗមិនធ្លាប់មានជាមុនសិន។"), characterId: "vitou" },
      { id: "q7-e", text: bi("Figure out what everyone needs.", "ស្វែងយល់ថា តើអ្នករាល់គ្នាត្រូវការអ្វី។"), characterId: "tohla" },
    ],
  },
  {
    id: "q8", sectionId: "creativity", prompt: bi("Someone gives you a blank notebook. What happens?", "មានគេជូនសៀវភៅសរសេរសទទេស្អាតមួយក្បាលដល់អ្នក។ តើវានឹងទៅជាយ៉ាងណា?"),
    options: [
      { id: "q8-a", text: bi("I fill it with thoughts and stories.", "វានឹងក្លាយជាកន្លែងសម្រាប់សរសេររឿងរ៉ាវ គំនិត និងអារម្មណ៍ស្មោះត្រង់។"), characterId: "anita" },
      { id: "q8-b", text: bi("I don't touch it until I know what to use it for.", "ខ្ញុំទុកវាមួយឡែកសិន រហូតទាល់តែដឹងច្បាស់ថាគួរប្រើវាធ្វើអ្វី។"), characterId: "mc" },
      { id: "q8-c", text: bi("I fill it with random things I've noticed.", "ខ្ញុំកត់ត្រារឿងរ៉ាវប្លែកៗដែលខ្ញុំបានសង្កេតឃើញ។"), characterId: "vitou" },
      { id: "q8-d", text: bi("I use it to organize my life.", "ខ្ញុំប្រើវាសម្រាប់រៀបចំផែនការ និងកាលវិភាគជីវិត។"), characterId: "tohla" },
      { id: "q8-e", text: bi("I decorate it immediately.", "ខ្ញុំដេគ័រ គូររូប និងតុបតែងវាភ្លាមៗ!"), characterId: "kimly" },
    ],
  },
  {
    id: "q9", sectionId: "uncertainty", prompt: bi("You have a completely free day. What do you do?", "អ្នកមានពេលទំនេរមួយថ្ងៃពេញ ដោយគ្មានផែនការទុកមុន។ តើអ្នកធ្វើអ្វី?"),
    options: [
      { id: "q9-a", text: bi("Work on something I've been thinking about.", "ធ្វើការលើគម្រោង/ប្រធានបទដែលខ្ញុំបានគិតទុកជាយូរមកហើយ។"), characterId: "anita" },
      { id: "q9-b", text: bi("Go somewhere I've never been.", "ទៅកន្លែងដែលមិនធ្លាប់ទៅ ហើយមើលថាតើមានអ្វីប្លែកខ្លះ។"), characterId: "vitou" },
      { id: "q9-c", text: bi("See who wants to hang out.", "មើលថាតើមាននរណាម្នាក់ទំនេរចង់ដើរលេងជាមួយគ្នាតែប៉ុណ្ណោះ។"), characterId: "tohla" },
      { id: "q9-d", text: bi("Start a random project.", "ចាប់ផ្តើមធ្វើគម្រោងចៃដន្យណាមួយភ្លាមៗ។"), characterId: "kimly" },
      { id: "q9-e", text: bi("Look up ways to spend the day productively.", "ស្រាវជ្រាវរកវិធីចំណាយពេលថ្ងៃនេះឱ្យមានប្រយោជន៍បំផុត។"), characterId: "mc" },
    ],
  },
  {
    id: "q10", sectionId: "uncertainty", prompt: bi("How do you make important decisions?", "តើអ្នកធ្វើការសម្រេចចិត្តលើរឿងសំខាន់ៗដោយរបៀបណា?"),
    options: [
      { id: "q10-a", text: bi("Think about how it affects everyone.", "គិតអំពីផលប៉ះពាល់នៃការសម្រេចចិត្តនោះ ទៅលើមនុស្សជុំវិញខ្លួន។"), characterId: "tohla" },
      { id: "q10-b", text: bi("Gather information and compare.", "ប្រមូលព័ត៌មានឱ្យបានច្រើន រួចប្រៀបធៀបជម្រើសទាំងអស់។"), characterId: "mc" },
      { id: "q10-c", text: bi("Go with my gut.", "ធ្វើតាមអារម្មណ៍ឆេវឆាវភ្លាមៗ (Gut feeling)។"), characterId: "kimly" },
      { id: "q10-d", text: bi("Choose the experience I'd regret missing.", "ជ្រើសរើសជម្រើសណាដែលផ្តល់បទពិសោធន៍ថ្មី ក្រែងលោស្តាយក្រោយបើមិនបានធ្វើ។"), characterId: "vitou" },
      { id: "q10-e", text: bi("Think about what feels right to me.", 'គិតអំពីអ្វីដែលអារម្មណ៍ប្រាប់ថា "ត្រូវ" សម្រាប់ខ្លួនឯង។'), characterId: "anita" },
    ],
  },
  {
    id: "q11", sectionId: "uncertainty", prompt: bi("You get a long-term project. What do you do?", "អ្នកទទួលបានគម្រោងរយៈពេលវែងមួយ។ តើអ្នកចាប់ផ្តើមដោយរបៀបណា?"),
    options: [
      { id: "q11-a", text: bi("Start researching immediately.", "ចាប់ផ្តើមស្រាវជ្រាវភ្លាមៗ។"), characterId: "mc" },
      { id: "q11-b", text: bi("Figure out what everyone needs first.", "ស្វែងយល់ថា តើអ្នកដទៃរំពឹងទុកអ្វីខ្លះពីការងាររបស់យើងជាមុនសិន។"), characterId: "tohla" },
      { id: "q11-c", text: bi("Start early so I can keep revising.", "ចាប់ផ្តើមធ្វើពីលឿន ព្រោះដឹងខ្លួនឯងថានឹងត្រូវអង្គុយកែសម្រួលវាមិនឈប់។"), characterId: "anita" },
      { id: "q11-d", text: bi("Start when inspiration hits.", "ចាប់ផ្តើមធ្វើនៅពេលមានចំណង់/ការបំផុសគំនិត (Inspiration)។"), characterId: "kimly" },
      { id: "q11-e", text: bi("Start early and explore different ideas.", "ចាប់ផ្តើមធ្វើពីលឿន ដើម្បីមានពេលសាកល្បងគំនិតប្លែកៗច្រើន។"), characterId: "vitou" },
    ],
  },
  {
    id: "q12", sectionId: "uncertainty", prompt: bi("How do you deal with stress?", "តើអ្នកធ្វើអ្វីខ្លះដើម្បីគ្រប់គ្រង ឬកាត់បន្ថយភាពតានតឹង (Stress)?"),
    options: [
      { id: "q12-a", text: bi("Make something or find a new activity.", "ធ្វើវត្ថុអនុស្សាវរីយ៍ ឬរកសកម្មភាពថ្មីធ្វើ។"), characterId: "kimly" },
      { id: "q12-b", text: bi("Search for advice and solutions.", "ស្វែងរកការណែនាំ និងដំណោះស្រាយលើអ៊ីនធឺណិត។"), characterId: "mc" },
      { id: "q12-c", text: bi("Write until I understand how I feel.", "សរសេរ! រហូតទាល់តែយល់ច្បាស់ពីអារម្មណ៍ខ្លួនឯង។"), characterId: "anita" },
      { id: "q12-d", text: bi("Go somewhere or find something new.", "ចេញទៅក្រៅ ឬរកប្រធានបទថ្មីមកផ្តោតអារម្មណ៍។"), characterId: "vitou" },
      { id: "q12-e", text: bi("Keep busy helping other people.", "ធ្វើខ្លួនឱ្យរវល់ដោយការជួយធ្វើការងារអ្នកដទៃ។"), characterId: "tohla" },
    ],
  },
  {
    id: "q13", sectionId: "social", prompt: bi("At a social gathering, what do you do?", "នៅពេលទៅកម្មវិធីជួបជុំ តើអ្នកធ្វើដូចម្តេច?"),
    options: [
      { id: "q13-a", text: bi("Talk to almost anyone.", "ចូលទៅនិយាយលេងជាមួយមនុស្សស្ទើរតែគ្រប់គ្នា។"), characterId: "tohla" },
      { id: "q13-b", text: bi("Stick with people I know.", "នៅជាមួយតែមនុស្សដែលស្គាល់គ្នាប៉ុណ្ណោះ។"), characterId: "mc" },
      { id: "q13-c", text: bi("Find someone interesting and ask questions.", "រកមើលមនុស្សណាដែលមើលទៅគួរឱ្យចាប់អារម្មណ៍ រួចចូលទៅសួរនាំ។"), characterId: "vitou" },
      { id: "q13-d", text: bi("Talk to whoever catches my attention.", "និយាយជាមួយនរណាក៏បានដែលទាក់ទាញអារម្មណ៍មុនគេ។"), characterId: "kimly" },
      { id: "q13-e", text: bi("Stay quiet unless someone approaches me.", "អង្គុយស្ងៀមៗ លើកលែងតែមានគេចូលមកនិយាយជាមួយមុន។"), characterId: "anita" },
    ],
  },
  {
    id: "q14", sectionId: "social", prompt: bi("Do you think people generally have good intentions?", "តើអ្នកជឿទេថា មនុស្សភាគច្រើនមានចេតនាល្អ?"),
    options: [
      { id: "q14-a", text: bi("Usually. People are weird, but not bad.", "ភាគច្រើនជឿ! មនុស្សយើងមានភាពប្លែកៗគ្នាច្រើន ប៉ុន្តែមិនមែនអាក្រក់ទេ។"), characterId: "kimly" },
      { id: "q14-b", text: bi("Yes. I tend to give people the benefit of the doubt.", "ជឿ! ខ្ញុំច្រើនតែយល់យោគឱ្យគេជាមុនសិន។"), characterId: "anita" },
      { id: "q14-c", text: bi("I want to believe so, but I need reassurance.", "ខ្ញុំចង់ជឿបែបហ្នឹងដែរ ប៉ុន្តែខ្ញុំត្រូវការពេលវេលាដើម្បីមើលឱ្យច្បាស់ជាមុនសិន។"), characterId: "mc" },
      { id: "q14-d", text: bi("Usually. I like giving people a chance.", "ភាគច្រើនជឿ! ខ្ញុំចូលចិត្តផ្តល់ឱកាសឱ្យមនុស្សជុំវិញខ្លួន។"), characterId: "tohla" },
      { id: "q14-e", text: bi("Usually, but I want to know why they act that way.", "ភាគច្រើនជឿ ប៉ុន្តែខ្ញុំនៅតែចង់យល់ពីមូលហេតុដែលពួកគេធ្វើបែបហ្នឹង។"), characterId: "vitou" },
    ],
  },
  {
    id: "q15", sectionId: "belonging", prompt: bi("You walk into Pteah Silapak for the first time. What do you do?", "អ្នកដើរចូល «ផ្ទះសិល្បៈ» ជាលើកដំបូង។ តើអ្នកនឹងធ្វើអ្វីមុនគេ?"),
    options: [
      { id: "q15-a", text: bi("Find somewhere quiet and take it all in.", "រកកន្លែងស្ងាត់មួយ ហើយអង្គុយសង្កេតមើលបរិយាកាសជុំវិញ។"), characterId: "anita" },
      { id: "q15-b", text: bi("Look around and wonder where I fit.", "មើលជុំវិញ ហើយឆ្ងល់ថា តើខ្ញុំគួរតែនៅត្រង់ណាទើបសមរម្យ។"), characterId: "mc" },
      { id: "q15-c", text: bi("Explore every room.", "ដើររុករកគ្រប់បន្ទប់។"), characterId: "vitou" },
      { id: "q15-d", text: bi("Ask who lives here and how everything works.", "សួរនាំថាមានអ្នកណាខ្លះរស់នៅទីនេះ និងសិក្សាពីរបៀបរស់នៅទីនេះ។"), characterId: "tohla" },
      { id: "q15-e", text: bi("Start imagining what I could change.", "ចាប់ផ្តើមស្រមៃមើលថាតើខ្ញុំអាចផ្លាស់ប្តូរ ឬតុបតែងអ្វីខ្លះនៅទីនេះ។"), characterId: "kimly" },
    ],
  },
];

export const characters = {
  anita: {
    id: "anita", name: bi("Anita", "អានីតា (Anita)"), archetype: bi("The One Who Carries Too Much", "មនុស្សដែលរ៉ាប់រងបន្ទុកច្រើនពេក"), color: "#feb2bf", mark: "~", image: "/assets/PS%20ASSEST%20UI-21.png",
    summary: bi("You're dependable and caring, but sometimes expect too much from yourself. You don't have to get everything right.", "អ្នកជាមនុស្សដែលអាចពឹងពាក់បាន និងចេះយកចិត្តទុកដាក់ ប៉ុន្តែពេលខ្លះអ្នកដាក់ការរំពឹងទុកលើខ្លួនឯងខ្ពស់ពេក។ អ្នកមិនចាំបាច់ធ្វើអ្វីៗគ្រប់យ៉ាងឱ្យត្រូវឥតខ្ចោះរហូតនោះទេ។"),
    description: bi("You're the person people trust. You remember things. You notice when someone isn't okay. You try to do things properly, and when something matters to you, you give it everything you have. You may look calm and capable from the outside. Inside, you're often asking yourself whether you're doing enough.", "អ្នកជាមនុស្សដែលអ្នកដទៃទុកចិត្ត។ អ្នកចងចាំរឿងរ៉ាវបានល្អ អ្នកកត់សម្គាល់ឃើញភ្លាមនៅពេលនរណាម្នាក់មានទុក្ខ។ អ្នកព្យាយាមធ្វើការងារឱ្យបានត្រឹមត្រូវ ហើយនៅពេលរឿងអ្វីមួយសំខាន់ចំពោះអ្នក អ្នកនឹងលះបង់អស់ពីចិត្ត។ មើលពីខាងក្រៅ អ្នកប្រហែលជាមើលទៅស្ងប់ស្ងាត់ និងពូកែ ប៉ុន្តែខាងក្នុងចិត្ត អ្នកតែងតែសួរខ្លួនឯងថា តើអ្នកបានធ្វើគ្រប់គ្រាន់ហើយឬនៅ។"),
    creativeInstinct: { keyword: bi("EXPRESS", "ការបញ្ចេញទស្សនៈ"), description: bi("You create by turning feelings, thoughts, and experiences into something you can finally see outside yourself. Your creativity gives you somewhere to be imperfect.", "អ្នកបង្កើតអ្វីមួយដោយប្រែប្រួលអារម្មណ៍ គំនិត និងបទពិសោធន៍ឱ្យទៅជារូបរាងដែលអ្នកអាចមើលឃើញ។ ការច្នៃប្រឌិតផ្តល់កន្លែងឱ្យអ្នកធ្វើជាមនុស្សដែលមិនល្អឥតខ្ចោះ។") },
    littleContradiction: bi("You give other people permission to be human. You rarely give yourself the same permission.", "អ្នកអនុញ្ញាតឱ្យអ្នកដទៃធ្វើខុសបែបជាមនុស្សធម្មតា ប៉ុន្តែអ្នកកម្រនឹងអនុញ្ញាតឱ្យខ្លួនឯងធ្វើបែបនោះណាស់។"),
    keyToCreativity: { keyword: bi("RELEASE", "ការរំដោះអារម្មណ៍"), description: bi("Make something you're not trying to make perfect.", "បង្កើតអ្វីមួយដោយមិនបាច់ព្យាយាមធ្វើឱ្យវាល្អឥតខ្ចោះនោះទេ។") },
    strength: bi("You care deeply", "អ្នកមានចិត្តស្រឡាញ់ និងយកចិត្តទុកដាក់ស្មោះប្រាថ្នា"),
    challenge: bi("Give yourself the same kindness you give others.", "ផ្តល់ក្តីស្រឡាញ់ និងចិត្តសប្បុរសដល់ខ្លួនឯង ឱ្យបានស្មើនឹងអ្វីដែលអ្នកផ្តល់ឱ្យអ្នកដទៃ"),
    hiddenFear: bi("What if I'm never enough?", "«ចុះបើខ្ញុំមិនដែលល្អគ្រប់គ្រាន់?»"),
  },
  kimly: {
    id: "kimly", name: bi("Kimly", "គឹមលី (Kimly)"), archetype: bi("The One Who Makes Life Feel Lighter", "មនុស្សដែលធ្វើឱ្យជីវិតមានអារម្មណ៍ស្រស់ស្រាយ"), color: "#b5d627", mark: "✦", image: "/assets/PS%20ASSEST%20UI-23.png",
    summary: bi("You're energetic and expressive, always finding something new to make or get excited about. You don't have to keep creating to be creative.", "អ្នកជាមនុស្សមានថាមពល និងបង្ហាញអារម្មណ៍ច្បាស់ៗ តែងតែស្វែងរកអ្វីថ្មីៗដើម្បីធ្វើ ឬបង្កើតការរំភើប។ អ្នកមិនចាំបាច់ប្រឹងបង្កើតអ្វីៗរហូត ដើម្បីបញ្ជាក់ថាខ្លួនឯងជាមនុស្សមានគំនិតច្នៃប្រឌិតនោះទេ។"),
    description: bi("You get excited easily. A random idea can become a new project. A boring afternoon can become an adventure. Something ordinary can suddenly become worth making. You don't always need a plan. You just want to try it and see what happens.", "អ្នកជារំភើបចិត្តបានយ៉ាងងាយ។ គំនិតចៃដន្យមួយអាចក្លាយជាគម្រោងថ្មី។ ថ្ងៃរសៀលដ៏ធុញទ្រាន់មួយអាចក្លាយជាការផ្សងព្រេង។ រឿងសាមញ្ញៗអាចប្រែជាមានតម្លៃគួរឱ្យបង្កើតឡើង។ អ្នកមិនចាំបាច់មានផែនការជានិច្ចនោះទេ អ្នកគ្រាន់តែចង់សាកល្បងមើលថាមានអ្វីកើតឡើង។"),
    creativeInstinct: { keyword: bi("PLAY", "ការលេងសើច"), description: bi("You create through experimentation, mistakes, accidents, and having fun. Your creativity grows when you stop worrying about whether something is good and let yourself make it simply because you want to.", "អ្នកបង្កើតអ្វីមួយតាមរយៈការសាកល្បង កំហុសឆ្គង ការចៃដន្យ និងភាពសប្បាយរីករាយ។ ការច្នៃប្រឌិតរបស់អ្នករីកចម្រើននៅពេលអ្នកឈប់បារម្ភថា តើវាល្អឬអត់ ហើយបណ្តោយឱ្យខ្លួនឯងធ្វើវាដោយគ្រាន់តែចង់ធ្វើ។") },
    littleContradiction: bi("You make life feel lighter for everyone else. Sometimes because you don't want anyone to notice what's weighing on you.", "អ្នកធ្វើឱ្យជីវិតអ្នកដទៃស្រស់ស្រាយ ប៉ុន្តែជួនកាលដោយសារតែអ្នកមិនចង់ឱ្យនរណាម្នាក់កត់សម្គាល់ឃើញអ្វីដែលកំពុងទាញទម្លាក់ចិត្តរបស់អ្នក។"),
    keyToCreativity: { keyword: bi("PLAY", "ការលេងសើច"), description: bi("Make something with no purpose other than having fun.", "បង្កើតអ្វីមួយដោយគ្មានគោលបំណងអ្វី ក្រៅតែពីភាពសប្បាយរីករាយ។") },
    strength: bi("You make possibility feel fun.", "អ្នកធ្វើឱ្យអ្វីៗដែលសមស្រប ក្លាយជារឿងសប្បាយរីករាយ"),
    challenge: bi("You're more than what you make.", "តម្លៃរបស់អ្នក គឺធំធេងជាងអ្វីដែលអ្នកបានបង្កើតឡើង"),
    hiddenFear: bi("If I stop creating...who am I without it?", "«បើខ្ញុំឈប់បង្កើតអ្វីថ្មីៗ... តើខ្ញុំជាអ្នកណាឱ្យប្រាកដ?»"),
  },
  tohla: {
    id: "tohla", name: bi("Tohla", "តុលា (Tohla)"), archetype: bi("The One Everyone Depends On", "មនុស្សដែលគ្រប់គ្នាតែងតែពឹងផ្អែក"), color: "#c8320d", mark: "+", image: "/assets/PS%20ASSEST%20UI-22.png",
    summary: bi("You're energetic and expressive, always finding something new to make or get excited about. You don't have to keep creating to be creative.", "អ្នកជាមនុស្សមានប្រជាប្រិយ និងកក់ក្តៅ តែងតែស្វែងរកអ្វីថ្មីៗមកធ្វើ ឬនាំភាពរីករាយដល់ជុំវិញខ្លួន។ អ្នកមិនចាំបាច់ទាល់តែធ្វើខ្លួនឱ្យមានប្រយោជន៍ រហូតដល់ភ្លេចមើលថែខ្លួនឯងនោះទេ។"),
    description: bi("You're usually the first person to help. You know who to call, what needs fixing, and whether everyone has eaten. You make people feel welcome without thinking much about it. Being useful comes naturally to you.", "អ្នកតែងតែជាមនុស្សដំបូងគេដែលចូលទៅជួយ។ អ្នកដឹងថាត្រូវទាក់ទងអ្នកណា ដឹងថាត្រូវកែសម្រួលអ្វី និងដឹងថាគ្រប់គ្នាបានញ៉ាំបាយហើយឬនៅ។ អ្នកធ្វើឱ្យមនុស្សជុំវិញខ្លួនមានអារម្មណ៍កក់ក្តៅដោយមិនបាច់គិតច្រើន។ ការធ្វើខ្លួនឱ្យមានប្រយោជន៍ជារឿងធម្មជាតិរបស់អ្នក។"),
    creativeInstinct: { keyword: bi("CONNECT", "ការភ្ជាប់ទំនាក់ទំនង"), description: bi("You create by bringing people together. You notice what people need, make space for them, and turn ordinary moments into something shared. Your creativity grows through community.", "អ្នកបង្កើតអ្វីមួយដោយការទាក់ទាញមនុស្សឱ្យមកជុំគ្នា។ អ្នកកត់សម្គាល់ឃើញអ្វីដែលគេត្រូវការ បង្កើតបរិយាកាសឱ្យគេ និងប្រែប្រួលខណៈពេលធម្មតាឱ្យទៅជាការចងចាំរួមគ្នា។ ការច្នៃប្រឌិតរបស់អ្នករីកចម្រើនតាមរយៈសហគមន៍។") },
    littleContradiction: bi("You make sure everyone has somewhere to belong. But sometimes you forget to ask where you belong.", "អ្នកប្រាកដប្រជាថាគ្រប់គ្នាមានកន្លែងរាប់អាន ប៉ុន្តែជួនកាលអ្នកភ្លេចសួរខ្លួនឯងថា តើកន្លែងរបស់អ្នកនៅឯណា។"),
    keyToCreativity: { keyword: bi("CONNECTION", "ការរាប់អាន"), description: bi("Make something that someone else can experience with you.", "បង្កើតអ្វីមួយដែលអ្នកដទៃអាចស្វែងយល់ ឬទទួលយកបទពិសោធន៍នោះជាមួយអ្នកបាន។") },
    strength: bi("You bring people together.", "អ្នកជាចរន្តបណ្តុំមនុស្សឱ្យមកនៅជិតគ្នា"),
    challenge: bi("Let others take care of you sometimes.", "បើកចិត្តឱ្យអ្នកដទៃបានមើលថែទាំអ្នកខ្លះផង"),
    hiddenFear: bi("What if nobody needs me?", "«ចុះបើគ្មាននរណាម្នាក់ត្រូវការខ្ញុំទៀត?»"),
  },
  vitou: {
    id: "vitou", name: bi("Vitou", "វិទូ (Vitou)"), archetype: bi("The One Who Never Stops Exploring", "មនុស្សដែលមិនដែលឈប់រុករក"), color: "#66883e", mark: "?", image: "/assets/Mascot%20Update%20MC.Vitou-09.png",
    summary: bi("You're endlessly curious and love discovering new things, but sometimes wonder if you need novelty to feel interesting.", "អ្នកមានភាពចង់ដឹងចង់ឃើញឥតឈប់ឈរ និងស្រឡាញ់ការស្វែងរកអ្វីថ្មីៗ ប៉ុន្តែពេលខ្លះតែងសួរខ្លួនឯងថា តើអ្នកពិតជាត្រូវការអ្វីថ្មីជានិច្ច ដើម្បីឱ្យខ្លួនឯងមើលទៅគួរឱ្យចាប់អារម្មណ៍មែនទេ?"),
    description: bi("You're curious about almost everything. A random thought can turn into a three-hour rabbit hole, and a quiet afternoon can turn into an adventure. You love discovering new things, but sometimes you wonder if you always need something new to feel interesting. You don't. People may see you as confident and interesting. Sometimes you're still trying to prove that to yourself.", "អ្នកចង់ដឹងចង់ឃើញស្ទើរតែគ្រប់រឿង។ គំនិតចៃដន្យមួយអាចនាំអ្នកឱ្យចំណាយពេលស្រាវជ្រាវរាប់ម៉ោង ហើយថ្ងៃសម្រាកដ៏ស្ងប់ស្ងាត់មួយអាចប្រែជាការផ្សងព្រេង។ អ្នកចូលចិត្តស្វែងរកអ្វីដែលថ្មី ប៉ុន្តែជួនកាលអ្នកឆ្ងល់ថា តើអ្នកពិតជាត្រូវការអ្វីថ្មីជានិច្ចដើម្បីឱ្យខ្លួនឯងមើលទៅគួរឱ្យចាប់អារម្មណ៍ឬយ៉ាងណា។ ពិតជាមិនបាច់នោះទេ។ មនុស្សភាគច្រើនមើលឃើញអ្នកជាមនុស្សមានទំនុកចិត្ត និងគួរឱ្យចាប់អារម្មណ៍ ប៉ុន្តែជួនកាលអ្នកនៅតែព្យាយាមបញ្ជាក់រឿងនោះចំពោះខ្លួនឯង។"),
    creativeInstinct: { keyword: bi("EXPLORE", "ការរុករក"), description: bi("You create by wandering, questioning, collecting, experimenting, and finding connections other people might miss. Your creativity grows when you let yourself explore without needing every experience to prove something about you.", "អ្នកបង្កើតអ្វីមួយដោយការដើរលេង ចោទសួរ ប្រមូលផ្តុំ សាកល្បង និងស្វែងរកចំណុចផ្សារភ្ជាប់ដែលអ្នកដទៃអាចមើលរំលង។ ការច្នៃប្រឌិតរបស់អ្នករីកចម្រើន នៅពេលអ្នកបណ្តោយឱ្យខ្លួនឯងរុករក ដោយមិនចាំបាច់ឱ្យគ្រប់បទពិសោធន៍មកបញ្ជាក់អ្វីមួយពីអ្នកនោះទេ។") },
    littleContradiction: bi("You're always looking for something new. Sometimes because you're curious. Sometimes because you're afraid of being ordinary.", "អ្នកតែងតែស្វែងរកអ្វីដែលថ្មីជានិច្ច។ ជួនកាលដោយសារអ្នកចង់ដឹង ហើយជួនកាលទៀតដោយសារអ្នកខ្លាចខ្លួនឯងក្លាយជាមនុស្សសាមញ្ញធម្មតា។"),
    keyToCreativity: { keyword: bi("CURIOSITY", "ភាពចង់ដឹងចង់ឃើញ"), description: bi("Follow one random idea without knowing where it will lead.", "ធ្វើតាមគំនិតចៃដន្យមួយដោយមិនចាំបាច់ដឹងថា វានឹងនាំអ្នកទៅដល់ណានោះទេ។") },
    strength: bi("You see possibilities everywhere.", "អ្នកមើលឃើញលទ្ធភាព និងឱកាសថ្មីៗនៅគ្រប់ទីកន្លែង"),
    challenge: bi("You don't have to prove you're interesting.", "អ្នកមិនចាំបាច់ប្រឹងប្រែងដើម្បីបញ្ជាក់ថាខ្លួនឯងគួរឱ្យចាប់អារម្មណ៍នោះទេ"),
    hiddenFear: bi("What if I'm just ordinary?", "«ចុះបើខ្ញុំគ្រាន់តែជាមនុស្សធម្មតាម្នាក់?»"),
  },
  mc: {
    id: "mc", name: bi("MC", "MC"), archetype: bi("The One Looking for the Right Answer", "មនុស្សដែលតែងតែស្វែងរកចម្លើយដែលត្រឹមត្រូវ"), color: "#1a4c19", mark: "…", image: "/assets/Mascot%20Update%20MC.Vitou-08.png",
    summary: bi("You're thoughtful, observant, and probably harder on yourself than you realize. You like knowing what you're supposed to do before you begin, but you're slowly learning that not every question has an answer waiting for you. Sometimes, you have to make your own.", "អ្នកជាមនុស្សគិតច្រើន ចេះសង្កេត ហើយប្រហែលជាតឹងរ៉ឹងចំពោះខ្លួនឯងលើសពីអ្វីដែលអ្នកដឹង។ អ្នកចូលចិត្តដឹងថាត្រូវធ្វើអ្វីខ្លះមុនពេលចាប់ផ្តើម ប៉ុន្តែអ្នកកំពុងតែរៀនយល់បន្តិចម្តងៗថា មិនមែនគ្រប់សំណួរទាំងអស់សុទ្ធតែមានចម្លើយរង់ចាំអ្នកនោះទេ។ ជួនកាល អ្នកត្រូវបង្កើតចម្លើយដោយខ្លួនឯង។"),
    description: bi("You like having a direction before you begin. You think things through, look for examples, and often ask what other people would do. You may seem responsible and easygoing, but inside, you're constantly wondering whether you're doing the right thing. You don't lack ideas. You just don't always trust that your ideas are good enough to choose.", "អ្នកចូលចិត្តមានគោលដៅច្បាស់លាស់មុនពេលចាប់ផ្តើម។ អ្នកគិតយ៉ាងល្អិតល្អន់ មើលគំរូអ្នកដទៃ ហើយញឹកញាប់តែងសួរថា តើអ្នកដទៃគេធ្វើបែបណា។ អ្នកមើលទៅជាមនុស្សមានការទទួលខុសត្រូវ និងសម្របតាមគេបាន ប៉ុន្តែនៅក្នុងចិត្ត អ្នកតែងតែឆ្ងល់ថា តើអ្នកកំពុងធ្វើរឿងដែលត្រឹមត្រូវដែរឬទេ។ អ្នកមិនខ្វះគំនិតទេ អ្នកគ្រាន់តែមិនសូវជឿជាក់ថា គំនិតរបស់អ្នកល្អគ្រប់គ្រាន់ក្នុងការជ្រើសរើសប៉ុណ្ណោះ។"),
    creativeInstinct: { keyword: bi("QUESTION", "ការចោទសួរ"), description: bi("You create by asking, observing, learning, and slowly finding your own way. Your creativity grows when you stop searching for the right answer and start allowing yourself to make one.", "អ្នកបង្កើតអ្វីមួយដោយការសួរ សង្កេត រៀនសូត្រ និងស្វែងរកផ្លូវផ្ទាល់ខ្លួនបន្តិចម្តងៗ។ ការច្នៃប្រឌិតរបស់អ្នករីកចម្រើន នៅពេលអ្នកឈប់ស្វែងរកចម្លើយដែលត្រឹមត្រូវ ហើយចាប់ផ្តើមអនុញ្ញាតឱ្យខ្លួនឯងបង្កើតវាឡើង។") },
    littleContradiction: bi("You want to be sure before you begin. But sometimes beginning is how you become sure.", "អ្នកចង់ច្បាស់លាស់មុនពេលចាប់ផ្តើម ប៉ុន្តែជួនកាល ការចាប់ផ្តើមហ្នឹងហើយ ដែលធ្វើឱ្យអ្នកកាន់តែច្បាស់លាស់។"),
    keyToCreativity: { keyword: bi("TRUST", "ទំនុកចិត្ត"), description: bi("Make something without looking up how it's supposed to be done.", "ចាប់ផ្តើមធ្វើអ្វីមួយដោយមិនបាច់មើលថា តើគេត្រូវធ្វើវាយ៉ាងដូចម្តេចនោះទេ។") },
    strength: bi("You notice the little things.", "អ្នកចាប់អារម្មណ៍ និងយកចិត្តទុកដាក់លើរឿងតូចតាចបានយ៉ាងល្អ"),
    challenge: bi("Trust yourself a little more.", "ចូលរៀនជឿជាក់លើខ្លួនឯងឱ្យបានច្រើនជាងមុនបន្តិច"),
    hiddenFear: bi("What if everyone else already knows what they're doing except me?", "«ចុះបើអ្នកផ្សេងទៀតដឹងពីអ្វីដែលគេត្រូវធ្វើអស់ហើយ លើកលែងតែខ្ញុំ?»"),
  },
};
