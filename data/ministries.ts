/**
 * Ministries data
 * Real content from pastorblessing.com where available
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
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80",
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
    name: "Friendship Care Centres",
    description:
      "Community care and outreach centers tied to our church branches, providing welfare support and community services to those in need.",
    longDescription:
      "Friendship Care Centres are community care and outreach centers tied to the branches of Hisdayspring Ministries International. They exist to extend the love of Christ beyond the church walls by providing welfare support, practical assistance, and community services to those in need. From food and relief support to counsel and community engagement, the centres serve as the hands and feet of the church in the neighborhood.",
    highlights: [
      "Welfare and relief support for families",
      "Community services and outreach programs",
      "Counsel and practical assistance",
      "Located across our church branches",
      "A channel to serve and bless the community",
    ],
    verse: {
      text: "Bear ye one another's burdens, and so fulfil the law of Christ.",
      reference: "Galatians 6:2",
    },
    stats: [
      { value: "Both", label: "Church branches served" },
      { value: "Welfare", label: "And community services" },
      { value: "Outreach", label: "Centres in the community" },
    ],
    icon: "HandHeart",
    imageUrl:
      "https://images.unsplash.com/photo-1469533311913-eea0efd8967f?w=1200&q=80",
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
    id: "upper-room",
    name: "Upper Room Prayer Link",
    description:
      "A dedicated prayer programme for deep spiritual connection and intercession for the needs of the church and community.",
    longDescription:
      "The Upper Room Prayer Link is a dedicated prayer programme of Hisdayspring Ministries International, focused on deep spiritual connection and intercession. It is a place where believers gather to pray for the needs of the church, the community, and the nations. Modeled after the early disciples who tarried in the upper room, this ministry builds a culture of fervent prayer, spiritual sensitivity, and divine encounter.",
    highlights: [
      "Fervent corporate prayer sessions",
      "Intercession for the church and community",
      "Deep spiritual connection and worship",
      "Prayer support for personal needs",
      "Building a lifestyle of prayer and intimacy with God",
    ],
    verse: {
      text: "These all continued with one accord in prayer and supplication.",
      reference: "Acts 1:14",
    },
    stats: [
      { value: "1-10th of every month", label: "Prayer and intercession" },
      { value: "Church & Community", label: "Needs covered in prayer" },
      { value: "Deep", label: "Spiritual connection" },
    ],
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
      "An evangelism and crusade programme focused on healing and deliverence, bringing the gospel to communities through the power of God.",
    longDescription:
      "The Healing From Heaven Crusade is the evangelism and crusade arm of Hisdayspring Ministries International. It takes the gospel beyond the four walls of the church into communities, with a focus on healing and deliverance through the power of God. Cities like Ikorodu have experienced the touch of God at these crusades — where the Word is preached with power, the sick are healed, the bound are set free, and lives are eternally transformed.",
    highlights: [
      "Community crusades and open-air meetings",
      "Healing and deliverance services",
      "Powerful gospel preaching and worship",
      "Evangelism outreaches across communities",
      "Prophetic encounters and life transformation",
    ],
    verse: {
      text: "And Jesus went about all the cities and villages, teaching... and healing every sickness and every disease among the people.",
      reference: "Matthew 9:35",
    },
    stats: [
      { value: "Healing", label: "And deliverance services" },
      { value: "Cities", label: "Reached with the gospel" },
      { value: "Powerful", label: "Word and worship" },
    ],
    icon: "Cross",
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
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
    name: "Church Welfare Programs",
    description:
      "Community welfare initiatives that provide practical support and assistance to members and the broader community.",
    longDescription:
      "The Church Welfare Programs of Hisdayspring Ministries International provide practical support and assistance to members and the broader community. Rooted in the command to care for the needy, these initiatives ensure that no member walks alone in seasons of need. From food and clothing support to financial assistance and visitation, the welfare arm of the church demonstrates the love of God in tangible, life-touching ways.",
    highlights: [
      "Food and clothing support for families",
      "Financial assistance for members in need",
      "Visitation and care for the sick and aged",
      "Community outreach and benevolence",
      "A practical expression of God's love",
    ],
    verse: {
      text: "Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.",
      reference: "Matthew 25:40",
    },
    stats: [
      { value: "Practical", label: "Support and assistance" },
      { value: "Families", label: "Cared for in need" },
      { value: "Love", label: "In action" },
    ],
    icon: "Gift",
    imageUrl:
      "https://images.unsplash.com/photo-1488521789025-1627b1858a5d?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1488521789025-1627b1858a5d?w=800&q=80",
      "https://images.unsplash.com/photo-1469533311913-eea0efd8967f?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=800&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
    ],
  },
];
