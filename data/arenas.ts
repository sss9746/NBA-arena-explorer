export type Arena = {
  id: string;
  teamId: string;
  teamName: string;
  arenaName: string;
  city: string;
  state: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  opened: number;
  image: string;
  logo: string;
  ticketUrl: string;
  websiteUrl: string;
  parkingInfo: string;
  transitInfo: string;
  bagPolicy: string;
  notes: string;
};

export const arenas: Arena[] = [
  {
    id: "hawks",
    teamId: "hawks",
    teamName: "Atlanta Hawks",
    arenaName: "State Farm Arena",
    city: "Atlanta",
    state: "GA",
    country: "USA",
    address: "1 State Farm Drive, Atlanta, GA 30303",
    latitude: 33.7573,
    longitude: -84.3963,
    capacity: 16888,
    opened: 1999,
    image: "/arenas/hawks.jpg",
    logo: "/logos/hawks.png",
    ticketUrl: "https://www.nba.com/hawks/tickets",
    websiteUrl: "https://www.statefarmarena.com/",
    parkingInfo:
      "Official decks and nearby downtown lots are available; reserve in advance for weekend games.",
    transitInfo:
      "MARTA rail serves GWCC/CNN Center and Five Points, both within walking distance.",
    bagPolicy:
      'Small clutches are typically permitted after screening; larger bags should follow arena event guidelines.',
    notes:
      "Downtown location with strong pregame options around Centennial Olympic Park and surrounding venues.",
  },
  {
    id: "celtics",
    teamId: "celtics",
    teamName: "Boston Celtics",
    arenaName: "TD Garden",
    city: "Boston",
    state: "MA",
    country: "USA",
    address: "100 Legends Way, Boston, MA 02114",
    latitude: 42.3662,
    longitude: -71.0622,
    capacity: 19156,
    opened: 1995,
    image: "/arenas/celtics.jpg",
    logo: "/logos/celtics.png",
    ticketUrl: "https://www.nba.com/celtics/tickets",
    websiteUrl: "https://www.tdgarden.com/",
    parkingInfo:
      "North Station garages fill quickly; prepaid parking is recommended for premium games.",
    transitInfo:
      "Direct access via MBTA Green and Orange Lines at North Station plus commuter rail service.",
    bagPolicy:
      'Travel light and use small personal bags only; bag screening and restricted-size rules generally apply.',
    notes:
      "One of the league's highest-demand venues, with strong energy and quick access to downtown Boston.",
  },
  {
    id: "nets",
    teamId: "nets",
    teamName: "Brooklyn Nets",
    arenaName: "Barclays Center",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    address: "620 Atlantic Avenue, Brooklyn, NY 11217",
    latitude: 40.6826,
    longitude: -73.9754,
    capacity: 17732,
    opened: 2012,
    image: "/arenas/nets.jpg",
    logo: "/logos/nets.png",
    ticketUrl: "https://www.nba.com/nets/tickets",
    websiteUrl: "https://www.barclayscenter.com/",
    parkingInfo:
      "Limited on-site parking means garages and rideshare drop-offs are common on game nights.",
    transitInfo:
      "Extremely transit-friendly via Atlantic Terminal, Long Island Rail Road, and multiple subway lines.",
    bagPolicy:
      'Small bags are easiest for entry; most larger bags are discouraged or restricted depending on event policy.',
    notes:
      "Excellent transit access and dense neighborhood dining make this one of the easiest arena trips in the NBA.",
  },
  {
    id: "hornets",
    teamId: "hornets",
    teamName: "Charlotte Hornets",
    arenaName: "Spectrum Center",
    city: "Charlotte",
    state: "NC",
    country: "USA",
    address: "333 East Trade Street, Charlotte, NC 28202",
    latitude: 35.2251,
    longitude: -80.8392,
    capacity: 19077,
    opened: 2005,
    image: "/arenas/hornets.jpg",
    logo: "/logos/hornets.png",
    ticketUrl: "https://www.nba.com/hornets/tickets",
    websiteUrl: "https://www.spectrumcentercharlotte.com/",
    parkingInfo:
      "Connected uptown decks and nearby garages offer easy access, especially with prepaid reservations.",
    transitInfo:
      "Charlotte light rail and center-city bus routes make uptown access straightforward on event nights.",
    bagPolicy:
      'Bring compact personal items only; arena screening and size restrictions are generally enforced at entry.',
    notes:
      "Uptown setting makes it easy to pair a game with hotels, bars, and walkable postgame options.",
  },
  {
    id: "bulls",
    teamId: "bulls",
    teamName: "Chicago Bulls",
    arenaName: "United Center",
    city: "Chicago",
    state: "IL",
    country: "USA",
    address: "1901 West Madison Street, Chicago, IL 60612",
    latitude: 41.8807,
    longitude: -87.6742,
    capacity: 20917,
    opened: 1994,
    image: "/arenas/bulls.jpg",
    logo: "/logos/bulls.png",
    ticketUrl: "https://www.nba.com/bulls/tickets",
    websiteUrl: "https://www.unitedcenter.com/",
    parkingInfo:
      "Large official lots surround the arena; traffic can be heavy immediately before tip-off.",
    transitInfo:
      "CTA buses and nearby Green and Pink Line stations connect the arena to downtown Chicago.",
    bagPolicy:
      'Small bags and clutches are the safest option; larger items are usually restricted or screened closely.',
    notes:
      "Huge seating bowl, iconic Bulls branding, and strong pregame buzz make this a flagship league stop.",
  },
  {
    id: "cavaliers",
    teamId: "cavaliers",
    teamName: "Cleveland Cavaliers",
    arenaName: "Rocket Arena",
    city: "Cleveland",
    state: "OH",
    country: "USA",
    address: "1 Center Court, Cleveland, OH 44115",
    latitude: 41.4965,
    longitude: -81.6881,
    capacity: 19432,
    opened: 1994,
    image: "/arenas/cavaliers.jpg",
    logo: "/logos/cavaliers.png",
    ticketUrl: "https://www.nba.com/cavaliers/tickets",
    websiteUrl: "https://www.rocketarena.com/",
    parkingInfo:
      "Downtown garages and arena-adjacent lots are available; book ahead for faster entry and exit.",
    transitInfo:
      "RTA rail and bus service connect downtown stops to the arena district within an easy walk.",
    bagPolicy:
      'Plan for bag screening and size limits; compact personal bags help move through security faster.',
    notes:
      "Recently refreshed amenities and a compact downtown entertainment district help the venue feel lively before games.",
  },
  {
    id: "mavericks",
    teamId: "mavericks",
    teamName: "Dallas Mavericks",
    arenaName: "American Airlines Center",
    city: "Dallas",
    state: "TX",
    country: "USA",
    address: "2500 Victory Avenue, Dallas, TX 75219",
    latitude: 32.7905,
    longitude: -96.8103,
    capacity: 19200,
    opened: 2001,
    image: "/arenas/mavericks.jpg",
    logo: "/logos/mavericks.png",
    ticketUrl: "https://www.nba.com/mavericks/tickets",
    websiteUrl: "https://www.americanairlinescenter.com/",
    parkingInfo:
      "Victory Park garages are abundant but surge-priced for major games; arriving early improves access.",
    transitInfo:
      "DART rail serves Victory Station directly beside the arena for easy public transit entry.",
    bagPolicy:
      'Use a small bag or clutch when possible; arena security policies generally favor minimal carry-ins.',
    notes:
      "Victory Park creates a polished pregame district with strong dining, bars, and walkable hotel options.",
  },
  {
    id: "nuggets",
    teamId: "nuggets",
    teamName: "Denver Nuggets",
    arenaName: "Ball Arena",
    city: "Denver",
    state: "CO",
    country: "USA",
    address: "1000 Chopper Circle, Denver, CO 80204",
    latitude: 39.7487,
    longitude: -105.0077,
    capacity: 19520,
    opened: 1999,
    image: "/arenas/nuggets.jpg",
    logo: "/logos/nuggets.png",
    ticketUrl: "https://www.nba.com/nuggets/tickets",
    websiteUrl: "https://www.ballarena.com/",
    parkingInfo:
      "Official arena lots are available, but many fans combine light rail and nearby garages to reduce exit delays.",
    transitInfo:
      "Light rail and downtown shuttles serve the surrounding sports campus with straightforward pedestrian access.",
    bagPolicy:
      'Expect standard event screening and small-bag guidance; larger items should be left at home when possible.',
    notes:
      "High altitude, a downtown sports campus, and strong crowd density give Denver a distinct home-court atmosphere.",
  },
  {
    id: "pistons",
    teamId: "pistons",
    teamName: "Detroit Pistons",
    arenaName: "Little Caesars Arena",
    city: "Detroit",
    state: "MI",
    country: "USA",
    address: "2645 Woodward Avenue, Detroit, MI 48201",
    latitude: 42.3411,
    longitude: -83.0553,
    capacity: 20062,
    opened: 2017,
    image: "/arenas/pistons.jpg",
    logo: "/logos/pistons.png",
    ticketUrl: "https://www.nba.com/pistons/tickets",
    websiteUrl: "https://www.313presents.com/venues/little-caesars-arena",
    parkingInfo:
      "The District Detroit offers multiple garages and reserved lots within a short walk of the venue.",
    transitInfo:
      "QLINE and downtown bus service connect the arena area to central Detroit and nearby neighborhoods.",
    bagPolicy:
      'Small personal bags are easiest for entry; expect event-day screening and bag-size enforcement.',
    notes:
      "Modern concourses, broad food options, and an active entertainment district define the current Pistons arena experience.",
  },
  {
    id: "warriors",
    teamId: "warriors",
    teamName: "Golden State Warriors",
    arenaName: "Chase Center",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    address: "1 Warriors Way, San Francisco, CA 94158",
    latitude: 37.768,
    longitude: -122.3877,
    capacity: 18064,
    opened: 2019,
    image: "/arenas/warriors.jpg",
    logo: "/logos/warriors.png",
    ticketUrl: "https://www.nba.com/warriors/tickets",
    websiteUrl: "https://www.chasecenter.com/",
    parkingInfo:
      "Parking inventory is limited and premium-priced; many visitors prefer garages farther out or rideshare drop-offs.",
    transitInfo:
      "Muni service, regional rail connections, and waterfront shuttles provide strong transit access on event nights.",
    bagPolicy:
      'Arena entry is fastest with compact bags only; standard screening applies and larger items are typically restricted.',
    notes:
      "Premium presentation, waterfront adjacency, and a strong plaza environment make Chase Center feel especially polished.",
  },
  {
    id: "rockets",
    teamId: "rockets",
    teamName: "Houston Rockets",
    arenaName: "Toyota Center",
    city: "Houston",
    state: "TX",
    country: "USA",
    address: "1510 Polk Street, Houston, TX 77002",
    latitude: 29.7508,
    longitude: -95.3621,
    capacity: 18055,
    opened: 2003,
    image: "/arenas/rockets.jpg",
    logo: "/logos/rockets.png",
    ticketUrl: "https://www.nba.com/rockets/tickets",
    websiteUrl: "https://www.toyotacenter.com/",
    parkingInfo:
      "Connected garages and surface lots are common; booking downtown parking ahead of time is the easy play.",
    transitInfo:
      "METRORail and bus routes serve downtown Houston with a short walk to the arena.",
    bagPolicy:
      'Keep bags minimal and easy to inspect; larger bags may be denied or redirected based on event policy.',
    notes:
      "Toyota Center is integrated into the downtown core and works well for fans pairing games with nightlife.",
  },
  {
    id: "pacers",
    teamId: "pacers",
    teamName: "Indiana Pacers",
    arenaName: "Gainbridge Fieldhouse",
    city: "Indianapolis",
    state: "IN",
    country: "USA",
    address: "125 South Pennsylvania Street, Indianapolis, IN 46204",
    latitude: 39.7639,
    longitude: -86.1555,
    capacity: 17274,
    opened: 1999,
    image: "/arenas/pacers.jpg",
    logo: "/logos/pacers.png",
    ticketUrl: "https://www.nba.com/pacers/tickets",
    websiteUrl: "https://www.gainbridgefieldhouse.com/",
    parkingInfo:
      "Downtown garages and connected structures are plentiful; pre-booking helps for marquee matchups.",
    transitInfo:
      "IndyGo service and a walkable downtown grid make public transit and hotel access straightforward.",
    bagPolicy:
      'Expect normal screening and size restrictions; a small clutch or compact bag is the lowest-friction option.',
    notes:
      "Widely regarded as one of the most basketball-centric buildings in the league, with excellent sightlines.",
  },
  {
    id: "clippers",
    teamId: "clippers",
    teamName: "Los Angeles Clippers",
    arenaName: "Intuit Dome",
    city: "Inglewood",
    state: "CA",
    country: "USA",
    address: "3930 West Century Boulevard, Inglewood, CA 90303",
    latitude: 33.945,
    longitude: -118.3431,
    capacity: 18000,
    opened: 2024,
    image: "/arenas/clippers.jpg",
    logo: "/logos/clippers.png",
    ticketUrl: "https://www.nba.com/clippers/tickets",
    websiteUrl: "https://www.intuitdome.com/",
    parkingInfo:
      "Large event parking inventory surrounds the Inglewood campus, with rideshare zones designed into the site plan.",
    transitInfo:
      "Shuttle, bus, and regional transit connections continue to expand around the Inglewood event district.",
    bagPolicy:
      'Small personal bags and digital ticket readiness help keep entry smooth in the new venue setup.',
    notes:
      "New-building shine, strong technology integration, and campus-style circulation define the Intuit Dome experience.",
  },
  {
    id: "lakers",
    teamId: "lakers",
    teamName: "Los Angeles Lakers",
    arenaName: "Crypto.com Arena",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    address: "1111 South Figueroa Street, Los Angeles, CA 90015",
    latitude: 34.043,
    longitude: -118.2673,
    capacity: 19079,
    opened: 1999,
    image: "/arenas/lakers.jpg",
    logo: "/logos/lakers.png",
    ticketUrl: "https://www.nba.com/lakers/tickets",
    websiteUrl: "https://www.cryptoarena.com/",
    parkingInfo:
      "Multiple LA Live garages serve the arena, though rates and traffic spike around high-demand games.",
    transitInfo:
      "Metro rail and bus service connect downtown Los Angeles directly to the LA Live district.",
    bagPolicy:
      'Travel light for the smoothest entry; security checks and bag-size rules are standard for major events.',
    notes:
      "The Lakers' home venue sits inside one of the NBA's biggest entertainment districts with strong premium inventory.",
  },
  {
    id: "grizzlies",
    teamId: "grizzlies",
    teamName: "Memphis Grizzlies",
    arenaName: "FedExForum",
    city: "Memphis",
    state: "TN",
    country: "USA",
    address: "191 Beale Street, Memphis, TN 38103",
    latitude: 35.1382,
    longitude: -90.0505,
    capacity: 18119,
    opened: 2004,
    image: "/arenas/grizzlies.jpg",
    logo: "/logos/grizzlies.png",
    ticketUrl: "https://www.nba.com/grizzlies/tickets",
    websiteUrl: "https://www.fedexforum.com/",
    parkingInfo:
      "Beale Street garages and downtown lots are widely used, with easy walking access to the venue.",
    transitInfo:
      "Downtown trolley and bus connections make it easy to combine a game with other central Memphis stops.",
    bagPolicy:
      'Small bags are generally preferred; bag checks and event-day restrictions are common at entry points.',
    notes:
      "A compact downtown footprint and Beale Street energy make FedExForum one of the league's best pregame environments.",
  },
  {
    id: "heat",
    teamId: "heat",
    teamName: "Miami Heat",
    arenaName: "Kaseya Center",
    city: "Miami",
    state: "FL",
    country: "USA",
    address: "601 Biscayne Boulevard, Miami, FL 33132",
    latitude: 25.7814,
    longitude: -80.187,
    capacity: 19600,
    opened: 1999,
    image: "/arenas/heat.jpg",
    logo: "/logos/heat.png",
    ticketUrl: "https://www.nba.com/heat/tickets",
    websiteUrl: "https://www.kaseyacenter.com/",
    parkingInfo:
      "Bayside-area garages and valet options are common, but traffic can stack up near tip-off and after the game.",
    transitInfo:
      "Metromover and downtown transit routes help reduce the need for driving into the waterfront district.",
    bagPolicy:
      'Keep items compact and expect standard screening; oversized bags are usually discouraged or not permitted.',
    notes:
      "Bayfront views, downtown access, and a strong hospitality feel make the Heat arena experience uniquely Miami.",
  },
  {
    id: "bucks",
    teamId: "bucks",
    teamName: "Milwaukee Bucks",
    arenaName: "Fiserv Forum",
    city: "Milwaukee",
    state: "WI",
    country: "USA",
    address: "1111 Vel R. Phillips Avenue, Milwaukee, WI 53203",
    latitude: 43.0451,
    longitude: -87.9169,
    capacity: 17341,
    opened: 2018,
    image: "/arenas/bucks.jpg",
    logo: "/logos/bucks.png",
    ticketUrl: "https://www.nba.com/bucks/tickets",
    websiteUrl: "https://www.fiservforum.com/",
    parkingInfo:
      "The Deer District and nearby garages provide good supply, especially when reserved before arrival.",
    transitInfo:
      "Bus routes and downtown hotel access make the venue approachable without a car for many visitors.",
    bagPolicy:
      'Security lines move best with a small bag or no bag at all; standard arena restrictions typically apply.',
    notes:
      "The Deer District plaza adds a strong outdoor pregame and watch-party layer to the overall Bucks experience.",
  },
  {
    id: "timberwolves",
    teamId: "timberwolves",
    teamName: "Minnesota Timberwolves",
    arenaName: "Target Center",
    city: "Minneapolis",
    state: "MN",
    country: "USA",
    address: "600 North 1st Avenue, Minneapolis, MN 55403",
    latitude: 44.9795,
    longitude: -93.276,
    capacity: 18798,
    opened: 1990,
    image: "/arenas/timberwolves.jpg",
    logo: "/logos/timberwolves.png",
    ticketUrl: "https://www.nba.com/timberwolves/tickets",
    websiteUrl: "https://www.targetcenter.com/",
    parkingInfo:
      "Skyway-connected garages and downtown decks help during cold-weather game nights.",
    transitInfo:
      "METRO light rail and bus routes connect the arena to the broader Minneapolis-Saint Paul network.",
    bagPolicy:
      'Bring only small personal items and expect bag screening as part of normal event-day security.',
    notes:
      "Target Center's downtown setting and cold-weather skyway access shape a very practical fan trip.",
  },
  {
    id: "pelicans",
    teamId: "pelicans",
    teamName: "New Orleans Pelicans",
    arenaName: "Smoothie King Center",
    city: "New Orleans",
    state: "LA",
    country: "USA",
    address: "1501 Dave Dixon Drive, New Orleans, LA 70113",
    latitude: 29.949,
    longitude: -90.0815,
    capacity: 16867,
    opened: 1999,
    image: "/arenas/pelicans.jpg",
    logo: "/logos/pelicans.png",
    ticketUrl: "https://www.nba.com/pelicans/tickets",
    websiteUrl: "https://www.smoothiekingcenter.com/",
    parkingInfo:
      "Official lots and nearby garages support event traffic, though postgame exits can slow after large crowds.",
    transitInfo:
      "Streetcar, bus, and hotel-district access keep the arena easy to reach from central New Orleans.",
    bagPolicy:
      'Compact bags are recommended; standard screening and event-specific bag-size rules are commonly enforced.',
    notes:
      "Close proximity to the Superdome district and downtown hospitality makes this a flexible game-night destination.",
  },
  {
    id: "knicks",
    teamId: "knicks",
    teamName: "New York Knicks",
    arenaName: "Madison Square Garden",
    city: "New York",
    state: "NY",
    country: "USA",
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    latitude: 40.7505,
    longitude: -73.9934,
    capacity: 19812,
    opened: 1968,
    image: "/arenas/knicks.jpg",
    logo: "/logos/knicks.png",
    ticketUrl: "https://www.nba.com/knicks/tickets",
    websiteUrl: "https://www.msg.com/madison-square-garden/",
    parkingInfo:
      "Driving is possible but costly; most visitors rely on transit instead of Midtown parking.",
    transitInfo:
      "Penn Station, subway lines, and regional rail service make MSG one of the easiest arenas to reach by transit.",
    bagPolicy:
      'Minimal carry-ins are the smoothest choice; screening is standard and larger bags may face restrictions.',
    notes:
      "The Garden delivers unmatched centrality and cachet, with nonstop activity before and after the final buzzer.",
  },
  {
    id: "thunder",
    teamId: "thunder",
    teamName: "Oklahoma City Thunder",
    arenaName: "Paycom Center",
    city: "Oklahoma City",
    state: "OK",
    country: "USA",
    address: "100 West Reno Avenue, Oklahoma City, OK 73102",
    latitude: 35.4634,
    longitude: -97.5151,
    capacity: 18203,
    opened: 2002,
    image: "/arenas/thunder.jpg",
    logo: "/logos/thunder.png",
    ticketUrl: "https://www.nba.com/thunder/tickets",
    websiteUrl: "https://www.paycomcenter.com/",
    parkingInfo:
      "Downtown OKC garages and surface lots offer accessible pricing and short walks to the arena.",
    transitInfo:
      "Streetcar and downtown bus connections help fans move around the central Oklahoma City district.",
    bagPolicy:
      'Bring only a small personal bag and expect standard screening at all major entry points.',
    notes:
      "The crowd is consistently loud, making Paycom Center one of the most intense small-market stops in the league.",
  },
  {
    id: "magic",
    teamId: "magic",
    teamName: "Orlando Magic",
    arenaName: "Kia Center",
    city: "Orlando",
    state: "FL",
    country: "USA",
    address: "400 West Church Street, Orlando, FL 32801",
    latitude: 28.5392,
    longitude: -81.3839,
    capacity: 18846,
    opened: 2010,
    image: "/arenas/magic.jpg",
    logo: "/logos/magic.png",
    ticketUrl: "https://www.nba.com/magic/tickets",
    websiteUrl: "https://www.kiacenter.com/",
    parkingInfo:
      "Downtown Orlando garages are plentiful, with several positioned for quick arena walks.",
    transitInfo:
      "SunRail, LYMMO, and city bus options support game-night access from central Orlando.",
    bagPolicy:
      'Compact bags are recommended; expect routine screening and event-specific size restrictions on entry.',
    notes:
      "Strong in-arena production, clean concourses, and a tourism-friendly downtown setting make this venue visitor-friendly.",
  },
  {
    id: "sixers",
    teamId: "sixers",
    teamName: "Philadelphia 76ers",
    arenaName: "Wells Fargo Center",
    city: "Philadelphia",
    state: "PA",
    country: "USA",
    address: "3601 South Broad Street, Philadelphia, PA 19148",
    latitude: 39.9012,
    longitude: -75.1719,
    capacity: 20478,
    opened: 1996,
    image: "/arenas/sixers.jpg",
    logo: "/logos/sixers.png",
    ticketUrl: "https://www.nba.com/sixers/tickets",
    websiteUrl: "https://www.wellsfargocenterphilly.com/",
    parkingInfo:
      "The South Philadelphia sports complex offers broad parking supply and event-day traffic control.",
    transitInfo:
      "SEPTA Broad Street Line service connects Center City directly to the sports complex stop.",
    bagPolicy:
      'Use a small bag or clutch for the cleanest entry; security screening and bag rules are standard.',
    notes:
      "Fans in Philadelphia bring heavy energy, especially in divisional and playoff-style matchups.",
  },
  {
    id: "suns",
    teamId: "suns",
    teamName: "Phoenix Suns",
    arenaName: "Footprint Center",
    city: "Phoenix",
    state: "AZ",
    country: "USA",
    address: "201 East Jefferson Street, Phoenix, AZ 85004",
    latitude: 33.4457,
    longitude: -112.0712,
    capacity: 17071,
    opened: 1992,
    image: "/arenas/suns.jpg",
    logo: "/logos/suns.png",
    ticketUrl: "https://www.nba.com/suns/tickets",
    websiteUrl: "https://www.footprintcenter.com/",
    parkingInfo:
      "Downtown garages and reserved lots are standard; heat and event congestion make early arrival worthwhile.",
    transitInfo:
      "Valley Metro light rail stops nearby and connects easily to the downtown Phoenix core.",
    bagPolicy:
      'Arena screening is easiest with small personal items only; check event guidance before bringing larger bags.',
    notes:
      "Modernized interiors and a lively downtown district give the Suns a strong central-city presentation.",
  },
  {
    id: "trail-blazers",
    teamId: "trail-blazers",
    teamName: "Portland Trail Blazers",
    arenaName: "Moda Center",
    city: "Portland",
    state: "OR",
    country: "USA",
    address: "1 North Center Court Street, Portland, OR 97227",
    latitude: 45.5316,
    longitude: -122.6668,
    capacity: 19393,
    opened: 1995,
    image: "/arenas/trail-blazers.jpg",
    logo: "/logos/trail-blazers.png",
    ticketUrl: "https://www.nba.com/blazers/tickets",
    websiteUrl: "https://www.rosequarter.com/moda-center",
    parkingInfo:
      "Rose Quarter garages and surrounding lots are available, though many locals prefer transit access.",
    transitInfo:
      "MAX light rail and streetcar service make Moda Center one of the easiest NBA arenas to reach without a car.",
    bagPolicy:
      'Small bags are preferred and help speed up screening; larger carry-ins are often limited by policy.',
    notes:
      "Portland's arena is deeply woven into local fan culture, with transit access as a major strength.",
  },
  {
    id: "kings",
    teamId: "kings",
    teamName: "Sacramento Kings",
    arenaName: "Golden 1 Center",
    city: "Sacramento",
    state: "CA",
    country: "USA",
    address: "500 David J Stern Walk, Sacramento, CA 95814",
    latitude: 38.5802,
    longitude: -121.4994,
    capacity: 17608,
    opened: 2016,
    image: "/arenas/kings.jpg",
    logo: "/logos/kings.png",
    ticketUrl: "https://www.nba.com/kings/tickets",
    websiteUrl: "https://www.golden1center.com/",
    parkingInfo:
      "Downtown Commons garages and city lots are the most common parking options near tip-off.",
    transitInfo:
      "Regional transit and central Sacramento bus service make DOCO and the arena easy to reach.",
    bagPolicy:
      'Plan for screening and light bag rules; compact bags remain the easiest way through security.',
    notes:
      "Golden 1 Center drives a lively downtown entertainment scene and consistently generates strong home-court noise.",
  },
  {
    id: "spurs",
    teamId: "spurs",
    teamName: "San Antonio Spurs",
    arenaName: "Frost Bank Center",
    city: "San Antonio",
    state: "TX",
    country: "USA",
    address: "1 Frost Bank Center Drive, San Antonio, TX 78219",
    latitude: 29.427,
    longitude: -98.4375,
    capacity: 18418,
    opened: 2002,
    image: "/arenas/spurs.jpg",
    logo: "/logos/spurs.png",
    ticketUrl: "https://www.nba.com/spurs/tickets",
    websiteUrl: "https://www.frostbankcenter.com/",
    parkingInfo:
      "Large surface lots support the campus-style site, with early arrival helping avoid event ingress backups.",
    transitInfo:
      "Most visitors drive, though bus service and event shuttles can connect parts of the metro area.",
    bagPolicy:
      'Small bags move through security the fastest; expect standard event screening and posted size restrictions.',
    notes:
      "Large capacity and a deeply rooted regional fan base keep Spurs home games well supported.",
  },
  {
    id: "raptors",
    teamId: "raptors",
    teamName: "Toronto Raptors",
    arenaName: "Scotiabank Arena",
    city: "Toronto",
    state: "ON",
    country: "Canada",
    address: "40 Bay Street, Toronto, ON M5J 2X2",
    latitude: 43.6435,
    longitude: -79.3791,
    capacity: 19800,
    opened: 1999,
    image: "/arenas/raptors.jpg",
    logo: "/logos/raptors.png",
    ticketUrl: "https://www.nba.com/raptors/tickets",
    websiteUrl: "https://www.scotiabankarena.com/",
    parkingInfo:
      "Downtown Toronto parking is available but often expensive; many fans pair rail or subway with a short walk.",
    transitInfo:
      "Union Station gives the arena elite access to GO Transit, TTC subway, streetcar, and regional rail lines.",
    bagPolicy:
      'Light bags and compact personal items are recommended; screening and posted size limits apply on event nights.',
    notes:
      "A national fan base, prime downtown location, and excellent transit access make this a premier NBA trip.",
  },
  {
    id: "jazz",
    teamId: "jazz",
    teamName: "Utah Jazz",
    arenaName: "Delta Center",
    city: "Salt Lake City",
    state: "UT",
    country: "USA",
    address: "301 South Temple, Salt Lake City, UT 84101",
    latitude: 40.7683,
    longitude: -111.9011,
    capacity: 18306,
    opened: 1991,
    image: "/arenas/jazz.jpg",
    logo: "/logos/jazz.png",
    ticketUrl: "https://www.nba.com/jazz/tickets",
    websiteUrl: "https://www.deltacenter.com/",
    parkingInfo:
      "Downtown garages and surface lots support event demand, though many local fans also use TRAX.",
    transitInfo:
      "TRAX light rail serves the arena district directly and is one of the cleanest game-night transit options in the West.",
    bagPolicy:
      'Bring only small bags and expect standard arena screening before entry into the concourse.',
    notes:
      "Steep seating, loud crowds, and altitude all contribute to one of the strongest home-court identities in the NBA.",
  },
  {
    id: "wizards",
    teamId: "wizards",
    teamName: "Washington Wizards",
    arenaName: "Capital One Arena",
    city: "Washington",
    state: "DC",
    country: "USA",
    address: "601 F Street NW, Washington, DC 20004",
    latitude: 38.8981,
    longitude: -77.0209,
    capacity: 20356,
    opened: 1997,
    image: "/arenas/wizards.jpg",
    logo: "/logos/wizards.png",
    ticketUrl: "https://www.nba.com/wizards/tickets",
    websiteUrl: "https://www.capitalonearena.com/",
    parkingInfo:
      "Downtown garages and prepaid parking options are common, though many locals prefer Metro access.",
    transitInfo:
      "Gallery Place-Chinatown Metro offers direct rail access and makes the arena easy to reach from across the region.",
    bagPolicy:
      'Compact bags are recommended; event-day screening and posted size restrictions are part of normal entry.',
    notes:
      "The arena sits in a dense downtown corridor with strong restaurant depth and dependable public transit access.",
  },
];
