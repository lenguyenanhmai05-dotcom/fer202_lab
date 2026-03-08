import { products } from "@/data/products";

// Helper function to find the best matching product based on text keywords
function findProduct(text) {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    for (const product of products) {
        let score = 0;
        if (!product.keywords) continue;

        for (const kw of product.keywords) {
            const lowerKw = kw.toLowerCase();
            // Use precise matching for short words to avoid false positives (e.g. 'cọ' vs 'còn')
            if (lowerKw.length <= 3) {
                // Use custom boundary for unicode safety instead of \b which ignores accents
                const regex = new RegExp(`(?:^|\\s|[.,!?:])${lowerKw}(?:\\s|[.,!?:]|$)`, 'i');
                if (regex.test(lowerText)) {
                    score++;
                }
            } else {
                if (lowerText.includes(lowerKw)) {
                    score += 1.5; // Longer, specific keywords weigh more
                }
            }
        }

        if (score > maxScore && score > 0) {
            maxScore = score;
            bestMatch = product;
        }
    }
    return bestMatch;
}

// Helper function to find all products matching the keywords
function findAllProducts(text) {
    if (!text) return [];
    const lowerText = text.toLowerCase();

    // 1. Extract negative constraints (e.g. "không phải loreal", "không phải là loreal")
    const negativeTerms = [];
    // Skip filler words (là, cái, một, của...) between "không phải" and the actual brand keyword
    const FILLER_WORDS = new Set(['là', 'cái', 'một', 'của', 'cái', 'mấy', 'cái', 'em', 'thương', 'hiệu', 'brand', 'loại', 'sản', 'phẩm']);
    const negativePatterns = ['không phải', 'trừ', 'không lấy', 'ngoại trừ', 'không muốn', 'không cần', 'khác'];
    for (const pattern of negativePatterns) {
        const idx = lowerText.indexOf(pattern);
        if (idx !== -1) {
            // Take the words that come after the pattern, skipping fillers
            const afterPattern = lowerText.slice(idx + pattern.length).trim();
            const words = afterPattern.split(/\s+/);
            for (const word of words) {
                const cleanWord = word.replace(/[^a-zA-Z0-9']/g, '');
                if (!cleanWord) continue;
                if (FILLER_WORDS.has(cleanWord)) continue; // skip filler
                negativeTerms.push(cleanWord.toLowerCase());
                break; // only need first real word after the pattern
            }
        }
    }

    // Convert written numbers to digits to parse counts
    const normalizedText = lowerText
        .replace(/\bmột\b/gi, '1')
        .replace(/\bhai\b/gi, '2')
        .replace(/\bba\b/gi, '3')
        .replace(/\bbốn\b/gi, '4')
        .replace(/\bnăm\b/gi, '5');

    const matches = [];

    for (const product of products) {
        let score = 0;
        if (!product.keywords) continue;

        for (const kw of product.keywords) {
            const lowerKw = kw.toLowerCase();

            // Penalize heavily if this product contains a negative term
            if (negativeTerms.some(term => lowerKw.includes(term))) {
                score -= 100; // Force it out of results
            }

            if (lowerKw.length <= 3) {
                const regex = new RegExp(`(?:^|\\s|[.,!?:])${lowerKw}(?:\\s|[.,!?:]|$)`, 'i');
                if (regex.test(normalizedText)) {
                    score++;
                }
            } else {
                if (normalizedText.includes(lowerKw)) {
                    score += 1.5;
                }
            }
        }
        if (score > 0) {
            matches.push({ product, score });
        }
    }
    // Sort highest score first
    matches.sort((a, b) => b.score - a.score);
    return matches.map(m => m.product);
}

// Same as findAllProducts but also takes an existing negative filter to apply
function findAllProductsFiltered(searchText, negativeTerms) {
    if (!searchText) return [];
    const lowerText = searchText.toLowerCase();
    const matches = [];
    for (const product of products) {
        let score = 0;
        if (!product.keywords) continue;
        for (const kw of product.keywords) {
            const lowerKw = kw.toLowerCase();
            if (negativeTerms.some(term => lowerKw.includes(term))) {
                score -= 100;
            }
            if (lowerKw.length <= 3) {
                const regex = new RegExp(`(?:^|\\s|[.,!?:])${lowerKw}(?:\\s|[.,!?:]|$)`, 'i');
                if (regex.test(lowerText)) score++;
            } else {
                if (lowerText.includes(lowerKw)) score += 1.5;
            }
        }
        if (score > 0) matches.push({ product, score });
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.map(m => m.product);
}

export async function generatePredefinedChatResponse(userMessage, history = []) {
    // Simulate a brief network/processing delay to feel more like a real AI
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const lowercaseMessage = userMessage.toLowerCase();

    // Get context from the last AI message
    const aiMessages = history.filter(msg => msg.sender_type === 'ai');
    const lastAiText = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].content.toLowerCase() : "";

    // Check if the message contains Vietnamese characters or typical Vietnamese words
    const isVi = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(lowercaseMessage) ||
        /(?:^|\s|[.,!?])(nhận|chào|giá|nhiêu|móng|tẩy|trang|kem|nền|phấn|cảm|ơn|bạn|mình|cho|mua|hỏi|có|không|sao|vậy|nào|đẹp|quá|đi|nha|ạ|ơ|ờ|ừ|đúng|rồi)(?:\s|[.,!?]|$)/i.test(lowercaseMessage);

    // Dynamic Product Search Context
    let matchedProduct = findProduct(lowercaseMessage);
    // If the user didn't mention a new product, assume they are talking about the last one
    if (!matchedProduct && lastAiText) {
        matchedProduct = findProduct(lastAiText);
    }

    // 1. Greetings
    if (/\b(hello|hi|chào|xin chào|hey)\b/i.test(lowercaseMessage)) {
        return isVi
            ? "Chào bạn! 👋 Chào mừng đến với Luxe Collection. Mình có thể tư vấn sản phẩm làm đẹp gì cho bạn hôm nay?"
            : "Hello there! 👋 Welcome to Luxe Collection. How can I assist you with your beauty needs today?";
    }

    // 2. Pricing and Image inquiries combined
    const asksForPrice = /(?:^|\s|[.,!?])(price|giá|bao nhiêu|tiền|gia|nhieu|tien)(?:\s|[.,!?]|$)/i.test(lowercaseMessage);
    const asksForImage = /(?:^|\s|[.,!?])(hình|ảnh|xem|coi|picture|image|photo|hinh|anh)(?:\s|[.,!?]|$)/i.test(lowercaseMessage);

    if (asksForPrice || asksForImage) {
        // Detect if they are asking for multiple items
        const rawNumberMatch = lowercaseMessage.match(/\b([2-9]|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\b/);

        let limit = 1;
        if (rawNumberMatch) {
            const numMap = { hai: 2, ba: 3, bốn: 4, năm: 5, sáu: 6, bảy: 7, tám: 8, chín: 9, mười: 10 };
            const parsed = parseInt(rawNumberMatch[1]);
            limit = Number.isNaN(parsed) ? numMap[rawNumberMatch[1].toLowerCase()] : parsed;
        } else if (/(?:^|\s|[.,!?])(khác|các|những|vài|nhiều|thêm)(?:\s|[.,!?]|$)/i.test(lowercaseMessage)) {
            limit = 3; // Show up to 3 alternative options
        }

        const allMatchedProducts = findAllProducts(lowercaseMessage);
        // Extract negative terms from the message to pass them when falling back to context
        const negativeTermsForFallback = [];
        const FILLER_SET = new Set(['là', 'cái', 'một', 'của', 'mấy', 'em', 'loại', 'sản', 'phẩm']);
        for (const pat of ['không phải', 'trừ', 'không lấy', 'ngoại trừ', 'không muốn', 'không cần', 'khác']) {
            const i = lowercaseMessage.indexOf(pat);
            if (i !== -1) {
                const after = lowercaseMessage.slice(i + pat.length).trim().split(/\s+/);
                for (const w of after) {
                    const cw = w.replace(/[^a-zA-Z0-9']/g, '');
                    if (!cw || FILLER_SET.has(cw)) continue;
                    negativeTermsForFallback.push(cw.toLowerCase());
                    break;
                }
            }
        }

        let productsToUse;
        if (allMatchedProducts.length > 0) {
            productsToUse = allMatchedProducts.slice(0, limit);
        } else if (negativeTermsForFallback.length > 0 && lastAiText) {
            // User is asking for alternatives based on category from previous AI message
            productsToUse = findAllProductsFiltered(lastAiText, negativeTermsForFallback).slice(0, limit);
        } else if (limit > 1 && lastAiText) {
            // User said "show me all 3" but message has no product keywords → use previous AI context
            productsToUse = findAllProducts(lastAiText).slice(0, limit);
        } else {
            productsToUse = matchedProduct ? [matchedProduct] : [];
        }

        if (productsToUse.length > 0) {
            let responseStr = "";
            if (productsToUse.length > 1) {
                responseStr += isVi ? `Dạ mình tìm thấy ${productsToUse.length} sản phẩm theo yêu cầu của bạn nè:\n\n` : `I found ${productsToUse.length} matching products for you:\n\n`;
            }

            for (const prod of productsToUse) {
                if (asksForPrice) {
                    responseStr += isVi
                        ? `Sản phẩm **${prod.name}** có giá **${prod.price}**\n`
                        : `**${prod.name}** is priced at **${prod.price}**\n`;
                }
                if (asksForImage) {
                    responseStr += isVi
                        ? `${productsToUse.length > 1 ? "" : `Dạ đây là hình ảnh của **${prod.name}** nha bạn:\n`}[IMAGE: ${prod.image}]\n`
                        : `${productsToUse.length > 1 ? "" : `Here is the picture for **${prod.name}**:\n`}[IMAGE: ${prod.image}]\n`;
                }
            }
            return responseStr.trim();
        }

        // ... continue to fallback code below
        if (asksForPrice && !asksForImage) {
            return isVi
                ? "Các sản phẩm bên mình có giá dao động từ 85.000 ₫ đến hơn 1.625.000 ₫ tùy loại. Bạn đang quan tâm đến sản phẩm cụ thể nào ạ?"
                : "Our products range from $5 to $80 depending on the category. Perfumes tend to be on the higher end. Would you like me to check a specific item?";
        }
        if (asksForImage && !asksForPrice) {
            return isVi
                ? "Bạn muốn xem hình ảnh của sản phẩm nào nhỉ (ví dụ: cọ đánh nền, đồ decor phòng, hay son môi...)?"
                : "Which product's picture would you like to see?";
        }
        return isVi
            ? "Bạn muốn xem giá và hình ảnh của sản phẩm nào nha (ví dụ: nail đen, mút trang điểm...)?"
            : "Which product's price and picture would you like to see?";
    }

    // 2.7 Shop Catalog Overview ("shop bán gì?", "có những sản phẩm gì?")
    if (/(shop|c\u1eda h\u00e0ng|b\u00ean m\u00ecnh).*(b\u00e1n|c\u00f3|m\u00ecnh).*(g\u00ec|s\u1ea3n ph\u1ea9m|th\u1ee9)|(c\u00f3 b\u00e1n|b\u00e1n g\u00ec|c\u00f3 nh\u1eefng|bao g\u1ed3m|s\u1ea3n ph\u1ea9m g\u00ec)/i.test(lowercaseMessage)) {
        return isVi
            ? "D\u1ea1 shop Luxe Collection c\u1ee7a m\u00ecnh c\u00f3 nh\u1eefng danh m\u1ee5c sau \u0111\u00e2y nha b\u1ea1n:\n\n\ud83e\uddf4 **Skincare** \u2014 Serum d\u01b0\u1ee1ng s\u00e1ng, vi\u00ean nang Skin1004, ch\u1ed1ng thâm n\u00e1m, ch\u1ed1ng n\u1eafng\n\ud83e\uddfc **T\u1ea9y trang** \u2014 L'Oreal 3 lo\u1ea1i n\u1eafp h\u1ed3ng/xanh/xanh \u0111\u1eadm, Cocoon B\u00ed \u0110ao, Garnier\n\ud83d\udc84 **Makeup** \u2014 Kem n\u1ec1n Maybelline, cushion, ph\u1ea5n m\u1eaft 3CE, kem che khuy\u1ebft \u0111i\u1ec3m, ph\u1ea5n ph\u1ee7\n\ud83d\udc78 **Môi** \u2014 Son d\u01b0\u1ee1ng Vaseline h\u1ed3ng, DHC không màu\n\ud83d\udc85 **Nails** \u2014 Móng gi\u1ea3 tr\u1eafng, bi\u1ec3n, \u0111en\n\u2728 **Trang \u0111i\u1ec3m** \u2014 C\u1ecd nền, kem l\u00f3t Judydoll\n\ud83c\udfe1 **Decor phòng** \u2014 B\u00e0n makeup, k\u1ec7 trang tr\u00ed, \u0111\u00e8n ng\u1ee7\n\nB\u1ea1n mu\u1ed1n xem th\u00eam thông tin lo\u1ea1i nào, c\u1ee9 h\u1ecfi m\u00ecnh nha! \ud83e\udd0a\ud83d\udc96"
            : "Luxe Collection offers:\n\n🧴 **Skincare** — Brightening serums, capsules, dark spot & sunscreen\n🧼 **Makeup Removers** — L'Oreal (Pink/Blue/Dark Blue), Cocoon, Garnier\n💄 **Makeup** — Foundation, cushion, eyeshadow palette, concealer, powder\n💋 **Lip Care** — Vaseline Rosy Lips, DHC Lip Cream\n💅 **Nails** — White, Beach, Black press-on nail sets\n✨ **Tools** — Foundation brush, makeup primer\n🏡 **Decor** — Vanity table, shelves, night light\n\nFeel free to ask about any specific item! 🦊💖";
    }

    // 3. Category: Perfume / Fragrance
    if (lowercaseMessage.includes("perfume") || lowercaseMessage.includes("fragrance") || lowercaseMessage.includes("nước hoa") || /\bthơm\b/i.test(lowercaseMessage)) {
        return isVi
            ? "Bên mình có bộ sưu tập nước hoa nữ cao cấp! 🌸 Best-seller hiện tại là dòng 'Midnight Bloom' Eau de Parfum siêu quyến rũ. Bạn có muốn xem thử không?"
            : "We have an exquisite collection of luxury perfumes! 🌸 Our best-seller is the 'Midnight Bloom' Eau de Parfum. Would you like to hear about its scent notes?";
    }

    // 4. Skincare Context Check (Da khô/Dầu)
    if (lowercaseMessage.includes("dry") || /(?:^|\s)khô(?:\s|$)/i.test(lowercaseMessage) || /(?:^|\s)kho(?:\s|$)/i.test(lowercaseMessage)) {
        // Did we just talk about makeup remover?
        if (lastAiText.includes("tẩy trang") || lastAiText.includes("micellar") || lastAiText.includes("cleansing") || lowercaseMessage.includes("tẩy trang") || lowercaseMessage.includes("hồng")) {
            return isVi
                ? "Với da khô thì bạn dùng 'L'Oreal Paris Micellar Water' dòng Nắp Hồng nha! 💦 Dòng này siêu dịu nhẹ, tẩy sạch mà không làm mất đi độ ẩm tự nhiên của da đâu."
                : "For dry string, 'L'Oreal Paris Micellar Water (Pink Cap)' is perfect! 💦 It gently removes makeup without stripping your skin's natural moisture.";
        }
        // Default dry skin (Serum/Cream context)
        return isVi
            ? "Với da khô thì cấp ẩm là số 1! 💧 Mình chân thành recommend 'Serum cấp ẩm Torriden' mix cùng kem dưỡng. Da sẽ mọng nước ngay lập tức luôn."
            : "For dry skin, hydration is key! 💧 I highly recommend our hydrating serums followed by the 'Deep Moisture Repair Cream'. They work beautifully together to lock in moisture.";
    }

    if (lowercaseMessage.includes("oily") || /(?:^|\s)dầu(?:\s|$)/i.test(lowercaseMessage) || /(?:^|\s)mụn(?:\s|$)/i.test(lowercaseMessage) || /(?:^|\s)dau(?:\s|$)/i.test(lowercaseMessage)) {
        // Did we just talk about makeup remover?
        if (lastAiText.includes("tẩy trang") || lastAiText.includes("micellar") || lastAiText.includes("cleansing") || lowercaseMessage.includes("tẩy trang")) {
            return isVi
                ? "Với da dầu mụn thì 'Nước Tẩy Trang Cocoon Bí Đao' là chân ái! 🌱 Kháng khuẩn, làm sạch sâu và cực kỳ dịu nhẹ cho vùng da mụn."
                : "For oily/acne-prone skin, the 'Cocoon Winter Melon Cleansing Water' is your best bet! 🌱 It's antibacterial and super gentle on breakouts.";
        }
        // Default oily skin
        return isVi
            ? "Da dầu mụn thì cần đồ mỏng nhẹ thôi bạn ơi. 🌱 Dùng 'Serum Niacinamide The Ordinary' kiểm soát dầu mụn là chuẩn bài đó!"
            : "For oily skin, you'll want something lightweight. 🌱 Our 'Serums' and 'Matte Finish Gel Moisturizer' are perfect for keeping shine at bay.";
    }

    // 5. General Skincare Inquiry
    if (lowercaseMessage.includes("skincare") || lowercaseMessage.includes("care") || lowercaseMessage.includes("cream") || lowercaseMessage.includes("dưỡng da")) {
        return isVi
            ? "Skincare là chân ái! ✨ Bên mình có serum cấp ẩm, kem dưỡng và tẩy trang siêu sạch. Da bạn thuộc tuýp nào (khô, dầu, hỗn hợp) để mình tư vấn cho chuẩn nha?"
            : "Skincare is essential! ✨ We offer hydrating serums, anti-aging night creams, and refreshing cleansers. What is your skin type (dry, oily, combination)?";
    }

    if (/\bserum\b/i.test(lowercaseMessage)) {
        return isVi
            ? "Dùng serum là đúng bài trị liệu chuyên sâu rồi! ✨ Bên mình có 'Serum Skin1004' dưỡng sáng, 'Torriden' cấp ẩm, 'The Ordinary' ngừa mụn và 'Abib' trị thâm nám. Bạn chấm em nào?"
            : "Serums are great for targeted treatment! We currently have brightening serums and hydrating serums. Which one catches your eye? ✨";
    }

    // 6. Specific Brands / Needs
    if (lowercaseMessage.includes("skin1004") || lowercaseMessage.includes("skin 1004") || lowercaseMessage.includes("centella") || lowercaseMessage.includes("brightening")) {
        return isVi
            ? "Viên nang 'Skin1004 Madagascar Centella Brightening' đang rần rần đó bạn! ✨ Dịu da, nâng tông sáng rạng rỡ. Hợp với mọi loại da, đặc biệt là da xỉn màu nha. Mình chốt 1 chai nghen?"
            : "The 'Skin1004 Madagascar Centella Brightening Capsules' are amazing for glowing skin! ✨ They soothe and illuminate perfectly for all skin types. Want me to add it to your cart?";
    }

    if (lowercaseMessage.includes("ordinary") || lowercaseMessage.includes("niacinamide")) {
        return isVi
            ? "Nhắc tới ngừa mụn, thu nhỏ lỗ chân lông thì 'The Ordinary Niacinamide 10% + Zinc 1%' là quốc dân rồi! 💧 Rẻ mà võ công thâm hậu."
            : "For blemishes and pore care, 'The Ordinary Niacinamide 10% + Zinc 1%' is a holy grail! 💧 Very affordable and effective.";
    }

    if (lowercaseMessage.includes("abib") || lowercaseMessage.includes("dark spot") || lowercaseMessage.includes("thâm") || lowercaseMessage.includes("nám")) {
        return isVi
            ? "Để mờ thâm nám siêu tốc, bạn săn ngay 'Abib Glutathione Dark Spot Serum' đi! 🌟 Đẩy lùi thâm sạm cực đỉnh, review 5 sao chót vót luôn."
            : "To tackle dark spots, you absolutely need the 'Abib Glutathione Dark Spot Serum'. It's highly rated for promoting a radiant and even complexion! 🌟";
    }

    if (lowercaseMessage.includes("loreal") || lowercaseMessage.includes("l'oreal") || lowercaseMessage.includes("tẩy trang") || lowercaseMessage.includes("cleansing water") || lowercaseMessage.includes("micellar") || lowercaseMessage.includes("makeup remover") || lowercaseMessage.includes("garnier")) {
        if (lowercaseMessage.includes("hồng") || lowercaseMessage.includes("pink")) {
            return isVi
                ? "Dòng L'Oreal nắp hồng là chân ái cho da khô và nhạy cảm đó bạn! Siêu dịu nhẹ luôn 🌸. Bạn lấy chai này ha?"
                : "The L'Oreal Pink Cap is perfect for sensitive and dry skin! 🌸 Shall I add it to your order?";
        }
        if (lowercaseMessage.includes("đậm") || lowercaseMessage.includes("dark blue")) {
            return isVi
                ? "Dòng L'Oreal nắp xanh đậm có lớp dầu tẩy sạch bách makeup chống nước luôn nha! 💙 Rất hợp cho bạn nào hay makeup đậm."
                : "The L'Oreal Dark Blue cap has a bi-phase formula to remove stubborn waterproof makeup! 💙";
        }
        return isVi
            ? "Bé Cáo có tẩy trang L'Oreal đủ 3 màu: 'Nắp Hồng' (cho da khô/nhạy cảm), 'Nắp Xanh nhạt' (da thường/hỗn hợp), và 'Nắp Xanh đậm' (tẩy makeup chống nước). Bạn thuộc team nào ạ? 💦"
            : "We have L'Oreal Micellar Water in 3 variants: Pink (Dry/Sensitive), Blue (Normal/Combo), and Dark Blue (Waterproof makeup). Which do you need? 💦";
    }

    if (lowercaseMessage.includes("cocoon") || lowercaseMessage.includes("winter melon") || lowercaseMessage.includes("bí đao")) {
        return isVi
            ? "'Tẩy trang Cocoon Bí Đao' trứ danh vùng nhiệt đới! 🌱 Phù hợp mọi loại da đặc biệt là da dầu mụn. Thuần chay 100% cực xịn."
            : "The 'Cocoon Winter Melon Cleansing Water' is fantastic for oily and acne-prone skin! 🌱 A great vegan choice from a local brand.";
    }

    if (lowercaseMessage.includes("vaseline") || lowercaseMessage.includes("rosy lips") || lowercaseMessage.includes("dưỡng môi") || lowercaseMessage.includes("lip balm")) {
        return isVi
            ? "Nứt nẻ cỡ nào gặp 'Vaseline Rosy Lips' cũng xin hàng! 💋 Dưỡng môi siêu mềm mịn lại còn lên màu phớt hồng tự nhiên chúm chím."
            : "For soft, tinted lips, 'Vaseline Rosy Lips' is a classic favorite! 💋 It instantly soothes dryness with a sheer pink tint.";
    }

    if (lowercaseMessage.includes("dhc") || lowercaseMessage.includes("lip cream") || lowercaseMessage.includes("không màu")) {
        return isVi
            ? "Gu bạn là son dưỡng không màu siêu cấp ẩm đúng không? 'DHC Lip Cream' là best choice 🌿 Chiết xuất thực vật bôi đêm sáng dậy môi mềm oặt luôn."
            : "If you prefer an ultra-moisturizing, colorless option, the 'DHC Lip Cream' is perfect! 🌿 Packed with skin-softening botanicals.";
    }

    if (lowercaseMessage.includes("saem") || lowercaseMessage.includes("concealer") || lowercaseMessage.includes("che khuyết điểm") || lowercaseMessage.includes("che khuyet diem")) {
        return isVi
            ? "Mụn đỏ, quầng thâm? Vứt hết cho 'THE SAEM Cover Perfection Concealer'! ✨ Che phủ đỉnh chóp mà giá học sinh sinh viên vô cùng."
            : "Need to hide blemishes? 'THE SAEM Cover Perfection Concealer' offers high coverage and SPF28 PA++! ✨ A true makeup bag staple.";
    }

    if (lowercaseMessage.includes("3ce") || lowercaseMessage.includes("palette") || lowercaseMessage.includes("phấn mắt") || lowercaseMessage.includes("phan mat")) {
        return isVi
            ? "Bảng mắt '3CE Multi Eye Color Palette' là chân ái của mọi layout makeup! 🎨 9 ô màu thần thánh từ tone nhẹ nhàng đi học đến lấp lánh đi quẩy."
            : "The '3CE Multi Eye Color Palette' is stunning! 🎨 With 9 versatile shades, you can create both daily and glamorous looks effortlessly.";
    }

    if (lowercaseMessage.includes("maybelline") || lowercaseMessage.includes("illuminating") || lowercaseMessage.includes("kem nền") || lowercaseMessage.includes("foundation") || lowercaseMessage.includes("cushion")) {
        return isVi
            ? "Thích một lớp nền căng bóng thì chọn 'Maybelline Illuminating Foundation', còn thích tiệp da thì dùng 'Cushion Mooekiss' nha! 🌟 Bạn ưng loại nào?"
            : "For a radiant, smooth complexion, the 'Maybelline Fit Me Illuminating Foundation' or 'Cushion Mooekiss' are fantastic choices! 🌟";
    }

    if (lowercaseMessage.includes("brush") || lowercaseMessage.includes("cọ") || lowercaseMessage.includes("dàn nền")) {
        return isVi
            ? "Đánh nền mướt mượt không tì vết thì không thể thiếu 'Cọ Foundation Chuyên Nghiệp' được! 🖌️ Lông cọ mềm đặc, lướt trên da êm ru."
            : "Looking for tools? We have a 'Professional Foundation Brush' with dense, soft bristles for flawless, streak-free liquid foundation application! 🖌️";
    }

    if (lowercaseMessage.includes("beplain") || lowercaseMessage.includes("sunscreen") || lowercaseMessage.includes("kem chống nắng") || lowercaseMessage.includes("chong nang")) {
        return isVi
            ? "Chống nắng chân ái nâng tone kiềm dầu là em 'Beplain Sunmuse Tím' đây! ☀️ Chất kem màu tím nhạt giúp hiệu chỉnh da sỉn màu cực đẹp."
            : "Protect and brighten your skin with the 'Beplain Sunmuse Sunscreen'! ☀️ The light purple tint wonderfully corrects dull skin tones.";
    }

    if (lowercaseMessage.includes("judydoll") || lowercaseMessage.includes("base") || lowercaseMessage.includes("lót") || lowercaseMessage.includes("primer")) {
        return isVi
            ? "Muốn lớp nền lâu trôi thì phải lót trước bằng 'Judydoll Makeup Base Mattifying'! 🌸 Kiềm dầu lô chân lông biến mất tăm luôn."
            : "Prepping your skin? The 'Judydoll Makeup Base Mattifying' controls oil and blurs pores for a smooth, matte canvas. 🌸";
    }

    if (lowercaseMessage.includes("perfect diary") || lowercaseMessage.includes("powder") || lowercaseMessage.includes("phấn phủ") || lowercaseMessage.includes("phan phu")) {
        return isVi
            ? "Set lại toàn bộ makeup bằng phấn phủ 'Perfect Diary PerfectStay Face Powder' nha! 🤍 Bột phấn siêu mịn, khóa makeup cả ngày không xê dịch."
            : "Lock your makeup in place all day with the 'Perfect Diary PerfectStay Face Powder'! 🤍 Finely milled for a perfect finish.";
    }

    // 7. Decor / Vanity
    if (lowercaseMessage.includes("decor") || lowercaseMessage.includes("bàn") || lowercaseMessage.includes("trang điểm") || lowercaseMessage.includes("vanity")) {
        return isVi
            ? "Bàn makeup thì không thể thiếu đồ decor lung linh nha! ✨ Xem ngay mấy món phụ kiện decor siêu xinh trên danh mục sản phẩm của mình ạ."
            : "Decorating your vanity? ✨ Check out our chic organizers and makeup vanity decor to elevate your space!";
    }

    // 8. Nails
    if (lowercaseMessage.includes("nail") || lowercaseMessage.includes("móng") || lowercaseMessage.includes("mong tay")) {
        if (lowercaseMessage.includes("white") || lowercaseMessage.includes("trắng") || lowercaseMessage.includes("trang")) {
            return isVi
                ? "Bộ 'Nail Trắng Lấp Lánh' vừa thanh lịch vừa tiểu thư, gắn đi tiệc là chuẩn bài! 🤍"
                : "Our 'Shiny White Nails' are incredibly elegant! 🤍 Perfect for a sophisticated, cleanly manicured look.";
        }
        if (lowercaseMessage.includes("beach") || lowercaseMessage.includes("biển") || lowercaseMessage.includes("bien")) {
            return isVi
                ? "Sắp đi du lịch thì tậu ngay bộ 'Beach Art Nails' họa tiết biển xanh rực rỡ nha! 🌊🌴 Lên hình bao nổi."
                : "Getting ready for summer? The 'Beach Art Nails' have a super fun and vibrant design! 🌊🌴";
        }
        if (lowercaseMessage.includes("black") || lowercaseMessage.includes("đen") || lowercaseMessage.includes("den")) {
            return isVi
                ? "Gu bạn thích ngầu lòi, cá tính thì quất ngay bộ 'Black Art Nails' đen huyền bí! 🖤 Bao chất."
                : "For an edgy and bold statement, you must check out the 'Black Art Nails'! 🖤 Extremely stylish.";
        }
        return isVi
            ? "Shop có cả nghìn lẻ một mẫu Nail xinh xỉu! 💅 Bạn thích gu tiểu thư nhẹ nhàng ('Nail Trắng'), màu sắc sặc sỡ ('Nail Biển') hay cá tính mạnh ('Nail Đen')?"
            : "We have a gorgeous collection of press-on nails! 💅 Are you looking for something elegant like 'White Nails', fun like 'Beach Art', or edgy like 'Black Art'?";
    }

    // 9. Category: Makeup / Cosmetics
    if (lowercaseMessage.includes("makeup") || lowercaseMessage.includes("lipstick") || lowercaseMessage.includes("son")) {
        return isVi
            ? "Tân trang lại nhan sắc thôi nào! 💄 Shop vừa về thêm son lì Romand màu đỏ đất siêu hot và đủ đồ makeup khác. Bạn đang tìm hãng nào?"
            : "Upgrade your makeup bag! 💄 We just restocked our velvet matte lipsticks (bestseller: Ruby Red), foundations, and concealers. Are you looking for a specific brand?";
    }

    // 10. Order / Shipping
    if (lowercaseMessage.includes("order") || lowercaseMessage.includes("ship") || lowercaseMessage.includes("delivery") || lowercaseMessage.includes("giao hàng") || lowercaseMessage.includes("đơn hàng") || /\bmua\b/i.test(lowercaseMessage)) {
        return isVi
            ? "Bên mình Freeship cho toàn bộ đơn hàng thanh toán trên web nha! 📦 Bạn có thể xem lại tình trạng phần 'Lịch sử đơn' sau khi đăng nhập."
            : "We offer free standard shipping on all orders over $50! 📦 You can track your existing orders in the 'Order History' tab after logging in.";
    }

    // 11. Thank you / Goodbye
    if (/\b(thank|bye|cảm ơn|cam on)\b/i.test(lowercaseMessage)) {
        return isVi
            ? "Dạ không có gì ạ! Chúc bạn một ngày tốt lành và luôn xinh đẹp rạng rỡ nha! 💖"
            : "You're very welcome! Have a fabulous day and stay radiant! 💖";
    }

    // 11.5 Follow-up context question: "còn loại nào khác không?"
    if (/(?:c\u00f2n|th\u00eam).*(kh\u00e1c|n\u1eefa|lo\u1ea1i|c\u00e1i)|(lo\u1ea1i|c\u00e1i).*(kh\u00e1c).*(kh\u00f4ng|ko)/i.test(lowercaseMessage)) {
        if (lastAiText) {
            // Find all products from the context of last AI message
            const contextProducts = findAllProducts(lastAiText);
            if (contextProducts.length > 0) {
                // Show product(s) not already shown
                const alreadyMentioned = contextProducts.filter(p => lastAiText.includes(p.name.toLowerCase()));
                const remaining = contextProducts.filter(p => !alreadyMentioned.some(m => m.id === p.id));

                if (remaining.length > 0) {
                    const prod = remaining[0];
                    return isVi
                        ? `D\u1ea1 c\u00f2n **${prod.name}** n\u1eefa \u0111\u00f3 b\u1ea1n! \u2728\\n[IMAGE: ${prod.image}]`
                        : `Yes, there's also **${prod.name}**! \u2728\\n[IMAGE: ${prod.image}]`;
                }
                // No more products left
                return isVi
                    ? "D\u1ea1 kh\u00f4ng \u1ea1, hi\u1ec7n bên m\u00ecnh ch\u1ec9 c\u00f3 v\u1eady th\u00f4i n\u00e8. N\u1ebfu b\u1ea1n mu\u1ed1n t\u01b0 v\u1ea5n lo\u1ea1i kh\u00e1c m\u00ecnh r\u1ea5t vui \u0111\u01b0\u1ee3c gi\u00fap! \ud83e\udd0a"
                    : "Sorry, that's all we have for now! Feel free to ask about other products. \ud83e\udd0a";
            }
        }
        return isVi
            ? "D\u1ea1 kh\u00f4ng \u1ea1, shop hi\u1ec7n ch\u01b0a c\u00f3 th\u00eam lo\u1ea1i n\u00e0o kh\u00e1c. B\u1ea1n c\u00f3 mu\u1ed1n xem lo\u1ea1i s\u1ea3n ph\u1ea9m kh\u00e1c kh\u00f4ng nha? \ud83d\ude0a"
            : "Sorry, we don't have other variants for that at the moment. Can I help you with something else? \ud83d\ude0a";
    }

    // 11.9 General product inquiry catch-all — if we matched a product but nothing else triggered
    if (matchedProduct) {
        return isVi
            ? `C\u00f3 \u0111\u1ea5y b\u1ea1n! \u2728 **${matchedProduct.name}** b\u00ean m\u00ecnh \u0111ang b\u00e1n v\u1edbi gi\u00e1 **${matchedProduct.price}** nha. B\u1ea1n mu\u1ed1n xem h\u00ecnh hay th\u00eam th\u00f4ng tin g\u00ec kh\u00f4ng?`
            : `Yes, we carry **${matchedProduct.name}**! \u2728 It's currently priced at **${matchedProduct.price}**. Would you like to see a picture or learn more?`;
    }

    // 12. Fallback (Doesn't match any keywords)
    return isVi
        ? "Bé cáo chưa hiểu ý bạn lắm ạ! 🤔 Bạn có thể hỏi mình về giá cả hoặc hình ảnh của các sản phẩm nhé. \n\nVí dụ bạn có thể nhắn:\n- 'Cho mình xem hình túi xách'\n- 'Bàn decor có giá bao nhiêu'\n- 'Da khô nên dùng tẩy trang gì'\n\nHãy thử hỏi lại nha! 🦊💖"
        : "I didn't quite catch that! 🤔 You can ask me about prices or pictures of our products.\n\nFor example, try asking:\n- 'Show me a picture of the perfume'\n- 'How much is the foundation?'\n- 'What is good for dry skin?'\n\nTry asking again! 🦊💖";
}
