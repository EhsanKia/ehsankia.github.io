const data = [
  ["WHAT IS THE NAME OF THE HORSE-LIKE ANIMAL WITH BLACK AND WHITE STRIPES?", "ZEBRA", 93.3],
  ["WHAT IS THE NAME OF THE LONG SLEEP SOME ANIMALS GO THROUGH DURING THE ENTIRE WINTER?", "HIBERNATION", 89.0],
  ["WHAT IS THE NAME OF THE RUBBER OBJECT THAT IS HIT BACK AND FORTH BY HOCKEY PLAYERS?", "PUCK", 88.8],
  ["WHAT IS THE NAME OF THE REMAINS OF PLANTS AND ANIMALS THAT ARE FOUND IN STONE?", "FOSSILS", 87.3],
  ["WHICH PRECIOUS GEM IS RED?", "RUBY", 84.9],
  ["WHAT IS THE NAME OF THE SEVERE HEADACHE THAT RETURNS PERIODICALLY AND OFTEN IS ACCOMPANIED BY NAUSEA?", "MIGRAINE", 84.7],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “ROMEO AND JULIET”?", "SHAKESPEARE", 84.3],
  ["WHAT IS THE NAME OF A DRIED GRAPE?", "RAISIN", 83.5],
  ["WHAT IS THE NAME OF THE COMIC STRIP CHARACTER WHO EATS SPINACH TO INCREASE HIS STRENGTH?", "POPEYE", 82.4],
  ["WHAT ANIMAL RUNS THE FASTEST?", "CHEETAH", 81.6],
  ["WHAT IS THE NAME OF THE PROCESS BY WHICH PLANTS MAKE THEIR FOOD?", "PHOTOSYNTHESIS", 80.0],
  ["WHAT IS THE NAME OF DOROTHY’S DOG IN “THE WIZARD OF OZ”?", "TOTO", 79.9],
  ["WHAT IS THE NAME OF THE MOLTEN ROCK THAT RUNS DOWN THE SIDE OF A VOLCANO DURING AN ERUPTION?", "LAVA", 79.3],
  ["WHAT WAS THE NAME OF THE SUPPOSEDLY UNSINKABLE SHIP THAT SUNK ON ITS MAIDEN VOYAGE IN 1912?", "TITANIC", 78.9],
  ["WHICH SPORT USES THE TERMS “GUTTER” AND “ALLEY”?", "BOWLING", 78.8],
  ["WHAT IS THE NAME OF A GIANT OCEAN WAVE CAUSED BY AN EARTHQUAKE?", "TSUNAMI", 78.4],
  ["WHAT IS THE TERM FOR HITTING A VOLLEYBALL DOWN HARD INTO THE OPPONENT’S COURT?", "SPIKE", 78.4],
  ["WHAT IS THE LAST NAME OF THE VILLAINOUS CAPTAIN IN THE STORY “PETER PAN”?", "HOOK", 78.1],
  ["WHAT WAS THE NAME OF TARZAN’S GIRLFRIEND?", "JANE", 78.1],
  ["WHAT IS THE LAST NAME OF THE BROTHERS WHO FLEW THE FIRST AIRPLANE AT KITTY HAWK?", "WRIGHT", 75.1],
  ["WHAT IS THE NAME FOR A MEDICAL DOCTOR WHO SPECIALIZES IN CUTTING THE BODY?", "SURGEON", 74.8],
  ["WHAT IS THE LAST NAME OF THE FIRST PERSON TO SET FOOT ON THE MOON?", "ARMSTRONG", 74.1],
  ["WHAT IS THE CAPITAL OF FRANCE?", "PARIS", 73.0],
  ["WHAT IS THE NAME OF THE CRIME IN WHICH A BUILDING OR PROPERTY IS PURPOSELY SET ON FIRE?", "ARSON", 72.2],
  ["WHAT IS THE NAME OF THE SHORT PLEATED SKIRT WORN BY MEN IN SCOTLAND?", "KILT", 71.7],
  ["WHAT IS THE NAME OF AN INABILITY TO SLEEP?", "INSOMNIA", 71.4],
  ["WHAT IS THE NAME FOR A MEDICAL DOCTOR WHO SPECIALIZES IN DISEASES OF THE SKIN?", "DERMATOLOGIST", 69.2],
  ["WHAT IS THE NAME OF THE LARGEST OCEAN ON EARTH?", "PACIFIC", 68.5],
  ["WHAT IS THE NAME OF THE SHIP THAT CARRIED THE PILGRIMS TO AMERICA IN 1620?", "MAYFLOWER", 66.3],
  ["WHAT IS THE NAME FOR A CYCLONE THAT OCCURS OVER LAND?", "TORNADO", 64.1],
  ["WHICH SPORT IS ASSOCIATED WITH WIMBLEDON?", "TENNIS", 61.9],
  ["WHAT IS THE NAME OF THE BIRD THAT CANNOT FLY AND IS THE LARGEST BIRD ON EARTH?", "OSTRICH", 60.3],
  ["WHAT IS THE NAME OF THE ISLAND-CITY BELIEVED SINCE ANTIQUITY TO HAVE SUNK INTO THE OCEAN?", "ATLANTIS", 59.3],
  ["WHAT IS THE NAME OF THE LIZARD THAT CHANGES ITS COLOR TO MATCH THE SURROUNDINGS?", "CHAMELEON", 58.9],
  ["WHAT IS THE NAME OF THE THICK LAYER OF FAT ON A WHALE?", "BLUBBER", 57.2],
  ["WHAT IS THE LAST NAME OF THE BASEBALL PLAYER WHO HAD THE MOST HOME RUNS IN A SINGLE SEASON PRIOR TO 1961?", "RUTH", 56.8],
  ["WHAT IS THE NAME OF A YOUNG SHEEP?", "LAMB", 56.1],
  ["WHAT IS THE LARGEST PLANET IN THE SOLAR SYSTEM?", "JUPITER", 55.9],
  ["WHAT IS THE NAME OF THE NAVIGATION INSTRUMENT USED AT SEA TO PLOT POSITION RELATIVE TO THE MAGNETIC NORTH POLE?", "COMPASS", 52.6],
  ["WHAT IS THE TERM IN GOLF REFERRING TO A SCORE OF ONE UNDER PAR ON A PARTICULAR HOLE?", "BIRDIE", 52.3],
  ["WHICH GAME USES A RUBBER BALL AND LITTLE METAL PIECES?", "JACKS", 52.1],
  ["WHAT IS THE NAME OF A DRIED PLUM?", "PRUNE", 51.7],
  ["IN WHICH SPORT DOES A RIDER ON HORSEBACK HIT A BALL WITH HIS MALLET?", "POLO", 51.0],
  ["WHAT IS THE NAME OF THE LEGENDARY ONE-EYED GIANT IN GREEK MYTHOLOGY?", "CYCLOPS", 50.7],
  ["IN WHAT PARK IS “OLD FAITHFUL” LOCATED?", "YELLOWSTONE", 49.1],
  ["WHAT IS THE NAME OF THE POKER HAND IN WHICH ALL OF THE CARDS ARE OF THE SAME SUIT?", "FLUSH", 48.6],
  ["IN WHICH SPORT IS THE STANLEY CUP AWARDED?", "HOCKEY", 48.1],
  ["WHAT IS THE NAME OF THE CHAPEL WHOSE CEILING WAS PAINTED BY MICHELANGELO?", "SISTINE", 47.5],
  ["OF WHICH COUNTRY IS BAGHDAD THE CAPITAL?", "IRAQ", 46.8],
  ["WHAT IS THE NAME OF THE LIQUID PORTION OF WHOLE BLOOD?", "PLASMA", 46.8],
  ["WHAT IS THE NAME OF THE CITY IN ITALY THAT IS KNOWN FOR ITS CANALS?", "VENICE", 45.9],
  ["WHAT IS THE NAME OF THE SPEAR LIKE OBJECT THAT IS THROWN DURING A TRACK MEET?", "JAVELIN", 45.2],
  ["WHAT IS THE LAST NAME OF THE MAN WHO RODE HORSEBACK IN 1775 TO WARN THAT THE BRITISH WERE COMING?", "REVERE", 44.3],
  ["WHO WAS THE EGYPTIAN QUEEN WHO JOINED FORCES WITH MARK ANTONY OF ROME?", "CLEOPATRA", 44.3],
  ["WHAT IS THE LAST NAME OF THE MAN WHO ASSASSINATED ABRAHAM LINCOLN?", "BOOTH", 43.8],
  ["WHAT IS THE LAST NAME OF THE MAN WHO SHOWED THAT LIGHTNING IS ELECTRIC?", "FRANKLIN", 43.7],
  ["WHAT IS THE LAST NAME OF THE FAMOUS MAGICIAN AND ESCAPE ARTIST WHO DIED OF APPENDICITIS?", "HOUDINI", 43.6],
  ["WHAT IS THE NAME OF DEER MEAT?", "VENISON", 43.2],
  ["WHAT IS THE NAME OF THE LARGE HAIRY SPIDER THAT LIVES NEAR BANANAS?", "TARANTULA", 42.9],
  ["WHAT IS THE NAME OF THE OCEAN THAT IS LOCATED BETWEEN AFRICA AND AUSTRALIA?", "INDIAN", 42.7],
  ["WHAT IS THE LAST NAME OF THE SINGER WHO RECORDED “HEARTBREAK HOTEL” AND “ALL SHOOK UP”?", "PRESLEY", 42.4],
  ["WHAT IS THE NAME OF THE CRIME IN WHICH A PERSON PURPOSELY BETRAYS HIS COUNTRY?", "TREASON", 41.8],
  ["WHAT IS THE NAME OF THE FIRST ARTIFICIAL SATELLITE PUT IN ORBIT BY RUSSIA IN 1957?", "SPUTNIK", 41.7],
  ["WHAT BRAND OF CIGARETTE WAS FIRST TO HAVE THE FLIP-TOP BOX?", "MARLBORO", 39.9],
  ["WHAT KIND OF METAL IS ASSOCIATED WITH A 50TH WEDDING ANNIVERSARY?", "GOLD", 39.6],
  ["WHICH TYPE OF SNAKE DO ASIAN SNAKE-CHARMERS USE?", "COBRA", 39.1],
  ["WHAT IS THE ONLY LIQUID METAL AT ROOM TEMPERATURE?", "MERCURY", 38.8],
  ["WHAT IS THE NAME OF THE DESERT PEOPLE WHO WANDER INSTEAD OF LIVING IN ONE PLACE?", "NOMADS", 35.2],
  ["WHAT IS THE CAPITAL OF NEW YORK?", "ALBANY", 33.1],
  ["WHAT IS THE NAME OF THE ORGAN THAT PRODUCES INSULIN?", "PANCREAS", 32.7],
  ["WHAT IS THE NAME OF THE COLLAR BONE?", "CLAVICLE", 32.4],
  ["WHAT IS THE NAME OF THE EXTINCT REPTILES KNOWN AS “TERRIBLE LIZARDS”?", "DINOSAURS", 31.5],
  ["WHAT IS THE CAPITAL OF RUSSIA?", "MOSCOW", 30.9],
  ["WHICH BREED OF CAT HAS BLUE EYES?", "SIAMESE", 30.8],
  ["WHAT IS THE LAST NAME OF THE SECOND U.S. PRESIDENT?", "ADAMS", 30.3],
  ["WHAT IS THE NAME OF THE CONSTELLATION THAT LOOKS LIKE A FLYING HORSE?", "PEGASUS", 30.0],
  ["WHAT IS THE NAME OF THE KIND OF CAT THAT SPOKE TO ALICE IN THE STORY “ALICE’S ADVENTURES IN WONDERLAND”?", "CHESHIRE", 30.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO PROPOSED THE THEORY OF RELATIVITY?", "EINSTEIN", 29.7],
  ["WHAT WAS THE LAST NAME OF THE WOMAN WHO SUPPOSEDLY DESIGNED AND SEWED THE FIRST AMERICAN FLAG?", "ROSS", 28.6],
  ["WHAT IS THE LAST NAME OF THE FIRST SIGNER OF THE “DECLARATION OF INDEPENDENCE”?", "HANCOCK", 28.5],
  ["WHAT WAS THE NAME OF KING ARTHUR’S SWORD?", "EXCALIBUR", 28.5],
  ["WHAT IS THE WORD THAT MEANS A NAUTICAL MILE PER HOUR?", "KNOT", 27.7],
  ["WHAT IS THE NAME FOR THE ASTRONOMICAL BODIES THAT ENTER THE EARTH’S ATMOSPHERE?", "METEORS", 27.1],
  ["WHAT IS THE LONGEST RIVER IN SOUTH AMERICA?", "AMAZON", 26.7],
  ["WHAT IS THE NAME OF THE AUTOMOBILE INSTRUMENT THAT MEASURES MILEAGE?", "ODOMETER", 25.8],
  ["WHAT ITALIAN CITY WAS DESTROYED WHEN MOUNT VESUVIUS ERUPTED IN 79 A.D.?", "POMPEII", 25.8],
  ["WHAT IS THE LAST NAME OF BATMAN’S SECRET IDENTITY IN THE BATMAN COMICS?", "WAYNE", 25.2],
  ["WHAT IS THE LAST NAME OF THE MYTHICAL GIANT LUMBERJACK?", "BUNYAN", 24.5],
  ["WHAT IS THE NAME OF THE COMPANY THAT PRODUCES “BABY RUTH” CANDY BARS?", "NESTLE", 24.5],
  ["WHAT IS THE NAME OF SOCRATES’ MOST FAMOUS STUDENT?", "PLATO", 23.9],
  ["WHAT IS THE NAME OF THE THREE-LEAF CLOVER THAT IS THE EMBLEM OF IRELAND?", "SHAMROCK", 23.9],
  ["OF WHICH COUNTRY IS BUENOS AIRES THE CAPITAL?", "ARGENTINA", 20.4],
  ["WHAT IS THE LAST NAME OF THE ACTRESS WHO RECEIVED THE BEST ACTRESS AWARD FOR THE MOVIE “MARY POPPINS”?", "ANDREWS", 20.3],
  ["WHAT IS THE NAME OF THE MOUNTAIN RANGE IN WHICH MOUNT EVEREST IS LOCATED?", "HIMALAYAS", 19.8],
  ["WHAT IS THE UNIT OF SOUND INTENSITY?", "DECIBEL", 19.0],
  ["WHAT IS THE NAME OF THE PROJECT WHICH DEVELOPED THE ATOMIC BOMB DURING WORLD WAR II?", "MANHATTAN", 18.8],
  ["WHAT IS THE UNIT OF ELECTRICAL POWER THAT REFERS TO A CURRENT OF ONE AMPERE AT ONE VOLT?", "WATT", 18.7],
  ["WHAT IS THE LAST NAME OF THE AUTHOR OF THE BOOK “1984”?", "ORWELL", 18.5],
  ["IN WHICH GAME ARE MEN CROWNED?", "CHECKERS", 17.6],
  ["WHAT IS THE LAST NAME OF THE MAN WHO ASSASSINATED PRESIDENT JOHN F. KENNEDY?", "OSWALD", 17.2],
  ["WHAT IS THE NAME OF BATMAN’S BUTLER?", "ALFRED", 16.3],
  ["WHICH COUNTRY WAS THE FIRST TO USE GUNPOWDER?", "CHINA", 16.0],
  ["WHAT IS THE NAME OF AN AIRPLANE WITHOUT AN ENGINE?", "GLIDER", 15.7],
  ["WHAT IS THE NAME OF THE NORTH STAR?", "POLARIS", 15.6],
  ["WHAT IS THE ONLY WORD THAT THE RAVEN SAYS IN EDGAR ALLEN POE’S POEM “THE RAVEN”?", "NEVERMORE", 15.5],
  ["FOR WHICH COUNTRY IS THE YEN THE MONETARY UNIT?", "JAPAN", 15.2],
  ["IN WHAT EUROPEAN CITY IS THE PARTHENON LOCATED?", "ATHENS", 15.0],
  ["WHAT IS THE NAME OF THE FURRY ANIMAL THAT ATTACKS COBRA SNAKES?", "MONGOOSE", 14.9],
  ["FOR WHICH COUNTRY IS THE RUPEE THE MONETARY UNIT?", "INDIA", 14.7],
  ["WHAT IS THE LAST NAME OF THE MAN WHO FIRST STUDIED GENETIC INHERITANCE IN PLANTS?", "MENDEL", 14.4],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WROTE THE “STAR SPANGLED BANNER”?", "KEY", 14.1],
  ["WHAT IS THE NAME OF THE PALACE IN LONDON IN WHICH THE MONARCH OF ENGLAND RESIDES?", "BUCKINGHAM", 14.1],
  ["IN WHICH GAME ARE THE STANDARD PIECES OF STAUNTON DESIGN?", "CHESS", 13.8],
  ["WHAT ARE PEOPLE WHO MAKE MAPS CALLED?", "CARTOGRAPHERS", 13.8],
  ["WHAT WAS THE NAME OF THE ZEPPELIN THAT EXPLODED IN LAKEHURST N.J. IN 1937? ", "HINDENBURG", 13.4],
  ["WHAT IS THE PALACE BUILT IN FRANCE BY KING LOUIS XIV?", "VERSAILLES", 12.8],
  ["IN WHICH CITY IS THE U.S. NAVAL ACADEMY LOCATED?", "ANNAPOLIS", 12.7],
  ["WHAT IS THE NAME OF THE LIGHTEST WOOD KNOWN?", "BALSA", 12.5],
  ["WHAT IS THE LAST NAME OF THE BOXER WHO LATER BECAME KNOWN AS MUHAMMAD ALI?", "CLAY", 11.7],
  ["WHAT ISLAND IS THE LARGEST IN THE WORLD EXCLUDING AUSTRALIA?", "GREENLAND", 11.1],
  ["WHAT IS THE NAME OF THE SMALL JAPANESE STOVE USED FOR OUTDOOR COOKING?", "HIBACHI", 11.0],
  ["WHAT IS THE LAST NAME OF THE WOMAN WHO BEGAN THE PROFESSION OF NURSING?", "NIGHTINGALE", 10.8],
  ["WHO WAS THE LEADER OF THE ARGONAUTS?", "JASON", 10.7],
  ["WHAT IS THE LAST NAME OF THE ARTIST WHO PAINTED “GUERNICA”?", "PICASSO", 10.7],
  ["IN WHAT ANCIENT CITY WERE THE “HANGING GARDENS” LOCATED?", "BABYLON", 10.3],
  ["WHAT ARE PEOPLE CALLED WHO EXPLORE CAVES?", "SPELUNKERS", 10.0],
  ["WHAT IS THE NAME OF THE CAPTAIN OF THE PEQUOD IN THE BOOK “MOBY DICK”?", "AHAB", 9.7],
  ["WHAT IS THE CAPITAL OF KENTUCKY?", "FRANKFORT", 9.5],
  ["WHAT IS THE NAME OF AN ILLEGAL MOVE BY A BASEBALL PITCHER THAT RESULTS IN ALL RUNNERS ADVANCING ONE BASE?", "BALK", 9.3],
  ["WHAT IS THE LAST NAME OF THE AMERICAN WHO STARRED IN THE 1936 OLYMPICS?", "OWENS", 9.3],
  ["THE DEEPEST PART OF THE OCEAN IS LOCATED AT WHICH TRENCH?", "MARIANA", 9.3],
  ["WHICH SPORT USES THE TERMS “STONES” AND “BROOMS”?", "CURLING", 9.2],
  ["WHAT IS THE PROPER NAME FOR A BADMINTON BIRD?", "SHUTTLECOCK", 9.1],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “OLIVER TWIST”?", "DICKENS", 9.0],
  ["WHAT IS THE CAPITAL OF DELAWARE?", "DOVER", 9.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO INVENTED THE PHONOGRAPH?", "EDISON", 8.6],
  ["IN WHICH TYPE OF SKI RACE DOES THE DOWNHILL SKIER MAKE SHARP TURNS AROUND POLES?", "SLALOM", 8.6],
  ["IN WHICH CITY IS HEATHROW AIRPORT LOCATED?", "LONDON", 8.3],
  ["WHAT IS THE CAPITAL OF JAMAICA?", "KINGSTON", 8.1],
  ["WHICH PLANET WAS THE LAST TO BE DISCOVERED?", "NEPTUNE", 8.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “THE MURDERS IN THE RUE MORGUE”?", "POE", 8.0],
  ["WHAT IS THE NAME OF THE SHIP ON WHICH CHARLES DARWIN MADE HIS SCIENTIFIC VOYAGE?", "BEAGLE", 7.9],
  ["WHAT IS THE CAPITAL OF CHILE?", "SANTIAGO", 7.7],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “THE OLD MAN AND THE SEA”?", "HEMINGWAY", 7.7],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WROTE “CANTERBURY TALES”?", "CHAUCER", 7.6],
  ["WHAT IS THE NAME OF THE FOUNTAIN IN ROME INTO WHICH COINS ARE THROWN FOR GOOD LUCK?", "TREVI", 7.1],
  ["WHAT WAS THE LAST NAME OF THE MAN WHO WAS PRESIDENT DIRECTLY AFTER JAMES MADISON?", "MONROE", 6.8],
  ["WHAT IS THE LAST NAME OF THE ASTRONOMER WHO PUBLISHED IN 1543 HIS THEORY THAT THE EARTH REVOLVES AROUND THE SUN?", "COPERNICUS", 6.7],
  ["WHAT IS THE LAST NAME OF THE CRIMINAL WHO WAS KNOWN AS “SCARFACE”?", "CAPONE", 6.6],
  ["WHAT IS THE NAME OF THE LONE RANGER’S INDIAN SIDEKICK?", "TONTO", 6.1],
  ["WHAT IS THE CAPITAL OF DENMARK?", "COPENHAGEN", 6.0],
  ["WHAT WAS THE LAST NAME OF THE MAN WHO WAS THE RADIO BROADCASTER FOR THE “WAR OF THE WORLDS”?", "WELLES", 5.9],
  ["IN WHICH CITY IS MICHELANGELO’S STATUE OF DAVID LOCATED?", "FLORENCE", 5.8],
  ["WHAT WAS FRANK LLOYD WRIGHT’S PROFESSION?", "ARCHITECT", 5.8],
  ["OF WHICH COUNTRY IS NAIROBI THE CAPITAL?", "KENYA", 5.3],
  ["WHAT IS THE NAME OF THE HILLBILLY FAMILY THAT HAD A FAMOUS FEUD WITH THE MCCOY FAMILY?", "HATFIELD", 5.2],
  ["WHAT KIND OF POISON DID SOCRATES TAKE AS HIS EXECUTION?", "HEMLOCK", 5.2],
  ["WHAT IS THE LAST NAME OF THE FIRST PERSON TO COMPLETE A SOLO FLIGHT ACROSS THE ATLANTIC OCEAN?", "LINDBERGH", 5.2],
  ["ANDY GRIFFITH WAS THE SHERIFF OF WHAT TOWN ON TELEVISION’S “ANDY GRIFFITH SHOW”?", "MAYBERRY", 5.2],
  ["WHAT IS THE NAME OF THE ROMAN EMPEROR WHO FIDDLED WHILE ROME BURNED?", "NERO", 5.2],
  ["WHAT IS THE CITY IN WHICH THE BASEBALL HALL OF FAME IS LOCATED?", "COOPERSTOWN", 5.1],
  ["WHAT IS THE NAME OF THE UNIT OF MEASURE THAT REFERS TO A SIX-FOOT DEPTH OF WATER?", "FATHOM", 5.1],
  ["WHAT IS THE LAST NAME OF THE SCIENTIST WHO DISCOVERED RADIUM?", "CURIE", 4.6],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “BRAVE NEW WORLD”?", "HUXLEY", 4.5],
  ["IN ADDITION TO THE KENTUCKY DERBY AND THE BELMONT STAKES WHAT HORSE RACE COMPRISES THE TRIPLE CROWN?", "PREAKNESS", 4.4],
  ["WHAT IS THE LAST NAME OF THE CRIMINAL WHO WAS KILLED BY FBI AGENTS OUTSIDE OF A CHICAGO MOVIE THEATER?", "DILLINGER", 4.4],
  ["WHAT IS THE NAME OF THE SINGER WHO POPULARIZED A DANCE KNOWN AS THE “TWIST”?", "CHECKER", 4.1],
  ["OVER WHICH RIVER IS THE GEORGE WASHINGTON BRIDGE?", "HUDSON", 4.1],
  ["WHAT IS THE LAST NAME OF THE MAN WHO INVENTED DYNAMITE?", "NOBEL", 4.0],
  ["WHAT IS THE NAME OF THE CHINESE RELIGION FOUNDED BY LAO TSE?", "TAOISM", 4.0],
  ["WHAT IS THE LAST NAME OF THE COMMANDER WHO LOST THE BATTLE OF THE LITTLE BIGHORN RIVER?", "CUSTER", 3.8],
  ["WHAT IS THE NAME OF THE NAVIGATION INSTRUMENT USED AT SEA TO PLOT POSITION BY THE STARS?", "SEXTANT", 3.8],
  ["WHO WAS THE MOST FAMOUS GREEK DOCTOR?", "HIPPOCRATES", 3.7],
  ["IN WHICH CITY DOES THE COTTON BOWL TAKE PLACE?", "DALLAS", 3.7],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE THE SHERLOCK HOLMES STORIES?", "DOYLE", 3.6],
  ["FOR WHICH COUNTRY IS THE DRACHMA THE MONETARY UNIT?", "GREECE", 3.6],
  ["WHAT IS THE NAME OF THE MANSION IN VIRGINIA THAT WAS THOMAS JEFFERSON’S HOME?", "MONTICELLO", 3.5],
  ["WHAT IS THE LONGEST RIVER IN ASIA?", "YANGTZE", 3.5],
  ["WHAT IS THE LAST NAME OF THE ACTOR WHO RECEIVED THE BEST ACTOR AWARD FOR THE MOVIE “ON THE WATERFRONT”?", "BRANDO", 3.4],
  ["WHAT IS THE LAST NAME OF THE MALE STAR OF THE MOVIE “CASABLANCA”?", "BOGART", 3.4],
  ["OF WHICH COUNTRY IS BUDAPEST THE CAPITAL?", "HUNGARY", 3.3],
  ["WHO IS KNOWN AS “THE FATHER OF GEOMETRY”?", "EUCLID", 3.3],
  ["WHAT IS THE LAST NAME OF THE HUSBAND-WIFE SPIES WHO WERE ELECTROCUTED IN 1951 FOR PASSING ATOMIC SECRETS TO RUSSIA?", "ROSENBERG", 3.1],
  ["WHAT IS THE LAST NAME OF THE COMPOSER WHO WROTE THE OPERA “DON GIOVANNI”?", "MOZART", 3.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR OF THE JAMES BOND NOVELS?", "FLEMING", 3.0],
  ["WHAT WAS THE LAST NAME OF BUFFALO BILL?", "CODY", 3.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE UNDER THE PSEUDONYM OF MARK TWAIN?", "CLEMENS", 2.9],
  ["WHAT IS THE NAME OF THE ISLAND ON WHICH NAPOLEON WAS BORN?", "CORSICA", 2.9],
  ["WHAT IS THE LAST NAME OF THE DOCTOR WHO FIRST DEVELOPED A VACCINE AGAINST POLIO?", "SALK", 2.8],
  ["WHAT IS THE LAST NAME OF THE MAN WHO BEGAN THE REFORMATION IN GERMANY?", "LUTHER", 2.8],
  ["WHAT IS THE CAPITAL OF FINLAND?", "HELSINKI", 2.6],
  ["WHAT WAS THE NAME OF THE APOLLO LUNAR MODULE THAT LANDED THE FIRST MAN ON THE MOON?", "EAGLE", 2.5],
  ["WHAT IS THE LAST NAME OF THE COSMONAUT WHO WAS THE FIRST PERSON TO ORBIT AROUND THE EARTH?", "GAGARIN", 2.4],
  ["WHAT WAS THE NAME OF ROY ROGER’S DOG?", "BULLET", 2.1],
  ["WHAT WAS THE NAME OF ALEXANDER GRAHAM BELL’S ASSISTANT?", "WATSON", 2.1],
  ["WHAT WAS THE LAST NAME OF THE COMPOSER OF THE “MAPLE LEAF RAG”?", "JOPLIN", 2.0],
  ["WHAT IS THE LAST NAME OF THE PLAYWRIGHT WHO WROTE “A STREETCAR NAMED DESIRE”?", "WILLIAMS", 2.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR OF “LITTLE WOMEN”?", "ALCOTT", 2.0],
  ["WHAT IS THE LAST NAME OF THE FIRST PERSON TO CLIMB MOUNT EVEREST?", "HILLARY", 2.0],
  ["WHAT IS THE LAST NAME OF THE ACTOR WHO PLAYED RHETT BUTLER IN “GONE WITH THE WIND”?", "GABLE", 2.0],
  ["IN WHICH COUNTRY IS ANGEL FALLS LOCATED?", "VENEZUELA", 2.0],
  ["WHAT IS THE CAPITAL OF CANADA?", "OTTAWA", 1.9],
  ["WHAT IS THE LAST NAME OF THE TWENTY-FIRST U.S. PRESIDENT?", "ARTHUR", 1.9],
  ["WHAT WAS THE NAME OF THE GOLDFISH IN THE STORY OF PINOCCHIO?", "CLEO", 1.9],
  ["WHAT IS THE NAME OF THE VILLAINOUS PEOPLE WHO LIVED UNDERGROUND IN H. G. WELLS’S BOOK “THE TIME MACHINE”?", "MORLOCKS", 1.8],
  ["WHAT WAS THE LAST NAME OF THE CHARACTER PORTRAYED BY ROBERT STACK ON THE TELEVISION SHOW “THE UNTOUCHABLES”?", "NESS", 1.5],
  ["WHAT IS THE CAPITAL OF AUSTRALIA?", "CANBERRA", 1.5],
  ["WHAT IS THE LAST NAME OF THE ARTIST WHO PAINTED “THE PERSISTENCE OF MEMORY”?", "DALI", 1.5],
  ["WHAT IS THE LAST NAME OF THE MAN WHO INVENTED THE TELEGRAPH?", "MORSE", 1.4],
  ["WHAT IS THE NAME OF THE RIVER ON WHICH BONN IS LOCATED?", "RHINE", 1.4],
  ["WHAT IS THE NAME OF THE SUBSTANCE DERIVED FROM A WHALE THAT IS USED TO MAKE PERFUME?", "AMBERGRIS", 1.4],
  ["WHAT IS THE NAME OF THE SUBMARINE IN JULES VERNE’S “20,000 LEAGUES BENEATH THE SEA”?", "NAUTILUS", 1.4],
  ["WHAT WAS THE NAME OF THE CLOWN ON THE “HOWDY DOODY” TELEVISION SHOW?", "CLARABELL", 1.4],
  ["WHAT IS THE LAST NAME OF DAGWOOD’S BOSS IN THE COMIC STRIP “BLONDIE”?", "DITHERS", 1.0],
  ["WHAT IS THE LAST NAME OF THE MOVIE ACTOR WHO PORTRAYED SPARTACUS?", "DOUGLAS", 1.0],
  ["WHAT IS THE LAST NAME OF THE WOMAN WHO FOUNDED THE AMERICAN RED CROSS?", "BARTON", 1.0],
  ["WHAT IS THE LAST NAME OF THE UNION GENERAL WHO DEFEATED THE CONFEDERATE ARMY AT THE CIVIL WAR BATTLE OF GETTYSBURG?", "MEADE", 1.0],
  ["WHAT IS THE NAME OF THE AVENUE THAT IMMEDIATELY FOLLOWS ATLANTIC AVENUE IN THE GAME OF MONOPOLY?", "VENTNOR", 1.0],
  ["WHICH GAME USES A DOUBLING CUBE?", "BACKGAMMON", 1.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO SUPPOSEDLY KILLED JESSE JAMES?", "FORD", 0.9],
  ["WHAT IS THE LAST NAME OF THE EUROPEAN AUTHOR WHO WROTE “THE TRIAL”?", "KAFKA", 0.8],
  ["THE GENERAL NAMED HANNIBAL WAS FROM WHAT CITY?", "CARTHAGE", 0.7],
  ["WHAT IS THE LAST NAME OF THE BRITISH ADMIRAL WHO WON THE BATTLE OF TRAFALGAR?", "NELSON", 0.7],
  ["WHAT IS THE NAME OF THE INDIAN COLLEGE IN PENNSYLVANIA FOR WHICH JIM THORPE PLAYED FOOTBALL?", "CARLISLE", 0.7],
  ["WHAT IS THE NAME OF THE PLAY IN WHICH ELWOOD P. DOWD IS A CHARACTER?", "HARVEY", 0.7],
  ["WHAT FAMOUS KNOT DID ALEXANDER THE GREAT UNDO?", "GORDIAN", 0.7],
  ["WHAT WAS THE NAME OF THE UNSUCCESSFUL AUTO THAT WAS MANUFACTURED BY THE FORD MOTOR COMPANY FROM 1957–1959?", "EDSEL", 0.7],
  ["WHAT IS THE LAST NAME OF THE SONG WRITER WHO WROTE THE SONG “I LOVE PARIS”?", "PORTER", 0.7],
  ["WHAT IS THE LAST NAME OF THE FIRST AMERICAN AUTHOR TO WIN THE NOBEL PRIZE FOR LITERATURE?", "LEWIS", 0.7],
  ["WHAT IS THE LAST NAME OF THE INVENTOR OF THE WIRELESS RADIO?", "MARCONI", 0.7],
  ["WHAT IS THE LAST NAME OF THE ARTIST WHO PAINTED “AMERICAN GOTHIC”?", "WOOD", 0.7],
  ["IN WHAT PROFESSION WAS EMMETT KELLY?", "CLOWN", 0.6],
  ["WHAT IS THE NAME OF THE RIVER THAT RUNS THROUGH ROME?", "TIBER", 0.6],
  ["WHAT IS THE LAST NAME OF THE POET WHO ORIGINALLY WROTE “DON JUAN”?", "BYRON", 0.6],
  ["WHAT IS THE LAST NAME OF THE FRENCH AUTHOR WHO WROTE “THE STRANGER”?", "CAMUS", 0.5],
  ["WHO WAS THE FIRST RULER OF THE HOLY ROMAN EMPIRE?", "CHARLEMAGNE", 0.5],
  ["WHAT IS THE LAST NAME OF THE MAN WHO IS REGARDED AS THE NATIONAL POET OF SCOTLAND?", "BURNS", 0.5],
  ["WHAT IS THE LAST NAME OF THE FOOTBALL PLAYER KNOWN AS “THE GALLOPING GHOST”?", "GRANGE", 0.5],
  ["WHAT IS THE NAME OF ROY ROGERS’ HORSE?", "TRIGGER", 0.5],
  ["WHAT WAS THE NAME OF THE NUCLEAR SUBMARINE THAT SUNK IN THE ATLANTIC IN 1963?", "THRESHER", 0.5],
  ["WHAT IS THE NAME OF THE MAN WHO REMOVED THE THORN FROM THE LION’S PAW IN THE STORY FROM AESOP’S FABLES?", "ANDROCLES", 0.5],
  ["WHAT IS THE NAME OF THE BRIGHTEST STAR IN THE SKY EXCLUDING THE SUN?", "SIRIUS", 0.5],
  ["WHAT IS THE NAME OF THE LAND OF THE GIANTS IN “GULLIVER’S TRAVELS”?", "BROBDINGNAG", 0.5],
  ["WHAT WAS THE LAST NAME OF THE FEMALE STAR OF THE MOVIE “CASABLANCA”?", "BERGMAN", 0.5],
  ["WHAT IS THE LAST NAME OF THE ACTOR KNOWN AS “THE MAN OF A THOUSAND FACES”?", "CHANEY", 0.5],
  ["WHAT IS THE NAME OF THE BASEBALL PLAYER WITH THE HIGHEST LIFETIME BATTING AVERAGE IN THE MAJOR LEAGUES?", "COBB", 0.5],
  ["WHAT WAS THE LAST NAME OF THE ACTOR IN THE ROLE OF PERRY MASON ON TELEVISION?", "BURR", 0.5],
  ["WHAT IS THE LAST NAME OF THE MOST POPULAR PIN-UP GIRL OF WORLD WAR II?", "GRABLE", 0.4],
  ["WHAT IS THE NAME OF THE LARGEST DESERT ON EARTH?", "ANTARTICA", 0.0],
  ["WHAT IS THE LAST NAME OF THE JOCKEY WITH THE MOST LIFETIME WINNERS IN HORSE RACING?", "BAZE", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WAS THE VOICE OF MR. MAGOO?", "BACKUS", 0.0],
  ["WHAT IS THE LAST NAME OF THE ACTOR WHO PORTRAYED SERGEANT FRIDAY ON “DRAGNET”?", "WEBB", 0.0],
  ["WHAT WAS THE LAST NAME OF THE ACTOR WHO PORTRAYED THE FATHER ON THE TELEVISION SHOW “FATHER KNOWS BEST”?", "YOUNG", 0.0],
  ["WHAT WAS THE LAST NAME OF THE VENTRILOQUIST WHO PROVIDED THE VOICE FOR CHARLIE MCCARTHY?", "BERGEN", 0.0],
  ["WHAT WAS THE LAST NAME OF THE CAPTAIN OF THE BRITISH SHIP “BOUNTY” WHEN THE MUTINY OCCURRED?", "BLIGH", 0.0],
  ["WHAT IS THE LAST NAME OF THE INVENTOR OF THE STEAMBOAT “CLERMONT”?", "FULTON", 0.0],
  ["WHAT IS THE NAME OF GERMANY’S LARGEST BATTLESHIP THAT WAS SUNK IN WORLD WAR II?", "BISMARCK", 0.0],
  ["WHAT IS THE LAST NAME OF THE JUDGE WHO WAS KNOWN AS “THE LAW WEST OF THE PECOS”?", "BEAN", 0.0],
  ["WHAT IS JOHN KENNETH GALBRAITH’S PROFESSION?", "ECONOMIST", 0.0],
  ["WHAT WAS THE NAME OF THE UNION IRONCLAD SHIP THAT FOUGHT THE CONFEDERATE IRONCLAD MERRIMACK?", "MONITOR", 0.0],
  ["WHAT IS THE LAST NAME OF THE DOCTOR WHO PERFORMED THE FIRST SUCCESSFUL HUMAN HEART TRANSPLANT?", "BARNARD", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO SAID “I ONLY REGRET THAT I HAVE BUT ONE LIFE TO LOSE FOR MY COUNTRY”?", "HALE", 0.0],
  ["WHAT IS THE LAST NAME OF THE PILOT OF THE U-2 SPY PLANE SHOT DOWN OVER RUSSIA IN 1960?", "POWERS", 0.0],
  ["WHAT IS THE LAST NAME OF THE ACTOR WHO PORTRAYED THE SHERIFF IN THE MOVIE “HIGH NOON”?", "COOPER", 0.0],
  ["WHAT IS THE NAME OF THE MOUNTAIN RANGE THAT SEPARATES ASIA FROM EUROPE?", "URAL", 0.0],
  ["WHAT IS THE LAST NAME OF THE BOXER WHO WAS KNOWN AS THE “MANASSA MAULER”?", "DEMPSEY", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO CREATED THE COMIC STRIP “LI’L ABNER”?", "CAPP", 0.0],
  ["WHAT IS THE LAST NAME OF THE BASEBALL PLAYER WHO PITCHED A PERFECT GAME IN THE 1956 WORLD SERIES?", "LARSEN", 0.0],
  ["WHAT IS THE LAST NAME OF THE FIRST MAN TO RUN THE MILE IN UNDER FOUR MINUTES?", "BANNISTER", 0.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR WHO WROTE “BROTHERS KARAMAZOV”?", "DOSTOYEVSKI", 0.0],
  ["WHAT IS THE NAME OF THE AUTHOR WHO RECEIVED A PULITZER PRIZE FOR HIS WRITINGS ABOUT ABRAHAM LINCOLN?", "SANDBURG", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO CREATED THE COMIC STRIP “WOODY WOODPECKER”?", "LANTZ", 0.0],
  ["WHAT IS THE NAME OF THE INSTRUMENT USED TO MEASURE WIND SPEED?", "ANEMOMETER", 0.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR OF “OUR TOWN”?", "WILDER", 0.0],
  ["WHAT IS THE LAST NAME OF THE SINGER WHO MADE A HIT RECORDING OF THE SONG “WHO’S SORRY NOW”?", "FRANCIS", 0.0],
  ["WHAT IS THE LAST NAME OF THE CUBAN LEADER THAT CASTRO OVERTHREW?", "BATISTA", 0.0],
  ["WHAT IS THE NAME OF THE RUBBER ROLLER ON A TYPEWRITER?", "PLATEN", 0.0],
  ["WHAT WAS THE NAME OF THE LARGEST CONFEDERATE MILITARY PRISON DURING THE CIVIL WAR?", "ANDERSONVILLE", 0.0],
  ["WHAT IS THE LAST NAME OF THE AUTHOR OF “THE AGONY AND THE ECSTASY”?", "STONE", 0.0],
  ["WHAT IS THE LAST NAME OF FLASH’S GIRLFRIEND IN THE COMIC STRIP “FLASH GORDON”?", "ARDEN", 0.0],
  ["WHAT IS THE NAME OF THE FIRST MOVIE TO RECEIVE THE ACADEMY AWARD FOR BEST PICTURE?", "WINGS", 0.0],
  ["WHAT IS THE LAST NAME OF THE DISCOVERER OF THE VACCINATION FOR SMALLPOX?", "JENNER", 0.0],
  ["WHAT IS THE LAST NAME OF THE BOY IN THE BOOK “TREASURE ISLAND”?", "HAWKINS", 0.0],
  ["WHAT IS THE LAST NAME OF THE BOXER WHO WON THE BOXING TITLE FROM JOHN L. SULLIVAN?", "CORBETT", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WROTE THE SONG “HOW DEEP IS THE OCEAN”?", "BERLIN", 0.0],
  ["WHAT WAS THE LAST NAME OF BILLY THE KID?", "BONNEY", 0.0],
  ["WHAT IS THE LAST NAME OF THE SINGER WHOSE THEME SONG WAS “WHEN THE BLUE OF THE NIGHT MEETS THE GOLD OF THE DAY”?", "CROSBY", 0.0],
  ["FROM WHAT MUSICAL IS THE SONG “BAUBLES BANGLES AND BEADS”?", "KISMET", 0.0],
  ["WHAT WAS THE LAST NAME OF THE ACTOR WHO PORTRAYED DR. WATSON IN THE SHERLOCK HOLMES SERIES?", "BRUCE", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WAS MOST RESPONSIBLE FOR PHOTOGRAPHING THE U.S. CIVIL WAR?", "BRADY", 0.0],
  ["WHAT IS THE NAME OF A NUMBER TWO WOOD IN GOLF?", "BRASSIE", 0.0],
  ["WHAT IS THE LAST NAME OF THE POET WHO WROTE THE LINE “INTO EACH LIFE A LITTLE RAIN MUST FALL”?", "LONGFELLOW", 0.0],
  ["WHAT WAS THE NAME OF GENE AUTRY’S HORSE?", "CHAMPION", 0.0],
  ["WHAT IS THE NAME OF THE TOWN THROUGH WHICH LADY GODIVA SUPPOSEDLY MADE HER FAMOUS RIDE?", "COVENTRY", 0.0],
  ["WHAT IS THE LAST NAME OF THE FIRST WOMAN TO SWIM ACROSS THE ENGLISH CHANNEL?", "EDERLE", 0.0],
  ["WHAT IS THE LAST NAME OF THE FIRST FLIER TO FLY SOLO AROUND THE WORLD?", "POST", 0.0],
  ["WHAT IS THE LAST NAME OF THE MAN WHO WROTE THE POEM “IT COULDN’T BE DONE”?", "GUEST", 0.0],
  ["WHO WAS THE RACEHORSE OF THE YEAR FOR MANY SUCCESSIVE YEARS IN THE 1960S?", "KELSO", 0.0],
  ["WHAT IS THE HIGHEST MOUNTAIN IN SOUTH AMERICA?", "ACONCAGUA", 0.0]
];

angular
.module('QuizApp', [])
.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}])
.controller('QuizCtrl', ['$scope', ($scope) => {
    $scope.data = data;
    $scope.score = 0;
    $scope.index = -1;
    $scope.solution = false;
    $scope.color = 'black';
    $scope.error = '';

    $scope.start = () => {
        $scope.index = 0;
    }

    $scope.skip = () => {
        $scope.solution = true;
        $scope.color = 'black';
    }

    $scope.submit = (value) => {
        if (!value || !value.trim()) {
          $scope.error = 'Please enter an answer.'
          return;
        };

        const query = value.trim().toUpperCase();
        if (query.indexOf(' ') > 0) {
          $scope.error = 'Please enter a single-word answer.'
          return;
        }
        const answer = $scope.data[$scope.index][1];
        const minDist = answer.length < 8 ? 2 : 3;
        if (levenshteinDistance(query, answer) <= minDist) {
            $scope.color = 'green';
            $scope.score++;
        } else {
            $scope.color = 'red';
        }
        $scope.solution = true;
    }

    $scope.next = () => {
        $scope.index++;
        $scope.error = '';
        $scope.solution = false;
    }
}]);

// https://github.com/trekhleb/javascript-algorithms
function levenshteinDistance(a, b) {
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  return distanceMatrix[b.length][a.length];
}