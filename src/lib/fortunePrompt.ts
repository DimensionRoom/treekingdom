/**
 * The copy-paste prompt for generating a new batch of daily-fortune
 * messages via an AI chat (see FortuneMessagesPanel.tsx's "copy prompt"
 * button). Single source of truth — the standalone
 * fortune-messages-prompt.md doc points here rather than duplicating it,
 * so the two can't drift apart.
 *
 * `existingMessages` should be every message text already in the pool
 * (fetched live from the DB by the caller), so the model is told not to
 * repeat them — duplicates are silently dropped on import otherwise, which
 * wastes the batch.
 */
export function buildFortunePrompt(existingMessages: string[]): string {
  const existingBlock =
    existingMessages.length > 0
      ? existingMessages.join("\n")
      : "(ยังไม่มีข้อความในคลัง — เขียนได้อิสระ)";

  return `คุณคือนักเขียนคำทำนายดวงประจำวันสำหรับแอปพรรณไม้/สวนชื่อ TreeKingdom
ช่วยแต่งข้อความดวงรายวันชุดใหม่ให้หน่อย ตามสเปกนี้เป๊ะ ๆ

## รูปแบบผลลัพธ์
ตอบกลับเป็น JSON array ล้วน ๆ เท่านั้น ห้ามมี markdown code fence, ห้ามมีคำอธิบายนำหรือปิดท้าย
ห้ามมีข้อความอื่นใดนอกจาก JSON

แต่ละแถวมีรูปแบบ:
{ "weekday": "all", "tone": "positive" | "neutral" | "careful", "th": "...", "en": "..." }

- "weekday": ใส่ "all" เสมอ (ข้อความจะถูกใช้ได้กับทุกวันเกิด ระบบจะกระจายให้เองตอน import)
- "th" / "en": ข้อความเดียวกัน แปลถึงกันตรง ๆ ไม่ใช่คนละความหมาย

## จำนวนที่ต้องการ
30 ข้อความต่อโทน × 3 โทน = 90 แถว รวม
(ถ้าคิดสำนวนใหม่ไม่ออกแล้ว ลดเหลือ 10-15 ข้อความต่อโทนก็ได้ บอกจำนวนที่ต้องการแทนตัวเลขนี้ได้)

## นิยามของแต่ละโทน (ผูกกับคะแนนดวงรวม 0-100 ที่ระบบคำนวณแยกต่างหาก)
- positive: คะแนนรวม ≥ 75 — วันที่ราบรื่น มีโอกาสดี เหมาะลงมือทำสิ่งใหม่
- neutral: คะแนนรวม 55-74 — วันธรรมดา ไม่มีอะไรพิเศษ เหมาะกับการพักหรือทบทวน
- careful: คะแนนรวม < 55 — วันที่ควรระมัดระวังเป็นพิเศษ แต่ไม่ใช่วันโชคร้าย

## กติกาการเขียน
- ประโยคเดียวจบต่อข้อความ ความยาวประมาณ 40-80 ตัวอักษร (ภาษาไทย)
- น้ำเสียงอบอุ่น เป็นมิตร แบบร้านต้นไม้ที่ห่วงใยลูกค้า — ไม่ใช่หมอดูขู่หรือดราม่าเกินจริง
- ห้ามระบุตัวเลข วันที่ ฤดูกาล หรือเทศกาลเจาะจง (ข้อความถูกวนใช้ซ้ำได้ตลอดทั้งปี)
- ห้ามฟันธงเรื่องสุขภาพ/การเงิน/ความสัมพันธ์แบบชี้เฉพาะเจาะจงเกินไป (เช่น ห้ามบอกว่า "จะได้เงินก้อนใหญ่"
  ให้พูดกว้าง ๆ แบบ "เรื่องการเงินมีแนวโน้มดี" แทน) — เป็นความบันเทิง ไม่ใช่คำแนะนำจริงจัง
- แต่ละข้อความในชุดต้องไม่ซ้ำความหมายกับข้อความอื่นในชุดเดียวกัน (หลากมุม: เงิน ความรัก สุขภาพ
  การงาน การเรียน ความสัมพันธ์ การเดินทาง จิตใจ ฯลฯ)

## ห้ามซ้ำข้อความที่มีอยู่แล้ว (สำคัญมาก)
ต่อไปนี้คือข้อความ "th" ที่มีอยู่ในระบบแล้ว (${existingMessages.length} ข้อความ) — ห้ามเขียนซ้ำหรือ
ใกล้เคียงกันเกินไป (ระบบเช็กซ้ำแบบข้อความตรงตัวเป๊ะ แต่เขียนสำนวนใหม่ให้ต่างจริง ๆ จะมีประโยชน์กว่า):

${existingBlock}

## ตัวอย่างรูปแบบ (อย่า copy ข้อความตัวอย่างนี้ไปใช้จริง)
[
  { "weekday": "all", "tone": "positive", "th": "โอกาสดีกำลังเดินเข้ามาหาคุณ แค่กล้าเปิดรับ", "en": "A good opportunity is heading your way — just be open to it." },
  { "weekday": "all", "tone": "neutral", "th": "วันนี้เหมาะกับการค่อย ๆ ทำสิ่งที่คั่งค้างให้เสร็จทีละอย่าง", "en": "A good day to slowly clear things you've been putting off, one at a time." },
  { "weekday": "all", "tone": "careful", "th": "หากรู้สึกเหนื่อยล้า อย่าฝืนตัวเอง พักเมื่อจำเป็น", "en": "If you feel worn out, don't push yourself — rest when you need to." }
]

ตอนนี้ช่วยแต่งชุดข้อความใหม่ทั้งหมดตามสเปกด้านบนให้หน่อย`;
}
