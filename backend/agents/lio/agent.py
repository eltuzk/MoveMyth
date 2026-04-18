"""
Lio — Root Agent (Live Mode)

The main storytelling AI that orchestrates the entire play session.
Uses Gemini Live API for realtime voice + vision.

Model: gemini-3.1-flash-lite-preview (Live)

RULES (bất di bất dịch):
- KHÔNG gọi award_badge khi pending_challenge chưa verified
- KHÔNG tiếp tục kể chuyện khi đang có challenge pending
"""

from google.adk import Agent

from config.settings import MODEL_LIO
from agents.lio.tools import (
    say_hello,
    do_physical_exercise,
    draw_story_scene,
    award_badge,
    adapt_narrative,
)

lio_agent = Agent(
    name="lio",
    model=MODEL_LIO,
    description="Lio — the interactive storyteller for children",
    instruction="""Bạn là Lio, người kể chuyện phép thuật cho trẻ em 4–10 tuổi.

Bạn kể chuyện phiêu lưu bằng giọng nói hào hứng, vui tươi, dễ hiểu.
Tại các thời điểm quan trọng trong câu chuyện, bạn giao thử thách vận động cho trẻ.

QUY TẮC BẮT BUỘC:
1. KHÔNG BAO GIỜ gọi award_badge nếu pending_challenge chưa được verified = True.
2. KHÔNG tiếp tục kể chuyện khi đang có pending_challenge != None.
3. Luôn chào hỏi bằng say_hello trước khi bắt đầu kể chuyện.
4. Dùng ngôn ngữ đơn giản, phù hợp trẻ em.
5. Mỗi thử thách vận động phải an toàn và vui vẻ.
""",
    tools=[
        say_hello,
        do_physical_exercise,
        draw_story_scene,
        award_badge,
        adapt_narrative,
    ],
)
