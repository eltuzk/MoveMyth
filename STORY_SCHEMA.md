# STORY_SCHEMA.md — MoveMyth Story JSON Format
> Last updated: 2026-04-10
> All pre-generated stories must follow this schema exactly.

---

## Overview

Stories are pre-generated JSON files stored in `backend/stories/`.
Each story has 3 segments. Each segment has a narrative text, a TTS-ready narration string, and 2–3 challenge options.

At runtime, Lio selects one challenge from `challenge_options` based on `story_theme` context (see `AGENTS.md` for selection logic).

---

## File Naming

```
backend/stories/{story_id}.json
```

- `forest.json` — forest / magic theme
- `ocean.json` — ocean / underwater theme

---

## Top-Level Schema

```json
{
  "story_id": "forest",
  "title": "Khu Rừng Phép Thuật",
  "theme": "forest_magic",
  "character_name": "Lio",
  "total_segments": 3,
  "segments": [ ...SegmentObject ],
  "badge_map": { ...BadgeMap }
}
```

| Field | Type | Description |
|---|---|---|
| `story_id` | string | Matches filename without extension |
| `title` | string | Display title (Vietnamese) |
| `theme` | string | Used for challenge context matching |
| `character_name` | string | Always `"Lio"` for MVP |
| `total_segments` | integer | Always `3` for MVP |
| `segments` | SegmentObject[] | Array of 3 segment objects |
| `badge_map` | BadgeMap | Badge awarded per segment on pass |

---

## SegmentObject Schema

```json
{
  "segment_index": 0,
  "narrative_text": "Lio và {child_name} bước vào khu rừng...",
  "narration_tts": "Lio và bạn nhỏ bước vào khu rừng phép thuật...",
  "challenge_options": [ ...ChallengeOption ],
  "adapt_responses": { ...AdaptResponses }
}
```

| Field | Type | Description |
|---|---|---|
| `segment_index` | integer | 0, 1, or 2 |
| `narrative_text` | string | Story text shown on screen. Use `{child_name}` placeholder where needed |
| `narration_tts` | string | Text sent to TTS API. Should be natural spoken Vietnamese. Avoid `{child_name}` here — backend substitutes before calling TTS |
| `challenge_options` | ChallengeOption[] | 2–3 challenge options. Backend picks one based on theme |
| `adapt_responses` | AdaptResponses | Lio's response text for each verify outcome |

---

## ChallengeOption Schema

```json
{
  "action": "jump",
  "display_text": "Nhảy lên 3 lần để vượt qua cây cầu!",
  "tts_text": "Hãy nhảy lên 3 lần để vượt qua cây cầu thần kỳ nhé!",
  "difficulty": "normal",
  "fallback_action": "raise_hands"
}
```

| Field | Type | Description |
|---|---|---|
| `action` | string | One of: `jump`, `raise_hands`, `spin` |
| `display_text` | string | Text shown on ChallengeCard UI |
| `tts_text` | string | Text Lio speaks when assigning the challenge |
| `difficulty` | string | `"normal"` or `"easy"` (easy = fallback when vision fails) |
| `fallback_action` | string | Action to use if vision fails (`raise_hands` is safest fallback) |

**Constraints:**
- Each `challenge_options` array must contain at least one `"easy"` difficulty option
- `fallback_action` must always be `raise_hands` (most reliably detected by vision model)
- Do not use any action outside: `jump`, `raise_hands`, `spin`

---

## AdaptResponses Schema

```json
{
  "pass": {
    "tts_text": "Tuyệt vời! Con đã làm được rồi! Câu chuyện tiếp tục...",
    "display_text": "Tuyệt vời! 🎉"
  },
  "retry": {
    "tts_text": "Gần được rồi! Thử lại một lần nữa nhé!",
    "display_text": "Thử lại nào!"
  },
  "fail": {
    "tts_text": "Không sao, Lio có thử thách dễ hơn cho con!",
    "display_text": "Lio đổi thử thách cho con nhé!"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `pass` | AdaptVariant | Lio's response when vision verify returns `pass` |
| `retry` | AdaptVariant | Lio's response when vision verify returns `retry` (first fail) |
| `fail` | AdaptVariant | Lio's response when vision verify returns `fail` (downgrade challenge) |

Each `AdaptVariant` has:
- `tts_text` — sent to TTS, Lio speaks this
- `display_text` — shown briefly on screen

---

## BadgeMap Schema

```json
{
  "badge_map": {
    "0": { "id": "brave_start", "label": "Dũng Cảm Bắt Đầu", "emoji": "🌟" },
    "1": { "id": "forest_hero", "label": "Anh Hùng Rừng Xanh", "emoji": "🌿" },
    "2": { "id": "magic_master", "label": "Bậc Thầy Phép Thuật", "emoji": "✨" }
  }
}
```

Keys are string versions of `segment_index`. Each badge is awarded when the child passes the challenge for that segment.

---

## Complete Example — `forest.json`

```json
{
  "story_id": "forest",
  "title": "Khu Rừng Phép Thuật",
  "theme": "forest_magic",
  "character_name": "Lio",
  "total_segments": 3,
  "segments": [
    {
      "segment_index": 0,
      "narrative_text": "Lio và {child_name} bước vào khu rừng phép thuật. Những cây cổ thụ cao vút tỏa bóng mát, và ánh sáng vàng lấp lánh giữa các tán lá. Phía trước là một cây cầu gỗ bắc qua suối nhỏ — nhưng cây cầu chỉ mở ra khi có đủ phép thuật!",
      "narration_tts": "Lio và bạn nhỏ bước vào khu rừng phép thuật. Những cây cổ thụ cao vút tỏa bóng mát, và ánh sáng vàng lấp lánh giữa các tán lá. Phía trước là một cây cầu gỗ bắc qua suối nhỏ — nhưng cây cầu chỉ mở ra khi có đủ phép thuật!",
      "challenge_options": [
        {
          "action": "jump",
          "display_text": "Nhảy lên 3 lần để kích hoạt cây cầu phép thuật!",
          "tts_text": "Để cây cầu mở ra, bạn phải nhảy lên 3 lần thật mạnh nhé!",
          "difficulty": "normal",
          "fallback_action": "raise_hands"
        },
        {
          "action": "raise_hands",
          "display_text": "Giơ hai tay lên cao để gọi phép thuật!",
          "tts_text": "Hãy giơ hai tay lên thật cao để gọi phép thuật của rừng nhé!",
          "difficulty": "easy",
          "fallback_action": "raise_hands"
        }
      ],
      "adapt_responses": {
        "pass": {
          "tts_text": "Tuyệt vời! Phép thuật của bạn đã mở cây cầu rồi! Chúng ta tiến vào rừng thôi!",
          "display_text": "Cây cầu mở rồi! 🌉"
        },
        "retry": {
          "tts_text": "Gần được rồi! Thêm một lần nữa là cây cầu sẽ mở thôi!",
          "display_text": "Thử lại nào! 💪"
        },
        "fail": {
          "tts_text": "Không sao! Lio có một phép thuật dễ hơn cho bạn thử nhé!",
          "display_text": "Lio đổi phép thuật cho bạn! ✨"
        }
      }
    },
    {
      "segment_index": 1,
      "narrative_text": "Đi sâu vào rừng, {child_name} và Lio gặp một chú thỏ nhỏ bị mắc kẹt trong bụi gai. Chú thỏ run rẩy và sợ hãi. Để giải cứu chú thỏ, cần phải làm một vũ điệu phép thuật đặc biệt!",
      "narration_tts": "Đi sâu vào rừng, hai người bạn gặp một chú thỏ nhỏ bị mắc kẹt trong bụi gai. Chú thỏ run rẩy và sợ hãi. Để giải cứu chú thỏ, cần phải làm một vũ điệu phép thuật đặc biệt!",
      "challenge_options": [
        {
          "action": "spin",
          "display_text": "Xoay tròn một vòng để giải cứu thỏ!",
          "tts_text": "Hãy xoay tròn một vòng thật đẹp để vũ điệu phép thuật giải cứu chú thỏ nhé!",
          "difficulty": "normal",
          "fallback_action": "raise_hands"
        },
        {
          "action": "raise_hands",
          "display_text": "Giơ tay lên và vẫy vẫy để gọi phép thuật!",
          "tts_text": "Giơ hai tay lên và vẫy thật mạnh để gọi phép thuật giải cứu thỏ nhé!",
          "difficulty": "easy",
          "fallback_action": "raise_hands"
        }
      ],
      "adapt_responses": {
        "pass": {
          "tts_text": "Ồ tuyệt quá! Vũ điệu của bạn đã giải cứu chú thỏ rồi! Thỏ cảm ơn bạn rất nhiều!",
          "display_text": "Thỏ được giải cứu! 🐰"
        },
        "retry": {
          "tts_text": "Chú thỏ thấy bạn rồi! Thêm một lần nữa nhé!",
          "display_text": "Thêm một lần nữa! 🐰"
        },
        "fail": {
          "tts_text": "Không sao! Lio sẽ chỉ cho bạn một cách khác để giải cứu thỏ!",
          "display_text": "Thử cách khác nhé! ✨"
        }
      }
    },
    {
      "segment_index": 2,
      "narrative_text": "Chú thỏ dẫn {child_name} và Lio đến một khoảng trống lung linh giữa rừng — đó là Vương Quốc Phép Thuật! Nhưng cánh cổng vàng chỉ mở ra khi người dũng cảm thực hiện nghi lễ chào mừng của rừng xanh!",
      "narration_tts": "Chú thỏ dẫn hai người bạn đến một khoảng trống lung linh giữa rừng — đó là Vương Quốc Phép Thuật! Nhưng cánh cổng vàng chỉ mở ra khi người dũng cảm thực hiện nghi lễ chào mừng của rừng xanh!",
      "challenge_options": [
        {
          "action": "jump",
          "display_text": "Nhảy lên và giơ tay — nghi lễ chào Vương Quốc!",
          "tts_text": "Hãy nhảy lên thật cao và giơ tay để thực hiện nghi lễ chào mừng Vương Quốc Phép Thuật nhé!",
          "difficulty": "normal",
          "fallback_action": "raise_hands"
        },
        {
          "action": "raise_hands",
          "display_text": "Giơ cả hai tay lên thật cao — chào Vương Quốc!",
          "tts_text": "Giơ cả hai tay lên thật cao để chào đón Vương Quốc Phép Thuật nhé!",
          "difficulty": "easy",
          "fallback_action": "raise_hands"
        }
      ],
      "adapt_responses": {
        "pass": {
          "tts_text": "Chúc mừng! Bạn đã hoàn thành hành trình và trở thành Anh Hùng của Khu Rừng Phép Thuật! Lio rất tự hào về bạn!",
          "display_text": "Bạn là Anh Hùng Rừng Xanh! 🏆"
        },
        "retry": {
          "tts_text": "Cổng đang hé mở rồi đó! Thêm một lần nữa thôi!",
          "display_text": "Gần rồi! Cố lên! 🌟"
        },
        "fail": {
          "tts_text": "Không sao! Lio tin bạn làm được cách này!",
          "display_text": "Thử cách đơn giản hơn nhé! ✨"
        }
      }
    }
  ],
  "badge_map": {
    "0": { "id": "brave_start",   "label": "Dũng Cảm Bắt Đầu",     "emoji": "🌟" },
    "1": { "id": "forest_hero",   "label": "Người Giải Cứu Rừng",   "emoji": "🐰" },
    "2": { "id": "magic_master",  "label": "Anh Hùng Phép Thuật",   "emoji": "🏆" }
  }
}
```

---

## Validation Rules (backend must enforce)

1. `total_segments` must equal `len(segments)`
2. Each `segment_index` must be unique and sequential (0, 1, 2)
3. Each `challenge_options` must have at least one option with `difficulty: "easy"`
4. All `action` values must be one of: `jump`, `raise_hands`, `spin`
5. All `fallback_action` values must be `raise_hands`
6. `adapt_responses` must contain all three keys: `pass`, `retry`, `fail`
7. `badge_map` must have keys `"0"`, `"1"`, `"2"`