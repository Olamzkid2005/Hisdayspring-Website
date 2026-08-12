/**
 * Ministries data
 * Real content provided by the church
 */

import type { Ministry } from "@/types";

export const ministries: Ministry[] = [
  {
    id: "yofic",
    name: "YOFIC",
    description:
      "Youth of Faith in Christ - A youth ministry founded by Pastor Blessing Olamijulo that has raised several leaders for the kingdom and in other spheres of life.",
    longDescription:
      "Youth of Faith in Christ (YOFIC) is the vibrant youth ministry of Hisdayspring Ministries International, founded by Pastor Blessing Olamijulo with a passion to raise a generation of young people who walk in faith and excel in every sphere of life. Through dynamic worship, sound teaching of the Word, and intentional mentorship, YOFIC has raised several leaders — for the kingdom of God and for the marketplace. Young people are not just the church of tomorrow; at YOFIC, they are equipped to lead today.",
    highlights: [
      "Dynamic youth worship and word sessions",
      "Leadership development and mentorship",
      "Career, purpose, and destiny guidance",
      "Evangelism and community outreaches",
      "Annual youth retreats and conferences",
    ],
    verse: {
      text: "Let no one despise your youth, but be an example to the believers in word, in conduct, in love, in spirit, in faith, in purity.",
      reference: "1 Timothy 4:12",
    },
    stats: [
      { value: "Leaders", label: "Raised for the kingdom & marketplace" },
      { value: "Weekly", label: "Youth services and mentorship" },
      { value: "Founded by", label: "Pastor Blessing Olamijulo" },
    ],
    icon: "Users",
    imageUrl: "/images/ministries/yofic.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1529156065178-6eb3e864a1c3?w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    ],
  },
  {
    id: "discovery",
    name: "Discovery for Youth & Singles",
    description:
      "A special outreach to singles and young couples, focused on building strong and lasting relationships founded on the Word of God. Founded 18 years ago.",
    longDescription:
      "Discovery for Youth & Singles is a special outreach dedicated to singles and young couples, founded over 18 years ago. It exists to help young people build strong, lasting, and God-honoring relationships founded on the Word of God. Through practical teachings on dating, courtship, marriage, and personal development, Discovery has become a trusted community where many have found godly counsel, companionship, and life-transforming direction.",
    highlights: [
      "Biblical teaching on dating and courtship",
      "Guidance for young couples and families",
      "Practical sessions on relationships and purpose",
      "A supportive community of single and married young people",
      "Annual discovery conference for youth and singles",
    ],
    verse: {
      text: "Can two walk together, except they be agreed?",
      reference: "Amos 3:3",
    },
    stats: [
      { value: "18+", label: "Years of impact" },
      { value: "Singles & Couples", label: "Served and mentored" },
      { value: "Annual", label: "Discovery conference" },
    ],
    founded: "18+ years",
    icon: "Compass",
    imageUrl:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
      "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    ],
  },
  {
    id: "jewels",
    name: "The Jewels Women's Program",
    description:
      "Led by Pastor (Mrs) Adebamigbe Olamijulo, this monthly breakfast meeting impacts young ladies ages 18–45, helping women fulfill their destinies and maximize their potentials.",
    longDescription:
      "The Jewels Women's Program, also known as The Jewels & Winning Women Breakfast Meeting, is led by Pastor (Mrs) Adebamigbe Olamijulo. It is a monthly gathering that impacts young ladies aged 18–45 — both single and married — helping them fulfill their destinies and maximize their potentials. Every 4th Saturday of the month, women gather over breakfast for a powerful time of the Word, prayer, mentorship, and sisterhood, walking away strengthened and equipped to win in every area of life.",
    highlights: [
      "Monthly breakfast meetings — every 4th Saturday, 8:00 AM",
      "Destiny-focused teachings and practical mentoring",
      "Fellowship and sisterhood for single and married women",
      "Personal growth and potential maximization",
      "A safe community to grow in faith and purpose",
    ],
    verse: {
      text: "Charm is deceitful, and beauty is vain: but a woman that feareth the LORD, she shall be praised.",
      reference: "Proverbs 31:30",
    },
    stats: [
      { value: "4th Saturday", label: "Every month · 8:00 AM" },
      { value: "18–45", label: "Women impacted" },
      { value: "Monthly", label: "Breakfast meetings" },
    ],
    schedule: "Every 4th Saturday of the month · 8:00 AM",
    icon: "Heart",
    imageUrl: "/images/ministries/jewels.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
      "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=800&q=80",
    ],
  },
  {
    id: "boms",
    name: "Blessing Ola Mentoring School (BOMS)",
    description:
      "Established in 2015 with over 120 graduates across several church denominations. Trains leaders, pastors, music ministers, businessmen, and church workers through Christian education and personal growth.",
    longDescription:
      "The Blessing Ola Mentoring School (BOMS) was established in 2015 with a mandate to raise leaders for the kingdom of God. With over 120 graduates spanning several church denominations, BOMS trains pastors, music ministers, businessmen, church workers, and everyday believers through structured Christian education and personal growth. Students are mentored to lead with excellence, integrity, and kingdom influence in the church and in the marketplace.",
    highlights: [
      "Structured Christian education curriculum",
      "Personal mentorship from seasoned ministers",
      "Leadership training for church and marketplace",
      "A growing network of 120+ alumni across denominations",
      "Open intakes for new students each session",
    ],
    verse: {
      text: "And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also.",
      reference: "2 Timothy 2:2",
    },
    stats: [
      { value: "2015", label: "Year established" },
      { value: "120+", label: "Graduates raised" },
      { value: "Multi-church", label: "Impact across denominations" },
    ],
    founded: "2015",
    icon: "GraduationCap",
    imageUrl: "/images/ministries/boms.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    ],
  },
  {
    id: "friendship",
    name: "Friendship Care Program",
    description:
      "A family-based fellowship that brings the church closer to homes and communities through small groups — every Sunday at 5:00 PM.",
    longDescription:
      "The Friendship Care Program is a family-based fellowship designed to bring the church closer to homes and communities through small groups. It provides an opportunity for members to connect more deeply, build meaningful relationships, and grow together in the love of Christ. Through regular fellowship, prayer, Bible study, and mutual support, members are encouraged to strengthen one another spiritually while also caring for one another in every area of life. The program fosters unity, genuine love, accountability, and a strong sense of belonging within the church family. Join us every Sunday at 5:00 PM as we gather in various homes to experience Christian fellowship, spiritual growth, and lasting relationships.",
    highlights: [
      "Family-based fellowship in small groups",
      "Regular fellowship, prayer, and Bible study",
      "Mutual support and spiritual strengthening",
      "Unity, genuine love, and accountability",
      "A strong sense of belonging in the church family",
    ],
    stats: [
      { value: "5:00 PM", label: "Every Sunday" },
      { value: "Small Groups", label: "Gathering in various homes" },
      { value: "Unity", label: "And belonging in Christ" },
    ],
    schedule: "Every Sunday · 5:00 PM",
    icon: "HandHeart",
    imageUrl: "/images/ministries/friendship.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1469533311913-eea0efd8967f?w=800&q=80",
      "https://images.unsplash.com/photo-1488521789025-1627b1858a5d?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
    ],
  },
  {
    id: "bible-school",
    name: "Hisdayspring Bible School",
    description:
      "Raising spiritually mature believers through sound biblical teaching, practical Christian living, and leadership development.",
    longDescription:
      "The Hisdayspring Bible School is committed to raising spiritually mature believers through sound biblical teaching, practical Christian living, and leadership development. Our programs are carefully designed to equip every member for spiritual growth, effective service, and the fulfillment of God's purpose. At Hisdayspring Bible School, our mission is to disciple believers, develop leaders, and raise kingdom ambassadors who will reflect Christ in every sphere of life.",
    highlights: [
      "Sound biblical teaching for every believer",
      "Practical Christian living and spiritual growth",
      "Leadership development and effective service",
      "Structured programs from membership to ministry",
      "Kingdom ambassadors who reflect Christ",
    ],
    stats: [
      { value: "4", label: "Programs & classes" },
      { value: "3 Modules", label: "Membership class" },
      { value: "Raising", label: "Mature believers and leaders" },
    ],
    icon: "BookOpen",
    imageUrl:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
    ],
    programs: [
      {
        name: "Membership Class (3 Modules)",
        description:
          "The Membership Class is the foundation for every member of Hisdayspring Church. Through three comprehensive modules, participants gain a clear understanding of the vision, mission, beliefs, and culture of the church.",
        topics: [
          "The vision, mission, and core values of Hisdayspring Church",
          "Church culture and integration",
          "The importance of church membership and commitment",
          "Joining and serving in the workforce",
          "The responsibilities, ethics, and expectations of church workers",
          "The dos and don'ts of church membership and service",
        ],
      },
      {
        name: "Baptismal Class",
        description:
          "The Baptismal Class provides biblical teaching on water baptism and its significance in the life of every believer. Completion of this class is compulsory for everyone who desires to be baptized at Hisdayspring Church.",
        topics: [
          "The meaning of baptism",
          "Why every believer should be baptized",
          "The biblical foundation for water baptism",
          "The spiritual importance of identifying with Christ through baptism",
        ],
      },
      {
        name: "Blessing Ola Mentoring School (BOMS)",
        description:
          "The Blessing Ola Mentoring School (BOMS) is designed to equip believers with practical wisdom for victorious Christian living.",
        topics: [
          "Developing a Christ-centered lifestyle",
          "Spiritual growth and maturity",
          "Marriage and family life",
          "Career and workplace excellence",
          "Purpose discovery and personal development",
          "Character building and godly leadership",
          "Practical guidance for navigating everyday life as a believer",
        ],
      },
      {
        name: "Blessing Ola School of Ministry (BOSOM)",
        description:
          "The Blessing Ola School of Ministry (BOSOM) is an advanced leadership and ministry training program for church leaders, workers, ministers, and individuals who sense God's call upon their lives.",
        topics: [
          "Discovering and developing spiritual gifts",
          "Understanding and fulfilling God's calling",
          "Biblical leadership principles",
          "Ministry ethics and character development",
          "Effective church service",
          "Kingdom leadership and excellence",
          "Practical ministry training and leadership development",
        ],
      },
    ],
  },
  {
    id: "upper-room",
    name: "Upper Room PrayerLink",
    description:
      "The monthly online prayer gathering of Hisdayspring Church, uniting believers to commit each new month into God's hands.",
    longDescription:
      "Upper Room PrayerLink is the monthly online prayer gathering of Hisdayspring Church, created to unite believers in seeking God's face and committing each new month into His hands. The meeting holds from the 1st to the 10th of every month, bringing members together for a season of fervent prayer, worship, and prophetic declarations. Each month is centered around a specific theme, providing biblical direction and focused prayers for the season. Through the power of corporate prayer, Upper Room PrayerLink has become a platform where countless testimonies of healing, divine intervention, breakthroughs, restoration, answered prayers, and transformed lives have been recorded. Whether you are trusting God for spiritual growth, direction, healing, open doors, or a fresh encounter with Him, Upper Room PrayerLink provides an atmosphere where faith is strengthened and lives are changed through the power of prayer.",
    highlights: [
      "Fervent prayer, worship, and prophetic declarations",
      "A monthly theme with biblical direction",
      "Testimonies of healing, breakthrough, and restoration",
      "Prayer for spiritual growth, direction, and open doors",
      "Faith strengthened and lives changed through prayer",
    ],
    stats: [
      { value: "1st–10th", label: "of every month" },
      { value: "YouTube", label: "@pastorblessingo" },
      { value: "Monthly", label: "Online prayer gathering" },
    ],
    schedule: "1st–10th of every month · YouTube @pastorblessingo",
    icon: "Heart",
    imageUrl: "/images/ministries/upper-room.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    ],
  },
  {
    id: "crusade",
    name: "Healing From Heaven Crusade",
    description:
      "A divine mandate to take the Gospel beyond the four walls of the church, bringing saving, healing, and transforming power to communities.",
    longDescription:
      "The Healing From Heaven Crusade (HFHC) is a divine mandate entrusted to Hisdayspring Church to take the Gospel beyond the four walls of the church and into communities, bringing the saving, healing, and transforming power of Jesus Christ to the people. More than a crusade, HFHC is a mission of compassion and revival, reaching individuals and families with the message of hope, faith, and salvation. Through the preaching of God's Word, fervent prayers, and the demonstration of God's power, countless testimonies of salvation, healing, deliverance, restoration, and life-changing breakthroughs have been recorded. In addition to ministering spiritually, the crusade serves communities through practical acts of love. Medical outreaches, welfare support, and other community care initiatives are organized to meet physical needs while sharing the love of Christ in tangible ways. Healing From Heaven Crusade reflects the heart of Hisdayspring Church—to transform lives, strengthen communities, and make Jesus Christ known through both the proclamation of the Gospel and compassionate service.",
    highlights: [
      "To take the Gospel to communities and nations",
      "To lead people into a saving relationship with Jesus Christ",
      "To demonstrate God's healing and delivering power",
      "To restore hope through the ministry of the Holy Spirit",
      "To impact communities through medical, welfare, and humanitarian outreaches",
      "To raise disciples who will live for Christ and transform their world",
    ],
    verse: {
      text: "Freely you have received; freely give.",
      reference: "Matthew 10:8",
    },
    stats: [
      { value: "Gospel", label: "To communities and nations" },
      { value: "Healing", label: "And delivering power" },
      { value: "Care", label: "Medical & welfare outreaches" },
    ],
    icon: "Cross",
    imageUrl: "/images/ministries/crusade.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
    ],
  },
  {
    id: "welfare",
    name: "Hisdayspring Welfare Program",
    description:
      "Demonstrating the love of Christ through compassionate service — food, clothing, medical care, and relief for those in need.",
    longDescription:
      "The Hisdayspring Welfare Program is one of the core expressions of our commitment to demonstrating the love of Christ through compassionate service. We believe that the Gospel is not only to be preached but also to be lived out by caring for the practical needs of people within our church and the surrounding community. Through this outreach, we provide support to individuals and families by distributing food items and essential groceries, clothing, eyeglasses and vision support, medical care and health assistance, and other welfare and relief materials as needs arise. Our mission is to bring hope, restore dignity, and be a source of encouragement to those facing difficult circumstances, reflecting the compassion and generosity of Jesus Christ. Every act of kindness is an opportunity to share God's love and make a lasting impact in the lives of people and our community. We invite individuals, families, organizations, and partners who share our passion for community transformation to join hands with us. Whether through financial support, donations of relief materials, medical services, volunteering, or other resources, your partnership will enable us to expand this outreach and serve even more people with excellence and compassion. Together, we can make a greater difference—one life, one family, and one community at a time.",
    highlights: [
      "Food items and essential groceries",
      "Clothing, eyeglasses, and vision support",
      "Medical care and health assistance",
      "Welfare and relief materials as needs arise",
      "Bringing hope, dignity, and encouragement",
    ],
    verse: {
      text: "Whoever is kind to the poor lends to the Lord, and He will reward them for what they have done.",
      reference: "Proverbs 19:17",
    },
    stats: [
      { value: "Food", label: "And essential groceries" },
      { value: "Clothing", label: "And vision support" },
      { value: "Medical", label: "Care and health assistance" },
    ],
    icon: "Gift",
    imageUrl: "/images/ministries/welfare.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1488521789025-1627b1858a5d?w=800&q=80",
      "https://images.unsplash.com/photo-1469533311913-eea0efd8967f?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
    ],
  },
  {
    id: "blessing-conference",
    name: "The Blessing Conference",
    description:
      "The annual flagship conference of Hisdayspring Church, held every June to celebrate God's covenant of THE BLESSING.",
    longDescription:
      "The Blessing Conference is the annual flagship conference of Hisdayspring Church, held every June to celebrate, reaffirm, and deepen our understanding of God's covenant of THE BLESSING upon His people. As a church operating under the covenant of THE BLESSING, this conference is a time of spiritual renewal, divine impartation, and prophetic alignment. It is dedicated to emphasizing God's promises, empowering believers to walk in His covenant, and positioning them for greater impact in every area of life. Each year, respected fathers of faith, anointed ministers, and guest speakers join us to minister God's Word, make prophetic declarations, and release blessings over the congregation. Through powerful teachings, worship, and prayer, attendees are strengthened, equipped, and inspired to maximize the opportunities and assignments that lie ahead in the remainder of the year. The conference has become a season of transformation, where many experience fresh encounters with God, renewed faith, supernatural breakthroughs, healing, restoration, and divine direction. The Blessing Conference is more than an annual event—it is a divine appointment that empowers believers to live in the fullness of God's covenant and walk confidently in His purpose.",
    highlights: [
      "Powerful biblical teaching on the covenant of THE BLESSING",
      "Prophetic declarations and impartation",
      "Ministry from fathers of faith and anointed guest ministers",
      "Life-transforming worship and prayer",
      "Spiritual empowerment for the remaining months of the year",
      "Testimonies of God's faithfulness, favor, and supernatural intervention",
    ],
    verse: {
      text: "The blessing of the Lord makes one rich, and He adds no sorrow with it.",
      reference: "Proverbs 10:22",
    },
    stats: [
      { value: "June", label: "Every year" },
      { value: "Fathers of Faith", label: "And anointed guest ministers" },
      { value: "THE BLESSING", label: "Covenant celebrated" },
    ],
    schedule: "Held every June",
    icon: "Sparkles",
    imageUrl: "/images/ministries/blessing-conference.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
    ],
  },
  {
    id: "light-convention",
    name: "Light Convention",
    description:
      "The annual convention and anniversary celebration of Hisdayspring Church, held every December — a sacred season of renewal and fresh direction.",
    longDescription:
      "Light Convention is the annual convention and anniversary celebration of Hisdayspring Church, held every December. It is one of the most significant gatherings in the life of the church—a sacred time to celebrate God's faithfulness, reflect on His goodness throughout the year, and receive fresh direction for the future. During the convention, God reveals His heart concerning the coming year, including the prophetic theme and divine direction for the church. It is a season of spiritual renewal where the congregation is strengthened, encouraged, and positioned to walk confidently into God's plans and purposes. Light Convention is marked by an atmosphere of passionate worship, sound biblical teaching, fervent prayer, and prophetic declarations. It is a time when God's Word is reaffirmed, His promises are proclaimed, and believers are equipped for greater impact in the year ahead. As part of the convention, the church also celebrates the ordination and commissioning of new pastors and ministers, recognizing those whom God has called and prepared for leadership and service in His Kingdom. Light Convention is more than an annual gathering—it is a divine appointment that prepares God's people for the next season, strengthens faith, and renews our commitment to fulfilling His purpose.",
    highlights: [
      "Celebration of God's faithfulness and the church's anniversary",
      "Revelation of the prophetic theme and direction for the new year",
      "Powerful worship and praise",
      "Life-transforming biblical teachings",
      "Prophetic declarations and impartation",
      "Ordination and commissioning of pastors and ministers",
    ],
    stats: [
      { value: "December", label: "Every year" },
      { value: "Anniversary", label: "Celebration" },
      { value: "Ordination", label: "Of pastors & ministers" },
    ],
    schedule: "Held every December",
    icon: "Flame",
    imageUrl: "/images/ministries/light-convention.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    ],
  },
];
