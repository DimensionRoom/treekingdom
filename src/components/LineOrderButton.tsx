import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LINE_OA_URL } from "@/lib/site";
import lineIcon from "@/assets/line-icon.svg";

interface Props {
  /** Product name as shown on the page. */
  productName: string;
  /** The chosen option's name, when ordering one option of a product. */
  optionName?: string;
  price: number;
  inStock: boolean;
  className?: string;
}

/**
 * Opens the shop's LINE Official Account through its lin.ee link. A lin.ee
 * link can't carry a pre-typed message, so the click also copies the order
 * details to the clipboard for the customer to paste into the chat.
 * Out of stock, the button turns into an enquiry rather than disappearing:
 * the shop may restock or suggest something similar.
 */
const LineOrderButton = ({ productName, optionName, price, inStock, className = "" }: Props) => {
  const { lang } = useLanguage();
  const th = lang === "th";

  const copyOrderDetails = () => {
    // The page the customer is actually on, not SITE_URL: that is still a
    // placeholder domain, and a link in the chat has to open.
    const pageUrl = window.location.href.split("#")[0];
    const message = [
      inStock
        ? (th ? "สวัสดีครับ/ค่ะ สนใจสั่งซื้อสินค้านี้" : "Hi, I'd like to order this item")
        : (th ? "สวัสดีครับ/ค่ะ ขอสอบถามสินค้านี้ (ตอนนี้สินค้าหมด)" : "Hi, I'd like to ask about this item (currently out of stock)"),
      `• ${productName}`,
      optionName ? (th ? `• ตัวเลือก: ${optionName}` : `• Option: ${optionName}`) : null,
      th ? `• ราคา ฿${price.toLocaleString()}` : `• Price ฿${price.toLocaleString()}`,
      pageUrl,
    ].filter(Boolean).join("\n");

    // Don't block the link on this: LINE opens either way, and a failed copy
    // (blocked clipboard, old browser) just means the customer types instead.
    navigator.clipboard?.writeText(message).then(
      () => toast.success(th ? "คัดลอกรายละเอียดสินค้าแล้ว วางในแชต LINE ได้เลย" : "Order details copied — paste them into the LINE chat"),
      () => {},
    );
  };

  return (
    <a
      href={LINE_OA_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={copyOrderDetails}
      className={`flex items-center justify-center gap-2 rounded-2xl bg-[#06C755] px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#05b34c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2 ${className}`}
    >
      <img src={lineIcon} alt="" aria-hidden="true" className="h-6 w-6" />
      {inStock
        ? (th ? "สั่งซื้อผ่าน LINE" : "Order via LINE")
        : (th ? "สอบถามผ่าน LINE" : "Ask via LINE")}
    </a>
  );
};

export default LineOrderButton;
