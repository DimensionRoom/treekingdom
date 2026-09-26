-- ============================================================
-- Add ten Begonia varieties
-- Run in: SQL Editor of https://mcinlbefwyysuljrluln.supabase.co
-- Run plant-begonia.sql first: it creates the plant and 'White Ice'
-- (sort_order 0). These follow at 1-10 in the order requested.
--
-- Two names needed care:
--
--   * "sp. Trang (kingiana)". The begonia sold as sp. Trang was described in
--     2024 as a new species, B. tanjiewhoei Phutthai & M.Hughes, from Pa Lien
--     District, Trang. B. kingiana is a different species that also grows in
--     Trang; the description says the two are distinct. The row is named
--     for what the plant is now.
--
--   * 'Candy Stripes'. Two different plants are sold under this name, an
--     Asian rhizomatous hybrid and a rex begonia. This row is the Asian
--     hybrid, as described by Steve's Leaves; its parentage is unknown.
--
-- Where the botanical literature gives no cultivation detail, care tips come
-- from habitat notes or specialist nurseries and say no more than those do.
-- size, bloom_season and care_tip are left null wherever no source gives
-- them; the variety sheet hides an empty field.
--
-- Sources:
--   brevirimosa exotica  M.C. Tebbitt, "Three new species and a new subspecies
--                        of Begonia from Asia", Edinburgh Journal of Botany
--   candy stripes        stevesleaves.com/products/begonia-candy-stripe
--   burkillii            begonias.org/begonia-burkillii/ ; POWO (native range)
--   roseopunctata        POWO / MyBIS: Kiew, Sandakania 20: 146 (2015)
--   mirage               davesgarden.com/guides/pf/go/150686 ;
--                        kartuz.com (Begonia Mirage)
--   taiwaniana           Flora of China / Digital Flora of Taiwan (efloras.org)
--   amphioxus            en.wikipedia.org/wiki/Begonia_amphioxus (Sands 1990)
--   darthvaderiana       Lin, Chung & Peng, Phytotaxa 191(1) (2014) ;
--                        indefenseofplants.com/blog/2015/12/2/the-darth-vader-begonia
--   chloroneura          POWO (Wilkie & Sands, New Plantsman 6(3), 1999) ;
--                        stevesleaves.com/products/begonia-chloroneura
--   sp. Trang            ipni.org/n/77347546-1 ; en.wikipedia.org/wiki/Begonia_kingiana ;
--                        flora-magnifica.com/product/begonia-sp-trang-tanjiewhoei/
--
-- Safe to run more than once.
-- ============================================================

insert into public.plant_varieties
  (id, plant_id, emoji, name, description, features, size, bloom_season, care_tip, images, sort_order)
values

-- 1. Begonia brevirimosa subsp. exotica ------------------------------------
(
  'begonia-brevirimosa-exotica',
  'begonia',
  '',
  jsonb_build_object('th', 'เบรวิริโมซา เอ็กโซติก้า พิงก์', 'en', 'Begonia brevirimosa subsp. exotica'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดย่อยจากปาปัวนิวกินี พบตามธรรมชาติในเขตเทือกเขาตอนกลางของจังหวัดเวสเทิร์นไฮแลนด์ส ที่ความสูง 1,160-1,525 เมตรจากระดับน้ำทะเล จัดอยู่ในกลุ่มต้นแบบลำอ้อย ใบเป็นรูปไข่ ปลายใบเรียวแหลม ขอบใบจักฟัน และผิวใบด้านบนมีแถบสีชมพูหรือม่วงเป็นมัน ซึ่งเป็นลักษณะที่ใช้แยกจากชนิดย่อยต้นแบบที่ใบมีเพียงจุดสีชมพูหรือม่วง ชื่อ exotica มาจาก Alfred B. Graf ที่ตั้งเป็นชื่อเรียกชั่วคราวเมื่อปี 1960 หลังเก็บต้นมาจากนิวกินี ต่อมา M.C. Tebbitt ใช้ชื่อนี้ต่อเมื่อบรรยายเป็นชนิดย่อยอย่างเป็นทางการ',
    'en', 'A subspecies from Papua New Guinea, found wild in the Central Range of Western Highlands Province at 1,160-1,525 m. It grows as a cane-like begonia. The leaves are ovate with gradually tapering tips and toothed margins, and their upper surface carries glossy pink or purple bands; the typical subspecies has only pink or purple spots. Alfred B. Graf coined the name exotica in 1960 as a temporary label for a plant he collected in New Guinea, and M.C. Tebbitt kept it when he formally described the subspecies.'
  ),
  jsonb_build_object(
    'th', 'ใบรูปไข่ปลายเรียวแหลม, แถบสีชมพูเป็นมันบนใบ, ขอบใบจักฟัน, ต้นแบบลำอ้อย',
    'en', 'Ovate, tapering leaves, glossy pink bands, toothed margins, cane-like habit'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ต้องการความชื้นสูง จึงเหมาะกับการปลูกในตู้หรือโรงเรือนที่ควบคุมความชื้นได้',
    'en', 'Needs high humidity, so it does best in a terrarium or a humid greenhouse.'
  ),
  '{}'::text[],
  1
),

-- 2. 'Candy Stripes' --------------------------------------------------------
(
  'begonia-candy-stripes',
  'begonia',
  '',
  jsonb_build_object('th', 'แคนดี้สไตรป์', 'en', 'Begonia ''Candy Stripes'''),
  jsonb_build_object(
    'th', 'บีโกเนียลูกผสมจากเอเชียที่ไม่ทราบคู่ผสม ใบสีเขียวเข้มมีลายเส้นสีชมพูพาดไปทั่วใบ และลายจะเด่นชัดขึ้นเมื่อต้นโตเต็มที่ ต้นมีขนาดกะทัดรัด เหมาะกับกระถางเล็ก ชื่อ Candy Stripes ยังถูกใช้เรียกบีโกเนียเร็กซ์อีกพันธุ์หนึ่งด้วย ซึ่งเป็นคนละต้นกัน',
    'en', 'An Asian hybrid of unknown parentage. Its dark green leaves are striped with pink, and the pattern grows bolder as the plant matures. It stays compact enough for a small pot. The same name is also used for an unrelated rex begonia.'
  ),
  jsonb_build_object(
    'th', 'ใบเขียวเข้มลายเส้นสีชมพู, ลายชัดขึ้นเมื่อต้นโต, ต้นกะทัดรัด',
    'en', 'Dark green leaves with pink stripes, pattern bolder with age, compact habit'
  ),
  jsonb_build_object('th', 'สูงราว 20-30 ซม.', 'en', 'About 20-30 cm (8-12 in) tall'),
  null,
  jsonb_build_object(
    'th', 'ชอบที่ร่มถึงแดดรำไรและความชื้นในอากาศ 60% ขึ้นไป ปล่อยให้ดินค่อนข้างแห้งก่อนรดน้ำครั้งถัดไป',
    'en', 'Likes shade to part sun and humidity of 60% or more. Let the soil get fairly dry between waterings.'
  ),
  '{}'::text[],
  2
),

-- 3. Begonia burkillii ------------------------------------------------------
(
  'begonia-burkillii',
  'begonia',
  '',
  jsonb_build_object('th', 'เบอร์คิลลิไอ', 'en', 'Begonia burkillii'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้ มีถิ่นกำเนิดตั้งแต่รัฐอรุณาจัลประเทศของอินเดียไปจนถึงตอนเหนือของเมียนมา ในธรรมชาติขึ้นตามหน้าผาสูงชันในป่าทึบ ซึ่งมักยื่นออกเหนือลำธารและแม่น้ำสายเล็ก ๆ เป็นชนิดที่มีความแปรผันสูง จึงมีหลายฟอร์มในการปลูกเลี้ยง และลวดลายใบของแต่ละฟอร์มก็ต่างกันไป',
    'en', 'A true species native from Arunachal Pradesh in India to northern Myanmar. In the wild it grows on steep cliff faces in dense jungle, often overhanging small streams and rivers. It is a variable species with several forms in cultivation, and their leaf patterns differ.'
  ),
  jsonb_build_object(
    'th', 'ชนิดพันธุ์แท้จากอินเดียและเมียนมา, มีหลายฟอร์ม, ลายใบแตกต่างตามฟอร์ม',
    'en', 'True species from India and Myanmar, several forms in cultivation, leaf pattern varies by form'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ไม่ชอบให้ดินแห้ง ควรรักษาดินให้ชื้นอยู่เสมอแต่ไม่แฉะ และต้องการความชื้นในอากาศสูง ขยายพันธุ์ได้ง่ายด้วยการปักชำใบหรือชิ้นส่วนของใบ',
    'en', 'It dislikes drying out, so keep the soil lightly moist and the air humid. It propagates readily from leaves or leaf sections.'
  ),
  '{}'::text[],
  3
),

-- 4. Begonia roseopunctata --------------------------------------------------
(
  'begonia-roseopunctata',
  'begonia',
  '',
  jsonb_build_object('th', 'โรซีโอพังตาตา', 'en', 'Begonia roseopunctata'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้จากรัฐซาราวัก เกาะบอร์เนียว บรรยายโดย Ruth Kiew ในปี 2015 ชื่อชนิด roseopunctata แปลว่า "มีจุดสีชมพู" ตามลักษณะเด่นของใบ ใบเป็นรูปไข่กว้าง มีจุดสีขาวถึงชมพูกระจายทั่วแผ่นใบ ต้นมีขนาดเล็ก จึงนิยมปลูกในตู้เลี้ยงต้นไม้',
    'en', 'A true species from Sarawak, Borneo, described by Ruth Kiew in 2015. The name roseopunctata means "rose-spotted", after its broadly ovate leaves scattered with white to pink spots. It stays small, which makes it a popular terrarium plant.'
  ),
  jsonb_build_object(
    'th', 'ใบรูปไข่กว้าง, จุดสีขาวถึงชมพูทั่วใบ, ต้นเล็ก เหมาะกับตู้',
    'en', 'Broadly ovate leaves, white to pink spots, small, suits a terrarium'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ต้องการความชื้นในอากาศสูงและแสงรำไร จึงเหมาะกับการปลูกในตู้',
    'en', 'Needs high humidity and soft light, so it suits a terrarium.'
  ),
  '{}'::text[],
  4
),

-- 5. 'Mirage' ---------------------------------------------------------------
(
  'begonia-mirage',
  'begonia',
  '',
  jsonb_build_object('th', 'มิราจ', 'en', 'Begonia ''Mirage'''),
  jsonb_build_object(
    'th', 'บีโกเนียลูกผสมกลุ่มเหง้า (rhizomatous) ผสมโดย Worley และเปิดตัวในปี 1984 ใบขนาดกลางเป็นสีเงินอมขาวนวลแต้มสีชมพู แล้วค่อย ๆ เปลี่ยนเป็นสีเงินเมื่อใบแก่ เป็นพันธุ์ต้นเตี้ย สูงไม่ถึง 30 ซม. และมีดอกสีชมพูอ่อน',
    'en', 'A rhizomatous hybrid bred by Worley and introduced in 1984. Its medium-sized leaves open milky silver flushed with pink and mature to silver. It is a dwarf, under 30 cm tall, with light pink flowers.'
  ),
  jsonb_build_object(
    'th', 'ใบสีเงินแต้มชมพู, ใบแก่เป็นสีเงิน, ต้นเตี้ย, ดอกชมพูอ่อน',
    'en', 'Silver leaves flushed pink, maturing to silver, dwarf habit, light pink flowers'
  ),
  jsonb_build_object('th', 'ต้นเตี้ย สูงไม่ถึง 30 ซม.', 'en', 'Dwarf, under 30 cm (12 in)'),
  jsonb_build_object('th', 'ฤดูหนาว', 'en', 'Winter'),
  jsonb_build_object(
    'th', 'ปลูกใต้แสงไฟปลูกต้นไม้ได้ดี',
    'en', 'Grows well under fluorescent grow lights.'
  ),
  '{}'::text[],
  5
),

-- 6. Begonia taiwaniana -----------------------------------------------------
(
  'begonia-taiwaniana',
  'begonia',
  '',
  jsonb_build_object('th', 'ไต้หวันนิอานา', 'en', 'Begonia taiwaniana'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้ที่เป็นพืชเฉพาะถิ่นของไต้หวัน พบทางตอนใต้ของเกาะ ขึ้นตามพื้นป่าใต้ร่มไม้ บรรยายโดย Hayata ต้นมีเหง้าสั้นและอวบ ลำต้นสูง 40-200 ซม. แตกกิ่งสองชั้นขึ้นไป และเกลี้ยงไม่มีขน ใบรูปใบหอก ฐานใบเบี้ยว ยาว 6-14 ซม. กว้าง 1.5-4 ซม. สีเขียว บางครั้งมีจุดสีขาว ใต้ใบมักเป็นสีแดง ขอบใบจักซี่ฟันไม่สม่ำเสมอ ดอกเพศผู้สีขาวถึงชมพูอ่อน',
    'en', 'A true species endemic to Taiwan, found in the south of the island in the forest understorey; Hayata described it. It has short, stout rhizomes and hairless stems 40-200 cm tall that branch two or more times. The leaves are lance-shaped and lopsided at the base, 6-14 cm long and 1.5-4 cm wide, green and sometimes dotted white, often reddish beneath, with irregularly toothed margins. The male flowers are white to pinkish.'
  ),
  jsonb_build_object(
    'th', 'พืชเฉพาะถิ่นไต้หวัน, ใบรูปใบหอก บางต้นมีจุดขาว, ใต้ใบสีแดง, ดอกขาวถึงชมพูอ่อน',
    'en', 'Endemic to Taiwan, lance-shaped leaves sometimes dotted white, reddish undersides, white to pinkish flowers'
  ),
  jsonb_build_object('th', 'ลำต้นสูง 40-200 ซม.', 'en', 'Stems 40-200 cm tall'),
  null,
  null,
  '{}'::text[],
  6
),

-- 7. Begonia amphioxus ------------------------------------------------------
(
  'begonia-amphioxus',
  'begonia',
  '',
  jsonb_build_object('th', 'แอมฟิออกซัส', 'en', 'Begonia amphioxus'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้จากรัฐซาบาห์ เกาะบอร์เนียว พบครั้งแรกในปี 1984 บนเขาหินปูนลูกเล็กชื่อบาตูปุงกุล และบรรยายโดย Sands ในปี 1990 ชื่อชนิดมาจากภาษากรีก แปลว่า "แหลมทั้งสองด้าน" ตามรูปใบที่เป็นรูปใบหอกและแหลมทั้งโคนและปลาย ใบยาว 5-12 ซม. ก้านใบติดอยู่กลางแผ่นใบ ใบสีเขียวมะกอกถึงเขียวกลาง มีจุดสีแดงกระจายทั่วใบและขอบใบสีแดง ต้นเป็นพุ่มสูงราว 40 ซม.',
    'en', 'A true species from Sabah, Borneo, first found in 1984 on the small limestone hill of Batu Punggul and described by Sands in 1990. The name is Greek for "sharp at both ends", after its lance-shaped leaves, which taper to a point at base and tip. The leaves are 5-12 cm long, with the stalk joined inside the blade, olive to mid-green with red spots and a red margin. It grows as a shrub about 40 cm tall.'
  ),
  jsonb_build_object(
    'th', 'ใบรูปใบหอกแหลมสองด้าน, ใบเขียวจุดแดง, ขอบใบสีแดง, ก้านใบติดกลางแผ่นใบ',
    'en', 'Lance-shaped leaves pointed at both ends, green with red spots, red margin, stalk joined inside the blade'
  ),
  jsonb_build_object('th', 'สูงราว 40 ซม.', 'en', 'About 40 cm tall'),
  null,
  jsonb_build_object(
    'th', 'ในธรรมชาติขึ้นบนหินปูนใต้ร่มเงาบางถึงร่มเงาทึบ ทั้งตามโคนหน้าผาและบนยอดโขดหิน',
    'en', 'In the wild it grows on limestone in light to full shade, at cliff bases and on top of outcrops.'
  ),
  '{}'::text[],
  7
),

-- 8. Begonia darthvaderiana -------------------------------------------------
(
  'begonia-darthvaderiana',
  'begonia',
  '',
  jsonb_build_object('th', 'ดาร์ธเวเดอเรียนา', 'en', 'Begonia darthvaderiana'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้จากรัฐซาราวัก เกาะบอร์เนียว บรรยายโดย Lin, Chung และ Peng ในปี 2014 จัดอยู่ในกลุ่ม Petermannia ซึ่งเป็นกลุ่มต้นแบบลำอ้อย ชื่อชนิดตั้งตามตัวละคร Darth Vader ใบสีเขียวเข้มจนดูเกือบดำ และมีดอกสีแดงเข้ม ในธรรมชาติขึ้นใต้ร่มเงาทึบของหน้าผาในป่า เป็นพืชที่หายาก',
    'en', 'A true species from Sarawak, Borneo, described by Lin, Chung and Peng in 2014. It belongs to section Petermannia, whose members are cane-like. It is named after Darth Vader. The leaves are so dark green that they look almost black, and the flowers are deep red. In the wild it grows in the deep shade of forested cliffs, and it is rare.'
  ),
  jsonb_build_object(
    'th', 'ใบเขียวเข้มเกือบดำ, ดอกสีแดงเข้ม, ต้นแบบลำอ้อย, หายาก',
    'en', 'Near-black leaves, deep red flowers, cane-like habit, rare'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ในธรรมชาติขึ้นใต้ร่มเงาทึบที่มีแสงส่องถึงน้อยมาก จึงไม่ควรให้โดนแสงแรง',
    'en', 'In the wild it grows in deep shade with very little light, so keep it out of strong light.'
  ),
  '{}'::text[],
  8
),

-- 9. Begonia chloroneura ----------------------------------------------------
(
  'begonia-chloroneura',
  'begonia',
  '',
  jsonb_build_object('th', 'คลอโรนิวรา', 'en', 'Begonia chloroneura'),
  jsonb_build_object(
    'th', 'บีโกเนียชนิดพันธุ์แท้จากเกาะลูซอน ประเทศฟิลิปปินส์ บรรยายโดย Wilkie และ Sands ในปี 1999 ชื่อชนิดแปลว่า "เส้นใบสีเขียว" ใบสีน้ำตาลอมแดง เส้นใบสีเขียวอมเหลืองสด และผิวใบมีขนสั้นสีแดง ต้นเป็นพุ่มแน่น',
    'en', 'A true species from Luzon in the Philippines, described by Wilkie and Sands in 1999. The name means "green-veined": its reddish-brown leaves carry bright chartreuse veins, and the surface has short red hairs. It grows into a full, bushy plant.'
  ),
  jsonb_build_object(
    'th', 'ใบสีน้ำตาลอมแดง, เส้นใบสีเขียวอมเหลือง, ผิวใบมีขนสั้นสีแดง',
    'en', 'Reddish-brown leaves, chartreuse veins, short red hairs on the surface'
  ),
  jsonb_build_object('th', 'สูงราว 25-30 ซม.', 'en', 'About 25-30 cm (10-12 in) tall'),
  null,
  jsonb_build_object(
    'th', 'ให้แสงสว่างแบบรำไร ต้องการความชื้นในอากาศ 60% ขึ้นไป จึงเหมาะกับการปลูกในตู้ รดน้ำเมื่อดินชั้นบนแห้งลึกราว 5 ซม.',
    'en', 'Give it bright indirect light and humidity of 60% or more; a terrarium suits it. Water when the top 5 cm of soil is dry.'
  ),
  '{}'::text[],
  9
),

-- 10. sp. Trang (B. tanjiewhoei) --------------------------------------------
(
  'begonia-sp-trang',
  'begonia',
  '',
  jsonb_build_object('th', 'สปีชีส์ตรัง', 'en', 'Begonia sp. Trang (B. tanjiewhoei)'),
  jsonb_build_object(
    'th', 'บีโกเนียที่ในวงการต้นไม้เคยรู้จักในชื่อ sp. Trang ในปี 2024 ได้รับการบรรยายเป็นชนิดใหม่ชื่อ Begonia tanjiewhoei โดยตัวอย่างต้นแบบเก็บจากอำเภอปะเหลียน จังหวัดตรัง ที่ความสูงราว 140 เมตรจากระดับน้ำทะเล ชื่อชนิดตั้งเป็นเกียรติแก่ Tan Jiew Hoe กรรมการของ Gardens by the Bay ประเทศสิงคโปร์ ชนิดนี้ต่างจาก Begonia kingiana ซึ่งเป็นอีกชนิดหนึ่งที่พบในจังหวัดตรังเช่นกัน เป็นบีโกเนียกลุ่มเหง้าที่ขึ้นบนเขาหินปูน ใบสีเขียวสลับเกือบดำ ก้านใบสีแดง และต้นเล็กกว่าบีโกเนียกลุ่มเหง้าหลายชนิด',
    'en', 'Long sold as sp. Trang, this begonia was described in 2024 as a new species, Begonia tanjiewhoei. Its type specimen came from Pa Lien District in Trang Province, Thailand, at about 140 m. The name honours Tan Jiew Hoe, a board director of Gardens by the Bay in Singapore. It is distinct from Begonia kingiana, another species that also grows in Trang. It is a rhizomatous begonia of limestone karst, with near-black and green leaves on red stalks, and stays smaller than many rhizomatous kinds.'
  ),
  jsonb_build_object(
    'th', 'ใบเขียวสลับเกือบดำ, ก้านใบสีแดง, ต้นเล็ก, ขึ้นบนเขาหินปูน',
    'en', 'Near-black and green leaves, red leaf stalks, small, grows on limestone'
  ),
  null,
  null,
  jsonb_build_object(
    'th', 'ต้องการความชื้นในอากาศ 70% ขึ้นไป ไม่ควรปล่อยให้ดินแห้งแต่ก็ไม่ให้แฉะ ใช้วัสดุปลูกที่ระบายน้ำดีมาก ผสมหินปูนเล็กน้อยตามถิ่นอาศัยเดิม',
    'en', 'Needs humidity of 70% or more. Keep the mix from drying out without letting it get soggy, and use a very free-draining mix with a little limestone, as in its native habitat.'
  ),
  '{}'::text[],
  10
)

on conflict (id) do update set
  plant_id     = excluded.plant_id,
  name         = excluded.name,
  description  = excluded.description,
  features     = excluded.features,
  size         = excluded.size,
  bloom_season = excluded.bloom_season,
  care_tip     = excluded.care_tip,
  sort_order   = excluded.sort_order;
  -- images, tags, origin and is_published are left alone on re-run.

notify pgrst, 'reload schema';

-- ---------- Verify ----------
select id, sort_order, name ->> 'th' as name_th, name ->> 'en' as name_en
  from public.plant_varieties
 where plant_id = 'begonia'
 order by sort_order;
