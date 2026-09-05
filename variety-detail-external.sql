-- ============================================================
-- Variety detail standardization: care tip, origin
-- + rewritten description/features/size to a consistent standard
-- across all plant_varieties rows.
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
--
-- Safe to run more than once (every statement is idempotent: `add column
-- if not exists`, and each `update` sets the same literal values again).
-- ============================================================

alter table public.plant_varieties add column if not exists care_tip jsonb;
alter table public.plant_varieties add column if not exists origin jsonb;

comment on column public.plant_varieties.care_tip is
  'A tip specific to this variety, distinct from the parent plant''s general care.th/en fields.';
comment on column public.plant_varieties.origin is
  'Native range or provenance of this variety.';


update public.plant_varieties set
  description = '{"th":"เฟิร์นบอสตันเป็นเฟิร์นยอดนิยมที่สุดในตลาด ใบขนนกสีเขียวสดยาวห้อยลงเป็นพวงสวยงาม นิยมปลูกในกระถางแขวนหน้าบ้านหรือระเบียง นอกจากความสวยงามยังช่วยฟอกอากาศในบ้านได้ดีมาก","en":"Boston fern is the most popular fern on the market, with long feathery bright-green fronds cascading in a full clump — ideal for hanging baskets on a porch and an excellent natural air purifier."}',
  features = '{"th":"ใบขนนกห้อยยาว, ฟอกอากาศดีเยี่ยม, ปลูกในกระถางแขวนได้, โตเร็ว","en":"Long feathery cascading fronds, excellent air purifier, great for hanging baskets, fast growing"}',
  size = '{"th":"กว้าง 60-90 ซม.","en":"60-90 cm wide"}',
  bloom_season = null,
  care_tip = '{"th":"ต้องการความชื้นสูงเป็นพิเศษ ควรพ่นละอองน้ำที่ใบทุกวันหรือวางถาดกรวดใต้กระถาง ไม่เช่นนั้นปลายใบจะกรอบแห้งเร็วกว่าเฟิร์นชนิดอื่น","en":"Needs extra-high humidity — mist the fronds daily or set the pot on a pebble tray, or the frond tips will brown faster than most other ferns."}',
  origin = '{"th":"อเมริกากลางและอเมริกาใต้","en":"Central and South America"}'
where id = 'fern-boston';

update public.plant_varieties set
  description = '{"th":"เฟิร์นก้านดำมีใบเล็กบางรูปพัดเรียงตัวละเอียดบนก้านสีดำเงางาม ดูบอบบางอ่อนช้อยแต่สวยงามเป็นพิเศษ ต้องการความชื้นสูงและการดูแลใส่ใจมากกว่าเฟิร์นทั่วไป จึงเหมาะกับผู้ที่มีเวลาดูแลสม่ำเสมอ","en":"Maidenhair fern has delicate fan-shaped leaflets arranged finely on glossy black stems — fragile-looking yet strikingly elegant, needing higher humidity and more attentive care than most ferns."}',
  features = '{"th":"ใบเล็กรูปพัดละเอียด, ก้านดำเงางาม, ดูหรูหราอ่อนช้อย, บอบบางต้องดูแลใกล้ชิด","en":"Fine fan-shaped leaflets, glossy black stems, elegant delicate look, fragile and needs close care"}',
  size = '{"th":"สูง 30-50 ซม.","en":"30-50 cm tall"}',
  bloom_season = null,
  care_tip = '{"th":"ห้ามให้ดินแห้งแม้แต่วันเดียว ใบจะกรอบและร่วงทันทีถ้าขาดน้ำ ควรวางในที่ร่มลมสงบ เพราะลมโกรกจะทำให้ใบบางเหี่ยวเร็ว","en":"Never let the soil dry out even for a day — leaflets crisp and drop almost immediately; place away from drafts, as its thin leaflets wilt quickly in moving air."}',
  origin = '{"th":"เขตร้อนชื้นทั่วโลก","en":"Tropical regions worldwide"}'
where id = 'fern-maidenhair';

update public.plant_varieties set
  description = '{"th":"เฟิร์นเขากวางมีใบสองแบบคือใบโล่ห่อหุ้มโคนต้นและใบสร้างสปอร์ที่แยกแขนงคล้ายเขากวาง เป็นพืชอิงอาศัยที่นิยมนำมาติดบนแผ่นไม้แขวนผนัง มีเอกลักษณ์โดดเด่นไม่เหมือนเฟิร์นชนิดอื่นเลย","en":"Staghorn fern has two leaf types — a shield frond wrapping the base and antler-shaped fertile fronds — an epiphyte often mounted on a wooden board, uniquely distinctive among ferns."}',
  features = '{"th":"ใบแยกแขนงคล้ายเขากวาง, ติดแผ่นไม้แขวนผนังได้, เป็นพืชอิงอาศัย, ทรงสวยแปลกตา","en":"Antler-shaped fertile fronds, wall-mountable on a board, epiphytic growth habit, uniquely striking shape"}',
  size = '{"th":"กว้าง 40-90 ซม.","en":"40-90 cm wide"}',
  bloom_season = null,
  care_tip = '{"th":"อย่าปลูกในดินธรรมดาเด็ดขาด ให้ใช้กาบมะพร้าวหรือมอสรัดติดแผ่นไม้แทน รดน้ำด้วยการแช่หรือฉีดพ่นแทนการรดโคนต้น","en":"Never pot it in regular soil — mount it on a board with coconut husk or sphagnum moss instead, and water by soaking or misting rather than pouring at the base."}',
  origin = '{"th":"ป่าเขตร้อนแอฟริกา เอเชียตะวันออกเฉียงใต้ และออสเตรเลีย","en":"Tropical forests of Africa, Southeast Asia and Australia"}'
where id = 'fern-staghorn';

update public.plant_varieties set
  description = '{"th":"เฟิร์นข้าหลวงมีใบกว้างเป็นมันเรียงตัวเป็นรูปดอกกุหลาบรอบจุดศูนย์กลาง ขอบใบเป็นคลื่นสวยงามเป็นเอกลักษณ์ ทนทานต่อสภาพแวดล้อมและดูแลง่ายกว่าเฟิร์นชนิดอื่นมาก จึงเหมาะกับมือใหม่","en":"Bird''s nest fern has broad glossy fronds arranged in a rosette around a central point, with a distinctive wavy edge — far hardier and easier to care for than most ferns, great for beginners."}',
  features = '{"th":"ใบกว้างเป็นมันเรียงเป็นวง, ขอบใบเป็นคลื่น, ทนทานดูแลง่าย, เหมาะมือใหม่","en":"Broad glossy rosette fronds, distinctive wavy edges, hardy and easy care, beginner-friendly"}',
  size = '{"th":"กว้าง 60-120 ซม.","en":"60-120 cm wide"}',
  bloom_season = null,
  care_tip = '{"th":"ห้ามรดน้ำหรือฉีดพ่นลงกลางกอโดยตรง เพราะน้ำขังกลางต้นจะทำให้เหง้าเน่า ให้รดรอบขอบกระถางแทน","en":"Never water or mist directly into the center rosette — trapped water there rots the crown; water around the pot''s edge instead."}',
  origin = '{"th":"เอเชียตะวันออกเฉียงใต้และออสเตรเลียเขตร้อน","en":"Southeast Asia and tropical Australia"}'
where id = 'fern-birdsnest';

update public.plant_varieties set
  description = '{"th":"เฟิร์นญี่ปุ่นโดดเด่นด้วยใบสีเงินอมม่วงแซมเส้นใบสีแดงเข้ม มีลวดลายเมทัลลิกสวยงามคล้ายภาพวาด เป็นเฟิร์นประดับที่มีสีสันมากที่สุดชนิดหนึ่งและค่อนข้างหายากในตลาด","en":"Japanese painted fern stands out with silver-purple fronds streaked with deep red veins, giving a painterly metallic sheen — one of the most colorful ornamental ferns and fairly rare to find."}',
  features = '{"th":"ใบสีเงินอมม่วง, ลวดลายเมทัลลิก, เส้นใบสีแดงเข้ม, หายากมีสีสันโดดเด่น","en":"Silver-purple fronds, metallic sheen pattern, deep red veining, rare and highly colorful"}',
  size = '{"th":"สูง 30-45 ซม.","en":"30-45 cm tall"}',
  bloom_season = null,
  care_tip = '{"th":"สีของใบจะสวยที่สุดเมื่อได้รับแสงรำไรพอเหมาะ ถ้าวางในที่มืดเกินไปสีเงินม่วงจะจางลงเป็นสีเขียวธรรมดา","en":"Frond color is most vivid with just the right amount of filtered light — too little light and the silver-purple sheen fades to plain green."}',
  origin = '{"th":"ญี่ปุ่น เกาหลี และเอเชียตะวันออก","en":"Japan, Korea and East Asia"}'
where id = 'fern-japanese';

update public.plant_varieties set
  description = '{"th":"เฟิร์นตีนกระต่ายมีรากเหง้าปุยนุ่มสีน้ำตาลอมเงินคล้ายเท้ากระต่ายห้อยคลานออกนอกขอบกระถาง ใบสีเขียวละเอียดอ่อนช้อย เป็นเฟิร์นที่มีเอกลักษณ์เฉพาะตัว เหมาะปลูกในกระถางแขวน","en":"Rabbit''s foot fern grows fuzzy silvery-brown rhizomes resembling rabbit''s feet that creep over the pot''s rim, paired with fine delicate green fronds — a distinctive fern ideal for hanging baskets."}',
  features = '{"th":"รากเหง้าปุยนุ่มคล้ายเท้ากระต่าย, ใบละเอียดอ่อนช้อย, เอกลักษณ์เฉพาะตัว, เหมาะกระถางแขวน","en":"Fuzzy rhizomes resembling rabbit''s feet, fine delicate fronds, unique character, great for hanging pots"}',
  size = '{"th":"กว้าง 40-60 ซม.","en":"40-60 cm wide"}',
  bloom_season = null,
  care_tip = '{"th":"ปล่อยให้รากเหง้าคลานคลุมผิวดินและห้อยออกนอกขอบกระถางได้เลย อย่ากลบดินทับรากเหง้าเพราะจะทำให้เน่า","en":"Let the rhizomes creep freely over the soil surface and spill past the rim — never bury them under soil, or they will rot."}',
  origin = '{"th":"เอเชียตะวันออกเฉียงใต้","en":"Southeast Asia"}'
where id = 'fern-rabbitsfoot';

update public.plant_varieties set
  description = '{"th":"มูนเกรฟเป็นแคคตัสด่างเหลืองนวลไร้คลอโรฟิลล์ ลำต้นทรงกลมสีเหลืองสดสะดุดตา ต้องต่อกิ่งบนตอตะบองเพชรสีเขียวเพื่อให้ได้รับสารอาหารเพราะสังเคราะห์แสงเองไม่ได้ เป็นแคคตัสประดับยอดนิยม","en":"Moon Glaive is a yellow-variegated, chlorophyll-free cactus with a striking bright yellow globular body, grafted onto a green cactus rootstock to survive since it cannot photosynthesize on its own — a popular ornamental cactus."}',
  features = '{"th":"ลำต้นกลมสีเหลืองสดไร้คลอโรฟิลล์, ต้องต่อกิ่งเพื่อความอยู่รอด, ดอกเล็กสีชมพู, ทรงกะทัดรัดเหมาะโต๊ะทำงาน","en":"Bright yellow chlorophyll-free globular body, must be grafted to survive, small pink flowers, compact desk-friendly size"}',
  size = '{"th":"สูง 3-6 ซม.","en":"3-6 cm tall"}',
  bloom_season = '{"th":"ตลอดปี ออกดอกเล็กสีชมพูประปราย","en":"Year-round, with occasional small pink flowers"}',
  care_tip = '{"th":"อายุขึ้นอยู่กับตอที่ต่อกิ่ง หากตอเริ่มเหี่ยวหรือแห้งต้องรีบต่อกิ่งใหม่บนตอสด ไม่เช่นนั้นส่วนยอดสีเหลืองจะตายตามไปด้วย","en":"Its lifespan depends entirely on the rootstock — if the stock starts withering, re-graft the yellow top onto a fresh rootstock immediately or it will die along with it."}',
  origin = '{"th":"พันธุ์ผสมที่พัฒนาในไต้หวันและญี่ปุ่น","en":"A hybrid cultivar developed in Taiwan and Japan"}'
where id = 'moon-glaive';

update public.plant_varieties set
  description = '{"th":"มะลิซ้อนมีกลีบดอกซ้อนกันหลายชั้นแน่นเป็นพวงกลม กลิ่นหอมแรงและติดทนนาน นิยมใช้ทำพวงมาลัยและร้อยมาลัยมากที่สุดในไทย ออกดอกได้ตลอดปีจึงเป็นมะลิที่ได้รับความนิยมสูงสุด","en":"Double Arabian Jasmine has densely layered petals forming a round cluster, with a strong, long-lasting fragrance — the most popular jasmine in Thailand for garlands, blooming year-round."}',
  features = '{"th":"กลีบดอกซ้อน 2-3 ชั้น, กลิ่นหอมแรงติดทน, ออกดอกตลอดปี, นิยมทำพวงมาลัย","en":"2-3 layered petals, strong long-lasting fragrance, blooms year-round, popular for garlands"}',
  size = '{"th":"สูง 1-2 เมตร","en":"1-2 m tall"}',
  bloom_season = '{"th":"ตลอดปี (มากในฤดูร้อน)","en":"Year-round (peak in summer)"}',
  care_tip = '{"th":"ตัดแต่งกิ่งหลังดอกโรยทุกรอบเพื่อกระตุ้นการแตกยอดใหม่ ถ้าไม่ตัดแต่งเลยดอกจะเล็กลงและออกน้อยลงเรื่อยๆ","en":"Prune after each bloom flush to trigger new shoots — skip pruning and flowers gradually shrink and become sparser over time."}',
  origin = '{"th":"เอเชียใต้ (อินเดียและศรีลังกา)","en":"South Asia (India and Sri Lanka)"}'
where id = 'jasmine-double';

update public.plant_varieties set
  description = '{"th":"มะลิลามีกลีบดอกชั้นเดียวเรียบง่าย ดอกเล็กกว่ามะลิซ้อนแต่กลิ่นหอมอ่อนละมุน นิยมใช้ลอยน้ำบูชาพระหรือใส่ในน้ำอบไทย เป็นมะลิพื้นบ้านที่ปลูกกันมานาน","en":"Jasmine La has simple single-layer petals, with smaller flowers than double jasmine but a softer, milder fragrance — traditionally floated in water for worship or used in Thai scented water."}',
  features = '{"th":"กลีบเดี่ยวเรียบง่าย, ดอกเล็กกลิ่นอ่อนหวาน, ใช้ลอยน้ำบูชาพระ, ปลูกง่ายทนทาน","en":"Simple single petals, small flowers with soft sweet scent, used for water offerings, easy and hardy to grow"}',
  size = '{"th":"สูง 0.5-1.5 เมตร","en":"0.5-1.5 m tall"}',
  bloom_season = '{"th":"ตลอดปี","en":"Year-round"}',
  care_tip = '{"th":"ทนแล้งได้ดีกว่ามะลิพันธุ์อื่น รดน้ำห่างได้บ้างโดยดอกไม่ร่วง เหมาะปลูกในกระถางริมระเบียงที่รดน้ำไม่สม่ำเสมอ","en":"More drought-tolerant than other jasmine varieties — flowers won''t drop even with irregular watering, making it forgiving for a balcony pot."}',
  origin = '{"th":"เอเชียใต้ ปลูกแพร่หลายในไทยมานาน","en":"South Asia, long cultivated across Thailand"}'
where id = 'jasmine-la';

update public.plant_varieties set
  description = '{"th":"มะลิหลวงมีดอกขนาดใหญ่กว่ามะลิทั่วไปเกือบเท่าตัว กลีบหนาแข็งแรงและกลิ่นหอมจัดกว่าพันธุ์อื่น เป็นมะลิพันธุ์หายากที่มีคุณค่าและราคาสูง มักปลูกเป็นไม้สะสม","en":"Grand Jasmine bears flowers nearly twice the size of common jasmine, with thick sturdy petals and a more intense fragrance — a rare, prized variety often kept as a collector''s plant."}',
  features = '{"th":"ดอกใหญ่กว่าพันธุ์ทั่วไป, กลีบหนาแข็งแรง, กลิ่นหอมจัด, พันธุ์หายากราคาสูง","en":"Larger flowers than common varieties, thick sturdy petals, intense fragrance, rare and valuable"}',
  size = '{"th":"สูง 1-3 เมตร","en":"1-3 m tall"}',
  bloom_season = '{"th":"ฤดูร้อนถึงฤดูฝน","en":"Summer through rainy season"}',
  care_tip = '{"th":"ต้องการแดดจัดเต็มวันจึงจะออกดอกใหญ่สมชื่อ ถ้าปลูกในที่ร่มดอกจะเล็กลงและบางลงจนไม่ต่างจากมะลิทั่วไป","en":"Needs full, all-day sun to produce its signature large blooms — grown in shade, flowers shrink to look no different from common jasmine."}',
  origin = '{"th":"พันธุ์คัดพิเศษของไทย","en":"A prized cultivar selected in Thailand"}'
where id = 'jasmine-luang';

update public.plant_varieties set
  description = '{"th":"มะลิวัลย์เป็นไม้เลื้อยเนื้อแข็งที่เลื้อยพันได้ไกล ดอกรูปดาวห้าแฉกสีขาวกลิ่นหอมอ่อน นิยมปลูกเลื้อยตามรั้วบ้านหรือทำซุ้มประตูให้ร่มเงาและความหอมไปพร้อมกัน","en":"Star Jasmine is a woody climbing vine that can spread far, with white star-shaped flowers and a mild fragrance — often trained along fences or arches for shade and scent together."}',
  features = '{"th":"ไม้เลื้อยเนื้อแข็ง, ดอกรูปดาวห้าแฉก, กลิ่นหอมอ่อน, ทำซุ้มหรือรั้วได้","en":"Woody climbing vine, five-pointed star-shaped flowers, mild fragrance, good for arches or fences"}',
  size = '{"th":"เลื้อยยาว 3-5 เมตร","en":"climbs 3-5 m"}',
  bloom_season = '{"th":"ฤดูร้อน","en":"Summer"}',
  care_tip = '{"th":"ต้องมีโครงหรือรั้วให้เกาะเลื้อยตั้งแต่ต้นเล็ก เพราะเถาจะแข็งและจัดทรงยากขึ้นเมื่อโตเต็มที่","en":"Give it a trellis or fence to climb from a young age — the vine stiffens and becomes hard to train once fully grown."}',
  origin = '{"th":"เอเชียตะวันออกเฉียงใต้","en":"Southeast Asia"}'
where id = 'jasmine-wan';

update public.plant_varieties set
  description = '{"th":"มะลิพวงออกดอกเป็นช่อพวงห้อยลงมา ดอกเล็กจำนวนมากบานพร้อมกันเป็นกลุ่มสวยงาม กลิ่นหอมหวานอบอวล เหมาะปลูกประดับสวนหรือปลูกเป็นไม้ประธานให้ร่มเงาดอกไม้","en":"Cluster Jasmine blooms in hanging clusters of many small flowers opening together in a striking group, with a sweet lingering fragrance — great as a garden feature or shade-flowering centerpiece."}',
  features = '{"th":"ดอกเป็นช่อพวงห้อย, จำนวนมากบานพร้อมกัน, กลิ่นหอมหวาน, เหมาะไม้ประดับสวน","en":"Hanging clustered blooms, many flowers opening together, sweet fragrance, great garden ornamental"}',
  size = '{"th":"สูง 1-2 เมตร","en":"1-2 m tall"}',
  bloom_season = '{"th":"ฤดูร้อนถึงฤดูฝน","en":"Summer through rainy season"}',
  care_tip = '{"th":"ตัดแต่งทรงพุ่มให้โปร่งเป็นประจำ เพราะกิ่งที่แน่นทึบจะทำให้ช่อดอกออกน้อยลงและเสี่ยงโรคเชื้อราจากความชื้นสะสม","en":"Thin the canopy regularly — a dense crown produces fewer flower clusters and traps humidity that invites fungal disease."}',
  origin = '{"th":"เอเชียตะวันออกเฉียงใต้","en":"Southeast Asia"}'
where id = 'jasmine-puang';

update public.plant_varieties set
  description = '{"th":"มะลิฉัตรมีกลีบดอกซ้อนกันเป็นชั้นๆ ลดหลั่นคล้ายฉัตรของไทย รูปทรงดอกสวยงามแปลกตากว่ามะลิทั่วไป นิยมปลูกเป็นไม้มงคลประจำบ้านเพื่อความเป็นสิริมงคล","en":"Tiered Jasmine has petals layered in graduated tiers resembling a traditional Thai ceremonial umbrella, a strikingly distinctive shape compared to common jasmine — often grown as an auspicious house plant."}',
  features = '{"th":"กลีบซ้อนเป็นชั้นคล้ายฉัตร, ทรงดอกแปลกตาสวยงาม, ไม้มงคลประจำบ้าน, กลิ่นหอมปานกลาง","en":"Tiered layered petals like a ceremonial umbrella, uniquely striking bloom shape, auspicious house plant, moderate fragrance"}',
  size = '{"th":"สูง 0.5-1.5 เมตร","en":"0.5-1.5 m tall"}',
  bloom_season = '{"th":"ฤดูร้อน","en":"Summer"}',
  care_tip = '{"th":"ดอกทรงฉัตรที่สมบูรณ์ต้องการดินร่วนระบายน้ำดีและปุ๋ยฟอสฟอรัสสูงช่วงก่อนออกดอก มิเช่นนั้นกลีบจะซ้อนไม่เป็นชั้นชัดเจน","en":"Well-formed tiered blooms need loose well-draining soil and a phosphorus-rich feed before flowering, or the petal layers won''t form distinctly."}',
  origin = '{"th":"พันธุ์คัดพิเศษของไทย","en":"A prized cultivar selected in Thailand"}'
where id = 'jasmine-chat';

update public.plant_varieties set
  description = '{"th":"พุทธชาดมีดอกสีขาวกลีบหมุนเวียนคล้ายกังหันลม กลิ่นหอมเย็นสดชื่นต่างจากมะลิพันธุ์อื่น นิยมปลูกประดับบ้านและใช้ดอกในพิธีทางศาสนาและงานมงคล","en":"Crape Jasmine has white pinwheel-shaped flowers with petals that spiral like a windmill, and a cool refreshing fragrance unlike other jasmines — popular for home decoration and religious ceremonies."}',
  features = '{"th":"กลีบหมุนคล้ายกังหันลม, กลิ่นหอมเย็นสดชื่น, ใช้ในพิธีทางศาสนา, ปลูกประดับได้ทั้งปี","en":"Pinwheel-spiraled petals, cool refreshing fragrance, used in religious ceremonies, ornamental year-round"}',
  size = '{"th":"สูง 1-3 เมตร","en":"1-3 m tall"}',
  bloom_season = '{"th":"ตลอดปี","en":"Year-round"}',
  care_tip = '{"th":"ทนแดดจัดและดินแห้งได้ดีกว่ามะลิสกุลอื่น เหมาะปลูกกลางแจ้งริมทางเดินโดยไม่ต้องดูแลใกล้ชิด","en":"More tolerant of full sun and dry soil than true jasmines — suits an outdoor spot along a walkway without needing close attention."}',
  origin = '{"th":"เอเชียตะวันออกเฉียงใต้","en":"Southeast Asia"}'
where id = 'jasmine-putchad';

notify pgrst, 'reload schema';

-- ---------- Verify ----------
-- Expect 14 rows, every one with care_tip/origin filled in, and no
-- description shorter than ~100 chars (the moon-glaive stub is what this fixes).
select
  id, plant_id,
  length(description->>'th') as desc_len,
  (care_tip is not null) as has_tip,
  (origin is not null) as has_origin,
  bloom_season is not null as has_bloom
from public.plant_varieties
order by plant_id, sort_order;

